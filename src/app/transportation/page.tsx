'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { TRANSPORTATION_DATA } from '@/data/transportation';

export default function TransportationPage() {
  const { banner, sectionHeader, vehicles } = TRANSPORTATION_DATA || {};

  // Safety check
  if (!banner || !sectionHeader || !vehicles) {
    return <div className="min-h-screen flex items-center justify-center bg-black text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans">
      <Header />

      {/* =========================================
          PAGE BANNER SECTION
      ========================================= */}
      <div className="relative h-[50vh] md:h-[60vh] w-full flex items-center justify-center bg-black overflow-hidden">
        
        {/* Banner Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${banner.bgImage}')` }}
        >
           {/* Dark Overlay */}
           <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Banner Content */}
        <div className="relative z-10 text-center px-4 pt-20 animate-fade-in-up">
          
          {/* Main Title - UPDATED TO YELLOW */}
          <h1 className="text-4xl md:text-6xl font-bold text-[#F9C344] font-serif mb-4 drop-shadow-xl uppercase tracking-widest">
            {banner.title}
          </h1>

          {/* Breadcrumbs */}
          <div className="flex items-center justify-center gap-2 text-sm md:text-base font-medium uppercase tracking-wider text-gray-300">
            <Link href="/" className="hover:text-[#F9C344] transition-colors flex items-center gap-1">
              <Home size={14} className="-mt-0.5" /> 
              Home
            </Link>
            <ChevronRight size={14} className="text-[#F9C344]" />
            <span className="text-[#F9C344] font-semibold">{banner.title}</span>
          </div>
        </div>
      </div>

      {/* =========================================
          MAIN CONTENT SECTION
      ========================================= */}
      <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-20 relative z-20">
        
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-[#F9C344] text-xs md:text-sm font-bold uppercase tracking-[0.2em] opacity-80 block">
            {sectionHeader.tagline}
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white uppercase">
            {sectionHeader.title}
          </h2>
          <p className="text-gray-400 text-sm uppercase tracking-widest">
            {sectionHeader.subtitle}
          </p>
          {/* Gold Divider Line */}
          <div className="w-20 h-1 bg-[#F9C344] mx-auto rounded-full mt-6 opacity-70"></div>
        </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map((vehicle) => (
            <div 
              key={vehicle.id}
              className="bg-[#1a1a1a] p-5 rounded-xl border border-white/5 hover:border-[#F9C344]/50 transition-all duration-300 group shadow-lg hover:shadow-[#F9C344]/10 hover:-translate-y-1 flex flex-col"
            >
              {/* Vehicle Image Container */}
              <div className="w-full h-52 bg-black/40 rounded-lg overflow-hidden mb-6 flex items-center justify-center border border-white/5 relative">
                <img 
                  src={vehicle.image} 
                  alt={vehicle.name}
                  className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500 ease-out"
                />
                {/* Capacity Badge */}
                <div className="absolute top-3 right-3 bg-black/80 text-[#F9C344] text-[10px] font-bold px-2 py-1 rounded uppercase border border-[#F9C344]/30 shadow-sm">
                  {vehicle.capacity}
                </div>
              </div>

              {/* Title */}
              <div className="mb-6 px-1">
                <h3 className="text-[#F9C344] text-2xl font-bold uppercase mb-1 font-serif group-hover:text-white transition-colors">
                  {vehicle.name}
                </h3>
              </div>

              {/* Price List */}
              <div className="space-y-4 mb-8 px-1 flex-grow">
                {vehicle.packages.map((pkg, idx) => (
                  <div key={idx} className="group/item">
                    {/* Name and Price Row */}
                    <div className="flex items-end justify-between text-white/90 text-xs font-bold uppercase mb-1">
                      <span className="text-[#F9C344]">{pkg.name}</span>
                      {/* Dotted Line Spacer */}
                      <span className="flex-1 border-b border-dotted border-white/20 mx-2 mb-1"></span>
                      <span>{pkg.price}</span>
                    </div>
                    {/* Route Description */}
                    <p className="text-[10px] text-gray-500 leading-tight font-medium">
                      {pkg.route}
                    </p>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button className="w-full bg-[#F9C344] text-black font-bold text-sm py-4 rounded-lg uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 shadow-md mt-auto">
                Book Now
              </button>

            </div>
          ))}
        </div>

      </main>

      <Footer />
    </div>
  );
}