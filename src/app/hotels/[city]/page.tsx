'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home, Star, ArrowRight, ChevronLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { HOTELS_DATA, OTHER_CITIES_LINKS } from '@/data/hotels';

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

export default function CityHotelsPage() {
  const params = useParams();
  
  // 1. GET CITY DATA
  const citySlug = (params.city as string).toLowerCase();
  const data = HOTELS_DATA[citySlug];

  // 2. FALLBACK IF CITY NOT FOUND
  if (!data) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center">
        <Header />
        <h1 className="text-4xl text-[#F9C344] font-serif mb-4">City Not Found</h1>
        <p className="text-gray-400 mb-6">We don't have hotel data for "{citySlug}" yet.</p>
        <Link href="/" className="px-6 py-2 bg-white text-black rounded hover:bg-[#F9C344] transition">
          Go Home
        </Link>
        <Footer />
      </div>
    );
  }

  // 3. FILTER OTHER CITIES (Exclude current)
  const otherCities = OTHER_CITIES_LINKS.filter(c => c.slug !== citySlug);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans">
      <Header />

      {/* =========================================
          HERO BANNER (Dynamic)
      ========================================= */}
      <div className="relative h-[60vh] w-full flex items-center justify-center bg-black overflow-hidden -mt-[80px] pt-[80px]">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${data.bannerImage}')` }}
        >
           <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-[#F9C344] font-serif mb-4 drop-shadow-xl uppercase tracking-widest">
            {data.title}
          </h1>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-300 font-medium uppercase tracking-wider">
            <Link href="/" className="hover:text-[#F9C344] transition-colors flex items-center gap-1">
              <Home size={14} className="-mt-0.5" /> Home
            </Link>
            <ChevronRight size={14} className="text-[#F9C344]" />
            <span className="text-white capitalize">{citySlug}</span>
          </div>
        </div>
      </div>

      <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-20 w-full space-y-24">
        
        {/* =========================================
            ABOUT SECTION 1 (Dynamic)
        ========================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
                <div>
                   <h4 className="text-[#F9C344] font-bold uppercase tracking-widest text-sm mb-2">Destination Overview</h4>
                   <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
                     {data.aboutTitle}
                   </h2>
                </div>
                <div className="prose prose-invert text-gray-300 leading-relaxed">
                    <p>{data.aboutText}</p>
                </div>
            </div>
            
            <div className="relative h-[400px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <img 
                  src={data.aboutImage} 
                  alt={data.aboutTitle} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
            </div>
        </section>

        {/* =========================================
            ABOUT SECTION 2 (Optional - e.g. Kaaba)
        ========================================= */}
        {data.secondFeatureTitle && (
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="relative h-[400px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl order-2 lg:order-1">
                    <img 
                      src={data.secondFeatureImage} 
                      alt={data.secondFeatureTitle} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                </div>

                <div className="space-y-6 order-1 lg:order-2">
                    <div>
                      <h4 className="text-[#F9C344] font-bold uppercase tracking-widest text-sm mb-2">Sacred Landmarks</h4>
                      <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
                        {data.secondFeatureTitle}
                      </h2>
                    </div>
                    <div className="prose prose-invert text-gray-300 leading-relaxed">
                        <p>{data.secondFeatureText}</p>
                    </div>
                </div>
            </section>
        )}

        <div className="h-px bg-white/10 w-full" />

        {/* =========================================
            HOTELS GRID (Dynamic List)
        ========================================= */}
        <section>
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-[#F9C344] font-bold uppercase tracking-widest text-sm mb-3">Accommodation</h2>
                <h3 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">Stay in Comfort</h3>
                <p className="text-gray-400">
                    {data.description}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.hotels.map((hotel) => (
                    <div key={hotel.id} className="group bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden shadow-lg hover:shadow-[#F9C344]/10 transition-all duration-300">
                        <div className="relative h-64 overflow-hidden">
                            <img 
                                src={hotel.image} 
                                alt={hotel.name} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 border border-white/10">
                                <Star size={12} className="text-[#F9C344] fill-[#F9C344]" />
                                <span className="text-xs font-bold text-white">{hotel.stars} Star</span>
                            </div>
                        </div>

                        <div className="p-6">
                            <h3 className="text-xl font-serif font-bold text-white mb-3 group-hover:text-[#F9C344] transition-colors">
                                {hotel.name}
                            </h3>
                            <p className="text-gray-400 text-sm mb-6 line-clamp-3">
                                {hotel.description}
                            </p>
                            
                            <Link 
                                href={`/hotels/${citySlug}/${hotel.slug}`} 
                                className="w-full block text-center bg-[#F9C344] text-black font-bold py-3 rounded-lg uppercase tracking-wider text-sm hover:bg-white transition-colors"
                            >
                                View Hotel
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>

      </main>

      {/* =========================================
          OTHER CITIES SLIDER
      ========================================= */}
      <section className="bg-[#111] py-20 border-t border-white/5">
         <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            
            <div className="flex justify-between items-end mb-12">
               <div>
                  <h2 className="text-[#F9C344] uppercase tracking-widest text-sm font-bold mb-2">Explore Saudi</h2>
                  <h3 className="text-3xl md:text-4xl font-serif font-bold text-white">Hotels in Other Cities</h3>
               </div>
               
               <div className="flex gap-2">
                  <button className="city-prev w-10 h-10 rounded-full border border-white/20 bg-transparent text-white flex items-center justify-center hover:bg-[#F9C344] hover:text-black transition-all">
                     <ChevronLeft size={20} />
                  </button>
                  <button className="city-next w-10 h-10 rounded-full border border-white/20 bg-transparent text-white flex items-center justify-center hover:bg-[#F9C344] hover:text-black transition-all">
                     <ChevronRight size={20} />
                  </button>
               </div>
            </div>

            <Swiper
                 modules={[Navigation, Autoplay]}
                 spaceBetween={24}
                 slidesPerView={1}
                 loop={true}
                 autoplay={{
                   delay: 3000,
                   disableOnInteraction: false,
                 }}
                 navigation={{
                   nextEl: '.city-next',
                   prevEl: '.city-prev',
                 }}
                 breakpoints={{
                   640: { slidesPerView: 2 },
                   1024: { slidesPerView: 3 },
                 }}
            >
                 {otherCities.map((item, idx) => (
                    <SwiperSlide key={idx}>
                       <Link 
                         href={`/hotels/${item.slug}`} // Links to other dynamic pages
                         className="block group relative h-[350px] rounded-xl overflow-hidden cursor-pointer border border-white/10"
                       >
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
                          
                          <div className="absolute bottom-6 left-6 right-6">
                             <div className="text-[#F9C344] text-xs font-bold uppercase tracking-widest mb-1">{item.count}</div>
                             <h4 className="text-xl font-serif font-bold text-white group-hover:translate-x-2 transition-transform duration-300">
                               {item.name}
                             </h4>
                          </div>
                       </Link>
                    </SwiperSlide>
                 ))}
            </Swiper>

         </div>
      </section>

      <Footer />
    </div>
  );
}