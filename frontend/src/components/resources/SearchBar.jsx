import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ value = '', onChange }) {
  const [searchTerm, setSearchTerm] = useState(value);

  // Sync state if initial value changes
  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  // Debouncing effect to prevent flooding the API on every keypress
  useEffect(() => {
    // Prevent firing query if value has not actually changed
    if (searchTerm === value) return;

    const handler = setTimeout(() => {
      onChange(searchTerm);
    }, 450); // 450ms delay is optimal for standard reading paces

    return () => clearTimeout(handler);
  }, [searchTerm, onChange, value]);

  return (
    <div className="relative w-full max-w-md shrink-0">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
        <Search className="w-5 h-5" />
      </div>
      <input
        type="text"
        placeholder="Search notes, handbooks, inspirations, quotes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-12 pr-4 py-3 bg-white/80 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pf-lime-text/40 focus:border-pf-lime-text font-medium text-pf-dark text-sm placeholder-slate-400 shadow-pf-card transition-all duration-200"
      />
    </div>
  );
}
