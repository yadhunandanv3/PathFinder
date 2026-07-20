import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User as UserIcon, Shield, Key, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const { login, register: registerAuth } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [apiError, setApiError] = useState(null);
  const [apiSuccess, setApiSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();
  const selectedRole = watch('role');

  const handleFormSubmit = async (data) => {
    setSubmitting(true);
    setApiError(null);
    setApiSuccess(null);

    try {
      if (mode === 'login') {
        await login(data.email, data.password);
      } else {
        const { authAPI } = await import('../services/api');
        const response = await authAPI.register({
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role || 'Visitor',
          adminSecretKey: data.adminSecretKey || undefined,
        });
        
        if (response.success) {
          setApiSuccess('User created successfully! Please log in with your credentials.');
          setMode('login');
          setValue('email', data.email);
          setValue('password', '');
        }
      }
    } catch (err) {
      const msg = err?.message || err?.response?.data?.message || 'Authentication failed';
      setApiError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleMode = (newMode) => {
    setMode(newMode);
    setApiError(null);
    setApiSuccess(null);
    reset();
  };

  return (
    <div className="relative w-full max-w-md mx-auto px-6 py-10 z-10 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="rounded-3xl glass-panel p-8 border border-pf-lime-text/25 shadow-pf-card"
      >
        {/* Header Mode Selector Tabs */}
        <div className="flex items-center justify-center p-1 bg-slate-100/80 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => toggleMode('login')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-200 ${
              mode === 'login'
                ? 'bg-pf-dark text-white shadow-sm'
                : 'text-slate-500 hover:text-pf-dark'
            }`}
          >
            Login to Account
          </button>
          <button
            type="button"
            onClick={() => toggleMode('register')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-200 ${
              mode === 'register'
                ? 'bg-pf-dark text-white shadow-sm'
                : 'text-slate-500 hover:text-pf-dark'
            }`}
          >
            Register New User
          </button>
        </div>

        {/* Card Title Header */}
        <div className="text-center mb-6">
          <span className="text-[10px] font-bold tracking-widest text-pf-lime-text uppercase">
            Management Portal
          </span>
          <h2 className="text-3xl font-black font-display tracking-tight text-pf-dark mt-1">
            {mode === 'login' ? 'DASHBOARD LOGIN' : 'CREATE ACCOUNT'}
          </h2>
          <p className="text-slate-500 text-xs mt-1 font-medium">
            {mode === 'login'
              ? 'Enter your credentials to manage Strategy Library resources.'
              : 'Register a new Curator account with role permissions.'}
          </p>
        </div>

        {/* API Error Alert */}
        {apiError && (
          <div className="mb-5 rounded-2xl bg-red-50 border border-red-100 p-4 flex items-start gap-2.5 text-red-700">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span className="text-xs font-semibold leading-normal">{apiError}</span>
          </div>
        )}

        {/* API Success Alert */}
        {apiSuccess && (
          <div className="mb-5 rounded-2xl bg-emerald-50 border border-emerald-100 p-4 flex items-start gap-2.5 text-emerald-700">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
            <span className="text-xs font-semibold leading-normal">{apiSuccess}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          
          {/* Register Mode: Full Name */}
          {mode === 'register' && (
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. Vikram Sharma"
                  {...register('name', { required: 'Name is required' })}
                  className="w-full pl-10 pr-4 py-3 bg-white/70 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pf-lime-text/40 focus:border-pf-lime-text font-medium text-pf-dark text-sm shadow-sm transition-all"
                />
              </div>
              {errors.name && (
                <span className="text-[10px] font-bold text-red-600 mt-1 ml-1 block">
                  {errors.name.message}
                </span>
              )}
            </div>
          )}

          {/* Email Address */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                placeholder="curator@pathfinder.build"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                className="w-full pl-10 pr-4 py-3 bg-white/70 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pf-lime-text/40 focus:border-pf-lime-text font-medium text-pf-dark text-sm shadow-sm transition-all"
              />
            </div>
            {errors.email && (
              <span className="text-[10px] font-bold text-red-600 mt-1 ml-1 block">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                placeholder="••••••••"
                {...register('password', { 
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                className="w-full pl-10 pr-4 py-3 bg-white/70 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pf-lime-text/40 focus:border-pf-lime-text font-medium text-pf-dark text-sm shadow-sm transition-all"
              />
            </div>
            {errors.password && (
              <span className="text-[10px] font-bold text-red-600 mt-1 ml-1 block">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Register Mode: Role Selection */}
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                  Account Role Clearance
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Shield className="w-4 h-4" />
                  </div>
                  <select
                    {...register('role')}
                    className="w-full pl-10 pr-4 py-3 bg-white/70 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pf-lime-text/40 focus:border-pf-lime-text font-medium text-pf-dark text-sm shadow-sm transition-all"
                  >
                    <option value="Visitor">Visitor (Read-Only)</option>
                    <option value="Social Media Manager">Social Media Manager (Content Editor)</option>
                    <option value="Admin">System Admin (Full Access)</option>
                  </select>
                </div>
              </div>

              {/* Master Key input if privileged role is selected */}
              {(selectedRole === 'Admin' || selectedRole === 'Social Media Manager') && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                    Master Admin Secret Key
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Key className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      placeholder="Enter secret key (pathfinder_admin_master_creation_secret_key_99)"
                      {...register('adminSecretKey')}
                      className="w-full pl-10 pr-4 py-3 bg-white/70 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pf-lime-text/40 focus:border-pf-lime-text font-medium text-pf-dark text-sm shadow-sm transition-all"
                    />
                  </div>
                  <span className="text-[9px] text-slate-400 font-semibold mt-1 ml-1 block">
                    Default Master Key: pathfinder_admin_master_creation_secret_key_99
                  </span>
                </div>
              )}
            </>
          )}

          {/* Submit Action */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            disabled={submitting}
            type="submit"
            className="w-full py-3.5 bg-pf-dark hover:bg-slate-800 text-white rounded-2xl text-xs font-bold transition-all duration-200 shadow-md flex items-center justify-center gap-2 mt-6 disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{mode === 'login' ? 'Authenticating Session...' : 'Creating Account...'}</span>
              </>
            ) : (
              <span>{mode === 'login' ? 'Login to Dashboard' : 'Register Account'}</span>
            )}
          </motion.button>

        </form>

        {/* Toggle Footer */}
        <div className="text-center mt-6 pt-4 border-t border-slate-100">
          {mode === 'login' ? (
            <button
              type="button"
              onClick={() => toggleMode('register')}
              className="text-xs font-bold text-pf-dark hover:text-pf-lime-text transition-colors"
            >
              Don't have an account? <span className="underline">Register a new user</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => toggleMode('login')}
              className="text-xs font-bold text-pf-dark hover:text-pf-lime-text transition-colors"
            >
              Already registered? <span className="underline">Login to existing account</span>
            </button>
          )}
        </div>

      </motion.div>
    </div>
  );
}
