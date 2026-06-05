from datetime import date as date_type

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.api.deps import require_permissions
from app.core.database import get_db
from app.models.inventory import InventoryItem, Supplier
from app.schemas.inventory import (
    InventoryCreate,
    InventoryUpdate,
    RestockRequest,
    SupplierCreate,
    SupplierUpdate,
)
from app.services.codes import generate_code

router = APIRouter(prefix="/inventory", tags=["inventory"])

can_view = require_permissions("inventory.view")
can_create = require_permissions("inventory.create")
can_update = require_permissions("inventory.update")
can_delete = require_permissions("inventory.delete")


def _get_or_create_supplier(db: Session, name: str) -> Supplier | None:
    name = (name or "").strip()
    if not name:
        return None
    sup = db.scalar(select(Supplier).where(func.lower(Supplier.name) == name.lower()))
    if sup is None:
        sup = Supplier(
            code=generate_code(db, Supplier, Supplier.code, "SUP-", pad=3, start=1),
            name=name,
        )
        db.add(sup)
        db.flush()
    return sup


def _get_item_or_404(db: Session, code: str) -> InventoryItem:
    item = db.scalar(select(InventoryItem).where(InventoryItem.code == code))
    if item is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Inventory item not found")
    return item


def _get_supplier_or_404(db: Session, code: str) -> Supplier:
    sup = db.scalar(select(Supplier).where(Supplier.code == code))
    if sup is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Supplier not found")
    return sup


# ── Suppliers (declared before /{code}) ──
@router.get("/suppliers", dependencies=[Depends(can_view)])
def list_suppliers(db: Session = Depends(get_db)):
    suppliers = db.scalars(select(Supplier).order_by(Supplier.name)).all()
    counts = dict(
        db.execute(
            select(InventoryItem.supplier_id, func.count())
            .where(InventoryItem.supplier_id.is_not(None))
            .group_by(InventoryItem.supplier_id)
        ).all()
    )
    data = [s.to_dict(item_count=counts.get(s.id, 0)) for s in suppliers]
    return {"success": True, "count": len(data), "data": data}


@router.post("/suppliers", status_code=status.HTTP_201_CREATED, dependencies=[Depends(can_create)])
def create_supplier(body: SupplierCreate, db: Session = Depends(get_db)):
    if db.scalar(select(Supplier).where(func.lower(Supplier.name) == body.name.lower())):
        raise HTTPException(status.HTTP_409_CONFLICT, "A supplier with that name already exists")
    sup = Supplier(
        code=generate_code(db, Supplier, Supplier.code, "SUP-", pad=3, start=1),
        name=body.name.strip(),
        category=body.category,
        phone=body.phone,
        email=body.email,
        rating=body.rating,
        status=body.status,
        orders=body.orders,
    )
    db.add(sup)
    db.commit()
    db.refresh(sup)
    return {"success": True, "data": sup.to_dict(item_count=0)}


@router.put("/suppliers/{code}", dependencies=[Depends(can_update)])
def update_supplier(code: str, body: SupplierUpdate, db: Session = Depends(get_db)):
    sup = _get_supplier_or_404(db, code)
    data = body.model_dump(exclude_unset=True)
    for field, value in data.items():
        setattr(sup, field, value)
    db.commit()
    db.refresh(sup)
    return {"success": True, "data": sup.to_dict()}


@router.delete("/suppliers/{code}", dependencies=[Depends(can_delete)])
def delete_supplier(code: str, db: Session = Depends(get_db)):
    sup = _get_supplier_or_404(db, code)
    # Items keep existing but are unlinked (supplier_id -> NULL via ORM).
    for item in list(sup.items):
        item.supplier_id = None
    db.delete(sup)
    db.commit()
    return {"success": True, "message": "Supplier deleted"}


# ── Analytics ──
@router.get("/analytics", dependencies=[Depends(require_permissions("inventory.view", "reports.view"))])
def inventory_analytics(db: Session = Depends(get_db)):
    items = db.scalars(select(InventoryItem)).all()
    total_value = sum(int(i.quantity * i.cost_per_unit) for i in items)
    low_stock = [i.to_dict() for i in items if i.quantity <= i.min_stock]
    by_category: dict[str, int] = {}
    for i in items:
        by_category[i.category] = by_category.get(i.category, 0) + 1
    return {
        "success": True,
        "data": {
            "totalItems": len(items),
            "totalValue": total_value,
            "lowStockCount": len(low_stock),
            "lowStock": low_stock,
            "byCategory": [{"name": k, "count": v} for k, v in sorted(by_category.items())],
        },
    }


# ── Inventory items CRUD ──
@router.get("", dependencies=[Depends(can_view)])
def list_items(
    q: str | None = None,
    category: str | None = None,
    low: bool | None = Query(default=None),
    db: Session = Depends(get_db),
):
    stmt = select(InventoryItem).order_by(InventoryItem.item)
    if category:
        stmt = stmt.where(InventoryItem.category == category)
    if q:
        like = f"%{q}%"
        stmt = stmt.where(or_(InventoryItem.item.ilike(like), InventoryItem.code.ilike(like)))
    items = db.scalars(stmt).all()
    if low:
        items = [i for i in items if i.quantity <= i.min_stock]
    data = [i.to_dict() for i in items]
    return {"success": True, "count": len(data), "data": data}


@router.get("/{code}", dependencies=[Depends(can_view)])
def get_item(code: str, db: Session = Depends(get_db)):
    return {"success": True, "data": _get_item_or_404(db, code).to_dict()}


@router.post("", status_code=status.HTTP_201_CREATED, dependencies=[Depends(can_create)])
def create_item(body: InventoryCreate, db: Session = Depends(get_db)):
    supplier = _get_or_create_supplier(db, body.supplier)
    item = InventoryItem(
        code=generate_code(db, InventoryItem, InventoryItem.code, "INV-", pad=3, start=301),
        item=body.item,
        category=body.category,
        quantity=body.quantity,
        unit=body.unit,
        min_stock=body.minStock,
        supplier_id=supplier.id if supplier else None,
        cost_per_unit=body.costPerUnit,
        last_restock=body.lastRestock,
        notes=body.notes,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return {"success": True, "data": item.to_dict()}


@router.put("/{code}", dependencies=[Depends(can_update)])
def update_item(code: str, body: InventoryUpdate, db: Session = Depends(get_db)):
    item = _get_item_or_404(db, code)
    data = body.model_dump(exclude_unset=True)
    if "supplier" in data:
        supplier = _get_or_create_supplier(db, data.pop("supplier"))
        item.supplier_id = supplier.id if supplier else None
    if "minStock" in data:
        item.min_stock = data.pop("minStock")
    if "costPerUnit" in data:
        item.cost_per_unit = data.pop("costPerUnit")
    if "lastRestock" in data:
        item.last_restock = data.pop("lastRestock")
    for field, value in data.items():
        setattr(item, field, value)
    db.commit()
    db.refresh(item)
    return {"success": True, "data": item.to_dict()}


@router.post("/{code}/restock", dependencies=[Depends(can_update)])
def restock_item(code: str, body: RestockRequest, db: Session = Depends(get_db)):
    item = _get_item_or_404(db, code)
    item.quantity += body.quantity
    item.last_restock = body.date or date_type.today()
    db.commit()
    db.refresh(item)
    return {"success": True, "data": item.to_dict()}


@router.delete("/{code}", dependencies=[Depends(can_delete)])
def delete_item(code: str, db: Session = Depends(get_db)):
    item = _get_item_or_404(db, code)
    db.delete(item)
    db.commit()
    return {"success": True, "message": "Inventory item deleted"}
