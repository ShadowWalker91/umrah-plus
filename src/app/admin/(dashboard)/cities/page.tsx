import React from 'react';
import Link from 'next/link';
import { Plus, MapPin, Edit, Trash2, Video } from 'lucide-react';
import { getAdminCities, deleteAdminCity } from '@/app/actions/adminCityActions';
import { getCurrentRole } from '@/lib/auth/guards';

export default async function CitiesListPage() {
  const response = await getAdminCities();
  const cities = response.success ? response.data : [];

  const isAdmin = ((await getCurrentRole()) === 'admin');

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Saudi Cities</h1>
          <p className="text-gray-400 text-sm">Manage city content, hero videos, and local guides.</p>
        </div>
        {isAdmin && (
          <Link 
            href="/admin/cities/create" 
            className="flex items-center gap-2 bg-[#F9C344] text-black px-4 py-2 rounded-lg font-bold hover:bg-white transition-colors"
          >
            <Plus size={18} /> Add New City
          </Link>
        )}
      </div>

      <div className="bg-[#151515] border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/10 text-gray-400 text-xs uppercase tracking-wider">
              <th className="p-4 font-semibold">City Name</th>
              <th className="p-4 font-semibold">Slug</th>
              <th className="p-4 font-semibold text-center">Hero Video</th>
              <th className="p-4 font-semibold">Created At</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {cities.length > 0 ? (
              cities.map((city) => (
                <tr key={city.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-[#F9C344]/10 flex items-center justify-center text-[#F9C344]">
                        <MapPin size={16} />
                      </div>
                      <span className="text-white font-medium">{city.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-400 text-sm font-mono">{city.slug}</td>
                  <td className="p-4 text-center">
                    {city.heroVideo ? (
                      <span className="text-green-500 flex justify-center" title="Video URL configured">
                        <Video size={18} />
                      </span>
                    ) : (
                      <span className="text-gray-600 flex justify-center">-</span>
                    )}
                  </td>
                  <td className="p-4 text-gray-400 text-sm">
                    {new Date(city.createdAt!).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link 
                        href={`/admin/cities/edit/${city.id}`}
                        className="p-2 text-gray-400 hover:text-[#F9C344] hover:bg-[#F9C344]/10 rounded-lg transition-all"
                      >
                        <Edit size={16} />
                      </Link>
                      {isAdmin && (
                        /* Note: Delete should ideally use a Client Component button for confirmation */
                        <button 
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-12 text-center text-gray-500">
                  No cities found. Click "Add New City" to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}