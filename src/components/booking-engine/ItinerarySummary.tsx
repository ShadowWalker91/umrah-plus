'use client';

import { 
  BookingState, 
  VEHICLES, 
  HOTEL_CATEGORIES, 
  UPSELLS, 
  PACKAGES, 
  ZIYARAT_CITIES, 
  ZIYARAT_LOCATIONS,
  FIXED_CIRCUITS 
} from './BookingController';
import { ZIYARAT_ROUTES, ZIYARAT_FLEET, ZIYARAT_PRICES, getZiyaratRouteFare, getZiyaratAllocatedQuantity } from '@/data/ziyaratBuilderData';
import { Building2, Car, Users, Sparkles, CheckCircle, Compass, Calendar, Plane } from 'lucide-react';
import { formatDateDDMMYYYY } from '@/lib/utils';

interface Props {
  state: BookingState;
  type?: string;
  ziyaratPkgParams?: any;
  /** 'sidebar' (default) keeps the sticky rail; 'page' renders the full-width report layout */
  variant?: 'sidebar' | 'page';
}

export default function ItinerarySummary({ state, type, ziyaratPkgParams, variant = 'sidebar' }: Props) {
  const rootClass = variant === 'page'
    // 'page' sits inside the checkout-phase gold panel, which already supplies
    // the background, border and padding — only the content block is rendered here.
    ? 'w-full'
    : 'bg-[#0c0d10] border border-white/5 p-6 rounded-2xl w-full sticky top-32 lg:mt-[104px] shadow-xl';
  const isTransport = type === 'Transport';
  const isZiyarat = type === 'Ziyarat';
  const isUmrahPlus = type === 'Umrah Plus';
  const currentPath = state.travelPath || 'p1';
  const travelPackage = PACKAGES.find(p => p.id === currentPath);
  
  const transportVehicle = VEHICLES.find(v => v.id === (state.transportVehicleId || state.selectedVehicle)) || ZIYARAT_FLEET.find(v => v.id === (state.transportVehicleId || state.selectedVehicle));
  const ziyaratVehicle = ZIYARAT_FLEET.find(v => v.id === state.selectedVehicle) || VEHICLES.find(v => v.id === state.selectedVehicle);
  const vehicle = isZiyarat
    ? ziyaratVehicle
    : (isUmrahPlus ? transportVehicle : VEHICLES.find(v => v.id === (isTransport ? state.transportVehicleId : state.selectedVehicle)));

  // Ziyarat/premium fleet allocation — shared by route rows, the total badge and the fleet line
  const ziyaratFleetQty = getZiyaratAllocatedQuantity(
    state.selectedVehicle || 'sedan',
    isUmrahPlus,
    state.adultsCount,
    state.childrenCount,
    state.passengerCount
  );

  const makkahHotel = HOTEL_CATEGORIES.find(c => c.id === state.makkahHotelCategory);
  const madinahHotel = HOTEL_CATEGORIES.find(c => c.id === state.madinahHotelCategory);

  const hasSingleRoutes = !state.includeMadinah && (
    state.singleRoutes.airportTransfer ||
    state.singleRoutes.oneDayTrip ||
    state.singleRoutes.halfDayTrip
  );

  // Dedicated Transport Summary Layout
  if (isTransport) {
    const isFixed = state.transportMode === 'fixed';
    const vehicleQty = state.vehicleQuantity || 1;
    const vehicleName = vehicle?.name || 'Standard Sedan';

    return (
      <div className={rootClass}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#c5a059] block">
              Trip Summary
            </span>
            <h4 className="text-base font-playfair italic text-white">
              Transportation Itinerary
            </h4>
          </div>
          <span className="text-xs bg-[#c5a059]/10 text-[#c5a059] px-2.5 py-1 rounded-full font-semibold border border-[#c5a059]/20">
            {isFixed ? 'Fixed Route' : 'Point-to-Point'}
          </span>
        </div>

        <div className="space-y-4 text-sm">
          {/* 1. Guests & Luggage */}
          <div className="border-b border-white/5 pb-3">
            <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-wider mb-1 font-semibold">
              <Users className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>Passengers & Luggage</span>
            </div>
            <div className="text-white font-medium text-sm">
              {state.adultsCount} Adult{state.adultsCount > 1 ? 's' : ''}
              {state.childrenCount ? `, ${state.childrenCount} Child(ren)` : ''}
            </div>
            <div className="text-gray-400 text-xs font-light mt-0.5">
              {state.luggageCount || 0} Luggage Bag{(state.luggageCount || 0) !== 1 ? 's' : ''}
            </div>
          </div>

          {/* 2. Route & Stops Schedule */}
          <div className="border-b border-white/5 pb-3 space-y-2">
            <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-wider mb-1 font-semibold">
              <Compass className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>{isFixed ? 'Selected Itinerary & Schedule Review' : 'Transfer Details'}</span>
            </div>

            {isFixed ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#c5a059] font-bold">
                    {FIXED_CIRCUITS.find(c => c.id === state.fixedRouteId)?.title || PACKAGES.find(p => p.id === state.fixedRouteId)?.name || 'Round Trip Route'}
                  </span>
                  <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded font-medium">
                    {state.fixedRouteLegs?.length || 3} Stops
                  </span>
                </div>
                {state.fixedRouteLegs.map((leg, idx) => (
                  <div key={leg.id || idx} className="bg-[#1a1c22] p-2.5 rounded-xl border border-white/5 space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-white font-medium">
                      <div className="flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-[#c5a059]/20 text-[#c5a059] flex items-center justify-center text-[10px] font-bold">
                          {idx + 1}
                        </span>
                        <span className="text-yellow-300">{leg.from}</span>
                        <span className="text-[#c5a059]">➔</span>
                        <span className="text-yellow-300">{leg.to}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#c5a059] font-medium">
                      <span>📅 {leg.date ? formatDateDDMMYYYY(leg.date) : 'TBD'}</span>
                      <span>⏰ {leg.time || '12:00'}</span>
                    </div>
                    {(leg.pickupLocation || leg.dropoffLocation) && (
                      <div className="pt-1 border-t border-white/5 space-y-0.5 text-[10px] text-gray-300">
                        {leg.pickupLocation && (
                          <div className="truncate">
                            <span className="text-gray-500 font-semibold">Pickup: </span>
                            {leg.pickupLocation}
                          </div>
                        )}
                        {leg.dropoffLocation && (
                          <div className="truncate">
                            <span className="text-gray-500 font-semibold">Drop-off: </span>
                            {leg.dropoffLocation}
                          </div>
                        )}
                      </div>
                    )}
                    {leg.flightNo && (
                      <div className="text-[10px] text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 flex items-center gap-1.5">
                        <Plane className="w-3 h-3 text-amber-400" />
                        <span>Flight / Terminal: {leg.flightNo}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#1a1c22] p-3 rounded-xl border border-white/5 space-y-2">
                <div className="text-xs text-[#c5a059] font-bold">
                  {state.pointToPointRoute || 'Direct Transfer'}
                </div>
                <div className="text-xs text-gray-300">
                  <span className="text-gray-500 block text-[10px] uppercase font-bold">Pickup:</span>
                  <span className="text-white font-medium">{state.pointToPointPickupLocation || 'Address TBD'}</span>
                </div>
                <div className="text-xs text-gray-300">
                  <span className="text-gray-500 block text-[10px] uppercase font-bold">Drop-off:</span>
                  <span className="text-white font-medium">{state.pointToPointDropoffLocation || 'Address TBD'}</span>
                </div>
                <div className="text-[11px] text-gray-400 font-light pt-1 border-t border-white/5 flex items-center justify-between">
                  <span>Schedule:</span>
                  <span className="text-[#c5a059] font-semibold">
                    {state.pointToPointPickupDate ? formatDateDDMMYYYY(state.pointToPointPickupDate) : 'Date TBD'} ({state.pointToPointPickupTime || '14:00'})
                  </span>
                </div>
                {state.pointToPointFlightNo && (
                  <div className="text-[11px] text-gray-400 font-light">
                    Flight: <span className="text-white">{state.pointToPointFlightNo}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 3. Vehicle & Multiplier */}
          <div className="border-b border-white/5 pb-3 space-y-1.5">
            <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-wider mb-1 font-semibold">
              <Car className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>Chauffeur & Fleet</span>
            </div>

            <div className="bg-[#1a1c22] p-3 rounded-xl border border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">
                  {vehicleQty > 1 ? `${vehicleQty}x ` : ''}{vehicleName}
                </span>
                {vehicleQty > 1 && (
                  <span className="text-[10px] bg-[#c5a059]/20 text-[#c5a059] font-bold px-2 py-0.5 rounded">
                    {vehicleQty} Vehicles
                  </span>
                )}
              </div>
              <div className="text-[11px] text-gray-400 font-light mt-1">
                Private air-conditioned fleet with dedicated chauffeur
              </div>
            </div>
          </div>

          {/* 4. Estimated Fare */}
          {state.calculatedTransportPrice > 0 && (
            <div className="bg-[#c5a059]/10 border border-[#c5a059]/30 rounded-xl p-3.5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-semibold block">Total Estimated Fare</span>
                <span className="text-xs text-gray-300 font-light">All taxes & fuel included</span>
              </div>
              <span className="text-lg font-bold text-[#c5a059] font-mono">
                AED {state.calculatedTransportPrice}
              </span>
            </div>
          )}
        </div>

        {/* Concierge Note */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-xs font-bold text-[#c5a059] uppercase tracking-wider mb-1">
            <CheckCircle className="w-4 h-4 text-[#00d084]" />
            Guaranteed Chauffeur
          </div>
          <p className="text-[11px] text-gray-400 font-light leading-relaxed">
            Driver details and license plates will be shared 24 hours prior to each scheduled pickup via WhatsApp.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={rootClass}>
      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#c5a059] block">
            Trip Summary
          </span>
          <h4 className="text-base font-playfair italic text-white">
            {(type || 'Umrah')} Itinerary
          </h4>
        </div>
        <span className="text-xs bg-[#c5a059]/10 text-[#c5a059] px-2.5 py-1 rounded-full font-semibold border border-[#c5a059]/20">
          Custom
        </span>
      </div>

      <div className="space-y-4 text-sm">
        {/* 1. Guests */}
        <div className="border-b border-white/5 pb-3">
          <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-wider mb-1 font-semibold">
            <Users className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>{isZiyarat ? 'Pilgrims' : 'Guests'}</span>
          </div>
          <div className="text-white font-medium text-sm">
            {state.adultsCount} {state.adultsCount > 1 ? 'Pilgrims' : 'Pilgrim'}
          </div>
        </div>

        {/* 2. Ziyarat Routes (When type is Ziyarat or Umrah Plus) */}
        {(isZiyarat || isUmrahPlus) && (
          <div className="border-b border-white/5 pb-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-wider font-semibold">
                <Compass className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>Selected Ziyarat Routes</span>
              </div>
              {state.selectedZiyaratRoutes && state.selectedZiyaratRoutes.length > 0 && (
                <span className="text-[10px] text-[#f9e8a2] bg-[#c5a059]/20 px-2 py-0.5 rounded-full border border-[#c5a059]/30 font-bold">
                  {state.selectedZiyaratRoutes.reduce((sum, rId) => {
                    const r = ZIYARAT_ROUTES.find(route => route.id === rId);
                    return sum + (r?.siteIds.length || 0);
                  }, 0)} Ziyarats
                </span>
              )}
            </div>

            {state.selectedZiyaratRoutes && state.selectedZiyaratRoutes.length > 0 ? (
              <div className="space-y-2">
                {state.selectedZiyaratRoutes.map(rId => {
                  const r = ZIYARAT_ROUTES.find(route => route.id === rId);
                  if (!r) return null;
                  const rDate = state.selectedZiyaratRouteDates?.[rId];
                  const pEntry = ZIYARAT_PRICES[rId];
                  const fareNum = getZiyaratRouteFare(rId, state.selectedVehicle || 'sedan');
                  const routeFare = fareNum !== null
                    ? `SAR ${fareNum * ziyaratFleetQty}`
                    : (pEntry?.custom ? 'Custom' : null);

                  return (
                    <div key={rId} className="bg-[#1a1c22] p-2.5 rounded-xl border border-white/5">
                      <div className="flex justify-between items-start">
                        <span className="text-xs text-[#c5a059] font-bold block">{r.cityName}</span>
                        <div className="text-right">
                          <span className="text-[10px] text-gray-400 font-light block">{r.duration}</span>
                          {routeFare && (
                            <span className="text-[11px] font-bold text-[#f9e8a2] block mt-0.5">{routeFare}</span>
                          )}
                        </div>
                      </div>
                      <span className="text-white text-xs font-medium block mt-0.5">
                        {r.name}
                      </span>
                      {rDate ? (
                        <span className="text-[11px] text-[#f9e8a2] font-semibold flex items-center gap-1 mt-1 bg-black/30 px-2 py-0.5 rounded border border-[#c5a059]/20 w-fit">
                          <Calendar className="w-3 h-3 text-[#c5a059]" /> {formatDateDDMMYYYY(rDate)}
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-400/80 italic mt-1 block">
                          Date to be scheduled
                        </span>
                      )}
                      <span className="text-gray-400 text-[10px] font-light block mt-0.5">
                        {r.siteIds.length} Sacred Sites Included
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-[11px] text-gray-500 italic pl-1">
                No routes selected yet
              </div>
            )}
          </div>
        )}

        {/* 3. Accommodation (Makkah & Madinah for Umrah) */}
        {!isZiyarat && !isTransport && (
          <div className="border-b border-white/5 pb-3 space-y-2">
            <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-wider mb-1 font-semibold">
              <Building2 className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>Accommodation</span>
            </div>

            {/* Makkah */}
            <div className="bg-[#1a1c22] p-2.5 rounded-xl border border-white/5">
              <span className="text-xs text-[#c5a059] font-bold block">🕋 Makkah Stay</span>
              <span className="text-white text-xs font-medium block mt-0.5">
                {makkahHotel?.name || 'Hotel Selected'}
              </span>
              {state.makkahPreferredHotel && (
                <span className="text-[#c5a059] text-[11px] block mt-0.5">
                  Preferred: {state.makkahPreferredHotel}
                </span>
              )}
              {(state.makkahCheckInDate || state.makkahCheckOutDate) && (
                <span className="text-gray-400 text-[10px] font-light block mt-0.5">
                  {state.makkahCheckInDate ? formatDateDDMMYYYY(state.makkahCheckInDate) : 'TBD'}{state.makkahCheckInTime ? ` (${state.makkahCheckInTime})` : ''} ➔ {state.makkahCheckOutDate ? formatDateDDMMYYYY(state.makkahCheckOutDate) : 'TBD'}{state.makkahCheckOutTime ? ` (${state.makkahCheckOutTime})` : ''}
                </span>
              )}
              <span className="text-gray-400 text-[11px] font-light block mt-0.5">
                {state.makkahRooms} Room{state.makkahRooms > 1 ? 's' : ''}
              </span>
            </div>

            {/* Madinah (if included) */}
            {state.includeMadinah ? (
              <div className="bg-[#1a1c22] p-2.5 rounded-xl border border-white/5">
                <span className="text-xs text-[#00d084] font-bold block">🕌 Madinah Stay</span>
                <span className="text-white text-xs font-medium block mt-0.5">
                  {madinahHotel?.name || 'Hotel Selected'}
                </span>
                {state.madinahPreferredHotel && (
                  <span className="text-[#00d084] text-[11px] block mt-0.5">
                    Preferred: {state.madinahPreferredHotel}
                  </span>
                )}
                {(state.madinahCheckInDate || state.madinahCheckOutDate) && (
                  <span className="text-gray-400 text-[10px] font-light block mt-0.5">
                    {state.madinahCheckInDate ? formatDateDDMMYYYY(state.madinahCheckInDate) : 'TBD'}{state.madinahCheckInTime ? ` (${state.madinahCheckInTime})` : ''} ➔ {state.madinahCheckOutDate ? formatDateDDMMYYYY(state.madinahCheckOutDate) : 'TBD'}{state.madinahCheckOutTime ? ` (${state.madinahCheckOutTime})` : ''}
                  </span>
                )}
                <span className="text-gray-400 text-[11px] font-light block mt-0.5">
                  {state.madinahRooms} Room{state.madinahRooms > 1 ? 's' : ''}
                </span>
              </div>
            ) : (
              <div className="text-[11px] text-gray-500 italic pl-1">
                Madinah stay not included
              </div>
            )}
          </div>
        )}

        {/* 4. Transportation / Fleet (Shown for Transport, Ziyarat, Umrah Plus, or when transport upsell selected) */}
        {(isTransport || isZiyarat || (isUmrahPlus && !state.skipTransport) || (!isZiyarat && !isUmrahPlus && state.selectedUpsells.includes('transport'))) && (
          <div className="border-b border-white/5 pb-3 space-y-2">
            <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-wider mb-1 font-semibold">
              <Car className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>{isZiyarat ? 'Private Fleet' : 'Transportation'}</span>
            </div>

            {vehicle ? (
              <div className="text-white text-xs font-medium">
                Vehicle: <span className="text-[#c5a059]">{vehicle.name}</span>
                <span className="text-gray-400 text-[11px] block font-light">Capacity: Up to {vehicle.capacity} pax</span>
                {isZiyarat && ziyaratFleetQty > 1 && (
                  <span className="text-[#c5a059] text-[11px] block font-semibold mt-0.5">
                    Allocated Vehicles: {ziyaratFleetQty}x {vehicle.name}
                  </span>
                )}
              </div>
            ) : (
              <div className="bg-[#1a1c22] p-2.5 rounded-xl border border-[#c5a059]/30">
                <span className="text-xs text-[#c5a059] font-bold block">🚗 Private Transport Included</span>
                <span className="text-white text-xs font-medium block mt-0.5">VIP Chauffeur & Transfers</span>
                <span className="text-gray-400 text-[11px] font-light block">Configured in Step 2</span>
              </div>
            )}

            {!isZiyarat && (
              <div className="bg-[#1a1c22] p-2.5 rounded-xl border border-white/5 space-y-2 mt-1.5">
                {state.transportMode === 'fixed' ? (
                  <>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#c5a059] font-bold">
                        {FIXED_CIRCUITS.find(c => c.id === state.fixedRouteId)?.title || PACKAGES.find(p => p.id === state.fixedRouteId)?.name || 'Full Pilgrimage Route'}
                      </span>
                      <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded font-medium">
                        {state.fixedRouteLegs?.length || 3} Stops
                      </span>
                    </div>

                    {/* Legs with full schedule and pickup/drop-off details */}
                    {state.fixedRouteLegs && state.fixedRouteLegs.length > 0 && (
                      <div className="space-y-1.5 pt-1 border-t border-white/5">
                        {state.fixedRouteLegs.map((leg, idx) => (
                          <div key={leg.id || idx} className="bg-black/40 p-2 rounded-lg border border-white/5 space-y-1">
                            <div className="flex items-center justify-between text-xs text-white font-medium">
                              <div className="flex items-center gap-1.5">
                                <span className="w-3.5 h-3.5 rounded-full bg-[#c5a059]/20 text-[#c5a059] flex items-center justify-center text-[9px] font-bold">
                                  {idx + 1}
                                </span>
                                <span className="text-yellow-300">{leg.from}</span>
                                <span className="text-[#c5a059]">➔</span>
                                <span className="text-yellow-300">{leg.to}</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-[#c5a059] font-medium">
                              <span>📅 {leg.date ? formatDateDDMMYYYY(leg.date) : 'Date TBD'}</span>
                              <span>⏰ {leg.time || '12:00'}</span>
                            </div>
                            {(leg.pickupLocation || leg.dropoffLocation) && (
                              <div className="pt-1 border-t border-white/5 space-y-0.5 text-[10px] text-gray-300">
                                {leg.pickupLocation && (
                                  <div className="truncate">
                                    <span className="text-gray-500 font-semibold">Pickup: </span>
                                    {leg.pickupLocation}
                                  </div>
                                )}
                                {leg.dropoffLocation && (
                                  <div className="truncate">
                                    <span className="text-gray-500 font-semibold">Drop-off: </span>
                                    {leg.dropoffLocation}
                                  </div>
                                )}
                              </div>
                            )}
                            {leg.flightNo && (
                              <div className="text-[10px] text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 flex items-center gap-1">
                                <Plane className="w-3 h-3 text-amber-400" />
                                <span>Flight: {leg.flightNo}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#c5a059] font-bold">
                        {state.pointToPointRoute || 'Jeddah ↔ Makkah'}
                      </span>
                      <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-gray-300">
                        Point-to-Point
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-300 space-y-0.5">
                      <div className="truncate"><span className="text-gray-500">Pick:</span> {state.pointToPointPickupLocation || 'Address TBD'}</div>
                      <div className="truncate"><span className="text-gray-500">Drop:</span> {state.pointToPointDropoffLocation || 'Address TBD'}</div>
                      {state.pointToPointPickupDate && (
                        <div className="text-gray-400 text-[10px] mt-0.5">
                          📅 {formatDateDDMMYYYY(state.pointToPointPickupDate)} {state.pointToPointPickupTime ? `(${state.pointToPointPickupTime})` : ''}
                        </div>
                      )}
                      {state.pointToPointFlightNo && (
                        <div className="text-[10px] text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 flex items-center gap-1 mt-1">
                          <Plane className="w-3 h-3 text-amber-400" />
                          <span>Flight: {state.pointToPointFlightNo}</span>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {state.calculatedTransportPrice > 0 && (
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs mt-1">
                    <span className="text-gray-400 text-[10px] uppercase font-semibold">Est. Transport:</span>
                    <span className="font-bold text-[#c5a059]">AED {state.calculatedTransportPrice}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 5. Selected Add-ons (Ziyarat add-ons in Umrah) */}
        {!isZiyarat && state.selectedUpsells.filter(id => id !== 'transport').length > 0 && (
          <div className="border-b border-white/5 pb-3">
            <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-wider mb-2 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>Sacred Ziyarat Add-ons</span>
            </div>
            <ul className="space-y-1.5">
              {state.selectedUpsells.filter(id => id !== 'transport').map(uId => {
                const u = UPSELLS.find(upsell => upsell.id === uId);
                return u ? (
                  <li key={uId} className="text-xs text-gray-300 flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059] mt-1.5 shrink-0"></span>
                    <span>{u.name}</span>
                  </li>
                ) : null;
              })}
            </ul>
          </div>
        )}

        {/* 6. Ziyarat Routes (Umrah Plus) */}
        {isUmrahPlus && !state.skipZiyarat && state.selectedZiyaratRoutes && state.selectedZiyaratRoutes.length > 0 && (
          <div className="border-b border-white/5 pb-3">
            <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-wider mb-2 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>Sacred Ziyarat Itineraries ({state.selectedZiyaratRoutes.length})</span>
            </div>
            <div className="space-y-1.5">
              {state.selectedZiyaratRoutes.map(rId => {
                const r = ZIYARAT_ROUTES.find(route => route.id === rId);
                if (!r) return null;
                const rDate = state.selectedZiyaratRouteDates?.[rId];
                return (
                  <div key={rId} className="bg-[#1a1c22] p-2 rounded-lg border border-white/5 text-xs">
                    <div className="flex justify-between items-center text-[10px] text-[#c5a059] font-bold uppercase">
                      <span>{r.cityName}</span>
                      <span className="text-gray-400 font-normal">{r.duration}</span>
                    </div>
                    <div className="text-white font-medium text-xs mt-0.5">{r.name}</div>
                    {rDate && (
                      <div className="text-[10px] text-[#f9e8a2] mt-0.5">
                        📅 {formatDateDDMMYYYY(rDate)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Multi-City Ziyarat fallback */}
        {!isZiyarat && !isUmrahPlus && !state.skipZiyarat && state.selectedZiyaratCities && state.selectedZiyaratCities.some(c => c.locations.length > 0) && (
          <div className="border-b border-white/5 pb-3">
            <span className="text-gray-400 text-xs uppercase tracking-wider mb-2 block font-semibold">
              Historic Sacred Sites:
            </span>
            {state.selectedZiyaratCities.map((cityState, idx) => {
              if (cityState.locations.length === 0) return null;
              const cityName = ZIYARAT_CITIES.find(c => c.id === cityState.cityId)?.name || `City ${idx + 1}`;
              return (
                <div key={idx} className="mb-2">
                  <span className="text-xs text-[#c5a059] font-bold block mb-1">{cityName}:</span>
                  <ul className="space-y-1 pl-2">
                    {cityState.locations.map(locId => {
                      const loc = ZIYARAT_LOCATIONS.find(l => l.id === locId);
                      return loc ? (
                        <li key={locId} className="text-[11px] text-gray-300 flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                          {loc.name}
                        </li>
                      ) : null;
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Ziyarat Total Cost Badge if Ziyarat */}
      {isZiyarat && (() => {
        let totalFare = 0;
        let hasCustom = false;
        state.selectedZiyaratRoutes?.forEach(rId => {
          const p = ZIYARAT_PRICES[rId];
          if (p?.custom) hasCustom = true;
          else {
            const f = getZiyaratRouteFare(rId, state.selectedVehicle || 'sedan');
            if (f) totalFare += f;
          }
        });
        const allocatedTotal = totalFare * ziyaratFleetQty;
        const pp = state.passengerCount > 0 ? Math.ceil(allocatedTotal / state.passengerCount) : allocatedTotal;

        return (
          <div className="mt-4 p-3 rounded-xl bg-[#131c2a] border border-[#c5a059]/40 space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-300 font-semibold uppercase tracking-wider">Estimated Total</span>
              <span className="text-sm font-bold text-[#f9e8a2]">
                SAR {allocatedTotal} {hasCustom ? '+ Custom' : ''}
              </span>
            </div>
            {ziyaratFleetQty > 1 && (
              <div className="flex justify-between items-center text-[11px] text-gray-400 border-t border-white/5 pt-1 mt-1">
                <span>Fleet Allocation ({state.passengerCount} Pax):</span>
                <span className="text-[#c5a059] font-semibold">{ziyaratFleetQty}x {vehicle?.name || ''}</span>
              </div>
            )}
            {allocatedTotal > 0 && (
              <div className="flex justify-between items-center text-[11px] text-gray-400 border-t border-white/5 pt-1 mt-1">
                <span>Per Person ({state.passengerCount} Pax):</span>
                <span className="text-[#c5a059] font-semibold">SAR {pp} / Pax</span>
              </div>
            )}
          </div>
        );
      })()}

      {/* Concierge & Inclusions note */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2 text-xs font-bold text-[#c5a059] uppercase tracking-wider mb-1">
          <CheckCircle className="w-4 h-4 text-[#00d084]" />
          Custom Consultation
        </div>
        <p className="text-[11px] text-gray-400 font-light leading-relaxed">
          {isZiyarat 
            ? "No advance payment required. Our specialists will review your chosen routes and contact you to confirm timings and vehicle dispatch."
            : "No advance payment required. Our specialists will review your selections and reach back with finalized pricing and arrangements."}
        </p>
      </div>
    </div>
  );
}
