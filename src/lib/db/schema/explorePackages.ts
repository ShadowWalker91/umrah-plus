import { pgTable, text, timestamp, json, integer, primaryKey, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { vehicles } from './transport';
import { cities } from './cities'; // Import the newly created cities schema

export const explorePackages = pgTable('explore_packages', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  // Updated to reference the slug in the cities table
  citySlug: text('citySlug')
    .notNull()
    .references(() => cities.slug, { onDelete: 'cascade' }), 
  title: text('title').notNull(),
  description: text('description').notNull(),
  durationDays: integer('durationDays').notNull(),
  
  destinations: json('destinations').$type<string[]>(), 
  includes: json('includes').$type<string[]>(),
  
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const explorePackageVehicles = pgTable('explore_package_vehicles', {
  packageId: text('packageId').notNull().references(() => explorePackages.id, { onDelete: 'cascade' }),
  vehicleId: uuid('vehicleId').notNull().references(() => vehicles.id, { onDelete: 'cascade' }), 
  basePrice: integer('basePrice').notNull(), 
}, (t) => ({
  pk: primaryKey({ columns: [t.packageId, t.vehicleId] }),
}));

// Update relations to include the City link
export const explorePackagesRelations = relations(explorePackages, ({ one, many }) => ({
  city: one(cities, {
    fields: [explorePackages.citySlug],
    references: [cities.slug],
  }),
  vehicleOptions: many(explorePackageVehicles),
}));

export const explorePackageVehiclesRelations = relations(explorePackageVehicles, ({ one }) => ({
  package: one(explorePackages, {
    fields: [explorePackageVehicles.packageId],
    references: [explorePackages.id],
  }),
  vehicle: one(vehicles, {
    fields: [explorePackageVehicles.vehicleId],
    references: [vehicles.id],
  }),
}));