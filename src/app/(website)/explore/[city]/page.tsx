'use client';

export const dynamic = 'force-dynamic';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Thermometer, CloudRain, Tent, Car, Bus, CarFront, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';

// Data & Types
import { CITIES_DATA } from '@/data/cities';
import { CityPackage } from '@/types';

// NEW IMPORTS FOR PACKAGES
import PackageList from '@/components/explore/PackageList';
import { getAdminExplorePackages } from '@/app/actions/adminExploreActions';

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

export default function ExploreCityPage() {
  const params = useParams();
  const citySlug = (params.city as string).toLowerCase();
  const data = CITIES_DATA[citySlug];

  // STATE FOR DYNAMIC PACKAGES
  const [cityPackages, setCityPackages] = useState<CityPackage[]>([]);
  const [isLoadingPackages, setIsLoadingPackages] = useState(true);

  // FETCH PACKAGES ON LOAD
  useEffect(() => {
    async function loadPackages() {
      try {
        // Fetch all packages using the available action
        const response = await getAdminExplorePackages();
        
        if (response.success && response.data) {
          // Filter to ensure only packages for this specific city are displayed and format properly
          const filteredPackages: CityPackage[] = response.data
            .filter((pkg: any) => pkg.citySlug?.toLowerCase() === citySlug)
            .map((pkg: any) => ({
              id: pkg.id,
              title: pkg.title,
              durationDays: pkg.durationDays,
              description: pkg.description,
              destinations: pkg.destinations || [],
              includes: pkg.includes || [],
              citySlug: pkg.citySlug,
              vehicleOptions: (pkg.vehicleOptions || []).map((opt: any) => ({
                id: opt.vehicle?.id || opt.vehicleId || String(opt.id || Math.random()),
                name: opt.vehicle?.name || 'Standard Vehicle',
                basePrice: opt.basePrice,
                capacity: opt.vehicle?.capacity || 4,
              })),
            }));
          setCityPackages(filteredPackages);
        }
      } catch (error) {
        console.error("Failed to fetch packages", error);
      } finally {
        setIsLoadingPackages(false);
      }
    }
    
    if (citySlug) {
      loadPackages();
    }
  }, [citySlug]);

  // Fallback
  if (!data) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center">
        <h1 className="text-4xl text-[#F9C344] font-serif mb-4">City Not Found</h1>
        <p className="text-gray-400 mb-6">We could not find data for "{citySlug}"</p>
        <Link href="/explore" className="px-6 py-2 bg-white text-black rounded hover:bg-[#F9C344] transition">
          Back to Explore
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans pb-20">

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
          <h1 className="text-5xl md:text-7xl font-bold text-[#F9C344] font-serif mb-6 drop-shadow-2xl">
            {data.heroTitle}
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed font-medium">
            {data.heroSubtitle}
          </p>
        </div>
      </div>

      <main className="max-w-[1200px] mx-auto px-4 md:px-8 py-16 w-full space-y-24">
        
        {/* =========================================
            BREADCRUMB & NAV LINKS
        ========================================= */}
        <div className="flex justify-center gap-6 text-xs md:text-sm text-[#F9C344] border-b border-white/10 pb-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
           {[`About ${data.name}`, `Things To Do In ${data.name}`, 'Guided Tours & Experiences', `Complete Guide To ${data.name}`].map((item, idx) => (
             <React.Fragment key={item}>
               <span className="cursor-pointer hover:text-white transition-colors capitalize font-medium">
                 {item}
               </span>
               {idx !== 3 && <span className="text-gray-600">|</span>}
             </React.Fragment>
           ))}
        </div>

        {/* =========================================
            ABOUT SECTION (Full Width)
        ========================================= */}
        <section className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-[#F9C344]">
              About {data.name}
            </h2>
            <p className="text-gray-200 leading-relaxed text-sm md:text-base max-w-5xl">
              {data.aboutText}
            </p>
        </section>

        {/* =========================================
            THINGS TO DO SLIDER
        ========================================= */}
        <section>
            <div className="flex justify-between items-end mb-8">
               <h2 className="text-3xl md:text-4xl font-bold text-[#F9C344]">Things To Do In {data.name}</h2>
               
               {/* Nav Buttons */}
               <div className="flex gap-2">
                  <button className="todo-prev w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#F9C344] hover:text-black transition-all">
                     <ChevronLeft size={20} />
                  </button>
                  <button className="todo-next w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#F9C344] hover:text-black transition-all">
                     <ChevronRightIcon size={20} />
                  </button>
               </div>
            </div>

            <Swiper
                 modules={[Navigation, Autoplay]}
                 spaceBetween={20}
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
                 {data.thingsToDo.map((item: any, idx: number) => (
                    <SwiperSlide key={idx}>
                       <div className="group relative h-[250px] rounded-lg overflow-hidden cursor-pointer">
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
                          <div className="absolute bottom-4 left-4 right-4 text-center">
                             <h4 className="text-sm font-bold text-white group-hover:text-[#F9C344] transition-colors leading-tight">
                               {item.title}
                             </h4>
                          </div>
                       </div>
                    </SwiperSlide>
                 ))}
            </Swiper>
        </section>

        {/* =========================================
            COMPLETE GUIDE SECTION (3 Columns)
        ========================================= */}
        <section>
            <h2 className="text-3xl md:text-4xl font-bold text-[#F9C344] mb-8">Complete Guide To {data.name}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Weather Column */}
              <div className="bg-[#151515] p-6 rounded-xl border border-white/5">
                 <h3 className="text-[#F9C344] font-bold text-lg mb-6">Weather</h3>
                 <div className="space-y-4">
                    {Object.entries(data.weather).map(([season, temp]) => (
                       <div key={season} className="flex justify-between items-center text-sm">
                          <span className="text-white capitalize font-medium">{season}</span>
                          <span className="text-[#F9C344] font-bold text-xs bg-[#F9C344]/10 px-2 py-1 rounded">
                             <Thermometer size={12} className="inline mr-1" />
                             {temp as string}
                          </span>
                       </div>
                    ))}
                 </div>
              </div>

              {/* Best Time To Visit Column */}
              <div className="bg-[#151515] p-6 rounded-xl border border-white/5">
                 <h3 className="text-[#F9C344] font-bold text-lg mb-6">Best Time To Visit</h3>
                 <div className="space-y-6">
                    {data.bestTime.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-start gap-4">
                          <div className="text-[#F9C344] mt-1">
                             {item.icon === 'cloud-rain' ? <CloudRain size={20} /> : <Tent size={20} />}
                          </div>
                          <div>
                             <h4 className="text-white font-bold text-sm">{item.title}</h4>
                             <p className="text-gray-400 text-xs mt-1">{item.months}</p>
                          </div>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Transportation Column */}
              <div className="bg-[#151515] p-6 rounded-xl border border-white/5">
                 <h3 className="text-[#F9C344] font-bold text-lg mb-6">Transportation</h3>
                 <div className="space-y-4">
                    {data.transportation.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-4">
                          <div className="text-[#F9C344]">
                             {item.icon === 'car' ? <Car size={20} /> : item.icon === 'bus' ? <Bus size={20} /> : <CarFront size={20} />}
                          </div>
                          <h4 className="text-white font-bold text-sm">{item.title}</h4>
                      </div>
                    ))}
                 </div>
              </div>

            </div>
        </section>

        {/* =========================================
            DYNAMIC PACKAGES SECTION (AT THE BOTTOM)
        ========================================= */}
        {!isLoadingPackages && cityPackages.length > 0 && (
          <section id="packages" className="pt-8 border-t border-white/10">
            <div className="mb-10">
              <h2 className="text-[#F9C344] uppercase tracking-widest text-xs font-bold mb-2">Curated Experiences</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">Exclusive {data.name} Packages</h3>
              <p className="text-gray-400 text-sm max-w-2xl">Select a package and choose your preferred vehicle. Pricing updates automatically based on your selection.</p>
            </div>
            
            <PackageList packages={cityPackages} />
          </section>
        )}

      </main>
    </div>
  );
}