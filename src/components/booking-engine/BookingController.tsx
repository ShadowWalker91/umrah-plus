'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import StepProgressBar from './StepProgressBar';
import DynamicQuestionnaire from './DynamicQuestionnaire';
import ItinerarySummary from './ItinerarySummary';
import { sendBookingInquiry } from '@/app/actions/sendBookingInquiry';
import { getTransportData, TransportVehicleConfig } from '@/app/actions/transportActions';
import { ZIYARAT_ROUTES, ZIYARAT_FLEET, ZIYARAT_CITIES_DATA, ZIYARAT_PRICES, ZIYARAT_SITES } from '@/data/ziyaratBuilderData';

export const PACKAGES = [
  { id: 'p1', name: 'Round Trip Package 01', route: 'JED Airport ➔ Makkah ➔ Madinah ➔ MED Airport' },
  { id: 'p2', name: 'Round Trip Package 02', route: 'MED Airport ➔ Madinah ➔ Makkah ➔ JED Airport' },
  { id: 'p3', name: 'Round Trip Package 03', route: 'JED Airport ➔ Makkah ➔ Madinah ➔ Makkah ➔ JED Airport' },
  { id: 'p4', name: 'Round Trip Package 04', route: 'JED Airport ➔ Makkah ➔ Madinah ➔ JED Airport' }
];

export const FIXED_CIRCUITS = [
  {
    id: 'p1',
    name: 'Package 1',
    badge: 'JED In / MED Out',
    title: 'Jeddah Arrival ➔ Madinah Departure',
    fullRoute: 'Jeddah Airport ➔ Makkah ➔ Madinah ➔ Madinah Airport',
    stops: [
      { id: 'l1', from: 'Jeddah Airport (JED)', to: 'Makkah Hotel', label: 'Stop 1: Arrival Transfer (JED Airport ➔ Makkah Hotel)' },
      { id: 'l2', from: 'Makkah Hotel', to: 'Madinah Hotel', label: 'Stop 2: Intercity Transfer (Makkah Hotel ➔ Madinah Hotel)' },
      { id: 'l3', from: 'Madinah Hotel', to: 'Madinah Airport (MED)', label: 'Stop 3: Departure Transfer (Madinah Hotel ➔ MED Airport)' }
    ]
  },
  {
    id: 'p2',
    name: 'Package 2',
    badge: 'JED In & Out',
    title: 'Jeddah Arrival & Departure Round-Trip',
    fullRoute: 'Jeddah Airport ➔ Makkah ➔ Madinah ➔ Jeddah Airport',
    stops: [
      { id: 'l1', from: 'Jeddah Airport (JED)', to: 'Makkah Hotel', label: 'Stop 1: Arrival Transfer (JED Airport ➔ Makkah Hotel)' },
      { id: 'l2', from: 'Makkah Hotel', to: 'Madinah Hotel', label: 'Stop 2: Intercity Transfer (Makkah Hotel ➔ Madinah Hotel)' },
      { id: 'l3', from: 'Madinah Hotel', to: 'Jeddah Airport (JED)', label: 'Stop 3: Departure Transfer (Madinah Hotel ➔ JED Airport)' }
    ]
  },
  {
    id: 'p3',
    name: 'Package 3',
    badge: 'MED In / JED Out',
    title: 'Madinah Arrival ➔ Jeddah Departure',
    fullRoute: 'Madinah Airport ➔ Madinah ➔ Makkah ➔ Jeddah Airport',
    stops: [
      { id: 'l1', from: 'Madinah Airport (MED)', to: 'Madinah Hotel', label: 'Stop 1: Arrival Transfer (MED Airport ➔ Madinah Hotel)' },
      { id: 'l2', from: 'Madinah Hotel', to: 'Makkah Hotel', label: 'Stop 2: Intercity Transfer (Madinah Hotel ➔ Makkah Hotel)' },
      { id: 'l3', from: 'Makkah Hotel', to: 'Jeddah Airport (JED)', label: 'Stop 3: Departure Transfer (Makkah Hotel ➔ JED Airport)' }
    ]
  },
  {
    id: 'p4',
    name: 'Package 4',
    badge: 'Extended Route',
    title: 'Jeddah ➔ Makkah ➔ Madinah ➔ Makkah ➔ Jeddah',
    fullRoute: 'Jeddah Airport ➔ Makkah ➔ Madinah ➔ Makkah ➔ Jeddah Airport',
    stops: [
      { id: 'l1', from: 'Jeddah Airport (JED)', to: 'Makkah Hotel', label: 'Stop 1: Arrival Transfer (JED Airport ➔ Makkah Hotel)' },
      { id: 'l2', from: 'Makkah Hotel', to: 'Madinah Hotel', label: 'Stop 2: Intercity Transfer (Makkah Hotel ➔ Madinah Hotel)' },
      { id: 'l3', from: 'Madinah Hotel', to: 'Makkah Hotel', label: 'Stop 3: Return Transfer (Madinah Hotel ➔ Makkah Hotel)' },
      { id: 'l4', from: 'Makkah Hotel', to: 'Jeddah Airport (JED)', label: 'Stop 4: Departure Transfer (Makkah Hotel ➔ JED Airport)' }
    ]
  }
];

export const VEHICLES = [
  { id: 'sedan', name: 'Standard Sedan', capacity: 3, description: 'Comfortable sedan for small families or solo travelers' },
  { id: 'suv', name: 'Luxury SUV', capacity: 5, description: 'Spacious premium SUV with luggage capacity' },
  { id: 'van', name: 'Family Van', capacity: 10, description: 'Spacious van ideal for medium family groups' },
  { id: 'bus', name: 'Group Minibus', capacity: 20, description: 'High-capacity comfortable coaster for larger groups' },
];

export const HOTEL_CATEGORIES = [
  { id: '3-star', name: '3 Star' },
  { id: '4-star', name: '4 Star' },
  { id: '5-star', name: '5 Star' },
  { id: '5-star-shuttle', name: '5 Star with Shuttle' },
];

export const UPSELLS = [
  {
    id: 'transport',
    name: 'Private Transport & Airport Transfers',
    duration: 'Full Pilgrimage Route',
    description: 'Chauffeur-driven private luxury fleet for seamless airport pickups, hotel transfers, and intercity travel between Makkah & Madinah.'
  },
  {
    id: 'makkah-ziyarat',
    name: 'Private Makkah Ziyarat',
    duration: '1 Day / 4 Hours',
    description: 'Visit historical Islamic sites including Jabal al-Nour, Arafat, and Mina with a professional guide.'
  },
  {
    id: 'madinah-ziyarat',
    name: 'Private Madinah Ziyarat',
    duration: '1 Day / 4 Hours',
    description: 'Explore Mount Uhud, Masjid Quba, and the Trench with detailed historical commentary.'
  },
];

