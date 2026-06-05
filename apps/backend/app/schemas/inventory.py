from datetime import date as _date

from pydantic import BaseModel, Field


class SupplierCreate(BaseModel):
    name: str = Field(min_length=1)
    category: str = ""
    phone: str = ""
    email: str = ""
    rating: float = 0
    status: str = "active"
    orders: int = 0


class SupplierUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1)
    category: str | None = None
    phone: str | None = None
    email: str | None = None
    rating: float | None = None
    status: str | None = None
    orders: int | None = None


class InventoryCreate(BaseModel):
    item: str = Field(min_length=1)
    category: str = ""
    quantity: float = 0
    unit: str = "pcs"
    minStock: float = 0
    supplier: str = ""  # supplier name — linked/created automatically
    costPerUnit: int = 0
    lastRestock: _date | None = None
    notes: str = ""


class InventoryUpdate(BaseModel):
    item: str | None = Field(default=None, min_length=1)
    category: str | None = None
    quantity: float | None = None
    unit: str | None = None
    minStock: float | None = None
    supplier: str | None = None
    costPerUnit: int | None = None
    lastRestock: _date | None = None
    notes: str | None = None


class RestockRequest(BaseModel):
    quantity: float = Field(gt=0)
    date: _date | None = None
