import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Login from '../../pages/Login';
import { ShieldAlert } from 'lucide-react';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="w-full min-h-[400px] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 rounded-full border-4 border-pf-lime-text border-t-transparent animate-spin" />
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Validating Session...</span>
      </div>
    );
  }

  // Redirect to Login view in-place if not authenticated
  if (!isAuthenticated) {
    return <Login />;
  }

  // Verify Role authorizations (case-insensitive check)
  const normalizedUserRole = user.role ? user.role.toUpperCase() : '';
  const normalizedAllowedRoles = allowedRoles.map(r => r.toUpperCase());

  if (allowedRoles.length > 0 && !normalizedAllowedRoles.includes(normalizedUserRole)) {
    return (
      <div className="w-full max-w-md mx-auto my-12 p-8 rounded-3xl bg-white border border-slate-200 shadow-pf-card text-center flex flex-col items-center gap-4">
        <div className="p-3 bg-red-100 text-red-600 rounded-2xl">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold font-display text-pf-dark">Access Denied</h3>
        <p className="text-slate-500 text-sm leading-normal font-medium">
          Your account role '{user.role}' does not have permissions to access the management portal. Please contact an administrator.
        </p>
      </div>
    );
  }

  return children;
}
