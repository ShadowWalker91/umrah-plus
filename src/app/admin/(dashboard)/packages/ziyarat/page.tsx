import { db } from '@/lib/db'
import { packages } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import Link from 'next/link'
import Image from 'next/image'
import { Plus } from 'lucide-react'
import { getCurrentRole } from '@/lib/auth/guards'

export default async function ZiyaratListPage() {
  // 1. Fetch ONLY Ziyarat packages from the Database
  const data = await db.select().from(packages)
    .where(eq(packages.type, 'ZIYARAT'))
    .orderBy(desc(packages.updatedAt));

  const isAdmin = ((await getCurrentRole()) === 'admin');

  return (
    <div className="p-8 pb-20">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-3xl font-bold text-gray-900">Ziyarat Packages</h1>
           <p className="text-gray-500 text-sm mt-1">Manage your Ziyarat locations and vehicle pricing.</p>
        </div>
        
        {/* ✅ CORRECTED PATH: Points to /admin/packages/ziyarat/create */}
        {isAdmin && (
          <Link 
            href="/admin/packages/ziyarat/create" 
            className="bg-black text-white px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl font-medium"
          >
            <Plus size={18} /> Create New
          </Link>
        )}
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data.map((pkg) => (
          <div key={pkg.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col h-full">
             
             {/* Image Thumbnail */}
             <div className="h-48 relative bg-gray-100 w-full shrink-0">
                {pkg.image ? (
                    <Image 
                      src={pkg.image} 
                      alt={pkg.title} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <span className="text-xs uppercase tracking-widest">No Image</span>
                    </div>
                )}
                
                {/* Status Badge (Optional Visual) */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-gray-600 shadow-sm">
                   {pkg.city}
                </div>
             </div>

             {/* Content */}
             <div className="p-5 flex flex-col flex-grow">
                <div className="flex-grow">
                    <h3 className="font-bold text-lg leading-tight mb-2 text-gray-900 line-clamp-2">
                        {pkg.title}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-4">
                        {pkg.duration} • Starting AED {pkg.priceStarting ? Number(pkg.priceStarting) / 100 : 0}
                    </p>
                </div>

                {/* ✅ CORRECTED PATH: Points to /admin/packages/ziyarat/edit/[id] */}
                <Link 
                    href={`/admin/packages/ziyarat/edit/${pkg.id}`} 
                    className="block w-full text-center bg-gray-50 hover:bg-[#F9C344] hover:text-black py-3 rounded-xl text-sm font-bold transition-all border border-gray-100 hover:border-[#F9C344]"
                >
                    Edit Package
                </Link>
             </div>
          </div>
        ))}

        {/* Empty State */}
        {data.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
             <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <Plus size={24} />
             </div>
              <h3 className="text-lg font-bold text-gray-900">No Packages Found</h3>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto">You haven't added any Ziyarat packages yet. Create your first one to get started.</p>
              {isAdmin && (
                <Link 
                  href="/admin/packages/ziyarat/create" 
                  className="inline-flex items-center gap-2 text-sm font-bold text-black hover:underline"
                >
                  Create New Package &rarr;
                </Link>
              )}
          </div>
        )}
      </div>
    </div>
  )
}