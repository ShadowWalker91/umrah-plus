'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  Building2,
  Car,
  Check,
  CheckSquare,
  Square,
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  Compass,
  Sparkles,
  ShieldCheck,
  Info,
  Calendar,
  Briefcase,
  ArrowRight,
  Navigation,
  CalendarDays,
  Layers,
  Plane
} from 'lucide-react';
import Image from 'next/image';
import GooglePlacesInput from './GooglePlacesInput';
import DateInputField from './DateInputField';
import { formatDateDDMMYYYY } from '@/lib/utils';
import { getTransportData, TransportStoreData } from '@/app/actions/transportActions';
import {
  BookingState,
  VEHICLES,
  HOTEL_CATEGORIES,
  PACKAGES,
  ZIYARAT_CITIES,
  ZIYARAT_LOCATIONS,
  TransportLeg
} from './BookingController';
import {
  ZIYARAT_CITIES_DATA,
  ZIYARAT_ROUTES,
  ZIYARAT_SITES,
  ZIYARAT_FLEET,
  ZIYARAT_PRICES,
  getZiyaratRouteFare,
  getZiyaratGroupPax,
  getRequiredFleetCount,
  getZiyaratAllocatedQuantity
} from '@/data/ziyaratBuilderData';
import { COUNTRIES } from '@/data/countriesData';

interface Props {
  step: number;
  state: BookingState;
  updateState: (updates: Partial<BookingState> | ((prev: BookingState) => Partial<BookingState>)) => void;
  type?: string;
  onSkipTransport?: () => void;
  onSkipZiyarat?: () => void;
}

