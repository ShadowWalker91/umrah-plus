import { db } from '../src/lib/db';
import { explorePackages, explorePackageVehicles } from '../src/lib/db/schema/explorePackages';
import { vehicles } from '../src/lib/db/schema/transport';
import { eq } from 'drizzle-orm';

// The structured data for the 12 cities
const citiesToMigrate = [
  {
    citySlug: 'riyadh',
    title: 'Riyadh City Highlights Tour',
    description: 'Explore the modern capital of Saudi Arabia, from the towering Kingdom Centre to the historic Masmak Fortress.',
    durationDays: 1,
    destinations: ['Masmak Fortress', 'Kingdom Centre Tower', 'National Museum', 'Diriyah'],
    includes: ['Professional Guide', 'Bottled Water', 'Hotel Pickup'],
    vehiclePrices: [
      { vehicleName: 'Standard Sedan', price: 200 }, // Ensure these names match what is in your DB
      { vehicleName: 'Luxury SUV', price: 350 }
    ]
  },
  {
    citySlug: 'jeddah',
    title: 'Historical Jeddah & Red Sea Coast',
    description: 'Discover Al Balad, the historic center of Jeddah, and enjoy the beautiful Red Sea Corniche.',
    durationDays: 1,
    destinations: ['Al Balad (Old Town)', 'Jeddah Corniche', 'King Fahd Fountain', 'Nasseef House'],
    includes: ['Professional Guide', 'Bottled Water', 'Hotel Pickup'],
    vehiclePrices: [
      { vehicleName: 'Standard Sedan', price: 220 },
      { vehicleName: 'Luxury SUV', price: 380 }
    ]
  },
  {
    citySlug: 'dammam',
    title: 'Dammam Coastal Experience',
    description: 'Experience the primary seaport city on the Arabian Gulf, featuring beautiful parks and corniche.',
    durationDays: 1,
    destinations: ['Dammam Corniche', 'King Fahd Park', 'Half Moon Bay', 'Heritage Village'],
    includes: ['Professional Guide', 'Bottled Water', 'Hotel Pickup'],
    vehiclePrices: [
      { vehicleName: 'Standard Sedan', price: 180 },
      { vehicleName: 'Luxury SUV', price: 320 }
    ]
  },
  {
    citySlug: 'makkah',
    title: 'Historical Ziyarat Tour',
    description: 'A comprehensive guided tour covering the most significant historical sites in and around the Holy City of Makkah.',
    durationDays: 1,
    destinations: ['Jabal al-Nour (Cave of Hira)', 'Jabal Thawr', 'Arafat', 'Mina', 'Muzdalifah'],
    includes: ['Experienced Guide', 'Bottled Zamzam Water', 'Hotel Pickup & Drop-off'],
    vehiclePrices: [
      { vehicleName: 'Standard Sedan', price: 150 },
      { vehicleName: 'Luxury SUV', price: 280 }
    ]
  },
  {
    citySlug: 'madinah',
    title: 'Madinah Historical Ziyarat',
    description: 'Visit the sacred sites in Madinah, including the first mosque built by Prophet Muhammad (PBUH).',
    durationDays: 1,
    destinations: ['Quba Mosque', 'Mount Uhud', 'Masjid al-Qiblatayn', 'Seven Mosques'],
    includes: ['Experienced Guide', 'Bottled Water', 'Hotel Pickup & Drop-off'],
    vehiclePrices: [
      { vehicleName: 'Standard Sedan', price: 150 },
      { vehicleName: 'Luxury SUV', price: 280 }
    ]
  },
  {
    citySlug: 'al-ula', // Note: Make sure this slug matches your CITIES_DATA slug
    title: 'Al Ula Heritage Tour',
    description: 'Journey through time in Al Ula, home to Saudi Arabia’s first UNESCO World Heritage Site.',
    durationDays: 1,
    destinations: ['Hegra (Madain Saleh)', 'Elephant Rock', 'Al Ula Old Town', 'Maraya Concert Hall'],
    includes: ['Professional Guide', 'Bottled Water', 'Hotel Pickup'],
    vehiclePrices: [
      { vehicleName: 'Standard Sedan', price: 400 },
      { vehicleName: 'Luxury SUV', price: 600 }
    ]
  },
  {
    citySlug: 'buraydah', // Note: Assuming the slug for 'Buredah Al Qasim' is 'buraydah'
    title: 'Al Qassim Cultural Tour',
    description: 'Explore Buraydah, the capital of Al Qassim region, known for its agriculture and heritage.',
    durationDays: 1,
    destinations: ['Buraydah Date City', 'Aloqilat Museum', 'King Khalid Park'],
    includes: ['Professional Guide', 'Bottled Water', 'Hotel Pickup'],
    vehiclePrices: [
      { vehicleName: 'Standard Sedan', price: 180 },
      { vehicleName: 'Luxury SUV', price: 320 }
    ]
  },
  {
    citySlug: 'abha',
    title: 'Abha Mountain Adventure',
    description: 'Discover the high-altitude city of Abha, known for its mild climate and stunning mountain vistas.',
    durationDays: 1,
    destinations: ['Green Mountain', 'Al Muftaha Village', 'Habala (Hanging Village)', 'Aseer National Park'],
    includes: ['Professional Guide', 'Bottled Water', 'Hotel Pickup'],
    vehiclePrices: [
      { vehicleName: 'Standard Sedan', price: 250 },
      { vehicleName: 'Luxury SUV', price: 450 }
    ]
  },
  {
    citySlug: 'tabuk',
    title: 'Tabuk Historical Journey',
    description: 'Explore the northwestern city of Tabuk, rich in history and archaeological sites.',
    durationDays: 1,
    destinations: ['Tabuk Castle', 'Al Tawba Mosque', 'Hejaz Railway Station'],
    includes: ['Professional Guide', 'Bottled Water', 'Hotel Pickup'],
    vehiclePrices: [
      { vehicleName: 'Standard Sedan', price: 200 },
      { vehicleName: 'Luxury SUV', price: 350 }
    ]
  },
  {
    citySlug: 'jizan',
    title: 'Jizan Coastal & Heritage Tour',
    description: 'Visit the port city of Jizan, known for its beautiful coastline and historic forts.',
    durationDays: 1,
    destinations: ['Dosariyah Castle', 'Jizan Heritage Village', 'North Corniche'],
    includes: ['Professional Guide', 'Bottled Water', 'Hotel Pickup'],
    vehiclePrices: [
      { vehicleName: 'Standard Sedan', price: 200 },
      { vehicleName: 'Luxury SUV', price: 350 }
    ]
  },
  {
    citySlug: 'al-baha', // Note: Assuming slug
    title: 'Al Baha Nature & Heritage Tour',
    description: 'Experience the beauty of Al Baha, famous for its forests, mountains, and traditional villages.',
    durationDays: 1,
    destinations: ['Thee Ain Ancient Village', 'Raghadan Forest Park', 'Al Khulb Park'],
    includes: ['Professional Guide', 'Bottled Water', 'Hotel Pickup'],
    vehiclePrices: [
      { vehicleName: 'Standard Sedan', price: 250 },
      { vehicleName: 'Luxury SUV', price: 450 }
    ]
  },
  {
    citySlug: 'al-ahsa', // Note: Assuming slug
    title: 'Al Ahsa Oasis Experience',
    description: 'Discover the largest oasis in the world and a UNESCO World Heritage Site.',
    durationDays: 1,
    destinations: ['Al Qarah Mountain', 'Ibrahim Palace', 'Jawatha Mosque', 'Al Qaisariya Souq'],
    includes: ['Professional Guide', 'Bottled Water', 'Hotel Pickup'],
    vehiclePrices: [
      { vehicleName: 'Standard Sedan', price: 220 },
      { vehicleName: 'Luxury SUV', price: 380 }
    ]
  }
];

