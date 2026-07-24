'use server'

import { db } from '@/lib/db'
import { ziyaratLandmarks } from '@/lib/db/schema/ziyarat'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function createZiyaratLocation(formData: FormData) {
  try {
    const images = JSON.parse(formData.get('images') as string || '[]')

    await db.insert(ziyaratLandmarks).values({
      name: formData.get('name') as string,
      urduTitle: formData.get('urduTitle') as string,
      slug: formData.get('slug') as string,
      city: formData.get('city') as string,
      
      bannerImage: formData.get('bannerImage') as string,
      images: images,
      videoUrl: formData.get('videoUrl') as string,
      
      shortDescription: formData.get('shortDescription') as string,
      fullHistory: formData.get('fullHistory') as string,
      
      location: formData.get('location') as string,
      timings: formData.get('timings') as string,
      googleMapLink: formData.get('googleMapLink') as string,
      
      updatedAt: new Date(),
    })

    revalidatePath('/admin/ziyarat')
    return { success: true }
  } catch (error) {
    console.error("Create Location Error:", error)
    throw new Error('Failed to create location')
  }
}
export async function updateZiyaratLocation(id: string, formData: FormData) {
  try {
    const images = JSON.parse(formData.get('images') as string || '[]')

    await db.update(ziyaratLandmarks).set({
      name: formData.get('name') as string,
      urduTitle: formData.get('urduTitle') as string,
      slug: formData.get('slug') as string,
      city: formData.get('city') as string,
      
      bannerImage: formData.get('bannerImage') as string,
      images: images,
      videoUrl: formData.get('videoUrl') as string,
      
      shortDescription: formData.get('shortDescription') as string,
      fullHistory: formData.get('fullHistory') as string,
      
      location: formData.get('location') as string,
      timings: formData.get('timings') as string,
      googleMapLink: formData.get('googleMapLink') as string,
      
      updatedAt: new Date(),
    })
    .where(eq(ziyaratLandmarks.id, id))

    revalidatePath('/admin/ziyarat')
    return { success: true }
  } catch (error) {
    console.error("Update Location Error:", error)
    throw new Error('Failed to update location')
  }
}
export async function deleteZiyaratLocation(id: string) {
  try {
    await db.delete(ziyaratLandmarks).where(eq(ziyaratLandmarks.id, id))
    revalidatePath('/admin/ziyarat')
    return { success: true }
  } catch (error) {
    throw new Error('Failed to delete location')
  }
}