export default function DynamicQuestionnaire({ step, state, updateState, type, onSkipTransport, onSkipZiyarat }: Props) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredSiteId, setHoveredSiteId] = useState<string | null>(null);

  // Nationality dropdown state
  const [isNationalityOpen, setIsNationalityOpen] = useState(false);
  const [nationalitySearch, setNationalitySearch] = useState('');
  const nationalityRef = useRef<HTMLDivElement>(null);
  const nationalitySearchRef = useRef<HTMLInputElement>(null);

  // Phone code dropdown state
  const [isPhoneCodeOpen, setIsPhoneCodeOpen] = useState(false);
  const [phoneCodeSearch, setPhoneCodeSearch] = useState('');
  const phoneCodeRef = useRef<HTMLDivElement>(null);
  const phoneCodeSearchRef = useRef<HTMLInputElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (nationalityRef.current && !nationalityRef.current.contains(e.target as Node)) {
        setIsNationalityOpen(false);
        setNationalitySearch('');
      }
      if (phoneCodeRef.current && !phoneCodeRef.current.contains(e.target as Node)) {
        setIsPhoneCodeOpen(false);
        setPhoneCodeSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-focus search input when dropdowns open
  useEffect(() => {
    if (isNationalityOpen && nationalitySearchRef.current) {
      nationalitySearchRef.current.focus();
    }
  }, [isNationalityOpen]);

  useEffect(() => {
    if (isPhoneCodeOpen && phoneCodeSearchRef.current) {
      phoneCodeSearchRef.current.focus();
    }
  }, [isPhoneCodeOpen]);

  // Filtered lists
  const filteredNationalityCountries = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(nationalitySearch.toLowerCase()) ||
    c.code.toLowerCase().includes(nationalitySearch.toLowerCase())
  );

  const filteredPhoneCodeCountries = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(phoneCodeSearch.toLowerCase()) ||
    c.dialCode.includes(phoneCodeSearch) ||
    c.code.toLowerCase().includes(phoneCodeSearch.toLowerCase())
  );

  // Find selected country for phone code display
  const selectedPhoneCountry = COUNTRIES.find(c => c.dialCode === state.leadDetails.phoneCode) || COUNTRIES.find(c => c.dialCode === '+966');

  const isTransport = type === 'Transport';
  const isUmrahPlus = type === 'Umrah Plus';
  const isZiyarat = type === 'Ziyarat';

  const [transportData, setTransportData] = useState<TransportStoreData | null>(null);

  useEffect(() => {
    getTransportData().then(res => {
      if (res && res.vehicles?.length > 0) {
        setTransportData(res);
      }
    }).catch(err => console.error("Failed to load transport data:", err));
  }, []);

  const cityOrder = ['mak', 'taif', 'mad'];
  const effectiveZiyaratCities = (state.selectedZiyaratCitiesList && state.selectedZiyaratCitiesList.length > 0
    ? [...state.selectedZiyaratCitiesList]
    : ['mak']
  ).sort((a, b) => cityOrder.indexOf(a) - cityOrder.indexOf(b));

  const isRegularUmrah = !isZiyarat && !isUmrahPlus && !isTransport;
  const isSimpleUmrah = isRegularUmrah;

  const hasTransport = isUmrahPlus
    ? !state.skipTransport
    : (isRegularUmrah
      ? state.selectedUpsells.includes('transport')
      : (!isZiyarat && !state.skipTransport));

  const totalSteps = isTransport
    ? 5
    : isZiyarat
      ? 4
      : isUmrahPlus
        ? 8
        : (hasTransport ? 5 : 2);

  const todayStr = new Date().toISOString().split('T')[0];

  const FIXED_CIRCUITS = [
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

  const DEFAULT_VEHICLES_ROSTER = [
    {
      id: 'sedan',
      name: 'Standard Sedan',
      category: 'Executive Sedan',
      capacity: 3,
      luggage: 2,
      image: 'https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/07/1-Lexus-300H.webp',
      description: 'Lexus or Camry sedan with premium air conditioning, optimal for small families or solo guests.',
      fixedRoutes: { p1: 800, p2: 1100, p3: 800, p4: 1350 },
      pointToPoint: { 'Jeddah ↔ Makkah': 275, 'Makkah ↔ Jeddah': 250, 'Makkah / Jeddah → Madinah': 450, 'Jeddah Airport ↔ Madinah': 475, 'Jeddah Airport ↔ Jeddah City': 250, 'Jeddah City → Jeddah Airport': 225, 'Madinah Airport → Madinah Hotel': 150, 'Madinah Hotel → Madinah Airport': 125, 'Makkah ↔ Masjid Ayesha (Return)': 150 }
    },
    {
      id: 'staria',
      name: 'Hyundai Staria',
      category: 'Family MPV',
      capacity: 5,
      luggage: 4,
      image: 'https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/07/3-hyundai.webp',
      description: 'Ultra-modern multi-seater MPV with generous legroom and spacious luggage capacity.',
      fixedRoutes: { p1: 1025, p2: 1450, p3: 990, p4: 1750 },
      pointToPoint: { 'Jeddah ↔ Makkah': 375, 'Makkah ↔ Jeddah': 325, 'Makkah / Jeddah → Madinah': 575, 'Jeddah Airport ↔ Madinah': 625, 'Jeddah Airport ↔ Jeddah City': 325, 'Jeddah City → Jeddah Airport': 310, 'Madinah Airport → Madinah Hotel': 185, 'Madinah Hotel → Madinah Airport': 150, 'Makkah ↔ Masjid Ayesha (Return)': 200 }
    },
    {
      id: 'hiace',
      name: 'Toyota Hiace',
      category: 'Family Van',
      capacity: 8,
      luggage: 7,
      image: 'https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/07/4-hiace.webp',
      description: 'High-roof 8-seater passenger van providing superior headroom and spacious cargo space.',
      fixedRoutes: { p1: 1250, p2: 1650, p3: 1280, p4: 1975 },
      pointToPoint: { 'Jeddah ↔ Makkah': 395, 'Makkah ↔ Jeddah': 350, 'Makkah / Jeddah → Madinah': 650, 'Jeddah Airport ↔ Madinah': 725, 'Jeddah Airport ↔ Jeddah City': 350, 'Jeddah City → Jeddah Airport': 320, 'Madinah Airport → Madinah Hotel': 350, 'Madinah Hotel → Madinah Airport': 225, 'Makkah ↔ Masjid Ayesha (Return)': 250 }
    },
    {
      id: 'gmc',
      name: 'GMC Yukon / Luxury SUV',
      category: 'VIP Luxury SUV',
      capacity: 5,
      luggage: 5,
      image: 'https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/07/2-gmc.webp',
      description: 'VIP full-size American SUV featuring plush captain leather seats and quiet cabin.',
      fixedRoutes: { p1: 1480, p2: 2075, p3: 1490, p4: 2475 },
      pointToPoint: { 'Jeddah ↔ Makkah': 450, 'Makkah ↔ Jeddah': 425, 'Makkah / Jeddah → Madinah': 850, 'Jeddah Airport ↔ Madinah': 890, 'Jeddah Airport ↔ Jeddah City': 410, 'Jeddah City → Jeddah Airport': 355, 'Madinah Airport → Madinah Hotel': 295, 'Madinah Hotel → Madinah Airport': 250, 'Makkah ↔ Masjid Ayesha (Return)': 300 }
    },
    {
      id: 'coaster',
      name: 'Toyota Coaster',
      category: 'Minibus',
      capacity: 15,
      luggage: 12,
      image: 'https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/07/5-coaster.webp',
      description: 'Dependable 15-passenger coaster with separate luggage compartments for group travel.',
      fixedRoutes: { p1: 1825, p2: 2375, p3: 1795, p4: 2950 },
      pointToPoint: { 'Jeddah ↔ Makkah': 625, 'Makkah ↔ Jeddah': 575, 'Makkah / Jeddah → Madinah': 890, 'Jeddah Airport ↔ Madinah': 975, 'Jeddah Airport ↔ Jeddah City': 525, 'Jeddah City → Jeddah Airport': 475, 'Madinah Airport → Madinah Hotel': 375, 'Madinah Hotel → Madinah Airport': 375, 'Makkah ↔ Masjid Ayesha (Return)': 400 }
    },
    {
      id: 'bus',
      name: 'VIP Luxury Coach',
      category: 'Coach Bus',
      capacity: 49,
      luggage: 45,
      image: 'https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/07/6-bus.webp',
      description: 'Executive 49-seater intercity bus equipped with panoramic views and guide microphone.',
      fixedRoutes: { p1: 3200, p2: 4200, p3: 3100, p4: 4900 },
      pointToPoint: { 'Jeddah ↔ Makkah': 805, 'Makkah ↔ Jeddah': 780, 'Makkah / Jeddah → Madinah': 1500, 'Jeddah Airport ↔ Madinah': 1600, 'Jeddah Airport ↔ Jeddah City': 750, 'Jeddah City → Jeddah Airport': 700, 'Madinah Airport → Madinah Hotel': 650, 'Madinah Hotel → Madinah Airport': 650, 'Makkah ↔ Masjid Ayesha (Return)': 600 }
    }
  ];

  const activeVehicles = (transportData?.vehicles && transportData.vehicles.length > 0)
    ? transportData.vehicles
    : DEFAULT_VEHICLES_ROSTER;

  const activeP2PRoutes = (transportData?.pointToPointRoutesList && transportData.pointToPointRoutesList.length > 0)
    ? transportData.pointToPointRoutesList
    : [
      'Jeddah ↔ Makkah',
      'Makkah ↔ Jeddah',
      'Makkah / Jeddah → Madinah',
      'Jeddah Airport ↔ Madinah',
      'Jeddah Airport ↔ Jeddah City',
      'Jeddah City → Jeddah Airport',
      'Madinah Airport → Madinah Hotel',
      'Madinah Hotel → Madinah Airport',
      'Makkah ↔ Masjid Ayesha (Return)',
    ];

  const handleSelectFixedCircuit = (pkgId: string) => {
    const pkg = FIXED_CIRCUITS.find(p => p.id === pkgId);
    if (!pkg) return;
    updateState(prev => {
      const initialDate = prev.fixedRouteLegs[0]?.date || prev.makkahCheckInDate || todayStr;
      const updatedLegs: TransportLeg[] = pkg.stops.map((stop, idx) => ({
        id: stop.id,
        from: stop.from,
        to: stop.to,
        label: stop.label,
        date: prev.fixedRouteLegs[idx]?.date || (idx === 0 ? initialDate : ''),
        time: prev.fixedRouteLegs[idx]?.time || (idx === 0 ? '14:00' : '10:00'),
        pickupLocation: prev.fixedRouteLegs[idx]?.pickupLocation || '',
        dropoffLocation: prev.fixedRouteLegs[idx]?.dropoffLocation || '',
        flightNo: prev.fixedRouteLegs[idx]?.flightNo || ''
      }));
      return {
        fixedRouteId: pkgId,
        fixedRouteLegs: updatedLegs
      };
    });
  };

  const handleLegDateChange = (idx: number, newDate: string) => {
    updateState(prev => {
      const updated = [...prev.fixedRouteLegs];
      if (updated[idx]) {
        updated[idx] = { ...updated[idx], date: newDate };
      }
      return { fixedRouteLegs: updated };
    });
  };

  const handleLegTimeChange = (idx: number, newTime: string) => {
    updateState(prev => {
      const updated = [...prev.fixedRouteLegs];
      if (updated[idx]) {
        updated[idx] = { ...updated[idx], time: newTime };
      }
      return { fixedRouteLegs: updated };
    });
  };

  const handleLegPickupChange = (idx: number, newLoc: string) => {
    updateState(prev => {
      const updated = [...prev.fixedRouteLegs];
      if (updated[idx]) {
        updated[idx] = { ...updated[idx], pickupLocation: newLoc };
      }
      return { fixedRouteLegs: updated };
    });
  };

  const handleLegDropoffChange = (idx: number, newLoc: string) => {
    updateState(prev => {
      const updated = [...prev.fixedRouteLegs];
      if (updated[idx]) {
        updated[idx] = { ...updated[idx], dropoffLocation: newLoc };
      }
      return { fixedRouteLegs: updated };
    });
  };

  const handleLegFlightChange = (idx: number, newFlight: string) => {
    updateState(prev => {
      const updated = [...prev.fixedRouteLegs];
      if (updated[idx]) {
        updated[idx] = { ...updated[idx], flightNo: newFlight };
      }
      return { fixedRouteLegs: updated };
    });
  };

  // =============================================================
  // TRANSPORT FLOW - STEP 1: SERVICE MODE & GROUP SIZE
  // =============================================================
  if (isTransport && step === 1) {
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <span className="text-xs text-[#c5a059] font-bold tracking-wider uppercase bg-[#c5a059]/10 px-3.5 py-1.5 rounded-full border border-[#c5a059]/25 shadow-sm">
            Step {step} of {totalSteps} • Service Mode & Group Size
          </span>
        </div>

        {/* 1. Mode Cards */}
        <div className="mb-8">
          <label className="block text-xs uppercase tracking-widest text-[#c5a059] font-bold mb-3">
            Choose Transport Booking Mode *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mode A: Fixed Route Packages */}
            <button
              type="button"
              onClick={() => updateState({ transportMode: 'fixed' })}
              className={`p-6 rounded-2xl border text-left transition-all duration-300 relative flex flex-col justify-between cursor-pointer group ${state.transportMode === 'fixed'
                  ? 'border-[#c5a059] bg-[#c5a059]/10 shadow-[0_0_25px_rgba(197,160,89,0.15)] ring-1 ring-[#c5a059]'
                  : 'border-white/10 bg-[#12141a] hover:border-white/20 hover:bg-[#161820]'
                }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${state.transportMode === 'fixed' ? 'bg-[#c5a059] text-black' : 'bg-white/5 text-[#c5a059]'}`}>
                  <Compass className="w-6 h-6" />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${state.transportMode === 'fixed' ? 'bg-[#c5a059] text-black font-extrabold' : 'bg-white/10 text-gray-400'
                  }`}>
                  Full Route
                </span>
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-1.5 group-hover:text-[#c5a059] transition-colors">
                  Fixed Route Packages
                </h4>
                <p className="text-xs text-gray-400 font-light leading-relaxed">
                  All-inclusive airport-to-airport pilgrim sequence covering Jeddah, Makkah, and Madinah. Chauffeur for each scheduled stop.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px]">
                <span className="text-gray-400">4 Pilgrim Packages</span>
                <span className="text-[#c5a059] font-semibold flex items-center gap-1">
                  Select Stops Schedule <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </button>

            {/* Mode B: Point-to-Point */}
            <button
              type="button"
              onClick={() => updateState({ transportMode: 'pointToPoint' })}
              className={`p-6 rounded-2xl border text-left transition-all duration-300 relative flex flex-col justify-between cursor-pointer group ${state.transportMode === 'pointToPoint'
                  ? 'border-[#c5a059] bg-[#c5a059]/10 shadow-[0_0_25px_rgba(197,160,89,0.15)] ring-1 ring-[#c5a059]'
                  : 'border-white/10 bg-[#12141a] hover:border-white/20 hover:bg-[#161820]'
                }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${state.transportMode === 'pointToPoint' ? 'bg-[#c5a059] text-black' : 'bg-white/5 text-[#c5a059]'}`}>
                  <MapPin className="w-6 h-6" />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${state.transportMode === 'pointToPoint' ? 'bg-[#c5a059] text-black font-extrabold' : 'bg-white/10 text-gray-400'
                  }`}>
                  Single Leg
                </span>
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-1.5 group-hover:text-[#c5a059] transition-colors">
                  Point-to-Point Transfer
                </h4>
                <p className="text-xs text-gray-400 font-light leading-relaxed">
                  Direct transfer between specific hotels, holy sites, or airport terminals. Pick up at your exact address with Google Places lookup.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px]">
                <span className="text-gray-400">Custom Addresses</span>
                <span className="text-[#c5a059] font-semibold flex items-center gap-1">
                  Custom Pickup & Drop-off <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* 2. Group Size & Luggage Counters */}
        <div className="bg-[#12141a] border border-white/5 rounded-2xl p-6 mb-4">
          <h4 className="text-xs uppercase tracking-widest text-[#c5a059] font-bold mb-4">
            Pilgrim Party & Luggage Allowance
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Adults Counter */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-white text-xs font-semibold">
                <Users className="w-4 h-4 text-[#c5a059]" />
                <span>Adults (Age 12+) *</span>
              </div>
              <p className="text-[11px] text-gray-500 font-light">Primary passengers</p>
              <div className="flex items-center gap-3 mt-1">
                <button
                  type="button"
                  onClick={() => updateState({ adultsCount: Math.max(1, state.adultsCount - 1) })}
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-lg text-white font-bold transition-all cursor-pointer"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-white text-base">
                  {state.adultsCount}
                </span>
                <button
                  type="button"
                  onClick={() => updateState({ adultsCount: state.adultsCount + 1 })}
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-lg text-white font-bold transition-all cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Children Counter */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-white text-xs font-semibold">
                <Users className="w-4 h-4 text-[#00d084]" />
                <span>Children (Age 2–11)</span>
              </div>
              <p className="text-[11px] text-gray-500 font-light">Assigned dedicated seat</p>
              <div className="flex items-center gap-3 mt-1">
                <button
                  type="button"
                  onClick={() => updateState({ childrenCount: Math.max(0, (state.childrenCount || 0) - 1) })}
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-lg text-white font-bold transition-all cursor-pointer"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-white text-base">
                  {state.childrenCount || 0}
                </span>
                <button
                  type="button"
                  onClick={() => updateState({ childrenCount: (state.childrenCount || 0) + 1 })}
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-lg text-white font-bold transition-all cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Luggage Counter */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-white text-xs font-semibold">
                <Briefcase className="w-4 h-4 text-[#c5a059]" />
                <span>Luggage Bags</span>
              </div>
              <p className="text-[11px] text-gray-500 font-light">Standard check-in bags</p>
              <div className="flex items-center gap-3 mt-1">
                <button
                  type="button"
                  onClick={() => updateState({ luggageCount: Math.max(0, (state.luggageCount || 0) - 1) })}
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-lg text-white font-bold transition-all cursor-pointer"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-white text-base">
                  {state.luggageCount || 0}
                </span>
                <button
                  type="button"
                  onClick={() => updateState({ luggageCount: (state.luggageCount || 0) + 1 })}
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-lg text-white font-bold transition-all cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // =============================================================
  // TRANSPORT FLOW - STEP 2 (Or Step 2 in Umrah Plus): ROUTE SELECTION ONLY
  // (Travel Dates, Pickup/Drop-off locations, and Timings moved to Step 4)
  // =============================================================
  const isTransportRouteStep = (isTransport && step === 2) || (isUmrahPlus && step === 2);
  if (isTransportRouteStep) {
    const isFixed = state.transportMode === 'fixed';

    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <span className="text-xs text-[#c5a059] font-bold tracking-wider uppercase bg-[#c5a059]/10 px-3.5 py-1.5 rounded-full border border-[#c5a059]/25 shadow-sm">
            Step {step} of {totalSteps} • Route Selection
          </span>
        </div>

        {/* Tabbed Route Selection: the active tab merges seamlessly into the
            gold-bordered options panel below (connected-tab pattern) */}
        <div className="bg-[#0c0d10] rounded-2xl shadow-[0_0_50px_rgba(197,160,89,0.10)] overflow-hidden">
          {/* Tab row — pulled down 2px to overlap the panel's top border;
              on mobile stack so the ACTIVE tab is always the one touching the panel */}
          <div className={`${isFixed ? 'flex flex-col-reverse' : 'flex flex-col'} gap-2 sm:grid sm:grid-cols-2 sm:gap-3 relative z-10 -mb-[2px]`}>
              {/* Tab 1: Fixed Route Packages */}
              <button
                type="button"
                onClick={() => updateState({ transportMode: 'fixed' })}
                className={`relative px-4 py-3 sm:py-3.5 rounded-t-2xl border-2 text-left transition-all duration-300 flex items-center justify-between gap-3 cursor-pointer ${
                  isFixed
                    ? 'border-[#c5a059] border-b-0 bg-[#c5a059] text-black shadow-[0_2px_15px_rgba(197,160,89,0.35)]'
                    : 'border-white/10 border-b-[#14161d] bg-[#14161d] text-gray-300 hover:border-[#c5a059]/50 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-lg shrink-0 ${isFixed ? 'bg-black/20 text-black' : 'bg-white/5 text-[#c5a059]'}`}>
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <span className={`text-xs sm:text-sm font-bold block ${isFixed ? 'text-black font-extrabold' : 'text-white font-semibold'}`}>
                      Fixed Route Packages
                    </span>
                    <span className={`text-[10px] hidden sm:block ${isFixed ? 'text-black/80 font-medium' : 'text-gray-400 font-light'}`}>
                      All-inclusive airport-to-airport sequence
                    </span>
                  </div>
                </div>
                <span className={`text-[9px] px-2 py-0.5 rounded font-extrabold uppercase tracking-wider shrink-0 ${
                  isFixed ? 'bg-black text-[#c5a059]' : 'bg-white/10 text-gray-400'
                }`}>
                  Full Route
                </span>
              </button>

              {/* Tab 2: Point-to-Point Transfer */}
              <button
                type="button"
                onClick={() => updateState({ transportMode: 'pointToPoint' })}
                className={`relative px-4 py-3 sm:py-3.5 rounded-t-2xl border-2 text-left transition-all duration-300 flex items-center justify-between gap-3 cursor-pointer ${
                  !isFixed
                    ? 'border-[#c5a059] border-b-0 bg-[#c5a059] text-black shadow-[0_2px_15px_rgba(197,160,89,0.35)]'
                    : 'border-white/10 border-b-[#14161d] bg-[#14161d] text-gray-300 hover:border-[#c5a059]/50 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-lg shrink-0 ${!isFixed ? 'bg-black/20 text-black' : 'bg-white/5 text-[#c5a059]'}`}>
                    <Navigation className="w-4 h-4" />
                  </div>
                  <div>
                    <span className={`text-xs sm:text-sm font-bold block ${!isFixed ? 'text-black font-extrabold' : 'text-white font-semibold'}`}>
                      Point-to-Point Transfer
                    </span>
                    <span className={`text-[10px] hidden sm:block ${!isFixed ? 'text-black/80 font-medium' : 'text-gray-400 font-light'}`}>
                      Direct single transfer between specific locations
                    </span>
                  </div>
                </div>
                <span className={`text-[9px] px-2 py-0.5 rounded font-extrabold uppercase tracking-wider shrink-0 ${
                  !isFixed ? 'bg-black text-[#c5a059]' : 'bg-white/10 text-gray-400'
                }`}>
                  Single Leg
                </span>
              </button>
          </div>

          {/* Body Content — gold boundary continues seamlessly from the active tab */}
          <div className="border-2 border-[#c5a059] rounded-b-2xl bg-[#0c0d10] p-5 sm:p-6 shadow-[0_0_35px_rgba(197,160,89,0.12)]">
            <AnimatePresence mode="wait">
              {isFixed ? (
                <motion.div
                  key="fixed-route-content"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs uppercase tracking-widest text-[#c5a059] font-bold block">
                      Select 1 of 4 Fixed Routes *
                    </span>
                    <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-medium">
                      4 Circuits Available
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {FIXED_CIRCUITS.map((pkg) => {
                      const isSelected = state.fixedRouteId === pkg.id;
                      return (
                        <button
                          key={pkg.id}
                          type="button"
                          onClick={() => handleSelectFixedCircuit(pkg.id)}
                          className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'border-[#c5a059] bg-[#c5a059]/10 shadow-[0_0_20px_rgba(197,160,89,0.2)] ring-1 ring-[#c5a059]'
                              : 'border-white/10 bg-[#12141a] hover:border-white/25 hover:bg-[#161820]'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-[#c5a059] uppercase tracking-wider">{pkg.name}</span>
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              isSelected ? 'bg-[#c5a059] text-black font-extrabold' : 'bg-white/10 text-gray-400'
                            }`}>
                              {pkg.badge}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-white mb-2">{pkg.title}</h4>
                          <p className="text-xs text-amber-400 font-semibold bg-black/40 px-3 py-2 rounded-xl border border-amber-500/20 leading-relaxed mb-3">
                            {pkg.fullRoute}
                          </p>
                          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-500">
                            <span>{pkg.stops.length} Separate Travel Stops</span>
                            {isSelected && (
                              <span className="text-[#00d084] font-bold flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" /> Selected
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="p2p-route-content"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs uppercase tracking-widest text-[#c5a059] font-bold block">
                      Standard Transfer Route Combination *
                    </span>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-medium">
                      Direct Transfer
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {activeP2PRoutes.map((rName) => {
                      const isSelected = state.pointToPointRoute === rName;
                      return (
                        <button
                          key={rName}
                          type="button"
                          onClick={() => updateState({ pointToPointRoute: rName })}
                          className={`p-3.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'border-[#c5a059] bg-[#c5a059]/15 text-[#c5a059] shadow-sm'
                              : 'border-white/10 bg-[#12141a] text-gray-300 hover:border-white/20 hover:text-white'
                          }`}
                        >
                          <span className="truncate">{rName}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#c5a059] shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    );
  }

  // =============================================================
  // TRANSPORT FLOW - STEP 3 (Or Step 3 in Umrah Plus): VEHICLE SELECTION & LIVE RATES
  // =============================================================
  const isTransportFleetStep = (isTransport && step === 3) || (isUmrahPlus && step === 3);
  if (isTransportFleetStep) {
    const isFixed = state.transportMode === 'fixed';
    const totalGuests = (state.adultsCount || 1) + (state.childrenCount || 0);

    const getVehiclePrice = (v: any): number => {
      if (isFixed) {
        return v.fixedRoutes?.[state.fixedRouteId] || 800;
      } else {
        return v.pointToPoint?.[state.pointToPointRoute] || 250;
      }
    };

    const handleSelectVehicle = (v: any) => {
      const basePrice = getVehiclePrice(v);
      const requiredCars = Math.max(1, Math.ceil(totalGuests / v.capacity));
      updateState({
        transportVehicleId: v.id,
        vehicleQuantity: requiredCars,
        calculatedTransportPrice: basePrice * requiredCars
      });
    };

    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <span className="text-xs text-[#c5a059] font-bold tracking-wider uppercase bg-[#c5a059]/10 px-3.5 py-1.5 rounded-full border border-[#c5a059]/25 shadow-sm">
            Step {step} of {totalSteps} • Choose Private Vehicle & Fleet Setup
          </span>
        </div>

        {/* Fleet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeVehicles.map((v) => {
            const isSelected = state.transportVehicleId === v.id;
            const basePrice = getVehiclePrice(v);
            const requiredCars = Math.max(1, Math.ceil(totalGuests / v.capacity));
            const needsMultiple = totalGuests > v.capacity;
            const cardTotalFare = basePrice * requiredCars;

            return (
              <div
                key={v.id}
                onClick={() => handleSelectVehicle(v)}
                className={`rounded-2xl border p-5 flex flex-col justify-between transition-all duration-300 cursor-pointer group relative ${isSelected
                    ? 'border-[#c5a059] bg-[#c5a059]/10 shadow-[0_0_30px_rgba(197,160,89,0.2)] ring-2 ring-[#c5a059]'
                    : 'border-white/10 bg-[#12141a] hover:border-white/30 hover:bg-[#181a22]'
                  }`}
              >
                <div>
                  {/* Photo Thumbnail */}
                  <div className="w-full h-44 bg-black/40 rounded-xl overflow-hidden mb-4 flex items-center justify-center border border-white/5 relative p-2">
                    <img
                      src={v.image}
                      alt={v.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2.5 right-2.5 bg-black/80 text-[#c5a059] border border-[#c5a059]/30 text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase">
                      {v.capacity} Guests / Car
                    </span>
                  </div>

                  {/* Vehicle Header */}
                  <div className="flex items-start justify-between mb-1.5">
                    <div>
                      <h4 className="text-base font-bold text-white group-hover:text-[#c5a059] transition-colors">
                        {v.name}
                      </h4>
                      <span className="text-[11px] text-gray-400 font-medium">
                        {v.category}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-[#c5a059] text-black flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4 font-bold" />
                      </div>
                    )}
                  </div>

                  {/* Concise Specs Row without long descriptions */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-300 my-3 bg-white/5 px-3 py-2.5 rounded-xl border border-white/5">
                    <div className="flex items-center justify-center gap-1.5 font-medium">
                      <Users className="w-4 h-4 text-[#c5a059] shrink-0" />
                      <span className="truncate">{v.capacity} Pax / Car</span>
                    </div>
                    <div className="flex items-center justify-center gap-1.5 font-medium border-l border-white/10">
                      <Briefcase className="w-4 h-4 text-[#c5a059] shrink-0" />
                      <span className="truncate">{v.luggage} Bags</span>
                    </div>
                  </div>
                </div>

                {/* Pricing & Fleet Multiplier Box */}
                <div className="pt-3 border-t border-white/10 mt-2">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-[11px] text-gray-400 uppercase font-semibold">
                      {requiredCars > 1 ? `${requiredCars}x Cars Total Fare:` : 'Total Fare:'}
                    </span>
                    <span className="text-lg font-bold text-[#c5a059] font-mono">
                      AED {cardTotalFare}
                    </span>
                  </div>

                  {/* Capacity Multiplier Alert & Fleet allocation */}
                  {needsMultiple ? (
                    <div className="mt-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 text-xs text-amber-300 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{totalGuests} guests exceed 1 car ({v.capacity} pax).</span>
                      </div>
                      <span className="bg-amber-400 text-black font-extrabold px-2 py-0.5 rounded text-[10px] uppercase shrink-0">
                        {requiredCars}x Required
                      </span>
                    </div>
                  ) : (
                    <div className="mt-2 text-[11px] text-gray-400 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>1 car comfortably accommodates {totalGuests} guest{totalGuests > 1 ? 's' : ''}</span>
                    </div>
                  )}

                  {/* Selected allocation summary */}
                  {isSelected && (
                    <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                      <span className="text-gray-400 font-medium">Allocated Vehicles:</span>
                      <span className="font-bold text-[#c5a059] bg-[#c5a059]/10 border border-[#c5a059]/30 px-2.5 py-1 rounded-lg">
                        {requiredCars}x {v.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    );
  }

  // =============================================================
  // =============================================================
  // ZIYARAT FLOW - STEP 1 (Or Step 5 in Umrah Plus): CHOOSE SACRED ROUTES (HORIZONTAL BUILDER)
  // Replicating media_1789907816882.html exactly
  // =============================================================
  const isZiyaratRouteStep = (isZiyarat && step === 1) || (isUmrahPlus && step === 4);
  if (isZiyaratRouteStep) {
    const ZIYARAT_BUILDER_CITIES = [
      { id: "mak", name: "Makkah", img: "https://media-public.canva.com/MtqFQ/MAGLyYMtqFQ/1/s.jpg", routes: ['mak-1', 'mak-all'] },
      { id: "taif", name: "Taif", img: "https://www.beesocialpk.com/ABGroup/uri_ifs___M_bGq5Ir7OMOX705hHW3r3S0OhWwjTsT-meYvD07qbyH8.webp", routes: ['taif-1'] },
      { id: "mad", name: "Madinah", img: "https://media-public.canva.com/7_TE0/MAG4vq7_TE0/1/s.jpg", routes: ['mad-1', 'mad-2', 'mad-3', 'mad-4', 'mad-5', 'mad-6', 'mad-7', 'mad-all'] }
    ];

    const toggleSelectRoute = (e: React.MouseEvent, routeId: string) => {
      e.stopPropagation();
      const isSelected = state.selectedZiyaratRoutes.includes(routeId);
      const updatedRoutes = isSelected
        ? state.selectedZiyaratRoutes.filter(id => id !== routeId)
        : [...state.selectedZiyaratRoutes, routeId];

      // Cities stay in sync with the routes: a city is only selected while at
      // least one of its routes is checked (keeps the URL/summary accurate).
      const updatedCities = (['mak', 'mad', 'taif'] as const).filter(cityId =>
        updatedRoutes.some(rId => ZIYARAT_ROUTES.find(r => r.id === rId)?.cityId === cityId)
      );

      updateState({
        selectedZiyaratRoutes: updatedRoutes,
        selectedZiyaratCitiesList: [...updatedCities]
      });
    };

    const toggleExpandRoute = (e: React.MouseEvent, routeId: string) => {
      e.stopPropagation();
      e.preventDefault();
      updateState({
        expandedZiyaratRoute: state.expandedZiyaratRoute === routeId ? null : routeId
      });
    };

    const totalSelectedSitesCount = state.selectedZiyaratRoutes.reduce((sum, rId) => {
      const r = ZIYARAT_ROUTES.find(route => route.id === rId);
      return sum + (r?.siteIds.length || 0);
    }, 0);

    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <span className="text-xs text-[#c5a059] font-bold tracking-wider uppercase bg-[#c5a059]/10 px-3.5 py-1.5 rounded-full border border-[#c5a059]/25 shadow-sm">
            Step {step} of {totalSteps} • Select Your Ziyarat Routes
          </span>
        </div>

        {/* Mobile/Tablet Quick Jump Pills */}
        <div className="flex lg:hidden justify-center items-center gap-2 mb-6">
          <button
            type="button"
            className="bg-[#131c2a] border border-[#c5a059]/40 text-[#f9e8a2] px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#c5a059] hover:text-black transition-colors cursor-pointer"
            onClick={() => document.getElementById('col-mak')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
          >
            Makkah
          </button>
          <button
            type="button"
            className="bg-[#131c2a] border border-[#c5a059]/40 text-[#f9e8a2] px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#c5a059] hover:text-black transition-colors cursor-pointer"
            onClick={() => document.getElementById('col-taif')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
          >
            Taif
          </button>
          <button
            type="button"
            className="bg-[#131c2a] border border-[#c5a059]/40 text-[#f9e8a2] px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#c5a059] hover:text-black transition-colors cursor-pointer"
            onClick={() => document.getElementById('col-mad')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
          >
            Madinah
          </button>
        </div>

        {/* Horizontal Builder (Symmetrical 3-Column Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-20 pb-4">
          {ZIYARAT_BUILDER_CITIES.map((city, colIdx) => (
            <div
              key={city.id}
              id={`col-${city.id}`}
              className="flex flex-col items-center relative w-full group/col"
            >
              {/* Connecting Golden Line between circle nodes on Desktop */}
              {colIdx < ZIYARAT_BUILDER_CITIES.length - 1 && (
                <div className="hidden lg:block absolute top-[55px] left-[calc(50%+55px)] w-[calc(100%-110px+24px)] h-1 bg-gradient-to-r from-[#d4af37] via-[#f9e8a2] to-[#d4af37] shadow-[0_0_10px_rgba(212,175,55,0.5)] z-0 pointer-events-none rounded-full" />
              )}

              {/* Main Node Circle */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#111827] border-4 border-[#d4af37] flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.8),inset_0_0_15px_rgba(212,175,55,0.4)] relative z-10 overflow-hidden shrink-0">
                <img
                  src={city.img}
                  alt={city.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover/col:scale-110"
                />
              </div>

              {/* City Title & Sacred Sites Count */}
              <div className="flex flex-col items-center mt-4 mb-3 text-center">
                <h3 className="brand-font text-lg sm:text-xl font-bold text-[#f9e8a2] uppercase tracking-[1.5px] drop-shadow-md">
                  {city.name}
                </h3>
                <span className="text-[11px] text-gray-400 font-medium mt-0.5">
                  {city.id === 'mak' ? '2 Routes • 39 Holy Sites' : city.id === 'taif' ? '1 Route • 11 Holy Sites' : '8 Routes • 82+ Holy Sites'}
                </span>
              </div>

              {/* Route Controls List */}
              <div className="flex flex-col gap-2.5 w-full relative z-20">
                {city.routes.map(rId => {
                  const rObj = ZIYARAT_ROUTES.find(r => r.id === rId);
                  const isChecked = state.selectedZiyaratRoutes.includes(rId);
                  const isExpanded = state.expandedZiyaratRoute === rId;
                  const priceEntry = ZIYARAT_PRICES[rId];
                  const selectedFleetId = state.selectedVehicle || 'sedan';
                  const fleetQty = getZiyaratAllocatedQuantity(selectedFleetId, isUmrahPlus, state.adultsCount, state.childrenCount, state.passengerCount);
                  const fareNum = getZiyaratRouteFare(rId, selectedFleetId);
                  const routeFare = fareNum !== null
                    ? `SAR ${fareNum * fleetQty}`
                    : (priceEntry?.custom ? 'Custom' : null);
                  const typeClass = city.id === 'mak' ? 'branch-mak' : (city.id === 'taif' ? 'branch-taif' : 'branch-mad');

                  return (
                    <div key={rId} className="flex flex-col w-full">
                      {/* Route Button Container - Clicking tab expands/collapses itineraries */}
                      <div
                        onClick={(e) => toggleExpandRoute(e, rId)}
                        className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-2.5 cursor-pointer user-select-none shadow-md ${isChecked
                            ? 'border-[#d4af37] bg-[#d4af37]/15 text-[#f9e8a2] shadow-[0_4px_15px_rgba(212,175,55,0.2)]'
                            : isExpanded
                              ? 'border-[#d4af37]/60 bg-[#152030] text-white shadow-md'
                              : 'border-white/10 bg-[#131c2a] text-gray-300 hover:border-[#d4af37]/60 hover:text-white hover:-translate-y-0.5'
                          }`}
                      >
                        {/* Checkbox (selects route only on checkbox click) & Route Name */}
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <button
                            type="button"
                            onClick={(e) => toggleSelectRoute(e, rId)}
                            title={isChecked ? "Deselect this route" : "Select this route"}
                            className="p-1 -m-1 rounded hover:bg-white/10 transition-colors flex items-center justify-center shrink-0 cursor-pointer"
                          >
                            <div
                              className={`w-[18px] h-[18px] rounded border-2 flex items-center justify-center shrink-0 transition-all ${isChecked
                                  ? 'bg-[#d4af37] border-[#d4af37] text-black font-bold text-xs shadow-[0_0_8px_rgba(212,175,55,0.4)]'
                                  : 'border-gray-500 bg-transparent hover:border-[#d4af37]'
                                }`}
                            >
                              {isChecked && '✓'}
                            </div>
                          </button>
                          <div className="flex flex-col min-w-0 flex-1 text-left">
                            <span className="text-xs font-semibold truncate leading-tight">
                              {rObj?.name || rId}
                            </span>
                            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                              <span className="inline-flex items-center px-1.5 py-0.5 bg-black/60 rounded border border-[#d4af37]/40 text-[#f9e8a2] font-bold text-[9px] uppercase tracking-wider shadow-sm">
                                {rObj?.siteIds.length || 0} Ziyarats
                              </span>
                              <span className="text-gray-400 text-[10px] truncate">{rObj?.duration}</span>
                            </div>
                          </div>
                        </div>

                        {/* Route Fare (same pricing logic as the Selected Ziyarat Routes
                            panel) stacked above the Downward Expand Button */}
                        <div className="flex flex-col items-end gap-3 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => toggleExpandRoute(e, rId)}
                            title="Expand sacred sites"
                            className={`w-7 h-7 rounded-md flex items-center justify-center transition-all cursor-pointer ${isExpanded
                                ? 'bg-[#d4af37] text-black font-bold shadow-[0_0_10px_rgba(212,175,55,0.5)] rotate-180'
                                : 'bg-white/5 border border-[#d4af37]/30 text-[#f9e8a2] hover:bg-[#d4af37]/20 hover:scale-105'
                              }`}
                          >
                            <svg className="w-3.5 h-3.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                                                    {routeFare && (
                              <span className="text-[10px] font-bold text-[#f9e8a2] bg-black/40 border border-[#d4af37]/30 px-1 py-0.5 rounded uppercase whitespace-nowrap shadow-[0_0_8px_rgba(212,175,55,0.15)]">
                                {routeFare}
                              </span>
                            )}
                        </div>
                      </div>

                      {/* Expandable Sacred Sites Branch right beneath the button */}
                      {isExpanded && rObj && (
                        <div className="w-full flex justify-center">
                          <div className={`ziyarat-branch ${typeClass} w-full mt-2 mb-3 p-4 rounded-xl bg-[#131c2a]/95 backdrop-blur-md border-t-4 shadow-2xl`}>
                            <div className="text-xs font-bold uppercase tracking-wider text-center pb-2 mb-3 border-b border-white/10 text-[#f9e8a2]">
                              {rObj.name} ({rObj.siteIds.length} Sacred Sites)
                            </div>
                            <div className="space-y-2">
                              {rObj.siteIds.map(nodeKey => {
                                const nodeData = ZIYARAT_SITES[nodeKey];
                                if (!nodeData) return null;
                                return (
                                  <div key={nodeKey} className="z-node group/node">
                                    <div className="z-dot" />
                                    <span className="text-xs text-gray-200 group-hover/node:text-white font-medium">
                                      {nodeData.name}
                                    </span>
                                    <div className="info-popup">
                                      {nodeData.image && (
                                        <img src={nodeData.image} className="popup-img" alt={nodeData.name} />
                                      )}
                                      <div className="popup-title">{nodeData.name}</div>
                                      <div className="popup-desc">{nodeData.description}</div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Selected Routes Status Notice with Total Ziyarat Count */}
        <div className="mt-4 p-4 rounded-xl bg-[#0c0d10] border border-[#c5a059]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2.5">
            <Compass className="w-5 h-5 text-[#c5a059] shrink-0" />
            <span className="text-xs text-gray-300">
              {state.selectedZiyaratRoutes.length === 0 ? (
                <span className="text-amber-400 font-medium">Please check at least one Holy route above to proceed to Step 2.</span>
              ) : (
                <span>
                  <strong className="text-[#f9e8a2] font-bold">{totalSelectedSitesCount} Sacred Ziyarat Sites</strong> across <strong className="text-white font-bold">{state.selectedZiyaratRoutes.length} route(s)</strong> selected for your sacred pilgrimage.
                </span>
              )}
            </span>
          </div>
          <span className="text-xs bg-[#c5a059]/15 text-[#f9e8a2] border border-[#c5a059]/40 px-3.5 py-1.5 rounded-full font-bold self-start sm:self-center shadow-sm">
            {totalSelectedSitesCount} Ziyarat Sites ({state.selectedZiyaratRoutes.length} Routes)
          </span>
        </div>
      </motion.div>
    );
  }

  // =============================================================
  // =============================================================
  // =============================================================
  // ZIYARAT FLOW - STEP 2 (Or Step 6 in Umrah Plus): SELECT YOUR PREMIUM FLEET
  // =============================================================
  const isZiyaratFleetStep = (isZiyarat && step === 2) || (isUmrahPlus && step === 5);
  if (isZiyaratFleetStep) {
    const BUILDER_FLEET = [
      { id: 'sedan', name: "Sedan Camry", pax: 2, img: "https://media.chromedata.com/MediaGallery/media/MjkzOTU4Xk1lZGlhIEdhbGxlcnk/LMd-9QmYj0RCGAoxWsfyPWl1t1lqVvBOWhYclhW_GkmTSoPJtmjQooeAQy-4AZvqC80rpio2ZaQZSeYea8gHA1JZAMeve7Gpm0P4JEYia9pYaK5dPRINNtNjTzOlaxeUIZI61loFi1vRgiIl4fJLEecm6T2z3C4NeT12INl11yM/cc_2026TOC022075593_01_640_218.png" },
      { id: 'gmc', name: "GMC Yukon", pax: 6, img: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/07/2-gmc.webp" },
      { id: 'staria', name: "Hyundai Staria", pax: 9, img: "https://www.hyundai.com/content/dam/hyundai/ph/en/images/find-a-car/thumbnail/STARIA-HEV.png" },
      { id: 'hiace', name: "Toyota Hiace", pax: 11, img: "https://img.pcauto.com/model/images/touPic/my/Toyota-Granace_4931.png" },
      { id: 'coaster', name: "Toyota Coaster", pax: 20, img: "https://madinahmakkahtaxi.com/toyota-coaster.jpg" },
      { id: 'bus49', name: "49 Seater Bus", pax: 49, img: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/07/6-bus.webp" }
    ];

    const totalPax = getZiyaratGroupPax(isUmrahPlus, state.adultsCount, state.childrenCount, state.passengerCount);
    const activeVehicleId = state.selectedVehicle || 'sedan';
    const activeVehicle = BUILDER_FLEET.find(v => v.id === activeVehicleId) || BUILDER_FLEET[0];
    const activeQty = getRequiredFleetCount(totalPax, activeVehicle.pax);
    const pricedRoutesTotal = (state.selectedZiyaratRoutes || []).reduce((sum, rId) => {
      const fare = getZiyaratRouteFare(rId, activeVehicle.id);
      return sum + (fare || 0);
    }, 0);

    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <span className="text-xs text-[#c5a059] font-bold tracking-wider uppercase bg-[#c5a059]/10 px-3.5 py-1.5 rounded-full border border-[#c5a059]/25 shadow-sm">
            Step {step} of {totalSteps} • Select Your Premium Fleet
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {BUILDER_FLEET.map(v => {
            const isActive = activeVehicleId === v.id;
            const requiredCars = getRequiredFleetCount(totalPax, v.pax);
            const needsMultiple = totalPax > v.pax;

            return (
              <div
                key={v.id}
                onClick={() => {
                  updateState({ selectedVehicle: v.id });
                }}
                className={`rounded-2xl border p-5 flex flex-col items-center justify-between text-center transition-all cursor-pointer relative ${isActive
                    ? 'border-[#c5a059] bg-[#1e293b]/95 shadow-[0_10px_30px_rgba(212,175,55,0.3)] ring-2 ring-[#c5a059] scale-[1.02]'
                    : 'border-white/10 bg-[#131c2a]/85 hover:border-[#c5a059]/50 hover:-translate-y-1 hover:shadow-xl'
                  }`}
              >
                <div className="w-full h-24 flex items-center justify-center mb-3">
                  <img
                    src={v.img}
                    alt={v.name}
                    className={`max-w-[150px] max-h-[75px] object-contain transition-transform duration-300 ${v.id === 'bus49' ? 'scale-115' : ''
                      }`}
                  />
                </div>
                <h5 className="font-bold text-white text-base mb-1">{v.name}</h5>
                <span className="text-xs text-[#c5a059] bg-[#c5a059]/10 px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider mb-3">
                  Up to {v.pax} Passengers
                </span>

                {/* Capacity fit & fleet allocation (same model as the transport fleet step) */}
                <div className="mt-auto w-full pt-1 space-y-2">
                  {needsMultiple ? (
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 text-[11px] text-amber-300 flex items-center justify-between text-left">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{totalPax} guests exceed 1 car ({v.pax} pax).</span>
                      </div>
                      <span className="bg-amber-400 text-black font-extrabold px-2 py-0.5 rounded text-[10px] uppercase shrink-0">
                        {requiredCars}x Required
                      </span>
                    </div>
                  ) : (
                    <div className="text-[11px] text-gray-400 flex items-center justify-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>1 car comfortably accommodates {totalPax} guest{totalPax > 1 ? 's' : ''}</span>
                    </div>
                  )}

                  {isActive ? (
                    <>
                      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-left">
                        <span className="text-gray-400 font-medium">Allocated Vehicles:</span>
                        <span className="font-bold text-[#c5a059] bg-[#c5a059]/10 border border-[#c5a059]/30 px-2.5 py-0.5 rounded-lg">
                          {requiredCars}x {v.name}
                        </span>
                      </div>
                      {pricedRoutesTotal > 0 && (
                        <div className="flex items-baseline justify-between gap-x-2 text-left">
                          <span className="text-[11px] text-gray-400 uppercase font-semibold min-w-0">
                            {activeQty > 1 ? `${activeQty}x Route Fares Total:` : 'Route Fares Total:'}
                          </span>
                          <span className="text-lg font-bold text-[#c5a059] font-mono whitespace-nowrap shrink-0">
                            SAR {pricedRoutesTotal * activeQty}
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 hover:text-white text-center">
                      Click to Select
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    );
  }

  // =============================================================
  // ZIYARAT FLOW - STEP 3 (Or Step 7 in Umrah Plus): SCHEDULE ITINERARY DATES
  // =============================================================
  const isZiyaratDateStep = (isZiyarat && step === 3) || (isUmrahPlus && step === 6);
  if (isZiyaratDateStep) {
    const todayStr = new Date().toISOString().split('T')[0];

    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <span className="text-xs text-[#c5a059] font-bold tracking-wider uppercase bg-[#c5a059]/10 px-3.5 py-1.5 rounded-full border border-[#c5a059]/25 shadow-sm">
            Step {step} of {totalSteps} • Schedule Itinerary Dates
          </span>
        </div>

        {/* 2. Schedule Date for Each Selected Itinerary */}
        <div className="bg-[#0c0d10] border border-[#c5a059]/40 rounded-2xl p-5 sm:p-6 mb-8 shadow-[0_0_30px_rgba(197,160,89,0.08)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4 mb-4">
            <div>
              <h4 className="text-sm font-bold tracking-wider text-[#c5a059] uppercase flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#c5a059]" />
                Schedule Date for Each Selected Itinerary ({state.selectedZiyaratRoutes.length})
              </h4>
              <p className="text-xs text-gray-400 font-light mt-1">
                Please specify your planned travel date for each holy tour. Past dates are disabled.
              </p>
            </div>
            <span className="text-[11px] text-amber-400/90 font-medium bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full whitespace-nowrap self-start sm:self-center">
              Must be today or future date
            </span>
          </div>

          {state.selectedZiyaratRoutes.length === 0 ? (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs text-center">
              No itineraries selected yet. Please go back to Step 1 to select your Ziyarat routes.
            </div>
          ) : (
            <div className="space-y-3">
              {state.selectedZiyaratRoutes.map(rId => {
                const r = ZIYARAT_ROUTES.find(route => route.id === rId);
                if (!r) return null;
                const curDate = state.selectedZiyaratRouteDates?.[rId] || '';
                const isDateValid = Boolean(curDate && curDate >= todayStr);
                const pEntry = ZIYARAT_PRICES[rId];
                const selectedFleetId = state.selectedVehicle || 'sedan';
                const fleetQty = getZiyaratAllocatedQuantity(selectedFleetId, isUmrahPlus, state.adultsCount, state.childrenCount, state.passengerCount);
                const fareNum = getZiyaratRouteFare(rId, selectedFleetId);
                const routeFare = fareNum !== null
                  ? `SAR ${fareNum * fleetQty}`
                  : (pEntry?.custom ? 'Custom Plan' : '');

                let cityBorder = 'border-l-emerald-500';
                if (r.cityId === 'mak') cityBorder = 'border-l-blue-500';
                if (r.cityId === 'taif') cityBorder = 'border-l-purple-500';

                return (
                  <div
                    key={rId}
                    className={`p-4 rounded-xl border border-l-4 ${cityBorder} transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${isDateValid
                        ? 'bg-[#131c2a]/90 border-white/10'
                        : 'bg-[#1a1c22] border-[#c5a059]/60 shadow-[0_0_15px_rgba(197,160,89,0.12)] ring-1 ring-[#c5a059]/30'
                      }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[10px] uppercase font-bold text-[#c5a059] tracking-wider">
                          {r.cityName} • {r.duration}
                        </span>
                        {routeFare && (
                          <span className="text-[11px] font-bold text-[#f9e8a2] bg-black/40 border border-[#c5a059]/30 px-2 py-0.5 rounded">
                            {routeFare}
                          </span>
                        )}
                      </div>
                      <h5 className="text-white font-bold text-sm leading-snug">{r.name}</h5>
                      <span className="text-[11px] text-gray-400 font-light block mt-0.5">
                        {r.siteIds.length} Sacred Sites Included
                      </span>
                    </div>

                    <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
                      <label
                        htmlFor={`date-input-${rId}`}
                        className="text-[11px] text-gray-300 uppercase tracking-wider font-semibold flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Travel Date *</span>
                        {isDateValid ? (
                          <span className="text-emerald-400 font-bold text-[10px] flex items-center gap-0.5">
                            <Check className="w-3 h-3" /> Confirmed
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
                        isValid={isDateValid}
                        hasError={!isDateValid}
                        onChange={(isoVal) => {
                          updateState({
                            selectedZiyaratRouteDates: {
                              ...(state.selectedZiyaratRouteDates || {}),
                              [rId]: isoVal
                            }
                          });
                        }}
                      />
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


  // =============================================================
  // UMRAH & UMRAH PLUS - STEP 1: STAY & GUESTS
  // =============================================================
  if (step === 1 && !isZiyarat) {
    const todayStr = new Date().toISOString().split('T')[0];

    // Helper for auto-calculating nights when dates are updated
    const handleMakkahDatesUpdate = (newCheckIn?: string, newCheckOut?: string) => {
      const cIn = newCheckIn !== undefined ? newCheckIn : state.makkahCheckInDate;
      const cOut = newCheckOut !== undefined ? newCheckOut : state.makkahCheckOutDate;
      const updates: Partial<BookingState> = {
        ...(newCheckIn !== undefined ? { makkahCheckInDate: newCheckIn } : {}),
        ...(newCheckOut !== undefined ? { makkahCheckOutDate: newCheckOut } : {}),
      };

      if (cIn && cOut) {
        const diff = Math.ceil((new Date(cOut).getTime() - new Date(cIn).getTime()) / (1000 * 60 * 60 * 24));
        if (diff > 0) {
          updates.makkahNights = diff;
        }
      }
      updateState(updates);
    };

    const handleMadinahDatesUpdate = (newCheckIn?: string, newCheckOut?: string) => {
      const cIn = newCheckIn !== undefined ? newCheckIn : state.madinahCheckInDate;
      const cOut = newCheckOut !== undefined ? newCheckOut : state.madinahCheckOutDate;
      const updates: Partial<BookingState> = {
        ...(newCheckIn !== undefined ? { madinahCheckInDate: newCheckIn } : {}),
        ...(newCheckOut !== undefined ? { madinahCheckOutDate: newCheckOut } : {}),
      };

      if (cIn && cOut) {
        const diff = Math.ceil((new Date(cOut).getTime() - new Date(cIn).getTime()) / (1000 * 60 * 60 * 24));
        if (diff > 0) {
          updates.madinahNights = diff;
        }
      }
      updateState(updates);
    };

    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <span className="text-xs text-[#c5a059] font-bold tracking-wider uppercase bg-[#c5a059]/10 px-3.5 py-1.5 rounded-full border border-[#c5a059]/25 shadow-sm">
            Step 1 of {totalSteps} • Stay & Guests
          </span>
        </div>

        {/* 1. GUESTS (Pilgrims only - Infants completely removed) */}
        <div className="bg-[#0c0d10] border border-white/5 rounded-2xl p-5 sm:p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#c5a059]" />
              <h4 className="text-sm font-bold tracking-wider text-white uppercase whitespace-nowrap">
                Guests
              </h4>
            </div>
            <span className="text-xs text-gray-400">
              Total Pilgrims: <strong className="text-white font-semibold">{state.adultsCount}</strong>
            </span>
          </div>

          <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl bg-[#1a1c22] border border-white/5">
            <div>
              <span className="block text-white font-medium text-sm whitespace-nowrap">Pilgrims</span>
              <span className="text-[11px] text-gray-400">Total travelers joining this blessed journey</span>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => updateState({ adultsCount: Math.max(1, state.adultsCount - 1), passengerCount: Math.max(1, state.adultsCount - 1), infantsCount: 0 })}
                className="w-9 h-9 rounded-lg bg-[#0c0d10] border border-white/10 text-white flex justify-center items-center hover:bg-white/5 text-base transition-colors cursor-pointer"
              >
                -
              </button>
              <span className="text-lg font-bold text-white w-7 text-center">{state.adultsCount}</span>
              <button
                type="button"
                onClick={() => updateState({ adultsCount: state.adultsCount + 1, passengerCount: state.adultsCount + 1, infantsCount: 0 })}
                className="w-9 h-9 rounded-lg bg-[#0c0d10] border border-white/10 text-white flex justify-center items-center hover:bg-white/5 text-base transition-colors cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* 2. MAKKAH STAY (Mandatory) */}
        <div className="bg-[#0c0d10] border border-white/5 rounded-2xl p-5 sm:p-6 mb-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#c5a059]" />
              <h4 className="text-sm font-bold tracking-wider text-white uppercase whitespace-nowrap">
                Makkah Stay
              </h4>
            </div>
            <span className="text-[10px] font-bold text-[#c5a059] bg-[#c5a059]/10 px-2.5 py-0.5 rounded-full border border-[#c5a059]/20 uppercase tracking-wider whitespace-nowrap">
              Required
            </span>
          </div>

          {/* Hotel Type */}
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2.5">
              Hotel Category
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              {HOTEL_CATEGORIES.map(c => {
                const isSelected = state.makkahHotelCategory === c.id;
                return (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => updateState({ makkahHotelCategory: c.id })}
                    className={`py-3 px-2 rounded-xl border text-center transition-all flex items-center justify-center cursor-pointer ${isSelected
                        ? 'border-[#c5a059] bg-[#c5a059]/15 text-[#c5a059] font-bold shadow-[0_0_15px_rgba(197,160,89,0.15)]'
                        : 'border-white/5 bg-[#1a1c22] text-gray-300 hover:border-white/20'
                      }`}
                  >
                    <span className="text-xs sm:text-sm font-medium whitespace-nowrap">{c.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preferred Hotel Text Field */}
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
              Preferred Hotel (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Makkah Clock Royal Tower, Swissôtel Al Maqam, Pullman Zamzam..."
              value={state.makkahPreferredHotel || ''}
              onChange={(e) => updateState({ makkahPreferredHotel: e.target.value })}
              className="w-full bg-[#1a1c22] border border-white/5 rounded-xl text-white text-sm px-4 py-3 outline-none focus:border-[#c5a059]/50 transition-colors placeholder:text-gray-500"
            />
            <p className="text-[11px] text-gray-500 mt-1 font-light">
              Specify your preferred hotel name if you have a specific property in mind.
            </p>
          </div>

          {/* Check-in and Check-out Date & Time (Previous dates disabled) */}
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2.5">
              Check-in & Check-out Schedule
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Check-in */}
              <div className="bg-[#1a1c22] border border-white/5 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center gap-1.5 text-[#c5a059]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Check-in</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Date</label>
                    <DateInputField
                      min={todayStr}
                      value={state.makkahCheckInDate || ''}
                      placeholder="DD.MM.YYYY"
                      onChange={(isoVal) => handleMakkahDatesUpdate(isoVal, undefined)}
                    />
                  </div>
                  <div
                    onClick={(e) => { const el = e.currentTarget.querySelector('input'); try { (el as any)?.showPicker?.(); } catch { } }}
                    className="cursor-pointer"
                  >
                    <label className="text-[10px] text-gray-400 block mb-1 cursor-pointer">Time</label>
                    <input
                      type="time"
                      value={state.makkahCheckInTime || '14:00'}
                      onClick={(e) => { try { (e.currentTarget as any).showPicker?.(); } catch { } }}
                      onFocus={(e) => { try { (e.currentTarget as any).showPicker?.(); } catch { } }}
                      onChange={(e) => updateState({ makkahCheckInTime: e.target.value })}
                      className="w-full bg-[#0c0d10] border border-white/10 rounded-lg text-white text-xs px-2.5 py-2 outline-none focus:border-[#c5a059]/50 cursor-pointer [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert-[85%] [&::-webkit-calendar-picker-indicator]:sepia-[100%] [&::-webkit-calendar-picker-indicator]:saturate-[1000%] [&::-webkit-calendar-picker-indicator]:hue-rotate-[5deg]"
                    />
                  </div>
                </div>
              </div>

              {/* Check-out */}
              <div className="bg-[#1a1c22] border border-white/5 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center gap-1.5 text-[#c5a059]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Check-out</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Date</label>
                    <DateInputField
                      min={state.makkahCheckInDate || todayStr}
                      value={state.makkahCheckOutDate || ''}
                      placeholder="DD.MM.YYYY"
                      onChange={(isoVal) => handleMakkahDatesUpdate(undefined, isoVal)}
                    />
                  </div>
                  <div
                    onClick={(e) => { const el = e.currentTarget.querySelector('input'); try { (el as any)?.showPicker?.(); } catch { } }}
                    className="cursor-pointer"
                  >
                    <label className="text-[10px] text-gray-400 block mb-1 cursor-pointer">Time</label>
                    <input
                      type="time"
                      value={state.makkahCheckOutTime || '12:00'}
                      onClick={(e) => { try { (e.currentTarget as any).showPicker?.(); } catch { } }}
                      onFocus={(e) => { try { (e.currentTarget as any).showPicker?.(); } catch { } }}
                      onChange={(e) => updateState({ makkahCheckOutTime: e.target.value })}
                      className="w-full bg-[#0c0d10] border border-white/10 rounded-lg text-white text-xs px-2.5 py-2 outline-none focus:border-[#c5a059]/50 cursor-pointer [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert-[85%] [&::-webkit-calendar-picker-indicator]:sepia-[100%] [&::-webkit-calendar-picker-indicator]:saturate-[1000%] [&::-webkit-calendar-picker-indicator]:hue-rotate-[5deg]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rooms Selection */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#1a1c22] border border-white/5">
            <div>
              <span className="text-white font-medium text-sm block">Rooms Required</span>
              <span className="text-[11px] text-gray-400 font-light">Number of rooms to reserve in Makkah</span>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => updateState({ makkahRooms: Math.max(1, state.makkahRooms - 1) })}
                className="w-9 h-9 rounded-lg bg-[#0c0d10] border border-white/10 text-white flex justify-center items-center hover:bg-white/5 text-base transition-colors cursor-pointer"
              >
                -
              </button>
              <span className="text-lg font-bold text-white w-7 text-center font-serif text-[#c5a059]">{state.makkahRooms}</span>
              <button
                type="button"
                onClick={() => updateState({ makkahRooms: state.makkahRooms + 1 })}
                className="w-9 h-9 rounded-lg bg-[#0c0d10] border border-white/10 text-white flex justify-center items-center hover:bg-white/5 text-base transition-colors cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* 3. MADINAH STAY (Optional) */}
        <div className="bg-[#0c0d10] border border-white/5 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#c5a059]" />
              <h4 className="text-sm font-bold tracking-wider text-white uppercase whitespace-nowrap">
                Madinah Stay
              </h4>
            </div>

            {/* Toggle switch for Madinah */}
            <button
              type="button"
              onClick={() => updateState({ includeMadinah: !state.includeMadinah })}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${state.includeMadinah
                  ? 'bg-[#c5a059] text-black shadow-[0_0_15px_rgba(197,160,89,0.3)]'
                  : 'bg-[#1a1c22] text-gray-400 border border-white/10 hover:border-white/30'
                }`}
            >
              {state.includeMadinah ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Madinah Added
                </>
              ) : (
                '+ Add Madinah'
              )}
            </button>
          </div>

          {state.includeMadinah ? (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 pt-4 border-t border-white/5 space-y-5">
              {/* Hotel Type */}
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2.5">
                  Hotel Category
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                  {HOTEL_CATEGORIES.map(c => {
                    const isSelected = state.madinahHotelCategory === c.id;
                    return (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => updateState({ madinahHotelCategory: c.id })}
                        className={`py-3 px-2 rounded-xl border text-center transition-all flex items-center justify-center cursor-pointer ${isSelected
                            ? 'border-[#c5a059] bg-[#c5a059]/15 text-[#c5a059] font-bold shadow-[0_0_15px_rgba(197,160,89,0.15)]'
                            : 'border-white/5 bg-[#1a1c22] text-gray-300 hover:border-white/20'
                          }`}
                      >
                        <span className="text-xs sm:text-sm font-medium whitespace-nowrap">{c.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preferred Hotel Text Field for Madinah */}
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                  Preferred Hotel in Madinah (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dar Al Taqwa, The Oberoi Madinah, Anwar Al Madinah Mövenpick..."
                  value={state.madinahPreferredHotel || ''}
                  onChange={(e) => updateState({ madinahPreferredHotel: e.target.value })}
                  className="w-full bg-[#1a1c22] border border-white/5 rounded-xl text-white text-sm px-4 py-3 outline-none focus:border-[#c5a059]/50 transition-colors placeholder:text-gray-500"
                />
                <p className="text-[11px] text-gray-500 mt-1 font-light">
                  Specify your preferred hotel name in Madinah if you have a specific property in mind.
                </p>
              </div>

              {/* Check-in and Check-out Date & Time for Madinah (Previous dates disabled) */}
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2.5">
                  Check-in & Check-out Schedule (Madinah)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Check-in */}
                  <div className="bg-[#1a1c22] border border-white/5 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center gap-1.5 text-[#c5a059]">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="text-[10px] uppercase font-bold tracking-wider">Check-in</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-gray-400 block mb-1">Date</label>
                        <DateInputField
                          min={state.makkahCheckOutDate || todayStr}
                          value={state.madinahCheckInDate || ''}
                          placeholder="DD.MM.YYYY"
                          onChange={(isoVal) => handleMadinahDatesUpdate(isoVal, undefined)}
                        />
                      </div>
                      <div
                        onClick={(e) => { const el = e.currentTarget.querySelector('input'); try { (el as any)?.showPicker?.(); } catch { } }}
                        className="cursor-pointer"
                      >
                        <label className="text-[10px] text-gray-400 block mb-1 cursor-pointer">Time</label>
                        <input
                          type="time"
                          value={state.madinahCheckInTime || '14:00'}
                          onClick={(e) => { try { (e.currentTarget as any).showPicker?.(); } catch { } }}
                          onFocus={(e) => { try { (e.currentTarget as any).showPicker?.(); } catch { } }}
                          onChange={(e) => updateState({ madinahCheckInTime: e.target.value })}
                          className="w-full bg-[#0c0d10] border border-white/10 rounded-lg text-white text-xs px-2.5 py-2 outline-none focus:border-[#c5a059]/50 cursor-pointer [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert-[85%] [&::-webkit-calendar-picker-indicator]:sepia-[100%] [&::-webkit-calendar-picker-indicator]:saturate-[1000%] [&::-webkit-calendar-picker-indicator]:hue-rotate-[5deg]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Check-out */}
                  <div className="bg-[#1a1c22] border border-white/5 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center gap-1.5 text-[#c5a059]">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="text-[10px] uppercase font-bold tracking-wider">Check-out</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-gray-400 block mb-1">Date</label>
                        <DateInputField
                          min={state.madinahCheckInDate || state.makkahCheckOutDate || todayStr}
                          value={state.madinahCheckOutDate || ''}
                          placeholder="DD.MM.YYYY"
                          onChange={(isoVal) => handleMadinahDatesUpdate(undefined, isoVal)}
                        />
                      </div>
                      <div
                        onClick={(e) => { const el = e.currentTarget.querySelector('input'); try { (el as any)?.showPicker?.(); } catch { } }}
                        className="cursor-pointer"
                      >
                        <label className="text-[10px] text-gray-400 block mb-1 cursor-pointer">Time</label>
                        <input
                          type="time"
                          value={state.madinahCheckOutTime || '12:00'}
                          onClick={(e) => { try { (e.currentTarget as any).showPicker?.(); } catch { } }}
                          onFocus={(e) => { try { (e.currentTarget as any).showPicker?.(); } catch { } }}
                          onChange={(e) => updateState({ madinahCheckOutTime: e.target.value })}
                          className="w-full bg-[#0c0d10] border border-white/10 rounded-lg text-white text-xs px-2.5 py-2 outline-none focus:border-[#c5a059]/50 cursor-pointer [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert-[85%] [&::-webkit-calendar-picker-indicator]:sepia-[100%] [&::-webkit-calendar-picker-indicator]:saturate-[1000%] [&::-webkit-calendar-picker-indicator]:hue-rotate-[5deg]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rooms Selection */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#1a1c22] border border-white/5">
                <div>
                  <span className="text-white font-medium text-sm block">Rooms in Madinah</span>
                  <span className="text-[11px] text-gray-400 font-light">Number of rooms to reserve in Madinah</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => updateState({ madinahRooms: Math.max(1, state.madinahRooms - 1) })}
                    className="w-9 h-9 rounded-lg bg-[#0c0d10] border border-white/10 text-white flex justify-center items-center hover:bg-white/5 text-base transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="text-lg font-bold text-white w-7 text-center font-serif text-[#c5a059]">{state.madinahRooms}</span>
                  <button
                    type="button"
                    onClick={() => updateState({ madinahRooms: state.madinahRooms + 1 })}
                    className="w-9 h-9 rounded-lg bg-[#0c0d10] border border-white/10 text-white flex justify-center items-center hover:bg-white/5 text-base transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <p className="text-xs text-gray-400 font-light mt-1">
              Add Madinah hotel preferences if your journey includes visiting the Prophet&apos;s City.
            </p>
          )}
        </div>
      </motion.div>
    );
  }

  // =============================================================
  // REGULAR UMRAH - TRANSPORT SEGMENT: STEP 2 (MODE & ROUTE),
  // STEP 3 (FLEET), STEP 4 (TRANSFER LEG DATES & PICK-UP TIMINGS)
  // Only rendered if transport add-on was explicitly selected in regular Umrah
  // =============================================================
  const isTransportationStep = (!isZiyarat && !isUmrahPlus && hasTransport && step >= 2 && step <= 4);

  if (isTransportationStep) {
    const transportStepLabel = step === 2
      ? 'Transportation'
      : step === 3
        ? 'Choose Private Vehicle & Fleet Setup'
        : 'Transfer Leg Dates & Pick-Up Timings';

    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <span className="text-xs text-[#c5a059] font-bold tracking-wider uppercase bg-[#c5a059]/10 px-3.5 py-1.5 rounded-full border border-[#c5a059]/25 shadow-sm">
            Step {step} of {totalSteps} • {transportStepLabel}
          </span>
        </div>

        {/* Skip Transportation Option Banner (Step 2 only) */}
        {step === 2 && (
        <div className={`border rounded-2xl p-4 sm:p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${state.skipTransport
            ? 'bg-[#c5a059]/10 border-[#c5a059]/50 shadow-[0_0_20px_rgba(197,160,89,0.1)]'
            : 'bg-[#0c0d10] border-white/5 hover:border-white/20'
          }`}>
          <div className="flex items-center gap-3.5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${state.skipTransport
                ? 'bg-[#c5a059] text-black border-[#c5a059]'
                : 'bg-[#1a1c22] text-[#c5a059] border-white/10'
              }`}>
              <Car className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-white font-bold text-sm">
                  Private Chauffeur & Transfers (Optional)
                </h4>
                {state.skipTransport && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#c5a059] text-black px-2 py-0.5 rounded-md">
                    Skipped
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 font-light mt-0.5">
                {state.skipTransport
                  ? 'Transportation is skipped. You can pick a vehicle below to re-add, or continue to next step.'
                  : 'Arranging your own transport or high-speed train? You can skip this step with one click.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onSkipTransport}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center justify-center gap-2 cursor-pointer shadow-md ${state.skipTransport
                ? 'border-[#c5a059] bg-[#c5a059] text-black hover:bg-[#d4b57a]'
                : 'border-[#c5a059]/40 bg-[#c5a059]/10 hover:bg-[#c5a059] text-[#c5a059] hover:text-black'
              }`}
          >
            {state.skipTransport ? 'Transport Skipped ✓' : 'Skip Transportation ➔'}
          </button>
        </div>
        )}

        {/* ========================================================= */}
        {/* UNIFIED TRANSPORTATION ENGINE FOR UMRAH & UMRAH PLUS FLOW */}
        {/* ========================================================= */}
        {!state.skipTransport && (
          <div className="space-y-8">
            {/* 1. CHOOSE TRANSPORT BOOKING MODE (Step 2 only) */}
            {step === 2 && (
            <div className="bg-[#0c0d10] border border-white/5 rounded-2xl p-5 sm:p-6">
              <label className="block text-xs uppercase tracking-widest text-[#c5a059] font-bold mb-3">
                Choose Transport Booking Mode *
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Mode 1: Fixed Route Circuit */}
                <div
                  onClick={() => updateState({ transportMode: 'fixed' })}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 ${state.transportMode === 'fixed'
                      ? 'bg-[#c5a059]/10 border-[#c5a059] shadow-[0_0_20px_rgba(197,160,89,0.15)]'
                      : 'bg-[#1a1c22] border-white/5 hover:border-white/20'
                    }`}
                >
                  <div className={`p-2.5 rounded-lg shrink-0 ${state.transportMode === 'fixed' ? 'bg-[#c5a059] text-black' : 'bg-white/5 text-[#c5a059]'}`}>
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-white font-bold text-sm">Full Pilgrimage Route</h4>
                      <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${state.transportMode === 'fixed' ? 'bg-[#c5a059] text-black' : 'bg-white/10 text-gray-400'
                        }`}>
                        All Transfers
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      Complete pre-scheduled package: Airport arrival, Intercity transfers (Makkah & Madinah), and Departure.
                    </p>
                  </div>
                </div>

                {/* Mode 2: Point-to-Point Transfer */}
                <div
                  onClick={() => updateState({ transportMode: 'pointToPoint' })}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 ${state.transportMode === 'pointToPoint'
                      ? 'bg-[#c5a059]/10 border-[#c5a059] shadow-[0_0_20px_rgba(197,160,89,0.15)]'
                      : 'bg-[#1a1c22] border-white/5 hover:border-white/20'
                    }`}
                >
                  <div className={`p-2.5 rounded-lg shrink-0 ${state.transportMode === 'pointToPoint' ? 'bg-[#c5a059] text-black' : 'bg-white/5 text-[#c5a059]'}`}>
                    <Navigation className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-white font-bold text-sm">Point-to-Point Transfer</h4>
                      <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${state.transportMode === 'pointToPoint' ? 'bg-[#c5a059] text-black' : 'bg-white/10 text-gray-400'
                        }`}>
                        Single Route
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      Direct single transfer with exact Google Maps autocomplete for hotel or airport pickup & drop-off.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            )}

            {/* 2. ROUTE PACKAGE / ROUTE COMBINATION (Step 2) & LEG SCHEDULE (Step 4) */}
            {(step === 2 || step === 4) && (state.transportMode === 'fixed' ? (
              /* A: FIXED ROUTE CIRCUIT PACKAGES */
              <div className="bg-[#0c0d10] border border-white/5 rounded-2xl p-5 sm:p-6 space-y-6">
                {step === 2 && (
                <>
                <div>
                  <label className="text-xs uppercase tracking-widest text-[#c5a059] font-bold block mb-1">
                    Select Pilgrimage Route Package *
                  </label>
                  <p className="text-xs text-gray-400">
                    Choose the route package that matches your arrival and departure airports in Saudi Arabia.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {FIXED_CIRCUITS.map(circuit => {
                    const isSelected = state.fixedRouteId === circuit.id;
                    return (
                      <div
                        key={circuit.id}
                        onClick={() => handleSelectFixedCircuit(circuit.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${isSelected
                            ? 'bg-[#c5a059]/10 border-[#c5a059] shadow-[0_0_20px_rgba(197,160,89,0.15)]'
                            : 'bg-[#1a1c22] border-white/5 hover:border-white/20'
                          }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="text-[10px] uppercase font-bold text-black bg-[#c5a059] px-2 py-0.5 rounded tracking-wider">
                              {circuit.badge}
                            </span>
                            {isSelected && <Check className="w-4 h-4 text-[#c5a059]" />}
                          </div>
                          <h4 className="text-sm font-bold text-white mb-1">{circuit.title}</h4>
                          <p className="text-[11px] text-gray-400 leading-relaxed font-mono">{circuit.fullRoute}</p>
                        </div>
                        <div className="mt-3 pt-2 border-t border-white/10 text-[10px] text-gray-400 flex items-center justify-between">
                          <span>{circuit.stops.length} Transfer Legs</span>
                          <span className="text-[#c5a059] font-medium">{isSelected ? 'Active Selection' : 'Click to select'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                </>
                )}

                {/* Circuit Stops Timings (Step 4 only) */}
                {step === 4 && (
                <div className="space-y-4">
                  <h4 className="text-xs uppercase tracking-widest text-white font-bold flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#c5a059]" />
                    Transfer Leg Dates & Pick-Up Timings
                  </h4>

                  <div className="space-y-3">
                    {state.fixedRouteLegs.map((leg, idx) => (
                      <div key={leg.id || idx} className="p-4 rounded-xl bg-[#14161d] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex-1">
                          <span className="text-[10px] uppercase font-bold text-[#c5a059] tracking-wider block mb-0.5">
                            Leg {idx + 1}
                          </span>
                          <h5 className="text-white text-xs font-semibold">{leg.label || `${leg.from} ➔ ${leg.to}`}</h5>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <div className="flex-1 sm:w-36">
                            <DateInputField
                              min={todayStr}
                              value={leg.date || ''}
                              placeholder="DD.MM.YYYY"
                              onChange={(isoVal) => handleLegDateChange(idx, isoVal)}
                            />
                          </div>
                          <div
                            onClick={(e) => { const el = e.currentTarget.querySelector('input'); try { (el as any)?.showPicker?.(); } catch { } }}
                            className="w-28 cursor-pointer"
                          >
                            <input
                              type="time"
                              value={leg.time || '14:00'}
                              onClick={(e) => { try { (e.currentTarget as any).showPicker?.(); } catch { } }}
                              onFocus={(e) => { try { (e.currentTarget as any).showPicker?.(); } catch { } }}
                              onChange={(e) => handleLegTimeChange(idx, e.target.value)}
                              className="w-full bg-[#0c0d10] border border-white/15 rounded-lg px-2 py-2 text-white text-xs outline-none focus:border-[#c5a059] cursor-pointer [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert-[85%] [&::-webkit-calendar-picker-indicator]:sepia-[100%] [&::-webkit-calendar-picker-indicator]:saturate-[1000%] [&::-webkit-calendar-picker-indicator]:hue-rotate-[5deg]"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                )}
              </div>
            ) : (
              /* B: POINT-TO-POINT ROUTE & GOOGLE PLACES */
              <div className="bg-[#0c0d10] border border-white/5 rounded-2xl p-5 sm:p-6 space-y-6">
                {step === 2 && (
                <div>
                  <label className="text-xs uppercase tracking-widest text-[#c5a059] font-bold block mb-2">
                    Standard Transfer Route Combination *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {activeP2PRoutes.map((rt) => {
                      const isSelected = (state.pointToPointRoute || 'Jeddah ↔ Makkah') === rt;
                      return (
                        <button
                          key={rt}
                          type="button"
                          onClick={() => updateState({ pointToPointRoute: rt })}
                          className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${isSelected
                              ? 'bg-[#c5a059]/15 border-[#c5a059] text-white shadow-md'
                              : 'bg-[#1a1c22] border-white/5 text-gray-300 hover:border-white/20'
                            }`}
                        >
                          <span className="truncate">{rt}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#c5a059] shrink-0 ml-1.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
                )}

                {/* Google Places Autocomplete: Pickup & Drop-off (Step 4 only) */}
                {step === 4 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#c5a059]" />
                      <h4 className="text-xs uppercase tracking-widest text-white font-bold">
                        Pickup & Drop-off Coordinates (Google Autocomplete)
                      </h4>
                    </div>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                      Saudi Arabia Places
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <GooglePlacesInput
                      id="umrah-pickup-location-input"
                      label="Exact Pickup Location"
                      placeholder="e.g. King Abdulaziz Airport Terminal 1 / Hotel Name"
                      required
                      value={state.pointToPointPickupLocation || ''}
                      onChange={(val) => updateState({ pointToPointPickupLocation: val })}
                    />

                    <GooglePlacesInput
                      id="umrah-dropoff-location-input"
                      label="Exact Drop-off Location"
                      placeholder="e.g. Fairmont Makkah Clock Tower / Madinah Hotel"
                      required
                      value={state.pointToPointDropoffLocation || ''}
                      onChange={(val) => updateState({ pointToPointDropoffLocation: val })}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-[#c5a059] font-bold mb-1.5 block">
                        Pickup Date *
                      </label>
                      <DateInputField
                        min={todayStr}
                        value={state.pointToPointPickupDate || ''}
                        placeholder="DD.MM.YYYY"
                        onChange={(isoVal) => updateState({ pointToPointPickupDate: isoVal })}
                      />
                    </div>
                    <div
                      onClick={(e) => { const el = e.currentTarget.querySelector('input'); try { (el as any)?.showPicker?.(); } catch { } }}
                      className="cursor-pointer"
                    >
                      <label className="text-[11px] uppercase tracking-wider text-[#c5a059] font-bold mb-1.5 block cursor-pointer">
                        Pickup Time *
                      </label>
                      <input
                        type="time"
                        value={state.pointToPointPickupTime || '14:00'}
                        onClick={(e) => { try { (e.currentTarget as any).showPicker?.(); } catch { } }}
                        onFocus={(e) => { try { (e.currentTarget as any).showPicker?.(); } catch { } }}
                        onChange={(e) => updateState({ pointToPointPickupTime: e.target.value })}
                        className="w-full bg-[#12141a] border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs outline-none focus:border-[#c5a059] cursor-pointer [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert-[85%] [&::-webkit-calendar-picker-indicator]:sepia-[100%] [&::-webkit-calendar-picker-indicator]:saturate-[1000%] [&::-webkit-calendar-picker-indicator]:hue-rotate-[5deg]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold mb-1.5 block">
                        Flight No. / Terminal (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. SV-124 / North Terminal"
                        value={state.pointToPointFlightNo || ''}
                        onChange={(e) => updateState({ pointToPointFlightNo: e.target.value })}
                        className="w-full bg-[#12141a] border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder:text-gray-500 text-xs outline-none focus:border-[#c5a059]"
                      />
                    </div>
                  </div>
                </div>
                )}
              </div>
            )
            )}

            {/* 3. CHOOSE PRIVATE VEHICLE & FLEET SETUP (Step 3 only) */}
            {step === 3 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-sm uppercase tracking-widest font-bold text-[#c5a059]">
                    Choose Private Vehicle & Fleet Setup
                  </h4>
                  <p className="text-xs text-gray-400 font-light mt-0.5">
                    Vehicle fleet is automatically allocated based on your total party of {state.adultsCount + (state.childrenCount || 0)} guests.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {activeVehicles.map(v => {
                  const totalGuests = (state.adultsCount || 1) + (state.childrenCount || 0);
                  const isSelected = (state.transportVehicleId === v.id) || (state.selectedVehicle === v.id);
                  const isP2P = state.transportMode === 'pointToPoint';

                  const baseRate = isP2P
                    ? ((v as any).pointToPoint?.[state.pointToPointRoute] || (v as any).pointToPoint?.['Jeddah ↔ Makkah'] || 250)
                    : ((v as any).fixedRoutes?.[state.fixedRouteId] || (v as any).fixedRoutes?.['p1'] || 800);

                  const requiredCars = Math.max(1, Math.ceil(totalGuests / v.capacity));
                  const cardTotalFare = baseRate * requiredCars;
                  const needsMultiple = totalGuests > v.capacity;

                  return (
                    <div
                      key={v.id}
                      onClick={() => updateState({
                        transportVehicleId: v.id,
                        selectedVehicle: v.id,
                        vehicleQuantity: requiredCars,
                        calculatedTransportPrice: cardTotalFare
                      })}
                      className={`group relative rounded-2xl p-5 border transition-all cursor-pointer flex flex-col justify-between ${isSelected
                          ? 'bg-[#15171e] border-[#c5a059] shadow-[0_0_25px_rgba(197,160,89,0.2)]'
                          : 'bg-[#0f1015] border-white/10 hover:border-white/20'
                        }`}
                    >
                      <div>
                        {/* Vehicle Image */}
                        <div className="relative w-full h-32 mb-4 rounded-xl overflow-hidden bg-black/40 flex items-center justify-center p-2">
                          <img
                            src={v.image}
                            alt={v.name}
                            className="object-contain max-h-full max-w-full drop-shadow-xl group-hover:scale-105 transition-transform duration-300"
                          />
                          <span className="absolute top-2 right-2 text-[10px] bg-black/80 font-bold text-amber-400 px-2 py-0.5 rounded border border-amber-400/30">
                            {v.capacity} GUESTS / CAR
                          </span>
                        </div>

                        {/* Vehicle Header */}
                        <div className="flex items-start justify-between mb-1.5">
                          <div>
                            <h4 className="text-base font-bold text-white group-hover:text-[#c5a059] transition-colors">
                              {v.name}
                            </h4>
                            <span className="text-[11px] text-gray-400 font-medium">
                              {v.category}
                            </span>
                          </div>
                          {isSelected && (
                            <div className="w-6 h-6 rounded-full bg-[#c5a059] text-black flex items-center justify-center shrink-0">
                              <Check className="w-4 h-4 font-bold" />
                            </div>
                          )}
                        </div>

                        {/* Clean 2-column specs without AC Chauffeur */}
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-300 my-3 bg-white/5 px-3 py-2.5 rounded-xl border border-white/5">
                          <div className="flex items-center justify-center gap-1.5 font-medium">
                            <Users className="w-4 h-4 text-[#c5a059] shrink-0" />
                            <span className="truncate">{v.capacity} Pax / Car</span>
                          </div>
                          <div className="flex items-center justify-center gap-1.5 font-medium border-l border-white/10">
                            <Briefcase className="w-4 h-4 text-[#c5a059] shrink-0" />
                            <span className="truncate">{v.luggage} Bags</span>
                          </div>
                        </div>
                      </div>

                      {/* Pricing & Fleet Multiplier Box */}
                      <div className="pt-3 border-t border-white/10 mt-2">
                        <div className="flex items-baseline justify-between mb-1">
                          <span className="text-[11px] text-gray-400 uppercase font-semibold">
                            {requiredCars > 1 ? `${requiredCars}x Cars Total Fare:` : 'Total Fare:'}
                          </span>
                          <span className="text-lg font-bold text-[#c5a059] font-mono">
                            AED {cardTotalFare}
                          </span>
                        </div>

                        {/* Capacity Multiplier Alert & Fleet allocation */}
                        {needsMultiple ? (
                          <div className="mt-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 text-xs text-amber-300 flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span>{totalGuests} guests exceed 1 car ({v.capacity} pax).</span>
                            </div>
                            <span className="bg-amber-400 text-black font-extrabold px-2 py-0.5 rounded text-[10px] uppercase shrink-0">
                              {requiredCars}x Required
                            </span>
                          </div>
                        ) : (
                          <div className="mt-2 text-[11px] text-gray-400 flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>1 car comfortably accommodates {totalGuests} guest{totalGuests > 1 ? 's' : ''}</span>
                          </div>
                        )}

                        {/* Selected allocation summary without '(Locked)' */}
                        {isSelected && (
                          <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                            <span className="text-gray-400 font-medium">Allocated Vehicles:</span>
                            <span className="font-bold text-[#c5a059] bg-[#c5a059]/10 border border-[#c5a059]/30 px-2.5 py-1 rounded-lg">
                              {requiredCars}x {v.name}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            )}
          </div>
        )}
      </motion.div>
    );
  }



  // =============================================================
  // STEP 4 (TRANSPORT & UMRAH PLUS): ROUTE SCHEDULE & PICKUP LOCATIONS
  // =============================================================
  const isTransportScheduleStep = (isTransport && step === 4) || (isUmrahPlus && step === 7);
  if (isTransportScheduleStep) {
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <span className="text-xs text-[#c5a059] font-bold tracking-wider uppercase bg-[#c5a059]/10 px-3.5 py-1.5 rounded-full border border-[#c5a059]/25 shadow-sm">
            Step {step} of {totalSteps} • Route Schedule & Pickup Locations
          </span>
        </div>

        {/* -------------------------------------------------------------
            TRANSPORT FLOW STEP 4: FIXED ROUTE SCHEDULE & LOCATIONS
        ------------------------------------------------------------- */}
        {state.transportMode === 'fixed' && (
          <div className="bg-[#12141a] border border-white/10 rounded-2xl p-5 md:p-6 mb-8 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-400 shrink-0" />
                <h4 className="text-sm uppercase tracking-widest text-white font-bold">
                  Travel Dates & Pickup Times for Each Route Stop
                </h4>
              </div>
              <span className="text-[11px] text-yellow-400 italic"></span>
            </div>

            <p className="text-xs text-gray-400 font-light mb-6">
              Our chauffeur dispatches according to each stop's schedule. Please specify your travel date, pickup time, hotel locations, and flight numbers for airport transfers.
            </p>

            <div className="space-y-5">
              {state.fixedRouteLegs.map((leg, index) => {
                const hasAirport = leg.from.toLowerCase().includes('airport') || leg.to.toLowerCase().includes('airport') || (leg.label && leg.label.toLowerCase().includes('airport'));

                return (
                  <div
                    key={leg.id || index}
                    className="p-4 sm:p-5 rounded-xl border border-white/10 bg-[#1a1c22] space-y-4"
                  >
                    {/* Leg Header with Badge & Route */}
                    <div className="flex items-center justify-between gap-3 border-b border-white/5 pb-3 flex-wrap">
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-[#c5a059]/20 text-[#c5a059] flex items-center justify-center font-bold text-xs shrink-0">
                          {index + 1}
                        </div>
                        <div className="text-xs sm:text-sm font-bold text-amber-300 flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-lg border border-amber-500/20">
                          <span className="text-yellow-300 font-extrabold">{leg.from}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-amber-400 font-bold shrink-0" />
                          <span className="text-yellow-300 font-extrabold">{leg.to}</span>
                        </div>
                      </div>
                      <span className="text-[11px] text-gray-400 font-light">
                        {leg.label}
                      </span>
                    </div>

                    {/* Row 1: Travel Date, Pickup Time, and Flight No (if airport) */}
                    <div className={`grid grid-cols-1 sm:grid-cols-2 ${hasAirport ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-3.5`}>
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-amber-300/90 block mb-1 font-semibold flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-yellow-400" />
                          Travel Date *
                        </label>
                        <DateInputField
                          min={todayStr}
                          required
                          value={leg.date || ''}
                          placeholder="DD.MM.YYYY"
                          onChange={(isoVal) => handleLegDateChange(index, isoVal)}
                        />
                      </div>

                      <div
                        onClick={(e) => { const el = e.currentTarget.querySelector('input'); try { (el as any)?.showPicker?.(); } catch { } }}
                        className="cursor-pointer"
                      >
                        <label className="text-[10px] uppercase tracking-wider text-amber-300/90 block mb-1 font-semibold flex items-center gap-1.5 cursor-pointer">
                          <Clock className="w-3.5 h-3.5 text-yellow-400" />
                          Pickup Time *
                        </label>
                        <input
                          type="time"
                          value={leg.time || '12:00'}
                          onClick={(e) => { try { (e.currentTarget as any).showPicker?.(); } catch { } }}
                          onFocus={(e) => { try { (e.currentTarget as any).showPicker?.(); } catch { } }}
                          onChange={(e) => handleLegTimeChange(index, e.target.value)}
                          className="w-full bg-[#12141a] border border-white/15 rounded-xl px-3 py-2.5 text-white text-xs outline-none focus:border-[#c5a059] cursor-pointer [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert-[85%] [&::-webkit-calendar-picker-indicator]:sepia-[100%] [&::-webkit-calendar-picker-indicator]:saturate-[1000%] [&::-webkit-calendar-picker-indicator]:hue-rotate-[5deg]"
                        />
                      </div>

                      {hasAirport && (
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-amber-300/90 block mb-1 font-semibold flex items-center gap-1.5">
                            <Plane className="w-3.5 h-3.5 text-yellow-400" />
                            Flight No. / Terminal (Airport) *
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. SV-124 / Terminal 1"
                            value={leg.flightNo || ''}
                            onChange={(e) => handleLegFlightChange(index, e.target.value)}
                            className="w-full bg-[#12141a] border border-white/15 rounded-xl px-3.5 py-2.5 text-white text-xs outline-none focus:border-[#c5a059]"
                          />
                        </div>
                      )}
                    </div>

                    {/* Row 2: Pickup Hotel / Location & Drop-off Hotel / Location */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                      <GooglePlacesInput
                        id={`leg-pickup-${index}`}
                        label="Pickup Hotel / Location"
                        placeholder={leg.from.toLowerCase().includes('airport') ? 'e.g. King Abdulaziz Airport Terminal 1' : 'e.g. Hotel in Makkah / Madinah'}
                        required
                        value={leg.pickupLocation || ''}
                        onChange={(val) => handleLegPickupChange(index, val)}
                      />

                      <GooglePlacesInput
                        id={`leg-dropoff-${index}`}
                        label="Drop-off Hotel / Location"
                        placeholder={leg.to.toLowerCase().includes('airport') ? 'e.g. Madinah Airport Terminal 2' : 'e.g. Swissôtel Makkah / Madinah Hotel'}
                        required
                        value={leg.dropoffLocation || ''}
                        onChange={(val) => handleLegDropoffChange(index, val)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            TRANSPORT FLOW STEP 4: POINT-TO-POINT COORDINATES
        ------------------------------------------------------------- */}
        {state.transportMode === 'pointToPoint' && (
          <div className="bg-[#12141a] border border-white/10 rounded-2xl p-5 md:p-6 mb-8 space-y-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#c5a059]" />
                <h4 className="text-sm uppercase tracking-widest text-white font-bold">
                  Pickup & Drop-off Coordinates
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#c5a059] font-bold bg-[#c5a059]/10 border border-[#c5a059]/30 px-2.5 py-0.5 rounded-full">
                  {state.pointToPointRoute || 'Point-to-Point'}
                </span>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                  Saudi Arabia Places
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-400 font-light">
              Please provide your exact pickup hotel or airport terminal, drop-off destination, schedule, and flight number if arriving/departing from an airport.
            </p>

            {/* Pickup & Drop-off Hotel / Locations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <GooglePlacesInput
                id="pickup-location-input"
                label="Pickup Hotel / Location"
                placeholder="e.g. King Abdulaziz Airport Terminal 1 / Hotel Name"
                required
                value={state.pointToPointPickupLocation || ''}
                onChange={(val) => updateState({ pointToPointPickupLocation: val })}
              />

              <GooglePlacesInput
                id="dropoff-location-input"
                label="Drop-off Hotel / Location"
                placeholder="e.g. Fairmont Makkah Clock Tower / Madinah Hotel"
                required
                value={state.pointToPointDropoffLocation || ''}
                onChange={(val) => updateState({ pointToPointDropoffLocation: val })}
              />
            </div>

            {/* Date, Time, and Flight No. (if airport) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="text-xs uppercase tracking-widest text-[#c5a059] font-bold mb-2 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-yellow-400" />
                  Pickup Date *
                </label>
                <DateInputField
                  min={todayStr}
                  required
                  value={state.pointToPointPickupDate || ''}
                  placeholder="DD.MM.YYYY"
                  className="py-3 px-4 text-sm"
                  onChange={(isoVal) => updateState({ pointToPointPickupDate: isoVal })}
                />
              </div>

              <div
                onClick={(e) => { const el = e.currentTarget.querySelector('input'); try { (el as any)?.showPicker?.(); } catch { } }}
                className="cursor-pointer"
              >
                <label className="text-xs uppercase tracking-widest text-[#c5a059] font-bold mb-2 flex items-center gap-1.5 cursor-pointer">
                  <Clock className="w-4 h-4 text-yellow-400" />
                  Pickup Time *
                </label>
                <input
                  type="time"
                  required
                  value={state.pointToPointPickupTime || '14:00'}
                  onClick={(e) => { try { (e.currentTarget as any).showPicker?.(); } catch { } }}
                  onFocus={(e) => { try { (e.currentTarget as any).showPicker?.(); } catch { } }}
                  onChange={(e) => updateState({ pointToPointPickupTime: e.target.value })}
                  className="w-full bg-[#12141a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#c5a059] cursor-pointer [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert-[85%] [&::-webkit-calendar-picker-indicator]:sepia-[100%] [&::-webkit-calendar-picker-indicator]:saturate-[1000%] [&::-webkit-calendar-picker-indicator]:hue-rotate-[5deg]"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-[#c5a059] font-bold mb-2 flex items-center gap-1.5">
                  <Plane className="w-4 h-4 text-yellow-400" />
                  {(state.pointToPointRoute || '').toLowerCase().includes('airport') || (state.pointToPointPickupLocation || '').toLowerCase().includes('airport') || (state.pointToPointDropoffLocation || '').toLowerCase().includes('airport')
                    ? 'Flight No. / Terminal (Required for Airport) *'
                    : 'Flight No. / Terminal (Optional)'}
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="e.g. SV-124 / North Terminal"
                    value={state.pointToPointFlightNo || ''}
                    onChange={(e) => updateState({ pointToPointFlightNo: e.target.value })}
                    className="w-full bg-[#12141a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#c5a059]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    );
  }



  // =============================================================
  // FINAL STEP (STEP 5 for Transport, STEP 4 for Ziyarat, etc.): LEAD PASSENGER DETAILS
  // =============================================================
  if (step === totalSteps) {
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <span className="text-xs text-[#c5a059] font-bold tracking-wider uppercase bg-[#c5a059]/10 px-3.5 py-1.5 rounded-full border border-[#c5a059]/25 shadow-sm">
            Step {step} of {totalSteps} • Lead Passenger Details
          </span>
        </div>

        {/* -------------------------------------------------------------
            LEAD PASSENGER DETAILS
        ------------------------------------------------------------- */}
        <div className="bg-[#12141a] border border-white/10 rounded-2xl p-5 md:p-6 space-y-6 shadow-xl">
          <div className="pb-3 border-b border-white/10">
            <h4 className="text-sm uppercase tracking-widest text-white font-bold flex items-center gap-2">
              <Users className="w-4 h-4 text-[#c5a059]" />
              Lead Passenger Information
            </h4>
          </div>
          <div>
            <label className="block text-sm font-bold tracking-widest text-[#c5a059] uppercase mb-2">
              Full Name *
            </label>
            <input
              required
              type="text"
              placeholder="e.g. Abdullah Khan"
              value={state.leadDetails.fullName}
              onChange={(e) => updateState({ leadDetails: { ...state.leadDetails, fullName: e.target.value } })}
              className="w-full bg-[#0c0d10] border border-white/5 rounded-xl text-white p-4 outline-none focus:border-[#c5a059]/50 transition-colors"
            />
          </div>

          {/* ── Nationality Searchable Dropdown ── */}
          <div ref={nationalityRef} className="relative">
            <label className="block text-sm font-bold tracking-widest text-[#c5a059] uppercase mb-2">
              Nationality *
            </label>
            <button
              type="button"
              onClick={() => {
                setIsNationalityOpen(!isNationalityOpen);
                setNationalitySearch('');
              }}
              className={`w-full flex items-center justify-between bg-[#0c0d10] border rounded-xl text-white p-4 outline-none transition-colors ${isNationalityOpen ? 'border-[#c5a059]/50' : 'border-white/5 hover:border-white/20'
                }`}
            >
              <span className={state.leadDetails.nationality ? 'text-white' : 'text-gray-500'}>
                {state.leadDetails.nationality
                  ? (() => {
                    const c = COUNTRIES.find(c => c.name === state.leadDetails.nationality);
                    return c ? `${c.flag}  ${c.name}` : state.leadDetails.nationality;
                  })()
                  : 'Select your nationality'
                }
              </span>
              <svg className={`w-4 h-4 text-gray-400 transition-transform shrink-0 ${isNationalityOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isNationalityOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1c22] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                {/* Search Input */}
                <div className="p-3 border-b border-white/5">
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      ref={nationalitySearchRef}
                      type="text"
                      placeholder="Search country..."
                      value={nationalitySearch}
                      onChange={(e) => setNationalitySearch(e.target.value)}
                      className="w-full bg-[#0c0d10] border border-white/10 rounded-lg text-white text-sm pl-9 pr-3 py-2.5 outline-none focus:border-[#c5a059]/50 transition-colors placeholder:text-gray-500"
                    />
                  </div>
                </div>

                {/* Country List */}
                <div className="max-h-56 overflow-y-auto overscroll-contain" style={{ scrollbarWidth: 'thin', scrollbarColor: '#c5a059 #0c0d10' }}>
                  {filteredNationalityCountries.length === 0 ? (
                    <div className="p-4 text-center text-xs text-gray-500">No countries found</div>
                  ) : (
                    filteredNationalityCountries.map(c => (
                      <div
                        key={c.code}
                        onClick={() => {
                          updateState({ leadDetails: { ...state.leadDetails, nationality: c.name } });
                          setIsNationalityOpen(false);
                          setNationalitySearch('');
                        }}
                        className={`px-4 py-3 flex items-center gap-3 cursor-pointer text-sm transition-colors ${state.leadDetails.nationality === c.name
                            ? 'bg-[#c5a059]/15 text-[#c5a059]'
                            : 'text-gray-200 hover:bg-white/5 hover:text-white'
                          }`}
                      >
                        <span className="text-lg shrink-0">{c.flag}</span>
                        <span className="font-medium">{c.name}</span>
                        {state.leadDetails.nationality === c.name && (
                          <Check className="w-4 h-4 text-[#c5a059] ml-auto shrink-0" />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── Phone Code Searchable Dropdown with Flags ── */}
          <div>
            <label className="block text-sm font-bold tracking-widest text-[#c5a059] uppercase mb-2">
              Contact Number (WhatsApp Enabled) *
            </label>
            <div className="flex gap-2">
              <div ref={phoneCodeRef} className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsPhoneCodeOpen(!isPhoneCodeOpen);
                    setPhoneCodeSearch('');
                  }}
                  className={`flex items-center gap-1.5 bg-[#0c0d10] border rounded-xl text-white px-3 py-4 outline-none transition-colors min-w-[120px] justify-center ${isPhoneCodeOpen ? 'border-[#c5a059]/50' : 'border-white/5 hover:border-white/20'
                    }`}
                >
                  <span className="text-lg">{selectedPhoneCountry?.flag}</span>
                  <span className="font-medium text-sm">{state.leadDetails.phoneCode}</span>
                  <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform shrink-0 ${isPhoneCodeOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isPhoneCodeOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-[#1a1c22] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 w-72">
                    {/* Search Input */}
                    <div className="p-3 border-b border-white/5">
                      <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                          ref={phoneCodeSearchRef}
                          type="text"
                          placeholder="Search country or code..."
                          value={phoneCodeSearch}
                          onChange={(e) => setPhoneCodeSearch(e.target.value)}
                          className="w-full bg-[#0c0d10] border border-white/10 rounded-lg text-white text-sm pl-9 pr-3 py-2.5 outline-none focus:border-[#c5a059]/50 transition-colors placeholder:text-gray-500"
                        />
                      </div>
                    </div>

                    {/* Country Code List */}
                    <div className="max-h-56 overflow-y-auto overscroll-contain" style={{ scrollbarWidth: 'thin', scrollbarColor: '#c5a059 #0c0d10' }}>
                      {filteredPhoneCodeCountries.length === 0 ? (
                        <div className="p-4 text-center text-xs text-gray-500">No countries found</div>
                      ) : (
                        filteredPhoneCodeCountries.map(c => (
                          <div
                            key={c.code}
                            onClick={() => {
                              updateState({ leadDetails: { ...state.leadDetails, phoneCode: c.dialCode } });
                              setIsPhoneCodeOpen(false);
                              setPhoneCodeSearch('');
                            }}
                            className={`px-4 py-3 flex items-center gap-3 cursor-pointer text-sm transition-colors ${state.leadDetails.phoneCode === c.dialCode
                                ? 'bg-[#c5a059]/15 text-[#c5a059]'
                                : 'text-gray-200 hover:bg-white/5 hover:text-white'
                              }`}
                          >
                            <span className="text-lg shrink-0">{c.flag}</span>
                            <span className="font-medium flex-1 truncate">{c.name}</span>
                            <span className="text-xs text-gray-400 font-mono shrink-0">{c.dialCode}</span>
                            {state.leadDetails.phoneCode === c.dialCode && (
                              <Check className="w-4 h-4 text-[#c5a059] shrink-0" />
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              <input
                required
                type="tel"
                placeholder="e.g. 50 123 4567"
                value={state.leadDetails.phone}
                onChange={(e) => updateState({ leadDetails: { ...state.leadDetails, phone: e.target.value } })}
                className="flex-1 bg-[#0c0d10] border border-white/5 rounded-xl text-white p-4 outline-none focus:border-[#c5a059]/50 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold tracking-widest text-[#c5a059] uppercase mb-2">
              Email Address *
            </label>
            <input
              required
              type="email"
              placeholder="e.g. name@example.com"
              value={state.leadDetails.email}
              onChange={(e) => updateState({ leadDetails: { ...state.leadDetails, email: e.target.value } })}
              className="w-full bg-[#0c0d10] border border-white/5 rounded-xl text-white p-4 outline-none focus:border-[#c5a059]/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-bold tracking-widest text-[#c5a059] uppercase mb-2">
              Special Requests or Notes (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Any preferred pickup timing, hotel name for pickup, wheelchair assistance, or special requests..."
              value={state.leadDetails.notes || ''}
              onChange={(e) => updateState({ leadDetails: { ...state.leadDetails, notes: e.target.value } })}
              className="w-full bg-[#0c0d10] border border-white/5 rounded-xl text-white p-4 outline-none focus:border-[#c5a059]/50 transition-colors resize-none text-sm font-light"
            />
          </div>
        </div>
      </motion.div>
    );
  }

  return null;
}
