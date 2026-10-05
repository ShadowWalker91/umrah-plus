import { auth } from '@/auth'
import { getCurrentRole } from '@/lib/auth/guards'
import AccountForm from './AccountForm'

export default async function SettingsPage() {
  const [role, session] = await Promise.all([getCurrentRole(), auth()])
  const isAdmin = role === 'admin'
  const username = String(session?.user?.name ?? session?.user?.email ?? 'User')

  return (
    <div className="p-8 pb-20 min-h-screen bg-gray-50 text-gray-900 font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your admin account credentials.</p>
      </div>

      {isAdmin ? (
        <AccountForm currentUsername={username} />
      ) : (
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm max-w-2xl text-gray-500 text-sm">
          Only the admin account can change dashboard login credentials.
        </div>
      )}
    </div>
  )
}
