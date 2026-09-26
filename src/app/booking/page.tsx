import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import BookingController from '@/components/booking-engine/BookingController';
import { formatDateDDMMYYYY } from '@/lib/utils';

// Next.js 15+ App Router approach for SearchParams
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function BookingPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const type = (searchParams.type as string) || 'Umrah';
  const start = searchParams.start as string;
  const end = searchParams.end as string;

  const ziyaratPkgParams = {
    id: searchParams.pkgId as string,
    price: searchParams.price ? Number(searchParams.price) : 0,
    title: searchParams.title as string,
    duration: searchParams.duration as string,
    city: searchParams.city as string
  };

  if (!start && type !== 'Ziyarat' && type !== 'Transport') {
    redirect('/');
  }

  const initialPassengers = searchParams.passengers ? Number(searchParams.passengers) : undefined;
  const initialChildren = searchParams.children ? Number(searchParams.children) : undefined;
  const initialLuggage = searchParams.luggage ? Number(searchParams.luggage) : undefined;
  const initialCities = searchParams.cities
    ? (Array.isArray(searchParams.cities)
        ? searchParams.cities
        : (searchParams.cities as string).split(',').map(s => s.trim()))
    : undefined;

  return (
    <main className="min-h-screen bg-[#0c0d10] flex flex-col text-gray-100">
      <div className="bg-[#0c0d10] relative h-24">
        <Header />
      </div>
      
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-10 relative -mt-6">
        <div className="mb-4">
          <Link
            href="/#section-1"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-gray-400 hover:text-[#c5a059] transition-colors py-2 px-3.5 rounded-full bg-white/5 border border-white/10 hover:border-[#c5a059]/40"
          >
            <ArrowLeft size={14} className="text-[#c5a059]" />
            <span>Back to Search Widget</span>
          </Link>
        </div>

        <div className="mb-10 text-center mt-2">
          <h1 className="text-3xl md:text-5xl font-playfair italic text-[#c5a059] mb-4">
            Customize Your {type} Journey
          </h1>
          {(start || end) && (
            <p className="text-gray-400 font-light tracking-wide uppercase text-sm">
              {start && formatDateDDMMYYYY(start)} 
              {start && end && ' — '} 
              {end && formatDateDDMMYYYY(end)}
            </p>
          )}
        </div>

        <BookingController 
          type={type} 
          startDate={start} 
          endDate={end} 
          ziyaratPkgParams={ziyaratPkgParams}
          initialPassengers={initialPassengers}
          initialChildren={initialChildren}
          initialLuggage={initialLuggage}
          initialCities={initialCities}
        />
      </div>
    </main>
  );
}
