'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Play, X, ChevronRight, ChevronLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { VIDEO_DATA } from '@/data/videoGallery';

export default function VideoGalleryPage() {
  // --- STATE ---
  // Initial load: 3 rows * 4 videos = 12 videos
  const [visibleCount, setVisibleCount] = useState(12);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number | null>(null);

  // --- HANDLERS ---
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 12);
  };

  const openVideo = (index: number) => {
    setSelectedVideoIndex(index);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeVideo = useCallback(() => {
    setSelectedVideoIndex(null);
    document.body.style.overflow = 'auto';
  }, []);

  const handleNextVideo = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedVideoIndex !== null) {
      // Cycle to next video (loop back to start if at end)
      setSelectedVideoIndex((prev) => {
        if (prev === null) return null;
        return (prev + 1) % VIDEO_DATA.length;
      });
    }
  }, [selectedVideoIndex]);

  const handlePrevVideo = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedVideoIndex !== null) {
      // Cycle to prev video
      setSelectedVideoIndex((prev) => {
        if (prev === null) return null;
        return (prev - 1 + VIDEO_DATA.length) % VIDEO_DATA.length;
      });
    }
  }, [selectedVideoIndex]);

  // Keyboard navigation for popup
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (selectedVideoIndex === null) return;
      
      if (e.key === 'Escape') {
        closeVideo();
      } else if (e.key === 'ArrowRight') {
        handleNextVideo();
      } else if (e.key === 'ArrowLeft') {
        handlePrevVideo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedVideoIndex, closeVideo, handleNextVideo, handlePrevVideo]);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans">
      {/* 1. Header with Black Background */}
      <div className="sticky top-0 z-50 bg-[#0a0a0a] border-b border-white/10 shadow-lg">
        <Header />
      </div>

      <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-20 w-full min-h-[80vh]">
        
        <div className="text-center mb-16">
          <h1 className="text-[#F9C344] font-bold uppercase tracking-widest text-sm mb-4">Multimedia</h1>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white">Video Gallery</h2>
        </div>

        {/* 2. VIDEO GRID (4 Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VIDEO_DATA.slice(0, visibleCount).map((video, idx) => (
            <div 
              key={idx} 
              className="group relative aspect-video bg-[#1a1a1a] rounded-xl overflow-hidden cursor-pointer border border-white/10 hover:border-[#F9C344] transition-all duration-300"
              onClick={() => openVideo(idx)}
            >
              <Image 
                src={video.thumbnail} 
                alt={video.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
              />
              
              {/* Play Icon Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                  <Play size={20} className="fill-white text-white ml-1" />
                </div>
              </div>

              <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
                <h3 className="text-sm font-bold text-white truncate">{video.title}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* 3. LOAD MORE BUTTON */}
        {visibleCount < VIDEO_DATA.length && (
          <div className="flex justify-center mt-16">
            <button 
              onClick={handleLoadMore}
              className="px-8 py-3 bg-transparent border border-[#F9C344] text-[#F9C344] hover:bg-[#F9C344] hover:text-black rounded-full font-bold uppercase tracking-widest transition-all duration-300"
            >
              Load More
            </button>
          </div>
        )}
      </main>

      <Footer />

      {/* 4. VIDEO POP-UP MODAL */}
      {selectedVideoIndex !== null && VIDEO_DATA[selectedVideoIndex] && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10 animate-fade-in"
          onClick={closeVideo} // Close on backdrop click
        >
          {/* Close Button */}
          <button 
            onClick={closeVideo}
            className="absolute top-6 right-6 text-white/50 hover:text-[#F9C344] transition-colors z-50 p-2"
          >
            <X size={40} />
          </button>

          {/* Previous Button */}
          <button 
            onClick={handlePrevVideo}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-[#F9C344] transition-colors z-50 p-4 hidden md:block"
          >
            <ChevronLeft size={60} />
          </button>

          {/* Next Button */}
          <button 
            onClick={handleNextVideo}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-[#F9C344] transition-colors z-50 p-4 hidden md:block"
          >
            <ChevronRight size={60} />
          </button>

          {/* Video Container */}
          <div 
            className="relative w-full max-w-6xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside video
          >
            <iframe 
              width="100%" 
              height="100%" 
              src={`https://www.youtube.com/embed/${VIDEO_DATA[selectedVideoIndex].id}?autoplay=1&rel=0`}
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              className="w-full h-full"
            />
          </div>

          {/* Mobile Navigation (Bottom) */}
          <div className="absolute bottom-10 left-0 w-full flex justify-center gap-10 md:hidden" onClick={(e) => e.stopPropagation()}>
             <button onClick={handlePrevVideo} className="p-3 bg-white/10 rounded-full text-white"><ChevronLeft /></button>
             <button onClick={handleNextVideo} className="p-3 bg-white/10 rounded-full text-white"><ChevronRight /></button>
          </div>
        </div>
      )}
    </div>
  );
}