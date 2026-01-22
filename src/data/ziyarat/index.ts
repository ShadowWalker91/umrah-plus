import { makkahZiyarat } from './makkah';
import { madinahZiyarat } from './madinah';
import { taifZiyarat } from './taif';
import { tabukZiyarat } from './tabuk';

// 1. Specific Ziyarat Details for [city] pages
export const ZIYARAT_DETAILS = {
  makkah: makkahZiyarat,
  madinah: madinahZiyarat,
  taif: taifZiyarat,
  tabuk: tabukZiyarat,
};

// 2. Ziyarat Cities Summary (Used for sliders/navigation)
// UPDATED: Links now include "-ziyarat" suffix
export const ZIYARAT_CITIES_SUMMARY = [
  { 
    name: "Makkah", 
    slug: "makkah", 
    link: "/ziyarat/makkah-ziyarat", 
    img: "/assets/images/ziyarat/MakkahZiyaratCover.webp", 
    label: "Holy City" 
  },
  { 
    name: "Madinah", 
    slug: "madinah", 
    link: "/ziyarat/madinah-ziyarat", 
    img: "/assets/images/ziyarat/MadinahZiyaratCover.webp", 
    label: "City of Prophet" 
  },
  { 
    name: "Taif", 
    slug: "taif", 
    link: "/ziyarat/taif-ziyarat", 
    img: "/assets/images/ziyarat/TaifZiyaratCover.webp", 
    label: "City of Roses" 
  },
  { 
    name: "Tabuk", 
    slug: "tabuk", 
    link: "/ziyarat/tabuk-ziyarat", 
    img: "/assets/images/ziyarat/TabukZiyaratCover.webp", 
    label: "Historic Region" 
  },
];