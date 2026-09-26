'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Plus, Trash2, Plane, Building, Car, Map, DollarSign } from 'lucide-react';
import { createUmrahPackage } from '@/app/actions/adminUmrahActions';

export default function PackageBuilderForm({ 
  isUmrahPlus, 
  vehicles, 
  ziyaratPoints 
}: { 
  isUmrahPlus: boolean;
  vehicles: any[];
  ziyaratPoints?: any[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [durationDays, setDurationDays] = useState(14);
  const [makkahNights, setMakkahNights] = useState(7);
  const [madinahNights, setMadinahNights] = useState(7);
  const [visaType, setVisaType] = useState('E-Visa/On Arrival');
  const [internationalTransport, setInternationalTransport] = useState('By Air');
  
  // Array States
  const [pricing, setPricing] = useState([
    { occupancy: 'Double', price: 0 },
    { occupancy: 'Triple', price: 0 },
    { occupancy: 'Quad', price: 0 },
  ]);
  const [hotels, setHotels] = useState<{ hotelId: string, city: string }[]>([]);
  const [selectedVehicles, setSelectedVehicles] = useState<{ vehicleId: string, routeType: string }[]>([]);
  const [ziyarat, setZiyarat] = useState<{ ziyaratPointId: string }[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return setError("Title is required");
    
    setLoading(true);
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const payload = {
      title,
      slug,
      packageType: isUmrahPlus ? 'plus' : 'standard',
      durationDays,
      makkahNights,
      madinahNights,
      visaType,
      internationalTransport,
      pricing,
      hotels,
      vehicles: selectedVehicles,
      ziyarat: isUmrahPlus ? ziyarat : [],
    };

    const result = await createUmrahPackage(payload);

    if (result.success) {
      router.push(`/admin/packages/${isUmrahPlus ? 'umrah-plus' : 'umrah'}`);
      router.refresh();
    } else {
      setError(result.error || "Failed to save package.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-center bg-[#151515] p-4 rounded-xl border border-white/5">
        <h2 className="text-xl font-bold text-white">
          {isUmrahPlus ? "Build Umrah Plus Package" : "Build Standard Umrah Package"}
        </h2>
        <button 
          onClick={handleSubmit} 
          disabled={loading} 
          className="flex items-center gap-2 bg-[#F9C344] text-black px-6 py-2 rounded-lg font-bold hover:bg-white transition-all disabled:opacity-50"
        >
          {loading ? "Saving..." : <><Save size={18} /> Save Package</>}
        </button>
      </div>

      {error && <div className="bg-red-500/10 text-red-500 p-4 rounded-lg border border-red-500/20">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Core Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#151515] p-6 rounded-xl border border-white/5 space-y-4">
            <h3 className="text-[#F9C344] font-bold">Basic Information</h3>
            <input 
              type="text" placeholder="Package Title (e.g., 14 Days Premium Umrah)"
              className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-[#F9C344] outline-none"
              value={title} onChange={(e) => setTitle(e.target.value)}
            />
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] text-gray-500 uppercase mb-1">Total Days</label>
                <input type="number" className="w-full bg-black border border-white/10 rounded-lg p-3 text-white" value={durationDays} onChange={(e) => setDurationDays(Number(e.target.value))} />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 uppercase mb-1">Makkah Nights</label>
                <input type="number" className="w-full bg-black border border-white/10 rounded-lg p-3 text-white" value={makkahNights} onChange={(e) => setMakkahNights(Number(e.target.value))} />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 uppercase mb-1">Madinah Nights</label>
                <input type="number" className="w-full bg-black border border-white/10 rounded-lg p-3 text-white" value={madinahNights} onChange={(e) => setMadinahNights(Number(e.target.value))} />
              </div>
            </div>
          </div>

          <div className="bg-[#151515] p-6 rounded-xl border border-white/5 space-y-4">
            <h3 className="text-[#F9C344] font-bold flex items-center gap-2"><Plane size={18}/> Logistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <select className="w-full bg-black border border-white/10 rounded-lg p-3 text-white" value={visaType} onChange={(e) => setVisaType(e.target.value)}>
                <option value="E-Visa/On Arrival">E-Visa / On Arrival</option>
                <option value="Through Shirka">Through Shirka</option>
              </select>
              <select className="w-full bg-black border border-white/10 rounded-lg p-3 text-white" value={internationalTransport} onChange={(e) => setInternationalTransport(e.target.value)}>
                <option value="By Air">By Air</option>
                <option value="By Road">By Road</option>
              </select>
            </div>
          </div>

          {/* ZIYARAT SECTION (Conditional) */}
          {isUmrahPlus && (
            <div className="bg-[#151515] p-6 rounded-xl border border-white/5 space-y-4 border-l-4 border-l-[#F9C344]">
              <h3 className="text-[#F9C344] font-bold flex items-center gap-2"><Map size={18}/> Ziyarat Inclusions</h3>
              {ziyarat.map((z, index) => (
                <div key={index} className="flex gap-2 relative">
                  <select 
                    className="w-full bg-black border border-white/10 rounded-lg p-3 text-white"
                    value={z.ziyaratPointId}
                    onChange={(e) => {
                      const newZ = [...ziyarat];
                      newZ[index].ziyaratPointId = e.target.value;
                      setZiyarat(newZ);
                    }}
                  >
                    <option value="">Select Ziyarat Location</option>
                    {ziyaratPoints?.map(zp => <option key={zp.id} value={zp.id}>{zp.title} ({zp.city})</option>)}
                  </select>
                  <button onClick={() => setZiyarat(ziyarat.filter((_, i) => i !== index))} className="p-3 text-red-500 bg-red-500/10 rounded-lg"><Trash2 size={16}/></button>
                </div>
              ))}
              <button onClick={() => setZiyarat([...ziyarat, { ziyaratPointId: '' }])} className="text-xs text-gray-400 hover:text-[#F9C344] border border-dashed border-white/20 p-2 rounded w-full">+ Add Ziyarat Location</button>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Pricing & Linked Data */}
        <div className="space-y-6">
          <div className="bg-[#151515] p-6 rounded-xl border border-white/5 space-y-4">
            <h3 className="text-[#F9C344] font-bold flex items-center gap-2"><DollarSign size={18}/> Pricing (AED)</h3>
            {pricing.map((p, index) => (
              <div key={index}>
                <label className="block text-[10px] text-gray-500 uppercase mb-1">{p.occupancy} Occupancy</label>
                <input 
                  type="number" className="w-full bg-black border border-white/10 rounded-lg p-3 text-white" 
                  value={p.price} 
                  onChange={(e) => {
                    const newPricing = [...pricing];
                    newPricing[index].price = Number(e.target.value);
                    setPricing(newPricing);
                  }} 
                />
              </div>
            ))}
          </div>

          <div className="bg-[#151515] p-6 rounded-xl border border-white/5 space-y-4">
            <h3 className="text-[#F9C344] font-bold flex items-center gap-2"><Car size={18}/> Local Transport</h3>
            {selectedVehicles.map((v, index) => (
              <div key={index} className="space-y-2 p-3 bg-black rounded border border-white/5 relative">
                <button onClick={() => setSelectedVehicles(selectedVehicles.filter((_, i) => i !== index))} className="absolute top-2 right-2 text-red-500"><Trash2 size={14}/></button>
                <select 
                  className="w-full bg-[#151515] border border-white/10 rounded p-2 text-xs text-white"
                  value={v.vehicleId}
                  onChange={(e) => {
                    const newV = [...selectedVehicles];
                    newV[index].vehicleId = e.target.value;
                    setSelectedVehicles(newV);
                  }}
                >
                  <option value="">Select Vehicle</option>
                  {vehicles.map(veh => <option key={veh.id} value={veh.id}>{veh.name}</option>)}
                </select>
                <input 
                  type="text" placeholder="Route (e.g., JED - Mak - Mad)"
                  className="w-full bg-[#151515] border border-white/10 rounded p-2 text-xs text-white"
                  value={v.routeType}
                  onChange={(e) => {
                    const newV = [...selectedVehicles];
                    newV[index].routeType = e.target.value;
                    setSelectedVehicles(newV);
                  }}
                />
              </div>
            ))}
            <button onClick={() => setSelectedVehicles([...selectedVehicles, { vehicleId: '', routeType: '' }])} className="text-xs text-gray-400 hover:text-[#F9C344] border border-dashed border-white/20 p-2 rounded w-full">+ Add Transport Route</button>
          </div>
        </div>

      </div>
    </div>
  );
}