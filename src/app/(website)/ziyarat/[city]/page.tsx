import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { ziyaratLandmarks } from '@/lib/db/schema/ziyarat'
import { eq } from 'drizzle-orm'
import { ChevronRight, Home } from 'lucide-react'
import Footer from '@/components/Footer'
import ZiyaratGrid from '@/components/ziyarat/ZiyaratGrid'
import OtherCitiesSlider from '@/components/ziyarat/OtherCitiesSlider'

// --- CONFIGURATION ---
const CITY_CONFIG: Record<string, { name: string, banner: string, code: string }> = {
  'makkah-ziyarat': { 
    name: 'Makkah', 
    banner: '/assets/images/ziyarat/makkah/makkahCityPageBanner.webp',
    code: 'MAK' 
  },
  'madinah-ziyarat': { 
    name: 'Madinah', 
    banner: '/assets/images/ziyarat/MadinahZiyaratCover.webp',
    code: 'MDN' 
  },
  'taif-ziyarat': { 
    name: 'Taif', 
    banner: '/assets/images/ziyarat/TaifZiyaratCover.webp',
    code: 'TAF' 
  },
  'tabuk-ziyarat': { 
    name: 'Tabuk', 
    banner: '/assets/images/ziyarat/TabukZiyaratCover.webp',
    code: 'TAB' 
  },
}

interface PageProps {
  params: Promise<{ city: string }>
}

export default async function CityZiyaratPage({ params }: PageProps) {
  const { city } = await params
  const cityData = CITY_CONFIG[city]

  if (!cityData) return notFound()

  // 1. FETCH DATA FROM DATABASE
  const locations = await db
    .select()
    .from(ziyaratLandmarks)
    .where(eq(ziyaratLandmarks.city, cityData.name))

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans">

      {/* --- HERO SECTION --- */}
      <div className="relative h-[50vh] w-full flex items-center justify-center bg-black overflow-hidden">
        <div 
            className="absolute inset-0 bg-cover bg-center opacity-60" 
            style={{ backgroundImage: `url('${cityData.banner}')` }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center px-4 pt-20">
            <h1 className="text-4xl md:text-6xl font-bold text-[#F9C344] font-serif mb-4 drop-shadow-lg uppercase tracking-wide">
                {cityData.name} Ziyarat
            </h1>
            <div className="flex items-center justify-center gap-2 text-sm md:text-base text-gray-300 font-medium uppercase tracking-wider">
                <Link href="/" className="hover:text-[#F9C344] transition-colors flex items-center gap-1">
                    <Home size={14} className="-mt-0.5" /> Home
                </Link>
                <ChevronRight size={14} className="text-[#F9C344]" />
                <Link href="/ziyarat" className="hover:text-[#F9C344] transition-colors">Ziyarat</Link>
                <ChevronRight size={14} className="text-[#F9C344]" />
                <span className="text-[#F9C344]">{cityData.name} Ziyarat</span>
            </div>
        </div>
      </div>

      {/* --- MAIN GRID SECTION --- */}
      <main className="flex-1 max-w-[1400px] mx-auto px-4 md:px-8 py-20 w-full">
        <div className="text-center mb-16">
            <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                Explore the historical and spiritual landmarks across the Holy City.
            </p>
            <div className="w-24 h-1 bg-[#F9C344] mx-auto mt-6 rounded-full" />
        </div>

        {/* 2. CLIENT GRID COMPONENT (Handles Load More) */}
        <ZiyaratGrid 
            locations={locations} 
            cityCode={cityData.code} 
            citySlug={city} 
        />
      </main>

      {/* 3. SLIDER SECTION (Client Component) */}
      <OtherCitiesSlider currentCitySlug={city} />

      <Footer />
    </div>
  )
}