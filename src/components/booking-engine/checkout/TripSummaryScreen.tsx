'use client';

import { Plus, ArrowLeft } from 'lucide-react';
import type { BookingState } from '../BookingController';
import ItinerarySummary from '../ItinerarySummary';
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
  /** Jump directly to a specific step to edit */
  onEditStep?: (step: number) => void;
  /** Navigate back to the homepage search widget */
  onBackToWidget?: () => void;
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
  onEditStep,
  onBackToWidget,
}: TripSummaryScreenProps) {
  const isUmrahPlus = type === 'Umrah Plus';
  const isZiyarat = type === 'Ziyarat';
  const routesStep = isZiyarat ? 1 : 2;

  return (
    <div>
      <PhaseBreadcrumb active={2} />

      <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">
        {/* ── Main itinerary report (now wider) ── */}
        <div className="min-w-0 bg-[#0c0d10] border border-[#c5a059]/35 rounded-2xl p-5 sm:p-7 shadow-xl">
          <ItinerarySummary
            state={state}
            type={type}
            ziyaratPkgParams={ziyaratPkgParams}
            variant="page"
            onEditStep={onEditStep}
          />

          {isUmrahPlus && !state.skipZiyarat && (
            <button
              type="button"
              onClick={() => (onEditStep ? onEditStep(4) : onBack())}
              className="mt-5 w-full rounded-xl border border-dashed border-[#c5a059]/50 bg-black/30 text-[#f3d38a] text-xs font-semibold uppercase tracking-widest py-3 flex items-center justify-center gap-2 hover:bg-[#c5a059]/10 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Ziyarat Route
            </button>
          )}
        </div>

        {/* ── Blessed Summary rail ── */}
        <aside className="lg:sticky lg:top-32 space-y-5">
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
            mapStatus="Planned"
            onEditPilgrim={onEditStep ? () => onEditStep(1) : undefined}
            onEditRoute={onEditStep ? () => onEditStep(routesStep) : undefined}
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
          onClick={onBackToWidget || onBack}
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest font-semibold text-gray-400 hover:text-[#c5a059] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Search Widget
        </button>
      </div>
    </div>
  );
}
