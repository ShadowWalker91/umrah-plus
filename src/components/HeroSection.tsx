import HeroVideo from '@/components/HeroVideo';
import SearchWidget from '@/components/SearchWidget';

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] w-full flex flex-col">
      <HeroVideo />
      
      {/* Content Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 pt-24 pb-12">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-playfair italic text-white mb-6 leading-tight tracking-tight text-center drop-shadow-2xl">
          Your Spiritual Journey <br className="hidden md:block"/> Begins Here
        </h1>
        <p className="text-lg md:text-xl text-gray-300 font-light tracking-wide max-w-2xl mx-auto mb-12 text-center drop-shadow-md">
          Discover seamless travel experiences for Umrah, Umrah Plus, and historical Ziyarat with our tailored packages.
        </p>
        
        <SearchWidget />
      </div>
    </section>
  );
}
