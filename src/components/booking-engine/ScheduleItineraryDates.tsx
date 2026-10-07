'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Check, Clock, Compass, Sparkles } from 'lucide-react';
import Image from 'next/image';
import type { BookingState } from './BookingController';
import DateInputField from './DateInputField';
import { formatDateDDMMYYYY } from '@/lib/utils';
import {
  ZIYARAT_ROUTES,
  ZIYARAT_SITES,
  ZIYARAT_CITIES_DATA,
} from '@/data/ziyaratBuilderData';

interface ScheduleItineraryDatesProps {
  step: number;
  totalSteps: number;
  state: BookingState;
  updateState: (
    updates: Partial<BookingState> | ((prev: BookingState) => Partial<BookingState>)
  ) => void;
}

function routeThumb(routeId: string): string {
  const route = ZIYARAT_ROUTES.find(r => r.id === routeId);
  if (!route) return '';
  const siteImg = route.siteIds.map(id => ZIYARAT_SITES[id]?.image).find(Boolean);
  const city = ZIYARAT_CITIES_DATA.find(c => c.id === route.cityId);
  return siteImg || city?.image || '';
}

function toISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * S5 design — Step "Schedule Itinerary Dates": filter pills, Smart Schedule,
 * per-route travel dates with day suggestions and the Morning/Afternoon
 * preference toggle.
 */
