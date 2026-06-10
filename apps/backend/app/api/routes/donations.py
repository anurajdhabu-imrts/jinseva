from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, literal_column, or_, select
from sqlalchemy.orm import Session

from app.api.deps import require_permissions
from app.core.config import settings
from app.core.database import get_db
from app.models.donation import Donation
from app.models.event import Event, EventDonation
from app.schemas.donation import DonationCreate, DonationUpdate, EmailReceiptRequest
from app.services.codes import generate_code
from app.services.email import receipt_html, send_email

router = APIRouter(prefix="/donations", tags=["donations"])

can_view = require_permissions("donations.view")
can_create = require_permissions("donations.create")
can_update = require_permissions("donations.update")
can_delete = require_permissions("donations.delete")


def _get_or_404(db: Session, code: str) -> Donation:
    donation = db.scalar(select(Donation).where(Donation.code == code))
    if donation is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Donation not found")
    return donation


def _breakdown(db: Session, column):
    rows = db.execute(
        select(column, func.coalesce(func.sum(Donation.amount), 0), func.count())
        .group_by(column)
        .order_by(func.sum(Donation.amount).desc())
    ).all()
    return [{"name": name, "value": int(total), "count": count} for name, total, count in rows]


# ── Analytics (before /{code}) — includes event-wise donations ──
@router.get("/analytics", dependencies=[Depends(require_permissions("donations.view", "reports.view"))])
def donation_analytics(db: Session = Depends(get_db)):
    total = db.scalar(select(func.coalesce(func.sum(Donation.amount), 0))) or 0
    count = db.scalar(select(func.count()).select_from(Donation)) or 0

    month = func.to_char(Donation.donation_date, literal_column("'YYYY-MM'"))
    monthly_rows = db.execute(
        select(month, func.coalesce(func.sum(Donation.amount), 0))
        .where(Donation.donation_date.is_not(None))
        .group_by(month)
        .order_by(month)
    ).all()

    by_type = _breakdown(db, Donation.type)
    by_method = {m["name"]: {"value": m["value"], "count": m["count"]} for m in _breakdown(db, Donation.method)}
    monthly = {m: int(t) for m, t in monthly_rows}

    # ── Fold in event-wise donations ──
    ed_total = db.scalar(select(func.coalesce(func.sum(EventDonation.amount), 0))) or 0
    ed_count = db.scalar(select(func.count()).select_from(EventDonation)) or 0
    total += ed_total
    count += ed_count
    if ed_total:
        by_type.append({"name": "Event Donations", "value": int(ed_total), "count": int(ed_count)})

    for m, amt in db.execute(
        select(EventDonation.method, func.coalesce(func.sum(EventDonation.amount), 0)).group_by(EventDonation.method)
    ).all():
        entry = by_method.setdefault(m, {"value": 0, "count": 0})
        entry["value"] += int(amt)

    ed_month = func.to_char(EventDonation.donation_date, literal_column("'YYYY-MM'"))
    for m, amt in db.execute(
        select(ed_month, func.coalesce(func.sum(EventDonation.amount), 0))
        .where(EventDonation.donation_date.is_not(None))
        .group_by(ed_month)
    ).all():
        monthly[m] = monthly.get(m, 0) + int(amt)

    return {
        "success": True,
        "data": {
            "totalAmount": int(total),
            "count": int(count),
            "byType": sorted(by_type, key=lambda x: x["value"], reverse=True),
            "byMethod": [{"name": k, "value": v["value"], "count": v.get("count", 0)} for k, v in
                         sorted(by_method.items(), key=lambda kv: kv[1]["value"], reverse=True)],
            "byStatus": _breakdown(db, Donation.status),
            "monthly": [{"month": m, "total": monthly[m]} for m in sorted(monthly)],
        },
    }


def _event_donation_to_item(ed: EventDonation, event: Event) -> dict:
    """Map an event-wise donation to the general donation list shape so both
    kinds show together in the Donations module."""
    return {
        "id": ed.code,
        "donor": "Anonymous" if ed.anonymous else ed.donor,
        "email": "-",
        "phone": "-",
        "type": f"Event: {event.title}",
        "amount": ed.amount,
        "method": ed.method,
        "date": ed.donation_date.isoformat() if ed.donation_date else None,
        "status": "paid",
        "purpose": ed.message,
        "receipt": ed.code,
        "anonymous": ed.anonymous,
        "source": "event",
        "eventId": event.code,
        "eventTitle": event.title,
    }


