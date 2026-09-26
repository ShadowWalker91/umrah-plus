export interface Hotel {
  id: number;
  name: string;
  description: string;
  image: string;
  stars: number;
  slug: string;
}

export interface CityHotelData {
  title: string;
  description: string;
  bannerImage: string;
  aboutTitle: string;
  aboutText: string;
  aboutImage: string;
  secondFeatureTitle?: string;
  secondFeatureText?: string;
  secondFeatureImage?: string;
  hotels: Hotel[];
}

// Helper to generate generic hotels for cities without specific data yet
const generateGenericHotels = (cityName: string): Hotel[] => [
  {
    id: 1,
    name: `Grand ${cityName} Hotel`,
    description: `Experience luxury and comfort in the heart of ${cityName}. Perfect for business and leisure travelers.`,
    image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-9-1.png",
    stars: 5,
    slug: `grand-${cityName.toLowerCase().replace(' ', '-')}-hotel`
  },
  {
    id: 2,
    name: `${cityName} Palace`,
    description: `A perfect blend of traditional hospitality and modern amenities in ${cityName}.`,
    image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-10-1.png",
    stars: 4,
    slug: `${cityName.toLowerCase().replace(' ', '-')}-palace`
  },
  {
    id: 3,
    name: `Royal ${cityName} Suites`,
    description: `Premium accommodation offering the best views and services in ${cityName}.`,
    image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-32.png",
    stars: 5,
    slug: `royal-${cityName.toLowerCase().replace(' ', '-')}-suites`
  }
];

