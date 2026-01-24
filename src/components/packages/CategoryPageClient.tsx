'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Package } from '@/data/packages/types';
import PackageCard from '@/components/packages/PackageCard';
import { Filter, X } from 'lucide-react';

interface Props {
  category: string;
  categoryTitle: string;
  initialPackages: Package[];
}

export default function CategoryPageClient({ category, categoryTitle, initialPackages }: Props) {
  // State for active filters
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedDuration, setSelectedDuration] = useState<string>('All');

  // --- 1. EXTRACT UNIQUE OPTIONS ---
  // Get unique cities present in the current package list
  const cities = useMemo(() => {
    const uniqueCities = new Set(initialPackages.map(p => p.city));
    return ['All', ...Array.from(uniqueCities)];
  }, [initialPackages]);

  // Get unique durations (e.g. "1 Day", "5 Days")
  const durations = useMemo(() => {
    const uniqueDurations = new Set(initialPackages.map(p => p.duration));
    return ['All', ...Array.from(uniqueDurations)];
  }, [initialPackages]);

  // --- 2. FILTER LOGIC ---
  const filteredPackages = initialPackages.filter(pkg => {
    const cityMatch = selectedCity === 'All' || pkg.city === selectedCity;
    const durationMatch = selectedDuration === 'All' || pkg.duration === selectedDuration;
    return cityMatch && durationMatch;
  });

  // --- 3. DETERMINE WHICH FILTERS TO SHOW ---
  const showCityFilter = ['ziyarat-packages', 'transportation-packages', 'explore-saudi-packages'].includes(category);
  const showDurationFilter = ['umrah-packages', 'umrah-plus-packages'].includes(category);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans">
      
      <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-20 pt-32">
        
        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-[#F9C344] mb-4 uppercase">
            {categoryTitle}
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Explore our exclusive collection of {categoryTitle} curated for your spiritual journey.
          </p>
        </div>

        {/* --- FILTERS SECTION --- */}
        {(showCityFilter || showDurationFilter) && (
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            
            {/* Filter Label */}
            <div className="flex items-center gap-2 text-gray-500 uppercase font-bold text-xs tracking-widest mr-2">
              <Filter size={16} /> Filter By:
            </div>

            {/* CITY FILTER BUTTONS */}
            {showCityFilter && cities.map(city => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-6 py-2 rounded-full text-sm font-medium border transition-all ${
                  selectedCity === city
                    ? 'bg-[#F9C344] text-black border-[#F9C344]'
                    : 'bg-transparent text-gray-400 border-white/10 hover:border-white/40'
                }`}
              >
                {city === 'All' ? 'All Cities' : city}
              </button>
            ))}

            {/* DURATION FILTER BUTTONS */}
            {showDurationFilter && durations.map(duration => (
              <button
                key={duration}
                onClick={() => setSelectedDuration(duration)}
                className={`px-6 py-2 rounded-full text-sm font-medium border transition-all ${
                  selectedDuration === duration
                    ? 'bg-[#F9C344] text-black border-[#F9C344]'
                    : 'bg-transparent text-gray-400 border-white/10 hover:border-white/40'
                }`}
              >
                {duration === 'All' ? 'Any Duration' : duration}
              </button>
            ))}

            {/* RESET BUTTON (Only if filters active) */}
            {(selectedCity !== 'All' || selectedDuration !== 'All') && (
              <button 
                onClick={() => { setSelectedCity('All'); setSelectedDuration('All'); }}
                className="flex items-center gap-1 text-red-400 hover:text-red-300 text-xs uppercase font-bold tracking-widest ml-2"
              >
                <X size={14} /> Clear
              </button>
            )}
          </div>
        )}

        {/* --- GRID SECTION --- */}
        {filteredPackages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {filteredPackages.map((pkg: Package) => (
              <PackageCard key={pkg.id} pkg={pkg} category={category} />
            ))}
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="text-center py-20 border border-white/10 rounded-xl bg-white/5">
            <h3 className="text-2xl font-bold text-white mb-2">No Packages Found</h3>
            <p className="text-gray-400">Try adjusting your filters to see more results.</p>
            <button 
               onClick={() => { setSelectedCity('All'); setSelectedDuration('All'); }}
               className="inline-block mt-6 text-[#F9C344] hover:underline"
            >
              Clear Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}