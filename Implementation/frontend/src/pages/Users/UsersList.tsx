import { useMemo, useState } from 'react'
import { mockUsers, type User } from '../../lib/mock'
import UserFilters from '../../components/users/UserFilters'
import UsersTable from '../../components/users/UsersTable'
import UserDetailDrawer from '../../components/users/UserDetailDrawer'

export default function UsersList() {
  const [search, setSearch] = useState('')
  const [plan, setPlan] = useState('')
  const [status, setStatus] = useState('')
  const [selected, setSelected] = useState<User | null>(null)

  const users = useMemo(() => mockUsers(20), [])

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const q = search.trim().toLowerCase()
      const matchesQuery = q === '' || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      const matchesPlan = plan === '' || u.plan === (plan as any)
      const matchesStatus = status === '' || u.status === (status as any)
      return matchesQuery && matchesPlan && matchesStatus
    })
  }, [users, search, plan, status])

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Users</h1>
      <UserFilters
        search={search}
        onSearch={setSearch}
        plan={plan}
        onPlan={setPlan}
        status={status}
        onStatus={setStatus}
      />
      <UsersTable users={filtered} onView={setSelected} />
      <UserDetailDrawer user={selected} onClose={() => setSelected(null)} />
    </div>
  )
}


