from fastapi import APIRouter, Depends
from sqlalchemy import func, literal_column, select
from sqlalchemy.orm import Session

from app.api.deps import require_permissions
from app.core.database import get_db
from app.models.booking import Booking
from app.models.donation import Donation
from app.models.event import Event, EventDonation, EventExpense
from app.models.expense import Expense, ExpenseCategory
from app.models.income import Income

router = APIRouter(prefix="/reports", tags=["reports"])

can_view = require_permissions("reports.view")

MONTH_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
PALETTE = ["#ffc01e", "#c8102e", "#00843d", "#1a1b22", "#d68500", "#054624", "#761120"]
# Canonical temple properties (kept in this order even when they have no data yet).
PROPERTIES = ["Jain Mandir", "Gunfa", "Hall", "Commercial Properties"]


def _sum(db: Session, col) -> int:
    return int(db.scalar(select(func.coalesce(func.sum(col), 0))) or 0)


def _count(db: Session, model) -> int:
    return int(db.scalar(select(func.count()).select_from(model)) or 0)


def _monthly_map(db: Session, amount_col, date_col) -> dict[str, int]:
    m = func.to_char(date_col, literal_column("'YYYY-MM'"))
    rows = db.execute(
        select(m, func.coalesce(func.sum(amount_col), 0)).where(date_col.is_not(None)).group_by(m)
    ).all()
    return {k: int(v) for k, v in rows}


def _monthly_income_expense(db: Session) -> list[dict]:
    # Revenue = donations + income; Expense = expenses.
    don = _monthly_map(db, Donation.amount, Donation.donation_date)
    inc = _monthly_map(db, Income.amount, Income.income_date)
    exp = _monthly_map(db, Expense.amount, Expense.expense_date)
    revenue: dict[str, int] = {}
    for d in (don, inc):
        for k, v in d.items():
            revenue[k] = revenue.get(k, 0) + v
    out = []
    for k in sorted(set(revenue) | set(exp)):
        out.append({"month": MONTH_ABBR[int(k[5:7]) - 1], "income": revenue.get(k, 0), "expense": exp.get(k, 0)})
    return out


def _event_revenue(db: Session) -> list[dict]:
    raised = {
        eid: int(t)
        for eid, t in db.execute(
            select(EventDonation.event_id, func.coalesce(func.sum(EventDonation.amount), 0))
            .group_by(EventDonation.event_id)
        ).all()
    }
    events = db.scalars(select(Event)).all()
    return sorted(
        ({"event": e.title, "revenue": raised.get(e.id, 0), "attendees": e.attendees} for e in events),
        key=lambda r: r["revenue"], reverse=True,
    )


def _group_sum(db: Session, key_col, amount_col, join=None) -> dict[str, int]:
    stmt = select(key_col, func.coalesce(func.sum(amount_col), 0))
    if join is not None:
        stmt = stmt.select_from(join)
    stmt = stmt.group_by(key_col)
    return {(k or "Unassigned"): int(v) for k, v in db.execute(stmt).all()}


@router.get("/by-property", dependencies=[Depends(can_view)])
def by_property(db: Session = Depends(get_db)):
    """Revenue / expense / net broken down by temple property (place)."""
    don = _group_sum(db, Donation.property, Donation.amount)
    inc = _group_sum(db, Income.property, Income.amount)
    exp = _group_sum(db, Expense.property, Expense.amount)
    # Event-wise donations/expenses inherit their event's property (Event.category).
    edon = _group_sum(db, Event.category, EventDonation.amount, join=Event.__table__.join(EventDonation, EventDonation.event_id == Event.id))
    eexp = _group_sum(db, Event.category, EventExpense.amount, join=Event.__table__.join(EventExpense, EventExpense.event_id == Event.id))

    found = set(don) | set(inc) | set(exp) | set(edon) | set(eexp)
    ordered = PROPERTIES + [n for n in sorted(found) if n not in PROPERTIES]

    rows = []
    for i, p in enumerate(ordered):
        donations = don.get(p, 0) + edon.get(p, 0)
        income = inc.get(p, 0)
        expenses = exp.get(p, 0) + eexp.get(p, 0)
        revenue = donations + income
        # Hide non-canonical buckets that have no activity at all.
        if p not in PROPERTIES and revenue == 0 and expenses == 0:
            continue
        rows.append({
            "property": p,
            "donations": donations,
            "income": income,
            "revenue": revenue,
            "expenses": expenses,
            "net": revenue - expenses,
            "color": PALETTE[i % len(PALETTE)],
        })

    totals = {
        "revenue": sum(r["revenue"] for r in rows),
        "expenses": sum(r["expenses"] for r in rows),
        "net": sum(r["net"] for r in rows),
    }
    return {"success": True, "data": {"rows": rows, "totals": totals}}


