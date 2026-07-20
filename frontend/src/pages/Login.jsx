import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const { login } = useAuth();
  const [apiError, setApiError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleLoginSubmit = async (data) => {
    setSubmitting(true);
    setApiError(null);
    try {
      await login(data.email, data.password);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed. Please check credentials.';
      setApiError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto px-6 py-12 z-10 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="rounded-3xl glass-panel p-8 border border-pf-lime-text/25 shadow-pf-card"
      >
        {/* Card Header */}
        <div className="text-center mb-8">
          <span className="text-[10px] font-bold tracking-widest text-pf-lime-text uppercase">
            Management Portal
          </span>
          <h2 className="text-3xl font-black font-display tracking-tight text-pf-dark mt-1">
            DASHBOARD LOGIN
          </h2>
          <p className="text-slate-500 text-xs mt-1 font-medium">
            Enter your credentials to manage Library resources.
          </p>
        </div>

        {/* API Error Box */}
        {apiError && (
          <div className="mb-5 rounded-2xl bg-red-50 border border-red-100 p-4 flex items-start gap-2.5 text-red-700">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span className="text-xs font-semibold leading-normal">{apiError}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit(handleLoginSubmit)} className="space-y-4">
          
          {/* Email Input */}
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
                placeholder="editor@pathfinder.build"
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

          {/* Password Input */}
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
                <span>Authenticating Session...</span>
              </>
            ) : (
              <span>Login to Dashboard</span>
            )}
          </motion.button>

        </form>
      </motion.div>
    </div>
  );
}
