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
from app.models.communication import MessageTemplate
from app.models.expense import ExpenseCategory
from app.models.inventory import Supplier
from app.models.media import Media
from app.models.role import Role
from app.models.user import User

ROLE_SEED = [
    {
        "key": SYSTEM_ROLE_ADMIN,
        "name": "Admin",
        "description": "Full access to every module, including users and roles.",
        "color": "#FF9644",
        "system": True,
        "permission_ids": list(ALL_PERMISSION_IDS),
    },
    {
        "key": SYSTEM_ROLE_DEVOTEE,
        "name": "Devotee",
        "description": "Logs into the devotee portal. Can view temple events.",
        "color": "#562F00",
        "system": True,
        "permission_ids": ["events.view"],
    },
    {
        "key": "role_accountant",
        "name": "Accountant",
        "description": "Manages donations, income, expenses and reports.",
        "color": "#FFCE99",
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
        "color": "#FF9644",
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
        "color": "#562F00",
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


def _stable_image(img: str, code: str, size: str = "1200/800") -> str:
    # Unsplash photo IDs go dead over time → use a deterministic picsum image.
    if img and "unsplash" in img:
        return f"https://picsum.photos/seed/{code}/{size}"
    return img


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

def seed_templates(db) -> None:
    for (name, typ, subject, usage, lu) in TEMPLATE_SEED:
        if db.scalar(select(MessageTemplate).where(MessageTemplate.name == name)):
            continue
        db.add(MessageTemplate(name=name, type=typ, subject=subject, usage_count=usage, last_used=date.fromisoformat(lu)))
        print(f"  created template '{name}'")
    db.commit()


# (code, type, title, category, url, thumbnail, duration, views)
MEDIA_SEED = [
    ("MED-001", "photo", "Mool Nayak Darshan", "Daily Rituals", "https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=800", "", "", 0),
    ("MED-002", "photo", "Diwali Nirvana Mahotsav", "Festivals", "https://images.unsplash.com/photo-1604608672516-f1b9b1e5e7e9?w=800", "", "", 0),
    ("MED-003", "photo", "Pratahkal Snatra", "Daily Rituals", "https://images.unsplash.com/photo-1582558508092-c7a39fd14d05?w=800", "", "", 0),
    ("MED-004", "photo", "Sadharmik Vatsalya", "Seva", "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800", "", "", 0),
    ("MED-005", "photo", "Shikhar Architecture", "Architecture", "https://images.unsplash.com/photo-1568438350562-2cae6d394ad0?w=800", "", "", 0),
    ("MED-006", "photo", "Paryushan Bhakti", "Festivals", "https://images.unsplash.com/photo-1599627388842-0e94f5d04c0d?w=800", "", "", 0),
    ("MED-101", "video", "Maha Aarti — Highlights", "Aarti", "https://images.unsplash.com/photo-1582558508092-c7a39fd14d05?w=800", "https://images.unsplash.com/photo-1582558508092-c7a39fd14d05?w=800", "12:45", 24580),
    ("MED-102", "video", "Snatra Mahapooja Live", "Pooja", "https://images.unsplash.com/photo-1604608672516-f1b9b1e5e7e9?w=800", "https://images.unsplash.com/photo-1604608672516-f1b9b1e5e7e9?w=800", "45:18", 32100),
    ("MED-103", "video", "Pravachan by Acharya ji", "Discourse", "https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=800", "https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=800", "52:18", 8920),
]


def seed_media(db) -> None:
    for (code, mtype, title, cat, url, thumb, dur, views) in MEDIA_SEED:
        if db.scalar(select(Media).where(Media.code == code)):
            continue
        url = _stable_image(url, code, "800/600")
        thumb = _stable_image(thumb, code + "t", "800/600")
        db.add(Media(code=code, media_type=mtype, title=title, category=cat, url=url, thumbnail=thumb, duration=dur, views=views))
        print(f"  created media '{title}' ({code})")
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
        print("Seeding expense categories…")
        seed_expense_categories(db)
        print("Seeding suppliers…")
        seed_suppliers(db)
        print("Seeding templates…")
        seed_templates(db)
        print("Seeding media…")
        seed_media(db)
        print("Seed complete.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
