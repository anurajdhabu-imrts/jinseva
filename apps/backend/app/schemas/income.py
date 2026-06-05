from datetime import date as _date

from pydantic import BaseModel, Field


class IncomeCreate(BaseModel):
    category: str = "Other"
    description: str = Field(min_length=1)
    source: str = ""
    amount: int = Field(gt=0)
    method: str = "UPI"
    date: _date | None = None
    status: str = "paid"
    receipt: str = ""
    notes: str = ""


class IncomeUpdate(BaseModel):
    category: str | None = None
    description: str | None = Field(default=None, min_length=1)
    source: str | None = None
    amount: int | None = Field(default=None, gt=0)
    method: str | None = None
    date: _date | None = None
    status: str | None = None
    receipt: str | None = None
    notes: str | None = None
