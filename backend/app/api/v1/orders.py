from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.services.order_service import order_service
from app.services.business_service import business_service
from app.services.auth_service import auth_service
from app.services.sms_service import sms_service
from app.schemas.order import Order, OrderCreate, OrderUpdate, OrderWithItems, TrackingInfo
from app.models.order import OrderStatus

router = APIRouter(prefix="/orders", tags=["orders"])


def get_current_user(db: Session = Depends(get_db), token: str = Depends(auth_service.oauth2_scheme)):
    return auth_service.get_current_user(db, token)


@router.post("/", response_model=OrderWithItems, status_code=status.HTTP_201_CREATED)
def create_order(
    order_in: OrderCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Place a new order (customer only)."""
    order = order_service.create_order(db, order_in, current_user.id)

    # Send WhatsApp notification
    business = business_service.get_business_by_id(db, order_in.business_id)
    sms_service.notify_order_placed(current_user.phone, order.tracking_code, business.name)
    if business.whatsapp or business.phone:
        sms_service.notify_new_order(
            business.whatsapp or business.phone,
            order.id,
            float(order.total_amount)
        )

    return order


@router.get("/my", response_model=List[OrderWithItems])
def list_my_orders(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """List orders placed by the current customer."""
    return order_service.list_customer_orders(db, current_user.id, skip, limit)


@router.get("/business", response_model=List[OrderWithItems])
def list_business_orders(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    order_status: Optional[str] = Query(None, alias="status"),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """List orders received by the current user's business."""
    my_business = business_service.get_business_by_user(db, current_user.id)
    if not my_business:
        raise HTTPException(status_code=404, detail="No business found for this user")
    return order_service.list_business_orders(db, my_business.id, skip, limit, order_status)


@router.get("/track/{tracking_code}", response_model=TrackingInfo)
def track_order(tracking_code: str, db: Session = Depends(get_db)):
    """Track an order by tracking code (public endpoint)."""
    order = order_service.track_order(db, tracking_code)
    business_name = None
    if order.business_id:
        try:
            biz = business_service.get_business_by_id(db, order.business_id)
            business_name = biz.name
        except Exception:
            pass

    return TrackingInfo(
        tracking_code=order.tracking_code,
        status=order.status,
        business_name=business_name,
        delivery_type=order.delivery_type,
        delivery_address=order.delivery_address,
        created_at=order.created_at,
        updated_at=order.updated_at,
    )


@router.get("/{order_id}", response_model=OrderWithItems)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Get an order by ID (must belong to user or user's business)."""
    order = order_service.get_order_by_id(db, order_id)
    my_business = business_service.get_business_by_user(db, current_user.id)

    if order.customer_id != current_user.id:
        if not my_business or order.business_id != my_business.id:
            raise HTTPException(status_code=403, detail="Access denied")
    return order


@router.patch("/{order_id}/status", response_model=Order)
def update_order_status(
    order_id: int,
    new_status: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Update order status (business only)."""
    my_business = business_service.get_business_by_user(db, current_user.id)
    if not my_business:
        raise HTTPException(status_code=403, detail="Only businesses can update order status")

    order = order_service.update_order_status(db, order_id, new_status, my_business.id)

    # Notify customer via WhatsApp
    if order.customer_id:
        from app.services.user_service import user_service
        customer = user_service.get_user_by_id(db, order.customer_id)
        if customer.phone:
            sms_service.notify_order_status(customer.phone, order.tracking_code, new_status)

    return order


@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
def cancel_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Cancel an order (customer only, pending orders only)."""
    order_service.cancel_order(db, order_id, current_user.id)
