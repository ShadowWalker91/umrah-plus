'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createZiyaratLocation } from '@/app/actions/ziyaratLocationActions'
// ✅ CHANGE THIS IMPORT:
import LocalImageUpload from '@/components/admin/LocalImageUpload' 
import { Loader2, Save, ArrowLeft, MapPin, Clock, Video, Globe } from 'lucide-react'
import Link from 'next/link'

export default function NewZiyaratPage() {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  
  const [gallery, setGallery] = useState<string[]>([])
  const [banner, setBanner] = useState<string>('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSaving(true)

    const formData = new FormData(e.currentTarget)
    
    // Append rich media data
    formData.append('images', JSON.stringify(gallery))
    formData.append('bannerImage', banner)

    try {
      await createZiyaratLocation(formData)
      router.push('/admin/ziyarat')
    } catch (error) {
      console.error(error)
      alert("Failed to save location. Note: Large images might fail.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto pb-20 pt-8 px-4 font-sans text-gray-900">
      
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/ziyarat" className="p-2 bg-white rounded-full border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm">
           <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Add New Ziyarat Location</h1>
           <p className="text-sm text-gray-500">Create a historical site entry.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN */}
        <div className="xl:col-span-2 space-y-8">
           
           {/* CORE INFO */}
           <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-xl text-gray-800 mb-6 border-b pb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">English Name</label>
                    <input name="name" required placeholder="e.g. Dar Sayyeda Khadija" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F9C344]" />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Urdu Title</label>
                    <input name="urduTitle" placeholder="e.g. دار السيدة خديجة" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F9C344] text-right font-serif" />
                 </div>
              </div>
              <div>
                 <label className="block text-sm font-bold text-gray-700 mb-2">Short Description</label>
                 <textarea name="shortDescription" rows={3} placeholder="Brief summary..." className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F9C344]" />
              </div>
           </div>

           {/* HISTORY */}
           <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-xl text-gray-800 mb-6 border-b pb-4">Historical Significance</h3>
              <textarea name="fullHistory" rows={20} placeholder="<p>HTML Content...</p>" className="w-full p-4 bg-gray-900 text-gray-300 font-mono text-sm border border-gray-700 rounded-xl focus:outline-none focus:border-[#F9C344]" />
           </div>

           {/* GALLERY */}
           <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-xl text-gray-800 mb-6 border-b pb-4">Image Gallery</h3>
              
              {/* ✅ USING LOCAL UPLOADER */}
              <LocalImageUpload 
                  label="Upload Gallery Photos" 
                  value={gallery} 
                  onChange={(val) => setGallery(val as string[])} 
                  multiple={true} 
              />
           </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
           <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-fit sticky top-8 space-y-6">
              <h3 className="font-bold text-lg border-b pb-4 text-gray-900">Location Settings</h3>

              <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Slug</label>
                    <input name="slug" required placeholder="dar-sayyeda-khadija" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono focus:ring-1 focus:ring-[#F9C344] outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">City</label>
                    <select name="city" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none">
                        <option value="Makkah">Makkah</option>
                        <option value="Madinah">Madinah</option>
                        <option value="Taif">Taif</option>
                        <option value="Tabuk">Tabuk</option>
                    </select>
                 </div>
              </div>

              <div className="space-y-4 pt-2">
                 <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <MapPin size={18} className="text-gray-400" />
                    <input name="location" placeholder="Location" className="bg-transparent w-full text-sm outline-none" />
                 </div>
                 <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <Clock size={18} className="text-gray-400" />
                    <input name="timings" placeholder="Timings" className="bg-transparent w-full text-sm outline-none" />
                 </div>
                 <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <Globe size={18} className="text-gray-400" />
                    <input name="googleMapLink" placeholder="Google Maps Link" className="bg-transparent w-full text-sm outline-none" />
                 </div>
                 <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <Video size={18} className="text-gray-400" />
                    <input name="videoUrl" placeholder="Video URL" className="bg-transparent w-full text-sm outline-none" />
                 </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                 <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Banner Image</label>
                 
                 {/* ✅ USING LOCAL UPLOADER */}
                 <LocalImageUpload 
                    label="Upload Banner" 
                    value={banner} 
                    onChange={(val) => setBanner(val as string)} 
                    multiple={false} 
                 />
              </div>

              <button type="submit" disabled={isSaving} className="w-full bg-[#F9C344] hover:bg-[#e0b03d] text-black font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-2">
                {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                <span>Save Location</span>
              </button>
           </div>
        </div>
      </form>
    </div>
  )
}