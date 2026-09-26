'use server';

import nodemailer from 'nodemailer';
import { saveBookingInquiry } from './bookingActions';

export interface BookingInquiryPayload {
  type: string;
  startDate?: string;
  endDate?: string;
  adultsCount: number;
  infantsCount: number;
  passengerCount: number;
  makkahStay?: {
    hotelCategory: string;
    nights: number;
    rooms: number;
    checkInDate?: string;
    checkInTime?: string;
    checkOutDate?: string;
    checkOutTime?: string;
    preferredHotel?: string;
  };
  madinahStay?: {
    included: boolean;
    hotelCategory?: string;
    nights?: number;
    rooms?: number;
    checkInDate?: string;
    checkInTime?: string;
    checkOutDate?: string;
    checkOutTime?: string;
    preferredHotel?: string;
  };
  transportation?: {
    selectedVehicle: string | null;
    route?: string | null;
    routeDetails?: string | null;
    singleRoutes?: {
      airportTransfer: boolean;
      oneDayTrip: boolean;
      oneDayTripDays: number;
      halfDayTrip: boolean;
      halfDayTripDays: number;
    };
  };
  ziyaratDetails?: {
    selectedRoutes: {
      id: string;
      name: string;
      city: string;
      duration: string;
      date?: string;
      passengers?: number;
      price?: number | null;
      sites?: any;
    }[];
    vehicle: string | null;
    vehicleId?: string | null;
    passengers?: number;
    guidePreference?: string | null;
    totalEstimatedCost?: number;
  };
  selectedUpsells?: string[];
  selectedZiyaratCities?: { cityId: string; locations: string[] }[];
  leadDetails: {
    fullName: string;
    nationality: string;
    phoneCode: string;
    phone: string;
    email: string;
    notes?: string;
  };
}

