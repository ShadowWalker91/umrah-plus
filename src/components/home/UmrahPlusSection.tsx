'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mountain, CarFront, CheckCircle2 } from 'lucide-react';
import SearchWidget from '../SearchWidget';

function KaabaIcon({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" className="iconify iconify--twemoji" preserveAspectRatio="xMidYMid meet" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M18 0L0 5v29l18 2l18-2V5z" fill="#000000"></path><path fill="#292F33" d="M18 36l18-2V5L18 0z"></path><path fill="#FFD983" d="M22.454 14.507v3.407l4.229.612V15.22zm7 1.181v3.239l3.299.478v-3.161zM18 13.756v3.513l1.683.244V14.04zm18 3.036l-.539-.091v3.096l.539.078z"></path><path fill="#FFAC33" d="M0 16.792v3.083l.539-.078v-3.096zm16.317-2.752v3.473L18 17.269v-3.513zm-13.07 2.204v3.161l3.299-.478v-3.239zm6.07-1.024v3.306l4.229-.612v-3.407z"></path><path fill="#FFD983" d="M21.389 15.131v-.042c0-.421-.143-.763-.32-.763c-.177 0-.32.342-.32.763v.042c-.208.217-.355.621-.355 1.103c0 .513.162.949.393 1.152c.064.195.163.33.282.33s.218-.135.282-.33c.231-.203.393-.639.393-1.152c-.001-.482-.147-.886-.355-1.103zm6.999 1.069v-.042c0-.421-.143-.763-.32-.763c-.177 0-.32.342-.32.763v.042c-.208.217-.355.621-.355 1.103c0 .513.162.949.393 1.152c.064.195.163.33.282.33s.218-.135.282-.33c.231-.203.393-.639.393-1.152c0-.481-.147-.885-.355-1.103zm6.017 1.03v-.039c0-.393-.134-.712-.299-.712c-.165 0-.299.319-.299.712v.039c-.194.203-.331.58-.331 1.03c0 .479.151.886.367 1.076c.059.182.152.308.263.308s.203-.126.263-.308c.215-.189.367-.597.367-1.076c0-.45-.136-.827-.331-1.03z"></path><path fill="#FFAC33" d="M14.611 15.131v-.042c0-.421.143-.763.32-.763s.32.342.32.763v.042c.208.217.355.621.355 1.103c0 .513-.162.949-.393 1.152c-.064.195-.163.33-.282.33s-.218-.135-.282-.33c-.231-.203-.393-.639-.393-1.152c.001-.482.147-.886.355-1.103zM7.612 16.2v-.042c0-.421.143-.763.32-.763s.32.342.32.763v.042c.208.217.355.621.355 1.103c0 .513-.162.949-.393 1.152c-.064.195-.163.33-.282.33s-.218-.135-.282-.33c-.231-.203-.393-.639-.393-1.152c0-.481.147-.885.355-1.103zm-6.017 1.03v-.039c0-.393.134-.712.299-.712s.299.319.299.712v.039c.194.203.331.58.331 1.03c0 .479-.151.886-.367 1.076c-.059.182-.152.308-.263.308s-.204-.127-.264-.308c-.215-.189-.367-.597-.367-1.076c.001-.45.137-.827.332-1.03zM0 11.146v3.5l18-3.268V7.614z"></path><path fill="#FFD983" d="M18 7.614v3.764l18 3.268v-3.5z"></path></g></svg>
  );
}

interface Pillar {
  id: string;
  badge: string;
  title: string;
  tagline: string;
  description: string;
  features: string[];
  icon: React.ComponentType<{ className?: string; size?: number }>;
}

