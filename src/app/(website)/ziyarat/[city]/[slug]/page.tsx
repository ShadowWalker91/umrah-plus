export const dynamic = 'force-dynamic';

import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { ziyaratLandmarks } from '@/lib/db/schema/ziyarat' 
import { eq } from 'drizzle-orm' 
import { ChevronRight, ArrowLeft, Play, MapPin, Clock, Info, Globe } from 'lucide-react'
import Footer from '@/components/Footer'
import SacredSitesTabs from '@/components/ziyarat/SacredSitesTabs' // ✅ Import Tabs

interface PageProps {
  params: Promise<{ city: string; slug: string }>
}

export default async function SingleZiyaratPage({ params }: PageProps) {
  const { city, slug } = await params
  
  const cityDisplayName = city.replace('-ziyarat', '').charAt(0).toUpperCase() + city.replace('-ziyarat', '').slice(1)

  // 1. Fetch Current Location
  const result = await db
    .select()
    .from(ziyaratLandmarks)
    .where(eq(ziyaratLandmarks.slug, slug))
    .limit(1)

  const location = result[0]

  if (!location) return notFound()

  // 2. Fetch All Locations (For the Bottom Tabs)
  const allLocations = await db.select().from(ziyaratLandmarks)

  const images = location.images || []
  const banner = location.bannerImage || images[0] || '/placeholder.jpg'

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans">

      {/* --- HERO / BANNER SECTION --- */}
      <div className="relative h-[60vh] w-full flex items-center justify-center bg-black overflow-hidden -mt-[80px] pt-[80px]">
         <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${banner}")` }}>
            <div className="absolute inset-0 bg-black/60" />
         </div>
         <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
            {location.urduTitle && (
                <h2 className="text-4xl md:text-7xl text-white mb-4 leading-relaxed drop-shadow-lg" style={{ fontFamily: '"Noto Nastaliq Urdu", serif', lineHeight: 1.8 }}>
                    {location.urduTitle}
                </h2>
            )}
            <h1 className="text-3xl md:text-5xl font-bold text-[#F9C344] font-serif mb-6 drop-shadow-xl uppercase tracking-wide">
                {location.name}
            </h1>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-300 font-medium uppercase tracking-wider flex-wrap">
                <Link className="hover:text-[#F9C344] transition-colors" href="/">Home</Link>
                <ChevronRight size={14} className="text-[#F9C344]" />
                <Link className="hover:text-[#F9C344] transition-colors" href="/ziyarat">Ziyarat</Link>
                <ChevronRight size={14} className="text-[#F9C344]" />
                <Link className="hover:text-[#F9C344] transition-colors" href={`/ziyarat/${city}`}>{cityDisplayName}</Link>
                <ChevronRight size={14} className="text-[#F9C344]" />
                <span className="text-white/60">{location.name}</span>
            </div>
         </div>
      </div>

      {/* --- MAIN CONTENT CONTAINER --- */}
      <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-16 w-full relative block">
         
         {/* 1. BACK BUTTON */}
         <div className="mb-8 block">
            <Link href={`/ziyarat/${city}`} className="inline-flex items-center gap-2 text-gray-400 hover:text-[#F9C344] transition-colors uppercase text-sm font-bold tracking-widest group">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Back to List
            </Link>
         </div>

         {/* 2. SIDEBAR (Floated Right) */}
         <div className="w-full lg:w-[400px] lg:float-right lg:ml-12 mb-8 space-y-8 clear-both">
            {/* Video Box */}
            <div className="rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-black relative group">
               <div className="relative pb-[56.25%] h-0">
                  <div className="absolute top-0 left-0 w-full h-full cursor-pointer overflow-hidden">
                     <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url("${banner}")` }} />
                     <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all" />
                     {location.videoUrl && (
                         <div className="absolute inset-0 flex items-center justify-center">
                             <a href={location.videoUrl} target="_blank" rel="noopener noreferrer" className="w-20 h-14 bg-[#F9C344] rounded-xl flex items-center justify-center shadow-lg border border-white/20 hover:scale-110 transition-transform duration-300">
                                 <Play size={28} className="text-white fill-white ml-1" />
                             </a>
                         </div>
                     )}
                  </div>
               </div>
            </div>

            {/* Gallery */}
            {images.length > 0 && (
                <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6 shadow-xl">
                   <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-widest flex items-center justify-between">
                      Gallery <span className="text-xs text-gray-500 normal-case bg-white/5 px-2 py-1 rounded">{images.length} Images</span>
                   </h3>
                   <div className="grid grid-cols-2 gap-3">
                      {images.slice(0, 4).map((img, idx) => (
                          <div key={idx} className={`relative rounded-lg overflow-hidden group cursor-pointer border border-white/5 hover:border-[#F9C344] transition-all ${idx === 0 ? 'col-span-2 h-48' : 'h-32'}`}>
                             <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                             <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all" />
                          </div>
                      ))}
                   </div>
                </div>
            )}

            {/* Google Map */}
            {location.googleMapLink && (
              <a href={location.googleMapLink} target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 bg-[#1a1a1a] rounded-xl border border-white/10 hover:border-[#F9C344] transition-all cursor-pointer group shadow-xl">
                 <div className="w-12 h-12 rounded-full bg-[#F9C344]/10 flex items-center justify-center text-[#F9C344] shrink-0 border border-[#F9C344]/20 group-hover:bg-[#F9C344] group-hover:text-black transition-colors">
                    <Globe size={22} />
                 </div>
                 <div>
                    <span className="block text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Navigation</span>
                    <span className="text-white text-base font-medium underline decoration-dashed underline-offset-4">Open in Google Maps</span>
                 </div>
              </a>
            )}
         </div>

         {/* 3. MAIN CONTENT */}
         <div className="block">
            
            {/* SITE INFO BOX
                We use 'lg:mr-[448px]' to force this box to stay in the left column on desktop.
                This prevents it from sliding under the floated sidebar, keeping it parallel.
            */}
            <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-8 shadow-xl mb-10 overflow-hidden lg:mr-[448px]">
               <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                  <Info size={24} className="text-[#F9C344]" />
                  <h4 className="text-xl font-bold text-white uppercase tracking-widest">Site Information</h4>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="flex items-start gap-4 p-3 rounded-lg border border-white/5 bg-white/5">
                     <div className="w-10 h-10 rounded-full bg-[#F9C344]/10 flex items-center justify-center text-[#F9C344] shrink-0 border border-[#F9C344]/20"><MapPin size={20} /></div>
                     <div>
                        <span className="block text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Location</span>
                        <span className="text-white text-sm font-medium">{location.location || 'N/A'}</span>
                     </div>
                  </div>
                  <div className="flex items-start gap-4 p-3 rounded-lg border border-white/5 bg-white/5">
                     <div className="w-10 h-10 rounded-full bg-[#F9C344]/10 flex items-center justify-center text-[#F9C344] shrink-0 border border-[#F9C344]/20"><Clock size={20} /></div>
                     <div>
                        <span className="block text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Timings</span>
                        <span className="text-white text-sm font-medium">{location.timings || 'Open 24 Hours'}</span>
                     </div>
                  </div>
               </div>

               <div className="border-t border-white/5 pt-6">
                  <h3 className="text-lg font-bold text-[#F9C344] mb-3 uppercase tracking-widest">About This Site</h3>
                  <p className="text-gray-300 leading-relaxed text-sm">
                     {location.shortDescription}
                  </p>
               </div>
            </div>

            {/* HISTORY TEXT
                No right margin here. This allows the text to flow next to the sidebar
                and then WRAP underneath it to full width once the sidebar content ends.
            */}
            <div className="prose prose-invert max-w-none prose-headings:text-[#F9C344] prose-headings:font-serif prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6 prose-li:text-gray-300 prose-ul:my-6 prose-li:mb-2">
               <h3 className="text-3xl font-bold mb-6 border-l-4 border-[#F9C344] pl-4">Historical Significance</h3>
               <div dangerouslySetInnerHTML={{ __html: location.fullHistory || '' }} />
            </div>
         </div>

      </main>

      {/* 4. SACRED SITES TABS (Above Footer) */}
      <SacredSitesTabs locations={allLocations} />

      <Footer />
    </div>
  )
}