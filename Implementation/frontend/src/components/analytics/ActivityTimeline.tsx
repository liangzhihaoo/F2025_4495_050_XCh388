import { useState } from 'react'
import type { ActivityEvent, AggregateBucket } from '../../lib/mock'
// import { formatDateTime } from '../../lib/format' // Not used in current implementation

type Props = {
  userEvents: ActivityEvent[];
  cohortBuckets: AggregateBucket[];
  onSearchUser: (query: string) => void;
};

export default function ActivityTimeline({ userEvents, cohortBuckets }: Props) {
  const [activeTab, setActiveTab] = useState<'user' | 'cohort'>('user')

  const humanizeEventName = (event: string) => {
    return event
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const formatEventTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('user')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${
            activeTab === 'user'
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          User Timeline
        </button>
        <button
          onClick={() => setActiveTab('cohort')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${
            activeTab === 'cohort'
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Cohort Activity
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'user' ? (
        <div className="space-y-3">
          {userEvents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No user events found</p>
              <p className="text-sm">Try searching for a different user ID</p>
            </div>
          ) : (
            <div role="list" className="space-y-3">
              {userEvents
                .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                .map((event, index) => (
                  <div
                    key={`${event.distinctId}-${event.timestamp}-${index}`}
                    role="listitem"
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-shrink-0 w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900">
                          {humanizeEventName(event.event)}
                        </h4>
                        <time className="text-xs text-gray-500">
                          {formatEventTime(event.timestamp)}
                        </time>
                      </div>
                      {event.properties && Object.keys(event.properties).length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {Object.entries(event.properties).map(([key, value]) => (
                            <span
                              key={key}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                            >
                              {key}: {String(value)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {cohortBuckets.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No cohort data available</p>
            </div>
          ) : (
            <div className="space-y-2">
              {cohortBuckets.slice(-7).map((bucket) => {
                const maxCount = Math.max(...Object.values(bucket.counts))
                const steps = ["Sign Up Started", "Sign Up Completed", "Email Verified", "First Upload", "Profile Completed"]
                
                return (
                  <div key={bucket.date} className="flex items-center gap-3">
                    <div className="w-20 text-xs text-gray-600 font-medium">
                      {new Date(bucket.date).toLocaleDateString()}
                    </div>
                    <div className="flex-1 flex items-center gap-1">
                      {steps.map((step, index) => {
                        const count = bucket.counts[step] || 0
                        const width = maxCount > 0 ? (count / maxCount) * 100 : 0
                        const colors = [
                          'bg-blue-500',
                          'bg-green-500', 
                          'bg-yellow-500',
                          'bg-purple-500',
                          'bg-pink-500'
                        ]
                        
                        return (
                          <div
                            key={step}
                            className={`h-4 ${colors[index]} rounded-sm transition-all duration-300`}
                            style={{ width: `${Math.max(width, 2)}%` }}
                            title={`${step}: ${count}`}
                          />
                        )
                      })}
                    </div>
                    <div className="w-16 text-xs text-gray-600 text-right">
                      {Object.values(bucket.counts).reduce((sum, count) => sum + count, 0)}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
