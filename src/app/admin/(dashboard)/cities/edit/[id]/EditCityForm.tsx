'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Video, Cloud, Car, Camera, Plus, Trash2, ArrowLeft, Save, RefreshCw } from 'lucide-react';
import Link from 'next/link';
// We will create this update action in a moment
import { updateAdminCity } from '@/app/actions/adminCityActions';
import { useToast } from '@/components/admin/ToastProvider';

export default function EditCityForm({ initialData }: { initialData: any }) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize state with existing database data
  const [formData, setFormData] = useState({
    id: initialData.id,
    name: initialData.name,
    heroTitle: initialData.heroTitle,
    heroSubtitle: initialData.heroSubtitle,
    heroVideo: initialData.heroVideo || '',
    aboutTitle: initialData.aboutTitle,
    aboutText: initialData.aboutText,
    weather: initialData.weather || { spring: '', summer: '', autumn: '', winter: '' },
    bestTime: initialData.bestTime || [],
    transportation: initialData.transportation || [],
    thingsToDo: initialData.thingsToDo || []
  });

  const updateArrayField = (field: 'bestTime' | 'transportation' | 'thingsToDo', index: number, key: string, value: string) => {
    const updatedArray = [...formData[field]];
    updatedArray[index] = { ...updatedArray[index], [key]: value };
    setFormData({ ...formData, [field]: updatedArray });
  };

  const addArrayItem = (field: 'bestTime' | 'transportation' | 'thingsToDo', newItem: any) => {
    setFormData({ ...formData, [field]: [...formData[field], newItem] });
  };

  const removeArrayItem = (field: 'bestTime' | 'transportation' | 'thingsToDo', index: number) => {
    const updatedArray = formData[field].filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, [field]: updatedArray });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await updateAdminCity(formData);
    
    if (result.success) {
      toast('City updated successfully!', 'success');
      router.push('/admin/cities');
      router.refresh();
    } else {
      const message = result.error || "Failed to update city";
      setError(message);
      toast(message, 'error');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/cities" className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-white">Edit {initialData.name}</h1>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center gap-2 bg-[#F9C344] text-black px-6 py-2 rounded-lg font-bold hover:bg-white transition-all disabled:opacity-50"
        >
          {loading ? <RefreshCw className="animate-spin" size={18} /> : <><Save size={18} /> Update Changes</>}
        </button>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg text-sm">{error}</div>}

      <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Basic Identity */}
        <div className="space-y-6 bg-[#151515] p-6 rounded-xl border border-white/5">
          <h3 className="text-[#F9C344] font-bold border-b border-white/5 pb-3 flex items-center gap-2"><MapPin size={18}/> Identity</h3>
          <input 
            type="text" 
            className="w-full bg-black border border-white/10 rounded-lg p-3 text-white"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <input 
            type="text" 
            placeholder="Hero Video URL"
            className="w-full bg-black border border-white/10 rounded-lg p-3 text-white"
            value={formData.heroVideo}
            onChange={(e) => setFormData({...formData, heroVideo: e.target.value})}
          />
        </div>

        {/* About Section */}
        <div className="space-y-6 bg-[#151515] p-6 rounded-xl border border-white/5">
          <h3 className="text-[#F9C344] font-bold border-b border-white/5 pb-3 flex items-center gap-2"><Camera size={18}/> About Content</h3>
          <input 
            type="text" 
            className="w-full bg-black border border-white/10 rounded-lg p-3 text-white"
            value={formData.aboutTitle}
            onChange={(e) => setFormData({...formData, aboutTitle: e.target.value})}
          />
          <textarea 
            className="w-full bg-black border border-white/10 rounded-lg p-3 text-white h-32"
            value={formData.aboutText}
            onChange={(e) => setFormData({...formData, aboutText: e.target.value})}
          />
        </div>

        {/* Weather */}
        <div className="space-y-6 bg-[#151515] p-6 rounded-xl border border-white/5">
          <h3 className="text-[#F9C344] font-bold border-b border-white/5 pb-3 flex items-center gap-2"><Cloud size={18}/> Weather</h3>
          <div className="grid grid-cols-2 gap-4">
            {['spring', 'summer', 'autumn', 'winter'].map((season) => (
              <div key={season}>
                <label className="text-[10px] uppercase text-gray-500 font-bold">{season}</label>
                <input 
                  type="text" 
                  className="w-full bg-black border border-white/10 rounded-lg p-2 text-white"
                  value={(formData.weather as any)[season]}
                  onChange={(e) => setFormData({...formData, weather: {...formData.weather, [season]: e.target.value}})}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Transport */}
        <div className="space-y-6 bg-[#151515] p-6 rounded-xl border border-white/5">
          <h3 className="text-[#F9C344] font-bold border-b border-white/5 pb-3 flex items-center gap-2"><Car size={18}/> Transport</h3>
          {formData.transportation.map((item: any, idx: number) => (
            <div key={idx} className="flex gap-2">
              <input 
                className="flex-grow bg-black border border-white/10 rounded-lg p-2 text-white text-sm"
                value={item.title}
                onChange={(e) => updateArrayField('transportation', idx, 'title', e.target.value)}
              />
              <button onClick={() => removeArrayItem('transportation', idx)} className="text-red-500 p-2"><Trash2 size={16}/></button>
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem('transportation', {title: '', icon: 'car'})} className="text-xs text-gray-500">+ Add Method</button>
        </div>
      </form>
    </div>
  );
}