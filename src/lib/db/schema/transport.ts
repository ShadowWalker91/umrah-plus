import { pgTable, text, uuid, jsonb, timestamp, integer } from 'drizzle-orm/pg-core';

export const vehicles = pgTable('Vehicle', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(), // e.g. "GMC Yukon"
  category: text('category'), // 'SEDAN', 'SUV', 'BUS'
  capacity: integer('capacity'),
  basePricePerKm: integer('basePricePerKm'), // For API calculation later
  fixedDailyRate: integer('fixedDailyRate'), // For manual packages
});