'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BOOKING_DATA } from '@/data/bookYourTrip';

export default function BookYourTripPage() {
  const { banner, cities, vehicleTypes, transferTypes } = BOOKING_DATA;

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans">
      <Header />

      {/* =========================================
          PAGE BANNER SECTION
      ========================================= */}
      <div className="relative h-[50vh] md:h-[60vh] w-full flex items-center justify-center bg-black overflow-hidden">
        
        {/* Banner Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${banner.bgImage}')` }}
        >
           {/* Dark Overlay */}
           <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Banner Content */}
        <div className="relative z-10 text-center px-4 pt-20 animate-fade-in-up">
          {/* Main Title - YELLOW */}
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
            <span className="text-[#F9C344] font-semibold">Book Your Trip</span>
          </div>
        </div>
      </div>

      {/* =========================================
          FORM SECTION
      ========================================= */}
      <main className="max-w-5xl mx-auto px-4 md:px-8 pb-24 -mt-16 relative z-20">
        
        {/* Form Container */}
        <div className="bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl p-8 md:p-12">
          
          <form className="space-y-8">
            
            {/* 1. LOCATIONS (Moved to Top) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-300 font-bold uppercase tracking-wide">From Location</label>
                {/* FIX: Added defaultValue="" and removed selected from option */}
                <select 
                  defaultValue="" 
                  className="w-full bg-[#0a0a0a] border border-white/10 text-gray-300 p-3 rounded focus:outline-none focus:border-[#F9C344] transition-colors"
                >
                  <option value="" disabled>Select Origin</option>
                  {cities.map((city, idx) => (
                    <option key={idx} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-300 font-bold uppercase tracking-wide">To Location</label>
                {/* FIX: Added defaultValue="" and removed selected from option */}
                <select 
                  defaultValue="" 
                  className="w-full bg-[#0a0a0a] border border-white/10 text-gray-300 p-3 rounded focus:outline-none focus:border-[#F9C344] transition-colors"
                >
                  <option value="" disabled>Select Destination</option>
                  {cities.map((city, idx) => (
                    <option key={idx} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 2. OPTIONS (Vehicles & Transfer Type) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-white/5">
              
              {/* Vehicle Type */}
              <div className="flex flex-col gap-3">
                <label className="text-sm text-[#F9C344] font-bold uppercase tracking-wide border-b border-white/10 pb-2 mb-2">
                  Vehicle Type
                </label>
                <div className="space-y-3">
                  {vehicleTypes.map((vehicle, idx) => (
                    <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="accent-[#F9C344] w-4 h-4 cursor-pointer bg-[#0a0a0a] border-white/20" />
                      <span className="text-gray-400 text-sm group-hover:text-white transition-colors">{vehicle}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Transfer Type */}
              <div className="flex flex-col gap-3">
                <label className="text-sm text-[#F9C344] font-bold uppercase tracking-wide border-b border-white/10 pb-2 mb-2">
                  Transfer Type
                </label>
                <div className="space-y-3">
                  {transferTypes.map((type, idx) => (
                    <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                      <input type="radio" name="transferType" className="accent-[#F9C344] w-4 h-4 cursor-pointer bg-[#0a0a0a] border-white/20" />
                      <span className="text-gray-400 text-sm group-hover:text-white transition-colors">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. PERSONAL DETAILS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-400">Name</label>
                <input type="text" placeholder="Your Name" className="bg-[#0a0a0a] border border-white/10 text-white p-3 rounded focus:border-[#F9C344] focus:outline-none" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-400">Mobile</label>
                <input type="tel" placeholder="+966..." className="bg-[#0a0a0a] border border-white/10 text-white p-3 rounded focus:border-[#F9C344] focus:outline-none" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-400">Email</label>
                <input type="email" placeholder="email@example.com" className="bg-[#0a0a0a] border border-white/10 text-white p-3 rounded focus:border-[#F9C344] focus:outline-none" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-400">WhatsApp</label>
                <input type="tel" placeholder="+966..." className="bg-[#0a0a0a] border border-white/10 text-white p-3 rounded focus:border-[#F9C344] focus:outline-none" />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button 
                type="submit" 
                className="w-full bg-[#F9C344] hover:bg-white text-black font-bold text-lg py-4 rounded uppercase tracking-widest transition-all duration-300 shadow-lg hover:shadow-[#F9C344]/20"
              >
                Book Now
              </button>
            </div>

          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}