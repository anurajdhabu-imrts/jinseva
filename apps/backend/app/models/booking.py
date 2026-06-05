from datetime import date, datetime

from sqlalchemy import Date, DateTime, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base

BOOKING_TYPES = ("pooja", "hall")
BOOKING_STATUSES = ("pending", "confirmed", "completed", "cancelled")


class Booking(Base):
    """Pooja and hall bookings."""

    __tablename__ = "bookings"

    id: Mapped[int] = mapped_column(primary_key=True)
    code: Mapped[str] = mapped_column(String(20), unique=True, index=True, nullable=False)
    devotee: Mapped[str] = mapped_column(String(160), nullable=False)
    email: Mapped[str] = mapped_column(String(255), default="", nullable=False)
    phone: Mapped[str] = mapped_column(String(40), default="", nullable=False)
    # "pooja" or "hall"
    booking_type: Mapped[str] = mapped_column(String(20), default="pooja", nullable=False)
    # The pooja name (for pooja bookings) or the hall/facility name (for hall bookings).
    pooja: Mapped[str] = mapped_column(String(160), default="", nullable=False)
    hall: Mapped[str] = mapped_column(String(160), default="", nullable=False)
    booking_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    time: Mapped[str] = mapped_column(String(10), default="", nullable=False)
    priest: Mapped[str] = mapped_column(String(160), default="Any", nullable=False)
    amount: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="pending", nullable=False)
    notes: Mapped[str] = mapped_column(Text, default="", nullable=False)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    def to_dict(self) -> dict:
        return {
            "id": self.code,
            "devotee": self.devotee,
            "email": self.email,
            "phone": self.phone,
            "bookingType": self.booking_type,
            "pooja": self.pooja,
            "hall": self.hall,
            "date": self.booking_date.isoformat() if self.booking_date else None,
            "time": self.time,
            "priest": self.priest,
            "amount": self.amount,
            "status": self.status,
            "notes": self.notes,
        }
