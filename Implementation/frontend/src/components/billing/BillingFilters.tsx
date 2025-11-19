import type { Plan, FailedPaymentStatus } from "../../lib/mock";

export type FiltersValue = {
  range: "30d" | "90d" | "180d";
  plan: "all" | Plan;
  status: "all" | FailedPaymentStatus;
  q: string;
};

type Props = {
  value: FiltersValue;
  onChange: (v: FiltersValue) => void;
};

export function BillingFilters({ value, onChange }: Props) {
  const handleChange = (key: keyof FiltersValue, newValue: string) => {
    onChange({ ...value, [key]: newValue });
  };

  return (
    <div className="bg-white p-4 flex flex-wrap items-center gap-3">
      {/* Date Range */}
      <div className="flex items-center gap-2">
        <label htmlFor="range" className="text-sm font-medium text-gray-700">
          Date Range:
        </label>
        <select
          id="range"
          value={value.range}
          onChange={(e) =>
            handleChange("range", e.target.value as "30d" | "90d" | "180d")
          }
          className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="30d">Last 30d</option>
          <option value="90d">Last 90d</option>
          <option value="180d">Last 180d</option>
        </select>
      </div>

      {/* Plan Filter */}
      <div className="flex items-center gap-2">
        <label htmlFor="plan" className="text-sm font-medium text-gray-700">
          Plan:
        </label>
        <select
          id="plan"
          value={value.plan}
          onChange={(e) => handleChange("plan", e.target.value)}
          className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All</option>
          <option value="Client Plus">Client Plus</option>
          <option value="Enterprise">Enterprise</option>
        </select>
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-2">
        <label htmlFor="status" className="text-sm font-medium text-gray-700">
          Status:
        </label>
        <select
          id="status"
          value={value.status}
          onChange={(e) => handleChange("status", e.target.value)}
          className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All</option>
          <option value="Open">Open</option>
          <option value="Retry Scheduled">Retry Scheduled</option>
          <option value="Resolved">Resolved</option>
          <option value="Canceled">Canceled</option>
        </select>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        <label htmlFor="search" className="text-sm font-medium text-gray-700">
          Search:
        </label>
        <input
          id="search"
          type="text"
          placeholder="by user email"
          value={value.q}
          onChange={(e) => handleChange("q", e.target.value)}
          className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[200px]"
        />
      </div>
    </div>
  );
}
