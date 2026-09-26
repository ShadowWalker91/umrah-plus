import React from 'react';
import { CityPackage } from '@/types';
import PackageCard from './PackageCard';

export default function PackageList({ packages }: { packages: CityPackage[] }) {
  if (!packages || packages.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {packages.map((pkg) => (
        <PackageCard key={pkg.id} pkg={pkg} />
      ))}
    </div>
  );
}