// Tiny API client hitting /admin routes (dev: Vite proxy injects secret; prod: Admin Proxy injects secret).
export type Plan = "Free" | "Client Plus" | "Enterprise";

export interface ChangePlanResponse {
  ok: boolean;
  userId: string;
  plan: Plan;
  upload_limit: number;
  stripe_customer_id: string;
}

async function request<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    const message = errBody?.message || errBody?.error || res.statusText;
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

// Change plan (upgrade or downgrade)
export async function changePlan(userId: string, plan: Plan) {
  return request<ChangePlanResponse>(`/admin/users/${userId}/plan`, {
    method: "POST",
    body: JSON.stringify({ plan }),
  });
}

// Deactivate user account
export async function deactivateUser(userId: string) {
  return request<{ ok: boolean; userId: string; status: string; is_active: boolean }>(
    `/admin/users/${userId}/deactivate`,
    {
      method: "POST",
    }
  );
}

// Reactivate user account
export async function reactivateUser(userId: string) {
  return request<{ ok: boolean; userId: string; status: string; is_active: boolean }>(
    `/admin/users/${userId}/reactivate`,
    {
      method: "POST",
    }
  );
}

// Delete user account
export async function deleteUser(userId: string) {
  return request<{ ok: boolean; userId: string; deleted: boolean }>(
    `/admin/users/${userId}`,
    {
      method: "DELETE",
    }
  );
}

// Delete product
export async function deleteProduct(productId: string) {
  return request<{ ok: boolean; productId: string; deleted: boolean }>(
    `/admin/products/${productId}`,
    {
      method: "DELETE",
    }
  );
}

// Billing types
export interface BillingKpis {
  mrr: number;
  arr: number;
  activeSubscribers: number;
  arpu: number;
  churnRate30d: number;
}

export interface PlanBucket {
  plan: Plan;
  subscribers: number;
  mrr: number;
}

export interface FailedPayment {
  id: string;
  userEmail: string;
  plan: Plan;
  amount: number;
  reason: string;
  attemptedAt: string;
  nextRetryAt?: string;
  status: "Open" | "Retry Scheduled" | "Resolved" | "Canceled";
  attempts: number;
}

export interface PageRequest {
  page: number;
  pageSize: number;
  filters?: Record<string, any>;
}

export interface PageResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

// Get billing metrics (MRR, ARR, ARPU, Active Subscribers, Churn Rate)
export async function fetchBillingMetrics() {
  return request<BillingKpis>("/admin/billing/metrics", {
    method: "GET",
  });
}

// Get plan distribution (Free, Client Plus, Enterprise)
export async function fetchPlanDistribution() {
  return request<PlanBucket[]>("/admin/billing/plan-distribution", {
    method: "GET",
  });
}

// Get failed payments with pagination and filters
export async function fetchFailedPayments(params: PageRequest) {
  const queryParams = new URLSearchParams({
    page: params.page.toString(),
    pageSize: params.pageSize.toString(),
    ...(params.filters?.plan && { plan: params.filters.plan }),
    ...(params.filters?.status && { status: params.filters.status }),
    ...(params.filters?.userEmail && { userEmail: params.filters.userEmail }),
  });

  return request<PageResponse<FailedPayment>>(
    `/admin/billing/failed-payments?${queryParams}`,
    {
      method: "GET",
    }
  );
}
