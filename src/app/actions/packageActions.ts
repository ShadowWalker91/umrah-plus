'use server'

import { db } from '@/lib/db'
import { packages } from '@/lib/db/schema/packages' 
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { assertAdmin, assertMember } from '@/lib/auth/guards'

export async function createPackage(formData: FormData) {
  try {
    await assertAdmin()
    console.log("👉 STARTING CREATE PACKAGE...");

    const title = formData.get('title') as string
    const slug = formData.get('slug') as string
    const category = formData.get('category') as string
    
    const highlights = JSON.parse(formData.get('highlights') as string || '[]')
    const inclusions = JSON.parse(formData.get('inclusions') as string || '[]')
    const exclusions = JSON.parse(formData.get('exclusions') as string || '[]')
    const itinerary = JSON.parse(formData.get('itinerary') as string || '[]')
    const pricing = JSON.parse(formData.get('pricing') as string || '[]')

    console.log("👉 Data Parsed Successfully. Inserting...");

    await db.insert(packages).values({
      title,
      slug,
      type: category, 
      description: formData.get('description') as string,
      city: formData.get('city') as string,
      duration: formData.get('duration') as string,
      // FIX: Ensure this is a string to match Drizzle schema, with a string fallback
      priceStarting: String(formData.get('priceStarting') || '0'),
      
      image: formData.get('imageUrl') as string,
      bannerImage: formData.get('bannerImage') as string,
      
      pdfUpload: formData.get('pdfUpload') as string,
      whatsappNumber: formData.get('whatsappNumber') as string,

      itinerary,
      pricing,
      highlights,
      inclusions,
      exclusions,
      
      updatedAt: new Date(),
    })

    console.log("👉 INSERT SUCCESS!");
    revalidatePath('/admin/packages/ziyarat')
    return { success: true }
    
  } catch (error) {
    console.error("❌ CREATE ERROR DETAILS:", error);
    throw error;
  }
}

export async function updatePackage(id: string, formData: FormData) {
  try {
    await assertMember()
    console.log(`👉 STARTING UPDATE PACKAGE (ID: ${id})...`);

    const highlights = JSON.parse(formData.get('highlights') as string || '[]')
    const inclusions = JSON.parse(formData.get('inclusions') as string || '[]')
    const exclusions = JSON.parse(formData.get('exclusions') as string || '[]')
    const itinerary = JSON.parse(formData.get('itinerary') as string || '[]')
    const pricing = JSON.parse(formData.get('pricing') as string || '[]')

    await db.update(packages)
      .set({
        title: formData.get('title') as string,
        slug: formData.get('slug') as string,
        description: formData.get('description') as string,
        city: formData.get('city') as string,
        duration: formData.get('duration') as string,
        // FIX: Ensure this is a string, not Number(), to match schema expectations
        priceStarting: String(formData.get('priceStarting') || '0'),
        
        image: formData.get('imageUrl') as string,
        bannerImage: formData.get('bannerImage') as string,

        pdfUpload: formData.get('pdfUpload') as string,
        whatsappNumber: formData.get('whatsappNumber') as string,

        itinerary,
        pricing,
        highlights,
        inclusions,
        exclusions,
        
        updatedAt: new Date(),
      })
      .where(eq(packages.id, id))

    console.log("👉 UPDATE SUCCESS!"); 
    revalidatePath('/admin/packages/ziyarat')
    return { success: true }

  } catch (error) {
    console.error("❌ UPDATE ERROR DETAILS:", error);
    throw error;
  }
}

export async function deletePackage(id: string) {
  try {
    await assertAdmin()
    await db.delete(packages).where(eq(packages.id, id))
    revalidatePath('/admin/packages/ziyarat')
    return { success: true }
  } catch (error) {
    console.error("DELETE ERROR:", error);
    throw new Error('Failed to delete package')
  }
}