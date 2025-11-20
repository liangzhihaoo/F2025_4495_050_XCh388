export function mockTimeSeries(daysOrPoints: number, key = "value") {
  const out: { date: string; [k: string]: number }[] = [];
  const now = new Date();
  for (let i = daysOrPoints - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const date = d.toISOString().slice(0, 10);
    const base = 50 + Math.sin(i / 3) * 15;
    const jitter = Math.floor(Math.random() * 20);
    const value = Math.max(0, Math.round(base + jitter));
    out.push({ date, [key]: value });
  }
  return out;
}

export function mockBarSeries(labels: string[], key = "value") {
  return labels.map((label, idx) => {
    const base = 200 + Math.cos(idx / 2) * 50;
    const jitter = Math.floor(Math.random() * 60);
    return { label, [key]: Math.max(0, Math.round(base + jitter)) };
  });
}

export type Notification = {
  id: string;
  ts: string;
  title: string;
  body?: string;
  severity?: "info" | "warn" | "error";
};

export function mockNotifications(n: number): Notification[] {
  const severities: Notification["severity"][] = ["info", "warn", "error"];
  const now = Date.now();
  return Array.from({ length: n }).map((_, i) => {
    const ts = new Date(
      now - i * 1000 * 60 * (15 + Math.floor(Math.random() * 60))
    ).toISOString();
    const severity = severities[i % severities.length];
    return {
      id: `n_${i}_${Math.random().toString(36).slice(2, 6)}`,
      ts,
      title:
        severity === "error"
          ? "Upload failed"
          : severity === "warn"
          ? "High usage detected"
          : "New signup",
      body:
        severity === "error"
          ? "An error occurred while processing an upload job."
          : severity === "warn"
          ? "Traffic spike observed. Monitoring closely."
          : "A new user joined the platform.",
      severity,
    };
  });
}

export type User = {
  id: string; // uuid from Supabase
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  stripe_customer_id: string | null;
  plan: "Free" | "Client Plus" | "Enterprise" | null;
  upload_limit: number | null;
  created_at: string | null; // ISO timestamp string
  is_active: boolean;
};

export function mockUsers(n: number): User[] {
  return Array.from({ length: n }).map((_, i) => ({
    id: `u-${i + 1}`,
    email: `user${i + 1}@example.com`,
    first_name: Math.random() > 0.1 ? `First${i + 1}` : null,
    last_name: Math.random() > 0.1 ? `Last${i + 1}` : null,
    phone: Math.random() > 0.3 ? `+1555${String(i).padStart(7, "0")}` : null,
    stripe_customer_id:
      Math.random() > 0.2
        ? `cus_${Math.random().toString(36).substr(2, 9)}`
        : null,
    plan: (["Free", "Client Plus", "Enterprise", null] as const)[
      Math.floor(Math.random() * 4)
    ],
    upload_limit: Math.random() > 0.1 ? Math.floor(Math.random() * 1000) : null,
    created_at: new Date(
      Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000)
    ).toISOString(),
    is_active: Math.random() > 0.1,
  }));
}

export type UploadItem = {
  id: string; // submission id
  userId: string;
  userEmail: string;
  createdAt: string; // ISO string
  lastUpdatedAt: string; // ISO string
  title: string; // product name
  images: { id: string; url: string }[]; // 1..n
  notes?: string;
};

export function mockUploads(n: number): UploadItem[] {
  return Array.from({ length: n }).map((_, i) => ({
    id: `sub-${1000 + i}`,
    userId: `u${i % 12}`,
    userEmail: `user${i % 12}@demo.com`,
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    lastUpdatedAt: new Date(Date.now() - i * 86400000 + 3600000).toISOString(),
    title: `Item ${i + 1}`,
    images: Array.from({ length: (i % 4) + 1 }).map((__, j) => ({
      id: `img-${i}-${j}`,
      url: `https://picsum.photos/seed/${i}-${j}/320/320`,
    })),
    notes: i % 5 === 0 ? "Auto-check: possible duplicate." : undefined,
  }));
}

export type TestimonialStatus = "Published" | "Draft" | "Hidden";

export type Testimonial = {
  id: string;
  authorName: string;
  authorRole?: string; // e.g., "Founder, ACME"
  authorAvatarUrl?: string;
  company?: string;
  rating?: number; // 1..5 optional
  quote: string; // the testimonial text
  featured: boolean; // surfaced prominently on site
  status: TestimonialStatus;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  source?: "In-app" | "Imported" | "Manual";
};

