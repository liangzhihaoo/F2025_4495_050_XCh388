import { useState } from "react";
import type { User } from "../../lib/mock";

type Props = {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onPlanChange: (userId: string, newPlan: User["plan"]) => void;
};

const PLANS: {
  value: NonNullable<User["plan"]>;
  label: string;
  description: string;
}[] = [
  {
    value: "Free",
    label: "Free",
    description: "Basic features, limited uploads",
  },
  {
    value: "Client Plus",
    label: "Client Plus",
    description: "Advanced features, more uploads",
  },
  {
    value: "Enterprise",
    label: "Enterprise",
    description: "Full features, unlimited uploads",
  },
];

export default function PlanChangeModal({
  user,
  isOpen,
  onClose,
  onPlanChange,
}: Props) {
  const [selectedPlan, setSelectedPlan] = useState<User["plan"] | null>(null);
  const [isChanging, setIsChanging] = useState(false);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    setIsChanging(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onPlanChange(user.id, selectedPlan);
      onClose();
    } catch (error) {
      console.error("Failed to change plan:", error);
    } finally {
      setIsChanging(false);
    }
  };

  const handleClose = () => {
    setSelectedPlan(null);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/20 z-40" onClick={handleClose} />
      )}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Change User Plan
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Manually upgrade or downgrade{" "}
                    {user.first_name ? `${user.first_name}'s` : "user's"} plan
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="mb-6">
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Current Plan:</span>{" "}
                      {user.plan || "No Plan"}
                    </div>
                    <div>
                      <span className="font-medium">User:</span>{" "}
                      {[user.first_name, user.last_name]
                        .filter(Boolean)
                        .join(" ") || "Unnamed User"}{" "}
                      ({user.email})
                    </div>
                  </div>
                </div>

                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select New Plan
                </label>
                <div className="space-y-2">
                  {PLANS.map((plan) => (
                    <label
                      key={plan.value}
                      className={`block p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedPlan === plan.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="plan"
                        value={plan.value}
                        checked={selectedPlan === plan.value}
                        onChange={(e) =>
                          setSelectedPlan(e.target.value as User["plan"])
                        }
                        className="sr-only"
                      />
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium text-gray-900">
                            {plan.label}
                          </div>
                          <div className="text-sm text-gray-500">
                            {plan.description}
                          </div>
                        </div>
                        {selectedPlan === plan.value && (
                          <div className="text-blue-500">
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedPlan || isChanging}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isChanging ? "Changing..." : "Change Plan"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
