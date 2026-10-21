'use client';

import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { getBookingById, getLatestBooking } from '@/app/actions/bookingActions';
import { printBookingToPdf } from '@/lib/exportUtils';
import { formatDateDDMMYYYY } from '@/lib/utils';

const ROUTE_DETAILS_MAP: Record<string, string> = {
  'Round Trip Package 01': 'JED Airport -> Makkah -> Madinah -> MED Airport',
  'Round Trip Package 02': 'MED Airport -> Madinah -> Makkah -> JED Airport',
  'Round Trip Package 03': 'JED Airport -> Makkah -> Madinah -> Makkah -> JED Airport',
  'Round Trip Package 04': 'JED Airport -> Makkah -> Madinah -> JED Airport',
  'Route 01': 'JED Airport -> Makkah -> Madinah -> MED Airport',
  'Route 02': 'MED Airport -> Madinah -> Makkah -> JED Airport',
  'Route 03': 'JED Airport -> Makkah -> Madinah -> Makkah -> JED Airport',
  'Route 04': 'JED Airport -> Makkah -> Madinah -> JED Airport',
  'p1': 'JED Airport -> Makkah -> Madinah -> MED Airport',
  'p2': 'MED Airport -> Madinah -> Makkah -> JED Airport',
  'p3': 'JED Airport -> Makkah -> Madinah -> Makkah -> JED Airport',
  'p4': 'JED Airport -> Makkah -> Madinah -> JED Airport',
};

/**
 * Generates an ultra-crisp image of the top Dua header banner (Kaaba on left,
 * Madinah on right, Arabic calligraphy Dua & Umrah Plus branding in center)
 * to be embedded at the top of the PDF itinerary.
 */
async function createBannerImage(bookingRef: string, dateStr: string): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 240;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Failed to load ' + src));
        img.src = src;
      });
    };

    // 1. Dark base background
    ctx.fillStyle = '#0c0d10';
    ctx.fillRect(0, 0, 1200, 240);

    // 2. Left side: The Holy Kaaba with gradient overlay & gold arch
    try {
      const kaabaImg = await loadImage('/assets/images/makkah_kaaba.jpg');
      ctx.save();
      ctx.drawImage(kaabaImg, 0, 0, 320, 240);

      const leftGrad = ctx.createLinearGradient(0, 0, 320, 0);
      leftGrad.addColorStop(0, 'rgba(12, 13, 16, 0.4)');
      leftGrad.addColorStop(0.7, 'rgba(12, 13, 16, 0.75)');
      leftGrad.addColorStop(1, '#0c0d10');
      ctx.fillStyle = leftGrad;
      ctx.fillRect(0, 0, 320, 240);

      // Decorative gold arch
      ctx.strokeStyle = 'rgba(197, 160, 89, 0.65)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(140, 160, 115, Math.PI, 0, false);
      ctx.stroke();
      ctx.restore();
    } catch (e) {
      console.warn('Could not load Kaaba image for PDF:', e);
    }

    // 3. Right side: Madinah Prophet\'s Mosque with gradient overlay & gold arch
    try {
      const madinahImg = await loadImage('/assets/images/ziyarat/MadinahZiyaratCover.webp');
      ctx.save();
      ctx.drawImage(madinahImg, 1200 - 320, 0, 320, 240);

      const rightGrad = ctx.createLinearGradient(1200 - 320, 0, 1200, 0);
      rightGrad.addColorStop(0, '#0c0d10');
      rightGrad.addColorStop(0.3, 'rgba(12, 13, 16, 0.75)');
      rightGrad.addColorStop(1, 'rgba(12, 13, 16, 0.4)');
      ctx.fillStyle = rightGrad;
      ctx.fillRect(1200 - 320, 0, 320, 240);

      // Decorative gold arch
      ctx.strokeStyle = 'rgba(197, 160, 89, 0.65)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(1200 - 140, 160, 115, Math.PI, 0, false);
      ctx.stroke();
      ctx.restore();
    } catch (e) {
      console.warn('Could not load Madinah image for PDF:', e);
    }

    // 4. Outer Gold Border & Accents
    ctx.strokeStyle = '#c5a059';
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, 1200, 240);

    ctx.fillStyle = '#c5a059';
    ctx.fillRect(0, 234, 1200, 6);

    // 5. Center content
    ctx.textAlign = 'center';

    // Top logo title
    ctx.fillStyle = '#f3d38a';
    ctx.font = 'bold 24px "Times New Roman", serif';
    ctx.fillText('U M R A H   P L U S', 600, 48);

    // Arabic calligraphy Dua: لَتَقَبَّلَ اللَّهُ مِنَّا وَمِنْكُمْ
    ctx.fillStyle = '#e6c987';
    ctx.font = 'bold 42px "Traditional Arabic", "Amiri", "Scheherazade", "Playfair Display", serif';
    ctx.fillText('لَتَقَبَّلَ اللَّهُ مِنَّا وَمِنْكُمْ', 600, 108);

    // English subtitle
    ctx.fillStyle = '#c5a059';
    ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('M A Y   A L L A H   A C C E P T   Y O U R   B L E S S E D   J O U R N E Y', 600, 142);

    // Thin separator line
    ctx.strokeStyle = 'rgba(197, 160, 89, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(400, 164);
    ctx.lineTo(800, 164);
    ctx.stroke();

    // Bottom reference & date info
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`CUSTOM RESERVATION ITINERARY  •  REF: ${bookingRef}  •  DATE: ${dateStr}`, 600, 192);

    return canvas.toDataURL('image/jpeg', 0.95);
  } catch (err) {
    console.error('Failed to create banner canvas:', err);
    return null;
  }
}

