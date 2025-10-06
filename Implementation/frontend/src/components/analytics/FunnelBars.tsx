import type { FunnelStep } from '../../lib/mock'
import { formatPct } from '../../lib/format'

type Props = { 
  steps: FunnelStep[];
  totalConversionRate: number;
};

export default function FunnelBars({ steps, totalConversionRate }: Props) {
  const firstStepEntered = steps[0]?.entered || 1

  return (
    <div className="space-y-4">
      {/* Overall Conversion Rate */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">Overall Conversion Rate</h4>
        <div className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full">
          {formatPct(totalConversionRate)}
        </div>
      </div>

      {/* Funnel Steps */}
      <div className="space-y-3">
        {steps.map((step, index) => {
          const isLastStep = index === steps.length - 1
          const cumulativeRate = step.entered / firstStepEntered
          const stepRate = isLastStep ? 1 : (step.converted / step.entered)
          const dropOff = step.entered - step.converted

          return (
            <div key={step.name} className="grid grid-cols-12 gap-3 items-center">
              {/* Step Name */}
              <div className="col-span-3">
                <div className="text-sm font-medium text-gray-900">{step.name}</div>
              </div>

              {/* Progress Bar */}
              <div className="col-span-6">
                <div className="bg-gray-100 h-3 rounded-full overflow-hidden">
                  <div 
                    className="h-3 bg-indigo-500 rounded-full transition-all duration-300"
                    style={{ width: `${cumulativeRate * 100}%` }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="col-span-3 text-right">
                <div className="text-sm text-gray-700">
                  <div className="font-medium">{step.entered.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">
                    {isLastStep ? (
                      <span className="text-green-600">Completed</span>
                    ) : (
                      <>
                        → {step.converted.toLocaleString()} ({formatPct(stepRate)})
                        {dropOff > 0 && (
                          <div className="text-red-600">-{dropOff.toLocaleString()}</div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
