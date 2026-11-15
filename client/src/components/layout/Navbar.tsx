import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu, X, ChevronDown, Phone, Heart, User, ShieldCheck,
  Award, LogOut, Mail, ExternalLink, ArrowRight, ChevronRight
} from 'lucide-react';
import { getAuthToken, clearAuthToken, apiRequest } from '../../api';

interface UserState {
  id: string;
  fullName: string;
  role: string;
  email: string;
}

interface NavbarProps {
  onReplayIntro?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState<'none' | 'about' | 'initiatives'>('none');
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
  const [isWhatWeDoDropdownOpen, setIsWhatWeDoDropdownOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [user, setUser] = useState<UserState | null>(null);

  const accountDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        accountDropdownRef.current &&
        !accountDropdownRef.current.contains(event.target as Node)
      ) {
        setIsAccountDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile menu whenever the route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setMobileSubmenu('none');
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open to prevent background scrolling
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Support Escape key to close mobile menu or any open dropdown
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setIsAboutDropdownOpen(false);
        setIsWhatWeDoDropdownOpen(false);
        setIsAccountDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  const announcements = [
    { prefix: 'Statutory Certification', text: 'Regd: MAH/332/15/NAG • F-33193 • Section 12A & 80G Certified Non-Profit' },
    { prefix: '24/7 Helplines', text: '+91 98908 98081 / +91 93261 72824 • Verified Office Email: sbbmsocialfoundation@gmail.com' },
    { prefix: 'Vyenkatesh Ashram', text: 'Loving residential senior care & daily Annadaan meals at Mahuli, Parseoni • Senior Resident Admissions Open' },
    { prefix: 'Aarogyam Kendra', text: 'Free weekend natural therapy & wellness consultations every Saturday & Sunday at Anjikar Bagh' },
    { prefix: 'CSR Collaboration', text: 'Corporate partnerships under Schedule VII of the Companies Act, 2013 • 50% Tax Exemption under Sec 80G' },
    { prefix: 'Shri Go-Seva', text: 'Compassionate lifetime shelter, nutritious green fodder & care for indigenous cows at Anjikar Bagh' },
  ];

  const initiatives = [
    { num: '5.1', title: 'Elderly Care – Vyenkatesh Ashram', desc: 'Residential elder sanctuary & filial care at Mahuli', route: '/old-age-home' },
    { num: '5.2', title: 'Social Welfare & Relief Distribution', desc: 'Doorstep grocery kits & blankets across Nagpur', route: '/services' },
    { num: '5.3', title: 'Education & Computer Literacy', desc: 'Practical digital skilling & student study libraries', route: '/services' },
    { num: '5.4', title: 'Child Welfare & Personality Growth', desc: 'Annual summer camps & child safety awareness', route: '/services' },
    { num: '5.5', title: 'Women’s Empowerment & SHGs', desc: 'Self-help groups, vocational tailoring & micro-enterprise', route: '/services' },
    { num: '5.6', title: 'Healthcare & Public Health Camps', desc: 'Free diagnostic camps, eye checkups & health drives', route: '/services' },
    { num: '5.7', title: 'Shri Go Seva & Sanvardhan Kendra', desc: 'Compassionate shelter & green fodder for cows', route: '/services' },
    { num: '5.8', title: 'Aarogyam Prakritik Chikitsa Kendra', desc: 'Free weekend natural therapy & holistic wellness', route: '/services' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-xs">
      {/* =========================================================================
          1. TOP ANNOUNCEMENT TICKER (Mobile-Optimized & Compact)
         ========================================================================= */}
      <div className="bg-[#0E1726] border-b border-[#1E293B] text-[11px] py-1.5 sm:py-2 px-3 sm:px-6 md:px-8 overflow-hidden select-none text-slate-300">
        <div className="max-w-[1400px] mx-auto flex items-center">
          
          {/* Left Anchor Badge */}
          <div className="shrink-0 flex items-center space-x-1.5 pr-2.5 sm:pr-3.5 border-r border-[#1E293B] z-10 bg-[#0E1726]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse shrink-0" />
            <span className="font-bold text-[#C5A059] text-[10.5px] sm:text-[11.5px] whitespace-nowrap">
              <span className="hidden sm:inline">SBBM Social Foundation</span>
              <span className="sm:hidden">SBBM</span>
            </span>
          </div>

          {/* Smooth Horizontal Ticker Track */}
          <div className="overflow-hidden flex-1 relative flex items-center px-2">
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-4 sm:w-6 bg-gradient-to-r from-[#0E1726] to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-4 sm:w-6 bg-gradient-to-l from-[#0E1726] to-transparent z-10" />
            <div className="animate-ticker text-[10.5px] sm:text-[11.5px] text-slate-300 space-x-6 sm:space-x-8">
              {announcements.map((item, idx) => (
                <span key={`t1-${idx}`} className="inline-flex items-center space-x-1.5 shrink-0">
                  <span>
                    {item.prefix && <strong className="font-semibold text-white">{item.prefix}: </strong>}
                    {item.text}
                  </span>
                  <span className="text-[#C5A059]/60">✦</span>
                </span>
              ))}
              {announcements.map((item, idx) => (
                <span key={`t2-${idx}`} className="inline-flex items-center space-x-1.5 shrink-0">
                  <span>
                    {item.prefix && <strong className="font-semibold text-white">{item.prefix}: </strong>}
                    {item.text}
                  </span>
                  <span className="text-[#C5A059]/60">✦</span>
                </span>
              ))}
            </div>
          </div>

          {/* Right Quick Contact on Desktop */}
          <div className="hidden xl:flex items-center space-x-3 shrink-0 pl-3.5 border-l border-[#1E293B] z-10 bg-[#0E1726] text-[11px]">
            <a
              href="tel:+919890898081"
              className="text-slate-200 font-semibold hover:text-[#C5A059] flex items-center space-x-1 transition-colors"
            >
              <Phone className="w-3 h-3 text-[#C5A059]" />
              <span>+91 98908 98081</span>
            </a>
            <span className="text-slate-600">•</span>
            <Link
              to="/support"
              className="text-[#C5A059] font-semibold hover:underline"
            >
              80G 50% Tax Exemption
            </Link>
          </div>

        </div>
      </div>

      {/* =========================================================================
          2. MAIN STICKY NAVIGATION (Mobile-First Header)
         ========================================================================= */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-[#E8E6E1] px-3 sm:px-6 xl:px-8 py-2.5 sm:py-3.5 transition-all">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Logo & Foundation Identity (Responsive Scaling) */}
          <Link to="/" className="flex items-center space-x-2.5 sm:space-x-3 group shrink-0 min-w-0">
            <img
              src="/assets/images/logo.jpg"
              alt="SBBM Social Foundation Official Seal"
              className="w-9 h-9 xs:w-10 xs:h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full border border-[#E8E6E1] shadow-xs object-cover shrink-0"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] sm:text-[10px] tracking-wider uppercase text-[#9B1B22] font-bold leading-none truncate">
                ESTD 2015 • REGD. F-33193
              </span>
              <span className="text-sm xs:text-base sm:text-lg font-bold tracking-tight text-[#0E1726] leading-tight truncate">
                SBBM Social Foundation
              </span>
              <span className="text-[10px] sm:text-[10.5px] text-[#64748B] leading-none pt-0.5 hidden sm:block truncate">
                Service is Humanity • Education is Development
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-5 xl:space-x-7 text-[13.5px] font-medium text-[#334155]">
            
            {/* 1. Home */}
            <Link
              to="/"
              className={`py-1.5 transition-colors ${
                location.pathname === '/'
                  ? 'text-[#9B1B22] font-semibold'
                  : 'hover:text-[#9B1B22]'
              }`}
            >
              <span>Home</span>
            </Link>

            {/* 2. About Us */}
            <div
              className="relative"
              onMouseEnter={() => setIsAboutDropdownOpen(true)}
              onMouseLeave={() => setIsAboutDropdownOpen(false)}
            >
              <Link
                to="/about"
                className={`inline-flex items-center space-x-1 py-1.5 transition-colors ${
                  isActive('/about')
                    ? 'text-[#9B1B22] font-semibold'
                    : 'hover:text-[#9B1B22]'
                }`}
              >
                <span>About Us</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${isAboutDropdownOpen ? 'rotate-180' : ''}`} />
              </Link>

              {isAboutDropdownOpen && (
                <div className="absolute top-full left-0 w-72 bg-white rounded-xl shadow-card border border-[#E8E6E1] p-2 z-50 animate-in fade-in slide-in-from-top-1">
                  <Link to="/about" className="block px-3.5 py-2 hover:bg-[#F4F3EE] rounded-lg text-xs transition-colors">
                    <strong className="text-[#0E1726] block font-semibold">Institutional Overview</strong>
                    <span className="text-[11px] text-[#64748B]">Inception (Dec 2014), history & charter</span>
                  </Link>
                  <Link to="/about" className="block px-3.5 py-2 hover:bg-[#F4F3EE] rounded-lg text-xs transition-colors">
                    <strong className="text-[#0E1726] block font-semibold">Vision, Mission & 10 Objectives</strong>
                    <span className="text-[11px] text-[#64748B]">Core institutional principles</span>
                  </Link>
                  <Link to="/about" className="block px-3.5 py-2 hover:bg-[#F4F3EE] rounded-lg text-xs transition-colors">
                    <strong className="text-[#0E1726] block font-semibold">Founder's Message</strong>
                    <span className="text-[11px] text-[#64748B]">Mr. Ashwin V. Anjikar & Mrs. Tina Anjikar</span>
                  </Link>
                  <Link to="/about" className="block px-3.5 py-2 hover:bg-[#F4F3EE] rounded-lg text-xs transition-colors">
                    <strong className="text-[#0E1726] block font-semibold">Statutory Registrations</strong>
                    <span className="text-[11px] text-[#64748B]">MAH/332/15/NAG • F-33193 • 12A & 80G</span>
                  </Link>
                </div>
              )}
            </div>

            {/* 3. What We Do */}
            <div
              className="relative"
              onMouseEnter={() => setIsWhatWeDoDropdownOpen(true)}
              onMouseLeave={() => setIsWhatWeDoDropdownOpen(false)}
            >
              <Link
                to="/services"
                className={`inline-flex items-center space-x-1 py-1.5 transition-colors ${
                  isActive('/services') || isActive('/old-age-home')
                    ? 'text-[#9B1B22] font-semibold'
                    : 'hover:text-[#9B1B22]'
                }`}
              >
                <span>What We Do</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${isWhatWeDoDropdownOpen ? 'rotate-180' : ''}`} />
              </Link>

              {isWhatWeDoDropdownOpen && (
                <div className="absolute top-full left-0 w-[420px] bg-white rounded-xl shadow-card border border-[#E8E6E1] p-3 z-50 animate-in fade-in slide-in-from-top-1">
                  <div className="px-3 py-1.5 border-b border-[#E8E6E1] flex items-center justify-between text-[11px] font-semibold text-[#9B1B22] uppercase tracking-wider">
                    <span>The 8 Core Initiatives (2015–2026)</span>
                    <Link to="/services" className="text-[11px] text-[#64748B] hover:text-[#9B1B22] normal-case font-normal">
                      Directory →
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 gap-1 pt-1.5">
                    {initiatives.map((init) => (
                      <Link
                        key={init.num}
                        to={init.route}
                        className="p-2 hover:bg-[#F4F3EE] rounded-lg flex items-start space-x-2.5 transition-colors group"
                      >
                        <span className="px-1.5 py-0.5 bg-[#F4F3EE] group-hover:bg-[#9B1B22] group-hover:text-white text-[#9B1B22] font-mono font-semibold text-[10px] rounded transition-colors mt-0.5">
                          {init.num}
                        </span>
                        <div>
                          <strong className="text-[#0E1726] group-hover:text-[#9B1B22] text-xs block leading-tight font-semibold transition-colors">
                            {init.title}
                          </strong>
                          <span className="text-[11px] text-[#64748B] block leading-tight pt-0.5">
                            {init.desc}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 4. Partnership */}
            <Link
              to="/support#csr"
              className={`py-1.5 transition-colors ${
                location.pathname === '/partnership' || (location.pathname === '/support' && location.hash === '#csr')
                  ? 'text-[#9B1B22] font-semibold'
                  : 'hover:text-[#9B1B22]'
              }`}
            >
              <span>Partnership</span>
            </Link>

            {/* 5. Contact */}
            <Link
              to="/contact"
              className={`py-1.5 transition-colors ${
                isActive('/contact')
                  ? 'text-[#9B1B22] font-semibold'
                  : 'hover:text-[#9B1B22]'
              }`}
            >
              <span>Contact</span>
            </Link>

            {/* 6. Support CTA button */}
            <Link
              to="/support"
              className={`inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold shadow-xs transition-all ${
                isActive('/support') && location.hash !== '#csr'
                  ? 'bg-[#7D131A] text-white ring-2 ring-[#9B1B22]/30'
                  : 'bg-[#9B1B22] hover:bg-[#7D131A] text-white shadow-sm'
              }`}
            >
              <Heart className="w-3.5 h-3.5 fill-white" />
              <span>Support</span>
            </Link>

            {/* 7. Admin Login Icon */}
            <div className="relative shrink-0" ref={accountDropdownRef}>
              {user && user.role === 'admin' ? (
                <button
                  type="button"
                  onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                  className="w-9 h-9 rounded-full bg-[#9B1B22] hover:bg-[#7D131A] text-white font-bold text-xs flex items-center justify-center shadow-xs transition-colors cursor-pointer"
                  title="Administrator - Open Admin Menu"
                  aria-label="Admin Account Menu"
                >
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'A'}
                </button>
              ) : (
                <Link
                  to="/admin-login"
                  className="w-9 h-9 rounded-full border border-[#D8D5CD] hover:border-[#9B1B22] bg-white hover:bg-[#FDF2F2] text-[#0E1726] hover:text-[#9B1B22] flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                  title="Admin Login"
                  aria-label="Admin Login"
                  id="nav-admin-login-icon"
                >
                  <User className="w-4.5 h-4.5" />
                </Link>
              )}

              {user && user.role === 'admin' && isAccountDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-elevated border border-[#E8E6E1] p-3 z-50 animate-in fade-in slide-in-from-top-1">
                  <div className="bg-[#F4F3EE] p-3 rounded-lg border border-[#E8E6E1]">
                    <p className="text-xs font-bold text-[#0E1726] truncate">{user.fullName}</p>
                    <p className="text-[11px] text-[#64748B] truncate">{user.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-[#FDF2F2] border border-[#FCDADA] text-[#9B1B22] text-[10px] font-semibold rounded">
                      Administrator
                    </span>
                  </div>

                  <Link
                    to="/admin/dashboard"
                    onClick={() => setIsAccountDropdownOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 mt-2 rounded-lg hover:bg-[#F4F3EE] text-xs font-semibold text-[#9B1B22] transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Go to Admin Dashboard</span>
                  </Link>

                  <div className="pt-2 mt-1 border-t border-[#E8E6E1]">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#FDF2F2] hover:bg-[#FCDADA] text-[#9B1B22] text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Mobile Header Controls: Exactly Logo (left) | Support Button | Hamburger Menu (right) */}
          <div className="lg:hidden flex items-center space-x-2 shrink-0">
            {/* 1. Support Button */}
            <Link
              to="/support"
              className="px-3 sm:px-3.5 py-2 bg-[#9B1B22] hover:bg-[#7D131A] active:bg-[#7D131A] text-white font-semibold rounded-lg text-xs shadow-xs min-h-[44px] flex items-center space-x-1.5 shrink-0 transition-colors"
              id="mobile-header-support-btn"
            >
              <Heart className="w-3.5 h-3.5 fill-white shrink-0" />
              <span>Support</span>
            </Link>

            {/* 2. Hamburger Menu Button (Positioned immediately beside Support button, replaces old Login icon) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-lg border border-[#D8D5CD] bg-white hover:bg-[#F4F3EE] active:bg-[#E8E6E1] text-[#0E1726] flex items-center justify-center transition-colors shrink-0 cursor-pointer shadow-xs"
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
              id="mobile-hamburger-toggle"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-[#9B1B22]" />
              ) : (
                <Menu className="w-6 h-6 text-[#0E1726]" />
              )}
            </button>
          </div>

        </div>
      </nav>

      {/* =========================================================================
          3. MOBILE NAVIGATION SLIDE-IN DRAWER (Outside Click, Escape Key, Scroll-Lock)
         ========================================================================= */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-[#0E1726]/60 backdrop-blur-xs flex justify-end animate-in fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-modal="true"
          role="dialog"
          aria-label="Mobile Navigation Menu"
        >
          <div
            className="w-full max-w-[340px] sm:max-w-[380px] bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200 border-l border-[#E8E6E1]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header with Title & Close (X) button */}
            <div className="p-4 border-b border-[#E8E6E1] flex items-center justify-between bg-[#FBFBFA] shrink-0">
              <div className="flex items-center space-x-2.5 min-w-0">
                <img
                  src="/assets/images/logo.jpg"
                  alt="SBBM Social Foundation"
                  className="w-8 h-8 rounded-full border border-[#D8D5CD] object-cover shrink-0"
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-[9px] tracking-wider uppercase text-[#9B1B22] font-bold leading-none truncate">
                    ESTD 2015 • REGD. F-33193
                  </span>
                  <span className="text-xs font-bold text-[#0E1726] leading-tight truncate">
                    SBBM Social Foundation
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-lg text-[#0E1726] hover:bg-[#F4F3EE] active:bg-[#E8E6E1] flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5 text-[#9B1B22]" />
              </button>
            </div>

            {/* Scrollable Navigation Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
              {/* Quick Contact & Helpline Bar */}
              <div className="bg-[#F4F3EE] border border-[#E8E6E1] rounded-xl p-3 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-[#9B1B22] shrink-0" />
                  <span className="text-[#334155]">Helpline: <a href="tel:+919890898081" className="font-bold text-[#9B1B22]">+91 98908 98081</a></span>
                </div>
                <span className="text-[10.5px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">24/7</span>
              </div>

              {/* Primary Navigation Item List with 44px+ Minimum Touch Target */}
              <div className="space-y-1">
                {/* 1. Home */}
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl font-semibold text-sm transition-colors min-h-[46px] ${
                    location.pathname === '/' ? 'text-[#9B1B22] bg-[#FDF2F2] border border-[#FCDADA]/60 font-bold' : 'text-[#0E1726] hover:bg-[#F4F3EE]'
                  }`}
                >
                  <span>Home</span>
                  <ChevronRight className="w-4 h-4 text-[#64748B]" />
                </Link>

                {/* 2. About Us (Accordion Submenu) */}
                <div>
                  <button
                    type="button"
                    onClick={() => setMobileSubmenu(mobileSubmenu === 'about' ? 'none' : 'about')}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-semibold text-sm transition-colors min-h-[46px] cursor-pointer ${
                      isActive('/about') ? 'text-[#9B1B22] bg-[#FDF2F2] border border-[#FCDADA]/60 font-bold' : 'text-[#0E1726] hover:bg-[#F4F3EE]'
                    }`}
                  >
                    <span>About Us</span>
                    <ChevronDown className={`w-4 h-4 text-[#64748B] transition-transform ${mobileSubmenu === 'about' ? 'rotate-180 text-[#9B1B22]' : ''}`} />
                  </button>
                  {mobileSubmenu === 'about' && (
                    <div className="ml-3 pl-3 border-l-2 border-[#9B1B22]/30 space-y-1 py-1 animate-in fade-in">
                      <Link
                        to="/about"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-3 py-2 text-xs font-medium text-[#334155] hover:text-[#9B1B22] rounded-lg hover:bg-[#F4F3EE]"
                      >
                        Institutional Overview & Charter
                      </Link>
                      <Link
                        to="/about"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-3 py-2 text-xs font-medium text-[#334155] hover:text-[#9B1B22] rounded-lg hover:bg-[#F4F3EE]"
                      >
                        Vision, Mission & 10 Objectives
                      </Link>
                      <Link
                        to="/about"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-3 py-2 text-xs font-medium text-[#334155] hover:text-[#9B1B22] rounded-lg hover:bg-[#F4F3EE]"
                      >
                        Founder's Message & Governing Board
                      </Link>
                      <Link
                        to="/about"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-3 py-2 text-xs font-medium text-[#334155] hover:text-[#9B1B22] rounded-lg hover:bg-[#F4F3EE]"
                      >
                        Legal Registrations (MAH/332/15/NAG)
                      </Link>
                    </div>
                  )}
                </div>

                {/* 3. What We Do (Accordion Submenu with 8 Initiatives) */}
                <div>
                  <button
                    type="button"
                    onClick={() => setMobileSubmenu(mobileSubmenu === 'initiatives' ? 'none' : 'initiatives')}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-semibold text-sm transition-colors min-h-[46px] cursor-pointer ${
                      isActive('/services') || isActive('/old-age-home') ? 'text-[#9B1B22] bg-[#FDF2F2] border border-[#FCDADA]/60 font-bold' : 'text-[#0E1726] hover:bg-[#F4F3EE]'
                    }`}
                  >
                    <span>What We Do (The 8 Pillars)</span>
                    <ChevronDown className={`w-4 h-4 text-[#64748B] transition-transform ${mobileSubmenu === 'initiatives' ? 'rotate-180 text-[#9B1B22]' : ''}`} />
                  </button>
                  {mobileSubmenu === 'initiatives' && (
                    <div className="ml-3 pl-3 border-l-2 border-[#9B1B22]/30 space-y-1 py-1 max-h-60 overflow-y-auto animate-in fade-in">
                      {initiatives.map((init) => (
                        <Link
                          key={init.num}
                          to={init.route}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center space-x-2 px-3 py-2 text-xs text-[#334155] hover:text-[#9B1B22] rounded-lg hover:bg-[#F4F3EE]"
                        >
                          <span className="font-mono text-[10px] font-bold text-[#9B1B22] bg-[#F4F3EE] px-1.5 py-0.5 rounded">{init.num}</span>
                          <span className="truncate">{init.title}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* 4. Old Age Home Flagship Sanctuary */}
                <Link
                  to="/old-age-home"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl font-semibold text-sm transition-colors min-h-[46px] ${
                    isActive('/old-age-home') ? 'text-[#9B1B22] bg-[#FDF2F2] border border-[#FCDADA]/60 font-bold' : 'text-[#0E1726] hover:bg-[#F4F3EE]'
                  }`}
                >
                  <span>Vyenkatesh Ashram (Old Age Home)</span>
                  <ChevronRight className="w-4 h-4 text-[#64748B]" />
                </Link>

                {/* 5. Senior Admission Enquiry */}
                <Link
                  to="/admission"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl font-semibold text-sm transition-colors min-h-[46px] ${
                    isActive('/admission') ? 'text-[#9B1B22] bg-[#FDF2F2] border border-[#FCDADA]/60 font-bold' : 'text-[#0E1726] hover:bg-[#F4F3EE]'
                  }`}
                >
                  <span>Apply for Admission</span>
                  <ChevronRight className="w-4 h-4 text-[#64748B]" />
                </Link>

                {/* 6. Partnership & CSR */}
                <Link
                  to="/support#csr"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl font-semibold text-sm transition-colors min-h-[46px] ${
                    location.hash === '#csr' ? 'text-[#9B1B22] bg-[#FDF2F2] border border-[#FCDADA]/60 font-bold' : 'text-[#0E1726] hover:bg-[#F4F3EE]'
                  }`}
                >
                  <span>Partnership (CSR & Schedule VII)</span>
                  <ChevronRight className="w-4 h-4 text-[#64748B]" />
                </Link>

                {/* 7. Gallery */}
                <Link
                  to="/gallery"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl font-semibold text-sm transition-colors min-h-[46px] ${
                    isActive('/gallery') ? 'text-[#9B1B22] bg-[#FDF2F2] border border-[#FCDADA]/60 font-bold' : 'text-[#0E1726] hover:bg-[#F4F3EE]'
                  }`}
                >
                  <span>Photo & Video Gallery</span>
                  <ChevronRight className="w-4 h-4 text-[#64748B]" />
                </Link>

                {/* 8. Contact */}
                <Link
                  to="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl font-semibold text-sm transition-colors min-h-[46px] ${
                    isActive('/contact') ? 'text-[#9B1B22] bg-[#FDF2F2] border border-[#FCDADA]/60 font-bold' : 'text-[#0E1726] hover:bg-[#F4F3EE]'
                  }`}
                >
                  <span>Contact Directory & Locations</span>
                  <ChevronRight className="w-4 h-4 text-[#64748B]" />
                </Link>

                {/* 9. Support Our Work */}
                <Link
                  to="/support"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-3 rounded-xl font-bold text-sm bg-[#9B1B22] hover:bg-[#7D131A] text-white shadow-xs min-h-[46px] mt-2 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4 fill-white" />
                    <span>Support Our Work (80G Tax Exemption)</span>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Drawer Footer: Admin Access & Verified Helpline */}
            <div className="p-4 border-t border-[#E8E6E1] bg-[#FBFBFA] space-y-2 shrink-0">
              {user && user.role === 'admin' ? (
                <div className="space-y-2">
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full py-2.5 bg-[#9B1B22] hover:bg-[#7D131A] text-white font-semibold rounded-xl text-xs text-center flex items-center justify-center space-x-2 min-h-[44px] transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Go to Admin Dashboard</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full py-2 bg-[#FDF2F2] hover:bg-[#FCDADA] text-[#9B1B22] font-semibold rounded-xl text-xs text-center flex items-center justify-center space-x-1.5 min-h-[44px] cursor-pointer transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/admin-login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-2.5 bg-white hover:bg-[#F4F3EE] active:bg-[#E8E6E1] text-[#0E1726] font-semibold rounded-xl text-xs text-center flex items-center justify-center space-x-2 border border-[#D8D5CD] min-h-[44px] transition-colors"
                >
                  <User className="w-4 h-4 text-[#9B1B22]" />
                  <span>Administrative Login</span>
                </Link>
              )}

              <p className="text-[10.5px] text-center text-[#64748B] pt-0.5">
                Regd: MAH/332/15/NAG • F-33193 • 12A &amp; 80G
              </p>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};
