import React from 'react';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { PACKAGES } from '@/data/packages';
import { Check, Calendar, MapPin, Clock } from 'lucide-react';
import ItineraryTabs from '@/components/packages/ItineraryTabs';
import VehicleOptions from '@/components/packages/VehicleOptions';
import Breadcrumbs from '@/components/Breadcrumbs'; // ✅ IMPORTED

interface PageProps {
  params: Promise<{ category: string; slug: string }>;
}

export default async function SinglePackagePage({ params }: PageProps) {
  const { category, slug } = await params; // Get category from params for link
  
  const pkg = PACKAGES.find((p) => p.slug === slug);

  if (!pkg) return notFound();

  // ✅ Construct Breadcrumb Items
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Packages', href: '#' }, // Optional: Link to a main packages page if it exists
    { label: pkg.category.replace('-', ' '), href: `/packages/${category}` }, // Capitalize via CSS or utility if needed
    { label: pkg.title } // Current Page (No href)
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#F9C344] selection:text-black">
      <Header />
      
      {/* 1. HERO SECTION */}
      {/* -mt-[104px] pulls the banner up behind the header */}
      <div className="relative h-[85vh] flex items-center justify-center -mt-[104px]">
         <div className="absolute inset-0 bg-[url('https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-18.png')] bg-cover bg-center opacity-60" />
         {/* Gradient Overlay */}
         <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/70 via-[#050505]/20 to-[#050505]" />
         
         {/* Content pushed down to clear header */}
         <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-[150px] flex flex-col items-center">
            
            {/* ✅ NEW: Breadcrumbs Navigation */}
            <div className="mb-8">
               <Breadcrumbs items={breadcrumbItems} className="capitalize" />
            </div>

            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-8 drop-shadow-2xl leading-tight">
              {pkg.title}
            </h1>
            
            <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-gray-200 text-sm sm:text-base font-medium">
               <span className="flex items-center gap-2 bg-black/40 px-5 py-3 rounded-xl backdrop-blur-md border border-white/10 hover:border-[#F9C344]/50 transition-colors">
                 <Calendar size={20} className="text-[#F9C344]"/> {pkg.duration}
               </span>
               <span className="flex items-center gap-2 bg-black/40 px-5 py-3 rounded-xl backdrop-blur-md border border-white/10 hover:border-[#F9C344]/50 transition-colors">
                 <MapPin size={20} className="text-[#F9C344]"/> {pkg.city}
               </span>
               <span className="flex items-center gap-2 bg-black/40 px-5 py-3 rounded-xl backdrop-blur-md border border-white/10 hover:border-[#F9C344]/50 transition-colors">
                 <Clock size={20} className="text-[#F9C344]"/> Flexible Timing
               </span>
            </div>
         </div>
      </div>

      {/* 2. OVERVIEW SECTION */}
      <section className="py-24 bg-[#050505] border-t border-white/5 relative z-20">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
           <div>
             <h3 className="text-4xl font-serif font-bold text-white mb-8">
               Journey Overview
             </h3>
             <p className="text-gray-300 leading-relaxed text-lg mb-10 border-l-4 border-[#F9C344] pl-6">
               {pkg.description}
             </p>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pkg.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-4 bg-[#111] p-4 rounded-xl border border-white/5 hover:border-[#F9C344]/30 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-[#F9C344]/10 flex items-center justify-center shrink-0">
                      <Check size={16} className="text-[#F9C344]" />
                    </div>
                    <span className="text-sm font-medium text-gray-200">{h}</span>
                  </div>
                ))}
             </div>
           </div>
           
           <div className="bg-[#111] border border-white/10 rounded-2xl p-8 lg:p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#F9C344]/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
              <h4 className="text-2xl font-bold text-white mb-8 font-serif">Package Inclusions</h4>
              <ul className="space-y-5">
                {pkg.inclusions.map((inc, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={14} />
                    </div>
                    <span className="text-gray-300 text-lg">{inc}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-10 pt-8 border-t border-white/10">
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Exclusions</h4>
                <ul className="space-y-2">
                  {pkg.exclusions.map((exc, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                      {exc}
                    </li>
                  ))}
                </ul>
              </div>
           </div>
        </div>
      </section>

      {/* 3. ITINERARY SECTION (Lighter Background) */}
      <section className="py-24 bg-[#0a0a0a] border-t border-white/5 relative">
         <div className="max-w-[1400px] mx-auto px-4 md:px-8">
           <div className="text-center mb-16">
              <span className="text-[#F9C344] uppercase tracking-widest font-bold text-sm">Explore History</span>
              <h3 className="text-4xl md:text-5xl font-serif font-bold text-white mt-3">Sacred Ziyarat Points</h3>
              <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
                Discover the spiritual landmarks that defined the history of Islam in {pkg.city}.
              </p>
           </div>
           
           <ItineraryTabs items={pkg.itinerary} />
         </div>
      </section>

      {/* 4. VEHICLE OPTIONS (Distinct Section) */}
      <section id="pricing" className="py-24 bg-[#050505] border-t border-white/5">
         <div className="max-w-[1400px] mx-auto px-4 md:px-8">
           <div className="flex flex-col lg:flex-row justify-between items-end mb-12 gap-6">
             <div>
                <span className="text-[#F9C344] uppercase tracking-widest font-bold text-sm">Choose Your Ride</span>
                <h3 className="text-4xl md:text-5xl font-serif font-bold text-white mt-3">Vehicle Packages</h3>
             </div>
             <p className="text-gray-400 max-w-md text-right lg:text-left">
               We offer a range of comfortable, air-conditioned vehicles suited for individuals, families, and large groups.
             </p>
           </div>

           <VehicleOptions options={pkg.pricing} />
           
           <div className="mt-20 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#F9C344]/20 to-transparent rounded-3xl blur-xl" />
              <div className="relative bg-[#111] p-10 md:p-16 rounded-3xl border border-white/10 text-center overflow-hidden">
                  <div className="relative z-10">
                    <h4 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">Ready to start your journey?</h4>
                    <p className="text-gray-400 mb-8 max-w-2xl mx-auto text-lg">
                      Book your Ziyarat package today. We require a 100% advance payment to secure your vehicle and guide.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                      <button className="bg-[#F9C344] text-black font-bold py-4 px-12 rounded-full hover:bg-white transition-all transform hover:scale-105 shadow-xl shadow-[#F9C344]/20">
                        Book via WhatsApp
                      </button>
                      <button className="bg-transparent border border-white/20 text-white font-bold py-4 px-12 rounded-full hover:bg-white/10 transition-all">
                        Download Itinerary PDF
                      </button>
                    </div>
                    <p className="text-xs text-gray-600 mt-8 uppercase tracking-widest">
                      Terms: {pkg.terms[0]} • {pkg.terms[2]}
                    </p>
                  </div>
              </div>
           </div>
         </div>
      </section>

      <Footer />
    </div>
  );
}