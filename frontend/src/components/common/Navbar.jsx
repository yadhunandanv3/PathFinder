import React from 'react';
import { motion } from 'framer-motion';

// SVG Pathfinder clover/propeller logo
const LogoIcon = () => (
  <svg viewBox="0 0 40 40" className="w-10 h-10 text-pf-dark" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M20 6 C23 15, 34 19, 34 19 C34 19, 23 23, 20 32 C17 23, 6 19, 6 19 C6 19, 17 15, 20 6 Z" 
      stroke="currentColor" 
      strokeWidth="3.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      fill="currentColor"
      fillOpacity="0.15"
    />
    <circle cx="20" cy="19" r="4.5" fill="currentColor" />
  </svg>
);

// 1. Program Icon: 4-pointed star propeller
const ProgramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 text-current opacity-90" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2 C14.5 9, 22 12, 22 12 C22 12, 14.5 15, 12 22 C9.5 15, 2 12, 2 12 C2 12, 9.5 9, 12 2 Z" />
    <circle cx="12" cy="12" r="2.5" fill="currentColor" />
  </svg>
);

// 2. Team Icon: Infinity Loop
const TeamIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 text-current opacity-90" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 1 0 0-8c-2 0-4 1.33-6 4Z" />
  </svg>
);

// 3. Orbit Icon: Curved Vortex Spiral
const OrbitIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 text-current opacity-90" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2 C16.5 6, 20 10.5, 20 12 C20 15, 16.5 20, 12 22 C7.5 20, 4 15, 4 12 C4 9, 7.5 4, 12 2 Z" />
    <path d="M12 6 C14.5 9, 17 11, 17 12 C17 14, 14.5 17, 12 18 C9.5 17, 7 14, 7 12 C7 10, 9.5 7, 12 6 Z" strokeDasharray="2 2" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
  </svg>
);

// 4. Library Icon: Triangle inside Circle (Delta emblem)
const LibraryIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 text-current" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <polygon points="12 7 7 16 17 16" />
    <line x1="12" y1="10" x2="10" y2="14" />
    <line x1="12" y1="10" x2="14" y2="14" />
    <line x1="10" y1="14" x2="14" y2="14" />
  </svg>
);

// 5. Careers Icon: Double Diamond Arrow
const CareersIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 text-current opacity-90" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12 L9 7 L14 12 L9 17 Z" />
    <path d="M11 12 L16 7 L21 12 L16 17 Z" />
  </svg>
);

export default function Navbar({ activeTab = 'LIBRARY', onTabChange }) {
  
  const items = {
    PROGRAM: { id: 'PROGRAM', label: 'PROGRAM', tag: 'strategic coherence', icon: ProgramIcon },
    TEAM: { id: 'TEAM', label: 'TEAM', tag: 'savant partner', icon: TeamIcon },
    ORBIT: { id: 'ORBIT', label: 'ORBIT', tag: 'blogs', icon: OrbitIcon },
    LIBRARY: { id: 'LIBRARY', label: 'LIBRARY', tag: 'resources', icon: LibraryIcon },
    CAREERS: { id: 'CAREERS', label: 'CAREERS', tag: 'opportunities', icon: CareersIcon }
  };

  const cardDelays = { PROGRAM: 0, TEAM: 0.4, ORBIT: 0.2, LIBRARY: 0.6, CAREERS: 0.8 };

  const renderCard = (item) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;
    const floatDelay = cardDelays[item.id] || 0;

    return (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: -15 }}
        animate={{ 
          opacity: 1, 
          y: [0, -7, 0] 
        }}
        transition={{
          opacity: { duration: 0.5, delay: floatDelay * 0.3 },
          y: {
            duration: 3.6,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
            delay: floatDelay
          }
        }}
        whileHover={{ y: -10, scale: 1.03, transition: { duration: 0.2, ease: 'easeOut' } }}
        onClick={() => onTabChange && onTabChange(item.id)}
        className={`relative cursor-pointer rounded-[13.11px] p-3 flex flex-col justify-between h-[125px] w-full md:w-[142px] border ${
          isActive 
            ? 'bg-[#2D2D2DBF] backdrop-blur-md text-pf-lime border-cyan-400/40 shadow-[0_15px_35px_-5px_rgba(0,0,0,0.4),0_0_20px_rgba(34,211,238,0.25)] z-10' 
            : 'bg-[linear-gradient(135deg,#01F669_0%,#C6F357_50%,#34F564_100%)] text-pf-dark border-white/30 shadow-[0_10px_25px_-5px_rgba(15,23,42,0.14),0_4px_10px_-2px_rgba(184,255,34,0.35)] hover:shadow-[0_20px_40px_-8px_rgba(15,23,42,0.22),0_6px_16px_-2px_rgba(184,255,34,0.55)]'
        }`}
      >
        {/* Top Icon (Left) & Tag (Right) - Exact Figma Layout */}
        <div className="flex justify-between items-start gap-1">
          <div className={`shrink-0 ${isActive ? 'text-cyan-400' : 'text-pf-dark'}`}>
            <Icon />
          </div>
          <span className={`text-[10px] font-semibold leading-none text-right tracking-normal uppercase max-w-[85px] leading-[1.1] ${
            isActive ? 'text-cyan-400' : 'text-pf-lime-text'
          }`}>
            {item.tag}
          </span>
        </div>

        {/* Title label in tall condensed League Gothic font */}
        <span className="font-display text-[38px] leading-none font-normal tracking-tight uppercase mt-auto select-none">
          {item.label}
        </span>
      </motion.div>
    );
  };

  return (
    <header className="relative w-full z-20 flex flex-col md:flex-row md:items-start justify-between gap-6 px-6 lg:pl-[72px] lg:pr-[72px] pt-[36px] max-w-7xl mx-auto">
      {/* Brand Logo Card - Exact Figma Specs */}
      <motion.div 
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onClick={() => onTabChange && onTabChange('HOME')}
        className="flex items-center justify-center w-[60.75px] h-[60.75px] rounded-[15.19px] border-[0.55px] border-[#737373]/25 bg-[linear-gradient(135deg,#01F669_0%,#C6F357_50%,#34F564_100%)] shadow-pf-logo cursor-pointer hover:scale-105 transition-transform duration-200 shrink-0"
      >
        <LogoIcon />
      </motion.div>

      {/* Responsive Staggered Navigation Grid (main-btns) - Exact Figma Specs */}
      <motion.div 
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="w-full md:w-[449.91px] h-auto md:h-[269px] shrink-0 lg:pt-[38px]"
      >
        {/* Mobile: Standard Flex Wrap */}
        <div className="flex flex-wrap justify-center gap-2 lg:hidden w-full">
          {Object.values(items).map(item => renderCard(item))}
        </div>

        {/* Desktop: Staggered Offset Cluster (main-btns 449.91px x 269px) */}
        <div className="hidden lg:flex gap-2.5 items-start select-none w-[449.91px] h-[269px]">
          {/* Column 1: PROGRAM (Shifted slightly down) */}
          <div className="flex flex-col pt-7">
            {renderCard(items.PROGRAM)}
          </div>
          
          {/* Column 2: TEAM (top) & LIBRARY (bottom) */}
          <div className="flex flex-col gap-2">
            {renderCard(items.TEAM)}
            {renderCard(items.LIBRARY)}
          </div>

          {/* Column 3: ORBIT (top, shifted up) & CAREERS (bottom) */}
          <div className="flex flex-col gap-2 pt-1.5">
            {renderCard(items.ORBIT)}
            {renderCard(items.CAREERS)}
          </div>
        </div>
      </motion.div>
    </header>
  );
}
