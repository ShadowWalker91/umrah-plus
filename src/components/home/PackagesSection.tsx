'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { SITE_CONFIG } from '@/data/siteConfig';

import 'swiper/css';
import 'swiper/css/navigation';

export default function PackagesSection() {
  return (
    <section 
      id="section-6" 
      className="snap-section h-screen w-full bg-[#1c1c1c] text-white relative flex flex-col items-center justify-center overflow-hidden snap-start pt-32 md:pt-40 pb-12"
    >
      
      {/* 1. BACKGROUND IMAGE & OVERLAY */}
      <div className="absolute inset-0 z-0">
        <img 
          src={SITE_CONFIG.packagesSection.backgroundImage} 
          alt="Packages Background" 
          className="w-full h-full object-cover"
        />
        {/* Heavy dark overlay to ensure cards stand out */}
        <div className="absolute inset-0 bg-black/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1c] via-transparent to-[#1c1c1c]/50" />
      </div>

      {/* 2. MAIN CONTENT */}
      <div className="w-full h-full max-w-[1600px] px-6 lg:px-12 flex flex-col justify-center relative z-10">
        
        {/* HEADER (No Subtitle, Yellow Title, White Description) */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-[#FFB700] font-serif font-bold text-3xl md:text-5xl drop-shadow-md uppercase tracking-wide">
            {SITE_CONFIG.packagesSection.title}
          </h2>
          <p className="text-white mt-4 max-w-2xl mx-auto text-xs md:text-sm font-light tracking-wide opacity-90 leading-relaxed">
            {SITE_CONFIG.packagesSection.description}
          </p>
        </div>

        {/* CAROUSEL */}
        <div className="relative w-full px-4 md:px-12 flex-1 flex flex-col justify-center">
          
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={24}
            loop={true}
            navigation={{
              nextEl: '.pkg-next',
              prevEl: '.pkg-prev',
            }}
            breakpoints={{
              320: { slidesPerView: 1, spaceBetween: 20 },      // Mobile: 1 Slide
              640: { slidesPerView: 2, spaceBetween: 20 },      // Tablet: 2 Slides
              1024: { slidesPerView: 3, spaceBetween: 30 },     // Laptop: 3 Slides
              1440: { slidesPerView: 3, spaceBetween: 40 },     // Large Desktop: 3 Slides (Wider)
            }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            className="w-full py-10"
          >
            {SITE_CONFIG.packages.map((pkg, idx) => {
              const IconComponent = pkg.icon;
              return (
                <SwiperSlide key={idx} className="h-auto flex items-center justify-center">
                  <div className="group relative w-full flex flex-col bg-[#222] rounded-xl overflow-visible shadow-xl transition-transform hover:-translate-y-2 duration-300 border border-white/5 h-full">
                    
                    {/* IMAGE CONTAINER */}
                    <div className="relative h-[250px] md:h-[300px] lg:h-[350px] w-full overflow-hidden rounded-t-xl shrink-0">
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition z-10"/>
                      <img 
                        src={pkg.img} 
                        alt={pkg.name} 
                        className="w-full h-full object-cover transition duration-700 group-hover:scale-110" 
                      />
                    </div>

                    {/* CIRCULAR ICON (Overlapping Image & Footer) */}
                    <div className="absolute top-[250px] md:top-[300px] lg:top-[350px] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center border-[6px] border-[#222] shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="text-[#FFB700]" size={32} />
                    </div>

                    {/* FOOTER CONTENT */}
                    <div className="pt-12 pb-6 px-6 text-center bg-[#222] rounded-b-xl border-t border-transparent flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-2 font-serif">{pkg.name}</h3>
                        <p className="text-[#FFB700] text-xs md:text-sm font-medium uppercase tracking-widest mb-4">
                          {pkg.price}
                        </p>
                      </div>
                      <div className="flex justify-center">
                         <button className="text-white border border-white/20 bg-white/5 px-6 py-2 md:px-8 md:py-3 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-[#FFB700] hover:text-black hover:border-[#FFB700] transition-all duration-300">
                          View Details
                        </button>
                      </div>
                    </div>

                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* CUSTOM NAVIGATION ARROWS */}
          <button className="pkg-prev absolute top-1/2 -translate-y-1/2 left-0 z-30 w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-[#FFB700] hover:text-black transition-all text-white hidden md:flex border border-white/10">
            <ChevronLeft size={24} />
          </button>
          <button className="pkg-next absolute top-1/2 -translate-y-1/2 right-0 z-30 w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-[#FFB700] hover:text-black transition-all text-white hidden md:flex border border-white/10">
            <ChevronRight size={24} />
          </button>

        </div>

      </div>
    </section>
  );
}