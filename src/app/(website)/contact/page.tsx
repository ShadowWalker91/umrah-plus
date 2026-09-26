'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send, Loader2 } from 'lucide-react'; 
import { GoogleMap, useJsApiLoader, OverlayView } from '@react-google-maps/api';
import { sendContactEmail } from '@/app/actions/sendContactEmail';

// --- 4 OFFICE LOCATIONS EXTRACTED FROM IMAGE ---
const OFFICES = [
  {
    id: 1,
    country: "Riyadh, KSA",
    city: "Global Headquarters",
    address: "Building Number 2687, Second Floor, Omar bin Abdul Aziz Road, Al Malaz Dist. Riyadh 12831, Saudi Arabia Malaz Area, Riyadh",
    phone: "+966 11 812 8181",
    email: "hello@umrahplus.me",
    lat: 24.6653, 
    lng: 46.7327,
    lineData: {
      path: "M 0 0 L 0 -80 L -200 -80",
      elbowX: 0, elbowY: -80, 
      endX: -200, endY: -80,
      labelStyle: { right: '212px', top: '-80px', transform: 'translateY(-50%)' }
    }
  },
  {
    id: 2,
    country: "Doha, Qatar",
    city: "Qatar Operations",
    address: "110, Bldg-100, Zone-26, Old Airport Road- Doha, Qatar",
    phone: "+974 3133 4450",
    email: "hello@umrahplus.me",
    lat: 25.2854, 
    lng: 51.5310,
    lineData: {
      path: "M 0 0 L 0 -200 L 70 -200",
      elbowX: 0, elbowY: -200, 
      endX: 70, endY: -200,
      labelStyle: { left: '82px', top: '-200px', transform: 'translateY(-50%)' }
    }
  },
  {
    id: 3,
    country: "Dubai, UAE",
    city: "UAE Operations",
    address: "Suite 206, DBC Building, Al Khabaisi, Deira, Dubai",
    phone: "+971 4 585 7184",
    email: "hello@umrahplus.me",
    lat: 25.2677, 
    lng: 55.3341,
    lineData: {
      path: "M 0 0 L 0 -130 L 160 -130",
      elbowX: 0, elbowY: -130, 
      endX: 160, endY: -130,
      labelStyle: { left: '172px', top: '-130px', transform: 'translateY(-50%)' }
    }
  },
  {
    id: 4,
    country: "Chennai, India",
    city: "India Operations",
    address: "No. 138 to 148, B304, Jawaharlal Nehru Road (Inner Ring Road Highways), 7th Avenue (N104), Anna Nagar West (N104), Chennai, Tamil Nadu, India, 600040",
    phone: "+91 866 767 0301",
    email: "hello@umrahplus.me",
    lat: 13.0827, 
    lng: 80.2707,
    lineData: {
      path: "M 0 0 L 0 100 L 160 100",
      elbowX: 0, elbowY: 100,
      endX: 160, endY: 100,
      labelStyle: { left: '172px', top: '100px', transform: 'translateY(-50%)' }
    }
  }
];

// --- PREMIUM HUD MAP STYLE ---
const creativeDarkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#0f0f0f" }] }, 
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#000000" }] }, 
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#222222" }] },
  { featureType: "administrative.country", elementType: "geometry.stroke", stylers: [{ color: "#3a3015" }, { weight: 1.2 }] }, 
  { featureType: "administrative.country", elementType: "labels.text.fill", stylers: [{ color: "#888888" }] },
  { featureType: "administrative.locality", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "administrative.neighborhood", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "road", stylers: [{ visibility: "off" }] }, 
  { featureType: "poi", stylers: [{ visibility: "off" }] }, 
  { featureType: "transit", stylers: [{ visibility: "off" }] },
];

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = { lat: 24.9, lng: 50.5 };

