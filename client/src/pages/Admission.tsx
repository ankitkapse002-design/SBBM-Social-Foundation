import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield, CheckCircle2, Phone, AlertCircle, Send,
  User, Calendar, Heart, FileCheck, ArrowRight, Copy, Check,
  Info, Lock, KeyRound, MapPin
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { apiRequest } from '../api';
import { SEO } from '../components/common/SEO';

export const Admission: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    applicantName: '',
    guardianFirstName: '',
    guardianPhone: '',
    applicantEmail: '',
    dobOrYear: '1952',
    address: '',
    admissionCategory: 'Elder Care Sanctuary (Permanent Old Age Home)',
    relationWithResident: 'Son / Daughter',
    residentGender: 'Male',
    mobilityStatus: 'Independent with daily routine',
    medicalNotes: '',
    additionalMessage: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [hasCopiedId, setHasCopiedId] = useState(false);
  const [successData, setSuccessData] = useState<{
    registrationId: string;
    referenceId?: string;
    status: string;
    applicantName: string;
    guardianFirstName: string;
    dobOrYear: string;
    initialPasswordFormat: string;
    message: string;
    contactNotice: string;
  } | null>(null);

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setHasCopiedId(true);
    setTimeout(() => setHasCopiedId(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (
      !formData.applicantName.trim() ||
      !formData.guardianFirstName.trim() ||
      !formData.guardianPhone.trim() ||
      !formData.dobOrYear.trim() ||
      !formData.address.trim()
    ) {
      setErrorMessage('Please fill in all mandatory fields marked with an asterisk (*).');
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiRequest<{
        success: boolean;
        registrationId: string;
        referenceId?: string;
        status: string;
        applicantName: string;
        guardianFirstName: string;
        dobOrYear: string;
        initialPasswordFormat: string;
        message: string;
        contactNotice: string;
      }>('/enquiries/admission', {
        method: 'POST',
        body: JSON.stringify(formData),
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
      setErrorMessage(err.message || 'Failed to submit admission enquiry. Please check your details or call our office.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-foundation-ivory py-12 md:py-16">
      <SEO
        title="Senior Resident Admission Process | Vyenkatesh Ashram"
        description="Official senior admission enquiry for Vyenkatesh Ashram Mahuli. Safe, loving residential sanctuary for destitute and solitary senior citizens in Nagpur District."
        canonicalPath="/admission"
      />
      <div className="max-w-4xl mx-auto px-4 md:px-8 space-y-10">

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-foundation-forest/10 text-foundation-forest text-xs font-semibold">
            <Heart className="w-3.5 h-3.5 text-rose-600" />
            <span>SBBM Senior Care Sanctuary • Senior Living Evaluation & Admissions</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-foundation-charcoal">
            Apply for Admission
          </h1>
          <p className="text-xs md:text-sm text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Please provide accurate details regarding the prospective resident and guardian. Submitting this enquiry registers your application for administrative evaluation.
          </p>
        </div>

        {/* Admission Status Strip */}
        <div className="bg-white rounded-2xl py-3 px-4 border border-foundation-borderMuted shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="font-bold text-stone-700">Admission Status:</span>
            <span className="text-emerald-700 font-medium">Currently Accepting Applications</span>
          </div>
          <div className="text-stone-500 flex items-center space-x-2 flex-wrap">
            <span>Direct Helpline:</span>
            <a href="tel:+919890898081" className="font-bold text-[#9B1B22] hover:underline">
              +91 98908 98081
            </a>
          </div>
        </div>

        {/* Important Notice Regarding Charitable Operation */}
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Important Notice Regarding Admission:</p>
            <p>
              SBBM Social Foundation operates its Senior Care Sanctuary as a charitable, non-granted senior citizen initiative with fixed capacity. Accommodation availability, medical suitability, and admission formalities must be reviewed by the administration. Submitting this enquiry sets initial status to <strong>Pending Review</strong> and does not constitute automatic approval.
            </p>
            <p className="font-semibold text-amber-900 pt-1">
              For urgent queries or office visits, call directly at: <a href="tel:+919890898081" className="underline font-bold">+91 98908 98081</a>.
            </p>
          </div>
        </div>

        {/* Success Confirmation Card */}
        {successData ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 md:p-10 border-2 border-emerald-500 shadow-xl text-center space-y-6"
          >
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <FileCheck className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-emerald-700 font-bold">
                Enquiry Successfully Registered
              </span>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foundation-charcoal">
                Registration ID: {successData.registrationId}
              </h2>
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-100 border border-amber-300 rounded-full text-xs font-bold text-amber-900">
                <span>Initial Status: Pending Review</span>
              </div>
            </div>

            {/* Enquiry Reference & Contact Notice */}
            <div className="p-5 bg-foundation-warmGray rounded-2xl border border-foundation-borderMuted text-xs text-stone-700 max-w-lg mx-auto space-y-3 text-left">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-bold text-stone-900">Application Reference Record:</span>
                <button
                  type="button"
                  onClick={() => handleCopyId(successData.registrationId)}
                  className="px-2.5 py-1 bg-white border rounded-lg text-[11px] font-semibold text-stone-700 flex items-center space-x-1 hover:bg-stone-50 cursor-pointer"
                >
                  {hasCopiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{hasCopiedId ? 'Copied ID' : 'Copy Reference ID'}</span>
                </button>
              </div>

              <div className="space-y-1.5 text-[11px]">
                <p>• <strong>Admission Reference ID:</strong> <span className="text-[#8B1D24] font-mono font-bold">{successData.registrationId}</span></p>
                <p>• <strong>Senior Resident Name:</strong> {successData.applicantName}</p>
                <p>• <strong>Guardian / Contact:</strong> {successData.guardianFirstName}</p>
                <p>• <strong>Evaluation Status:</strong> <span className="font-semibold text-amber-800">Pending Administrative Review</span></p>
              </div>

              <div className="pt-2 border-t text-[11px] text-stone-600 space-y-1.5">
                <p>
                  Our administrative committee reviews living requirements and accommodation capacity at Vyenkatesh Ashram. We will contact the guardian directly via phone or WhatsApp to schedule a personal visit.
                </p>
                <p className="font-medium text-stone-800">
                  For urgent admission assistance, call: <a href="tel:+919890898081" className="underline text-[#8B1D24] font-bold">+91 98908 98081</a> / <a href="tel:+919326172824" className="underline text-[#8B1D24] font-bold">+91 93261 72824</a>.
                </p>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
              <Link
                to="/"
                className="px-8 py-3 bg-[#8B1D24] hover:bg-[#6E1419] text-white text-xs font-bold rounded-xl shadow-md transition-colors text-center"
              >
                Return to Homepage
              </Link>
              <button
                type="button"
                onClick={() => {
                  setSuccessData(null);
                  setFormData({
                    applicantName: '',
                    guardianFirstName: '',
                    guardianPhone: '',
                    applicantEmail: '',
                    dobOrYear: '1952',
                    address: '',
                    admissionCategory: 'Elder Care Sanctuary (Permanent Old Age Home)',
                    relationWithResident: 'Son / Daughter',
                    residentGender: 'Male',
                    mobilityStatus: 'Independent with daily routine',
                    medicalNotes: '',
                    additionalMessage: '',
                  });
                }}
                className="px-6 py-3 border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Submit Another Enquiry
              </button>
            </div>
          </motion.div>
        ) : (
          /* Form Card */
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl p-4 sm:p-6 md:p-10 border border-foundation-borderMuted shadow-soft space-y-6 sm:space-y-8"
          >
            {errorMessage && (
              <div className="p-4 bg-red-50 text-red-800 text-xs rounded-2xl border border-red-200 flex items-start space-x-2.5">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            )}

            {/* Section 1: Prospective Resident Information */}
            <div className="space-y-4">
              <h3 className="font-display font-bold text-base text-foundation-forest border-b border-foundation-borderMuted pb-2 flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>1. Prospective Senior Resident Details</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Resident's Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    id="resident-name-input"
                    value={formData.applicantName}
                    onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                    placeholder="e.g. Anand Gopal Deshmukh"
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 min-h-[44px] text-xs sm:text-sm text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                  />
                  <p className="text-[10px] text-stone-500 mt-0.5">First 4 letters are used with birth year to create default admission password.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Date of Birth / Birth Year *
                  </label>
                  <input
                    type="text"
                    required
                    id="dob-or-year-input"
                    value={formData.dobOrYear}
                    onChange={(e) => setFormData({ ...formData, dobOrYear: e.target.value })}
                    placeholder="e.g. 1952 or 15/08/1952"
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 min-h-[44px] text-xs sm:text-sm text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                  />
                  <p className="text-[10px] text-stone-500 mt-0.5">Used for initial credential generation.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Gender *
                  </label>
                  <select
                    value={formData.residentGender}
                    onChange={(e) => setFormData({ ...formData, residentGender: e.target.value })}
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 min-h-[44px] text-xs sm:text-sm text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Admission Category *
                  </label>
                  <select
                    value={formData.admissionCategory}
                    onChange={(e) => setFormData({ ...formData, admissionCategory: e.target.value })}
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 min-h-[44px] text-xs sm:text-sm text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                  >
                    <option value="Elder Care Sanctuary (Permanent Old Age Home)">Elder Care Sanctuary (Permanent Old Age Home)</option>
                    <option value="Assisted Living & Personal Care">Assisted Living & Personal Care</option>
                    <option value="Memory Care & Special Seva">Memory Care & Special Seva</option>
                    <option value="Respite & Short Stay Care">Respite & Short Stay Care</option>
                  </select>
                </div>

                <div className="md:col-span-3">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Mobility & Daily Independence Status *
                  </label>
                  <select
                    value={formData.mobilityStatus}
                    onChange={(e) => setFormData({ ...formData, mobilityStatus: e.target.value })}
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 min-h-[44px] text-xs sm:text-sm text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                  >
                    <option value="Independent with daily routine">Independent with daily routine</option>
                    <option value="Walks with cane/stick, independent">Walks with cane/stick, independent</option>
                    <option value="Requires partial assistance for mobility">Requires partial assistance for mobility</option>
                    <option value="Wheelchair bound / needs special support">Wheelchair bound / needs special support</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Guardian Details */}
            <div className="space-y-4">
              <h3 className="font-display font-bold text-base text-foundation-forest border-b border-foundation-borderMuted pb-2 flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>2. Guardian / Primary Contact Information</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Guardian's First Name *
                  </label>
                  <input
                    type="text"
                    required
                    id="guardian-first-name-input"
                    value={formData.guardianFirstName}
                    onChange={(e) => setFormData({ ...formData, guardianFirstName: e.target.value })}
                    placeholder="e.g. Rahul"
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 min-h-[44px] text-xs sm:text-sm text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Guardian's Mobile / Contact Number *
                  </label>
                  <input
                    type="tel"
                    required
                    id="guardian-phone-input"
                    value={formData.guardianPhone}
                    onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                    placeholder="e.g. +91 98220 XXXXX"
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 min-h-[44px] text-xs sm:text-sm text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
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
                    placeholder="e.g. rahul@example.com"
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 min-h-[44px] text-xs sm:text-sm text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Relation with Resident *
                  </label>
                  <select
                    value={formData.relationWithResident}
                    onChange={(e) => setFormData({ ...formData, relationWithResident: e.target.value })}
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 min-h-[44px] text-xs sm:text-sm text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                  >
                    <option value="Son / Daughter">Son / Daughter</option>
                    <option value="Self (Senior Enquiring)">Self (Senior Enquiring)</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Relative / Grandchild">Relative / Grandchild</option>
                    <option value="Social Worker / Well-wisher">Social Worker / Well-wisher</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Residential Address *
                  </label>
                  <input
                    type="text"
                    required
                    id="address-input"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="e.g. Flat 302, Gokulpeth, Nagpur, Maharashtra - 440010"
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 min-h-[44px] text-xs sm:text-sm text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Health & Additional Notes */}
            <div className="space-y-4">
              <h3 className="font-display font-bold text-base text-foundation-forest border-b border-foundation-borderMuted pb-2">
                3. Health Background & Additional Information
              </h3>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Health Background, Medical History &amp; Regular Prescription Medicines
                </label>
                <textarea
                  rows={2}
                  value={formData.medicalNotes}
                  onChange={(e) => setFormData({ ...formData, medicalNotes: e.target.value })}
                  placeholder="Mention any known conditions (e.g. Hypertension, Diabetes, Asthma, mobility restrictions) and regular medications..."
                  className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 text-xs sm:text-sm text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Additional Information or Enquiry Message
                </label>
                <textarea
                  rows={2}
                  value={formData.additionalMessage}
                  onChange={(e) => setFormData({ ...formData, additionalMessage: e.target.value })}
                  placeholder="Any particular requirements, preferred admission timeline, special diet considerations, or questions for management..."
                  className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 text-xs sm:text-sm text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                />
              </div>
            </div>

            {/* Submission notice & Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-foundation-borderMuted">
              <span className="text-[11px] text-stone-500">
                Data saved securely. A unique Admission ID &amp; credentials will be generated.
              </span>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-8 py-3.5 min-h-[44px] bg-foundation-crimson hover:bg-foundation-crimsonDark disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
                id="submit-admission-enquiry-btn"
              >
                {isLoading ? (
                  <span>Submitting &amp; Creating Account...</span>
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
