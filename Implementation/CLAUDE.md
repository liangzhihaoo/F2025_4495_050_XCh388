# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Gluu Admin Dashboard - A backend and frontend system for managing SaaS users, subscriptions, uploads, and analytics. Stack: Express.js (backend), React 19 (frontend), Supabase (database/auth), Stripe (payments).

## Development Commands

### Backend (Express API)
```bash
cd backend
npm install
npm run dev      # Development server with ts-node (port 4001)
npm run build    # Compile TypeScript
npm start        # Production server (requires .env in parent dir)
```

### Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev      # Vite dev server (hot reload)
npm run build    # TypeScript + Vite production build
npm run lint     # ESLint
npm run preview  # Preview production build locally
```

## Architecture

### Backend Structure

**Express API** (`backend/src/`):
- `server.ts` - Express app entry, health check, route mounting
- `routes/admin.ts` - Protected admin endpoints (plan changes, deactivation, deletion)
- `middleware/adminAuth.ts` - Shared secret authentication (`X-Admin-Secret` header)
- `stripe.ts` - Stripe customer/subscription management
- `supabase.ts` - Database queries and Supabase admin client
- `lib/plan.ts` - Plan definitions and upload limits
- `env.ts` - Environment validation with Zod

**Admin API Endpoints**:
- `POST /admin/users/:userId/plan` - Change user plan (upgrade/downgrade)
- `POST /admin/users/:userId/deactivate` - Suspend user account (pauses Stripe subs)
- `DELETE /admin/users/:userId` - Permanently delete user and data
- `GET /admin/billing/metrics` - Get billing KPIs (MRR, ARR, ARPU, Active Subscribers, Churn Rate)
- `GET /admin/billing/plan-distribution` - Get subscriber count and MRR per plan
- `GET /admin/billing/failed-payments` - Get failed payments with pagination and filters

**Webhook Endpoints**:
- `POST /webhooks/stripe` - Stripe webhook for cache invalidation (no auth, uses signature verification)

**Authentication**: MVP uses shared secret in `X-Admin-Secret` header. Frontend proxy/service injects this header - never exposed in client code.

**Stripe Integration**:
- `ensureCustomer()` - Create/fetch Stripe customer, link to Supabase user
- `upsertPlusSubscription()` - Create or update Plus subscription with prorations
- `cancelAllSubsNow()` - Immediate cancellation (downgrades)
- `pauseAllSubs()` / `resumeAllSubs()` - Pause/resume billing
- `calculateMRR()` - Calculate total Monthly Recurring Revenue from all active subscriptions
- `getActiveSubscribers()` - Count active paying subscriptions
- `calculateChurnRate()` - Calculate 30-day churn rate from canceled subscriptions
- `getFailedPayments()` - Get failed payments from Stripe invoices (uncollectible + open)
- Payment method required before upgrades (validated by `customerHasPaymentMethod()`)

**Billing Analytics**:
- All metrics calculated in real-time from Stripe API
- In-memory caching with TTL (10 min for metrics, 3 min for failed payments)
- Cache automatically invalidated via Stripe webhooks
- Webhook events handled: subscription created/updated/deleted, invoice payment failed/succeeded

**Database (Supabase)**:
- `users` table - id, email, stripe_customer_id, plan, upload_limit
- `products` table - User uploads/content
- `auth.users` - Supabase auth (managed via Admin API)
- Backend uses service role key for full access

### Frontend Structure

**React App** (`frontend/src/`):
- `App.tsx` - Query provider + Router setup, PostHog initialization
- `app.routes.tsx` - Route definitions (Dashboard, Users, Analytics, etc.)
- `lib/supabaseClient.ts` - Supabase client with anon key (read-only)
- `lib/adminApi.ts` - Admin API request wrapper
- `lib/pagination.ts` - Pagination types and URL sync
- `hooks/usePagination.ts` - Custom hook for paginated data with filters
- `services/` - Data fetching layer (users.ts and billing.ts use real APIs, others are mocked)
- `components/` - UI components organized by domain (users, layout, analytics)
- `pages/` - Page-level components

**State Management**:
- React Query (TanStack Query) for all async data
- Optimistic updates via `queryClient.setQueryData()`
- 1-minute stale time, no refetch on window focus
- Query keys include filters/pagination for proper cache invalidation

**Pagination Pattern**:
- URL-synced pagination with `?page=X&pageSize=Y&filters=...`
- Types: `PageRequest`, `PageResponse<T>`
- Auto-reset to page 1 when filters change
- Feature flag: `VITE_FEATURE_PAGINATION` (defaults enabled)

**Data Fetching Pattern**:
```typescript
// Service layer
export async function fetchUsers({ page, pageSize, filters, sort }: PageRequest) {
  const { data, count } = await supabase
    .from("users")
    .select("*", { count: "exact" })
    .range(from, to)
    // Apply filters, sorting
  return { items: data, total: count, page, pageSize }
}