export default function ScheduleItineraryDates({
  step,
  totalSteps,
  state,
  updateState,
}: ScheduleItineraryDatesProps) {
  const [filter, setFilter] = useState<'all' | 'needs' | 'scheduled'>('all');

  const todayStr = new Date().toISOString().split('T')[0];
  const routeIds = state.selectedZiyaratRoutes || [];
  const dates = state.selectedZiyaratRouteDates || {};
  const timeOfDay = state.routeTimeOfDay || {};

  const scheduledCount = routeIds.filter(id => {
    const d = dates[id];
    return Boolean(d && d >= todayStr);
  }).length;
  const needsCount = routeIds.length - scheduledCount;

  // Journey anchor used for the "Day N" recommendation.
  const journeyStartStr =
    state.makkahCheckInDate && state.makkahCheckInDate >= todayStr
      ? state.makkahCheckInDate
      : (Object.values(dates).filter(d => d && d >= todayStr).sort()[0] || '');

  const smartSchedule = () => {
    if (routeIds.length === 0) return;
    const nextDates: Record<string, string> = { ...dates };

    let anchor = journeyStartStr;
    if (!anchor) {
      const d = new Date();
      d.setDate(d.getDate() + 7);
      anchor = toISO(d);
    }

    // Consecutive optimal days starting from the anchor; already-confirmed
    // future dates are preserved.
    const cursor = new Date(`${anchor}T00:00:00`);
    for (const id of routeIds) {
      const existing = nextDates[id];
      if (existing && existing >= todayStr) continue;
      nextDates[id] = toISO(cursor);
      cursor.setDate(cursor.getDate() + 1);
    }
    updateState({ selectedZiyaratRouteDates: nextDates });
  };

  const visibleIds = routeIds.filter(id => {
    const d = dates[id];
    const scheduled = Boolean(d && d >= todayStr);
    if (filter === 'scheduled') return scheduled;
    if (filter === 'needs') return !scheduled;
    return true;
  });

  const pillClass = (active: boolean) =>
    `px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
      active
        ? 'bg-[#c5a059] border-[#c5a059] text-black'
        : 'bg-black/40 border-white/15 text-gray-300 hover:border-[#c5a059]/50 hover:text-[#f3d38a]'
    }`;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-[#0c0d10] border border-[#c5a059]/40 rounded-2xl p-5 sm:p-6 shadow-[0_0_30px_rgba(197,160,89,0.08)]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4 mb-4">
          <div>
            <h4 className="text-sm font-bold tracking-wider text-[#c5a059] uppercase flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#c5a059]" />
              Schedule Date for Each Selected Itinerary ({routeIds.length})
            </h4>
            <p className="text-xs text-gray-400 font-light mt-1">
              Step {step} of {totalSteps} — please specify your planned travel date for each holy
              tour. Past dates are disabled.
            </p>
          </div>
          <span className="text-[11px] text-amber-400/90 font-medium bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full whitespace-nowrap self-start sm:self-center">
            Must be today or future date
          </span>
        </div>

        {/* Filter pills + Smart Schedule */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-5">
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setFilter('all')} className={pillClass(filter === 'all')}>
              Show All ({routeIds.length})
            </button>
            <button type="button" onClick={() => setFilter('needs')} className={pillClass(filter === 'needs')}>
              Needs Date ({needsCount})
            </button>
            <button type="button" onClick={() => setFilter('scheduled')} className={pillClass(filter === 'scheduled')}>
              Scheduled ({scheduledCount})
            </button>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 lg:gap-3">
            <span className="text-[11px] text-gray-400 font-light flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#c5a059] shrink-0" />
              Try &lsquo;Smart Schedule&rsquo; to automatically assign optimal travel dates.
            </span>
            <button
              type="button"
              onClick={smartSchedule}
              disabled={routeIds.length === 0}
              className="shrink-0 bg-gradient-to-r from-[#c5a059] to-[#e9cf8f] text-black text-[11px] font-bold uppercase tracking-widest px-4 py-2 rounded-full hover:brightness-110 transition-all disabled:opacity-40 cursor-pointer"
            >
              Smart Schedule
            </button>
          </div>
        </div>

        {/* Route rows */}
        {routeIds.length === 0 ? (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs text-center">
            No itineraries selected yet. Please go back to Step 1 to select your Ziyarat routes.
          </div>
        ) : visibleIds.length === 0 ? (
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-xs text-center">
            {filter === 'scheduled'
              ? 'No routes scheduled yet — use Smart Schedule or pick dates below.'
              : 'Every route already has a confirmed travel date.'}
          </div>
        ) : (
          <div className="space-y-3">
            {visibleIds.map((rId, idx) => {
              const r = ZIYARAT_ROUTES.find(route => route.id === rId);
              if (!r) return null;
              const curDate = dates[rId] || '';
              const isScheduled = Boolean(curDate && curDate >= todayStr);
              const isActive = !isScheduled && visibleIds.findIndex(id => {
                const d = dates[id];
                return !(d && d >= todayStr);
              }) === idx;

              // Recommended day derived from the journey anchor.
              const anchorDate = journeyStartStr ? new Date(`${journeyStartStr}T00:00:00`) : null;
              if (anchorDate) anchorDate.setDate(anchorDate.getDate() + routeIds.indexOf(rId));
              const recommendStr = anchorDate
                ? `${formatDateDDMMYYYY(toISO(anchorDate))} (Day ${routeIds.indexOf(rId) + 1})`
                : '';

              const pref = timeOfDay[rId] || '';

              return (
                <div key={rId} className="relative pl-7 sm:pl-9">
                  {/* Timeline dot + connector */}
                  {idx < visibleIds.length - 1 && (
                    <span className="absolute left-[11px] sm:left-[15px] top-12 bottom-[-12px] w-px bg-white/10" />
                  )}
                  <span
                    className={`absolute left-0 sm:left-1.5 top-6 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                      isScheduled
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : isActive
                          ? 'bg-[#c5a059] border-[#c5a059] text-black'
                          : 'bg-[#1a1c22] border-white/20 text-gray-500'
                    }`}
                  >
                    {isScheduled ? <Check className="w-3 h-3" /> : routeIds.indexOf(rId) + 1}
                  </span>

                  <div
                    className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center gap-4 ${
                      isScheduled
                        ? 'bg-[#131c2a]/90 border-white/10'
                        : isActive
                          ? 'bg-[#1a1c22] border-[#c5a059] shadow-[0_0_15px_rgba(197,160,89,0.15)] ring-1 ring-[#c5a059]/30'
                          : 'bg-[#1a1c22] border-white/10'
                    }`}
                  >
                    {/* Thumb + route info */}
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-[#c5a059]/30 shrink-0">
                        <Image
                          src={routeThumb(rId)}
                          alt={r.name}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-[10px] uppercase font-bold text-[#c5a059] tracking-wider">
                            {r.cityName} • {r.duration}
                          </span>
                          {isScheduled ? (
                            <span className="text-[9px] uppercase font-bold tracking-wider bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 px-2 py-0.5 rounded">
                              Completed
                            </span>
                          ) : isActive ? (
                            <span className="text-[9px] uppercase font-bold tracking-wider bg-[#c5a059]/15 border border-[#c5a059]/40 text-[#f3d38a] px-2 py-0.5 rounded">
                              Active
                            </span>
                          ) : null}
                        </div>
                        <h5 className="text-white font-bold text-sm leading-snug">{r.name}</h5>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          <span className="text-[10px] text-gray-400 font-light">
                            {r.siteIds.length} Sacred Sites Included
                          </span>
                          <span className="text-[9px] text-[#f9e8a2] bg-black/40 border border-[#c5a059]/30 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <Compass className="w-2.5 h-2.5" /> Spiritual Sites
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Date + preference */}
                    <div className="flex flex-col gap-2 shrink-0 w-full md:w-56">
                      <label
                        htmlFor={`date-input-${rId}`}
                        className="text-[10px] text-gray-300 uppercase tracking-wider font-semibold flex items-center justify-between gap-1.5 cursor-pointer"
                      >
                        <span>Travel Date *</span>
                        {isScheduled ? (
                          <span className="text-emerald-400 font-bold text-[10px] flex items-center gap-0.5">
                            <Check className="w-3 h-3" /> Date Confirmed
                          </span>
                        ) : (
                          <span className="text-amber-400 font-bold text-[10px]">Required</span>
                        )}
                      </label>
                      <DateInputField
                        id={`date-input-${rId}`}
                        min={todayStr}
                        required
                        value={curDate}
                        placeholder="DD.MM.YYYY"
                        isValid={isScheduled}
                        hasError={!isScheduled}
                        onChange={isoVal => {
                          updateState({
                            selectedZiyaratRouteDates: {
                              ...(state.selectedZiyaratRouteDates || {}),
                              [rId]: isoVal,
                            },
                          });
                        }}
                      />
                      {!isScheduled && recommendStr && (
                        <span className="text-[10px] text-amber-300/90 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          Suggested: {recommendStr}
                        </span>
                      )}

                      {/* Morning / Afternoon preference */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider">Optional</span>
                        <div className="flex rounded-lg overflow-hidden border border-white/15">
                          <button
                            type="button"
                            onClick={() =>
                              updateState({
                                routeTimeOfDay: { ...timeOfDay, [rId]: 'morning' },
                              })
                            }
                            className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer ${
                              pref === 'morning'
                                ? 'bg-[#c5a059] text-black'
                                : 'bg-black/40 text-gray-300 hover:text-[#f3d38a]'
                            }`}
                          >
                            <Clock className="w-3 h-3" /> Morning
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              updateState({
                                routeTimeOfDay: { ...timeOfDay, [rId]: 'afternoon' },
                              })
                            }
                            className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors border-l border-white/15 cursor-pointer ${
                              pref === 'afternoon'
                                ? 'bg-[#c5a059] text-black'
                                : 'bg-black/40 text-gray-300 hover:text-[#f3d38a]'
                            }`}
                          >
                            <Clock className="w-3 h-3" /> Afternoon
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
