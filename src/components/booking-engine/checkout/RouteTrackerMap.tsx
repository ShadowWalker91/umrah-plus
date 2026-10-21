'use client';

import type { BookingState } from '../BookingController';

export interface MapNode {
  id: string;
  name: string;
  shortLabel: string;
  x: number;
  y: number;
  labelPosition?: 'top' | 'bottom' | 'left' | 'right';
  isAirport?: boolean;
}

export interface RouteResolution {
  title: string;
  stops: MapNode[];
  pathSegments: { from: MapNode; to: MapNode; dashed?: boolean }[];
  badgeText: string;
  distanceLabel: string;
  statusText: string;
}

export const MAP_NODES: Record<string, MapNode> = {
  med_airport: {
    id: 'med_airport',
    name: 'Prince Mohammad Bin Abdulaziz Airport',
    shortLabel: 'MED Airport',
    x: 216,
    y: 44,
    labelPosition: 'top',
    isAirport: true,
  },
  madinah: {
    id: 'madinah',
    name: 'Madinah Al-Munawwarah',
    shortLabel: 'Madinah',
    x: 176,
    y: 62,
    labelPosition: 'left',
  },
  jed_airport: {
    id: 'jed_airport',
    name: 'King Abdulaziz International Airport',
    shortLabel: 'JED Airport',
    x: 82,
    y: 194,
    labelPosition: 'left',
    isAirport: true,
  },
  jeddah_city: {
    id: 'jeddah_city',
    name: 'Jeddah City',
    shortLabel: 'Jeddah City',
    x: 66,
    y: 242,
    labelPosition: 'bottom',
  },
  masjid_ayesha: {
    id: 'masjid_ayesha',
    name: 'Masjid Aisha (Al-Taneem)',
    shortLabel: 'Masjid Aisha',
    x: 162,
    y: 206,
    labelPosition: 'top',
  },
  makkah: {
    id: 'makkah',
    name: 'Makkah Al-Mukarramah',
    shortLabel: 'Makkah',
    x: 174,
    y: 234,
    labelPosition: 'right',
  },
  taif: {
    id: 'taif',
    name: 'Taif City & Mountains',
    shortLabel: 'Taif',
    x: 236,
    y: 238,
    labelPosition: 'right',
  },
};

/**
 * Resolves the dynamic route, stops, path segments and status label
 * based on BookingState and flow type.
 */
