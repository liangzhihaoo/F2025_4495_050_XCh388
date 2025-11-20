import { useState } from "react";
import type { User } from "../../lib/mock";
import PlanChangeModal from "./PlanChangeModal";
import UserActionsModal from "./UserActionsModal";

type Props = {
  users: User[];
  onView: (u: User) => void;
  onPlanChange: (userId: string, newPlan: User["plan"]) => void;
  onDeactivate: (userId: string) => void;
  onReactivate: (userId: string) => void;
  onDelete: (userId: string) => void;
};

export default function UsersTable({
  users,
  onView,
  onPlanChange,
  onDeactivate,
  onReactivate,
  onDelete,
}: Props) {
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  if (!users || users.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 text-sm text-gray-600">
        No users found.
      </div>
    );
  }

  const planClass = "bg-blue-50 text-blue-700";

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <table className="table-auto w-full">
        <thead className="text-left text-xs text-gray-500">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Plan</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Sign-up</th>
            <th className="px-4 py-3">Last Active</th>
            <th className="px-4 py-3">Uploads</th>
            <th className="px-4 py-3">Onboarding</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {users.map((u, idx) => (
            <tr key={u.id} className={idx % 2 === 1 ? "odd:bg-gray-50" : ""}>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full bg-gray-200"
                    aria-hidden
                  />
                  <div className="min-w-0">
                    <div className="text-gray-900 font-medium truncate">
                      {u.first_name && u.last_name
                        ? `${u.first_name} ${u.last_name}`
                        : u.first_name || u.last_name || "Unnamed User"}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {u.email}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${planClass}`}
                >
                  {u.plan || "No Plan"}
                </span>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                    u.is_active
                      ? "bg-green-50 text-green-700"
                      : "bg-gray-50 text-gray-700"
                  }`}
                >
                  {u.is_active ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-700">
                {u.created_at
                  ? new Date(u.created_at).toLocaleDateString()
                  : "N/A"}
              </td>
              <td className="px-4 py-3 text-gray-700">{u.phone || "N/A"}</td>
              <td className="px-4 py-3 text-gray-700">{u.upload_limit || 0}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                    u.upload_limit
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-gray-50 text-gray-700"
                  }`}
                >
                  {u.upload_limit ? "Limit Set" : "No Limit"}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button
                    className="px-2 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50"
                    onClick={() => onView(u)}
                  >
                    View
                  </button>
                  <button
                    className="px-2 py-1 text-sm rounded border border-blue-300 text-blue-600 hover:bg-blue-50"
                    onClick={() => {
                      setSelectedUser(u);
                      setShowPlanModal(true);
                    }}
                  >
                    Change Plan
                  </button>
                  <button
                    className="px-2 py-1 text-sm rounded border border-amber-300 text-amber-600 hover:bg-amber-50"
                    onClick={() => {
                      setSelectedUser(u);
                      setShowActionsModal(true);
                    }}
                  >
                    Manage
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


      <PlanChangeModal
        user={selectedUser}
        isOpen={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        onPlanChange={onPlanChange}
      />
      <UserActionsModal
        user={selectedUser}
        isOpen={showActionsModal}
        onClose={() => setShowActionsModal(false)}
        onDeactivate={onDeactivate}
        onReactivate={onReactivate}
        onDelete={onDelete}
      />
    </div>
  );
}