async function runMigration() {
  console.log('Starting data migration...');
  let insertedCount = 0;

  try {
    for (const pkg of citiesToMigrate) {
      console.log(`Processing: ${pkg.citySlug}`);

      // 1. Insert the main package
      const [newPackage] = await db.insert(explorePackages).values({
        citySlug: pkg.citySlug,
        title: pkg.title,
        description: pkg.description,
        durationDays: pkg.durationDays,
        destinations: pkg.destinations,
        includes: pkg.includes,
      }).returning({ id: explorePackages.id });

      // 2. Link the vehicles
      for (const vp of pkg.vehiclePrices) {
        const [vehicleRecord] = await db
          .select()
          .from(vehicles)
          .where(eq(vehicles.name, vp.vehicleName))
          .limit(1);

        if (vehicleRecord) {
          await db.insert(explorePackageVehicles).values({
            packageId: newPackage.id,
            vehicleId: vehicleRecord.id,
            basePrice: vp.price,
          });
          console.log(`  - Linked vehicle '${vp.vehicleName}' at $${vp.price}`);
        } else {
          console.warn(`  ! Warning: Vehicle '${vp.vehicleName}' not found in DB. Could not link to package '${pkg.title}'.`);
        }
      }
      insertedCount++;
    }

    console.log(`\n✅ Migration complete! Successfully inserted ${insertedCount} packages.`);
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  }
}

runMigration();