export function resolveRouteDetails(state?: BookingState, type?: string): RouteResolution {
  if (!state) {
    return {
      title: 'Jeddah → Makkah → Madinah',
      stops: [MAP_NODES.jed_airport, MAP_NODES.makkah, MAP_NODES.madinah],
      pathSegments: [
        { from: MAP_NODES.jed_airport, to: MAP_NODES.makkah },
        { from: MAP_NODES.makkah, to: MAP_NODES.madinah, dashed: true },
      ],
      badgeText: 'Pilgrimage Corridor',
      distanceLabel: '~480 KM',
      statusText: 'Jeddah → Makkah → Madinah',
    };
  }

  const isTransport = type === 'Transport';
  const isZiyarat = type === 'Ziyarat';

  // ── 1. Dedicated Transport Flow ──
  if (isTransport) {
    if (state.transportMode === 'pointToPoint') {
      const p2p = (state.pointToPointRoute || '').trim();
      return resolveP2PRoute(p2p, state);
    } else {
      return resolveFixedRoute(state.fixedRouteId, state.fixedRouteLegs);
    }
  }

  // ── 2. Ziyarat Flow ──
  if (isZiyarat) {
    const selectedRoutes = state.selectedZiyaratRoutes || [];
    const hasTaif = selectedRoutes.some(id => id.startsWith('taif')) || state.selectedZiyaratCitiesList?.includes('taif');
    const hasMadinah = selectedRoutes.some(id => id.startsWith('mad')) || state.selectedZiyaratCitiesList?.includes('mad');
    const hasMakkah = selectedRoutes.some(id => id.startsWith('mak')) || state.selectedZiyaratCitiesList?.includes('mak') || (!hasTaif && !hasMadinah);

    const stops: MapNode[] = [];
    if (hasMakkah) stops.push(MAP_NODES.makkah);
    if (hasTaif) stops.push(MAP_NODES.taif);
    if (hasMadinah) stops.push(MAP_NODES.madinah);

    if (stops.length === 1 && stops[0] === MAP_NODES.makkah) {
      return {
        title: 'Makkah Sacred Sites',
        stops: [MAP_NODES.makkah, MAP_NODES.masjid_ayesha],
        pathSegments: [{ from: MAP_NODES.makkah, to: MAP_NODES.masjid_ayesha, dashed: true }],
        badgeText: 'Makkah Ziyarat',
        distanceLabel: 'Historic Sites',
        statusText: 'Makkah Sacred Sites',
      };
    }

    const segments = [];
    for (let i = 0; i < stops.length - 1; i++) {
      segments.push({ from: stops[i], to: stops[i + 1] });
    }

    const names = stops.map(s => s.shortLabel).join(' ➔ ');
    return {
      title: names,
      stops,
      pathSegments: segments,
      badgeText: 'Sacred Ziyarat',
      distanceLabel: `${stops.length} Holy Cities`,
      statusText: names,
    };
  }

  // ── 3. Umrah / Umrah Plus Flow ──
  // Point to point in Umrah
  if (state.transportMode === 'pointToPoint' && state.pointToPointRoute) {
    return resolveP2PRoute(state.pointToPointRoute, state);
  }

  // Has fixed transport route selected
  if (state.travelPath || state.fixedRouteId) {
    const routeId = state.fixedRouteId || state.travelPath || 'p1';
    if (state.includeMadinah) {
      return resolveFixedRoute(routeId, state.fixedRouteLegs);
    }
  }

  // Makkah-only stay / pilgrimage
  if (!state.includeMadinah) {
    return {
      title: 'JED Airport ➔ Makkah Hotel ➔ JED Airport',
      stops: [MAP_NODES.jed_airport, MAP_NODES.makkah],
      pathSegments: [
        { from: MAP_NODES.jed_airport, to: MAP_NODES.makkah },
      ],
      badgeText: 'Makkah Pilgrimage',
      distanceLabel: '~85 KM · Direct',
      statusText: 'JED Airport ➔ Makkah Hotel ➔ JED Airport',
    };
  }

  // Default Umrah with Madinah
  return {
    title: 'JED Airport ➔ Makkah ➔ Madinah ➔ MED Airport',
    stops: [MAP_NODES.jed_airport, MAP_NODES.makkah, MAP_NODES.madinah, MAP_NODES.med_airport],
    pathSegments: [
      { from: MAP_NODES.jed_airport, to: MAP_NODES.makkah },
      { from: MAP_NODES.makkah, to: MAP_NODES.madinah },
      { from: MAP_NODES.madinah, to: MAP_NODES.med_airport },
    ],
    badgeText: 'Pilgrimage Circuit',
    distanceLabel: '~480 KM',
    statusText: 'Jeddah ➔ Makkah ➔ Madinah',
  };
}

