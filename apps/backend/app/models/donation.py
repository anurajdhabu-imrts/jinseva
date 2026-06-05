from datetime import date, datetime

from sqlalchemy import Boolean, Date, DateTime, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Donation(Base):
    """General (non event-specific) donations — the Donations module."""

    __tablename__ = "donations"

    id: Mapped[int] = mapped_column(primary_key=True)
    code: Mapped[str] = mapped_column(String(20), unique=True, index=True, nullable=False)
    donor: Mapped[str] = mapped_column(String(160), default="Anonymous", nullable=False)
    email: Mapped[str] = mapped_column(String(255), default="", nullable=False)
    phone: Mapped[str] = mapped_column(String(40), default="", nullable=False)
    type: Mapped[str] = mapped_column(String(80), default="", nullable=False)
    amount: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    method: Mapped[str] = mapped_column(String(40), default="UPI", nullable=False)
    donation_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="paid", nullable=False)
    purpose: Mapped[str] = mapped_column(String(500), default="", nullable=False)
    receipt: Mapped[str] = mapped_column(String(60), default="", nullable=False)
    anonymous: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    def to_dict(self) -> dict:
        return {
            "id": self.code,
            "donor": "Anonymous" if self.anonymous else self.donor,
            "email": "-" if self.anonymous else self.email,
            "phone": "-" if self.anonymous else self.phone,
            "type": self.type,
            "amount": self.amount,
            "method": self.method,
            "date": self.donation_date.isoformat() if self.donation_date else None,
            "status": self.status,
            "purpose": self.purpose,
            "receipt": self.receipt,
            "anonymous": self.anonymous,
        }
