import uuid
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List, Optional
from decimal import Decimal
from datetime import datetime

from app.models.order import Order, OrderItem, OrderStatus
from app.models.product import Product
from app.models.business import Business
from app.schemas.order import OrderCreate, OrderUpdate


class OrderService:

    @staticmethod
    def create_order(db: Session, order_data: OrderCreate, customer_id: int) -> Order:
        """Create a new order with items."""
        # Validate business exists
        business = db.query(Business).filter(Business.id == order_data.business_id).first()
        if not business:
            raise HTTPException(status_code=404, detail="Business not found")

        # Validate products and calculate total
        total = Decimal("0.00")
        order_items = []

        for item_data in order_data.items:
            product = db.query(Product).filter(
                Product.id == item_data.product_id,
                Product.business_id == order_data.business_id,
                Product.is_active == True
            ).first()
            if not product:
                raise HTTPException(
                    status_code=404,
                    detail=f"Product #{item_data.product_id} not found in this business"
                )
            if product.stock < item_data.quantity:
                raise HTTPException(
                    status_code=400,
                    detail=f"Insufficient stock for '{product.name}' (available: {product.stock})"
                )

            subtotal = Decimal(str(product.price)) * item_data.quantity
            total += subtotal

            order_items.append({
                "product_id": product.id,
                "product_name": product.name,
                "quantity": item_data.quantity,
                "unit_price": product.price,
                "subtotal": subtotal,
            })

        # Generate tracking code
        tracking_code = f"TT-{str(uuid.uuid4())[:8].upper()}"

        # Create order
        db_order = Order(
            customer_id=customer_id,
            business_id=order_data.business_id,
            status=OrderStatus.PENDING,
            delivery_type=order_data.delivery_type,
            total_amount=total,
            delivery_address=order_data.delivery_address,
            delivery_notes=order_data.delivery_notes,
            tracking_code=tracking_code,
        )
        db.add(db_order)
        db.flush()  # Get the order ID

        # Create order items and deduct stock
        for item_info in order_items:
            db_item = OrderItem(order_id=db_order.id, **item_info)
            db.add(db_item)

            # Deduct stock
            product = db.query(Product).filter(Product.id == item_info["product_id"]).first()
            if product:
                product.stock = max(0, product.stock - item_info["quantity"])

        db.commit()
        db.refresh(db_order)
        return db_order

    @staticmethod
    def get_order_by_id(db: Session, order_id: int) -> Order:
        """Get an order by ID."""
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        return order

    @staticmethod
    def track_order(db: Session, tracking_code: str) -> Order:
        """Get order by tracking code (public access)."""
        order = db.query(Order).filter(Order.tracking_code == tracking_code).first()
        if not order:
            raise HTTPException(status_code=404, detail="Order not found with this tracking code")
        return order

    @staticmethod
    def list_customer_orders(
        db: Session,
        customer_id: int,
        skip: int = 0,
        limit: int = 20,
    ) -> List[Order]:
        """List all orders for a customer."""
        return db.query(Order).filter(
            Order.customer_id == customer_id
        ).order_by(Order.created_at.desc()).offset(skip).limit(limit).all()

    @staticmethod
    def list_business_orders(
        db: Session,
        business_id: int,
        skip: int = 0,
        limit: int = 50,
        status_filter: Optional[str] = None,
    ) -> List[Order]:
        """List all orders for a business."""
        query = db.query(Order).filter(Order.business_id == business_id)
        if status_filter:
            query = query.filter(Order.status == status_filter)
        return query.order_by(Order.created_at.desc()).offset(skip).limit(limit).all()

    @staticmethod
    def update_order_status(
        db: Session,
        order_id: int,
        new_status: str,
        business_id: Optional[int] = None,
    ) -> Order:
        """Update order status. Business can only update their own orders."""
        query = db.query(Order).filter(Order.id == order_id)
        if business_id:
            query = query.filter(Order.business_id == business_id)

        order = query.first()
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")

        order.status = new_status
        if new_status == OrderStatus.DELIVERED:
            order.delivered_at = datetime.utcnow()

        db.commit()
        db.refresh(order)
        return order

    @staticmethod
    def cancel_order(db: Session, order_id: int, customer_id: int) -> Order:
        """Cancel an order. Only the customer can cancel pending orders."""
        order = db.query(Order).filter(
            Order.id == order_id,
            Order.customer_id == customer_id
        ).first()
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")

        if order.status not in [OrderStatus.PENDING, OrderStatus.CONFIRMED]:
            raise HTTPException(
                status_code=400,
                detail="Order cannot be cancelled at this stage"
            )

        order.status = OrderStatus.CANCELLED
        db.commit()
        db.refresh(order)
        return order


order_service = OrderService()
