import React from 'react';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// ✅ CONNECT TO DB
import { db } from '@/lib/db';
import { packages } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

import CategoryPageClient from '@/components/packages/CategoryPageClient';

// Helper to map URL Slug -> DB Category Type
const CATEGORY_MAP: Record<string, string> = {
  'ziyarat-packages': 'ZIYARAT',
  'umrah-packages': 'UMRAH',
  'umrah-plus-packages': 'UMRAH_PLUS',
  'transportation-packages': 'TRANSPORTATION',
  'explore-saudi-packages': 'EXPLORE_SAUDI'
};

const CATEGORY_TITLES: Record<string, string> = {
  'umrah-packages': 'Umrah Packages',
  'umrah-plus-packages': 'Umrah Plus Packages',
  'ziyarat-packages': 'Ziyarat Packages',
  'transportation-packages': 'Transportation Packages',
  'explore-saudi-packages': 'Explore Saudi'
};

interface PageProps {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  
  if (!CATEGORY_TITLES[category]) {
    return notFound();
  }

  // 1. Get the DB Type (e.g., 'ziyarat-packages' -> 'ZIYARAT')
  const dbType = CATEGORY_MAP[category];

  // 2. FETCH FROM DATABASE
  const dbPackages = await db
    .select()
    .from(packages)
    .where(eq(packages.type, dbType)) // Filter by category
    .orderBy(desc(packages.updatedAt)); // Show newest first

  // 3. TRANSFORM DB DATA TO MATCH 'Package' INTERFACE EXACTLY
  // We must provide ALL fields to satisfy TypeScript
  const mappedPackages: any[] = dbPackages.map((pkg) => ({
    id: pkg.id,
    title: pkg.title,
    slug: pkg.slug,
    category: category.replace('-packages', ''), // e.g. 'ziyarat'
    city: pkg.city || '',
    duration: pkg.duration || '',
    description: pkg.description || '',
    
    // Images
    image: pkg.image || '/assets/placeholder.jpg',
    images: pkg.image ? [pkg.image] : ['/assets/placeholder.jpg'], // Fallback array

    // Pricing
    priceStarting: pkg.priceStarting || 0,
    price: pkg.priceStarting ? `AED ${Number(pkg.priceStarting) / 100}` : 'Contact for Price',

    // Arrays (Ensure they are arrays, not null)
    highlights: Array.isArray(pkg.highlights) ? pkg.highlights : [],
    features: Array.isArray(pkg.highlights) ? pkg.highlights : [], // Duplicate for compatibility
    
    itinerary: Array.isArray(pkg.itinerary) ? pkg.itinerary : [],
    inclusions: Array.isArray(pkg.inclusions) ? pkg.inclusions : [],
    exclusions: Array.isArray(pkg.exclusions) ? pkg.exclusions : [],
    terms: Array.isArray(pkg.terms) ? pkg.terms : [],
    pricing: Array.isArray(pkg.pricing) ? pkg.pricing : [],
  }));

  return (
    <>
      {/* 4. Pass REAL DATA to Client Component */}
      <CategoryPageClient 
        category={category}
        categoryTitle={CATEGORY_TITLES[category]}
        initialPackages={mappedPackages}
      />
      <Footer />
    </>
  );
}