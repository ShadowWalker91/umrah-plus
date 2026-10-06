'use client';

import { useState, useRef, useEffect, useMemo, useCallback, useId } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar as CalendarIcon,
  ChevronDown,
  Search,
  ChevronLeft,
  ChevronRight,
  Users,
  Briefcase,
  Baby,
  Minus,
  Plus,
  MapPin,
  // Check, // unused while city checkboxes are hidden
  Sparkles,
  Info,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DayPicker, DateRange } from 'react-day-picker';
import { format } from 'date-fns';

type ServiceType = 'Umrah' | 'Transport' | 'Umrah Plus' | 'Ziyarat';

export interface SearchWidgetProps {
  /**
   * Tab that should be active by default for this instance of the widget.
   * It is re-applied whenever the owning section scrolls into view,
   * unless the visitor has already picked a tab inside that section.
   */
  activeService?: ServiceType;
}

interface ServiceTab {
  id: ServiceType;
  label: string;
  tagline: string;
}

const SERVICE_TABS: ServiceTab[] = [
  { id: 'Umrah', label: 'Umrah', tagline: 'Sacred Makkah & Madinah pilgrimage' },
  { id: 'Transport', label: 'Transport', tagline: 'VIP Chauffeur & Private Fleet' },
  { id: 'Ziyarat', label: 'Ziyarat', tagline: 'Historical & spiritual tours across KSA' },
  { id: 'Umrah Plus', label: 'Umrah Plus', tagline: 'Umrah With Sacred Signature Ziyarat' },
];

const FLOW_DETAILS: Record<ServiceType, {
  badge: string;
  title: string;
  description: string;
  features: string[];
}> = {
  'Umrah': {
    badge: 'Hotels & Accommodation',
    title: 'Hotels & Accommodation',
    description: 'Provides Makkah & Madinah hotel booking, room customization (3★, 4★, 5★), stay duration, with optional private airport transfers.',
    features: ['Makkah & Madinah Hotels', 'Room & Nights Customization', 'Optional Transport Add-on']
  },
  'Transport': {
    badge: 'Chauffeur & Private Fleet',
    title: 'Private Chauffeur & Transfers',
    description: 'Provides private chauffeur service, airport pickups (Jeddah KAIA / Madinah), and intercity transfers across Makkah, Madinah & Jeddah.',
    features: ['Airport & Intercity Transfers', 'Sedan, SUV, Van & Minibus', 'Fixed & Custom Routes']
  },
  'Ziyarat': {
    badge: 'Sacred Tours & Historic Sites',
    title: 'Sacred Ziyarat Tours',
    description: 'Provides guided sacred excursions and historical Islamic site tours across Makkah, Madinah, and Taif with private dedicated chauffeur.',
    features: ['Makkah, Madinah & Taif Sites', 'Cave Hira, Uhud & Quba', 'Dedicated Private Vehicle']
  },
  'Umrah Plus': {
    badge: 'All-Inclusive Spiritual Package',
    title: 'Complete Journey Package',
    description: 'Provides an all-in-one comprehensive journey combining luxury Makkah & Madinah hotels, dedicated VIP private transport, and signature Ziyarat tours.',
    features: ['Hotels & Accommodation', 'VIP Private Transportation', 'Curated Sacred Ziyarat']
  }
};

