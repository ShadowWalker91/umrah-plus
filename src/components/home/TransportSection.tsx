'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, Calendar, Clock, Search, Bus } from 'lucide-react';
import { SITE_CONFIG } from '@/data/siteConfig';

export default function TransportSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);

  // State for Inputs & Data
  const [locations, setLocations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [showPickupList, setShowPickupList] = useState(false);
  const [showDropoffList, setShowDropoffList] = useState(false);

  // 1. FETCH LOCATIONS
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        // SIMULATED API DATA
        await new Promise(resolve => setTimeout(resolve, 1000));
        const data = [
          "Jeddah International Airport (KAIA)",
          "Madinah Airport",
          "Makkah Clock Tower Hotel",
          "Al Masjid Al Haram",
          "Masjid Al Nabawi",
          "Riyadh City Center",
          "Jeddah Corniche",
          "Taif Resort",
          "Makkah Train Station"
        ];
        
        setLocations(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, []);

  // Video Autoplay Fix
  useEffect(() => {
    const playVideo = async () => {
      if (videoRef.current) {
        try {
          await videoRef.current.play();
        } catch (error: any) {
          if (error.name !== 'AbortError') console.error("Video autoplay prevented:", error);
        }
      }
    };
    playVideo();
  }, []);

  // Filter locations based on input
  const getSuggestions = (query: string) => {
    if (!query) return locations;
    return locations.filter(loc => 
      loc.toLowerCase().includes(query.toLowerCase())
    );
  };

  // Helper to render dropdown item
  const renderDropdownItem = (loc: string, type: 'pickup' | 'dropoff') => {
    const isSelectedInOther = type === 'pickup' ? (loc === dropoff) : (loc === pickup);

    return (
      <div 
        key={loc} 
        onClick={() => {
          if (!isSelectedInOther) {
            if (type === 'pickup') setPickup(loc);
            else setDropoff(loc);
          }
        }} 
        className={`px-4 py-2 text-sm transition flex justify-between items-center ${
          isSelectedInOther 
            ? 'opacity-40 cursor-not-allowed bg-white/5' 
            : 'cursor-pointer hover:bg-[#F9C344] hover:text-black text-gray-300'
        }`}
      >
        <span>{loc}</span>
        {isSelectedInOther && <span className="text-[10px] uppercase font-bold tracking-wider">Selected</span>}
      </div>
    );
  };

  return (
    <section id="section-4" className="snap-section h-screen w-full relative flex items-center justify-center overflow-hidden snap-start bg-zinc-900">
      
      {/* 1. BACKGROUND VIDEO */}
      {!videoError && (
        <video 
          ref={videoRef}
          autoPlay 
          loop 
          muted 
          playsInline 
          preload="auto"
          className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-40"
          onError={() => setVideoError(true)}
        >
          <source src={SITE_CONFIG.transportation.videoUrl} type="video/mp4" />
        </video>
      )}

      {/* Overlays */}
      <div className="absolute inset-0 bg-black/60 z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80 z-10" />

      {/* 2. MAIN CONTENT */}
      {/* ADDED: pt-32 md:pt-40 to prevent overlap with sticky menu */}
      <div className="relative z-20 w-full px-6 lg:px-12 h-full flex flex-col justify-center pt-32 md:pt-40 pb-12">
        
        {/* HEADER TEXT - No Subtitle, Yellow Title, White Description */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-[#F9C344] text-3xl md:text-5xl lg:text-6xl font-sans font-bold mt-2 drop-shadow-xl">
            {SITE_CONFIG.transportation.title}
          </h2>
          <p className="text-white mt-4 max-w-2xl mx-auto text-sm md:text-base font-light opacity-90 leading-relaxed">
            {SITE_CONFIG.transportation.description}
          </p>
        </div>

        {/* CONTENT GRID */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center max-w-7xl mx-auto w-full flex-1">
          
          {/* LEFT: CAR IMAGE */}
          <div className="hidden lg:block relative h-[500px] w-full animate-fade-in-up">
            <img 
              src={SITE_CONFIG.transportation.image} 
              alt="Luxury Fleet" 
              className="w-full h-full object-contain drop-shadow-[0_0_25px_rgba(255,255,255,0.15)]" 
            />
          </div>

          {/* RIGHT: BOOKING FORM */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-lg mx-auto lg:mx-0">
            <h3 className="text-2xl font-bold mb-6 text-white font-serif flex items-center gap-2">
              Book Your Ride <span className="text-[#F9C344] text-sm font-sans font-normal tracking-wide bg-[#F9C344]/10 px-2 py-1 rounded">Best Rates</span>
            </h3>
            
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              
              {/* PICKUP INPUT */}
              <div className="relative">
                <label className="text-xs uppercase text-gray-400 flex items-center gap-2 mb-1.5 font-bold tracking-wider">
                  <MapPin size={12} className="text-[#F9C344]"/> Pickup Location
                </label>
                <input 
                  type="text" 
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  onFocus={() => setShowPickupList(true)}
                  onBlur={() => setTimeout(() => setShowPickupList(false), 200)}
                  placeholder="e.g. Makkah Hotel" 
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-3.5 text-white focus:border-[#F9C344] focus:ring-1 focus:ring-[#F9C344] outline-none transition text-sm placeholder:text-gray-600" 
                />
                
                {/* Pickup Suggestions */}
                {showPickupList && (
                  <div className="absolute z-50 top-full left-0 w-full bg-[#1a1a1a] border border-white/10 rounded-lg mt-1 shadow-xl max-h-48 overflow-y-auto">
                    {isLoading ? (
                      <div className="px-4 py-3 text-gray-500 text-sm">Loading locations...</div>
                    ) : (
                      getSuggestions(pickup).map((loc) => renderDropdownItem(loc, 'pickup'))
                    )}
                  </div>
                )}
              </div>

              {/* DROPOFF INPUT */}
              <div className="relative">
                <label className="text-xs uppercase text-gray-400 flex items-center gap-2 mb-1.5 font-bold tracking-wider">
                  <MapPin size={12} className="text-[#F9C344]"/> Dropoff Location
                </label>
                <input 
                  type="text" 
                  value={dropoff}
                  onChange={(e) => setDropoff(e.target.value)}
                  onFocus={() => setShowDropoffList(true)}
                  onBlur={() => setTimeout(() => setShowDropoffList(false), 200)}
                  placeholder="e.g. Jeddah Airport" 
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-3.5 text-white focus:border-[#F9C344] focus:ring-1 focus:ring-[#F9C344] outline-none transition text-sm placeholder:text-gray-600" 
                />
                
                {/* Dropoff Suggestions */}
                {showDropoffList && (
                  <div className="absolute z-50 top-full left-0 w-full bg-[#1a1a1a] border border-white/10 rounded-lg mt-1 shadow-xl max-h-48 overflow-y-auto">
                    {isLoading ? (
                      <div className="px-4 py-3 text-gray-500 text-sm">Loading locations...</div>
                    ) : (
                      getSuggestions(dropoff).map((loc) => renderDropdownItem(loc, 'dropoff'))
                    )}
                  </div>
                )}
              </div>

              {/* DATE & TIME GRID */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs uppercase text-gray-400 flex items-center gap-2 font-bold tracking-wider"><Calendar size={12} className="text-[#F9C344]"/> Date</label>
                  <input 
                    type="date" 
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-[#F9C344] outline-none transition text-sm [color-scheme:dark]" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs uppercase text-gray-400 flex items-center gap-2 font-bold tracking-wider"><Clock size={12} className="text-[#F9C344]"/> Time</label>
                  <input 
                    type="time" 
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-[#F9C344] outline-none transition text-sm [color-scheme:dark]" 
                  />
                </div>
              </div>

              <button className="w-full bg-[#F9C344] text-black font-bold py-4 rounded-lg hover:bg-white hover:scale-[1.02] transition-all mt-2 shadow-lg uppercase tracking-wide text-sm flex items-center justify-center gap-2">
                <Search size={18} /> Book Best Price & Vehicle
              </button>

            </form>
          </div>

        </div>

        {/* BOTTOM PACKAGE BUTTONS */}
        <div className="flex flex-col md:flex-row gap-4 justify-center mt-8 md:mt-12 w-full max-w-2xl mx-auto">
          <button className="flex-1 bg-[#F9C344] text-black font-bold py-4 px-6 rounded-lg hover:bg-white hover:scale-[1.02] transition-all shadow-lg uppercase tracking-wide text-sm flex items-center justify-center gap-2">
            <Calendar size={18} /> Flexible Umrah Packages
          </button>
          <button className="flex-1 bg-[#F9C344] text-black font-bold py-4 px-6 rounded-lg hover:bg-white hover:scale-[1.02] transition-all shadow-lg uppercase tracking-wide text-sm flex items-center justify-center gap-2">
            <Bus size={18} /> Fixed Transport Packages
          </button>
        </div>
      </div>
    </section>
  );
}