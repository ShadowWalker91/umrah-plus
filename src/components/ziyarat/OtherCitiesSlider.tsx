'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'

// Configuration for the cities (Images & Links)
const ALL_CITIES = [
  { 
    name: "Makkah", 
    slug: "makkah-ziyarat", 
    link: "/ziyarat/makkah-ziyarat", 
    img: "/assets/images/ziyarat/makkah/makkahCityPageBanner.webp",
  },
  { 
    name: "Madinah", 
    slug: "madinah-ziyarat", 
    link: "/ziyarat/madinah-ziyarat", 
    img: "/assets/images/ziyarat/MadinahZiyaratCover.webp",
  },
  { 
    name: "Taif", 
    slug: "taif-ziyarat", 
    link: "/ziyarat/taif-ziyarat", 
    img: "/assets/images/ziyarat/TaifZiyaratCover.webp",
  },
  { 
    name: "Tabuk", 
    slug: "tabuk-ziyarat", 
    link: "/ziyarat/tabuk-ziyarat", 
    img: "/assets/images/ziyarat/TabukZiyaratCover.webp",
  },
]

export default function OtherCitiesSlider({ currentCitySlug }: { currentCitySlug: string }) {
  // Filter out the current city so it doesn't show in "Other Destinations"
  const otherCities = ALL_CITIES.filter(c => c.slug !== currentCitySlug)

  return (
    <section className="bg-[#111] py-16 border-t border-b border-white/5 relative z-10">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-[#F9C344] uppercase tracking-widest text-sm font-bold mb-2">Explore More</h2>
              <h3 className="text-3xl md:text-4xl font-serif font-bold text-white">Other Ziyarat Destinations</h3>
            </div>
            
            <div className="flex gap-2">
              <button className="other-prev w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-[#F9C344] hover:text-black hover:border-[#F9C344] transition-all">
                <ChevronLeft size={20} />
              </button>
              <button className="other-next w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-[#F9C344] hover:text-black hover:border-[#F9C344] transition-all">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={30}
            loop={true}
            navigation={{
              nextEl: '.other-next',
              prevEl: '.other-prev',
            }}
            breakpoints={{
              320: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="w-full"
          >
            {otherCities.map((city, idx) => (
              <SwiperSlide key={idx}>
                <Link href={city.link} className="block group relative h-[350px] rounded-xl overflow-hidden cursor-pointer shadow-lg border border-white/5 bg-black">
                  <img 
                    src={city.img} 
                    alt={city.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500" />
                  <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black to-transparent">
                    <h4 className="text-2xl font-serif font-bold text-white mb-1">{city.name}</h4>
                    <span className="text-[#F9C344] text-sm uppercase tracking-wider group-hover:translate-x-2 transition-transform inline-block duration-300">
                      Explore Ziyarat &rarr;
                    </span>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
  )
}