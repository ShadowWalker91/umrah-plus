'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ChevronDown, ChevronLeft, ChevronUp } from 'lucide-react';
import { SITE_CONFIG } from '@/data/siteConfig';

// --- MENU DATA STRUCTURE ---
const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { 
    label: "Makkah", 
    href: "/hotels/makkah", 
    submenu: [
      { label: "Hotel Details", href: "/hotels/makkah" },
      { label: "Hotels Search Query", href: "#" }
    ]
  },
  { 
    label: "Madinah", 
    href: "/hotels/madinah", 
    submenu: [
      { label: "Hotel Details", href: "/hotels/madinah" },
      { label: "Hotels Search Query", href: "#" }
    ]
  },
  { 
    label: "Ziyarat", 
    href: "/ziyarat", 
    submenu: [
      { label: "Makkah Ziyarat", href: "/ziyarat/makkah-ziyarat" }, 
      { label: "Taif Ziyarat", href: "/ziyarat/taif-ziyarat" },     
      { label: "Madinah Ziyarat", href: "/ziyarat/madinah-ziyarat" }, 
      { label: "Tabuk Ziyarat", href: "/ziyarat/tabuk-ziyarat" }    
    ]
  },
  { label: "Flights", href: "/flights" },
  { 
    label: "Transportation", 
    href: "/transportation",
    submenu: [
      { label: "Fixed Packages", href: "/transportation" },
      { label: "Book Your Trip", href: "/book-your-trip" }
    ]
  },
  
  // --- NEW ITEM: VIDEO GALLERY ---
  { label: "Video Gallery", href: "/video-gallery" },

  { 
    label: "Packages", 
    href: "/packages",
    // Level 2 (5 Items)
    submenu: [
      { 
        label: "Umrah", 
        href: "#",
        submenu: Array(6).fill(null).map((_, i) => ({ label: `Umrah Package ${i+1}`, href: "#" }))
      },
      { 
        label: "Umrah Plus", 
        href: "#",
        submenu: Array(6).fill(null).map((_, i) => ({ label: `Plus Package ${i+1}`, href: "#" }))
      },
      { 
        label: "Ziyarat", 
        href: "#",
        submenu: Array(6).fill(null).map((_, i) => ({ label: `Ziyarat Package ${i+1}`, href: "#" }))
      },
      { 
        label: "Transportation", 
        href: "#",
        submenu: Array(6).fill(null).map((_, i) => ({ label: `Transport Option ${i+1}`, href: "#" }))
      },
      { 
        label: "Explore Saudi", 
        href: "#",
        submenu: Array(6).fill(null).map((_, i) => ({ label: `Saudi Tour ${i+1}`, href: "#" }))
      }
    ]
  },
  { 
    label: "Explore Saudi", 
    href: "/explore",
    submenu: [
      { label: "Riyadh", href: "/explore/riyadh" },
      { label: "Jeddah", href: "/explore/jeddah" },
      { label: "Dammam", href: "/explore/dammam" },
      { label: "Makkah", href: "/explore/makkah" }, 
      { label: "Madinah", href: "/explore/madinah" }, 
      { label: "Al Ula", href: "/explore/al-ula" },
      { label: "Buredah Al Qasim", href: "/explore/buraydah" },
      { label: "Abha", href: "/explore/abha" },
      { label: "Tabuk", href: "/explore/tabuk" }, 
      { label: "Jizan", href: "/explore/jizan" },
      { label: "Al Bahah", href: "/explore/al-bahah" },
      { label: "Al Ahsa", href: "/explore/al-ahsa" }
    ]
  }
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Home");
  
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState<string | null>(null);
  const [mobileNestedSubmenuOpen, setMobileNestedSubmenuOpen] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileSubmenu = (label: string) => {
    if (mobileSubmenuOpen === label) setMobileSubmenuOpen(null);
    else setMobileSubmenuOpen(label);
  };

  const toggleMobileNestedSubmenu = (label: string) => {
    if (mobileNestedSubmenuOpen === label) setMobileNestedSubmenuOpen(null);
    else setMobileNestedSubmenuOpen(label);
  };

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b border-white/10 ${
        isScrolled 
          ? 'bg-[#0a0a0a]/95 backdrop-blur-md py-4 shadow-lg' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-8 xl:px-12">
        <div className="flex justify-between items-center">
          
          {/* LOGO - Left Aligned */}
          <Link href="/" className="relative h-12 w-48 md:h-14 md:w-60 flex items-center z-50 mr-auto">
            <Image 
              src={SITE_CONFIG.header.logo}
              alt={SITE_CONFIG.header.logoAlt}
              fill
              className="object-contain object-left"
              priority
            />
          </Link>

          {/* DESKTOP MENU - Right Aligned (Added ml-auto to parent container logic or kept flex-between) */}
          <nav className="hidden xl:flex items-center gap-6 2xl:gap-8 ml-auto">
            {NAV_ITEMS.map((item, index) => {
              const hasDropdown = item.submenu && item.submenu.length > 0;
              const isActive = activeItem === item.label;

              return (
                <div key={index} className="group relative flex items-center cursor-pointer h-full py-2">
                  <Link 
                    href={item.href} 
                    onClick={() => setActiveItem(item.label)}
                    className={`text-[15px] font-medium tracking-wide transition-colors flex items-center gap-1 ${
                      isActive ? 'text-[#F9C344]' : 'text-white hover:text-[#F9C344]'
                    }`}
                  >
                    {item.label}
                    {hasDropdown && (
                      <ChevronDown 
                        size={14} 
                        className={`transition-transform duration-300 group-hover:rotate-180 ${
                          isActive ? 'text-[#F9C344]' : 'text-white group-hover:text-[#F9C344]'
                        }`} 
                      />
                    )}
                  </Link>

                  {/* LEVEL 2 DROPDOWN */}
                  {hasDropdown && (
                    <div className="absolute top-full right-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                      <div className="w-60 bg-[#1a1a1a] border border-white/10 rounded-md shadow-2xl">
                        <div className="py-2">
                          {item.submenu!.map((subItem, subIdx) => {
                            // @ts-ignore
                            const hasNested = subItem.submenu && subItem.submenu.length > 0;

                            return (
                              <div key={subIdx} className="relative group/nested">
                                <Link 
                                  href={subItem.href}
                                  className="flex justify-between items-center px-5 py-3 text-sm text-gray-300 hover:text-[#F9C344] hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                                >
                                  {subItem.label}
                                  {hasNested && <ChevronLeft size={14} />}
                                </Link>

                                {/* LEVEL 3 DROPDOWN */}
                                {hasNested && (
                                  <div className="absolute right-full top-0 pr-1 opacity-0 invisible group-hover/nested:opacity-100 group-hover/nested:visible transition-all duration-200 transform translate-x-2 group-hover/nested:translate-x-0 z-50">
                                     <div className="w-56 bg-[#1a1a1a] border border-white/10 rounded-md shadow-2xl overflow-hidden">
                                       <div className="py-2">
                                         {/* @ts-ignore */}
                                         {subItem.submenu.map((nestedItem, nestedIdx) => (
                                           <Link 
                                              key={nestedIdx}
                                              href={nestedItem.href}
                                              className="block px-5 py-3 text-sm text-gray-300 hover:text-[#F9C344] hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                                           >
                                             {nestedItem.label}
                                           </Link>
                                         ))}
                                       </div>
                                     </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* MOBILE TOGGLE */}
          {!mobileMenuOpen && (
            <button 
              className="xl:hidden text-white hover:text-[#F9C344] transition z-50 ml-auto"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={32} />
            </button>
          )}
        </div>
      </div>

      {/* MOBILE MENU DRAWER */}
      <div 
        className={`fixed inset-0 bg-[#0a0a0a] z-[60] transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center p-6 border-b border-white/10">
           <Link href="/" className="relative h-12 w-52" onClick={() => setMobileMenuOpen(false)}>
            <Image 
              src={SITE_CONFIG.header.logo}
              alt="Logo"
              fill
              className="object-contain object-left"
            />
          </Link>
          <button onClick={() => setMobileMenuOpen(false)} className="text-[#F9C344] hover:text-white transition p-2">
            <X size={32} />
          </button>
        </div>

        <div className="flex flex-col p-6 gap-2 overflow-y-auto h-[calc(100vh-100px)]">
          {NAV_ITEMS.map((item, index) => {
            const hasDropdown = item.submenu && item.submenu.length > 0;
            const isOpen = mobileSubmenuOpen === item.label;

            return (
              <div key={index} className="border-b border-white/5 pb-2 last:border-0">
                <div 
                  className="flex justify-between items-center py-3 cursor-pointer"
                  onClick={() => {
                    if (hasDropdown) toggleMobileSubmenu(item.label);
                    else {
                      setActiveItem(item.label);
                      setMobileMenuOpen(false);
                    }
                  }}
                >
                  <Link href={item.href} onClick={() => !hasDropdown && setMobileMenuOpen(false)}>
                    <span className={`text-xl font-bold ${activeItem === item.label ? 'text-[#F9C344]' : 'text-white'}`}>
                      {item.label}
                    </span>
                  </Link>
                  {hasDropdown && (
                    <div className="text-[#F9C344]" onClick={(e) => { e.stopPropagation(); toggleMobileSubmenu(item.label); }}>
                      {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  )}
                </div>
                
                {hasDropdown && isOpen && (
                  <div className="pl-4 flex flex-col gap-1 pb-3 border-l-2 border-[#F9C344]/30 animate-fade-in bg-white/5 rounded-r-lg mt-2">
                    {item.submenu!.map((sub, idx) => {
                       // @ts-ignore
                       const hasNested = sub.submenu && sub.submenu.length > 0;
                       const isNestedOpen = mobileNestedSubmenuOpen === sub.label;

                       return (
                         <div key={idx}>
                           <div 
                              className="flex justify-between items-center pr-3"
                              onClick={() => hasNested && toggleMobileNestedSubmenu(sub.label)}
                           >
                             <Link 
                               href={sub.href}
                               onClick={() => !hasNested && setMobileMenuOpen(false)}
                               className="text-gray-300 text-base hover:text-[#F9C344] block py-2 px-3 flex-1"
                             >
                               {sub.label}
                             </Link>
                             {hasNested && (
                               <ChevronDown size={16} className={`text-gray-400 transition-transform ${isNestedOpen ? 'rotate-180' : ''}`} />
                             )}
                           </div>

                           {hasNested && isNestedOpen && (
                             <div className="pl-6 pb-2 border-l border-white/10 ml-3">
                                {/* @ts-ignore */}
                                {sub.submenu.map((nested, nIdx) => (
                                  <Link
                                    key={nIdx}
                                    href={nested.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-gray-400 text-sm hover:text-[#F9C344] block py-2"
                                  >
                                    {nested.label}
                                  </Link>
                                ))}
                             </div>
                           )}
                         </div>
                       )
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
}