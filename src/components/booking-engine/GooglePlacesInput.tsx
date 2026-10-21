'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin } from 'lucide-react';

// Session-wide flag: an expired/invalid API key degrades every Places
// Autocomplete on the page, so one instance detecting the failure switches
// all instances (present and future) over to the local suggestion list.
let placesApiFailed = false;
let authFailureHookInstalled = false;

const PLACES_ERROR_TEXT = "This page can't load Google Maps correctly";

const notifyPlacesFailed = () => {
  if (placesApiFailed) return;
  placesApiFailed = true;
  window.dispatchEvent(new Event('google-places-degraded'));
};

const isDegradedPacContainer = (node: Element) =>
  Boolean(node.querySelector('.dismissButton')) ||
  (node.textContent || '').includes(PLACES_ERROR_TEXT);

interface PlacesAutocompleteInstance {
  addListener(event: string, handler: () => void): void;
  getPlace(): { formatted_address?: string; name?: string };
  unbindAll?: () => void;
}

interface GoogleGlobal {
  maps: {
    places?: {
      Autocomplete: new (
        input: HTMLInputElement,
        options?: {
          componentRestrictions?: { country: string };
          fields?: string[];
          types?: string[];
        }
      ) => PlacesAutocompleteInstance;
    };
    event?: {
      clearInstanceListeners?: (target: object) => void;
    };
  };
}

type GoogleWindow = Window & {
  google?: GoogleGlobal;
  gm_authFailure?: () => void;
};

const googleWindow = () => window as GoogleWindow;

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

const filterLocations = (query: string, limit?: number): string[] => {
  const normalized = query.trim().toLowerCase();
  const matches = normalized
    ? POPULAR_SAUDI_LOCATIONS.filter(item => item.toLowerCase().includes(normalized))
    : POPULAR_SAUDI_LOCATIONS;
  return limit ? matches.slice(0, limit) : matches;
};

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
  const [googleDegraded, setGoogleDegraded] = useState(placesApiFailed);
  const autocompleteRef = useRef<PlacesAutocompleteInstance | null>(null);

  // Keep a reference to the latest onChange callback to prevent stale closures in Google Maps listener
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Tear down the Google Autocomplete and switch this field to the local
  // suggestion list. Called whenever Google reports a key/billing failure.
  const deactivateGoogle = useCallback(() => {
    const autocomplete = autocompleteRef.current;
    if (autocomplete) {
      try { autocomplete.unbindAll?.(); } catch { }
      try {
        googleWindow().google?.maps.event?.clearInstanceListeners?.(autocomplete);
      } catch { }
      autocompleteRef.current = null;
    }
    document.querySelectorAll('.pac-container').forEach((el) => el.remove());
    setIsGoogleLoaded(false);
    setGoogleDegraded(true);

    // Hand over to the local list seamlessly if this field still has focus.
    if (document.activeElement === inputRef.current) {
      const filtered = filterLocations(inputRef.current?.value || '', 6);
      setSuggestions(filtered.length > 0 ? filtered : POPULAR_SAUDI_LOCATIONS.slice(0, 6));
      setIsOpen(true);
    }
  }, []);

  const initAutocomplete = useCallback(() => {
    if (placesApiFailed) return;
    const AutocompleteCtor = googleWindow().google?.maps.places?.Autocomplete;
    if (!inputRef.current || !AutocompleteCtor) return;
    if (autocompleteRef.current) return;

    try {
      const autocomplete = new AutocompleteCtor(inputRef.current, {
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
  }, []);

  // Attempt to load Google Maps Places Autocomplete if API key is provided
  useEffect(() => {
    if (placesApiFailed) return;

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) return;

    let isMounted = true;

    // Google renders the "can't load Google Maps correctly" notice (dismiss
    // button + message) inside .pac-container when the key is expired or
    // billing is broken. Treat it as a hard failure for every instance.
    const detectDegradedState = () => {
      document.querySelectorAll('.pac-container').forEach((node) => {
        if (isDegradedPacContainer(node)) notifyPlacesFailed();
      });
    };

    const observer = new MutationObserver(detectDegradedState);
    observer.observe(document.body, { childList: true, subtree: true });

    // Auth failures (invalid key / missing billing) also surface here.
    if (!authFailureHookInstalled) {
      authFailureHookInstalled = true;
      const w = googleWindow();
      const previous = w.gm_authFailure;
      w.gm_authFailure = () => {
        notifyPlacesFailed();
        if (typeof previous === 'function') previous();
      };
    }

    const onDegraded = () => {
      if (isMounted) deactivateGoogle();
    };
    window.addEventListener('google-places-degraded', onDegraded);

    const setupAutocomplete = () => {
      if (!isMounted || placesApiFailed) return;
      initAutocomplete();
    };

    // If script is already loaded and ready
    if (googleWindow().google?.maps.places) {
      setupAutocomplete();
      return () => {
        isMounted = false;
        observer.disconnect();
        window.removeEventListener('google-places-degraded', onDegraded);
      };
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
      if (googleWindow().google?.maps.places || placesApiFailed) {
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
      observer.disconnect();
      window.removeEventListener('google-places-degraded', onDegraded);
    };
  }, [deactivateGoogle, initAutocomplete]);

  // Filter internal suggestions when user types and Google is not active
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    onChangeRef.current(text);

    // Google's own dropdown handles suggestions while it is active.
    if (isGoogleLoaded) {
      setIsOpen(false);
      return;
    }

    const filtered = filterLocations(text);
    setSuggestions(filtered);
    setIsOpen(filtered.length > 0);
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
            if (isGoogleLoaded) return;
            const filtered = filterLocations(value, 6);
            setSuggestions(filtered.length > 0 ? filtered : POPULAR_SAUDI_LOCATIONS.slice(0, 6));
            setIsOpen(true);
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
            ) : googleDegraded ? (
              <span className="text-[#f3d38a] text-[9px] font-normal">Local Suggestions</span>
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