const PILLARS: Pillar[] = [
  {
    id: 'stays',
    badge: 'Pillar 1: Sacred Comfort',
    title: 'Haram-Front Stays',
    tagline: 'Makkah & Madinah Luxury Stays',
    description:
      'Footsteps from the Holy Harams. Handpicked 4★ & 5★ properties with Kaaba and Haram view options, ensuring your energy remains devoted entirely to worship.',
    features: ['Walking Distance to Haram', 'Kaaba & Haram View Suites', 'Daily Buffet Breakfast Included'],
    icon: KaabaIcon,
  },
  {
    id: 'ziyarat',
    badge: 'Pillar 2: Spiritual Depth',
    title: 'Sacred Ziyarat Heritage',
    tagline: 'Makkah, Madinah & Taif Tours',
    description:
      'Walk in the footsteps of the Prophet ﷺ. Curated historical journeys covering Cave Hira, Mount Uhud, Masjid Quba, and the rose gardens & historic mosques of Taif.',
    features: ['Tri-City Heritage Coverage', 'Cave Hira, Uhud & Quba', 'Dedicated Historical Route Guide'],
    icon: Mountain,
  },
  {
    id: 'fleet',
    badge: 'Pillar 3: Pure Peace of Mind',
    title: 'VIP Chauffeur Fleet',
    tagline: 'Private Dedicated Transport',
    description:
      'Zero waiting, zero transit stress. Dedicated door-to-door private luxury fleet (GMC Yukon, Camry, Hiace) with courteous chauffeurs for all airport, intercity & Ziyarat travel.',
    features: ['Airport Meet & Greet', 'Makkah ↔ Madinah Intercity', '24/7 Private On-Demand Fleet'],
    icon: CarFront,
  },
];

const NODE_POS = [
  { x: 54, y: 22.4 },
  { x: 59, y: 50 },
  { x: 54, y: 77.6 },
];
const SPOKES = [
  'M300 350 L540 156.8',
  'M300 350 L590 350',
  'M300 350 L540 543.2',
];
const NODE_SPHERES = [
  '/assets/images/homepage/umrahplus-section/node1-haram-stays.png',
  '/assets/images/homepage/umrahplus-section/node2-ziyarat.png',
  '/assets/images/homepage/umrahplus-section/node3-fleet.png',
];

function Connectors({ active, showAll }: { active: number; showAll: boolean }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      viewBox="0 0 1000 700"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#aa7c11" />
          <stop offset="50%" stopColor="#F9C344" />
          <stop offset="100%" stopColor="#c5a059" />
        </linearGradient>
      </defs>

      {SPOKES.map((d, i) => {
        const hot = showAll || active === i;
        return (
          <g key={`spoke-${i}`}>
            <path
              d={d}
              fill="none"
              stroke={hot ? '#F9C344' : 'url(#lineGrad)'}
              strokeOpacity={hot ? 0.95 : 0.6}
              strokeWidth={hot ? 2.5 : 1.5}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              style={{
                filter: hot ? 'drop-shadow(0 0 6px rgba(249,195,68,.75))' : undefined,
                transition: 'stroke-opacity .35s ease, stroke-width .35s ease, filter .35s ease',
              }}
            />
            <motion.path
              d={d}
              fill="none"
              stroke="#f9e8a2"
              strokeWidth={2.5}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              style={{ strokeDasharray: '9 16' }}
              initial={false}
              animate={{ opacity: hot ? 1 : 0, strokeDashoffset: [0, -25] }}
              transition={{
                opacity: { duration: 0.3 },
                strokeDashoffset: { duration: 0.9, repeat: Infinity, ease: 'linear' },
              }}
            />
          </g>
        );
      })}
    </svg>
  );
}

