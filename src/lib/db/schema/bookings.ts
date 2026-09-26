import { pgTable, text, timestamp, integer, json } from 'drizzle-orm/pg-core';

export const bookings = pgTable('bookings', {
  id: text('id').primaryKey().$defaultFn(() => `BK-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`),
  reference: text('reference').notNull(),
  bookingType: text('booking_type').notNull(), // 'Umrah', 'Umrah Plus', 'Ziyarat'
  status: text('status').notNull().default('Pending'), // 'Pending', 'Contacted', 'Confirmed', 'Completed', 'Cancelled'
  
  startDate: text('start_date'),
  endDate: text('end_date'),

  adultsCount: integer('adults_count').notNull().default(1),
  infantsCount: integer('infants_count').notNull().default(0),

  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email').notNull(),
  customerPhone: text('customer_phone').notNull(),
  customerNationality: text('customer_nationality').notNull().default('Not Specified'),
  customerNotes: text('customer_notes'),

  // Structured details containing stay, transportation, and Ziyarat sacred routes
  stayDetails: json('stay_details'),
  transportDetails: json('transport_details'),
  ziyaratDetails: json('ziyarat_details'),
  leadPassengerDetails: json('lead_passenger_details'),
  fullSubmissionPayload: json('full_submission_payload'),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
export type BookingRecord = Booking;
export type NewBookingRecord = NewBooking;
