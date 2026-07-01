from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Business(Base):
    __tablename__ = "businesses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)

    # Business info
    name = Column(String(200), nullable=False, index=True)
    category = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    tags = Column(String(500), nullable=True)   # Comma-separated tags e.g. "spaza,groceries,bread"

    # Contact & location
    address = Column(String(300), nullable=True)
    city = Column(String(100), nullable=True)
    phone = Column(String(20), nullable=True)
    whatsapp = Column(String(20), nullable=True)

    # Media
    logo_url = Column(String(500), nullable=True)
    banner_url = Column(String(500), nullable=True)

    # Status
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    is_open = Column(Boolean, default=True)

    # Ratings
    rating = Column(Numeric(3, 2), default=0.0)
    total_reviews = Column(Integer, default=0)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    owner = relationship("User", back_populates="business")
    products = relationship("Product", back_populates="business", cascade="all, delete-orphan")
    orders = relationship("Order", back_populates="business")
    received_messages = relationship("Message", foreign_keys="Message.receiver_business_id", back_populates="receiver_business")

    def __repr__(self):
        return f"<Business {self.name}>"
