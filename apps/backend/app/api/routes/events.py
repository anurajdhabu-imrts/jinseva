from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.api.deps import require_permissions
from app.core.database import get_db
from app.models.event import Event, EventDonation, EventExpense
from app.schemas.event import (
    EventCreate,
    EventDonationCreate,
    EventExpenseCreate,
    EventUpdate,
)
from app.services.codes import generate_code

router = APIRouter(prefix="/events", tags=["events"])

can_view = require_permissions("events.view")
can_create = require_permissions("events.create")
can_update = require_permissions("events.update")
can_delete = require_permissions("events.delete")
# Event-wise donation actions accept either the events or donations permission.
can_view_edn = require_permissions("events.view", "donations.view")
can_add_edn = require_permissions("events.update", "donations.create")
can_del_edn = require_permissions("events.delete", "donations.delete")
# Event-wise expense actions accept either the events or expenses permission.
can_view_eex = require_permissions("events.view", "expenses.view")
can_add_eex = require_permissions("events.update", "expenses.create")
can_del_eex = require_permissions("events.delete", "expenses.delete")


def _raised_map(db: Session, event_ids: list[int]) -> dict[int, int]:
    if not event_ids:
        return {}
    rows = db.execute(
        select(EventDonation.event_id, func.coalesce(func.sum(EventDonation.amount), 0))
        .where(EventDonation.event_id.in_(event_ids))
        .group_by(EventDonation.event_id)
    ).all()
    return {eid: int(total) for eid, total in rows}


def _get_event_or_404(db: Session, code: str) -> Event:
    event = db.scalar(select(Event).where(Event.code == code))
    if event is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Event not found")
    return event


# ── Analytics (declared before /{code} so it isn't captured as a code) ──
@router.get("/analytics", dependencies=[Depends(require_permissions("events.view", "reports.view"))])
def event_analytics(db: Session = Depends(get_db)):
    events = db.scalars(select(Event)).all()
    raised = _raised_map(db, [e.id for e in events])
    ranking = sorted(
        (
            {
                "event": e.title,
                "code": e.code,
                "revenue": raised.get(e.id, 0),
                "attendees": e.attendees,
                "budget": e.budget,
            }
            for e in events
        ),
        key=lambda r: r["revenue"],
        reverse=True,
    )
    return {
        "success": True,
        "data": {
            "totalEvents": len(events),
            "totalRaised": sum(raised.values()),
            "totalAttendees": sum(e.attendees for e in events),
            "byEvent": ranking,
        },
    }


# ── List ──
@router.get("", dependencies=[Depends(can_view)])
def list_events(
    q: str | None = None,
    status_filter: str | None = Query(default=None, alias="status"),
    type_filter: str | None = Query(default=None, alias="type"),
    db: Session = Depends(get_db),
):
    stmt = select(Event).order_by(Event.event_date.desc().nullslast())
    if status_filter:
        stmt = stmt.where(Event.status == status_filter)
    if type_filter:
        stmt = stmt.where(Event.type == type_filter)
    if q:
        like = f"%{q}%"
        stmt = stmt.where(or_(Event.title.ilike(like), Event.location.ilike(like)))

    events = db.scalars(stmt).all()
    raised = _raised_map(db, [e.id for e in events])
    data = [e.to_dict(raised=raised.get(e.id, 0)) for e in events]
    return {"success": True, "count": len(data), "data": data}


@router.get("/{code}", dependencies=[Depends(can_view)])
def get_event(code: str, db: Session = Depends(get_db)):
    event = _get_event_or_404(db, code)
    total = db.scalar(
        select(func.coalesce(func.sum(EventDonation.amount), 0)).where(
            EventDonation.event_id == event.id
        )
    )
    return {"success": True, "data": event.to_dict(raised=int(total or 0))}


@router.post("", status_code=status.HTTP_201_CREATED, dependencies=[Depends(can_create)])
def create_event(body: EventCreate, db: Session = Depends(get_db)):
    event = Event(
        code=generate_code(db, Event, Event.code, "EVT-", pad=3, start=101),
        title=body.title,
        type=body.type,
        event_date=body.date,
        time=body.time,
        end_time=body.endTime,
        location=body.location,
        organizer=body.organizer,
        status=body.status,
        attendees=body.attendees,
        budget=body.budget,
        description=body.description,
        image=body.image,
        allow_donations=body.allowDonations,
    )
    db.add(event)
    db.commit()
    db.refresh(event)
    return {"success": True, "data": event.to_dict(raised=0)}


