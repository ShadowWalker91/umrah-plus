'use client';

import React, { useState } from 'react';
import { ChevronRight, Image as ImageIcon, MapPin, ChevronUp, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { ItineraryItem } from '@/data/packages/types';

// Swiper Imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface Props {
  items: ItineraryItem[];
}

export default function ItineraryTabs({ items }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  // ✅ CRITICAL FIX: Safety check for empty or undefined items
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-10 border border-white/10 rounded-xl bg-white/5">
        <p className="text-gray-400">Itinerary details coming soon.</p>
      </div>
    );
  }

  const activeItem = items[activeIndex];

  // ✅ DOUBLE CHECK: Ensure activeItem exists before rendering
  if (!activeItem) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-8 relative items-start h-[600px] lg:h-[650px]">
      
      {/* --- LEFT COLUMN: VERTICAL SLIDER --- */}
      <div className="lg:w-1/4 flex-shrink-0 w-full h-full flex flex-col">
        
        {/* Header Row with Title and Arrows */}
        <div className="flex items-center justify-between px-4 mb-4">
            <h3 className="text-[#F9C344] font-bold uppercase tracking-widest text-sm">
              Total Locations ({items.length})
            </h3>

            {/* Prominent Navigation Arrows linked to Swiper */}
            <div className="flex gap-2">
                <button className="arrow-up bg-[#1a1a1a] hover:bg-[#F9C344] border border-[#F9C344] text-[#F9C344] hover:text-black rounded-full p-1.5 transition-all shadow-lg z-20 cursor-pointer">
                    <ChevronUp size={18} />
                </button>
                <button className="arrow-down bg-[#1a1a1a] hover:bg-[#F9C344] border border-[#F9C344] text-[#F9C344] hover:text-black rounded-full p-1.5 transition-all shadow-lg z-20 cursor-pointer">
                    <ChevronDown size={18} />
                </button>
            </div>
        </div>
        
        {/* Slider Container */}
        <div className="relative flex-grow overflow-hidden bg-[#111] rounded-2xl border border-white/5 p-2">
          
          <Swiper
            direction="vertical"
            slidesPerView={6} // Shows 6 items at once
            spaceBetween={8}
            mousewheel={true}
            navigation={{
                nextEl: '.arrow-down',
                prevEl: '.arrow-up',
            }}
            modules={[Mousewheel, Navigation]}
            className="h-full w-full"
          >
            {items.map((item, idx) => {
              const isActive = idx === activeIndex;
              return (
                <SwiperSlide key={idx} className="!h-auto">
                  <button
                    onClick={() => setActiveIndex(idx)}
                    className={`w-full text-left px-4 py-4 rounded-xl transition-all duration-300 relative flex items-center justify-between border group ${
                      isActive 
                        ? 'bg-[#F9C344] text-black border-[#F9C344] shadow-lg shadow-[#F9C344]/10 scale-[1.02] z-10' 
                        : 'bg-transparent text-gray-400 border-transparent hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 w-full">
                       {/* Number Circle */}
                       <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shrink-0 transition-colors ${
                         isActive ? 'bg-black/20 text-black' : 'bg-white/10 text-gray-500 group-hover:bg-white/20 group-hover:text-white'
                       }`}>
                         {idx + 1}
                       </span>
                       {/* Title */}
                       <span className="font-bold text-sm leading-tight line-clamp-1">
                         {item.title}
                       </span>
                    </div>
                    {/* Arrow Icon */}
                    <ChevronRight size={16} className={`shrink-0 transition-opacity ${isActive ? 'opacity-100 text-black' : 'opacity-0 group-hover:opacity-100'}`} />
                  </button>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>

      {/* --- RIGHT COLUMN: CONTENT BOX (Sticky) --- */}
      <div className="lg:w-3/4 flex-grow h-full w-full">
        <div 
          key={activeIndex} 
          className="bg-[#111] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 h-full"
        >
          
          {/* 1. IMAGE CAROUSEL SECTION */}
          <div className="relative h-[45%] w-full bg-black group shrink-0">
            {activeItem.images && activeItem.images.length > 0 ? (
              <Swiper
                modules={[Pagination, Navigation, Autoplay]}
                pagination={{ clickable: true }}
                navigation
                autoplay={{ delay: 5000 }}
                loop={true}
                className="h-full w-full"
              >
                {activeItem.images.map((img, i) => (
                  <SwiperSlide key={i}>
                    <div className="relative w-full h-full">
                      <Image 
                        src={img} 
                        alt={`${activeItem.title} - Image ${i+1}`}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent opacity-90" />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              // Fallback if no images
              <div className="h-full w-full flex items-center justify-center text-gray-600 bg-[#111]">
                <ImageIcon size={48} />
              </div>
            )}
            
            {/* Overlay Title */}
            <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
               <div className="flex items-center gap-2 text-[#F9C344] mb-2">
                 <MapPin size={18} />
                 <span className="text-xs font-bold uppercase tracking-widest">Site No. {activeIndex + 1}</span>
               </div>
               <h3 className="text-3xl md:text-4xl font-bold text-white font-serif drop-shadow-lg leading-tight">
                 {activeItem.title}
               </h3>
            </div>
          </div>

          {/* 2. DESCRIPTION SECTION (Scrollable) */}
          <div className="p-8 grid grid-cols-1 gap-6 bg-[#111] overflow-y-auto custom-scrollbar flex-grow">
            
            {/* English Description */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 mb-2 border-b border-white/5 pb-2">
                <span className="w-8 h-1 bg-[#F9C344]" />
                <h4 className="text-white text-base font-bold uppercase tracking-widest">Historical Significance</h4>
              </div>
              <p className="text-gray-300 leading-relaxed text-lg">
                {activeItem.descriptionEn}
              </p>
            </div>

            {/* Arabic Description */}
            <div className="space-y-2 text-right bg-white/5 p-6 rounded-2xl border border-white/5" dir="rtl">
              <div className="flex items-center gap-3 mb-2 border-b border-white/5 pb-2 justify-start">
                <span className="w-8 h-1 bg-[#F9C344]" />
                <h4 className="text-white text-base font-bold uppercase tracking-widest font-arabic">نبذة تاريخية</h4>
              </div>
              <p className="text-gray-300 leading-relaxed text-lg font-arabic">
                {activeItem.descriptionAr}
              </p>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}