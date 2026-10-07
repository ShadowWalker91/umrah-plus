import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import UserForm from '../UserForm'
import { getCurrentRole } from '@/lib/auth/guards'

export default async function NewUserPage() {
  if ((await getCurrentRole()) !== 'admin') {
    redirect('/admin/dashboard')
  }

  return (
    <div className="p-8 pb-20 min-h-screen bg-gray-50 text-gray-900 font-sans">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/users" className="p-2 bg-white rounded-full border border-gray-200 hover:bg-gray-50 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add Editor</h1>
          <p className="text-gray-500 mt-1">Create login credentials for a new editor user.</p>
        </div>
      </div>

      <UserForm />
    </div>
  )
}
