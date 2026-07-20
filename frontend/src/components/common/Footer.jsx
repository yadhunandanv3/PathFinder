import React from 'react';
import { motion } from 'framer-motion';

export default function Footer({ onPortalClick }) {
  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-8 pt-12 mt-auto"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/5 pt-6 text-sm text-slate-500">
        {/* Copyright & Brand */}
        <div className="text-xs font-medium text-slate-400">
          © {new Date().getFullYear()} Pathfinder Strategy Studio
        </div>

        {/* Right Side: Web Domain & Portal */}
        <div className="flex items-center gap-6">
          {onPortalClick && (
            <button 
              onClick={onPortalClick}
              className="text-xs font-bold text-slate-400 hover:text-pf-lime-text transition-colors duration-200"
            >
              Curator Portal
            </button>
          )}
          
          <a 
            href="https://www.pathfinder.build" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-pf-lime-text hover:text-pf-dark font-semibold transition-colors duration-200 flex items-center gap-1.5 hover:underline"
          >
            <span>www.pathfinder.build</span>
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </a>
        </div>
      </div>
    </motion.footer>
  );
}
