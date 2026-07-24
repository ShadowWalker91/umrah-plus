'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'

const CITIES = [
  { name: 'Makkah', code: 'MAK' },
  { name: 'Madinah', code: 'MDN' },
  { name: 'Taif', code: 'TAF' },
  { name: 'Tabuk', code: 'TAB' },
]

export default function SacredSitesTabs({ locations }: { locations: any[] }) {
  const [activeCity, setActiveCity] = useState('Makkah')

  const filteredLocations = useMemo(() => {
    return locations.filter(loc => loc.city === activeCity)
  }, [locations, activeCity])

  const activeCityCode = CITIES.find(c => c.name === activeCity)?.code || 'UNK'

  return (
    // ✅ CHANGED: 
    // 1. bg-[#121212] -> Lighter than black to stand out from footer
    // 2. border-y -> Adds a border to both TOP and BOTTOM
    <section className="bg-[#121212] py-24 border-y border-white/10 mt-16 relative z-10 shadow-2xl">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-[#F9C344] uppercase tracking-widest text-sm font-bold mb-2">Explore More</h2>
          <h3 className="text-4xl font-serif font-bold text-white">Discover Sacred Sites</h3>
          <div className="w-24 h-1 bg-[#F9C344] mx-auto mt-6 rounded-full opacity-60" />
        </div>

        {/* City Tabs */}
        <div className="flex justify-center flex-wrap gap-4 mb-16">
          {CITIES.map((city) => (
            <button
              key={city.name}
              onClick={() => setActiveCity(city.name)}
              className={`px-8 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 border ${
                activeCity === city.name
                  ? 'bg-[#F9C344] text-black border-[#F9C344] shadow-[0_0_20px_rgba(249,195,68,0.3)] scale-105'
                  : 'bg-[#1a1a1a] text-gray-400 border-white/5 hover:border-white/30 hover:text-white hover:bg-[#252525]'
              }`}
            >
              {city.name}
            </button>
          ))}
        </div>

        {/* Carousel / Content */}
        <div className="relative min-h-[300px]">
          
          {/* Navigation Buttons */}
          <button className={`tab-prev absolute -left-4 md:-left-16 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/10 bg-[#1a1a1a] text-white flex items-center justify-center hover:bg-[#F9C344] hover:text-black hover:border-[#F9C344] z-10 transition-all shadow-lg ${filteredLocations.length === 0 ? 'hidden' : ''}`}>
            <ChevronLeft size={24} />
          </button>
          <button className={`tab-next absolute -right-4 md:-right-16 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/10 bg-[#1a1a1a] text-white flex items-center justify-center hover:bg-[#F9C344] hover:text-black hover:border-[#F9C344] z-10 transition-all shadow-lg ${filteredLocations.length === 0 ? 'hidden' : ''}`}>
            <ChevronRight size={24} />
          </button>

          {activeCity === 'Tabuk' && filteredLocations.length === 0 ? (
             <div className="flex justify-center items-center h-[350px] border-2 border-dashed border-white/10 rounded-2xl bg-[#1a1a1a]/50">
                <div className="text-center">
                   <h4 className="text-3xl font-bold text-white mb-3">Tabuk Ziyarat</h4>
                   <span className="inline-block bg-[#F9C344]/10 text-[#F9C344] px-6 py-2 rounded-full text-sm font-bold tracking-widest uppercase border border-[#F9C344]/30">Coming Soon</span>
                </div>
             </div>
          ) : filteredLocations.length === 0 ? (
             <div className="text-center text-gray-500 py-24 bg-[#1a1a1a]/30 rounded-2xl border border-white/5">
                No locations found for {activeCity}.
             </div>
          ) : (
            <Swiper
              modules={[Navigation, Autoplay]}
              navigation={{ prevEl: '.tab-prev', nextEl: '.tab-next' }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              spaceBetween={24}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="w-full !pb-10" // Added padding bottom for shadow visibility
            >
              {filteredLocations.map((loc, index) => {
                const formattedIndex = (index + 1).toString().padStart(2, '0')
                const displayCode = `${activeCityCode} - ${formattedIndex}`
                const imageUrl = (loc.images && loc.images.length > 0) ? loc.images[0] : '/placeholder.jpg'
                const citySlug = `${activeCity.toLowerCase()}-ziyarat`

                return (
                  <SwiperSlide key={loc.id}>
                    <Link href={`/ziyarat/${citySlug}/${loc.slug}`} className="block group relative h-[320px] rounded-2xl overflow-hidden cursor-pointer border border-white/10 bg-[#1a1a1a]">
                      <Image src={imageUrl} alt={loc.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-[#F9C344] text-black text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">{displayCode}</span>
                        </div>
                        <h4 className="text-2xl font-serif font-bold text-white group-hover:text-[#F9C344] transition-colors leading-tight">{loc.name}</h4>
                      </div>
                    </Link>
                  </SwiperSlide>
                )
              })}
            </Swiper>
          )}
        </div>
      </div>
    </section>
  )
}