from datetime import date, datetime

from sqlalchemy import Date, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class ExpenseCategory(Base):
    __tablename__ = "expense_categories"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), unique=True, index=True, nullable=False)
    description: Mapped[str] = mapped_column(String(300), default="", nullable=False)
    color: Mapped[str] = mapped_column(String(20), default="#c8102e", nullable=False)
    monthly_budget: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    expenses: Mapped[list["Expense"]] = relationship(back_populates="category")

    def to_dict(self, count: int | None = None, total: int | None = None) -> dict:
        data = {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "color": self.color,
            "monthlyBudget": self.monthly_budget,
        }
        if count is not None:
            data["count"] = count
            data["total"] = int(total or 0)
        return data


class Expense(Base):
    __tablename__ = "expenses"

    id: Mapped[int] = mapped_column(primary_key=True)
    code: Mapped[str] = mapped_column(String(20), unique=True, index=True, nullable=False)
    category_id: Mapped[int] = mapped_column(
        ForeignKey("expense_categories.id", ondelete="RESTRICT"), index=True, nullable=False
    )
    description: Mapped[str] = mapped_column(String(300), default="", nullable=False)
    vendor: Mapped[str] = mapped_column(String(160), default="", nullable=False)
    amount: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    method: Mapped[str] = mapped_column(String(40), default="Cash", nullable=False)
    expense_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="paid", nullable=False)
    bill: Mapped[str] = mapped_column(String(160), default="", nullable=False)
    notes: Mapped[str] = mapped_column(Text, default="", nullable=False)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    category: Mapped["ExpenseCategory"] = relationship(back_populates="expenses")

    def to_dict(self) -> dict:
        return {
            "id": self.code,
            "category": self.category.name if self.category else None,
            "categoryId": self.category_id,
            "description": self.description,
            "vendor": self.vendor,
            "amount": self.amount,
            "method": self.method,
            "date": self.expense_date.isoformat() if self.expense_date else None,
            "status": self.status,
            "bill": self.bill,
            "notes": self.notes,
        }
