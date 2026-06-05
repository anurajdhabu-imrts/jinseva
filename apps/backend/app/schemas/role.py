from pydantic import BaseModel, Field


class RoleCreate(BaseModel):
    name: str = Field(min_length=1)
    description: str = ""
    color: str | None = None
    permissionIds: list[str] = Field(default_factory=list)


class RoleUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1)
    description: str | None = None
    color: str | None = None
    permissionIds: list[str] | None = None
