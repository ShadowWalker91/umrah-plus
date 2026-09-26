'use client';

import Link from 'next/link';
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      id="section-7"
      className="snap-section snap-start min-h-[500px] lg:min-h-screen w-full bg-[#111] text-white relative flex flex-col justify-between pt-12 md:pt-16"
    >

      {/* 1. MAIN CONTENT (Centered Vertically) */}
      <div className="flex-1 flex items-center justify-center w-full pb-12">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-10">

          {/* Column 1 - ABOUT */}
          <div>
            <h3 className="text-[#F9C344] text-lg font-bold uppercase tracking-widest mb-2 font-serif">
              About Umrah Plus
            </h3>
            {/* Gold Underline */}
            <div className="w-8 h-0.5 bg-[#F9C344] mb-5"></div>

            <p className="text-gray-400 text-sm leading-relaxed text-justify">
              At Umrah Plus, we take pride in offering authentic, high-quality Umrah services across Saudi Arabia,
              ensuring a spiritually fulfilling and seamless journey for every pilgrim. We offer
              trusted private transportation, bespoke excursions, and guided Ziyarat experiences.
            </p>
          </div>

          {/* Column 2 - PACKAGES (Adjusted from navbar) */}
          <div>
            <h3 className="text-[#F9C344] text-lg font-bold uppercase tracking-widest mb-2 font-serif">
              Our Packages
            </h3>
            <div className="w-8 h-0.5 bg-[#F9C344] mb-5"></div>

            <ul className="space-y-3 text-gray-400 text-sm">
              <li>
                <Link href="/packages/umrah-packages" className="hover:text-[#F9C344] transition-colors duration-300 flex items-center gap-1.5">
                  <span className="text-[#F9C344] text-xs">›</span> Umrah Packages
                </Link>
              </li>
              <li>
                <Link href="/packages/umrah-plus-packages" className="hover:text-[#F9C344] transition-colors duration-300 flex items-center gap-1.5">
                  <span className="text-[#F9C344] text-xs">›</span> Umrah Plus Packages
                </Link>
              </li>
              <li>
                <Link href="/packages/ziyarat-packages" className="hover:text-[#F9C344] transition-colors duration-300 flex items-center gap-1.5">
                  <span className="text-[#F9C344] text-xs">›</span> Ziyarat Packages
                </Link>
              </li>
              <li>
                <Link href="/packages/transportation-packages" className="hover:text-[#F9C344] transition-colors duration-300 flex items-center gap-1.5">
                  <span className="text-[#F9C344] text-xs">›</span> Transportation Packages
                </Link>
              </li>
              <li>
                <Link href="/packages/explore-saudi-packages" className="hover:text-[#F9C344] transition-colors duration-300 flex items-center gap-1.5">
                  <span className="text-[#F9C344] text-xs">›</span> Explore Saudi Packages
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - EXPLORE & SERVICES */}
          <div>
            <h3 className="text-[#F9C344] text-lg font-bold uppercase tracking-widest mb-2 font-serif">
              Explore & Services
            </h3>
            <div className="w-8 h-0.5 bg-[#F9C344] mb-5"></div>

            <ul className="space-y-3 text-gray-400 text-sm">
              <li>
                <Link href="/transportation" className="hover:text-[#F9C344] transition-colors duration-300 flex items-center gap-1.5">
                  <span className="text-[#F9C344] text-xs">›</span> Fixed Transport Rates
                </Link>
              </li>
              <li>
                <Link href="/book-your-trip" className="hover:text-[#F9C344] transition-colors duration-300 flex items-center gap-1.5">
                  <span className="text-[#F9C344] text-xs">›</span> Book Your Trip Planner
                </Link>
              </li>
              <li>
                <Link href="/ziyarat/makkah-ziyarat" className="hover:text-[#F9C344] transition-colors duration-300 flex items-center gap-1.5">
                  <span className="text-[#F9C344] text-xs">›</span> Makkah Ziyarat Tours
                </Link>
              </li>
              <li>
                <Link href="/ziyarat/madinah-ziyarat" className="hover:text-[#F9C344] transition-colors duration-300 flex items-center gap-1.5">
                  <span className="text-[#F9C344] text-xs">›</span> Madinah Ziyarat Tours
                </Link>
              </li>
              <li>
                <Link href="/ziyarat/taif-ziyarat" className="hover:text-[#F9C344] transition-colors duration-300 flex items-center gap-1.5">
                  <span className="text-[#F9C344] text-xs">›</span> Taif Historical Sites
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - CONTACT US */}
          <div>
            <h3 className="text-[#F9C344] text-lg font-bold uppercase tracking-widest mb-2 font-serif">
              Contact Us
            </h3>
            <div className="w-8 h-0.5 bg-[#F9C344] mb-5"></div>

            <div className="space-y-4 text-gray-400 text-sm">
              {/* Phone */}
              <div className="flex items-center gap-3">
                <Phone className="text-[#F9C344] shrink-0" size={16} />
                <a href="tel:+97145857184" className="hover:text-white transition-colors">+971 4 585 7184</a>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3">
                <Mail className="text-[#F9C344] shrink-0" size={16} />
                <a href="mailto:hello@umrahplus.me" className="hover:text-white transition-colors">hello@umrahplus.me</a>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3">
                <MapPin className="text-[#F9C344] mt-1 shrink-0" size={16} />
                <span className="text-xs leading-relaxed">
                  Suite: 206, DBC Building,<br />
                  Al Khabaisi, Deira-Dubai,<br />
                  United Arab Emirates
                </span>
              </div>

              {/* Social Icons (Circles) */}
              <div className="flex flex-wrap gap-2.5 pt-3">
                {/* Facebook (Page) */}
                <a
                  href="https://www.facebook.com/abumrahplus"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook Page"
                  title="Facebook Page (@abumrahplus)"
                  className="w-8 h-8 rounded-full bg-[#F9C344] flex items-center justify-center text-black hover:bg-white hover:scale-110 transition-all duration-300 shadow-sm"
                >
                  <Facebook size={15} fill="black" strokeWidth={0} />
                </a>

                {/* Instagram (Professional Account) */}
                <a
                  href="https://www.instagram.com/abumrahplus"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram Account"
                  title="Instagram (@abumrahplus)"
                  className="w-8 h-8 rounded-full bg-[#F9C344] flex items-center justify-center text-black hover:bg-white hover:scale-110 transition-all duration-300 shadow-sm"
                >
                  <Instagram size={15} />
                </a>

                {/* LinkedIn (Company Page) */}
                <a
                  href="https://www.linkedin.com/company/abumrahplus"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Company Page"
                  title="LinkedIn (@abumrahplus)"
                  className="w-8 h-8 rounded-full bg-[#F9C344] flex items-center justify-center text-black hover:bg-white hover:scale-110 transition-all duration-300 shadow-sm"
                >
                  <Linkedin size={15} fill="black" strokeWidth={0} />
                </a>

                {/* TikTok (Account) */}
                <a
                  href="https://www.tiktok.com/@abumrahplus"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok Account"
                  title="TikTok (@abumrahplus)"
                  className="w-8 h-8 rounded-full bg-[#F9C344] flex items-center justify-center text-black hover:bg-white hover:scale-110 transition-all duration-300 shadow-sm"
                >
                  <svg className="w-3.5 h-3.5 fill-black" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
                  </svg>
                </a>

                {/* YouTube (Channel) */}
                <a
                  href="https://www.youtube.com/@abumrahplus"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube Channel"
                  title="YouTube Channel (@abumrahplus)"
                  className="w-8 h-8 rounded-full bg-[#F9C344] flex items-center justify-center text-black hover:bg-white hover:scale-110 transition-all duration-300 shadow-sm"
                >
                  <Youtube size={15} />
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 2. COPYRIGHT BAR (Sticks to bottom, distinct background) */}
      <div className="w-full bg-[#1a1a1a] py-5 border-t border-white/5 text-center">
        <p className="text-gray-500 text-xs md:text-sm">
          &copy; 2026 Copyrights by Umrah Plus. All Rights Reserved
        </p>
      </div>

    </footer>
  );
}