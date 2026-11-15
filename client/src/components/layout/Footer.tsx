import React from 'react';
import { Link } from 'react-router-dom';
import {
  Phone, MapPin, Heart, Mail,
  User, Building2
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0A111A] text-slate-300 border-t-2 border-[#9B1B22] text-sm font-sans">
      {/* MAIN ESSENTIAL 3-COLUMN FOOTER */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 border-b border-[#1E293B]">
        
        {/* Col 1: Organisation Identity (5 Cols on LG) */}
        <div className="lg:col-span-5 space-y-4">
          <Link to="/" className="inline-flex items-center space-x-3.5 group">
            <img
              src="/assets/images/logo.png"
              alt="Official SBBM Social Foundation Logo"
              className="w-12 h-12 sm:w-14 sm:h-14 object-contain shrink-0 drop-shadow-sm transition-transform group-hover:scale-105"
            />
            <div>
              <span className="text-[11px] uppercase text-[#C5A059] tracking-wider font-bold block">
                Estd 2015 • Regd. F-33193
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                SBBM Social Foundation
              </h3>
              <p className="text-xs text-slate-400 italic pt-0.5">
                Service is Humanity • Education is Development
              </p>
            </div>
          </Link>

          <p className="text-sm text-slate-300 leading-relaxed max-w-md">
            A registered charitable society and public trust dedicated to senior residential care at Vyenkatesh Ashram, free healthcare camps, digital literacy, and community welfare across Nagpur.
          </p>

          <div className="pt-1 flex flex-wrap gap-2 text-xs text-slate-300">
            <span className="px-2.5 py-1 bg-[#1E293B] rounded-md border border-slate-700 font-mono">
              Reg: MAH/332/15/NAG
            </span>
            <span className="px-2.5 py-1 bg-[#1E293B] rounded-md border border-slate-700 font-mono">
              Trust: F-33193
            </span>
            <span className="px-2.5 py-1 bg-[#1E293B] rounded-md border border-slate-700 text-[#C5A059] font-semibold">
              12A &amp; 80G Certified
            </span>
          </div>
        </div>

        {/* Col 2: Important Navigation Links (3 Cols on LG) */}
        <div className="lg:col-span-3 space-y-3">
          <h4 className="font-bold text-sm sm:text-[15px] text-white uppercase tracking-wider border-b border-[#1E293B] pb-2">
            Important Links
          </h4>
          <ul className="text-sm space-y-2 text-slate-300">
            <li>
              <Link to="/about" className="hover:text-white transition-colors block py-0.5">
                About the Foundation
              </Link>
            </li>
            <li>
              <Link to="/services/old-age-home" className="hover:text-white transition-colors block py-0.5">
                Vyenkatesh Ashram (Old Age Home)
              </Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-white transition-colors block py-0.5">
                Core Social Initiatives
              </Link>
            </li>
            <li>
              <Link to="/support" className="hover:text-white text-[#C5A059] font-semibold transition-colors flex items-center space-x-1.5 py-0.5">
                <Heart className="w-3.5 h-3.5 fill-[#C5A059] shrink-0" />
                <span>Support &amp; 80G Tax Exemption</span>
              </Link>
            </li>
            <li>
              <Link to="/admission" className="hover:text-white transition-colors block py-0.5">
                Elder Care Admission Enquiry
              </Link>
            </li>
            <li>
              <Link to="/volunteer" className="hover:text-white transition-colors block py-0.5">
                Volunteer Seva Network
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white transition-colors block py-0.5">
                Contact &amp; Location
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Essential Contact Information (4 Cols on LG) */}
        <div className="lg:col-span-4 space-y-4">
          <h4 className="font-bold text-sm sm:text-[15px] text-white uppercase tracking-wider border-b border-[#1E293B] pb-2">
            Contact &amp; Centres
          </h4>

          {/* 24/7 Helplines */}
          <div className="space-y-1 text-sm">
            <div className="flex items-center space-x-2 text-white font-semibold">
              <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
              <span>Helplines:</span>
            </div>
            <div className="pl-6 flex flex-wrap gap-x-2 gap-y-1 text-sm font-semibold">
              <a href="tel:+919890898081" className="text-white hover:underline">+91 98908 98081</a>
              <span className="text-slate-500">•</span>
              <a href="tel:+919326172824" className="text-white hover:underline">+91 93261 72824</a>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center space-x-2 text-sm text-slate-300">
            <Mail className="w-4 h-4 text-[#C5A059] shrink-0" />
            <a href="mailto:sbbmsocialfoundation@gmail.com" className="hover:underline text-xs sm:text-sm text-slate-200">
              sbbmsocialfoundation@gmail.com
            </a>
          </div>

          {/* Project Campus */}
          <div className="space-y-1 text-xs sm:text-[13px] text-slate-300">
            <p className="font-semibold text-white flex items-center space-x-2">
              <MapPin className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
              <span>Mahuli Project Centre:</span>
            </p>
            <p className="pl-5 leading-relaxed text-slate-400">
              434, Anjikar Bagh, Mansar Mahuli Road, Mahuli, Parseoni, Nagpur – 441105.
            </p>
          </div>

          {/* Head Office */}
          <div className="space-y-1 text-xs sm:text-[13px] text-slate-300">
            <p className="font-semibold text-white flex items-center space-x-2">
              <Building2 className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
              <span>Administrative Head Office:</span>
            </p>
            <p className="pl-5 leading-relaxed text-slate-400">
              Anjikar House, Panchpaoli, Timki Chimabai Peth, Nagpur – 440018.
            </p>
          </div>
        </div>

      </div>

      {/* COPYRIGHT & COMPACT UTILITY BAR */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-[13px] text-slate-400 gap-3 text-center sm:text-left">
        <p>© {new Date().getFullYear()} SBBM Social Foundation. All Rights Reserved.</p>
        <div className="flex flex-wrap items-center justify-center gap-x-3.5 gap-y-1">
          <Link to="/support" className="hover:text-white">80G Tax Policy</Link>
          <span className="text-slate-600">•</span>
          <Link to="/faq" className="hover:text-white">Transparency FAQs</Link>
          <span className="text-slate-600">•</span>
          <Link to="/contact" className="hover:text-white">Contact</Link>
          <span className="text-slate-600">•</span>
          <Link
            to="/admin-login"
            className="hover:text-white text-slate-400 font-medium inline-flex items-center space-x-1"
            title="Administrator Login"
            aria-label="Administrator Login"
          >
            <User className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Admin</span>
          </Link>
        </div>
      </div>
    </footer>
  );
};
