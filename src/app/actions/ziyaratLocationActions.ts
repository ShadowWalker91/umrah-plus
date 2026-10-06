'use server'

import { db } from '@/lib/db'
import { ziyaratLandmarks } from '@/lib/db/schema/ziyarat'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { assertAdmin, requireMember, AUTH_MESSAGES } from '@/lib/auth/guards'
import { errorMessage } from '@/lib/auth/messages'
import { mediaChanged, mediaListChanged } from '@/lib/auth/imagePolicy'

export async function createZiyaratLocation(formData: FormData) {
  try {
    await assertAdmin(AUTH_MESSAGES.createAdminOnly)
    const images = JSON.parse((formData.get('images') as string) || '[]')

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
    console.error('Create Location Error:', error)
    return { success: false, error: errorMessage(error, 'Failed to create location') }
  }
}

export async function updateZiyaratLocation(id: string, formData: FormData) {
  try {
    const guard = await requireMember()
    if (!guard.ok) return { success: false, error: guard.error }

    const images = JSON.parse((formData.get('images') as string) || '[]')
    const bannerImage = (formData.get('bannerImage') as string) || ''

    // Editors may edit the text fields, but images are admin-only.
    if (guard.user.role !== 'admin') {
      const [existing] = await db
        .select({
          images: ziyaratLandmarks.images,
          bannerImage: ziyaratLandmarks.bannerImage,
        })
        .from(ziyaratLandmarks)
        .where(eq(ziyaratLandmarks.id, id))
        .limit(1)

      if (!existing) return { success: false, error: 'Location not found.' }

      if (
        mediaListChanged(existing.images, images) ||
        mediaChanged(existing.bannerImage, bannerImage)
      ) {
        return { success: false, error: AUTH_MESSAGES.imageAdminOnly }
      }
    }

    await db
      .update(ziyaratLandmarks)
      .set({
        name: formData.get('name') as string,
        urduTitle: formData.get('urduTitle') as string,
        slug: formData.get('slug') as string,
        city: formData.get('city') as string,

        bannerImage: bannerImage,
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
    console.error('Update Location Error:', error)
    return { success: false, error: errorMessage(error, 'Failed to update location') }
  }
}

export async function deleteZiyaratLocation(id: string) {
  try {
    await assertAdmin(AUTH_MESSAGES.deleteAdminOnly)
    await db.delete(ziyaratLandmarks).where(eq(ziyaratLandmarks.id, id))
    revalidatePath('/admin/ziyarat')
    return { success: true }
  } catch (error) {
    console.error('Delete Location Error:', error)
    return { success: false, error: errorMessage(error, 'Failed to delete location') }
  }
}
