'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, ChevronLeft, ChevronUp, Mail, MessageCircle } from 'lucide-react';
import { SITE_CONFIG } from '@/data/siteConfig';

// --- MENU DATA STRUCTURE (Packages adjusted into Footer) ---
const NAV_ITEMS = [
  { label: "Home", href: "/" },
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
  { 
    label: "Transportation", 
    href: "/transportation",
    submenu: [
      { label: "Fixed Packages", href: "/transportation" },
      { label: "Book Your Trip", href: "/book-your-trip" }
    ]
  },
  { label: "Contact Us", href: "/contact" }
];

export default function Header() {
  const pathname = usePathname();

  // Hide the public header completely on all admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Home");
  
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState<string | null>(null);
  const [mobileNestedSubmenuOpen, setMobileNestedSubmenuOpen] = useState<string | null>(null);

  const rawNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '971522634471';
  const cleanNumber = rawNumber.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent('Assalamu Alaikum! I would like to inquire about Umrah Plus services.')}`;

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
          ? 'bg-[#0a0a0a]/95 backdrop-blur-md py-3.5 shadow-lg' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-8 xl:px-12">
        <div className="flex justify-between items-center gap-4">
          
          {/* LOGO */}
          <Link href="/" className="relative h-11 w-44 md:h-13 md:w-56 flex items-center z-50 shrink-0">
            <Image 
              src={SITE_CONFIG.header.logo}
              alt={SITE_CONFIG.header.logoAlt}
              fill
              className="object-contain object-left"
              priority
            />
          </Link>

          {/* DESKTOP MENU & ACTION ITEMS */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8 ml-auto">
            <nav className="flex items-center gap-6 xl:gap-7">
              {NAV_ITEMS.map((item, index) => {
                const hasDropdown = item.submenu && item.submenu.length > 0;
                const isActive = activeItem === item.label;

                return (
                  <div key={index} className="group relative flex items-center cursor-pointer h-full py-2">
                    <Link 
                      href={item.href} 
                      onClick={() => setActiveItem(item.label)}
                      className={`text-[14px] xl:text-[15px] font-medium tracking-wide transition-colors flex items-center gap-1.5 ${
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
                        <div className="w-60 bg-[#1a1a1a] border border-white/10 rounded-md shadow-2xl overflow-hidden">
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

                                  {/* LEVEL 3 DROPDOWN (If needed) */}
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

            {/* DIVIDER */}
            <div className="h-5 w-px bg-white/10 hidden xl:block" />

            {/* HEADER ACTIONS: EMAIL & WHATSAPP BUTTON */}
            <div className="flex items-center gap-3">
              {/* Email in Header */}
              <a 
                href="mailto:hello@umrahplus.me" 
                className="hidden xl:flex items-center gap-2 text-xs text-gray-300 hover:text-[#F9C344] transition-colors py-2 px-3.5 rounded-full bg-white/5 border border-white/10 hover:border-[#F9C344]/30"
                title="Send us an email"
              >
                <Mail size={13} className="text-[#F9C344]" />
                <span className="font-medium tracking-wide">hello@umrahplus.me</span>
              </a>

              {/* Contact Us WhatsApp Button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#F9C344] hover:bg-white text-black font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-full transition-all duration-300 shadow-md hover:shadow-[#F9C344]/20 hover:scale-105 active:scale-95"
                title="Chat with us on WhatsApp"
              >
                <MessageCircle size={15} className="fill-black text-black" />
                <span>Contact Us</span>
              </a>
            </div>
          </div>

          {/* MOBILE ACTIONS & TOGGLE */}
          <div className="lg:hidden flex items-center gap-3 ml-auto z-50">
            {/* Quick Contact Us Button on Mobile */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-[#F9C344] text-black font-bold text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-full"
            >
              <MessageCircle size={13} className="fill-black text-black" />
              <span>Contact</span>
            </a>

            {!mobileMenuOpen && (
              <button 
                className="text-white hover:text-[#F9C344] transition p-1"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={28} />
              </button>
            )}
          </div>

        </div>
      </div>

      {/* MOBILE MENU DRAWER */}
      <div 
        className={`fixed inset-0 bg-[#0a0a0a] z-[60] transition-transform duration-300 ease-in-out flex flex-col justify-between ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div>
          <div className="flex justify-between items-center p-6 border-b border-white/10">
            <Link href="/" className="relative h-12 w-48" onClick={() => setMobileMenuOpen(false)}>
              <Image 
                src={SITE_CONFIG.header.logo}
                alt="Logo"
                fill
                className="object-contain object-left"
              />
            </Link>
            <button onClick={() => setMobileMenuOpen(false)} className="text-[#F9C344] hover:text-white transition p-2">
              <X size={28} />
            </button>
          </div>

          <div className="flex flex-col p-6 gap-2 overflow-y-auto max-h-[calc(100vh-220px)]">
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
                      <span className={`text-lg font-bold ${activeItem === item.label ? 'text-[#F9C344]' : 'text-white'}`}>
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
                                 className="text-gray-300 text-sm hover:text-[#F9C344] block py-2 px-3 flex-1"
                               >
                                 {sub.label}
                               </Link>
                               {hasNested && (
                                 <ChevronDown size={15} className={`text-gray-400 transition-transform ${isNestedOpen ? 'rotate-180' : ''}`} />
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
                                      className="text-gray-400 text-xs hover:text-[#F9C344] block py-1.5"
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

        {/* MOBILE DRAWER FOOTER - EMAIL & WHATSAPP BUTTON */}
        <div className="p-6 border-t border-white/10 bg-[#111] space-y-3 mt-auto">
          <a
            href="mailto:hello@umrahplus.me"
            className="flex items-center justify-center gap-2 text-xs text-gray-300 hover:text-[#F9C344] py-2 bg-white/5 rounded-lg border border-white/10"
          >
            <Mail size={14} className="text-[#F9C344]" />
            <span>hello@umrahplus.me</span>
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-[#F9C344] text-black font-bold text-xs uppercase tracking-wider py-3 rounded-xl shadow-md"
          >
            <MessageCircle size={15} className="fill-black text-black" />
            <span>Contact Us on WhatsApp</span>
          </a>
        </div>

      </div>
    </header>
  );
}