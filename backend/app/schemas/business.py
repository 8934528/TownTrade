from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class BusinessBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=200)
    category: str = Field(..., min_length=2, max_length=100)
    description: Optional[str] = None
    tags: Optional[str] = None          # Comma-separated: "spaza,groceries"
    address: Optional[str] = None
    city: Optional[str] = None
    phone: Optional[str] = None
    whatsapp: Optional[str] = None
    logo_url: Optional[str] = None
    banner_url: Optional[str] = None


class BusinessCreate(BusinessBase):
    pass


class BusinessUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    phone: Optional[str] = None
    whatsapp: Optional[str] = None
    logo_url: Optional[str] = None
    banner_url: Optional[str] = None
    is_open: Optional[bool] = None


class BusinessSummary(BaseModel):
    id: int
    name: str
    category: str
    tags: Optional[str] = None
    city: Optional[str] = None
    rating: Optional[float] = None
    is_open: bool
    logo_url: Optional[str] = None
    total_reviews: int = 0

    class Config:
        from_attributes = True


class Business(BusinessBase):
    id: int
    user_id: int
    is_active: bool
    is_verified: bool
    is_open: bool
    rating: Optional[float] = None
    total_reviews: int = 0
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
