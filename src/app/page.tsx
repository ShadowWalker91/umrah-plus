'use client';

import { useState, useEffect } from 'react';
import HeroSection from '@/components/home/HeroSection';
import MadinahSection from '@/components/home/MadinahSection';
import ZiyaratSection from '@/components/home/ZiyaratSection';
import TransportSection from '@/components/home/TransportSection';
import ExploreSection from '@/components/home/ExploreSection';
import PackagesSection from '@/components/home/PackagesSection';
import Footer from '@/components/Footer';

export default function Home() {
  const [activeSection, setActiveSection] = useState(1);

  // 1. SCROLL TO CLICKED SECTION
  const scrollTo = (id: string, index: number) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(index);
    }
  };

  // 2. WATCH SCROLLING TO UPDATE DOTS AUTOMATICALLY
  useEffect(() => {
    const sectionIds = [
      'section-1', 'section-2', 'section-3', 
      'section-4', 'section-5', 'section-6', 'section-7'
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionNumber = parseInt(entry.target.id.split('-')[1]);
            setActiveSection(sectionNumber);
          }
        });
      },
      {
        root: null,
        // KEY FIX: This creates a "detection line" in the middle of the screen (10% height).
        // It triggers strictly when a section occupies the center.
        rootMargin: '-45% 0px -45% 0px',
        threshold: 0, 
      }
    );

    // Start observing each section
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    // Cleanup observer when component unmounts
    return () => {
      sectionIds.forEach((id) => {
        const element = document.getElementById(id);
        if (element) observer.unobserve(element);
      });
    };
  }, []);

  return (
    <main className="snap-container h-screen w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth bg-black overflow-x-hidden">
      
      {/* Vertical Navigation Dots */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40 flex flex-col gap-4">
        {[1, 2, 3, 4, 5, 6, 7].map((num) => (
          <button
            key={num}
            onClick={() => scrollTo(`section-${num}`, num)}
            className={`w-2.5 h-2.5 rounded-full border border-white transition-all duration-300 ${
              activeSection === num 
                ? 'bg-white scale-150' 
                : 'bg-transparent hover:bg-white/50'
            }`}
            aria-label={`Go to section ${num}`}
          />
        ))}
      </div>

      {/* --- Page Sections --- */}
      <HeroSection scrollToNext={() => scrollTo('section-2', 2)} />
      <MadinahSection />
      <ZiyaratSection />
      <TransportSection />
      <ExploreSection />
      <PackagesSection />
      
      {/* Footer is Section 7 */}
      <Footer /> 
      
    </main>
  );
}