from datetime import datetime

from sqlalchemy import Boolean, DateTime, Integer, String, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Lookup(Base):
    """A single option in an admin-managed dropdown list.

    `category` groups options (e.g. "event_type", "property", "donation_purpose",
    "payment_method"); `label` is the visible/stored value. New categories can be
    added without a schema change.
    """

    __tablename__ = "lookups"
    __table_args__ = (UniqueConstraint("category", "label", name="uq_lookup_cat_label"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    category: Mapped[str] = mapped_column(String(50), index=True, nullable=False)
    label: Mapped[str] = mapped_column(String(160), nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "category": self.category,
            "label": self.label,
            "sortOrder": self.sort_order,
            "active": self.active,
        }
