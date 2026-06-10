from datetime import date as _date

from pydantic import BaseModel, EmailStr, Field


class AnnouncementCreate(BaseModel):
    title: str = Field(min_length=1)
    message: str = ""
    audience: str = "All Devotees"
    channel: str = "Email"
    status: str = "sent"  # sent|scheduled|draft
    image: str = ""
    date: _date | None = None


class AnnouncementUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1)
    message: str | None = None
    audience: str | None = None
    channel: str | None = None
    status: str | None = None
    date: _date | None = None


class TestEmailRequest(BaseModel):
    to: EmailStr


class TemplateCreate(BaseModel):
    name: str = Field(min_length=1)
    type: str = "Email"
    subject: str = ""
    body: str = ""


class TemplateUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1)
    type: str | None = None
    subject: str | None = None
    body: str | None = None


class ProfileUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1)
    avatar: str | None = None
    password: str | None = Field(default=None, min_length=6)
    phone: str | None = None
    city: str | None = None
    gotra: str | None = None
    dob: _date | None = None
    bio: str | None = None


class ChangePasswordRequest(BaseModel):
    currentPassword: str = Field(min_length=1)
    newPassword: str = Field(min_length=6)