// Component usage
const { data, isFetching } = useQuery({
  queryKey: ["users", { page, pageSize, filters }],
  queryFn: () => fetchUsers({ page, pageSize, filters }),
  placeholderData: (previousData) => previousData,
})
```

**Mock Data**: Most services use mock data (uploads, testimonials, billing). Only `users.ts` fetches real Supabase data. Mock generators in `lib/mock.ts`.

### Key Integration Points

**Frontend → Backend**:
1. User clicks action (e.g., "Change Plan")
2. `adminApi.ts` calls `POST /admin/users/:userId/plan`
3. Proxy injects `X-Admin-Secret` header (dev: Vite proxy, prod: Admin Proxy service)
4. Backend validates, executes Stripe + Supabase operations
5. Frontend optimistically updates cache via `queryClient.setQueryData()`

**Supabase Access**:
- Frontend: anon key (read-only queries)
- Backend: service role key (full admin access)
- Supabase is source of truth for user data

**Stripe-Supabase Sync**:
- Stripe customer ID stored in `users.stripe_customer_id`
- Subscription changes update `users.plan` and `users.upload_limit`
- Metadata `supabase_user_id` in Stripe customers enables reverse lookup

## Environment Variables

### Backend (`.env` in `backend/` directory)
```
PORT=4001
ADMIN_API_KEY=<shared-secret>
SUPABASE_URL=<supabase-url>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
STRIPE_SECRET_KEY=<stripe-secret>
STRIPE_PRICE_CLIENT_PLUS=<price-id>
STRIPE_PRICE_ENTERPRISE=<price-id-optional>
STRIPE_WEBHOOK_SECRET=<whsec_xxx-optional>
PLAN_FREE_UPLOAD_LIMIT=10
PLAN_PLUS_UPLOAD_LIMIT=200
```

**Stripe Webhook Setup**:
1. Create webhook endpoint in Stripe Dashboard: `https://your-domain.com/webhooks/stripe`
2. Select events: `customer.subscription.*`, `invoice.payment_failed`, `invoice.payment_succeeded`
3. Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`
4. For local testing: Use Stripe CLI `stripe listen --forward-to localhost:4001/webhooks/stripe`

### Frontend (`.env.local` in `frontend/` directory)
```
VITE_SUPABASE_URL=<supabase-url>
VITE_SUPABASE_KEY=<anon-key>
VITE_POSTHOG_API_KEY=<optional>
VITE_POSTHOG_HOST=https://us.i.posthog.com
VITE_FEATURE_PAGINATION=true
```

## Important Implementation Details

### Plan Changes
- Upgrades to Plus require payment method on file (returns 409 if missing)
- Downgrades cancel all Stripe subscriptions immediately
- Upload limits updated in Supabase: Free=10, Plus=200 (configurable)
- Proration enabled (`create_prorations` mode)

### Account Deactivation
- Sets `banned_until` to year 2999 (effectively permanent until cleared)
- Pauses all Stripe subscriptions (no charges, but collection stays open)
- Reversible by clearing `banned_until` field

### Account Deletion
- Atomic operation: cancel Stripe subs → delete products → delete user → delete auth.users
- Stripe customer may not be deletable if payment history exists
- Not reversible - permanent data loss

### Pagination
- 1-based page numbers (frontend and backend)
- Page sizes: 10, 20, 50 (default: 10)
- URL params synced automatically
- PostHog tracking for pagination events

### Error Handling
- Backend: Try-catch with descriptive error messages, appropriate HTTP status codes
- Frontend: Service functions throw, components catch and display alerts
- React Query handles loading/error states automatically

## Testing & Development Workflow

1. **Local Development**: Run both backend and frontend dev servers simultaneously
2. **Backend Testing**: Use tools like Postman/curl with `X-Admin-Secret` header
3. **Frontend Dev**: Vite dev server proxies admin requests (ensure proxy config injects secret)
4. **No Automated Tests**: Currently no test suite (manual testing only)

## Common Tasks

### Adding a New Admin Endpoint
1. Define route in `backend/src/routes/admin.ts`
2. Add Zod schema for request validation
3. Implement business logic (use Supabase/Stripe helpers)
4. Add corresponding function in `frontend/src/lib/adminApi.ts`
5. Update React Query keys if caching needed

### Adding Real Data to Mock Service
1. Create Supabase table/queries in `backend/src/supabase.ts`
2. Replace mock implementation in `frontend/src/services/[service].ts`
3. Update types if needed
4. Test pagination with real data

### Modifying Plans/Limits
1. Update `PLAN_FREE_UPLOAD_LIMIT` / `PLAN_PLUS_UPLOAD_LIMIT` in backend `.env`
2. Update Stripe price ID if changing pricing
3. Changes apply immediately on next plan operation

## Git Branch Strategy
- Current branch: `dev`
- No specified main branch in git config
- Recent commits show feature work (pagination, progress reports)