function resolveP2PRoute(p2p: string, state: BookingState): RouteResolution {
  const norm = p2p.toLowerCase();

  // "Jeddah City → Jeddah Airport" or "Jeddah Airport ↔ Jeddah City"
  if (norm.includes('city') && norm.includes('airport')) {
    const isToAirport = norm.includes('city →') || norm.includes('city ->');
    const fromNode = isToAirport ? MAP_NODES.jeddah_city : MAP_NODES.jed_airport;
    const toNode = isToAirport ? MAP_NODES.jed_airport : MAP_NODES.jeddah_city;

    return {
      title: p2p || 'Jeddah City → Jeddah Airport',
      stops: [fromNode, toNode],
      pathSegments: [{ from: fromNode, to: toNode }],
      badgeText: 'Airport Transfer',
      distanceLabel: '~25 KM · 30 MIN',
      statusText: p2p || 'Jeddah City → Jeddah Airport',
    };
  }

  // "Jeddah ↔ Makkah" or "Makkah ↔ Jeddah"
  if ((norm.includes('jeddah') && norm.includes('makkah')) || norm.includes('jeddah ↔ makkah') || norm.includes('makkah ↔ jeddah')) {
    const isFromMakkah = norm.startsWith('makkah');
    const fromNode = isFromMakkah ? MAP_NODES.makkah : MAP_NODES.jed_airport;
    const toNode = isFromMakkah ? MAP_NODES.jed_airport : MAP_NODES.makkah;

    return {
      title: p2p || 'Jeddah ↔ Makkah',
      stops: [fromNode, toNode],
      pathSegments: [{ from: fromNode, to: toNode }],
      badgeText: 'Pilgrim Highway',
      distanceLabel: '~85 KM · 1 HR 15 MIN',
      statusText: p2p || 'Jeddah ↔ Makkah',
    };
  }

  // "Madinah Airport → Madinah Hotel" or "Madinah Hotel → Madinah Airport"
  if (norm.includes('madinah') && norm.includes('airport')) {
    const isToAirport = norm.includes('hotel →') || norm.includes('hotel ->');
    const fromNode = isToAirport ? MAP_NODES.madinah : MAP_NODES.med_airport;
    const toNode = isToAirport ? MAP_NODES.med_airport : MAP_NODES.madinah;

    return {
      title: p2p || 'Madinah Airport ↔ Madinah Hotel',
      stops: [fromNode, toNode],
      pathSegments: [{ from: fromNode, to: toNode }],
      badgeText: 'Airport Transfer',
      distanceLabel: '~20 KM · 25 MIN',
      statusText: p2p || 'Madinah Airport ↔ Madinah Hotel',
    };
  }

  // "Makkah / Jeddah → Madinah" or "Jeddah Airport ↔ Madinah"
  if (norm.includes('madinah')) {
    return {
      title: p2p || 'Makkah / Jeddah → Madinah',
      stops: [MAP_NODES.makkah, MAP_NODES.madinah],
      pathSegments: [{ from: MAP_NODES.makkah, to: MAP_NODES.madinah }],
      badgeText: 'Intercity Highway',
      distanceLabel: '~420 KM · 4.5 HRS',
      statusText: p2p || 'Makkah → Madinah',
    };
  }

  // "Makkah ↔ Masjid Ayesha (Return)"
  if (norm.includes('ayesha') || norm.includes('aisha')) {
    return {
      title: 'Makkah ↔ Masjid Aisha',
      stops: [MAP_NODES.makkah, MAP_NODES.masjid_ayesha],
      pathSegments: [{ from: MAP_NODES.makkah, to: MAP_NODES.masjid_ayesha, dashed: true }],
      badgeText: 'Miqat Return',
      distanceLabel: '~8 KM · 15 MIN',
      statusText: 'Makkah ↔ Masjid Aisha (Return)',
    };
  }

  // Fallback: examine custom addresses
  const pick = (state.pointToPointPickupLocation || '').toLowerCase();
  const drop = (state.pointToPointDropoffLocation || '').toLowerCase();

  const findNode = (str: string, fallback: MapNode): MapNode => {
    if (str.includes('airport') && str.includes('med')) return MAP_NODES.med_airport;
    if (str.includes('airport') || str.includes('jed')) return MAP_NODES.jed_airport;
    if (str.includes('madinah')) return MAP_NODES.madinah;
    if (str.includes('makkah') || str.includes('haram')) return MAP_NODES.makkah;
    if (str.includes('taif')) return MAP_NODES.taif;
    if (str.includes('city') || str.includes('corniche') || str.includes('jeddah')) return MAP_NODES.jeddah_city;
    return fallback;
  };

  const fromNode = findNode(pick, MAP_NODES.jeddah_city);
  const toNode = findNode(drop, MAP_NODES.jed_airport);

  return {
    title: p2p || `${fromNode.shortLabel} → ${toNode.shortLabel}`,
    stops: [fromNode, toNode],
    pathSegments: [{ from: fromNode, to: toNode }],
    badgeText: 'Direct Transfer',
    distanceLabel: 'Custom Route',
    statusText: p2p || `${fromNode.shortLabel} → ${toNode.shortLabel}`,
  };
}

