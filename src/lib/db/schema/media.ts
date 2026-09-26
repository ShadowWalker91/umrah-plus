import { pgTable, text, uuid, boolean } from 'drizzle-orm/pg-core';

export const videoCollections = pgTable('VideoCollection', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  sourceType: text('sourceType').default('MANUAL'), // 'MANUAL' or 'YOUTUBE_CHANNEL'
  sourceUrl: text('sourceUrl'), // Channel ID or Playlist URL
});

export const videos = pgTable('Video', {
  id: uuid('id').defaultRandom().primaryKey(),
  collectionId: uuid('collectionId').references(() => videoCollections.id),
  youtubeId: text('youtubeId').notNull(),
  title: text('title'),
  thumbnailUrl: text('thumbnailUrl'),
});