export const ZIYARAT_CITIES = [
  { id: 'makkah', name: 'Makkah' },
  { id: 'madinah', name: 'Madinah' },
  { id: 'taif', name: 'Taif' },
  { id: 'tabuk', name: 'Tabuk' }
];

export const ZIYARAT_LOCATIONS = [
  { id: 'm-jabal', cityId: 'makkah', name: 'Jabal al-Nour', timeFromHaram: '15 mins' },
  { id: 'm-arafat', cityId: 'makkah', name: 'Arafat', timeFromHaram: '30 mins' },
  { id: 'm-mina', cityId: 'makkah', name: 'Mina', timeFromHaram: '20 mins' },
  { id: 'mad-uhud', cityId: 'madinah', name: 'Mount Uhud', timeFromHaram: '20 mins' },
  { id: 'mad-quba', cityId: 'madinah', name: 'Masjid Quba', timeFromHaram: '15 mins' },
  { id: 'taif-hada', cityId: 'taif', name: 'Al Hada Mountain', timeFromHaram: '1.5 hours' },
  { id: 'taif-rose', cityId: 'taif', name: 'Rose Factory Tour', timeFromHaram: '2 hours' },
  { id: 'tab-wadi', cityId: 'tabuk', name: 'Wadi Disah', timeFromHaram: '2.5 hours' },
];

export interface TransportLeg {
  id: string;
  from: string;
  to: string;
  label: string;
  date: string;
  time: string;
  pickupLocation?: string;
  dropoffLocation?: string;
  flightNo?: string;
}

export interface BookingState {
  adultsCount: number;
  infantsCount: number;
  passengerCount: number;

  // Ziyarat builder flow
  selectedZiyaratCitiesList: string[];
  selectedZiyaratRoutes: string[];
  selectedZiyaratRouteDates?: Record<string, string>;
  expandedZiyaratRoute: string | null;

  // Makkah stay (required for Umrah)
  makkahHotelCategory: string;
  makkahNights: number;
  makkahRooms: number;
  makkahCheckInDate?: string;
  makkahCheckInTime?: string;
  makkahCheckOutDate?: string;
  makkahCheckOutTime?: string;
  makkahPreferredHotel?: string;

  // Madinah stay (optional for Umrah)
  includeMadinah: boolean;
  madinahHotelCategory: string;
  madinahNights: number;
  madinahRooms: number;
  madinahCheckInDate?: string;
  madinahCheckInTime?: string;
  madinahCheckOutDate?: string;
  madinahCheckOutTime?: string;
  madinahPreferredHotel?: string;

  // Transportation (for Umrah)
  travelPath: string | null;
  selectedVehicle: string | null;
  singleRoutes: {
    airportTransfer: boolean;
    oneDayTrip: boolean;
    oneDayTripDays: number;
    halfDayTrip: boolean;
    halfDayTripDays: number;
  };

  // Dedicated Transportation Flow
  transportMode: 'fixed' | 'pointToPoint';
  fixedRouteId: string;
  fixedRouteLegs: TransportLeg[];
  pointToPointRoute: string;
  pointToPointPickupLocation: string;
  pointToPointDropoffLocation: string;
  pointToPointPickupDate: string;
  pointToPointPickupTime: string;
  pointToPointFlightNo?: string;
  transportVehicleId: string;
  vehicleQuantity: number;
  calculatedTransportPrice: number;
  luggageCount: number;
  childrenCount: number;

  // Add-ons & Multi-city Ziyarat (Umrah Plus)
  selectedUpsells: string[];
  selectedZiyaratCities: { cityId: string; locations: string[] }[];
  skipTransport?: boolean;
  skipZiyarat?: boolean;

  // Lead Details
  leadDetails: {
    fullName: string;
    nationality: string;
    phoneCode: string;
    phone: string;
    email: string;
    notes?: string;
  };
}

