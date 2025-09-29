import React from "react";
import {
  IcOverview, IcUsers, IcUpload, IcFunnel, IcQuotes, IcBilling, IcUsage, IcAlerts,
} from "./Icons";

export type NavKey =
  | "overview" | "users" | "uploads" | "onboarding" | "testimonials" | "billing" | "usage" | "alerts";

export type NavItem = { key: NavKey; label: string; icon: React.ReactNode };

const items: NavItem[] = [
  { key: "overview", label: "Overview", icon: <IcOverview /> },
  { key: "users", label: "User Management", icon: <IcUsers /> },
  { key: "uploads", label: "Uploads", icon: <IcUpload /> },
  { key: "onboarding", label: "Onboarding Funnel", icon: <IcFunnel /> },
  { key: "testimonials", label: "Testimonials", icon: <IcQuotes /> },
  { key: "billing", label: "Billing", icon: <IcBilling /> },
  { key: "usage", label: "Usage Stats", icon: <IcUsage /> },
  { key: "alerts", label: "Alerts", icon: <IcAlerts /> },
];

export function Sidebar({
  active, onChange,
}: { active: NavKey; onChange: (key: NavKey) => void }) {
  return (
    <aside className="w-64 shrink-0 border-r bg-white">
      <div className="px-4 py-4 text-lg font-semibold">Admin Dashboard</div>
      <nav className="space-y-1 px-2 pb-4">
        {items.map((it) => {
          const isActive = active === it.key;
          return (
            <button
              key={it.key}
              onClick={() => onChange(it.key)}
              className={[
                "w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm transition",
                isActive
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-700 hover:bg-slate-50",
              ].join(" ")}
            >
              <span className="text-slate-500">{it.icon}</span>
              <span className="truncate">{it.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
