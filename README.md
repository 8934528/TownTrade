# TownTrade

Built specifically for township businesses. We provide digital tools to help small traders grow their customer base, manage inventory, accept payments, and seamlessly communicate and trade with other small businesses.

---

## Key Features

### For Businesses

- **Digital Store Creation**: Quickly create an online storefront to showcase products.
- **Inventory Management**: Real-time stock level tracking with automatic low stock alerts.
- **Digital Payments**: Securely accept customer payments online.
- **B2B Network & Messaging**: Tag your business, search directory by tags, and chat directly with other local businesses to manage orders and trade relationships.
- **SMS Order Tracking**: Integrates with Twilio to keep customers and businesses notified of order progress over SMS/WhatsApp.

### For Customers

- **Locate Spazas**: Find nearby township shops and browse their products.
- **Digital Pay**: Place order checkouts and pay digitally using cards, mobile money, and EFTs.
- **Real-Time Delivery & Order Tracking**: Choose self-pickup or delivery options and track order status live with tracking codes.
- **Loyalty Program**: Earn points automatically for local orders to spend at township shops.

---

## Technology Stack

- **Frontend**: React 19 (TypeScript, Vite, Bootstrap 5)
- **Backend**: FastAPI (Python 3.11+, SQLAlchemy 2.0)
- **Database**: PostgreSQL (auto-migrated and populated at startup)
- **SMS/WhatsApp Gateway**: Twilio REST API

---

## Setup & Execution

### 1. Database Setup

Ensure you have a PostgreSQL instance running locally or hosted:

- Host: `localhost`
- Port: `5432`
- User: `postgres`
- Password: `<your_password>` (configured in `.env`)
- Database: `towntrade` (Create this database before starting)

### 2. Backend Setup

1. Go to the backend folder:

   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:

   ```bash
   python -m venv venv
   # On Windows
   ./venv/Scripts/activate

   # On Mac/Linux
   source venv/bin/activate
   ```

3. Install the dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Copy/set up configuration values in `.env`:

   ```bash
   cp .env.example .env
   ```

5. Start the FastAPI server (the database tables will be created automatically on startup):

   ```bash
   uvicorn app.main:app --reload
   ```

   *Swagger Docs run at*: ```http://localhost:8000/api/docs```

### 3. Frontend Setup

1. Go to the frontend folder:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the Vite development server:

   ```bash
   npm run dev
   ```

   *Frontend runs at*: ```http://localhost:5173```
