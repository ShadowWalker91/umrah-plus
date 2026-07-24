import { pgTable, text, timestamp, json } from 'drizzle-orm/pg-core';

export const ziyaratLandmarks = pgTable('ziyarat_landmarks', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  
  // Titles
  name: text('name').notNull(),         
  urduTitle: text('urduTitle'),         
  slug: text('slug').notNull().unique(), 
  city: text('city').notNull(),         
  
  // Content
  shortDescription: text('shortDescription'), 
  fullHistory: text('fullHistory'),           
  
  // Media
  bannerImage: text('bannerImage'),           
  images: json('images').$type<string[]>(),   
  videoUrl: text('videoUrl'),                 
  
  // Meta Details (Sidebar)
  location: text('location'),              
  timings: text('timings'),                   
  googleMapLink: text('googleMapLink'), 
  
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});