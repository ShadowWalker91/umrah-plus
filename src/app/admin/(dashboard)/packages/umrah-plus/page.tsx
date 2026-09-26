import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function UmrahPlusListPage() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-400">Umrah Plus Packages</h1>
        <button disabled className="bg-gray-200 text-gray-500 px-4 py-2 rounded-lg flex items-center gap-2 cursor-not-allowed">
          <Plus size={18} /> Create New
        </button>
      </div>
      <div className="py-20 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
        <h2 className="text-xl font-bold text-gray-400">Module Coming Soon</h2>
        <p className="text-gray-500 mt-2">Umrah Plus (Tourism) management is under development.</p>
      </div>
    </div>
  );
}