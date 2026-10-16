import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Shield, CheckCircle2, FileText, Send,
  ArrowRight, AlertCircle, Heart, Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { apiRequest } from '../api';

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
    <div className="min-h-screen bg-foundation-ivory py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 md:px-8 space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-foundation-forest/10 text-foundation-forest text-xs font-semibold">
            <Users className="w-3.5 h-3.5" />
            <span>SBBM Social Foundation Society Membership</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-foundation-charcoal">
            Foundation Membership
          </h1>
          <p className="text-xs md:text-sm text-stone-600 leading-relaxed max-w-2xl mx-auto">
            Become an active patron or member of SBBM Social Foundation Society. Support elder welfare and community development in Maharashtra.
          </p>
        </div>

        {/* Clear Distinction Banner: Account vs Society Member */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-foundation-borderMuted shadow-soft space-y-3">
            <div className="flex items-center space-x-2 text-foundation-forest">
              <Lock className="w-5 h-5 text-foundation-forest" />
              <h3 className="font-display font-bold text-base">Website Member Account</h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Instantly create a website account to track submitted admission enquiries, volunteer applications, and receive foundation announcements.
            </p>
            <div className="pt-2">
              <Link
                to="/register"
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-foundation-forest hover:underline"
              >
                <span>Create Free Website Account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="bg-foundation-warmGray p-6 rounded-3xl border border-foundation-borderMuted shadow-soft space-y-3">
            <div className="flex items-center space-x-2 text-foundation-forest">
              <Shield className="w-5 h-5 text-foundation-forest" />
              <h3 className="font-display font-bold text-base">Society Registered Membership</h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Official membership under the Societies Registration Act (Reg: 332-15-Nag). Reviewed and approved by the foundation executive board.
            </p>
            <div className="pt-2">
              <span className="text-xs text-stone-500 font-medium">
                Submit formal application below ↓
              </span>
            </div>
          </div>
        </div>

        {/* Application Form */}
        <div className="bg-white rounded-3xl p-6 md:p-10 border border-foundation-borderMuted shadow-soft space-y-6">
          <div className="space-y-1 border-b border-foundation-borderMuted pb-4">
            <h2 className="text-xl font-display font-bold text-foundation-charcoal">
              Apply for Society Membership
            </h2>
            <p className="text-xs text-stone-500">
              Applications are reviewed by the management in accordance with society bylaws.
            </p>
          </div>

          {successMessage ? (
            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-emerald-900 text-base">Application Submitted</h3>
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
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Tina Anjikar"
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 text-xs text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="e.g. +91 98908 XXXXX"
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 text-xs text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. member@example.com"
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 text-xs text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Occupation / Profession
                  </label>
                  <input
                    type="text"
                    value={formData.occupation}
                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                    placeholder="e.g. Teacher, Business, Retired"
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 text-xs text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Residential Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street, Area, City, District & Pincode"
                  className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 text-xs text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Why would you like to join SBBM Social Foundation Society?
                </label>
                <textarea
                  rows={3}
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="Briefly state your interest in supporting our old age home, Go-Seva, or community initiatives..."
                  className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 text-xs text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-foundation-borderMuted">
                <span className="text-[11px] text-stone-500">
                  Society verification process applies.
                </span>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-3 bg-foundation-forest hover:bg-foundation-forestLight disabled:opacity-50 text-foundation-ivory font-bold text-xs rounded-full shadow-md transition-all flex items-center space-x-2"
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