export default function ContactPage() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string, 
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMessage({ type: '', text: '' });
    setIsSubmitting(true);

    try {
      const response = await sendContactEmail(formData);
      
      if (response.success) {
        setSubmitMessage({ type: 'success', text: 'Message sent successfully! We will get back to you soon.' });
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        setSubmitMessage({ type: 'error', text: 'Failed to send message. Please try again.' });
      }
    } catch (error) {
      setSubmitMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitMessage({ type: '', text: '' }), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans pt-[160px] lg:pt-[180px] pb-24">
      
      {/* PAGE HEADER */}
      <div className="text-center mb-16 px-4">
        <h1 className="text-[#F9C344] font-bold uppercase tracking-widest text-sm mb-4">Get In Touch</h1>
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Contact Us</h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
          Whether you need a custom Ziyarat package, premium transportation, or have general inquiries, our dedicated teams across the globe are ready to assist you.
        </p>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-12 lg:gap-20 mb-20">
        
        {/* LEFT: CONTACT FORM */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-2xl shadow-2xl h-full flex flex-col">
          <h3 className="text-2xl font-serif font-bold text-white mb-8">Send us a Message</h3>
          
          <form onSubmit={handleSubmit} className="flex-grow flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase text-gray-400 font-bold tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name || ''} 
                  placeholder="John Doe"
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-3.5 text-white focus:border-[#F9C344] outline-none transition text-sm"
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase text-gray-400 font-bold tracking-wider">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={formData.email || ''}
                  placeholder="john@example.com"
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-3.5 text-white focus:border-[#F9C344] outline-none transition text-sm"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase text-gray-400 font-bold tracking-wider">Phone Number</label>
                <input 
                  type="tel" 
                  value={formData.phone || ''}
                  placeholder="+1 234 567 8900"
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-3.5 text-white focus:border-[#F9C344] outline-none transition text-sm"
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase text-gray-400 font-bold tracking-wider">Subject</label>
                <input 
                  type="text" 
                  required
                  value={formData.subject || ''}
                  placeholder="Inquiry about Umrah Package"
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-3.5 text-white focus:border-[#F9C344] outline-none transition text-sm"
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                />
              </div>
            </div>

            <div className="flex-grow flex flex-col space-y-2">
              <label className="text-xs uppercase text-gray-400 font-bold tracking-wider">Your Message</label>
              <textarea 
                required
                value={formData.message || ''}
                placeholder="How can we help you today?"
                className="flex-grow w-full bg-black/40 border border-white/10 rounded-lg p-3.5 text-white focus:border-[#F9C344] outline-none transition text-sm resize-none"
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              ></textarea>
            </div>

            {submitMessage.text && (
              <div className={`p-3 text-sm rounded-lg text-center font-bold ${
                submitMessage.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-red-500/20 text-red-400 border border-red-500/50'
              }`}>
                {submitMessage.text}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full mt-2 bg-[#F9C344] text-black font-bold py-4 rounded-lg hover:bg-white disabled:opacity-70 transition-all shadow-lg uppercase tracking-wide text-sm flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <><Loader2 size={18} className="animate-spin" /> Sending...</>
              ) : (
                <><Send size={18} /> Send Message</>
              )}
            </button>
          </form>
        </div>

        {/* RIGHT: OFFICE LOCATIONS */}
        <div className="flex flex-col justify-center space-y-4 md:space-y-6">
          {OFFICES.map((office) => (
            <div 
              key={office.id} 
              className="group bg-[#1a1a1a] border border-white/10 hover:border-[#F9C344]/80 transition-all p-5 md:p-6 rounded-2xl flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center shadow-lg"
            >
              <div className="bg-black/50 p-4 rounded-full border border-white/5 group-hover:bg-[#F9C344]/10 transition-colors hidden sm:block">
                <MapPin size={26} className="text-[#F9C344]" />
              </div>
              
              <div className="flex-1 space-y-1.5">
                <h4 className="text-xl font-serif font-bold text-white tracking-wide">{office.country}</h4>
                <p className="text-xs font-bold tracking-widest uppercase text-[#F9C344]">
                  {office.city}
                </p>
                <p className="text-gray-400 text-xs md:text-sm leading-relaxed">{office.address}</p>
                
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                  <a 
                    href={`tel:${office.phone.replace(/[^0-9+]/g, '')}`}
                    className="flex items-center gap-2 text-xs font-semibold text-gray-300 hover:text-[#F9C344] transition-colors"
                  >
                    <Phone size={14} className="text-[#F9C344] flex-shrink-0"/> 
                    <span className="truncate">{office.phone}</span>
                  </a>
                  <a 
                    href={`mailto:${office.email}`}
                    className="flex items-center gap-2 text-xs font-semibold text-gray-300 hover:text-[#F9C344] transition-colors"
                  >
                    <Mail size={14} className="text-[#F9C344] flex-shrink-0"/> 
                    <span className="truncate">{office.email}</span>
                  </a>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* MAP SECTION */}
      <div className="w-[100%] lg:w-[70%] mx-auto h-[820px] rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative bg-[#050505] overflow-hidden">
        {!isLoaded ? (
          <div className="w-full h-full flex items-center justify-center text-[#F9C344] uppercase tracking-widest font-bold text-sm">
            Initializing Satellites...
          </div>
        ) : (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={defaultCenter}
            zoom={5.5} 
            options={{
              styles: creativeDarkMapStyle,
              disableDefaultUI: false,
              mapTypeControl: false,
              streetViewControl: false,
              backgroundColor: "#050505" 
            }}
          >
            {OFFICES.map((office) => (
              <OverlayView
                key={office.id}
                position={{ lat: office.lat, lng: office.lng }}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                getPixelPositionOffset={() => ({ x: 0, y: 0 })}
              >
                <div className="absolute overflow-visible z-10" style={{ width: 0, height: 0 }}>

                  {/* CONNECTING LINE WITH GLOW & ELBOW (SVG) */}
                  <svg className="absolute overflow-visible pointer-events-none" style={{ top: 0, left: 0 }}>
                    <defs>
                      <filter id={`glow-${office.id}`} x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>

                    {/* Faint Background Line */}
                    <path d={office.lineData.path} fill="none" stroke="#F9C344" strokeWidth="3" opacity="0.15" />
                    
                    {/* Glowing Core Line */}
                    <path d={office.lineData.path} fill="none" stroke="#F9C344" strokeWidth="1.5" opacity="0.85" filter={`url(#glow-${office.id})`} />
                    
                    {/* Decorative Joint/Elbow Ring */}
                    <circle cx={office.lineData.elbowX} cy={office.lineData.elbowY} r="2.5" fill="#050505" stroke="#F9C344" strokeWidth="1.5" filter={`url(#glow-${office.id})`} />
                    
                    {/* Connector End Dot */}
                    <circle cx={office.lineData.endX} cy={office.lineData.endY} r="3" fill="#F9C344" filter={`url(#glow-${office.id})`}/>
                    <circle cx={office.lineData.endX} cy={office.lineData.endY} r="7" fill="none" stroke="#F9C344" strokeWidth="1" opacity="0.4" />
                  </svg>

                  {/* PULSING MAP ORIGIN DOT */}
                  <div className="absolute flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    <div className="absolute w-10 h-10 bg-[#F9C344]/30 rounded-full animate-ping"></div>
                    <div className="w-3.5 h-3.5 bg-[#F9C344] rounded-full shadow-[0_0_15px_#F9C344] border-[2px] border-[#050505] relative z-10"></div>
                  </div>

                  {/* POSITIONED LABEL BOX (GLASSMORPHISM UPGRADE) */}
                  <div className="absolute pointer-events-none" style={office.lineData.labelStyle}>
                    <div className="group pointer-events-auto bg-gradient-to-br from-[#1a1a1a]/95 to-[#0a0a0a]/95 backdrop-blur-xl border border-[#F9C344]/20 hover:border-[#F9C344]/80 transition-all duration-500 hover:-translate-y-1 hover:scale-105 shadow-[0_10px_40px_rgba(0,0,0,0.8)] hover:shadow-[0_0_30px_rgba(249,195,68,0.15)] rounded-xl px-6 py-4 flex flex-col items-center min-w-[180px] cursor-pointer relative overflow-hidden">
                      
                      {/* Glossy Top Highlight Edge */}
                      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#F9C344]/70 to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-500"></div>

                      <span className="text-[#F9C344] text-[9px] font-bold uppercase tracking-[0.25em] mb-1.5 opacity-90">
                        {office.country}
                      </span>
                      <span className="text-white font-serif text-xl whitespace-nowrap drop-shadow-md">
                        {office.city}
                      </span>
                    </div>
                  </div>

                </div>
              </OverlayView>
            ))}
          </GoogleMap>
        )}
      </div>

    </div>
  );
}