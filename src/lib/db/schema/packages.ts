import { pgTable, text, timestamp, json } from 'drizzle-orm/pg-core';

// 1. MAIN PACKAGES TABLE (Commercial Tours)
export const packages = pgTable('packages', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  type: text('type').notNull(), // 'ziyarat', 'umrah', etc.
  
  city: text('city'),      // e.g., 'Madinah'
  duration: text('duration'), // e.g., '1 Day'
  priceStarting: text('priceStarting'), // e.g., 'AED 400'
  
  description: text('description'),
  image: text('image'),      
  bannerImage: text('bannerImage'), 

  // ✅ ADDED MISSING FIELDS
  pdfUpload: text('pdfUpload'),
  whatsappNumber: text('whatsappNumber'),

  // JSON Fields for complex data
  highlights: json('highlights').$type<string[]>(),
  inclusions: json('inclusions').$type<string[]>(),
  exclusions: json('exclusions').$type<string[]>(),
  terms: json('terms').$type<string[]>(),
  
  pricing: json('pricing').$type<{name: string, capacity: string, price: string, image: string}[]>(),

  itinerary: json('itinerary').$type<{
    title: string, 
    descriptionEn: string, 
    descriptionAr: string, 
    images: string[]
  }[]>(), 

  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const ziyaratCities = pgTable('ziyarat_cities', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  slug: text('slug').notNull(), 
  label: text('label'),         
  image: text('image'),           
  link: text('link'), 
});

export const ziyaratPoints = pgTable('ziyarat_points', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text('title').notNull(),
  descriptionEn: text('descriptionEn'),
  descriptionAr: text('descriptionAr'),
  images: json('images').$type<string[]>(),
  city: text('city'),
});