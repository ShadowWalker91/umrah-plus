'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ChevronRight, Home, ShieldAlert, CalendarClock, MessageCircle, CheckCircle2, Car } from 'lucide-react';
import { TRANSPORTATION_DATA, VehicleTransportation } from '@/data/transportation';
import { getTransportData, TransportStoreData } from '@/app/actions/transportActions';

interface Props {
  initialStoreData?: TransportStoreData | null;
}

export default function TransportationClient({ initialStoreData }: Props) {
  const [storeData, setStoreData] = useState<TransportStoreData | null>(initialStoreData || null);
  const [activeTab, setActiveTab] = useState<'round-trip' | 'point-to-point'>('round-trip');

  useEffect(() => {
    // Re-fetch on client mount to ensure fresh rates if user navigated via SPA
    getTransportData().then((res) => {
      if (res && res.vehicles && res.vehicles.length > 0) {
        setStoreData(res);
      }
    }).catch(err => console.error("Error refreshing transport rates:", err));
  }, []);

  const { banner, sectionHeader, policies, seasonalAdjustments } = TRANSPORTATION_DATA || {};

  // Dynamically build vehicles & packages directly from dashboard database (storeData)
  const vehicles: VehicleTransportation[] = useMemo(() => {
    if (!storeData || !storeData.vehicles || storeData.vehicles.length === 0) {
      return TRANSPORTATION_DATA.vehicles;
    }

    const fixedRoutes = (storeData.fixedRoutesList && storeData.fixedRoutesList.length > 0)
      ? storeData.fixedRoutesList
      : [
          { id: 'p1', name: 'Round Trip Package 01', fullRoute: 'Jeddah Airport ➔ Makkah ➔ Madinah ➔ Madinah Airport' },
          { id: 'p2', name: 'Round Trip Package 02', fullRoute: 'Jeddah Airport ➔ Makkah ➔ Madinah ➔ Jeddah Airport' },
          { id: 'p3', name: 'Round Trip Package 03', fullRoute: 'Madinah Airport ➔ Madinah ➔ Makkah ➔ Jeddah Airport' },
          { id: 'p4', name: 'Round Trip Package 04', fullRoute: 'Jeddah Airport ➔ Makkah ➔ Madinah ➔ Makkah ➔ Jeddah Airport' }
        ];

    const p2pRoutes = (storeData.pointToPointRoutesList && storeData.pointToPointRoutesList.length > 0)
      ? storeData.pointToPointRoutesList
      : [
          "Jeddah ↔ Makkah",
          "Makkah ↔ Jeddah",
          "Makkah / Jeddah → Madinah",
          "Jeddah Airport ↔ Madinah",
          "Jeddah Airport ↔ Jeddah City",
          "Jeddah City → Jeddah Airport",
          "Madinah Airport → Madinah Hotel",
          "Madinah Hotel → Madinah Airport",
          "Makkah ↔ Masjid Ayesha (Return)"
        ];

    return storeData.vehicles.map((v, idx) => {
      const staticMatch = TRANSPORTATION_DATA.vehicles.find(
        sv => sv.name.toLowerCase().trim() === v.name.toLowerCase().trim() || sv.id === idx + 1
      );

      const packages = fixedRoutes.map((route, rIdx) => {
        const fare = v.fixedRoutes?.[route.id];
        return {
          name: `Package ${rIdx + 1}`,
          price: fare !== undefined && fare > 0 ? `AED ${fare}` : 'On Request',
          route: (route.fullRoute || '').replace(/➔/g, '→')
        };
      });

      const pointToPoint = p2pRoutes.map((routeName) => {
        const fare = v.pointToPoint?.[routeName];
        return {
          name: routeName,
          price: fare !== undefined && fare > 0 ? `AED ${fare}` : 'On Request'
        };
      });

      const capacityText = v.capacity > 20
        ? `${v.capacity} Seats`
        : staticMatch?.capacity || `${v.capacity} Guests`;

      return {
        id: (idx + 1) as any,
        name: v.name,
        capacity: capacityText,
        image: v.image || staticMatch?.image || "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/07/1-Lexus-300H.webp",
        packages,
        pointToPoint
      };
    });
  }, [storeData]);

  // Safety check
  if (!banner || !sectionHeader) {
    return <div className="min-h-screen flex items-center justify-center bg-black text-white">Loading...</div>;
  }

  const handleBookNow = (vehicleName: string, capacity: string) => {
    const rawNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '971522634471';
    const cleanNumber = rawNumber.replace(/[^0-9]/g, '');
    const serviceType = activeTab === 'round-trip' ? 'Round-Trip Package' : 'Point-to-Point Transfer';
    const message = `Assalamu Alaikum! I would like to inquire about booking the ${vehicleName} (${capacity}) for ${serviceType}. Please share availability and details.`;
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans">

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
          
          {/* Main Title */}
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
        <div className="text-center mb-10 space-y-4">
          <span className="text-[#F9C344] text-xs md:text-sm font-bold uppercase tracking-[0.2em] opacity-90 block">
            {sectionHeader.tagline}
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white uppercase">
            {sectionHeader.title}
          </h2>
          <p className="text-gray-400 text-sm uppercase tracking-widest max-w-2xl mx-auto">
            {sectionHeader.subtitle}
          </p>
          {/* Gold Divider Line */}
          <div className="w-20 h-1 bg-[#F9C344] mx-auto rounded-full mt-6 opacity-70"></div>
        </div>

        {/* Mode Selector Tabs: Round-Trip vs Point-to-Point */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
          <button
            onClick={() => setActiveTab('round-trip')}
            className={`px-7 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-md cursor-pointer ${
              activeTab === 'round-trip'
                ? 'bg-[#F9C344] text-black shadow-[#F9C344]/20 scale-105'
                : 'bg-[#141414] text-gray-300 hover:text-white border border-white/10 hover:border-[#F9C344]/40'
            }`}
          >
            Round-Trip Packages (Airport-to-Airport)
          </button>
          <button
            onClick={() => setActiveTab('point-to-point')}
            className={`px-7 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-md cursor-pointer ${
              activeTab === 'point-to-point'
                ? 'bg-[#F9C344] text-black shadow-[#F9C344]/20 scale-105'
                : 'bg-[#141414] text-gray-300 hover:text-white border border-white/10 hover:border-[#F9C344]/40'
            }`}
          >
            Point-to-Point Transfers (Single Routes)
          </button>
        </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {vehicles.map((vehicle) => (
            <div 
              key={vehicle.id}
              className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/5 hover:border-[#F9C344]/50 transition-all duration-300 group shadow-lg hover:shadow-[#F9C344]/10 hover:-translate-y-1 flex flex-col"
            >
              {/* Vehicle Image Container */}
              <div className="w-full h-52 bg-black/40 rounded-xl overflow-hidden mb-6 flex items-center justify-center border border-white/5 relative">
                <img 
                  src={vehicle.image} 
                  alt={vehicle.name}
                  className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500 ease-out"
                />
                {/* Capacity Badge */}
                <div className="absolute top-3 right-3 bg-black/85 text-[#F9C344] text-[11px] font-bold px-3 py-1 rounded-md uppercase border border-[#F9C344]/30 shadow-md">
                  {vehicle.capacity}
                </div>
              </div>

              {/* Title */}
              <div className="mb-5 px-1">
                <h3 className="text-[#F9C344] text-2xl font-bold uppercase mb-1 font-serif group-hover:text-white transition-colors">
                  {vehicle.name}
                </h3>
                <span className="text-[11px] text-gray-400 font-medium tracking-wide">
                  {activeTab === 'round-trip' ? 'All-Inclusive Airport Packages' : 'Single Route Transfers'}
                </span>
              </div>

              {/* Price List */}
              <div className="space-y-3.5 mb-8 px-1 flex-grow">
                {activeTab === 'round-trip' ? (
                  vehicle.packages.map((pkg, idx) => (
                    <div key={idx} className="group/item pb-2 border-b border-white/[0.04] last:border-0">
                      {/* Name and Price Row */}
                      <div className="flex items-end justify-between text-white/90 text-xs font-bold uppercase mb-1">
                        <span className="text-[#F9C344]">{pkg.name}</span>
                        {/* Dotted Line Spacer */}
                        <span className="flex-1 border-b border-dotted border-white/20 mx-2 mb-1"></span>
                        <span className="text-white font-mono">{pkg.price}</span>
                      </div>
                      {/* Route Description */}
                      <p className="text-[11px] text-gray-400 leading-tight font-medium">
                        {pkg.route}
                      </p>
                    </div>
                  ))
                ) : (
                  vehicle.pointToPoint.map((routeItem, idx) => (
                    <div key={idx} className="group/item py-1">
                      {/* Route Name and Price Row */}
                      <div className="flex items-end justify-between text-white/90 text-xs font-semibold mb-0.5">
                        <span className="text-gray-200 text-[11px]">{routeItem.name}</span>
                        {/* Dotted Line Spacer */}
                        <span className="flex-1 border-b border-dotted border-white/20 mx-2 mb-1"></span>
                        <span className="text-[#F9C344] font-mono font-bold text-xs">{routeItem.price}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* CTA Buttons: Book Online & WhatsApp */}
              <div className="flex flex-col gap-2 mt-auto">
                <Link
                  href={`/booking?type=Transport`}
                  className="w-full bg-[#F9C344] text-black font-bold text-xs md:text-sm py-3.5 rounded-xl uppercase tracking-widest hover:bg-white transition-all duration-300 shadow-md flex items-center justify-center gap-2 group-hover:scale-[1.02]"
                >
                  <Car size={16} /> Customize & Book Online
                </Link>
                <button 
                  onClick={() => handleBookNow(vehicle.name, vehicle.capacity)}
                  className="w-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-bold text-xs py-2.5 rounded-xl uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle size={15} className="text-[#00d084]" /> WhatsApp Instant Inquiry
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* =========================================
            POLICIES & SEASONAL ADJUSTMENTS SECTION
        ========================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t border-white/10">
          
          {/* Booking & Travel Policies */}
          <div className="bg-[#141414] p-8 rounded-2xl border border-white/5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-[#F9C344]/10 border border-[#F9C344]/30 flex items-center justify-center text-[#F9C344]">
                  <ShieldAlert size={18} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white font-serif uppercase">
                    Before You Travel
                  </h3>
                  <p className="text-xs text-gray-400">Essential details that make your journey worry-free</p>
                </div>
              </div>

              <ul className="space-y-3 text-xs text-gray-300 leading-relaxed">
                {policies?.map((policy, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 size={14} className="text-[#F9C344] shrink-0 mt-0.5" />
                    <span>{policy}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Seasonal Adjustments */}
          <div className="bg-[#141414] p-8 rounded-2xl border border-white/5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-[#F9C344]/10 border border-[#F9C344]/30 flex items-center justify-center text-[#F9C344]">
                  <CalendarClock size={18} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white font-serif uppercase">
                    Seasonal Rate Adjustments
                  </h3>
                  <p className="text-xs text-gray-400">Peak season and terminal pickup surcharges</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {seasonalAdjustments?.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between p-3.5 bg-black/40 rounded-xl border border-white/5 text-xs"
                  >
                    <span className="font-semibold text-gray-200">{item.period}</span>
                    <span className="font-mono font-bold text-[#F9C344] px-2.5 py-1 bg-[#F9C344]/10 rounded-md border border-[#F9C344]/20">
                      {item.adjustment}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Note on Umrah vs Tourist Visas */}
            <div className="p-4 bg-[#F9C344]/5 border border-[#F9C344]/20 rounded-xl text-xs text-gray-300">
              <p className="font-semibold text-[#F9C344] mb-1">Important Visa Note:</p>
              <p className="text-[11px] leading-normal text-gray-400">
                For guests traveling on an Umrah visa, vehicle and driver details are coordinated in advance to secure the mandatory Kashf / Tafweej. Tourist-visa holders do not require Kashf / Tafweej in line with Ministry of Hajj & Umrah regulations.
              </p>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
