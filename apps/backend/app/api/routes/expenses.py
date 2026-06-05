from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, literal_column, or_, select
from sqlalchemy.orm import Session

from app.api.deps import require_permissions
from app.core.database import get_db
from app.models.expense import Expense, ExpenseCategory
from app.schemas.expense import (
    ExpenseCategoryCreate,
    ExpenseCategoryUpdate,
    ExpenseCreate,
    ExpenseUpdate,
)
from app.services.codes import generate_code

router = APIRouter(prefix="/expenses", tags=["expenses"])

can_view = require_permissions("expenses.view")
can_create = require_permissions("expenses.create")
can_update = require_permissions("expenses.update")
can_delete = require_permissions("expenses.delete")


def _get_or_create_category(db: Session, name: str) -> ExpenseCategory:
    cat = db.scalar(select(ExpenseCategory).where(func.lower(ExpenseCategory.name) == name.lower()))
    if cat is None:
        cat = ExpenseCategory(name=name.strip())
        db.add(cat)
        db.flush()
    return cat


def _get_expense_or_404(db: Session, code: str) -> Expense:
    exp = db.scalar(select(Expense).where(Expense.code == code))
    if exp is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Expense not found")
    return exp


# ── Categories (declared before /{code}) ──
@router.get("/categories", dependencies=[Depends(can_view)])
def list_categories(db: Session = Depends(get_db)):
    cats = db.scalars(select(ExpenseCategory).order_by(ExpenseCategory.name)).all()
    rows = db.execute(
        select(Expense.category_id, func.count(), func.coalesce(func.sum(Expense.amount), 0))
        .group_by(Expense.category_id)
    ).all()
    stats = {cid: (cnt, total) for cid, cnt, total in rows}
    data = []
    for c in cats:
        cnt, total = stats.get(c.id, (0, 0))
        data.append(c.to_dict(count=cnt, total=total))
    return {"success": True, "count": len(data), "data": data}


@router.post("/categories", status_code=status.HTTP_201_CREATED, dependencies=[Depends(can_update)])
def create_category(body: ExpenseCategoryCreate, db: Session = Depends(get_db)):
    if db.scalar(select(ExpenseCategory).where(func.lower(ExpenseCategory.name) == body.name.lower())):
        raise HTTPException(status.HTTP_409_CONFLICT, "A category with that name already exists")
    cat = ExpenseCategory(
        name=body.name.strip(),
        description=body.description,
        color=body.color or "#c8102e",
        monthly_budget=body.monthlyBudget,
    )
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return {"success": True, "data": cat.to_dict(count=0, total=0)}


@router.put("/categories/{cat_id}", dependencies=[Depends(can_update)])
def update_category(cat_id: int, body: ExpenseCategoryUpdate, db: Session = Depends(get_db)):
    cat = db.get(ExpenseCategory, cat_id)
    if cat is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Category not found")
    if body.name is not None:
        cat.name = body.name.strip()
    if body.description is not None:
        cat.description = body.description
    if body.color is not None:
        cat.color = body.color
    if body.monthlyBudget is not None:
        cat.monthly_budget = body.monthlyBudget
    db.commit()
    db.refresh(cat)
    return {"success": True, "data": cat.to_dict()}


@router.delete("/categories/{cat_id}", dependencies=[Depends(can_delete)])
def delete_category(cat_id: int, db: Session = Depends(get_db)):
    cat = db.get(ExpenseCategory, cat_id)
    if cat is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Category not found")
    in_use = db.scalar(select(func.count()).select_from(Expense).where(Expense.category_id == cat_id))
    if in_use:
        raise HTTPException(
            status.HTTP_409_CONFLICT,
            f"Cannot delete: {in_use} expense(s) use this category",
        )
    db.delete(cat)
    db.commit()
    return {"success": True, "message": "Category deleted"}


