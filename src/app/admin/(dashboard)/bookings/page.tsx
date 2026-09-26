'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
  CalendarCheck,
  Search,
  Filter,
  List,
  FolderTree,
  ChevronDown,
  ChevronRight,
  User,
  Phone,
  Mail,
  Calendar,
  Users as UsersIcon,
  Hotel,
  Car,
  Compass,
  FileText,
  Clock,
  CheckCircle,
  Clock3,
  XCircle,
  ExternalLink,
  MessageCircle,
  MapPin,
  RefreshCw,
  Eye,
  X,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  FileDown,
  Download,
  Printer
} from 'lucide-react'
import { getBookings, updateBookingStatus, BookingFilterOptions } from '@/app/actions/bookingActions'
import { exportBookingsToCsv, printBookingToPdf } from '@/lib/exportUtils'
import { formatDateDDMMYYYY, formatDateTimeDDMMYYYY } from '@/lib/utils'

export default function BookingsAdminPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'list' | 'tree'>('list')
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null)
  const [statusUpdating, setStatusUpdating] = useState(false)

  // Filters
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Umrah' | 'Transport' | 'Ziyarat' | 'Umrah Plus'>('All')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [dateFilter, setDateFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Tree expanded groups
  const [expandedNodes, setExpandedNodes] = useState<{ [key: string]: boolean }>({
    'Umrah': true,
    'Transport': true,
    'Umrah Plus': true,
    'Ziyarat': true,
  })

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await getBookings({
        type: categoryFilter === 'All' ? undefined : categoryFilter,
        status: statusFilter === 'All' ? undefined : statusFilter,
        dateRange: dateFilter,
        search: searchQuery,
      })
      setBookings(data || [])
    } catch (err) {
      console.error('Error fetching bookings:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [categoryFilter, statusFilter, dateFilter])

  // Search debounce or enter trigger
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    loadData()
  }

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    setStatusUpdating(true)
    try {
      await updateBookingStatus(bookingId, newStatus)
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus, updatedAt: new Date().toISOString() } : b))
      )
      if (selectedBooking && selectedBooking.id === bookingId) {
        setSelectedBooking((prev: any) => ({ ...prev, status: newStatus }))
      }
    } catch (err) {
      console.error('Error updating status:', err)
    } finally {
      setStatusUpdating(false)
    }
  }

  const toggleNode = (nodeKey: string) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeKey]: !prev[nodeKey],
    }))
  }

  // Tree View Grouping by Booking Type (4 Services: Umrah, Transport, Umrah Plus, Ziyarat)
  const groupedTreeData = useMemo(() => {
    const groups: { [type: string]: any[] } = {
      'Umrah': [],
      'Transport': [],
      'Umrah Plus': [],
      'Ziyarat': [],
    }

    bookings.forEach((b) => {
      const t = b.bookingType || 'Umrah'
      if (!groups[t]) groups[t] = []
      groups[t].push(b)
    })

    return groups
  }, [bookings])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            Confirmed
          </span>
        )
      case 'Contacted':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <Clock3 className="w-3.5 h-3.5 text-blue-600" />
            Contacted
          </span>
        )
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Cancelled
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Pending
          </span>
        )
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'Transport':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Car className="w-3 h-3 text-emerald-600" />
            Transport
          </span>
        )
      case 'Umrah Plus':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-50 text-[#C5A059] border border-[#C5A059]/30">
            <Sparkles className="w-3 h-3 text-[#C5A059]" />
            Umrah Plus
          </span>
        )
      case 'Ziyarat':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <Compass className="w-3 h-3 text-purple-600" />
            Ziyarat
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            🕋 Umrah
          </span>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E1E1E] to-[#2d2d2d] flex items-center justify-center text-[#F9C344] shadow-md">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Booking Inquiries</h1>
              <p className="text-sm text-gray-500">Manage, inspect, and track every pilgrim submission with full client details</p>
            </div>
          </div>
        </div>

        {/* Export to CSV, View Switcher & Refresh */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          {/* Export to CSV Button */}
          <button
            onClick={() => {
              const filename = categoryFilter === 'All' 
                ? `umrah_plus_all_bookings_${new Date().toISOString().slice(0,10)}.csv`
                : `umrah_plus_${categoryFilter.toLowerCase().replace(/\s+/g, '_')}_bookings_${new Date().toISOString().slice(0,10)}.csv`;
              exportBookingsToCsv(bookings, filename);
            }}
            title="Download current bookings as CSV spreadsheet"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300/80 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <FileDown className="w-4 h-4 text-emerald-600" />
            <span>Export CSV</span>
            <span className="text-[10px] bg-emerald-200/70 text-emerald-900 px-1.5 py-0.5 rounded font-mono">
              {bookings.length}
            </span>
          </button>

          <button
            onClick={loadData}
            title="Refresh Inquiries"
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <div className="flex items-center p-1 bg-gray-100 rounded-xl border border-gray-200 text-xs font-semibold">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-gray-900 shadow-sm font-bold'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <List className="w-4 h-4" />
              List View
            </button>
            <button
              onClick={() => setViewMode('tree')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'tree'
                  ? 'bg-white text-gray-900 shadow-sm font-bold'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <FolderTree className="w-4 h-4" />
              Tree View
            </button>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        {/* Category Tabs (4 Services: Umrah, Transport, Umrah Plus, Ziyarat) */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            {(['All', 'Umrah', 'Transport', 'Ziyarat', 'Umrah Plus'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  categoryFilter === cat
                    ? 'bg-[#1E1E1E] text-[#F9C344] shadow-sm'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200/60'
                }`}
              >
                {cat === 'All' ? 'All Inquiries' : cat}
              </button>
            ))}
          </div>

          <div className="text-xs text-gray-500 font-medium">
            Found <span className="font-bold text-gray-900">{bookings.length}</span> inquiry
            {bookings.length !== 1 ? 'ies' : 'y'}
          </div>
        </div>

        {/* Search & Secondary Filters */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by customer name, email, phone, reference..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A059]/30 focus:border-[#C5A059]"
            />
          </form>

          {/* Status Dropdown */}
          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A059]/30 focus:border-[#C5A059] text-gray-700"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Contacted">Contacted</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="md:col-span-3">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A059]/30 focus:border-[#C5A059] text-gray-700"
            >
              <option value="all">Any Submission Date</option>
              <option value="today">Received Today</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Area: List View vs Tree View */}
      {viewMode === 'list' ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Ref #</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Dates & Guests</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Submitted</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <CalendarCheck className="w-8 h-8 text-gray-300" />
                        <p className="font-medium text-sm text-gray-500">No booking inquiries found matching filters.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="hover:bg-amber-50/40 transition-colors group cursor-pointer"
                      onClick={() => setSelectedBooking(booking)}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                        {booking.reference || 'BK-NEW'}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-gray-900">{booking.customerName}</div>
                        <div className="text-gray-400 text-[11px] flex items-center gap-1.5 mt-0.5">
                          <span>{booking.customerNationality || 'Citizen'}</span>
                          <span>•</span>
                          <span>{booking.customerPhone}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">{getTypeBadge(booking.bookingType)}</td>
                      <td className="py-3.5 px-4">
                        <div className="text-gray-900 font-medium">
                          {booking.startDate ? `${formatDateDDMMYYYY(booking.startDate)}` : 'Flexible dates'}
                          {booking.endDate ? ` ➔ ${formatDateDDMMYYYY(booking.endDate)}` : ''}
                        </div>
                        <div className="text-gray-400 text-[11px] mt-0.5">
                          {booking.adultsCount || 1} Adults
                          {booking.infantsCount > 0 ? `, ${booking.infantsCount} Infants` : ''}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">{getStatusBadge(booking.status)}</td>
                      <td className="py-3.5 px-4 text-gray-500 whitespace-nowrap">
                        {booking.createdAt ? formatDateDDMMYYYY(booking.createdAt) : 'Recent'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedBooking(booking)
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 group-hover:bg-[#1E1E1E] group-hover:text-[#F9C344] text-gray-700 rounded-lg text-xs font-semibold transition-all shadow-sm"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* TREE VIEW */
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <div className="text-xs text-gray-500 mb-2">
            Click on categories to expand or collapse hierarchical booking branches:
          </div>

          {(['Umrah', 'Transport', 'Ziyarat', 'Umrah Plus'] as const)
            .filter((categoryName) => categoryFilter === 'All' || categoryFilter === categoryName)
            .map((categoryName) => {
            const list = groupedTreeData[categoryName] || []
            const isExpanded = !!expandedNodes[categoryName]

            return (
              <div key={categoryName} className="border border-gray-200/80 rounded-xl overflow-hidden shadow-sm">
                {/* Branch Header */}
                <div
                  onClick={() => toggleNode(categoryName)}
                  className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100/80 cursor-pointer select-none transition-colors border-b border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-gray-500">
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </div>
                    <div>{getTypeBadge(categoryName)}</div>
                    <span className="font-bold text-gray-800 text-sm">{categoryName} Queries</span>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white border border-gray-200 text-gray-700">
                    {list.length} {list.length === 1 ? 'Record' : 'Records'}
                  </span>
                </div>

                {/* Branch Children */}
                {isExpanded && (
                  <div className="p-3 bg-white divide-y divide-gray-100">
                    {list.length === 0 ? (
                      <p className="text-xs text-gray-400 py-3 px-4 italic">No inquiries submitted under {categoryName}.</p>
                    ) : (
                      list.map((booking) => (
                        <div
                          key={booking.id}
                          onClick={() => setSelectedBooking(booking)}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 hover:bg-amber-50/50 rounded-xl transition-colors cursor-pointer gap-2"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full bg-[#C5A059] mt-2 shrink-0"></div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-gray-900 text-xs">{booking.reference}</span>
                                <span className="font-bold text-gray-800 text-xs">{booking.customerName}</span>
                                <span>{getStatusBadge(booking.status)}</span>
                              </div>
                              <div className="text-[11px] text-gray-500 mt-1 flex flex-wrap items-center gap-3">
                                <span>📞 {booking.customerPhone}</span>
                                <span>✉️ {booking.customerEmail}</span>
                                <span>👥 {booking.adultsCount} Adults{booking.infantsCount ? `, ${booking.infantsCount} Infants` : ''}</span>
                                {booking.startDate && <span>📅 {formatDateDDMMYYYY(booking.startDate)}</span>}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                            <span className="text-[11px] text-gray-400">
                              {booking.createdAt ? formatDateDDMMYYYY(booking.createdAt) : 'Recent'}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedBooking(booking)
                              }}
                              className="px-2.5 py-1 bg-gray-100 hover:bg-[#1E1E1E] hover:text-[#F9C344] text-gray-700 text-xs rounded-lg font-medium transition-all"
                            >
                              Inspect Details
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* DETAIL VIEW MODAL / DRAWER */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-100">
            {/* Modal Header */}
            <div className="px-6 py-5 bg-[#1E1E1E] text-white flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#F9C344]">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold tracking-tight">Booking Query Details</h2>
                    <span className="font-mono text-xs text-[#F9C344] bg-[#F9C344]/10 px-2 py-0.5 rounded border border-[#F9C344]/30">
                      {selectedBooking.reference}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Received on {selectedBooking.createdAt ? formatDateTimeDDMMYYYY(selectedBooking.createdAt) : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Download PDF Button */}
                <button
                  onClick={() => printBookingToPdf(selectedBooking)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#C5A059] hover:bg-[#d6b068] text-black font-bold text-xs rounded-xl transition-all shadow-sm"
                  title="Download / Print this booking inquiry as PDF"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>

                <button
                  onClick={() => setSelectedBooking(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-gray-700 bg-[#FAFAFA]">
              {/* Quick Status Bar & Actions */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-900 text-sm">Status:</span>
                  <div>{getStatusBadge(selectedBooking.status)}</div>
                </div>

                {/* Status Update Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-gray-400 text-[11px] font-medium mr-1">Mark as:</span>
                  {(['Pending', 'Contacted', 'Confirmed', 'Cancelled'] as const).map((st) => (
                    <button
                      key={st}
                      disabled={statusUpdating || selectedBooking.status === st}
                      onClick={() => handleStatusChange(selectedBooking.id, st)}
                      className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition-all ${
                        selectedBooking.status === st
                          ? 'bg-[#1E1E1E] text-[#F9C344] opacity-50 cursor-default'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* 1. Lead Passenger / Customer Profile */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                    <User className="w-4 h-4 text-[#C5A059]" />
                    Lead Passenger Profile
                  </h3>
                  <div className="flex items-center gap-2">
                    {/* WhatsApp Click to Chat */}
                    {selectedBooking.customerPhone && (
                      <a
                        href={`https://wa.me/${selectedBooking.customerPhone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-bold border border-emerald-200 text-[11px] transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        WhatsApp
                      </a>
                    )}
                    {/* Direct Email */}
                    {selectedBooking.customerEmail && (
                      <a
                        href={`mailto:${selectedBooking.customerEmail}?subject=Regarding Your Umrah Plus Inquiry (${selectedBooking.reference})`}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-bold border border-blue-200 text-[11px] transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        Email
                      </a>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                  <div>
                    <span className="text-gray-400 block text-[11px]">Full Name</span>
                    <span className="font-bold text-gray-900 text-sm">{selectedBooking.customerName}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">Phone / WhatsApp</span>
                    <span className="font-bold text-gray-900">{selectedBooking.customerPhone || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">Email Address</span>
                    <span className="font-bold text-gray-900">{selectedBooking.customerEmail || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">Nationality</span>
                    <span className="font-semibold text-gray-800">{selectedBooking.customerNationality || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">Total Pilgrims Breakdown</span>
                    <span className="font-semibold text-gray-800">
                      {selectedBooking.adultsCount || 1} Adults, {selectedBooking.infantsCount || 0} Infants
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">Travel Dates</span>
                    <span className="font-semibold text-gray-800">
                      {selectedBooking.startDate ? formatDateDDMMYYYY(selectedBooking.startDate) : 'Flexible'} {selectedBooking.endDate ? `➔ ${formatDateDDMMYYYY(selectedBooking.endDate)}` : ''}
                    </span>
                  </div>
                </div>

                {selectedBooking.customerNotes && (
                  <div className="mt-3 p-3 bg-amber-50/50 rounded-xl border border-amber-200/50">
                    <span className="text-amber-800 font-bold block text-[11px] mb-1">Special Pilgrim Notes / Requests:</span>
                    <p className="text-gray-700 italic">{selectedBooking.customerNotes}</p>
                  </div>
                )}
              </div>

              {/* 2. Hotel Accommodations (for Umrah & Umrah Plus only - not shown for pure Transport) */}
              {selectedBooking.bookingType !== 'Transport' && selectedBooking.stayDetails && (
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
                  <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2 border-b border-gray-100 pb-2">
                    <Hotel className="w-4 h-4 text-[#C5A059]" />
                    Accommodation Preferences
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Makkah Stay */}
                    {selectedBooking.stayDetails.makkahStay ? (
                      <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="font-bold text-gray-900 flex items-center gap-1.5 mb-2">
                          <span>🕋 Makkah Stay</span>
                        </div>
                        <div className="space-y-1 text-gray-600">
                          <div><span className="text-gray-400">Hotel Category:</span> <strong className="text-gray-800">{selectedBooking.stayDetails.makkahStay.hotelCategory || 'Standard'}</strong></div>
                          {selectedBooking.stayDetails.makkahStay.preferredHotel && (
                            <div><span className="text-gray-400">Preferred Hotel:</span> <strong className="text-[#C5A059]">{selectedBooking.stayDetails.makkahStay.preferredHotel}</strong></div>
                          )}
                          <div><span className="text-gray-400">Rooms:</span> <strong className="text-gray-800">{selectedBooking.stayDetails.makkahStay.rooms || 1} Room(s) {selectedBooking.stayDetails.makkahStay.nights ? `(${selectedBooking.stayDetails.makkahStay.nights} Nights)` : ''}</strong></div>
                          {(selectedBooking.stayDetails.makkahStay.checkInDate || selectedBooking.stayDetails.makkahStay.checkOutDate) && (
                            <div className="text-[11px] text-gray-500 pt-1.5 mt-1 border-t border-gray-200/80">
                              <span className="text-gray-400 font-semibold">Schedule:</span> Check-in: {selectedBooking.stayDetails.makkahStay.checkInDate ? formatDateDDMMYYYY(selectedBooking.stayDetails.makkahStay.checkInDate) : 'TBD'} ({selectedBooking.stayDetails.makkahStay.checkInTime || '14:00'}) ➔ Check-out: {selectedBooking.stayDetails.makkahStay.checkOutDate ? formatDateDDMMYYYY(selectedBooking.stayDetails.makkahStay.checkOutDate) : 'TBD'} ({selectedBooking.stayDetails.makkahStay.checkOutTime || '12:00'})
                            </div>
                          )}
                        </div>
                      </div>
                    ) : null}

                    {/* Madinah Stay */}
                    {selectedBooking.stayDetails.madinahStay?.included ? (
                      <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="font-bold text-gray-900 flex items-center gap-1.5 mb-2">
                          <span>🕌 Madinah Stay</span>
                        </div>
                        <div className="space-y-1 text-gray-600">
                          <div><span className="text-gray-400">Hotel Category:</span> <strong className="text-gray-800">{selectedBooking.stayDetails.madinahStay.hotelCategory || 'Standard'}</strong></div>
                          {selectedBooking.stayDetails.madinahStay.preferredHotel && (
                            <div><span className="text-gray-400">Preferred Hotel:</span> <strong className="text-[#C5A059]">{selectedBooking.stayDetails.madinahStay.preferredHotel}</strong></div>
                          )}
                          <div><span className="text-gray-400">Rooms:</span> <strong className="text-gray-800">{selectedBooking.stayDetails.madinahStay.rooms || 1} Room(s) {selectedBooking.stayDetails.madinahStay.nights ? `(${selectedBooking.stayDetails.madinahStay.nights} Nights)` : ''}</strong></div>
                          {(selectedBooking.stayDetails.madinahStay.checkInDate || selectedBooking.stayDetails.madinahStay.checkOutDate) && (
                            <div className="text-[11px] text-gray-500 pt-1.5 mt-1 border-t border-gray-200/80">
                              <span className="text-gray-400 font-semibold">Schedule:</span> Check-in: {selectedBooking.stayDetails.madinahStay.checkInDate ? formatDateDDMMYYYY(selectedBooking.stayDetails.madinahStay.checkInDate) : 'TBD'} ({selectedBooking.stayDetails.madinahStay.checkInTime || '14:00'}) ➔ Check-out: {selectedBooking.stayDetails.madinahStay.checkOutDate ? formatDateDDMMYYYY(selectedBooking.stayDetails.madinahStay.checkOutDate) : 'TBD'} ({selectedBooking.stayDetails.madinahStay.checkOutTime || '12:00'})
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="p-3.5 bg-gray-50/50 rounded-xl border border-dashed border-gray-200 flex items-center justify-center text-gray-400">
                        Madinah stay not requested
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 3. Transportation & Fleet Details */}
              {(() => {
                const trans = selectedBooking.transportDetails 
                  || selectedBooking.fullSubmissionPayload?.transportDetails 
                  || selectedBooking.fullSubmissionPayload?.transportation 
                  || selectedBooking.fullSubmissionPayload?.transportBooking;

                return (
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                        <Car className="w-4 h-4 text-[#C5A059]" />
                        Transportation & Fleet Details
                      </h3>
                      {trans?.mode && (
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 uppercase tracking-wide">
                          {trans.mode === 'fixed' ? 'Fixed Route' : 'Point-to-Point Transfer'}
                        </span>
                      )}
                    </div>

                    {trans ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          <div>
                            <span className="text-gray-400 block text-[11px]">Selected Vehicle</span>
                            <span className="font-bold text-gray-900 text-sm">
                              {trans.selectedVehicle || trans.vehicleName || 'Standard Chauffeur Vehicle'}
                            </span>
                          </div>

                          {trans.price && (
                            <div>
                              <span className="text-gray-400 block text-[11px]">Estimated Fare</span>
                              <span className="font-bold text-[#C5A059] text-sm">
                                AED {trans.price}
                              </span>
                            </div>
                          )}

                          {trans.luggageCount !== undefined && (
                            <div>
                              <span className="text-gray-400 block text-[11px]">Luggage Bags</span>
                              <span className="font-bold text-gray-900 text-sm">
                                {trans.luggageCount} Luggage Bags
                              </span>
                            </div>
                          )}
                        </div>

                        {trans.route && (
                          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                            <span className="text-gray-400 block text-[11px] font-semibold uppercase tracking-wider mb-1">Route Details</span>
                            <span className="font-bold text-gray-900 text-sm block">
                              {trans.route}
                            </span>
                            {trans.routeDetails && (
                              <span className="text-xs text-[#C5A059] font-medium block mt-0.5">
                                {trans.routeDetails}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Fixed Route Scheduled Stops */}
                        {trans.legs && Array.isArray(trans.legs) && trans.legs.length > 0 && (
                          <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-200/80 space-y-2">
                            <span className="font-bold text-amber-900 block text-xs uppercase tracking-wider">
                              Scheduled Route Stops & Timings:
                            </span>
                            <div className="space-y-1.5">
                              {trans.legs.map((leg: any, idx: number) => (
                                <div key={idx} className="text-xs bg-white p-3 rounded-lg border border-amber-100 shadow-2xs space-y-2">
                                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2">
                                    <div className="font-semibold text-gray-800 flex items-center gap-1.5">
                                      <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-[10px]">
                                        {idx + 1}
                                      </span>
                                      <span className="font-bold text-gray-900">{leg.from}</span>
                                      <span className="text-amber-600 font-bold">➔</span>
                                      <span className="font-bold text-gray-900">{leg.to}</span>
                                    </div>
                                    <div className="text-amber-800 font-bold bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200 text-[11px]">
                                      📅 {leg.date ? formatDateDDMMYYYY(leg.date) : 'TBD'} • ⏰ {leg.time || '12:00'}
                                    </div>
                                  </div>

                                  {(leg.pickupLocation || leg.dropoffLocation) && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-gray-600">
                                      {leg.pickupLocation && (
                                        <div>
                                          <span className="text-gray-400 font-semibold block text-[10px] uppercase">Pickup Hotel / Location:</span>
                                          <span className="text-gray-800 font-medium">{leg.pickupLocation}</span>
                                        </div>
                                      )}
                                      {leg.dropoffLocation && (
                                        <div>
                                          <span className="text-gray-400 font-semibold block text-[10px] uppercase">Drop-off Hotel / Location:</span>
                                          <span className="text-gray-800 font-medium">{leg.dropoffLocation}</span>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {leg.flightNo && (
                                    <div className="text-[11px] text-amber-700 bg-amber-50/80 px-2 py-1 rounded border border-amber-200/60 font-medium flex items-center gap-1.5">
                                      <span>✈️ Flight No. / Terminal:</span>
                                      <strong>{leg.flightNo}</strong>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Point-to-Point Transfer Details */}
                        {trans.pointToPoint && (
                          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-2 text-xs">
                            <span className="font-bold text-gray-800 block text-xs">Point-to-Point Transfer Details:</span>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div><span className="text-gray-400 block text-[11px]">Pickup Location:</span> <strong>{trans.pointToPoint.pickupLocation || trans.pointToPoint.pickup || 'Address TBD'}</strong></div>
                              <div><span className="text-gray-400 block text-[11px]">Drop-off Location:</span> <strong>{trans.pointToPoint.dropoffLocation || trans.pointToPoint.dropoff || 'Address TBD'}</strong></div>
                              <div><span className="text-gray-400 block text-[11px]">Scheduled Date & Time:</span> <strong className="text-[#C5A059]">{(trans.pointToPoint.pickupDate || trans.pointToPoint.date) ? formatDateDDMMYYYY(trans.pointToPoint.pickupDate || trans.pointToPoint.date) : 'TBD'} at {trans.pointToPoint.pickupTime || trans.pointToPoint.time || '14:00'}</strong></div>
                              {trans.pointToPoint.flightNo && (
                                <div><span className="text-gray-400 block text-[11px]">Flight Number:</span> <strong>{trans.pointToPoint.flightNo}</strong></div>
                              )}
                            </div>
                          </div>
                        )}

                        {trans.singleRoutes && (
                          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                            <span className="font-bold text-gray-800 block mb-1 text-[11px]">Single Routes Configured:</span>
                            <ul className="space-y-1 list-disc list-inside text-gray-600 text-xs">
                              {trans.singleRoutes.airportTransfer && (
                                <li>Airport ➔ Hotel ➔ Airport Transfer</li>
                              )}
                              {trans.singleRoutes.oneDayTrip && (
                                <li>1 Day Trip ({trans.singleRoutes.oneDayTripDays} day/s)</li>
                              )}
                              {trans.singleRoutes.halfDayTrip && (
                                <li>Half Day Trip ({trans.singleRoutes.halfDayTripDays} day/s)</li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-400 italic text-xs">Transportation not requested (Self-arranged by pilgrim)</p>
                    )}
                  </div>
                );
              })()}

              {/* 4. Sacred Ziyarat Excursions & Sites */}
              {selectedBooking.ziyaratDetails && (
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
                  <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2 border-b border-gray-100 pb-2">
                    <Compass className="w-4 h-4 text-purple-600" />
                    Ziyarat Excursion & Sacred Sites
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-2">
                    <div>
                      <span className="text-gray-400 block text-[11px]">Ziyarat Vehicle</span>
                      <span className="font-bold text-gray-900">
                        {selectedBooking.ziyaratDetails.vehicle || 'Not specified'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[11px]">Total Pilgrims</span>
                      <span className="font-bold text-gray-900">
                        {selectedBooking.ziyaratDetails.passengers || selectedBooking.adultsCount || 1} Pilgrims
                      </span>
                    </div>
                    {selectedBooking.ziyaratDetails.totalEstimatedCost && (
                      <div className="md:col-span-3 pt-2 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-600">Total Route Fare:</span>
                        <span className="text-sm font-bold text-amber-600">
                          SAR {selectedBooking.ziyaratDetails.totalEstimatedCost}
                        </span>
                      </div>
                    )}
                  </div>

                  {selectedBooking.ziyaratDetails.selectedRoutes && selectedBooking.ziyaratDetails.selectedRoutes.length > 0 && (
                    <div className="space-y-2 mt-2">
                      <span className="font-bold text-gray-800 block text-[11px]">Chosen Sacred Routes & Dates:</span>
                      <div className="grid grid-cols-1 gap-2">
                        {selectedBooking.ziyaratDetails.selectedRoutes.map((route: any, idx: number) => (
                          <div key={idx} className="p-3.5 bg-purple-50/50 rounded-xl border border-purple-100">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <span className="font-bold text-purple-950 text-xs">
                                {route.city}: {route.name}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] font-bold text-purple-800 bg-purple-100 border border-purple-200 px-2 py-0.5 rounded flex items-center gap-1">
                                  📅 Date: {route.date ? formatDateDDMMYYYY(route.date) : 'TBD'}
                                </span>
                                {route.price && (
                                  <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                                    SAR {route.price}
                                  </span>
                                )}
                                <span className="text-[11px] font-semibold text-gray-600 bg-white border border-gray-200 px-2 py-0.5 rounded">
                                  {route.duration}
                                </span>
                              </div>
                            </div>
                            {route.sites && Array.isArray(route.sites) && route.sites.length > 0 && (
                              <div className="mt-2 text-[11px] text-gray-600">
                                <span className="font-medium text-gray-500">Key Sites: </span>
                                {route.sites.map((s: any) => (typeof s === 'string' ? s : s.name)).join(', ')}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 5. Add-ons & Raw Submission Data */}
              {selectedBooking.fullSubmissionPayload?.selectedUpsells && (
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-2">
                  <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2 border-b border-gray-100 pb-2">
                    <Sparkles className="w-4 h-4 text-[#C5A059]" />
                    Add-ons & Spiritual Experiences
                  </h3>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {selectedBooking.fullSubmissionPayload.selectedUpsells.map((addon: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-amber-50 text-amber-900 font-semibold rounded-lg border border-amber-200 text-xs">
                        ✓ {addon}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-100 border-t border-gray-200 flex items-center justify-between">
              <div className="text-gray-500 text-[11px]">
                Internal Booking ID: <span className="font-mono">{selectedBooking.id}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => printBookingToPdf(selectedBooking)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#C5A059] hover:bg-[#d6b068] text-black rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="px-5 py-2 bg-[#1E1E1E] text-white hover:bg-black rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  Close View
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
