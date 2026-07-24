'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Video, Cloud, Car, Camera, Plus, Trash2, ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { createAdminCity } from '@/app/actions/adminCityActions';

export default function CreateCityPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State matching the cities schema
  const [formData, setFormData] = useState({
    name: '',
    heroTitle: '',
    heroSubtitle: '',
    heroVideo: '',
    aboutTitle: '',
    aboutText: '',
    weather: { spring: '', summer: '', autumn: '', winter: '' },
    bestTime: [{ title: '', months: '', icon: 'cloud-rain' }],
    transportation: [{ title: '', icon: 'car' }],
    thingsToDo: [{ title: '', image: '' }]
  });

  // Handler for nested JSON arrays (Things To Do, Transport, etc.)
  const updateArrayField = (field: 'bestTime' | 'transportation' | 'thingsToDo', index: number, key: string, value: string) => {
    const updatedArray = [...formData[field]];
    updatedArray[index] = { ...updatedArray[index], [key]: value };
    setFormData({ ...formData, [field]: updatedArray });
  };

  const addArrayItem = (field: 'bestTime' | 'transportation' | 'thingsToDo', newItem: any) => {
    setFormData({ ...formData, [field]: [...formData[field], newItem] });
  };

  const removeArrayItem = (field: 'bestTime' | 'transportation' | 'thingsToDo', index: number) => {
    const updatedArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: updatedArray });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await createAdminCity(formData);
    
    if (result.success) {
      router.push('/admin/cities');
      router.refresh();
    } else {
      setError(result.error || "An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/cities" className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-white">Create New City</h1>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center gap-2 bg-[#F9C344] text-black px-6 py-2 rounded-lg font-bold hover:bg-white transition-all disabled:opacity-50"
        >
          {loading ? "Saving..." : <><Save size={18} /> Save City</>}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Basic Info & Hero Section */}
        <div className="space-y-6 bg-[#151515] p-6 rounded-xl border border-white/5">
          <h3 className="text-[#F9C344] font-bold flex items-center gap-2 border-b border-white/5 pb-3">
            <MapPin size={18} /> Basic Identity & Hero
          </h3>
          
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">City Name</label>
            <input 
              type="text" 
              required
              className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-[#F9C344] outline-none transition-all"
              placeholder="e.g. Jeddah"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Hero Video URL</label>
            <input 
              type="text" 
              className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-[#F9C344] outline-none transition-all"
              placeholder="Link to .mp4 file"
              value={formData.heroVideo}
              onChange={(e) => setFormData({...formData, heroVideo: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 pt-2">
            <input 
              type="text" 
              placeholder="Hero Title"
              className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-[#F9C344] outline-none"
              value={formData.heroTitle}
              onChange={(e) => setFormData({...formData, heroTitle: e.target.value})}
            />
            <textarea 
              placeholder="Hero Subtitle"
              className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-[#F9C344] outline-none h-24"
              value={formData.heroSubtitle}
              onChange={(e) => setFormData({...formData, heroSubtitle: e.target.value})}
            />
          </div>
        </div>

        {/* About Section */}
        <div className="space-y-6 bg-[#151515] p-6 rounded-xl border border-white/5">
          <h3 className="text-[#F9C344] font-bold flex items-center gap-2 border-b border-white/5 pb-3">
            <Camera size={18} /> About Content
          </h3>
          <input 
            type="text" 
            placeholder="About Title (e.g. History of Jeddah)"
            className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-[#F9C344] outline-none"
            value={formData.aboutTitle}
            onChange={(e) => setFormData({...formData, aboutTitle: e.target.value})}
          />
          <textarea 
            placeholder="Main About Text"
            className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-[#F9C344] outline-none h-48"
            value={formData.aboutText}
            onChange={(e) => setFormData({...formData, aboutText: e.target.value})}
          />
        </div>

        {/* Weather JSON */}
        <div className="space-y-6 bg-[#151515] p-6 rounded-xl border border-white/5">
          <h3 className="text-[#F9C344] font-bold flex items-center gap-2 border-b border-white/5 pb-3">
            <Cloud size={18} /> Average Weather
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {['spring', 'summer', 'autumn', 'winter'].map((season) => (
              <div key={season}>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">{season}</label>
                <input 
                  type="text" 
                  placeholder="e.g. 25°C - 35°C"
                  className="w-full bg-black border border-white/10 rounded-lg p-2 text-white text-sm outline-none"
                  value={(formData.weather as any)[season]}
                  onChange={(e) => setFormData({
                    ...formData, 
                    weather: { ...formData.weather, [season]: e.target.value }
                  })}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Transportation JSON */}
        <div className="space-y-6 bg-[#151515] p-6 rounded-xl border border-white/5">
          <h3 className="text-[#F9C344] font-bold flex items-center gap-2 border-b border-white/5 pb-3">
            <Car size={18} /> Transportation
          </h3>
          {formData.transportation.map((item, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input 
                type="text" 
                placeholder="Method Name"
                className="flex-grow bg-black border border-white/10 rounded-lg p-2 text-white text-sm outline-none"
                value={item.title}
                onChange={(e) => updateArrayField('transportation', idx, 'title', e.target.value)}
              />
              <button onClick={() => removeArrayItem('transportation', idx)} className="text-red-500 p-2 hover:bg-red-500/10 rounded"><Trash2 size={16}/></button>
            </div>
          ))}
          <button 
            type="button"
            onClick={() => addArrayItem('transportation', { title: '', icon: 'car' })}
            className="w-full py-2 border border-dashed border-white/20 rounded-lg text-gray-500 text-xs hover:border-[#F9C344] hover:text-[#F9C344] transition-all"
          >
            + Add Transport Method
          </button>
        </div>

        {/* Things To Do (Full Width) */}
        <div className="md:col-span-2 space-y-6 bg-[#151515] p-6 rounded-xl border border-white/5">
          <h3 className="text-[#F9C344] font-bold flex items-center gap-2 border-b border-white/5 pb-3">
            <Plus size={18} /> Things To Do / Attractions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.thingsToDo.map((item, idx) => (
              <div key={idx} className="bg-black/50 p-4 rounded-lg border border-white/5 space-y-3">
                <input 
                  type="text" 
                  placeholder="Attraction Name"
                  className="w-full bg-black border border-white/10 rounded-lg p-2 text-white text-sm outline-none"
                  value={item.title}
                  onChange={(e) => updateArrayField('thingsToDo', idx, 'title', e.target.value)}
                />
                <input 
                  type="text" 
                  placeholder="Image URL"
                  className="w-full bg-black border border-white/10 rounded-lg p-2 text-white text-sm outline-none"
                  value={item.image}
                  onChange={(e) => updateArrayField('thingsToDo', idx, 'image', e.target.value)}
                />
                <button onClick={() => removeArrayItem('thingsToDo', idx)} className="text-red-500 text-xs flex items-center gap-1 hover:underline"><Trash2 size={12}/> Remove Attraction</button>
              </div>
            ))}
          </div>
          <button 
            type="button"
            onClick={() => addArrayItem('thingsToDo', { title: '', image: '' })}
            className="w-full py-3 border border-dashed border-white/20 rounded-lg text-gray-500 text-sm hover:border-[#F9C344] hover:text-[#F9C344] transition-all"
          >
            + Add New Attraction
          </button>
        </div>

      </form>
    </div>
  );
}