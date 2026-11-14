import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { VyenkyChatbot } from './components/3d/VyenkyChatbot';
import { ScrollProgress } from './components/motion/ScrollProgress';

// Eager load primary landing page for maximum First Contentful Paint performance
import { Home } from './pages/Home';

// Lazy load secondary routes for optimal code splitting & bundle performance
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const Services = lazy(() => import('./pages/Services').then(m => ({ default: m.Services })));
const OldAgeHome = lazy(() => import('./pages/OldAgeHome').then(m => ({ default: m.OldAgeHome })));
const Admission = lazy(() => import('./pages/Admission').then(m => ({ default: m.Admission })));
const Events = lazy(() => import('./pages/Events').then(m => ({ default: m.Events })));
const Gallery = lazy(() => import('./pages/Gallery').then(m => ({ default: m.Gallery })));
const Membership = lazy(() => import('./pages/Membership').then(m => ({ default: m.Membership })));
const Volunteer = lazy(() => import('./pages/Volunteer').then(m => ({ default: m.Volunteer })));
const Support = lazy(() => import('./pages/Support').then(m => ({ default: m.Support })));
const FAQ = lazy(() => import('./pages/FAQ').then(m => ({ default: m.FAQ })));
const Contact = lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })));
const AdminLogin = lazy(() => import('./pages/AdminLogin').then(m => ({ default: m.AdminLogin })));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));

// Lazy load 3D cinematic intro overlay (only fetched on demand)
const CinematicIntro3D = lazy(() => import('./components/3d/CinematicIntro3D').then(m => ({ default: m.CinematicIntro3D })));

// Loading placeholder component
function PageLoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] bg-foundation-ivory" role="status" aria-label="Loading content">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-amber-600/20 border-t-amber-600 rounded-full animate-spin" />
        <span className="text-sm font-medium text-stone-600">Loading...</span>
      </div>
    </div>
  );
}

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export function App() {
  // 3D Cinematic Entrance Overlay (triggerable on-demand or replay)
  const [show3DIntro, setShow3DIntro] = useState<boolean>(false);

  const handleReplayIntro = () => {
    setShow3DIntro(true);
  };

  const handleIntroComplete = () => {
    setShow3DIntro(false);
  };

  return (
    <Router>
      <ScrollToTop />
      <ScrollProgress />

      {/* 3D Cinematic Entrance Overlay */}
      {show3DIntro && (
        <Suspense fallback={null}>
          <CinematicIntro3D onComplete={handleIntroComplete} />
        </Suspense>
      )}

      <div className="flex flex-col min-h-screen">
        <Navbar onReplayIntro={handleReplayIntro} />

        <main className="flex-grow">
          <Suspense fallback={<PageLoadingFallback />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/about/:sub" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:slug" element={<Services />} />
              <Route path="/old-age-home" element={<OldAgeHome />} />
              <Route path="/admission" element={<Admission />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:slug" element={<Events />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/gallery/photos" element={<Gallery />} />
              <Route path="/gallery/videos" element={<Gallery />} />
              <Route path="/membership" element={<Membership />} />
              <Route path="/membership/register" element={<Membership />} />
              <Route path="/volunteer" element={<Volunteer />} />
              <Route path="/support" element={<Support />} />
              <Route path="/partnership" element={<Navigate to="/support" replace />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contact" element={<Contact />} />

              {/* Auth Routes: Only Admin Login is retained */}
              <Route path="/admin-login" element={<AdminLogin />} />

              {/* Admin Management Panel */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/*" element={<AdminDashboard />} />

              {/* Non-Admin Login & Portal Safe Redirects */}
              <Route path="/login" element={<Navigate to="/admin-login" replace />} />
              <Route path="/member-login" element={<Navigate to="/admin-login" replace />} />
              <Route path="/register" element={<Navigate to="/membership" replace />} />
              <Route path="/seva-member/*" element={<Navigate to="/admin-login" replace />} />
              <Route path="/membership/login" element={<Navigate to="/admin-login" replace />} />
              <Route path="/membership/register" element={<Navigate to="/membership" replace />} />
              <Route path="/membership/dashboard" element={<Navigate to="/" replace />} />
              <Route path="/volunteer/login" element={<Navigate to="/admin-login" replace />} />
              <Route path="/volunteer/dashboard" element={<Navigate to="/" replace />} />
              <Route path="/admission/login" element={<Navigate to="/admin-login" replace />} />
              <Route path="/admission-login" element={<Navigate to="/admin-login" replace />} />
              <Route path="/admission/dashboard" element={<Navigate to="/" replace />} />
              <Route path="/admission-dashboard" element={<Navigate to="/" replace />} />
              <Route path="/member/*" element={<Navigate to="/" replace />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />

        {/* Floating 3D Multilingual Assistant */}
        <VyenkyChatbot />
      </div>
    </Router>
  );
}

export default App;
