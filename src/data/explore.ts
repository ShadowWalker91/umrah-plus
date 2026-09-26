export const EXPLORE_DATA = {
  banner: {
    title: "Welcome To Saudi Arabia",
    image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-13.png",
  },
  
  // --- STYLES: HIDE EVERYTHING EXCEPT TERRAIN ---
  mapStyles: [
    {
      "featureType": "all",
      "elementType": "labels",
      "stylers": [{ "visibility": "off" }] // HIDE ALL DEFAULT LABELS (Cities, Countries)
    },
    {
      "featureType": "administrative.country",
      "elementType": "geometry.stroke",
      "stylers": [{ "visibility": "on" }, { "color": "#d6d6d6" }, { "weight": 1 }] // Country Borders
    },
    {
      "featureType": "administrative.province",
      "elementType": "geometry.stroke",
      "stylers": [{ "visibility": "off" }] // Hide default province lines (we draw our own on hover)
    },
    {
      "featureType": "landscape",
      "elementType": "geometry",
      "stylers": [{ "color": "#f9f9f9" }] // Very light grey land
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [{ "color": "#c9ecf5" }] // Visit Saudi Blue
    },
    {
      "featureType": "road",
      "stylers": [{ "visibility": "off" }] // No Roads
    },
    {
      "featureType": "poi",
      "stylers": [{ "visibility": "off" }] // No POIs
    }
  ],
  
  // --- PINS (ALL SAUDI CITIES) ---
  pins: [
    // REGION: CENTRAL (Riyadh)
    { 
      id: 1, city: "Riyadh", slug: "riyadh", lat: 24.7136, lng: 46.6753, region: "central",
      tooltip: "The Capital" 
    },
    { 
      id: 2, city: "Diriyah", slug: "diriyah", lat: 24.7337, lng: 46.5746, region: "central",
      tooltip: "The Birthplace" 
    },
    { 
      id: 3, city: "Buraydah", slug: "buraydah", lat: 26.3592, lng: 43.9818, region: "central",
      tooltip: "Al Qassim" 
    },

    // REGION: WESTERN (Makkah/Madinah)
    { 
      id: 4, city: "Jeddah", slug: "jeddah", lat: 21.5433, lng: 39.1728, region: "western",
      tooltip: "Bride of the Red Sea" 
    },
    { 
      id: 5, city: "Makkah", slug: "makkah", lat: 21.3891, lng: 39.8579, region: "western",
      tooltip: "Holy City" 
    },
    { 
      id: 6, city: "Madinah", slug: "madinah", lat: 24.5247, lng: 39.5692, region: "western",
      tooltip: "The Radiant City" 
    },
    { 
      id: 7, city: "Taif", slug: "taif", lat: 21.2841, lng: 40.4248, region: "western",
      tooltip: "City of Roses" 
    },
    { 
      id: 8, city: "Yanbu", slug: "yanbu", lat: 24.0891, lng: 38.0637, region: "western",
      tooltip: "Pearl of Red Sea" 
    },
    { 
      id: 9, city: "KAEC", slug: "kaec", lat: 22.4104, lng: 39.0886, region: "western",
      tooltip: "Economic City" 
    },

    // REGION: EASTERN
    { 
      id: 10, city: "Dammam", slug: "dammam", lat: 26.4207, lng: 50.0888, region: "eastern",
      tooltip: "Eastern Hub" 
    },
    { 
      id: 11, city: "Khobar", slug: "khobar", lat: 26.2172, lng: 50.1971, region: "eastern",
      tooltip: "The Corniche" 
    },
    { 
      id: 12, city: "Dhahran", slug: "dhahran", lat: 26.2361, lng: 50.0393, region: "eastern",
      tooltip: "Energy Hub" 
    },
    { 
      id: 13, city: "Al Ahsa", slug: "al-ahsa", lat: 25.3800, lng: 49.5888, region: "eastern",
      tooltip: "Largest Oasis" 
    },
    { 
      id: 14, city: "Jubail", slug: "jubail", lat: 27.0000, lng: 49.6600, region: "eastern",
      tooltip: "Industrial City" 
    },

    // REGION: NORTHERN
    { 
      id: 15, city: "Tabuk", slug: "tabuk", lat: 28.3835, lng: 36.5662, region: "northern",
      tooltip: "Gateway to North" 
    },
    { 
      id: 16, city: "Al Ula", slug: "al-ula", lat: 26.6198, lng: 37.9306, region: "northern",
      tooltip: "Living Museum" 
    },
    { 
      id: 17, city: "Neom", slug: "neom", lat: 28.2933, lng: 35.0440, region: "northern",
      tooltip: "The Future" 
    },
    { 
      id: 18, city: "Hail", slug: "hail", lat: 27.5219, lng: 41.6961, region: "northern",
      tooltip: "Golden Desert" 
    },
    { 
      id: 19, city: "Arar", slug: "arar", lat: 30.9753, lng: 41.0381, region: "northern",
      tooltip: "Northern Border" 
    },

    // REGION: SOUTHERN
    { 
      id: 20, city: "Abha", slug: "abha", lat: 18.2164, lng: 42.5053, region: "southern",
      tooltip: "High City" 
    },
    { 
      id: 21, city: "Jizan", slug: "jizan", lat: 16.8894, lng: 42.5706, region: "southern",
      tooltip: "Coastal South" 
    },
    { 
      id: 22, city: "Al Baha", slug: "al-baha", lat: 20.0129, lng: 41.4677, region: "southern",
      tooltip: "Garden of Hejaz" 
    },
    { 
      id: 23, city: "Najran", slug: "najran", lat: 17.4917, lng: 44.1322, region: "southern",
      tooltip: "Historic Valley" 
    }
  ],

  // --- BOUNDARY POLYGONS (Approximate Regional Borders) ---
  regions: {
    central: [ // Riyadh, Qassim
      { lat: 28.0, lng: 42.0 }, { lat: 28.0, lng: 47.0 }, 
      { lat: 22.0, lng: 47.0 }, { lat: 20.0, lng: 44.0 }, { lat: 23.0, lng: 41.0 }
    ],
    western: [ // Makkah, Madinah
      { lat: 26.0, lng: 36.0 }, { lat: 26.0, lng: 41.0 }, 
      { lat: 21.0, lng: 42.0 }, { lat: 19.0, lng: 41.0 }, { lat: 19.0, lng: 39.0 }, { lat: 22.0, lng: 38.0 }
    ],
    eastern: [ // Eastern Province
      { lat: 29.0, lng: 46.0 }, { lat: 28.0, lng: 51.0 }, 
      { lat: 24.0, lng: 55.0 }, { lat: 19.0, lng: 55.0 }, { lat: 20.0, lng: 48.0 }
    ],
    northern: [ // Tabuk, Hail, Northern Borders
      { lat: 32.0, lng: 34.0 }, { lat: 32.0, lng: 42.0 }, 
      { lat: 28.0, lng: 42.0 }, { lat: 26.0, lng: 40.0 }, { lat: 26.0, lng: 36.0 }
    ],
    southern: [ // Asir, Jizan, Najran
      { lat: 20.0, lng: 41.0 }, { lat: 20.0, lng: 46.0 }, 
      { lat: 17.0, lng: 46.0 }, { lat: 16.0, lng: 43.0 }, { lat: 17.0, lng: 41.0 }
    ]
  },
  
  // Cities for the Slider (Just keeping the main ones for cleaner UI, or add all if you wish)
  cities: [
    { name: "Riyadh", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-13.png", slug: "riyadh", lat: 24.7136, lng: 46.6753, region: "central" },
    { name: "Jeddah", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/mohammed-alorabi-_ABfNIGGsZk-unsplash-scaled.jpg", slug: "jeddah", lat: 21.5433, lng: 39.1728, region: "western" },
    { name: "Makkah", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-15.png", slug: "makkah", lat: 21.3891, lng: 39.8579, region: "western" },
    { name: "Madinah", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-14.png", slug: "madinah", lat: 24.5247, lng: 39.5692, region: "western" },
    { name: "Al Ula", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/al-ula.jpeg", slug: "al-ula", lat: 26.6198, lng: 37.9306, region: "northern" },
    { name: "Dammam", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-12-1.png", slug: "dammam", lat: 26.4207, lng: 50.0888, region: "eastern" },
    { name: "Tabuk", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/Background-9-1.png", slug: "tabuk", lat: 28.3835, lng: 36.5662, region: "northern" },
    { name: "Abha", image: "https://www.cosmic.beesocialpk.com/wp-content/uploads/2025/10/abha.jpeg", slug: "abha", lat: 18.2164, lng: 42.5053, region: "southern" },
  ]
};