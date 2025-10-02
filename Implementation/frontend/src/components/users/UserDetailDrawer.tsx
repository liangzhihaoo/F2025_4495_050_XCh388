import { useState } from 'react'
import type { User } from '../../lib/mock'
import PlanChangeModal from './PlanChangeModal'
import UserActionsModal from './UserActionsModal'

type Props = {
  user: User | null
  onClose: () => void
  onPlanChange: (userId: string, newPlan: User['plan']) => void
  onDeactivate: (userId: string) => void
  onDelete: (userId: string) => void
}

export default function UserDetailDrawer({ user, onClose, onPlanChange, onDeactivate, onDelete }: Props) {
  const [showPlanModal, setShowPlanModal] = useState(false)
  const [showActionsModal, setShowActionsModal] = useState(false)
  const open = Boolean(user)

  // Close on ESC
  if (typeof window !== 'undefined') {
    window.onkeydown = (e: KeyboardEvent) => {
      if (open && e.key === 'Escape') onClose()
    }
  }

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />}
      <div
        aria-hidden={!open}
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-lg transition-transform duration-200 z-50 ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-6 h-full flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{user?.name || '—'}</h3>
              <p className="text-sm text-gray-500">{user?.email || ''}</p>
            </div>
            <button className="px-2 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50" onClick={onClose}>
              Close
            </button>
          </div>
          <div className="pt-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-200" aria-hidden />
            <div className="text-sm text-gray-600">
              <div>
                <span className="text-gray-500">Plan:</span> {user?.plan}
              </div>
              <div>
                <span className="text-gray-500">Status:</span> {user?.status}
              </div>
              <div>
                <span className="text-gray-500">Created:</span> {user?.createdAt}
              </div>
              <div>
                <span className="text-gray-500">Last active:</span> {user?.lastActive}
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Uploads</h4>
            <div className="h-24 bg-gray-100 rounded-md" />
          </div>
          <div className="mt-auto flex gap-2">
            <button 
              onClick={() => setShowActionsModal(true)}
              className="px-3 py-2 text-sm rounded border border-amber-300 text-amber-600 hover:bg-amber-50"
            >
              Manage User
            </button>
            <button 
              onClick={() => setShowPlanModal(true)}
              className="px-3 py-2 text-sm rounded border border-blue-300 text-blue-600 hover:bg-blue-50"
            >
              Change Plan
            </button>
          </div>
        </div>
      </div>
      
      <PlanChangeModal
        user={user}
        isOpen={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        onPlanChange={onPlanChange}
      />
      
      <UserActionsModal
        user={user}
        isOpen={showActionsModal}
        onClose={() => setShowActionsModal(false)}
        onDeactivate={onDeactivate}
        onDelete={onDelete}
      />
    </>
  )
}


