import Link from 'next/link'
import { Package, MapPin, Users, Plane, CalendarCheck, Clock, CheckCircle, ArrowRight, Eye } from 'lucide-react'
import { getBookings, getBookingStats } from '@/app/actions/bookingActions'
import AccessDeniedNotice from '@/components/admin/AccessDeniedNotice'

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function DashboardPage({ searchParams }: Props) {
  const params = await searchParams
  const denied = typeof params.denied === 'string' ? params.denied : null

  const statsData = await getBookingStats()
  const recentBookings = await getBookings({ dateRange: 'all' })
  const topRecent = recentBookings.slice(0, 5)

  const stats = [
    { label: 'Total Inquiries', value: statsData.total.toString(), icon: CalendarCheck, color: 'bg-yellow-500' },
    { label: 'Pending Action', value: statsData.pending.toString(), icon: Clock, color: 'bg-amber-500' },
    { label: 'Umrah & Plus', value: (statsData.byType.umrah + statsData.byType.umrahPlus).toString(), icon: Users, color: 'bg-green-500' },
    { label: 'Ziyarat Requests', value: statsData.byType.ziyarat.toString(), icon: MapPin, color: 'bg-purple-500' },
  ]

  return (
    <div className="space-y-8">
      {denied && <AccessDeniedNotice message={denied} />}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-gray-500">Real-time overview of incoming pilgrim inquiries and operations</p>
        </div>
        <Link
          href="/admin/bookings"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1E1E1E] text-[#F9C344] font-bold text-xs rounded-xl hover:bg-black transition-all shadow-sm"
        >
          <CalendarCheck className="w-4 h-4" />
          View All Bookings
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Bookings Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 min-h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Recent Customer Bookings</h3>
              <p className="text-xs text-gray-400 mt-0.5">Latest submitted customer queries awaiting follow-up</p>
            </div>
            <Link
              href="/admin/bookings"
              className="text-xs font-bold text-[#C5A059] hover:underline flex items-center gap-1"
            >
              See all ({statsData.total})
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {topRecent.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400 bg-gray-50 rounded-2xl border-dashed border-2">
              <CalendarCheck className="w-8 h-8 text-gray-300 mb-2" />
              <p className="font-semibold text-sm">No bookings recorded yet.</p>
              <p className="text-xs text-gray-400">Submissions from the booking engine will appear here immediately.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-600">
                <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-3">Ref</th>
                    <th className="py-3 px-3">Customer</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {topRecent.map((b) => (
                    <tr key={b.id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-gray-900">{b.reference}</td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-gray-900">{b.customerName}</div>
                        <div className="text-gray-400 text-[11px]">{b.customerPhone}</div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-gray-800">{b.bookingType}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800">
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Link
                          href="/admin/bookings"
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 hover:bg-[#1E1E1E] hover:text-[#F9C344] text-gray-700 rounded-lg text-xs font-semibold transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        <div className="bg-[#1E1E1E] text-white p-8 rounded-3xl shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2 text-[#F9C344]">Booking Operations</h3>
            <p className="text-xs text-gray-400 mb-6">Direct access to query management and excursion records</p>
            <ul className="space-y-3">
              <Link href="/admin/bookings" className="block p-3.5 bg-white/5 rounded-xl hover:bg-white/10 cursor-pointer border border-white/5 transition-colors">
                <span className="text-xs font-bold text-white block">📅 Open Bookings Desk</span>
                <span className="text-[11px] text-gray-400">List & Tree views with filters</span>
              </Link>
              <Link href="/admin/ziyarat" className="block p-3.5 bg-white/5 rounded-xl hover:bg-white/10 cursor-pointer border border-white/5 transition-colors">
                <span className="text-xs font-bold text-white block">📍 Manage Ziyarat Locations</span>
                <span className="text-[11px] text-gray-400">Add or edit historical sites</span>
              </Link>
              <Link href="/admin/packages/umrah" className="block p-3.5 bg-white/5 rounded-xl hover:bg-white/10 cursor-pointer border border-white/5 transition-colors">
                <span className="text-xs font-bold text-white block">🕋 Umrah Packages</span>
                <span className="text-[11px] text-gray-400">Configure tiers and durations</span>
              </Link>
            </ul>
          </div>

          <div className="pt-6 border-t border-white/10 text-xs text-gray-400">
            System ready • Auto-saves customer inquiries
          </div>
        </div>
      </div>
    </div>
  )
}