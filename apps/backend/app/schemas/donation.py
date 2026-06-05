from datetime import date as _date

from pydantic import BaseModel, Field


class DonationCreate(BaseModel):
    donor: str = "Anonymous"
    email: str = ""
    phone: str = ""
    type: str = ""
    amount: int = Field(gt=0)
    method: str = "UPI"
    date: _date | None = None
    status: str = "paid"
    purpose: str = ""
    receipt: str = ""
    anonymous: bool = False


class DonationUpdate(BaseModel):
    donor: str | None = None
    email: str | None = None
    phone: str | None = None
    type: str | None = None
    amount: int | None = Field(default=None, gt=0)
    method: str | None = None
    date: _date | None = None
    status: str | None = None
    purpose: str | None = None
    receipt: str | None = None
    anonymous: bool | None = None
