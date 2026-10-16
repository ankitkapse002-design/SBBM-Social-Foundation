import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu, X, ChevronDown, Phone, Heart, User, ShieldCheck,
  Calendar, Image, Home, HelpCircle, MapPin, Sparkles, LogOut
} from 'lucide-react';
import { getAuthToken, clearAuthToken, apiRequest } from '../../api';

interface UserState {
  id: string;
  fullName: string;
  role: 'admin' | 'member';
  email: string;
}

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [user, setUser] = useState<UserState | null>(null);

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      apiRequest<{ success: boolean; user: UserState }>('/auth/me')
        .then((res) => {
          if (res.success && res.user) {
            setUser(res.user);
          }
        })
        .catch(() => {
          clearAuthToken();
          setUser(null);
        });
    } else {
      setUser(null);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    clearAuthToken();
    setUser(null);
    navigate('/');
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full shadow-md">
      {/* Top Notification Bar */}
      <div className="bg-foundation-forestDark text-foundation-sandstone text-xs py-1.5 px-4 md:px-8 border-b border-foundation-gold/20 flex flex-wrap items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1.5 text-foundation-ivory">
            <Phone className="w-3.5 h-3.5 text-foundation-gold" />
            <span>Ashram Helpline: <a href="tel:+919890898081" className="font-bold hover:text-foundation-gold">+91 98908 98081</a></span>
          </span>
          <span className="hidden lg:inline text-foundation-sageLight/70">•</span>
          <span className="hidden lg:flex items-center space-x-1 text-foundation-sandstone/90">
            <MapPin className="w-3.5 h-3.5 text-foundation-gold" />
            <span>Anjikar Bagh, Mansar Mahuli Rd, Mahuli, Nagpur – 441105</span>
          </span>
          <span className="hidden xl:inline text-foundation-sageLight/70">•</span>
          <span className="hidden xl:inline text-foundation-gold/90 font-medium">
            Reg. No: 332-15-Nag (Est. 2015)
          </span>
        </div>

        <div className="flex items-center space-x-4 text-xs">
          <Link to="/support" className="flex items-center space-x-1 text-foundation-gold hover:underline font-semibold">
            <Heart className="w-3 h-3 text-red-400 fill-red-400" />
            <span>Support / Donate</span>
          </Link>
          <span className="text-foundation-sageLight/50">|</span>
          <Link to="/volunteer" className="hover:text-foundation-ivory transition-colors">
            Volunteer Seva
          </Link>
          <span className="text-foundation-sageLight/50">|</span>
          {user ? (
            <div className="flex items-center space-x-2">
              <Link
                to={user.role === 'admin' ? '/admin/dashboard' : '/member/dashboard'}
                className="font-semibold text-foundation-gold hover:underline flex items-center space-x-1"
              >
                <User className="w-3 h-3" />
                <span>{user.fullName.split(' ')[0]} ({user.role === 'admin' ? 'Admin' : 'Member'})</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-stone-300 hover:text-red-300 ml-1"
                title="Logout"
              >
                <LogOut className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/login" className="hover:text-foundation-ivory font-medium">
                Member Login
              </Link>
              <span>/</span>
              <Link to="/admin-login" className="text-foundation-gold hover:underline font-medium">
                Admin
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="bg-foundation-ivory border-b border-foundation-borderMuted px-4 md:px-8 py-3 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Foundation Name */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img
              src="/assets/images/logo.jpg"
              alt="SBBM Social Foundation Society Logo"
              className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-foundation-gold shadow-md group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <span className="text-xs tracking-wider uppercase text-foundation-forest font-bold">
                SBBM Social Foundation
              </span>
              <span className="text-base md:text-xl font-display font-bold text-foundation-charcoal leading-tight">
                VYENKATESH ASHRAM
              </span>
              <span className="text-[10px] text-foundation-sage tracking-wider">
                A Place of Care, Dignity & Belonging
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden xl:flex items-center space-x-6 text-sm font-semibold text-foundation-charcoal">
            <Link
              to="/"
              className={`hover:text-foundation-forest transition-colors py-1 ${
                isActive('/') && location.pathname === '/' ? 'text-foundation-forest border-b-2 border-foundation-forest' : ''
              }`}
            >
              Home
            </Link>

            {/* About Us Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsAboutDropdownOpen(true)}
              onMouseLeave={() => setIsAboutDropdownOpen(false)}
            >
              <Link
                to="/about"
                className={`flex items-center space-x-1 hover:text-foundation-forest py-1 ${
                  isActive('/about') ? 'text-foundation-forest border-b-2 border-foundation-forest' : ''
                }`}
              >
                <span>About Us</span>
                <ChevronDown className="w-4 h-4" />
              </Link>

              {isAboutDropdownOpen && (
                <div className="absolute top-full left-0 w-64 bg-white rounded-xl shadow-xl border border-foundation-borderMuted py-2 z-50">
                  <Link to="/about" className="block px-4 py-2 hover:bg-foundation-warmGray text-xs">
                    <strong>Who We Are</strong>
                    <p className="text-[11px] text-stone-500">History, vision & foundation profile</p>
                  </Link>
                  <Link to="/about/leadership" className="block px-4 py-2 hover:bg-foundation-warmGray text-xs">
                    <strong>Founder & President's Message</strong>
                    <p className="text-[11px] text-stone-500">Mr. Ashwin V. Anjikar's message</p>
                  </Link>
                  <Link to="/about/board" className="block px-4 py-2 hover:bg-foundation-warmGray text-xs">
                    <strong>Board & Committees</strong>
                    <p className="text-[11px] text-stone-500">Helping hands & grievance committee</p>
                  </Link>
                  <Link to="/about/certificates" className="block px-4 py-2 hover:bg-foundation-warmGray text-xs">
                    <strong>Certificates & Governance</strong>
                    <p className="text-[11px] text-stone-500">Registration & transparency notes</p>
                  </Link>
                </div>
              )}
            </div>

            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsServicesDropdownOpen(true)}
              onMouseLeave={() => setIsServicesDropdownOpen(false)}
            >
              <Link
                to="/services"
                className={`flex items-center space-x-1 hover:text-foundation-forest py-1 ${
                  isActive('/services') ? 'text-foundation-forest border-b-2 border-foundation-forest' : ''
                }`}
              >
                <span>Services</span>
                <ChevronDown className="w-4 h-4" />
              </Link>

              {isServicesDropdownOpen && (
                <div className="absolute top-full left-0 w-64 bg-white rounded-xl shadow-xl border border-foundation-borderMuted py-2 z-50">
                  <Link to="/services/old-age-home" className="block px-4 py-2 hover:bg-foundation-warmGray text-xs">
                    <strong>Vyenkatesh Ashram</strong>
                    <p className="text-[11px] text-stone-500">Senior residential care & shelter</p>
                  </Link>
                  <Link to="/services/goseva-kendra" className="block px-4 py-2 hover:bg-foundation-warmGray text-xs">
                    <strong>Go-Seva Kendra</strong>
                    <p className="text-[11px] text-stone-500">Cow sanctuary & nourishment</p>
                  </Link>
                  <Link to="/services/naturopathy" className="block px-4 py-2 hover:bg-foundation-warmGray text-xs">
                    <strong>Naturopathy & Yoga</strong>
                    <p className="text-[11px] text-stone-500">Holistic senior health routines</p>
                  </Link>
                  <Link to="/services/education" className="block px-4 py-2 hover:bg-foundation-warmGray text-xs">
                    <strong>Rural Education</strong>
                    <p className="text-[11px] text-stone-500">Student welfare & book drives</p>
                  </Link>
                  <Link to="/services/daily-activities" className="block px-4 py-2 hover:bg-foundation-warmGray text-xs">
                    <strong>Daily Activities</strong>
                    <p className="text-[11px] text-stone-500">Satsang, bhajan, games & walks</p>
                  </Link>
                  <Link to="/services/medical-care" className="block px-4 py-2 hover:bg-foundation-warmGray text-xs">
                    <strong>Healthcare Monitoring</strong>
                    <p className="text-[11px] text-stone-500">Routine vitals & medicine assistance</p>
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/old-age-home"
              className={`hover:text-foundation-forest transition-colors py-1 ${
                isActive('/old-age-home') ? 'text-foundation-forest border-b-2 border-foundation-forest' : ''
              }`}
            >
              Old Age Home
            </Link>

            <Link
              to="/membership"
              className={`hover:text-foundation-forest transition-colors py-1 ${
                isActive('/membership') ? 'text-foundation-forest border-b-2 border-foundation-forest' : ''
              }`}
            >
              Membership
            </Link>

            <Link
              to="/events"
              className={`hover:text-foundation-forest transition-colors py-1 ${
                isActive('/events') ? 'text-foundation-forest border-b-2 border-foundation-forest' : ''
              }`}
            >
              Events
            </Link>

            <Link
              to="/gallery"
              className={`hover:text-foundation-forest transition-colors py-1 ${
                isActive('/gallery') ? 'text-foundation-forest border-b-2 border-foundation-forest' : ''
              }`}
            >
              Gallery
            </Link>

            <Link
              to="/faq"
              className={`hover:text-foundation-forest transition-colors py-1 ${
                isActive('/faq') ? 'text-foundation-forest border-b-2 border-foundation-forest' : ''
              }`}
            >
              FAQs
            </Link>

            <Link
              to="/contact"
              className={`hover:text-foundation-forest transition-colors py-1 ${
                isActive('/contact') ? 'text-foundation-forest border-b-2 border-foundation-forest' : ''
              }`}
            >
              Contact
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden sm:flex items-center space-x-3">
            <Link
              to="/admission"
              className="px-5 py-2.5 bg-foundation-forest hover:bg-foundation-forestLight text-foundation-ivory font-bold rounded-full text-xs shadow-md transition-all flex items-center space-x-1.5"
            >
              <span>Admission Enquiry</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex xl:hidden items-center space-x-2">
            <Link
              to="/admission"
              className="px-3 py-1.5 bg-foundation-forest text-foundation-ivory font-bold rounded-full text-xs"
            >
              Admission
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-foundation-charcoal hover:bg-foundation-warmGray"
              aria-label="Toggle Navigation"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="xl:hidden mt-3 pt-3 border-t border-foundation-borderMuted bg-white rounded-2xl p-4 shadow-xl space-y-3">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block font-bold text-foundation-charcoal py-2 border-b border-stone-100"
            >
              Home
            </Link>
            <Link
              to="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block font-bold text-foundation-charcoal py-2 border-b border-stone-100"
            >
              About Us (Foundation & Leadership)
            </Link>
            <Link
              to="/services"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block font-bold text-foundation-charcoal py-2 border-b border-stone-100"
            >
              All Services
            </Link>
            <Link
              to="/old-age-home"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block font-bold text-foundation-forest py-2 border-b border-stone-100"
            >
              Vyenkatesh Ashram Old Age Home
            </Link>
            <Link
              to="/services/goseva-kendra"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm text-stone-600 py-1 pl-4"
            >
              • Go-Seva Kendra
            </Link>
            <Link
              to="/services/naturopathy"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm text-stone-600 py-1 pl-4"
            >
              • Naturopathy & Yoga
            </Link>
            <Link
              to="/membership"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block font-bold text-foundation-charcoal py-2 border-b border-stone-100"
            >
              Membership
            </Link>
            <Link
              to="/events"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block font-bold text-foundation-charcoal py-2 border-b border-stone-100"
            >
              Events
            </Link>
            <Link
              to="/gallery"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block font-bold text-foundation-charcoal py-2 border-b border-stone-100"
            >
              Gallery
            </Link>
            <Link
              to="/support"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block font-bold text-foundation-gold py-2 border-b border-stone-100"
            >
              Support / Donate
            </Link>
            <Link
              to="/volunteer"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block font-bold text-foundation-charcoal py-2 border-b border-stone-100"
            >
              Volunteer Seva
            </Link>
            <Link
              to="/faq"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block font-bold text-foundation-charcoal py-2 border-b border-stone-100"
            >
              FAQs
            </Link>
            <Link
              to="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block font-bold text-foundation-charcoal py-2"
            >
              Contact Us
            </Link>

            <div className="pt-2 border-t border-stone-200 flex flex-col space-y-2">
              {user ? (
                <div className="flex items-center justify-between bg-stone-100 p-2.5 rounded-xl">
                  <div>
                    <p className="text-xs font-bold text-foundation-forest">{user.fullName}</p>
                    <p className="text-[11px] text-stone-500 capitalize">{user.role} Account</p>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      to={user.role === 'admin' ? '/admin/dashboard' : '/member/dashboard'}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-3 py-1 bg-foundation-forest text-white text-xs rounded-lg font-bold"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="px-2.5 py-1 bg-red-100 text-red-700 text-xs rounded-lg font-bold"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-center py-2 bg-stone-100 text-foundation-charcoal rounded-xl text-xs font-bold"
                  >
                    Member Login
                  </Link>
                  <Link
                    to="/admin-login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-center py-2 bg-foundation-forest text-foundation-ivory rounded-xl text-xs font-bold"
                  >
                    Admin Portal
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
