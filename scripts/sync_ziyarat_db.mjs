import postgres from 'postgres';
import fs from 'fs';
import { makkahContent } from '../src/data/ziyarat/content/makkah.ts';
import { madinahContent } from '../src/data/ziyarat/content/madinah.ts';
import { taifContent } from '../src/data/ziyarat/content/taif.ts';

const envText = fs.readFileSync('.env', 'utf-8');
const match = envText.match(/DATABASE_URL="([^"]+)"/);
const connStr = match ? match[1] : process.env.DATABASE_URL;

const sql = postgres(connStr, { prepare: false, connect_timeout: 15 });

async function syncAll() {
  console.log("Starting DB sync with rich Ziyarat content...");

  const datasets = [
    { city: 'Makkah', data: makkahContent },
    { city: 'Madinah', data: madinahContent },
    { city: 'Taif', data: taifContent },
  ];

  let totalUpdated = 0;
  let totalInserted = 0;

  for (const { city, data } of datasets) {
    console.log(`\nSyncing ${city} (${Object.keys(data).length} sites)...`);

    for (const [slug, item] of Object.entries(data)) {
      // Check if row exists
      const existing = await sql`
        SELECT id FROM ziyarat_landmarks WHERE slug = ${slug}
      `;

      if (existing.length > 0) {
        await sql`
          UPDATE ziyarat_landmarks
          SET 
            name = ${item.title || slug},
            "urduTitle" = COALESCE(${item.urduTitle || null}, "urduTitle"),
            city = ${city},
            "shortDescription" = ${item.description || null},
            "fullHistory" = ${item.history || null},
            "location" = ${item.location || null},
            "timings" = ${item.timings || null},
            "bannerImage" = COALESCE(NULLIF(${item.bannerImage || ''}, ''), "bannerImage"),
            "videoUrl" = COALESCE(NULLIF(${item.videoUrl || ''}, ''), "videoUrl"),
            "updatedAt" = NOW()
          WHERE slug = ${slug}
        `;
        totalUpdated++;
      } else {
        await sql`
          INSERT INTO ziyarat_landmarks (
            id, name, "urduTitle", slug, city, "shortDescription", "fullHistory",
            "bannerImage", images, "videoUrl", "location", "timings"
          ) VALUES (
            gen_random_uuid(),
            ${item.title || slug},
            ${item.urduTitle || null},
            ${slug},
            ${city},
            ${item.description || null},
            ${item.history || null},
            ${item.bannerImage || null},
            ${JSON.stringify(item.gallery || [])},
            ${item.videoUrl || null},
            ${item.location || null},
            ${item.timings || null}
          )
        `;
        totalInserted++;
      }
    }
  }

  console.log(`\nSync Complete!`);
  console.log(`Total Updated: ${totalUpdated}`);
  console.log(`Total Inserted: ${totalInserted}`);

  await sql.end();
}

syncAll().catch((err) => {
  console.error("Sync error:", err);
  process.exit(1);
});