function Hub({ showAll, onEnter, onLeave }: { showAll: boolean; onEnter: () => void; onLeave: () => void }) {
  return (
    <div
      className="absolute left-[30%] top-[50%] -translate-x-1/2 -translate-y-1/2 z-20 w-[28%] aspect-square cursor-pointer"
    >
      <div className="absolute inset-[-44px] rounded-full bg-[#F9C344]/10 blur-3xl cursor-pointer" />
      <div className="absolute inset-[-30px] rounded-full border border-dashed border-white/10 animate-spin [animation-duration:90s] cursor-pointer" />
      <div className="absolute inset-[-14px] rounded-full border border-[#F9C344]/25 cursor-pointer" />

      <div
        className={`absolute inset-0 rounded-full overflow-hidden bg-gradient-to-br from-[#1c1d24] to-[#121318] border-[1.5px] flex items-center justify-center text-center transition-all duration-300 cursor-pointer ${showAll
          ? 'border-[#F9C344] shadow-[0_30px_70px_-18px_rgba(0,0,0,0.95),0_0_45px_rgba(249,195,68,0.35)] cursor-pointer'
          : 'border-[#F9C344]/35 shadow-[0_30px_70px_-18px_rgba(0,0,0,0.95)] cursor-pointer'
          }`}
      >
        <div className="w-[74%] cursor-pointer">
          <h2 className="font-serif font-bold text-white leading-tight text-base xl:text-[35px]">
            What is <span className="text-[#F9C344]">Umrah Plus?</span>
          </h2>
        </div>
        <div
          className="absolute inset-0 rounded-full pointer-events-auto cursor-pointer"
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
          aria-hidden="true"
        />
      </div>
      <span className="absolute left-[calc(100%+14px)] top-1/2 -translate-x-1/2 -translate-y-1/2 w-[10px] h-[10px] rounded-full bg-[#F9C344] ring-4 ring-[#0a0b0e] shadow-[0_0_12px_rgba(249,195,68,.7)]" />
    </div>
  );
}

