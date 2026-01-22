'use client';

import Link from 'next/link';
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer 
      id="section-7" 
      className="snap-section snap-start h-screen w-full bg-[#111] text-white relative flex flex-col justify-between"
    >
      
      {/* 1. MAIN CONTENT (Centered Vertically) */}
      <div className="flex-1 flex items-center justify-center w-full">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
          
          {/* Column 1 - ABOUT */}
          <div>
            <h3 className="text-[#F9C344] text-xl font-bold uppercase tracking-widest mb-2">
              About Umrah Plus
            </h3>
            {/* Gold Underline */}
            <div className="w-8 h-0.5 bg-[#F9C344] mb-6"></div>
            
            <p className="text-gray-400 text-sm leading-7 text-justify">
              At Umrah Plus, we take pride in offering authentic, high-quality Umrah services across Saudi Arabia, 
              ensuring a spiritually fulfilling and seamless journey for every pilgrim. We are delighted to offer 
              our trusted services to travelers exploring the sacred cities of Makkah, Madinah, Jeddah, and beyond.
            </p>
          </div>

          {/* Column 2 - EXPLORE */}
          <div>
            <h3 className="text-[#F9C344] text-xl font-bold uppercase tracking-widest mb-2">
              Explore
            </h3>
            <div className="w-8 h-0.5 bg-[#F9C344] mb-6"></div>
            
            <ul className="space-y-4 text-gray-400 text-sm">
              <li>
                <Link href="#" className="hover:text-[#F9C344] transition-colors duration-300">Things To Do In Riyadh</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#F9C344] transition-colors duration-300">Top Hotels In Makkah</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#F9C344] transition-colors duration-300">Our Umrah Packages</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#F9C344] transition-colors duration-300">Explore Saudi Arabia</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#F9C344] transition-colors duration-300">Transport Packages</Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - CONTACT US */}
          <div>
            <h3 className="text-[#F9C344] text-xl font-bold uppercase tracking-widest mb-2">
              Contact Us
            </h3>
            <div className="w-8 h-0.5 bg-[#F9C344] mb-6"></div>
            
            <div className="space-y-6 text-gray-400 text-sm">
              {/* Phone */}
              <div className="flex items-center gap-3">
                <Phone className="text-[#F9C344]" size={18} />
                <span className="hover:text-white transition-colors cursor-pointer">+971 4 585 7184</span>
              </div>
              
              {/* Email */}
              <div className="flex items-center gap-3">
                <Mail className="text-[#F9C344]" size={18} />
                <span className="hover:text-white transition-colors cursor-pointer">info@umrahplus.me</span>
              </div>
              
              {/* Address */}
              <div className="flex items-start gap-3">
                <MapPin className="text-[#F9C344] mt-1" size={18} />
                <span>
                  Suite: 206, DBC Building,<br />
                  Al Khabaisi, Deira-Dubai,<br />
                  United Arab Emirates
                </span>
              </div>

              {/* Social Icons (Circles) */}
              <div className="flex gap-4 pt-4">
                <a href="#" className="w-8 h-8 rounded-full bg-[#F9C344] flex items-center justify-center text-black hover:bg-white hover:scale-110 transition-all duration-300">
                  <Facebook size={16} fill="black" strokeWidth={0} />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-[#F9C344] flex items-center justify-center text-black hover:bg-white hover:scale-110 transition-all duration-300">
                  <Instagram size={16} />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-[#F9C344] flex items-center justify-center text-black hover:bg-white hover:scale-110 transition-all duration-300">
                  <Linkedin size={16} fill="black" strokeWidth={0} />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-[#F9C344] flex items-center justify-center text-black hover:bg-white hover:scale-110 transition-all duration-300">
                  <Twitter size={16} fill="black" strokeWidth={0} />
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 2. COPYRIGHT BAR (Sticks to bottom, distinct background) */}
      <div className="w-full bg-[#1a1a1a] py-6 border-t border-white/5 text-center">
        <p className="text-gray-500 text-xs md:text-sm">
          &copy; 2026 Copyrights by Umrah Plus. All Rights Reserved
        </p>
      </div>

    </footer>
  );
}