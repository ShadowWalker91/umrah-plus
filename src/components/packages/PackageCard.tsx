import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, MapPin, ArrowRight, Star } from 'lucide-react';
import { Package } from '@/data/packages/types';

interface Props {
  pkg: Package;
  category: string;
}

export default function PackageCard({ pkg, category }: Props) {
  return (
    <Link 
      href={`/packages/${category}/${pkg.slug}`}
      className="group block relative h-[450px] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1a] shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#F9C344]/10"
    >
      {/* 1. BACKGROUND IMAGE with Zoom Effect */}
      <div className="absolute inset-0 h-full w-full">
        <Image
          src={pkg.image}
          alt={pkg.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Gradient Overlay: Dark at bottom for text, light at top */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90" />
      </div>

      {/* 2. TOP BADGES */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
        <span className="bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-1">
          <MapPin size={12} className="text-[#F9C344]" />
          {pkg.city}
        </span>
        <span className="bg-[#F9C344] text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
          {pkg.category === 'ziyarat' ? 'Best Seller' : 'Featured'}
        </span>
      </div>

      {/* 3. CONTENT (Bottom Aligned) */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-10 flex flex-col justify-end h-full">
        
        {/* Duration & Info */}
        <div className="flex items-center gap-3 text-gray-300 text-xs font-medium mb-3 opacity-0 transform translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
           <span className="flex items-center gap-1"><Clock size={14} className="text-[#F9C344]"/> {pkg.duration}</span>
           <span className="w-1 h-1 rounded-full bg-gray-500" />
           <span className="flex items-center gap-1"><Star size={14} className="text-[#F9C344]"/> {pkg.highlights.length} Highlights</span>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-serif font-bold text-white mb-2 leading-tight group-hover:text-[#F9C344] transition-colors">
          {pkg.title}
        </h3>

        {/* Short Description */}
        <p className="text-gray-300 text-sm line-clamp-2 mb-4 border-l-2 border-[#F9C344] pl-3">
          {pkg.description}
        </p>

        {/* Price & CTA Row */}
        <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-2">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Starting From</p>
            <p className="text-xl font-bold text-white">{pkg.priceStarting}</p>
          </div>
          
          <span className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-[#F9C344] group-hover:text-black transition-colors">
            <ArrowRight size={20} />
          </span>
        </div>
      </div>
    </Link>
  );
}