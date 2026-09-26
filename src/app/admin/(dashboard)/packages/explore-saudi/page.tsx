import React from 'react';
import Link from 'next/link';
import { Plus, Package, Edit, Trash2, MapPin, Clock } from 'lucide-react';
import { getAdminExplorePackages } from '@/app/actions/adminExploreActions';

export default async function ExploreSaudiPackagesPage() {
  const response = await getAdminExplorePackages();
  const packages = response.success ? response.data : [];

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Explore Saudi Packages</h1>
          <p className="text-gray-400 text-sm">Manage tours, itineraries, and vehicle-specific pricing for cities.</p>
        </div>
        <Link 
          href="/admin/packages/explore-saudi/create" 
          className="flex items-center gap-2 bg-[#F9C344] text-black px-4 py-2 rounded-lg font-bold hover:bg-white transition-colors"
        >
          <Plus size={18} /> Add New Package
        </Link>
      </div>

      {/* Packages Table */}
      <div className="bg-[#151515] border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/10 text-gray-400 text-xs uppercase tracking-wider">
              <th className="p-4 font-semibold">Package Title</th>
              <th className="p-4 font-semibold">City</th>
              <th className="p-4 font-semibold">Duration</th>
              <th className="p-4 font-semibold">Vehicles</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {packages.length > 0 ? (
              packages.map((pkg: any) => (
                <tr key={pkg.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-[#F9C344]/10 flex items-center justify-center text-[#F9C344]">
                        <Package size={16} />
                      </div>
                      <div>
                        <span className="text-white font-medium block">{pkg.title}</span>
                        <span className="text-[10px] text-gray-500 font-mono">{pkg.id.substring(0, 8)}...</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <MapPin size={14} className="text-[#F9C344]" />
                      {pkg.city?.name || pkg.citySlug}
                    </div>
                  </td>
                  <td className="p-4 text-gray-400 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock size={14} />
                      {pkg.durationDays} Days
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {pkg.vehicleOptions && pkg.vehicleOptions.length > 0 ? (
                        pkg.vehicleOptions.map((opt: any, idx: number) => (
                          <span key={idx} className="text-[10px] bg-white/5 text-gray-400 px-2 py-0.5 rounded border border-white/10">
                            {opt.vehicle?.name}: ${opt.basePrice}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-red-500 italic">No Pricing Set</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link 
                        href={`/admin/packages/explore-saudi/edit/${pkg.id}`}
                        className="p-2 text-gray-400 hover:text-[#F9C344] hover:bg-[#F9C344]/10 rounded-lg transition-all"
                      >
                        <Edit size={16} />
                      </Link>
                      <button 
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-12 text-center text-gray-500">
                  No packages found. Create a city first, then add your first package.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}