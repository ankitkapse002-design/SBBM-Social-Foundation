import React, { useState } from 'react';
import {
  MapPin, Phone, Mail, Clock,
  CheckCircle2, Building2, ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { apiRequest } from '../api';
import { SEO } from '../components/common/SEO';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'general',
    message: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name || !formData.phone || !formData.message) {
      setErrorMessage('Name, phone number, and message are required.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await apiRequest<{ success: boolean; message: string }>('/enquiries/contact', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      if (res.success) {
        setSuccessMessage(res.message);
        confetti({ particleCount: 60, spread: 50 });
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit contact message.');
    } finally {
      setIsLoading(false);
    }
  };

  const contactJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    'name': 'Contact Directory & Locations | SBBM Social Foundation',
    'url': 'https://sbbmsocialfoundation.org/contact',
    'mainEntity': {
      '@type': 'NGO',
      'name': 'SBBM Social Foundation',
      'telephone': '+91-98908-98081',
      'email': 'sbbmsocialfoundation@gmail.com',
      'address': [
        {
          '@type': 'PostalAddress',
          'name': 'Administrative Head Office',
          'streetAddress': 'Anjikar House, Panchpaoli, Timki Chimabai Peth',
          'addressLocality': 'Nagpur',
          'addressRegion': 'Maharashtra',
          'postalCode': '440018',
          'addressCountry': 'IN',
        },
        {
          '@type': 'PostalAddress',
          'name': 'Vyenkatesh Ashram (Old Age Home Field Campus)',
          'streetAddress': '434, Anjikar Bagh, Mansar Mahuli Road, Village Mahuli',
          'addressLocality': 'Parseoni',
          'addressRegion': 'Maharashtra',
          'postalCode': '441105',
          'addressCountry': 'IN',
        },
      ],
    },
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] py-10 sm:py-14 md:py-16 font-sans">
      <SEO
        title="Contact Directory & Verified Locations | Nagpur & Mahuli"
        description="Official contact directory for SBBM Social Foundation & Vyenkatesh Ashram. 24/7 Helplines: +91 98908 98081 / +91 93261 72824. Nagpur Head Office and Mahuli Campus addresses."
        canonicalPath="/contact"
        jsonLd={contactJsonLd}
      />
      <div className="max-w-6xl mx-auto px-4 md:px-8 space-y-8 sm:space-y-12">
        {/* Full-Width Visual Photographic Header Banner */}
        <div className="relative rounded-3xl overflow-hidden border border-[#1E293B] shadow-card bg-[#0A111A] text-white p-6 sm:p-10 md:p-16 text-center">
          <div className="absolute inset-0 z-0">
            <img
              src="/assets/images/ashram/ashram_entrance_front.jpg"
              alt="Vyenkatesh Ashram Front Entrance Mahuli"
              className="w-full h-full object-cover object-center scale-105"
            />
            {/* Calibrated dark overlay: entrance gate clearly visible */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A111A]/90 via-[#0A111A]/75 to-[#0A111A]/92" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto space-y-3 sm:space-y-5">
            <div className="inline-flex flex-wrap items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0E1726]/80 backdrop-blur-md text-[#C5A059] text-xs sm:text-sm font-bold border border-[#C5A059]/30">
              <MapPin className="w-4 h-4 text-[#C5A059] shrink-0" />
              <span>Official Contact Directory &amp; Community Support</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white tracking-tight drop-shadow-sm leading-tight">
              Contact SBBM Social Foundation
            </h1>

            <p className="text-sm sm:text-base md:text-[17px] text-slate-200 max-w-2xl mx-auto leading-relaxed">
              Reach out to our administrative head office in Nagpur City for legal, CSR, and membership governance, or coordinate directly with our Mahuli Centre for senior care, Go-Seva, and naturopathy appointments.
            </p>

            <p className="text-sm font-bold text-[#C5A059] break-all">
              Official Email: <a href="mailto:sbbmsocialfoundation@gmail.com" className="underline hover:text-white">sbbmsocialfoundation@gmail.com</a>
            </p>
          </div>
        </div>

        {/* Two Distinct Location Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Location 1: Foundation Head Office (Nagpur City) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border-2 border-foundation-crimson/30 shadow-soft space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-foundation-crimson/10 text-foundation-crimson text-xs font-bold">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Administrative Head Office (Nagpur)</span>
                </div>
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                  Governance &amp; Administration
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-display font-bold text-foundation-charcoal">
                SBBM SOCIAL FOUNDATION
              </h2>

              <div className="space-y-2.5 text-sm sm:text-[15px] text-stone-700 leading-relaxed">
                <p className="font-semibold text-foundation-crimson">Registered Society Address:</p>
                <p className="bg-foundation-warmGray p-3.5 rounded-xl border border-foundation-borderMuted">
                  C/o Ashvin V. Anjikar (Anjikar House),<br />
                  Panchpaoli, Timki Chimabai Peth,<br />
                  Nagpur, Maharashtra – 440018.
                </p>
                <div className="text-xs sm:text-[13px] text-stone-500 space-y-1 pt-1">
                  <p>• Societies Reg No: <strong>MAH/332/15/NAG</strong> (Estd. 2015)</p>
                  <p>• Trust Reg No: <strong>MAH/F-33193/NAG</strong></p>
                  <p>• NITI Aayog NGO Darpan ID: <strong>MH/2016/</strong></p>
                  <p>• Permanent Account Number: <strong>PAN: AAQTS3445R</strong></p>
                  <p>• Certifications: <strong>Section 12A &amp; 80G Certified</strong></p>
                </div>
              </div>

              <div className="p-4 bg-foundation-warmGray rounded-2xl border border-foundation-borderMuted space-y-2.5 text-sm">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-foundation-crimson flex-shrink-0" />
                  <span>
                    Helplines: <a href="tel:+919890898081" className="font-bold underline text-foundation-crimson">+91 98908 98081</a> / <a href="tel:+919326172824" className="font-bold underline text-foundation-crimson">+91 93261 72824</a>
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-stone-500 text-xs sm:text-sm">
                  <Mail className="w-4 h-4 text-stone-400 flex-shrink-0" />
                  <span>Official Correspondence: <strong>sbbmsocialfoundation@gmail.com</strong></span>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-3 border-t border-foundation-borderMuted">
              <a
                href="https://maps.google.com/?q=Panchpaoli+Nagpur+Maharashtra"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-sm font-bold text-foundation-crimson hover:underline"
              >
                <span>View Head Office Location on Map</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Location 2: Mahuli Project Centre (Parseoni) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border-2 border-foundation-forest/40 shadow-soft space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold">
                  <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Mahuli Project Centre (Parseoni)</span>
                </div>
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                  Field Operations
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-display font-bold text-foundation-charcoal">
                SBBM SOCIAL FOUNDATION CENTRE
              </h2>

              <div className="space-y-2.5 text-sm sm:text-[15px] text-stone-700 leading-relaxed">
                <p className="font-semibold text-foundation-forest">Campus &amp; Field Project Address:</p>
                <p className="bg-foundation-warmGray p-3.5 rounded-xl border border-foundation-borderMuted">
                  434, Anjikar Bagh, Mansar Mahuli Road,<br />
                  Village / Post Mahuli, Tehsil Parseoni,<br />
                  District Nagpur, Maharashtra – 441105.
                </p>
                <div className="text-xs sm:text-[13px] text-stone-500 space-y-1 pt-1">
                  <p>• <strong>Vyenkatesh Ashram</strong> – Residential Old Age Home ("Apno Se Door... Ek Apna Ghar...")</p>
                  <p>• <strong>Shri Go Seva Kendra</strong> – Indigenous Cow Protection &amp; Sanvardhan</p>
                  <p>• <strong>Aarogyam Prakritik Chikitsa Kendra</strong> – Naturopathy Care (Inaugurated 6 Dec 2018)</p>
                  <p>• Rural orchards, green lawns &amp; community gathering veranda</p>
                </div>
              </div>

              <div className="p-4 bg-foundation-warmGray rounded-2xl border border-foundation-borderMuted space-y-2.5 text-sm">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-foundation-forest flex-shrink-0" />
                  <span>
                    Coordinator: <a href="tel:+919890898081" className="font-bold underline text-foundation-forest">+91 98908 98081</a> / <a href="tel:+919326172824" className="font-bold underline text-foundation-forest">+91 93261 72824</a>
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-stone-500 text-xs sm:text-sm">
                  <Clock className="w-4 h-4 text-stone-400 flex-shrink-0" />
                  <span>Visits requested with prior telephonic appointment.</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-3 border-t border-foundation-borderMuted">
              <a
                href="https://maps.google.com/?q=Mahuli+Parseoni+Nagpur+Maharashtra"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-sm font-bold text-foundation-forest hover:underline"
              >
                <span>Open Driving Directions in Google Maps</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Contact Inquiry Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-12 border border-foundation-borderMuted shadow-soft space-y-6 sm:space-y-8">
          <div className="border-b border-foundation-borderMuted pb-5 space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foundation-charcoal">
              Send an Official Message or Inquiry
            </h2>
            <p className="text-sm sm:text-base text-stone-500">
              For general enquiries, CSR collaborations, admission guidance, or campus visits.
            </p>
          </div>

          {successMessage ? (
            <div className="p-6 sm:p-8 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-emerald-900 text-lg sm:text-xl">Message Successfully Received!</h3>
              <p className="text-sm sm:text-base text-emerald-800 max-w-md mx-auto">{successMessage}</p>
              <div className="pt-2 text-sm text-stone-600">
                Our foundation coordinator will follow up promptly via phone or email.
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              {errorMessage && (
                <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm sm:text-[15px] font-bold text-stone-800 mb-2">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Anand Shinde"
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-3 min-h-[48px] text-[16px] text-foundation-charcoal focus:ring-2 focus:ring-foundation-crimson focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm sm:text-[15px] font-bold text-stone-800 mb-2">
                    Mobile Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +91 98220 XXXXX"
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-3 min-h-[48px] text-[16px] text-foundation-charcoal focus:ring-2 focus:ring-foundation-crimson focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm sm:text-[15px] font-bold text-stone-800 mb-2">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. anand@example.com"
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-3 min-h-[48px] text-[16px] text-foundation-charcoal focus:ring-2 focus:ring-foundation-crimson focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm sm:text-[15px] font-bold text-stone-800 mb-2">
                    Category of Inquiry *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-3 min-h-[48px] text-[16px] text-foundation-charcoal focus:ring-2 focus:ring-foundation-crimson focus:outline-none"
                  >
                    <option value="general">General Foundation Inquiry</option>
                    <option value="admission_guidance">Elderly Care Admission (Vyenkatesh Ashram)</option>
                    <option value="csr_collaboration">CSR Partnership (Companies Act Schedule VII)</option>
                    <option value="goseva">Go-Seva Kendra &amp; Cattle Welfare</option>
                    <option value="naturopathy">Aarogyam Prakritik Chikitsa (Weekend Camps)</option>
                    <option value="volunteer_seva">Volunteer / Seva Member Engagement</option>
                    <option value="grievance">Feedback or Administrative Inquiries</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm sm:text-[15px] font-bold text-stone-800 mb-2">
                  Message / Inquiry Details *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Please describe how we can assist you or provide details regarding your inquiry..."
                  className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-3 text-[16px] text-foundation-charcoal focus:ring-2 focus:ring-foundation-crimson focus:outline-none"
                />
              </div>

              <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-foundation-borderMuted">
                <span className="text-xs sm:text-sm text-stone-500 text-center sm:text-left">
                  Privacy Notice: Contact details are used solely for foundation communications.
                </span>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto px-8 py-3.5 min-h-[48px] bg-foundation-crimson hover:bg-foundation-crimsonDark disabled:opacity-50 text-white font-bold text-sm sm:text-base rounded-full shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  {isLoading ? <span>Submitting Message...</span> : <span>Send Message</span>}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
