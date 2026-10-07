'use client';

interface RouteTrackerMapProps {
  /** Status pill rendered bottom-left of the map, e.g. "Route Complete". */
  status?: string;
  /** Short label shown next to the destination pin, e.g. "MED". */
  destinationBadge?: string;
  className?: string;
}

/**
 * Hand-built static route tracker: a stylised Red Sea coastline with the
 * Jeddah ➔ Makkah ➔ Madinah pilgrimage corridor drawn in gold. No map API —
 * pure SVG so it stays instant and works offline.
 */
export default function RouteTrackerMap({
  status,
  destinationBadge,
  className = '',
}: RouteTrackerMapProps) {
  return (
    <div className={`relative overflow-hidden rounded-xl border border-[#c5a059]/30 bg-[#101510] ${className}`}>
      <svg viewBox="0 0 260 300" className="w-full h-full block" role="img" aria-label="Live route tracker: Jeddah to Makkah to Madinah">
        {/* Sea */}
        <rect x="0" y="0" width="260" height="300" fill="#16302e" />
        <path d="M0 0 L74 0 C60 60 40 130 30 200 C24 244 16 276 0 300 Z" fill="#1b3f47" />
        {/* Land */}
        <path d="M74 0 L260 0 L260 300 L0 300 C16 276 24 244 30 200 C40 130 60 60 74 0 Z" fill="#414a2f" />
        {/* Terrain hints */}
        <path d="M96 40 C130 34 168 44 196 66" stroke="#57613c" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M70 240 C110 250 150 250 196 236" stroke="#57613c" strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="M120 150 C150 144 176 152 200 170" stroke="#4c5636" strokeWidth="5" fill="none" strokeLinecap="round" />

        {/* Gold route: Jeddah -> Makkah -> Madinah */}
        <path
          d="M78 244 C104 240 134 234 158 224"
          stroke="#e2b455"
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M158 224 C170 186 176 132 186 84"
          stroke="#e2b455"
          strokeWidth="3.5"
          fill="none"
          strokeDasharray="7 7"
          strokeLinecap="round"
        />

        {/* Jeddah pin */}
        <g>
          <circle cx="78" cy="244" r="7" fill="#0c0d10" stroke="#e2b455" strokeWidth="3" />
          <rect x="34" y="256" width="62" height="19" rx="5" fill="#0c0d10" stroke="#e2b455" strokeOpacity="0.5" />
          <text x="65" y="269" textAnchor="middle" fontSize="11" fill="#f3d38a" fontFamily="sans-serif" fontWeight="600">Jeddah</text>
        </g>

        {/* Makkah pin */}
        <g>
          <circle cx="158" cy="224" r="7" fill="#0c0d10" stroke="#e2b455" strokeWidth="3" />
          <rect x="130" y="236" width="58" height="19" rx="5" fill="#0c0d10" stroke="#e2b455" strokeOpacity="0.5" />
          <text x="159" y="249" textAnchor="middle" fontSize="11" fill="#f3d38a" fontFamily="sans-serif" fontWeight="600">Makkah</text>
        </g>

        {/* Madinah pin */}
        <g>
          <circle cx="186" cy="84" r="7" fill="#0c0d10" stroke="#e2b455" strokeWidth="3" />
          <rect x="158" y="96" width="62" height="19" rx="5" fill="#0c0d10" stroke="#e2b455" strokeOpacity="0.5" />
          <text x="189" y="109" textAnchor="middle" fontSize="11" fill="#f3d38a" fontFamily="sans-serif" fontWeight="600">Madinah</text>
        </g>

        {destinationBadge && (
          <g>
            <rect x="212" y="60" width="38" height="18" rx="4" fill="#0f7a4d" />
            <text x="231" y="73" textAnchor="middle" fontSize="10" fill="#eafff4" fontFamily="sans-serif" fontWeight="700">{destinationBadge}</text>
          </g>
        )}
      </svg>

      {status && (
        <span className="absolute left-2 bottom-2 bg-[#0f7a4d] text-[#eafff4] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-lg">
          {status}
        </span>
      )}
    </div>
  );
}
