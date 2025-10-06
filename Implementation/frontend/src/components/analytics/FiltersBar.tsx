import { useState } from 'react'

export type FiltersValue = {
  range: "7d" | "30d" | "90d";
  cohortLabel: string;
  userQuery: string;
};

type Props = {
  value: FiltersValue;
  onChange: (v: FiltersValue) => void;
  onRefresh: () => void;
};

export default function FiltersBar({ value, onChange, onRefresh }: Props) {
  const [localCohortLabel, setLocalCohortLabel] = useState(value.cohortLabel)
  const [localUserQuery, setLocalUserQuery] = useState(value.userQuery)

  const handleRangeChange = (range: "7d" | "30d" | "90d") => {
    onChange({ ...value, range })
  }

  const handleCohortLabelChange = (cohortLabel: string) => {
    setLocalCohortLabel(cohortLabel)
    onChange({ ...value, cohortLabel })
  }

  const handleUserQueryChange = (userQuery: string) => {
    setLocalUserQuery(userQuery)
    onChange({ ...value, userQuery })
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex flex-wrap items-center gap-3">
      {/* Date Range */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">Date Range:</label>
        <div className="flex rounded-lg border border-gray-200 overflow-hidden">
          {(["7d", "30d", "90d"] as const).map((range) => (
            <button
              key={range}
              onClick={() => handleRangeChange(range)}
              className={`px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${
                value.range === range
                  ? "bg-indigo-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Cohort Label */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">Cohort:</label>
        <input
          type="text"
          value={localCohortLabel}
          onChange={(e) => handleCohortLabelChange(e.target.value)}
          placeholder="Enter cohort label"
          className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* User Search */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">User:</label>
        <input
          type="text"
          value={localUserQuery}
          onChange={(e) => handleUserQueryChange(e.target.value)}
          placeholder="Search by ID or email"
          className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Refresh Button */}
      <button
        onClick={onRefresh}
        className="ml-auto px-4 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition-colors"
      >
        Refresh Mock Data
      </button>
    </div>
  )
}
