import React, { useState, lazy, Suspense } from 'react';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ConnectorLines from './components/common/ConnectorLines';
import Home from './pages/Home';
import ProtectedRoute from './components/common/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

// Component-level Lazy Loading for bundle-splitting optimization
const Resources = lazy(() => import('./pages/Resources'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Minimal fallback loader during suspense resolution
const PageSuspenseFallback = () => (
  <div className="w-full min-h-[400px] flex flex-col items-center justify-center gap-3">
    <div className="w-8 h-8 rounded-full border-4 border-pf-lime-text border-t-transparent animate-spin" />
    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
      Loading Module...
    </span>
  </div>
);

function MainLayout() {
  // Active Navigation Tab State: 'LIBRARY' | 'HOME' | 'DASHBOARD'
  const [activeTab, setActiveTab] = useState('LIBRARY');

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden bg-[#F8FAFC]">
      {/* Dynamic Background SVG Connections */}
      <ConnectorLines />

      {/* Primary Brand Navigation Header - Always anchored at top */}
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Page Content Container */}
      <main className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          <Suspense fallback={<PageSuspenseFallback />}>
            {activeTab === 'LIBRARY' ? (
              <Resources key="library" />
            ) : activeTab === 'DASHBOARD' ? (
              <ProtectedRoute key="dashboard" allowedRoles={['ADMIN', 'SOCIAL_MEDIA_MANAGER']}>
                <Dashboard />
              </ProtectedRoute>
            ) : (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
              >
                <Home />
              </motion.div>
            )}
          </Suspense>
        </AnimatePresence>
      </main>

      {/* Global Branding Footer with Portal Link */}
      <Footer onPortalClick={() => setActiveTab('DASHBOARD')} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
