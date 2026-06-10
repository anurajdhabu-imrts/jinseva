from typing import Literal

from pydantic import BaseModel, Field

MediaType = Literal["photo", "video"]


class MediaCreate(BaseModel):
    type: MediaType = "photo"
    title: str = ""
    category: str = "Uncategorized"
    url: str = Field(min_length=1)
    thumbnail: str = ""
    duration: str = ""
