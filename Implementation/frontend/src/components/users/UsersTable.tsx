import type { User } from '../../lib/mock'

type Props = {
  users: User[]
  onView: (u: User) => void
}

export default function UsersTable({ users, onView }: Props) {
  if (!users || users.length === 0) {
    return <div className="bg-white rounded-xl shadow-sm p-6 text-sm text-gray-600">No users found.</div>
  }

  const statusClass = (s: User['status']) =>
    s === 'Active'
      ? 'bg-green-50 text-green-700'
      : 'bg-red-50 text-red-700'

  const planClass = 'bg-blue-50 text-blue-700'

  const onboardingClass = (o: User['onboarding']) =>
    o === 'Complete' ? 'bg-emerald-50 text-emerald-700' : o === 'Partial' ? 'bg-amber-50 text-amber-700' : 'bg-gray-50 text-gray-700'

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
            <tr key={u.id} className={idx % 2 === 1 ? 'odd:bg-gray-50' : ''}>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200" aria-hidden />
                  <div className="min-w-0">
                    <div className="text-gray-900 font-medium truncate">{u.name}</div>
                    <div className="text-xs text-gray-500 truncate">{u.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${planClass}`}>{u.plan}</span></td>
              <td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${statusClass(u.status)}`}>{u.status}</span></td>
              <td className="px-4 py-3 text-gray-700">{u.createdAt}</td>
              <td className="px-4 py-3 text-gray-700">{u.lastActive}</td>
              <td className="px-4 py-3 text-gray-700">{u.uploads}</td>
              <td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${onboardingClass(u.onboarding)}`}>{u.onboarding}</span></td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button className="px-2 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50" onClick={() => onView(u)}>
                    View
                  </button>
                  <button className="px-2 py-1 text-sm rounded border border-gray-300 text-gray-600 hover:bg-gray-50" disabled>
                    Deactivate ▾
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


