import { createFileRoute } from '@tanstack/react-router';
import { Building2, CarFront, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import background from '@/assets/packages-background.jpg';

export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'Curated Packages | Silver, Gold & Platinum Umrah' },
    { name: 'description', content: 'Explore curated Silver, Gold and Platinum Umrah packages with Makkah and Madinah hotels, transfers and dedicated support.' },
    { property: 'og:title', content: 'Curated Packages | Silver, Gold & Platinum Umrah' },
    { property: 'og:description', content: 'Your comfort, your pace, your priorities — curated packages for your Saudi journey.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: Index,
});

const packages = [
  {
    tier: 'Silver', badge: 'ESSENTIAL', description: <>A sound, simple<br />journey with the<br />essentials done<br />properly.</>,
    makkah: <>Three-star hotel <Stars count={3} /></>, makkahDistance: '1200 m from the Haram',
    madinah: <>Three-star hotel <Stars count={3} /></>, madinahDistance: '700 m from Masjid an-Nabawi',
    transport: <>Shared coach transfers,<br />hotel shuttle to the Haram</>,
    inclusions: ['Return flights', 'Umrah visa', 'Airport transfers', 'Group Ziyarat in Makkah and Madinah', 'WhatsApp support throughout'],
  },
  {
    tier: 'Gold', badge: 'MOST POPULAR', description: <>The one most families<br />choose: close to the<br />Haram, quiet rooms,<br />no rush.</>,
    makkah: <>Four-star hotel <Stars count={4} /></>, makkahDistance: '700 m from the Haram',
    madinah: <>Four-star hotel <Stars count={4} /></>, madinahDistance: '400 m from Masjid an-Nabawi',
    transport: <>Private transfers, walk to<br />the Haram</>,
    inclusions: ['Return flights', 'Umrah visa', 'Private airport & inter-city transfers', 'Guided Ziyarat', 'Daily breakfast', 'WhatsApp support throughout'],
  },
  {
    tier: 'Platinum', badge: 'PREMIUM', description: <>For those who want to<br />step out of the lobby<br />and into the Haram.</>,
    makkah: <>Five-star hotel facing the<br />Haram <Stars count={5} /></>, makkahDistance: '250 m from the Haram)',
    madinah: <>Five-star hotel by the Prophet’s<br />Mosque <Stars count={5} /></>, madinahDistance: '150 m from Masjid an-Nabawi)',
    transport: <>Private car with driver,<br />Haramain train between cities</>,
    inclusions: ['Return flights, business class on request', 'Umrah visa', 'Private transfers', 'Private Ziyarat with a guide', 'Half board', 'Meet & assist at Jeddah', 'WhatsApp support throughout'],
  },
];
function Stars({ count }: { count: number }) {
  return <span className="hotel-stars" aria-label={`${count} stars`}>{'★'.repeat(count)}</span>;
}
function WhatsAppIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M20.8 11.7a8.8 8.8 0 0 1-13 7.8L3 21l1.5-4.7a8.8 8.8 0 1 1 16.3-4.6Z" /><path d="M8 7.5c-.8 1.5.5 3.7 2.1 5.3 1.7 1.7 3.9 2.8 5.3 2.1l1-1.6-2.7-1.3-.8.8a7.1 7.1 0 0 1-2.9-2.9l.8-.8L9.5 6.5Z" /></svg>;
}
function Index() {
  return <main className="package-page">
    <section className="package-section" aria-labelledby="packages-title">
      <img src={background} alt="" className="package-backdrop" width={768} height={768} />
      <header className="package-heading">
        <h1 id="packages-title">CURATED PACKAGES</h1>
        <p>Your comfort, your pace, your priorities – our experts build your perfect<br />Saudi journey stitch by stitch.</p>
      </header>
      <div className="package-list">
        {packages.map(pkg => <article className={`package-row ${pkg.tier.toLowerCase()}`} key={pkg.tier} aria-label={`${pkg.tier} package`}>
          <div className="tier-ribbon"><span>{pkg.tier.toUpperCase()}</span></div>
          <div className="package-intro"><span className="package-badge">{pkg.badge}</span><p>{pkg.description}</p></div>
          <div className="package-hotels">
            <div className="hotel-detail"><Building2 /><div><strong>Makkah</strong><p>{pkg.makkah}</p><p className="hotel-distance">{pkg.makkahDistance}</p></div></div>
            <div className="hotel-detail"><Building2 /><div><strong>Madinah</strong><p>{pkg.madinah}</p><p className="hotel-distance">{pkg.madinahDistance}</p></div></div>
            <div className="hotel-detail"><CarFront /><p>{pkg.transport}</p></div>
          </div>
          <ul className="package-inclusions">{pkg.inclusions.map(item => <li key={item}><Check /><span>{item}</span></li>)}</ul>
          <Button asChild variant="quote"><a href={`https://wa.me/?text=${encodeURIComponent(`Hello, I would like a quote for the ${pkg.tier} Umrah package.`)}`} target="_blank" rel="noopener noreferrer" aria-label={`Get WhatsApp quote for ${pkg.tier}`}><span>Get WhatsApp<br />Quote <WhatsAppIcon /></span></a></Button>
        </article>)}
      </div>
      <p className="package-credit">@mubixdesign</p>
    </section>
  </main>;
}