# ── List (general donations + event-wise donations, merged) ──
@router.get("", dependencies=[Depends(can_view)])
def list_donations(
    q: str | None = None,
    type_filter: str | None = Query(default=None, alias="type"),
    status_filter: str | None = Query(default=None, alias="status"),
    method: str | None = None,
    include_events: bool = Query(default=True, alias="includeEvents"),
    db: Session = Depends(get_db),
):
    stmt = select(Donation).order_by(Donation.donation_date.desc().nullslast(), Donation.id.desc())
    if type_filter:
        stmt = stmt.where(Donation.type == type_filter)
    if status_filter:
        stmt = stmt.where(Donation.status == status_filter)
    if method:
        stmt = stmt.where(Donation.method == method)
    if q:
        like = f"%{q}%"
        stmt = stmt.where(
            or_(Donation.donor.ilike(like), Donation.purpose.ilike(like), Donation.code.ilike(like))
        )

    data = []
    for d in db.scalars(stmt).all():
        item = d.to_dict()
        item["source"] = "general"
        data.append(item)

    # Merge in event-wise donations (unless a general-only filter excludes them).
    include = include_events and not type_filter and (not status_filter or status_filter == "paid")
    if include:
        ed_stmt = select(EventDonation, Event).join(Event, EventDonation.event_id == Event.id)
        if method:
            ed_stmt = ed_stmt.where(EventDonation.method == method)
        if q:
            like = f"%{q}%"
            ed_stmt = ed_stmt.where(
                or_(
                    EventDonation.donor.ilike(like),
                    EventDonation.message.ilike(like),
                    EventDonation.code.ilike(like),
                    Event.title.ilike(like),
                )
            )
        for ed, event in db.execute(ed_stmt).all():
            data.append(_event_donation_to_item(ed, event))

    # Sort the combined list by date (newest first); undated rows last.
    data.sort(key=lambda x: x.get("date") or "", reverse=True)
    return {"success": True, "count": len(data), "data": data}


@router.get("/{code}", dependencies=[Depends(can_view)])
def get_donation(code: str, db: Session = Depends(get_db)):
    return {"success": True, "data": _get_or_404(db, code).to_dict()}


@router.post("/{code}/email-receipt", dependencies=[Depends(can_view)])
def email_receipt(code: str, body: EmailReceiptRequest, db: Session = Depends(get_db)):
    """Email the donation receipt to the donor (or a provided address)."""
    if not settings.email_enabled:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Email is not configured on the server.")
    donation = _get_or_404(db, code)
    to = (str(body.to) if body.to else "") or (donation.email or "")
    to = to.strip()
    if not to or to == "-":
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            "No email address on file for this donor — provide one to send the receipt.",
        )
    try:
        send_email(to, f"Donation Receipt {donation.receipt}", receipt_html(donation.to_dict()))
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status.HTTP_502_BAD_GATEWAY, f"Email send failed: {exc}")
    return {"success": True, "message": f"Receipt emailed to {to}"}


@router.post("", status_code=status.HTTP_201_CREATED, dependencies=[Depends(can_create)])
def create_donation(body: DonationCreate, db: Session = Depends(get_db)):
    code = generate_code(db, Donation, Donation.code, "DON-", pad=4, start=2401)
    receipt = body.receipt or code.replace("DON-", "R-")
    donation = Donation(
        code=code,
        donor=body.donor or "Anonymous",
        email=body.email,
        phone=body.phone,
        type=body.type,
        property=body.property,
        amount=body.amount,
        method=body.method,
        donation_date=body.date,
        status=body.status,
        purpose=body.purpose,
        receipt=receipt,
        anonymous=body.anonymous,
    )
    db.add(donation)
    db.commit()
    db.refresh(donation)
    return {"success": True, "data": donation.to_dict()}


@router.put("/{code}", dependencies=[Depends(can_update)])
def update_donation(code: str, body: DonationUpdate, db: Session = Depends(get_db)):
    donation = _get_or_404(db, code)
    data = body.model_dump(exclude_unset=True)
    if "date" in data:
        donation.donation_date = data.pop("date")
    for field, value in data.items():
        setattr(donation, field, value)
    db.commit()
    db.refresh(donation)
    return {"success": True, "data": donation.to_dict()}


@router.delete("/{code}", dependencies=[Depends(can_delete)])
def delete_donation(code: str, db: Session = Depends(get_db)):
    donation = _get_or_404(db, code)
    db.delete(donation)
    db.commit()
    return {"success": True, "message": "Donation deleted"}
