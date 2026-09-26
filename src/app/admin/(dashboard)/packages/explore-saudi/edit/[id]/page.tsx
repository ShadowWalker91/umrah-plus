import React from 'react';

// Next.js dynamic routes pass 'params' to the page
export default function EditExploreSaudiPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Edit Explore Saudi Package</h1>
      <p className="mt-2 text-muted-foreground">Editing Package ID: {params.id}</p>
      <div className="mt-6 rounded-md border border-dashed p-10 text-center">
        This edit form is under construction.
      </div>
    </div>
  );
}