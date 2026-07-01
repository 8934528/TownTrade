from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from decimal import Decimal


class ProductBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    price: Decimal = Field(..., gt=0)
    category: Optional[str] = None
    tags: Optional[str] = None
    stock: int = Field(default=0, ge=0)
    low_stock_threshold: int = Field(default=5, ge=0)
    image_url: Optional[str] = None
    is_featured: Optional[bool] = False


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[Decimal] = None
    category: Optional[str] = None
    tags: Optional[str] = None
    stock: Optional[int] = None
    low_stock_threshold: Optional[int] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = None
    is_featured: Optional[bool] = None


class Product(ProductBase):
    id: int
    business_id: int
    is_active: bool
    is_low_stock: bool = False
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
