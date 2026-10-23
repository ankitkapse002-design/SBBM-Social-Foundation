import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu, X, ChevronDown, Phone, Heart, User, UserCheck, ShieldCheck,
  HeartHandshake, Award, LogOut, MapPin, Lock, Sparkles
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
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [user, setUser] = useState<UserState | null>(null);

  const accountDropdownRef = useRef<HTMLDivElement>(null);
  const mobileAccountDropdownRef = useRef<HTMLDivElement>(null);

  // Close account dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        accountDropdownRef.current &&
        !accountDropdownRef.current.contains(event.target as Node) &&
        mobileAccountDropdownRef.current &&
        !mobileAccountDropdownRef.current.contains(event.target as Node)
      ) {
        setIsAccountDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch logged in user profile
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
    setIsAccountDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full shadow-md">
      {/* Top Notification Bar - Streamlined, clean, without scattered portal links */}
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
          <Link to="/support" className="flex items-center space-x-1.5 text-foundation-gold hover:underline font-semibold">
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
            <span>Support / Donate</span>
          </Link>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="bg-foundation-ivory/95 backdrop-blur-md border-b border-foundation-borderMuted px-4 md:px-6 xl:px-8 py-2.5 transition-all">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-3 xl:gap-4">
          {/* Logo & Foundation Name */}
          <Link to="/" className="flex items-center space-x-2.5 md:space-x-3 group shrink-0">
            <img
              src="/assets/images/logo.jpg"
              alt="SBBM Social Foundation Society Logo"
              className="w-11 h-11 md:w-12 md:h-12 rounded-full border-2 border-foundation-gold shadow-md group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <span className="text-[11px] tracking-wider uppercase text-foundation-forest font-bold leading-none whitespace-nowrap">
                SBBM Social Foundation
              </span>
              <span className="text-base md:text-lg font-display font-bold text-foundation-charcoal leading-tight whitespace-nowrap">
                VYENKATESH ASHRAM
              </span>
              <span className="text-[9.5px] text-foundation-sage tracking-wider leading-none whitespace-nowrap">
                A Place of Care, Dignity & Belonging
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links - Single clean horizontal line with whitespace-nowrap */}
          <div className="hidden xl:flex items-center gap-1 xl:gap-1.5 2xl:gap-3 text-[13px] 2xl:text-sm font-semibold text-foundation-charcoal">
            <Link
              to="/"
              className={`whitespace-nowrap px-2.5 py-1.5 rounded-lg transition-colors ${
                isActive('/') && location.pathname === '/'
                  ? 'text-foundation-forest bg-foundation-forest/10 font-bold'
                  : 'text-stone-700 hover:text-foundation-forest hover:bg-stone-100/70'
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
                className={`whitespace-nowrap inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg transition-colors ${
                  isActive('/about')
                    ? 'text-foundation-forest bg-foundation-forest/10 font-bold'
                    : 'text-stone-700 hover:text-foundation-forest hover:bg-stone-100/70'
                }`}
              >
                <span>About Us</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${isAboutDropdownOpen ? 'rotate-180' : ''}`} />
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
                className={`whitespace-nowrap inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg transition-colors ${
                  isActive('/services')
                    ? 'text-foundation-forest bg-foundation-forest/10 font-bold'
                    : 'text-stone-700 hover:text-foundation-forest hover:bg-stone-100/70'
                }`}
              >
                <span>Services</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${isServicesDropdownOpen ? 'rotate-180' : ''}`} />
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
              className={`whitespace-nowrap px-2.5 py-1.5 rounded-lg transition-colors ${
                isActive('/old-age-home')
                  ? 'text-foundation-forest bg-foundation-forest/10 font-bold'
                  : 'text-stone-700 hover:text-foundation-forest hover:bg-stone-100/70'
              }`}
            >
              Old Age Home
            </Link>

            <Link
              to="/events"
              className={`whitespace-nowrap px-2.5 py-1.5 rounded-lg transition-colors ${
                isActive('/events')
                  ? 'text-foundation-forest bg-foundation-forest/10 font-bold'
                  : 'text-stone-700 hover:text-foundation-forest hover:bg-stone-100/70'
              }`}
            >
              Events
            </Link>

            <Link
              to="/gallery"
              className={`whitespace-nowrap px-2.5 py-1.5 rounded-lg transition-colors ${
                isActive('/gallery')
                  ? 'text-foundation-forest bg-foundation-forest/10 font-bold'
                  : 'text-stone-700 hover:text-foundation-forest hover:bg-stone-100/70'
              }`}
            >
              Gallery
            </Link>

            <Link
              to="/faq"
              className={`whitespace-nowrap px-2.5 py-1.5 rounded-lg transition-colors ${
                isActive('/faq')
                  ? 'text-foundation-forest bg-foundation-forest/10 font-bold'
                  : 'text-stone-700 hover:text-foundation-forest hover:bg-stone-100/70'
              }`}
            >
              FAQs
            </Link>

            <Link
              to="/contact"
              className={`whitespace-nowrap px-2.5 py-1.5 rounded-lg transition-colors ${
                isActive('/contact')
                  ? 'text-foundation-forest bg-foundation-forest/10 font-bold'
                  : 'text-stone-700 hover:text-foundation-forest hover:bg-stone-100/70'
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Right Action Controls: Admission CTA & Login/Account Icon to its RIGHT */}
          <div className="hidden xl:flex items-center space-x-2.5 shrink-0">
            {/* 1. Admission CTA Button */}
            <Link
              to="/admission"
              className="whitespace-nowrap h-9 px-4.5 bg-gradient-to-r from-foundation-forest to-foundation-forestLight hover:from-foundation-forestLight hover:to-foundation-forest text-foundation-ivory font-bold rounded-full text-xs shadow-sm hover:shadow-md transition-all inline-flex items-center space-x-1.5 shrink-0 border border-foundation-gold/40"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Admission Enquiry</span>
            </Link>

            {/* 2. Dedicated Login / Portal Icon Button - Placed to the RIGHT of Admission Enquiry */}
            <div className="relative shrink-0" ref={accountDropdownRef}>
              <button
                onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                className={`whitespace-nowrap h-9 inline-flex items-center space-x-1.5 px-3 rounded-full border transition-all cursor-pointer ${
                  user
                    ? 'bg-foundation-forest text-foundation-gold border-foundation-gold shadow-sm'
                    : isAccountDropdownOpen
                    ? 'bg-foundation-warmGray text-foundation-forest border-foundation-forest ring-2 ring-foundation-forest/20'
                    : 'bg-white hover:bg-foundation-warmGray text-foundation-charcoal border-stone-200 hover:border-foundation-gold shadow-sm'
                }`}
                id="portal-login-icon-btn"
                aria-label="Account and Portals"
                title="Account, Seva Members, Volunteers & Admin Login"
              >
                <div className="w-5 h-5 rounded-full bg-foundation-forest/10 flex items-center justify-center text-foundation-forest shrink-0">
                  {user ? (
                    <span className="font-bold text-[11px] text-foundation-gold">{user.fullName.charAt(0).toUpperCase()}</span>
                  ) : (
                    <User className="w-3.5 h-3.5 text-foundation-forest" />
                  )}
                </div>
                <span className="text-xs font-bold whitespace-nowrap">
                  {user ? user.fullName.split(' ')[0] : 'Login'}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 ${
                    isAccountDropdownOpen ? 'rotate-180 text-foundation-forest' : ''
                  }`}
                />
              </button>

              {/* Account / Portals Dropdown Card */}
              {isAccountDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-foundation-borderMuted p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {user ? (
                    // Logged In State
                    <div className="space-y-3">
                      <div className="bg-foundation-warmGray p-3 rounded-xl border border-foundation-borderMuted/60">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-10 h-10 rounded-full bg-foundation-forest text-foundation-gold flex items-center justify-center font-bold text-sm">
                            {user.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-xs font-bold text-foundation-charcoal truncate">{user.fullName}</p>
                            <p className="text-[11px] text-stone-500 truncate">{user.email}</p>
                            <span className="inline-block mt-1 px-2 py-0.5 bg-foundation-forest/10 text-foundation-forest text-[10px] font-bold rounded-full uppercase">
                              {user.role} Account
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Link
                          to={user.role === 'admin' ? '/admin/dashboard' : '/member/dashboard'}
                          onClick={() => setIsAccountDropdownOpen(false)}
                          className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl hover:bg-foundation-warmGray text-xs font-bold text-foundation-forest transition-colors"
                        >
                          <ShieldCheck className="w-4 h-4 text-foundation-gold" />
                          <span>Go to Dashboard</span>
                        </Link>
                        <Link
                          to={user.role === 'admin' ? '/admin/dashboard' : '/member/profile'}
                          onClick={() => setIsAccountDropdownOpen(false)}
                          className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl hover:bg-foundation-warmGray text-xs font-medium text-stone-700 transition-colors"
                        >
                          <User className="w-4 h-4 text-stone-500" />
                          <span>Profile & Details</span>
                        </Link>
                      </div>

                      <div className="pt-2 border-t border-stone-100">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Logged Out State - Consolidated Portals (Volunteer, Seva Member, Admin)
                    <div className="space-y-2">
                      <div className="px-2 py-1.5 border-b border-stone-100">
                        <p className="text-xs font-bold text-foundation-forest uppercase tracking-wider flex items-center space-x-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-foundation-gold" />
                          <span>Portals & Community</span>
                        </p>
                        <p className="text-[11px] text-stone-500">
                          Select your required portal to proceed
                        </p>
                      </div>

                      {/* 1. Member / Seva Member Login */}
                      <Link
                        to="/login"
                        onClick={() => setIsAccountDropdownOpen(false)}
                        className="group flex items-start space-x-3 p-2.5 rounded-xl hover:bg-foundation-warmGray transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-foundation-forest/10 flex items-center justify-center text-foundation-forest shrink-0 group-hover:bg-foundation-forest group-hover:text-white transition-colors">
                          <UserCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-foundation-charcoal group-hover:text-foundation-forest transition-colors">
                            Seva Member Login
                          </p>
                          <p className="text-[11px] text-stone-500 leading-tight">
                            Access member dashboard, receipts & seva records
                          </p>
                        </div>
                      </Link>

                      {/* 2. Become a Seva Member */}
                      <Link
                        to="/membership"
                        onClick={() => setIsAccountDropdownOpen(false)}
                        className="group flex items-start space-x-3 p-2.5 rounded-xl hover:bg-foundation-warmGray transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                          <Award className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-foundation-charcoal group-hover:text-amber-700 transition-colors">
                            Become a Seva Member
                          </p>
                          <p className="text-[11px] text-stone-500 leading-tight">
                            Join as Life Member, Patron or Executive Member
                          </p>
                        </div>
                      </Link>

                      {/* 3. Volunteer Seva Application */}
                      <Link
                        to="/volunteer"
                        onClick={() => setIsAccountDropdownOpen(false)}
                        className="group flex items-start space-x-3 p-2.5 rounded-xl hover:bg-foundation-warmGray transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                          <HeartHandshake className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-foundation-charcoal group-hover:text-emerald-700 transition-colors">
                            Volunteer Seva
                          </p>
                          <p className="text-[11px] text-stone-500 leading-tight">
                            Join volunteer activities in elder care & ashram seva
                          </p>
                        </div>
                      </Link>

                      {/* 4. Admin Governance Login */}
                      <div className="pt-1 border-t border-stone-100">
                        <Link
                          to="/admin-login"
                          onClick={() => setIsAccountDropdownOpen(false)}
                          className="group flex items-start space-x-3 p-2.5 rounded-xl hover:bg-foundation-warmGray transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-foundation-forestDark/10 flex items-center justify-center text-foundation-forestDark shrink-0 group-hover:bg-foundation-forestDark group-hover:text-foundation-gold transition-colors">
                            <ShieldCheck className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-foundation-forestDark flex items-center space-x-1">
                              <span>Admin Governance Login</span>
                              <Lock className="w-3 h-3 text-foundation-gold" />
                            </p>
                            <p className="text-[11px] text-stone-500 leading-tight">
                              Trustees & administrative staff portal
                            </p>
                          </div>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* Mobile Right Controls: Admission CTA + Mobile User Icon to its RIGHT + Hamburger */}
          <div className="flex xl:hidden items-center space-x-2">
            <Link
              to="/admission"
              className="whitespace-nowrap px-3 py-1.5 bg-foundation-forest text-foundation-ivory font-bold rounded-full text-xs shadow-sm"
            >
              Admission
            </Link>

            {/* Mobile Account Icon Button - Placed RIGHT to Admission */}
            <div className="relative" ref={mobileAccountDropdownRef}>
              <button
                onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                className={`p-2 rounded-full border transition-all cursor-pointer ${
                  user
                    ? 'bg-foundation-forest text-foundation-gold border-foundation-gold'
                    : isAccountDropdownOpen
                    ? 'bg-foundation-warmGray text-foundation-forest border-foundation-forest'
                    : 'bg-white text-foundation-charcoal border-stone-200'
                }`}
                aria-label="Account Portals"
                title="Account Portals"
              >
                <User className="w-4 h-4" />
              </button>

              {/* Mobile Account Dropdown Popover */}
              {isAccountDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-foundation-borderMuted p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {user ? (
                    <div className="space-y-2">
                      <div className="p-2.5 bg-foundation-warmGray rounded-xl">
                        <p className="text-xs font-bold text-foundation-forest">{user.fullName}</p>
                        <p className="text-[10px] text-stone-500 capitalize">{user.role} Account</p>
                      </div>
                      <Link
                        to={user.role === 'admin' ? '/admin/dashboard' : '/member/dashboard'}
                        onClick={() => setIsAccountDropdownOpen(false)}
                        className="block px-3 py-2 bg-foundation-forest text-white rounded-lg text-xs font-bold text-center"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full px-3 py-2 bg-red-50 text-red-700 rounded-lg text-xs font-bold text-center cursor-pointer"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1.5 text-left">
                      <p className="text-[10px] font-bold text-foundation-forest uppercase tracking-wider px-1">
                        Select Portal
                      </p>
                      <Link
                        to="/login"
                        onClick={() => setIsAccountDropdownOpen(false)}
                        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-foundation-warmGray text-xs font-bold text-foundation-charcoal"
                      >
                        <UserCheck className="w-4 h-4 text-foundation-forest" />
                        <span>Seva Member Login</span>
                      </Link>
                      <Link
                        to="/membership"
                        onClick={() => setIsAccountDropdownOpen(false)}
                        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-foundation-warmGray text-xs font-bold text-foundation-charcoal"
                      >
                        <Award className="w-4 h-4 text-amber-600" />
                        <span>Become a Seva Member</span>
                      </Link>
                      <Link
                        to="/volunteer"
                        onClick={() => setIsAccountDropdownOpen(false)}
                        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-foundation-warmGray text-xs font-bold text-foundation-charcoal"
                      >
                        <HeartHandshake className="w-4 h-4 text-emerald-600" />
                        <span>Volunteer Seva</span>
                      </Link>
                      <Link
                        to="/admin-login"
                        onClick={() => setIsAccountDropdownOpen(false)}
                        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-foundation-warmGray text-xs font-bold text-foundation-forestDark border-t border-stone-100"
                      >
                        <ShieldCheck className="w-4 h-4 text-foundation-gold" />
                        <span>Admin Login</span>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-foundation-charcoal hover:bg-foundation-warmGray"
              aria-label="Toggle Navigation"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation Drawer */}
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
              to="/services/education"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm text-stone-600 py-1 pl-4"
            >
              • Rural Education Support
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

            {/* Mobile Drawer Portals & Account Section */}
            <div className="pt-2 border-t border-stone-200">
              <p className="text-[11px] font-bold text-foundation-forest uppercase tracking-wider mb-2">
                Portals & Accounts
              </p>
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
                    className="p-2 bg-stone-100 hover:bg-stone-200 text-foundation-charcoal rounded-xl text-xs font-bold text-center flex items-center justify-center space-x-1"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-foundation-forest" />
                    <span>Member Login</span>
                  </Link>
                  <Link
                    to="/membership"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 bg-stone-100 hover:bg-stone-200 text-foundation-charcoal rounded-xl text-xs font-bold text-center flex items-center justify-center space-x-1"
                  >
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    <span>Seva Member</span>
                  </Link>
                  <Link
                    to="/volunteer"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 bg-stone-100 hover:bg-stone-200 text-foundation-charcoal rounded-xl text-xs font-bold text-center flex items-center justify-center space-x-1"
                  >
                    <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Volunteer</span>
                  </Link>
                  <Link
                    to="/admin-login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 bg-foundation-forest text-foundation-ivory rounded-xl text-xs font-bold text-center flex items-center justify-center space-x-1"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-foundation-gold" />
                    <span>Admin Portal</span>
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
