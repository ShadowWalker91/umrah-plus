'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, Save } from 'lucide-react'
import { createUser, updateUser } from '@/app/actions/userActions'

type EditableUser = {
  id: string
  username: string
  role: string
}

export default function UserForm({ user }: { user?: EditableUser }) {
  const isEditing = !!user
  const router = useRouter()

  const [username, setUsername] = useState(user?.username || '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters.')
      return
    }
    if (!isEditing && password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (isEditing && password && password.length < 6) {
      setError('New password must be at least 6 characters.')
      return
    }

    setIsSubmitting(true)
    try {
      const result = isEditing
        ? await updateUser({ id: user.id, username: username.trim(), password: password || undefined })
        : await createUser({ username: username.trim(), password })

      if (!result.success) {
        setError(result.error || 'Something went wrong.')
        return
      }

      router.push('/admin/users')
      router.refresh()
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={3}
            placeholder="e.g. editor.john"
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F9C344]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase">
            {isEditing ? 'New Password (leave blank to keep current)' : 'Password'}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={!isEditing}
            minLength={6}
            placeholder="••••••••"
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F9C344]"
          />
          <p className="text-xs text-gray-400">
            The editor signs in with this username and password. Stored securely as a hash.
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#F9C344] text-black px-6 py-3 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-[#F9C344]/20 hover:bg-[#e0b03d] transition-all disabled:opacity-60"
          >
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {isEditing ? 'Save Changes' : 'Create Editor'}
          </button>

          <Link
            href="/admin/users"
            className="px-5 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 font-bold hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
