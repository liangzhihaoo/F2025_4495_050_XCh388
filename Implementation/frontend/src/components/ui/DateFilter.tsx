import { useState, useRef, useEffect } from 'react'

export type DateRange = {
  start: Date
  end: Date
}

export type DatePreset = {
  id: string
  label: string
  getRange: () => DateRange
}

type Props = {
  value: DateRange
  onChange: (range: DateRange) => void
  granularity: 'D' | 'W' | 'M'
  onGranularityChange: (granularity: 'D' | 'W' | 'M') => void
}

const PRESETS: DatePreset[] = [
  {
    id: 'today',
    label: 'Today',
    getRange: () => {
      const today = new Date()
      return { start: today, end: today }
    }
  },
  {
    id: 'yesterday',
    label: 'Yesterday',
    getRange: () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      return { start: yesterday, end: yesterday }
    }
  },
  {
    id: 'last7d',
    label: 'Last 7 days',
    getRange: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 6)
      return { start, end }
    }
  },
  {
    id: 'last30d',
    label: 'Last 30 days',
    getRange: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 29)
      return { start, end }
    }
  },
  {
    id: 'last90d',
    label: 'Last 90 days',
    getRange: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 89)
      return { start, end }
    }
  },
  {
    id: 'thisMonth',
    label: 'This month',
    getRange: () => {
      const now = new Date()
      const start = new Date(now.getFullYear(), now.getMonth(), 1)
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      return { start, end }
    }
  },
  {
    id: 'lastMonth',
    label: 'Last month',
    getRange: () => {
      const now = new Date()
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const end = new Date(now.getFullYear(), now.getMonth(), 0)
      return { start, end }
    }
  },
  {
    id: 'thisYear',
    label: 'This year',
    getRange: () => {
      const now = new Date()
      const start = new Date(now.getFullYear(), 0, 1)
      const end = new Date(now.getFullYear(), 11, 31)
      return { start, end }
    }
  }
]

export default function DateFilter({ value, onChange, granularity, onGranularityChange }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const [customStart, setCustomStart] = useState(value.start.toISOString().split('T')[0])
  const [customEnd, setCustomEnd] = useState(value.end.toISOString().split('T')[0])
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const formatDateRange = (range: DateRange) => {
    const startStr = range.start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const endStr = range.end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    
    if (range.start.getTime() === range.end.getTime()) {
      return startStr
    }
    
    return `${startStr} - ${endStr}`
  }

  const handlePresetSelect = (preset: DatePreset) => {
    const range = preset.getRange()
    onChange(range)
    setSelectedPreset(preset.id)
    setIsOpen(false)
  }

  const handleCustomRangeApply = () => {
    const start = new Date(customStart)
    const end = new Date(customEnd)
    
    if (start <= end) {
      onChange({ start, end })
      setSelectedPreset(null)
      setIsOpen(false)
    }
  }

  const handleCustomRangeReset = () => {
    setCustomStart(value.start.toISOString().split('T')[0])
    setCustomEnd(value.end.toISOString().split('T')[0])
  }

  return (
    <div className="flex items-center gap-2">
      {/* Date Range Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="min-w-0 flex-1 text-left">
            {selectedPreset 
              ? PRESETS.find(p => p.id === selectedPreset)?.label || formatDateRange(value)
              : formatDateRange(value)
            }
          </span>
          <svg className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <div className="p-4">
              {/* Presets */}
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Quick Select</h3>
                <div className="grid grid-cols-2 gap-1">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handlePresetSelect(preset)}
                      className={`px-3 py-2 text-sm text-left rounded hover:bg-gray-50 ${
                        selectedPreset === preset.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Range */}
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Custom Range</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">From</label>
                    <input
                      type="date"
                      value={customStart}
                      onChange={(e) => setCustomStart(e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">To</label>
                    <input
                      type="date"
                      value={customEnd}
                      onChange={(e) => setCustomEnd(e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCustomRangeReset}
                      className="px-3 py-1 text-xs text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                    >
                      Reset
                    </button>
                    <button
                      onClick={handleCustomRangeApply}
                      className="px-3 py-1 text-xs text-white bg-blue-600 rounded hover:bg-blue-700"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Granularity Selector */}
      <select
        className="border border-gray-300 rounded-md text-sm px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={granularity}
        onChange={(e) => onGranularityChange(e.target.value as 'D' | 'W' | 'M')}
        aria-label="Granularity"
      >
        <option value="D">Daily</option>
        <option value="W">Weekly</option>
        <option value="M">Monthly</option>
      </select>
    </div>
  )
}
