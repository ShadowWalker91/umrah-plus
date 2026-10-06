'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/app/actions/auth' 
import { useRole } from '@/components/admin/RoleProvider'
import { 
  LayoutDashboard, 
  MapPin, 
  Car, 
  Building2, 
  Image as ImageIcon, 
  Settings, 
  LogOut,
  FileText,
  Briefcase,
  Globe,
  Compass,
  Package,
  ChevronDown,
  ChevronRight,
  Landmark, // ✅ Icon for Ziyarat
  CalendarCheck, // ✅ Icon for Bookings
  Users // ✅ Icon for Users module
} from 'lucide-react'

export default function Sidebar() {
  const pathname = usePathname()
  const { role, username } = useRole()
  const isAdmin = role === 'admin'
  const [isPackagesOpen, setIsPackagesOpen] = useState(pathname.includes('/admin/packages'))

  useEffect(() => {
    if (pathname.includes('/admin/packages')) {
        setIsPackagesOpen(true)
    }
  }, [pathname])

  const mainLinks = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Bookings', href: '/admin/bookings', icon: CalendarCheck },
    { label: 'Transport Rates & Fleet', href: '/admin/transport', icon: Car },
    { label: 'Ziyarat Locations', href: '/admin/ziyarat', icon: Landmark }, 
  ]

  const managementLinks = [
    { label: 'Hotels', href: '/admin/hotels', icon: Building2 },
    { label: 'Media', href: '/admin/media', icon: ImageIcon },
    { label: 'Reports', href: '/admin/reports', icon: FileText },
    ...(isAdmin ? [{ label: 'Users', href: '/admin/users', icon: Users }] : []),
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ]

  const packageSubItems = [
    { label: 'Ziyarat', href: '/admin/packages/ziyarat', icon: MapPin },
    { label: 'Umrah', href: '/admin/packages/umrah', icon: Briefcase },
    { label: 'Umrah Plus', href: '/admin/packages/umrah-plus', icon: Globe },
    { label: 'Transport', href: '/admin/packages/transport', icon: Car },
    { label: 'Explore Saudi', href: '/admin/packages/explore-saudi', icon: Compass },
  ]

  const SidebarLink = ({ item, isSubItem = false }: { item: any, isSubItem?: boolean }) => {
    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
    return (
      <Link 
        href={item.href}
        className={`relative flex items-center gap-4 py-3 text-sm font-medium transition-all duration-300 ${isSubItem ? 'pl-12 pr-6' : 'px-8'} ${isActive ? 'bg-[#F3F4F6] text-[#1E1E1E] rounded-l-[30px] ml-6 shadow-[-4px_4px_10px_rgba(0,0,0,0.1)]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
      >
        <item.icon size={isSubItem ? 18 : 20} className={`transition-colors ${isActive ? 'text-[#F9C344]' : 'text-gray-500 group-hover:text-white'}`} />
        <span className="tracking-wide">{item.label}</span>
        {isActive && <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#F3F4F6]" />}
      </Link>
    )
  }

  return (
    <aside className="w-72 bg-[#1E1E1E] text-white flex flex-col h-screen sticky top-0 font-sans shadow-2xl z-50 overflow-y-auto custom-scrollbar">
      <div className="pt-10 pb-8 px-6 text-center">
        <div className="w-24 h-24 mx-auto bg-gray-700 rounded-full mb-4 border-4 border-[#F9C344] relative overflow-hidden p-1">
             <div className="w-full h-full bg-gray-600 rounded-full flex items-center justify-center text-2xl font-bold text-[#F9C344]">{username?.charAt(0)?.toUpperCase() || 'U'}</div>
        </div>
        <h2 className="text-xl font-bold tracking-wide">{username}</h2>
        <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">{isAdmin ? 'Administrator' : 'Editor'}</p>
      </div>

      <nav className="flex-1 flex flex-col gap-2 pb-10">
        {mainLinks.map((item) => <SidebarLink key={item.href} item={item} />)}

        <div>
            <div className={`relative flex items-center justify-between px-8 py-3 text-sm font-medium transition-colors ${pathname === '/admin/packages' ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                <Link href="/admin/packages" className="flex items-center gap-4 flex-1">
                    <Package size={20} className={pathname.includes('/admin/packages') ? 'text-[#F9C344]' : 'text-gray-500'} />
                    <span className="tracking-wide">Packages</span>
                </Link>
                <button onClick={(e) => { e.preventDefault(); setIsPackagesOpen(!isPackagesOpen); }} className="p-1 hover:bg-white/10 rounded">
                    {isPackagesOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
            </div>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isPackagesOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="flex flex-col gap-1 mt-1">
                    {packageSubItems.map((subItem) => (
                        <SidebarLink key={subItem.href} item={subItem} isSubItem={true} />
                    ))}
                </div>
            </div>
        </div>
        {managementLinks.map((item) => <SidebarLink key={item.href} item={item} />)}
      </nav>

      <div className="p-8 mt-auto">
        <button onClick={() => logout()} className="flex items-center gap-3 text-red-400 hover:text-red-300 w-full transition-colors group">
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" /> 
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  )
}