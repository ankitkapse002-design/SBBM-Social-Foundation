import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Shield, CheckCircle2, FileText, Send,
  ArrowRight, AlertCircle, Heart, Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { apiRequest } from '../api';
import { SEO } from '../components/common/SEO';

export const Membership: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    address: '',
    occupation: '',
    reason: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.fullName || !formData.mobile || !formData.email) {
      setErrorMessage('Full name, mobile number and email are required.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await apiRequest<{ success: boolean; message: string; referenceId: string }>(
        '/enquiries/membership-request',
        {
          method: 'POST',
          body: JSON.stringify(formData),
        }
      );

      if (res.success) {
        setSuccessMessage(res.message);
        confetti({ particleCount: 70, spread: 50 });
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit application.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-foundation-ivory py-10 sm:py-14 md:py-16 font-sans">
      <SEO
        title="Institutional Membership & Association"
        description="Become an institutional member or patron of SBBM Social Foundation Society. Support registered public welfare activities across Nagpur District."
        canonicalPath="/membership"
      />
      <div className="max-w-4xl mx-auto px-4 md:px-8 space-y-8 sm:space-y-12">
        <div className="text-center space-y-3 sm:space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-foundation-forest/10 text-foundation-forest text-xs sm:text-sm font-bold">
            <Users className="w-4 h-4" />
            <span>SBBM Social Foundation Society Membership</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foundation-charcoal">
            Foundation Membership
          </h1>
          <p className="text-sm sm:text-base md:text-[17px] text-stone-600 leading-relaxed max-w-2xl mx-auto">
            Become an active patron or member of SBBM Social Foundation Society. Support elder welfare and community development in Maharashtra.
          </p>
        </div>

        {/* Society Membership Overview Banner */}
        <div className="bg-white p-6 sm:p-8 md:p-10 rounded-3xl border border-foundation-borderMuted shadow-soft space-y-4">
          <div className="flex items-center space-x-2.5 text-[#9B1B22]">
            <Shield className="w-6 h-6 text-[#9B1B22]" />
            <h3 className="font-display font-bold text-xl sm:text-2xl text-foundation-charcoal">Official Society Registered Membership</h3>
          </div>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            Registered membership of <strong>SBBM Social Foundation</strong> is governed under the Societies Registration Act, 1860 (Reg No: MAH/332/15/NAG) and Bombay Public Trusts Act, 1950 (Reg No: MAH/F-33193/NAG). Members participate in the annual general assembly, contribute to strategic welfare planning, and guide community initiatives across Nagpur District.
          </p>
          <div className="pt-2 text-xs sm:text-sm text-stone-500 font-medium">
            Please fill out the formal application form below for review by the executive committee.
          </div>
        </div>

        {/* Application Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-12 border border-foundation-borderMuted shadow-soft space-y-6 sm:space-y-8">
          <div className="space-y-1.5 border-b border-foundation-borderMuted pb-4">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foundation-charcoal">
              Apply for Society Membership
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Applications are reviewed by the management in accordance with society bylaws.
            </p>
          </div>

          {successMessage ? (
            <div className="p-6 sm:p-8 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-emerald-900 text-lg sm:text-xl">Application Submitted</h3>
              <p className="text-sm sm:text-base text-emerald-800 max-w-md mx-auto">{successMessage}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm sm:text-[15px] font-bold text-stone-800 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Ramesh Patil"
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-3 min-h-[48px] text-[16px] text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm sm:text-[15px] font-bold text-stone-800 mb-2">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="e.g. +91 98908 XXXXX"
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-3 min-h-[48px] text-[16px] text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm sm:text-[15px] font-bold text-stone-800 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. member@example.com"
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-3 min-h-[48px] text-[16px] text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm sm:text-[15px] font-bold text-stone-800 mb-2">
                    Occupation / Profession
                  </label>
                  <input
                    type="text"
                    value={formData.occupation}
                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                    placeholder="e.g. Teacher, Business, Retired"
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-3 min-h-[48px] text-[16px] text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm sm:text-[15px] font-bold text-stone-800 mb-2">
                  Residential Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street, Area, City, District &amp; Pincode"
                  className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-3 min-h-[48px] text-[16px] text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-[15px] font-bold text-stone-800 mb-2">
                  Why would you like to join SBBM Social Foundation Society?
                </label>
                <textarea
                  rows={3}
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="Briefly state your interest in supporting our old age home, Go-Seva, or community initiatives..."
                  className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-3 text-[16px] text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                />
              </div>

              <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-foundation-borderMuted">
                <span className="text-xs sm:text-sm text-stone-500 text-center sm:text-left">
                  Society verification process applies in accordance with registered bylaws.
                </span>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto px-8 py-3.5 min-h-[48px] bg-foundation-forest hover:bg-foundation-forestLight disabled:opacity-50 text-foundation-ivory font-bold text-sm sm:text-base rounded-full shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  {isLoading ? <span>Submitting...</span> : <span>Submit Membership Application</span>}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
