'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { SITE_CONFIG } from '@/data/siteConfig';

interface HeroSectionProps {
  scrollToNext: () => void;
}

export default function HeroSection({ scrollToNext }: HeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error("Autoplay prevented:", error);
      });
    }
  }, []);

  return (
    <section id="section-1" className="snap-section h-screen w-full relative flex items-end justify-center overflow-hidden snap-start">
      
      {/* 1. BACKGROUND VIDEO */}
      {!videoError && (
        <video 
          ref={videoRef}
          autoPlay 
          loop 
          muted 
          playsInline 
          preload="auto"
          className="absolute top-0 left-0 w-full h-full object-cover z-0" 
          onError={() => setVideoError(true)}
        >
          <source src={SITE_CONFIG.hero.videoUrl} type="video/mp4" />
        </video>
      )}

      {/* Fallback if video fails */}
      {videoError && (
        <div className="absolute top-0 left-0 w-full h-full bg-neutral-900 z-0 flex items-center justify-center">
          <span className="text-white/20 text-sm">Video not found</span>
        </div>
      )}
      
      {/* 2. OVERLAYS */}
      <div className="absolute inset-0 bg-black/40 z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50 z-10" />

      {/* 3. CALLIGRAPHY (Responsive Position) */}
      <div className="absolute top-[15%] md:top-[18%] left-1/2 transform -translate-x-1/2 z-20 w-[140px] md:w-[180px] lg:w-[280px] opacity-90 animate-fade-in">
         <img 
           src={SITE_CONFIG.hero.calligraphy} 
           alt="Makkah Calligraphy" 
           className="w-full h-auto drop-shadow-xl" 
         />
      </div>

      {/* 4. MAIN CONTENT */}
      {/* Mobile: pt-32 pushes content down. Desktop: pb-16 aligns bottom. */}
      <div className="relative z-20 w-full px-6 md:px-12 lg:px-16 h-full flex flex-col lg:flex-row items-center lg:items-end justify-center lg:justify-between pt-32 pb-20 lg:pb-16 text-center lg:text-left">
        
        {/* Left Side: Text */}
        <div className="w-full lg:w-1/2 space-y-3 md:space-y-4">
          
          {/* Subtitle */}
          <h3 className="text-[#F9C344] font-serif text-lg md:text-xl lg:text-2xl tracking-[0.15em] font-light">
            {SITE_CONFIG.hero.subtitle}
          </h3>
          
          {/* Main Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-sans font-bold leading-tight text-white drop-shadow-lg mx-auto lg:mx-0 max-w-lg lg:max-w-2xl">
            {SITE_CONFIG.hero.title}
          </h1>
          
          {/* Quote Block */}
          <div className="border-l-2 border-[#F9C344] pl-4 max-w-md md:max-w-lg mt-2 mx-auto lg:mx-0 text-left">
            <p className="text-gray-300 text-xs md:text-sm leading-relaxed italic font-light opacity-90">
              "{SITE_CONFIG.hero.quote}"
            </p>
            <span className="text-[#F9C344] text-[10px] md:text-xs font-bold block mt-1 tracking-widest uppercase">
              {SITE_CONFIG.hero.quoteSource}
            </span>
          </div>

          <div className="pt-6">
            <button className="bg-[#F9C344] text-black px-6 py-3 md:px-8 md:py-3.5 rounded-full font-bold text-xs md:text-sm uppercase tracking-widest hover:bg-white hover:scale-105 transition-all duration-300 shadow-lg">
              Find Hotel In Makkah
            </button>
          </div>
        </div>

        {/* Right Side: Pilgrims Image (Hidden on very small mobile to save space, visible on tablet+) */}
        <div className="hidden md:block w-[40%] lg:w-[35%] relative pointer-events-none mt-8 lg:mt-0">
           <img 
             src={SITE_CONFIG.hero.image} 
             alt="Pilgrims" 
             className="w-full h-auto object-contain drop-shadow-2xl transform translate-y-4 lg:translate-y-8" 
           />
        </div>

      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce cursor-pointer z-30" onClick={scrollToNext}>
        <ChevronDown className="text-[#F9C344]" size={24} />
      </div>

    </section>
  );
}