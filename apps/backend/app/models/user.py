import uuid
from datetime import datetime

from sqlalchemy import DateTime, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base

USER_STATUSES = ("active", "invited", "suspended")


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    email: Mapped[str] = mapped_column(
        String(255), unique=True, index=True, nullable=False
    )
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    # References Role.key (e.g. "role_admin"). Kept as a string so the API shape
    # matches the dashboard's `roleId`.
    role_id: Mapped[str] = mapped_column(String(80), index=True, nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="invited", nullable=False)
    avatar: Mapped[str] = mapped_column(String(500), default="", nullable=False)
    last_active: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    def avatar_url(self, color: str = "c8102e") -> str:
        if self.avatar:
            return self.avatar
        from urllib.parse import quote

        return (
            f"https://ui-avatars.com/api/?name={quote(self.name)}"
            f"&background={color}&color=fff&bold=true"
        )
