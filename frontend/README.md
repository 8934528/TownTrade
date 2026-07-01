# TownTrade Frontend

React 19 + TypeScript + Vite Single-Page Application (SPA) for TownTrade township small business digital commerce portal.

---

## Getting Started

1. **Install Node.js** (v18+ recommended)
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   *By default, the client launches at: http://localhost:5173*

---

## Reusable Components Guide

To ensure high maintainability, consistent layout, and premium aesthetics, the following reusable components are placed under `src/components/`:

- **StatCard**: Visualized card indicating dashboard metrics (e.g. Total Revenue, Pending Orders) with a color-coded icon.
- **PageHeader**: Unified top banner with the page title, subtitle, and primary actions layout.
- **ProductCard**: Standardized container for products displaying name, description, category, price, stock status, and add-to-cart or edit controls.
- **OrderStatusBadge**: Colored status indicator with descriptive icons representing various order fulfillment stages.
- **EmptyState**: Standard fallback placeholder layout displayed when databases or filters return zero elements.
- **LoadingSpinner**: Standardized loading placeholder.
- **Modal**: Type-safe React popup dialog rendering custom elements, forms, and B2B chat boxes.

---

## State Integration Architecture

- **AuthContext**: Manages JWT authentication state, redirects users based on account role (Business user vs. Customer), and stores active session data.
- **Unified Checkout**: Cart items selected by a customer under the `Stores` dashboard flow directly into the `Digital Pay` state as a pending payment, transitioning automatically to the `Track Order` tab upon transaction success.
- **B2B Messaging Directory**: Businesses can tag themselves, look up other businesses using tag filters, and exchange trade details directly inside their dashboard communications portal.
