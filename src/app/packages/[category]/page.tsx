import React from 'react';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { PACKAGES, Package } from '@/data/packages';
// ✅ Import the new client component
import CategoryPageClient from '@/components/packages/CategoryPageClient';

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

  // 1. Initial Server-Side Filtering (Get all items for this category)
  // The client component will handle the sub-filtering (City, Duration)
  const initialCategoryPackages = PACKAGES.filter((p: Package) => {
    if (category === 'ziyarat-packages') return p.category === 'ziyarat';
    if (category === 'umrah-packages') return p.category === 'umrah';
    if (category === 'umrah-plus-packages') return p.category === 'umrah-plus';
    if (category === 'transportation-packages') return p.category === 'transportation';
    if (category === 'explore-saudi-packages') return p.category === 'explore-saudi';
    
    return p.slug.includes(category.replace('-packages', '')); 
  });

  return (
    <>
      <Header />
      {/* 2. Pass data to Client Component for interactivity */}
      <CategoryPageClient 
        category={category}
        categoryTitle={CATEGORY_TITLES[category]}
        initialPackages={initialCategoryPackages}
      />
      <Footer />
    </>
  );
}