'use client';

import { useEffect, useRef, useState } from 'react';
import { SITE_CONFIG } from '@/data/siteConfig';

export default function ZiyaratSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    // Helper function to handle play request safely
    const playVideo = async () => {
      if (videoRef.current) {
        try {
          await videoRef.current.play();
        } catch (error: any) {
          // Ignore 'AbortError' which happens when browser pauses background video to save power
          if (error.name !== 'AbortError') {
            console.error("Ziyarat video autoplay prevented:", error);
          }
        }
      }
    };

    playVideo();
  }, []);

  return (
    <section id="section-3" className="snap-section h-screen w-full relative flex items-end justify-center overflow-hidden snap-start">
      
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
          <source src={SITE_CONFIG.ziyarat.videoUrl} type="video/mp4" />
        </video>
      )}

      {/* Fallback */}
      {videoError && (
        <div className="absolute top-0 left-0 w-full h-full bg-neutral-900 z-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/80" />
        </div>
      )}
      
      {/* 2. OVERLAYS */}
      <div className="absolute inset-0 bg-black/50 z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50 z-10" />

      {/* 3. CALLIGRAPHY (Top Center) */}
      <div className="absolute top-[15%] md:top-[18%] left-1/2 transform -translate-x-1/2 z-20 w-[140px] md:w-[180px] lg:w-[280px] opacity-90 animate-fade-in">
         {SITE_CONFIG.ziyarat.calligraphy && (
           <img 
             src={SITE_CONFIG.ziyarat.calligraphy} 
             alt="Ziyarat Calligraphy" 
             className="w-full h-auto drop-shadow-xl" 
           />
         )}
      </div>

      {/* 4. MAIN CONTENT */}
      {/* Layout: Text Left, Right side empty */}
      <div className="relative z-20 w-full px-6 md:px-12 lg:px-16 h-full flex flex-col lg:flex-row items-center lg:items-end justify-center lg:justify-start pt-32 pb-20 lg:pb-16 text-center lg:text-left">
        
        {/* Left Side: Text Content */}
        <div className="w-full lg:w-1/2 space-y-3 md:space-y-4">
          
          {/* Subtitle */}
          <h3 className="text-[#F9C344] font-serif text-lg md:text-xl lg:text-2xl tracking-[0.15em] font-light">
            {SITE_CONFIG.ziyarat.subtitle}
          </h3>
          
          {/* Main Title */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-sans font-bold leading-tight text-white drop-shadow-lg mx-auto lg:mx-0 max-w-lg lg:max-w-2xl">
            {SITE_CONFIG.ziyarat.title}
          </h2>
          
          {/* Description Block */}
          <div className="border-l-2 border-[#F9C344] pl-4 max-w-md md:max-w-lg mt-2 mx-auto lg:mx-0 text-left">
            <p className="text-gray-300 text-xs md:text-sm leading-relaxed italic font-light opacity-90">
              "{SITE_CONFIG.ziyarat.description}"
            </p>
            <span className="text-[#F9C344] text-[10px] md:text-xs font-bold block mt-1 tracking-widest uppercase">
              (Sunan Ibn Majah 2791)
            </span>
          </div>

          <div className="pt-6">
            <button className="bg-[#F9C344] text-black px-6 py-3 md:px-8 md:py-3.5 rounded-full font-bold text-xs md:text-sm uppercase tracking-widest hover:bg-white hover:scale-105 transition-all duration-300 shadow-lg">
              Find Ziyarat Place
            </button>
          </div>
        </div>

        {/* RIGHT SIDE EMPTY */}

      </div>
    </section>
  );
}