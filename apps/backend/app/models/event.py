from datetime import date, datetime

from sqlalchemy import (
    Boolean,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Event(Base):
    __tablename__ = "events"

    id: Mapped[int] = mapped_column(primary_key=True)
    code: Mapped[str] = mapped_column(String(20), unique=True, index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    type: Mapped[str] = mapped_column(String(60), default="Festival", nullable=False)
    event_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    time: Mapped[str] = mapped_column(String(10), default="", nullable=False)
    end_time: Mapped[str] = mapped_column(String(10), default="", nullable=False)
    location: Mapped[str] = mapped_column(String(200), default="", nullable=False)
    organizer: Mapped[str] = mapped_column(String(200), default="", nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="upcoming", nullable=False)
    attendees: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    budget: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    description: Mapped[str] = mapped_column(Text, default="", nullable=False)
    image: Mapped[str] = mapped_column(String(500), default="", nullable=False)
    allow_donations: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    donations: Mapped[list["EventDonation"]] = relationship(
        back_populates="event", cascade="all, delete-orphan"
    )
    expenses: Mapped[list["EventExpense"]] = relationship(
        back_populates="event", cascade="all, delete-orphan"
    )

    def to_dict(self, raised: int | None = None) -> dict:
        return {
            "id": self.code,
            "title": self.title,
            "type": self.type,
            "date": self.event_date.isoformat() if self.event_date else None,
            "time": self.time,
            "endTime": self.end_time,
            "location": self.location,
            "organizer": self.organizer,
            "status": self.status,
            "attendees": self.attendees,
            "budget": self.budget,
            "raised": int(raised or 0),
            "description": self.description,
            "image": self.image,
            "allowDonations": self.allow_donations,
        }


class EventDonation(Base):
    __tablename__ = "event_donations"

    id: Mapped[int] = mapped_column(primary_key=True)
    code: Mapped[str] = mapped_column(String(20), unique=True, index=True, nullable=False)
    event_id: Mapped[int] = mapped_column(
        ForeignKey("events.id", ondelete="CASCADE"), index=True, nullable=False
    )
    donor: Mapped[str] = mapped_column(String(160), default="Anonymous", nullable=False)
    amount: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    method: Mapped[str] = mapped_column(String(40), default="UPI", nullable=False)
    donation_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    message: Mapped[str] = mapped_column(String(500), default="", nullable=False)
    anonymous: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    event: Mapped["Event"] = relationship(back_populates="donations")

    def to_dict(self, event_code: str | None = None) -> dict:
        return {
            "id": self.code,
            "eventId": event_code or (self.event.code if self.event else None),
            "donor": "Anonymous" if self.anonymous else self.donor,
            "amount": self.amount,
            "method": self.method,
            "date": self.donation_date.isoformat() if self.donation_date else None,
            "message": self.message,
            "anonymous": self.anonymous,
        }


class EventExpense(Base):
    __tablename__ = "event_expenses"

    id: Mapped[int] = mapped_column(primary_key=True)
    code: Mapped[str] = mapped_column(String(20), unique=True, index=True, nullable=False)
    event_id: Mapped[int] = mapped_column(
        ForeignKey("events.id", ondelete="CASCADE"), index=True, nullable=False
    )
    category: Mapped[str] = mapped_column(String(80), default="Other", nullable=False)
    description: Mapped[str] = mapped_column(String(300), default="", nullable=False)
    vendor: Mapped[str] = mapped_column(String(160), default="", nullable=False)
    amount: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    method: Mapped[str] = mapped_column(String(40), default="Cash", nullable=False)
    expense_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="paid", nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    event: Mapped["Event"] = relationship(back_populates="expenses")

    def to_dict(self, event_code: str | None = None) -> dict:
        return {
            "id": self.code,
            "eventId": event_code or (self.event.code if self.event else None),
            "category": self.category,
            "description": self.description,
            "vendor": self.vendor,
            "amount": self.amount,
            "method": self.method,
            "date": self.expense_date.isoformat() if self.expense_date else None,
            "status": self.status,
        }
