# TownTrade Backend API

FastAPI-powered REST API for the TownTrade Township Business Platform, leveraging PostgreSQL and SQLAlchemy 2.0.

---

## Prerequisites
- Python 3.11+
- PostgreSQL 15+
- Twilio Account (Optional, for SMS/WhatsApp alerts)

---

## Local Setup

1. **Database Creation**:
   Log into your local PostgreSQL instance and create a database named `towntrade`:
   ```sql
   CREATE DATABASE towntrade;
   ```

2. **Configure Environment Variables**:
   Edit the `.env` file in the root or backend folder with your PostgreSQL credentials:
   ```env
   DATABASE_URL=postgresql+psycopg2://postgres:<your_password>@localhost:5432/towntrade
   ```

3. **Install Dependencies**:
   ```bash
   python -m venv venv
   .\venv\Scripts\activate
   pip install -r requirements.txt
   ```

4. **Run the API**:
   ```bash
   uvicorn app.main:app --reload
   ```
   *The database schema tables are created automatically on startup.*

---

## API Endpoints List

### Authentication
- `POST /api/v1/auth/register` - Create business or customer accounts
- `POST /api/v1/auth/login` - Secure JWT login
- `POST /api/v1/auth/refresh` - Refresh access tokens
- `GET /api/v1/auth/me` - Get current active profile

### Small Businesses
- `GET /api/v1/businesses/` - List, filter, or search small businesses
- `POST /api/v1/businesses/` - Register a business storefront
- `GET /api/v1/businesses/me` - Fetch own store profile
- `PUT /api/v1/businesses/{id}` - Update business details
- `POST /api/v1/businesses/{id}/tag` - Add discovery tags (e.g., wholesaler, spaza)
- `GET /api/v1/businesses/{id}/products` - List products from a specific business

### Products & Inventory
- `GET /api/v1/products/` - Browse active items
- `POST /api/v1/products/` - Add items to inventory
- `GET /api/v1/products/low-stock` - Get low stock items alert list
- `PUT /api/v1/products/{id}` - Modify details
- `PATCH /api/v1/products/{id}/stock?delta=N` - Rapidly adjust stock counts

### Orders & Logistics
- `POST /api/v1/orders/` - Place orders (docks stock, issues SMS, generates code)
- `GET /api/v1/orders/my` - Fetch client orders
- `GET /api/v1/orders/business` - View incoming business orders
- `GET /api/v1/orders/track/{tracking_code}` - Public/customer tracking progress check
- `PATCH /api/v1/orders/{id}/status` - Advance order stage (sends WhatsApp updates)

### Payments Gateway
- `POST /api/v1/payments/` - Initialize digital transaction
- `GET /api/v1/payments/my` - List transaction logs
- `POST /api/v1/payments/confirm/{reference}` - Confirm processing completion (webhook mock)

### B2B Messenger
- `POST /api/v1/messages/` - Send trade messages to other businesses
- `GET /api/v1/messages/inbox` - Inbox list for business communications
- `GET /api/v1/messages/sent` - Logs of sent communications
- `GET /api/v1/messages/unread-count` - Badge count for unread inbox messages
- `PATCH /api/v1/messages/{id}/read` - Mark specific message as read
