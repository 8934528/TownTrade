from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("businesses.id", ondelete="CASCADE"), nullable=False)

    # Product info
    name = Column(String(200), nullable=False, index=True)
    description = Column(Text, nullable=True)
    price = Column(Numeric(10, 2), nullable=False)
    category = Column(String(100), nullable=True)
    tags = Column(String(500), nullable=True)  # Comma-separated

    # Inventory
    stock = Column(Integer, default=0)
    low_stock_threshold = Column(Integer, default=5)

    # Media
    image_url = Column(String(500), nullable=True)

    # Status
    is_active = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    business = relationship("Business", back_populates="products")
    order_items = relationship("OrderItem", back_populates="product")

    @property
    def is_low_stock(self):
        return self.stock <= self.low_stock_threshold

    def __repr__(self):
        return f"<Product {self.name} @ R{self.price}>"
