'use server';

import { db } from '@/lib/db';
import { bookings, NewBooking } from '@/lib/db/schema/bookings';
import { desc, eq, and, gte } from 'drizzle-orm';
import { assertMember } from '@/lib/auth/guards';
import fs from 'fs';
import path from 'path';

// Path for resilient local JSON store
const LOCAL_BOOKINGS_FILE = path.join(process.cwd(), 'src', 'data', 'local_bookings.json');

// Ensure local json file exists
function ensureLocalStore() {
  const dir = path.dirname(LOCAL_BOOKINGS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(LOCAL_BOOKINGS_FILE)) {
    fs.writeFileSync(LOCAL_BOOKINGS_FILE, JSON.stringify([]), 'utf-8');
  }
}

function readLocalBookings(): any[] {
  try {
    ensureLocalStore();
    const data = fs.readFileSync(LOCAL_BOOKINGS_FILE, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error('[bookingActions] Failed to read local bookings file:', err);
    return [];
  }
}

function writeLocalBookings(records: any[]) {
  try {
    ensureLocalStore();
    fs.writeFileSync(LOCAL_BOOKINGS_FILE, JSON.stringify(records, null, 2), 'utf-8');
  } catch (err) {
    console.error('[bookingActions] Failed to write local bookings file:', err);
  }
}

/**
 * Generate a friendly Booking Reference ID e.g., BK-2026-X8F4
 */
function generateReference(): string {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `BK-${year}-${random}`;
}

/**
 * Save an incoming booking query (Umrah, Umrah Plus, or Ziyarat).
 * Persists to both Drizzle DB (if connected/configured) and local JSON storage.
 */
export async function saveBookingInquiry(payload: {
  bookingType: 'Umrah' | 'Transport' | 'Umrah Plus' | 'Ziyarat';
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerNationality?: string;
  customerNotes?: string;
  startDate?: string;
  endDate?: string;
  adultsCount?: number;
  infantsCount?: number;
  stayDetails?: any;
  transportDetails?: any;
  ziyaratDetails?: any;
  leadPassengerDetails?: any;
  fullSubmissionPayload?: any;
}) {
  const id = `bk_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const reference = generateReference();
  const now = new Date();

  const record = {
    id,
    reference,
    bookingType: payload.bookingType,
    status: 'Pending',
    customerName: payload.customerName || 'Valued Pilgrim',
    customerEmail: payload.customerEmail || '',
    customerPhone: payload.customerPhone || '',
    customerNationality: payload.customerNationality || 'Not Specified',
    customerNotes: payload.customerNotes || '',
    startDate: payload.startDate || null,
    endDate: payload.endDate || null,
    adultsCount: payload.adultsCount || 1,
    infantsCount: payload.infantsCount || 0,
    stayDetails: payload.stayDetails || null,
    transportDetails: payload.transportDetails || null,
    ziyaratDetails: payload.ziyaratDetails || null,
    leadPassengerDetails: payload.leadPassengerDetails || null,
    fullSubmissionPayload: payload.fullSubmissionPayload || null,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };

  // 1. PRIMARY: Persist to PostgreSQL Drizzle DB
  try {
    const newDbRecord: NewBooking = {
      id,
      reference,
      bookingType: payload.bookingType,
      status: 'Pending',
      customerName: payload.customerName || 'Valued Pilgrim',
      customerEmail: payload.customerEmail || '',
      customerPhone: payload.customerPhone || '',
      customerNationality: payload.customerNationality || 'Not Specified',
      customerNotes: payload.customerNotes || '',
      startDate: payload.startDate || null,
      endDate: payload.endDate || null,
      adultsCount: payload.adultsCount || 1,
      infantsCount: payload.infantsCount || 0,
      stayDetails: payload.stayDetails || null,
      transportDetails: payload.transportDetails || null,
      ziyaratDetails: payload.ziyaratDetails || null,
      leadPassengerDetails: payload.leadPassengerDetails || null,
      fullSubmissionPayload: payload.fullSubmissionPayload || null,
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(bookings).values(newDbRecord);
    console.log('[bookingActions] ✅ Booking saved to database:', reference);
  } catch (dbErr) {
    console.error('[bookingActions] ❌ Database insert FAILED:', dbErr);
  }

  // 2. SECONDARY: Best-effort local JSON store (for local dev only, read-only on Vercel)
  try {
    const list = readLocalBookings();
    list.unshift(record);
    writeLocalBookings(list);
  } catch (err) {
    // Expected to fail on Vercel - no action needed
  }

  return { success: true, bookingId: id, reference };
}

export interface BookingFilterOptions {
  type?: string; // 'All' | 'Umrah' | 'Umrah Plus' | 'Ziyarat'
  status?: string; // 'All' | 'Pending' | 'Contacted' | 'Confirmed' | 'Cancelled'
  dateRange?: string; // 'all' | 'today' | '7days' | '30days'
  search?: string;
}

/**
 * Fetch all bookings with optional filtering.
 */
export async function getBookings(filters?: BookingFilterOptions) {
  let records: any[] = [];

  // PRIMARY: Fetch from PostgreSQL database
  try {
    const dbRecords = await db.select().from(bookings).orderBy(desc(bookings.createdAt));
    if (dbRecords && dbRecords.length > 0) {
      records = dbRecords.map((r) => ({
        ...r,
        createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : new Date().toISOString(),
      }));
    }
  } catch (err) {
    console.error('[bookingActions] DB query failed, falling back to local file:', err);
    // FALLBACK: Only use local JSON if DB completely fails (e.g. local dev without DB)
    records = readLocalBookings();
  }

  // Apply filters
  if (filters) {
    if (filters.type && filters.type !== 'All') {
      records = records.filter((r) => r.bookingType?.toLowerCase() === filters.type?.toLowerCase());
    }

    if (filters.status && filters.status !== 'All') {
      records = records.filter((r) => r.status?.toLowerCase() === filters.status?.toLowerCase());
    }

    if (filters.dateRange && filters.dateRange !== 'all') {
      const now = new Date().getTime();
      const oneDay = 24 * 60 * 60 * 1000;
      records = records.filter((r) => {
        const createdTime = new Date(r.createdAt).getTime();
        if (filters.dateRange === 'today') {
          return now - createdTime <= oneDay;
        } else if (filters.dateRange === '7days') {
          return now - createdTime <= 7 * oneDay;
        } else if (filters.dateRange === '30days') {
          return now - createdTime <= 30 * oneDay;
        }
        return true;
      });
    }

    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      records = records.filter((r) => {
        return (
          r.reference?.toLowerCase().includes(q) ||
          r.customerName?.toLowerCase().includes(q) ||
          r.customerEmail?.toLowerCase().includes(q) ||
          r.customerPhone?.toLowerCase().includes(q) ||
          r.customerNationality?.toLowerCase().includes(q)
        );
      });
    }
  }

  return records;
}

/**
 * Get a single booking by ID
 */
export async function getBookingById(id: string) {
  // PRIMARY: Try database
  try {
    const dbRecord = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1);
    if (dbRecord && dbRecord.length > 0) {
      const r = dbRecord[0];
      return {
        ...r,
        createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : new Date().toISOString(),
      };
    }
  } catch (err) {
    console.error('[bookingActions] DB getBookingById failed:', err);
  }

  // FALLBACK: local file (local dev only)
  const list = readLocalBookings();
  return list.find((item) => item.id === id) || null;
}

/**
 * Update the status of a booking (e.g., Pending -> Contacted -> Confirmed)
 */
export async function updateBookingStatus(id: string, status: string) {
  await assertMember();
  const now = new Date();

  // 1. PRIMARY: Update DB
  try {
    await db.update(bookings).set({ status, updatedAt: now }).where(eq(bookings.id, id));
    console.log('[bookingActions] ✅ Status updated in DB:', id, '->', status);
  } catch (err) {
    console.error('[bookingActions] ❌ DB status update failed:', err);
  }

  // 2. SECONDARY: Update local JSON store (best-effort for local dev)
  try {
    const list = readLocalBookings();
    const idx = list.findIndex((item) => item.id === id);
    if (idx !== -1) {
      list[idx].status = status;
      list[idx].updatedAt = now.toISOString();
      writeLocalBookings(list);
    }
  } catch (err) {
    // Expected to fail on Vercel - no action needed
  }

  return { success: true, id, status };
}

/**
 * Get overall booking statistics for the Dashboard
 */
export async function getBookingStats() {
  const all = await getBookings();
  const total = all.length;
  const pending = all.filter((r) => r.status === 'Pending').length;
  const contacted = all.filter((r) => r.status === 'Contacted').length;
  const confirmed = all.filter((r) => r.status === 'Confirmed').length;
  const umrah = all.filter((r) => r.bookingType === 'Umrah').length;
  const transport = all.filter((r) => r.bookingType === 'Transport').length;
  const umrahPlus = all.filter((r) => r.bookingType === 'Umrah Plus').length;
  const ziyarat = all.filter((r) => r.bookingType === 'Ziyarat').length;

  return {
    total,
    pending,
    contacted,
    confirmed,
    byType: {
      umrah,
      transport,
      umrahPlus,
      ziyarat,
    },
  };
}

/**
 * Fetch the most recent booking inquiry (for itinerary download fallback)
 */
export async function getLatestBooking() {
  const all = await getBookings();
  if (all && all.length > 0) {
    return all[0];
  }
  return null;
}