export function mockTestimonials(n = 18): Testimonial[] {
  const pick = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
  const roles = ["CTO", "Founder", "PM", "Designer", "Ops Lead", "Engineer"];
  const companies = [
    "Nova Labs",
    "Bluefin",
    "Kepler",
    "Radian",
    "Glow",
    "Polar",
  ];
  return Array.from({ length: n }).map((_, i) => ({
    id: `t-${1000 + i}`,
    authorName: `User ${i + 1}`,
    authorRole: pick(roles),
    authorAvatarUrl: `https://i.pravatar.cc/80?img=${i + 1}`,
    company: pick(companies),
    rating: i % 3 === 0 ? 5 : i % 5 === 0 ? 4 : undefined,
    quote:
      "This platform made pricing our items fast and accurate. Great experience!",
    featured: i % 6 === 0,
    status: (["Published", "Draft", "Hidden"] as TestimonialStatus[])[i % 3],
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - i * 86400000 + 3600000).toISOString(),
    source: pick(["In-app", "Imported", "Manual"] as const),
  }));
}

// Onboarding Funnel Types and Mock Generators
export type FunnelStep = {
  name: string; // e.g., "Sign Up Started"
  entered: number; // users entering this step
  converted: number; // users moving to next step
  avgTimeMs?: number; // average time to move from this step to next
};

export type FunnelResponse = {
  steps: FunnelStep[]; // ordered steps
  totalConversionRate: number; // converted at final step / entered at first
};

export function mockFunnel(): FunnelResponse {
  // 5 example steps, descending counts
  const base = 1000 + Math.floor(Math.random() * 200);
  const s1 = base;
  const s2 = Math.round(s1 * 0.72);
  const s3 = Math.round(s2 * 0.68);
  const s4 = Math.round(s3 * 0.75);
  const s5 = Math.round(s4 * 0.82);
  const steps: FunnelStep[] = [
    {
      name: "Sign Up Started",
      entered: s1,
      converted: s2,
      avgTimeMs: 4 * 60 * 1000,
    },
    {
      name: "Sign Up Completed",
      entered: s2,
      converted: s3,
      avgTimeMs: 6 * 60 * 1000,
    },
    {
      name: "Email Verified",
      entered: s3,
      converted: s4,
      avgTimeMs: 15 * 60 * 1000,
    },
    {
      name: "First Upload",
      entered: s4,
      converted: s5,
      avgTimeMs: 22 * 60 * 1000,
    },
    { name: "Profile Completed", entered: s5, converted: s5, avgTimeMs: 0 }, // terminal
  ];
  const totalConversionRate = s5 / s1;
  return { steps, totalConversionRate };
}

export type ActivityEvent = {
  distinctId: string;
  event: string; // e.g., 'sign_up_completed'
  timestamp: string; // ISO
  properties?: Record<string, any>;
};

export function mockUserEvents(distinctId = "u-123"): ActivityEvent[] {
  const now = Date.now();
  const seq = [
    ["sign_up_started", -60 * 60 * 1000],
    ["sign_up_completed", -55 * 60 * 1000],
    ["email_verified", -40 * 60 * 1000],
    ["first_upload", -20 * 60 * 1000],
    ["profile_completed", -10 * 60 * 1000],
  ] as const;
  return seq.map(([ev, offset]) => ({
    distinctId,
    event: ev,
    timestamp: new Date(now + offset).toISOString(),
    properties: ev === "first_upload" ? { images_count: 3 } : undefined,
  }));
}

export type AggregateBucket = {
  date: string; // yyyy-mm-dd
  counts: Record<string, number>; // stepName -> users count
};

export function mockCohortBuckets(days = 14): AggregateBucket[] {
  const steps = [
    "Sign Up Started",
    "Sign Up Completed",
    "Email Verified",
    "First Upload",
    "Profile Completed",
  ];
  const today = new Date();
  const res: AggregateBucket[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const date = d.toISOString().slice(0, 10);
    const base = 40 + Math.floor(Math.random() * 30);
    const counts: Record<string, number> = {
      [steps[0]]: base,
      [steps[1]]: Math.round(base * 0.7),
      [steps[2]]: Math.round(base * 0.5),
      [steps[3]]: Math.round(base * 0.42),
      [steps[4]]: Math.round(base * 0.35),
    };
    res.push({ date, counts });
  }
  return res;
}

// Billing Types and Mock Generators
export type Plan = "Free" | "Client Plus" | "Enterprise";

export type BillingKpis = {
  mrr: number; // Monthly Recurring Revenue
  arr: number; // Annualized
  activeSubscribers: number; // paying subs (excludes Free)
  arpu: number; // Avg Revenue Per User (paying)
  churnRate30d: number; // last 30d logo churn
};

export type PlanBucket = { plan: Plan; subscribers: number; mrr: number };

export type FailedPaymentStatus =
  | "Open"
  | "Retry Scheduled"
  | "Resolved"
  | "Canceled";

