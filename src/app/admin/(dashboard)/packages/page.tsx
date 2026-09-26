import { db } from '@/lib/db'
import { packages } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Edit, Search } from 'lucide-react'

// Helper: Decide where the Edit button goes based on Package Type
const getEditLink = (pkg: any) => {
  switch(pkg.type) {
    case 'ZIYARAT': 
      return `/admin/packages/ziyarat/edit/${pkg.id}`;
    case 'UMRAH': 
      return `/admin/packages/umrah/edit/${pkg.id}`;
    case 'UMRAH_PLUS': 
      return `/admin/packages/umrah-plus/edit/${pkg.id}`;
    case 'TRANSPORT': 
      return `/admin/packages/transport/edit/${pkg.id}`;
    case 'EXPLORE_SAUDI': 
      return `/admin/packages/explore-saudi/edit/${pkg.id}`;
    default: 
      return '#'; // Fallback
  }
}

export default async function MasterPackagesPage() {
  // Fetch ALL packages sorted by newest
  const allPackages = await db.select().from(packages).orderBy(desc(packages.updatedAt));

  return (
    <div className="p-8 pb-20 min-h-screen bg-gray-50 text-gray-900 font-sans">
      
      {/* --- Top Header --- */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Packages</h1>
          <p className="text-gray-500 mt-1">Manage your complete travel inventory from one place.</p>
        </div>
        
        {/* Create Button - Points to Ziyarat for now (Primary) */}
        {/* You can change this to a dropdown later if needed */}
        <Link 
          href="/admin/packages/ziyarat/create" 
          className="bg-[#F9C344] text-black px-6 py-3 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-[#F9C344]/20 hover:bg-[#e0b03d] transition-all"
        >
          <Plus size={20} /> Create Package
        </Link>
      </div>

      {/* --- Filters Bar (Matches your screenshot) --- */}
      <div className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex items-center gap-1 p-1 bg-gray-100/50 rounded-lg">
           {/* These tabs now link to the specific category pages */}
           <span className="px-4 py-2 rounded-md bg-black text-white font-medium text-sm shadow-sm">All</span>
           <Link href="/admin/packages/ziyarat" className="px-4 py-2 rounded-md text-gray-500 hover:text-black hover:bg-white font-medium text-sm transition-all">Ziyarat</Link>
           <Link href="/admin/packages/umrah" className="px-4 py-2 rounded-md text-gray-500 hover:text-black hover:bg-white font-medium text-sm transition-all">Umrah</Link>
        </div>

        <div className="relative w-full md:w-64">
           <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
           <input 
             placeholder="Search packages..." 
             className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#F9C344]"
           />
        </div>
      </div>

      {/* --- Table List View --- */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50/50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
           <div className="col-span-2">Thumbnail</div>
           <div className="col-span-5">Details</div>
           <div className="col-span-2">Type</div>
           <div className="col-span-2">Price</div>
           <div className="col-span-1 text-right">Actions</div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-gray-100">
          {allPackages.map((pkg) => (
            <div key={pkg.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50/50 transition-colors group">
               
               {/* Thumbnail */}
               <div className="col-span-2">
                  <div className="h-16 w-24 relative rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                    {pkg.image ? (
                        <Image src={pkg.image} alt={pkg.title} fill className="object-cover" />
                    ) : (
                        <div className="flex items-center justify-center h-full text-[10px] text-gray-400">No Img</div>
                    )}
                  </div>
               </div>

               {/* Details */}
               <div className="col-span-5">
                  <h4 className="font-bold text-gray-900 text-sm mb-1 line-clamp-1">{pkg.title}</h4>
                  <p className="text-xs text-gray-500">
                    {pkg.city || 'Saudi Arabia'} • {pkg.duration || 'N/A'}
                  </p>
               </div>

               {/* Type Badge */}
               <div className="col-span-2">
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded uppercase tracking-wider border border-gray-200">
                    {pkg.type?.replace('_', ' ')}
                  </span>
               </div>

               {/* Price */}
               <div className="col-span-2">
                  <span className="text-sm font-bold text-[#e0b03d]">
                    AED {pkg.priceStarting ? Number(pkg.priceStarting) / 100 : 0}
                  </span>
               </div>

               {/* Actions - FIXED: Dynamic Edit Link */}
               <div className="col-span-1 text-right">
                  <Link 
                    href={getEditLink(pkg)}
                    className="inline-flex items-center gap-1 bg-black text-white text-xs px-3 py-2 rounded-lg font-bold hover:bg-gray-800 transition-colors"
                  >
                     Edit
                  </Link>
               </div>

            </div>
          ))}
          
          {allPackages.length === 0 && (
             <div className="p-10 text-center text-gray-400 text-sm">No packages found.</div>
          )}
        </div>
      </div>
    </div>
  )
}