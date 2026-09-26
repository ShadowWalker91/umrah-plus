'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Clock, ArrowLeft, Info, Play, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ZIYARAT_DETAILS } from '@/data/ziyarat';
import { ZiyaratContent } from '@/data/ziyarat/content/index';

// Swiper Imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const formatCityName = (slug: string) => {
  return slug.replace('-ziyarat', '').charAt(0).toUpperCase() + slug.replace('-ziyarat', '').slice(1);
};

// ✅ HELPER: Convert YouTube URL to Embed URL
const getEmbedUrl = (url: string) => {
  if (!url) return '';
  
  try {
    // Handle standard watch URLs (youtube.com/watch?v=ID)
    if (url.includes('watch?v=')) {
      const videoId = url.split('watch?v=')[1].split('&')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    
    // Handle short URLs (youtu.be/ID)
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }

    // Already an embed URL? Just add autoplay
    if (url.includes('embed/')) {
       return url.includes('?') ? `${url}&autoplay=1` : `${url}?autoplay=1`;
    }
    
    return url;
  } catch (e) {
    return url;
  }
};

interface Props {
  data: ZiyaratContent;
  cityKey: string;
  rawCityParam: string;
}

export default function ZiyaratDetailClient({ data, cityKey, rawCityParam }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  
  const tabs = ['makkah', 'madinah', 'taif', 'tabuk'];
  const [activeTab, setActiveTab] = useState('makkah');

  // Lightbox Logic
  const closeLightbox = () => setLightboxIndex(null);
  const nextImage = useCallback(() => {
    if (data && lightboxIndex !== null) setLightboxIndex((prev) => (prev! + 1) % data.gallery.length);
  }, [data, lightboxIndex]);
  const prevImage = useCallback(() => {
    if (data && lightboxIndex !== null) setLightboxIndex((prev) => (prev! - 1 + data.gallery.length) % data.gallery.length);
  }, [data, lightboxIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, nextImage, prevImage]);

  const activeCityData = ZIYARAT_DETAILS[activeTab as keyof typeof ZIYARAT_DETAILS];
  const activeCitySpots = activeCityData?.spots || [];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans">
      <Header />

      {/* HERO BANNER */}
      <div className="relative h-[60vh] w-full flex items-center justify-center bg-black overflow-hidden -mt-[80px] pt-[80px]"> 
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${data.bannerImage})` }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <h2 
            className="text-4xl md:text-7xl text-white mb-4 leading-relaxed drop-shadow-lg" 
            style={{ fontFamily: "'Noto Nastaliq Urdu', serif", lineHeight: "1.8" }}
          >
            {data.urduTitle}
          </h2>

          <h1 className="text-3xl md:text-5xl font-bold text-[#F9C344] font-serif mb-6 drop-shadow-xl uppercase tracking-wide">
            {data.title}
          </h1>

          <div className="flex items-center justify-center gap-2 text-sm text-gray-300 font-medium uppercase tracking-wider flex-wrap">
            <Link href="/" className="hover:text-[#F9C344] transition-colors">Home</Link>
            <ChevronRight size={14} className="text-[#F9C344]" />
            <Link href="/ziyarat" className="hover:text-[#F9C344] transition-colors">Ziyarat</Link>
            <ChevronRight size={14} className="text-[#F9C344]" />
            <Link href={`/ziyarat/${rawCityParam}`} className="hover:text-[#F9C344] transition-colors">{formatCityName(cityKey)}</Link>
            <ChevronRight size={14} className="text-[#F9C344]" />
            <span className="text-white/60">{data.title}</span>
          </div>
        </div>
      </div>

      <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-16 w-full relative">
        <Link 
           href={`/ziyarat/${rawCityParam}`} 
           className="inline-flex items-center gap-2 text-gray-400 hover:text-[#F9C344] transition-colors mb-8 uppercase text-sm font-bold tracking-widest group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to List
        </Link>

        <div className="clearfix">
          {/* SIDEBAR */}
          <div className="w-full lg:float-right lg:w-[400px] lg:ml-12 mb-12 lg:mb-0 space-y-8 clear-both">
              {/* Video Section */}
              {data.videoUrl && (
               <div className="rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-black relative group">
                  <div className="relative pb-[56.25%] h-0">
                    {!isPlaying ? (
                      <div 
                         className="absolute top-0 left-0 w-full h-full cursor-pointer overflow-hidden"
                         onClick={() => setIsPlaying(true)}
                      >
                         <div 
                           className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                           style={{ backgroundImage: `url(${data.bannerImage})` }}
                         />
                         <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all" />
                         <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-20 h-14 bg-[#F9C344] rounded-xl flex items-center justify-center shadow-lg border border-white/20 hover:scale-110 transition-transform duration-300">
                              <Play className="text-white fill-white ml-1" size={28} />
                            </div>
                         </div>
                      </div>
                    ) : (
                      // ✅ UPDATED IFRAME SOURCE
                      <iframe 
                        src={getEmbedUrl(data.videoUrl)} 
                        title={data.title}
                        className="absolute top-0 left-0 w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    )}
                  </div>
               </div>
              )}

              {/* Gallery */}
              {data.gallery && data.gallery.length > 0 && (
                <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6 shadow-xl">
                  <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-widest flex items-center justify-between">
                    Gallery
                    <span className="text-xs text-gray-500 normal-case bg-white/5 px-2 py-1 rounded">{data.gallery.length} Images</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {data.gallery.map((img, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => setLightboxIndex(idx)}
                        className={`relative rounded-lg overflow-hidden group cursor-pointer border border-white/5 hover:border-[#F9C344] transition-all ${idx === 0 ? 'col-span-2 h-48' : 'h-32'}`}
                      >
                        <img src={img} alt={`${data.title} - ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>

          {/* LEFT CONTENT */}
          <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-8 shadow-xl mb-10 overflow-hidden">
             <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
               <Info className="text-[#F9C344]" size={24} />
               <h4 className="text-xl font-bold text-white uppercase tracking-widest">Site Information</h4>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
               <div className="flex items-start gap-4">
                 <div className="w-10 h-10 rounded-full bg-[#F9C344]/10 flex items-center justify-center text-[#F9C344] shrink-0 border border-[#F9C344]/20">
                   <MapPin size={20} />
                 </div>
                 <div>
                   <span className="block text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Location</span>
                   <span className="text-white text-sm font-medium">{data.location}</span>
                 </div>
               </div>
               <div className="flex items-start gap-4">
                 <div className="w-10 h-10 rounded-full bg-[#F9C344]/10 flex items-center justify-center text-[#F9C344] shrink-0 border border-[#F9C344]/20">
                   <Clock size={20} />
                 </div>
                 <div>
                   <span className="block text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Timings</span>
                   <span className="text-white text-sm font-medium">{data.timings}</span>
                 </div>
               </div>
             </div>
             <div className="border-t border-white/5 pt-6">
                 <h3 className="text-lg font-bold text-[#F9C344] mb-3 uppercase tracking-widest">About This Site</h3>
                 <p className="text-gray-300 leading-relaxed text-sm">{data.description}</p>
             </div>
          </div>

          {/* MARKDOWN CONTENT */}
          <div className="prose prose-invert max-w-none prose-headings:text-[#F9C344] prose-headings:font-serif prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6 prose-li:text-gray-300 prose-ul:my-6 prose-li:mb-2">
              <h3 className="text-3xl font-bold mb-6 border-l-4 border-[#F9C344] pl-4">Historical Significance</h3>
              <div dangerouslySetInnerHTML={{ __html: data.history }} />
          </div>
        </div>
      </main>

      {/* EXPLORE SECTION */}
      <section className="bg-[#111] py-20 border-t border-white/5">
         <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            <div className="text-center mb-12">
               <h2 className="text-[#F9C344] uppercase tracking-widest text-sm font-bold mb-2">Explore More</h2>
               <h3 className="text-4xl font-serif font-bold text-white">Discover Sacred Sites</h3>
            </div>

            <div className="flex justify-center flex-wrap gap-4 mb-12">
               {tabs.map((tab) => (
                 <button
                   key={tab}
                   onClick={() => setActiveTab(tab)}
                   className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 border ${
                     activeTab === tab 
                     ? 'bg-[#F9C344] text-black border-[#F9C344] shadow-lg scale-105' 
                     : 'bg-transparent text-gray-400 border-white/10 hover:border-white/50 hover:text-white'
                   }`}
                 >
                   {tab}
                 </button>
               ))}
            </div>

            <div className="relative min-h-[300px]">
               {activeCitySpots.length > 0 ? (
                 <>
                   <button className="tab-prev absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/10 bg-black/50 text-white flex items-center justify-center hover:bg-[#F9C344] hover:text-black z-10 transition-all">
                      <ChevronLeft size={20} />
                   </button>
                   <button className="tab-next absolute -right-4 md:-right-12 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/10 bg-black/50 text-white flex items-center justify-center hover:bg-[#F9C344] hover:text-black z-10 transition-all">
                      <ChevronRight size={20} />
                   </button>
                   <Swiper
                     modules={[Navigation, Autoplay]}
                     spaceBetween={24}
                     slidesPerView={1}
                     loop={true}
                     autoplay={{ delay: 3000, disableOnInteraction: false }}
                     navigation={{ nextEl: '.tab-next', prevEl: '.tab-prev' }}
                     breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
                     key={activeTab} 
                   >
                     {activeCitySpots.map((spot: any, idx: number) => (
                        <SwiperSlide key={idx}>
                           <Link 
                             href={`/ziyarat/${activeTab}-ziyarat/${spot.slug}`}
                             className="block group relative h-[300px] rounded-xl overflow-hidden cursor-pointer border border-white/10"
                           >
                              <img src={spot.img} alt={spot.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
                              <div className="absolute bottom-5 left-5 right-5">
                                 <div className="text-[#F9C344] text-[10px] font-bold uppercase tracking-widest mb-1">{spot.code}</div>
                                 <h4 className="text-xl font-serif font-bold text-white group-hover:text-[#F9C344] transition-colors leading-tight">
                                   {spot.name}
                                 </h4>
                              </div>
                           </Link>
                        </SwiperSlide>
                     ))}
                   </Swiper>
                 </>
               ) : (
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="relative h-[300px] rounded-xl overflow-hidden border border-white/5 bg-[#111] group">
                         <div className="absolute inset-0 bg-[url('/assets/images/placeholder-pattern.png')] bg-cover opacity-10 blur-md" />
                         <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-6 space-y-3">
                            <h3 className="text-xl font-serif font-bold text-white uppercase tracking-wide">{activeTab} Ziyarat</h3>
                            <p className="text-[#F9C344] font-bold text-lg">Coming Soon</p>
                         </div>
                      </div>
                    ))}
                 </div>
               )}
            </div>
         </div>
      </section>

      {/* LIGHTBOX */}
      {lightboxIndex !== null && data && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4">
          <button onClick={closeLightbox} className="absolute top-6 right-6 text-white/50 hover:text-white p-2"><X size={40} /></button>
          <img src={data.gallery[lightboxIndex]} alt="Full screen" className="max-w-full max-h-[85vh] object-contain rounded-lg" />
          <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-black/50 text-white rounded-full"><ChevronLeft size={32} /></button>
          <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-black/50 text-white rounded-full"><ChevronRight size={32} /></button>
        </div>
      )}

      <Footer />
    </div>
  );
}