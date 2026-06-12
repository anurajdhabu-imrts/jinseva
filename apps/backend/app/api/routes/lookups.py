from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_principal, require_permissions
from app.core.database import get_db
from app.models.lookup import Lookup
from app.schemas.lookup import LookupCreate, LookupUpdate

router = APIRouter(prefix="/lookups", tags=["lookups"])

can_manage = require_permissions("settings.update")

# Categories surfaced in the Settings → Dropdown Options screen, with their
# human label and the default options seeded on first run.
CATEGORIES: dict[str, dict] = {
    "event_type": {
        "label": "Event Type",
        "defaults": ["Festival", "Pooja", "Discourse", "Seva", "Wedding", "Community"],
    },
    "property": {
        "label": "Property / Place",
        "defaults": ["Jain Mandir", "Gunfa", "Hall", "Commercial Properties"],
    },
    "donation_purpose": {
        "label": "Donation Purpose",
        "defaults": [
            "Gyan Daan (Knowledge)",
            "Aushadh Daan (Medicine)",
            "Abhay Daan (Fearlessness)",
            "Anukampa Daan (Compassion)",
            "Sadharmik Bhakti",
            "Derasar Renovation",
            "Snatra Pooja Sponsorship",
            "Bhojanshala (Food Hall)",
            "Jeev Daya (Animal Welfare)",
            "Anonymous Daan",
        ],
    },
    "payment_method": {
        "label": "Payment Method",
        "defaults": ["UPI", "Card", "Cash", "Bank Transfer", "Cheque"],
    },
    "income_category": {
        "label": "Income Category",
        "defaults": [
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
        ],
    },
}


def seed_lookups(db: Session) -> None:
    """Idempotently populate default options for any category that has none."""
    for category, meta in CATEGORIES.items():
        existing = db.scalar(select(Lookup).where(Lookup.category == category))
        if existing is not None:
            continue
        for i, label in enumerate(meta["defaults"]):
            db.add(Lookup(category=category, label=label, sort_order=i, active=True))
    db.commit()


def _get_or_404(db: Session, lookup_id: int) -> Lookup:
    row = db.get(Lookup, lookup_id)
    if row is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Option not found")
    return row


@router.get("/categories", dependencies=[Depends(get_current_principal)])
def list_categories():
    """The set of manageable dropdowns (key + display label)."""
    return {
        "success": True,
        "data": [{"key": k, "label": v["label"]} for k, v in CATEGORIES.items()],
    }


@router.get("", dependencies=[Depends(get_current_principal)])
def list_lookups(
    category: str | None = Query(default=None),
    include_inactive: bool = Query(default=False),
    db: Session = Depends(get_db),
):
    """List options. Without `category`, returns every option grouped by category."""
    stmt = select(Lookup).order_by(Lookup.category, Lookup.sort_order, Lookup.id)
    if category:
        stmt = stmt.where(Lookup.category == category)
    if not include_inactive:
        stmt = stmt.where(Lookup.active.is_(True))
    rows = db.scalars(stmt).all()

    grouped: dict[str, list] = {k: [] for k in CATEGORIES}
    for r in rows:
        grouped.setdefault(r.category, []).append(r.to_dict())
    return {"success": True, "data": grouped}


@router.post("", status_code=status.HTTP_201_CREATED, dependencies=[Depends(can_manage)])
def create_lookup(body: LookupCreate, db: Session = Depends(get_db)):
    label = body.label.strip()
    if not label:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, "Label is required")
    dup = db.scalar(
        select(Lookup).where(Lookup.category == body.category, Lookup.label == label)
    )
    if dup is not None:
        raise HTTPException(status.HTTP_409_CONFLICT, "That option already exists")
    row = Lookup(category=body.category, label=label, sort_order=body.sortOrder, active=True)
    db.add(row)
    db.commit()
    db.refresh(row)
    return {"success": True, "data": row.to_dict()}


@router.patch("/{lookup_id}", dependencies=[Depends(can_manage)])
def update_lookup(lookup_id: int, body: LookupUpdate, db: Session = Depends(get_db)):
    row = _get_or_404(db, lookup_id)
    if body.label is not None:
        label = body.label.strip()
        if not label:
            raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, "Label is required")
        row.label = label
    if body.sortOrder is not None:
        row.sort_order = body.sortOrder
    if body.active is not None:
        row.active = body.active
    db.commit()
    db.refresh(row)
    return {"success": True, "data": row.to_dict()}


@router.delete("/{lookup_id}", dependencies=[Depends(can_manage)])
def delete_lookup(lookup_id: int, db: Session = Depends(get_db)):
    row = _get_or_404(db, lookup_id)
    db.delete(row)
    db.commit()
    return {"success": True, "message": "Option deleted"}
