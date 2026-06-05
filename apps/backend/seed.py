"""
Seed script — provisions the system roles, a few starter custom roles, the
bootstrap admin user, and a handful of starter events. Idempotent: safe to
re-run. Donations, income and event-wise donations are NOT seeded — those
tables start empty and are filled through the app.

Usage (from the backend/ folder, with deps installed):
    python seed.py
or from the repo root:
    npm run seed:backend
"""

from datetime import date, datetime, timezone

from sqlalchemy import select

from app.core.config import settings
from app.core.database import Base, SessionLocal, engine
from app.core.permissions import (
    ALL_PERMISSION_IDS,
    SYSTEM_ROLE_ADMIN,
    SYSTEM_ROLE_DEVOTEE,
)
from app.core.security import hash_password
from app.models.communication import MessageTemplate, Notification
from app.models.event import Event
from app.models.expense import ExpenseCategory
from app.models.inventory import Supplier
from app.models.role import Role
from app.models.user import User

ROLE_SEED = [
    {
        "key": SYSTEM_ROLE_ADMIN,
        "name": "Admin",
        "description": "Full access to every module, including users and roles.",
        "color": "#c8102e",
        "system": True,
        "permission_ids": list(ALL_PERMISSION_IDS),
    },
    {
        "key": SYSTEM_ROLE_DEVOTEE,
        "name": "Devotee",
        "description": "Logs into the devotee portal. Can view temple events.",
        "color": "#00843d",
        "system": True,
        "permission_ids": ["events.view"],
    },
    {
        "key": "role_accountant",
        "name": "Accountant",
        "description": "Manages donations, income, expenses and reports.",
        "color": "#ffc01e",
        "system": False,
        "permission_ids": [
            "donations.view", "donations.create", "donations.update",
            "income.view", "income.create", "income.update",
            "expenses.view", "expenses.create", "expenses.update",
            "reports.view", "reports.export",
        ],
    },
    {
        "key": "role_priest",
        "name": "Priest",
        "description": "Runs pooja bookings, events and the temple inventory.",
        "color": "#1a1b22",
        "system": False,
        "permission_ids": [
            "bookings.view", "bookings.create", "bookings.update",
            "events.view", "events.create", "events.update",
            "inventory.view", "inventory.update",
        ],
    },
    {
        "key": "role_volunteer",
        "name": "Volunteer",
        "description": "Read-only access to bookings, events and the gallery.",
        "color": "#054624",
        "system": False,
        "permission_ids": ["bookings.view", "events.view", "media.view"],
    },
]


def seed_roles(db) -> None:
    for r in ROLE_SEED:
        existing = db.scalar(select(Role).where(Role.key == r["key"]))
        if existing:
            # Keep the Admin role's permission set in sync with the catalog.
            if r["key"] == SYSTEM_ROLE_ADMIN:
                existing.permission_ids = list(ALL_PERMISSION_IDS)
            print(f"  role '{r['name']}' already exists — skipped")
        else:
            db.add(Role(**r))
            print(f"  created role '{r['name']}' ({r['key']})")
    db.commit()


def seed_admin(db) -> None:
    email = settings.seed_admin_email.lower()
    if db.scalar(select(User).where(User.email == email)):
        print(f"  admin user {email} already exists — skipped")
        return
    db.add(
        User(
            name=settings.seed_admin_name,
            email=email,
            password_hash=hash_password(settings.seed_admin_password),
            role_id=SYSTEM_ROLE_ADMIN,
            status="active",
            last_active=datetime.now(timezone.utc),
        )
    )
    db.commit()
    print(f"  created admin user {email} (password from SEED_ADMIN_PASSWORD)")


# A few starter events so the Events module isn't empty on first run.
# (code, title, type, date, time, endTime, location, organizer, status, attendees, budget, description, image)
EVENT_SEED = [
    ("EVT-101", "Paryushan Mahaparva", "Mahaparva", "2026-08-30", "04:00", "23:00", "Main Derasar Complex", "Acharya Shree Vimal Surishwar", "upcoming", 3500, 450000, "8-day festival of forgiveness, tapasya and self-discipline culminating in Samvatsari Pratikraman.", "https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=1200"),
    ("EVT-102", "Mahavir Janma Kalyanak", "Janma Kalyanak", "2026-04-15", "06:00", "21:00", "Rangmandap", "Sangh Committee", "upcoming", 2200, 280000, "Birth celebration of Bhagwan Mahavir with Snatra Mahapooja, jhanki and pravachan.", "https://images.unsplash.com/photo-1604608672516-f1b9b1e5e7e9?w=1200"),
    ("EVT-103", "Aayambil Oli", "Tapasya", "2026-05-29", "07:00", "20:00", "Upashraya Hall", "Tapasvi Group", "upcoming", 450, 35000, "9-day spiritual fasting period dedicated to the Navpad — Arihant, Siddha and other parmesthi padas.", "https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=1200"),
    ("EVT-104", "Das Lakshan Parva", "Mahaparva", "2026-09-10", "00:00", "23:59", "Entire Derasar", "Festival Committee", "upcoming", 5000, 850000, "10 virtues celebration with daily pravachans, vidhan poojas and community vatsalya.", "https://images.unsplash.com/photo-1582558508092-c7a39fd14d05?w=1200"),
    ("EVT-105", "Diwali Nirvana Mahotsav", "Mahaparva", "2025-11-12", "17:30", "22:00", "Mool Nayak Garbhgruha", "Festival Committee", "completed", 2800, 380000, "Bhagwan Mahavir's nirvana anniversary observed with deep darshan, laxmi pujan and gyan utsav.", "https://images.unsplash.com/photo-1604608672516-f1b9b1e5e7e9?w=1200"),
    ("EVT-106", "Snatra Mahapooja", "Pooja", "2026-05-31", "08:00", "11:00", "Rangmandap", "Pooja Committee", "upcoming", 400, 15000, "Ceremonial abhishek of Mool Nayak Tirthankar with milk, water, kesar and chandan.", "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=1200"),
]


