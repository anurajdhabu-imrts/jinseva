from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.api.deps import require_permissions
from app.core.database import get_db
from app.models.booking import Booking
from app.schemas.booking import BookingCreate, BookingUpdate
from app.services.codes import generate_code

router = APIRouter(prefix="/bookings", tags=["bookings"])

can_view = require_permissions("bookings.view")
can_create = require_permissions("bookings.create")
can_update = require_permissions("bookings.update")
can_delete = require_permissions("bookings.delete")


def _get_or_404(db: Session, code: str) -> Booking:
    bk = db.scalar(select(Booking).where(Booking.code == code))
    if bk is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Booking not found")
    return bk


# ── Analytics (before /{code}) ──
@router.get("/analytics", dependencies=[Depends(require_permissions("bookings.view", "reports.view"))])
def booking_analytics(db: Session = Depends(get_db)):
    total = db.scalar(select(func.coalesce(func.sum(Booking.amount), 0))) or 0
    count = db.scalar(select(func.count()).select_from(Booking)) or 0
    by_status = db.execute(
        select(Booking.status, func.count()).group_by(Booking.status)
    ).all()
    by_type = db.execute(
        select(Booking.booking_type, func.count(), func.coalesce(func.sum(Booking.amount), 0))
        .group_by(Booking.booking_type)
    ).all()
    return {
        "success": True,
        "data": {
            "totalAmount": int(total),
            "count": int(count),
            "byStatus": [{"name": s, "count": c} for s, c in by_status],
            "byType": [{"name": t, "count": c, "value": int(v)} for t, c, v in by_type],
        },
    }


# ── CRUD ──
@router.get("", dependencies=[Depends(can_view)])
def list_bookings(
    q: str | None = None,
    type_filter: str | None = Query(default=None, alias="type"),
    status_filter: str | None = Query(default=None, alias="status"),
    date: str | None = None,
    db: Session = Depends(get_db),
):
    stmt = select(Booking).order_by(Booking.booking_date.desc().nullslast(), Booking.id.desc())
    if type_filter:
        stmt = stmt.where(Booking.booking_type == type_filter)
    if status_filter:
        stmt = stmt.where(Booking.status == status_filter)
    if date:
        stmt = stmt.where(Booking.booking_date == date)
    if q:
        like = f"%{q}%"
        stmt = stmt.where(
            or_(Booking.devotee.ilike(like), Booking.pooja.ilike(like), Booking.code.ilike(like))
        )
    bookings = db.scalars(stmt).all()
    data = [b.to_dict() for b in bookings]
    return {"success": True, "count": len(data), "data": data}


@router.get("/{code}", dependencies=[Depends(can_view)])
def get_booking(code: str, db: Session = Depends(get_db)):
    return {"success": True, "data": _get_or_404(db, code).to_dict()}


@router.post("", status_code=status.HTTP_201_CREATED, dependencies=[Depends(can_create)])
def create_booking(body: BookingCreate, db: Session = Depends(get_db)):
    booking = Booking(
        code=generate_code(db, Booking, Booking.code, "BK-", pad=3, start=501),
        devotee=body.devotee,
        email=body.email,
        phone=body.phone,
        booking_type=body.bookingType,
        pooja=body.pooja,
        hall=body.hall,
        booking_date=body.date,
        time=body.time,
        priest=body.priest,
        amount=body.amount,
        status=body.status,
        notes=body.notes,
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return {"success": True, "data": booking.to_dict()}


@router.put("/{code}", dependencies=[Depends(can_update)])
def update_booking(code: str, body: BookingUpdate, db: Session = Depends(get_db)):
    booking = _get_or_404(db, code)
    data = body.model_dump(exclude_unset=True)
    field_map = {
        "devotee": "devotee", "email": "email", "phone": "phone",
        "bookingType": "booking_type", "pooja": "pooja", "hall": "hall",
        "time": "time", "priest": "priest", "amount": "amount",
        "status": "status", "notes": "notes",
    }
    for k, attr in field_map.items():
        if k in data:
            setattr(booking, attr, data[k])
    if "date" in data:
        booking.booking_date = data["date"]
    db.commit()
    db.refresh(booking)
    return {"success": True, "data": booking.to_dict()}


@router.delete("/{code}", dependencies=[Depends(can_delete)])
def delete_booking(code: str, db: Session = Depends(get_db)):
    booking = _get_or_404(db, code)
    db.delete(booking)
    db.commit()
    return {"success": True, "message": "Booking deleted"}
