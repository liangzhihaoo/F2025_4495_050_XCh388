import type { FunnelStep } from '../../lib/mock'
import { formatDuration } from '../../lib/format'

type Props = { 
  steps: FunnelStep[];
};

export default function StepTimeTable({ steps }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-2 font-medium text-gray-700">Step</th>
            <th className="text-left py-3 px-2 font-medium text-gray-700">→ Next Step</th>
            <th className="text-left py-3 px-2 font-medium text-gray-700">Avg Time</th>
            <th className="text-right py-3 px-2 font-medium text-gray-700">Entered</th>
            <th className="text-right py-3 px-2 font-medium text-gray-700">Converted</th>
            <th className="text-right py-3 px-2 font-medium text-gray-700">Drop-off</th>
          </tr>
        </thead>
        <tbody>
          {steps.map((step, index) => {
            const isLastStep = index === steps.length - 1
            const nextStepName = isLastStep ? "—" : steps[index + 1]?.name || "—"
            const dropOff = step.entered - step.converted
            // const conversionRate = isLastStep ? 1 : (step.converted / step.entered) // Not used in current implementation

            return (
              <tr key={step.name} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-2 font-medium text-gray-900">{step.name}</td>
                <td className="py-3 px-2 text-gray-600">{nextStepName}</td>
                <td className="py-3 px-2 text-gray-600">
                  {formatDuration(step.avgTimeMs)}
                </td>
                <td className="py-3 px-2 text-right text-gray-700">
                  {step.entered.toLocaleString()}
                </td>
                <td className="py-3 px-2 text-right text-gray-700">
                  {step.converted.toLocaleString()}
                </td>
                <td className="py-3 px-2 text-right">
                  {dropOff > 0 ? (
                    <span className="text-red-600 font-medium">
                      -{dropOff.toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
