'use client';

import React, { useState } from 'react';
import { CityPackage, VehicleOption } from '@/types'; // Ensure VehicleOption is imported
import { Clock, MapPin, Users, Check, Car } from 'lucide-react';

export default function PackageCard({ pkg }: { pkg: CityPackage }) {
  // 1. Safely handle empty vehicle arrays by defaulting to null
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleOption | null>(
    pkg.vehicleOptions && pkg.vehicleOptions.length > 0 ? pkg.vehicleOptions[0] : null
  );

  return (
    <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 overflow-hidden flex flex-col h-full hover:border-[#F9C344]/50 transition-colors">
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-4">
          <h4 className="text-2xl font-serif font-bold text-white leading-tight">{pkg.title}</h4>
          <span className="flex items-center gap-1 text-[#F9C344] bg-[#F9C344]/10 px-3 py-1 rounded-full text-sm font-bold">
            <Clock size={14} /> {pkg.durationDays} Day
          </span>
        </div>
        
        <p className="text-gray-400 text-sm mb-6 line-clamp-3">{pkg.description}</p>

        {/* Destinations */}
        <div className="mb-6">
          <p className="text-xs uppercase text-gray-500 font-bold mb-2 tracking-wider">Destinations Included:</p>
          <div className="flex flex-wrap gap-2">
            {pkg.destinations?.map((dest, idx) => (
              <span key={idx} className="flex items-center gap-1 text-xs text-gray-300 bg-black/50 px-2 py-1 rounded border border-white/5">
                <MapPin size={10} className="text-[#F9C344]" /> {dest}
              </span>
            ))}
          </div>
        </div>

        {/* Dynamic Vehicle Selection */}
        <div className="bg-black/40 p-4 rounded-xl mb-6 border border-white/5">
          <p className="text-xs uppercase text-gray-500 font-bold mb-3 tracking-wider flex items-center gap-2">
            <Car size={14} /> Select Vehicle
          </p>
          <div className="space-y-2">
            {/* 2. Conditionally render the options or a fallback message */}
            {pkg.vehicleOptions && pkg.vehicleOptions.length > 0 ? (
              pkg.vehicleOptions.map((vehicle) => (
                <label 
                  key={vehicle.id} 
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer border transition-all ${
                    selectedVehicle?.id === vehicle.id 
                      ? 'border-[#F9C344] bg-[#F9C344]/5' 
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name={`vehicle-${pkg.id}`} 
                      className="accent-[#F9C344]"
                      checked={selectedVehicle?.id === vehicle.id}
                      onChange={() => setSelectedVehicle(vehicle)}
                    />
                    <span className="text-white text-sm font-medium">{vehicle.name}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400 text-xs">
                    <Users size={12} /> {vehicle.capacity} max
                  </div>
                </label>
              ))
            ) : (
               <p className="text-sm text-gray-500 italic px-2">No vehicles currently assigned to this package.</p>
            )}
          </div>
        </div>

        {/* Includes */}
        <div className="space-y-2">
           {pkg.includes?.map((item, idx) => (
             <div key={idx} className="flex items-center gap-2 text-sm text-gray-300">
               <Check size={14} className="text-green-500" /> {item}
             </div>
           ))}
        </div>
      </div>

      {/* Footer / Price / Booking */}
      <div className="p-6 bg-black/50 border-t border-white/10 flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Package Cost</p>
          {/* 3. Conditionally render the price block */}
          {selectedVehicle ? (
            <p className="text-2xl font-bold text-white">${selectedVehicle.basePrice} <span className="text-sm font-normal text-gray-400">USD</span></p>
          ) : (
             <p className="text-lg font-bold text-[#F9C344]">Price TBD</p>
          )}
        </div>
        <button 
          disabled={!selectedVehicle}
          className={`px-6 py-3 rounded-lg font-bold transition-colors text-sm uppercase tracking-wide ${
            selectedVehicle 
              ? 'bg-[#F9C344] text-black hover:bg-white' 
              : 'bg-white/10 text-white/30 cursor-not-allowed'
          }`}
        >
          Book Package
        </button>
      </div>
    </div>
  );
}