function resolveFixedRoute(routeId: string, legs?: any[]): RouteResolution {
  switch (routeId) {
    case 'p1':
      return {
        title: 'JED Airport ➔ Makkah ➔ Madinah ➔ MED Airport',
        stops: [MAP_NODES.jed_airport, MAP_NODES.makkah, MAP_NODES.madinah, MAP_NODES.med_airport],
        pathSegments: [
          { from: MAP_NODES.jed_airport, to: MAP_NODES.makkah },
          { from: MAP_NODES.makkah, to: MAP_NODES.madinah },
          { from: MAP_NODES.madinah, to: MAP_NODES.med_airport },
        ],
        badgeText: 'Package 1 · JED In / MED Out',
        distanceLabel: '~480 KM · 3 Stops',
        statusText: 'JED Airport ➔ Makkah ➔ Madinah ➔ MED Airport',
      };
    case 'p2':
      return {
        title: 'JED Airport ➔ Makkah ➔ Madinah ➔ JED Airport',
        stops: [MAP_NODES.jed_airport, MAP_NODES.makkah, MAP_NODES.madinah],
        pathSegments: [
          { from: MAP_NODES.jed_airport, to: MAP_NODES.makkah },
          { from: MAP_NODES.makkah, to: MAP_NODES.madinah },
          { from: MAP_NODES.madinah, to: MAP_NODES.jed_airport, dashed: true },
        ],
        badgeText: 'Package 2 · Round Trip',
        distanceLabel: '~890 KM · 3 Stops',
        statusText: 'JED Airport ➔ Makkah ➔ Madinah ➔ JED Airport',
      };
    case 'p3':
      return {
        title: 'MED Airport ➔ Madinah ➔ Makkah ➔ JED Airport',
        stops: [MAP_NODES.med_airport, MAP_NODES.madinah, MAP_NODES.makkah, MAP_NODES.jed_airport],
        pathSegments: [
          { from: MAP_NODES.med_airport, to: MAP_NODES.madinah },
          { from: MAP_NODES.madinah, to: MAP_NODES.makkah },
          { from: MAP_NODES.makkah, to: MAP_NODES.jed_airport },
        ],
        badgeText: 'Package 3 · MED In / JED Out',
        distanceLabel: '~480 KM · 3 Stops',
        statusText: 'MED Airport ➔ Madinah ➔ Makkah ➔ JED Airport',
      };
    case 'p4':
    default:
      return {
        title: 'JED ➔ Makkah ➔ Madinah ➔ Makkah ➔ JED',
        stops: [MAP_NODES.jed_airport, MAP_NODES.makkah, MAP_NODES.madinah],
        pathSegments: [
          { from: MAP_NODES.jed_airport, to: MAP_NODES.makkah },
          { from: MAP_NODES.makkah, to: MAP_NODES.madinah },
          { from: MAP_NODES.madinah, to: MAP_NODES.makkah },
          { from: MAP_NODES.makkah, to: MAP_NODES.jed_airport, dashed: true },
        ],
        badgeText: 'Package 4 · Extended',
        distanceLabel: '~1,050 KM · 4 Stops',
        statusText: 'JED ➔ Makkah ➔ Madinah ➔ Makkah ➔ JED',
      };
  }
}

/** Formats smooth quadratic bezier curve between two nodes */
function getCurvePath(from: MapNode, to: MapNode): string {
  // Jeddah City <-> JED Airport (Direct local coastal highway)
  if ((from.id === 'jeddah_city' && to.id === 'jed_airport') || (from.id === 'jed_airport' && to.id === 'jeddah_city')) {
    return `M ${from.x} ${from.y} Q 72 218 ${to.x} ${to.y}`;
  }
  // Jeddah <-> Makkah (Highway expressway)
  if ((from.id === 'jed_airport' || from.id === 'jeddah_city') && to.id === 'makkah') {
    return `M ${from.x} ${from.y} Q 124 220 ${to.x} ${to.y}`;
  }
  if (from.id === 'makkah' && (to.id === 'jed_airport' || to.id === 'jeddah_city')) {
    return `M ${from.x} ${from.y} Q 124 220 ${to.x} ${to.y}`;
  }
  // Makkah <-> Madinah (Haramain corridor)
  if ((from.id === 'makkah' && to.id === 'madinah') || (from.id === 'madinah' && to.id === 'makkah')) {
    return `M ${from.x} ${from.y} Q 138 146 ${to.x} ${to.y}`;
  }
  // Madinah <-> MED Airport
  if ((from.id === 'madinah' && to.id === 'med_airport') || (from.id === 'med_airport' && to.id === 'madinah')) {
    return `M ${from.x} ${from.y} Q 196 52 ${to.x} ${to.y}`;
  }
  // Makkah <-> Taif (Mountain switchbacks)
  if ((from.id === 'makkah' && to.id === 'taif') || (from.id === 'taif' && to.id === 'makkah')) {
    return `M ${from.x} ${from.y} Q 205 236 ${to.x} ${to.y}`;
  }
  // Makkah <-> Masjid Aisha
  if ((from.id === 'makkah' && to.id === 'masjid_ayesha') || (from.id === 'masjid_ayesha' && to.id === 'makkah')) {
    return `M ${from.x} ${from.y} Q 168 220 ${to.x} ${to.y}`;
  }
  // Madinah <-> JED Airport (Return loop)
  if ((from.id === 'madinah' && to.id === 'jed_airport') || (from.id === 'jed_airport' && to.id === 'madinah')) {
    return `M ${from.x} ${from.y} Q 112 124 ${to.x} ${to.y}`;
  }

  // Generic natural curve
  const mx = (from.x + to.x) / 2 - (to.y - from.y) * 0.12;
  const my = (from.y + to.y) / 2 + (to.x - from.x) * 0.12;
  return `M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`;
}