def seed_events(db) -> None:
    for (code, title, typ, dt, t, et, loc, org, st, att, bud, desc, img) in EVENT_SEED:
        if db.scalar(select(Event).where(Event.code == code)):
            continue
        db.add(
            Event(
                code=code, title=title, type=typ,
                event_date=date.fromisoformat(dt), time=t, end_time=et,
                location=loc, organizer=org, status=st, attendees=att, budget=bud,
                description=desc, image=img, allow_donations=True,
            )
        )
        print(f"  created event '{title}' ({code})")
    db.commit()


# Master expense categories (reference data the Expenses module links to).
EXPENSE_CATEGORY_SEED = [
    "Utilities", "Marble & Maintenance", "Priest Honorarium", "Pooja Materials",
    "Decoration & Aangi", "Bhojanshala Supplies", "Repairs", "Books & Sahitya", "Other",
]


def seed_expense_categories(db) -> None:
    for name in EXPENSE_CATEGORY_SEED:
        if db.scalar(select(ExpenseCategory).where(ExpenseCategory.name == name)):
            continue
        db.add(ExpenseCategory(name=name))
        print(f"  created expense category '{name}'")
    db.commit()


# Master suppliers (reference data the Inventory module links to).
# (code, name, category, phone, email, rating, status, orders)
SUPPLIER_SEED = [
    ("SUP-001", "Divya Stores", "Pooja Materials", "+91 98765-11111", "divya@store.com", 4.8, "active", 142),
    ("SUP-002", "Shree Mahavir Dairy", "Dairy & Ghee", "+91 98765-22222", "mahavir@dairy.com", 4.9, "active", 88),
    ("SUP-003", "Annapurna Traders", "Prasadam", "+91 98765-33333", "annapurna@gm.com", 4.6, "active", 76),
    ("SUP-004", "Phoolwala", "Decorations", "+91 98765-44444", "phool@flowers.com", 4.7, "active", 215),
    ("SUP-005", "Stone Care Ltd", "Maintenance", "+91 98765-55555", "stone@care.com", 4.5, "active", 12),
    ("SUP-006", "Sandal Mart", "Pooja Materials", "+91 98765-66666", "sandal@mart.com", 4.4, "inactive", 28),
]


def seed_suppliers(db) -> None:
    for (code, name, cat, phone, email, rating, st, orders) in SUPPLIER_SEED:
        if db.scalar(select(Supplier).where(Supplier.name == name)):
            continue
        db.add(Supplier(code=code, name=name, category=cat, phone=phone, email=email, rating=rating, status=st, orders=orders))
        print(f"  created supplier '{name}' ({code})")
    db.commit()


# (name, type, subject, usageCount, lastUsed)
TEMPLATE_SEED = [
    ("Donation Receipt", "Email", "Thank you for your donation", 1842, "2026-05-27"),
    ("Booking Confirmation", "SMS", "Your pooja booking confirmed", 562, "2026-05-27"),
    ("Event Reminder", "Email", "Upcoming derasar event", 124, "2026-05-26"),
    ("Birthday Greeting", "SMS", "Birthday blessings from derasar", 2890, "2026-05-27"),
    ("Kshamavani Greeting", "Email", "Micchami Dukkadam", 88, "2026-05-12"),
]

# (type, title, message)
NOTIFICATION_SEED = [
    ("donation", "New donation received", "Rs.25,000 from Priya Jain for renovation"),
    ("event", "Pooja reminder", "Snatra Pooja starts in 2 hours"),
    ("booking", "New pooja booking", "Ashta Prakari Pooja booked for May 31"),
    ("inventory", "Low stock alert", "Chandan (sandalwood) below threshold"),
    ("staff", "Staff attendance", "3 staff members on leave today"),
]


def seed_templates(db) -> None:
    for (name, typ, subject, usage, lu) in TEMPLATE_SEED:
        if db.scalar(select(MessageTemplate).where(MessageTemplate.name == name)):
            continue
        db.add(MessageTemplate(name=name, type=typ, subject=subject, usage_count=usage, last_used=date.fromisoformat(lu)))
        print(f"  created template '{name}'")
    db.commit()


def seed_notifications(db) -> None:
    if db.scalar(select(Notification).limit(1)):
        return
    for (typ, title, msg) in NOTIFICATION_SEED:
        db.add(Notification(type=typ, title=title, message=msg))
        print(f"  created notification '{title}'")
    db.commit()


def main() -> None:
    print("Creating tables (if missing)…")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        print("Seeding roles…")
        seed_roles(db)
        print("Seeding admin…")
        seed_admin(db)
        print("Seeding events…")
        seed_events(db)
        print("Seeding expense categories…")
        seed_expense_categories(db)
        print("Seeding suppliers…")
        seed_suppliers(db)
        print("Seeding templates…")
        seed_templates(db)
        print("Seeding notifications…")
        seed_notifications(db)
        print("Seed complete.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
