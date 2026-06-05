from fastapi import APIRouter, Depends
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.api.deps import Principal, get_current_principal
from app.core.database import get_db
from app.core.security import hash_password
from app.models.booking import Booking
from app.models.communication import Notification
from app.models.donation import Donation
from app.schemas.communication import ProfileUpdate
from app.services.rbac import hydrate_user

router = APIRouter(prefix="/me", tags=["devotee-portal"])


def _donations_for(db: Session, principal: Principal):
    user = principal.user
    return db.scalars(
        select(Donation)
        .where(or_(func.lower(Donation.email) == user.email.lower(), Donation.donor == user.name))
        .order_by(Donation.donation_date.desc().nullslast(), Donation.id.desc())
    ).all()


def _bookings_for(db: Session, principal: Principal):
    user = principal.user
    return db.scalars(
        select(Booking)
        .where(or_(func.lower(Booking.email) == user.email.lower(), Booking.devotee == user.name))
        .order_by(Booking.booking_date.desc().nullslast(), Booking.id.desc())
    ).all()


@router.get("/summary")
def summary(
    principal: Principal = Depends(get_current_principal),
    db: Session = Depends(get_db),
):
    donations = _donations_for(db, principal)
    bookings = _bookings_for(db, principal)
    lifetime = sum(d.amount for d in donations)
    this_year_prefix = (donations[0].donation_date.isoformat()[:4] if donations and donations[0].donation_date else "")
    return {
        "success": True,
        "data": {
            "user": hydrate_user(db, principal.user),
            "lifetimeDonations": lifetime,
            "donationCount": len(donations),
            "bookingCount": len(bookings),
            "recentDonations": [d.to_dict() for d in donations[:5]],
            "recentBookings": [b.to_dict() for b in bookings[:5]],
            "memberSince": principal.user.created_at.isoformat() if principal.user.created_at else None,
            "thisYear": this_year_prefix,
        },
    }


@router.get("/donations")
def my_donations(
    principal: Principal = Depends(get_current_principal),
    db: Session = Depends(get_db),
):
    rows = _donations_for(db, principal)
    data = [d.to_dict() for d in rows]
    return {"success": True, "count": len(data), "total": sum(d.amount for d in rows), "data": data}


@router.get("/bookings")
def my_bookings(
    principal: Principal = Depends(get_current_principal),
    db: Session = Depends(get_db),
):
    rows = _bookings_for(db, principal)
    data = [b.to_dict() for b in rows]
    return {"success": True, "count": len(data), "data": data}


@router.get("/notifications")
def my_notifications(
    principal: Principal = Depends(get_current_principal),
    db: Session = Depends(get_db),
):
    rows = db.scalars(select(Notification).order_by(Notification.created_at.desc())).all()
    data = [n.to_dict() for n in rows]
    return {"success": True, "count": len(data), "unread": sum(1 for n in rows if not n.read), "data": data}


@router.put("/profile")
def update_profile(
    body: ProfileUpdate,
    principal: Principal = Depends(get_current_principal),
    db: Session = Depends(get_db),
):
    user = principal.user
    if body.name is not None:
        user.name = body.name
    if body.avatar is not None:
        user.avatar = body.avatar
    if body.password:
        user.password_hash = hash_password(body.password)
    db.commit()
    db.refresh(user)
    return {"success": True, "user": hydrate_user(db, user)}
