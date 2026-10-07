import type { BookingState } from '../BookingController';
import { ZIYARAT_PRICES, getZiyaratRouteFare, getZiyaratAllocatedQuantity } from '@/data/ziyaratBuilderData';

export interface CheckoutTotals {
  hasTransport: boolean;
  hasZiyarat: boolean;
  transportAed: number;
  ziyaratSar: number;
  hasCustomZiyarat: boolean;
  ctaCurrency: 'AED' | 'SAR';
  ctaLabel: string;
  estTotalLabel: string;
  ziyaratFaresLabel: string | null;
}

/**
 * Single source of truth for the checkout currency display.
 * Transport legs are quoted in AED, Ziyarat route fares in SAR. Both are shown
 * when both exist; the CTA price chip uses AED whenever transport is part of
 * the booking, otherwise the SAR ziyarat total.
 */
export function computeCheckoutTotals(state: BookingState, type?: string): CheckoutTotals {
  const isTransport = type === 'Transport';
  const isZiyarat = type === 'Ziyarat';
  const isUmrahPlus = type === 'Umrah Plus';

  const hasTransport =
    isTransport ||
    (isUmrahPlus && !state.skipTransport) ||
    (!isZiyarat && !isUmrahPlus && state.selectedUpsells.includes('transport'));

  const routeIds: string[] =
    isZiyarat || isUmrahPlus
      ? state.selectedZiyaratRoutes || []
      : state.selectedUpsells.filter(id => id !== 'transport');

  const hasZiyarat = routeIds.length > 0;

  let ziyaratSar = 0;
  let hasCustomZiyarat = false;

  if (isZiyarat || isUmrahPlus) {
    const vehicleId = state.selectedVehicle || 'sedan';
    const qty = getZiyaratAllocatedQuantity(
      vehicleId,
      isUmrahPlus,
      state.adultsCount,
      state.childrenCount,
      state.passengerCount
    );
    for (const rId of routeIds) {
      const price = ZIYARAT_PRICES[rId];
      if (price?.custom) {
        hasCustomZiyarat = true;
        continue;
      }
      const fare = getZiyaratRouteFare(rId, vehicleId);
      if (fare) ziyaratSar += fare * qty;
      else hasCustomZiyarat = true;
    }
  } else if (hasZiyarat) {
    // Regular Umrah ziyarat add-ons are quoted by the specialists.
    hasCustomZiyarat = true;
  }

  const transportAed = hasTransport ? state.calculatedTransportPrice || 0 : 0;

  const ctaCurrency: 'AED' | 'SAR' = hasTransport ? 'AED' : 'SAR';

  let ctaLabel: string;
  if (hasTransport) {
    ctaLabel = `AED ${transportAed}`;
  } else if (ziyaratSar > 0) {
    ctaLabel = `SAR ${ziyaratSar}${hasCustomZiyarat ? '+' : ''}`;
  } else {
    ctaLabel = 'Custom Plan';
  }

  let estTotalLabel: string;
  if (hasTransport) {
    estTotalLabel = `AED ${transportAed}`;
  } else if (ziyaratSar > 0) {
    estTotalLabel = `SAR ${ziyaratSar}${hasCustomZiyarat ? '+' : ''}`;
  } else {
    estTotalLabel = hasZiyarat ? 'Custom' : 'On Consultation';
  }

  const ziyaratFaresLabel = hasTransport && ziyaratSar > 0 ? `SAR ${ziyaratSar}` : null;

  return {
    hasTransport,
    hasZiyarat,
    transportAed,
    ziyaratSar,
    hasCustomZiyarat,
    ctaCurrency,
    ctaLabel,
    estTotalLabel,
    ziyaratFaresLabel,
  };
}

/** Whole days from today until the given ISO date (YYYY-MM-DD), or null. */
export function daysUntil(dateStr?: string | null): number | null {
  if (!dateStr) return null;
  const target = new Date(`${dateStr.slice(0, 10)}T00:00:00`);
  if (Number.isNaN(target.getTime())) return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / 86_400_000);
}

/** First journey date available for countdown / smart scheduling. */
export function firstJourneyDate(state: BookingState): string {
  const routeDates = Object.values(state.selectedZiyaratRouteDates || {})
    .filter(Boolean)
    .sort();
  return (
    routeDates[0] ||
    state.makkahCheckInDate ||
    state.fixedRouteLegs?.[0]?.date ||
    state.pointToPointPickupDate ||
    ''
  );
}