function PillarCard({ pillar }: { pillar: Pillar }) {
  const Icon = pillar.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -32 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -32 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="pointer-events-auto relative overflow-hidden rounded-2xl p-4 border border-[#F9C344]/60 bg-gradient-to-b from-[#181920]/96 to-[#121318]/96 shadow-[0_10px_35px_-10px_rgba(249,195,68,0.25),0_25px_50px_-12px_rgba(0,0,0,0.8)] backdrop-blur-xl"
    >
      <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl bg-[#F9C344]/20 pointer-events-none" />

      <div className="relative">
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <span className="text-[9.5px] md:text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border bg-[#F9C344]/15 text-[#F9C344] border-[#F9C344]/40">
            {pillar.badge}
          </span>
          <div className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center bg-[#F9C344] text-black shadow-[0_8px_18px_-6px_rgba(249,195,68,0.45)]">
            <Icon size={18} />
          </div>
        </div>

        <h3 className="font-serif font-bold text-[#F9C344] text-base xl:text-lg leading-snug">
          {pillar.title}
        </h3>
        <p className="text-amber-200/80 text-[11px] font-medium mt-0.5 mb-2">{pillar.tagline}</p>
        <p className="font-light text-gray-300 text-[11.5px] leading-relaxed mb-3">
          {pillar.description}
        </p>

        <div className="pt-2.5 border-t border-white/10 space-y-1.5">
          {pillar.features.map((feat, fIdx) => (
            <div key={fIdx} className="flex items-start gap-2 text-[11px] text-gray-300">
              <CheckCircle2 size={13} className="shrink-0 mt-px text-[#F9C344]" />
              <span>{feat}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function PillarMiniCard({ pillar }: { pillar: Pillar }) {
  const Icon = pillar.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -32 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -32 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="pointer-events-auto relative overflow-hidden rounded-2xl px-4 py-3 flex items-center gap-3 border border-[#F9C344]/60 bg-gradient-to-b from-[#181920]/96 to-[#121318]/96 shadow-[0_10px_35px_-10px_rgba(249,195,68,0.25),0_25px_50px_-12px_rgba(0,0,0,0.8)] backdrop-blur-xl"
    >
      <div className="absolute -top-20 -right-16 w-40 h-40 rounded-full blur-3xl bg-[#F9C344]/20 pointer-events-none" />
      <div className="relative w-9 h-9 rounded-xl shrink-0 flex items-center justify-center bg-[#F9C344] text-black shadow-[0_8px_18px_-6px_rgba(249,195,68,0.45)]">
        <Icon size={18} />
      </div>
      <div className="relative min-w-0">
        <p className="text-[8.5px] font-bold uppercase tracking-wider text-[#F9C344]/90">{pillar.badge}</p>
        <h3 className="font-serif font-bold text-[#F9C344] text-sm leading-snug">{pillar.title}</h3>
        <p className="text-amber-200/80 text-[10px] font-medium leading-snug truncate">{pillar.tagline}</p>
      </div>
    </motion.div>
  );
}

interface NodeProps {
  pillar: Pillar;
  index: number;
  isActive: boolean;
  showAll: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onToggle: () => void;
}

function RadialNode({ pillar, index, isActive, showAll, onEnter, onLeave, onToggle }: NodeProps) {
  const pos = NODE_POS[index];
  const lineOn = isActive || showAll;

  return (
    <div
      className={`group absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center rounded-full outline-none
                 focus-visible:ring-2 focus-visible:ring-[#F9C344]/70 focus-visible:ring-offset-4 focus-visible:ring-offset-[#0a0b0e] ${isActive ? 'z-40' : 'z-30'
        }`}
      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
      role="button"
      tabIndex={0}
      aria-expanded={isActive}
      aria-label={`${pillar.badge}: ${pillar.title} — hover or press Enter to preview`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onToggle}
      onFocus={onEnter}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onToggle();
        }
      }}
    >
      <div className="absolute left-full top-1/2 -translate-y-1/2 w-6 h-2/4" aria-hidden="true" />

      <div className="absolute z-40 left-[calc(100%+1.5rem)] top-1/2 -translate-y-1/2 w-[17.5rem] xl:w-[18.25rem] pointer-events-none">
        <AnimatePresence>{isActive && <PillarCard key="full" pillar={pillar} />}</AnimatePresence>
      </div>
      <div className="absolute z-30 left-[calc(100%+1.5rem)] top-1/2 -translate-y-1/2 w-[17.5rem] xl:w-[18.25rem] pointer-events-none">
        <AnimatePresence>
          {showAll && !isActive && <PillarMiniCard key="mini" pillar={pillar} />}
        </AnimatePresence>
      </div>

      <div className="absolute left-full top-1/2 -translate-y-1/2 w-6 origin-left pointer-events-none" aria-hidden="true">
        <div
          className={`h-[1.5px] w-full rounded-full bg-gradient-to-r from-[#F9C344] to-[#F9C344]/50 transition-transform duration-[450ms] ease-out ${lineOn ? 'scale-x-100' : 'scale-x-0'
            }`}
        />
      </div>
      <span
        className={`absolute left-full -translate-x-1/2 -translate-y-1/2 top-1/2 w-[7px] h-[7px] rounded-full bg-[#F9C344] pointer-events-none transition-all duration-300 ${lineOn ? 'scale-100 opacity-100 shadow-[0_0_8px_rgba(249,195,68,.8)]' : 'scale-0 opacity-0'
          }`}
        aria-hidden="true"
      />

      <motion.div
        className="relative"
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: index * 0.45 }}
      >
        <div
          className={`absolute -inset-[9px] rounded-full border pointer-events-none transition-all duration-300 ${isActive
            ? 'border-[#F9C344]/60 shadow-[0_0_16px_rgba(249,195,68,0.35)]'
            : 'border-[#F9C344]/25'
            }`}
          aria-hidden="true"
        />
        <div
          className={`relative w-20 h-20 lg:w-[96px] lg:h-[96px] xl:w-[104px] xl:h-[104px] rounded-full bg-gradient-to-b from-[#1f2027] to-[#14151b] border-2 cursor-pointer transition-all duration-300 ${isActive
            ? 'border-[#F9C344] scale-110 shadow-[0_0_34px_rgba(249,195,68,0.45),0_14px_32px_-12px_rgba(0,0,0,0.95)]'
            : 'border-[#F9C344]/45 shadow-[0_14px_32px_-12px_rgba(0,0,0,0.95)]'
            }`}
        >
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <img
              src={NODE_SPHERES[index]}
              alt=""
              aria-hidden="true"
              draggable={false}
              className="w-full h-full object-cover"
            />
          </div>
          <span
            className={`absolute top-0 right-0 translate-x-[35%] -translate-y-[35%] w-7 h-7 xl:w-8 xl:h-8 rounded-full text-[9px] xl:text-[10px] font-bold flex items-center justify-center z-20 transition-all duration-300 ${isActive
              ? 'bg-[#F9C344] border border-[#F9C344] text-black shadow-[0_6px_16px_-6px_rgba(249,195,68,0.55)]'
              : 'bg-[#0a0b0e]/95 border border-[#F9C344]/50 text-[#c5a059] shadow-[0_4px_10px_-4px_rgba(0,0,0,0.9)]'
              }`}
          >
            0{index + 1}
          </span>
        </div>
      </motion.div>

      <span
        className={`absolute left-full ml-[18px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#F9C344] transition-all duration-300 ${isActive ? 'shadow-[0_0_12px_2px_rgba(249,195,68,.9)] scale-125' : 'opacity-70'
          }`}
        aria-hidden="true"
      />
    </div>
  );
}

