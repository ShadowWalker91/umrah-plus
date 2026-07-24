import { pgTable, text, timestamp, json } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { explorePackages } from './explorePackages';

export const cities = pgTable('cities', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(), // e.g., "Jeddah"
  slug: text('slug').notNull().unique(), // e.g., "jeddah" (Used in URLs)
  
  // Hero Section
  heroTitle: text('heroTitle').notNull(),
  heroSubtitle: text('heroSubtitle').notNull(),
  heroVideo: text('heroVideo'), // URL to the video
  
  // About Section
  aboutTitle: text('aboutTitle').notNull(),
  aboutText: text('aboutText').notNull(),
  
  // Complex Data (Stored as JSON for easy frontend mapping, matching your current CITIES_DATA structure)
  weather: json('weather').$type<{ spring?: string; summer?: string; autumn?: string; winter?: string }>(),
  bestTime: json('bestTime').$type<{ title: string; months: string; icon: string }[]>(),
  transportation: json('transportation').$type<{ title: string; icon: string }[]>(),
  thingsToDo: json('thingsToDo').$type<{ title: string; image: string }[]>(),

  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

// Define the relation: One City has Many Explore Packages
export const citiesRelations = relations(cities, ({ many }) => ({
  packages: many(explorePackages),
}));