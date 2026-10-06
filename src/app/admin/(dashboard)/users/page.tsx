import Link from 'next/link'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema/users'
import { desc } from 'drizzle-orm'
import { Plus, Pencil, Trash2, ShieldCheck, PenLine, Users as UsersIcon } from 'lucide-react'
import { deleteUser } from '@/app/actions/userActions'
import { getCurrentRole } from '@/lib/auth/guards'

export default async function UsersListPage() {
  if ((await getCurrentRole()) !== 'admin') {
    redirect('/admin/dashboard')
  }

  const allUsers = await db
    .select({
      id: users.id,
      username: users.username,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt))

  return (
    <div className="p-8 pb-20 min-h-screen bg-gray-50 text-gray-900 font-sans">

      {/* --- Top Header --- */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 mt-1">Create editor accounts. Editors can view and update entries, but cannot create or delete them.</p>
        </div>

        <Link
          href="/admin/users/new"
          className="bg-[#F9C344] text-black px-6 py-3 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-[#F9C344]/20 hover:bg-[#e0b03d] transition-all"
        >
          <Plus size={20} /> Add Editor
        </Link>
      </div>

      {/* --- Users Table --- */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50/50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
          <div className="col-span-5">Username</div>
          <div className="col-span-3">Role</div>
          <div className="col-span-2">Created</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-gray-100">
          {allUsers.map((user) => {
            const isAdminUser = user.role === 'admin'
            return (
              <div key={user.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50/50 transition-colors">

                {/* Username */}
                <div className="col-span-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#F9C344]/10 border border-[#F9C344]/30 flex items-center justify-center text-[#c5a059] font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 text-sm block">{user.username}</span>
                    {isAdminUser && (
                      <span className="text-[10px] text-gray-400">Signed in as you</span>
                    )}
                  </div>
                </div>

                {/* Role Badge */}
                <div className="col-span-3">
                  {isAdminUser ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold rounded uppercase tracking-wider border border-amber-200">
                      <ShieldCheck size={11} /> Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded uppercase tracking-wider border border-blue-100">
                      <PenLine size={11} /> Editor
                    </span>
                  )}
                </div>

                {/* Created */}
                <div className="col-span-2 text-xs text-gray-500">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                </div>

                {/* Actions */}
                <div className="col-span-2 flex justify-end items-center gap-2">
                  {!isAdminUser && (
                    <>
                      <Link
                        href={`/admin/users/edit/${user.id}`}
                        className="inline-flex items-center gap-1 bg-white border border-gray-200 text-gray-700 text-xs px-3 py-2 rounded-lg font-bold hover:bg-gray-50 hover:border-gray-300 transition-colors"
                      >
                        <Pencil size={14} /> Edit
                      </Link>

                      <form action={async () => {
                        'use server'
                        await deleteUser(user.id)
                      }}>
                        <button className="inline-flex items-center justify-center bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100 transition-colors border border-transparent hover:border-red-200">
                          <Trash2 size={16} />
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </div>
            )
          })}

          {allUsers.length === 0 && (
            <div className="p-20 text-center text-gray-400 text-sm flex flex-col items-center justify-center">
              <UsersIcon size={40} className="mb-4 text-gray-300" />
              <p>No users found. Create your first editor account.</p>
            </div>
          )}
        </div>
      </div>

      {/* --- Info Card --- */}
      <div className="mt-6 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-2">About roles</h3>
        <ul className="text-sm text-gray-500 space-y-1 list-disc list-inside">
          <li><span className="font-semibold text-gray-700">Admin</span> — full access: create, edit, delete, and manage users.</li>
          <li><span className="font-semibold text-gray-700">Editor</span> — can view every module and update existing entries only.</li>
        </ul>
      </div>
    </div>
  )
}
