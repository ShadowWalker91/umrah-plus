'use server';

import fs from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { requireAdmin, requireMember } from '@/lib/auth/guards';

export interface TransportVehicleConfig {
  id: string;
  name: string;
  category: string;
  capacity: number;
  luggage: number;
  image: string;
  description: string;
  fixedRoutes: Record<string, number>;
  pointToPoint: Record<string, number>;
}

export interface FixedRouteConfig {
  id: string;
  name: string;
  fullRoute: string;
  legs: { id: string; from: string; to: string; label: string }[];
}

export interface TransportStoreData {
  vehicles: TransportVehicleConfig[];
  fixedRoutesList: FixedRouteConfig[];
  pointToPointRoutesList: string[];
}

const LOCAL_RATES_FILE = path.join(process.cwd(), 'src', 'data', 'transport_rates.json');

function ensureRatesFile(): TransportStoreData {
  try {
    if (!fs.existsSync(LOCAL_RATES_FILE)) {
      const defaultData: TransportStoreData = {
        vehicles: [],
        fixedRoutesList: [],
        pointToPointRoutesList: []
      };
      fs.writeFileSync(LOCAL_RATES_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
      return defaultData;
    }
    const raw = fs.readFileSync(LOCAL_RATES_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('[transportActions] Error reading transport_rates.json:', err);
    return {
      vehicles: [],
      fixedRoutesList: [],
      pointToPointRoutesList: []
    };
  }
}

function writeRatesFile(data: TransportStoreData): boolean {
  try {
    fs.writeFileSync(LOCAL_RATES_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('[transportActions] Error writing transport_rates.json:', err);
    return false;
  }
}

/**
 * Fetch current transport rates and fleet from server store
 */
export async function getTransportData(): Promise<TransportStoreData> {
  return ensureRatesFile();
}

/**
 * Update the whole transport configuration (vehicles, fixed route rates, point-to-point rates)
 */
export async function updateTransportRates(payload: TransportStoreData): Promise<{ success: boolean; message?: string }> {
  try {
    const guard = await requireMember();
    if (!guard.ok) return { success: false, message: guard.error };

    // Editors may update rates/specs, but only the admin can add or remove vehicles and routes
    const store = ensureRatesFile();
    const existingVehicleIds = new Set(store.vehicles.map((v) => v.id));
    const payloadVehicleIds = new Set(payload.vehicles.map((v) => v.id));
    const addedVehicles = [...payloadVehicleIds].filter((id) => !existingVehicleIds.has(id));
    const removedVehicles = [...existingVehicleIds].filter((id) => !payloadVehicleIds.has(id));
    const addedRoutes = payload.pointToPointRoutesList.filter((r) => !store.pointToPointRoutesList.includes(r));
    const removedRoutes = store.pointToPointRoutesList.filter((r) => !payload.pointToPointRoutesList.includes(r));
    const addedFixedRoutes = payload.fixedRoutesList.filter((r) => !store.fixedRoutesList.some((s) => s.id === r.id));
    const removedFixedRoutes = store.fixedRoutesList.filter((r) => !payload.fixedRoutesList.some((s) => s.id === r.id));

    const structuralChange =
      addedVehicles.length || removedVehicles.length ||
      addedRoutes.length || removedRoutes.length ||
      addedFixedRoutes.length || removedFixedRoutes.length;

    if (guard.user.role !== 'admin' && structuralChange) {
      return { success: false, message: 'Only the admin can add or remove vehicles and routes.' };
    }

    const success = writeRatesFile(payload);
    if (success) {
      revalidatePath('/admin/transport');
      revalidatePath('/booking');
      revalidatePath('/transportation');
      return { success: true };
    }
    return { success: false, message: 'Failed to write data file' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Unknown error' };
  }
}

/**
 * Add or update an individual vehicle in the fleet
 */
export async function saveVehicle(vehicle: TransportVehicleConfig): Promise<{ success: boolean; message?: string }> {
  try {
    const store = ensureRatesFile();
    const existingIndex = store.vehicles.findIndex(v => v.id === vehicle.id);

    // Updating an existing vehicle is allowed for editors; adding a new one is admin-only
    const guard = existingIndex !== -1 ? await requireMember() : await requireAdmin();
    if (!guard.ok) return { success: false, message: guard.error };

    if (existingIndex !== -1) {
      store.vehicles[existingIndex] = vehicle;
    } else {
      store.vehicles.push(vehicle);
    }
    writeRatesFile(store);
    revalidatePath('/admin/transport');
    revalidatePath('/booking');
    revalidatePath('/transportation');
    return { success: true };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

/**
 * Delete a vehicle from the fleet
 */
export async function deleteVehicle(vehicleId: string): Promise<{ success: boolean; message?: string }> {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return { success: false, message: guard.error };

    const store = ensureRatesFile();
    store.vehicles = store.vehicles.filter(v => v.id !== vehicleId);
    writeRatesFile(store);
    revalidatePath('/admin/transport');
    revalidatePath('/booking');
    revalidatePath('/transportation');
    return { success: true };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

/**
 * Add a new Point-to-Point route combination
 */
export async function addPointToPointRoute(routeName: string): Promise<{ success: boolean; message?: string }> {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return { success: false, message: guard.error };

    const store = ensureRatesFile();
    const trimmed = routeName.trim();
    if (!trimmed) return { success: false, message: 'Route name cannot be empty' };
    if (!store.pointToPointRoutesList.includes(trimmed)) {
      store.pointToPointRoutesList.push(trimmed);
      // Initialize rate for all vehicles
      store.vehicles.forEach(v => {
        if (!v.pointToPoint) v.pointToPoint = {};
        if (v.pointToPoint[trimmed] === undefined) {
          v.pointToPoint[trimmed] = 200;
        }
      });
      writeRatesFile(store);
      revalidatePath('/admin/transport');
      revalidatePath('/booking');
      revalidatePath('/transportation');
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}
