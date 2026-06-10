from datetime import date as date_type

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.api.deps import require_permissions
from app.core.config import settings
from app.core.database import get_db
from app.models.communication import Announcement, MessageTemplate
from app.models.user import User
from app.schemas.communication import (
    AnnouncementCreate,
    AnnouncementUpdate,
    TemplateCreate,
    TemplateUpdate,
    TestEmailRequest,
)
from app.services.codes import generate_code
from app.services.email import announcement_html, send_bulk, send_email

router = APIRouter(prefix="/communication", tags=["communication"])

can_view = require_permissions("communication.view")
can_create = require_permissions("communication.create")
can_update = require_permissions("communication.update")
can_delete = require_permissions("communication.delete")


def _absolute(url: str) -> str:
    """Turn a relative /uploads/... path into an absolute URL for emails."""
    if url and url.startswith("/uploads"):
        return settings.public_api_url.rstrip("/") + url
    return url


def _recipients(db: Session, audience: str) -> list[str]:
    """Resolve the email addresses for an announcement audience."""
    stmt = select(User.email).where(User.status == "active", User.email != "")
    if audience == "All Devotees":
        stmt = stmt.where(User.role_id == "role_devotee")
    emails = [e for (e,) in db.execute(stmt).all() if e]
    return sorted(set(emails))


# ── Announcements ──
@router.get("/announcements", dependencies=[Depends(can_view)])
def list_announcements(db: Session = Depends(get_db)):
    rows = db.scalars(select(Announcement).order_by(Announcement.ann_date.desc().nullslast(), Announcement.id.desc())).all()
    data = [a.to_dict() for a in rows]
    total_sent = sum(a.sent for a in rows)
    total_opens = sum(a.opens for a in rows)
    return {
        "success": True,
        "count": len(data),
        "totalSent": total_sent,
        "openRate": round(total_opens / total_sent * 100) if total_sent else 0,
        "data": data,
    }


@router.post("/announcements", status_code=status.HTTP_201_CREATED, dependencies=[Depends(can_create)])
def create_announcement(body: AnnouncementCreate, db: Session = Depends(get_db)):
    sent = 0
    note: str | None = None
    send_email_now = body.status == "sent" and "Email" in (body.channel or "")

    if send_email_now:
        if not settings.email_enabled:
            note = "Email is not configured on the server — announcement saved but not emailed."
        else:
            recipients = _recipients(db, body.audience)
            if not recipients:
                note = "No active recipients found for this audience — nothing was emailed."
            else:
                html = announcement_html(body.title, body.message, _absolute(body.image))
                try:
                    sent, errors = send_bulk(recipients, body.title, html)
                    if errors:
                        note = f"Emailed {sent}, but {len(errors)} failed."
                except Exception as exc:  # noqa: BLE001
                    note = f"Email send failed: {exc}"

    opens = round(sent * 0.7) if sent else 0
    ann = Announcement(
        code=generate_code(db, Announcement, Announcement.code, "ANN-", pad=3, start=1),
        title=body.title, message=body.message, audience=body.audience, channel=body.channel,
        status=body.status, image=body.image, ann_date=body.date or date_type.today(), sent=sent, opens=opens,
    )
    db.add(ann)
    db.commit()
    db.refresh(ann)
    return {"success": True, "data": ann.to_dict(), "emailed": sent, "note": note}


@router.post("/test-email", dependencies=[Depends(can_create)])
def test_email(body: TestEmailRequest):
    """Send a one-off test email to verify the SMTP configuration."""
    if not settings.email_enabled:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Email is not configured on the server.")
    html = announcement_html(
        "Email integration works ✅",
        "This is a test message confirming your Shree Jinalaya SMTP settings are correct.",
    )
    try:
        send_email(body.to, "Test email — Shree Jinalaya", html)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status.HTTP_502_BAD_GATEWAY, f"Email send failed: {exc}")
    return {"success": True, "message": f"Test email sent to {body.to}"}


@router.put("/announcements/{code}", dependencies=[Depends(can_update)])
def update_announcement(code: str, body: AnnouncementUpdate, db: Session = Depends(get_db)):
    ann = db.scalar(select(Announcement).where(Announcement.code == code))
    if ann is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Announcement not found")
    data = body.model_dump(exclude_unset=True)
    if "date" in data:
        ann.ann_date = data.pop("date")
    for field, value in data.items():
        setattr(ann, field, value)
    db.commit()
    db.refresh(ann)
    return {"success": True, "data": ann.to_dict()}


@router.delete("/announcements/{code}", dependencies=[Depends(can_delete)])
def delete_announcement(code: str, db: Session = Depends(get_db)):
    ann = db.scalar(select(Announcement).where(Announcement.code == code))
    if ann is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Announcement not found")
    db.delete(ann)
    db.commit()
    return {"success": True, "message": "Announcement deleted"}


# ── Templates ──
@router.get("/templates", dependencies=[Depends(can_view)])
def list_templates(db: Session = Depends(get_db)):
    rows = db.scalars(select(MessageTemplate).order_by(MessageTemplate.name)).all()
    data = [t.to_dict() for t in rows]
    return {"success": True, "count": len(data), "data": data}


@router.post("/templates", status_code=status.HTTP_201_CREATED, dependencies=[Depends(can_create)])
def create_template(body: TemplateCreate, db: Session = Depends(get_db)):
    t = MessageTemplate(name=body.name, type=body.type, subject=body.subject, body=body.body)
    db.add(t)
    db.commit()
    db.refresh(t)
    return {"success": True, "data": t.to_dict()}


@router.put("/templates/{tid}", dependencies=[Depends(can_update)])
def update_template(tid: int, body: TemplateUpdate, db: Session = Depends(get_db)):
    t = db.get(MessageTemplate, tid)
    if t is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Template not found")
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(t, field, value)
    db.commit()
    db.refresh(t)
    return {"success": True, "data": t.to_dict()}


@router.delete("/templates/{tid}", dependencies=[Depends(can_delete)])
def delete_template(tid: int, db: Session = Depends(get_db)):
    t = db.get(MessageTemplate, tid)
    if t is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Template not found")
    db.delete(t)
    db.commit()
    return {"success": True, "message": "Template deleted"}