export default function BookingController({
  type,
  startDate,
  endDate,
  ziyaratPkgParams,
  initialPassengers,
  initialChildren,
  initialLuggage,
  initialCities,
}: {
  type: string;
  startDate?: string;
  endDate?: string;
  ziyaratPkgParams?: any;
  initialPassengers?: number;
  initialChildren?: number;
  initialLuggage?: number;
  initialCities?: string[];
}) {
  const router = useRouter();
  const isTransport = type === 'Transport';
  const isUmrahPlus = type === 'Umrah Plus';
  const isZiyarat = type === 'Ziyarat';

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddonsDrawer, setShowAddonsDrawer] = useState(false);
  const [transportFleet, setTransportFleet] = useState<TransportVehicleConfig[]>([]);

  useEffect(() => {
    getTransportData().then(res => {
      if (res && res.vehicles?.length > 0) {
        setTransportFleet(res.vehicles);
      }
    }).catch(err => console.error("Failed to load transport fleet:", err));
  }, []);

  // Initialize passenger & guest counts from widget search parameters
  const initialAdults = initialPassengers !== undefined 
    ? initialPassengers 
    : (isZiyarat ? 2 : (isTransport ? 2 : 1));
  const initialKids = initialChildren !== undefined ? initialChildren : 0;
  const initialBags = initialLuggage !== undefined ? initialLuggage : 2;
  const initialTotalPax = initialAdults + initialKids;
  // Default sedan capacity is 3 pax. If total guests > 3, auto-allocate required vehicles
  const initialVehQty = isTransport ? Math.max(1, Math.ceil(initialTotalPax / 3)) : 1;
  const initialTransportPrice = isTransport ? 800 * initialVehQty : 800;

  const initialMakkahNights = (startDate && endDate)
    ? Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)))
    : 5;

  // Ziyarat visitors pick their cities on this page, so when the widget sends no
  // `cities` param the flow starts with nothing pre-selected (regular Umrah /
  // Umrah Plus keep their original defaults).
  const parsedCitiesList = initialCities && initialCities.length > 0
    ? initialCities.map(c => {
        const lower = c.toLowerCase().trim();
        if (lower.startsWith('mak')) return 'mak';
        if (lower.startsWith('mad')) return 'mad';
        if (lower.startsWith('taif')) return 'taif';
        return lower;
      })
    : (isZiyarat ? [] : ['mak', 'mad']);

  const defaultZiyaratRoutes: string[] = [];
  if (parsedCitiesList.includes('mak')) defaultZiyaratRoutes.push('mak-1');
  if (parsedCitiesList.includes('mad')) defaultZiyaratRoutes.push('mad-1');
  if (parsedCitiesList.includes('taif')) defaultZiyaratRoutes.push('taif-1');
  if (defaultZiyaratRoutes.length === 0 && !isZiyarat) defaultZiyaratRoutes.push('mak-1');

  const [bookingState, setBookingState] = useState<BookingState>({
    adultsCount: initialAdults,
    infantsCount: 0,
    passengerCount: initialTotalPax,

    selectedZiyaratCitiesList: parsedCitiesList,
    selectedZiyaratRoutes: defaultZiyaratRoutes,
    selectedZiyaratRouteDates: {},
    expandedZiyaratRoute: null,

    makkahHotelCategory: '4-star',
    makkahNights: initialMakkahNights,
    makkahRooms: 1,
    makkahCheckInDate: startDate || '',
    makkahCheckInTime: '14:00',
    makkahCheckOutDate: endDate || '',
    makkahCheckOutTime: '12:00',
    makkahPreferredHotel: '',

    includeMadinah: false,
    madinahHotelCategory: '4-star',
    madinahNights: 3,
    madinahRooms: 1,
    madinahCheckInDate: '',
    madinahCheckInTime: '14:00',
    madinahCheckOutDate: '',
    madinahCheckOutTime: '12:00',
    madinahPreferredHotel: '',

    travelPath: 'p1',
    selectedVehicle: isZiyarat ? 'sedan' : null,
    singleRoutes: {
      airportTransfer: true,
      oneDayTrip: false,
      oneDayTripDays: 1,
      halfDayTrip: false,
      halfDayTripDays: 1,
    },

    // Dedicated Transportation Flow
    transportMode: 'fixed',
    fixedRouteId: 'p1',
    fixedRouteLegs: [
      { id: 'l1', from: 'Jeddah Airport', to: 'Makkah Hotel', label: 'Arrival: JED Airport ➔ Makkah Hotel', date: startDate || '', time: '14:00', pickupLocation: '', dropoffLocation: '', flightNo: '' },
      { id: 'l2', from: 'Makkah Hotel', to: 'Madinah Hotel', label: 'Intercity: Makkah Hotel ➔ Madinah Hotel', date: '', time: '10:00', pickupLocation: '', dropoffLocation: '', flightNo: '' },
      { id: 'l3', from: 'Madinah Hotel', to: 'Madinah Airport', label: 'Departure: Madinah Hotel ➔ MED Airport', date: '', time: '12:00', pickupLocation: '', dropoffLocation: '', flightNo: '' },
    ],
    pointToPointRoute: 'Jeddah ↔ Makkah',
    pointToPointPickupLocation: '',
    pointToPointDropoffLocation: '',
    pointToPointPickupDate: startDate || '',
    pointToPointPickupTime: '14:00',
    pointToPointFlightNo: '',
    transportVehicleId: 'sedan',
    vehicleQuantity: initialVehQty,
    calculatedTransportPrice: initialTransportPrice,
    luggageCount: initialBags,
    childrenCount: initialKids,

    selectedUpsells: [],
    selectedZiyaratCities: [],
    skipTransport: !isZiyarat && !isTransport && !isUmrahPlus,

    leadDetails: {
      fullName: '',
      nationality: '',
      phoneCode: '+966',
      phone: '',
      email: '',
      notes: ''
    }
  });

  // Calculate dynamic steps for Ziyarat & Umrah Plus:
  const cityOrder = ['mak', 'taif', 'mad'];
  const effectiveZiyaratCities = (bookingState.selectedZiyaratCitiesList.length > 0
    ? [...bookingState.selectedZiyaratCitiesList]
    : ['mak']
  ).sort((a, b) => cityOrder.indexOf(a) - cityOrder.indexOf(b));

  // Reflect the cities chosen on the Ziyarat booking page in the URL
  // (?type=Ziyarat&passengers=2&cities=Makkah%2CMadinah%2CTaif) using a shallow
  // history update so the server components are not re-rendered.
  useEffect(() => {
    if (!isZiyarat) return;
    const cityNameById: Record<string, string> = { mak: 'Makkah', mad: 'Madinah', taif: 'Taif' };
    const nextValue = (['mak', 'mad', 'taif'] as const)
      .filter(id => bookingState.selectedZiyaratCitiesList.includes(id))
      .map(id => cityNameById[id])
      .join(',');

    const params = new URLSearchParams(window.location.search);
    if ((params.get('cities') || '') === nextValue) return;
    if (nextValue) params.set('cities', nextValue);
    else params.delete('cities');

    const query = params.toString();
    window.history.replaceState(null, '', `${window.location.pathname}${query ? `?${query}` : ''}`);
  }, [isZiyarat, bookingState.selectedZiyaratCitiesList]);

  const isRegularUmrah = !isZiyarat && !isUmrahPlus && !isTransport;
  const isSimpleUmrah = isRegularUmrah;

  // Transportation is optional: in Umrah Plus, Transport Flow is included by default unless skipped. In regular Umrah, added via add-ons.
  const hasTransport = isUmrahPlus
    ? !bookingState.skipTransport
    : (isRegularUmrah 
      ? bookingState.selectedUpsells.includes('transport')
      : !bookingState.skipTransport);

  // Transport Flow: 5 Steps (1: Party & Mode, 2: Route, 3: Vehicle, 4: Schedule & Locations, 5: Lead Details)
  // Regular Umrah with transport add-on: 5 Steps (1: Stay & Guests, 2: Mode & Route,
  // 3: Fleet Setup, 4: Transfer Leg Dates & Pick-Up Timings, 5: Lead Details) — otherwise 2 Steps.
  const totalSteps = isTransport
    ? 5
    : isZiyarat
      ? 4
      : isUmrahPlus
        ? 8
        : (hasTransport ? 5 : 2);

  // Auto-sync vehicle quantity and calculated price based on total guests and chosen car capacity
  useEffect(() => {
    if (isTransport || hasTransport) {
      const activeVehicleId = bookingState.transportVehicleId || bookingState.selectedVehicle || 'sedan';
      const v = transportFleet.find(veh => veh.id === activeVehicleId) 
        || transportFleet[0] 
        || VEHICLES.find(veh => veh.id === activeVehicleId) 
        || VEHICLES[0];
      const totalGuests = (bookingState.adultsCount || 1) + (bookingState.childrenCount || 0);
      const vehicleCap = v.capacity || 3;
      const requiredCars = Math.max(1, Math.ceil(totalGuests / vehicleCap));
      const basePrice = bookingState.transportMode === 'fixed'
        ? ((v as any).fixedRoutes?.[bookingState.fixedRouteId] || (v as any).fixedRoutes?.['p1'] || 800)
        : ((v as any).pointToPoint?.[bookingState.pointToPointRoute] || 250);
      const expectedPrice = basePrice * requiredCars;

      if (bookingState.vehicleQuantity !== requiredCars || bookingState.calculatedTransportPrice !== expectedPrice) {
        setBookingState(prev => ({
          ...prev,
          vehicleQuantity: requiredCars,
          calculatedTransportPrice: expectedPrice
        }));
      }
    }
  }, [
    isTransport,
    hasTransport,
    transportFleet,
    bookingState.adultsCount,
    bookingState.childrenCount,
    bookingState.transportVehicleId,
    bookingState.selectedVehicle,
    bookingState.fixedRouteId,
    bookingState.pointToPointRoute,
    bookingState.transportMode,
    bookingState.vehicleQuantity,
    bookingState.calculatedTransportPrice
  ]);

  const updateState = (updates: Partial<BookingState> | ((prev: BookingState) => Partial<BookingState>)) => {
    setBookingState(prev => {
      const resolvedUpdates = typeof updates === 'function' ? updates(prev) : updates;
      const next = { ...prev, ...resolvedUpdates };

      // Reset skip flags if user explicitly configures the corresponding section
      if (resolvedUpdates.selectedVehicle || resolvedUpdates.travelPath || resolvedUpdates.singleRoutes) {
        next.skipTransport = false;
      }
      if (resolvedUpdates.selectedZiyaratCitiesList || resolvedUpdates.selectedZiyaratRoutes) {
        next.skipZiyarat = false;
      }

      // Keep passenger count synced with adults + infants
      if (resolvedUpdates.adultsCount !== undefined || resolvedUpdates.infantsCount !== undefined) {
        const adults = resolvedUpdates.adultsCount !== undefined ? resolvedUpdates.adultsCount : prev.adultsCount;
        const infants = resolvedUpdates.infantsCount !== undefined ? resolvedUpdates.infantsCount : prev.infantsCount;
        next.passengerCount = adults + infants;

        // Auto upgrade vehicle if needed
        const currentFleet = (isZiyarat || isUmrahPlus) ? ZIYARAT_FLEET : VEHICLES;
        const currentVehicle = currentFleet.find(v => v.id === next.selectedVehicle);
        if (currentVehicle && currentVehicle.capacity < next.passengerCount) {
          const suitable = currentFleet.find(v => v.capacity >= next.passengerCount);
          if (suitable) next.selectedVehicle = suitable.id;
        }
      } else if (resolvedUpdates.passengerCount !== undefined) {
        const currentFleet = (isZiyarat || isUmrahPlus) ? ZIYARAT_FLEET : VEHICLES;
        const currentVehicle = currentFleet.find(v => v.id === next.selectedVehicle);
        if (currentVehicle && currentVehicle.capacity < next.passengerCount) {
          const suitable = currentFleet.find(v => v.capacity >= next.passengerCount);
          if (suitable) next.selectedVehicle = suitable.id;
        }
      }

      // If cities list updated, prune routes from unselected cities
      if (resolvedUpdates.selectedZiyaratCitiesList !== undefined) {
        const allowedCityIds = new Set(resolvedUpdates.selectedZiyaratCitiesList);
        const validRoutes = next.selectedZiyaratRoutes.filter(rId => {
          const r = ZIYARAT_ROUTES.find(route => route.id === rId);
          return r ? allowedCityIds.has(r.cityId) : false;
        });
        next.selectedZiyaratRoutes = validRoutes;
      }

      return next;
    });
  };

  const handleSkipTransport = () => {
    updateState({ 
      skipTransport: true, 
      selectedVehicle: null,
      selectedUpsells: bookingState.selectedUpsells.filter(id => id !== 'transport')
    });
    if (isRegularUmrah) {
      // Advance straight to submission/lead details
      setCurrentStep(2);
    } else if (isUmrahPlus) {
      // Advance directly to Ziyarat Flow (Step 5)
      setCurrentStep(5);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep === 1) {
      router.push('/#section-1');
      return;
    }
    if (isTransport) {
      setCurrentStep(prev => Math.max(1, prev - 1));
      return;
    }
    if (isZiyarat) {
      setCurrentStep(prev => Math.max(1, prev - 1));
      return;
    }
    if (isRegularUmrah) {
      if (currentStep === 2) {
        setCurrentStep(1);
        return;
      }
      if (currentStep === 3) {
        setCurrentStep(2);
        return;
      }
    }
    if (isUmrahPlus) {
      if (currentStep === 5 && bookingState.skipTransport) {
        setCurrentStep(1);
        return;
      }
      setCurrentStep(prev => Math.max(1, prev - 1));
      return;
    }
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleNext = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (isTransport) {
      if (currentStep === 1) {
        if (bookingState.adultsCount < 1) {
          alert("Please select at least 1 passenger.");
          return;
        }
      } else if (currentStep === 2) {
        if (bookingState.transportMode === 'fixed') {
          if (!bookingState.fixedRouteId) {
            alert("Please select a fixed route package.");
            return;
          }
        } else {
          if (!bookingState.pointToPointRoute) {
            alert("Please select a transfer route combination.");
            return;
          }
        }
      } else if (currentStep === 3) {
        if (!bookingState.transportVehicleId) {
          alert("Please select a vehicle to proceed.");
          return;
        }
      } else if (currentStep === 4) {
        if (bookingState.transportMode === 'fixed') {
          const missingDateLeg = bookingState.fixedRouteLegs.find(l => !l.date);
          if (missingDateLeg) {
            alert(`Please select travel date for "${missingDateLeg.label}".`);
            return;
          }
        } else {
          if (!bookingState.pointToPointPickupLocation.trim()) {
            alert("Please enter a pickup location.");
            return;
          }
          if (!bookingState.pointToPointDropoffLocation.trim()) {
            alert("Please enter a drop-off location.");
            return;
          }
          if (!bookingState.pointToPointPickupDate) {
            alert("Please select a pickup date.");
            return;
          }
        }
      } else if (currentStep === 5) {
        if (!bookingState.leadDetails.fullName.trim()) {
          alert("Please enter your full name.");
          return;
        }
        if (!bookingState.leadDetails.nationality.trim()) {
          alert("Please select your nationality.");
          return;
        }
        if (!bookingState.leadDetails.phone.trim()) {
          alert("Please enter your contact phone number.");
          return;
        }
        if (!bookingState.leadDetails.email.trim()) {
          alert("Please enter your email address.");
          return;
        }
      }

      if (currentStep < totalSteps) {
        setCurrentStep(prev => prev + 1);
      } else if (currentStep === totalSteps) {
        await handleSubmitInquiry();
      }
      return;
    }

    if (isZiyarat) {
      if (currentStep === 1) {
        if (bookingState.selectedZiyaratRoutes.length === 0) {
          alert("Please select at least one Ziyarat itinerary to proceed.");
          return;
        }
      } else if (currentStep === 2) {
        if (!bookingState.selectedVehicle) {
          updateState({ selectedVehicle: 'sedan' });
        }
      } else if (currentStep === 3) {
        const todayStr = new Date().toISOString().split('T')[0];
        for (const rId of bookingState.selectedZiyaratRoutes) {
          const rDate = bookingState.selectedZiyaratRouteDates?.[rId];
          const rObj = ZIYARAT_ROUTES.find(r => r.id === rId);
          const rName = rObj?.name || rId;
          if (!rDate) {
            alert(`Please select a scheduled travel date for "${rName}".`);
            return;
          }
          if (rDate < todayStr) {
            alert(`The scheduled date for "${rName}" cannot be in the past (${rDate}). Please select a valid upcoming date.`);
            return;
          }
        }
      } else if (currentStep === 4) {
        if (!bookingState.leadDetails.fullName.trim()) {
          alert("Please enter your full name.");
          return;
        }
        if (!bookingState.leadDetails.nationality.trim()) {
          alert("Please select your nationality.");
          return;
        }
        if (!bookingState.leadDetails.phone.trim()) {
          alert("Please enter your contact phone number.");
          return;
        }
        if (!bookingState.leadDetails.email.trim()) {
          alert("Please enter your email address.");
          return;
        }
      }

      if (currentStep < totalSteps) {
        setCurrentStep(prev => prev + 1);
      } else if (currentStep === totalSteps) {
        await handleSubmitInquiry();
      }
      return;
    } else if (isUmrahPlus) {
      // Sequence: 1) Umrah (Step 1) -> 2) Transport (Steps 2, 3, 4) -> 3) Ziyarat (Steps 5, 6, 7) -> 4) Lead Details (Step 8)
      
      // Step 1: Stay & Guests (Umrah)
      if (currentStep === 1) {
        if (bookingState.makkahCheckInDate && bookingState.makkahCheckOutDate && bookingState.makkahCheckOutDate <= bookingState.makkahCheckInDate) {
          alert("Makkah check-out date must be after check-in date.");
          return;
        }
        if (bookingState.includeMadinah && bookingState.madinahCheckInDate && bookingState.madinahCheckOutDate && bookingState.madinahCheckOutDate <= bookingState.madinahCheckInDate) {
          alert("Madinah check-out date must be after check-in date.");
          return;
        }
        // If transport skipped previously, advance to 5, otherwise 2
        if (bookingState.skipTransport) {
          setCurrentStep(5);
          return;
        }
      }

      // Step 2: Route Selection (Transport)
      else if (currentStep === 2) {
        if (!bookingState.skipTransport) {
          if (bookingState.transportMode === 'fixed') {
            if (!bookingState.fixedRouteId) {
              alert("Please select a fixed route package.");
              return;
            }
          } else {
            if (!bookingState.pointToPointRoute) {
              alert("Please select a transfer route combination.");
              return;
            }
          }
        }
      }

      // Step 3: Vehicle Selection & Live Rates (Transport)
      else if (currentStep === 3) {
        if (!bookingState.skipTransport) {
          if (!bookingState.transportVehicleId) {
            updateState({ transportVehicleId: 'sedan' });
          }
        }
      }

      // Step 4: Route Schedule & Pickup Locations (Transport)
      else if (currentStep === 4) {
        if (!bookingState.skipTransport) {
          if (bookingState.transportMode === 'fixed') {
            const missingDateLeg = bookingState.fixedRouteLegs.find(l => !l.date);
            if (missingDateLeg) {
              alert(`Please select travel date for "${missingDateLeg.label}".`);
              return;
            }
          } else {
            if (!bookingState.pointToPointPickupLocation.trim()) {
              alert("Please enter a pickup location.");
              return;
            }
            if (!bookingState.pointToPointDropoffLocation.trim()) {
              alert("Please enter a drop-off location.");
              return;
            }
            if (!bookingState.pointToPointPickupDate) {
              alert("Please select a pickup date.");
              return;
            }
          }
        }
      }

      // Step 5: Select Ziyarat Routes (Ziyarat)
      else if (currentStep === 5) {
        if (bookingState.selectedZiyaratRoutes.length === 0) {
          alert("Please select at least one Ziyarat itinerary to proceed.");
          return;
        }
      }

      // Step 6: Select Premium Fleet (Ziyarat)
      else if (currentStep === 6) {
        if (!bookingState.selectedVehicle) {
          updateState({ selectedVehicle: 'sedan' });
        }
      }

      // Step 7: Schedule Itinerary Dates (Ziyarat)
      else if (currentStep === 7) {
        const todayStr = new Date().toISOString().split('T')[0];
        for (const rId of bookingState.selectedZiyaratRoutes) {
          const rDate = bookingState.selectedZiyaratRouteDates?.[rId];
          const rObj = ZIYARAT_ROUTES.find(r => r.id === rId);
          const rName = rObj?.name || rId;
          if (!rDate) {
            alert(`Please select a scheduled travel date for "${rName}".`);
            return;
          }
          if (rDate < todayStr) {
            alert(`The scheduled date for "${rName}" cannot be in the past (${rDate}). Please select a valid upcoming date.`);
            return;
          }
        }
      }

      // Step 8: Lead Passenger Details (Final Submission)
      else if (currentStep === 8) {
        if (!bookingState.leadDetails.fullName.trim()) {
          alert("Please enter your full name.");
          return;
        }
        if (!bookingState.leadDetails.nationality.trim()) {
          alert("Please select your nationality.");
          return;
        }
        if (!bookingState.leadDetails.phone.trim()) {
          alert("Please enter your contact phone number.");
          return;
        }
        if (!bookingState.leadDetails.email.trim()) {
          alert("Please enter your email address.");
          return;
        }
      }

      if (currentStep < totalSteps) {
        setCurrentStep(prev => prev + 1);
      } else if (currentStep === totalSteps) {
        await handleSubmitInquiry();
      }
      return;
    }

    // For regular Umrah, trigger add-ons drawer after Screen 01 before moving forward
    if (currentStep === 1 && isRegularUmrah) {
      setShowAddonsDrawer(true);
      return;
    }

    // Regular Umrah: step-per-screen validation for the transport segment & lead details
    if (isRegularUmrah) {
      if (hasTransport && currentStep === 2) {
        if (bookingState.transportMode === 'fixed') {
          if (!bookingState.fixedRouteId) {
            alert("Please select a fixed route package.");
            return;
          }
        } else {
          if (!bookingState.pointToPointRoute) {
            alert("Please select a transfer route combination.");
            return;
          }
        }
      } else if (hasTransport && currentStep === 3) {
        if (!bookingState.transportVehicleId) {
          updateState({ transportVehicleId: 'sedan', selectedVehicle: 'sedan' });
        }
      } else if (hasTransport && currentStep === 4) {
        if (bookingState.transportMode === 'fixed') {
          const missingDateLeg = bookingState.fixedRouteLegs.find(l => !l.date);
          if (missingDateLeg) {
            alert(`Please select travel date for "${missingDateLeg.label}".`);
            return;
          }
        } else {
          if (!bookingState.pointToPointPickupLocation.trim()) {
            alert("Please enter a pickup location.");
            return;
          }
          if (!bookingState.pointToPointDropoffLocation.trim()) {
            alert("Please enter a drop-off location.");
            return;
          }
          if (!bookingState.pointToPointPickupDate) {
            alert("Please select a pickup date.");
            return;
          }
        }
      } else if (currentStep === totalSteps) {
        if (!bookingState.leadDetails.fullName.trim()) {
          alert("Please enter your full name.");
          return;
        }
        if (!bookingState.leadDetails.nationality.trim()) {
          alert("Please select your nationality.");
          return;
        }
        if (!bookingState.leadDetails.phone.trim()) {
          alert("Please enter your contact phone number.");
          return;
        }
        if (!bookingState.leadDetails.email.trim()) {
          alert("Please enter your email address.");
          return;
        }
      }

      if (currentStep < totalSteps) {
        setCurrentStep(prev => prev + 1);
      } else {
        await handleSubmitInquiry();
      }
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else if (currentStep === totalSteps) {
      // Final submission step
      await handleSubmitInquiry();
    }
  };

  const handleSubmitInquiry = async () => {
    try {
      setIsSubmitting(true);

      const makkahCategoryName = HOTEL_CATEGORIES.find(c => c.id === bookingState.makkahHotelCategory)?.name || bookingState.makkahHotelCategory;
      const madinahCategoryName = HOTEL_CATEGORIES.find(c => c.id === bookingState.madinahHotelCategory)?.name || bookingState.madinahHotelCategory;

      const isActuallyUmrahPlus = isUmrahPlus && !bookingState.skipZiyarat;
      const effectiveType = isActuallyUmrahPlus ? 'Umrah Plus' : (isZiyarat ? 'Ziyarat' : (type === 'Transport' ? 'Transport' : 'Umrah'));
      const fleetList = (isZiyarat || isActuallyUmrahPlus) ? ZIYARAT_FLEET : VEHICLES;
      const vehicleName = fleetList.find(v => v.id === bookingState.selectedVehicle)?.name || bookingState.selectedVehicle;
      const routeName = PACKAGES.find(p => p.id === bookingState.travelPath)?.name || bookingState.travelPath;
      const routeDetails = PACKAGES.find(p => p.id === bookingState.travelPath)?.route;

      let payload: any = {
        type: effectiveType,
        startDate,
        endDate,
        adultsCount: bookingState.adultsCount,
        infantsCount: bookingState.infantsCount,
        passengerCount: bookingState.passengerCount,
        leadDetails: bookingState.leadDetails,
      };

      const vehicleItem = VEHICLES.find(v => v.id === (bookingState.transportVehicleId || bookingState.selectedVehicle)) || { name: 'Standard Sedan' };
      const routeObj = PACKAGES.find(p => p.id === bookingState.fixedRouteId);
      const fixedRouteTitle = routeObj?.name || 'Round Trip Package 01';
      const fixedRoutePath = routeObj?.route || 'JED Airport ➔ Makkah ➔ Madinah ➔ MED Airport';

      const transportPayloadDetails = {
        mode: bookingState.transportMode,
        selectedVehicle: `${bookingState.vehicleQuantity > 1 ? `${bookingState.vehicleQuantity}x ` : ''}${vehicleItem.name}`,
        vehicleName: vehicleItem.name,
        vehicleQuantity: bookingState.vehicleQuantity || 1,
        route: bookingState.transportMode === 'fixed' ? fixedRouteTitle : bookingState.pointToPointRoute,
        routeDetails: bookingState.transportMode === 'fixed' 
          ? fixedRoutePath 
          : `${bookingState.pointToPointPickupLocation || 'Address TBD'} ➔ ${bookingState.pointToPointDropoffLocation || 'Address TBD'}`,
        legs: bookingState.transportMode === 'fixed' ? bookingState.fixedRouteLegs : undefined,
        pointToPoint: bookingState.transportMode === 'pointToPoint' ? {
          route: bookingState.pointToPointRoute,
          pickupLocation: bookingState.pointToPointPickupLocation,
          dropoffLocation: bookingState.pointToPointDropoffLocation,
          pickupDate: bookingState.pointToPointPickupDate,
          pickupTime: bookingState.pointToPointPickupTime,
          flightNo: bookingState.pointToPointFlightNo,
        } : undefined,
        price: bookingState.calculatedTransportPrice,
        luggageCount: bookingState.luggageCount,
      };

      if (isTransport) {
        const calcStartDate = bookingState.transportMode === 'fixed'
          ? (bookingState.fixedRouteLegs[0]?.date || startDate || '')
          : (bookingState.pointToPointPickupDate || startDate || '');
        const calcEndDate = bookingState.transportMode === 'fixed'
          ? (bookingState.fixedRouteLegs[bookingState.fixedRouteLegs.length - 1]?.date || endDate || '')
          : (bookingState.pointToPointPickupDate || endDate || '');

        payload = {
          ...payload,
          bookingType: 'Transport',
          startDate: calcStartDate,
          endDate: calcEndDate,
          adultsCount: bookingState.adultsCount,
          infantsCount: bookingState.childrenCount,
          passengerCount: bookingState.adultsCount + bookingState.childrenCount,
          transportation: transportPayloadDetails,
          transportDetails: transportPayloadDetails,
          fullSubmissionPayload: {
            transportBooking: {
              mode: bookingState.transportMode,
              vehicleId: bookingState.transportVehicleId,
              vehicleName: vehicleItem.name,
              vehicleQuantity: bookingState.vehicleQuantity || 1,
              price: bookingState.calculatedTransportPrice,
              passengers: bookingState.adultsCount,
              children: bookingState.childrenCount,
              luggage: bookingState.luggageCount,
              legs: bookingState.fixedRouteLegs,
              pointToPoint: {
                route: bookingState.pointToPointRoute,
                pickupLocation: bookingState.pointToPointPickupLocation,
                dropoffLocation: bookingState.pointToPointDropoffLocation,
                pickupDate: bookingState.pointToPointPickupDate,
                pickupTime: bookingState.pointToPointPickupTime,
                flightNo: bookingState.pointToPointFlightNo,
              }
            }
          }
        };
      } else if (isZiyarat) {
        const selectedVehId = bookingState.selectedVehicle || 'sedan';
        let totalZiyaratCost = 0;
        const mappedRoutes = bookingState.selectedZiyaratRoutes.map(rId => {
          const r = ZIYARAT_ROUTES.find(route => route.id === rId);
          const rDate = bookingState.selectedZiyaratRouteDates?.[rId] || '';
          const pEntry = (ZIYARAT_PRICES as any)?.[rId];
          const fare = (pEntry && !pEntry.custom && pEntry[selectedVehId]) ? pEntry[selectedVehId] : null;
          if (fare) totalZiyaratCost += fare;
          return {
            id: rId,
            name: r?.name || rId,
            city: r?.cityName || '',
            duration: r?.duration || '',
            date: rDate,
            passengers: bookingState.passengerCount || bookingState.adultsCount || 2,
            price: fare,
            sites: r?.siteIds ? r.siteIds.map(sId => ZIYARAT_SITES[sId]?.name || sId) : []
          };
        });

        const sortedDates = mappedRoutes.map(r => r.date).filter(Boolean).sort();
        const autoStartDate = sortedDates[0] || startDate || '';
        const autoEndDate = sortedDates[sortedDates.length - 1] || endDate || '';

        payload = {
          ...payload,
          startDate: autoStartDate,
          endDate: autoEndDate,
          ziyaratDetails: {
            selectedRoutes: mappedRoutes,
            vehicle: vehicleName,
            vehicleId: selectedVehId,
            passengers: bookingState.passengerCount || bookingState.adultsCount || 2,
            totalEstimatedCost: totalZiyaratCost
          }
        };
      } else {
        payload = {
          ...payload,
          makkahStay: {
            hotelCategory: makkahCategoryName,
            nights: bookingState.makkahNights,
            rooms: bookingState.makkahRooms,
            checkInDate: bookingState.makkahCheckInDate,
            checkInTime: bookingState.makkahCheckInTime,
            checkOutDate: bookingState.makkahCheckOutDate,
            checkOutTime: bookingState.makkahCheckOutTime,
            preferredHotel: bookingState.makkahPreferredHotel,
          },
          madinahStay: {
            included: bookingState.includeMadinah,
            hotelCategory: bookingState.includeMadinah ? madinahCategoryName : undefined,
            nights: bookingState.includeMadinah ? bookingState.madinahNights : undefined,
            rooms: bookingState.includeMadinah ? bookingState.madinahRooms : undefined,
            checkInDate: bookingState.includeMadinah ? bookingState.madinahCheckInDate : undefined,
            checkInTime: bookingState.includeMadinah ? bookingState.madinahCheckInTime : undefined,
            checkOutDate: bookingState.includeMadinah ? bookingState.madinahCheckOutDate : undefined,
            checkOutTime: bookingState.includeMadinah ? bookingState.madinahCheckOutTime : undefined,
            preferredHotel: bookingState.includeMadinah ? bookingState.madinahPreferredHotel : undefined,
          },
          transportation: (bookingState.selectedUpsells.includes('transport') || (!bookingState.skipTransport && isUmrahPlus)) ? transportPayloadDetails : null,
          selectedUpsells: bookingState.selectedUpsells.map(id => UPSELLS.find(u => u.id === id)?.name || id),
          selectedZiyaratCities: isActuallyUmrahPlus ? bookingState.selectedZiyaratCities : [],
          ...(isActuallyUmrahPlus ? {
            ziyaratDetails: {
              selectedRoutes: bookingState.selectedZiyaratRoutes.map(rId => {
                const r = ZIYARAT_ROUTES.find(route => route.id === rId);
                const rDate = bookingState.selectedZiyaratRouteDates?.[rId] || '';
                const pEntry = (ZIYARAT_PRICES as any)?.[rId];
                const fare = (pEntry && !pEntry.custom && pEntry[bookingState.selectedVehicle || 'sedan']) ? pEntry[bookingState.selectedVehicle || 'sedan'] : null;
                return {
                  id: rId,
                  name: r?.name || rId,
                  city: r?.cityName || '',
                  duration: r?.duration || '',
                  date: rDate,
                  passengers: bookingState.passengerCount || bookingState.adultsCount || 2,
                  price: fare,
                  sites: r?.siteIds ? r.siteIds.map(sId => ZIYARAT_SITES[sId]?.name || sId) : []
                };
              }),
              vehicle: vehicleName,
              vehicleId: bookingState.selectedVehicle || 'sedan',
              passengers: bookingState.passengerCount || bookingState.adultsCount || 2
            }
          } : {
            ziyaratDetails: null
          })
        };
      }

      const response = await sendBookingInquiry(payload);

      // Direct user to Thank You page with booking ID if available
      if (response && response.bookingId) {
        router.push(`/booking/thank-you?bookingId=${response.bookingId}`);
      } else {
        router.push('/booking/thank-you');
      }
    } catch (err) {
      console.error("Submission error:", err);
      router.push('/booking/thank-you');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepName = () => {
    if (isTransport) {
      if (currentStep === 1) return 'Service Mode & Group Size';
      if (currentStep === 2) return bookingState.transportMode === 'pointToPoint' ? 'Transfer Route Selection' : 'Route Selection';
      if (currentStep === 3) return 'Private Vehicle & Fleet Setup';
      if (currentStep === 4) return 'Route Schedule & Pickup Locations';
      return 'Lead Passenger Details';
    }
    if (isZiyarat) {
      if (currentStep === 1) return 'Select Ziyarat Routes';
      if (currentStep === 2) return 'Select Premium Fleet';
      if (currentStep === 3) return 'Schedule Itinerary Dates';
      return 'Lead Passenger Details';
    }
    if (isUmrahPlus) {
      if (currentStep === 1) return 'Stay & Guests';
      if (currentStep === 2) return bookingState.transportMode === 'pointToPoint' ? 'Transfer Route Selection' : 'Route Selection';
      if (currentStep === 3) return 'Private Vehicle & Fleet Setup';
      if (currentStep === 4) return 'Route Schedule & Pickup Locations';
      if (currentStep === 5) return 'Select Ziyarat Routes';
      if (currentStep === 6) return 'Select Premium Fleet';
      if (currentStep === 7) return 'Schedule Itinerary Dates';
      return 'Lead Passenger Details';
    }
    // Regular Umrah
    if (currentStep === 1) return 'Stay & Guests';
    if (hasTransport) {
      if (currentStep === 2) return 'Transportation';
      if (currentStep === 3) return 'Choose Private Vehicle & Fleet Setup';
      if (currentStep === 4) return 'Transfer Leg Dates & Pick-Up Timings';
    }
    return 'Lead Passenger Details';
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="booking-panel flex-1 bg-[#1a1c22] p-6 md:p-10 rounded-2xl shadow-xl border border-white/5 relative"
      >
        <StepProgressBar currentStep={currentStep} totalSteps={totalSteps} stepName={getStepName()} />

        <form onSubmit={handleNext}>
          <DynamicQuestionnaire
            step={currentStep}
            state={bookingState}
            updateState={updateState}
            type={type}
            onSkipTransport={handleSkipTransport}
          />

          <div className="mt-8 flex flex-wrap sm:flex-nowrap justify-between gap-3 sm:gap-4">
            <button
              type="button"
              onClick={handleBack}
              disabled={isSubmitting}
              className="bg-transparent border border-white/20 text-white hover:bg-white/5 uppercase tracking-[0.15em] p-4 rounded-xl font-bold text-xs sm:text-sm md:text-base flex items-center justify-center transition-all flex-1 sm:flex-initial sm:w-1/3 disabled:opacity-50 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </button>

            {/* Skip Transport button on transport steps 2–4 (Regular Umrah only) */}
            {(isRegularUmrah && hasTransport && currentStep >= 2 && currentStep <= 4) && (
              <button
                type="button"
                onClick={handleSkipTransport}
                disabled={isSubmitting}
                className="bg-transparent border border-white/20 hover:border-[#c5a059] text-gray-300 hover:text-[#c5a059] hover:bg-[#c5a059]/10 uppercase tracking-[0.15em] p-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center transition-all flex-1 sm:flex-initial whitespace-nowrap cursor-pointer"
              >
                Skip Transport
              </button>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 sm:flex-auto bg-[#c5a059] hover:bg-[#d4b57a] text-black uppercase tracking-[0.15em] p-4 rounded-xl font-bold text-xs sm:text-sm md:text-base flex items-center justify-center transition-all shadow-[0_4px_14px_rgba(197,160,89,0.39)] disabled:opacity-75 cursor-pointer"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Submitting Request...
                </span>
              ) : currentStep === totalSteps ? (
                'Submit Request'
              ) : (
                <>
                  Continue <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Side Summary Screen - Always visible */}
      <div className="w-full lg:w-80 shrink-0">
        <ItinerarySummary
          state={bookingState}
          type={type}
          ziyaratPkgParams={ziyaratPkgParams}
        />
      </div>

      {/* Add-ons suggestions drawer for Umrah & Umrah Plus */}
      <AnimatePresence>
        {showAddonsDrawer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowAddonsDrawer(false);
                if (isRegularUmrah) {
                  setCurrentStep(bookingState.selectedUpsells.includes('transport') ? 2 : totalSteps);
                } else if (isUmrahPlus) {
                  setCurrentStep(2);
                } else {
                  setCurrentStep(totalSteps);
                }
              }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#1a1c22] border-l border-white/10 z-[101] shadow-2xl overflow-y-auto flex flex-col custom-scrollbar"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-[#1a1c22]/90 backdrop-blur z-10">
                <h2 className="text-xl font-playfair italic text-[#c5a059]">✨ Enhance Your Journey</h2>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddonsDrawer(false);
                    if (isRegularUmrah) {
                      setCurrentStep(bookingState.selectedUpsells.includes('transport') ? 2 : totalSteps);
                    } else if (isUmrahPlus) {
                      setCurrentStep(2);
                    } else {
                      setCurrentStep(totalSteps);
                    }
                  }}
                  className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 flex-1 space-y-6">
                <p className="text-sm text-gray-400 font-light mb-4">
                  {isUmrahPlus 
                    ? "Private chauffeur transfers between Jeddah, Makkah, and Madinah. Add private transport to your Umrah Plus journey." 
                    : "Recommended experiences curated for your spiritual route. Add any options you would like included in your consultation."}
                </p>

                {(isUmrahPlus ? UPSELLS.filter(u => u.id === 'transport') : UPSELLS).map(u => {
                  const isSelected = bookingState.selectedUpsells.includes(u.id);
                  const buttonText = u.id === 'transport'
                    ? (isSelected ? 'Remove Transport' : 'Add Transport')
                    : (isSelected ? 'Remove Ziyarat' : 'Add Ziyarat');

                  return (
                    <div
                      key={u.id}
                      className={`flex flex-col gap-3 p-5 rounded-2xl border transition-all ${
                        isSelected ? 'border-[#c5a059] bg-[#c5a059]/5 shadow-[0_0_20px_rgba(197,160,89,0.1)]' : 'border-white/5 bg-[#0c0d10]'
                      }`}
                    >
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-[#c5a059] mb-1 font-semibold">{u.duration}</div>
                        <h4 className="text-base font-bold text-white mb-2">{u.name}</h4>
                        <p className="text-xs text-gray-400 font-light leading-relaxed">{u.description}</p>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-white/5">
                        <span className="text-xs text-gray-400 italic">Optional Add-on</span>
                        <button
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              updateState({
                                selectedUpsells: bookingState.selectedUpsells.filter(id => id !== u.id),
                                ...(u.id === 'transport' ? { skipTransport: true, selectedVehicle: null } : {})
                              });
                            } else {
                              updateState({
                                selectedUpsells: [...bookingState.selectedUpsells, u.id],
                                ...(u.id === 'transport' ? { skipTransport: false, selectedVehicle: bookingState.selectedVehicle || 'sedan' } : {})
                              });
                            }
                          }}
                          className={`py-2 px-5 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-transparent border border-[#c5a059] text-[#c5a059] hover:bg-[#c5a059]/10'
                              : 'bg-[#c5a059] text-black hover:bg-[#d4b57a]'
                          }`}
                        >
                          {buttonText}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-6 border-t border-white/10 sticky bottom-0 bg-[#1a1c22]">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddonsDrawer(false);
                    if (isRegularUmrah) {
                      setCurrentStep(bookingState.selectedUpsells.includes('transport') ? 2 : totalSteps);
                    } else if (isUmrahPlus) {
                      setCurrentStep(2);
                    } else {
                      setCurrentStep(totalSteps);
                    }
                  }}
                  className="w-full bg-[#c5a059] hover:bg-[#d4b57a] text-black uppercase tracking-[0.15em] p-4 rounded-xl font-bold text-sm flex items-center justify-center transition-all cursor-pointer shadow-lg"
                >
                  {isUmrahPlus ? (hasTransport ? 'Continue to Transportation' : 'Continue to Ziyarat Flow') : 'Continue To Next Step'} <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
