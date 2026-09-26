export interface CityData {
  slug: string;
  name: string;
  heroVideo: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutTitle: string;
  aboutText: string;
  aboutImage: string;
  weather: {
    summer: string;
    autumn: string;
    winter: string;
    spring: string;
  };
  bestTime: {
    title: string;
    months: string;
    icon: 'cloud-rain' | 'tent';
  }[];
  transportation: {
    title: string;
    icon: 'car' | 'bus' | 'ride-hailing';
  }[];
  thingsToDo: {
    title: string;
    image: string;
  }[];
}

export const CITIES_DATA: Record<string, CityData> = {
  "jeddah": {
    slug: "jeddah",
    name: "Jeddah",
    heroVideo: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/08/Jeddah-Saudi-Arabia-ULTRA-HD.mp4",
    heroTitle: "Discover Jeddah",
    heroSubtitle: "Dive into the Red Sea's wonders and stroll through the UNESCO-listed Al Balad, a city of living history.",
    aboutTitle: "About Jeddah",
    aboutText: "Jeddah, the vibrant gateway to Makkah, is a city where tradition and cosmopolitan flair converge. Situated on the Red Sea coast, Jeddah is known for its stunning waterfront, historic old town (Al Balad), and a thriving arts scene.",
    aboutImage: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-10-1.png",
    weather: {
      summer: "45°C",
      autumn: "37°C",
      winter: "24°C",
      spring: "42°C"
    },
    bestTime: [
      { title: "Winter Season", months: "November to March", icon: "cloud-rain" },
      { title: "Camping Season", months: "November to March", icon: "tent" }
    ],
    transportation: [
      { title: "Private Car", icon: "car" },
      { title: "Public Transportation", icon: "bus" },
      { title: "Ride Hailing", icon: "ride-hailing" }
    ],
    thingsToDo: [
      { title: "Al-Balad (Old Jeddah)", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/08/OldBalad_Jeddah.webp" },
      { title: "Jeddah Corniche", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/08/Jeddah-Corniche_Web.webp" },
      { title: "Abdul Rauf Kalil Museum", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/08/Abdul-Rauf-Kalil-Musiem.webp" },
      { title: "Jeddah Park Mall", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/08/Jeddah-park-mall.webp" },
      { title: "Team Lab", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/08/TeamLab.webp" },
      { title: "Fakieh Aquarium", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/08/Fakieh-Aquarium-Dolphin-shows.webp" },
      { title: "Al Bayada Island", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/08/AL-BAYADA-ISLAND.webp" },
      { title: "Al-Rahma Mosque", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/08/Al-Rahma-Mosque-Floating-Mosque.webp" },
    ]
  },
  // Add Riyadh, Dammam, etc. here following the same structure
};