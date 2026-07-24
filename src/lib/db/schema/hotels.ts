import { pgTable, text, uuid, jsonb, timestamp, integer } from 'drizzle-orm/pg-core';
export const hotels = pgTable('Hotel', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  cityId: uuid('cityId'), // Link to ZiyaratCity
  stars: integer('stars'), // 3, 4, 5
  bookingApiId: text('bookingApiId'), // Future Phase: Expedia/Agoda ID
});