export type FailedPayment = {
  id: string;
  userEmail: string;
  plan: Plan;
  amount: number; // cents or units; we'll treat as dollars for mock
  reason: string; // "Card declined", "Insufficient funds", etc.
  attemptedAt: string; // ISO
  nextRetryAt?: string; // ISO
  status: FailedPaymentStatus;
  attempts: number; // number of tries so far
};

export function mockBillingKpis(): BillingKpis {
  const activeSubscribers = 820 + Math.floor(Math.random() * 120);
  const arpu = 18 + Math.random() * 12; // $
  const mrr = Math.round(activeSubscribers * arpu);
  const arr = mrr * 12;
  const churnRate30d = 0.025 + Math.random() * 0.01; // 2.5%–3.5%
  return { mrr, arr, activeSubscribers, arpu, churnRate30d };
}

export function mockPlanBuckets(): PlanBucket[] {
  const plus = 600 + Math.floor(Math.random() * 120);
  const ent = 80 + Math.floor(Math.random() * 30);
  return [
    { plan: "Client Plus", subscribers: plus, mrr: plus * 20 },
    { plan: "Enterprise", subscribers: ent, mrr: ent * 120 },
    {
      plan: "Free",
      subscribers: 1500 + Math.floor(Math.random() * 300),
      mrr: 0,
    },
  ];
}

export function mockFailedPayments(n = 24): FailedPayment[] {
  const reasons = [
    "Card declined",
    "Insufficient funds",
    "Expired card",
    "Network error",
  ];
  const statuses: FailedPaymentStatus[] = [
    "Open",
    "Retry Scheduled",
    "Resolved",
    "Canceled",
  ];
  return Array.from({ length: n }).map((_, i) => {
    const status = statuses[i % statuses.length];
    const now = Date.now();
    return {
      id: `fp-${1000 + i}`,
      userEmail: `user${i}@demo.com`,
      plan: i % 7 === 0 ? "Enterprise" : "Client Plus",
      amount: i % 7 === 0 ? 120 : 20,
      reason: reasons[i % reasons.length],
      attemptedAt: new Date(now - (i + 1) * 36e5).toISOString(),
      nextRetryAt:
        status === "Retry Scheduled"
          ? new Date(now + (i + 2) * 36e5).toISOString()
          : undefined,
      status,
      attempts: (i % 3) + 1,
    };
  });
}

// Usage Analytics Types and Mock Generators
export type UsagePoint = { date: string; value: number }; // ISO date, daily

export type UserQuotaRow = {
  id: string;
  email: string;
  plan: "Free" | "Client Plus" | "Enterprise";
  uploadsThisPeriod: number;
  quota: number; // plan limit for the period
  pct: number; // uploadsThisPeriod / quota
  lastActive: string; // ISO
};

export type UsageKpis = {
  totalUploads: number; // period sum
  avgUploadsPerUser: number; // period avg among active users
  dau: number; // yesterday or last day
  wau: number; // last 7d unique users
  mau: number; // last 30d unique users
};

const isoDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString();

export function mockUsageSeries(days = 90, base = 120): UsagePoint[] {
  const out: UsagePoint[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const noise = Math.round(base + Math.sin(i / 6) * 20 + Math.random() * 25);
    out.push({ date: isoDay(d), value: Math.max(0, noise) });
  }
  return out;
}

export function mockSignupsSeries(days = 90, base = 18): UsagePoint[] {
  const out: UsagePoint[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const noise = Math.round(base + Math.cos(i / 8) * 6 + Math.random() * 8);
    out.push({ date: isoDay(d), value: Math.max(0, noise) });
  }
  return out;
}

export function mockActiveUsersSeries(days = 90, base = 220): UsagePoint[] {
  const out: UsagePoint[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const noise = Math.round(base + Math.sin(i / 10) * 35 + Math.random() * 20);
    out.push({ date: isoDay(d), value: Math.max(0, noise) });
  }
  return out;
}

export function mockUsageKpis(
  series: UsagePoint[],
  signups: UsagePoint[],
  activeSeries: UsagePoint[]
): UsageKpis {
  const totalUploads = series.reduce((a, b) => a + b.value, 0);
  const dau = activeSeries.at(-1)?.value ?? 0;
  const wau = activeSeries
    .slice(-7)
    .reduce((a, b) => a + Math.round(b.value / 7), 0); // rough mock
  const mau = activeSeries
    .slice(-30)
    .reduce((a, b) => a + Math.round(b.value / 30), 0); // rough mock
  const activeUsersApprox = Math.max(1, activeSeries.at(-1)?.value ?? 1);
  const avgUploadsPerUser = +(totalUploads / activeUsersApprox).toFixed(2);
  return { totalUploads, avgUploadsPerUser, dau, wau, mau };
}

