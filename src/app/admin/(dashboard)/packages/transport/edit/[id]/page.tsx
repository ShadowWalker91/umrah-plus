import React from 'react';

export default function EditTransportPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Edit Transport Package</h1>
      <p className="mt-2 text-muted-foreground">Editing Transport ID: {params.id}</p>
      <div className="mt-6 rounded-md border border-dashed p-10 text-center">
        The transport editing form is under construction.
      </div>
    </div>
  );
}
