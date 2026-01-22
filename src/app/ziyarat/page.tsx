'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// 👇 CHANGE 1: Remove SITE_CONFIG import and add your new import
import { ZIYARAT_CITIES_SUMMARY } from '@/data/ziyarat';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

export default function ZiyaratPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col justify-between">
      <Header />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col justify-center items-center relative w-full py-32 md:py-40">
        
        {/* Background Overlay (Optional Texture) */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>

        <div className="w-full max-w-[1600px] px-6 lg:px-12 relative z-10">
          
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in-down">
            <h1 className="text-[#F9C344] font-serif text-4xl md:text-6xl font-bold mb-4 drop-shadow-xl">
              Sacred Ziyarat Destinations
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto font-light text-sm md:text-base">
              Explore the historical and spiritual landmarks across the Kingdom. Select a city to begin your journey.
            </p>
          </div>

          {/* CITY CAROUSEL */}
          <div className="relative px-4 md:px-12">
            
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={30}
              loop={true}
              navigation={{
                nextEl: '.ziyarat-next',
                prevEl: '.ziyarat-prev',
              }}
              breakpoints={{
                320: { slidesPerView: 1, spaceBetween: 20 },      // Mobile: 1 card
                640: { slidesPerView: 2, spaceBetween: 25 },      // Tablet: 2 cards
                1024: { slidesPerView: 3, spaceBetween: 35 },     // Laptop: 3 cards
                1440: { slidesPerView: 4, spaceBetween: 40 },     // Desktop: 4 cards
              }}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              className="w-full py-10"
            >
              {/* 👇 CHANGE 2: Map over ZIYARAT_CITIES_SUMMARY instead of SITE_CONFIG.ziyaratCities */}
              {ZIYARAT_CITIES_SUMMARY.map((city, idx) => (
                <SwiperSlide key={idx}>
                  <Link href={city.link} className="block group relative h-[450px] md:h-[500px] w-full rounded-2xl overflow-hidden cursor-pointer shadow-2xl border border-white/10 hover:border-[#F9C344] transition-all duration-500">
                    
                    {/* Background Image */}
                    <img 
                      src={city.img} 
                      alt={city.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    
                    {/* Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />

                    {/* Content (Bottom Center) */}
                    <div className="absolute bottom-0 left-0 w-full p-8 text-center flex flex-col items-center transform transition-transform duration-500 translate-y-2 group-hover:translate-y-0">
                      
                      {/* "Ziyarat In" Label (Gold) */}
                      <span className="text-[#F9C344] uppercase tracking-[0.2em] text-xs md:text-sm font-medium mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 block">
                        {city.label}
                      </span>

                      {/* City Name (White) */}
                      <h2 className="text-3xl md:text-4xl font-bold text-white font-serif tracking-wide drop-shadow-md group-hover:text-[#F9C344] transition-colors">
                        {city.name}
                      </h2>

                      {/* Decoration Line */}
                      <div className="w-12 h-0.5 bg-[#F9C344] mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200"></div>
                    </div>

                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Navigation Arrows */}
            <button className="ziyarat-prev absolute top-1/2 -translate-y-1/2 left-0 z-20 w-12 h-12 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-[#F9C344] hover:text-black border border-white/10 transition-all hidden md:flex">
              <ChevronLeft size={24} />
            </button>
            <button className="ziyarat-next absolute top-1/2 -translate-y-1/2 right-0 z-20 w-12 h-12 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-[#F9C344] hover:text-black border border-white/10 transition-all hidden md:flex">
              <ChevronRight size={24} />
            </button>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}