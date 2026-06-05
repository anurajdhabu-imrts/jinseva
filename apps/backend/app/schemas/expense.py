from datetime import date as _date

from pydantic import BaseModel, Field


class ExpenseCategoryCreate(BaseModel):
    name: str = Field(min_length=1)
    description: str = ""
    color: str | None = None
    monthlyBudget: int = 0


class ExpenseCategoryUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1)
    description: str | None = None
    color: str | None = None
    monthlyBudget: int | None = None


class ExpenseCreate(BaseModel):
    category: str = Field(min_length=1)
    description: str = Field(min_length=1)
    vendor: str = ""
    amount: int = Field(gt=0)
    method: str = "Cash"
    date: _date | None = None
    status: str = "paid"
    bill: str = ""
    notes: str = ""


class ExpenseUpdate(BaseModel):
    category: str | None = Field(default=None, min_length=1)
    description: str | None = Field(default=None, min_length=1)
    vendor: str | None = None
    amount: int | None = Field(default=None, gt=0)
    method: str | None = None
    date: _date | None = None
    status: str | None = None
    bill: str | None = None
    notes: str | None = None
