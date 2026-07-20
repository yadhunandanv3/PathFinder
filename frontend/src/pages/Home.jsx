import React from 'react';
import { motion } from 'framer-motion';
import man from '../assets/man02-lit-sh.png';
import poses from '../assets/poses.png';

// 5 Realistic Human Figure Silhouettes image asset - Exact Figma Specs
const SmallSilhouettes = () => (
  <img 
    src={poses} 
    alt="Silhouettes" 
    className="w-[214.79px] h-[92.38px] object-contain inline-block align-middle ml-3 my-auto shrink-0 filter drop-shadow-sm hover:scale-105 transition-transform duration-200" 
  />
);

export default function Home() {
  return (
    <div className="relative w-full max-w-7xl mx-auto px-6 py-6 lg:py-10 flex flex-col lg:flex-row items-center lg:items-start justify-between gap-10 z-10 select-none">
      
      {/* Hexagonal Silhouette Capsule - Exact Figma Specs */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative w-[199.33px] h-[505.97px] capsule-clip border-[0.69px] border-[#1E1E1E]/30 bg-gradient-to-b from-[#B8FF22] via-[#84CC16] to-[#3F6212] p-[2px] shadow-pf-capsule flex items-center justify-center overflow-hidden shrink-0 filter drop-shadow-[15px_25px_15px_rgba(15,23,42,0.15)] ml-0 lg:ml-[18px]"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#B8FF22] via-[#84CC16]/80 to-[#3F6212]/95 z-0" />
        
        {/* Silhouette Image Overlay */}
        <div className="relative z-10 w-full h-full flex items-center justify-center p-2">
          <img src={man} alt="Hero" className="w-full h-auto object-contain filter drop-shadow-[15px_25px_15px_rgba(15,23,42,0.18)]" />
        </div>
      </motion.div>

      {/* Right Content Section */}
      <div className="flex flex-col flex-1 gap-8 lg:pt-4 w-full">
        {/* Giant Display Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="flex flex-col text-left font-display leading-[0.82] tracking-tighter"
        >
          {/* Row 1: Bold [Silhouettes] - Exact Figma Specs */}
          <h1 className="font-display font-normal text-[101.51px] leading-[0.75] tracking-[-0.03em] text-[#1E1E1E]/80 select-none flex items-center flex-wrap">
            <span>Bold</span>
            <SmallSilhouettes />
          </h1>
          
          {/* Row 2: Innovators - Exact Figma Specs */}
          <h1 className="font-display font-normal text-[101.51px] leading-[0.75] tracking-[-0.03em] text-[#1E1E1E]/80 select-none mt-1">
            Innovators
          </h1>
          
          {/* Row 3: choose Enduring - Exact Figma Specs */}
          <div className="flex items-baseline flex-wrap mt-2 select-none">
            <span className="font-display font-normal text-[55.37px] leading-[0.90] text-[#1E1E1E]/80 lowercase mr-3 select-none">
              choose
            </span>
            <span className="font-display font-normal text-[92.28px] leading-[0.90] tracking-[-0.03em] text-[#C6F357] uppercase select-none">
              Enduring
            </span>
          </div>

          {/* Row 4: Paths - Exact Figma Specs */}
          <h1 className="font-display font-normal text-[92.28px] leading-[0.90] tracking-[-0.03em] text-[#C6F357] uppercase select-none mt-1">
            Paths
          </h1>
        </motion.div>

        {/* Tagline Paragraph - Exact Figma Specs for txt Layer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative lg:self-end w-full max-w-[415.14px] min-h-[138px] flex items-center justify-center p-6 mt-4"
        >
          {/* Connector Vector Line (Vector 32) - Exact Figma Specs */}
          <svg viewBox="0 0 415 138" className="absolute inset-0 w-full h-full text-[#C6F357] pointer-events-none filter drop-shadow-sm" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M 2 20 Q 2 2, 20 2 L 395 2 Q 413 2, 413 20 L 413 126" />
            <path d="M 407 119 L 413 128 L 419 119" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          <p className="relative z-10 text-[#1E1E1E]/85 text-base lg:text-[19px] font-semibold leading-snug font-sans tracking-tight text-left">
            Pathfinder is the Strategy Studio built to power your early-stage ascent.
          </p>
        </motion.div>
      </div>

    </div>
  );
}