export async function sendBookingInquiry(payload: BookingInquiryPayload) {
  let bookingId: string | undefined;

  try {
    console.log("👉 NEW BOOKING INQUIRY RECEIVED:", JSON.stringify(payload, null, 2));

    // 1. Save to Dashboard / Database (dual-mode: Postgres DB + local JSON store)
    try {
      const bType = (
        payload.type === 'Transport' ? 'Transport' :
        payload.type === 'Umrah Plus' ? 'Umrah Plus' :
        payload.type === 'Ziyarat' ? 'Ziyarat' : 'Umrah'
      ) as 'Umrah' | 'Transport' | 'Umrah Plus' | 'Ziyarat';
      const formattedPhone = `${payload.leadDetails.phoneCode || ''} ${payload.leadDetails.phone || ''}`.trim();
      
      const transportObj = (payload as any).transportDetails || payload.transportation || (payload as any).fullSubmissionPayload?.transportBooking;
      
      const saveRes = await saveBookingInquiry({
        bookingType: bType,
        customerName: payload.leadDetails.fullName || 'Valued Pilgrim',
        customerEmail: payload.leadDetails.email || '',
        customerPhone: formattedPhone,
        customerNationality: payload.leadDetails.nationality || 'Not Specified',
        customerNotes: payload.leadDetails.notes || '',
        startDate: payload.startDate || undefined,
        endDate: payload.endDate || undefined,
        adultsCount: payload.adultsCount || 1,
        infantsCount: payload.infantsCount || 0,
        stayDetails: bType === 'Transport' ? null : {
          makkahStay: payload.makkahStay,
          madinahStay: payload.madinahStay,
        },
        transportDetails: transportObj,
        ziyaratDetails: payload.ziyaratDetails,
        leadPassengerDetails: payload.leadDetails,
        fullSubmissionPayload: payload,
      });
      if (saveRes && saveRes.bookingId) {
        bookingId = saveRes.bookingId;
      }
      console.log("✅ Successfully saved booking inquiry to Admin Dashboard! ID:", bookingId);
    } catch (saveErr) {
      console.error("❌ Failed to save booking inquiry to dashboard:", saveErr);
    }

    const officialEmail = process.env.OFFICIAL_EMAIL;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpUser && smtpPass && officialEmail) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        const isZiyarat = payload.type === 'Ziyarat';
        const isTransport = payload.type === 'Transport';
        const transportData = (payload as any).transportDetails || payload.transportation;

        let itineraryHtml = '';
        if (isTransport && transportData) {
          const isFixed = transportData.mode === 'fixed';
          const legsList = transportData.legs && Array.isArray(transportData.legs)
            ? transportData.legs.map((leg: any, idx: number) => `
                <li style="margin-bottom: 8px;">
                  <strong>Stop ${idx + 1}:</strong> ${leg.from} ➔ ${leg.to} <span style="color: #666;">(Date: ${leg.date || 'TBD'} at ${leg.time || '12:00'})</span>
                  ${(leg.pickupLocation || leg.dropoffLocation) ? `
                    <div style="font-size: 12px; color: #555; margin-left: 10px;">
                      ${leg.pickupLocation ? `<span>• <strong>Pickup:</strong> ${leg.pickupLocation}</span><br/>` : ''}
                      ${leg.dropoffLocation ? `<span>• <strong>Drop-off:</strong> ${leg.dropoffLocation}</span><br/>` : ''}
                    </div>
                  ` : ''}
                  ${leg.flightNo ? `<div style="font-size: 12px; color: #b7791f; margin-left: 10px;">• <strong>Flight / Terminal:</strong> ${leg.flightNo}</div>` : ''}
                </li>
              `).join('')
            : '';

          itineraryHtml = `
            <div style="background: #fff; padding: 20px; margin-top: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
              <h3 style="color: #c5a059; margin-top: 0; border-bottom: 1px solid #edf2f7; padding-bottom: 8px;">Private Transportation Dossier</h3>
              <p><strong>Service Mode:</strong> ${isFixed ? 'Fixed Route Package' : 'Point-to-Point Private Transfer'}</p>
              <p><strong>Fleet Vehicle:</strong> ${transportData.selectedVehicle || 'Standard Vehicle'}</p>
              <p><strong>Passengers:</strong> ${payload.adultsCount} Adults, ${payload.infantsCount || 0} Children | <strong>Luggage:</strong> ${transportData.luggageCount || 2} Bags</p>
              ${transportData.price ? `<p><strong>Estimated Total Fare:</strong> <span style="color: #c5a059; font-weight: bold;">AED ${transportData.price}</span></p>` : ''}
              <p><strong>Route Summary:</strong> ${transportData.route || 'Custom Route'}</p>
              ${isFixed && legsList ? `
                <div style="margin-top: 10px; padding: 10px; background: #f7fafc; border-radius: 6px;">
                  <p style="margin: 0 0 6px 0; font-weight: bold; color: #333;">Scheduled Stops & Timings:</p>
                  <ul style="padding-left: 20px; margin: 0; color: #444;">
                    ${legsList}
                  </ul>
                </div>
              ` : ''}
              ${!isFixed && transportData.pointToPoint ? `
                <div style="margin-top: 10px; padding: 10px; background: #f7fafc; border-radius: 6px;">
                  <p style="margin: 0 0 4px 0;"><strong>Pickup Location:</strong> ${transportData.pointToPoint.pickupLocation || 'TBD'}</p>
                  <p style="margin: 0 0 4px 0;"><strong>Drop-off Location:</strong> ${transportData.pointToPoint.dropoffLocation || 'TBD'}</p>
                  <p style="margin: 0 0 4px 0;"><strong>Schedule:</strong> ${transportData.pointToPoint.pickupDate || 'TBD'} at ${transportData.pointToPoint.pickupTime || '14:00'}</p>
                  ${transportData.pointToPoint.flightNo ? `<p style="margin: 0;"><strong>Flight No:</strong> ${transportData.pointToPoint.flightNo}</p>` : ''}
                </div>
              ` : ''}
            </div>
          `;
        } else if (isZiyarat && payload.ziyaratDetails) {
          const routesList = payload.ziyaratDetails.selectedRoutes
            .map(r => `<li style="margin-bottom: 8px;">
              <strong>${r.city}</strong>: ${r.name} (${r.duration})
              ${r.date ? `<br/><span style="color: #2b6cb0; font-size: 13px;">📅 <strong>Scheduled Date:</strong> ${r.date}</span>` : ''}
              ${r.price ? `<span style="color: #c5a059; font-size: 13px; margin-left: 10px;">| <strong>Fare:</strong> SAR ${r.price}</span>` : ''}
            </li>`)
            .join('');

          itineraryHtml = `
            <div style="background: #fff; padding: 20px; margin-top: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
              <h3 style="color: #c5a059; margin-top: 0; border-bottom: 1px solid #edf2f7; padding-bottom: 8px;">Ziyarat Excursion Details</h3>
              <p><strong>Total Pilgrims:</strong> ${payload.passengerCount}</p>
              <p><strong>Selected Vehicle:</strong> ${payload.ziyaratDetails.vehicle || 'Not specified'}</p>
              <p><strong>Selected Sacred Routes:</strong></p>
              <ul style="padding-left: 20px; color: #444;">
                ${routesList || '<li>None specified</li>'}
              </ul>
            </div>
          `;
        } else {
          const singleRoutesSummary = payload.transportation?.singleRoutes
            ? [
                payload.transportation.singleRoutes.airportTransfer ? '• Airport ➔ Hotel ➔ Airport' : null,
                payload.transportation.singleRoutes.oneDayTrip ? `• 1 Day Trip (${payload.transportation.singleRoutes.oneDayTripDays} days)` : null,
                payload.transportation.singleRoutes.halfDayTrip ? `• Half Day Trips (${payload.transportation.singleRoutes.halfDayTripDays} days)` : null,
              ].filter(Boolean).join('<br/>') || 'None selected'
            : 'N/A';

          itineraryHtml = `
            <div style="background: #fff; padding: 20px; margin-top: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
              <h3 style="color: #c5a059; margin-top: 0; border-bottom: 1px solid #edf2f7; padding-bottom: 8px;">Trip & Accommodation</h3>
              <p><strong>Travel Dates:</strong> ${payload.startDate || 'Flexible'} ${payload.endDate ? `to ${payload.endDate}` : ''}</p>
              <p><strong>Total Guests:</strong> ${payload.passengerCount} (${payload.adultsCount} Adults, ${payload.infantsCount} Infants)</p>
              
              ${payload.makkahStay ? `
                <div style="margin-top: 10px; padding: 10px; background: #f7fafc; border-radius: 6px;">
                  <p style="margin: 0 0 5px 0;"><strong>🕋 Makkah Stay:</strong></p>
                  <p style="margin: 0; font-size: 13px; color: #555;">Category: ${payload.makkahStay.hotelCategory} | Nights: ${payload.makkahStay.nights} | Rooms: ${payload.makkahStay.rooms}</p>
                  ${payload.makkahStay.preferredHotel ? `<p style="margin: 3px 0 0 0; font-size: 13px; color: #c5a059;"><strong>Preferred Hotel:</strong> ${payload.makkahStay.preferredHotel}</p>` : ''}
                  ${payload.makkahStay.checkInDate || payload.makkahStay.checkOutDate ? `<p style="margin: 3px 0 0 0; font-size: 12px; color: #777;"><strong>Schedule:</strong> Check-in: ${payload.makkahStay.checkInDate || 'TBD'} (${payload.makkahStay.checkInTime || '14:00'}) | Check-out: ${payload.makkahStay.checkOutDate || 'TBD'} (${payload.makkahStay.checkOutTime || '12:00'})</p>` : ''}
                </div>
              ` : ''}

              ${payload.madinahStay?.included ? `
                <div style="margin-top: 10px; padding: 10px; background: #f7fafc; border-radius: 6px;">
                  <p style="margin: 0 0 5px 0;"><strong>🕌 Madinah Stay:</strong></p>
                  <p style="margin: 0; font-size: 13px; color: #555;">Category: ${payload.madinahStay.hotelCategory} | Nights: ${payload.madinahStay.nights} | Rooms: ${payload.madinahStay.rooms}</p>
                  ${payload.madinahStay.preferredHotel ? `<p style="margin: 3px 0 0 0; font-size: 13px; color: #c5a059;"><strong>Preferred Hotel:</strong> ${payload.madinahStay.preferredHotel}</p>` : ''}
                  ${payload.madinahStay.checkInDate || payload.madinahStay.checkOutDate ? `<p style="margin: 3px 0 0 0; font-size: 12px; color: #777;"><strong>Schedule:</strong> Check-in: ${payload.madinahStay.checkInDate || 'TBD'} (${payload.madinahStay.checkInTime || '14:00'}) | Check-out: ${payload.madinahStay.checkOutDate || 'TBD'} (${payload.madinahStay.checkOutTime || '12:00'})</p>` : ''}
                </div>
              ` : '<p style="margin-top: 10px; font-size: 13px; color: #777;"><em>Madinah stay not requested</em></p>'}
            </div>

            <div style="background: #fff; padding: 20px; margin-top: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
              <h3 style="color: #c5a059; margin-top: 0; border-bottom: 1px solid #edf2f7; padding-bottom: 8px;">Transportation & Itinerary</h3>
              ${payload.transportation ? `
                <p><strong>Selected Vehicle:</strong> ${payload.transportation.selectedVehicle || 'Not specified'}</p>
                ${payload.madinahStay?.included ? `
                  <p><strong>Intercity Route:</strong> ${payload.transportation.route || 'Round Trip Package 01'}</p>
                  ${payload.transportation.routeDetails ? `<p style="color: #c5a059; font-size: 13px; margin-top: -8px;"><em>Route Itinerary: ${payload.transportation.routeDetails}</em></p>` : ''}
                ` : `
                  <p><strong>Single Routes Requested:</strong><br/>${singleRoutesSummary}</p>
                `}
              ` : `
                <p style="color: #666; font-style: italic; margin: 5px 0 0 0;">Transportation skipped by client (Self-arranged).</p>
              `}
            </div>
          `;
        }

        const mailOptions = {
          from: smtpUser,
          to: officialEmail,
          subject: `New ${payload.type} Booking Request: ${payload.leadDetails.fullName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; color: #222; background-color: #f9f9f9; padding: 25px; border-radius: 10px;">
              <div style="background-color: #0c0d10; padding: 20px; border-radius: 8px; text-align: center; border-bottom: 3px solid #c5a059;">
                <h1 style="color: #c5a059; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">Umrah Plus</h1>
                <p style="color: #aaa; margin: 5px 0 0; font-size: 14px;">New ${payload.type} Custom Inquiry</p>
              </div>

              <div style="background: #fff; padding: 20px; margin-top: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
                <h3 style="color: #c5a059; margin-top: 0; border-bottom: 1px solid #edf2f7; padding-bottom: 8px;">Lead Passenger Details</h3>
                <p><strong>Name:</strong> ${payload.leadDetails.fullName}</p>
                <p><strong>Email:</strong> <a href="mailto:${payload.leadDetails.email}">${payload.leadDetails.email}</a></p>
                <p><strong>Phone:</strong> ${payload.leadDetails.phoneCode} ${payload.leadDetails.phone}</p>
                <p><strong>Nationality:</strong> ${payload.leadDetails.nationality}</p>
                ${payload.leadDetails.notes ? `<p><strong>Special Notes:</strong> ${payload.leadDetails.notes}</p>` : ''}
              </div>

              ${itineraryHtml}

              ${payload.selectedUpsells && payload.selectedUpsells.length > 0 ? `
                <div style="background: #fff; padding: 20px; margin-top: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
                  <h3 style="color: #c5a059; margin-top: 0; border-bottom: 1px solid #edf2f7; padding-bottom: 8px;">Add-ons & Experiences</h3>
                  <p>${payload.selectedUpsells.join(', ')}</p>
                </div>
              ` : ''}

              <div style="text-align: center; margin-top: 25px; color: #888; font-size: 12px;">
                <p>Submitted via Umrah Plus Booking Engine</p>
              </div>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
        console.log("✅ Booking inquiry notification email sent successfully.");
      } catch (mailErr) {
        console.error("⚠️ Failed to send booking notification email (SMTP):", mailErr);
      }
    }

    return { success: true, bookingId };
  } catch (error) {
    console.error("Booking inquiry processing error:", error);
    return { success: true, bookingId };
  }
}
