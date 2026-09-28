'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { SITE_CONFIG } from '@/data/siteConfig';
import SearchWidget from '@/components/SearchWidget';

interface HeroSectionProps {
  scrollToNext: () => void;
}

export default function HeroSection({ scrollToNext }: HeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const playVideo = async () => {
      if (videoRef.current) {
        try {
          await videoRef.current.play();
        } catch (error: any) {
          // Ignore AbortError / NotAllowedError caused when browser pauses background media to save power or before user gesture
          if (error.name !== 'AbortError' && error.name !== 'NotAllowedError') {
            console.error("Hero video autoplay prevented:", error);
          }
        }
      }
    };

    playVideo();
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
      {/* Responsive layout: on mobile sits in bottom third; on tablet centered with safe right clearance; on desktop aligns bottom-left lifted upward */}
      <div className="relative z-20 w-full pl-5 pr-14 sm:pl-8 sm:pr-16 md:pl-10 md:pr-18 lg:px-16 h-full flex flex-col lg:flex-row items-center lg:items-end justify-end lg:justify-between pb-20 sm:pb-24 md:pb-28 lg:pb-28 xl:pb-32 text-center lg:text-left">
        
        {/* Left Side: Booking Widget */}
        <div className="relative z-30 w-full max-w-6xl mx-auto shrink-0 mt-10 md:mt-32 lg:mt-52 flex justify-center lg:justify-start">
          <SearchWidget />
        </div>

        {/* Right Side: Pilgrims Image (Visible on lg+ desktop to keep mobile and tablet focused and uncluttered) */}
        <div className="hidden lg:block w-[38%] xl:w-[35%] relative pointer-events-none self-end">
           <img 
             src={SITE_CONFIG.hero.image} 
             alt="Pilgrims" 
             className="w-full h-auto object-contain drop-shadow-2xl transform translate-y-6 xl:translate-y-8" 
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