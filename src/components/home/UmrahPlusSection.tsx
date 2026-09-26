'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Compass, 
  Car, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Crown,
  MapPin
} from 'lucide-react';
import SearchWidget from '../SearchWidget';

interface Pillar {
  id: string;
  badge: string;
  title: string;
  tagline: string;
  description: string;
  features: string[];
  image: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  accentColor: string;
}

const PILLARS: Pillar[] = [
  {
    id: 'stays',
    badge: 'Pillar 1: Sacred Comfort',
    title: 'Haram-Front Stays',
    tagline: 'Makkah & Madinah Luxury Stays',
    description: 'Footsteps from the Holy Harams. Handpicked 4★ & 5★ properties with Kaaba and Haram view options, ensuring your energy remains devoted entirely to worship.',
    features: ['Walking Distance to Haram', 'Kaaba & Haram View Suites', 'Daily Buffet Breakfast Included'],
    image: '/assets/images/homepage/packages-section/umrah.webp',
    icon: Building2,
    accentColor: '#F9C344',
  },
  {
    id: 'ziyarat',
    badge: 'Pillar 2: Spiritual Depth',
    title: 'Sacred Ziyarat Heritage',
    tagline: 'Makkah, Madinah & Taif Tours',
    description: 'Walk in the footsteps of the Prophet ﷺ. Curated historical journeys covering Cave Hira, Mount Uhud, Masjid Quba, and the rose gardens & historic mosques of Taif.',
    features: ['Tri-City Heritage Coverage', 'Cave Hira, Uhud & Quba', 'Dedicated Historical Route Guide'],
    image: '/assets/images/ziyarat/MakkahZiyaratCover.webp',
    icon: Compass,
    accentColor: '#F9C344',
  },
  {
    id: 'fleet',
    badge: 'Pillar 3: Pure Peace of Mind',
    title: 'VIP Chauffeur Fleet',
    tagline: 'Private Dedicated Transport',
    description: 'Zero waiting, zero transit stress. Dedicated door-to-door private luxury fleet (GMC Yukon, Camry, Hiace) with courteous chauffeurs for all airport, intercity & Ziyarat travel.',
    features: ['Airport Meet & Greet', 'Makkah ↔ Madinah Intercity', '24/7 Private On-Demand Fleet'],
    image: '/assets/images/homepage/packages-section/transport.webp',
    icon: Car,
    accentColor: '#F9C344',
  },
];

