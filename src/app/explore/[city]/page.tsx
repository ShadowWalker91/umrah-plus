'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home, Thermometer, CloudRain, Tent, Car, Bus, CarFront, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CITIES_DATA } from '@/data/cities';

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

export default function ExploreCityPage() {
  const params = useParams();
  const citySlug = (params.city as string).toLowerCase();
  const data = CITIES_DATA[citySlug];

  // Fallback
  if (!data) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center">
        <Header />
        <h1 className="text-4xl text-[#F9C344] font-serif mb-4">City Not Found</h1>
        <p className="text-gray-400 mb-6">We could not find data for "{citySlug}"</p>
        <Link href="/explore" className="px-6 py-2 bg-white text-black rounded hover:bg-[#F9C344] transition">
          Back to Explore
        </Link>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans">
      <Header />

      {/* =========================================
          HERO VIDEO BANNER
      ========================================= */}
      <div className="relative h-screen w-full flex items-center justify-center bg-black overflow-hidden -mt-[80px]">
        <video 
           autoPlay 
           muted 
           loop 
           playsInline
           className="absolute inset-0 w-full h-full object-cover opacity-60"
           src={data.heroVideo}
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-20">
          <h1 className="text-5xl md:text-7xl font-bold text-white font-serif mb-6 drop-shadow-2xl">
            {data.heroTitle}
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed">
            {data.heroSubtitle}
          </p>
        </div>
      </div>

      <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-20 w-full space-y-32">
        
        {/* =========================================
            BREADCRUMB & NAV LINKS
        ========================================= */}
        <div className="flex justify-center gap-8 text-sm text-gray-400 border-b border-white/10 pb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
           {['About', 'Things To Do', 'Tours', 'Stories', 'Guide'].map((item) => (
             <span key={item} className="cursor-pointer hover:text-[#F9C344] transition-colors uppercase tracking-widest font-bold">
               {item} {data.name}
             </span>
           ))}
        </div>

        {/* =========================================
            ABOUT SECTION
        ========================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
               <h2 className="text-4xl md:text-5xl font-serif font-bold text-white relative inline-block">
                 {data.aboutTitle}
                 <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-[#F9C344]"></span>
               </h2>
               <p className="text-gray-300 leading-loose text-lg">
                 {data.aboutText}
               </p>
            </div>
            
            {/* Weather Grid */}
            <div className="bg-[#1a1a1a] rounded-3xl p-8 border border-white/5 shadow-2xl">
               <h3 className="text-2xl font-bold text-white mb-8 border-l-4 border-[#F9C344] pl-4">Average Weather</h3>
               <div className="grid grid-cols-2 gap-8">
                  {Object.entries(data.weather).map(([season, temp]) => (
                     <div key={season} className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#F9C344]/10 flex items-center justify-center text-[#F9C344]">
                           <Thermometer size={24} />
                        </div>
                        <div>
                           <span className="block text-xs text-gray-500 uppercase font-bold tracking-wider capitalize">{season}</span>
                           <span className="text-2xl font-bold text-white">{temp}</span>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
        </section>

        {/* =========================================
            BEST TIME & TRANSPORT
        ========================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Best Time */}
            <div className="bg-[#111] p-10 rounded-3xl border border-white/5">
                <h3 className="text-3xl font-serif font-bold text-white mb-8">Best Time To Visit</h3>
                <div className="space-y-6">
                    {data.bestTime.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-6 p-4 bg-[#1a1a1a] rounded-xl hover:border-[#F9C344] border border-transparent transition-all group">
                          <div className="text-[#F9C344] group-hover:scale-110 transition-transform">
                             {item.icon === 'cloud-rain' ? <CloudRain size={32} /> : <Tent size={32} />}
                          </div>
                          <div>
                             <h4 className="text-white font-bold text-lg">{item.title}</h4>
                             <p className="text-gray-400 text-sm">{item.months}</p>
                          </div>
                      </div>
                    ))}
                </div>
            </div>

            {/* Transport */}
            <div className="bg-[#111] p-10 rounded-3xl border border-white/5">
                <h3 className="text-3xl font-serif font-bold text-white mb-8">Transportation</h3>
                <div className="space-y-6">
                    {data.transportation.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-6 p-4 bg-[#1a1a1a] rounded-xl hover:border-[#F9C344] border border-transparent transition-all group">
                          <div className="text-[#F9C344] group-hover:scale-110 transition-transform">
                             {item.icon === 'car' ? <Car size={32} /> : item.icon === 'bus' ? <Bus size={32} /> : <CarFront size={32} />}
                          </div>
                          <h4 className="text-white font-bold text-lg">{item.title}</h4>
                      </div>
                    ))}
                </div>
            </div>

        </section>

        {/* =========================================
            THINGS TO DO SLIDER
        ========================================= */}
        <section>
            <div className="flex justify-between items-end mb-12">
               <div>
                  <h2 className="text-[#F9C344] uppercase tracking-widest text-sm font-bold mb-3">Attractions</h2>
                  <h3 className="text-4xl font-serif font-bold text-white">Things To Do In {data.name}</h3>
               </div>
               
               {/* Nav Buttons */}
               <div className="flex gap-2">
                  <button className="todo-prev w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#F9C344] hover:text-black transition-all">
                     <ChevronLeft size={24} />
                  </button>
                  <button className="todo-next w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#F9C344] hover:text-black transition-all">
                     <ChevronRightIcon size={24} />
                  </button>
               </div>
            </div>

            <Swiper
                 modules={[Navigation, Autoplay]}
                 spaceBetween={24}
                 slidesPerView={1}
                 loop={true}
                 autoplay={{ delay: 3000 }}
                 navigation={{
                   nextEl: '.todo-next',
                   prevEl: '.todo-prev',
                 }}
                 breakpoints={{
                   640: { slidesPerView: 2 },
                   1024: { slidesPerView: 4 },
                 }}
            >
                 {data.thingsToDo.map((item, idx) => (
                    <SwiperSlide key={idx}>
                       <div className="group relative h-[350px] rounded-2xl overflow-hidden cursor-pointer border border-white/10">
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
                          <div className="absolute bottom-6 left-6 right-6">
                             <h4 className="text-xl font-serif font-bold text-white group-hover:text-[#F9C344] transition-colors leading-tight">
                               {item.title}
                             </h4>
                          </div>
                       </div>
                    </SwiperSlide>
                 ))}
            </Swiper>
        </section>

      </main>

      <Footer />
    </div>
  );
}