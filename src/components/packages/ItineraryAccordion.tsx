'use client';

import React, { useState } from 'react';
import { ChevronDown, MapPin, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { ItineraryItem } from '@/data/packages/types';

interface Props {
  items: ItineraryItem[];
}

export default function ItineraryAccordion({ items }: Props) {
  // Default to 0 (first item open)
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    // If clicking the open one, close it. Else, open the new one.
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;

        return (
          <div 
            key={idx} 
            className={`border rounded-xl overflow-hidden transition-all duration-300 ${
              isOpen ? 'border-[#F9C344] bg-white/5' : 'border-white/10 bg-transparent hover:border-white/20'
            }`}
          >
            {/* Header (Clickable) */}
            <button
              onClick={() => toggleItem(idx)}
              className="w-full flex items-center justify-between p-4 text-left focus:outline-none"
            >
              <div className="flex items-center gap-4">
                <span className={`text-xl font-bold font-serif ${isOpen ? 'text-[#F9C344]' : 'text-gray-500'}`}>
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span className={`font-bold text-lg ${isOpen ? 'text-white' : 'text-gray-300'}`}>
                  {item.title}
                </span>
              </div>
              <ChevronDown 
                className={`text-[#F9C344] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
              />
            </button>

            {/* Body (Content) */}
            <div 
              className={`grid transition-all duration-300 ease-in-out ${
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <div className="p-4 pt-0 md:p-6 md:pt-0 flex flex-col md:flex-row gap-6">
                  
                  {/* Image Section (Left on Desktop) */}
                  <div className="w-full md:w-1/3 shrink-0">
                    <div className="relative h-48 w-full rounded-lg overflow-hidden border border-white/10 bg-black/50">
                      {item.image ? (
                        /* Using a generic placeholder if image fails or for now */
                        <Image 
                          src={item.image} 
                          alt={item.title}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            // Fallback if image missing
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                          <ImageIcon size={32} />
                        </div>
                      )}
                      {/* Fallback visual if no image loads */}
                      <div className="absolute inset-0 flex items-center justify-center text-gray-600 bg-[#111] -z-10">
                         <ImageIcon size={32} />
                      </div>
                    </div>
                  </div>

                  {/* Text Section (Right on Desktop) */}
                  <div className="flex-1 space-y-4">
                    {/* English Description */}
                    <div>
                      <h4 className="text-xs font-bold text-[#F9C344] uppercase tracking-wider mb-2">Description (English)</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {item.descriptionEn}
                      </p>
                    </div>

                    {/* Arabic Description */}
                    <div className="text-right" dir="rtl">
                      <h4 className="text-xs font-bold text-[#F9C344] uppercase tracking-wider mb-2">الوصف (بالعربية)</h4>
                      <p className="text-gray-300 text-sm leading-relaxed font-arabic">
                        {item.descriptionAr}
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}