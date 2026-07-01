from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Message(Base):
    """
    B2B messaging between businesses.
    A business user can send messages to any other business.
    """
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    receiver_business_id = Column(Integer, ForeignKey("businesses.id", ondelete="CASCADE"), nullable=False)

    # Content
    subject = Column(String(300), nullable=True)
    content = Column(Text, nullable=False)

    # Status
    is_read = Column(Boolean, default=False)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    read_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    sender = relationship("User", back_populates="sent_messages")
    receiver_business = relationship("Business", foreign_keys=[receiver_business_id], back_populates="received_messages")

    def __repr__(self):
        return f"<Message from user#{self.sender_id} to business#{self.receiver_business_id}>"
