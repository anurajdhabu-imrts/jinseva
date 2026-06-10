from datetime import date, datetime

from sqlalchemy import Date, DateTime, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Income(Base):
    """Non-donation income — hall rental, bhojanshala, dharmashala, etc."""

    __tablename__ = "income"

    id: Mapped[int] = mapped_column(primary_key=True)
    code: Mapped[str] = mapped_column(String(20), unique=True, index=True, nullable=False)
    category: Mapped[str] = mapped_column(String(80), default="Other", nullable=False)
    # Temple property/place this income belongs to (reports break down by it).
    property: Mapped[str] = mapped_column(String(80), default="", nullable=False)
    description: Mapped[str] = mapped_column(String(300), default="", nullable=False)
    source: Mapped[str] = mapped_column(String(160), default="", nullable=False)
    amount: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    method: Mapped[str] = mapped_column(String(40), default="UPI", nullable=False)
    income_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="paid", nullable=False)
    receipt: Mapped[str] = mapped_column(String(120), default="", nullable=False)
    notes: Mapped[str] = mapped_column(Text, default="", nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    def to_dict(self) -> dict:
        return {
            "id": self.code,
            "category": self.category,
            "property": self.property,
            "description": self.description,
            "source": self.source,
            "amount": self.amount,
            "method": self.method,
            "date": self.income_date.isoformat() if self.income_date else None,
            "status": self.status,
            "receipt": self.receipt,
            "notes": self.notes,
        }
