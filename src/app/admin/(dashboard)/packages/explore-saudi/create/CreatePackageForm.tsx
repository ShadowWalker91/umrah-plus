'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Plus, Trash2, Package, MapPin, Clock, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { createExplorePackage } from '@/app/actions/adminExploreActions';

export default function CreatePackageForm({ cities, vehicles }: { cities: any[], vehicles: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    citySlug: '',
    title: '',
    description: '',
    durationDays: 1,
    destinations: [''],
    includes: [''],
    vehicleOptions: [] as { vehicleId: string; basePrice: number }[]
  });

  const addVehicleOption = () => {
    setFormData({
      ...formData,
      vehicleOptions: [...formData.vehicleOptions, { vehicleId: '', basePrice: 0 }]
    });
  };

  const updateVehicleOption = (index: number, key: string, value: any) => {
    const updated = [...formData.vehicleOptions];
    updated[index] = { ...updated[index], [key]: value };
    setFormData({ ...formData, vehicleOptions: updated });
  };

  const removeVehicleOption = (index: number) => {
    setFormData({
      ...formData,
      vehicleOptions: formData.vehicleOptions.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.citySlug) return setError("Please select a city");
    if (formData.vehicleOptions.length === 0) return setError("Add at least one vehicle price");

    setLoading(true);
    const result = await createExplorePackage(formData);
    
    if (result.success) {
      router.push('/admin/packages/explore-saudi');
      router.refresh();
    } else {
      setError(result.error || "Failed to create package");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/packages/explore-saudi" className="p-2 hover:bg-white/5 rounded-full text-gray-400">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-white">New Explore Package</h1>
        </div>
        <button onClick={handleSubmit} disabled={loading} className="flex items-center gap-2 bg-[#F9C344] text-black px-6 py-2 rounded-lg font-bold hover:bg-white transition-all disabled:opacity-50">
          {loading ? "Saving..." : <><Save size={18} /> Save Package</>}
        </button>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg text-sm">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Basic Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#151515] p-6 rounded-xl border border-white/5 space-y-4">
            <h3 className="text-[#F9C344] font-bold flex items-center gap-2 mb-4"><Package size={18}/> Package Details</h3>
            
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2 text-[10px]">Target City</label>
              <select 
                required
                className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-[#F9C344] outline-none"
                value={formData.citySlug}
                onChange={(e) => setFormData({...formData, citySlug: e.target.value})}
              >
                <option value="">Select a City</option>
                {cities.map(city => <option key={city.id} value={city.slug}>{city.name}</option>)}
              </select>
            </div>

            <input 
              type="text" placeholder="Package Title"
              className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-[#F9C344] outline-none"
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
            
            <textarea 
              placeholder="Package Description"
              className="w-full bg-black border border-white/10 rounded-lg p-3 text-white h-32 focus:border-[#F9C344] outline-none"
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />

            <div className="flex items-center gap-4">
              <div className="flex-grow">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 text-[10px]">Duration (Days)</label>
                <div className="relative">
                  <Clock size={16} className="absolute left-3 top-3.5 text-gray-500" />
                  <input 
                    type="number" min="1"
                    className="w-full bg-black border border-white/10 rounded-lg p-3 pl-10 text-white focus:border-[#F9C344] outline-none"
                    value={formData.durationDays}
                    onChange={(e) => setFormData({...formData, durationDays: parseInt(e.target.value)})}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Pricing Sidebar */}
        <div className="space-y-6">
          <div className="bg-[#151515] p-6 rounded-xl border border-white/5">
            <h3 className="text-[#F9C344] font-bold flex items-center gap-2 mb-6"><DollarSign size={18}/> Vehicle Pricing</h3>
            <div className="space-y-4">
              {formData.vehicleOptions.map((opt, idx) => (
                <div key={idx} className="p-4 bg-black rounded-lg border border-white/5 space-y-3 relative">
                  <button onClick={() => removeVehicleOption(idx)} className="absolute top-2 right-2 text-gray-600 hover:text-red-500"><Trash2 size={14}/></button>
                  <select 
                    className="w-full bg-[#151515] border border-white/10 rounded p-2 text-xs text-white"
                    value={opt.vehicleId}
                    onChange={(e) => updateVehicleOption(idx, 'vehicleId', e.target.value)}
                  >
                    <option value="">Select Vehicle</option>
                    {vehicles.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
                  <div className="relative">
                    <span className="absolute left-2 top-2 text-gray-500 text-xs">$</span>
                    <input 
                      type="number" placeholder="Price"
                      className="w-full bg-[#151515] border border-white/10 rounded p-2 pl-5 text-xs text-white outline-none"
                      onChange={(e) => updateVehicleOption(idx, 'basePrice', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              ))}
              <button 
                type="button" onClick={addVehicleOption}
                className="w-full py-3 border border-dashed border-white/20 rounded-lg text-gray-500 text-xs hover:border-[#F9C344] hover:text-[#F9C344] transition-all"
              >
                + Add Vehicle Price
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}