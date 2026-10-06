'use client';

import { motion } from 'motion/react';
import { Building2, CarFront, Check } from 'lucide-react';
import { SITE_CONFIG } from '@/data/siteConfig';

const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '971522634471').replace(/[^0-9]/g, '');

type Stay = {
  hotel: string;
  stars: number;
  distance: string;
  distanceLabel: string;
};

type Tier = {
  name: string;
  badge: string;
  tagline: string;
  makkah: Stay;
  madinah: Stay;
  transport: string;
  features: string[];
};

const TIERS: Tier[] = [
  {
    name: 'SILVER',
    badge: 'ESSENTIAL',
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
    badge: 'MOST POPULAR',
    tagline: 'The one most families choose: close to the Haram, quiet rooms, no rush.',
    makkah: { hotel: 'Four-star hotel', stars: 4, distance: '700', distanceLabel: 'm from the Haram' },
    madinah: { hotel: 'Four-star hotel', stars: 4, distance: '400', distanceLabel: 'm from Masjid an-Nabawi' },
    transport: 'Private transfers, walk to the Haram',
    features: [
      'Return flights',
      'Umrah visa',
      'Private airport & inter-city transfers',
      'Guided Ziyarat',
      'Daily breakfast',
      'WhatsApp support throughout',
    ],
  },
  {
    name: 'PLATINUM',
    badge: 'PREMIUM',
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

function Stars({ count }: { count: number }) {
  return (
    <span className="hotel-stars" aria-label={`${count} stars`}>
      {'★'.repeat(count)}
    </span>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M20.8 11.7a8.8 8.8 0 0 1-13 7.8L3 21l1.5-4.7a8.8 8.8 0 1 1 16.3-4.6Z" />
      <path d="M8 7.5c-.8 1.5.5 3.7 2.1 5.3 1.7 1.7 3.9 2.8 5.3 2.1l1-1.6-2.7-1.3-.8.8a7.1 7.1 0 0 1-2.9-2.9l.8-.8L9.5 6.5Z" />
    </svg>
  );
}

function quoteUrl(tierName: string) {
  const message = `Hello, I would like a quote for the ${tierName} Umrah package.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export default function PackagesSection() {
  return (
    <section
      id="section-6"
      aria-labelledby="packages-title"
      className="snap-section snap-section-auto w-full bg-[#1c1c1c] text-white relative flex flex-col items-center justify-center overflow-hidden snap-start pt-32 md:pt-40 pb-14"
    >

      {/* 1. BACKGROUND IMAGE & OVERLAY */}
      <div className="absolute inset-0 z-0">
        <img
          src={SITE_CONFIG.packagesSection.backgroundImage}
          alt="Packages Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1c] via-transparent to-[#1c1c1c]/50" />
      </div>

      {/* 2. MAIN CONTENT — 768px curated packages block */}
      <div className="package-section relative z-10">
        <header className="package-heading">
          <h2 id="packages-title" className="uppercase">
            {SITE_CONFIG.packagesSection.title}
          </h2>
          <p>{SITE_CONFIG.packagesSection.description}</p>
        </header>

        <div className="package-list">
          {TIERS.map((tier, index) => (
            <motion.article
              key={tier.name}
              className={`package-row ${tier.name.toLowerCase()}`}
              aria-label={`${tier.name} package`}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: index * 0.12, ease: 'easeOut' }}
            >
              <div className="tier-ribbon">
                <span>{tier.name}</span>
              </div>

              <div className="package-intro">
                <span className="package-badge">{tier.badge}</span>
                <p>{tier.tagline}</p>
              </div>

              <div className="package-hotels">
                <div className="hotel-detail">
                  <Building2 />
                  <div>
                    <strong>Makkah</strong>
                    <p>
                      {tier.makkah.hotel} <Stars count={tier.makkah.stars} />
                    </p>
                    <p className="hotel-distance">
                      {tier.makkah.distance} {tier.makkah.distanceLabel}
                    </p>
                  </div>
                </div>
                <div className="hotel-detail">
                  <Building2 />
                  <div>
                    <strong>Madinah</strong>
                    <p>
                      {tier.madinah.hotel} <Stars count={tier.madinah.stars} />
                    </p>
                    <p className="hotel-distance">
                      {tier.madinah.distance} {tier.madinah.distanceLabel}
                    </p>
                  </div>
                </div>
                <div className="hotel-detail">
                  <CarFront />
                  <p>{tier.transport}</p>
                </div>
              </div>

              <ul className="package-inclusions">
                {tier.features.map((feature) => (
                  <li key={feature}>
                    <Check />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href={quoteUrl(tier.name)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Get WhatsApp quote for ${tier.name}`}
                className="quote-button"
              >
                <span>
                  Get WhatsApp
                  <br />
                  Quote <WhatsAppIcon />
                </span>
              </a>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
