'use client';

import React, { useState, useEffect } from 'react';
import { 
  Car, 
  Plus, 
  Save, 
  Trash2, 
  RefreshCw, 
  Users, 
  Briefcase, 
  DollarSign, 
  Check, 
  AlertCircle,
  MapPin,
  Compass,
  ArrowRight
} from 'lucide-react';
import { 
  getTransportData, 
  updateTransportRates, 
  TransportStoreData, 
  TransportVehicleConfig,
  addPointToPointRoute
} from '@/app/actions/transportActions';
import { useRole } from '@/components/admin/RoleProvider';
import { useToast } from '@/components/admin/ToastProvider';
import ErrorBanner from '@/components/admin/ErrorBanner';

export default function TransportAdminPage() {
  const { role } = useRole();
  const isAdmin = role === 'admin';
  const { toast } = useToast();

  const [data, setData] = useState<TransportStoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'fleet' | 'fixed' | 'pointToPoint'>('fixed');

  // Add vehicle modal state
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [newVehicle, setNewVehicle] = useState<Partial<TransportVehicleConfig>>({
    id: '',
    name: '',
    category: 'Executive',
    capacity: 4,
    luggage: 3,
    image: 'https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/07/1-Lexus-300H.webp',
    description: '',
    fixedRoutes: { p1: 1000, p2: 1300, p3: 1000, p4: 1600 },
    pointToPoint: {}
  });

  // Add Point-to-Point route state
  const [newRouteName, setNewRouteName] = useState('');
  const [isAddingRoute, setIsAddingRoute] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getTransportData();
      setData(res);
    } catch (err) {
      console.error('Error loading transport rates:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFixedRateChange = (vehicleId: string, routeId: string, value: string) => {
    if (!data) return;
    const num = parseInt(value, 10) || 0;
    const updatedVehicles = data.vehicles.map(v => {
      if (v.id === vehicleId) {
        return {
          ...v,
          fixedRoutes: {
            ...v.fixedRoutes,
            [routeId]: num
          }
        };
      }
      return v;
    });
    setData({ ...data, vehicles: updatedVehicles });
  };

  const handlePointToPointRateChange = (vehicleId: string, routeName: string, value: string) => {
    if (!data) return;
    const num = parseInt(value, 10) || 0;
    const updatedVehicles = data.vehicles.map(v => {
      if (v.id === vehicleId) {
        return {
          ...v,
          pointToPoint: {
            ...v.pointToPoint,
            [routeName]: num
          }
        };
      }
      return v;
    });
    setData({ ...data, vehicles: updatedVehicles });
  };

  const handleVehiclePropertyChange = (vehicleId: string, field: keyof TransportVehicleConfig, value: any) => {
    if (!data) return;
    const updatedVehicles = data.vehicles.map(v => {
      if (v.id === vehicleId) {
        return { ...v, [field]: value };
      }
      return v;
    });
    setData({ ...data, vehicles: updatedVehicles });
  };

  const handleDeleteVehicle = (vehicleId: string) => {
    if (!data) return;
    if (confirm('Are you sure you want to remove this vehicle from the fleet?')) {
      const updatedVehicles = data.vehicles.filter(v => v.id !== vehicleId);
      setData({ ...data, vehicles: updatedVehicles });
    }
  };

  const handleCreateVehicle = () => {
    if (!data || !newVehicle.name) {
      toast('Please enter a vehicle name.', 'info');
      return;
    }
    const id = newVehicle.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const vehicleToAdd: TransportVehicleConfig = {
      id,
      name: newVehicle.name,
      category: newVehicle.category || 'Executive',
      capacity: Number(newVehicle.capacity) || 4,
      luggage: Number(newVehicle.luggage) || 3,
      image: newVehicle.image || 'https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/07/1-Lexus-300H.webp',
      description: newVehicle.description || 'Chauffeur-driven private vehicle.',
      fixedRoutes: newVehicle.fixedRoutes || { p1: 900, p2: 1200, p3: 900, p4: 1500 },
      pointToPoint: newVehicle.pointToPoint || {}
    };

    setData({
      ...data,
      vehicles: [...data.vehicles, vehicleToAdd]
    });
    setIsAddVehicleOpen(false);
    setNewVehicle({
      id: '',
      name: '',
      category: 'Executive',
      capacity: 4,
      luggage: 3,
      image: 'https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/07/1-Lexus-300H.webp',
      description: '',
      fixedRoutes: { p1: 1000, p2: 1300, p3: 1000, p4: 1600 },
      pointToPoint: {}
    });
  };

  const handleAddNewPointToPointRoute = async () => {
    if (!newRouteName.trim() || !data) return;
    const trimmed = newRouteName.trim();
    if (data.pointToPointRoutesList.includes(trimmed)) {
      toast('This route already exists.', 'info');
      return;
    }

    const updatedRoutes = [...data.pointToPointRoutesList, trimmed];
    const updatedVehicles = data.vehicles.map(v => ({
      ...v,
      pointToPoint: {
        ...v.pointToPoint,
        [trimmed]: 250
      }
    }));

    setData({
      ...data,
      pointToPointRoutesList: updatedRoutes,
      vehicles: updatedVehicles
    });
    setNewRouteName('');
    setIsAddingRoute(false);
  };

  const handleSaveAll = async () => {
    if (!data) return;
    setSaveError(null);
    try {
      setSaving(true);
      const res = await updateTransportRates(data);
      if (res.success) {
        setSaveSuccess(true);
        toast('Transport rates saved.', 'success');
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        const message = res.message || 'Unknown error';
        setSaveError(message);
        toast(message, 'error');
      }
    } catch (err: any) {
      const message = 'Error saving rates: ' + err.message;
      setSaveError(message);
      toast(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-8 h-8 text-[#c5a059] animate-spin" />
          <span className="text-gray-600 font-medium">Loading Transport Configuration...</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 text-red-700 rounded-2xl">
        Failed to load transport configuration. Please refresh the page.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="p-2 bg-[#F9C344]/10 text-[#c5a059] rounded-xl border border-[#F9C344]/20">
              <Car size={24} />
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-sans tracking-tight">
              Transport Fleet & Rates Management
            </h1>
          </div>
          <p className="text-gray-500 text-sm">
            Configure vehicle fleet specifications, route-wise fixed round-trip packages, and point-to-point transfer combinations.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={loadData}
            disabled={saving}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer"
          >
            <RefreshCw size={16} /> Reset
          </button>
          
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md cursor-pointer ${
              saveSuccess 
                ? 'bg-emerald-600 text-white shadow-emerald-500/20' 
                : 'bg-[#1E1E1E] hover:bg-[#333] text-white'
            }`}
          >
            {saveSuccess ? (
              <>
                <Check size={16} /> Rates Saved!
              </>
            ) : (
              <>
                <Save size={16} /> {saving ? 'Saving...' : 'Save All Changes'}
              </>
            )}
          </button>
        </div>
      </div>

      {saveError && (
        <ErrorBanner message={saveError} title="Could not save" onDismiss={() => setSaveError(null)} />
      )}

      {/* Tabs Bar */}
      <div className="flex border-b border-gray-200 gap-4 sm:gap-8 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('fixed')}
          className={`pb-4 transition-all relative flex items-center gap-2 cursor-pointer ${
            activeTab === 'fixed' 
              ? 'text-gray-900 border-b-2 border-[#F9C344]' 
              : 'text-gray-400 hover:text-gray-700'
          }`}
        >
          <Compass size={18} className={activeTab === 'fixed' ? 'text-[#c5a059]' : 'text-gray-400'} />
          Fixed Route Packages Rates
          <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full">
            4 Routes
          </span>
        </button>

        <button
          onClick={() => setActiveTab('pointToPoint')}
          className={`pb-4 transition-all relative flex items-center gap-2 cursor-pointer ${
            activeTab === 'pointToPoint' 
              ? 'text-gray-900 border-b-2 border-[#F9C344]' 
              : 'text-gray-400 hover:text-gray-700'
          }`}
        >
          <MapPin size={18} className={activeTab === 'pointToPoint' ? 'text-[#c5a059]' : 'text-gray-400'} />
          Point-to-Point Combination Rates
          <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full">
            {data.pointToPointRoutesList.length} Routes
          </span>
        </button>

        <button
          onClick={() => setActiveTab('fleet')}
          className={`pb-4 transition-all relative flex items-center gap-2 cursor-pointer ${
            activeTab === 'fleet' 
              ? 'text-gray-900 border-b-2 border-[#F9C344]' 
              : 'text-gray-400 hover:text-gray-700'
          }`}
        >
          <Car size={18} className={activeTab === 'fleet' ? 'text-[#c5a059]' : 'text-gray-400'} />
          Fleet Vehicles & Specs
          <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full">
            {data.vehicles.length} Vehicles
          </span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: FIXED ROUTE PACKAGES RATES MATRIX
      ========================================================================= */}
      {activeTab === 'fixed' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Fixed Route Pricing (AED / SAR)</h2>
              <p className="text-gray-500 text-xs mt-1">
                Fares cover the complete pilgrimage sequence with chauffeur service and airport pickups/drop-offs.
              </p>
            </div>
            <div className="text-xs text-gray-500 bg-amber-50 text-amber-800 border border-amber-200 px-3.5 py-1.5 rounded-xl flex items-center gap-2">
              <AlertCircle size={14} className="text-amber-600" />
              <span>Rates apply per vehicle, with automatic multiplication if passenger count exceeds capacity.</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/70 text-xs font-bold text-gray-600 uppercase tracking-wider">
                  <th className="py-4 px-4 w-72">Fixed Route Package</th>
                  {data.vehicles.map(v => (
                    <th key={v.id} className="py-4 px-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-gray-900 font-bold">{v.name}</span>
                        <span className="text-[11px] text-gray-400 font-normal">Max {v.capacity} pax</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {data.fixedRoutesList.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-bold text-gray-900">{pkg.name}</div>
                      <div className="text-xs text-[#c5a059] font-medium mt-0.5">{pkg.fullRoute}</div>
                      <div className="text-[11px] text-gray-400 mt-1">
                        {pkg.legs.length} Scheduled Stops / Legs
                      </div>
                    </td>
                    {data.vehicles.map(v => {
                      const rate = v.fixedRoutes?.[pkg.id] ?? 0;
                      return (
                        <td key={v.id} className="py-4 px-4 text-center">
                          <div className="inline-flex items-center bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 focus-within:border-[#F9C344] focus-within:ring-2 focus-within:ring-[#F9C344]/20 transition-all">
                            <span className="text-xs font-bold text-gray-400 mr-1.5">AED</span>
                            <input
                              type="number"
                              min="0"
                              value={rate}
                              onChange={(e) => handleFixedRateChange(v.id, pkg.id, e.target.value)}
                              className="w-20 bg-transparent text-sm font-bold text-gray-900 outline-none text-right font-mono"
                            />
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: POINT-TO-POINT COMBINATION RATES MATRIX
      ========================================================================= */}
      {activeTab === 'pointToPoint' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Point-to-Point Transfer Pricing (AED / SAR)</h2>
              <p className="text-gray-500 text-xs mt-1">
                Single-leg intercity trips, airport transfers, and hotel transfers.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {isAddingRoute ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Makkah ↔ Taif Cable Car"
                    value={newRouteName}
                    onChange={(e) => setNewRouteName(e.target.value)}
                    className="px-3.5 py-2 border border-gray-300 rounded-xl text-xs sm:text-sm outline-none focus:border-[#F9C344] w-64"
                  />
                  <button
                    onClick={handleAddNewPointToPointRoute}
                    className="px-4 py-2 bg-[#1E1E1E] text-white rounded-xl text-xs font-bold uppercase hover:bg-black transition-colors"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setIsAddingRoute(false)}
                    className="px-3 py-2 text-gray-500 text-xs hover:text-gray-800"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                isAdmin && (
                  <button
                    onClick={() => setIsAddingRoute(true)}
                    className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold uppercase flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Plus size={16} /> Add Custom Route
                  </button>
                )
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/70 text-xs font-bold text-gray-600 uppercase tracking-wider">
                  <th className="py-4 px-4 w-72">Transfer Route Combination</th>
                  {data.vehicles.map(v => (
                    <th key={v.id} className="py-4 px-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-gray-900 font-bold">{v.name}</span>
                        <span className="text-[11px] text-gray-400 font-normal">Max {v.capacity} pax</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {data.pointToPointRoutesList.map((routeName) => (
                  <tr key={routeName} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-4 px-4 font-semibold text-gray-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#F9C344]"></span>
                      {routeName}
                    </td>
                    {data.vehicles.map(v => {
                      const rate = v.pointToPoint?.[routeName] ?? 0;
                      return (
                        <td key={v.id} className="py-4 px-4 text-center">
                          <div className="inline-flex items-center bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 focus-within:border-[#F9C344] focus-within:ring-2 focus-within:ring-[#F9C344]/20 transition-all">
                            <span className="text-xs font-bold text-gray-400 mr-1.5">AED</span>
                            <input
                              type="number"
                              min="0"
                              value={rate}
                              onChange={(e) => handlePointToPointRateChange(v.id, routeName, e.target.value)}
                              className="w-20 bg-transparent text-sm font-bold text-gray-900 outline-none text-right font-mono"
                            />
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: FLEET VEHICLES & SPECS MANAGEMENT
      ========================================================================= */}
      {activeTab === 'fleet' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Vehicle Fleet Roster</h2>
              <p className="text-gray-500 text-xs mt-0.5">
                Manage vehicle models, passenger capacities, luggage allowances, and imagery shown on the booking wizard.
              </p>
            </div>
            {isAdmin && (
              <button
                onClick={() => setIsAddVehicleOpen(true)}
                className="px-5 py-2.5 bg-[#1E1E1E] hover:bg-black text-white rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <Plus size={16} /> Add Vehicle
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.vehicles.map(vehicle => (
              <div 
                key={vehicle.id}
                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between group hover:shadow-md transition-shadow relative"
              >
                <div>
                  {/* Vehicle Image */}
                  <div className="w-full h-44 bg-gray-50 rounded-2xl overflow-hidden mb-5 border border-gray-100 flex items-center justify-center p-3 relative">
                    <img
                      src={vehicle.image}
                      alt={vehicle.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 right-3 text-[11px] font-bold bg-[#1E1E1E] text-[#F9C344] px-2.5 py-1 rounded-lg">
                      {vehicle.category}
                    </span>
                  </div>

                  {/* Vehicle Name & Editable fields */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Vehicle Name</label>
                      <input
                        type="text"
                        value={vehicle.name}
                        onChange={(e) => handleVehiclePropertyChange(vehicle.id, 'name', e.target.value)}
                        className="w-full font-bold text-gray-900 border border-gray-200 rounded-xl px-3 py-1.5 text-sm outline-none focus:border-[#F9C344]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1 mb-1">
                          <Users size={12} className="text-[#c5a059]" /> Capacity (Pax)
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={vehicle.capacity}
                          onChange={(e) => handleVehiclePropertyChange(vehicle.id, 'capacity', parseInt(e.target.value, 10) || 1)}
                          className="w-full font-bold text-gray-900 border border-gray-200 rounded-xl px-3 py-1.5 text-sm outline-none focus:border-[#F9C344]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1 mb-1">
                          <Briefcase size={12} className="text-[#c5a059]" /> Luggage Capacity
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={vehicle.luggage}
                          onChange={(e) => handleVehiclePropertyChange(vehicle.id, 'luggage', parseInt(e.target.value, 10) || 0)}
                          className="w-full font-bold text-gray-900 border border-gray-200 rounded-xl px-3 py-1.5 text-sm outline-none focus:border-[#F9C344]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Image URL</label>
                      <input
                        type="text"
                        value={vehicle.image}
                        onChange={(e) => handleVehiclePropertyChange(vehicle.id, 'image', e.target.value)}
                        className="w-full text-xs text-gray-600 border border-gray-200 rounded-xl px-3 py-1.5 outline-none focus:border-[#F9C344]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={vehicle.description}
                        onChange={(e) => handleVehiclePropertyChange(vehicle.id, 'description', e.target.value)}
                        className="w-full text-xs text-gray-600 border border-gray-200 rounded-xl px-3 py-1.5 outline-none focus:border-[#F9C344] resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-100 flex justify-end">
                  {isAdmin && (
                    <button
                      onClick={() => handleDeleteVehicle(vehicle.id)}
                      className="text-xs text-red-500 hover:text-red-700 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} /> Remove Vehicle
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ADD NEW VEHICLE
      ========================================================================= */}
      {isAddVehicleOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-xl font-bold text-gray-900">Add New Vehicle to Fleet</h3>
              <button
                onClick={() => setIsAddVehicleOpen(false)}
                className="text-gray-400 hover:text-gray-700 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Vehicle Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Mercedes-Benz V-Class"
                  value={newVehicle.name || ''}
                  onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#F9C344]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. VIP Luxury Van"
                    value={newVehicle.category || ''}
                    onChange={(e) => setNewVehicle({ ...newVehicle, category: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#F9C344]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Max Passenger Capacity</label>
                  <input
                    type="number"
                    min="1"
                    value={newVehicle.capacity || 4}
                    onChange={(e) => setNewVehicle({ ...newVehicle, capacity: parseInt(e.target.value, 10) || 1 })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#F9C344]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Image URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={newVehicle.image || ''}
                  onChange={(e) => setNewVehicle({ ...newVehicle, image: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#F9C344]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Comfort details, amenities, etc."
                  value={newVehicle.description || ''}
                  onChange={(e) => setNewVehicle({ ...newVehicle, description: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#F9C344] resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                onClick={() => setIsAddVehicleOpen(false)}
                className="px-5 py-2.5 rounded-xl border text-gray-600 hover:bg-gray-50 text-xs font-bold uppercase cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateVehicle}
                className="px-6 py-2.5 rounded-xl bg-[#1E1E1E] hover:bg-black text-white text-xs font-bold uppercase tracking-wider shadow-md cursor-pointer"
              >
                Save Vehicle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}