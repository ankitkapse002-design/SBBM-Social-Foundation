import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CinematicIntro3D } from './components/3d/CinematicIntro3D';
import { VyenkyChatbot } from './components/3d/VyenkyChatbot';

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
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AdminLogin } from './pages/AdminLogin';
import { MemberDashboard } from './pages/member/MemberDashboard';
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
  // Always start with the 3D opening scene on fresh visit or reload
  const [show3DIntro, setShow3DIntro] = useState<boolean>(true);

  const handleReplayIntro = () => {
    setShow3DIntro(true);
  };

  const handleIntroComplete = () => {
    setShow3DIntro(false);
  };

  return (
    <Router>
      <ScrollToTop />

      {/* 3D Cinematic Entrance Overlay */}
      {show3DIntro && (
        <CinematicIntro3D onComplete={handleIntroComplete} />
      )}

      <div className="flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home onReplayIntro={handleReplayIntro} />} />
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
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/member-login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin-login" element={<AdminLogin />} />

            {/* Member Portal */}
            <Route path="/member/dashboard" element={<MemberDashboard />} />
            <Route path="/member/profile" element={<MemberDashboard />} />
            <Route path="/member/enquiries" element={<MemberDashboard />} />
            <Route path="/member/security" element={<MemberDashboard />} />

            {/* Admin Portal */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/*" element={<AdminDashboard />} />

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
