import type { Plan } from "../../lib/mock";

export type FiltersValue = {
  range: "7d" | "30d" | "90d";
  granularity: "D" | "W" | "M";
  plan: "all" | "Free" | "Client Plus" | "Enterprise";
  q: string;
};

type Props = {
  value: FiltersValue;
  onChange: (v: FiltersValue) => void;
};

export function UsageFilters({ value, onChange }: Props) {
  const handleChange = (key: keyof FiltersValue, newValue: string) => {
    onChange({ ...value, [key]: newValue });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex flex-wrap items-center gap-3">
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

      {/* Granularity */}
      <div className="flex items-center gap-2">
        <label htmlFor="granularity" className="text-sm font-medium text-gray-700">
          Granularity:
        </label>
        <select
          id="granularity"
          value={value.granularity}
          onChange={(e) => handleChange("granularity", e.target.value as "D" | "W" | "M")}
          className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="D">Daily</option>
          <option value="W">Weekly</option>
          <option value="M">Monthly</option>
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
          <option value="Free">Free</option>
          <option value="Client Plus">Client Plus</option>
          <option value="Enterprise">Enterprise</option>
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
