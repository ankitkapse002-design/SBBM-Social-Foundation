import React, { useState } from 'react';
import {
  MapPin, Phone, Mail, Clock, Send,
  CheckCircle2, AlertCircle, Building2, ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { apiRequest } from '../api';

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

  return (
    <div className="min-h-screen bg-foundation-ivory py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4 md:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-foundation-forest/10 text-foundation-forest text-xs font-semibold">
            <MapPin className="w-3.5 h-3.5" />
            <span>Official Contact Directory & Inquiries</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-foundation-charcoal">
            Contact Vyenkatesh Ashram & Foundation
          </h1>
          <p className="text-xs md:text-sm text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Reach out to our administrative head office in Nagpur or our elder residential ashram at Mahuli, Parseoni.
          </p>
        </div>

        {/* Two Distinct Location Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Location 1: Vyenkatesh Ashram (Project Facility) */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-foundation-forest/40 shadow-soft space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold">
                <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Ashram Project Facility (Mahuli)</span>
              </div>

              <h2 className="text-2xl font-display font-bold text-foundation-charcoal">
                VYENKATESH ASHRAM
              </h2>

              <div className="space-y-2 text-xs text-stone-700 leading-relaxed">
                <p className="font-semibold text-foundation-forest">Address:</p>
                <p>
                  434, Anjikar Bagh, Mansar Mahuli Road,<br />
                  Village / Post Mahuli, Tehsil Parseoni,<br />
                  District Nagpur, Maharashtra – 441105.
                </p>
                <p className="text-[11px] text-stone-500 pt-1">
                  • Facility: Residential Old Age Home, Go-Seva Kendra, Naturopathy Garden
                </p>
              </div>

              <div className="p-4 bg-foundation-warmGray rounded-2xl border border-foundation-borderMuted space-y-2 text-xs">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-foundation-forest" />
                  <span>Ashram Line: <a href="tel:+919890898081" className="font-bold underline text-foundation-forest">+91 98908 98081</a></span>
                </div>
                <div className="flex items-center space-x-2 text-stone-500 text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  <span>Prior phone appointment requested for visitor comfort.</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://maps.google.com/?q=Mahuli+Parseoni+Nagpur+Maharashtra"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-foundation-forest hover:underline"
              >
                <span>Open Directions in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Location 2: Foundation Head Office (Nagpur City) */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-foundation-borderMuted shadow-soft space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-[11px] font-bold">
                <Building2 className="w-3.5 h-3.5 text-amber-600" />
                <span>Head Office (Nagpur City)</span>
              </div>

              <h2 className="text-2xl font-display font-bold text-foundation-charcoal">
                SBBM SOCIAL FOUNDATION
              </h2>

              <div className="space-y-2 text-xs text-stone-700 leading-relaxed">
                <p className="font-semibold text-foundation-forest">Registered Society Address:</p>
                <p>
                  C/o Ashvin V. Anjikar (Anjikar House),<br />
                  Panchpaoli, Timki Chimabai Peth,<br />
                  Nagpur, Maharashtra – 440018.
                </p>
                <p className="text-[11px] text-stone-500 pt-1">
                  • Society Reg No: 332-15-Nag (Est. 2015)
                </p>
                <p className="text-[11px] text-stone-500">
                  • Management: Mr. Ashwin V. Anjikar & Mrs. Tina Anjikar
                </p>
              </div>

              <div className="p-4 bg-foundation-warmGray rounded-2xl border border-foundation-borderMuted space-y-2 text-xs">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-foundation-forest" />
                  <span>Official Contact: <a href="tel:+919890898081" className="font-bold underline text-foundation-forest">+91 98908 98081</a></span>
                </div>
                <div className="flex items-center space-x-2 text-stone-500 text-[11px]">
                  <Mail className="w-3.5 h-3.5 text-stone-400" />
                  <span>Official correspondence, donations & society governance.</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://maps.google.com/?q=Panchpaoli+Nagpur+Maharashtra"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-foundation-forest hover:underline"
              >
                <span>View Head Office Area on Map</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Contact Inquiry Form */}
        <div className="bg-white rounded-3xl p-6 md:p-10 border border-foundation-borderMuted shadow-soft space-y-6">
          <div className="border-b border-foundation-borderMuted pb-4 space-y-1">
            <h2 className="text-xl font-display font-bold text-foundation-charcoal">
              Send an Official Message
            </h2>
            <p className="text-xs text-stone-500">
              For general enquiries, schedule a visit, or speak to management.
            </p>
          </div>

          {successMessage ? (
            <div className="p-8 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-emerald-900 text-lg">Message Received!</h3>
              <p className="text-xs text-emerald-800 max-w-md mx-auto">{successMessage}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMessage && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Anand Shinde"
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 text-xs text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +91 98220 XXXXX"
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 text-xs text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. anand@example.com"
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 text-xs text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Category of Inquiry *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 text-xs text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="ashram_visit">Visiting Vyenkatesh Ashram</option>
                    <option value="admission_guidance">Admission Process Clarification</option>
                    <option value="goseva">Go-Seva Kendra & Cows</option>
                    <option value="grievance">Grievance or Feedback</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Message / Details *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we assist you? Please mention details..."
                  className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 text-xs text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-foundation-borderMuted">
                <span className="text-[11px] text-stone-500">
                  Privacy Notice: Contact details are used exclusively for foundation communication.
                </span>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto px-8 py-3 bg-foundation-forest hover:bg-foundation-forestLight disabled:opacity-50 text-foundation-ivory font-bold text-xs rounded-full shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  {isLoading ? <span>Sending Message...</span> : <span>Send Message</span>}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
