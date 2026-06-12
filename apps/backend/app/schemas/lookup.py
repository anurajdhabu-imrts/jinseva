from pydantic import BaseModel, Field


class LookupCreate(BaseModel):
    category: str = Field(min_length=1, max_length=50)
    label: str = Field(min_length=1, max_length=160)
    sortOrder: int = 0


class LookupUpdate(BaseModel):
    label: str | None = Field(default=None, max_length=160)
    sortOrder: int | None = None
    active: bool | None = None
