'use client';

import { url } from 'inspector';
import Image from 'next/image';

interface CheckoutBannerProps {
  title: string;
  /** Second display line, e.g. "Labbaik Allahumma Labbaik". */
  subtitle?: string;
  /** Formatted journey date range, e.g. "24.11.2026 — 30.11.2026". */
  dates?: string | null;
  /** Whole days until the journey starts; renders the countdown strip. */
  countdownDays?: number | null;
  countdownNote?: string;
  variant?: 'ornate' | 'plain';
}

/**
 * The decorative checkout header: an arched frame built from the Makkah &
 * Madinah cover art, the Bismillah line, the journey title and the
 * "In sha Allah … begins in N Days" countdown strip.
 */
export default function CheckoutBanner({
  title,
  subtitle,
  dates,
  countdownDays,
  countdownNote = 'May Allah accept your Blessed Journey.',
  variant = 'ornate',
}: CheckoutBannerProps) {
  const showCountdown = typeof countdownDays === 'number' && countdownDays >= 0;
  const ornate = variant === 'ornate';

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-[#c5a059]/30 bg-[#0c0d10] mb-7 shadow-[0_10px_40px_rgba(0,0,0,0.45)]" style={{backgroundImage: "url('/assets/images/banner.png')"}}>
      {/* Arched side imagery */}
      {ornate && (
        <>
          {/* <div className="absolute inset-y-0 left-0 w-[26%] min-w-[110px]">
            <Image
              src="/assets/images/ziyarat/MakkahZiyaratCover.webp"
              alt=""
              fill
              sizes="30vw"
              className="object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0c0d10]/60 via-[#0c0d10]/30 to-[#0c0d10]" />
            <div className="absolute inset-y-3 left-3 right-0 rounded-t-[999px] border border-x border-t border-[#c5a059]/50 pointer-events-none" />
            <div className="absolute inset-y-6 left-7 right-0 rounded-t-[999px] border border-x border-t border-[#c5a059]/25 pointer-events-none" />
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
            <div className="absolute inset-y-6 right-7 left-0 rounded-t-[999px] border border-x border-t border-[#c5a059]/25 pointer-events-none" />
          </div> */}
        </>
      )}

      <div className={`relative px-4 sm:px-8 ${ornate ? 'pt-7 pb-6' : 'py-6'} text-center`}>
        <div className="text-[#c5a059] text-xl sm:text-2xl leading-none mb-2 select-none" aria-hidden>
          ﷽
        </div>
        <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#c5a059] mb-2 font-semibold">
          Bismillahi-r-Rahmani-r-Rahim
        </p>
        <h1 className="font-playfair italic text-xl sm:text-3xl md:text-4xl text-[#e6c987] drop-shadow-lg">
          {title}
        </h1>
        {subtitle && (
          <p className="font-playfair italic text-sm sm:text-lg md:text-xl text-[#c5a059] mt-1.5">
            {subtitle}
          </p>
        )}
        {dates && (
          <p className="text-[11px] sm:text-xs tracking-[0.25em] text-gray-300 mt-2.5 uppercase">
            {dates}
          </p>
        )}
      </div>

      {showCountdown && (
        <div className="relative px-4 sm:px-8 pb-5">
          <div className="mx-auto max-w-3xl rounded-xl border border-[#c5a059]/40 bg-black/50 px-4 py-2.5 text-center">
            <span className="text-xs sm:text-sm text-[#f3d38a] font-light">
              <span className="mr-1.5">⏳</span>
              In sha Allah, your Sacred Journey begins in{' '}
              <strong className="font-bold text-[#f9e8a2]">{countdownDays} Day{countdownDays === 1 ? '' : 's'}</strong>!
              {countdownNote ? ` ${countdownNote}` : ''}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