export function mockQuotaList(n = 20): UserQuotaRow[] {
  return Array.from({ length: n })
    .map((_, i) => {
      const plan =
        i % 7 === 0 ? "Enterprise" : i % 3 === 0 ? "Client Plus" : "Free";
      const quota =
        plan === "Enterprise" ? 5000 : plan === "Client Plus" ? 1000 : 200;
      const uploads = Math.floor(quota * (0.6 + Math.random() * 0.5)); // 60%–110%
      const pct = uploads / quota;
      return {
        id: `u${1000 + i}`,
        email: `user${i}@demo.com`,
        plan,
        uploadsThisPeriod: uploads,
        quota,
        pct,
        lastActive: new Date(
          Date.now() - Math.random() * 7 * 24 * 3600 * 1000
        ).toISOString(),
      };
    })
    .sort((a, b) => b.pct - a.pct);
}

// Alerts & Moderation Types and Mock Generators
export type Severity = "low" | "medium" | "high";
export type FlagReason =
  | "blurry"
  | "duplicate"
  | "nsfw"
  | "copyright"
  | "spam"
  | "other";

export type FlaggedItem = {
  id: string; // submission id
  userEmail: string;
  createdAt: string; // when upload happened
  flaggedAt: string; // when flag fired
  title: string; // product name
  images: { id: string; url: string }[]; // evidence
  reasons: FlagReason[]; // one or more
  severity: Severity;
  notes?: string; // system notes
  status: "open" | "approved" | "deleted"; // moderation result
};

export type SystemAlert = {
  id: string;
  type: "missing_profile" | "payment_issue" | "quota_exceeded" | "other";
  userEmail?: string;
  createdAt: string;
  message: string;
  severity: Severity;
  status: "open" | "resolved" | "snoozed";
};

export type AuditRow = {
  id: string;
  ts: string; // ISO
  actor: string; // admin email or name
  action:
    | "approve"
    | "delete"
    | "resolve"
    | "snooze"
    | "bulk_approve"
    | "bulk_delete";
  targetType: "flag" | "system";
  targetId: string;
  meta?: Record<string, any>;
};

export function mockFlagged(n = 28): FlaggedItem[] {
  const reasons: FlagReason[] = [
    "blurry",
    "duplicate",
    "nsfw",
    "copyright",
    "spam",
    "other",
  ];
  const severities: Severity[] = ["low", "medium", "high"];
  return Array.from({ length: n }).map((_, i) => ({
    id: `sub-${1100 + i}`,
    userEmail: `user${i}@demo.com`,
    createdAt: new Date(Date.now() - (i + 6) * 36e5).toISOString(),
    flaggedAt: new Date(Date.now() - (i + 2) * 36e5).toISOString(),
    title: `Item ${i + 1}`,
    images: Array.from({ length: (i % 3) + 1 }).map((__, j) => ({
      id: `img-${i}-${j}`,
      url: `https://picsum.photos/seed/f${i}-${j}/240/240`,
    })),
    reasons: [reasons[i % reasons.length]],
    severity: severities[i % severities.length],
    notes: i % 5 === 0 ? "Auto-detector: potential duplicate." : undefined,
    status: "open",
  }));
}

export function mockSystemAlerts(n = 14): SystemAlert[] {
  const types: SystemAlert["type"][] = [
    "missing_profile",
    "payment_issue",
    "quota_exceeded",
    "other",
  ];
  const sev: Severity[] = ["low", "medium", "high"];
  return Array.from({ length: n }).map((_, i) => ({
    id: `sa-${1000 + i}`,
    type: types[i % types.length],
    userEmail: i % 3 === 0 ? `user${i}@demo.com` : undefined,
    createdAt: new Date(Date.now() - (i + 1) * 18e5).toISOString(),
    message:
      i % 3 === 0
        ? "User missing billing address."
        : i % 3 === 1
        ? "Payment retry scheduled."
        : "Usage exceeded 95% of quota.",
    severity: sev[i % sev.length],
    status: "open",
  }));
}

export function mockAuditLog(n = 30): AuditRow[] {
  const actions: AuditRow["action"][] = [
    "approve",
    "delete",
    "resolve",
    "snooze",
    "bulk_approve",
    "bulk_delete",
  ];
  return Array.from({ length: n }).map((_, i) => ({
    id: `log-${i}`,
    ts: new Date(Date.now() - i * 12e5).toISOString(),
    actor: i % 2 ? "admin@gluu.demo" : "ops@gluu.demo",
    action: actions[i % actions.length],
    targetType: i % 2 ? "flag" : "system",
    targetId: i % 2 ? `sub-${1100 + (i % 20)}` : `sa-${1000 + (i % 10)}`,
    meta: { reason: i % 2 ? "duplicate" : "payment_issue" },
  }));
}
