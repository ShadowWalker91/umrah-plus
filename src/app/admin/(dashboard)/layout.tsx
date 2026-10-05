import Sidebar from '@/components/admin/Sidebar'
import { RoleProvider } from '@/components/admin/RoleProvider'
import { auth } from '@/auth'
import { getCurrentRole } from '@/lib/auth/guards'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const [role, session] = await Promise.all([getCurrentRole(), auth()])
  const username = String(session?.user?.name ?? session?.user?.email ?? 'User')

  return (
    <RoleProvider role={role} username={username}>
      {/* Background color #F3F4F6 matches the Sidebar active state color */}
      <div className="flex min-h-screen bg-[#F3F4F6]">
        <Sidebar />

        <main className="flex-1 overflow-y-auto h-screen">
          {/* Added padding to push content away from the edges slightly */}
          <div className="p-8 max-w-[1600px] mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </RoleProvider>
  )
}
