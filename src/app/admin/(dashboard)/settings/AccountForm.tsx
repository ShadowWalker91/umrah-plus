'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save, KeyRound } from 'lucide-react'
import { updateMyAccount } from '@/app/actions/userActions'

export default function AccountForm({ currentUsername }: { currentUsername: string }) {
  const router = useRouter()
  const [username, setUsername] = useState(currentUsername)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setMessage('')

    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters.')
      return
    }
    if (!currentPassword) {
      setError('Enter your current password to confirm the change.')
      return
    }
    if (newPassword && newPassword.length < 6) {
      setError('New password must be at least 6 characters.')
      return
    }

    setIsSubmitting(true)
    try {
      const result = await updateMyAccount({
        currentPassword,
        username: username.trim(),
        newPassword: newPassword || undefined,
      })

      if (!result.success) {
        setError(result.error || 'Something went wrong.')
        return
      }

      setMessage(result.message || 'Account updated.')
      setCurrentPassword('')
      setNewPassword('')
      router.refresh()
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6 max-w-2xl">

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
          {error}
        </div>
      )}

      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl">
          {message}
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
          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F9C344]"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-500 uppercase">Current Password</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
          placeholder="••••••••"
          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F9C344]"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-500 uppercase">New Password (optional)</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          minLength={6}
          placeholder="Leave blank to keep your current password"
          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F9C344]"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-[#F9C344] text-black px-6 py-3 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-[#F9C344]/20 hover:bg-[#e0b03d] transition-all disabled:opacity-60"
      >
        {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
        Save Account Changes
      </button>

      <p className="text-xs text-gray-400 flex items-center gap-2">
        <KeyRound size={14} className="text-[#c5a059]" />
        Passwords are stored hashed and never shown in plain text.
      </p>
    </form>
  )
}
