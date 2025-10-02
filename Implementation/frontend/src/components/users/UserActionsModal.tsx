import { useState } from 'react'
import type { User } from '../../lib/mock'

type Props = {
  user: User | null
  isOpen: boolean
  onClose: () => void
  onDeactivate: (userId: string) => void
  onDelete: (userId: string) => void
}

export default function UserActionsModal({ user, isOpen, onClose, onDeactivate, onDelete }: Props) {
  const [action, setAction] = useState<'deactivate' | 'delete' | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [confirmText, setConfirmText] = useState('')

  if (!isOpen || !user) return null

  const handleDeactivate = async () => {
    setIsProcessing(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      onDeactivate(user.id)
      handleClose()
    } catch (error) {
      console.error('Failed to deactivate user:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDelete = async () => {
    setIsProcessing(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      onDelete(user.id)
      handleClose()
    } catch (error) {
      console.error('Failed to delete user:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClose = () => {
    setAction(null)
    setConfirmText('')
    onClose()
  }

  const isDeleteConfirmed = action === 'delete' && confirmText === 'DELETE'
  const isDeactivateConfirmed = action === 'deactivate' && confirmText === 'DEACTIVATE'

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/20 z-40" onClick={handleClose} />}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">User Actions</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Manage {user.name}'s account
                </p>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="text-sm text-gray-600">
                <div><span className="font-medium">User:</span> {user.name}</div>
                <div><span className="font-medium">Email:</span> {user.email}</div>
                <div><span className="font-medium">Plan:</span> {user.plan}</div>
                <div><span className="font-medium">Status:</span> {user.status}</div>
              </div>
            </div>

            {!action ? (
              <div className="space-y-3">
                <button
                  onClick={() => setAction('deactivate')}
                  className="w-full p-3 text-left border border-amber-200 rounded-lg hover:bg-amber-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Deactivate Account</div>
                      <div className="text-sm text-gray-500">Suspend user access temporarily</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setAction('delete')}
                  className="w-full p-3 text-left border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Delete Account</div>
                      <div className="text-sm text-gray-500">Permanently remove user and all data</div>
                    </div>
                  </div>
                </button>
              </div>
            ) : (
              <div>
                {action === 'deactivate' && (
                  <div>
                    <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <div>
                          <h4 className="font-medium text-amber-800">Deactivate User Account</h4>
                          <p className="text-sm text-amber-700 mt-1">
                            This will suspend the user's access to the platform. They won't be able to log in or use any features.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type <span className="font-mono bg-gray-100 px-1 rounded">DEACTIVATE</span> to confirm:
                      </label>
                      <input
                        type="text"
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        placeholder="DEACTIVATE"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setAction(null)}
                        className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDeactivate}
                        disabled={!isDeactivateConfirmed || isProcessing}
                        className="flex-1 px-4 py-2 text-sm font-medium text-white bg-amber-600 border border-transparent rounded-md hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? 'Deactivating...' : 'Deactivate User'}
                      </button>
                    </div>
                  </div>
                )}

                {action === 'delete' && (
                  <div>
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-red-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <div>
                          <h4 className="font-medium text-red-800">Delete User Account</h4>
                          <p className="text-sm text-red-700 mt-1">
                            This action is permanent and cannot be undone. All user data, uploads, and account information will be permanently deleted.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type <span className="font-mono bg-gray-100 px-1 rounded">DELETE</span> to confirm:
                      </label>
                      <input
                        type="text"
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        placeholder="DELETE"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setAction(null)}
                        className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDelete}
                        disabled={!isDeleteConfirmed || isProcessing}
                        className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? 'Deleting...' : 'Delete User'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
