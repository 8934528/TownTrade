import logging
from typing import Optional
from app.core.config import settings

logger = logging.getLogger(__name__)


class SMSService:
    """
    Twilio WhatsApp/SMS notification service.
    Sends order status updates to customers and businesses.
    """

    def __init__(self):
        self.client = None
        self.whatsapp_number = settings.TWILIO_WHATSAPP_NUMBER

        if settings.TWILIO_ACCOUNT_SID and settings.TWILIO_AUTH_TOKEN:
            try:
                from twilio.rest import Client
                self.client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
                logger.info("✅ Twilio SMS/WhatsApp service initialized.")
            except ImportError:
                logger.warning("⚠️  Twilio not installed. SMS/WhatsApp notifications disabled.")
            except Exception as e:
                logger.error(f"❌ Twilio initialization failed: {e}")
        else:
            logger.info("ℹ️  Twilio credentials not set. SMS/WhatsApp notifications disabled.")

    def send_whatsapp(self, to: str, message: str) -> bool:
        """Send a WhatsApp message via Twilio."""
        if not self.client:
            logger.info(f"[SMS MOCK] To: {to} — {message}")
            return False

        try:
            msg = self.client.messages.create(
                from_=f"whatsapp:{self.whatsapp_number}",
                to=f"whatsapp:{to}",
                body=message,
            )
            logger.info(f"WhatsApp sent: SID={msg.sid}")
            return True
        except Exception as e:
            logger.error(f"WhatsApp send failed: {e}")
            return False

    def send_sms(self, to: str, message: str) -> bool:
        """Send an SMS via Twilio."""
        if not self.client:
            logger.info(f"[SMS MOCK] To: {to} — {message}")
            return False

        try:
            msg = self.client.messages.create(
                from_=self.whatsapp_number,
                to=to,
                body=message,
            )
            logger.info(f"SMS sent: SID={msg.sid}")
            return True
        except Exception as e:
            logger.error(f"SMS send failed: {e}")
            return False

    def notify_order_placed(self, customer_phone: Optional[str], tracking_code: str, business_name: str) -> None:
        """Notify customer when their order is placed."""
        if not customer_phone:
            return
        msg = (
            f"🛒 TownTrade Order Placed!\n"
            f"Your order from {business_name} has been placed.\n"
            f"Tracking: {tracking_code}\n"
            f"We'll notify you as it progresses."
        )
        self.send_whatsapp(customer_phone, msg)

    def notify_order_status(self, customer_phone: Optional[str], tracking_code: str, status: str) -> None:
        """Notify customer of order status change."""
        if not customer_phone:
            return
        status_messages = {
            "confirmed": "✅ Order confirmed! Your business is preparing it.",
            "preparing": "👨‍🍳 Your order is being prepared!",
            "ready": "📦 Your order is ready!",
            "out_for_delivery": "🚚 Your order is out for delivery!",
            "delivered": "🎉 Your order has been delivered. Enjoy!",
            "cancelled": "❌ Your order has been cancelled.",
        }
        message = status_messages.get(status, f"Order update: {status}")
        msg = f"TownTrade (#{tracking_code}):\n{message}"
        self.send_whatsapp(customer_phone, msg)

    def notify_new_order(self, business_phone: Optional[str], order_id: int, total: float) -> None:
        """Notify business of a new order."""
        if not business_phone:
            return
        msg = (
            f"🔔 New TownTrade Order!\n"
            f"Order #{order_id} received — R{total:.2f}\n"
            f"Log in to accept and process it."
        )
        self.send_whatsapp(business_phone, msg)


sms_service = SMSService()
