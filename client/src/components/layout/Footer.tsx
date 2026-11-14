import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Phone, MapPin, Heart, Mail,
  Send, Lock, Building2, CheckCircle2
} from 'lucide-react';

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setIsSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setIsSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-[#0A111A] text-slate-400 border-t-2 border-[#9B1B22] text-xs">
      
      {/* 1. NEWSLETTER & COMMUNITY UPDATES RIBBON (Mobile-First Stacking) */}
      <div className="bg-[#0E1726] border-b border-[#1E293B] py-6 sm:py-8 px-4 sm:px-6 md:px-8">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6">
          <div className="space-y-1 text-center md:text-left w-full md:w-auto">
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Stay Connected with SBBM Social Foundation
            </h3>
            <p className="text-xs text-slate-400 max-w-xl">
              Verified updates on elderly care, free healthcare camps, digital literacy drives, and community welfare.
            </p>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row w-full md:w-auto items-stretch sm:items-center gap-2 sm:gap-0 max-w-md">
            <input
              type="email"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email address..."
              className="bg-[#0A111A] border border-[#1E293B] text-xs px-4 py-3 sm:py-2.5 rounded-xl sm:rounded-r-none sm:rounded-l-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#9B1B22] w-full sm:w-72 min-h-[44px]"
            />
            <button
              type="submit"
              className="bg-[#9B1B22] hover:bg-[#7D131A] active:bg-[#7D131A] text-white px-5 py-3 sm:py-2.5 rounded-xl sm:rounded-l-none sm:rounded-r-lg text-xs font-semibold transition-colors shrink-0 flex items-center justify-center space-x-1.5 min-h-[44px] cursor-pointer shadow-sm"
            >
              <span>{isSubscribed ? 'Subscribed!' : 'Subscribe'}</span>
              {isSubscribed ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Send className="w-3.5 h-3.5" />}
            </button>
          </form>
        </div>
      </div>

      {/* 2. MAIN 4-COLUMN FOOTER DIRECTORY (Responsive Grid) */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 pt-10 sm:pt-12 pb-8 sm:pb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 border-b border-[#1E293B]">
        
        {/* Col 1: Foundation Identity & Official Credentials */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <img
              src="/assets/images/logo.jpg"
              alt="Official SBBM Social Foundation Logo"
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-slate-700 object-cover shrink-0"
            />
            <div>
              <span className="text-[10px] uppercase text-[#C5A059] tracking-wider font-semibold block">
                Estd 2015 • Regd. F-33193
              </span>
              <h4 className="text-sm font-bold text-white leading-tight">
                SBBM Social Foundation
              </h4>
              <p className="text-[10.5px] text-slate-400 italic pt-0.5">
                Service is Humanity • Education is Development
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Registered charitable society and public trust dedicated to dignified senior residential care, digital literacy for rural youth, women's self-reliance, free natural therapy, and animal welfare across Nagpur District.
          </p>

          <div className="pt-1 text-[11px] text-slate-400 space-y-1">
            <p>• <strong>Societies Reg:</strong> MAH/332/15/NAG</p>
            <p>• <strong>Public Trust:</strong> MAH/F-33193/NAG</p>
            <p>• <strong>Tax Status:</strong> Section 12A & 80G Certified Non-Profit</p>
            <p>• <strong>PAN:</strong> AAQTS3445R • <strong>NITI Aayog:</strong> MH/2016/</p>
          </div>
        </div>

        {/* Col 2: The 8 Core Initiatives */}
        <div className="space-y-3">
          <h4 className="font-semibold text-xs text-white uppercase tracking-wider border-b border-[#1E293B] pb-2">
            The 8 Core Initiatives
          </h4>
          <ul className="text-xs space-y-2 text-slate-400">
            <li>
              <Link to="/services/old-age-home" className="hover:text-white transition-colors flex items-center space-x-1.5 py-0.5">
                <span className="text-[10px] text-[#C5A059] font-mono font-semibold shrink-0">5.1</span>
                <span>Elderly Care (Vyenkatesh Ashram)</span>
              </Link>
            </li>
            <li>
              <Link to="/services/social-welfare" className="hover:text-white transition-colors flex items-center space-x-1.5 py-0.5">
                <span className="text-[10px] text-[#C5A059] font-mono font-semibold shrink-0">5.2</span>
                <span>Social Welfare & Relief Distribution</span>
              </Link>
            </li>
            <li>
              <Link to="/services/education-computer-literacy" className="hover:text-white transition-colors flex items-center space-x-1.5 py-0.5">
                <span className="text-[10px] text-[#C5A059] font-mono font-semibold shrink-0">5.3</span>
                <span>Education & Computer Literacy</span>
              </Link>
            </li>
            <li>
              <Link to="/services/child-welfare" className="hover:text-white transition-colors flex items-center space-x-1.5 py-0.5">
                <span className="text-[10px] text-[#C5A059] font-mono font-semibold shrink-0">5.4</span>
                <span>Child Welfare & Personality Growth</span>
              </Link>
            </li>
            <li>
              <Link to="/services/women-empowerment" className="hover:text-white transition-colors flex items-center space-x-1.5 py-0.5">
                <span className="text-[10px] text-[#C5A059] font-mono font-semibold shrink-0">5.5</span>
                <span>Women’s Empowerment & SHGs</span>
              </Link>
            </li>
            <li>
              <Link to="/services/healthcare-public-health" className="hover:text-white transition-colors flex items-center space-x-1.5 py-0.5">
                <span className="text-[10px] text-[#C5A059] font-mono font-semibold shrink-0">5.6</span>
                <span>Healthcare & Public Health Camps</span>
              </Link>
            </li>
            <li>
              <Link to="/services/cow-protection" className="hover:text-white transition-colors flex items-center space-x-1.5 py-0.5">
                <span className="text-[10px] text-[#C5A059] font-mono font-semibold shrink-0">5.7</span>
                <span>Shri Go Seva & Sanvardhan Kendra</span>
              </Link>
            </li>
            <li>
              <Link to="/services/natural-therapy" className="hover:text-white transition-colors flex items-center space-x-1.5 py-0.5">
                <span className="text-[10px] text-[#C5A059] font-mono font-semibold shrink-0">5.8</span>
                <span>Aarogyam Prakritik Chikitsa Kendra</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Community & Governance */}
        <div className="space-y-3">
          <h4 className="font-semibold text-xs text-white uppercase tracking-wider border-b border-[#1E293B] pb-2">
            Governance & Participation
          </h4>
          <ul className="text-xs space-y-2 text-slate-400">
            <li>
              <Link to="/about" className="hover:text-white transition-colors block py-0.5">
                About the Foundation & 10 Objectives
              </Link>
            </li>
            <li>
              <Link to="/support" className="hover:text-white text-[#C5A059] font-semibold transition-colors flex items-center space-x-1.5 py-0.5">
                <Heart className="w-3.5 h-3.5 fill-[#C5A059] shrink-0" />
                <span>CSR & Section 80G Tax Deductions</span>
              </Link>
            </li>
            <li>
              <Link to="/volunteer" className="hover:text-white transition-colors block py-0.5">
                Volunteer Seva Network
              </Link>
            </li>
            <li>
              <Link to="/membership" className="hover:text-white transition-colors block py-0.5">
                Society Membership Application
              </Link>
            </li>
            <li>
              <Link to="/admission" className="hover:text-white transition-colors block py-0.5">
                Elder Care Admission Enquiry
              </Link>
            </li>
            <li>
              <Link to="/gallery" className="hover:text-white transition-colors block py-0.5">
                Visual Archives & Documented Photos
              </Link>
            </li>
            <li>
              <Link to="/admin-login" className="hover:text-white text-slate-400 font-medium transition-colors flex items-center space-x-1.5 py-0.5">
                <Lock className="w-3 h-3 text-[#C5A059] shrink-0" />
                <span>Administrative Management Login</span>
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-white transition-colors block py-0.5">
                Transparency & Frequently Asked Questions
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Dual Center Addresses & Helplines */}
        <div className="space-y-4">
          <h4 className="font-semibold text-xs text-white uppercase tracking-wider border-b border-[#1E293B] pb-2">
            Offices & Centres
          </h4>

          {/* Mahuli Campus */}
          <div className="space-y-1 text-xs">
            <p className="font-semibold text-white flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
              <span>Mahuli Project Centre (Nagpur)</span>
            </p>
            <p className="text-slate-400 leading-relaxed text-[11px] pl-5">
              434, Anjikar Bagh, Mansar Mahuli Road, Mahuli, Parseoni, Nagpur – 441105.
            </p>
          </div>

          {/* Nagpur Head Office */}
          <div className="space-y-1 text-xs">
            <p className="font-semibold text-white flex items-center space-x-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
              <span>Administrative Head Office</span>
            </p>
            <p className="text-slate-400 leading-relaxed text-[11px] pl-5">
              Anjikar House, Panchpaoli, Timki Chimabai Peth, Nagpur – 440018.
            </p>
          </div>

          {/* Contact Details */}
          <div className="pt-2 space-y-2 text-xs border-t border-[#1E293B]">
            <div className="flex flex-col space-y-1 text-slate-400">
              <div className="flex items-center space-x-1.5">
                <Phone className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                <span className="font-semibold text-white">24/7 Helplines:</span>
              </div>
              <div className="pl-5 flex flex-wrap gap-x-2 gap-y-1 text-[11.5px]">
                <a href="tel:+919890898081" className="font-bold text-white hover:underline">+91 98908 98081</a>
                <span className="text-slate-600">•</span>
                <a href="tel:+919326172824" className="font-bold text-white hover:underline">+91 93261 72824</a>
              </div>
            </div>
            <div className="flex items-center space-x-1.5 text-slate-400 pt-1">
              <Mail className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
              <a href="mailto:sbbmsocialfoundation@gmail.com" className="hover:underline text-[11px] truncate text-slate-300">
                sbbmsocialfoundation@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 3. STATUTORY NOTICE & LEGAL DISCLAIMER */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 py-4 text-[11px] text-slate-400 leading-relaxed border-b border-[#1E293B]">
        <p className="max-w-5xl">
          <strong className="text-slate-200">Institutional Transparency & Admission Notice:</strong> SBBM Social Foundation is a registered charitable society and public trust. Donations to the Foundation are eligible for tax exemption under Section 80G of the Income Tax Act, 1961. Official stamped receipts and Form 10BE certificates are issued for all contributions. For residential admission to Vyenkatesh Ashram, bed availability, health evaluations, and formal criteria must be confirmed directly through the administrative office. Submitting an online enquiry does not constitute guaranteed reservation.
        </p>
      </div>

      {/* 4. COPYRIGHT STRIP (Responsive Wrap) */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3 text-center sm:text-left">
        <p>© {new Date().getFullYear()} SBBM Social Foundation. All Rights Reserved.</p>
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px]">
          <Link to="/about" className="hover:text-white">Statutory Charter</Link>
          <span className="text-slate-700">•</span>
          <Link to="/support" className="hover:text-white">80G Tax Policy</Link>
          <span className="text-slate-700">•</span>
          <Link to="/faq" className="hover:text-white">Transparency FAQs</Link>
          <span className="text-slate-700">•</span>
          <Link to="/contact" className="hover:text-white">Contact</Link>
        </div>
      </div>
    </footer>
  );
};
