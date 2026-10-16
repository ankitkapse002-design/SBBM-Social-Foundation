import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, CheckCircle2, Phone, AlertCircle, Send,
  User, Calendar, Heart, FileCheck, ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { apiRequest } from '../api';

export const Admission: React.FC = () => {
  const [formData, setFormData] = useState({
    applicantName: '',
    applicantPhone: '',
    applicantEmail: '',
    relationWithResident: 'Son / Daughter',
    residentName: '',
    residentAge: '',
    residentGender: 'Male',
    mobilityStatus: 'Independent with daily routine',
    medicalNotes: '',
    additionalMessage: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successData, setSuccessData] = useState<{
    referenceId: string;
    message: string;
    contactNotice: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.applicantName || !formData.applicantPhone || !formData.residentName || !formData.residentAge) {
      setErrorMessage('Please fill in all mandatory fields (marked with *).');
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiRequest<{
        success: boolean;
        referenceId: string;
        message: string;
        contactNotice: string;
      }>('/enquiries/admission', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          residentAge: Number(formData.residentAge),
        }),
      });

      if (response.success) {
        setSuccessData(response);
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit admission enquiry. Please try again or call directly.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-foundation-ivory py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 md:px-8 space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-foundation-forest/10 text-foundation-forest text-xs font-semibold">
            <Heart className="w-3.5 h-3.5 text-rose-600" />
            <span>Vyenkatesh Ashram • Senior Living Evaluation</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-foundation-charcoal">
            Admission Enquiry
          </h1>
          <p className="text-xs md:text-sm text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Please provide accurate details regarding the prospective resident. Submitting this form initiates an evaluation by our management team.
          </p>
        </div>

        {/* Important Direct Confirmation Alert */}
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Important Notice Regarding Admission:</p>
            <p>
              Vyenkatesh Ashram operates as a charitable, non-granted old age home with fixed capacity. Accommodation availability, medical suitability, and admission formalities must be verified directly with the foundation management. Submitting this enquiry does not constitute confirmation of admission.
            </p>
            <p className="font-semibold text-amber-900 pt-1">
              For urgent queries, call the Ashram office directly at: <a href="tel:+919890898081" className="underline font-bold">+91 98908 98081</a>.
            </p>
          </div>
        </div>

        {/* Success Confirmation Card */}
        {successData ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 md:p-10 border-2 border-emerald-500 shadow-xl text-center space-y-5"
          >
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <FileCheck className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-emerald-700 font-bold">
                Application Received Successfully
              </span>
              <h2 className="text-2xl font-display font-bold text-foundation-charcoal">
                Enquiry Reference: {successData.referenceId}
              </h2>
              <p className="text-xs text-stone-600 max-w-lg mx-auto leading-relaxed">
                {successData.message}
              </p>
            </div>

            <div className="p-4 bg-foundation-warmGray rounded-2xl border border-foundation-borderMuted text-xs text-stone-700 max-w-md mx-auto space-y-1 text-left">
              <p>• <strong>Senior Name:</strong> {formData.residentName} (Age: {formData.residentAge})</p>
              <p>• <strong>Contact Person:</strong> {formData.applicantName} ({formData.applicantPhone})</p>
              <p>• <strong>Status:</strong> New / Pending Initial Review</p>
            </div>

            <p className="text-xs text-stone-500">
              {successData.contactNotice}
            </p>

            <div className="pt-4 flex justify-center space-x-3">
              <button
                onClick={() => {
                  setSuccessData(null);
                  setFormData({
                    applicantName: '',
                    applicantPhone: '',
                    applicantEmail: '',
                    relationWithResident: 'Son / Daughter',
                    residentName: '',
                    residentAge: '',
                    residentGender: 'Male',
                    mobilityStatus: 'Independent with daily routine',
                    medicalNotes: '',
                    additionalMessage: '',
                  });
                }}
                className="px-6 py-2.5 bg-foundation-forest text-foundation-ivory text-xs font-bold rounded-full shadow-md hover:bg-foundation-forestLight"
              >
                Submit Another Enquiry
              </button>
            </div>
          </motion.div>
        ) : (
          /* Form Card */
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl p-6 md:p-10 border border-foundation-borderMuted shadow-soft space-y-8"
          >
            {errorMessage && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                {errorMessage}
              </div>
            )}

            {/* Section 1: Contact / Guardian Details */}
            <div className="space-y-4">
              <h3 className="font-display font-bold text-base text-foundation-forest border-b border-foundation-borderMuted pb-2">
                1. Guardian / Applicant Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.applicantName}
                    onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                    placeholder="e.g. Ramesh Deshmukh"
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 text-xs text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Mobile / Contact Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.applicantPhone}
                    onChange={(e) => setFormData({ ...formData, applicantPhone: e.target.value })}
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
                    value={formData.applicantEmail}
                    onChange={(e) => setFormData({ ...formData, applicantEmail: e.target.value })}
                    placeholder="e.g. ramesh@example.com"
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 text-xs text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Relation with Senior *
                  </label>
                  <select
                    value={formData.relationWithResident}
                    onChange={(e) => setFormData({ ...formData, relationWithResident: e.target.value })}
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 text-xs text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                  >
                    <option value="Son / Daughter">Son / Daughter</option>
                    <option value="Self (Senior Enquiring)">Self (Senior Enquiring)</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Relative">Relative</option>
                    <option value="Social Worker / Well-wisher">Social Worker / Well-wisher</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Prospective Senior Resident Information */}
            <div className="space-y-4">
              <h3 className="font-display font-bold text-base text-foundation-forest border-b border-foundation-borderMuted pb-2">
                2. Senior Resident Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Senior's Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.residentName}
                    onChange={(e) => setFormData({ ...formData, residentName: e.target.value })}
                    placeholder="e.g. Anand Gopal Deshmukh"
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 text-xs text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Age (Years) *
                  </label>
                  <input
                    type="number"
                    min="55"
                    max="110"
                    required
                    value={formData.residentAge}
                    onChange={(e) => setFormData({ ...formData, residentAge: e.target.value })}
                    placeholder="e.g. 72"
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 text-xs text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Gender *
                  </label>
                  <select
                    value={formData.residentGender}
                    onChange={(e) => setFormData({ ...formData, residentGender: e.target.value })}
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 text-xs text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Mobility & Independence Status *
                  </label>
                  <select
                    value={formData.mobilityStatus}
                    onChange={(e) => setFormData({ ...formData, mobilityStatus: e.target.value })}
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 text-xs text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                  >
                    <option value="Independent with daily routine">Independent with daily routine</option>
                    <option value="Walks with cane/stick, independent">Walks with cane/stick, independent</option>
                    <option value="Requires partial assistance for mobility">Requires partial assistance for mobility</option>
                    <option value="Wheelchair bound / needs special support">Wheelchair bound / needs special support</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Health Background & Regular Medications
                </label>
                <textarea
                  rows={2}
                  value={formData.medicalNotes}
                  onChange={(e) => setFormData({ ...formData, medicalNotes: e.target.value })}
                  placeholder="Mention any known conditions (e.g. Blood pressure, Diabetes, mobility restrictions) and regular prescription medicines..."
                  className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 text-xs text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Additional Notes or Circumstances
                </label>
                <textarea
                  rows={2}
                  value={formData.additionalMessage}
                  onChange={(e) => setFormData({ ...formData, additionalMessage: e.target.value })}
                  placeholder="Any particular requirements, preferred admission timeline, or questions for management..."
                  className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 text-xs text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-foundation-borderMuted">
              <span className="text-[11px] text-stone-500">
                Data submitted securely to foundation administrative database.
              </span>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-8 py-3 bg-foundation-forest hover:bg-foundation-forestLight disabled:opacity-50 text-foundation-ivory font-bold text-xs rounded-full shadow-lg transition-all flex items-center justify-center space-x-2"
                id="submit-admission-enquiry-btn"
              >
                {isLoading ? (
                  <span>Submitting Enquiry...</span>
                ) : (
                  <>
                    <span>Submit Admission Enquiry</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
