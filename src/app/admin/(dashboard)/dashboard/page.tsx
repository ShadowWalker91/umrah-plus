import { Package, MapPin, Users, Plane } from 'lucide-react'

// Mock Data for Dashboard
const stats = [
  { label: 'Total Packages', value: '12', icon: Package, color: 'bg-yellow-500' },
  { label: 'Active Ziyarats', value: '45', icon: MapPin, color: 'bg-blue-500' },
  { label: 'Total Inquiries', value: '1,240', icon: Users, color: 'bg-green-500' },
  { label: 'Flights Booked', value: '85', icon: Plane, color: 'bg-purple-500' },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back, Admin</p>
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

      {/* Placeholder for Chart/Recent Activity Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 min-h-[400px]">
           <h3 className="text-xl font-bold mb-6">Recent Bookings</h3>
           <div className="flex items-center justify-center h-64 text-gray-300 bg-gray-50 rounded-xl border-dashed border-2">
             Chart Placeholder
           </div>
        </div>
        
        <div className="bg-[#1E1E1E] text-white p-8 rounded-3xl shadow-lg">
           <h3 className="text-xl font-bold mb-4 text-[#F9C344]">Quick Actions</h3>
           <ul className="space-y-4">
             <li className="p-4 bg-white/5 rounded-xl hover:bg-white/10 cursor-pointer">Add New Package</li>
             <li className="p-4 bg-white/5 rounded-xl hover:bg-white/10 cursor-pointer">Update Exchange Rate</li>
             <li className="p-4 bg-white/5 rounded-xl hover:bg-white/10 cursor-pointer">Manage Users</li>
           </ul>
        </div>
      </div>
    </div>
  )
}