'use client';

import { Users, ListChecks, Building2, Car, Pencil, Check } from 'lucide-react';
import type { BookingState } from '../BookingController';
import type { CheckoutTotals } from './totals';
import RouteTrackerMap from './RouteTrackerMap';

interface BlessedSummaryProps {
  state: BookingState;
  type?: string;
  totals: CheckoutTotals;
  /** Confirmed-state checklist, e.g. ["Pilgrim of Al-Rahman", "Sacred Sites Confirmed"]. */
  checklist?: string[];
  /** Optional status line above the map, e.g. "Jeddah → Makkah → Madinah → MED". */
  statusLabel?: string;
  statusText?: string;
  showMap?: boolean;
  mapStatus?: string;
  onEditPilgrim?: () => void;
}

/**
 * The compact "Your Blessed Summary" rail from the checkout designs: core
 * trip rows, dual-currency estimate, confirmation checklist and the live
 * route tracker.
 */
export default function BlessedSummary({
  state,
  type,
  totals,
  checklist,
  statusLabel,
  statusText,
  showMap = true,
  mapStatus,
  onEditPilgrim,
}: BlessedSummaryProps) {
  const isZiyarat = type === 'Ziyarat';
  const isTransport = type === 'Transport';
  const routeCount = state.selectedZiyaratRoutes?.length || 0;
  const staysIncluded = !isZiyarat && !isTransport;
  const transportLabel = totals.hasTransport ? 'Included' : 'Self-arranged';

  const rows: { icon: React.ReactNode; label: string; value?: string }[] = [
    {
      icon: <Users className="w-3.5 h-3.5" />,
      label: `${state.passengerCount || state.adultsCount} Pilgrim${(state.passengerCount || state.adultsCount) > 1 ? 's' : ''}`,
    },
    ...(isZiyarat || (type === 'Umrah Plus' && routeCount > 0)
      ? [
          {
            icon: <ListChecks className="w-3.5 h-3.5" />,
            label: `${routeCount} Ziyarat Route${routeCount === 1 ? '' : 's'}`,
          },
        ]
      : []),
    ...(staysIncluded
      ? [{ icon: <Building2 className="w-3.5 h-3.5" />, label: '1 Accommodation' }]
      : []),
    {
      icon: <Car className="w-3.5 h-3.5" />,
      label: 'Transportation',
      value: transportLabel,
    },
  ];

  return (
    <div className="bg-[#0c0d10] border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
      <div>
        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#c5a059] block mb-3">
          Your Blessed Summary
        </span>

        <div className="space-y-2.5">
          {rows.map((row, i) => (
            <div key={i} className="flex items-center justify-between gap-2 text-xs">
              <span className="flex items-center gap-2 text-gray-300 font-light">
                <span className="text-[#c5a059]">{row.icon}</span>
                {row.label}
              </span>
              {row.value ? (
                <span className="text-[10px] text-gray-400 font-light">{row.value}</span>
              ) : i === 0 && onEditPilgrim ? (
                <button
                  type="button"
                  onClick={onEditPilgrim}
                  className="flex items-center gap-1 text-[10px] text-[#c5a059] uppercase tracking-wider font-semibold hover:text-[#f3d38a] cursor-pointer"
                >
                  <Pencil className="w-3 h-3" /> Edit
                </button>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10 pt-3 space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400 font-light">Estimated Total:</span>
          <span className="font-bold text-[#f9e8a2]">{totals.estTotalLabel}</span>
        </div>
        {totals.ziyaratFaresLabel && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400 font-light">Ziyarat Fares:</span>
            <span className="font-bold text-[#f9e8a2]">{totals.ziyaratFaresLabel}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400 font-light">Custom Options:</span>
          <span className="font-semibold text-[#c5a059]">Custom</span>
        </div>
      </div>

      {checklist && checklist.length > 0 && (
        <div className="border-t border-white/10 pt-3 space-y-2">
          {checklist.map(item => (
            <div key={item} className="flex items-center gap-2 text-[11px] text-gray-300 font-light">
              <span className="w-4 h-4 rounded-[4px] bg-[#0f7a4d]/20 border border-[#0f7a4d] flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-emerald-400" />
              </span>
              {item}
            </div>
          ))}
        </div>
      )}

      {statusLabel && statusText && (
        <div className="border-t border-white/10 pt-3">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#c5a059] block mb-1">
            {statusLabel}
          </span>
          <span className="text-[11px] text-gray-300 font-light">{statusText}</span>
        </div>
      )}

      {showMap && <RouteTrackerMap status={mapStatus} className="h-44 sm:h-52" />}
    </div>
  );
}
