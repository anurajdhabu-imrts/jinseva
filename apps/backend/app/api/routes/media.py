import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile, status
from sqlalchemy import distinct, func, or_, select
from sqlalchemy.orm import Session

from app.api.deps import require_permissions
from app.core.database import get_db
from app.models.media import Media
from app.schemas.media import MediaCreate
from app.services.codes import generate_code

router = APIRouter(prefix="/media", tags=["media"])

# apps/backend/uploads (served as /uploads by the static mount in main.py)
UPLOAD_DIR = Path(__file__).resolve().parents[3] / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

can_view = require_permissions("media.view")
can_create = require_permissions("media.create")
can_delete = require_permissions("media.delete")


def _get_or_404(db: Session, code: str) -> Media:
    m = db.scalar(select(Media).where(Media.code == code))
    if m is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Media not found")
    return m


@router.get("/categories", dependencies=[Depends(can_view)])
def categories(db: Session = Depends(get_db)):
    rows = db.scalars(select(distinct(Media.category)).order_by(Media.category)).all()
    return {"success": True, "data": [c for c in rows if c]}


@router.get("", dependencies=[Depends(can_view)])
def list_media(
    type_filter: str | None = Query(default=None, alias="type"),
    category: str | None = None,
    q: str | None = None,
    db: Session = Depends(get_db),
):
    stmt = select(Media).order_by(Media.created_at.desc(), Media.id.desc())
    if type_filter:
        stmt = stmt.where(Media.media_type == type_filter)
    if category and category != "All":
        stmt = stmt.where(Media.category == category)
    if q:
        like = f"%{q}%"
        stmt = stmt.where(or_(Media.title.ilike(like), Media.category.ilike(like)))
    rows = db.scalars(stmt).all()
    data = [m.to_dict() for m in rows]
    return {"success": True, "count": len(data), "data": data}


@router.post("", status_code=status.HTTP_201_CREATED, dependencies=[Depends(can_create)])
def create_media(body: MediaCreate, db: Session = Depends(get_db)):
    m = Media(
        code=generate_code(db, Media, Media.code, "MED-", pad=3, start=1),
        media_type=body.type,
        title=body.title,
        category=body.category or "Uncategorized",
        url=body.url,
        thumbnail=body.thumbnail,
        duration=body.duration,
    )
    db.add(m)
    db.commit()
    db.refresh(m)
    return {"success": True, "data": m.to_dict()}


@router.post("/upload", status_code=status.HTTP_201_CREATED, dependencies=[Depends(can_create)])
async def upload_media(
    files: list[UploadFile] = File(...),
    category: str = Form("Uncategorized"),
    db: Session = Depends(get_db),
):
    created = []
    for f in files:
        ext = (Path(f.filename or "").suffix or "").lower()
        fname = f"{uuid.uuid4().hex}{ext}"
        dest = UPLOAD_DIR / fname
        with open(dest, "wb") as out:
            out.write(await f.read())
        ctype = f.content_type or ""
        media_type = "video" if ctype.startswith("video") else "photo"
        m = Media(
            code=generate_code(db, Media, Media.code, "MED-", pad=3, start=1),
            media_type=media_type,
            title=Path(f.filename or fname).stem,
            category=category or "Uncategorized",
            url=f"/uploads/{fname}",
        )
        db.add(m)
        db.flush()
        created.append(m)
    db.commit()
    return {"success": True, "count": len(created), "data": [m.to_dict() for m in created]}


@router.post(
    "/file",
    dependencies=[Depends(require_permissions("events.create", "events.update", "media.create", "communication.create"))],
)
async def upload_file(file: UploadFile = File(...)):
    """Save a single image and return its URL (no gallery record).
    Used for entity banners like event images."""
    ext = (Path(file.filename or "").suffix or "").lower()
    fname = f"{uuid.uuid4().hex}{ext}"
    dest = UPLOAD_DIR / fname
    with open(dest, "wb") as out:
        out.write(await file.read())
    return {"success": True, "url": f"/uploads/{fname}"}


@router.delete("/{code}", dependencies=[Depends(can_delete)])
def delete_media(code: str, db: Session = Depends(get_db)):
    m = _get_or_404(db, code)
    # Remove the local file if it was an upload.
    if m.url.startswith("/uploads/"):
        fp = UPLOAD_DIR / Path(m.url).name
        if fp.exists():
            try:
                fp.unlink()
            except OSError:
                pass
    db.delete(m)
    db.commit()
    return {"success": True, "message": "Media deleted"}
