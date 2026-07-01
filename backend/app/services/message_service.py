from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List
from datetime import datetime

from app.models.message import Message
from app.models.business import Business
from app.schemas.message import MessageCreate


class MessageService:

    @staticmethod
    def send_message(db: Session, message_data: MessageCreate, sender_id: int) -> Message:
        """Send a message to a business."""
        # Verify the receiver business exists
        business = db.query(Business).filter(
            Business.id == message_data.receiver_business_id,
            Business.is_active == True
        ).first()
        if not business:
            raise HTTPException(status_code=404, detail="Recipient business not found")

        db_message = Message(
            sender_id=sender_id,
            receiver_business_id=message_data.receiver_business_id,
            subject=message_data.subject,
            content=message_data.content,
        )
        db.add(db_message)
        db.commit()
        db.refresh(db_message)
        return db_message

    @staticmethod
    def list_messages_for_business(
        db: Session,
        business_id: int,
        skip: int = 0,
        limit: int = 50,
        unread_only: bool = False,
    ) -> List[Message]:
        """List all messages received by a business."""
        query = db.query(Message).filter(Message.receiver_business_id == business_id)
        if unread_only:
            query = query.filter(Message.is_read == False)
        return query.order_by(Message.created_at.desc()).offset(skip).limit(limit).all()

    @staticmethod
    def list_sent_messages(
        db: Session,
        sender_id: int,
        skip: int = 0,
        limit: int = 50,
    ) -> List[Message]:
        """List messages sent by a user."""
        return db.query(Message).filter(
            Message.sender_id == sender_id
        ).order_by(Message.created_at.desc()).offset(skip).limit(limit).all()

    @staticmethod
    def mark_as_read(db: Session, message_id: int, business_id: int) -> Message:
        """Mark a message as read."""
        msg = db.query(Message).filter(
            Message.id == message_id,
            Message.receiver_business_id == business_id
        ).first()
        if not msg:
            raise HTTPException(status_code=404, detail="Message not found")

        if not msg.is_read:
            msg.is_read = True
            msg.read_at = datetime.utcnow()
            db.commit()
            db.refresh(msg)
        return msg

    @staticmethod
    def get_unread_count(db: Session, business_id: int) -> int:
        """Count unread messages for a business."""
        return db.query(Message).filter(
            Message.receiver_business_id == business_id,
            Message.is_read == False
        ).count()


message_service = MessageService()
