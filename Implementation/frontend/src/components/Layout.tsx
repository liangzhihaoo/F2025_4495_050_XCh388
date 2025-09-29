import React, { useState } from "react";
import { Sidebar, type NavKey } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Placeholder } from "./Placeholder";
import Overview from "../pages/Dashboard/Overview";

const titles: Record<NavKey, string> = {
  overview: "Overview",
  users: "User Management",
  uploads: "Uploads",
  onboarding: "Onboarding Funnel",
  testimonials: "Testimonials",
  billing: "Billing",
  usage: "Usage Stats",
  alerts: "Alerts",
};

export function Layout() {
  const [active, setActive] = useState<NavKey>("overview");

  return (
    <div className="flex h-full">
      <Sidebar active={active} onChange={setActive} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />

        <main className="min-h-0 flex-1 overflow-y-auto p-4">
          {active === "overview" ? (
            <Overview />
          ) : (
            <Placeholder title={titles[active]} />
          )}
        </main>
      </div>
    </div>
  );
}
