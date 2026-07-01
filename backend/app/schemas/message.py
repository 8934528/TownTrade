from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class MessageCreate(BaseModel):
    receiver_business_id: int
    subject: Optional[str] = None
    content: str = Field(..., min_length=1, max_length=2000)


class MessageResponse(BaseModel):
    id: int
    sender_id: int
    receiver_business_id: int
    subject: Optional[str] = None
    content: str
    is_read: bool
    created_at: datetime
    read_at: Optional[datetime] = None

    class Config:
        from_attributes = True
