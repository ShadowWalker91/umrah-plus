'use client';

import React, { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Plus, Minus, Compass, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import { EXPLORE_DATA } from '@/data/explore';

// Google Maps Imports
import { GoogleMap, useJsApiLoader, MarkerF, Polygon, OverlayView } from '@react-google-maps/api';

// Swiper Imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation as SwiperNavigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

// --- MAP CONFIG ---
const containerStyle = {
  width: '100%',
  height: '100%',
  backgroundColor: '#c9ecf5',
};

const center = {
  lat: 23.5, 
  lng: 45.0,
};

// ** Boundary Highlight Style (Yellow Stroke, No Fill) **
const polygonOptions = {
  strokeColor: "#F9C344", 
  strokeOpacity: 1,       
  strokeWeight: 2,        
  fillColor: "#F9C344",
  fillOpacity: 0.0, // Transparent fill
  clickable: true,  // Must be true to detect mouse leaving the polygon
  draggable: false,
  editable: false,
  visible: true,
  zIndex: 1,
};

export default function ExploreSaudiMapPage() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    // ⚠️ REAL API KEY
    googleMapsApiKey: "AIzaSyBjohiiBsNN-D6xU8YUqnzyca0bIySAuGo" 
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  
  // Track hovered region
  const [activeRegion, setActiveRegion] = useState<string | null>(null);

  // --- MAP HANDLERS ---
  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  // Controls
  const handleZoomIn = () => {
    if (mapRef.current) mapRef.current.setZoom((mapRef.current.getZoom() || 0) + 0.5);
  };

  const handleZoomOut = () => {
    if (mapRef.current) mapRef.current.setZoom((mapRef.current.getZoom() || 0) - 0.5);
  };

  const handleReset = () => {
    if (mapRef.current) {
      mapRef.current.panTo(center);
      mapRef.current.setZoom(5.5);
      setActiveRegion(null);
    }
  };

  // Hover Logic (Tracks Region, not just City ID)
  const handleHoverStart = (region: string) => setActiveRegion(region);
  const handleHoverEnd = () => setActiveRegion(null);

  if (!isLoaded) return <div className="h-screen w-full flex items-center justify-center bg-black text-white">Loading Map...</div>;

  return (
    <div className="relative h-screen w-screen bg-[#e5e3df] overflow-hidden font-sans">
      
      {/* 1. HEADER - Forced Black Background */}
      <div className="absolute top-0 left-0 w-full z-50 bg-black border-b border-white/10 shadow-lg">
         <Header />
      </div>

      {/* 2. GOOGLE MAP */}
      <div className="absolute inset-0 z-0 top-[0px]"> 
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={5.5} 
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            disableDefaultUI: true,
            styles: EXPLORE_DATA.mapStyles,
            minZoom: 4,
            maxZoom: 10,
            scrollwheel: true,
            gestureHandling: "greedy",
            mapTypeControl: false,
            streetViewControl: false,
          }}
        >
          {/* RENDER REGION BOUNDARIES (Only if active) */}
          {activeRegion && EXPLORE_DATA.regions[activeRegion as keyof typeof EXPLORE_DATA.regions] && (
              <Polygon
                paths={EXPLORE_DATA.regions[activeRegion as keyof typeof EXPLORE_DATA.regions]}
                options={polygonOptions}
                onMouseOut={handleHoverEnd} // IMPORTANT: Clear when leaving polygon
              />
          )}

          {/* RENDER PINS */}
          {EXPLORE_DATA.pins.map((pin) => (
            <React.Fragment key={pin.id}>
              
              {/* CITY PIN */}
              <MarkerF
                position={{ lat: pin.lat, lng: pin.lng }}
                icon={{
                  url: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/08/pin.png",
                  scaledSize: new window.google.maps.Size(30, 30), // Smaller Pins
                  anchor: new window.google.maps.Point(15, 15)
                }}
                onMouseOver={() => handleHoverStart(pin.region!)}
                onClick={() => window.location.href = `/explore/${pin.slug}`}
                zIndex={100}
              />

              {/* CUSTOM CITY LABEL (Only Saudi Cities) */}
              <OverlayView
                position={{ lat: pin.lat, lng: pin.lng }}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              >
                <div 
                  className="absolute left-1/2 transform -translate-x-1/2 mt-5 pointer-events-none whitespace-nowrap"
                  style={{ textShadow: '0px 1px 3px rgba(255,255,255,0.9)' }}
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-black">
                    {pin.city}
                  </span>
                </div>
              </OverlayView>

            </React.Fragment>
          ))}
        </GoogleMap>
      </div>

      {/* 3. FLOATING CONTROLS */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3">
         <div className="bg-white/90 backdrop-blur rounded-xl shadow-2xl border border-white/20 overflow-hidden">
            <button onClick={handleZoomIn} className="p-3 hover:bg-gray-100 border-b border-gray-200 flex items-center justify-center text-black" title="Zoom In">
               <Plus size={20} />
            </button>
            <button onClick={handleZoomOut} className="p-3 hover:bg-gray-100 flex items-center justify-center text-black" title="Zoom Out">
               <Minus size={20} />
            </button>
         </div>
         <button onClick={handleReset} className="bg-white/90 backdrop-blur p-3 rounded-xl shadow-2xl border border-white/20 hover:bg-gray-100 text-black" title="Reset Map">
            <Compass size={20} />
         </button>
      </div>

      {/* 4. BOTTOM CAROUSEL */}
      <div className="absolute bottom-6 left-0 w-full z-40 px-4 md:px-8 pointer-events-none">
         <div className="pointer-events-auto">
             <Swiper
                modules={[SwiperNavigation, Autoplay]}
                spaceBetween={16}
                slidesPerView={1.2}
                centeredSlides={false}
                loop={true}
                autoplay={{
                  delay: 2000, // 2 Seconds Delay
                  disableOnInteraction: false,
                }}
                breakpoints={{
                   640: { slidesPerView: 2.2 },
                   1024: { slidesPerView: 4.5 },
                   1440: { slidesPerView: 5.5 },
                }}
                className="w-full !pb-2"
             >
                {EXPLORE_DATA.cities.map((city, idx) => {
                   return (
                     <SwiperSlide key={idx}>
                        <Link 
                           href={`/explore/${city.slug}`}
                           onMouseEnter={() => handleHoverStart(city.region!)}
                           onMouseLeave={handleHoverEnd}
                           className={`block relative h-[220px] rounded-xl overflow-hidden shadow-2xl transition-all duration-300 border-2 bg-[#1a1a1a] ${
                             activeRegion === city.region ? 'border-[#F9C344] scale-105 -translate-y-4 z-50' : 'border-white/10'
                           }`}
                        >
                           <img 
                              src={city.image} 
                              alt={city.name} 
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                           />
                           <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                           
                           <div className="absolute bottom-4 left-4 right-4">
                              <h3 className="text-xl font-serif font-bold text-white mb-1">{city.name}</h3>
                              <div className="flex items-center gap-1 text-[#F9C344] text-[10px] font-bold uppercase tracking-wider">
                                 Discover <ArrowRight size={12} />
                              </div>
                           </div>
                        </Link>
                     </SwiperSlide>
                   );
                })}
             </Swiper>
         </div>
      </div>
      
    </div>
  );
}