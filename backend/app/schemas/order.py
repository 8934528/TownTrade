from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from decimal import Decimal


class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(..., gt=0)


class OrderItemResponse(BaseModel):
    id: int
    product_id: Optional[int] = None
    product_name: str
    quantity: int
    unit_price: Decimal
    subtotal: Decimal

    class Config:
        from_attributes = True


class OrderCreate(BaseModel):
    business_id: int
    items: List[OrderItemCreate]
    delivery_type: str = "delivery"           # "delivery" or "pickup"
    delivery_address: Optional[str] = None
    delivery_notes: Optional[str] = None


class OrderUpdate(BaseModel):
    status: Optional[str] = None
    delivery_address: Optional[str] = None
    delivery_notes: Optional[str] = None


class Order(BaseModel):
    id: int
    customer_id: Optional[int] = None
    business_id: Optional[int] = None
    status: str
    delivery_type: str
    total_amount: Decimal
    delivery_address: Optional[str] = None
    delivery_notes: Optional[str] = None
    tracking_code: Optional[str] = None
    is_paid: bool = False
    created_at: datetime
    updated_at: Optional[datetime] = None
    delivered_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class OrderWithItems(Order):
    items: List[OrderItemResponse] = []

    class Config:
        from_attributes = True


class TrackingInfo(BaseModel):
    tracking_code: str
    status: str
    business_name: Optional[str] = None
    delivery_type: str
    delivery_address: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
