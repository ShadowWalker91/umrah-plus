import React from 'react';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { packages } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// ✅ Import the specific views
import ZiyaratPackageView from '@/components/templates/ZiyaratPackageView';
import UmrahPackageView from '@/components/templates/UmrahPackageView';
import UmrahPlusPackageView from '@/components/templates/UmrahPlusPackageView';
import TransportPackageView from '@/components/templates/TransportPackageView';
import ExploreSaudiPackageView from '@/components/templates/ExploreSaudiPackageView';

interface PageProps {
  params: Promise<{ category: string; slug: string }>;
}

export default async function SinglePackagePage({ params }: PageProps) {
  const { category, slug } = await params;

  // 1. Fetch Data (Common for all packages)
  const [pkg] = await db.select().from(packages).where(eq(packages.slug, slug));

  if (!pkg) return notFound();

  // 2. Wrap the view in Layout (Header/Footer)
  // We do this here so we don't repeat it in every template
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#F9C344] selection:text-black">
      
      {/* 3. The "Switch" Logic - Decides which View to Render */}
      {renderPackageView(category, pkg)}

      <Footer />
    </div>
  );
}

// Helper function to keep the return statement clean
function renderPackageView(category: string, pkg: any) {
  switch (category) {
    case 'ziyarat-packages':
      return <ZiyaratPackageView pkg={pkg} />;
      
    case 'umrah-packages':
      return <UmrahPackageView pkg={pkg} />;
      
    case 'umrah-plus-packages':
      return <UmrahPlusPackageView pkg={pkg} />;
      
    case 'transportation-packages':
      return <TransportPackageView pkg={pkg} />;
      
    case 'explore-saudi-packages':
      return <ExploreSaudiPackageView pkg={pkg} />;
      
    default:
      // Fallback for unknown categories
      return (
        <div className="h-[50vh] flex items-center justify-center">
          <p className="text-gray-500">View not found for this category.</p>
        </div>
      );
  }
}