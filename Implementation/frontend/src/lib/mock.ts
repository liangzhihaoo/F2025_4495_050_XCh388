export function mockTimeSeries(daysOrPoints: number, key = 'value') {
  const out: { date: string; [k: string]: number }[] = []
  const now = new Date()
  for (let i = daysOrPoints - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(now.getDate() - i)
    const date = d.toISOString().slice(0, 10)
    const base = 50 + Math.sin(i / 3) * 15
    const jitter = Math.floor(Math.random() * 20)
    const value = Math.max(0, Math.round(base + jitter))
    out.push({ date, [key]: value })
  }
  return out
}

export function mockBarSeries(labels: string[], key = 'value') {
  return labels.map((label, idx) => {
    const base = 200 + Math.cos(idx / 2) * 50
    const jitter = Math.floor(Math.random() * 60)
    return { label, [key]: Math.max(0, Math.round(base + jitter)) }
  })
}

export type Notification = {
  id: string
  ts: string
  title: string
  body?: string
  severity?: 'info' | 'warn' | 'error'
}

export function mockNotifications(n: number): Notification[] {
  const severities: Notification['severity'][] = ['info', 'warn', 'error']
  const now = Date.now()
  return Array.from({ length: n }).map((_, i) => {
    const ts = new Date(now - i * 1000 * 60 * (15 + Math.floor(Math.random() * 60)))
      .toISOString()
    const severity = severities[i % severities.length]
    return {
      id: `n_${i}_${Math.random().toString(36).slice(2, 6)}`,
      ts,
      title: severity === 'error' ? 'Upload failed' : severity === 'warn' ? 'High usage detected' : 'New signup',
      body:
        severity === 'error'
          ? 'An error occurred while processing an upload job.'
          : severity === 'warn'
          ? 'Traffic spike observed. Monitoring closely.'
          : 'A new user joined the platform.',
      severity,
    }
  })
}

export type User = {
  id: string
  name: string
  email: string
  plan: 'Free' | 'Client Plus' | 'Enterprise'
  status: 'Active' | 'Suspended'
  createdAt: string
  lastActive: string
  uploads: number
  onboarding: 'Complete' | 'Partial' | 'Not Started'
}

export function mockUsers(n: number): User[] {
  return Array.from({ length: n }).map((_, i) => ({
    id: `u${i}`,
    name: `User ${i}`,
    email: `user${i}@demo.com`,
    plan: i % 2 === 0 ? 'Free' : 'Client Plus',
    status: i % 5 === 0 ? 'Suspended' : 'Active',
    createdAt: '2025-01-01',
    lastActive: '2025-02-15',
    uploads: Math.floor(Math.random() * 200),
    onboarding: i % 3 === 0 ? 'Complete' : 'Partial',
  }))
}

export type UploadItem = {
  id: string                      // submission id
  userId: string
  userEmail: string
  createdAt: string               // ISO string
  lastUpdatedAt: string           // ISO string
  title: string                   // product name
  images: { id: string; url: string }[] // 1..n
  notes?: string
}

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
      url: `https://picsum.photos/seed/${i}-${j}/320/320`
    })),
    notes: i % 5 === 0 ? "Auto-check: possible duplicate." : undefined
  }))
}

export type TestimonialStatus = "Published" | "Draft" | "Hidden"

export type Testimonial = {
  id: string
  authorName: string
  authorRole?: string     // e.g., "Founder, ACME"
  authorAvatarUrl?: string
  company?: string
  rating?: number         // 1..5 optional
  quote: string           // the testimonial text
  featured: boolean       // surfaced prominently on site
  status: TestimonialStatus
  createdAt: string       // ISO
  updatedAt: string       // ISO
  source?: "In-app" | "Imported" | "Manual"
}

export function mockTestimonials(n = 18): Testimonial[] {
  const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)]
  const roles = ["CTO","Founder","PM","Designer","Ops Lead","Engineer"]
  const companies = ["Nova Labs","Bluefin","Kepler","Radian","Glow","Polar"]
  return Array.from({ length: n }).map((_, i) => ({
    id: `t-${1000 + i}`,
    authorName: `User ${i + 1}`,
    authorRole: pick(roles),
    authorAvatarUrl: `https://i.pravatar.cc/80?img=${i + 1}`,
    company: pick(companies),
    rating: (i % 3 === 0) ? 5 : (i % 5 === 0 ? 4 : undefined),
    quote: "This platform made pricing our items fast and accurate. Great experience!",
    featured: i % 6 === 0,
    status: (["Published","Draft","Hidden"] as TestimonialStatus[])[i % 3],
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - i * 86400000 + 3600000).toISOString(),
    source: pick(["In-app","Imported","Manual"] as const),
  }))
}

// Onboarding Funnel Types and Mock Generators
export type FunnelStep = {
  name: string;             // e.g., "Sign Up Started"
  entered: number;          // users entering this step
  converted: number;        // users moving to next step
  avgTimeMs?: number;       // average time to move from this step to next
};

export type FunnelResponse = {
  steps: FunnelStep[];      // ordered steps
  totalConversionRate: number; // converted at final step / entered at first
};

export function mockFunnel(): FunnelResponse {
  // 5 example steps, descending counts
  const base = 1000 + Math.floor(Math.random()*200);
  const s1 = base;
  const s2 = Math.round(s1 * 0.72);
  const s3 = Math.round(s2 * 0.68);
  const s4 = Math.round(s3 * 0.75);
  const s5 = Math.round(s4 * 0.82);
  const steps: FunnelStep[] = [
    { name: "Sign Up Started", entered: s1, converted: s2, avgTimeMs: 4*60*1000 },
    { name: "Sign Up Completed", entered: s2, converted: s3, avgTimeMs: 6*60*1000 },
    { name: "Email Verified", entered: s3, converted: s4, avgTimeMs: 15*60*1000 },
    { name: "First Upload", entered: s4, converted: s5, avgTimeMs: 22*60*1000 },
    { name: "Profile Completed", entered: s5, converted: s5, avgTimeMs: 0 }, // terminal
  ];
  const totalConversionRate = s5 / s1;
  return { steps, totalConversionRate };
}

export type ActivityEvent = {
  distinctId: string;
  event: string;            // e.g., 'sign_up_completed'
  timestamp: string;        // ISO
  properties?: Record<string, any>;
};

export function mockUserEvents(distinctId = "u-123"): ActivityEvent[] {
  const now = Date.now();
  const seq = [
    ["sign_up_started", -60*60*1000],
    ["sign_up_completed", -55*60*1000],
    ["email_verified", -40*60*1000],
    ["first_upload", -20*60*1000],
    ["profile_completed", -10*60*1000],
  ] as const;
  return seq.map(([ev, offset]) => ({
    distinctId,
    event: ev,
    timestamp: new Date(now + offset).toISOString(),
    properties: ev === "first_upload" ? { images_count: 3 } : undefined,
  }));
}

export type AggregateBucket = {
  date: string;  // yyyy-mm-dd
  counts: Record<string, number>; // stepName -> users count
};

export function mockCohortBuckets(days = 14): AggregateBucket[] {
  const steps = ["Sign Up Started","Sign Up Completed","Email Verified","First Upload","Profile Completed"];
  const today = new Date();
  const res: AggregateBucket[] = [];
  for (let i = days-1; i >= 0; i--) {
    const d = new Date(today); d.setDate(today.getDate() - i);
    const date = d.toISOString().slice(0,10);
    const base = 40 + Math.floor(Math.random()*30);
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


