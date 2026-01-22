import { Box, Crown, Eye, ShieldCheck, Star } from "lucide-react";

export const SITE_CONFIG = {
  header: {
    logo: "/assets/images/homepage/logo.png",
    logoAlt: "Umrah Plus Logo",
    menu: [
      { label: "Home", href: "/" },
      { label: "Makkah", href: "#section-1" },
      { label: "Madinah", href: "#section-2" },
      { label: "Ziyarat", href: "/ziyarat" },
      { label: "Flights", href: "/flights" },
      
      // 👇 UPDATED: Transportation with Book Your Trip submenu
      { 
        label: "Transportation", 
        href: "/transportation",
        submenu: [
          { label: "Fixed Packages", href: "/transportation" }, // Points to main page
          { label: "Book Your Trip", href: "/book-your-trip" } // Points to new page
        ]
      },
      
      { label: "Packages", href: "#section-6" },
      { label: "Explore Saudi", href: "#section-5" },
    ],
    cta: {
      label: "Book Packages",
      href: "#section-6"
    }
  },
  // ... (Keep the rest of the file exactly as it was) ...
  hero: {
    videoUrl: "/assets/videos/homepage/makkah-section/makkah.mp4", 
    calligraphy: "/assets/images/homepage/makkah-section/Makkah-Calligraphy.png", 
    image: "/assets/images/homepage/makkah-section/hero-pilgrims.png",
    title: "Embrace the Spiritual Essence of Umrah",
    subtitle: "A Journey of Faith",
    quote: "The guests of Allah are three: The pilgrim, the one performing Umrah, and the one who fights in His cause.",
    quoteSource: "(Sunan an-Nasa'i 2625)",
  },
  madinah: {
    videoUrl: "/assets/videos/homepage/madinah-section/madinah.mp4",
    calligraphy: "/assets/images/homepage/madinah-section/Madinah-Calligraphy.png", 
    image: "#",
    title: "Where Peace Meets the Heart",
    subtitle: "The Blessed City",
    quote: "One prayer in my mosque is better than a thousand prayers in any other mosque except Al-Masjid Al-Haram.",
    quoteSource: "(Sahih al-Bukhari 1190)",
  },
  ziyarat: {
    videoUrl: "/assets/videos/homepage/ziyarat-section/ziyarat.mp4",
    calligraphy: "/assets/images/homepage/ziyarat-section/Ziyarat-Calligraphy.png", 
    title: "Walking in the Footsteps of Prophets",
    subtitle: "A Pilgrimage of Peace Reflection",
    description: "Explore the historical sites (Ziyarat) that defined the history of Islam. From Cave Hira to Mount Uhud.",
  },
  transportation: {
    videoUrl: "/assets/videos/homepage/transport-section/transport.mp4",
    image: "/assets/images/homepage/transport-section/cars_vertical.png",
    title: "Premium Travel Experience",
    subtitle: "Comfort & Luxury",
    description: "We offer a premium, reliable, and comfortable travel experience tailored for professionals.",
  },
  explore: {
    backgroundImage: "/assets/images/homepage/explore-section/Al-Ula-Background.jpg", 
    title: "A Land of Culture Adventure and History",
    subtitle: "Explore KSA",
    description: "Discover the rich heritage, breathtaking landscapes, and modern marvels of Saudi Arabia. From the ancient Nabatean tombs of AlUla to the futuristic skyline of Riyadh, KSA offers a unique blend of history and innovation.",
  },
  cities: [
    { name: "Al Ula", img: "/assets/images/homepage/explore-section/AlUla.jpg" },
    { name: "Riyadh", img: "/assets/images/homepage/explore-section/riyadh.jpg" },
    { name: "Aseer", img: "/assets/images/homepage/explore-section/aseer.png" },
    { name: "Jeddah", img: "/assets/images/homepage/explore-section/jeddah.webp" },
    { name: "Taif", img: "/assets/images/homepage/explore-section/taif.webp" },
    { name: "Al Bahah", img: "/assets/images/homepage/explore-section/Al-Bahah.jpg" },
  ],
  packagesSection: {
    backgroundImage: "/assets/images/homepage/packages-section/packagesBG.jpg", 
    title: "Curated Packages",
    subtitle: "Our Services",
    description: "Your comfort, your pace, your priorities – our experts build your perfect Saudi journey stitch by stitch."
  },
  packages: [
    { 
      name: "Umrah Packages", 
      img: "/assets/images/homepage/packages-section/umrah.webp",
      icon: Eye, 
      price: "From $800"
    },
    { 
      name: "Umrah Plus Packages", 
      img: "/assets/images/homepage/packages-section/UmrahPlus.webp",
      icon: Box, 
      price: "From $1200"
    },
    { 
      name: "Ziyarat Packages", 
      img: "/assets/images/homepage/packages-section/Ziyarat.webp",
      icon: Crown, 
      price: "From $2500"
    },
    { 
      name: "Transportation Packages", 
      img: "/assets/images/homepage/packages-section/transport.webp",
      icon: Star,
      price: "From $3000"
    },
    { 
      name: "Visit Saudi Packages", 
      img: "/assets/images/homepage/packages-section/Visit-Saudi.jpg",
      icon: ShieldCheck,
      price: "From $900"
    },
  ]
};