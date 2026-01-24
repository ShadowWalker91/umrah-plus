'use client';

import React from 'react';
import Image from 'next/image';
import { Users, Briefcase, Info } from 'lucide-react';
import { VehiclePrice } from '@/data/packages/types';

interface Props {
  options: VehiclePrice[];
}

export default function VehicleOptions({ options }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {options.map((vehicle, idx) => (
        <div 
          key={idx} 
          className="group bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden hover:border-[#F9C344] transition-all duration-300 flex flex-col"
        >
          {/* Top: Image Area */}
          <div className="relative h-40 w-full bg-black/50 border-b border-white/5 p-4 flex items-center justify-center">
             {/* Using standard Next Image - Ensure you have these images or placeholders */}
             <div className="relative w-full h-full">
               <Image 
                 src={vehicle.image} 
                 alt={vehicle.name}
                 fill
                 className="object-contain transition-transform duration-500 group-hover:scale-110"
                 onError={(e) => {
                    // Fallback to a generic car icon if image is missing
                    e.currentTarget.style.display = 'none';
                 }}
               />
               {/* Fallback Icon */}
               <div className="absolute inset-0 flex items-center justify-center -z-10 text-white/10">
                  <Briefcase size={48} />
               </div>
             </div>
          </div>

          {/* Bottom: Details */}
          <div className="p-5 flex flex-col flex-grow">
            <div className="flex justify-between items-start mb-2">
               <h4 className="text-lg font-bold text-white group-hover:text-[#F9C344] transition-colors">
                 {vehicle.name}
               </h4>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
               <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded">
                 <Users size={14} /> {vehicle.capacity}
               </span>
               <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded">
                 <Info size={14} /> AC / Comfortable
               </span>
            </div>

            <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-4">
               <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">Total Cost</span>
               <span className="text-xl font-bold text-[#F9C344]">{vehicle.price}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}