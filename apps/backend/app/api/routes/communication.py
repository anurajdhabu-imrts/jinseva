from datetime import date as date_type

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.api.deps import require_permissions
from app.core.database import get_db
from app.models.communication import Announcement, MessageTemplate, Notification
from app.schemas.communication import (
    AnnouncementCreate,
    AnnouncementUpdate,
    NotificationCreate,
    TemplateCreate,
    TemplateUpdate,
)
from app.services.codes import generate_code

router = APIRouter(prefix="/communication", tags=["communication"])

can_view = require_permissions("communication.view")
can_create = require_permissions("communication.create")
can_update = require_permissions("communication.update")
can_delete = require_permissions("communication.delete")


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
    # Simulate a send: when status is "sent", stamp a plausible reach/opens.
    sent = 0
    opens = 0
    if body.status == "sent":
        sent = db.scalar(select(func.count()).select_from(Announcement)) or 0
        sent = 1000 + sent  # deterministic, non-random reach figure
        opens = round(sent * 0.7)
    ann = Announcement(
        code=generate_code(db, Announcement, Announcement.code, "ANN-", pad=3, start=1),
        title=body.title, message=body.message, audience=body.audience, channel=body.channel,
        status=body.status, ann_date=body.date or date_type.today(), sent=sent, opens=opens,
    )
    db.add(ann)
    db.commit()
    db.refresh(ann)
    return {"success": True, "data": ann.to_dict()}


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


# ── Notifications (admin feed) ──
@router.get("/notifications", dependencies=[Depends(can_view)])
def list_notifications(db: Session = Depends(get_db)):
    rows = db.scalars(select(Notification).order_by(Notification.created_at.desc())).all()
    data = [n.to_dict() for n in rows]
    return {"success": True, "count": len(data), "unread": sum(1 for n in rows if not n.read), "data": data}


@router.post("/notifications", status_code=status.HTTP_201_CREATED, dependencies=[Depends(can_create)])
def create_notification(body: NotificationCreate, db: Session = Depends(get_db)):
    n = Notification(type=body.type, title=body.title, message=body.message, audience=body.audience)
    db.add(n)
    db.commit()
    db.refresh(n)
    return {"success": True, "data": n.to_dict()}


@router.post("/notifications/{nid}/read", dependencies=[Depends(can_view)])
def mark_read(nid: int, db: Session = Depends(get_db)):
    n = db.get(Notification, nid)
    if n is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Notification not found")
    n.read = True
    db.commit()
    return {"success": True, "message": "Marked read"}


@router.post("/notifications/read-all", dependencies=[Depends(can_view)])
def mark_all_read(db: Session = Depends(get_db)):
    for n in db.scalars(select(Notification).where(Notification.read.is_(False))).all():
        n.read = True
    db.commit()
    return {"success": True, "message": "All marked read"}


@router.delete("/notifications/{nid}", dependencies=[Depends(can_delete)])
def delete_notification(nid: int, db: Session = Depends(get_db)):
    n = db.get(Notification, nid)
    if n is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Notification not found")
    db.delete(n)
    db.commit()
    return {"success": True, "message": "Notification deleted"}