export default function SearchWidget({ activeService }: SearchWidgetProps = {}) {
  const router = useRouter();

  // Unique layoutId per instance — several widgets are mounted on the homepage
  // and a shared layoutId makes the gold pill jump between them.
  const pillLayoutId = `activeTabPill${useId()}`;

  // Active Service Tab (Sequence: Umrah -> Transport -> Ziyarat -> Umrah Plus)
  const [activeTab, setActiveTab] = useState<ServiceType>(activeService ?? 'Umrah');
  const [hoveredTab, setHoveredTab] = useState<ServiceType | null>(null);

  // Dates state
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [singleDate, setSingleDate] = useState<Date | undefined>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [numberOfMonths, setNumberOfMonths] = useState(2);

  // Transport Specific State
  const [peopleCount, setPeopleCount] = useState<number>(2);
  const [childrenCount, setChildrenCount] = useState<number>(0);
  const [luggageCount, setLuggageCount] = useState<number>(2);
  const [isTransportGuestsOpen, setIsTransportGuestsOpen] = useState(false);

  // Ziyarat Specific State
  // City selection is disabled for now — cities are display-only info.
  // const [ziyaratCities, setZiyaratCities] = useState<string[]>(['Makkah', 'Madinah', 'Taif']);
  const ziyaratCities = ['Makkah', 'Madinah', 'Taif'];
  const [isZiyaratCitiesOpen, setIsZiyaratCitiesOpen] = useState(false);
  const [ziyaratPersons, setZiyaratPersons] = useState<number>(2);
  const [isZiyaratGuestsOpen, setIsZiyaratGuestsOpen] = useState(false);

  // References for outside click dismissal
  const calendarRef = useRef<HTMLDivElement>(null);
  const transportGuestsRef = useRef<HTMLDivElement>(null);
  const ziyaratGuestsRef = useRef<HTMLDivElement>(null);
  const ziyaratCitiesRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const hoverCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const visitorPickedTab = useRef(false);

  // Hover open/close with a small debounce so travelling between a tab and the
  // callout above it never produces a flicker, and so nothing shifts in flow.
  const openCallout = useCallback((tab: ServiceType) => {
    if (hoverCloseTimer.current) {
      clearTimeout(hoverCloseTimer.current);
      hoverCloseTimer.current = null;
    }
    setHoveredTab(tab);
  }, []);

  const scheduleCloseCallout = useCallback(() => {
    if (hoverCloseTimer.current) clearTimeout(hoverCloseTimer.current);
    hoverCloseTimer.current = setTimeout(() => {
      setHoveredTab(null);
      hoverCloseTimer.current = null;
    }, 140);
  }, []);

  useEffect(
    () => () => {
      if (hoverCloseTimer.current) clearTimeout(hoverCloseTimer.current);
    },
    []
  );

  // City selection disabled for now — re-enable with the state above when needed.
  // const toggleZiyaratCity = (city: string) => {
  //   setZiyaratCities((prev) =>
  //     prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
  //   );
  // };

  // Today reference at midnight to strictly disable past dates
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  // Responsive calendar months
  useEffect(() => {
    const handleResize = () => {
      setNumberOfMonths(window.innerWidth < 640 ? 1 : 2);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle outside clicks to close popovers
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
      if (transportGuestsRef.current && !transportGuestsRef.current.contains(event.target as Node)) {
        setIsTransportGuestsOpen(false);
      }
      if (ziyaratGuestsRef.current && !ziyaratGuestsRef.current.contains(event.target as Node)) {
        setIsZiyaratGuestsOpen(false);
      }
      if (ziyaratCitiesRef.current && !ziyaratCitiesRef.current.contains(event.target as Node)) {
        setIsZiyaratCitiesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keep the active tab in step with the section the visitor is scrolling to.
  // The observer watches the closest <section> ancestor through a thin band across
  // the middle of the viewport, which matches the snap-scroll position.
  // A tab chosen by the visitor inside the current section is never overridden;
  // leaving and re-entering the section restores its own default tab.
  useEffect(() => {
    if (!activeService) return;

    const node = rootRef.current;
    if (!node) return;

    const target = node.closest('section') ?? node;

    const observer = new IntersectionObserver(
      (entries) => {
        const isNowVisible = entries.some((entry) => entry.isIntersecting);
        if (!isNowVisible) return;
        if (visitorPickedTab.current) {
          visitorPickedTab.current = false;
          return;
        }
        setActiveTab((prev) => (prev === activeService ? prev : activeService));
      },
      { root: null, rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [activeService]);

  // Format date display for range or single date in dd.mm.yyyy format
  const getDisplayDateInfo = () => {
    if (activeTab === 'Transport') {
      if (singleDate) {
        return format(singleDate, 'dd.MM.yyyy');
      }
      if (dateRange?.from) {
        return format(dateRange.from, 'dd.MM.yyyy');
      }
      return '';
    }

    if (dateRange?.from && dateRange?.to) {
      return `${format(dateRange.from, 'dd.MM.yyyy')}  —  ${format(dateRange.to, 'dd.MM.yyyy')}`;
    }
    if (dateRange?.from) {
      return format(dateRange.from, 'dd.MM.yyyy');
    }
    return '';
  };

  // Form submission handling without altering existing flows
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === 'Umrah' || activeTab === 'Umrah Plus') {
      if (!dateRange?.from || !dateRange?.to) {
        setIsCalendarOpen(true);
        return;
      }
      const params = new URLSearchParams({
        type: activeTab,
        start: format(dateRange.from, 'yyyy-MM-dd'),
        end: format(dateRange.to, 'yyyy-MM-dd')
      });
      router.push(`/booking?${params.toString()}`);
      return;
    }

    if (activeTab === 'Transport') {
      const travelDate = singleDate || dateRange?.from;
      const params = new URLSearchParams({
        type: 'Transport',
        passengers: peopleCount.toString(),
        children: childrenCount.toString(),
        luggage: luggageCount.toString(),
        ...(travelDate && { start: format(travelDate, 'yyyy-MM-dd') })
      });
      router.push(`/booking?${params.toString()}`);
      return;
    }

    if (activeTab === 'Ziyarat') {
      // Cities are picked on the booking page itself, so they are not sent here.
      const params = new URLSearchParams({
        type: 'Ziyarat',
        passengers: ziyaratPersons.toString()
      });
      router.push(`/booking?${params.toString()}`);
      return;
    }
  };

  return (
    <motion.div
      ref={rootRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="w-full max-w-full md:max-w-2xl lg:max-w-5xl mx-auto lg:mx-0 flex flex-col gap-2.5 select-none"
    >
      {/* 1. Service Type Selector Tabs (Sequence: Umrah -> Transport -> Ziyarat -> Umrah Plus) */}
      {/* `relative` anchors the callout below, so the callout can be taken out of
          normal flow entirely. Nothing moves when a tab is hovered, which is what
          used to cause the flicker: the callout used to insert itself above the
          tabs, pushing them out from under the cursor. */}
      <div className="relative z-20">
        {/* Flow Information Callout Box (Displayed on Hover Only) */}
        <AnimatePresence>
          {hoveredTab && (
            <motion.div
              key={hoveredTab}
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              onMouseEnter={() => openCallout(hoveredTab)}
              onMouseLeave={scheduleCloseCallout}
              className="absolute z-100 bottom-full left-0 mb-2 w-fit max-w-[min(42rem,calc(100vw-3rem))] bg-[#12141a]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-3 sm:p-3.5 shadow-2xl flex flex-col gap-1.5"
            >
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex z-100 items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#c5a059]/20 text-[#c5a059] border border-[#c5a059]/30">
                  <Sparkles className="w-3 h-3 text-[#c5a059]" />
                  {FLOW_DETAILS[hoveredTab].badge}
                </span>
              </div>

              <p className="text-xs text-gray-300 font-light leading-relaxed">
                {FLOW_DETAILS[hoveredTab].description}
              </p>

              <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                {FLOW_DETAILS[hoveredTab].features.map((feat, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] text-gray-300 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059]" />
                    {feat}
                  </span>
                ))}
              </div>

              {/* Downward Pointer Tail */}
              <div
                className={`absolute -bottom-1.5 w-3 h-3 bg-[#12141a] border-r border-b border-white/10 transform rotate-45 transition-all duration-300 ${
                  hoveredTab === 'Umrah'
                    ? 'left-8 sm:left-10'
                    : hoveredTab === 'Transport'
                    ? 'left-24 sm:left-32'
                    : hoveredTab === 'Ziyarat'
                    ? 'left-40 sm:left-56'
                    : 'left-56 sm:left-80'
                }`}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div
          role="tablist"
          aria-label="Service type"
          className="flex items-center gap-1 sm:gap-1.5 p-1.5 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl w-fit max-w-full overflow-x-auto scrollbar-none shadow-xl"
          onMouseLeave={scheduleCloseCallout}
        >
        {SERVICE_TABS.map((tab) => {
          const isSelected = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              aria-selected={isSelected}
              role="tab"
              onMouseEnter={() => openCallout(tab.id)}
              onFocus={() => openCallout(tab.id)}
              onMouseLeave={scheduleCloseCallout}
              onBlur={scheduleCloseCallout}
              onClick={() => {
                visitorPickedTab.current = true;
                setActiveTab(tab.id);
                setIsCalendarOpen(false);
                setIsTransportGuestsOpen(false);
                setIsZiyaratGuestsOpen(false);
                setIsZiyaratCitiesOpen(false);
              }}
              className={`relative px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 whitespace-nowrap cursor-pointer ${
                isSelected ? 'text-black font-bold' : 'text-gray-300 hover:text-white hover:bg-white/5 font-medium'
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId={pillLayoutId}
                  className="absolute inset-0 bg-[#c5a059] rounded-xl shadow-[0_2px_12px_rgba(197,160,89,0.35)]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          );
        })}
        </div>
      </div>

      {/* 2. Main Booking Input Fields Bar */}
      {/* z-30 (above the z-20 tab bar) so the calendar and guest popovers are
          never painted over by the service tabs. */}
      <form
        onSubmit={handleSearch}
        className="relative z-30 bg-[#12141a]/90 backdrop-blur-2xl p-2 sm:p-2.5 rounded-2xl border border-white/10 shadow-[0_32px_64px_-15px_rgba(0,0,0,0.6)] flex flex-col sm:flex-row items-stretch gap-2 w-full"
      >
        {/* =========================================
            A. UMRAH & UMRAH PLUS FIELDS (Date Calendar)
        ========================================= */}
        {(activeTab === 'Umrah' || activeTab === 'Umrah Plus') && (
          <div
            ref={calendarRef}
            className="flex-1 w-full bg-[#1a1c22] rounded-xl px-4 py-3 sm:px-5 md:px-5 md:py-3.5 flex items-center border border-white/5 relative z-50 cursor-pointer hover:border-white/15 transition-all"
            onClick={() => setIsCalendarOpen(true)}
          >
            <CalendarIcon className="text-[#c5a059] w-5 h-5 mr-3 shrink-0" />
            <div className="flex-1 flex flex-col w-full text-left">
              <span className="text-[10px] uppercase font-semibold tracking-[0.2em] text-[#c5a059] mb-0.5">
                {activeTab === 'Umrah Plus' ? 'Umrah Plus Travel Window' : 'Travel Window'}
              </span>
              <input
                type="text"
                readOnly
                className="w-full bg-transparent text-white text-sm md:text-base font-light outline-none cursor-pointer placeholder:text-gray-500"
                placeholder="Select Departure — Return Date"
                value={getDisplayDateInfo()}
              />
            </div>

            {/* Calendar Popover with PAST DATES DISABLED */}
            <AnimatePresence>
              {isCalendarOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.18 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 mb-3 bg-[#1a1c22] border border-white/10 rounded-2xl shadow-[0_32px_64px_-15px_rgba(0,0,0,0.7)] p-3 sm:p-4 md:p-6 z-[100] max-w-[calc(100vw-2rem)] w-max backdrop-blur-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                    <span className="text-xs uppercase tracking-widest text-[#c5a059] font-semibold">
                      Select Travel Dates
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsCalendarOpen(false)}
                      className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      Done
                    </button>
                  </div>
                  <DayPicker
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={numberOfMonths}
                    pagedNavigation
                    fromDate={today}
                    disabled={{ before: today }}
                    className="font-inter"
                    classNames={{
                      months: "flex flex-col sm:flex-row space-y-6 sm:space-x-8 sm:space-y-0",
                      month: "space-y-4",
                      caption: "flex justify-center pt-1 relative items-center",
                      caption_label: "text-base font-semibold text-white",
                      nav: "space-x-1 flex items-center",
                      nav_button: "h-8 w-8 bg-transparent p-0 opacity-70 hover:opacity-100 flex items-center justify-center text-white border border-white/10 rounded-md hover:bg-white/10 transition-colors",
                      nav_button_previous: "absolute left-0",
                      nav_button_next: "absolute right-0",
                      table: "w-full border-collapse space-y-1",
                      head_row: "flex",
                      head_cell: "text-gray-500 rounded-md w-8 sm:w-10 font-normal text-xs uppercase mb-2",
                      row: "flex w-full mt-1",
                      cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 h-8 w-8 sm:h-10 sm:w-10",
                      day: "h-full w-full p-0 font-normal text-gray-200 transition-colors hover:bg-white/10 hover:text-white rounded-full flex items-center justify-center text-xs sm:text-sm cursor-pointer",
                      day_today: "font-bold text-[#c5a059] border border-[#c5a059]/40",
                      day_selected: "bg-[#c5a059] text-black hover:bg-[#c5a059] hover:text-black font-bold",
                      day_outside: "text-gray-600 opacity-40",
                      day_disabled: "text-gray-600 opacity-30 cursor-not-allowed pointer-events-none line-through",
                      day_range_start: "rounded-r-none rounded-l-full",
                      day_range_end: "rounded-l-none rounded-r-full",
                      day_range_middle: "aria-selected:bg-[#c5a059]/20 aria-selected:text-white aria-selected:rounded-none hover:aria-selected:bg-[#c5a059]/30",
                      day_hidden: "invisible",
                    }}
                    components={{
                      IconLeft: ({ ...props }) => <ChevronLeft className="h-5 w-5 text-gray-300" />,
                      IconRight: ({ ...props }) => <ChevronRight className="h-5 w-5 text-gray-300" />,
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* =========================================
            B. TRANSPORT FIELDS (People, Children, Luggage & Date)
        ========================================= */}
        {activeTab === 'Transport' && (
          <>
            {/* Travel Date Selector */}
            <div
              ref={calendarRef}
              className="flex-1 bg-[#1a1c22] rounded-xl px-4 py-3 sm:px-5 md:px-5 md:py-3.5 flex items-center border border-white/5 relative z-50 cursor-pointer hover:border-white/15 transition-all"
              onClick={() => setIsCalendarOpen(true)}
            >
              <CalendarIcon className="text-[#c5a059] w-5 h-5 mr-3 shrink-0" />
              <div className="flex-1 flex flex-col w-full text-left">
                <span className="text-[10px] uppercase font-semibold tracking-[0.2em] text-[#c5a059] mb-0.5">
                  Pickup / Travel Date
                </span>
                <input
                  type="text"
                  readOnly
                  className="w-full bg-transparent text-white text-sm md:text-base font-light outline-none cursor-pointer placeholder:text-gray-500"
                  placeholder="Select Date"
                  value={getDisplayDateInfo()}
                />
              </div>

              {/* Single/Range Calendar Popover */}
              <AnimatePresence>
                {isCalendarOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.18 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 mb-3 bg-[#1a1c22] border border-white/10 rounded-2xl shadow-[0_32px_64px_-15px_rgba(0,0,0,0.7)] p-3 sm:p-4 md:p-6 z-[100] max-w-[calc(100vw-2rem)] w-max backdrop-blur-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                      <span className="text-xs uppercase tracking-widest text-[#c5a059] font-semibold">
                        Select Travel Date
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsCalendarOpen(false)}
                        className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        Done
                      </button>
                    </div>
                    <DayPicker
                      mode="single"
                      selected={singleDate}
                      onSelect={(d) => {
                        setSingleDate(d);
                        if (d) setIsCalendarOpen(false);
                      }}
                      numberOfMonths={numberOfMonths}
                      fromDate={today}
                      disabled={{ before: today }}
                      className="font-inter"
                      classNames={{
                        months: "flex flex-col sm:flex-row space-y-6 sm:space-x-8 sm:space-y-0",
                        month: "space-y-4",
                        caption: "flex justify-center pt-1 relative items-center",
                        caption_label: "text-base font-semibold text-white",
                        nav: "space-x-1 flex items-center",
                        nav_button: "h-8 w-8 bg-transparent p-0 opacity-70 hover:opacity-100 flex items-center justify-center text-white border border-white/10 rounded-md hover:bg-white/10 transition-colors",
                        nav_button_previous: "absolute left-0",
                        nav_button_next: "absolute right-0",
                        table: "w-full border-collapse space-y-1",
                        head_row: "flex",
                        head_cell: "text-gray-500 rounded-md w-8 sm:w-10 font-normal text-xs uppercase mb-2",
                        row: "flex w-full mt-1",
                        cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 h-8 w-8 sm:h-10 sm:w-10",
                        day: "h-full w-full p-0 font-normal text-gray-200 transition-colors hover:bg-white/10 hover:text-white rounded-full flex items-center justify-center text-xs sm:text-sm cursor-pointer",
                        day_today: "font-bold text-[#c5a059] border border-[#c5a059]/40",
                        day_selected: "bg-[#c5a059] text-black hover:bg-[#c5a059] hover:text-black font-bold",
                        day_outside: "text-gray-600 opacity-40",
                        day_disabled: "text-gray-600 opacity-30 cursor-not-allowed pointer-events-none line-through",
                        day_hidden: "invisible",
                      }}
                      components={{
                        IconLeft: ({ ...props }) => <ChevronLeft className="h-5 w-5 text-gray-300" />,
                        IconRight: ({ ...props }) => <ChevronRight className="h-5 w-5 text-gray-300" />,
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Passengers & Luggage Selector */}
            <div
              ref={transportGuestsRef}
              className="flex-1 bg-[#1a1c22] rounded-xl px-4 py-3 sm:px-5 md:px-5 md:py-3.5 flex items-center border border-white/5 relative z-50 cursor-pointer hover:border-white/15 transition-all"
              onClick={() => setIsTransportGuestsOpen(!isTransportGuestsOpen)}
            >
              <Users className="text-[#c5a059] w-5 h-5 mr-3 shrink-0" />
              <div className="flex-1 flex flex-col w-full text-left">
                <span className="text-[10px] uppercase font-semibold tracking-[0.2em] text-[#c5a059] mb-0.5">
                  Passengers & Luggage
                </span>
                <span className="text-white text-sm md:text-base font-light truncate">
                  {peopleCount} {peopleCount === 1 ? 'Adult' : 'Adults'}
                  {childrenCount > 0 && `, ${childrenCount} ${childrenCount === 1 ? 'Child' : 'Children'}`}
                  {` • ${luggageCount} ${luggageCount === 1 ? 'Luggage' : 'Luggage'}`}
                </span>
              </div>
              <ChevronDown className={`text-gray-400 w-4 h-4 ml-2 shrink-0 transition-transform duration-200 ${isTransportGuestsOpen ? 'rotate-180 text-[#c5a059]' : ''}`} />

              {/* Luxury Counter Popover for Transport */}
              <AnimatePresence>
                {isTransportGuestsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.18 }}
                    className="absolute bottom-full right-0 sm:left-0 sm:right-auto mb-3 w-80 bg-[#1a1c22] border border-white/10 rounded-2xl shadow-[0_32px_64px_-15px_rgba(0,0,0,0.7)] p-4 z-[100] backdrop-blur-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="text-xs uppercase tracking-widest text-[#c5a059] font-bold pb-3 border-b border-white/10 mb-3">
                      Passengers & Luggage
                    </div>

                    <div className="space-y-4">
                      {/* People / Adults */}
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-[#c5a059]" />
                            <span className="text-sm font-medium text-white">People / Adults</span>
                          </div>
                          <span className="text-[11px] text-gray-400">Ages 12+</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            disabled={peopleCount <= 1}
                            onClick={() => setPeopleCount(Math.max(1, peopleCount - 1))}
                            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-6 text-center text-sm font-semibold text-white">{peopleCount}</span>
                          <button
                            type="button"
                            onClick={() => setPeopleCount(peopleCount + 1)}
                            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Children */}
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <Baby className="w-4 h-4 text-[#c5a059]" />
                            <span className="text-sm font-medium text-white">Children</span>
                          </div>
                          <span className="text-[11px] text-gray-400">Ages 0–11</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            disabled={childrenCount <= 0}
                            onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
                            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-6 text-center text-sm font-semibold text-white">{childrenCount}</span>
                          <button
                            type="button"
                            onClick={() => setChildrenCount(childrenCount + 1)}
                            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Luggage */}
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-[#c5a059]" />
                            <span className="text-sm font-medium text-white">Luggage Bags</span>
                          </div>
                          <span className="text-[11px] text-gray-400">Standard suitcases</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            disabled={luggageCount <= 0}
                            onClick={() => setLuggageCount(Math.max(0, luggageCount - 1))}
                            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-6 text-center text-sm font-semibold text-white">{luggageCount}</span>
                          <button
                            type="button"
                            onClick={() => setLuggageCount(luggageCount + 1)}
                            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsTransportGuestsOpen(false)}
                        className="w-full mt-2 py-2 bg-[#c5a059] text-black font-semibold rounded-xl text-xs uppercase tracking-wider hover:bg-[#d4b57a] transition-all cursor-pointer"
                      >
                        Apply Selection
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}

        {/* =========================================
            C. ZIYARAT FIELDS (Cities Checkboxes & Pilgrims/Guests)
        ========================================= */}
        {activeTab === 'Ziyarat' && (
          <>
            {/* 1. Cities Dropdown (display-only for now) */}
            <div
              ref={ziyaratCitiesRef}
              className="flex-1 bg-[#1a1c22] rounded-xl px-4 py-3 sm:px-5 md:px-5 md:py-3.5 flex items-center border border-white/5 relative z-50 cursor-pointer hover:border-white/15 transition-all"
              onClick={() => {
                setIsZiyaratCitiesOpen(!isZiyaratCitiesOpen);
                setIsZiyaratGuestsOpen(false);
              }}
            >
              <MapPin className="text-[#c5a059] w-5 h-5 mr-3 shrink-0" />
              <div className="flex-1 flex flex-col w-full text-left">
                <span className="text-[10px] uppercase font-semibold tracking-[0.2em] text-[#c5a059] mb-0.5">
                  Cities
                </span>
                <span className="text-white text-sm md:text-base font-light truncate">
                  {ziyaratCities.length > 0 ? ziyaratCities.join(', ') : 'Select Cities'}
                </span>
              </div>
              <ChevronDown className={`text-gray-400 w-4 h-4 ml-2 shrink-0 transition-transform duration-200 ${isZiyaratCitiesOpen ? 'rotate-180 text-[#c5a059]' : ''}`} />

              {/* Cities Popover (info only) */}
              <AnimatePresence>
                {isZiyaratCitiesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.18 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 mb-3 w-80 max-w-[calc(100vw-2rem)] bg-[#1a1c22] border border-white/10 rounded-2xl shadow-[0_32px_64px_-15px_rgba(0,0,0,0.7)] p-4 z-[100] backdrop-blur-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                      <span className="text-xs uppercase tracking-widest text-[#c5a059] font-bold">
                        Select Cities
                      </span>
                      <span className="text-[11px] text-gray-400">
                        {ziyaratCities.length} Cities
                      </span>
                    </div>

                    {/* City list — selection (checkboxes / click-to-toggle) is
                        commented out for now, rows are shown for info only. */}
                    <div className="space-y-2">
                      {[
                        { name: 'Makkah', desc: 'Sacred Sites & Holy Landmarks' },
                        { name: 'Madinah', desc: 'City of the Prophet ﷺ' },
                        { name: 'Taif', desc: 'Historic Valley & Mountain Sites' }
                      ].map((c) => (
                        <div
                          key={c.name}
                          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl border transition-all cursor-default bg-white/5 border-white/5 text-gray-300"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold tracking-wide">{c.name}</span>
                          </div>
                          <span className="text-[11px] text-gray-400 font-light truncate max-w-[130px]">
                            {c.desc}
                          </span>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsZiyaratCitiesOpen(false)}
                      className="w-full mt-3 py-2 bg-[#c5a059] text-black font-semibold rounded-xl text-xs uppercase tracking-wider hover:bg-[#d4b57a] transition-all cursor-pointer"
                    >
                      Done
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 2. Number of Pilgrims / Guests Selector */}
            <div
              ref={ziyaratGuestsRef}
              className="flex-1 bg-[#1a1c22] rounded-xl px-4 py-3 sm:px-5 md:px-5 md:py-3.5 flex items-center border border-white/5 relative z-50 cursor-pointer hover:border-white/15 transition-all"
              onClick={() => {
                setIsZiyaratGuestsOpen(!isZiyaratGuestsOpen);
                setIsZiyaratCitiesOpen(false);
              }}
            >
              <Users className="text-[#c5a059] w-5 h-5 mr-3 shrink-0" />
              <div className="flex-1 flex flex-col w-full text-left">
                <span className="text-[10px] uppercase font-semibold tracking-[0.2em] text-[#c5a059] mb-0.5">
                  Number of Pilgrims / Guests
                </span>
                <span className="text-white text-sm md:text-base font-light">
                  {ziyaratPersons} {ziyaratPersons === 1 ? 'Pilgrim / Guest' : 'Pilgrims / Guests'}
                </span>
              </div>
              <ChevronDown className={`text-gray-400 w-4 h-4 ml-2 shrink-0 transition-transform duration-200 ${isZiyaratGuestsOpen ? 'rotate-180 text-[#c5a059]' : ''}`} />

              {/* Ziyarat Counter Popover */}
              <AnimatePresence>
                {isZiyaratGuestsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.18 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 sm:left-auto sm:right-0 md:left-0 mb-3 w-80 max-w-[calc(100vw-2rem)] bg-[#1a1c22] border border-white/10 rounded-2xl shadow-[0_32px_64px_-15px_rgba(0,0,0,0.7)] p-4 z-[100] backdrop-blur-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="text-xs uppercase tracking-widest text-[#c5a059] font-bold pb-3 border-b border-white/10 mb-3">
                      Number of Pilgrims / Guests
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">Pilgrims / Guests</span>
                        <span className="text-[11px] text-gray-400">Total travelers in tour</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          disabled={ziyaratPersons <= 1}
                          onClick={() => setZiyaratPersons(Math.max(1, ziyaratPersons - 1))}
                          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold text-white">{ziyaratPersons}</span>
                        <button
                          type="button"
                          onClick={() => setZiyaratPersons(ziyaratPersons + 1)}
                          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsZiyaratGuestsOpen(false)}
                      className="w-full mt-3 py-2 bg-[#c5a059] text-black font-semibold rounded-xl text-xs uppercase tracking-wider hover:bg-[#d4b57a] transition-all cursor-pointer"
                    >
                      Done
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}

        {/* Action Button */}
        <button
          type="submit"
          className="w-full sm:w-auto bg-[#c5a059] hover:bg-[#d4b57a] text-black uppercase tracking-[0.15em] font-bold px-7 sm:px-8 md:px-9 py-3.5 md:py-3.5 rounded-xl flex items-center justify-center transition-all shadow-[0_4px_14px_rgba(197,160,89,0.39)] shrink-0 min-h-[48px] cursor-pointer"
        >
          <Search className="w-4 h-4 mr-2 text-black" />
          Search
        </button>
      </form>
    </motion.div>
  );
}
