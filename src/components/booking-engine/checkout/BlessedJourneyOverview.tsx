'use client';

import Image from 'next/image';
import { Plane, MapPin, Star, Heart, Plus, Compass, Car, Sparkles } from 'lucide-react';
import type { BookingState } from '../BookingController';
import { ZIYARAT_ROUTES, ZIYARAT_SITES, ZIYARAT_FLEET, ZIYARAT_CITIES_DATA, ZIYARAT_PRICES, getZiyaratRouteFare, getZiyaratAllocatedQuantity } from '@/data/ziyaratBuilderData';
import type { CheckoutTotals } from './totals';
import BlessedSummary from './BlessedSummary';
import BottomBar from './BottomBar';

interface BlessedJourneyOverviewProps {
  state: BookingState;
  type?: string;
  totals: CheckoutTotals;
  onBack: () => void;
  onProceed: () => void;
}

function routeImage(routeId: string): string {
  const route = ZIYARAT_ROUTES.find(r => r.id === routeId);
  if (!route) return '';
  const firstSite = route.siteIds.map(id => ZIYARAT_SITES[id]?.image).find(Boolean);
  const city = ZIYARAT_CITIES_DATA.find(c => c.id === route.cityId);
  return firstSite || city?.image || '';
}

/**
 * S1 design — the "Blessed Journey" overview shown as the Ziyarat flow's
 * trip-summary hand-off: countdown, stacked Sacred Ziyarats / Transportation
 * cards, the Blessed Summary rail and the BOOK THIS SACRED JOURNEY bar.
 */
