from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(150), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False)  # 'customer' or 'business'
    phone = Column(String(30), nullable=True)

    # OAuth fields
    google_id = Column(String(100), nullable=True)
    facebook_id = Column(String(100), nullable=True)

    # Token fields
    refresh_token = Column(String(500), nullable=True)
    remember_me_token = Column(String(500), nullable=True)

    # Status
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    email_verified = Column(Boolean, default=False)
    phone_verified = Column(Boolean, default=False)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    business = relationship("Business", back_populates="owner", uselist=False)
    orders = relationship("Order", back_populates="customer")
    payments = relationship("Payment", back_populates="payer")
    sent_messages = relationship("Message", foreign_keys="Message.sender_id", back_populates="sender")

    def __repr__(self):
        return f"<User {self.email} [{self.role}]>"
