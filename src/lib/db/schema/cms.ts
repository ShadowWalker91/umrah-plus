import { pgTable, text, uuid, jsonb, integer } from 'drizzle-orm/pg-core';

// The dynamic pages
export const explorePages = pgTable('ExplorePage', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').unique().notNull(), // e.g. "al-ula", "riyadh-season"
  title: text('title').notNull(),
  seoTitle: text('seoTitle'),
  seoDesc: text('seoDesc'),
  bannerImage: text('bannerImage'),
});

// The dynamic sections (Banner, Carousel, Text Block)
export const pageSections = pgTable('PageSection', {
  id: uuid('id').defaultRandom().primaryKey(),
  pageId: uuid('pageId').references(() => explorePages.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // 'HERO', 'TEXT_BLOCK', 'PLACES_CAROUSEL', 'VIDEO'
  sortOrder: integer('sortOrder').notNull(),
  
  // The Magic: Store ANY content here.
  // Example for Carousel: { "title": "Top Spots", "images": [...] }
  // Example for Text: { "heading": "History", "body": "..." }
  content: jsonb('content').notNull(), 
});