from datetime import date as _date

from pydantic import BaseModel, Field


class AnnouncementCreate(BaseModel):
    title: str = Field(min_length=1)
    message: str = ""
    audience: str = "All Devotees"
    channel: str = "Email"
    status: str = "sent"  # sent|scheduled|draft
    date: _date | None = None


class AnnouncementUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1)
    message: str | None = None
    audience: str | None = None
    channel: str | None = None
    status: str | None = None
    date: _date | None = None


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


class NotificationCreate(BaseModel):
    type: str = "message"
    title: str = Field(min_length=1)
    message: str = ""
    audience: str = ""


class ProfileUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1)
    avatar: str | None = None
    password: str | None = Field(default=None, min_length=6)
