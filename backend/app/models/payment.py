from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Numeric, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.database import Base


class PaymentMethod(str, enum.Enum):
    CARD = "card"
    MOBILE_MONEY = "mobile_money"
    CASH = "cash"
    EFT = "eft"


class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    SUCCESS = "success"
    FAILED = "failed"
    REFUNDED = "refunded"


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    payer_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    # Payment details
    amount = Column(Numeric(10, 2), nullable=False)
    currency = Column(String(10), default="ZAR")
    method = Column(String(30), default=PaymentMethod.CARD, nullable=False)
    status = Column(String(30), default=PaymentStatus.PENDING, nullable=False)

    # Reference / gateway
    reference = Column(String(100), unique=True, nullable=True)
    gateway_response = Column(String(500), nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    order = relationship("Order", back_populates="payment")
    payer = relationship("User", back_populates="payments")

    def __repr__(self):
        return f"<Payment R{self.amount} [{self.status}]>"
