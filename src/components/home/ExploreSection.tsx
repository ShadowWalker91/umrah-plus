'use client';

import { Plane, ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { SITE_CONFIG } from '@/data/siteConfig';

import 'swiper/css';
import 'swiper/css/navigation';

export default function ExploreSection() {
  return (
    <section id="section-5" className="snap-section h-screen w-full relative flex flex-col items-center justify-center overflow-hidden snap-start bg-zinc-900">
      
      {/* 1. BACKGROUND IMAGE */}
      <div className="absolute inset-0 z-0">
        <img 
          src={SITE_CONFIG.explore.backgroundImage} 
          alt="KSA Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
      </div>

      {/* 2. MAIN CONTENT WRAPPER */}
      {/* Increased pt-32 (Mobile) and pt-40 (Desktop) to clear sticky header */}
      <div className="relative z-10 w-full h-full flex flex-col pt-32 md:pt-40 pb-12 px-6 md:px-12 lg:px-16 justify-between">
        
        {/* --- TOP CENTER HEADER (UPDATED) --- */}
        <div className="text-center w-full mb-8 md:mb-12 animate-fade-in-down">
          <h2 className="text-[#F9C344] font-sans font-bold text-3xl md:text-5xl lg:text-6xl uppercase tracking-widest drop-shadow-xl leading-tight">
            Explore KSA
          </h2>
          <p className="text-white text-sm md:text-base mt-4 font-light opacity-90 tracking-wide leading-relaxed max-w-3xl mx-auto">
            From deserts to beaches, history to modernity—this country has something for everyone.
          </p>
        </div>

        {/* --- SPLIT CONTENT --- */}
        <div className="flex flex-col lg:flex-row items-center w-full h-full gap-8 lg:gap-12">
          
          {/* LEFT SIDE: Text Content */}
          <div className="w-full lg:w-[35%] flex flex-col justify-center text-center lg:text-left space-y-4 md:space-y-6">
            <h2 className="text-[#F9C344] font-serif text-3xl md:text-4xl lg:text-5xl font-light leading-tight drop-shadow-xl">
              {SITE_CONFIG.explore.title}
            </h2>
            
            <p className="text-gray-200 text-sm md:text-sm lg:text-base leading-relaxed font-light opacity-90 hidden md:block">
              {SITE_CONFIG.explore.description}
            </p>

            <div className="pt-2 md:pt-4">
              <button className="bg-[#F9C344] text-black px-6 py-3 md:px-8 md:py-3.5 rounded-full font-bold text-xs md:text-sm uppercase tracking-widest hover:bg-white hover:scale-105 transition-all duration-300 shadow-lg">
                Find Your Next Destination
              </button>
            </div>
          </div>

          {/* RIGHT SIDE: Carousel */}
          <div className="w-full lg:w-[65%] flex flex-col gap-6">
            
            {/* Swiper Container */}
            <div className="w-full h-[320px] md:h-[400px] lg:h-[450px]">
              <Swiper
                modules={[Navigation, Autoplay]}
                spaceBetween={20}
                loop={true}
                // Custom Navigation Elements
                navigation={{
                  nextEl: '.explore-next',
                  prevEl: '.explore-prev',
                }}
                breakpoints={{
                  320: { slidesPerView: 1.2, spaceBetween: 15 }, // Mobile
                  768: { slidesPerView: 2.2, spaceBetween: 20 }, // Tablet
                  1024: { slidesPerView: 3, spaceBetween: 24 },  // Desktop
                }}
                autoplay={{ delay: 3500, disableOnInteraction: false }}
                className="w-full h-full explore-swiper rounded-xl"
              >
                {SITE_CONFIG.cities.map((city, idx) => (
                  <SwiperSlide key={idx} className="h-full group cursor-pointer py-2">
                    <div className="relative h-full w-full rounded-xl overflow-hidden shadow-2xl transition-transform duration-500 hover:-translate-y-2 border border-white/10">
                      
                      {/* Image */}
                      <img 
                        src={city.img} 
                        alt={city.name} 
                        className="w-full h-full object-cover transition duration-700 group-hover:scale-110" 
                      />
                      
                      {/* Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

                      {/* Content */}
                      <div className="absolute bottom-6 left-0 w-full flex flex-col items-center justify-center text-center z-20">
                        <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-full flex items-center justify-center mb-3 shadow-lg group-hover:bg-[#F9C344] transition-all duration-300">
                          <Plane className="text-black transition-colors" size={20} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-lg font-bold text-white tracking-wide group-hover:text-[#F9C344] transition-colors">
                          {city.name}
                        </h3>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* CUSTOM NAVIGATION ARROWS (Bottom) */}
            <div className="flex items-center justify-center lg:justify-start gap-4 pl-2">
              <button className="explore-prev w-12 h-12 border border-[#F9C344] rounded-full flex items-center justify-center text-[#F9C344] hover:bg-[#F9C344] hover:text-black transition-all duration-300 group">
                <ChevronLeft size={24} />
              </button>
              <button className="explore-next w-12 h-12 border border-[#F9C344] rounded-full flex items-center justify-center text-[#F9C344] hover:bg-[#F9C344] hover:text-black transition-all duration-300 group">
                <ChevronRight size={24} />
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}