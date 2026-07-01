from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from decimal import Decimal


class PaymentCreate(BaseModel):
    order_id: int
    method: str = "card"            # card, mobile_money, cash, eft
    amount: Decimal = Field(..., gt=0)
    currency: str = "ZAR"


class PaymentResponse(BaseModel):
    id: int
    order_id: int
    payer_id: Optional[int] = None
    amount: Decimal
    currency: str
    method: str
    status: str
    reference: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class PaymentStatusUpdate(BaseModel):
    status: str
    gateway_response: Optional[str] = None
