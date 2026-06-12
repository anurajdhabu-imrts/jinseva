from datetime import datetime

from sqlalchemy import Boolean, DateTime, String, func
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Role(Base):
    __tablename__ = "roles"

    id: Mapped[int] = mapped_column(primary_key=True)
    # Stable string key (e.g. "role_admin"). Exposed as `id` in the API so the
    # dashboard can reference roles the same way it does in its mock data.
    key: Mapped[str] = mapped_column(String(80), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str] = mapped_column(String(500), default="", nullable=False)
    color: Mapped[str] = mapped_column(String(20), default="#FF9644", nullable=False)
    # True => built-in role that cannot be deleted.
    system: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    # Permission codes ("<module>.<action>") this role grants.
    permission_ids: Mapped[list[str]] = mapped_column(
        ARRAY(String), default=list, nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    def to_dict(self, user_count: int | None = None) -> dict:
        data = {
            "id": self.key,
            "name": self.name,
            "description": self.description,
            "color": self.color,
            "system": self.system,
            "permissionIds": list(self.permission_ids or []),
        }
        if user_count is not None:
            data["userCount"] = user_count
        return data
