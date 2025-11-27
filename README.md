# Gluu Admin Dashboard - Setup Guide

This guide will help you set up and run the Gluu Admin Dashboard project locally.

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)
- **Git**

## Project Structure

```
Implementation/
├── backend/          # Express.js API server
├── frontend/         # React + Vite application
```

---

## Backend Setup

The backend is an Express.js API that handles admin operations, Stripe payments, and Supabase database interactions.

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `backend/` directory by copying the example file:

```bash
cp .env.example .env
```

Then edit the `.env` file and fill in your actual values:

```env
# Server
PORT=4001

# Admin authentication (shared secret)
ADMIN_API_KEY=your_admin_secret_key_here

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PRICE_CLIENT_PLUS=price_your_client_plus_price_id
STRIPE_PRICE_ENTERPRISE=price_your_enterprise_price_id_optional
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_optional

# Plan upload limits
PLAN_FREE_UPLOAD_LIMIT=10
PLAN_PLUS_UPLOAD_LIMIT=200
```

**Where to get these values:**

- **ADMIN_API_KEY**: Create your own secure random string (this will be used by the frontend)
- **SUPABASE_URL & SUPABASE_SERVICE_ROLE_KEY**: Get these from your [Supabase project settings](https://supabase.com/dashboard) → Settings → API
- **STRIPE_SECRET_KEY**: Get from your [Stripe Dashboard](https://dashboard.stripe.com/apikeys) → Developers → API keys
- **STRIPE_PRICE_CLIENT_PLUS**: Create a product/price in Stripe and copy the price ID (starts with `price_`)
- **STRIPE_PRICE_ENTERPRISE**: (Optional) Same as above if you have an enterprise tier
- **STRIPE_WEBHOOK_SECRET**: (Optional) Create a webhook endpoint in Stripe for `/webhooks/stripe`

### 4. Run the Backend

**Development mode** (with hot reload):

```bash
npm run dev
```

The backend server will start at `http://localhost:4001`

**Production mode**:

```bash
npm run build
npm start
```

### 5. Verify Backend is Running

You can test the backend health check endpoint:

```bash
curl http://localhost:4001/health
```

---

## Frontend Setup

The frontend is a React application built with Vite, using Supabase for data access and connecting to the backend for admin operations.

### 1. Navigate to Frontend Directory

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `frontend/` directory by copying the example file:

```bash
cp .env.example .env
```

Then edit the `.env` file and fill in your actual values:

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_KEY=your_supabase_anon_key_here

# Admin API
ADMIN_API_KEY=your_admin_secret_key_here
VITE_ADMIN_BACKEND_URL=http://localhost:4001

# Feature Flags
VITE_FEATURE_PAGINATION=true
```

**Where to get these values:**

- **VITE_SUPABASE_URL**: Same as backend - from [Supabase project settings](https://supabase.com/dashboard) → Settings → API
- **VITE_SUPABASE_KEY**: Get the **anon/public** key (NOT the service role key) from Supabase → Settings → API
- **ADMIN_API_KEY**: Must match the `ADMIN_API_KEY` you set in the backend `.env` file
- **VITE_ADMIN_BACKEND_URL**: The URL where your backend is running (default: `http://localhost:4001`)
- **VITE_FEATURE_PAGINATION**: Set to `true` to enable pagination features

### 4. Run the Frontend

**Development mode** (with hot reload):

```bash
npm run dev
```

The frontend will start at `http://localhost:5173` (or another port if 5173 is taken)

**Build for production**:

```bash
npm run build
```

**Preview production build**:

```bash
npm run preview
```

### 5. Verify Frontend is Running

Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal)

---

## Running Both Backend and Frontend Together

For local development, you'll need to run both servers simultaneously:

1. **Terminal 1** - Backend:
   ```bash
   cd backend
   npm run dev
   ```

2. **Terminal 2** - Frontend:
   ```bash
   cd frontend
   npm run dev
   ```

---

## Troubleshooting

### Backend won't start
- Check that all required environment variables are set in `backend/.env`
- Verify that port 4001 is not already in use
- Ensure Supabase and Stripe credentials are valid

### Frontend can't connect to backend
- Verify backend is running on the correct port
- Check that `VITE_ADMIN_BACKEND_URL` in frontend `.env` matches where backend is running
- Ensure `ADMIN_API_KEY` matches in both frontend and backend `.env` files

### Supabase connection errors
- Verify your Supabase project is active
- Check that URLs and keys are correctly copied (no extra spaces)
- Backend uses **service role key**, frontend uses **anon key**

### Stripe errors
- Ensure you're using test mode keys (they start with `sk_test_`)
- Verify price IDs are correct and exist in your Stripe account

---

## Additional Commands

### Backend
- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Run development server with hot reload
- `npm start` - Run production server

### Frontend
- `npm run dev` - Run development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally

---

## Next Steps

Once both servers are running:

1. Access the admin dashboard at `http://localhost:5173`
2. Explore the different sections (Dashboard, Users, Analytics, etc.)
3. Test admin operations like changing user plans or managing accounts

For any issues or questions, please refer to the project documentation.
