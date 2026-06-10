"""Public, unauthenticated endpoints for the marketing website."""

from fastapi import APIRouter, Depends
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.models.contact import ContactMessage
from app.models.event import Event
from app.models.media import Media
from app.services.email import announcement_html, send_email

router = APIRouter(prefix="/public", tags=["public"])


class ContactRequest(BaseModel):
    name: str = Field(min_length=1)
    email: EmailStr
    phone: str = ""
    subject: str = "General Inquiry"
    message: str = Field(min_length=1)


@router.get("/festivals")
def public_festivals(db: Session = Depends(get_db)):
    """Upcoming / ongoing events shown on the public Festivals page (no auth)."""
    rows = db.scalars(
        select(Event)
        .where(Event.status.in_(["upcoming", "ongoing"]))
        .order_by(Event.event_date.asc().nullslast(), Event.id.asc())
    ).all()
    data = [
        {
            "id": e.code,
            "title": e.title,
            "type": e.type,
            "category": e.category,
            "date": e.event_date.isoformat() if e.event_date else None,
            "time": e.time,
            "location": e.location,
            "description": e.description,
            "image": e.image,
        }
        for e in rows
    ]
    return {"success": True, "count": len(data), "data": data}


@router.get("/gallery")
def public_gallery(db: Session = Depends(get_db)):
    """Photos shown on the public Gallery page (no auth)."""
    rows = db.scalars(
        select(Media)
        .where(Media.media_type == "photo")
        .order_by(Media.created_at.desc(), Media.id.desc())
    ).all()
    return {"success": True, "count": len(rows), "data": [m.to_dict() for m in rows]}


@router.post("/contact")
def submit_contact(body: ContactRequest, db: Session = Depends(get_db)):
    """Store a contact-form message and email both the temple and the sender."""
    msg = ContactMessage(
        name=body.name.strip(),
        email=str(body.email),
        phone=body.phone.strip(),
        subject=body.subject.strip() or "General Inquiry",
        message=body.message.strip(),
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)

    note = None
    if settings.email_enabled:
        # 1) Notify the temple of the new enquiry.
        admin_body = (
            f"New enquiry from the website.\n\n"
            f"Name: {body.name}\n"
            f"Email: {body.email}\n"
            f"Phone: {body.phone or '—'}\n"
            f"Subject: {body.subject}\n\n"
            f"Message:\n{body.message}"
        )
        # 2) Acknowledge the sender.
        ack_body = (
            f"Dear {body.name},\n\n"
            f"Jai Jinendra! Thank you for reaching out to Shree Mahavir Jain Derasar. "
            f"We have received your message regarding \"{body.subject}\" and our team will "
            f"get back to you shortly.\n\n"
            f"Your message:\n{body.message}\n\n"
            f"With warm regards,\nShree Jinalaya"
        )
        try:
            send_email(settings.mail_from, f"Website enquiry: {body.subject}", announcement_html(f"New enquiry — {body.subject}", admin_body))
            send_email(str(body.email), "We received your message — Shree Jinalaya", announcement_html("We received your message 🙏", ack_body))
        except Exception as exc:  # noqa: BLE001 — message is still saved
            note = f"Your message was saved, but the confirmation email could not be sent ({exc})."

    return {
        "success": True,
        "message": "Thank you! Your message has been received. We'll be in touch soon.",
        "note": note,
    }
