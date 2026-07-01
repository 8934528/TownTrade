# Import all models so SQLAlchemy registers them with the Base metadata
# This ensures all tables are created when init_db() calls Base.metadata.create_all()

from app.models.user import User
from app.models.business import Business
from app.models.product import Product
from app.models.order import Order, OrderItem
from app.models.payment import Payment
from app.models.message import Message

__all__ = ["User", "Business", "Product", "Order", "OrderItem", "Payment", "Message"]
