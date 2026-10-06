import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'
import { db } from '@/lib/db/'
import { users } from '@/lib/db/schema/users'
import { eq } from 'drizzle-orm'
import { ArrowLeft } from 'lucide-react'
import UserForm from '../../UserForm'
import { getCurrentRole } from '@/lib/auth/guards'

type Props = {
  params: Promise<{ id: string }>
}

export default async function EditUserPage(props: Props) {
  if ((await getCurrentRole()) !== 'admin') {
    redirect('/admin/dashboard')
  }

  const { id } = await props.params

  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
    columns: { id: true, username: true, role: true },
  })

  if (!user) notFound()

  return (
    <div className="p-8 pb-20 min-h-screen bg-gray-50 text-gray-900 font-sans">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/users" className="p-2 bg-white rounded-full border border-gray-200 hover:bg-gray-50 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit User</h1>
          <p className="text-gray-500 mt-1">Update the username or password for {user.username}.</p>
        </div>
      </div>

      <UserForm user={user} />
    </div>
  )
}
