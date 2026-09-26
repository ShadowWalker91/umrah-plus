/**
 * Utility functions to export booking inquiries to CSV format and
 * generate a clean, printable PDF document for individual bookings.
 */

import { formatDateDDMMYYYY, formatDateTimeDDMMYYYY } from '@/lib/utils';

// Helper to sanitize CSV field values
function escapeCsvField(val: any): string {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

/**
 * Export a list of bookings (all or currently filtered) as a CSV file.
 */
export function exportBookingsToCsv(bookings: any[], filename = 'umrah_plus_bookings.csv') {
  if (!bookings || bookings.length === 0) {
    alert('No bookings available to export.');
    return;
  }

  const headers = [
    'Reference ID',
    'Booking Category',
    'Status',
    'Customer Name',
    'Phone / WhatsApp',
    'Email Address',
    'Nationality',
    'Adults',
    'Infants',
    'Start Date',
    'End Date',
    'Makkah Hotel Category',
    'Makkah Preferred Hotel',
    'Makkah Check-in Schedule',
    'Makkah Check-out Schedule',
    'Makkah Nights',
    'Makkah Rooms',
    'Madinah Included',
    'Madinah Hotel Category',
    'Madinah Preferred Hotel',
    'Madinah Check-in Schedule',
    'Madinah Check-out Schedule',
    'Madinah Nights',
    'Madinah Rooms',
    'Transportation Vehicle',
    'Transportation Route',
    'Single Routes',
    'Ziyarat Vehicle',
    'Ziyarat Sacred Routes & Sites',
    'Add-ons & Upsells',
    'Customer Special Notes',
    'Date Submitted',
  ];

  const rows = bookings.map((b) => {
    // Extract accommodation details
    const makkah = b.stayDetails?.makkahStay || {};
    const madinah = b.stayDetails?.madinahStay || {};

    const makkahCheckIn = makkah.checkInDate ? `${formatDateDDMMYYYY(makkah.checkInDate)} (${makkah.checkInTime || '14:00'})` : '';
    const makkahCheckOut = makkah.checkOutDate ? `${formatDateDDMMYYYY(makkah.checkOutDate)} (${makkah.checkOutTime || '12:00'})` : '';
    const madinahCheckIn = madinah.checkInDate ? `${formatDateDDMMYYYY(madinah.checkInDate)} (${madinah.checkInTime || '14:00'})` : '';
    const madinahCheckOut = madinah.checkOutDate ? `${formatDateDDMMYYYY(madinah.checkOutDate)} (${madinah.checkOutTime || '12:00'})` : '';

    // Extract transport details
    const trans = b.transportDetails || {};
    const singleRoutesStr = trans.singleRoutes
      ? [
          trans.singleRoutes.airportTransfer ? 'Airport Transfer' : null,
          trans.singleRoutes.oneDayTrip ? `1 Day Trip (${trans.singleRoutes.oneDayTripDays}d)` : null,
          trans.singleRoutes.halfDayTrip ? `Half Day Trip (${trans.singleRoutes.halfDayTripDays}d)` : null,
        ].filter(Boolean).join('; ')
      : '';

    // Extract Ziyarat details
    const ziyarat = b.ziyaratDetails || {};
    const ziyaratRoutesStr = ziyarat.selectedRoutes
      ? ziyarat.selectedRoutes
          .map((r: any) => {
            const dateStr = r.date ? ` [Date: ${formatDateDDMMYYYY(r.date)}]` : '';
            const fareStr = r.price ? ` [Fare: SAR ${r.price}]` : '';
            const sites = r.sites ? ` [Sites: ${Array.isArray(r.sites) ? r.sites.map((s: any) => typeof s === 'string' ? s : s.name).join(', ') : ''}]` : '';
            return `${r.city}: ${r.name}${dateStr} (${r.duration})${fareStr}${sites}`;
          })
          .join(' | ')
      : '';

    // Extract upsells
    const upsellsStr = b.fullSubmissionPayload?.selectedUpsells
      ? b.fullSubmissionPayload.selectedUpsells.join('; ')
      : '';

    const submissionDate = b.createdAt ? formatDateTimeDDMMYYYY(b.createdAt) : '';

    return [
      escapeCsvField(b.reference || b.id),
      escapeCsvField(b.bookingType),
      escapeCsvField(b.status),
      escapeCsvField(b.customerName),
      escapeCsvField(b.customerPhone),
      escapeCsvField(b.customerEmail),
      escapeCsvField(b.customerNationality),
      escapeCsvField(b.adultsCount ?? 1),
      escapeCsvField(b.infantsCount ?? 0),
      escapeCsvField(b.startDate ? formatDateDDMMYYYY(b.startDate) : 'Flexible'),
      escapeCsvField(b.endDate ? formatDateDDMMYYYY(b.endDate) : ''),
      escapeCsvField(makkah.hotelCategory || ''),
      escapeCsvField(makkah.preferredHotel || ''),
      escapeCsvField(makkahCheckIn),
      escapeCsvField(makkahCheckOut),
      escapeCsvField(makkah.nights || ''),
      escapeCsvField(makkah.rooms || ''),
      escapeCsvField(madinah.included ? 'Yes' : 'No'),
      escapeCsvField(madinah.hotelCategory || ''),
      escapeCsvField(madinah.preferredHotel || ''),
      escapeCsvField(madinahCheckIn),
      escapeCsvField(madinahCheckOut),
      escapeCsvField(madinah.nights || ''),
      escapeCsvField(madinah.rooms || ''),
      escapeCsvField(trans.selectedVehicle || ''),
      escapeCsvField(trans.route || ''),
      escapeCsvField(singleRoutesStr),
      escapeCsvField(ziyarat.vehicle || ''),
      escapeCsvField(ziyaratRoutesStr),
      escapeCsvField(upsellsStr),
      escapeCsvField(b.customerNotes || ''),
      escapeCsvField(submissionDate),
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.map(escapeCsvField).join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

const ROUTE_DETAILS_MAP: Record<string, string> = {
  'Round Trip Package 01': 'JED Airport ➔ Makkah ➔ Madinah ➔ MED Airport',
  'Round Trip Package 02': 'MED Airport ➔ Madinah ➔ Makkah ➔ JED Airport',
  'Round Trip Package 03': 'JED Airport ➔ Makkah ➔ Madinah ➔ Makkah ➔ JED Airport',
  'Round Trip Package 04': 'JED Airport ➔ Makkah ➔ Madinah ➔ JED Airport',
  'Route 01': 'JED Airport ➔ Makkah ➔ Madinah ➔ MED Airport',
  'Route 02': 'MED Airport ➔ Madinah ➔ Makkah ➔ JED Airport',
  'Route 03': 'JED Airport ➔ Makkah ➔ Madinah ➔ Makkah ➔ JED Airport',
  'Route 04': 'JED Airport ➔ Makkah ➔ Madinah ➔ JED Airport',
};

/**
 * Print / Save an individual booking as a branded PDF document.
 * Opens an isolated print window with Umrah Plus gold/black luxury styling,
 * formatting all details entered by the client.
 */
export function printBookingToPdf(b: any) {
  if (!b) return;

  const makkah = b.stayDetails?.makkahStay;
  const madinah = b.stayDetails?.madinahStay;
  const trans = b.transportDetails 
    || b.fullSubmissionPayload?.transportDetails 
    || b.fullSubmissionPayload?.transportation 
    || b.fullSubmissionPayload?.transportBooking;
  const ziyarat = b.ziyaratDetails;
  const upsells = b.fullSubmissionPayload?.selectedUpsells;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Umrah Plus - Booking Query ${b.reference || b.id}</title>
  <style>
    @page {
      size: A4;
      margin: 18mm 15mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1a202c;
      margin: 0;
      padding: 0;
      background: #fff;
      font-size: 13px;
      line-height: 1.5;
    }
    .header {
      background: #111215;
      color: #fff;
      padding: 24px 30px;
      border-radius: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 4px solid #C5A059;
      margin-bottom: 24px;
    }
    .brand-title {
      font-size: 24px;
      font-weight: 800;
      color: #C5A059;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin: 0;
    }
    .brand-sub {
      font-size: 11px;
      color: #a0aec0;
      letter-spacing: 1px;
      margin-top: 4px;
      text-transform: uppercase;
    }
    .ref-badge {
      text-align: right;
    }
    .ref-no {
      font-size: 18px;
      font-weight: 800;
      color: #F9C344;
      font-family: monospace;
      margin: 0;
    }
    .ref-date {
      font-size: 11px;
      color: #a0aec0;
      margin-top: 4px;
    }
    .card {
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 16px 20px;
      margin-bottom: 18px;
      background: #fff;
      page-break-inside: avoid;
    }
    .card-title {
      font-size: 13px;
      font-weight: 700;
      color: #C5A059;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin: 0 0 12px 0;
      padding-bottom: 6px;
      border-bottom: 1px solid #edf2f7;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px 24px;
    }
    .grid-3 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 12px 20px;
    }
    .field-label {
      font-size: 10px;
      color: #718096;
      text-transform: uppercase;
      font-weight: 600;
      display: block;
      margin-bottom: 2px;
    }
    .field-val {
      font-size: 13px;
      font-weight: 600;
      color: #1a202c;
    }
    .notes-box {
      background: #fffdf5;
      border: 1px solid #fef3c7;
      border-radius: 8px;
      padding: 12px;
      margin-top: 10px;
      font-style: italic;
      color: #92400e;
    }
    .subcard {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px 16px;
    }
    .subcard-title {
      font-weight: 700;
      font-size: 12px;
      color: #2d3748;
      margin-bottom: 6px;
    }
    .route-item {
      background: #faf5ff;
      border: 1px solid #f3e8ff;
      border-radius: 8px;
      padding: 10px 14px;
      margin-bottom: 8px;
    }
    .route-header {
      display: flex;
      justify-content: space-between;
      font-weight: 700;
      color: #581c87;
      font-size: 12px;
    }
    .route-sites {
      font-size: 11px;
      color: #4b5563;
      margin-top: 4px;
    }
    .badge {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
    }
    .badge-status {
      background: #fef3c7;
      color: #92400e;
      border: 1px solid #fde68a;
    }
    .badge-type {
      background: #f3f4f6;
      color: #1f2937;
      border: 1px solid #e5e7eb;
    }
    .tag {
      display: inline-block;
      padding: 4px 10px;
      background: #fffbeb;
      border: 1px solid #fde68a;
      color: #92400e;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      margin-right: 6px;
      margin-bottom: 6px;
    }
    .footer {
      text-align: center;
      margin-top: 24px;
      font-size: 11px;
      color: #a0aec0;
      border-top: 1px solid #edf2f7;
      padding-top: 16px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1 class="brand-title">Umrah Plus</h1>
      <div class="brand-sub">Sacred Ziyarat & Spiritual Journeys • Inquiry Dossier</div>
    </div>
    <div class="ref-badge">
      <div class="ref-no">${b.reference || b.id}</div>
      <div class="ref-date">Received: ${b.createdAt ? formatDateTimeDDMMYYYY(b.createdAt) : 'N/A'}</div>
      <div style="margin-top: 6px;">
        <span class="badge badge-type">${b.bookingType}</span>
        <span class="badge badge-status">${b.status}</span>
      </div>
    </div>
  </div>

  <!-- 1. Lead Passenger Profile -->
  <div class="card">
    <div class="card-title">1. Lead Passenger & Pilgrim Profile</div>
    <div class="grid-3">
      <div>
        <span class="field-label">Full Name</span>
        <div class="field-val">${b.customerName || 'N/A'}</div>
      </div>
      <div>
        <span class="field-label">Phone / WhatsApp</span>
        <div class="field-val">${b.customerPhone || 'N/A'}</div>
      </div>
      <div>
        <span class="field-label">Email Address</span>
        <div class="field-val">${b.customerEmail || 'N/A'}</div>
      </div>
      <div>
        <span class="field-label">Nationality</span>
        <div class="field-val">${b.customerNationality || 'Not Specified'}</div>
      </div>
      <div>
        <span class="field-label">Guests Breakdown</span>
        <div class="field-val">${b.adultsCount || 1} Adults, ${b.infantsCount || 0} Infants</div>
      </div>
      <div>
        <span class="field-label">Travel Dates</span>
        <div class="field-val">${b.startDate ? formatDateDDMMYYYY(b.startDate) : 'Flexible'} ${b.endDate ? `to ${formatDateDDMMYYYY(b.endDate)}` : ''}</div>
      </div>
    </div>

    ${b.customerNotes ? `
      <div class="notes-box">
        <strong>Special Requests / Notes from Pilgrim:</strong><br/>
        ${b.customerNotes}
      </div>
    ` : ''}
  </div>

  <!-- 2. Stay & Accommodations (for Umrah & Umrah Plus only) -->
  ${b.bookingType !== 'Transport' && b.stayDetails ? `
    <div class="card">
      <div class="card-title">2. Accommodation Preferences</div>
      <div class="grid-2">
        ${makkah ? `
          <div class="subcard">
            <div class="subcard-title">🕋 Makkah Stay</div>
            <div><strong>Hotel Category:</strong> ${makkah.hotelCategory || 'Standard'}</div>
            ${makkah.preferredHotel ? `<div><strong>Preferred Hotel:</strong> <span style="color:#C5A059; font-weight:700;">${makkah.preferredHotel}</span></div>` : ''}
            <div><strong>Rooms:</strong> ${makkah.rooms || 1} Room(s) ${makkah.nights ? `(${makkah.nights} Nights)` : ''}</div>
            ${(makkah.checkInDate || makkah.checkOutDate) ? `
              <div style="font-size: 11px; color: #718096; margin-top: 6px; padding-top: 6px; border-top: 1px dashed #e2e8f0;">
                <strong>Schedule:</strong> Check-in: ${makkah.checkInDate ? formatDateDDMMYYYY(makkah.checkInDate) : 'TBD'} (${makkah.checkInTime || '14:00'}) ➔ Check-out: ${makkah.checkOutDate ? formatDateDDMMYYYY(makkah.checkOutDate) : 'TBD'} (${makkah.checkOutTime || '12:00'})
              </div>
            ` : ''}
          </div>
        ` : ''}

        ${madinah?.included ? `
          <div class="subcard">
            <div class="subcard-title">🕌 Madinah Stay</div>
            <div><strong>Hotel Category:</strong> ${madinah.hotelCategory || 'Standard'}</div>
            ${madinah.preferredHotel ? `<div><strong>Preferred Hotel:</strong> <span style="color:#C5A059; font-weight:700;">${madinah.preferredHotel}</span></div>` : ''}
            <div><strong>Rooms:</strong> ${madinah.rooms || 1} Room(s) ${madinah.nights ? `(${madinah.nights} Nights)` : ''}</div>
            ${(madinah.checkInDate || madinah.checkOutDate) ? `
              <div style="font-size: 11px; color: #718096; margin-top: 6px; padding-top: 6px; border-top: 1px dashed #e2e8f0;">
                <strong>Schedule:</strong> Check-in: ${madinah.checkInDate ? formatDateDDMMYYYY(madinah.checkInDate) : 'TBD'} (${madinah.checkInTime || '14:00'}) ➔ Check-out: ${madinah.checkOutDate ? formatDateDDMMYYYY(madinah.checkOutDate) : 'TBD'} (${madinah.checkOutTime || '12:00'})
              </div>
            ` : ''}
          </div>
        ` : `
          <div class="subcard" style="display:flex; align-items:center; justify-content:center; color:#718096; font-style:italic;">
            Madinah Stay not requested
          </div>
        `}
      </div>
    </div>
  ` : ''}

  <!-- 3. Transportation -->
  <div class="card">
    <div class="card-title">3. Transportation & Fleet Itinerary</div>
    ${trans ? `
      <div class="grid-3" style="margin-bottom: 12px;">
        <div>
          <span class="field-label">Service Mode</span>
          <div class="field-val">${trans.mode === 'fixed' ? 'Fixed Route' : (trans.mode === 'pointToPoint' ? 'Point-to-Point Transfer' : 'Private Chauffeur')}</div>
        </div>
        <div>
          <span class="field-label">Fleet Vehicle</span>
          <div class="field-val">${trans.selectedVehicle || 'Standard Vehicle'}</div>
        </div>
        ${trans.price ? `
          <div>
            <span class="field-label">Total Estimated Fare</span>
            <div class="field-val" style="color:#C5A059; font-weight:bold;">AED ${trans.price}</div>
          </div>
        ` : ''}
        ${trans.luggageCount !== undefined ? `
          <div>
            <span class="field-label">Luggage Bags</span>
            <div class="field-val">${trans.luggageCount} Bags</div>
          </div>
        ` : ''}
      </div>

      ${trans.route ? `
        <div style="margin-bottom: 10px;">
          <span class="field-label">Route Summary</span>
          <div class="field-val">${trans.route}</div>
          ${(ROUTE_DETAILS_MAP[trans.route] || trans.routeDetails) ? `
            <div style="font-size: 11px; color: #C5A059; font-weight: 600; margin-top: 3px;">
              ${ROUTE_DETAILS_MAP[trans.route] || trans.routeDetails}
            </div>
          ` : ''}
        </div>
      ` : ''}

      ${trans.legs && Array.isArray(trans.legs) && trans.legs.length > 0 ? `
        <div class="subcard" style="margin-top: 10px;">
          <div class="subcard-title">Scheduled Route Stops & Timings:</div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${trans.legs.map((leg: any, idx: number) => `
              <div style="font-size: 12px; padding: 10px 12px; background: #fff; border-radius: 6px; border: 1px solid #edf2f7; display: flex; flex-direction: column; gap: 4px;">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f7fafc; padding-bottom: 4px;">
                  <div><strong>Stop ${idx + 1}:</strong> <span style="color: #2d3748;">${leg.from} ➔ ${leg.to}</span></div>
                  <div style="color: #2b6cb0; font-weight: 700;">📅 Date: ${leg.date ? formatDateDDMMYYYY(leg.date) : 'TBD'} at ⏰ ${leg.time || '12:00'}</div>
                </div>
                ${(leg.pickupLocation || leg.dropoffLocation) ? `
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 11px; color: #4a5568; margin-top: 2px;">
                    ${leg.pickupLocation ? `<div><strong>Pickup Hotel/Location:</strong> ${leg.pickupLocation}</div>` : ''}
                    ${leg.dropoffLocation ? `<div><strong>Drop-off Hotel/Location:</strong> ${leg.dropoffLocation}</div>` : ''}
                  </div>
                ` : ''}
                ${leg.flightNo ? `
                  <div style="font-size: 11px; color: #b7791f; font-weight: 600; margin-top: 2px;">
                    ✈️ Flight No. / Terminal: ${leg.flightNo}
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${trans.pointToPoint ? `
        <div class="subcard" style="margin-top: 10px;">
          <div class="subcard-title">Point-to-Point Transfer Details:</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 12px; margin-top: 6px;">
            <div><strong>Pickup:</strong> ${trans.pointToPoint.pickupLocation || trans.pointToPoint.pickup || 'Address TBD'}</div>
            <div><strong>Drop-off:</strong> ${trans.pointToPoint.dropoffLocation || trans.pointToPoint.dropoff || 'Address TBD'}</div>
            <div><strong>Schedule:</strong> ${(trans.pointToPoint.pickupDate || trans.pointToPoint.date) ? formatDateDDMMYYYY(trans.pointToPoint.pickupDate || trans.pointToPoint.date) : 'TBD'} at ${trans.pointToPoint.pickupTime || trans.pointToPoint.time || '14:00'}</div>
            ${trans.pointToPoint.flightNo ? `<div><strong>Flight:</strong> ${trans.pointToPoint.flightNo}</div>` : ''}
          </div>
        </div>
      ` : ''}

      ${trans.singleRoutes ? `
        <div class="subcard" style="margin-top: 10px;">
          <div class="subcard-title">Single Routes Configured:</div>
          <ul style="margin: 0; padding-left: 18px; color: #4a5568;">
            ${trans.singleRoutes.airportTransfer ? '<li>Airport ➔ Hotel ➔ Airport Transfer</li>' : ''}
            ${trans.singleRoutes.oneDayTrip ? `<li>1 Day Trip (${trans.singleRoutes.oneDayTripDays} day/s)</li>` : ''}
            ${trans.singleRoutes.halfDayTrip ? `<li>Half Day Trip (${trans.singleRoutes.halfDayTripDays} day/s)</li>` : ''}
          </ul>
        </div>
      ` : ''}
    ` : `
      <div style="color: #718096; font-style: italic;">Transportation not requested (Self-arranged by pilgrim)</div>
    `}
  </div>

  <!-- 4. Ziyarat Routes & Sacred Sites -->
  ${ziyarat ? `
    <div class="card">
      <div class="card-title">4. Sacred Ziyarat Excursions & Historic Sites</div>
      <div class="grid-2" style="margin-bottom: 12px;">
        <div>
          <span class="field-label">Ziyarat Vehicle</span>
          <div class="field-val">${ziyarat.vehicle || 'Not specified'}</div>
        </div>
        <div>
          <span class="field-label">Total Pilgrims</span>
          <div class="field-val">${ziyarat.passengers || b.adultsCount || 1} Pilgrims</div>
        </div>
      </div>
      ${ziyarat.totalEstimatedCost ? `
        <div style="margin-bottom: 12px; padding: 8px 12px; background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 6px; font-size: 12px; color: #6b21a8; font-weight: 700;">
          Estimated Total Ziyarat Cost: SAR ${ziyarat.totalEstimatedCost}
        </div>
      ` : ''}

      ${ziyarat.selectedRoutes && ziyarat.selectedRoutes.length > 0 ? `
        <div>
          <span class="field-label" style="margin-bottom: 6px;">Requested Sacred Itineraries & Dates:</span>
          ${ziyarat.selectedRoutes.map((r: any) => `
            <div class="route-item">
              <div class="route-header">
                <span>${r.city}: ${r.name}</span>
                <span>${r.duration}</span>
              </div>
              <div style="color: #2b6cb0; font-weight: 700; font-size: 11px; margin-top: 4px;">
                📅 Scheduled Date: ${r.date ? formatDateDDMMYYYY(r.date) : 'TBD'}${r.price ? ` | Fare: SAR ${r.price}` : ''}
              </div>
              ${r.sites && Array.isArray(r.sites) && r.sites.length > 0 ? `
                <div class="route-sites" style="margin-top: 4px;">
                  <strong>Sites:</strong> ${r.sites.map((s: any) => typeof s === 'string' ? s : s.name).join(', ')}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}
    </div>
  ` : ''}

  <!-- 5. Add-ons -->
  ${upsells && upsells.length > 0 ? `
    <div class="card">
      <div class="card-title">5. Add-ons & Spiritual Experiences</div>
      <div>
        ${upsells.map((u: string) => `<span class="tag">✓ ${u}</span>`).join('')}
      </div>
    </div>
  ` : ''}

  <div class="footer">
    Umrah Plus Official Booking Management Record • Generated on ${formatDateTimeDDMMYYYY(new Date())}<br/>
    Confidential & Proprietary • Customer Inquiry Reference ${b.reference || b.id}
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 300);
    };
  </script>
</body>
</html>
  `;

  const printWindow = window.open('', '_blank', 'width=900,height=800');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  } else {
    alert('Please allow popups for this site to download the PDF.');
  }
}