# ── Analytics ──
@router.get("/analytics", dependencies=[Depends(require_permissions("expenses.view", "reports.view"))])
def expense_analytics(db: Session = Depends(get_db)):
    total = db.scalar(select(func.coalesce(func.sum(Expense.amount), 0))) or 0
    count = db.scalar(select(func.count()).select_from(Expense)) or 0

    by_category = db.execute(
        select(ExpenseCategory.name, func.coalesce(func.sum(Expense.amount), 0), func.count())
        .join(Expense, Expense.category_id == ExpenseCategory.id)
        .group_by(ExpenseCategory.name)
        .order_by(func.sum(Expense.amount).desc())
    ).all()
    by_method = db.execute(
        select(Expense.method, func.coalesce(func.sum(Expense.amount), 0)).group_by(Expense.method)
    ).all()
    month = func.to_char(Expense.expense_date, literal_column("'YYYY-MM'"))
    monthly = db.execute(
        select(month, func.coalesce(func.sum(Expense.amount), 0))
        .where(Expense.expense_date.is_not(None))
        .group_by(month).order_by(month)
    ).all()

    return {
        "success": True,
        "data": {
            "totalAmount": int(total),
            "count": int(count),
            "byCategory": [{"name": n, "value": int(t), "count": c} for n, t, c in by_category],
            "byMethod": [{"name": m, "value": int(t)} for m, t in by_method],
            "monthly": [{"month": m, "total": int(t)} for m, t in monthly],
        },
    }


# ── Expenses CRUD ──
@router.get("", dependencies=[Depends(can_view)])
def list_expenses(
    q: str | None = None,
    category: str | None = None,
    status_filter: str | None = Query(default=None, alias="status"),
    method: str | None = None,
    db: Session = Depends(get_db),
):
    stmt = (
        select(Expense)
        .join(ExpenseCategory, Expense.category_id == ExpenseCategory.id)
        .order_by(Expense.expense_date.desc().nullslast(), Expense.id.desc())
    )
    if category:
        stmt = stmt.where(ExpenseCategory.name == category)
    if status_filter:
        stmt = stmt.where(Expense.status == status_filter)
    if method:
        stmt = stmt.where(Expense.method == method)
    if q:
        like = f"%{q}%"
        stmt = stmt.where(or_(Expense.description.ilike(like), Expense.vendor.ilike(like), Expense.code.ilike(like)))

    expenses = db.scalars(stmt).all()
    data = [e.to_dict() for e in expenses]
    return {"success": True, "count": len(data), "data": data}


@router.get("/{code}", dependencies=[Depends(can_view)])
def get_expense(code: str, db: Session = Depends(get_db)):
    return {"success": True, "data": _get_expense_or_404(db, code).to_dict()}


@router.post("", status_code=status.HTTP_201_CREATED, dependencies=[Depends(can_create)])
def create_expense(body: ExpenseCreate, db: Session = Depends(get_db)):
    category = _get_or_create_category(db, body.category)
    expense = Expense(
        code=generate_code(db, Expense, Expense.code, "EXP-", pad=4, start=1101),
        category_id=category.id,
        description=body.description,
        vendor=body.vendor,
        amount=body.amount,
        method=body.method,
        expense_date=body.date,
        status=body.status,
        bill=body.bill,
        notes=body.notes,
    )
    db.add(expense)
    db.commit()
    db.refresh(expense)
    return {"success": True, "data": expense.to_dict()}


@router.put("/{code}", dependencies=[Depends(can_update)])
def update_expense(code: str, body: ExpenseUpdate, db: Session = Depends(get_db)):
    expense = _get_expense_or_404(db, code)
    data = body.model_dump(exclude_unset=True)
    if "category" in data and data["category"]:
        expense.category_id = _get_or_create_category(db, data.pop("category")).id
    else:
        data.pop("category", None)
    if "date" in data:
        expense.expense_date = data.pop("date")
    for field, value in data.items():
        setattr(expense, field, value)
    db.commit()
    db.refresh(expense)
    return {"success": True, "data": expense.to_dict()}


@router.delete("/{code}", dependencies=[Depends(can_delete)])
def delete_expense(code: str, db: Session = Depends(get_db)):
    expense = _get_expense_or_404(db, code)
    db.delete(expense)
    db.commit()
    return {"success": True, "message": "Expense deleted"}