interface RouteTrackerMapProps {
  state?: BookingState;
  type?: string;
  status?: string;
  destinationBadge?: string;
  className?: string;
}

/**
 * Dynamic live route tracker:
 * Draws the genuine route, stops, and highway corridor corresponding to the
 * user's selected itinerary (Point-to-Point, Fixed Circuits, Umrah, or Ziyarat).
 */
export default function RouteTrackerMap({
  state,
  type,
  status = 'PLANNED',
  destinationBadge,
  className = '',
}: RouteTrackerMapProps) {
  const route = resolveRouteDetails(state, type);
  const activeNodeIds = new Set(route.stops.map(s => s.id));

  // Regional landmark cities for subtle geographic orientation
  const referenceCities = [
    { label: 'Madinah', x: 176, y: 62 },
    { label: 'Jeddah', x: 74, y: 216 },
    { label: 'Makkah', x: 174, y: 234 },
  ];

  return (
    <div className={`relative overflow-hidden rounded-xl border border-[#c5a059]/35 bg-[#0a0d0d] select-none ${className}`}>
      <svg
        viewBox="0 0 280 280"
        className="w-full h-full block"
        role="img"
        aria-label={`Route tracker: ${route.title}`}
      >
        <defs>
          <filter id="gold-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="route-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f3d38a" />
            <stop offset="100%" stopColor="#c5a059" />
          </linearGradient>
        </defs>

        {/* ── Red Sea water (west) ── */}
        <rect x="0" y="0" width="280" height="280" fill="#0d1b1d" />
        <path
          d="M 0 0 L 72 0 C 58 55 46 110 38 170 C 32 210 24 250 0 280 Z"
          fill="#132a2f"
        />

        {/* ── Arabian Peninsula land (east) ── */}
        <path
          d="M 72 0 L 280 0 L 280 280 L 0 280 C 24 250 32 210 38 170 C 46 110 58 55 72 0 Z"
          fill="#161c16"
          stroke="#202920"
          strokeWidth="1"
        />

        {/* ── Subtle mountain terrain hints ── */}
        <path d="M 105 35 C 140 28 178 38 210 58" stroke="#253123" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M 85 242 C 120 252 165 250 215 238" stroke="#253123" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M 125 140 C 158 132 188 142 212 160" stroke="#212b20" strokeWidth="4" fill="none" strokeLinecap="round" />

        {/* ── Faint Red Sea label ── */}
        <text
          x="22"
          y="140"
          transform="rotate(-90 22 140)"
          textAnchor="middle"
          fontSize="9"
          letterSpacing="0.25em"
          fill="#2b474e"
          fontFamily="sans-serif"
          fontWeight="700"
          fontStyle="italic"
        >
          RED SEA
        </text>

        {/* ── Subtle reference landmarks (shown faintly if not currently in active route) ── */}
        {referenceCities.map((c) => {
          const isStopActive = route.stops.some(
            s => (s.shortLabel === c.label) || (c.label === 'Jeddah' && (activeNodeIds.has('jeddah_city') || activeNodeIds.has('jed_airport')))
          );
          if (isStopActive) return null; // Active stops get dedicated highlighted pins
          return (
            <g key={c.label} opacity="0.35">
              <circle cx={c.x} cy={c.y} r="3" fill="#66725e" />
              <text
                x={c.x + 6}
                y={c.y + 3}
                fontSize="8.5"
                fill="#8a9980"
                fontFamily="sans-serif"
                fontWeight="500"
              >
                {c.label}
              </text>
            </g>
          );
        })}

        {/* ── Active Route Path Segments ── */}
        {route.pathSegments.map((segment, idx) => {
          const pathD = getCurvePath(segment.from, segment.to);
          return (
            <g key={`path-${idx}`}>
              {/* Outer Golden Glow */}
              <path
                d={pathD}
                stroke="#c5a059"
                strokeWidth="6"
                opacity="0.28"
                filter="url(#gold-glow)"
                fill="none"
                strokeLinecap="round"
              />
              {/* Core Route Line */}
              <path
                d={pathD}
                stroke="url(#route-gradient)"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={segment.dashed ? '5 4' : 'none'}
              />
            </g>
          );
        })}

        {/* ── Active Stop Pins & Badges ── */}
        {route.stops.map((stop, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === route.stops.length - 1 && route.stops.length > 1;

          // Compute label badge positioning
          let labelX = stop.x;
          let labelY = stop.y + 16;
          let textAnchor: 'middle' | 'start' | 'end' = 'middle';

          if (stop.labelPosition === 'top') {
            labelY = stop.y - 12;
          } else if (stop.labelPosition === 'left') {
            labelX = stop.x - 10;
            labelY = stop.y + 3;
            textAnchor = 'end';
          } else if (stop.labelPosition === 'right') {
            labelX = stop.x + 10;
            labelY = stop.y + 3;
            textAnchor = 'start';
          }

          const badgeWidth = stop.shortLabel.length * 6.2 + 14;

          return (
            <g key={stop.id}>
              {/* Pulsing ring on origin node */}
              {isFirst && (
                <circle cx={stop.x} cy={stop.y} r="9" fill="none" stroke="#c5a059" strokeWidth="1.5" opacity="0.5" />
              )}
              {/* Destination halo */}
              {isLast && (
                <circle cx={stop.x} cy={stop.y} r="9" fill="none" stroke="#10b981" strokeWidth="1.5" opacity="0.6" />
              )}

              {/* Pin Center Circle */}
              <circle
                cx={stop.x}
                cy={stop.y}
                r="5.5"
                fill="#0c0d10"
                stroke={isLast ? '#10b981' : '#f3d38a'}
                strokeWidth="2.5"
              />

              {/* Pin Inner Dot / Order Number */}
              {route.stops.length > 2 && (
                <text
                  x={stop.x}
                  y={stop.y + 2.5}
                  textAnchor="middle"
                  fontSize="7"
                  fill="#ffffff"
                  fontFamily="sans-serif"
                  fontWeight="bold"
                >
                  {idx + 1}
                </text>
              )}

              {/* Stop Name Badge Box */}
              <g>
                <rect
                  x={textAnchor === 'middle' ? labelX - badgeWidth / 2 : textAnchor === 'end' ? labelX - badgeWidth : labelX}
                  y={labelY - 9}
                  width={badgeWidth}
                  height="14"
                  rx="4"
                  fill="#0a0c0f"
                  stroke={isLast ? '#10b981' : '#c5a059'}
                  strokeWidth="1"
                  strokeOpacity="0.75"
                />
                <text
                  x={textAnchor === 'middle' ? labelX : textAnchor === 'end' ? labelX - badgeWidth / 2 : labelX + badgeWidth / 2}
                  y={labelY + 1.5}
                  textAnchor="middle"
                  fontSize="8"
                  fill="#ffffff"
                  fontFamily="sans-serif"
                  fontWeight="600"
                >
                  {stop.shortLabel}
                </text>
              </g>
            </g>
          );
        })}
      </svg>

      {/* ── Top-right Route Category Chip ── */}
      <div className="absolute top-2.5 right-2.5 bg-black/85 border border-[#c5a059]/40 text-[#f3d38a] text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md backdrop-blur-sm shadow-md">
        {destinationBadge || route.badgeText}
      </div>

      {/* ── Bottom-left Status Pill ── */}
      <div className="absolute left-2.5 bottom-2.5 bg-[#0f7a4d] text-[#eafff4] text-[9.5px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded shadow">
        {status}
      </div>

      {/* ── Bottom-right Distance / Duration Chip ── */}
      <div className="absolute right-2.5 bottom-2.5 bg-black/85 border border-white/10 text-gray-300 text-[9.5px] font-medium tracking-wide px-2 py-0.5 rounded backdrop-blur-sm">
        {route.distanceLabel}
      </div>
    </div>
  );
}
