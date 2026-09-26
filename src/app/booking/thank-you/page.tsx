'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'motion/react';
import { CheckCircle2, ArrowRight, Home, PhoneCall, CalendarCheck, ShieldCheck, Car } from 'lucide-react';
import Header from '@/components/Header';
import DownloadItineraryButton from '@/components/booking-engine/DownloadItineraryButton';

function ThankYouContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-[#1a1c22] border border-white/10 rounded-3xl p-6 sm:p-10 md:p-12 shadow-2xl relative overflow-hidden w-full max-w-4xl"
    >
      {/* Subtle decorative glow */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#c5a059]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#c5a059]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Icon */}
      <div className="relative inline-block mb-6">
        <div className="w-24 h-24 rounded-full bg-[#c5a059]/10 border border-[#c5a059]/30 flex items-center justify-center mx-auto text-[#c5a059] shadow-[0_0_30px_rgba(197,160,89,0.2)]">
          <CheckCircle2 className="w-12 h-12" />
        </div>
      </div>

      {/* Heading */}
      <span className="text-xs uppercase tracking-[0.25em] text-[#c5a059] font-bold block mb-3">
        Inquiry Successfully Submitted
      </span>
      <h1 className="text-3xl md:text-5xl font-playfair italic text-white mb-6">
        Thank You for Choosing Umrah Plus
      </h1>

      {/* Prominent message requested by the user */}
      <div className="bg-[#0c0d10] border border-white/5 rounded-2xl p-6 mb-8 text-center">
        <p className="text-lg md:text-xl text-[#e6c987] font-serif font-light leading-relaxed">
          &ldquo;We have received your custom reservation details. Our dedicated Umrah specialists will reach back to you shortly to finalize your personalized itinerary and accommodations.&rdquo;
        </p>
      </div>

      {/* Next steps cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 text-left">
        <div className="p-4 rounded-xl bg-[#0c0d10]/60 border border-white/5">
          <div className="flex items-center gap-2 text-[#c5a059] text-xs font-bold uppercase tracking-wider mb-2">
            <CalendarCheck className="w-4 h-4" /> 1. Review
          </div>
          <p className="text-xs text-gray-400 font-light leading-relaxed">
            Our team reviews your stay preferences, route, and requested vehicles.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#0c0d10]/60 border border-white/5">
          <div className="flex items-center gap-2 text-[#c5a059] text-xs font-bold uppercase tracking-wider mb-2">
            <PhoneCall className="w-4 h-4" /> 2. Contact
          </div>
          <p className="text-xs text-gray-400 font-light leading-relaxed">
            We will contact you via WhatsApp or Email with full details.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#0c0d10]/60 border border-white/5">
          <div className="flex items-center gap-2 text-[#c5a059] text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4" /> 3. Confirm
          </div>
          <p className="text-xs text-gray-400 font-light leading-relaxed">
            Once satisfied with every detail, your pilgrimage booking is confirmed.
          </p>
        </div>
      </div>

      {/* Actions: exactly 3 buttons as requested: 1 Home, 2 Download Itinerary PDF, 3 View Transport Packages */}
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center w-full">
        <Link
          href="/"
          className="w-full sm:w-auto h-[48px] inline-flex items-center justify-center gap-2 bg-[#c5a059] hover:bg-[#d4b57a] text-black font-bold uppercase tracking-wider text-xs md:text-sm px-6 rounded-xl transition-all shadow-lg hover:shadow-[0_4px_20px_rgba(197,160,89,0.35)] whitespace-nowrap cursor-pointer"
        >
          <Home className="w-4 h-4" /> Home
        </Link>
        
        <DownloadItineraryButton bookingId={bookingId || ''} />

        <Link
          href="/transportation"
          className="w-full sm:w-auto h-[48px] inline-flex items-center justify-center gap-2 bg-transparent border border-white/20 hover:border-white/40 text-white font-bold uppercase tracking-wider text-xs md:text-sm px-6 rounded-xl transition-all hover:bg-white/5 whitespace-nowrap cursor-pointer"
        >
          <Car className="w-4 h-4 text-[#c5a059]" /> View Transport Packages
        </Link>
      </div>
    </motion.div>
  );
}

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-[#0c0d10] flex flex-col text-gray-100">
      <div className="bg-[#0c0d10] relative h-24">
        <Header />
      </div>

      <div className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 md:py-16 flex flex-col items-center justify-center text-center">
        {/* eslint-disable-next-line @typescript-eslint/no-restricted-syntax */}
        <Suspense fallback={<span className="text-white">Loading...</span>}>
          <ThankYouContent />
        </Suspense>
      </div>
    </main>
  );
}
