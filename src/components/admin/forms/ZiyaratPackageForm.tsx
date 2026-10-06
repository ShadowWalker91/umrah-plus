'use client'

import { useState } from 'react'
import { createPackage, updatePackage, deletePackage } from '@/app/actions/packageActions'
import { Trash2, ArrowLeft, Save, Plus, ChevronDown, ChevronUp, MapPin, Car, Check, X, Star, FileText, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import ImageUpload from '@/components/admin/ImageUpload'
import ErrorBanner from '@/components/admin/ErrorBanner'
import { useToast } from '@/components/admin/ToastProvider'
import { useRouter } from 'next/navigation'
import { useRole } from '@/components/admin/RoleProvider'

export default function ZiyaratPackageForm({ pkg }: { pkg?: any }) {
  const isEditing = !!pkg;
  const router = useRouter()
  const { role } = useRole()
  const isAdmin = role === 'admin'
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // --- DATA STATE ---
  const [itinerary, setItinerary] = useState<any[]>(pkg?.itinerary || [])
  const [vehicles, setVehicles] = useState<any[]>(pkg?.pricing || [])
  const [highlights, setHighlights] = useState<string[]>(pkg?.highlights || []) 
  const [inclusions, setInclusions] = useState<string[]>(pkg?.inclusions || [])
  const [exclusions, setExclusions] = useState<string[]>(pkg?.exclusions || [])

  // Images & Files
  const [bannerImage, setBannerImage] = useState(pkg?.bannerImage || '')
  const [thumbnailImage, setThumbnailImage] = useState(pkg?.image || '')
  const [pdfUpload, setPdfUpload] = useState(pkg?.pdfUpload || '') // ✅ NEW
  const [whatsappNumber, setWhatsappNumber] = useState(pkg?.whatsappNumber || '') // ✅ NEW

  // Price (Controlled)
  const [price, setPrice] = useState(pkg?.priceStarting ? Number(pkg.priceStarting) / 100 : '')

  // --- ACCORDION TOGGLES ---
  const [isItinerarySectionOpen, setIsItinerarySectionOpen] = useState(true)
  const [isVehicleSectionOpen, setIsVehicleSectionOpen] = useState(true)
  const [openItineraryIndex, setOpenItineraryIndex] = useState<number | null>(null)
  const [openVehicleIndex, setOpenVehicleIndex] = useState<number | null>(null)

  // --- HELPER FUNCTIONS ---
  const addItem = (setter: any, item: any, openSetter: any, listLength: number, sectionSetter: any) => {
    setter((prev: any) => [...prev, item])
    openSetter(listLength) 
    sectionSetter(true) 
  }
  
  const removeItem = (setter: any, index: number) => setter((prev: any) => prev.filter((_: any, i: number) => i !== index))
  
  const updateItem = (setter: any, index: number, field: string, value: any, list: any[]) => {
    const newArr = [...list]
    newArr[index] = { ...newArr[index], [field]: value }
    setter(newArr)
  }

  const [tempHighlight, setTempHighlight] = useState('')
  const [tempInclusion, setTempInclusion] = useState('')
  const [tempExclusion, setTempExclusion] = useState('')

  const addSimpleItem = (value: string, setter: any, resetter: any) => {
    if (!value.trim()) return
    setter((prev: string[]) => [...prev, value])
    resetter('')
  }

  // --- SUBMIT HANDLER ---
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)

    formData.append('itinerary', JSON.stringify(itinerary))
    formData.append('pricing', JSON.stringify(vehicles))
    formData.append('highlights', JSON.stringify(highlights)) 
    formData.append('inclusions', JSON.stringify(inclusions))
    formData.append('exclusions', JSON.stringify(exclusions))

    formData.append('imageUrl', thumbnailImage)
    formData.append('bannerImage', bannerImage)
    formData.append('pdfUpload', pdfUpload) // ✅ NEW
    formData.append('whatsappNumber', whatsappNumber) // ✅ NEW
    formData.append('category', 'ZIYARAT') 
    
    const finalPrice = price ? Number(price) * 100 : 0
    formData.set('priceStarting', finalPrice.toString())

    try {
      const result = isEditing
        ? await updatePackage(pkg.id, formData)
        : await createPackage(formData)

      if (!result.success) {
        const message = result.error || 'Error saving package.'
        setError(message)
        toast(message, 'error')
        return
      }

      toast(isEditing ? 'Package updated successfully!' : 'Package created successfully!', 'success')
      router.push('/admin/packages/ziyarat')
      router.refresh()
    } catch (err) {
      console.error(err)
      const message = 'Error saving package.'
      setError(message)
      toast(message, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto pb-20 pt-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/packages/ziyarat" className="p-2 bg-white rounded-full border hover:bg-gray-50 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{isEditing ? 'Edit Ziyarat Package' : 'Create New Ziyarat'}</h1>
            <p className="text-sm text-gray-500">{isEditing ? `Editing: ${pkg.title}` : 'Add a new Ziyarat location bundle'}</p>
          </div>
        </div>
        
        {isEditing && isAdmin && (
          <button 
            type="button" 
            onClick={async () => {
               if(confirm('Are you sure you want to delete this package?')) {
                  const result = await deletePackage(pkg.id);
                  if (!result.success) {
                    const message = result.error || 'Failed to delete package.';
                    setError(message);
                    toast(message, 'error');
                    return;
                  }
                  toast('Package deleted.', 'success')
                  router.push('/admin/packages/ziyarat');
               }
            }} 
            className="text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 font-medium"
          >
             <Trash2 size={18} /> Delete Package
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6">
          <ErrorBanner message={error} onDismiss={() => setError(null)} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        <div className="xl:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-xl text-gray-800 mb-4">Description</h3>
                <textarea 
                  name="description"
                  defaultValue={pkg?.description || ''} 
                  rows={4}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F9C344]" 
                  placeholder="Enter the main overview of the package..."
                  required
                />
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                 <h3 className="font-bold text-xl text-gray-800 mb-2 flex items-center gap-2">
                    <Star size={20} className="text-[#F9C344] fill-[#F9C344]" />
                    Journey Highlights
                 </h3>
                 <p className="text-sm text-gray-400 mb-4">Add the key bullet points shown in the Journey Overview.</p>
                 <div className="flex gap-2 mb-4">
                    <input 
                        className="flex-1 p-3 border rounded-xl outline-none focus:border-[#F9C344]" 
                        placeholder="Add a highlight..."
                        value={tempHighlight}
                        onChange={(e) => setTempHighlight(e.target.value)}
                        onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); addSimpleItem(tempHighlight, setHighlights, setTempHighlight) }}}
                    />
                    <button type="button" onClick={() => addSimpleItem(tempHighlight, setHighlights, setTempHighlight)} className="bg-black text-white px-4 rounded-xl font-bold"><Plus size={20}/></button>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {highlights.map((item, i) => (
                        <div key={i} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <span className="text-sm font-medium">{item}</span>
                            <button type="button" onClick={() => removeItem(setHighlights, i)} className="text-gray-400 hover:text-red-500 ml-2"><X size={16}/></button>
                        </div>
                    ))}
                 </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 flex justify-between items-center cursor-pointer bg-white hover:bg-gray-50 transition-colors" onClick={() => setIsItinerarySectionOpen(!isItinerarySectionOpen)}>
                   <div className="flex items-center gap-3">
                       {isItinerarySectionOpen ? <ChevronUp className="text-gray-400"/> : <ChevronDown className="text-gray-400"/>}
                       <h3 className="font-bold text-xl text-gray-800">Itinerary Locations <span className="ml-2 text-sm bg-black text-white px-2 py-1 rounded-full">{itinerary.length}</span></h3>
                   </div>
                   <button type="button" onClick={(e) => { e.stopPropagation(); addItem(setItinerary, { title: '', descriptionEn: '', images: [] }, setOpenItineraryIndex, itinerary.length, setIsItinerarySectionOpen)}} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800"><Plus size={16} /> Add Location</button>
                </div>

                {isItinerarySectionOpen && (
                  <div className="p-6 pt-0 space-y-3 border-t border-gray-100 bg-gray-50/50">
                      {itinerary.map((item, i) => {
                          const isOpen = openItineraryIndex === i;
                          return (
                              <div key={i} className={`rounded-xl border transition-all ${isOpen ? 'border-[#F9C344] ring-1 ring-[#F9C344] bg-white shadow-md' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                                  <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => setOpenItineraryIndex(isOpen ? null : i)}>
                                      <div className="flex items-center gap-3">
                                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isOpen ? 'bg-[#F9C344] text-black' : 'bg-gray-200 text-gray-500'}`}>{i + 1}</div>
                                          <div>
                                              <h4 className={`font-bold text-sm ${!item.title && 'text-gray-400 italic'}`}>{item.title || 'New Location'}</h4>
                                          </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                          <button type="button" onClick={(e) => { e.stopPropagation(); removeItem(setItinerary, i); }} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"><Trash2 size={16} /></button>
                                          {isOpen ? <ChevronUp size={18} className="text-gray-400"/> : <ChevronDown size={18} className="text-gray-400"/>}
                                      </div>
                                  </div>
                                  {isOpen && (
                                      <div className="p-4 pt-0 border-t border-gray-100 mt-2">
                                          <div className="grid gap-4 mt-4">
                                              <div>
                                                  <label className="text-xs font-bold text-gray-500 uppercase">Location Name</label>
                                                  <input className="w-full p-3 border border-gray-200 rounded-xl mt-1 outline-none focus:border-[#F9C344]" placeholder="e.g. Masjid Quba" value={item.title} onChange={(e) => updateItem(setItinerary, i, 'title', e.target.value, itinerary)} />
                                              </div>
                                              <div>
                                                  <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                                                  <textarea className="w-full p-3 border border-gray-200 rounded-xl mt-1 outline-none focus:border-[#F9C344]" rows={3} placeholder="Short description..." value={item.descriptionEn} onChange={(e) => updateItem(setItinerary, i, 'descriptionEn', e.target.value, itinerary)} />
                                              </div>
                                              <div className="pt-2">
                                                  {/* ✅ FIXED: Removed onRemove and added array handling for url */}
                                                  <ImageUpload 
                                                    label="Location Image" 
                                                    value={item.images?.[0] || ''} 
                                                    onChange={(url) => updateItem(setItinerary, i, 'images', Array.isArray(url) ? url : [url], itinerary)} 
                                                  />
                                              </div>
                                          </div>
                                      </div>
                                  )}
                              </div>
                          )
                      })}
                  </div>
                )}
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 flex justify-between items-center cursor-pointer bg-white hover:bg-gray-50 transition-colors" onClick={() => setIsVehicleSectionOpen(!isVehicleSectionOpen)}>
                   <div className="flex items-center gap-3">
                       {isVehicleSectionOpen ? <ChevronUp className="text-gray-400"/> : <ChevronDown className="text-gray-400"/>}
                       <h3 className="font-bold text-xl text-gray-800">Vehicles <span className="ml-2 text-sm bg-black text-white px-2 py-1 rounded-full">{vehicles.length}</span></h3>
                   </div>
                   <button type="button" onClick={(e) => { e.stopPropagation(); addItem(setVehicles, { name: '', price: '', capacity: '' }, setOpenVehicleIndex, vehicles.length, setIsVehicleSectionOpen)}} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800"><Plus size={16} /> Add Vehicle</button>
                </div>
                 
                {isVehicleSectionOpen && (
                 <div className="p-6 pt-0 space-y-3 border-t border-gray-100 bg-gray-50/50">
                     {vehicles.map((v, i) => {
                        const isOpen = openVehicleIndex === i;
                        return (
                            <div key={i} className={`rounded-xl border transition-all ${isOpen ? 'border-[#F9C344] ring-1 ring-[#F9C344] bg-white shadow-md' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                                <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => setOpenVehicleIndex(isOpen ? null : i)}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isOpen ? 'bg-[#F9C344] text-black' : 'bg-gray-200 text-gray-500'}`}><Car size={14} /></div>
                                        <div>
                                            <h4 className={`font-bold text-sm ${!v.name && 'text-gray-400 italic'}`}>{v.name || 'New Vehicle'}</h4>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button type="button" onClick={(e) => { e.stopPropagation(); removeItem(setVehicles, i); }} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"><Trash2 size={16} /></button>
                                        {isOpen ? <ChevronUp size={18} className="text-gray-400"/> : <ChevronDown size={18} className="text-gray-400"/>}
                                    </div>
                                </div>
                                {isOpen && (
                                    <div className="p-4 pt-0 border-t border-gray-100 mt-2">
                                        <div className="grid gap-4 mt-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div><label className="text-xs font-bold text-gray-500 uppercase">Vehicle Name</label><input className="w-full p-3 border border-gray-200 rounded-xl mt-1 outline-none focus:border-[#F9C344]" placeholder="e.g. GMC Yukon" value={v.name} onChange={(e) => updateItem(setVehicles, i, 'name', e.target.value, vehicles)} /></div>
                                                <div><label className="text-xs font-bold text-gray-500 uppercase">Price</label><input className="w-full p-3 border border-gray-200 rounded-xl mt-1 text-black font-bold outline-none focus:border-[#F9C344]" placeholder="e.g. AED 400" value={v.price} onChange={(e) => updateItem(setVehicles, i, 'price', e.target.value, vehicles)} /></div>
                                            </div>
                                            <div><label className="text-xs font-bold text-gray-500 uppercase">Capacity</label><input className="w-full p-3 border border-gray-200 rounded-xl mt-1 outline-none focus:border-[#F9C344]" placeholder="e.g. 7 Seater" value={v.capacity} onChange={(e) => updateItem(setVehicles, i, 'capacity', e.target.value, vehicles)} /></div>
                                            <div className="pt-2"><ImageUpload label="Car Image" value={v.image || ''} onChange={(url) => updateItem(setVehicles, i, 'image', url, vehicles)} /></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                 </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                     <h3 className="font-bold text-xl text-gray-800 mb-4 flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><Check size={14}/></span>Inclusions</h3>
                     <div className="flex gap-2 mb-4">
                        <input className="flex-1 p-2 border rounded-lg text-sm" placeholder="Add inclusion..." value={tempInclusion} onChange={(e) => setTempInclusion(e.target.value)} onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); addSimpleItem(tempInclusion, setInclusions, setTempInclusion) }}} />
                        <button type="button" onClick={() => addSimpleItem(tempInclusion, setInclusions, setTempInclusion)} className="bg-black text-white px-3 rounded-lg"><Plus size={18}/></button>
                     </div>
                     <ul className="space-y-2">{inclusions.map((inc, i) => (<li key={i} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg text-sm"><span>{inc}</span><button type="button" onClick={() => removeItem(setInclusions, i)} className="text-gray-400 hover:text-red-500"><X size={14}/></button></li>))}</ul>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                     <h3 className="font-bold text-xl text-gray-800 mb-4 flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center"><X size={14}/></span>Exclusions</h3>
                     <div className="flex gap-2 mb-4">
                        <input className="flex-1 p-2 border rounded-lg text-sm" placeholder="Add exclusion..." value={tempExclusion} onChange={(e) => setTempExclusion(e.target.value)} onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); addSimpleItem(tempExclusion, setExclusions, setTempExclusion) }}} />
                        <button type="button" onClick={() => addSimpleItem(tempExclusion, setExclusions, setTempExclusion)} className="bg-black text-white px-3 rounded-lg"><Plus size={18}/></button>
                     </div>
                     <ul className="space-y-2">{exclusions.map((exc, i) => (<li key={i} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg text-sm"><span>{exc}</span><button type="button" onClick={() => removeItem(setExclusions, i)} className="text-gray-400 hover:text-red-500"><X size={14}/></button></li>))}</ul>
                </div>
            </div>
        </div>

        <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-fit sticky top-8 space-y-5">
                <h3 className="font-bold text-lg border-b pb-4">Package Settings</h3>
                
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Package Title</label>
                    <input name="title" defaultValue={pkg?.title || ''} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#F9C344] outline-none" required />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Slug (URL)</label>
                    <input name="slug" defaultValue={pkg?.slug || ''} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono focus:ring-1 focus:ring-[#F9C344] outline-none" required />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-bold text-gray-700 mb-2">City</label><input name="city" defaultValue={pkg?.city || 'Madinah'} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#F9C344] outline-none" /></div>
                    <div><label className="block text-sm font-bold text-gray-700 mb-2">Duration</label><input name="duration" defaultValue={pkg?.duration || '1 Day'} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#F9C344] outline-none" /></div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Starting Price (AED)</label>
                    <input value={price} onChange={(e) => { const val = e.target.value; if (/^\d*$/.test(val)) setPrice(val); }} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold focus:ring-1 focus:ring-[#F9C344] outline-none" placeholder="0" />
                    <p className="text-xs text-gray-400 mt-1">Enter raw number (e.g. 400)</p>
                </div>

                {/* ✅ NEW: BROCHURE & WHATSAPP SETTINGS */}
                <div className="pt-4 border-t space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                            <FileText size={16} className="text-blue-500" /> Package Brochure (PDF)
                        </label>
                        <ImageUpload label="Upload PDF Link" value={pdfUpload} onChange={setPdfUpload} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                            <MessageCircle size={16} className="text-green-500" /> WhatsApp Contact
                        </label>
                        <input 
                            value={whatsappNumber} 
                            onChange={(e) => setWhatsappNumber(e.target.value)} 
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#F9C344] outline-none" 
                            placeholder="+971 5X XXX XXXX"
                        />
                    </div>
                </div>

                <div className="pt-4 border-t space-y-4">
                    <ImageUpload label="Thumbnail Image (Grid)" value={thumbnailImage} onChange={setThumbnailImage} />
                    <ImageUpload label="Banner Image (Page Hero)" value={bannerImage} onChange={setBannerImage} />
                </div>

                <button 
                    disabled={isSubmitting} 
                    className="w-full bg-[#F9C344] hover:bg-[#e0b03d] text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 mt-4 shadow-lg shadow-[#F9C344]/20 transition-all"
                >
                    <Save size={20} />
                    {isSubmitting ? 'Saving...' : isEditing ? 'Update Package' : 'Create Package'}
                </button>
            </div>
        </div>

      </form>
    </div>
  )
}