from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.services.payment_service import payment_service
from app.services.auth_service import auth_service
from app.schemas.payment import PaymentCreate, PaymentResponse

router = APIRouter(prefix="/payments", tags=["payments"])


def get_current_user(db: Session = Depends(get_db), token: str = Depends(auth_service.oauth2_scheme)):
    return auth_service.get_current_user(db, token)


@router.post("/", response_model=PaymentResponse, status_code=status.HTTP_201_CREATED)
def initiate_payment(
    payment_in: PaymentCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Initiate a payment for an order."""
    return payment_service.initiate_payment(db, payment_in, current_user.id)


@router.get("/my", response_model=List[PaymentResponse])
def list_my_payments(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """List current user's payment history."""
    return payment_service.list_user_payments(db, current_user.id, skip, limit)


@router.get("/{payment_id}", response_model=PaymentResponse)
def get_payment(
    payment_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Get payment details by ID."""
    return payment_service.get_payment_by_id(db, payment_id)


@router.post("/confirm/{reference}", response_model=PaymentResponse)
def confirm_payment(
    reference: str,
    db: Session = Depends(get_db),
):
    """Confirm a payment by reference (webhook endpoint)."""
    return payment_service.confirm_payment(db, reference)
