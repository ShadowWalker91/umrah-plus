'use client';

import Image from 'next/image';
import { Pencil, Plus, ArrowLeft } from 'lucide-react';
import type { BookingState } from '../BookingController';
import ItinerarySummary from '../ItinerarySummary';
import { ZIYARAT_ROUTES, ZIYARAT_CITIES_DATA } from '@/data/ziyaratBuilderData';
import type { CheckoutTotals } from './totals';
import { PhaseBreadcrumb } from './StepHeader';
import BlessedSummary from './BlessedSummary';
import BottomBar from './BottomBar';

interface TripSummaryScreenProps {
  state: BookingState;
  type?: string;
  ziyaratPkgParams?: unknown;
  totals: CheckoutTotals;
  /** Returns to the last booking step (edit mode). */
  onBack: () => void;
  /** Enters the checkout phase. */
  onProceed: () => void;
}

/**
 * S2 / S3 design — the full-page Trip Summary hand-off between the booking
 * steps and the checkout flow: breadcrumb, left "Edit Routes" rail, the rich
 * itinerary report and the Blessed Summary rail with the route tracker.
 */
export default function TripSummaryScreen({
  state,
  type,
  ziyaratPkgParams,
  totals,
  onBack,
  onProceed,
}: TripSummaryScreenProps) {
  const isUmrahPlus = type === 'Umrah Plus';
  const routes = (state.selectedZiyaratRoutes || [])
    .map(id => ZIYARAT_ROUTES.find(r => r.id === id))
    .filter(Boolean) as { id: string; cityId: string; cityName: string; name: string; duration: string; siteIds: string[] }[];

  // Thumbnails for the left rail: route city images, else the Makkah covers.
  const thumbs = (
    routes.length > 0
      ? Array.from(new Set(routes.map(r => r.cityId))).map(
          id => ZIYARAT_CITIES_DATA.find(c => c.id === id)?.image
        )
      : ['/assets/images/ziyarat/MakkahZiyaratCover.webp', '/assets/images/ziyarat/MadinahZiyaratCover.webp']
  ).filter(Boolean).slice(0, 3) as string[];

  return (
    <div>
      <PhaseBreadcrumb active={2} />

      <div className="grid xl:grid-cols-[120px_minmax(0,1fr)_300px] gap-5 items-start">
        {/* ── Left rail: edit routes & stay thumbnails ── */}
        <aside className="hidden xl:flex flex-col gap-3 sticky top-32">
          <div className="rounded-xl border border-[#c5a059]/40 bg-[#0c0d10] p-3 flex flex-col items-center gap-2">
            <Image
              src="/assets/images/homepage/ziyarat-section/ziyarat-calligraphy.png"
              alt="Umrah Plus"
              width={72}
              height={72}
              className="w-16 h-16 object-contain"
            />
          </div>
          <button
            type="button"
            onClick={onBack}
            className="rounded-xl border border-[#c5a059]/60 bg-[#0c0d10] text-[#f3d38a] text-[10px] font-bold uppercase tracking-widest py-2.5 flex items-center justify-center gap-1.5 hover:bg-[#c5a059] hover:text-black transition-colors cursor-pointer"
          >
            <Pencil className="w-3 h-3" /> Edit Routes
          </button>
          {thumbs.map((img, i) => (
            <div key={i} className="relative rounded-lg overflow-hidden border border-white/10 h-14">
              <Image src={img} alt="" fill sizes="120px" className="object-cover" />
            </div>
          ))}
          {!state.includeMadinah && type !== 'Transport' && type !== 'Ziyarat' && (
            <span className="text-[9px] text-gray-500 italic text-center leading-tight">
              Madinah stay not included
            </span>
          )}
        </aside>

        {/* ── Main itinerary report ── */}
        <div className="min-w-0 bg-[#0c0d10] border border-[#c5a059]/35 rounded-2xl p-5 sm:p-7 shadow-xl">
          <ItinerarySummary
            state={state}
            type={type}
            ziyaratPkgParams={ziyaratPkgParams}
            variant="page"
          />

          {isUmrahPlus && !state.skipZiyarat && (
            <button
              type="button"
              onClick={onBack}
              className="mt-5 w-full rounded-xl border border-dashed border-[#c5a059]/50 bg-black/30 text-[#f3d38a] text-xs font-semibold uppercase tracking-widest py-3 flex items-center justify-center gap-2 hover:bg-[#c5a059]/10 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Ziyarat Route
            </button>
          )}
        </div>

        {/* ── Blessed Summary rail ── */}
        <aside className="xl:sticky xl:top-32 space-y-5">
          <BlessedSummary
            state={state}
            type={type}
            totals={totals}
            checklist={[
              'Pilgrim of Al-Rahman',
              'Sacred Sites Confirmed',
              "Pre-Journey Du'a List",
            ]}
            statusLabel="Route Tracker"
            statusText="Jeddah → Makkah → Madinah"
            mapStatus="Planned"
          />
        </aside>
      </div>

      <BottomBar
        onBack={onBack}
        onNext={onProceed}
        nextLabel="Proceed to Checkout"
        priceChip={totals.ctaLabel}
        backLabel="Go Back"
      />

      <div className="mt-4 flex justify-center">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest font-semibold text-gray-400 hover:text-[#c5a059] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Search Widget
        </button>
      </div>
    </div>
  );
}
