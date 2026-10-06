'use client';

import { motion } from 'motion/react';
import { SITE_CONFIG } from '@/data/siteConfig';

const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '971522634471').replace(/[^0-9]/g, '');
const WHATSAPP_MESSAGE = 'Hello, I would like a quote for Umrah by Air from the UAE.';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

type Stay = {
  hotel: string;
  stars: number;
  distance: string;
  distanceLabel: string;
};

type Tier = {
  name: string;
  tagline: string;
  featured?: boolean;
  makkah: Stay;
  madinah: Stay;
  transport: string;
  features: string[];
};

const TIERS: Tier[] = [
  {
    name: 'SILVER',
    tagline: 'A sound, simple journey with the essentials done properly.',
    makkah: { hotel: 'Three-star hotel', stars: 3, distance: '1200', distanceLabel: 'm from the Haram' },
    madinah: { hotel: 'Three-star hotel', stars: 3, distance: '700', distanceLabel: 'm from Masjid an-Nabawi' },
    transport: 'Shared coach transfers, hotel shuttle to the Haram',
    features: [
      'Return flights',
      'Umrah visa',
      'Airport transfers',
      'Group Ziyarat in Makkah and Madinah',
      'WhatsApp support throughout',
    ],
  },
  {
    name: 'GOLD',
    tagline: 'The one most families choose: close to the Haram, quiet rooms, no rush.',
    featured: true,
    makkah: { hotel: 'Four-star hotel', stars: 4, distance: '700', distanceLabel: 'm from the Haram' },
    madinah: { hotel: 'Four-star hotel', stars: 4, distance: '400', distanceLabel: 'm from Masjid an-Nabawi' },
    transport: 'Private transfers, walk to the Haram',
    features: [
      'Return flights',
      'Umrah visa',
      'Private airport and inter-city transfers',
      'Guided Ziyarat',
      'Daily breakfast',
      'WhatsApp support throughout',
    ],
  },
  {
    name: 'PLATINUM',
    tagline: 'For those who want to step out of the lobby and into the Haram.',
    makkah: { hotel: 'Five-star hotel facing the Haram', stars: 5, distance: '250', distanceLabel: 'm from the Haram' },
    madinah: { hotel: 'Five-star hotel by the Prophet’s Mosque', stars: 5, distance: '150', distanceLabel: 'm from Masjid an-Nabawi' },
    transport: 'Private car with driver, Haramain train between cities',
    features: [
      'Return flights, business class on request',
      'Umrah visa',
      'Private transfers',
      'Private Ziyarat with a guide',
      'Half board',
      'Meet and assist at Jeddah',
      'WhatsApp support throughout',
    ],
  },
];

type IconProps = { size?: number; className?: string };

function BuildingIcon({ size = 20, className = '' }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" viewBox="0 0 256 256" className={className} aria-hidden="true">
      <path d="M216,74H30V48a6,6,0,0,0-12,0V208a6,6,0,0,0,12,0V174H242v34a6,6,0,0,0,12,0V112A38,38,0,0,0,216,74ZM30,86h76v76H30Zm88,76V86h98a26,26,0,0,1,26,26v50Z" />
    </svg>
  );
}

function MapPinIcon({ size = 12, className = '' }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" viewBox="0 0 256 256" className={className} aria-hidden="true">
      <path d="M128,66a38,38,0,1,0,38,38A38,38,0,0,0,128,66Zm0,64a26,26,0,1,1,26-26A26,26,0,0,1,128,130Zm0-112a86.1,86.1,0,0,0-86,86c0,30.91,14.34,63.74,41.47,94.94a252.32,252.32,0,0,0,41.09,38,6,6,0,0,0,6.88,0,252.32,252.32,0,0,0,41.09-38c27.13-31.2,41.47-64,41.47-94.94A86.1,86.1,0,0,0,128,18Zm0,206.51C113,212.93,54,163.62,54,104a74,74,0,0,1,148,0C202,163.62,143,212.93,128,224.51Z" />
    </svg>
  );
}

function CheckIcon({ size = 16, className = '' }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" viewBox="0 0 256 256" className={className} aria-hidden="true">
      <path d="M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z" />
    </svg>
  );
}

function WhatsAppIcon({ size = 18, className = '' }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" viewBox="0 0 256 256" className={className} aria-hidden="true">
      <path d="M152.58,145.23l23,11.48A24,24,0,0,1,152,176a72.08,72.08,0,0,1-72-72A24,24,0,0,1,99.29,80.46l11.48,23L101,118a8,8,0,0,0-.73,7.51,56.47,56.47,0,0,0,30.15,30.15A8,8,0,0,0,138,155ZM232,128A104,104,0,0,1,79.12,219.82L45.07,231.17a16,16,0,0,1-20.24-20.24l11.35-34.05A104,104,0,1,1,232,128Zm-40,24a8,8,0,0,0-4.42-7.16l-32-16a8,8,0,0,0-8,.5l-14.69,9.8a40.55,40.55,0,0,1-16-16l9.8-14.69a8,8,0,0,0,.5-8l-16-32A8,8,0,0,0,104,64a40,40,0,0,0-40,40,88.1,88.1,0,0,0,88,88A40,40,0,0,0,192,152Z" />
    </svg>
  );
}

