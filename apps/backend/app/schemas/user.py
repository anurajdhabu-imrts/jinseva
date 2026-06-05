from typing import Literal

from pydantic import BaseModel, EmailStr, Field

Status = Literal["active", "invited", "suspended"]


class UserCreate(BaseModel):
    name: str = Field(min_length=1)
    email: EmailStr
    password: str = Field(min_length=6)
    roleId: str = Field(min_length=1)
    status: Status = "invited"
    avatar: str | None = None


class UserUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1)
    email: EmailStr | None = None
    password: str | None = Field(default=None, min_length=6)
    roleId: str | None = Field(default=None, min_length=1)
    status: Status | None = None
    avatar: str | None = None