// --- MAIN DATA OBJECT ---
export const HOTELS_DATA: Record<string, CityHotelData> = {
  // 1. MAKKAH
  "makkah": {
    title: "Hotels in Makkah",
    description: "Makkah offers a wide range of hotels near Masjid al-Haram, from luxury 5-star suites with Kaaba views to affordable options for families.",
    bannerImage: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/07/Makkah-01-01.png",
    aboutTitle: "The Holiest City",
    aboutText: "Makkah, located in Saudi Arabia, is the holiest city in Islam and the birthplace of Prophet Muhammad (ﷺ). It houses the sacred Kaaba within Masjid al-Haram.",
    aboutImage: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-10-1.png",
    secondFeatureTitle: "About Khana Kaaba",
    secondFeatureText: "The Khana Kaaba, also known as the House of Allah, is the holiest structure in Islam. Muslims around the world face it during prayer.",
    secondFeatureImage: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-9-1.png",
    hotels: [
      { id: 1, name: "Grand Makkah Hotel", description: "Your comfort is at the heart of everything we do.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-9-1.png", stars: 5, slug: "grand-makkah-hotel" },
      { id: 2, name: "Swissotel Makkah", description: "Direct access to the Holy Mosque.", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-10-1.png", stars: 5, slug: "swissotel-makkah" }
    ]
  },

  // 2. MADINAH
  "madinah": {
    title: "Hotels in Madinah",
    description: "Find peace and tranquility in the City of the Prophet. Hotels located steps away from Masjid Nabawi.",
    bannerImage: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/07/Madinah-01-01.png",
    aboutTitle: "City of Light",
    aboutText: "Madinah Al-Munawwarah is the second holiest city in Islam. It is the city that gave refuge to the Prophet (ﷺ) and the early Muslims.",
    aboutImage: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-24.png",
    secondFeatureTitle: "Masjid Al-Nabawi",
    secondFeatureText: "The Prophet's Mosque is the heart of Madinah, containing the Rawdah Rasool and the Green Dome.",
    secondFeatureImage: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-20-8.png",
    hotels: generateGenericHotels("Madinah")
  },

  // 3. RIYADH
  "riyadh": {
    title: "Hotels in Riyadh",
    description: "Stay in the bustling capital of Saudi Arabia, home to skyscrapers, historical forts, and luxury shopping.",
    bannerImage: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-33.png",
    aboutTitle: "The Capital City",
    aboutText: "Riyadh is the political and administrative capital of Saudi Arabia. It creates a distinct blend of modernism and tradition.",
    aboutImage: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-33.png",
    hotels: generateGenericHotels("Riyadh")
  },

  // 4. JEDDAH
  "jeddah": {
    title: "Hotels in Jeddah",
    description: "Enjoy the coastal beauty of the Bride of the Red Sea. Hotels with stunning sea views and historic charm.",
    bannerImage: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-32.png",
    aboutTitle: "Bride of the Red Sea",
    aboutText: "Jeddah is the commercial capital of the country and the main gateway for pilgrims arriving for Hajj and Umrah.",
    aboutImage: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-32.png",
    hotels: generateGenericHotels("Jeddah")
  },

  // 5. DAMMAM
  "dammam": {
    title: "Hotels in Dammam",
    description: "Experience the heart of the Eastern Province with hotels near the Corniche and business districts.",
    bannerImage: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-34.png",
    aboutTitle: "Port City of the East",
    aboutText: "Dammam is a major administrative center for the Saudi oil industry and a hub for trade and commerce.",
    aboutImage: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-34.png",
    hotels: generateGenericHotels("Dammam")
  },

  // 6. TABUK
  "tabuk": {
    title: "Hotels in Tabuk",
    description: "Gateway to the north, offering comfortable stays near historical sites and natural wonders.",
    bannerImage: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-9-1.png",
    aboutTitle: "The Northern Gateway",
    aboutText: "Tabuk is rich in antiquities and archaeological sites, serving as a crossroad for ancient civilizations.",
    aboutImage: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-9-1.png",
    hotels: generateGenericHotels("Tabuk")
  },

  // 7. BURAYDAH
  "buraydah": {
    title: "Hotels in Buraydah",
    description: "Stay in the heart of the Qassim region, famous for its dates and agriculture.",
    bannerImage: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-10-1.png",
    aboutTitle: "City of Dates",
    aboutText: "Buraydah is located in the heart of the Arabian Peninsula and is famous for its massive date festival.",
    aboutImage: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-10-1.png",
    hotels: generateGenericHotels("Buraydah")
  },

  // 8. TAIF
  "taif": {
    title: "Hotels in Taif",
    description: "Escape to the cool mountain breeze of the City of Roses.",
    bannerImage: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-34.png",
    aboutTitle: "City of Roses",
    aboutText: "Taif is known for its pleasant weather, rose farms, and historical significance in Islamic history.",
    aboutImage: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-34.png",
    hotels: generateGenericHotels("Taif")
  },

  // 9. HA'IL
  "hail": {
    title: "Hotels in Ha'il",
    description: "Discover the hospitality of the north in Ha'il.",
    bannerImage: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-32.png",
    aboutTitle: "Land of Generosity",
    aboutText: "Ha'il is historically famous for the generosity of Hatim al-Tai and its stunning rock art.",
    aboutImage: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-32.png",
    hotels: generateGenericHotels("Hail")
  },

  // 10. KHAMIS MUSHAIT
  "khamis-mushait": {
    title: "Hotels in Khamis Mushait",
    description: "Modern comforts in the Asir region.",
    bannerImage: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-33.png",
    aboutTitle: "The Summer Resort",
    aboutText: "A major city in the Asir province known for its mild climate and modern amenities.",
    aboutImage: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-33.png",
    hotels: generateGenericHotels("Khamis Mushait")
  },

  // 11. AL-HOFUF
  "al-hofuf": {
    title: "Hotels in Al-Hofuf",
    description: "Stay near the world's largest oasis in Al-Ahsa.",
    bannerImage: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-24.png",
    aboutTitle: "The Great Oasis",
    aboutText: "Al-Hofuf is the urban center of the Al-Ahsa Oasis, a UNESCO World Heritage site.",
    aboutImage: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-24.png",
    hotels: generateGenericHotels("Al Hofuf")
  },

  // 12. AL JUBAIL
  "al-jubail": {
    title: "Hotels in Al Jubail",
    description: "Business and leisure stays in the industrial hub on the Persian Gulf.",
    bannerImage: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-9-1.png",
    aboutTitle: "Industrial Giant",
    aboutText: "Jubail is home to the largest industrial city in the world, with beautiful beaches along the gulf.",
    aboutImage: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-9-1.png",
    hotels: generateGenericHotels("Al Jubail")
  },

  // 13. ABHA
  "abha": {
    title: "Hotels in Abha",
    description: "Experience the misty mountains and heritage of Abha.",
    bannerImage: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-34.png",
    aboutTitle: "Lady of the Clouds",
    aboutText: "Abha is the capital of Asir, famous for its high altitude, cable cars, and green mountains.",
    aboutImage: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-34.png",
    hotels: generateGenericHotels("Abha")
  },

  // 14. YANBU
  "yanbu": {
    title: "Hotels in Yanbu",
    description: "Diving and relaxation in the Pearl of the Red Sea.",
    bannerImage: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-32.png",
    aboutTitle: "Pearl of the Red Sea",
    aboutText: "Yanbu is a major port city known for its oil refineries and stunning coral reefs for diving.",
    aboutImage: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-32.png",
    hotels: generateGenericHotels("Yanbu")
  },

  // 15. KHOBAR
  "khobar": {
    title: "Hotels in Khobar",
    description: "Luxury seaside stays on the Corniche of Khobar.",
    bannerImage: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-33.png",
    aboutTitle: "The Resort City",
    aboutText: "Khobar creates a tri-city area with Dammam and Dhahran, famous for its beautiful waterfront.",
    aboutImage: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-33.png",
    hotels: generateGenericHotels("Khobar")
  },

  // 16. NAJRAN
  "najran": {
    title: "Hotels in Najran",
    description: "Explore the historic southern frontier in Najran.",
    bannerImage: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-20-8.png",
    aboutTitle: "Land of History",
    aboutText: "Najran is an ancient city near the Yemeni border, rich in archaeological history and traditional mud architecture.",
    aboutImage: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-20-8.png",
    hotels: generateGenericHotels("Najran")
  },

  // 17. SAKAKAH
  "sakakah": {
    title: "Hotels in Sakakah",
    description: "Discover the capital of Al Jouf, the land of olives.",
    bannerImage: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-10-1.png",
    aboutTitle: "City of Olives",
    aboutText: "Sakakah is famous for its olive plantations and the historic Za'bal Castle.",
    aboutImage: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-10-1.png",
    hotels: generateGenericHotels("Sakakah")
  },

  // 18. ARAR
  "arar": {
    title: "Hotels in Arar",
    description: "Comfortable stays in the Northern Borders region.",
    bannerImage: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-24.png",
    aboutTitle: "The Northern Border",
    aboutText: "Arar is a key city in the north, known for its pastures and grazing lands.",
    aboutImage: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-24.png",
    hotels: generateGenericHotels("Arar")
  },

  // 19. JIZAN
  "jizan": {
    title: "Hotels in Jizan",
    description: "Stay in the agricultural heartland of the southwest coast.",
    bannerImage: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-32.png",
    aboutTitle: "The Fruit Basket",
    aboutText: "Jizan is known for its high-quality production of tropical fruits like mangoes, figs, and papaya.",
    aboutImage: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-32.png",
    hotels: generateGenericHotels("Jizan")
  },

  // 20. DIRIYAH
  "diriyah": {
    title: "Hotels in Diriyah",
    description: "Experience the birthplace of the Saudi state.",
    bannerImage: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-33.png",
    aboutTitle: "Jewel of the Kingdom",
    aboutText: "Diriyah is a UNESCO World Heritage site and the ancestral home of the Saudi Royal Family.",
    aboutImage: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-33.png",
    hotels: generateGenericHotels("Diriyah")
  }
};


// --- UPDATED SLIDER LINKS ---
export const OTHER_CITIES_LINKS = [
  { name: "Hotels in Riyadh", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-33.png", slug: "riyadh", count: "80+ Hotels" },
  { name: "Hotels in Jeddah", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-32.png", slug: "jeddah", count: "70+ Hotels" },
  { name: "Hotels in Makkah", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/07/Makkah-01-01.png", slug: "makkah", count: "100+ Hotels" },
  { name: "Hotels in Madinah", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/07/Madinah-01-01.png", slug: "madinah", count: "90+ Hotels" },
  { name: "Hotels in Dammam", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-34.png", slug: "dammam", count: "40+ Hotels" },
  { name: "Hotels in Tabuk", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-9-1.png", slug: "tabuk", count: "20+ Hotels" },
  { name: "Hotels in Taif", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-34.png", slug: "taif", count: "30+ Hotels" },
  { name: "Hotels in Abha", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-34.png", slug: "abha", count: "25+ Hotels" },
  { name: "Hotels in Al Jubail", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-9-1.png", slug: "al-jubail", count: "15+ Hotels" },
  { name: "Hotels in Yanbu", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-32.png", slug: "yanbu", count: "18+ Hotels" },
  { name: "Hotels in Khobar", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-33.png", slug: "khobar", count: "35+ Hotels" },
  { name: "Hotels in Diriyah", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-33.png", slug: "diriyah", count: "10+ Hotels" },
  { name: "Hotels in Jizan", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-32.png", slug: "jizan", count: "12+ Hotels" },
];