export interface VehiclePrice {
  name: string;
  capacity: string;
  price: string;
  image: string;
}

export interface ItineraryItem {
  title: string;
  descriptionEn: string;
  descriptionAr: string;
  images: string[];
}

export interface Package {
  id: string;
  slug: string;
  category: 'umrah' | 'umrah-plus' | 'ziyarat' | 'transportation' | 'explore-saudi';
  city: 'Madinah' | 'Makkah' | 'Taif' | 'Tabuk' | 'Jeddah' | 'Riyadh' | 'Multiple';
  title: string;
  duration: string;
  description: string;
  image: string; // ✅ NEW: Main Card Image
  priceStarting: string; // ✅ NEW: For "Starts from AED 400"
  highlights: string[];
  itinerary: ItineraryItem[];
  inclusions: string[];
  exclusions: string[];
  terms: string[];
  pricing: VehiclePrice[];
}