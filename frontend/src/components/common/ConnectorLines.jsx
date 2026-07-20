import React from 'react';

export default function ConnectorLines() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Vector 29: Blue Radial Ambient Glow Layer (Exact Figma Specs: 1227.06px x 596.29px, blur 151.78px, #0A4BAD) */}
      <div 
        className="absolute top-[43.86px] left-0 w-[1227.06px] max-w-full h-[596.29px] pointer-events-none z-0 opacity-70 filter blur-[151.78px] bg-[radial-gradient(ellipse_at_center,#0A4BAD_0%,rgba(10,75,173,0.5)_60%,transparent_100%)] select-none"
      />
      {/* Desktop Layout SVG Connector Line */}
      <svg className="hidden lg:block w-full h-full min-h-[750px]" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Path 1: Logo to Navigation Grid */}
        <path 
          d="M 85 54 L 480 54 A 8 8 0 0 0 488 46 L 488 38 A 8 8 0 0 1 496 30 L 610 30" 
          stroke="#B8FF22" 
          strokeWidth="1.2" 
          strokeOpacity="0.5" 
          strokeDasharray="4 4"
        />
        
        {/* Path 2: Text to Bottom Arrow Indicator */}
        <path 
          d="M 620 480 Q 620 540 680 540 L 960 540 A 16 16 0 0 1 976 556 L 976 720" 
          stroke="#B8FF22" 
          strokeWidth="1.2" 
          strokeOpacity="0.5"
        />
        {/* Arrow head at (976, 720) */}
        <path 
          d="M 970 714 L 976 720 L 982 714" 
          stroke="#B8FF22" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeOpacity="0.7"
        />
      </svg>

      {/* Mobile / Tablet Layout SVG Connector Line */}
      <svg className="block lg:hidden w-full h-full min-h-[900px]" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Path 1: Logo to Navigation Grid (Mobile vertical stack routing) */}
        <path 
          d="M 80 54 L 200 54 A 8 8 0 0 0 208 46 L 208 38" 
          stroke="#B8FF22" 
          strokeWidth="1.2" 
          strokeOpacity="0.4"
          strokeDasharray="3 3"
        />

        {/* Path 2: Text to Bottom Arrow (Mobile vertical layout routing) */}
        <path 
          d="M 60 700 Q 60 760 120 760 L 320 760 A 16 16 0 0 1 336 776 L 336 860" 
          stroke="#B8FF22" 
          strokeWidth="1.2" 
          strokeOpacity="0.4"
        />
        <path 
          d="M 330 854 L 336 860 L 342 854" 
          stroke="#B8FF22" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeOpacity="0.6"
        />
      </svg>
    </div>
  );
}
