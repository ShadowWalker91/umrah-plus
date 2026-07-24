import React from 'react';
import { getAdminCities } from '@/app/actions/adminCityActions';
import { db } from '@/lib/db/';
import { vehicles } from '@/lib/db/schema/transport';
import CreatePackageForm from './CreatePackageForm';

export default async function CreateExplorePackagePage() {
  // Fetch cities to populate the "Select City" dropdown
  const citiesResponse = await getAdminCities();
  const availableCities = citiesResponse.success ? citiesResponse.data : [];

  // Fetch all available vehicles from the transport table
  const availableVehicles = await db.select().from(vehicles);

  return (
    <div className="p-6">
      <CreatePackageForm 
        cities={availableCities} 
        vehicles={availableVehicles} 
      />
    </div>
  );
}