@router.put("/{code}", dependencies=[Depends(can_update)])
def update_event(code: str, body: EventUpdate, db: Session = Depends(get_db)):
    event = _get_event_or_404(db, code)
    mapping = {
        "title": "title", "type": "type", "location": "location",
        "organizer": "organizer", "status": "status", "attendees": "attendees",
        "budget": "budget", "description": "description", "image": "image",
    }
    data = body.model_dump(exclude_unset=True)
    for field, attr in mapping.items():
        if field in data:
            setattr(event, attr, data[field])
    if "date" in data:
        event.event_date = data["date"]
    if "time" in data:
        event.time = data["time"]
    if "endTime" in data:
        event.end_time = data["endTime"]
    if "allowDonations" in data:
        event.allow_donations = data["allowDonations"]

    db.commit()
    db.refresh(event)
    total = db.scalar(
        select(func.coalesce(func.sum(EventDonation.amount), 0)).where(
            EventDonation.event_id == event.id
        )
    )
    return {"success": True, "data": event.to_dict(raised=int(total or 0))}


@router.delete("/{code}", dependencies=[Depends(can_delete)])
def delete_event(code: str, db: Session = Depends(get_db)):
    event = _get_event_or_404(db, code)
    db.delete(event)  # cascades to event_donations
    db.commit()
    return {"success": True, "message": "Event deleted"}


# ── Event-wise donations ──
@router.get("/{code}/donations", dependencies=[Depends(can_view_edn)])
def list_event_donations(code: str, db: Session = Depends(get_db)):
    event = _get_event_or_404(db, code)
    donations = db.scalars(
        select(EventDonation)
        .where(EventDonation.event_id == event.id)
        .order_by(EventDonation.donation_date.desc().nullslast(), EventDonation.id.desc())
    ).all()
    data = [d.to_dict(event_code=event.code) for d in donations]
    total = sum(d.amount for d in donations)
    return {
        "success": True,
        "count": len(data),
        "total": total,
        "event": event.to_dict(raised=total),
        "data": data,
    }


@router.post(
    "/{code}/donations",
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(can_add_edn)],
)
def add_event_donation(code: str, body: EventDonationCreate, db: Session = Depends(get_db)):
    event = _get_event_or_404(db, code)
    donation = EventDonation(
        code=generate_code(db, EventDonation, EventDonation.code, "EDN-", pad=3, start=1),
        event_id=event.id,
        donor=body.donor or "Anonymous",
        amount=body.amount,
        method=body.method,
        donation_date=body.date,
        message=body.message,
        anonymous=body.anonymous,
    )
    db.add(donation)
    db.commit()
    db.refresh(donation)
    return {"success": True, "data": donation.to_dict(event_code=event.code)}


@router.delete("/{code}/donations/{don_code}", dependencies=[Depends(can_del_edn)])
def delete_event_donation(code: str, don_code: str, db: Session = Depends(get_db)):
    event = _get_event_or_404(db, code)
    donation = db.scalar(
        select(EventDonation).where(
            EventDonation.code == don_code, EventDonation.event_id == event.id
        )
    )
    if donation is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Event donation not found")
    db.delete(donation)
    db.commit()
    return {"success": True, "message": "Event donation removed"}


# ── Event-wise expenses ──
@router.get("/{code}/expenses", dependencies=[Depends(can_view_eex)])
def list_event_expenses(code: str, db: Session = Depends(get_db)):
    event = _get_event_or_404(db, code)
    expenses = db.scalars(
        select(EventExpense)
        .where(EventExpense.event_id == event.id)
        .order_by(EventExpense.expense_date.desc().nullslast(), EventExpense.id.desc())
    ).all()
    data = [e.to_dict(event_code=event.code) for e in expenses]
    total = sum(e.amount for e in expenses)
    return {"success": True, "count": len(data), "total": total, "data": data}


@router.post(
    "/{code}/expenses",
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(can_add_eex)],
)
def add_event_expense(code: str, body: EventExpenseCreate, db: Session = Depends(get_db)):
    event = _get_event_or_404(db, code)
    expense = EventExpense(
        code=generate_code(db, EventExpense, EventExpense.code, "EEX-", pad=3, start=1),
        event_id=event.id,
        category=body.category,
        description=body.description,
        vendor=body.vendor,
        amount=body.amount,
        method=body.method,
        expense_date=body.date,
        status=body.status,
    )
    db.add(expense)
    db.commit()
    db.refresh(expense)
    return {"success": True, "data": expense.to_dict(event_code=event.code)}


@router.delete("/{code}/expenses/{exp_code}", dependencies=[Depends(can_del_eex)])
def delete_event_expense(code: str, exp_code: str, db: Session = Depends(get_db)):
    event = _get_event_or_404(db, code)
    expense = db.scalar(
        select(EventExpense).where(
            EventExpense.code == exp_code, EventExpense.event_id == event.id
        )
    )
    if expense is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Event expense not found")
    db.delete(expense)
    db.commit()
    return {"success": True, "message": "Event expense removed"}
