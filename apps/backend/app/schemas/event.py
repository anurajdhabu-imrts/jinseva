from datetime import date as _date

from pydantic import BaseModel, Field


class EventCreate(BaseModel):
    title: str = Field(min_length=1)
    type: str = "Festival"
    date: _date | None = None
    time: str = ""
    endTime: str = ""
    location: str = ""
    organizer: str = ""
    status: str = "upcoming"
    attendees: int = 0
    budget: int = 0
    description: str = ""
    image: str = ""
    allowDonations: bool = True


class EventUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1)
    type: str | None = None
    date: _date | None = None
    time: str | None = None
    endTime: str | None = None
    location: str | None = None
    organizer: str | None = None
    status: str | None = None
    attendees: int | None = None
    budget: int | None = None
    description: str | None = None
    image: str | None = None
    allowDonations: bool | None = None


class EventDonationCreate(BaseModel):
    donor: str = "Anonymous"
    amount: int = Field(gt=0)
    method: str = "UPI"
    date: _date | None = None
    message: str = ""
    anonymous: bool = False


class EventExpenseCreate(BaseModel):
    category: str = "Other"
    description: str = Field(min_length=1)
    vendor: str = ""
    amount: int = Field(gt=0)
    method: str = "Cash"
    date: _date | None = None
    status: str = "paid"
