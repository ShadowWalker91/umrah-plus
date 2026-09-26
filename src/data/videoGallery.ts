export interface VideoItem {
  id: string; // YouTube Video ID
  title: string;
  thumbnail: string;
}

// REAL YouTube IDs for Saudi Tourism
const REAL_VIDEOS = [
  { id: "At5De2VBtRw", title: "Explore the Beauty of Saudi Nature" },
  { id: "EcqpaB27I3U", title: "First Impressions Jeddah" },
  { id: "x6MmvK8WFxw", title: "Riyadh Season Mega Festival" },
  { id: "lfJjRteicJI", title: "Al Ula & Hegra: Ancient History" },
  { id: "eS8u0LT3RK8", title: "AlUla: Always Revitalising" },
  { id: "wH2u4BJ23lE", title: "Inside Historic Al-Balad" },
  { id: "z2Fy4e-ZUb8", title: "This is NEOM" },
  { id: "ClhK9QGUGzQ", title: "Red Sea Global: The PIF Effect" },
  { id: "jQSqQWhfd-M", title: "Jeddah 4K Walking Tour" },
  { id: "8NT3MKOTlKQ", title: "Historic Jeddah: Gate to Makkah" },
  { id: "QdIMvC7ZVDA", title: "Al Balad Historic Neighborhood" },
  { id: "_rrZUN8On8w", title: "AlUla Travel Guide" },
];

// Generate 30 items by repeating the real list
export const VIDEO_DATA: VideoItem[] = Array.from({ length: 30 }).map((_, i) => {
  const video = REAL_VIDEOS[i % REAL_VIDEOS.length];
  return {
    id: video.id,
    title: video.title,
    // Use 'hqdefault.jpg' as a safer fallback if 'maxresdefault' is missing for some videos,
    // but these specific IDs should have maxres.
    thumbnail: `https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`,
  };
});