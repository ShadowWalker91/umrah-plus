import { makkahContent } from "./makkah";
import { madinahContent } from "./madinah";
import { taifContent } from "./taif"; 
import { tabukContent } from "./tabuk";

export interface ZiyaratContent {
  title: string;
  urduTitle: string;
  description: string;
  history: string;
  bannerImage: string;
  videoUrl?: string;
  gallery: string[];
  location: string;
  timings: string;
}

export const ZIYARAT_CONTENT: Record<string, Record<string, ZiyaratContent>> = {
  "makkah": makkahContent,
  "madinah": madinahContent,
  "taif": taifContent, // Add Taif here
};