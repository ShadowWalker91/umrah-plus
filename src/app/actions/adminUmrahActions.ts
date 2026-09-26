'use server';

import { db } from '@/lib/db/';
import { 
  umrahPackages, 
  umrahPackagePricing, 
  umrahPackageHotels, 
  umrahPackageVehicles, 
  umrahPackageZiyarat 
} from '@/lib/db/schema/umrahPackages';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

// 1. Fetch All Packages (Use this for both Umrah and Umrah Plus lists)
export async function getAdminUmrahPackages(type?: 'standard' | 'plus') {
  try {
    const data = await db.query.umrahPackages.findMany({
      where: type ? eq(umrahPackages.packageType, type) : undefined,
      with: {
        pricing: true,
        hotels: true,
        vehicles: {
          with: { vehicle: true } // Fetches the actual vehicle details from transport.ts
        },
        ziyarat: {
          with: { ziyaratPoint: true } // Fetches the actual ziyarat details from packages.ts
        }
      },
      orderBy: [desc(umrahPackages.createdAt)],
    });
    
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching Umrah packages:", error);
    return { success: false, data: [], error: "Failed to load packages" };
  }
}

// 2. Create a New Package (Handles both standard and plus)
export async function createUmrahPackage(formData: any) {
  try {
    // Destructure the arrays from the main package data
    const { 
      pricing, 
      hotels, 
      vehicles, 
      ziyarat, 
      ...packageData 
    } = formData;

    // 1. Insert the main package record
    const [newPackage] = await db.insert(umrahPackages).values(packageData).returning();
    const packageId = newPackage.id;

    // 2. Insert Pricing Tiers
    if (pricing && pricing.length > 0) {
      const pricingRows = pricing.map((p: any) => ({ ...p, packageId }));
      await db.insert(umrahPackagePricing).values(pricingRows);
    }

    // 3. Insert Hotel Links
    if (hotels && hotels.length > 0) {
      const hotelRows = hotels.map((h: any) => ({ ...h, packageId }));
      await db.insert(umrahPackageHotels).values(hotelRows);
    }

    // 4. Insert Vehicle Links
    if (vehicles && vehicles.length > 0) {
      const vehicleRows = vehicles.map((v: any) => ({ ...v, packageId }));
      await db.insert(umrahPackageVehicles).values(vehicleRows);
    }

    // 5. Insert Ziyarat Links (Only if it's an Umrah Plus package)
    if (packageData.packageType === 'plus' && ziyarat && ziyarat.length > 0) {
      const ziyaratRows = ziyarat.map((z: any) => ({ ...z, packageId }));
      await db.insert(umrahPackageZiyarat).values(ziyaratRows);
    }

    // Refresh the dashboard routes so the new data appears instantly
    revalidatePath('/admin/packages/umrah');
    revalidatePath('/admin/packages/umrah-plus');

    return { success: true, message: "Package created successfully!" };
  } catch (error) {
    console.error("Error creating Umrah package:", error);
    return { success: false, error: "Failed to create package. Check your inputs." };
  }
}

// 3. Delete a Package
export async function deleteUmrahPackage(id: string) {
  try {
    // Because we used { onDelete: 'cascade' } in the schema, 
    // deleting the main package automatically deletes all related pricing, hotels, vehicles, and ziyarat rows!
    await db.delete(umrahPackages).where(eq(umrahPackages.id, id));
    
    revalidatePath('/admin/packages/umrah');
    revalidatePath('/admin/packages/umrah-plus');
    
    return { success: true, message: "Package deleted successfully!" };
  } catch (error) {
    console.error("Error deleting Umrah package:", error);
    return { success: false, error: "Failed to delete package." };
  }
}