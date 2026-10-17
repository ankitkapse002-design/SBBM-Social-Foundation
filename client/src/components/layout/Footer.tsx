import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, Heart, Shield, Clock, ExternalLink, Mail, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-foundation-forestDark text-foundation-ivory border-t-4 border-foundation-gold relative z-10">
      {/* Upper Footer: Two Primary Locations */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12 pb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 border-b border-white/10">
        {/* Col 1: Foundation Profile */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <img
              src="/assets/images/logo.jpg"
              alt="SBBM Social Foundation Society"
              className="w-14 h-14 rounded-full border-2 border-foundation-gold shadow-lg"
            />
            <div>
              <p className="text-xs uppercase text-foundation-gold tracking-widest font-semibold">
                SBBM Social Foundation
              </p>
              <h3 className="text-base font-display font-bold text-foundation-sandstone">
                VYENKATESH ASHRAM
              </h3>
            </div>
          </div>
          <p className="text-xs text-foundation-sageLight leading-relaxed">
            A charitable, non-granted society dedicated to providing elderly citizens with dignified, clean, peaceful and compassionate living surrounded by nature in Mahuli, Nagpur.
          </p>
          <div className="pt-2 text-xs text-stone-300 space-y-1">
            <p>• <strong>Society Reg:</strong> 332-15-Nag (Est. 2015)</p>
            <p>• <strong>Founders:</strong> Mr. Ashwin V. Anjikar & Mrs. Tina Anjikar</p>
          </div>
        </div>

        {/* Col 2: Ashram Project Location */}
        <div className="space-y-3">
          <h4 className="font-display font-bold text-sm text-foundation-gold flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-foundation-gold" />
            <span>Vyenkatesh Ashram (Project)</span>
          </h4>
          <p className="text-xs text-foundation-ivory/80 leading-relaxed">
            434, Anjikar Bagh, Mansar Mahuli Road,<br />
            Village / Post Mahuli, Tehsil Parseoni,<br />
            District Nagpur, Maharashtra – 441105.
          </p>
          <div className="pt-1">
            <a
              href="tel:+919890898081"
              className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-foundation-forest border border-foundation-gold/40 text-xs text-foundation-sandstone hover:text-white"
            >
              <Phone className="w-3.5 h-3.5 text-foundation-gold" />
              <span>+91 98908 98081 (Helpline)</span>
            </a>
          </div>
        </div>

        {/* Col 3: Foundation Head Office */}
        <div className="space-y-3">
          <h4 className="font-display font-bold text-sm text-foundation-gold flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-foundation-gold" />
            <span>Head Office (Nagpur)</span>
          </h4>
          <p className="text-xs text-foundation-ivory/80 leading-relaxed">
            C/o Ashvin V. Anjikar (Anjikar House),<br />
            Panchpaoli, Timki Chimabai Peth,<br />
            Nagpur, Maharashtra – 440018.
          </p>
          <p className="text-[11px] text-foundation-sageLight">
            Official communications, administrative verification and correspondence.
          </p>
        </div>

        {/* Col 4: Quick Links & Actions */}
        <div className="space-y-3">
          <h4 className="font-display font-bold text-sm text-foundation-gold">
            Quick Navigation
          </h4>
          <ul className="text-xs space-y-1.5 text-stone-300">
            <li><Link to="/demo" className="text-foundation-gold hover:underline font-semibold flex items-center gap-1">✨ Owner Demo Presentation (Hindi/English)</Link></li>
            <li><Link to="/old-age-home" className="hover:text-foundation-gold transition-colors">Vyenkatesh Ashram Facilities</Link></li>
            <li><Link to="/admission" className="hover:text-foundation-gold transition-colors font-semibold text-foundation-gold">Admission Enquiry</Link></li>
            <li><Link to="/services/goseva-kendra" className="hover:text-foundation-gold transition-colors">Go-Seva Kendra (Cow Sanctuary)</Link></li>
            <li><Link to="/services/naturopathy" className="hover:text-foundation-gold transition-colors">Naturopathy & Morning Yoga</Link></li>
            <li><Link to="/support" className="hover:text-foundation-gold transition-colors">Support & In-kind Donations</Link></li>
            <li><Link to="/volunteer" className="hover:text-foundation-gold transition-colors">Volunteer Seva Application</Link></li>
            <li><Link to="/faq" className="hover:text-foundation-gold transition-colors">Frequently Asked Questions</Link></li>
            <li><Link to="/admin-login" className="hover:text-foundation-gold transition-colors text-[11px] text-stone-400">Administrator Portal</Link></li>
          </ul>
        </div>
      </div>

      {/* Legal Disclaimer & Transparency Statement */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-5 text-[11px] text-stone-400 leading-relaxed border-b border-white/5">
        <p className="max-w-5xl">
          <strong className="text-stone-300">Notice & Admission Verification:</strong> SBBM Social Foundation Society operates Vyenkatesh Ashram as a charitable, non-granted old-age home. Accommodation availability, residential suitability, medical compatibility and admission procedures must be confirmed directly with the management (+91 98908 98081). Submitting an online enquiry does not constitute confirmation or reservation of admission. Official receipts are issued for all contributions.
        </p>
      </div>

      {/* Bottom Copyright */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400">
        <p>© {new Date().getFullYear()} SBBM Social Foundation Society. All rights reserved.</p>
        <p className="mt-2 sm:mt-0 flex items-center space-x-3">
          <span>Care • Dignity • Peace</span>
          <span>•</span>
          <Link to="/about/certificates" className="hover:underline">Legal Documents</Link>
          <span>•</span>
          <Link to="/contact" className="hover:underline">Contact Directory</Link>
        </p>
      </div>
    </footer>
  );
};
