'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Check, Sparkles } from 'lucide-react';

interface GooglePlacesInputProps {
  id?: string;
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
}

const POPULAR_SAUDI_LOCATIONS = [
  'King Abdulaziz International Airport (JED), Jeddah',
  'Prince Mohammad bin Abdulaziz Airport (MED), Madinah',
  'Jeddah Airport Terminal 1',
  'Jeddah Airport North Terminal',
  'Haramain High Speed Railway Station, Jeddah',
  'Haramain High Speed Railway Station, Makkah',
  'Haramain High Speed Railway Station, Madinah',
  'Makkah Clock Royal Tower, A Fairmont Hotel, Makkah',
  'Swissôtel Al Maqam Makkah, Ibrahim Al Khalil St, Makkah',
  'Pullman Zamzam Makkah, Abraj Al Bait, Makkah',
  'Jabal Omar Hyatt Regency, Ibrahim Al Khalil, Makkah',
  'Raffles Makkah Palace, King Abdul Aziz Endowment, Makkah',
  'The Oberoi, Madinah, Central Northern Area, Madinah',
  'Dar Al Taqwa Hotel Madinah, Off Courtyard of Prophet Mosque',
  'Anwar Al Madinah Mövenpick Hotel, Central Area, Madinah',
  'Madinah Hilton Hotel, King Fahd Rd, Madinah',
  'Masjid al-Haram, Makkah',
  'Al Masjid an-Nabawi, Madinah',
  'Masjid Quba, Hijrah Rd, Madinah',
  'Masjid al-Qiblatayn, Madinah',
  'Al Hada Mountain, Taif',
];

export default function GooglePlacesInput({
  id,
  label,
  placeholder = 'Search hotel, airport or location in Saudi Arabia...',
  value,
  onChange,
  required = false
}: GooglePlacesInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const autocompleteRef = useRef<any>(null);

  // Keep a reference to the latest onChange callback to prevent stale closures in Google Maps listener
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Attempt to load Google Maps Places Autocomplete if API key is provided
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) return;

    let isMounted = true;

    const setupAutocomplete = () => {
      if (!isMounted) return;
      initAutocomplete();
    };

    // If script is already loaded and ready
    if ((window as any).google?.maps?.places) {
      setupAutocomplete();
      return;
    }

    const scriptId = 'google-maps-places-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    // Attach load listener to the script (whether newly created or already existing)
    script.addEventListener('load', setupAutocomplete);

    // Polling backup in case the script finishes right between check and listener
    const pollInterval = setInterval(() => {
      if ((window as any).google?.maps?.places) {
        clearInterval(pollInterval);
        setupAutocomplete();
      }
    }, 150);

    return () => {
      isMounted = false;
      if (script) {
        script.removeEventListener('load', setupAutocomplete);
      }
      clearInterval(pollInterval);
    };
  }, []);

  const initAutocomplete = () => {
    if (!inputRef.current || !(window as any).google?.maps?.places) return;
    if (autocompleteRef.current) return;

    try {
      const autocomplete = new (window as any).google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: 'sa' },
        fields: ['formatted_address', 'name', 'geometry'],
        types: ['establishment', 'geocode']
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        const address = place.formatted_address || place.name || '';
        if (address) {
          onChangeRef.current(address);
          setIsOpen(false);
        }
      });
      autocompleteRef.current = autocomplete;
      setIsGoogleLoaded(true);
    } catch (e) {
      console.warn('Google Places Autocomplete initialization fallback to custom list', e);
    }
  };

  // Filter internal suggestions when user types and Google is not active
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    onChangeRef.current(text);

    // Only show fallback suggestions if Google Places is not loaded
    if (!isGoogleLoaded) {
      if (text.trim().length > 1) {
        const query = text.toLowerCase();
        const filtered = POPULAR_SAUDI_LOCATIONS.filter(item =>
          item.toLowerCase().includes(query)
        );
        setSuggestions(filtered);
        setIsOpen(filtered.length > 0);
      } else {
        setSuggestions(POPULAR_SAUDI_LOCATIONS.slice(0, 6));
        setIsOpen(text.length === 0);
      }
    } else {
      setIsOpen(false);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full min-w-0">
      {label && (
        <label htmlFor={id} className="text-xs uppercase tracking-widest text-[#c5a059] font-bold block mb-2">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        <MapPin className="absolute left-4 w-4 h-4 text-[#c5a059] shrink-0 pointer-events-none" />
        <input
          ref={inputRef}
          id={id}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => {
            if (!isGoogleLoaded && !value) {
              setSuggestions(POPULAR_SAUDI_LOCATIONS.slice(0, 6));
              setIsOpen(true);
            }
          }}
          placeholder={placeholder}
          required={required}
          className="w-full bg-[#12141a] border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-gray-500 text-sm focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059] outline-none transition-all"
        />
      </div>

      {/* Fallback Autocomplete Suggestions Popover */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-[#1a1c22] border border-white/15 rounded-2xl shadow-2xl z-50 max-h-60 overflow-y-auto custom-scrollbar backdrop-blur-xl divide-y divide-white/5">
          <div className="p-2.5 bg-black/40 text-[10px] uppercase font-bold tracking-wider text-gray-400 flex items-center justify-between">
            <span>Suggested Saudi Locations</span>
            {isGoogleLoaded ? (
              <span className="text-[#00d084] text-[9px] font-normal">Google Places Active</span>
            ) : (
              <span className="text-[#c5a059] text-[9px] font-normal">Fast Lookup</span>
            )}
          </div>
          {suggestions.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                onChangeRef.current(item);
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 hover:bg-white/10 text-xs text-gray-200 hover:text-[#c5a059] transition-colors flex items-center gap-2.5 cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-[#c5a059] shrink-0" />
              <span className="truncate">{item}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
