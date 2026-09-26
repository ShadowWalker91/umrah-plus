export default function HeroVideo() {
  return (
    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-slate-900">
      <video
        autoPlay
        loop
        muted
        playsInline
        poster="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=2000&auto=format&fit=crop"
        className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
      >
        <source src="https://cdn.coverr.co/videos/coverr-clouds-over-the-mountains-4408/1080p.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70 pointer-events-none" />
    </div>
  );
}
