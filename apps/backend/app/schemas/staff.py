from datetime import date as _date

from pydantic import BaseModel, Field


class StaffCreate(BaseModel):
    name: str = Field(min_length=1)
    role: str = ""
    department: str = ""
    joinDate: _date | None = None
    phone: str = ""
    email: str = ""
    salary: int = 0
    status: str = "active"
    avatar: str = ""


class StaffUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1)
    role: str | None = None
    department: str | None = None
    joinDate: _date | None = None
    phone: str | None = None
    email: str | None = None
    salary: int | None = None
    status: str | None = None
    avatar: str | None = None


class VolunteerCreate(BaseModel):
    name: str = Field(min_length=1)
    area: str = ""
    hours: float = 0
    joined: _date | None = None
    phone: str = ""
    email: str = ""
    city: str = ""
    availability: str = ""
    skills: str = ""
    status: str = "active"


class VolunteerUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1)
    area: str | None = None
    hours: float | None = None
    joined: _date | None = None
    phone: str | None = None
    email: str | None = None
    city: str | None = None
    availability: str | None = None
    skills: str | None = None
    status: str | None = None


class AttendanceMark(BaseModel):
    staffId: str = Field(min_length=1)
    date: _date | None = None
    status: str = "present"  # present|absent|late|leave
    checkIn: str = ""
    checkOut: str = ""
