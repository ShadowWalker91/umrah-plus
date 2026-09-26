export interface TransportationPackage {
  name: string;
  price: string;
  route: string;
}

export interface SingleRouteItem {
  name: string;
  price: string;
  route?: string;
}

export interface VehicleTransportation {
  id: number;
  name: string;
  capacity: string;
  image: string;
  packages: TransportationPackage[];
  pointToPoint: SingleRouteItem[];
}

export const TRANSPORTATION_DATA = {
  banner: {
    title: "TRANSPORTATION",
    bgImage: "assets/images/transportation/fixed-packages.jpg",
  },
  sectionHeader: {
    tagline: "OFFICIAL TRANSPORT RATES — 1448H / 2026",
    title: "PREMIUM TRANSPORT PACKAGES",
    subtitle: "Private Ground Transportation & Ziyarat Experiences Between The Two Holy Cities",
  },
  vehicles: [
    {
      id: 1,
      name: "Standard Sedan",
      capacity: "2 Guests",
      image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/07/1-Lexus-300H.webp",
      packages: [
        { name: "Package 1", price: "AED 800", route: "Jeddah Airport → Makkah → Madinah → Madinah Airport" },
        { name: "Package 2", price: "AED 1100", route: "Jeddah Airport → Makkah → Madinah → Jeddah Airport" },
        { name: "Package 3", price: "AED 800", route: "Madinah Airport → Madinah → Makkah → Jeddah Airport" },
        { name: "Package 4", price: "AED 1350", route: "Jeddah Airport → Makkah → Madinah → Makkah → Jeddah Airport" },
      ],
      pointToPoint: [
        { name: "Jeddah ↔ Makkah", price: "AED 275" },
        { name: "Makkah ↔ Jeddah", price: "AED 250" },
        { name: "Makkah / Jeddah → Madinah", price: "AED 450" },
        { name: "Jeddah Airport ↔ Madinah", price: "AED 475" },
        { name: "Jeddah Airport ↔ Jeddah City", price: "AED 250" },
        { name: "Jeddah City → Jeddah Airport", price: "AED 225" },
        { name: "Madinah Airport → Madinah Hotel", price: "AED 150" },
        { name: "Madinah Hotel → Madinah Airport", price: "AED 125" },
        { name: "Makkah ↔ Masjid Ayesha (Return)", price: "On Request" },
      ]
    },
    {
      id: 2,
      name: "Hyundai Staria",
      capacity: "5 Guests",
      image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/07/3-hyundai.webp",
      packages: [
        { name: "Package 1", price: "AED 1025", route: "Jeddah Airport → Makkah → Madinah → Madinah Airport" },
        { name: "Package 2", price: "AED 1450", route: "Jeddah Airport → Makkah → Madinah → Jeddah Airport" },
        { name: "Package 3", price: "AED 990", route: "Madinah Airport → Madinah → Makkah → Jeddah Airport" },
        { name: "Package 4", price: "AED 1750", route: "Jeddah Airport → Makkah → Madinah → Makkah → Jeddah Airport" },
      ],
      pointToPoint: [
        { name: "Jeddah ↔ Makkah", price: "AED 375" },
        { name: "Makkah ↔ Jeddah", price: "AED 325" },
        { name: "Makkah / Jeddah → Madinah", price: "AED 575" },
        { name: "Jeddah Airport ↔ Madinah", price: "AED 625" },
        { name: "Jeddah Airport ↔ Jeddah City", price: "AED 325" },
        { name: "Jeddah City → Jeddah Airport", price: "AED 310" },
        { name: "Madinah Airport → Madinah Hotel", price: "AED 185" },
        { name: "Madinah Hotel → Madinah Airport", price: "AED 150" },
        { name: "Makkah ↔ Masjid Ayesha (Return)", price: "On Request" },
      ]
    },
    {
      id: 3,
      name: "Toyota Hiace",
      capacity: "8 Guests",
      image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/07/4-hiace.webp",
      packages: [
        { name: "Package 1", price: "AED 1250", route: "Jeddah Airport → Makkah → Madinah → Madinah Airport" },
        { name: "Package 2", price: "AED 1650", route: "Jeddah Airport → Makkah → Madinah → Jeddah Airport" },
        { name: "Package 3", price: "AED 1280", route: "Madinah Airport → Madinah → Makkah → Jeddah Airport" },
        { name: "Package 4", price: "AED 1975", route: "Jeddah Airport → Makkah → Madinah → Makkah → Jeddah Airport" },
      ],
      pointToPoint: [
        { name: "Jeddah ↔ Makkah", price: "AED 395" },
        { name: "Makkah ↔ Jeddah", price: "AED 350" },
        { name: "Makkah / Jeddah → Madinah", price: "AED 650" },
        { name: "Jeddah Airport ↔ Madinah", price: "AED 725" },
        { name: "Jeddah Airport ↔ Jeddah City", price: "AED 350" },
        { name: "Jeddah City → Jeddah Airport", price: "AED 320" },
        { name: "Madinah Airport → Madinah Hotel", price: "AED 350" },
        { name: "Madinah Hotel → Madinah Airport", price: "AED 225" },
        { name: "Makkah ↔ Masjid Ayesha (Return)", price: "On Request" },
      ]
    },
    {
      id: 4,
      name: "GMC / Chevrolet",
      capacity: "5 Guests",
      image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/07/2-gmc.webp",
      packages: [
        { name: "Package 1", price: "AED 1480", route: "Jeddah Airport → Makkah → Madinah → Madinah Airport" },
        { name: "Package 2", price: "AED 2075", route: "Jeddah Airport → Makkah → Madinah → Jeddah Airport" },
        { name: "Package 3", price: "AED 1490", route: "Madinah Airport → Madinah → Makkah → Jeddah Airport" },
        { name: "Package 4", price: "AED 2475", route: "Jeddah Airport → Makkah → Madinah → Makkah → Jeddah Airport" },
      ],
      pointToPoint: [
        { name: "Jeddah ↔ Makkah", price: "AED 450" },
        { name: "Makkah ↔ Jeddah", price: "AED 425" },
        { name: "Makkah / Jeddah → Madinah", price: "AED 850" },
        { name: "Jeddah Airport ↔ Madinah", price: "AED 890" },
        { name: "Jeddah Airport ↔ Jeddah City", price: "AED 410" },
        { name: "Jeddah City → Jeddah Airport", price: "AED 355" },
        { name: "Madinah Airport → Madinah Hotel", price: "AED 295" },
        { name: "Madinah Hotel → Madinah Airport", price: "AED 250" },
        { name: "Makkah ↔ Masjid Ayesha (Return)", price: "On Request" },
      ]
    },
    {
      id: 5,
      name: "Toyota Coaster",
      capacity: "15 Guests",
      image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/07/5-coaster.webp",
      packages: [
        { name: "Package 1", price: "AED 1825", route: "Jeddah Airport → Makkah → Madinah → Madinah Airport" },
        { name: "Package 2", price: "AED 2375", route: "Jeddah Airport → Makkah → Madinah → Jeddah Airport" },
        { name: "Package 3", price: "AED 1795", route: "Madinah Airport → Madinah → Makkah → Jeddah Airport" },
        { name: "Package 4", price: "AED 2950", route: "Jeddah Airport → Makkah → Madinah → Makkah → Jeddah Airport" },
      ],
      pointToPoint: [
        { name: "Jeddah ↔ Makkah", price: "AED 625" },
        { name: "Makkah ↔ Jeddah", price: "AED 575" },
        { name: "Makkah / Jeddah → Madinah", price: "AED 890" },
        { name: "Jeddah Airport ↔ Madinah", price: "AED 975" },
        { name: "Jeddah Airport ↔ Jeddah City", price: "AED 525" },
        { name: "Jeddah City → Jeddah Airport", price: "AED 475" },
        { name: "Madinah Airport → Madinah Hotel", price: "AED 375" },
        { name: "Madinah Hotel → Madinah Airport", price: "AED 375" },
        { name: "Makkah ↔ Masjid Ayesha (Return)", price: "On Request" },
      ]
    },
    {
      id: 6,
      name: "Big Bus / VIP Coach",
      capacity: "49 Seats",
      image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/07/6-bus.webp",
      packages: [
        { name: "Package 1", price: "On Request", route: "Jeddah Airport → Makkah → Madinah → Madinah Airport" },
        { name: "Package 2", price: "On Request", route: "Jeddah Airport → Makkah → Madinah → Jeddah Airport" },
        { name: "Package 3", price: "On Request", route: "Madinah Airport → Madinah → Makkah → Jeddah Airport" },
        { name: "Package 4", price: "On Request", route: "Jeddah Airport → Makkah → Madinah → Makkah → Jeddah Airport" },
      ],
      pointToPoint: [
        { name: "Jeddah → Makkah (Single)", price: "SAR 805" },
        { name: "Makkah ↔ Jeddah", price: "On Request" },
        { name: "Makkah / Jeddah → Madinah", price: "On Request" },
        { name: "Jeddah Airport ↔ Madinah", price: "On Request" },
        { name: "Jeddah Airport ↔ Jeddah City", price: "On Request" },
        { name: "Jeddah City → Jeddah Airport", price: "On Request" },
        { name: "Madinah Airport → Madinah Hotel", price: "On Request" },
        { name: "Madinah Hotel → Madinah Airport", price: "On Request" },
        { name: "Makkah ↔ Masjid Ayesha (Return)", price: "On Request" },
      ]
    },
  ],
  policies: [
    "All rates are net, quoted in Emirati Dirhams (AED) per vehicle — not per person. Fares include all legs shown in the package route.",
    "A working mobile number for the travelling guest must be shared in advance for smooth pickup on arrival or departure.",
    "Full guest names and passport numbers are required at the time of booking.",
    "Bookings may be cancelled or amended up to 48 hours ahead of pickup. Availability cannot be guaranteed for requests inside this window.",
    "Some hotel security teams in Makkah do not permit vehicle entry unless the vehicle's plate number has been shared with security by the guest directly.",
    "Please choose pickup times carefully, particularly in Makkah, as local authorities close surrounding roads during prayer times.",
    "Rates may be adjusted without prior notice around special dates, major events, strikes or sold-out periods, and are subject to change with fuel prices or VAT.",
    "Umrah visa guests: Vehicle and driver details will be shared in advance, and the travel agent must obtain the Kashf / Tafweej from the issuing company. Kashf / Tafweej is not required for tourist-visa holders.",
    "Guests are responsible for their own belongings inside the vehicle.",
    "Any dispute must be reported within 10 days of pickup; claims raised after this window cannot be considered."
  ],
  seasonalAdjustments: [
    { period: "15 December – 15 January", adjustment: "+5% on all listed rates" },
    { period: "1st Ramadan – 5th Shawwal", adjustment: "+15% on all listed rates" },
    { period: "18, 19, 29 & 30 Ramadan and 1–4 Shawwal", adjustment: "+50% on all listed rates" },
    { period: "Arrival via the Hajj Terminal", adjustment: "+SAR 100, all vehicle types" },
    { period: "Departure via the Hajj Terminal", adjustment: "+SAR 100 — Hiace, Coaster & Bus only" },
  ]
};