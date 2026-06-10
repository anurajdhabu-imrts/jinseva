from datetime import datetime

from sqlalchemy import DateTime, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Media(Base):
    __tablename__ = "media"

    id: Mapped[int] = mapped_column(primary_key=True)
    code: Mapped[str] = mapped_column(String(20), unique=True, index=True, nullable=False)
    # "photo" or "video"
    media_type: Mapped[str] = mapped_column(String(10), default="photo", nullable=False)
    title: Mapped[str] = mapped_column(String(200), default="", nullable=False)
    category: Mapped[str] = mapped_column(String(80), default="Uncategorized", nullable=False)
    # Absolute URL (external) or a relative "/uploads/<file>" served by the API.
    url: Mapped[str] = mapped_column(String(500), nullable=False)
    thumbnail: Mapped[str] = mapped_column(String(500), default="", nullable=False)
    duration: Mapped[str] = mapped_column(String(20), default="", nullable=False)  # videos
    views: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    def to_dict(self) -> dict:
        return {
            "id": self.code,
            "type": self.media_type,
            "title": self.title,
            "caption": self.title,  # PhotoGallery uses `caption`
            "category": self.category,
            "url": self.url,
            "src": self.url,  # PhotoGallery uses `src`
            "thumb": self.thumbnail or self.url,  # VideoGallery uses `thumb`
            "thumbnail": self.thumbnail or self.url,
            "duration": self.duration,
            "views": self.views,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
        }