export default function DownloadItineraryButton({ bookingId }: { bookingId: string }) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    try {
      setIsGenerating(true);

      // Fetch booking data
      let booking = bookingId ? await getBookingById(bookingId) : null;
      if (!booking) {
        booking = await getLatestBooking();
      }
      if (!booking) {
        alert("Could not find booking details.");
        setIsGenerating(false);
        return;
      }

      // Dynamic import of jsPDF to prevent SSR issues and avoid html2canvas lab() CSS errors
      const jspdfModule = await import('jspdf');
      const JsPdfClass = jspdfModule.jsPDF || (jspdfModule as any).default?.jsPDF || (jspdfModule as any).default;
      const doc = new JsPdfClass({ unit: 'mm', format: 'a4', orientation: 'portrait' });

      const gold: [number, number, number] = [197, 160, 89];
      const dark: [number, number, number] = [17, 18, 21];
      const cardBorder: [number, number, number] = [226, 232, 240];

      // 1. Header Banner — Render with Kaaba & Madinah Dua arched imagery
      const bannerDataUrl = await createBannerImage(
        booking.reference || booking.id,
        formatDateDDMMYYYY(new Date())
      );

      let y = 54;

      if (bannerDataUrl) {
        doc.addImage(bannerDataUrl, 'JPEG', 15, 12, 180, 36);
        doc.setFillColor(...gold);
        doc.rect(15, 48, 180, 1.2, 'F');
      } else {
        // Fallback text banner if canvas cannot render
        doc.setFillColor(...dark);
        doc.roundedRect(15, 15, 180, 26, 3, 3, 'F');
        doc.setFillColor(...gold);
        doc.rect(15, 39, 180, 2, 'F');

        doc.setTextColor(...gold);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.text('UMRAH PLUS', 22, 26);

        doc.setFontSize(9);
        doc.setTextColor(200, 200, 200);
        doc.setFont('helvetica', 'normal');
        doc.text('CUSTOM RESERVATION ITINERARY', 22, 33);

        doc.setTextColor(...gold);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text(booking.reference || booking.id, 140, 26);

        doc.setTextColor(180, 180, 180);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text('Date: ' + formatDateDDMMYYYY(new Date()), 140, 32);
        y = 47;
      }

      function checkPageBreak(neededHeight: number) {
        if (y + neededHeight > 260) {
          doc.addPage();
          y = 20;
        }
      }

      function drawCardHeader(title: string) {
        checkPageBreak(25);
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(15, y, 180, 7, 2, 2, 'F');
        doc.setDrawColor(...cardBorder);
        doc.roundedRect(15, y, 180, 7, 2, 2, 'S');
        doc.setTextColor(...gold);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text(title.toUpperCase(), 20, y + 5);
        y += 11;
      }

      // Section 1: Lead Pilgrim
      drawCardHeader('1. Lead Passenger Details');
      doc.setFontSize(9);
      doc.setTextColor(50, 50, 50);
      doc.setFont('helvetica', 'bold');
      doc.text('Full Name:', 20, y);
      doc.setFont('helvetica', 'normal');
      doc.text(booking.customerName || 'N/A', 55, y);

      doc.setFont('helvetica', 'bold');
      doc.text('Nationality:', 115, y);
      doc.setFont('helvetica', 'normal');
      doc.text(booking.customerNationality || 'N/A', 145, y);
      y += 6;

      doc.setFont('helvetica', 'bold');
      doc.text('Phone:', 20, y);
      doc.setFont('helvetica', 'normal');
      doc.text(booking.customerPhone || 'N/A', 55, y);

      doc.setFont('helvetica', 'bold');
      doc.text('Email:', 115, y);
      doc.setFont('helvetica', 'normal');
      doc.text(booking.customerEmail || 'N/A', 145, y);
      y += 6;

      if (booking.customerNotes) {
        doc.setFont('helvetica', 'bold');
        doc.text('Notes:', 20, y);
        doc.setFont('helvetica', 'italic');
        const splitNotes = doc.splitTextToSize(booking.customerNotes, 130);
        doc.text(splitNotes, 55, y);
        y += splitNotes.length * 5;
      }
      y += 4;

      // Section 2: Trip Overview
      drawCardHeader('2. Pilgrimage & Dates');
      doc.setFontSize(9);
      doc.setTextColor(50, 50, 50);
      doc.setFont('helvetica', 'bold');
      doc.text('Package Type:', 20, y);
      doc.setFont('helvetica', 'normal');
      doc.text(booking.bookingType || 'Umrah', 55, y);

      doc.setFont('helvetica', 'bold');
      doc.text('Total Pilgrims:', 115, y);
      doc.setFont('helvetica', 'normal');
      const pilgrimsCountStr = `${booking.adultsCount || 1} Pilgrim${(booking.adultsCount || 1) > 1 ? 's' : ''}${booking.infantsCount ? `, ${booking.infantsCount} Infants` : ''}`;
      doc.text(pilgrimsCountStr, 145, y);
      y += 6;

      doc.setFont('helvetica', 'bold');
      doc.text('Travel Dates:', 20, y);
      doc.setFont('helvetica', 'normal');
      doc.text(`${booking.startDate ? formatDateDDMMYYYY(booking.startDate) : 'Flexible'} ${booking.endDate ? `to ${formatDateDDMMYYYY(booking.endDate)}` : ''}`, 55, y);
      y += 10;

      // Section 3: Accommodation (for Umrah & Umrah Plus only)
      if (booking.bookingType !== 'Transport' && booking.stayDetails) {
        drawCardHeader('3. Accommodation Details');
        doc.setFontSize(9);
        doc.setTextColor(50, 50, 50);

        if (booking.stayDetails.makkahStay) {
          checkPageBreak(18);
          const mStay = booking.stayDetails.makkahStay;
          doc.setFont('helvetica', 'bold');
          doc.text('Makkah Stay:', 20, y);
          doc.setFont('helvetica', 'normal');
          const mNights = mStay.nights ? `${mStay.nights} Nights | ` : '';
          doc.text(`${mStay.hotelCategory || 'Standard'} Hotel | ${mNights}${mStay.rooms || 1} Room(s)`, 55, y);
          y += 5;

          if (mStay.preferredHotel) {
            checkPageBreak(6);
            doc.setFont('helvetica', 'bold');
            doc.text('Preferred Hotel:', 20, y);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...gold);
            doc.text(String(mStay.preferredHotel), 55, y);
            doc.setTextColor(50, 50, 50);
            y += 5;
          }

          if (mStay.checkInDate || mStay.checkOutDate) {
            checkPageBreak(6);
            doc.setFont('helvetica', 'bold');
            doc.text('Stay Schedule:', 20, y);
            doc.setFont('helvetica', 'normal');
            const cInStr = `${mStay.checkInDate ? formatDateDDMMYYYY(mStay.checkInDate) : 'TBD'}${mStay.checkInTime ? ` (${mStay.checkInTime})` : ''}`;
            const cOutStr = `${mStay.checkOutDate ? formatDateDDMMYYYY(mStay.checkOutDate) : 'TBD'}${mStay.checkOutTime ? ` (${mStay.checkOutTime})` : ''}`;
            doc.text(`Check-in: ${cInStr}  ->  Check-out: ${cOutStr}`, 55, y);
            y += 6;
          }
        }

        if (booking.stayDetails.madinahStay?.included) {
          checkPageBreak(18);
          const madStay = booking.stayDetails.madinahStay;
          doc.setFont('helvetica', 'bold');
          doc.text('Madinah Stay:', 20, y);
          doc.setFont('helvetica', 'normal');
          const madNights = madStay.nights ? `${madStay.nights} Nights | ` : '';
          doc.text(`${madStay.hotelCategory || 'Standard'} Hotel | ${madNights}${madStay.rooms || 1} Room(s)`, 55, y);
          y += 5;

          if (madStay.preferredHotel) {
            checkPageBreak(6);
            doc.setFont('helvetica', 'bold');
            doc.text('Preferred Hotel:', 20, y);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...gold);
            doc.text(String(madStay.preferredHotel), 55, y);
            doc.setTextColor(50, 50, 50);
            y += 5;
          }

          if (madStay.checkInDate || madStay.checkOutDate) {
            checkPageBreak(6);
            doc.setFont('helvetica', 'bold');
            doc.text('Stay Schedule:', 20, y);
            doc.setFont('helvetica', 'normal');
            const mInStr = `${madStay.checkInDate ? formatDateDDMMYYYY(madStay.checkInDate) : 'TBD'}${madStay.checkInTime ? ` (${madStay.checkInTime})` : ''}`;
            const mOutStr = `${madStay.checkOutDate ? formatDateDDMMYYYY(madStay.checkOutDate) : 'TBD'}${madStay.checkOutTime ? ` (${madStay.checkOutTime})` : ''}`;
            doc.text(`Check-in: ${mInStr}  ->  Check-out: ${mOutStr}`, 55, y);
            y += 6;
          }
        } else {
          checkPageBreak(8);
          doc.setFont('helvetica', 'bold');
          doc.text('Madinah Stay:', 20, y);
          doc.setFont('helvetica', 'italic');
          doc.text('Not requested', 55, y);
          y += 6;
        }
        y += 4;
      }

      // Section 4: Transportation & Route Details
      const transportData = booking.transportDetails 
        || booking.fullSubmissionPayload?.transportDetails 
        || booking.fullSubmissionPayload?.transportation 
        || booking.fullSubmissionPayload?.transportBooking;

      if (transportData) {
        drawCardHeader('4. Chauffeur & Transportation Itinerary');
        doc.setFontSize(9);
        doc.setTextColor(50, 50, 50);

        const isFixed = transportData.mode === 'fixed';

        doc.setFont('helvetica', 'bold');
        doc.text('Service Mode:', 20, y);
        doc.setFont('helvetica', 'normal');
        doc.text(isFixed ? 'Fixed Route Package' : 'Point-to-Point Private Transfer', 55, y);
        y += 6;

        doc.setFont('helvetica', 'bold');
        doc.text('Fleet Vehicle:', 20, y);
        doc.setFont('helvetica', 'normal');
        doc.text(transportData.selectedVehicle || transportData.vehicleName || 'Standard Chauffeur Vehicle', 55, y);

        if (transportData.price) {
          doc.setFont('helvetica', 'bold');
          doc.text('Total Fare:', 115, y);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(...gold);
          doc.text(`AED ${transportData.price}`, 145, y);
          doc.setTextColor(50, 50, 50);
        }
        y += 6;

        if (transportData.route) {
          doc.setFont('helvetica', 'bold');
          doc.text('Route:', 20, y);
          doc.setFont('helvetica', 'normal');
          doc.text(transportData.route, 55, y);
          y += 6;
        }

        // Fixed route scheduled stops
        if (transportData.legs && Array.isArray(transportData.legs) && transportData.legs.length > 0) {
          doc.setFont('helvetica', 'bold');
          doc.text('Stop Schedule:', 20, y);
          doc.setFont('helvetica', 'normal');
          y += 5;

          for (const leg of transportData.legs) {
            checkPageBreak(12);
            doc.setFillColor(...gold);
            doc.circle(23, y - 1, 1, 'F');
            doc.setFont('helvetica', 'bold');
            doc.text(`${leg.from} -> ${leg.to}`, 27, y);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(100, 100, 100);
            doc.text(`[Date: ${leg.date ? formatDateDDMMYYYY(leg.date) : 'TBD'} | Time: ${leg.time || '12:00'}]`, 115, y);
            doc.setTextColor(50, 50, 50);
            y += 4.5;

            if (leg.pickupLocation || leg.dropoffLocation || leg.flightNo) {
              checkPageBreak(8);
              doc.setFontSize(8);
              doc.setTextColor(90, 90, 90);
              let locationLine = '';
              if (leg.pickupLocation) locationLine += `Pickup: ${leg.pickupLocation}  `;
              if (leg.dropoffLocation) locationLine += `|  Drop-off: ${leg.dropoffLocation}  `;
              if (leg.flightNo) locationLine += `|  Flight: ${leg.flightNo}`;
              const splitLoc = doc.splitTextToSize(locationLine.trim(), 160);
              doc.text(splitLoc, 27, y);
              y += splitLoc.length * 3.8 + 1.5;
              doc.setFontSize(9);
              doc.setTextColor(50, 50, 50);
            }
          }
          y += 2;
        }

        // Point-to-point locations
        if (transportData.pointToPoint) {
          const p2p = transportData.pointToPoint;
          doc.setFont('helvetica', 'bold');
          doc.text('Pickup:', 20, y);
          doc.setFont('helvetica', 'normal');
          const splitPickup = doc.splitTextToSize(p2p.pickupLocation || p2p.pickup || 'Address TBD', 135);
          doc.text(splitPickup, 55, y);
          y += splitPickup.length * 4.5;

          doc.setFont('helvetica', 'bold');
          doc.text('Drop-off:', 20, y);
          doc.setFont('helvetica', 'normal');
          const splitDropoff = doc.splitTextToSize(p2p.dropoffLocation || p2p.dropoff || 'Address TBD', 135);
          doc.text(splitDropoff, 55, y);
          y += splitDropoff.length * 4.5;

          doc.setFont('helvetica', 'bold');
          doc.text('Schedule:', 20, y);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(...gold);
          doc.text(`${(p2p.pickupDate || p2p.date) ? formatDateDDMMYYYY(p2p.pickupDate || p2p.date) : 'Date TBD'} at ${p2p.pickupTime || p2p.time || '14:00'}${p2p.flightNo ? ` (Flight: ${p2p.flightNo})` : ''}`, 55, y);
          doc.setTextColor(50, 50, 50);
          y += 6;
        }

        // Single routes for Umrah flow
        if (transportData.singleRoutes) {
          const sr = transportData.singleRoutes;
          doc.setFont('helvetica', 'bold');
          doc.text('Single Routes:', 20, y);
          doc.setFont('helvetica', 'normal');
          y += 5;
          if (sr.airportTransfer) {
            doc.text('• Airport -> Hotel -> Airport Transfer', 25, y);
            y += 5;
          }
          if (sr.oneDayTrip) {
            doc.text(`• 1 Day Excursion (${sr.oneDayTripDays || 1} day/s)`, 25, y);
            y += 5;
          }
          if (sr.halfDayTrip) {
            doc.text(`• Half Day Excursion (${sr.halfDayTripDays || 1} day/s)`, 25, y);
            y += 5;
          }
        }
        y += 4;
      } else {
        drawCardHeader('4. Chauffeur & Transportation');
        doc.setFontSize(9);
        doc.setTextColor(50, 50, 50);
        doc.setFont('helvetica', 'italic');
        doc.text('Transportation skipped (Self-arranged by pilgrim)', 20, y);
        y += 8;
      }

      // Section 5: Sacred Ziyarat
      if (booking.ziyaratDetails) {
        drawCardHeader('5. Sacred Ziyarat Excursions');
        doc.setFontSize(9);
        doc.setTextColor(50, 50, 50);
        
        doc.setFont('helvetica', 'bold');
        doc.text('Vehicle Fleet:', 20, y);
        doc.setFont('helvetica', 'normal');
        doc.text(booking.ziyaratDetails.vehicle || 'Not specified', 55, y);

        const zPax = booking.ziyaratDetails.passengers || booking.adultsCount || 1;
        doc.setFont('helvetica', 'bold');
        doc.text('Total Pilgrims:', 115, y);
        doc.setFont('helvetica', 'normal');
        doc.text(`${zPax} Pilgrim${zPax > 1 ? 's' : ''}`, 145, y);
        y += 6;

        if (booking.ziyaratDetails.totalEstimatedCost) {
          doc.setFont('helvetica', 'bold');
          doc.text('Estimated Fare:', 115, y);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(...gold);
          doc.text(`SAR ${booking.ziyaratDetails.totalEstimatedCost}`, 145, y);
          doc.setTextColor(50, 50, 50);
        }
        y += 6;

        if (booking.ziyaratDetails.selectedRoutes && booking.ziyaratDetails.selectedRoutes.length > 0) {
          doc.setFont('helvetica', 'bold');
          doc.text('Sacred Itineraries & Schedule:', 20, y);
          y += 5;
          for (const route of booking.ziyaratDetails.selectedRoutes) {
            checkPageBreak(16);
            doc.setFillColor(...gold);
            doc.circle(23, y - 1, 1, 'F');
            doc.setFont('helvetica', 'bold');
            doc.text(`[${route.city}] ${route.name}`, 27, y);
            if (route.duration) {
              doc.setFont('helvetica', 'normal');
              doc.setTextColor(100, 100, 100);
              doc.text(`(${route.duration})`, 27 + doc.getTextWidth(`[${route.city}] ${route.name} `), y);
              doc.setTextColor(50, 50, 50);
            }
            y += 5;

            // Individual Scheduled Date & Fare
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(43, 108, 176); // professional blue
            doc.text(`Scheduled Date: ${route.date ? formatDateDDMMYYYY(route.date) : 'TBD'}`, 27, y);
            if (route.price) {
              doc.setTextColor(...gold);
              doc.text(`|  Fare: SAR ${route.price}`, 27 + doc.getTextWidth(`Scheduled Date: ${route.date ? formatDateDDMMYYYY(route.date) : 'TBD'}  `), y);
            }
            doc.setTextColor(50, 50, 50);
            y += 5;

            if (route.sites && Array.isArray(route.sites) && route.sites.length > 0) {
              doc.setFont('helvetica', 'italic');
              doc.setTextColor(100, 100, 100);
              const sitesList = route.sites.map((s: any) => typeof s === 'string' ? s : s.name).join(', ');
              const splitSites = doc.splitTextToSize(`Sites: ${sitesList}`, 160);
              doc.text(splitSites, 27, y);
              doc.setTextColor(50, 50, 50);
              y += splitSites.length * 4.5;
            }
          }
        }
        y += 4;
      }

      // Section 6: VIP Add-ons
      const upsells = booking.fullSubmissionPayload?.selectedUpsells;
      if (upsells && upsells.length > 0) {
        drawCardHeader('6. Add-ons & VIP Experiences');
        doc.setFontSize(9);
        doc.setTextColor(50, 50, 50);
        for (const item of upsells) {
          checkPageBreak(8);
          doc.setFillColor(...gold);
          doc.circle(23, y - 1, 1, 'F');
          doc.setFont('helvetica', 'normal');
          doc.text(String(item), 27, y);
          y += 6;
        }
        y += 4;
      }

      // Footer
      checkPageBreak(25);
      doc.setDrawColor(...cardBorder);
      doc.line(15, y + 5, 195, y + 5);
      doc.setFontSize(8);
      doc.setTextColor(130, 130, 130);
      doc.text('Umrah Plus Official Booking Record • Confidential & Proprietary', 105, y + 12, { align: 'center' });
      doc.text('Our team will contact you shortly to finalize your personalized itinerary.', 105, y + 17, { align: 'center' });

      // Save PDF directly to user's device
      const fileName = `Umrah_Plus_Itinerary_${booking.reference || bookingId}.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error("Error generating PDF with jsPDF, falling back to print view:", error);
      try {
        const booking = await getBookingById(bookingId);
        if (booking) {
          printBookingToPdf(booking);
        }
      } catch (fallbackErr) {
        console.error("Fallback print also failed:", fallbackErr);
        alert("Failed to download PDF. Please contact support.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isGenerating}
      className="w-full sm:w-auto h-[48px] inline-flex items-center justify-center gap-2 bg-transparent border border-[#c5a059] text-[#c5a059] hover:bg-[#c5a059]/10 font-bold uppercase tracking-wider text-xs md:text-sm px-4 rounded-xl transition-all whitespace-nowrap disabled:opacity-50 cursor-pointer"
    >
      {isGenerating ? (
        <><Loader2 className="w-4 h-4 animate-spin" /> Generating PDF...</>
      ) : (
        <><Download className="w-4 h-4" /> Download Itinerary</>
      )}
    </button>
  );
}