export default function BlessedJourneyOverview({
  state,
  type,
  totals,
  onBack,
  onProceed,
}: BlessedJourneyOverviewProps) {
  const routes = (state.selectedZiyaratRoutes || [])
    .map(id => ZIYARAT_ROUTES.find(r => r.id === id))
    .filter(Boolean) as NonNullable<ReturnType<typeof ZIYARAT_ROUTES.find>>[];

  const vehicleId = state.selectedVehicle || 'sedan';
  const vehicle = ZIYARAT_FLEET.find(v => v.id === vehicleId);
  const fleetQty = getZiyaratAllocatedQuantity(
    vehicleId,
    type === 'Umrah Plus',
    state.adultsCount,
    state.childrenCount,
    state.passengerCount
  );

  // Ordered unique city stops for the transit line (Makkah ➔ Taif ➔ Madinah).
  const cityOrder = ['mak', 'taif', 'mad'];
  const cityStops = Array.from(new Set(routes.map(r => r.cityId)))
    .sort((a, b) => cityOrder.indexOf(a) - cityOrder.indexOf(b))
    .map(id => ZIYARAT_CITIES_DATA.find(c => c.id === id))
    .filter((c): c is NonNullable<typeof c> => c !== undefined);

  const siteCount = routes.reduce((sum, r) => sum + r.siteIds.length, 0);

  return (
    <div>
      <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">
        <div className="space-y-5 min-w-0">
          {/* ── Sacred Ziyarats & Historical Encounters ── */}
          <section className="bg-[#0c0d10] border border-[#c5a059]/35 rounded-2xl p-5 sm:p-6 shadow-xl">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3.5 mb-4">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-[0.15em] text-[#c5a059] flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Sacred Ziyarats &amp; Historical Encounters
              </h3>
              <div className="flex items-center gap-2.5 text-[#c5a059]">
                <Star className="w-4 h-4 fill-[#c5a059]" />
                <MapPin className="w-4 h-4" />
                <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
              </div>
            </div>

            {routes.length === 0 ? (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs text-center">
                No Ziyarat routes selected yet — go back to choose your sacred journeys.
              </div>
            ) : (
              <>
                <div className="flex gap-4 overflow-x-auto pb-3 -mx-1 px-1 snap-x" style={{ scrollbarWidth: 'thin' }}>
                  {routes.map((r, idx) => {
                    const fare = getZiyaratRouteFare(r.id, vehicleId);
                    const price = formatRouteFare(r.id, fare, fleetQty);
                    return (
                      <div
                        key={r.id}
                        className="relative snap-start shrink-0 w-[240px] sm:w-[280px] rounded-xl overflow-hidden border border-white/10 group"
                      >
                        <div className="relative h-40">
                          <Image
                            src={routeImage(r.id)}
                            alt={r.name}
                            fill
                            sizes="280px"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
                          <span className="absolute top-2 right-2 bg-black/70 border border-[#c5a059]/40 text-[#f9e8a2] text-[10px] font-bold px-2 py-1 rounded-md">
                            {r.duration}
                          </span>
                          {idx === 0 && (
                            <span className="absolute top-2 left-2 bg-[#0f7a4d] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">
                              Most Loved
                            </span>
                          )}
                          <div className="absolute bottom-2.5 left-3 right-3">
                            <span className="text-[10px] uppercase font-bold text-[#c5a059] tracking-wider block">
                              {r.cityName}
                            </span>
                            <span className="text-white font-bold text-sm leading-tight block">
                              {r.name}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between bg-black/60 px-3 py-2">
                          <span className="text-[10px] text-gray-300 font-light">
                            {r.siteIds.length} Sacred Sites
                          </span>
                          {price && <span className="text-[11px] font-bold text-[#f9e8a2]">{price}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={onBack}
                  className="mt-3 w-full rounded-xl border border-dashed border-[#c5a059]/50 bg-black/30 text-[#f3d38a] text-xs font-semibold uppercase tracking-widest py-3 flex items-center justify-center gap-2 hover:bg-[#c5a059]/10 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Explore More Sacred Sites
                </button>
              </>
            )}

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 text-[11px] text-gray-400 font-light">
              <Compass className="w-3.5 h-3.5 text-[#c5a059]" />
              {siteCount} sacred sites across {routes.length} route{routes.length === 1 ? '' : 's'} selected
            </div>
          </section>

          {/* ── Transportation / Sacred Paths ── */}
          <section className="bg-[#0c0d10] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3.5 mb-5">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-[0.15em] text-[#c5a059] flex items-center gap-2">
                <Car className="w-4 h-4" />
                Transportation
              </h3>
              <span className="text-[10px] uppercase tracking-wider text-gray-400">Transit &amp; Sacred Paths</span>
            </div>

            {/* Transit line: Airport ➔ cities ➔ Airport */}
            <div className="flex items-center justify-between gap-1 mb-4">
              <span className="w-9 h-9 rounded-full bg-[#c5a059]/15 border border-[#c5a059]/40 flex items-center justify-center text-[#c5a059] shrink-0">
                <Plane className="w-4 h-4" />
              </span>
              <span className="h-[3px] flex-1 bg-gradient-to-r from-[#c5a059] via-[#e2b455] to-[#c5a059]/40 rounded-full" />
              {cityStops.map(c => (
                <span key={c.id} className="flex items-center gap-1.5 shrink-0">
                  <span className="w-9 h-9 rounded-full bg-[#c5a059]/15 border border-[#c5a059]/40 flex items-center justify-center text-[#c5a059]">
                    <MapPin className="w-4 h-4" />
                  </span>
                  <span className="hidden sm:block text-[10px] uppercase tracking-wider text-gray-300 font-semibold max-w-[70px] leading-tight">
                    {c.shortName}
                  </span>
                </span>
              ))}
              <span className="h-[3px] flex-1 bg-gradient-to-r from-[#c5a059]/40 via-[#e2b455] to-[#c5a059] rounded-full" />
              <span className="w-9 h-9 rounded-full bg-[#c5a059]/15 border border-[#c5a059]/40 flex items-center justify-center text-[#c5a059] shrink-0">
                <Plane className="w-4 h-4 rotate-90" />
              </span>
            </div>

            <p className="text-xs text-gray-300 font-light">
              Jeddah Airport{' '}
              <span className="text-[#c5a059] font-semibold">→</span>{' '}
              {cityStops.length > 0 ? cityStops.map(c => c.shortName).join(' ➔ ') : 'Sacred Ziyarat Routes'}{' '}
              <span className="text-gray-500 italic">(The Sacred Arrival)</span>
            </p>

            {vehicle && (
              <div className="mt-4 flex items-center justify-between bg-[#1a1c22] border border-white/5 rounded-xl px-4 py-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Car className="w-4 h-4 text-[#c5a059] shrink-0" />
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-white block truncate">
                      {fleetQty > 1 ? `${fleetQty}× ` : ''}{vehicle.name}
                    </span>
                    <span className="text-[10px] text-gray-400 font-light">
                      Private chauffeur · up to {vehicle.capacity} pax
                    </span>
                  </div>
                </div>
                <span className="text-[10px] bg-[#c5a059]/15 border border-[#c5a059]/30 text-[#f9e8a2] font-bold px-2.5 py-1 rounded-md shrink-0 ml-3">
                  Guaranteed
                </span>
              </div>
            )}
          </section>
        </div>

        {/* ── Blessed Summary rail ── */}
        <aside className="lg:sticky lg:top-32 space-y-5">
          <BlessedSummary
            state={state}
            type={type}
            totals={totals}
            checklist={[
              `Pilgrim of Ar-Rahman`,
              'Sacred Sites Confirmed',
              'Spiritual Ziyarats Included',
              "Pre-Journey Du'a List",
            ]}
            statusLabel="Live Dynamic Route Tracker"
            statusText="Jeddah → Makkah → Madinah"
            mapStatus="Tracked"
          />
        </aside>
      </div>

      <BottomBar
        onBack={onBack}
        onNext={onProceed}
        nextLabel="Book This Sacred Journey"
        priceChip={totals.ctaLabel}
      />
    </div>
  );
}

/** Formats a route fare chip: "SAR 1410" (× fleet), or the custom-plan label. */
function formatRouteFare(routeId: string, fare: number | null, qty: number): string | null {
  if (fare) return `SAR ${fare * qty}`;
  const p = ZIYARAT_PRICES[routeId];
  return p?.custom ? 'Custom Plan' : null;
}
