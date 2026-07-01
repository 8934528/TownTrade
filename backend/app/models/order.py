import uuid
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, Numeric, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.database import Base


class OrderStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PREPARING = "preparing"
    READY = "ready"
    OUT_FOR_DELIVERY = "out_for_delivery"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


class DeliveryType(str, enum.Enum):
    DELIVERY = "delivery"
    PICKUP = "pickup"


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    business_id = Column(Integer, ForeignKey("businesses.id", ondelete="SET NULL"), nullable=True)

    # Order details
    status = Column(String(30), default=OrderStatus.PENDING, nullable=False)
    delivery_type = Column(String(20), default=DeliveryType.DELIVERY, nullable=False)
    total_amount = Column(Numeric(10, 2), nullable=False)

    # Delivery info
    delivery_address = Column(String(500), nullable=True)
    delivery_notes = Column(Text, nullable=True)

    # Tracking
    tracking_code = Column(String(50), unique=True, index=True, nullable=True)

    # Payment
    is_paid = Column(Boolean, default=False)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    delivered_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    customer = relationship("User", back_populates="orders")
    business = relationship("Business", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    payment = relationship("Payment", back_populates="order", uselist=False)

    def generate_tracking_code(self):
        """Generate a unique tracking code for this order."""
        self.tracking_code = f"TT-{str(uuid.uuid4())[:8].upper()}"

    def __repr__(self):
        return f"<Order #{self.id} [{self.status}]>"


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="SET NULL"), nullable=True)

    # Snapshot of product at order time
    product_name = Column(String(200), nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Numeric(10, 2), nullable=False)
    subtotal = Column(Numeric(10, 2), nullable=False)

    # Relationships
    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")

    def __repr__(self):
        return f"<OrderItem {self.product_name} x{self.quantity}>"
