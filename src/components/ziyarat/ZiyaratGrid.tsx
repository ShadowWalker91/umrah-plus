'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

// Define the type for the data coming from the DB
interface Location {
  id: string
  name: string
  slug: string
  images: string[] | null
}

export default function ZiyaratGrid({ locations, cityCode, citySlug }: { locations: Location[], cityCode: string, citySlug: string }) {
  const [visibleCount, setVisibleCount] = useState(6)

  const visibleSpots = locations.slice(0, visibleCount)
  const hasMore = visibleCount < locations.length

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6)
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {visibleSpots.map((loc, index) => (
          <div key={loc.id} className="group relative h-[500px] rounded-2xl overflow-hidden shadow-lg border border-white/5 cursor-pointer">
              {/* Image */}
              <img 
                  src={(loc.images && loc.images.length > 0) ? loc.images[0] : '/placeholder.jpg'} 
                  alt={loc.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90" />
              
              {/* Content Overlay */}
              <div className="absolute bottom-6 left-6 right-6 z-20">
                  <div className="bg-black/80 backdrop-blur-sm border border-white/10 rounded-lg p-5 shadow-2xl">
                      <div className="text-white text-xs font-bold uppercase tracking-widest mb-1 opacity-90">
                          {cityCode} - {String(index + 1).padStart(2, '0')}
                      </div>
                      <div className="flex justify-between items-end gap-4">
                          <h3 className="text-xl md:text-2xl font-serif font-bold text-[#F9C344] leading-tight">
                              {loc.name}
                          </h3>
                          <div className="w-10 h-10 rounded-full bg-[#F9C344] flex items-center justify-center text-black shadow-lg transform transition-transform duration-300 group-hover:-rotate-45 shrink-0">
                              <ArrowRight size={18} strokeWidth={2.5} />
                          </div>
                      </div>
                  </div>
              </div>

              {/* Link to Detail Page */}
              <Link 
                  href={`/ziyarat/${citySlug}/${loc.slug}`} 
                  className="absolute inset-0 z-30" 
                  aria-label={`View details for ${loc.name}`}
              />
          </div>
        ))}

        {/* COMING SOON CARD (Shows when no more items) */}
        {!hasMore && locations.length > 0 && (
           <div className="relative h-[500px] rounded-2xl overflow-hidden border border-white/5 flex flex-col items-center justify-center text-center p-8">
              <div className="absolute inset-0 bg-white/5 backdrop-blur-md transition-colors duration-300 hover:bg-white/10" />
              <div className="relative z-10 space-y-4">
                <div className="w-16 h-16 bg-[#F9C344]/20 rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse">
                  <span className="text-[#F9C344] text-2xl font-bold">...</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-white">
                  More Ziyarat<br />
                  <span className="text-[#F9C344]">Coming Soon</span>
                </h3>
                <p className="text-gray-400 text-sm tracking-widest uppercase font-bold border-t border-white/10 pt-4 mt-2 inline-block">
                  Stay In Touch!
                </p>
              </div>
           </div>
        )}

        {/* EMPTY STATE */}
        {locations.length === 0 && (
            <div className="col-span-full text-center py-20 bg-[#111] rounded-3xl border border-white/5">
                <p className="text-gray-400 text-xl">No Ziyarat locations found yet.</p>
                <p className="text-gray-500 text-sm mt-2">Check back soon!</p>
            </div>
        )}
      </div>

      {/* LOAD MORE BUTTON */}
      {hasMore && (
        <div className="flex justify-center mt-20">
          <button 
            onClick={handleLoadMore}
            className="text-[#F9C344] text-lg font-bold uppercase tracking-widest border-b-2 border-[#F9C344] pb-1 hover:text-white hover:border-white transition-all duration-300"
          >
            Load More
          </button>
        </div>
      )}
    </>
  )
}