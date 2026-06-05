from datetime import date, datetime

from sqlalchemy import Date, DateTime, Float, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Supplier(Base):
    __tablename__ = "suppliers"

    id: Mapped[int] = mapped_column(primary_key=True)
    code: Mapped[str] = mapped_column(String(20), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(160), unique=True, index=True, nullable=False)
    category: Mapped[str] = mapped_column(String(120), default="", nullable=False)
    phone: Mapped[str] = mapped_column(String(40), default="", nullable=False)
    email: Mapped[str] = mapped_column(String(255), default="", nullable=False)
    rating: Mapped[float] = mapped_column(Float, default=0, nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="active", nullable=False)
    orders: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    items: Mapped[list["InventoryItem"]] = relationship(back_populates="supplier")

    def to_dict(self, item_count: int | None = None) -> dict:
        data = {
            "id": self.code,
            "name": self.name,
            "category": self.category,
            "phone": self.phone,
            "email": self.email,
            "rating": self.rating,
            "status": self.status,
            "orders": self.orders,
        }
        if item_count is not None:
            data["itemCount"] = item_count
        return data


class InventoryItem(Base):
    __tablename__ = "inventory_items"

    id: Mapped[int] = mapped_column(primary_key=True)
    code: Mapped[str] = mapped_column(String(20), unique=True, index=True, nullable=False)
    item: Mapped[str] = mapped_column(String(160), nullable=False)
    category: Mapped[str] = mapped_column(String(120), default="", nullable=False)
    quantity: Mapped[float] = mapped_column(Float, default=0, nullable=False)
    unit: Mapped[str] = mapped_column(String(20), default="pcs", nullable=False)
    min_stock: Mapped[float] = mapped_column(Float, default=0, nullable=False)
    supplier_id: Mapped[int | None] = mapped_column(
        ForeignKey("suppliers.id", ondelete="SET NULL"), index=True, nullable=True
    )
    cost_per_unit: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    last_restock: Mapped[date | None] = mapped_column(Date, nullable=True)
    notes: Mapped[str] = mapped_column(Text, default="", nullable=False)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    supplier: Mapped["Supplier | None"] = relationship(back_populates="items")

    def to_dict(self) -> dict:
        return {
            "id": self.code,
            "item": self.item,
            "category": self.category,
            "quantity": self.quantity,
            "unit": self.unit,
            "minStock": self.min_stock,
            "supplier": self.supplier.name if self.supplier else "",
            "supplierId": self.supplier.code if self.supplier else None,
            "costPerUnit": self.cost_per_unit,
            "lastRestock": self.last_restock.isoformat() if self.last_restock else None,
            "notes": self.notes,
            "lowStock": self.quantity <= self.min_stock,
        }
