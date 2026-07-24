import Link from 'next/link'
import { db } from '@/lib/db'
import { ziyaratLandmarks } from '@/lib/db/schema/ziyarat'
import { Plus, Pencil, Trash2, Search, MapPin, ChevronLeft, ChevronRight, Filter } from 'lucide-react'
import { deleteZiyaratLocation } from '@/app/actions/ziyaratLocationActions'
import { count, eq, desc } from 'drizzle-orm'

// FIX 1: Type definition for Next.js 15+ (searchParams is a Promise)
type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ZiyaratListPage(props: Props) {
  // FIX 2: Await the searchParams before using them
  const searchParams = await props.searchParams

  const page = Number(searchParams.page) || 1
  const limit = Number(searchParams.limit) || 25
  const cityFilter = (searchParams.city as string) || 'ALL'
  const offset = (page - 1) * limit

  // Build Where Clause
  const whereClause = cityFilter !== 'ALL' 
    ? eq(ziyaratLandmarks.city, cityFilter) 
    : undefined

  // Fetch Data & Total Count
  const [data, totalRecord] = await Promise.all([
    db.select()
      .from(ziyaratLandmarks)
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(ziyaratLandmarks.createdAt)), 
    
    db.select({ value: count() })
      .from(ziyaratLandmarks)
      .where(whereClause)
  ])

  // Fetch Unique Cities
  const uniqueCities = await db
    .selectDistinct({ city: ziyaratLandmarks.city })
    .from(ziyaratLandmarks)
    .orderBy(ziyaratLandmarks.city)

  const totalItems = totalRecord[0].value
  const totalPages = Math.ceil(totalItems / limit)

  // Helper to generate pagination links
  const getPageLink = (newPage: number) => {
    // searchParams is now a plain object, so this works safely
    const params = new URLSearchParams(searchParams as Record<string, string>)
    params.set('page', newPage.toString())
    return `?${params.toString()}`
  }

  // Helper to generate filter links
  const getFilterLink = (city: string) => {
    // searchParams is now a plain object, so this works safely
    const params = new URLSearchParams(searchParams as Record<string, string>)
    params.set('city', city)
    params.set('page', '1') 
    return `?${params.toString()}`
  }

  return (
    <div className="p-8 pb-20 min-h-screen bg-gray-50 text-gray-900 font-sans">
      
      {/* --- Top Header --- */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ziyarat Management</h1>
          <p className="text-gray-500 mt-1">Manage historical sites (Masjids, Landmarks).</p>
        </div>
        
        <Link 
          href="/admin/ziyarat/new" 
          className="bg-[#F9C344] text-black px-6 py-3 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-[#F9C344]/20 hover:bg-[#e0b03d] transition-all"
        >
          <Plus size={20} /> Add New
        </Link>
      </div>

      {/* --- Filters & Search Bar --- */}
      <div className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        
        {/* City Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar p-1 max-w-full md:max-w-2xl">
           <Link 
             href={getFilterLink('ALL')}
             className={`px-4 py-2 rounded-md font-medium text-sm whitespace-nowrap transition-all ${
               cityFilter === 'ALL' 
                 ? 'bg-black text-white shadow-sm' 
                 : 'text-gray-500 hover:text-black hover:bg-gray-100'
             }`}
           >
             All Cities
           </Link>
           
           {uniqueCities.map((c) => (
             <Link
               key={c.city} 
               href={getFilterLink(c.city || '')}
               className={`px-4 py-2 rounded-md font-medium text-sm whitespace-nowrap transition-all ${
                 cityFilter === c.city
                   ? 'bg-black text-white shadow-sm' 
                   : 'text-gray-500 hover:text-black hover:bg-gray-100'
               }`}
             >
               {c.city}
             </Link>
           ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64 min-w-[200px]">
           <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
           <input 
             placeholder="Search..." 
             className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#F9C344]"
           />
        </div>
      </div>

      {/* --- Table List View --- */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50/50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
           <div className="col-span-2">Thumbnail</div>
           <div className="col-span-5">Location Details</div>
           <div className="col-span-2">City</div>
           <div className="col-span-3 text-right">Actions</div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-gray-100 flex-1">
          {data.map((loc) => (
            <div key={loc.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50/50 transition-colors group">
               
               {/* Thumbnail */}
               <div className="col-span-2">
                  <div className="h-14 w-20 relative rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                    <img 
                      src={(loc.images as string[])?.[0] || '/placeholder.jpg'} 
                      alt={loc.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
               </div>

               {/* Details */}
               <div className="col-span-5">
                  <h4 className="font-bold text-gray-900 text-sm mb-1 line-clamp-1">{loc.name}</h4>
                  <p className="text-xs text-gray-500 line-clamp-2 pr-4">
                    {loc.shortDescription}
                  </p>
               </div>

               {/* City Badge */}
               <div className="col-span-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded uppercase tracking-wider border border-blue-100">
                    <MapPin size={10} />
                    {loc.city}
                  </span>
               </div>

               {/* Actions */}
               <div className="col-span-3 flex justify-end items-center gap-2">
                  <Link 
                    href={`/admin/ziyarat/edit/${loc.id}`}
                    className="inline-flex items-center gap-1 bg-white border border-gray-200 text-gray-700 text-xs px-3 py-2 rounded-lg font-bold hover:bg-gray-50 hover:border-gray-300 transition-colors"
                  >
                     <Pencil size={14} /> Edit
                  </Link>

                  <form action={async () => {
                    'use server'
                    await deleteZiyaratLocation(loc.id)
                  }}>
                    <button className="inline-flex items-center justify-center bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100 transition-colors border border-transparent hover:border-red-200">
                      <Trash2 size={16} />
                    </button>
                  </form>
               </div>
            </div>
          ))}
          
          {data.length === 0 && (
             <div className="p-20 text-center text-gray-400 text-sm flex flex-col items-center justify-center h-full">
                <Filter size={40} className="mb-4 text-gray-200" />
                <p>No locations found matching your filter.</p>
                {cityFilter !== 'ALL' && (
                  <Link href={getFilterLink('ALL')} className="text-[#e0b03d] hover:underline mt-2">
                    Clear Filters
                  </Link>
                )}
             </div>
          )}
        </div>

        {/* --- Pagination Footer --- */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center text-sm">
           <div className="text-gray-500">
              Showing <span className="font-bold text-gray-900">{offset + 1}</span> to <span className="font-bold text-gray-900">{Math.min(offset + limit, totalItems)}</span> of <span className="font-bold text-gray-900">{totalItems}</span> results
           </div>

           <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-500 text-xs font-medium">
                 <span>Rows:</span>
                 {[25, 50, 100].map((rows) => (
                    <Link
                      key={rows}
                      href={`?page=1&limit=${rows}&city=${cityFilter}`}
                      className={`px-2 py-1 rounded ${limit === rows ? 'bg-white border border-gray-200 text-black shadow-sm' : 'hover:bg-gray-200'}`}
                    >
                      {rows}
                    </Link>
                 ))}
              </div>

              <div className="flex items-center gap-1">
                <Link
                   href={getPageLink(page - 1)}
                   className={`p-2 rounded-lg border ${page <= 1 ? 'pointer-events-none opacity-50 bg-gray-100 text-gray-400 border-transparent' : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'}`}
                >
                   <ChevronLeft size={16} />
                </Link>
                <span className="px-3 text-xs font-bold text-gray-500">Page {page}</span>
                <Link
                   href={getPageLink(page + 1)}
                   className={`p-2 rounded-lg border ${page >= totalPages ? 'pointer-events-none opacity-50 bg-gray-100 text-gray-400 border-transparent' : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'}`}
                >
                   <ChevronRight size={16} />
                </Link>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}