export default function UmrahPlusSection() {
  const [activePillar, setActivePillar] = useState<number>(-1);
  const [hubHover, setHubHover] = useState<boolean>(false);

  const enter = (idx: number) => setActivePillar(idx);
  const leave = (idx: number) => setActivePillar((current) => (current === idx ? -1 : current));
  const toggle = (idx: number) => setActivePillar((current) => (current === idx ? -1 : idx));

  return (
    <section
      id="section-5"
      className="snap-section h-screen w-full relative flex flex-col overflow-hidden snap-start bg-[#0a0b0e] text-white pt-20 md:pt-24 lg:pt-28 [@media(max-height:840px)]:pt-20! pb-5 md:pb-6 px-4 sm:px-6 md:px-10 lg:px-14"
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/assets/images/homepage/packages-section/packagesBG.jpg"
          alt="Umrah Plus Background"
          className="w-full h-full object-cover opacity-25 scale-105 transform filter blur-[1px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0b0e] via-[#0a0b0e]/85 to-[#0a0b0e]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#0a0b0e] to-transparent" />
      </div>

      <div className="hidden lg:block relative z-10 w-full max-w-6xl mx-auto flex-1 min-h-[440px] origin-bottom scale-95 [@media(min-height:941px)_and_(max-height:1080px)]:scale-90 [@media(min-height:841px)_and_(max-height:940px)]:scale-90 [@media(max-height:840px)]:scale-[0.70]">
        <div className="absolute inset-y-0 left-0 w-[30%] bg-[#0e1016] border-r border-[#F9C344]/15 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-[70%] bg-[#0a0b0e]/60 pointer-events-none" />

        <span className="absolute w-[3px] h-[3px] rounded-full bg-[#F9C344]/60 animate-pulse" style={{ left: '7%', top: '16%' }} />
        <span className="absolute w-[3px] h-[3px] rounded-full bg-[#F9C344]/60 animate-pulse [animation-delay:1.2s]" style={{ left: '91%', top: '11%' }} />
        <span className="absolute w-[3px] h-[3px] rounded-full bg-[#F9C344]/60 animate-pulse [animation-delay:2.1s]" style={{ left: '76%', top: '30%' }} />
        <span className="absolute w-[3px] h-[3px] rounded-full bg-[#F9C344]/60 animate-pulse [animation-delay:2.6s]" style={{ left: '18%', top: '34%' }} />

        <Connectors active={activePillar} showAll={hubHover} />
        <Hub
          showAll={hubHover}
          onEnter={() => setHubHover(true)}
          onLeave={() => setHubHover(false)}
        />

        {PILLARS.map((pillar, idx) => (
          <RadialNode
            key={pillar.id}
            pillar={pillar}
            index={idx}
            isActive={activePillar === idx}
            showAll={hubHover}
            onEnter={() => enter(idx)}
            onLeave={() => leave(idx)}
            onToggle={() => toggle(idx)}
          />
        ))}
      </div>

      <div className="lg:hidden relative z-10 w-full flex-1 min-h-0 flex flex-col">
        <div className="relative mx-auto w-full max-w-xl rounded-3xl border border-[#F9C344]/30 bg-gradient-to-b from-[#181920]/95 to-[#121318]/95 px-5 py-4 text-center shadow-[0_15px_40px_-15px_rgba(249,195,68,0.2)] backdrop-blur-xl overflow-hidden">
          <div className="absolute -top-20 -right-16 w-40 h-40 rounded-full blur-3xl bg-[#F9C344]/15 pointer-events-none" />
          <div className="relative">
            <h2 className="font-serif font-bold text-white leading-tight text-lg sm:text-xl">
              What is <span className="text-[#F9C344]">Umrah Plus?</span>
            </h2>
            <div className="flex items-center justify-center gap-1.5 my-1.5">
              <span className="w-[5px] h-[5px] rounded-full bg-[#F9C344]" />
              <span className="w-[7px] h-[7px] rounded-full bg-[#F9C344]" />
              <span className="w-[5px] h-[5px] rounded-full bg-[#F9C344]" />
            </div>

          </div>
        </div>

        <div className="mt-4 flex-1 min-h-0 overflow-y-auto overscroll-contain pr-1">
          <div className="relative">
            <div className="absolute left-[31px] top-5 bottom-5 w-px bg-gradient-to-b from-[#F9C344]/45 via-[#F9C344]/25 to-transparent" />

            {PILLARS.map((pillar, idx) => {
              const isActive = activePillar === idx;

              return (
                <div
                  key={pillar.id}
                  className="group relative flex items-start gap-4 py-2.5 outline-none"
                  role="button"
                  tabIndex={0}
                  aria-expanded={isActive}
                  onClick={() => toggle(idx)}
                  onFocus={() => enter(idx)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      toggle(idx);
                    }
                  }}
                >
                  <div className="relative z-10 shrink-0">
                    <div
                      className={`w-[62px] h-[62px] rounded-full overflow-hidden bg-gradient-to-b from-[#1f2027] to-[#14151b] border-2 transition-all duration-300 ${isActive
                        ? 'border-[#F9C344] shadow-[0_0_26px_rgba(249,195,68,0.4)]'
                        : 'border-[#F9C344]/25 shadow-[0_10px_24px_-10px_rgba(0,0,0,0.95)]'
                        }`}
                    >
                      <img
                        src={NODE_SPHERES[idx]}
                        alt=""
                        aria-hidden="true"
                        draggable={false}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span
                      className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-1.5 py-px rounded-full text-[7.5px] font-semibold tracking-[.25em] transition-all duration-300 ${isActive
                        ? 'bg-[#F9C344] text-black'
                        : 'bg-[#0a0b0e] border border-[#F9C344]/30 text-[#c5a059]'
                        }`}
                    >
                      0{idx + 1}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1 pt-1.5">
                    <h3
                      className={`font-serif font-bold text-sm sm:text-base leading-tight transition-colors ${isActive ? 'text-[#F9C344]' : 'text-white'
                        }`}
                    >
                      {pillar.title}
                    </h3>
                    <p className="text-[10.5px] text-amber-200/80 font-medium mt-0.5">{pillar.tagline}</p>

                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: 'auto' }}
                          exit={{ opacity: 0, y: 10, height: 0 }}
                          transition={{ duration: 0.25, ease: 'easeOut' }}
                          className="overflow-hidden"
                        >
                          <div className="mt-2.5">
                            <PillarCard pillar={pillar} />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative z-30 shrink-0 mt-2 flex flex-col items-center gap-2 w-full max-w-6xl mx-auto">
        <SearchWidget activeService="Umrah Plus" />
      </div>
    </section>
  );
}
