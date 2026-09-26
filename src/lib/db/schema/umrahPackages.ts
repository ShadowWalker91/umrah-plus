import { pgTable, text, timestamp, integer, primaryKey, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { vehicles } from './transport';
import { ziyaratPoints } from './packages'; // Linking to the file you just shared

// 1. Core Package Table (Handles both Umrah and Umrah Plus)
export const umrahPackages = pgTable('umrah_packages', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  
  // Discriminator: 'standard' or 'plus'
  packageType: text('packageType').notNull(), 
  
  durationDays: integer('durationDays').notNull(),
  makkahNights: integer('makkahNights').notNull(),
  madinahNights: integer('madinahNights').notNull(),
  
  visaType: text('visaType'), // e.g., 'E-Visa/On Arrival', 'Through Shirka'
  internationalTransport: text('internationalTransport'), // e.g., 'By Air', 'By Road'
  
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

// 2. Pricing Table (For Double, Triple, Quad occupancies)
export const umrahPackagePricing = pgTable('umrah_package_pricing', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  packageId: text('packageId').notNull().references(() => umrahPackages.id, { onDelete: 'cascade' }),
  occupancy: text('occupancy').notNull(), // 'Double', 'Triple', 'Quad'
  price: integer('price').notNull(),
});

// 3. Hotels Junction Table
export const umrahPackageHotels = pgTable('umrah_package_hotels', {
  packageId: text('packageId').notNull().references(() => umrahPackages.id, { onDelete: 'cascade' }),
  hotelId: text('hotelId').notNull(), // Will link to hotels.ts later
  city: text('city').notNull(), // 'Makkah' or 'Madinah'
}, (t) => ({
  pk: primaryKey({ columns: [t.packageId, t.hotelId] }),
}));

// 4. Transport Junction Table
export const umrahPackageVehicles = pgTable('umrah_package_vehicles', {
  packageId: text('packageId').notNull().references(() => umrahPackages.id, { onDelete: 'cascade' }),
  // UUID used here to match your transport schema from earlier
  vehicleId: uuid('vehicleId').notNull().references(() => vehicles.id, { onDelete: 'cascade' }), 
  routeType: text('routeType'), // e.g., 'JED Airport - Makkah - Madinah - JED Airport'
}, (t) => ({
  pk: primaryKey({ columns: [t.packageId, t.vehicleId] }),
}));

// 5. Ziyarat Junction Table (Only populated if packageType === 'plus')
export const umrahPackageZiyarat = pgTable('umrah_package_ziyarat', {
  packageId: text('packageId').notNull().references(() => umrahPackages.id, { onDelete: 'cascade' }),
  ziyaratPointId: text('ziyaratPointId').notNull().references(() => ziyaratPoints.id, { onDelete: 'cascade' }),
}, (t) => ({
  pk: primaryKey({ columns: [t.packageId, t.ziyaratPointId] }),
}));

// --- RELATIONS ---

export const umrahPackagesRelations = relations(umrahPackages, ({ many }) => ({
  pricing: many(umrahPackagePricing),
  hotels: many(umrahPackageHotels),
  vehicles: many(umrahPackageVehicles),
  ziyarat: many(umrahPackageZiyarat),
}));

export const umrahPackagePricingRelations = relations(umrahPackagePricing, ({ one }) => ({
  package: one(umrahPackages, {
    fields: [umrahPackagePricing.packageId],
    references: [umrahPackages.id],
  }),
}));

export const umrahPackageHotelsRelations = relations(umrahPackageHotels, ({ one }) => ({
  package: one(umrahPackages, {
    fields: [umrahPackageHotels.packageId],
    references: [umrahPackages.id],
  }),
}));

export const umrahPackageVehiclesRelations = relations(umrahPackageVehicles, ({ one }) => ({
  package: one(umrahPackages, {
    fields: [umrahPackageVehicles.packageId],
    references: [umrahPackages.id],
  }),
  vehicle: one(vehicles, {
    fields: [umrahPackageVehicles.vehicleId],
    references: [vehicles.id],
  }),
}));

export const umrahPackageZiyaratRelations = relations(umrahPackageZiyarat, ({ one }) => ({
  package: one(umrahPackages, {
    fields: [umrahPackageZiyarat.packageId],
    references: [umrahPackages.id],
  }),
  ziyaratPoint: one(ziyaratPoints, {
    fields: [umrahPackageZiyarat.ziyaratPointId],
    references: [ziyaratPoints.id],
  }),
}));