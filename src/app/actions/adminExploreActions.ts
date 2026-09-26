'use server';

import { db } from '@/lib/db/';
import { explorePackages, explorePackageVehicles } from '@/lib/db/schema/explorePackages';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

// 1. Fetch packages with City and Vehicle details for the Admin Table
export async function getAdminExplorePackages() {
  try {
    const data = await db.query.explorePackages.findMany({
      with: {
        city: true, // Joins the cities table
        vehicleOptions: {
          with: {
            vehicle: true // Joins the transport vehicles table
          }
        }
      },
      orderBy: (packages, { desc }) => [desc(packages.createdAt)],
    });
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching admin packages:", error);
    return { success: false, data: [], error: "Failed to load packages" };
  }
}

// 2. Create package with vehicle prices
export async function createExplorePackage(data: any) {
  try {
    const { vehicleOptions, ...packageData } = data;

    // Insert main package
    const [newPackage] = await db.insert(explorePackages).values(packageData).returning();

    // Insert junction table rows for vehicle prices
    if (vehicleOptions && vehicleOptions.length > 0) {
      const priceRows = vehicleOptions.map((opt: any) => ({
        packageId: newPackage.id,
        vehicleId: opt.vehicleId,
        basePrice: opt.basePrice
      }));
      await db.insert(explorePackageVehicles).values(priceRows);
    }

    revalidatePath('/admin/packages/explore-saudi');
    return { success: true, message: "Package created successfully" };
  } catch (error) {
    console.error("Create package error:", error);
    return { success: false, error: "Failed to create package" };
  }
}

// 3. Delete a package
export async function deleteExplorePackage(id: string) {
  try {
    await db.delete(explorePackages).where(eq(explorePackages.id, id));
    revalidatePath('/admin/packages/explore-saudi');
    return { success: true, message: "Package deleted successfully" };
  } catch (error) {
    console.error("Delete package error:", error);
    return { success: false, error: "Failed to delete package" };
  }
}