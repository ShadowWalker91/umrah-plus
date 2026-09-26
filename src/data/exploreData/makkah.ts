import { CityPackage } from '@/types';

export const makkahPackages: CityPackage[] = [
  {
    id: "pkg-mak-01",
    title: "Historical Ziyarat Tour",
    durationDays: 1,
    description: "A comprehensive guided tour covering the most significant historical sites in and around the Holy City of Makkah.",
    destinations: ["Jabal al-Nour (Cave of Hira)", "Jabal Thawr", "Arafat", "Mina", "Muzdalifah"],
    includes: ["Experienced Guide", "Bottled Zamzam Water", "Hotel Pickup & Drop-off"],
    vehicleOptions: [
      { id: "v1", name: "Standard Sedan", basePrice: 150, capacity: 4 },
      { id: "v2", name: "Luxury SUV", basePrice: 280, capacity: 6 },
      { id: "v3", name: "Family GMC Van", basePrice: 350, capacity: 7 }
    ]
  },
  {
    id: "pkg-mak-02",
    title: "Taif Day Trip from Makkah",
    durationDays: 1,
    description: "Escape the heat and visit the beautiful mountainous city of Taif. Experience the famous rose farms and historical mosques.",
    destinations: ["Shubra Palace", "Taif Rose Farms", "Al Rudaf Park", "Abdullah Ibn Abbas Mosque"],
    includes: ["Experienced Guide", "Snacks & Refreshments", "Cable Car Ticket"],
    vehicleOptions: [
      { id: "v1", name: "Standard Sedan", basePrice: 300, capacity: 4 },
      { id: "v2", name: "Luxury SUV", basePrice: 500, capacity: 6 },
      { id: "v3", name: "Minibus", basePrice: 800, capacity: 12 }
    ]
  }
];