export default function UmrahPlusSection() {
  const [activePillar, setActivePillar] = useState<number>(0);

  return (
    <section 
      id="section-5" 
      className="snap-section h-screen w-full relative flex flex-col justify-between overflow-hidden snap-start bg-[#0a0b0e] text-white pt-24 md:pt-28 lg:pt-32 pb-6 md:pb-8 px-4 sm:px-6 md:px-10 lg:px-14"
    >
      {/* 1. ATMOSPHERIC BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img 
          src="/assets/images/homepage/packages-section/packagesBG.jpg" 
          alt="Umrah Plus Background" 
          className="w-full h-full object-cover opacity-25 scale-105 transform filter blur-[1px]"
        />
        {/* Radial Luxury Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0b0e] via-[#0a0b0e]/85 to-[#0a0b0e]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#0a0b0e] to-transparent" />
      </div>

      {/* 2. TOP HEADER: Brand Statement & Explanation */}
      <div className="relative z-10 w-full max-w-6xl mx-auto text-center shrink-0">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-[#F9C344]/30 text-[#F9C344] text-[11px] md:text-xs font-semibold tracking-widest uppercase mb-2 md:mb-3 shadow-inner">
          <Sparkles size={14} className="text-[#F9C344] animate-pulse" />
          The Signature All-in-One Pilgrimage
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-white leading-tight">
          What is{' '}
          <span className="text-[#F9C344] drop-shadow-md">
            Umrah Plus
          </span>
          ?
        </h2>

        {/* <p className="mt-2 md:mt-3 text-xs sm:text-sm md:text-base text-gray-300 font-light max-w-3xl mx-auto leading-relaxed">
          Standard Umrah fulfills the sacred rites. <strong className="text-white font-medium">Umrah Plus</strong> elevates 
          your devotion into an effortless, spiritually enriched odyssey by seamlessly integrating 
          <span className="text-[#F9C344]"> Luxury Haram Stays</span>, 
          <span className="text-[#F9C344]"> Sacred Historic Ziyarat</span>, and 
          <span className="text-[#F9C344]"> Dedicated VIP Fleet Chauffeurs</span>.
        </p> */}
      </div>
      

      {/* Left Side: Booking Widget */}
        <div className="w-full md:max-w-2xl lg:max-w-none lg:w-[60%] xl:w-[56%] z-30 flex justify-center lg:justify-start lg:mb-14 xl:mb-18">
          <SearchWidget />
        </div>

      {/* 3. THREE SIGNATURE PILLARS (Interactive Grid) */}
      <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-5 lg:gap-6 my-auto">
        {PILLARS.map((pillar, idx) => {
          const Icon = pillar.icon;
          const isActive = activePillar === idx;

          return (
            <div 
              key={pillar.id}
              onMouseEnter={() => setActivePillar(idx)}
              className={`group relative rounded-2xl p-4 md:p-5 lg:p-6 transition-all duration-500 cursor-pointer overflow-hidden border flex flex-col justify-between ${
                isActive 
                  ? 'bg-gradient-to-b from-[#181920]/95 to-[#121318]/95 border-[#F9C344]/60 shadow-[0_10px_35px_-10px_rgba(249,195,68,0.25)] -translate-y-1' 
                  : 'bg-[#14151b]/80 border-white/10 hover:border-white/20 hover:bg-[#181922]/90'
              }`}
            >
              {/* Pillar Subtle Background Glow */}
              <div 
                className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl transition-opacity duration-500 pointer-events-none ${
                  isActive ? 'bg-[#F9C344]/20 opacity-100' : 'opacity-0'
                }`} 
              />

              {/* Card Top: Icon & Badge */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-[10px] md:text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                    isActive 
                      ? 'bg-[#F9C344]/15 text-[#F9C344] border-[#F9C344]/40' 
                      : 'bg-white/5 text-gray-400 border-white/10'
                  }`}>
                    {pillar.badge}
                  </span>
                  <div className={`w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                    isActive ? 'bg-[#F9C344] text-black shadow-lg shadow-[#F9C344]/30' : 'bg-white/10 text-[#F9C344]'
                  }`}>
                    <Icon size={20} />
                  </div>
                </div>

                <h3 className="text-base sm:text-lg md:text-xl font-serif font-bold text-white group-hover:text-[#F9C344] transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-[11px] md:text-xs text-amber-200/80 font-medium mb-2">
                  {pillar.tagline}
                </p>

                <p className="text-xs md:text-sm text-gray-300 font-light leading-relaxed mb-4 line-clamp-3 md:line-clamp-none">
                  {pillar.description}
                </p>
              </div>

              {/* Card Bottom: Feature Bullets */}
              <div className="space-y-1.5 pt-3 border-t border-white/10 mt-auto">
                {pillar.features.map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-2 text-[11px] md:text-xs text-gray-300">
                    <CheckCircle2 size={13} className={`shrink-0 ${isActive ? 'text-[#F9C344]' : 'text-gray-400'}`} />
                    <span className="truncate">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. THE "PLUS EQUATION" & ACTION CTAs */}
      {/* <div className="relative z-10 w-full max-w-6xl mx-auto shrink-0 flex flex-col md:flex-row items-center justify-between gap-4 pt-3 pb-1 border-t border-white/10"> */}
        
        {/* The Plus Equation Pill */}
        {/* <div className="hidden lg:flex items-center gap-2.5 text-xs text-gray-300 bg-white/5 px-4 py-2 rounded-full border border-white/10">
          <span className="text-white font-medium">Umrah Rites</span>
          <span className="text-[#F9C344] font-bold">+</span>
          <span className="text-white font-medium">Haram Stays</span>
          <span className="text-[#F9C344] font-bold">+</span>
          <span className="text-white font-medium">Sacred Ziyarat</span>
          <span className="text-[#F9C344] font-bold">+</span>
          <span className="text-white font-medium">VIP Fleet</span>
          <span className="text-[#F9C344] font-bold">=</span>
          <span className="text-[#F9C344] font-bold uppercase tracking-wider">Umrah Plus</span>
        </div> */}

        {/* Action Buttons */}
        {/* <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-end">
          <Link
            href="/ziyarat"
            className="px-4 py-2.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold tracking-wider uppercase transition-all duration-300 hover:border-white/40"
          >
            Explore Sacred Sites
          </Link>

          <Link
            href="/booking?type=Umrah%20Plus"
            className="flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-full bg-gradient-to-r from-[#F9C344] to-amber-500 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-bold tracking-wider uppercase transition-all duration-300 shadow-lg shadow-[#F9C344]/20 hover:scale-105 hover:shadow-[#F9C344]/35"
          >
            <span>Customize Umrah Plus</span>
            <ArrowRight size={14} />
          </Link>
        </div> */}

      {/* </div> */}
    </section>
  );
}
