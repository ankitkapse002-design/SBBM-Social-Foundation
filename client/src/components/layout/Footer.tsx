import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Phone, MapPin, Heart, Mail,
  Send, Lock, Building2
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
    <footer className="bg-[#181C1E] text-[#94A3B8] border-t-2 border-[#8B1D24] text-xs">
      
      {/* 1. NEWSLETTER & COMMUNITY UPDATES RIBBON */}
      <div className="bg-[#202528] border-b border-[#2C3236] py-8 px-4 md:px-8">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-base md:text-lg font-bold text-white tracking-tight">
              Stay Connected with SBBM Social Foundation
            </h3>
            <p className="text-xs text-[#94A3B8]">
              Verified updates on elderly care, free healthcare camps, digital literacy drives, and community welfare.
            </p>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="flex w-full md:w-auto items-center max-w-md">
            <input
              type="email"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email address..."
              className="bg-[#141719] border border-[#374151] text-xs px-3.5 py-2.5 rounded-l-lg text-white placeholder-[#6B7280] focus:outline-none focus:border-[#8B1D24] w-full md:w-72"
            />
            <button
              type="submit"
              className="bg-[#8B1D24] hover:bg-[#6E1419] text-white px-4 py-2.5 rounded-r-lg text-xs font-semibold transition-colors shrink-0 flex items-center space-x-1"
            >
              <span>{isSubscribed ? 'Subscribed' : 'Subscribe'}</span>
              <Send className="w-3 h-3" />
            </button>
          </form>
        </div>
      </div>

      {/* 2. MAIN 4-COLUMN FOOTER DIRECTORY */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-12 pb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 border-b border-[#2C3236]">
        
        {/* Col 1: Foundation Identity & Official Credentials */}
        <div className="space-y-3.5">
          <div className="flex items-center space-x-3">
            <img
              src="/assets/images/logo.jpg"
              alt="Official SBBM Social Foundation Logo"
              className="w-12 h-12 rounded-full border border-stone-600 object-cover"
            />
            <div>
              <span className="text-[10px] uppercase text-[#C5A059] tracking-wider font-semibold block">
                Estd 2015 • Regd. F-33193
              </span>
              <h4 className="text-sm font-bold text-white leading-tight">
                SBBM Social Foundation
              </h4>
              <p className="text-[10.5px] text-[#94A3B8] italic pt-0.5">
                Service is Humanity • Education is Development
              </p>
            </div>
          </div>

          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Registered charitable society and public trust dedicated to dignified senior residential care, digital literacy for rural youth, women's self-reliance, free natural therapy, and animal welfare across Nagpur District.
          </p>

          <div className="pt-1 text-[11.5px] text-[#94A3B8] space-y-1">
            <p>• <strong>Societies Reg:</strong> MAH/332/15/NAG</p>
            <p>• <strong>Public Trust:</strong> MAH/F-33193/NAG</p>
            <p>• <strong>Tax Certifications:</strong> Section 12A & 80G Certified</p>
            <p>• <strong>NITI Aayog Darpan:</strong> MH/2016/ • <strong>PAN:</strong> AAQTS3445R</p>
          </div>
        </div>

        {/* Col 2: The 8 Core Initiatives */}
        <div className="space-y-3">
          <h4 className="font-semibold text-xs text-white uppercase tracking-wider">
            The 8 Core Initiatives
          </h4>
          <ul className="text-xs space-y-2 text-[#94A3B8]">
            <li>
              <Link to="/services/old-age-home" className="hover:text-white transition-colors flex items-center space-x-1.5">
                <span className="text-[10px] text-[#C5A059] font-mono font-semibold">5.1</span>
                <span>Elderly Care (Vyenkatesh Ashram)</span>
              </Link>
            </li>
            <li>
              <Link to="/services/social-welfare" className="hover:text-white transition-colors flex items-center space-x-1.5">
                <span className="text-[10px] text-[#C5A059] font-mono font-semibold">5.2</span>
                <span>Social Welfare & Relief Distribution</span>
              </Link>
            </li>
            <li>
              <Link to="/services/education-computer-literacy" className="hover:text-white transition-colors flex items-center space-x-1.5">
                <span className="text-[10px] text-[#C5A059] font-mono font-semibold">5.3</span>
                <span>Education & Computer Literacy</span>
              </Link>
            </li>
            <li>
              <Link to="/services/child-welfare" className="hover:text-white transition-colors flex items-center space-x-1.5">
                <span className="text-[10px] text-[#C5A059] font-mono font-semibold">5.4</span>
                <span>Child Welfare & Personality Growth</span>
              </Link>
            </li>
            <li>
              <Link to="/services/women-empowerment" className="hover:text-white transition-colors flex items-center space-x-1.5">
                <span className="text-[10px] text-[#C5A059] font-mono font-semibold">5.5</span>
                <span>Women’s Empowerment & SHGs</span>
              </Link>
            </li>
            <li>
              <Link to="/services/healthcare-public-health" className="hover:text-white transition-colors flex items-center space-x-1.5">
                <span className="text-[10px] text-[#C5A059] font-mono font-semibold">5.6</span>
                <span>Healthcare & Public Health Camps</span>
              </Link>
            </li>
            <li>
              <Link to="/services/cow-protection" className="hover:text-white transition-colors flex items-center space-x-1.5">
                <span className="text-[10px] text-[#C5A059] font-mono font-semibold">5.7</span>
                <span>Shri Go Seva & Sanvardhan Kendra</span>
              </Link>
            </li>
            <li>
              <Link to="/services/natural-therapy" className="hover:text-white transition-colors flex items-center space-x-1.5">
                <span className="text-[10px] text-[#C5A059] font-mono font-semibold">5.8</span>
                <span>Aarogyam Prakritik Chikitsa Kendra</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Community & Governance */}
        <div className="space-y-3">
          <h4 className="font-semibold text-xs text-white uppercase tracking-wider">
            Governance & Participation
          </h4>
          <ul className="text-xs space-y-2 text-[#94A3B8]">
            <li>
              <Link to="/about" className="hover:text-white transition-colors">
                About the Foundation & 10 Objectives
              </Link>
            </li>
            <li>
              <Link to="/support" className="hover:text-white text-[#C5A059] font-semibold transition-colors flex items-center space-x-1.5">
                <Heart className="w-3 h-3 fill-[#C5A059]" />
                <span>CSR & Section 80G Tax Deductions</span>
              </Link>
            </li>
            <li>
              <Link to="/volunteer" className="hover:text-white transition-colors">
                Volunteer Seva Network
              </Link>
            </li>
            <li>
              <Link to="/membership" className="hover:text-white transition-colors">
                Society Membership Application
              </Link>
            </li>
            <li>
              <Link to="/admission" className="hover:text-white transition-colors">
                Elder Care Admission Enquiry
              </Link>
            </li>
            <li>
              <Link to="/admin-login" className="hover:text-white text-stone-400 font-medium transition-colors flex items-center space-x-1.5">
                <Lock className="w-3 h-3 text-[#C5A059]" />
                <span>Administrative Management Login</span>
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-white transition-colors">
                Transparency & Frequently Asked Questions
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Dual Center Addresses & Helplines */}
        <div className="space-y-4">
          <h4 className="font-semibold text-xs text-white uppercase tracking-wider">
            Offices & Centres
          </h4>

          {/* Mahuli Campus */}
          <div className="space-y-1 text-xs">
            <p className="font-semibold text-white flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
              <span>Mahuli Project Centre (Nagpur)</span>
            </p>
            <p className="text-[#94A3B8] leading-relaxed text-[11px] pl-5">
              434, Anjikar Bagh, Mansar Mahuli Road, Mahuli, Parseoni, Nagpur – 441105.
            </p>
          </div>

          {/* Nagpur Head Office */}
          <div className="space-y-1 text-xs">
            <p className="font-semibold text-white flex items-center space-x-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
              <span>Administrative Head Office</span>
            </p>
            <p className="text-[#94A3B8] leading-relaxed text-[11px] pl-5">
              C/o Ashvin V. Anjikar (Anjikar House), Panchpaoli, Timki Chimabai Peth, Nagpur – 440018.
            </p>
          </div>

          {/* Contact Details */}
          <div className="pt-1 space-y-1 text-xs">
            <div className="flex items-center space-x-1.5 text-[#94A3B8]">
              <Phone className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
              <span>Helplines: <a href="tel:+919890898081" className="font-semibold text-white hover:underline">+91 98908 98081</a> / <a href="tel:+919326172824" className="font-semibold text-white hover:underline">+91 93261 72824</a></span>
            </div>
            <div className="flex items-center space-x-1.5 text-[#94A3B8]">
              <Mail className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
              <span><a href="mailto:sbbmsocialfoundation@gmail.com" className="hover:underline">sbbmsocialfoundation@gmail.com</a></span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. STATUTORY NOTICE & LEGAL DISCLAIMER */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-4 text-[11px] text-[#64748B] leading-relaxed border-b border-[#2C3236]">
        <p className="max-w-5xl">
          <strong className="text-stone-300">Institutional Transparency & Admission Notice:</strong> SBBM Social Foundation is a registered charitable society and public trust. Donations to the Foundation are eligible for tax exemption under Section 80G of the Income Tax Act, 1961. Official stamped receipts and Form 10BE certificates are issued for all contributions. For residential admission to Vyenkatesh Ashram, bed availability, health evaluations, and formal criteria must be confirmed directly through the administrative office. Submitting an online enquiry does not constitute guaranteed reservation.
        </p>
      </div>

      {/* 4. COPYRIGHT STRIP */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748B] gap-2">
        <p>© {new Date().getFullYear()} SBBM Social Foundation. All Rights Reserved.</p>
        <div className="flex items-center space-x-4 text-[11px]">
          <Link to="/about/certificates" className="hover:text-stone-300">Statutory Certificates</Link>
          <span>•</span>
          <Link to="/support" className="hover:text-stone-300">80G Tax Policy</Link>
          <span>•</span>
          <Link to="/faq" className="hover:text-stone-300">Transparency FAQs</Link>
          <span>•</span>
          <Link to="/contact" className="hover:text-stone-300">Contact</Link>
        </div>
      </div>
    </footer>
  );
};
