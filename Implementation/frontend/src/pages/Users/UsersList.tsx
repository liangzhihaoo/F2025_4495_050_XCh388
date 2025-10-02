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
  const [users, setUsers] = useState<User[]>([])

  // Initialize users on component mount
  useMemo(() => {
    setUsers(mockUsers(20))
  }, [])

  // Handle user operations
  const handlePlanChange = (userId: string, newPlan: User['plan']) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId ? { ...user, plan: newPlan } : user
      )
    )
    // Update selected user if it's the one being changed
    if (selected?.id === userId) {
      setSelected(prev => prev ? { ...prev, plan: newPlan } : null)
    }
  }

  const handleDeactivate = (userId: string) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId ? { ...user, status: 'Suspended' as const } : user
      )
    )
    // Update selected user if it's the one being deactivated
    if (selected?.id === userId) {
      setSelected(prev => prev ? { ...prev, status: 'Suspended' as const } : null)
    }
  }

  const handleDelete = (userId: string) => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId))
    // Close drawer if the deleted user was selected
    if (selected?.id === userId) {
      setSelected(null)
    }
  }

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
      <UsersTable 
        users={filtered} 
        onView={setSelected}
        onPlanChange={handlePlanChange}
        onDeactivate={handleDeactivate}
        onDelete={handleDelete}
      />
      <UserDetailDrawer 
        user={selected} 
        onClose={() => setSelected(null)}
        onPlanChange={handlePlanChange}
        onDeactivate={handleDeactivate}
        onDelete={handleDelete}
      />
    </div>
  )
}


