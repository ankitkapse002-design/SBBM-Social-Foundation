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
      <div className="bg-[#F8F9FA] border-b border-[#E5E7EB] text-[11px] py-1.5 sm:py-2 px-3 sm:px-6 md:px-8 overflow-hidden select-none">
        <div className="max-w-[1400px] mx-auto flex items-center">
          
          {/* Left Anchor Badge */}
          <div className="shrink-0 flex items-center space-x-1.5 pr-2.5 sm:pr-3.5 border-r border-stone-200 z-10 bg-[#F8F9FA]">
            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block animate-pulse shrink-0" />
            <span className="font-bold text-[#8B1D24] text-[10.5px] sm:text-[11.5px] whitespace-nowrap">
              <span className="hidden sm:inline">SBBM Social Foundation</span>
              <span className="sm:hidden">SBBM</span>
            </span>
          </div>

          {/* Smooth Horizontal Ticker Track */}
          <div className="overflow-hidden flex-1 relative flex items-center px-2">
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-4 sm:w-6 bg-gradient-to-r from-[#F8F9FA] to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-4 sm:w-6 bg-gradient-to-l from-[#F8F9FA] to-transparent z-10" />
            <div className="animate-ticker text-[10.5px] sm:text-[11.5px] text-[#475569] space-x-6 sm:space-x-8">
              {announcements.map((item, idx) => (
                <span key={`t1-${idx}`} className="inline-flex items-center space-x-1.5 shrink-0">
                  <span>
                    {item.prefix && <strong className="font-semibold text-[#0F172A]">{item.prefix}: </strong>}
                    {item.text}
                  </span>
                  <span className="text-stone-300">✦</span>
                </span>
              ))}
              {announcements.map((item, idx) => (
                <span key={`t2-${idx}`} className="inline-flex items-center space-x-1.5 shrink-0">
                  <span>
                    {item.prefix && <strong className="font-semibold text-[#0F172A]">{item.prefix}: </strong>}
                    {item.text}
                  </span>
                  <span className="text-stone-300">✦</span>
                </span>
              ))}
            </div>
          </div>

          {/* Right Quick Contact on Desktop */}
          <div className="hidden xl:flex items-center space-x-3 shrink-0 pl-3.5 border-l border-stone-200 z-10 bg-[#F8F9FA] text-[11px]">
            <a
              href="tel:+919890898081"
              className="text-[#334155] font-semibold hover:text-[#8B1D24] flex items-center space-x-1 transition-colors"
            >
              <Phone className="w-3 h-3 text-[#8B1D24]" />
              <span>+91 98908 98081</span>
            </a>
            <span className="text-stone-300">•</span>
            <Link
              to="/support"
              className="text-[#8B1D24] font-semibold hover:underline"
            >
              80G 50% Tax Exemption
            </Link>
          </div>

        </div>
      </div>

      {/* =========================================================================
          2. MAIN STICKY NAVIGATION (Mobile-First Header)
         ========================================================================= */}
      <nav className="bg-white/98 backdrop-blur-md border-b border-[#E5E7EB] px-3 sm:px-6 xl:px-8 py-2.5 sm:py-3.5 transition-all">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Logo & Foundation Identity (Responsive Scaling) */}
          <Link to="/" className="flex items-center space-x-2.5 sm:space-x-3 group shrink-0 min-w-0">
            <img
              src="/assets/images/logo.jpg"
              alt="SBBM Social Foundation Official Seal"
              className="w-9 h-9 xs:w-10 xs:h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full border border-stone-200 shadow-xs object-cover shrink-0"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] sm:text-[10px] tracking-wider uppercase text-[#8B1D24] font-bold leading-none truncate">
                ESTD 2015 • REGD. F-33193
              </span>
              <span className="text-sm xs:text-base sm:text-lg font-bold tracking-tight text-[#0F172A] leading-tight truncate">
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
                  ? 'text-[#8B1D24] font-semibold'
                  : 'hover:text-[#8B1D24]'
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
                    ? 'text-[#8B1D24] font-semibold'
                    : 'hover:text-[#8B1D24]'
                }`}
              >
                <span>About Us</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${isAboutDropdownOpen ? 'rotate-180' : ''}`} />
              </Link>

              {isAboutDropdownOpen && (
                <div className="absolute top-full left-0 w-72 bg-white rounded-xl shadow-card border border-[#E5E7EB] p-2 z-50 animate-in fade-in slide-in-from-top-1">
                  <Link to="/about" className="block px-3.5 py-2 hover:bg-stone-50 rounded-lg text-xs transition-colors">
                    <strong className="text-[#0F172A] block font-semibold">Institutional Overview</strong>
                    <span className="text-[11px] text-[#64748B]">Inception (Dec 2014), history & charter</span>
                  </Link>
                  <Link to="/about" className="block px-3.5 py-2 hover:bg-stone-50 rounded-lg text-xs transition-colors">
                    <strong className="text-[#0F172A] block font-semibold">Vision, Mission & 10 Objectives</strong>
                    <span className="text-[11px] text-[#64748B]">Core institutional principles</span>
                  </Link>
                  <Link to="/about" className="block px-3.5 py-2 hover:bg-stone-50 rounded-lg text-xs transition-colors">
                    <strong className="text-[#0F172A] block font-semibold">Founder's Message</strong>
                    <span className="text-[11px] text-[#64748B]">Mr. Ashwin V. Anjikar & Mrs. Tina Anjikar</span>
                  </Link>
                  <Link to="/about" className="block px-3.5 py-2 hover:bg-stone-50 rounded-lg text-xs transition-colors">
                    <strong className="text-[#0F172A] block font-semibold">Statutory Registrations</strong>
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
                    ? 'text-[#8B1D24] font-semibold'
                    : 'hover:text-[#8B1D24]'
                }`}
              >
                <span>What We Do</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${isWhatWeDoDropdownOpen ? 'rotate-180' : ''}`} />
              </Link>

              {isWhatWeDoDropdownOpen && (
                <div className="absolute top-full left-0 w-[420px] bg-white rounded-xl shadow-card border border-[#E5E7EB] p-3 z-50 animate-in fade-in slide-in-from-top-1">
                  <div className="px-3 py-1.5 border-b border-stone-100 flex items-center justify-between text-[11px] font-semibold text-[#8B1D24] uppercase tracking-wider">
                    <span>The 8 Core Initiatives (2015–2026)</span>
                    <Link to="/services" className="text-[11px] text-[#64748B] hover:text-[#8B1D24] normal-case font-normal">
                      Directory →
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 gap-1 pt-1.5">
                    {initiatives.map((init) => (
                      <Link
                        key={init.num}
                        to={init.route}
                        className="p-2 hover:bg-stone-50 rounded-lg flex items-start space-x-2.5 transition-colors group"
                      >
                        <span className="px-1.5 py-0.5 bg-stone-100 group-hover:bg-[#8B1D24] group-hover:text-white text-[#8B1D24] font-mono font-semibold text-[10px] rounded transition-colors mt-0.5">
                          {init.num}
                        </span>
                        <div>
                          <strong className="text-[#0F172A] group-hover:text-[#8B1D24] text-xs block leading-tight font-semibold transition-colors">
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
                  ? 'text-[#8B1D24] font-semibold'
                  : 'hover:text-[#8B1D24]'
              }`}
            >
              <span>Partnership</span>
            </Link>

            {/* 5. Contact */}
            <Link
              to="/contact"
              className={`py-1.5 transition-colors ${
                isActive('/contact')
                  ? 'text-[#8B1D24] font-semibold'
                  : 'hover:text-[#8B1D24]'
              }`}
            >
              <span>Contact</span>
            </Link>

            {/* 6. Support CTA button */}
            <Link
              to="/support"
              className={`inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold shadow-xs transition-all ${
                isActive('/support') && location.hash !== '#csr'
                  ? 'bg-[#6E1419] text-white ring-2 ring-[#8B1D24]/20'
                  : 'bg-[#8B1D24] hover:bg-[#6E1419] text-white'
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
                  className="w-9 h-9 rounded-full bg-[#8B1D24] hover:bg-[#6E1419] text-white font-bold text-xs flex items-center justify-center shadow-xs transition-colors cursor-pointer"
                  title="Administrator - Open Admin Menu"
                  aria-label="Admin Account Menu"
                >
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'A'}
                </button>
              ) : (
                <Link
                  to="/admin-login"
                  className="w-9 h-9 rounded-full border border-stone-300 hover:border-[#8B1D24] bg-stone-50 hover:bg-white text-[#334155] hover:text-[#8B1D24] flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                  title="Admin Login"
                  aria-label="Admin Login"
                  id="nav-admin-login-icon"
                >
                  <User className="w-4.5 h-4.5" />
                </Link>
              )}

              {user && user.role === 'admin' && isAccountDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-elevated border border-[#E5E7EB] p-3 z-50 animate-in fade-in slide-in-from-top-1">
                  <div className="bg-stone-50 p-3 rounded-lg border border-stone-200">
                    <p className="text-xs font-bold text-[#0F172A] truncate">{user.fullName}</p>
                    <p className="text-[11px] text-[#64748B] truncate">{user.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-red-100 text-red-800 text-[10px] font-semibold rounded">
                      Administrator
                    </span>
                  </div>

                  <Link
                    to="/admin/dashboard"
                    onClick={() => setIsAccountDropdownOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 mt-2 rounded-lg hover:bg-stone-50 text-xs font-semibold text-[#8B1D24] transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Go to Admin Dashboard</span>
                  </Link>

                  <div className="pt-2 mt-1 border-t border-stone-100">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Mobile Header Controls (High Touch Target & Clean Proportions) */}
          <div className="lg:hidden flex items-center space-x-1.5 sm:space-x-2">
            <Link
              to="/support"
              className="px-2.5 sm:px-3.5 py-2 bg-[#8B1D24] active:bg-[#6E1419] text-white font-semibold rounded-lg text-xs shadow-xs min-h-[40px] flex items-center space-x-1"
            >
              <Heart className="w-3.5 h-3.5 fill-white shrink-0" />
              <span>Support</span>
            </Link>

            <Link
              to={user && user.role === 'admin' ? "/admin/dashboard" : "/admin-login"}
              className="w-10 h-10 rounded-full border border-stone-300 bg-stone-50 flex items-center justify-center text-[#334155] shrink-0"
              title="Admin Login"
              aria-label="Admin Login"
            >
              {user && user.role === 'admin' ? (
                <span className="w-7 h-7 rounded-full bg-[#8B1D24] text-white text-[11px] font-bold flex items-center justify-center">
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'A'}
                </span>
              ) : (
                <User className="w-4.5 h-4.5" />
              )}
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-10 h-10 rounded-lg text-[#334155] hover:bg-stone-100 flex items-center justify-center transition-colors shrink-0"
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6 text-[#8B1D24]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </nav>

      {/* =========================================================================
          3. MOBILE MENU DRAWER (Mobile-First Polish, Accordion Submenus, Safe-Area)
         ========================================================================= */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[96px] sm:top-[104px] bottom-0 bg-black/40 backdrop-blur-xs z-50 flex flex-col justify-start animate-in fade-in">
          <div className="bg-white border-b border-[#E5E7EB] max-h-[calc(100vh-100px)] overflow-y-auto p-4 sm:p-6 space-y-4 shadow-2xl">
            
            {/* Quick Contact & Helpline Bar */}
            <div className="bg-[#FAF9F6] border border-stone-200 rounded-xl p-3 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#8B1D24] shrink-0" />
                <span className="text-stone-700">Helpline: <a href="tel:+919890898081" className="font-bold text-[#8B1D24]">+91 98908 98081</a></span>
              </div>
              <span className="text-[10.5px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">24/7 Support</span>
            </div>

            {/* Primary Navigation Item List with 48px Minimum Touch Target */}
            <div className="space-y-1">
              
              {/* 1. Home */}
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-3 rounded-xl font-semibold text-sm transition-colors min-h-[46px] ${
                  location.pathname === '/' ? 'text-[#8B1D24] bg-red-50/80 font-bold' : 'text-[#0F172A] hover:bg-stone-50'
                }`}
              >
                <span>Home</span>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </Link>

              {/* 2. About Us (Accordion Submenu) */}
              <div>
                <button
                  type="button"
                  onClick={() => setMobileSubmenu(mobileSubmenu === 'about' ? 'none' : 'about')}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-semibold text-sm transition-colors min-h-[46px] ${
                    isActive('/about') ? 'text-[#8B1D24] bg-red-50/80 font-bold' : 'text-[#0F172A] hover:bg-stone-50'
                  }`}
                >
                  <span>About Us</span>
                  <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform ${mobileSubmenu === 'about' ? 'rotate-180 text-[#8B1D24]' : ''}`} />
                </button>
                {mobileSubmenu === 'about' && (
                  <div className="ml-3 pl-3 border-l-2 border-[#8B1D24]/30 space-y-1 py-1 animate-in fade-in">
                    <Link
                      to="/about"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 text-xs font-medium text-stone-700 hover:text-[#8B1D24] rounded-lg"
                    >
                      Institutional Overview & Charter
                    </Link>
                    <Link
                      to="/about"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 text-xs font-medium text-stone-700 hover:text-[#8B1D24] rounded-lg"
                    >
                      Vision, Mission & 10 Objectives
                    </Link>
                    <Link
                      to="/about"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 text-xs font-medium text-stone-700 hover:text-[#8B1D24] rounded-lg"
                    >
                      Founder's Message & Governing Board
                    </Link>
                    <Link
                      to="/about"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 text-xs font-medium text-stone-700 hover:text-[#8B1D24] rounded-lg"
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
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-semibold text-sm transition-colors min-h-[46px] ${
                    isActive('/services') || isActive('/old-age-home') ? 'text-[#8B1D24] bg-red-50/80 font-bold' : 'text-[#0F172A] hover:bg-stone-50'
                  }`}
                >
                  <span>What We Do (The 8 Pillars)</span>
                  <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform ${mobileSubmenu === 'initiatives' ? 'rotate-180 text-[#8B1D24]' : ''}`} />
                </button>
                {mobileSubmenu === 'initiatives' && (
                  <div className="ml-3 pl-3 border-l-2 border-[#8B1D24]/30 space-y-1 py-1 max-h-60 overflow-y-auto animate-in fade-in">
                    {initiatives.map((init) => (
                      <Link
                        key={init.num}
                        to={init.route}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center space-x-2 px-3 py-2 text-xs text-stone-700 hover:text-[#8B1D24] rounded-lg"
                      >
                        <span className="font-mono text-[10px] font-bold text-[#8B1D24] bg-stone-100 px-1.5 py-0.5 rounded">{init.num}</span>
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
                  isActive('/old-age-home') ? 'text-[#8B1D24] bg-red-50/80 font-bold' : 'text-[#0F172A] hover:bg-stone-50'
                }`}
              >
                <span>Vyenkatesh Ashram (Old Age Home)</span>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </Link>

              {/* 5. Senior Admission Enquiry */}
              <Link
                to="/admission"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-3 rounded-xl font-semibold text-sm transition-colors min-h-[46px] ${
                  isActive('/admission') ? 'text-[#8B1D24] bg-red-50/80 font-bold' : 'text-[#0F172A] hover:bg-stone-50'
                }`}
              >
                <span>Apply for Admission</span>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </Link>

              {/* 6. Partnership & CSR */}
              <Link
                to="/support#csr"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-3 rounded-xl font-semibold text-sm transition-colors min-h-[46px] ${
                  location.hash === '#csr' ? 'text-[#8B1D24] bg-red-50/80 font-bold' : 'text-[#0F172A] hover:bg-stone-50'
                }`}
              >
                <span>Partnership (CSR & Schedule VII)</span>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </Link>

              {/* 7. Gallery */}
              <Link
                to="/gallery"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-3 rounded-xl font-semibold text-sm transition-colors min-h-[46px] ${
                  isActive('/gallery') ? 'text-[#8B1D24] bg-red-50/80 font-bold' : 'text-[#0F172A] hover:bg-stone-50'
                }`}
              >
                <span>Photo & Video Gallery</span>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </Link>

              {/* 8. Contact */}
              <Link
                to="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-3 rounded-xl font-semibold text-sm transition-colors min-h-[46px] ${
                  isActive('/contact') ? 'text-[#8B1D24] bg-red-50/80 font-bold' : 'text-[#0F172A] hover:bg-stone-50'
                }`}
              >
                <span>Contact Directory & Locations</span>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </Link>

              {/* 9. Support Our Work */}
              <Link
                to="/support"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between px-3.5 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-[#8B1D24] to-[#6E1419] text-white shadow-xs min-h-[46px] mt-2"
              >
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 fill-white" />
                  <span>Support Our Work (80G Tax Exemption)</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Admin Management Section */}
            <div className="pt-3 border-t border-[#E5E7EB] space-y-2">
              {user && user.role === 'admin' ? (
                <div className="space-y-2">
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full py-3 bg-[#8B1D24] text-white font-semibold rounded-xl text-xs text-center flex items-center justify-center space-x-2 min-h-[44px]"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Go to Admin Dashboard</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full py-2.5 bg-red-50 text-red-700 font-semibold rounded-xl text-xs text-center flex items-center justify-center space-x-1.5 min-h-[44px] cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/admin-login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-[#0F172A] font-semibold rounded-xl text-xs text-center flex items-center justify-center space-x-2 border border-stone-300 min-h-[44px]"
                >
                  <User className="w-4 h-4 text-[#8B1D24]" />
                  <span>Administrative Login</span>
                </Link>
              )}
            </div>

          </div>
        </div>
      )}
    </header>
  );
};
