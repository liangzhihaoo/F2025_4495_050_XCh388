// Tiny API client hitting /admin routes (dev: Vite proxy injects secret; prod: Admin Proxy injects secret).
export type Plan = "Free" | "Client Plus" | "Enterprise" | null;

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
