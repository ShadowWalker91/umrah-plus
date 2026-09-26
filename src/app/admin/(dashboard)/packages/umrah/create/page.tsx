import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { db } from '@/lib/db/';
import { vehicles } from '@/lib/db/schema/transport';
import PackageBuilderForm from '../../components/PackageBuilderForm';

export default async function CreateUmrahPackagePage() {
  // Fetch vehicles to pass into the form
  const availableVehicles = await db.select().from(vehicles);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-4 border-b border-white/10 pb-6">
        <Link href="/admin/packages/umrah" className="p-2 hover:bg-white/5 rounded-full text-gray-400">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-white">Create New Package</h1>
      </div>

      <PackageBuilderForm 
        isUmrahPlus={false} 
        vehicles={availableVehicles} 
      />
    </div>
  );
}