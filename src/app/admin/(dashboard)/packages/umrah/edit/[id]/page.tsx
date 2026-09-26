import React from 'react';

export default function EditUmrahPackagePage({ params }: { params: { id: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Edit Umrah Package</h1>
      <p className="mt-2 text-muted-foreground">Editing Package ID: {params.id}</p>
      <div className="mt-6 rounded-md border border-dashed p-10 text-center text-sm">
        Standard Umrah Edit Form Under Construction
      </div>
    </div>
  );
}