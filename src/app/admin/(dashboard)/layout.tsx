import Sidebar from '@/components/admin/Sidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    // Background color #F3F4F6 matches the Sidebar active state color
    <div className="flex min-h-screen bg-[#F3F4F6]">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto h-screen">
        {/* Added padding to push content away from the edges slightly */}
        <div className="p-8 max-w-[1600px] mx-auto space-y-8">
          {children}
        </div>
      </main>
    </div>
  )
}