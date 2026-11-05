import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CinematicIntro3D } from './components/3d/CinematicIntro3D';
import { VyenkyChatbot } from './components/3d/VyenkyChatbot';
import { ScrollProgress } from './components/motion/ScrollProgress';

// Pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Services } from './pages/Services';
import { OldAgeHome } from './pages/OldAgeHome';
import { Admission } from './pages/Admission';
import { Events } from './pages/Events';
import { Gallery } from './pages/Gallery';
import { Membership } from './pages/Membership';
import { Volunteer } from './pages/Volunteer';
import { Support } from './pages/Support';
import { FAQ } from './pages/FAQ';
import { Contact } from './pages/Contact';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';

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
        <CinematicIntro3D onComplete={handleIntroComplete} />
      )}

      <div className="flex flex-col min-h-screen">
        <Navbar onReplayIntro={handleReplayIntro} />

        <main className="flex-grow">
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
        </main>

        <Footer />

        {/* Floating 3D Multilingual Assistant */}
        <VyenkyChatbot />
      </div>
    </Router>
  );
}

export default App;
