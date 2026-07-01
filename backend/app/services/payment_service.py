import uuid
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List, Optional

from app.models.payment import Payment, PaymentStatus
from app.models.order import Order
from app.schemas.payment import PaymentCreate


class PaymentService:

    @staticmethod
    def initiate_payment(db: Session, payment_data: PaymentCreate, payer_id: int) -> Payment:
        """Create a payment record and initiate the payment process."""
        # Verify order exists
        order = db.query(Order).filter(Order.id == payment_data.order_id).first()
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")

        # Check if already paid
        if order.is_paid:
            raise HTTPException(status_code=400, detail="Order is already paid")

        # Check existing payment
        existing = db.query(Payment).filter(
            Payment.order_id == payment_data.order_id,
            Payment.status.in_([PaymentStatus.PENDING, PaymentStatus.PROCESSING])
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="A payment is already in progress for this order")

        # Generate a unique reference
        reference = f"TT-PAY-{str(uuid.uuid4())[:10].upper()}"

        db_payment = Payment(
            order_id=payment_data.order_id,
            payer_id=payer_id,
            amount=payment_data.amount,
            currency=payment_data.currency,
            method=payment_data.method,
            status=PaymentStatus.PROCESSING,
            reference=reference,
        )
        db.add(db_payment)
        db.commit()
        db.refresh(db_payment)

        # For card/EFT — in production this would call a payment gateway (e.g. Peach Payments, Yoco)
        # For demo purposes, we auto-complete cash and mobile_money payments
        if payment_data.method in ["cash", "mobile_money"]:
            PaymentService._complete_payment(db, db_payment, order)

        return db_payment

    @staticmethod
    def _complete_payment(db: Session, payment: Payment, order: Order) -> None:
        """Mark payment as successful and update order."""
        payment.status = PaymentStatus.SUCCESS
        order.is_paid = True
        db.commit()

    @staticmethod
    def get_payment_by_id(db: Session, payment_id: int) -> Payment:
        payment = db.query(Payment).filter(Payment.id == payment_id).first()
        if not payment:
            raise HTTPException(status_code=404, detail="Payment not found")
        return payment

    @staticmethod
    def get_payment_by_reference(db: Session, reference: str) -> Payment:
        payment = db.query(Payment).filter(Payment.reference == reference).first()
        if not payment:
            raise HTTPException(status_code=404, detail="Payment not found")
        return payment

    @staticmethod
    def list_user_payments(db: Session, user_id: int, skip: int = 0, limit: int = 20) -> List[Payment]:
        return db.query(Payment).filter(
            Payment.payer_id == user_id
        ).order_by(Payment.created_at.desc()).offset(skip).limit(limit).all()

    @staticmethod
    def confirm_payment(db: Session, reference: str) -> Payment:
        """Confirm a payment (called by webhook or manual confirmation)."""
        payment = db.query(Payment).filter(Payment.reference == reference).first()
        if not payment:
            raise HTTPException(status_code=404, detail="Payment not found")

        order = db.query(Order).filter(Order.id == payment.order_id).first()
        PaymentService._complete_payment(db, payment, order)
        db.refresh(payment)
        return payment


payment_service = PaymentService()
