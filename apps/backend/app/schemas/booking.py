from datetime import date as _date
from typing import Literal

from pydantic import BaseModel, Field

BookingType = Literal["pooja", "hall"]
BookingStatus = Literal["pending", "confirmed", "completed", "cancelled"]


class BookingCreate(BaseModel):
    devotee: str = Field(min_length=1)
    email: str = ""
    phone: str = ""
    bookingType: BookingType = "pooja"
    pooja: str = ""
    hall: str = ""
    date: _date | None = None
    time: str = ""
    priest: str = "Any"
    amount: int = 0
    status: BookingStatus = "pending"
    notes: str = ""


class BookingUpdate(BaseModel):
    devotee: str | None = Field(default=None, min_length=1)
    email: str | None = None
    phone: str | None = None
    bookingType: BookingType | None = None
    pooja: str | None = None
    hall: str | None = None
    date: _date | None = None
    time: str | None = None
    priest: str | None = None
    amount: int | None = None
    status: BookingStatus | None = None
    notes: str | None = None
