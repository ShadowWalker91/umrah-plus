import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { ZiyaratContent } from '@/data/ziyarat/content/index';

// Import all static content
import { taifContent } from '@/data/ziyarat/content/taif';
import { makkahContent } from '@/data/ziyarat/content/makkah';
import { madinahContent } from '@/data/ziyarat/content/madinah';
import { tabukContent } from '@/data/ziyarat/content/tabuk';

// 1. Map city names to their content objects
const CITY_CONTENT_MAP: Record<string, Record<string, ZiyaratContent>> = {
  taif: taifContent,
  makkah: makkahContent,
  madinah: madinahContent,
  tabuk: tabukContent,
};

// 2. Base Directory for MD files
const BASE_DOCS_DIR = path.join(process.cwd(), 'public/assets/docs/ziyarat');

/**
 * Universal function to get Ziyarat data for ANY city
 * @param city - 'makkah', 'madinah', 'taif', or 'tabuk'
 * @param slug - The specific site ID (e.g., 'masjid-quba')
 */
export function getZiyaratData(city: string, slug: string): ZiyaratContent | null {
  
  // A. Get the correct content object for the city
  const cityData = CITY_CONTENT_MAP[city.toLowerCase()];
  if (!cityData) {
    console.error(`Invalid city requested: ${city}`);
    return null;
  }

  // B. Get the static data for the specific site
  const staticData = cityData[slug];
  if (!staticData) return null;

  try {
    // C. Construct path: public/assets/docs/ziyarat/[city]/[slug].md
    const filePath = path.join(BASE_DOCS_DIR, city.toLowerCase(), `${slug}.md`);

    // D. Check if file exists
    if (!fs.existsSync(filePath)) {
      console.warn(`Markdown file missing for: ${city}/${slug}`);
      return staticData; // Return data without history if MD is missing
    }

    // E. Read and Parse MD
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { content } = matter(fileContent);

    // F. Merge and Return
    return {
      ...staticData,
      history: content, 
    };

  } catch (error) {
    console.error(`Error reading ${city} Ziyarat MD file:`, error);
    return staticData;
  }
}

// --- OPTIONAL: Specific Wrappers (If you prefer importing specific functions) ---

export const getTaifZiyarat = (slug: string) => getZiyaratData('taif', slug);
export const getMakkahZiyarat = (slug: string) => getZiyaratData('makkah', slug);
export const getMadinahZiyarat = (slug: string) => getZiyaratData('madinah', slug);
export const getTabukZiyarat = (slug: string) => getZiyaratData('tabuk', slug);