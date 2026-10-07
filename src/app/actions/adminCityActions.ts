'use server';

import { db } from '@/lib/db/';
import { cities } from '@/lib/db/schema/cities';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { requireAdmin, requireMember, AUTH_MESSAGES } from '@/lib/auth/guards';
import { mediaListChanged } from '@/lib/auth/imagePolicy';

type CityMediaSource = { thingsToDo?: unknown };

/** Images carried by a city: the things-to-do photo per entry. */
function collectCityMedia(source: CityMediaSource): string[] {
  if (!Array.isArray(source.thingsToDo)) return [];
  return (source.thingsToDo as { image?: unknown }[])
    .map((item) => item?.image)
    .filter((value): value is string => typeof value === 'string' && !!value);
}


// 1. Fetch all cities for the data table
export async function getAdminCities() {
  try {
    const allCities = await db.query.cities.findMany({
      orderBy: (cities, { desc }) => [desc(cities.createdAt)],
    });
    return { success: true, data: allCities };
  } catch (error) {
    console.error("Error fetching cities:", error);
    return { success: false, data: [], error: "Failed to load cities" };
  }
}

// 2. Fetch a single city (used later for the Edit Form)
export async function getAdminCityById(id: string) {
  try {
    const city = await db.query.cities.findFirst({
      where: eq(cities.id, id),
    });
    return { success: true, data: city };
  } catch (error) {
    console.error("Error fetching city:", error);
    return { success: false, error: "Failed to load city details" };
  }
}

// 3. Create a new city
export async function createAdminCity(formData: any) {
  try {
    const guard = await requireAdmin(AUTH_MESSAGES.createAdminOnly);
    if (!guard.ok) return { success: false, error: guard.error };

    // Generate a clean slug from the name (e.g., "Al Ula" -> "al-ula")
    const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    await db.insert(cities).values({
      ...formData,
      slug,
    });

    // Tell Next.js to refresh the dashboard cache so the new city appears instantly
    revalidatePath('/admin/cities');
    return { success: true, message: "City created successfully!" };
  } catch (error) {
    console.error("Error creating city:", error);
    return { success: false, error: "Failed to create city. The slug might already exist." };
  }
}

// 4. Update an existing city
export async function updateAdminCity(formData: any) {
  try {
    const guard = await requireMember();
    if (!guard.ok) return { success: false, error: guard.error };

    const { id, ...data } = formData;

    // Editors may edit city content, but images are admin-only.
    if (guard.user.role !== 'admin') {
      const [existing] = await db
        .select({ thingsToDo: cities.thingsToDo })
        .from(cities)
        .where(eq(cities.id, id))
        .limit(1);

      if (!existing) return { success: false, error: 'City not found.' };

      if (mediaListChanged(collectCityMedia(existing), collectCityMedia(data))) {
        return { success: false, error: AUTH_MESSAGES.imageAdminOnly };
      }
    }

    // Regenerate slug in case the name changed
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    await db.update(cities)
      .set({ 
        ...data, 
        slug, 
        updatedAt: new Date() 
      })
      .where(eq(cities.id, id));

    // Revalidate the admin list and the specific public city page
    revalidatePath('/admin/cities');
    revalidatePath(`/explore/${slug}`);
    
    return { success: true, message: "City updated successfully!" };
  } catch (error) {
    console.error("Update error:", error);
    return { success: false, error: "Failed to update city." };
  }
}

// 5. Delete a city
export async function deleteAdminCity(id: string) {
  try {
    const guard = await requireAdmin(AUTH_MESSAGES.deleteAdminOnly);
    if (!guard.ok) return { success: false, error: guard.error };

    await db.delete(cities).where(eq(cities.id, id));
    revalidatePath('/admin/cities');
    return { success: true, message: "City deleted successfully!" };
  } catch (error) {
    console.error("Error deleting city:", error);
    return { success: false, error: "Failed to delete city." };
  }
}