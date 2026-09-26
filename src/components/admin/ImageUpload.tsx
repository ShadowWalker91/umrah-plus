'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ImagePlus, Trash, X } from 'lucide-react'

interface LocalImageUploadProps {
  onChange: (value: string | string[]) => void
  value: string | string[]
  label?: string
  multiple?: boolean
}

export default function LocalImageUpload({
  onChange,
  value,
  label = "Upload Image",
  multiple = false
}: LocalImageUploadProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const base64String = event.target?.result as string
        
        if (multiple) {
          // If multiple, add to existing array
          const currentValues = Array.isArray(value) ? value : []
          onChange([...currentValues, base64String])
        } else {
          // If single, replace
          onChange(base64String)
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const handleRemove = (urlToRemove: string) => {
    if (multiple && Array.isArray(value)) {
      const newValues = value.filter((url) => url !== urlToRemove)
      onChange(newValues)
    } else {
      onChange('')
    }
  }

  // Ensure value is always an array for rendering
  const imagesToRender = Array.isArray(value) ? value : (value ? [value] : [])

  return (
    <div className="space-y-4 w-full">
      <label className="block text-xs font-bold text-gray-500 uppercase">{label}</label>
      
      {/* PREVIEW GRID */}
      {imagesToRender.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {imagesToRender.map((url, index) => (
            <div key={index} className="relative w-full h-[200px] rounded-xl overflow-hidden border border-gray-200 group bg-gray-100">
              <div className="z-10 absolute top-2 right-2">
                <button
                  type="button"
                  onClick={() => handleRemove(url)}
                  className="bg-red-500 text-white p-1 rounded-full shadow-sm hover:bg-red-600 transition"
                >
                  <Trash className="h-4 w-4" />
                </button>
              </div>
              <Image
                fill
                className="object-cover"
                alt="Upload"
                src={url}
              />
            </div>
          ))}
        </div>
      )}

      {/* FILE INPUT BUTTON */}
      <div className="relative flex items-center justify-center gap-2 w-full p-10 border-2 border-dashed border-gray-300 rounded-xl hover:bg-gray-50 transition text-gray-500 font-medium cursor-pointer">
        <input 
            type="file" 
            accept="image/*"
            multiple={multiple}
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center gap-2 pointer-events-none">
            <ImagePlus className="h-6 w-6 text-gray-400" />
            <span>{multiple ? 'Select Files (Local)' : 'Select File (Local)'}</span>
        </div>
      </div>
      <p className="text-xs text-gray-400 text-center">
        Note: Images are saved locally as text (Base64). Please use small images to avoid database lag.
      </p>
    </div>
  )
}