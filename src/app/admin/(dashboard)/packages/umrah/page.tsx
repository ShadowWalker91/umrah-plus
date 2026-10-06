import React from 'react';
import Link from 'next/link';
import { Plus, Package, Edit, Trash2, Moon, Plane } from 'lucide-react';
import { getAdminUmrahPackages } from '@/app/actions/adminUmrahActions';
import { getCurrentRole } from '@/lib/auth/guards';

export default async function StandardUmrahPackagesPage() {
  // Fetch only 'standard' packages
  const response = await getAdminUmrahPackages('standard');
  const packages = response.success ? response.data : [];

  const isAdmin = ((await getCurrentRole()) === 'admin');

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Standard Umrah Packages</h1>
          <p className="text-gray-400 text-sm">Manage standard Umrah itineraries, accommodations, and transport.</p>
        </div>
        {isAdmin && (
          <Link 
            href="/admin/packages/umrah/create" 
            className="flex items-center gap-2 bg-[#F9C344] text-black px-4 py-2 rounded-lg font-bold hover:bg-white transition-colors"
          >
            <Plus size={18} /> Add New Package
          </Link>
        )}
      </div>

      {/* Packages Table */}
      <div className="bg-[#151515] border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/10 text-gray-400 text-xs uppercase tracking-wider">
              <th className="p-4 font-semibold">Package Title</th>
              <th className="p-4 font-semibold">Nights (Mak/Mad)</th>
              <th className="p-4 font-semibold">Visa & Transport</th>
              <th className="p-4 font-semibold">Starting Price</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {packages.length > 0 ? (
              packages.map((pkg: any) => {
                // Calculate the lowest price to display as "Starting from"
                const lowestPrice = pkg.pricing?.length > 0 
                  ? Math.min(...pkg.pricing.map((p: any) => p.price))
                  : null;

                return (
                  <tr key={pkg.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-[#F9C344]/10 flex items-center justify-center text-[#F9C344]">
                          <Package size={16} />
                        </div>
                        <div>
                          <span className="text-white font-medium block">{pkg.title}</span>
                          <span className="text-[10px] text-gray-500 font-mono">{pkg.durationDays} Days Total</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3 text-gray-300 text-sm">
                        <div className="flex items-center gap-1" title="Makkah Nights">
                          <Moon size={14} className="text-[#F9C344]" />
                          <span>{pkg.makkahNights}</span>
                        </div>
                        <span className="text-gray-600">|</span>
                        <div className="flex items-center gap-1" title="Madinah Nights">
                          <Moon size={14} className="text-gray-400" />
                          <span>{pkg.madinahNights}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-gray-300">{pkg.visaType || 'Not specified'}</span>
                        <div className="flex items-center gap-1 text-[10px] text-gray-500">
                          <Plane size={10} />
                          {pkg.internationalTransport || 'Not specified'}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {lowestPrice ? (
                        <span className="text-white font-medium bg-white/5 px-2 py-1 rounded border border-white/10 text-sm">
                          AED {lowestPrice}
                        </span>
                      ) : (
                        <span className="text-xs text-red-500 italic">No Pricing Set</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link 
                          href={`/admin/packages/umrah/edit/${pkg.id}`}
                          className="p-2 text-gray-400 hover:text-[#F9C344] hover:bg-[#F9C344]/10 rounded-lg transition-all"
                        >
                          <Edit size={16} />
                        </Link>
                        {isAdmin && (
                          <button 
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="p-12 text-center text-gray-500">
                  No standard Umrah packages found. Click "Add New Package" to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}