function StayRow({ label, stay, accent, labelColor, bodyColor }: {
  label: string;
  stay: Stay;
  accent: string;
  labelColor: string;
  bodyColor: string;
}) {
  return (
    <div className="flex gap-3">
      <BuildingIcon size={20} className={`mt-0.5 shrink-0 ${accent}`} />
      <div className="min-w-0">
        <dt className={`text-xs md:text-[13px] font-semibold ${labelColor}`}>{label}</dt>
        <dd className={`text-xs md:text-[13px] leading-relaxed ${bodyColor}`}>
          {stay.hotel}
          <span className={`ml-1.5 ${accent}`}>{'\u2605'.repeat(stay.stars)}</span>
          <span className="mt-0.5 flex items-center gap-1 opacity-80 text-[11px] md:text-xs">
            <MapPinIcon size={12} className="shrink-0" />
            {stay.distance} {stay.distanceLabel}
          </span>
        </dd>
      </div>
    </div>
  );
}

export default function PackagesSection() {
  return (
    <section
      id="section-6"
      className="snap-section snap-section-auto w-full bg-[#1c1c1c] text-white relative flex flex-col items-center justify-center overflow-hidden snap-start pt-32 md:pt-40 pb-14"
    >

      {/* 1. BACKGROUND IMAGE & OVERLAY */}
      <div className="absolute inset-0 z-0">
        <img
          src={SITE_CONFIG.packagesSection.backgroundImage}
          alt="Packages Background"
          className="w-full h-full object-cover"
        />
        {/* Heavy dark overlay to ensure cards stand out */}
        <div className="absolute inset-0 bg-black/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1c] via-transparent to-[#1c1c1c]/50" />
      </div>

      {/* 2. MAIN CONTENT */}
      <div className="w-full max-w-[1600px] px-6 lg:px-12 flex flex-col justify-center relative z-10">

        {/* HEADER */}
        <div className="text-center mb-7 md:mb-10">
          <h2 className="text-[#FFB700] font-serif font-bold text-3xl md:text-5xl drop-shadow-md uppercase tracking-wide">
            {SITE_CONFIG.packagesSection.title}
          </h2>
          <p className="text-white mt-3 md:mt-4 max-w-2xl mx-auto text-xs md:text-sm font-light tracking-wide opacity-90 leading-relaxed">
            {SITE_CONFIG.packagesSection.description}
          </p>
        </div>

        {/* 3. TIER GRID CARDS */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {TIERS.map((tier, index) => {
            const accent = tier.featured ? 'text-[#1c1c1c]' : 'text-[#FFB700]';
            const headingColor = tier.featured ? 'text-[#1c1c1c]' : 'text-white';
            const labelColor = tier.featured ? 'text-[#1c1c1c]' : 'text-white';
            const bodyColor = tier.featured ? 'text-black/75' : 'text-gray-300';
            const divider = tier.featured ? 'border-black/15' : 'border-white/10';

            return (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, delay: index * 0.12, ease: 'easeOut' }}
                className="h-full"
              >
                <div
                  className={`h-full flex flex-col rounded-xl border p-5 md:p-6 transition-all duration-300 hover:-translate-y-1.5 ${
                    tier.featured
                      ? 'border-[#FFB700] bg-[#FFB700] shadow-[0_22px_55px_-22px_rgba(255,183,0,0.7)] hover:shadow-[0_28px_60px_-20px_rgba(255,183,0,0.85)]'
                      : 'border-white/10 bg-[#222]/90 backdrop-blur-md shadow-xl hover:border-[#FFB700]/60 hover:shadow-[0_22px_50px_-25px_rgba(255,183,0,0.45)]'
                  }`}
                >
                  <h3 className={`font-serif font-bold text-xl md:text-2xl tracking-wide ${headingColor}`}>
                    {tier.name}
                  </h3>
                  <p className={`mt-1.5 text-xs md:text-[13px] leading-relaxed ${bodyColor}`}>
                    {tier.tagline}
                  </p>

                  <dl className="mt-5 md:mt-6 space-y-3.5 md:space-y-4">
                    <StayRow label="Makkah" stay={tier.makkah} accent={accent} labelColor={labelColor} bodyColor={bodyColor} />
                    <StayRow label="Madinah" stay={tier.madinah} accent={accent} labelColor={labelColor} bodyColor={bodyColor} />
                    <div>
                      <dt className={`text-xs md:text-[13px] font-semibold ${labelColor}`}>Transport</dt>
                      <dd className={`text-xs md:text-[13px] leading-relaxed ${bodyColor}`}>{tier.transport}</dd>
                    </div>
                  </dl>

                  <ul className={`mt-5 md:mt-6 space-y-2 border-t pt-4 md:pt-5 ${divider}`}>
                    {tier.features.map((feature) => (
                      <li key={feature} className={`flex items-start gap-2 text-xs md:text-[13px] leading-relaxed ${bodyColor}`}>
                        <CheckIcon size={16} className={`mt-0.5 shrink-0 ${accent}`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-5 md:pt-6">
                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-[11px] md:text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                        tier.featured
                          ? 'bg-[#1c1c1c] text-[#FFB700] hover:bg-black hover:shadow-lg'
                          : 'bg-[#FFB700] text-[#1c1c1c] hover:bg-white hover:shadow-[0_0_25px_rgba(255,183,0,0.4)]'
                      }`}
                    >
                      <WhatsAppIcon size={18} className="shrink-0" />
                      <span>Get a tailored quote on WhatsApp</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
