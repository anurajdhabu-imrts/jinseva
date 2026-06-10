from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, literal_column, or_, select
from sqlalchemy.orm import Session

from app.api.deps import require_permissions
from app.core.database import get_db
from app.models.income import Income
from app.schemas.income import IncomeCreate, IncomeUpdate
from app.services.codes import generate_code

router = APIRouter(prefix="/income", tags=["income"])

can_view = require_permissions("income.view")
can_create = require_permissions("income.create")
can_update = require_permissions("income.update")
can_delete = require_permissions("income.delete")

# The canonical income categories (mirrors INCOME_CATEGORIES in the frontend).
INCOME_CATEGORIES = [
    "Hall Rental",
    "Bhojanshala Income",
    "Dharmashala (Guest Rooms)",
    "Sahitya Bhandar (Books)",
    "Panjarapole (Goshala)",
    "Parking Fees",
    "FD / Bank Interest",
    "Donation Box (Bhandar)",
    "Government Grant",
    "Other",
]


def _get_or_404(db: Session, code: str) -> Income:
    income = db.scalar(select(Income).where(Income.code == code))
    if income is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Income record not found")
    return income


# ── Categories (before /{code}) ──
@router.get("/categories", dependencies=[Depends(can_view)])
def income_categories(db: Session = Depends(get_db)):
    rows = db.execute(
        select(Income.category, func.coalesce(func.sum(Income.amount), 0), func.count())
        .group_by(Income.category)
    ).all()
    used = {cat: {"total": int(total), "count": count} for cat, total, count in rows}
    data = [
        {"name": c, "total": used.get(c, {}).get("total", 0), "count": used.get(c, {}).get("count", 0)}
        for c in INCOME_CATEGORIES
    ]
    return {"success": True, "data": data}


# ── Analytics (before /{code}) ──
@router.get("/analytics", dependencies=[Depends(require_permissions("income.view", "reports.view"))])
def income_analytics(db: Session = Depends(get_db)):
    total = db.scalar(select(func.coalesce(func.sum(Income.amount), 0))) or 0
    count = db.scalar(select(func.count()).select_from(Income)) or 0

    by_category = db.execute(
        select(Income.category, func.coalesce(func.sum(Income.amount), 0), func.count())
        .group_by(Income.category)
        .order_by(func.sum(Income.amount).desc())
    ).all()
    by_method = db.execute(
        select(Income.method, func.coalesce(func.sum(Income.amount), 0))
        .group_by(Income.method)
    ).all()
    month = func.to_char(Income.income_date, literal_column("'YYYY-MM'"))
    monthly = db.execute(
        select(month, func.coalesce(func.sum(Income.amount), 0))
        .where(Income.income_date.is_not(None))
        .group_by(month)
        .order_by(month)
    ).all()

    return {
        "success": True,
        "data": {
            "totalAmount": int(total),
            "count": int(count),
            "byCategory": [{"name": c, "value": int(t), "count": n} for c, t, n in by_category],
            "byMethod": [{"name": m, "value": int(t)} for m, t in by_method],
            "monthly": [{"month": m, "total": int(t)} for m, t in monthly],
        },
    }


# ── List ──
@router.get("", dependencies=[Depends(can_view)])
def list_income(
    q: str | None = None,
    category: str | None = None,
    status_filter: str | None = Query(default=None, alias="status"),
    db: Session = Depends(get_db),
):
    stmt = select(Income).order_by(Income.income_date.desc().nullslast(), Income.id.desc())
    if category:
        stmt = stmt.where(Income.category == category)
    if status_filter:
        stmt = stmt.where(Income.status == status_filter)
    if q:
        like = f"%{q}%"
        stmt = stmt.where(
            or_(Income.description.ilike(like), Income.source.ilike(like), Income.code.ilike(like))
        )

    records = db.scalars(stmt).all()
    data = [r.to_dict() for r in records]
    return {"success": True, "count": len(data), "data": data}


@router.get("/{code}", dependencies=[Depends(can_view)])
def get_income(code: str, db: Session = Depends(get_db)):
    return {"success": True, "data": _get_or_404(db, code).to_dict()}


@router.post("", status_code=status.HTTP_201_CREATED, dependencies=[Depends(can_create)])
def create_income(body: IncomeCreate, db: Session = Depends(get_db)):
    income = Income(
        code=generate_code(db, Income, Income.code, "INC-", pad=4, start=1001),
        category=body.category,
        property=body.property,
        description=body.description,
        source=body.source,
        amount=body.amount,
        method=body.method,
        income_date=body.date,
        status=body.status,
        receipt=body.receipt,
        notes=body.notes,
    )
    db.add(income)
    db.commit()
    db.refresh(income)
    return {"success": True, "data": income.to_dict()}


@router.put("/{code}", dependencies=[Depends(can_update)])
def update_income(code: str, body: IncomeUpdate, db: Session = Depends(get_db)):
    income = _get_or_404(db, code)
    data = body.model_dump(exclude_unset=True)
    if "date" in data:
        income.income_date = data.pop("date")
    for field, value in data.items():
        setattr(income, field, value)
    db.commit()
    db.refresh(income)
    return {"success": True, "data": income.to_dict()}


@router.delete("/{code}", dependencies=[Depends(can_delete)])
def delete_income(code: str, db: Session = Depends(get_db)):
    income = _get_or_404(db, code)
    db.delete(income)
    db.commit()
    return {"success": True, "message": "Income record deleted"}
