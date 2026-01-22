'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home, ArrowRight, ChevronLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ZIYARAT_DETAILS, ZIYARAT_CITIES_SUMMARY } from '@/data/ziyarat';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

export default function CityZiyaratPage() {
  const params = useParams();
  
  // 1. LOAD MORE STATE
  const [visibleCount, setVisibleCount] = useState(6);

  // 2. PARSE URL PARAM
  const rawCityParam = (params.city as string).toLowerCase();
  const cityKey = rawCityParam.replace('-ziyarat', '');

  // 3. FETCH DATA
  const cityData = ZIYARAT_DETAILS[cityKey as keyof typeof ZIYARAT_DETAILS];

  // 4. FALLBACK
  if (!cityData) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <h1 className="text-4xl text-[#F9C344] font-serif mb-4">City Not Found</h1>
          <p className="text-gray-400 mb-6">We could not find ziyarat data for {rawCityParam}.</p>
          <Link href="/ziyarat" className="px-6 py-2 bg-white text-black rounded hover:bg-[#F9C344] transition">
            Back to Ziyarat Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // 5. SLIDER DATA
  const otherCities = ZIYARAT_CITIES_SUMMARY.filter(c => c.slug !== cityKey);

  // 6. LOAD MORE HANDLER
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  // 7. GET VISIBLE SPOTS
  const visibleSpots = cityData.spots.slice(0, visibleCount);
  const hasMore = visibleCount < cityData.spots.length;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans">
      <Header />

      {/* BANNER SECTION */}
      <div className="relative h-[50vh] w-full flex items-center justify-center bg-black overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: `url(${cityData.bannerImage})` }}
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 text-center px-4 pt-20">
          <h1 className="text-4xl md:text-6xl font-bold text-[#F9C344] font-serif mb-4 drop-shadow-lg uppercase tracking-wide">
            {cityData.title}
          </h1>
          
          <div className="flex items-center justify-center gap-2 text-sm md:text-base text-gray-300 font-medium uppercase tracking-wider">
            <Link href="/" className="hover:text-[#F9C344] transition-colors flex items-center gap-1">
              <Home size={14} className="-mt-0.5" /> Home
            </Link>
            <ChevronRight size={14} className="text-[#F9C344]" />
            <Link href="/ziyarat" className="hover:text-[#F9C344] transition-colors">
              Ziyarat
            </Link>
            <ChevronRight size={14} className="text-[#F9C344]" />
            <span className="text-[#F9C344]">{cityData.title}</span>
          </div>
        </div>
      </div>

      {/* MAIN GRID SECTION */}
      <main className="flex-1 max-w-[1400px] mx-auto px-4 md:px-8 py-20 w-full">
        
        {/* Intro Text */}
        <div className="text-center mb-16">
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            {cityData.description}
          </p>
          <div className="w-24 h-1 bg-[#F9C344] mx-auto mt-6 rounded-full" />
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {visibleSpots.map((spot, index) => (
            <div 
              key={index}
              className="group relative h-[500px] rounded-2xl overflow-hidden shadow-lg border border-white/5 cursor-pointer"
            >
              {/* Full Height Image */}
              <img 
                src={spot.img} 
                alt={spot.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90" />
              
              {/* Floating Content at Bottom */}
              <div className="absolute bottom-6 left-6 right-6 z-20">
                <div className="bg-black/80 backdrop-blur-sm border border-white/10 rounded-lg p-5 shadow-2xl">
                  
                  <div className="text-white text-xs font-bold uppercase tracking-widest mb-1 opacity-90">
                    {spot.code}
                  </div>

                  <div className="flex justify-between items-end gap-4">
                    <h3 className="text-xl md:text-2xl font-serif font-bold text-[#F9C344] leading-tight">
                      {spot.name}
                    </h3>
                    
                    <div className="w-10 h-10 rounded-full bg-[#F9C344] flex items-center justify-center text-black shadow-lg transform transition-transform duration-300 group-hover:-rotate-45 shrink-0">
                      <ArrowRight size={18} strokeWidth={2.5} />
                    </div>
                  </div>

                </div>
              </div>

              {/* Clickable Link */}
              <Link 
                 href={`/ziyarat/${rawCityParam}/${spot.slug}`} 
                 className="absolute inset-0 z-30" 
                 aria-label={`View details for ${spot.name}`} 
              />
            </div>
          ))}

          {/* ============================================================== */}
          {/* COMING SOON CARD - Added Back as Requested                     */}
          {/* ============================================================== */}
          {!hasMore && (
            <div className="relative h-[500px] rounded-2xl overflow-hidden border border-white/5 flex flex-col items-center justify-center text-center p-8">
              <div className="absolute inset-0 bg-white/5 backdrop-blur-md transition-colors duration-300 hover:bg-white/10" />
              <div className="relative z-10 space-y-4">
                <div className="w-16 h-16 bg-[#F9C344]/20 rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse">
                  <span className="text-[#F9C344] text-2xl font-bold">...</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-white">
                  More Ziyarat<br />
                  <span className="text-[#F9C344]">Coming Soon</span>
                </h3>
                <p className="text-gray-400 text-sm tracking-widest uppercase font-bold border-t border-white/10 pt-4 mt-2 inline-block">
                  Stay In Touch!
                </p>
              </div>
            </div>
          )}

        </div>

        {/* LOAD MORE BUTTON */}
        {hasMore && (
          <div className="flex justify-center mt-20">
            <button 
              onClick={handleLoadMore}
              className="text-[#F9C344] text-lg font-bold uppercase tracking-widest border-b-2 border-[#F9C344] pb-1 hover:text-white hover:border-white transition-all duration-300"
            >
              Load More
            </button>
          </div>
        )}

      </main>

      {/* EXPLORE OTHER CITIES */}
      <section className="bg-[#111] py-16 border-t border-b border-white/5 relative z-10">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-[#F9C344] uppercase tracking-widest text-sm font-bold mb-2">Explore More</h2>
              <h3 className="text-3xl md:text-4xl font-serif font-bold text-white">Other Ziyarat Destinations</h3>
            </div>
            
            <div className="flex gap-2">
              <button className="other-prev w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-[#F9C344] hover:text-black hover:border-[#F9C344] transition-all">
                <ChevronLeft size={20} />
              </button>
              <button className="other-next w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-[#F9C344] hover:text-black hover:border-[#F9C344] transition-all">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={30}
            loop={true}
            navigation={{
              nextEl: '.other-next',
              prevEl: '.other-prev',
            }}
            breakpoints={{
              320: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="w-full"
          >
            {otherCities.map((city, idx) => (
              <SwiperSlide key={idx}>
                <Link href={city.link} className="block group relative h-[350px] rounded-xl overflow-hidden cursor-pointer shadow-lg border border-white/5 bg-black">
                  <img 
                    src={city.img} 
                    alt={city.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500" />
                  <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black to-transparent">
                    <h4 className="text-2xl font-serif font-bold text-white mb-1">{city.name}</h4>
                    <span className="text-[#F9C344] text-sm uppercase tracking-wider group-hover:translate-x-2 transition-transform inline-block duration-300">
                      Explore Ziyarat &rarr;
                    </span>
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