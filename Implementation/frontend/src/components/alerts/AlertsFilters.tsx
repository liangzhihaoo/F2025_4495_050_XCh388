import type { Severity } from "../../lib/mock";

export type Queue = "flagged" | "system" | "audit";

export type FiltersValue = {
  queue: Queue;
  q: string;
  severity: "all" | "low" | "medium" | "high";
  range: "7d" | "30d" | "90d";
};

type Props = {
  value: FiltersValue;
  onChange: (v: FiltersValue) => void;
};

export function AlertsFilters({ value, onChange }: Props) {
  const handleChange = (key: keyof FiltersValue, newValue: string) => {
    onChange({ ...value, [key]: newValue });
  };

  const queueTabs = [
    { key: "flagged" as const, label: "Flagged" },
    { key: "system" as const, label: "System Alerts" },
    { key: "audit" as const, label: "Audit Log" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      {/* Queue Type Tabs */}
      <div className="flex items-center gap-1 mb-4">
        {queueTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleChange("queue", tab.key)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              value.queue === tab.key
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="flex items-center gap-2">
          <label htmlFor="search" className="text-sm font-medium text-gray-700">
            Search:
          </label>
          <input
            id="search"
            type="text"
            placeholder="ID, title, email"
            value={value.q}
            onChange={(e) => handleChange("q", e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[200px]"
          />
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-2">
          <label htmlFor="severity" className="text-sm font-medium text-gray-700">
            Severity:
          </label>
          <select
            id="severity"
            value={value.severity}
            onChange={(e) => handleChange("severity", e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Date Range */}
        <div className="flex items-center gap-2">
          <label htmlFor="range" className="text-sm font-medium text-gray-700">
            Date Range:
          </label>
          <select
            id="range"
            value={value.range}
            onChange={(e) => handleChange("range", e.target.value as "7d" | "30d" | "90d")}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Last 7d</option>
            <option value="30d">Last 30d</option>
            <option value="90d">Last 90d</option>
          </select>
        </div>
      </div>
    </div>
  );
}
