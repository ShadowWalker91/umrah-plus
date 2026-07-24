import React from 'react';
import { notFound } from 'next/navigation';
import { getAdminCityById } from '@/app/actions/adminCityActions';
import EditCityForm from './EditCityForm';

export default async function EditCityPage({ params }: { params: { id: string } }) {
  const response = await getAdminCityById(params.id);

  if (!response.success || !response.data) {
    return notFound();
  }

  return (
    <div className="p-6">
      <EditCityForm initialData={response.data} />
    </div>
  );
}