'use client';

import React, { Suspense, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'motion/react';
import { Check, Users, ClipboardList, Building2, Car, Flag, Home, Truck } from 'lucide-react';
import Image from 'next/image';
import Header from '@/components/Header';
import DownloadItineraryButton from '@/components/booking-engine/DownloadItineraryButton';

function VerifiedRow({
  icon,
  label,
  sublabel,
}: {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
}) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-white/10 last:border-b-0">
      <span className="w-8 h-8 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center text-[#c5a059] shrink-0">
        {icon}
      </span>
      <span className="flex-1 min-w-0 text-sm text-gray-100 font-medium leading-tight">
        {label}
        {sublabel && <span className="block text-[11px] text-gray-400 font-light">{sublabel}</span>}
      </span>
      <span className="text-[11px] font-bold text-emerald-400 inline-flex items-center gap-1 shrink-0">
        <Check className="w-3.5 h-3.5" /> Verified
      </span>
    </div>
  );
}

function ThankYouContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const ref = searchParams.get('ref');
  const pax = searchParams.get('pax');
  const routes = searchParams.get('routes');
  const sites = searchParams.get('sites');
  const stay = searchParams.get('stay');
  const total = searchParams.get('total');

  const inquiryId = ref || bookingId;
  const refDisplay = inquiryId ? `#${inquiryId}` : '#UM-2026-PENDING';
  const paxNum = Number(pax) > 0 ? Number(pax) : null;
  const routeNum = Number(routes) > 0 ? Number(routes) : null;
  const siteNum = Number(sites) > 0 ? Number(sites) : null;
  const stayIncluded = stay === '1';

  // Deterministic barcode built from the inquiry reference.
  const bars = useMemo(() => {
    const src = inquiryId || 'UM-2026-8942';
    const out: { w: number; dark: boolean }[] = [];
    for (let i = 0; i < src.length * 5; i++) {
      const c = src.charCodeAt(i % src.length);
      out.push({ w: ((c * (i + 3)) % 3) + 1, dark: i % 2 === 0 });
    }
    return out;
  }, [inquiryId]);

  const steps = [
    {
      n: '1. REVIEW',
      text: 'Our team reviews your stay, route, and vehicles.',
    },
    {
      n: '2. CONTACT',
      text: 'We will reach out via WhatsApp/Email with full details.',
    },
    {
      n: '3. CONFIRM',
      text: 'Your custom pilgrimage booking is finalized!',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-5xl"
    >
      {/* ── Dua banner with arched imagery ── */}
      <div className="relative w-full overflow-hidden rounded-t-3xl border border-b-0 border-[#c5a059]/40 bg-[#0c0d10] shadow-[0_10px_40px_rgba(0,0,0,0.45)]">
        <div className="absolute inset-y-0 left-0 w-[26%] min-w-[110px]">
          <Image
            src="/assets/images/ziyarat/MakkahZiyaratCover.webp"
            alt=""
            fill
            sizes="30vw"
            className="object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c0d10]/60 via-[#0c0d10]/30 to-[#0c0d10]" />
          <div className="absolute inset-y-3 left-3 right-0 rounded-t-[999px] border border-x border-t border-[#c5a059]/50 pointer-events-none" />
        </div>
        <div className="absolute inset-y-0 right-0 w-[26%] min-w-[110px]">
          <Image
            src="/assets/images/ziyarat/MadinahZiyaratCover.webp"
            alt=""
            fill
            sizes="30vw"
            className="object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-[#0c0d10]/60 via-[#0c0d10]/30 to-[#0c0d10]" />
          <div className="absolute inset-y-3 right-3 left-0 rounded-t-[999px] border border-x border-t border-[#c5a059]/50 pointer-events-none" />
        </div>

        <div className="relative px-6 py-7 text-center">
          <p className="font-playfair text-2xl sm:text-3xl md:text-4xl text-[#e6c987] leading-snug" dir="rtl" lang="ar">
            لَتَقَبَّلَ اللَّهُ مِنَّا وَمِنْكُمْ
          </p>
          <p className="text-[11px] sm:text-xs tracking-[0.3em] text-[#c5a059] mt-2 uppercase font-semibold">
            May Allah accept your Blessed Journey
          </p>
        </div>
      </div>

      {/* ── Split confirmation card ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-0 lg:gap-8 p-4 sm:p-6 lg:p-8 rounded-b-3xl border border-t-0 border-[#c5a059]/40 bg-[#0c0d10] shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
        {/* LEFT RAIL — Inquiry Submitted */}
        <div className="rounded-2xl border border-[#c5a059]/40 bg-gradient-to-b from-[#101a14] to-[#0c0d10] p-5 sm:p-6 shadow-[0_0_30px_rgba(197,160,89,0.1)]">
          <h2 className="font-playfair text-xl sm:text-2xl text-[#e6c987] text-center mb-4 pb-4 border-b border-[#c5a059]/30">
            Inquiry Submitted
          </h2>

          <div className="mb-4">
            <VerifiedRow icon={<Users className="w-4 h-4" />} label={`${paxNum ?? 1} Pilgrim${paxNum === 1 ? '' : 's'}`} />
            {routeNum !== null && (
              <VerifiedRow
                icon={<ClipboardList className="w-4 h-4" />}
                label={`${routeNum} Ziyarat Route${routeNum === 1 ? '' : 's'}`}
                sublabel={siteNum !== null ? `${siteNum} Ziyarats` : undefined}
              />
            )}
            {stayIncluded && (
              <VerifiedRow
                icon={<Building2 className="w-4 h-4" />}
                label="1 Accommodation"
                sublabel="Makkah Stay"
              />
            )}
            <VerifiedRow icon={<Car className="w-4 h-4" />} label="Transit Route Scheduled" />
          </div>

          {total && (
            <div className="py-3 border-t border-white/10 mb-3">
              <p className="text-sm text-gray-300">
                Estimated Total: <strong className="text-[#f9e8a2]">{total}</strong>
              </p>
              <p className="text-[11px] text-gray-500 font-light mt-0.5">(Pending Confirmation)</p>
            </div>
          )}

          {/* Barcode + Inquiry ID */}
          <div className="bg-white rounded-lg px-3 py-3 mb-0 border border-white/20">
            <div className="flex items-end justify-center gap-[2px] h-12" aria-hidden>
              {bars.map((b, i) => (
                <span
                  key={i}
                  className="h-full"
                  style={{ width: `${b.w}px`, backgroundColor: b.dark ? '#000' : 'transparent' }}
                />
              ))}
            </div>
            <p className="text-center text-[11px] font-bold text-black mt-1.5">Inquiry ID: {refDisplay}</p>
          </div>

          <div className="mt-3 flex items-center justify-center gap-2 bg-black/50 border border-[#c5a059]/40 rounded-lg px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-[#f3d38a] font-bold text-center">
            <Flag className="w-3.5 h-3.5 text-[#c5a059] shrink-0" />
            Specially Assigned to Our Experts
          </div>
        </div>

        {/* RIGHT PANEL — message, stepper, dua, actions */}
        <div className="pt-8 lg:pt-2 px-1 sm:px-4">
          <h1 className="font-playfair italic text-2xl sm:text-4xl md:text-5xl text-[#e6c987] text-center leading-tight drop-shadow-lg">
            Your Sacred Journey is Submitted
          </h1>
          <p className="text-sm sm:text-base text-[#c5a059] text-center mt-2 font-playfair italic">
            Thank You for Choosing Umrah Plus • Bismillahi-r-Rahmani-r-Rahim
          </p>

          {/* Quote */}
          <div className="mt-6 rounded-xl border border-[#c5a059]/40 bg-[#c5a059]/[0.07] px-4 sm:px-6 py-4">
            <p className="text-sm sm:text-base text-[#e6c987] font-serif font-light italic leading-relaxed text-center">
              &ldquo;We have received your custom reservation details. Our dedicated Umrah specialists will reach back to you shortly to finalize your personalized itinerary and accommodations.&rdquo;
            </p>
          </div>

          {/* Stepper */}
          <div className="mt-8 mb-7">
            <div className="relative">
              <div className="absolute left-[16%] right-[16%] top-[11px] h-[2px] bg-gradient-to-r from-[#c5a059] via-[#f9e8a2] to-[#c5a059]/40" />
              <div className="relative grid grid-cols-3 gap-2 sm:gap-4 text-center">
                {steps.map((s, i) => (
                  <div key={s.n} className="flex flex-col items-center">
                    <span
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${
                        i === 0
                          ? 'bg-[#c5a059] border-[#f9e8a2] text-black shadow-[0_0_12px_rgba(197,160,89,0.6)]'
                          : 'bg-[#0c0d10] border-[#c5a059]/60 text-[#c5a059]'
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span className="mt-2.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#f3d38a]">
                      {s.n}
                    </span>
                    <span className="mt-1 text-[11px] sm:text-xs text-gray-300 font-light leading-snug px-1">
                      {s.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dua */}
          <div className="text-center mb-7">
            <p className="font-playfair text-2xl sm:text-3xl text-[#e6c987] leading-relaxed" dir="rtl" lang="ar">
              تَقَبَّلَ اللَّهُ مِنَّا وَمِنْكُمْ
            </p>
            <p className="text-xs sm:text-sm text-gray-300 font-light mt-2">
              May Allah accept your blessed intention &amp; facilitate your sacred journey. Amin.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center pb-2">
            <Link
              href="/"
              className="h-[46px] inline-flex items-center justify-center gap-2 bg-[#c5a059] hover:bg-[#d4b57a] text-black font-bold uppercase tracking-wider text-xs px-6 rounded-xl transition-all shadow-lg hover:shadow-[0_4px_20px_rgba(197,160,89,0.35)] whitespace-nowrap cursor-pointer"
            >
              <Home className="w-4 h-4" /> Go to Home
            </Link>

            <DownloadItineraryButton bookingId={bookingId || ''} />

            <Link
              href="/transportation"
              className="h-[46px] inline-flex items-center justify-center gap-2 bg-transparent border border-white/20 hover:border-[#c5a059]/70 hover:bg-[#c5a059]/10 text-white font-bold uppercase tracking-wider text-xs px-6 rounded-xl transition-all whitespace-nowrap cursor-pointer"
            >
              <Truck className="w-4 h-4 text-[#c5a059]" /> Explore Transportation
            </Link>
          </div>
        </div>
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

      <div className="flex-1 w-full mx-auto px-4 sm:px-6 py-10 md:py-14 flex flex-col items-center justify-center text-center">
        <Suspense fallback={<span className="text-white">Loading...</span>}>
          <ThankYouContent />
        </Suspense>
      </div>
    </main>
  );
}
