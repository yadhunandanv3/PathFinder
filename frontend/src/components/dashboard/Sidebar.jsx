import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LayoutGrid, Database, Tag, LogOut, Shield } from 'lucide-react';

export default function Sidebar({ activeTab, onTabChange }) {
  const { user, logout } = useAuth();

  return (
    <div className="w-full lg:w-[280px] shrink-0 flex flex-col gap-6 select-none">
      {/* Profile Card */}
      <div className="rounded-3xl bg-white border border-slate-100 shadow-pf-card p-6 flex flex-col items-center text-center">
        <div className="w-14 h-14 rounded-full bg-pf-lime flex items-center justify-center border border-pf-lime-text/25 mb-3 text-pf-dark font-black text-xl font-display">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <h4 className="text-sm font-bold text-pf-dark truncate max-w-full">{user?.name}</h4>
        <span className="text-[10px] text-slate-400 font-semibold truncate max-w-full">{user?.email}</span>
        
        {/* Role badge */}
        <div className="flex items-center gap-1.5 mt-3.5 px-3 py-1 bg-slate-150 rounded-full border border-slate-200">
          <Shield className="w-3.5 h-3.5 text-pf-lime-text" />
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{user?.role}</span>
        </div>
      </div>

      {/* Navigation Card */}
      <div className="rounded-3xl bg-white border border-slate-100 shadow-pf-card p-4 flex flex-col gap-1.5">
        <button
          onClick={() => onTabChange('resources')}
          className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-200 ${
            activeTab === 'resources'
              ? 'bg-pf-dark text-white shadow-sm'
              : 'text-slate-600 hover:text-pf-dark hover:bg-slate-50'
          }`}
        >
          <Database className="w-4 h-4 shrink-0" />
          <span>Manage Resources</span>
        </button>

        <button
          onClick={() => onTabChange('categories')}
          className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-200 ${
            activeTab === 'categories'
              ? 'bg-pf-dark text-white shadow-sm'
              : 'text-slate-600 hover:text-pf-dark hover:bg-slate-50'
          }`}
        >
          <Tag className="w-4 h-4 shrink-0" />
          <span>Manage Categories</span>
        </button>
      </div>

      {/* Logout button */}
      <button
        onClick={logout}
        className="flex items-center justify-center gap-2 w-full py-3 bg-white hover:bg-red-50 text-red-600 hover:text-red-700 rounded-2xl text-xs font-bold border border-slate-100 shadow-pf-card transition-all duration-200"
      >
        <LogOut className="w-4 h-4" />
        <span>Logout from Session</span>
      </button>
    </div>
  );
}
