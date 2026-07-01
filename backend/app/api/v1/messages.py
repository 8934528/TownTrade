from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.services.message_service import message_service
from app.services.business_service import business_service
from app.services.auth_service import auth_service
from app.schemas.message import MessageCreate, MessageResponse

router = APIRouter(prefix="/messages", tags=["messages"])


def get_current_user(db: Session = Depends(get_db), token: str = Depends(auth_service.oauth2_scheme)):
    return auth_service.get_current_user(db, token)


@router.post("/", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
def send_message(
    message_in: MessageCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Send a message to a business."""
    return message_service.send_message(db, message_in, current_user.id)


@router.get("/inbox", response_model=List[MessageResponse])
def get_inbox(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    unread_only: bool = Query(False),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Get messages received by the current user's business."""
    my_business = business_service.get_business_by_user(db, current_user.id)
    if not my_business:
        return []
    return message_service.list_messages_for_business(db, my_business.id, skip, limit, unread_only)


@router.get("/sent", response_model=List[MessageResponse])
def get_sent(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Get messages sent by the current user."""
    return message_service.list_sent_messages(db, current_user.id, skip, limit)


@router.get("/unread-count")
def get_unread_count(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Get number of unread messages for the current business."""
    my_business = business_service.get_business_by_user(db, current_user.id)
    if not my_business:
        return {"count": 0}
    count = message_service.get_unread_count(db, my_business.id)
    return {"count": count}


@router.patch("/{message_id}/read", response_model=MessageResponse)
def mark_as_read(
    message_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Mark a message as read (business owner only)."""
    my_business = business_service.get_business_by_user(db, current_user.id)
    if not my_business:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="No business found")
    return message_service.mark_as_read(db, message_id, my_business.id)
