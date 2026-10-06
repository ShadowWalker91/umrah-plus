'use server'

import { db } from '@/lib/db'
import { packages } from '@/lib/db/schema/packages'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { assertAdmin, requireMember, AUTH_MESSAGES } from '@/lib/auth/guards'
import { errorMessage } from '@/lib/auth/messages'
import { mediaListChanged } from '@/lib/auth/imagePolicy'

type MediaSource = {
  image?: string | null
  bannerImage?: string | null
  itinerary?: unknown
  pricing?: unknown
}

/**
 * Every image carried by a package: grid thumbnail, page banner,
 * itinerary location photos and vehicle photos.
 */
function collectPackageMedia(source: MediaSource): string[] {
  const media: string[] = []
  if (typeof source.image === 'string' && source.image) media.push(source.image)
  if (typeof source.bannerImage === 'string' && source.bannerImage) media.push(source.bannerImage)

  if (Array.isArray(source.itinerary)) {
    for (const item of source.itinerary as { images?: unknown }[]) {
      if (Array.isArray(item?.images)) {
        media.push(...(item.images as unknown[]).filter((v): v is string => typeof v === 'string' && !!v))
      }
    }
  }

  if (Array.isArray(source.pricing)) {
    for (const vehicle of source.pricing as { image?: unknown }[]) {
      if (typeof vehicle?.image === 'string' && vehicle.image) media.push(vehicle.image)
    }
  }

  return media
}

export async function createPackage(formData: FormData) {
  try {
    await assertAdmin(AUTH_MESSAGES.createAdminOnly)

    const title = formData.get('title') as string
    const slug = formData.get('slug') as string
    const category = formData.get('category') as string

    const highlights = JSON.parse((formData.get('highlights') as string) || '[]')
    const inclusions = JSON.parse((formData.get('inclusions') as string) || '[]')
    const exclusions = JSON.parse((formData.get('exclusions') as string) || '[]')
    const itinerary = JSON.parse((formData.get('itinerary') as string) || '[]')
    const pricing = JSON.parse((formData.get('pricing') as string) || '[]')

    await db.insert(packages).values({
      title,
      slug,
      type: category,
      description: formData.get('description') as string,
      city: formData.get('city') as string,
      duration: formData.get('duration') as string,
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

    revalidatePath('/admin/packages/ziyarat')
    return { success: true }
  } catch (error) {
    console.error('CREATE PACKAGE ERROR:', error)
    return { success: false, error: errorMessage(error, 'Failed to create package.') }
  }
}

export async function updatePackage(id: string, formData: FormData) {
  try {
    const guard = await requireMember()
    if (!guard.ok) return { success: false, error: guard.error }

    const highlights = JSON.parse((formData.get('highlights') as string) || '[]')
    const inclusions = JSON.parse((formData.get('inclusions') as string) || '[]')
    const exclusions = JSON.parse((formData.get('exclusions') as string) || '[]')
    const itinerary = JSON.parse((formData.get('itinerary') as string) || '[]')
    const pricing = JSON.parse((formData.get('pricing') as string) || '[]')

    // Editors may edit package content, but images are admin-only.
    if (guard.user.role !== 'admin') {
      const [existing] = await db
        .select({
          image: packages.image,
          bannerImage: packages.bannerImage,
          itinerary: packages.itinerary,
          pricing: packages.pricing,
        })
        .from(packages)
        .where(eq(packages.id, id))
        .limit(1)

      if (!existing) return { success: false, error: 'Package not found.' }

      const mediaChanged = mediaListChanged(
        collectPackageMedia(existing),
        collectPackageMedia({
          image: formData.get('imageUrl') as string,
          bannerImage: formData.get('bannerImage') as string,
          itinerary,
          pricing,
        }),
      )

      if (mediaChanged) return { success: false, error: AUTH_MESSAGES.imageAdminOnly }
    }

    await db
      .update(packages)
      .set({
        title: formData.get('title') as string,
        slug: formData.get('slug') as string,
        description: formData.get('description') as string,
        city: formData.get('city') as string,
        duration: formData.get('duration') as string,
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

    revalidatePath('/admin/packages/ziyarat')
    return { success: true }
  } catch (error) {
    console.error('UPDATE PACKAGE ERROR:', error)
    return { success: false, error: errorMessage(error, 'Failed to update package.') }
  }
}

export async function deletePackage(id: string) {
  try {
    await assertAdmin(AUTH_MESSAGES.deleteAdminOnly)
    await db.delete(packages).where(eq(packages.id, id))
    revalidatePath('/admin/packages/ziyarat')
    return { success: true }
  } catch (error) {
    console.error('DELETE PACKAGE ERROR:', error)
    return { success: false, error: errorMessage(error, 'Failed to delete package.') }
  }
}