@router.get("/summary", dependencies=[Depends(can_view)])
def summary(db: Session = Depends(get_db)):
    total_revenue = _sum(db, Donation.amount) + _sum(db, EventDonation.amount) + _sum(db, Income.amount)
    total_expenses = _sum(db, Expense.amount) + _sum(db, EventExpense.amount)
    return {
        "success": True,
        "data": {
            "totalRevenue": total_revenue,
            "totalExpenses": total_expenses,
            "netSurplus": total_revenue - total_expenses,
            "eventsHosted": _count(db, Event),
            "monthly": _monthly_income_expense(db),
            "eventRevenue": _event_revenue(db)[:6],
        },
    }


@router.get("/revenue", dependencies=[Depends(can_view)])
def revenue(db: Session = Depends(get_db)):
    donations = _sum(db, Donation.amount) + _sum(db, EventDonation.amount)
    pooja_fees = _sum(db, Booking.amount)
    misc_income = _sum(db, Income.amount)
    by_type = [
        {"name": t or "Other", "value": int(v)}
        for t, v in db.execute(
            select(Donation.type, func.coalesce(func.sum(Donation.amount), 0))
            .group_by(Donation.type).order_by(func.sum(Donation.amount).desc())
        ).all()
    ]
    ed = _sum(db, EventDonation.amount)
    if ed:
        by_type.append({"name": "Event Donations", "value": ed})
    by_type = sorted(by_type, key=lambda c: c["value"], reverse=True)[:6]
    for i, c in enumerate(by_type):
        c["color"] = PALETTE[i % len(PALETTE)]
    return {
        "success": True,
        "data": {
            "totalRevenue": donations + pooja_fees + misc_income,
            "donations": donations,
            "poojaFees": pooja_fees,
            "miscIncome": misc_income,
            "monthly": _monthly_income_expense(db),
            "byCategory": by_type,
        },
    }


@router.get("/expense", dependencies=[Depends(can_view)])
def expense(db: Session = Depends(get_db)):
    total = _sum(db, Expense.amount)
    txns = _count(db, Expense)
    vendors = int(db.scalar(select(func.count(func.distinct(Expense.vendor))).where(Expense.vendor != "")) or 0)
    by_cat = [
        {"name": n, "value": int(v), "color": PALETTE[i % len(PALETTE)]}
        for i, (n, v) in enumerate(
            db.execute(
                select(ExpenseCategory.name, func.coalesce(func.sum(Expense.amount), 0))
                .join(Expense, Expense.category_id == ExpenseCategory.id)
                .group_by(ExpenseCategory.name).order_by(func.sum(Expense.amount).desc())
            ).all()
        )
    ]
    monthly = _monthly_income_expense(db)
    months_with_expense = [m for m in monthly if m["expense"] > 0]
    avg_monthly = round(total / len(months_with_expense)) if months_with_expense else 0
    return {
        "success": True,
        "data": {
            "totalExpense": total,
            "avgMonthly": avg_monthly,
            "transactions": txns,
            "vendors": vendors,
            "byCategory": by_cat,
            "monthly": monthly,
        },
    }


@router.get("/events", dependencies=[Depends(can_view)])
def events(db: Session = Depends(get_db)):
    ranked = _event_revenue(db)
    return {
        "success": True,
        "data": {
            "byEvent": ranked,
            "count": len(ranked),
            "totalRaised": sum(r["revenue"] for r in ranked),
            "totalAttendees": sum(r["attendees"] for r in ranked),
            "bestEvent": ranked[0]["event"] if ranked else "—",
            "bestEventRaised": ranked[0]["revenue"] if ranked else 0,
        },
    }
