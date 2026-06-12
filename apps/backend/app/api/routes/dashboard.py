from fastapi import APIRouter, Depends
from sqlalchemy import func, literal_column, select
from sqlalchemy.orm import Session

from app.api.deps import Principal, get_current_principal
from app.core.database import get_db
from app.core.permissions import SYSTEM_ROLE_DEVOTEE
from app.models.booking import Booking
from app.models.donation import Donation
from app.models.event import Event, EventDonation, EventExpense
from app.models.expense import Expense
from app.models.income import Income
from app.models.staff import Staff, Volunteer
from app.models.user import User

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

PALETTE = ["#FF9644", "#562F00", "#FFCE99"]
MONTH_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]


def _sum(db: Session, col) -> int:
    return int(db.scalar(select(func.coalesce(func.sum(col), 0))) or 0)


def _count(db: Session, model, *where) -> int:
    stmt = select(func.count()).select_from(model)
    for w in where:
        stmt = stmt.where(w)
    return int(db.scalar(stmt) or 0)


def _monthly_income_expense(db: Session) -> list[dict]:
    inc_m = func.to_char(Income.income_date, literal_column("'YYYY-MM'"))
    inc = {
        m: int(t)
        for m, t in db.execute(
            select(inc_m, func.coalesce(func.sum(Income.amount), 0))
            .where(Income.income_date.is_not(None)).group_by(inc_m)
        ).all()
    }
    exp_m = func.to_char(Expense.expense_date, literal_column("'YYYY-MM'"))
    exp = {
        m: int(t)
        for m, t in db.execute(
            select(exp_m, func.coalesce(func.sum(Expense.amount), 0))
            .where(Expense.expense_date.is_not(None)).group_by(exp_m)
        ).all()
    }
    out = []
    for m in sorted(set(inc) | set(exp)):
        label = MONTH_ABBR[int(m[5:7]) - 1]
        out.append({"month": label, "income": inc.get(m, 0), "expense": exp.get(m, 0)})
    return out


def _event_raised(db: Session) -> dict[int, int]:
    rows = db.execute(
        select(EventDonation.event_id, func.coalesce(func.sum(EventDonation.amount), 0))
        .group_by(EventDonation.event_id)
    ).all()
    return {eid: int(t) for eid, t in rows}


@router.get("/overview")
def overview(
    principal: Principal = Depends(get_current_principal),
    db: Session = Depends(get_db),
):
    # ── KPI stats ──
    total_donations = _sum(db, Donation.amount) + _sum(db, EventDonation.amount)
    total_expenses = _sum(db, Expense.amount) + _sum(db, EventExpense.amount)
    total_income = _sum(db, Income.amount)
    upcoming_events = _count(db, Event, Event.status == "upcoming")
    devotees = _count(db, User, User.role_id == SYSTEM_ROLE_DEVOTEE)
    total_bookings = _count(db, Booking)

    # ── Donation categories (general types + event donations bucket) ──
    cats = [
        {"name": t or "Other", "value": int(v)}
        for t, v in db.execute(
            select(Donation.type, func.coalesce(func.sum(Donation.amount), 0))
            .group_by(Donation.type).order_by(func.sum(Donation.amount).desc())
        ).all()
    ]
    ed_total = _sum(db, EventDonation.amount)
    if ed_total:
        cats.append({"name": "Event Donations", "value": ed_total})
    cats = sorted(cats, key=lambda c: c["value"], reverse=True)[:6]
    for i, c in enumerate(cats):
        c["color"] = PALETTE[i % len(PALETTE)]

    # ── Event revenue ranking ──
    events = db.scalars(select(Event)).all()
    raised = _event_raised(db)
    event_revenue = sorted(
        ({"event": e.title, "revenue": raised.get(e.id, 0), "attendees": e.attendees} for e in events),
        key=lambda r: r["revenue"], reverse=True,
    )[:6]

    # ── Recent donations ──
    recent = db.scalars(
        select(Donation).order_by(Donation.donation_date.desc().nullslast(), Donation.id.desc()).limit(6)
    ).all()

    # ── Upcoming events ──
    ups = db.scalars(
        select(Event).where(Event.status == "upcoming")
        .order_by(Event.event_date.asc().nullslast()).limit(4)
    ).all()

    # ── Activity summary ──
    activity = [
        {"label": "Pooja Bookings", "value": total_bookings, "growth": 0},
        {"label": "Donations", "value": _count(db, Donation), "growth": 0},
        {"label": "Active Volunteers", "value": _count(db, Volunteer), "growth": 0},
        {"label": "Staff", "value": _count(db, Staff), "growth": 0},
    ]

    return {
        "success": True,
        "data": {
            "stats": {
                "totalDonations": total_donations,
                "totalExpenses": total_expenses,
                "totalIncome": total_income,
                "upcomingEvents": upcoming_events,
                "registeredDevotees": devotees,
                "totalBookings": total_bookings,
            },
            "monthlyIncomeExpense": _monthly_income_expense(db),
            "donationCategories": cats,
            "eventRevenue": event_revenue,
            "recentTransactions": [d.to_dict() for d in recent],
            "upcomingEvents": [e.to_dict() for e in ups],
            "activitySummary": activity,
        },
    }
