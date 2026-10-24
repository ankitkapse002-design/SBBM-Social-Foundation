import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  UserCheck, Shield, Lock, Eye, EyeOff, AlertCircle, CheckCircle2,
  Copy, Check, ArrowRight, HeartHandshake, Phone, Mail, MapPin, Calendar, Heart
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { apiRequest, setAuthToken } from '../../api';
import { PasswordField } from '../../components/ui/PasswordField';

export const SevaMemberPortal: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('mode') === 'register' ? 'register' : 'login';

  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);

  // Login State
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<{ message: string; code?: string } | null>(null);

  // Registration State
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    mobile: '',
    email: '',
    address: '',
    sevaPreferences: ['Elder Care Seva'],
    emergencyContact: '',
    bloodGroup: '',
    notes: '',
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [registeredMember, setRegisteredMember] = useState<{
    memberId: string;
    fullName: string;
    message: string;
  } | null>(null);
  const [hasCopiedId, setHasCopiedId] = useState(false);

  const sevaOptionList = [
    'Elder Care Seva & Companionship',
    'Go-Seva Kendra (Cattle Care)',
    'Annadanam & Kitchen Seva',
    'Naturopathy & Yoga Assistance',
    'Administrative & Rural Outreach',
  ];

  const handleTogglePreference = (pref: string) => {
    setFormData(prev => {
      const exists = prev.sevaPreferences.includes(pref);
      return {
        ...prev,
        sevaPreferences: exists
          ? prev.sevaPreferences.filter(p => p !== pref)
          : [...prev.sevaPreferences, pref],
      };
    });
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!loginId.trim() || !password) {
      setLoginError({ message: 'Please enter your Seva Member ID or email and password.' });
      return;
    }

    setIsLoggingIn(true);
    try {
      const res = await apiRequest<{
        success: boolean;
        token: string;
        user: {
          id: string;
          role: string;
          fullName: string;
          portalId: string;
          mustChangePassword: boolean;
        };
      }>('/portal/login', {
        method: 'POST',
        body: JSON.stringify({
          loginId: loginId.trim(),
          password,
          expectedRole: 'seva_member',
        }),
      });

      if (res.success && res.token) {
        setAuthToken(res.token);
        if (res.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/seva-member/dashboard');
        }
      }
    } catch (err: any) {
      setLoginError({
        message: err.message || 'Invalid credentials. Please verify your Member ID and password.',
        code: err.code,
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');

    if (!formData.fullName.trim() || !formData.dob || !formData.mobile.trim() || !formData.address.trim()) {
      setRegisterError('Full name, date of birth, mobile number, and address are required.');
      return;
    }

    setIsRegistering(true);
    try {
      const res = await apiRequest<{
        success: boolean;
        memberId: string;
        fullName: string;
        status: string;
        message: string;
      }>('/portal/register/seva-member', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      if (res.success) {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        setRegisteredMember({
          memberId: res.memberId,
          fullName: res.fullName,
          message: res.message,
        });
      }
    } catch (err: any) {
      setRegisterError(err.message || 'Failed to submit registration. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setHasCopiedId(true);
    setTimeout(() => setHasCopiedId(false), 2500);
  };

  return (
    <div className="min-h-screen bg-foundation-ivory py-12 md:py-16 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-foundation-forest text-foundation-gold flex items-center justify-center mx-auto shadow-md border-2 border-foundation-gold/40">
            <UserCheck className="w-8 h-8" />
          </div>
          <span className="text-[11px] uppercase tracking-widest text-foundation-forest font-bold bg-foundation-forest/10 px-3 py-1 rounded-full inline-block">
            Seva Member Portal
          </span>
          <h1 className="text-3xl font-display font-bold text-foundation-charcoal">
            Vyenkatesh Ashram Seva Portal
          </h1>
          <p className="text-xs text-stone-600 max-w-md mx-auto">
            Access your Seva member dashboard, assigned tasks, service receipts, and official Ashram records.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-stone-200/80 p-1.5 rounded-2xl max-w-md mx-auto">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'login'
                ? 'bg-white text-foundation-forest shadow-sm'
                : 'text-stone-600 hover:text-foundation-charcoal'
            }`}
          >
            Seva Member Login
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'register'
                ? 'bg-white text-foundation-forest shadow-sm'
                : 'text-stone-600 hover:text-foundation-charcoal'
            }`}
          >
            Register as Seva Member
          </button>
        </div>

        {/* =========================================================================
            TAB 1: LOGIN FORM
           ========================================================================= */}
        {activeTab === 'login' && (
          <div className="bg-white rounded-3xl p-6 md:p-10 border border-foundation-borderMuted shadow-soft space-y-6 max-w-md mx-auto">
            <div className="border-b pb-3">
              <h2 className="text-lg font-display font-bold text-foundation-charcoal">
                Sign In to Seva Dashboard
              </h2>
              <p className="text-xs text-stone-500">
                Use your assigned Seva Member ID (e.g. <span className="font-mono font-bold text-foundation-forest">SSBM-SM-2026-XXXX</span>) or email.
              </p>
            </div>

            {loginError && (
              <div className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
                loginError.code === 'PENDING_APPROVAL'
                  ? 'bg-amber-500/10 border-amber-300 text-amber-900'
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                <div className="flex items-center space-x-2 font-bold">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{loginError.code === 'PENDING_APPROVAL' ? 'Application Under Review' : 'Authentication Error'}</span>
                </div>
                <p className="leading-relaxed pl-6">{loginError.message}</p>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Seva Member ID or Email / Mobile *
                </label>
                <input
                  type="text"
                  required
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  placeholder="SSBM-SM-2026-XXXX or email"
                  className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 text-xs text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                />
              </div>

              <PasswordField
                label="Password *"
                sublabel="Initial format: Name (4 letters) + Birth Year"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 bg-foundation-forest hover:bg-foundation-forestLight text-foundation-ivory text-xs font-bold rounded-full shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isLoggingIn ? 'Authenticating...' : 'Sign In to Seva Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="text-center pt-2 border-t border-stone-100">
              <p className="text-xs text-stone-500">
                First time applying for Seva?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="font-bold text-foundation-forest hover:underline cursor-pointer"
                >
                  Register Here
                </button>
              </p>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: REGISTRATION FORM
           ========================================================================= */}
        {activeTab === 'register' && (
          <div className="bg-white rounded-3xl p-6 md:p-10 border border-foundation-borderMuted shadow-soft space-y-6">
            <div className="border-b pb-3">
              <h2 className="text-lg font-display font-bold text-foundation-charcoal">
                Seva Member Registration Application
              </h2>
              <p className="text-xs text-stone-500">
                Join as an authorized Seva Member. Your application will be issued a permanent unique Member ID and forwarded to Ashram administration for approval.
              </p>
            </div>

            {registerError && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{registerError}</span>
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Mobile Number (WhatsApp Enabled) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="10-digit mobile number"
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-foundation-forest focus:outline-none"
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
                    placeholder="name@example.com"
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Residential Address *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street, locality, city and pincode"
                  className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Emergency Contact Number
                  </label>
                  <input
                    type="tel"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    placeholder="Family member / alternate contact"
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Blood Group (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    placeholder="e.g. O+, B+, A+"
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-2">
                  Areas of Seva Interest & Preferences
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {sevaOptionList.map(pref => (
                    <label
                      key={pref}
                      className="flex items-center space-x-2 p-2 bg-foundation-warmGray rounded-xl text-xs text-stone-700 hover:bg-stone-200/60 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.sevaPreferences.includes(pref)}
                        onChange={() => handleTogglePreference(pref)}
                        className="rounded text-foundation-forest focus:ring-foundation-forest"
                      />
                      <span>{pref}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Additional Notes / Motivation to Serve
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Share any special skills, availability, or thoughts..."
                  className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                />
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-200 rounded-2xl text-[11px] text-amber-900 leading-relaxed">
                <strong>Initial Login Credentials Notice:</strong> Upon registration, the system automatically associates an initial login password formatted as the <strong>first 4 letters of your name in uppercase + your birth year</strong> (e.g. if name is Rahul and year is 2003, initial password is <code className="font-bold text-amber-950 font-mono">RAHU2003</code>). Once approved by Ashram management, you must change this to a private password on your first login.
              </div>

              <button
                type="submit"
                disabled={isRegistering}
                className="w-full py-3 bg-foundation-forest hover:bg-foundation-forestLight text-foundation-ivory text-xs font-bold rounded-full shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isRegistering ? 'Generating Member ID & Submitting...' : 'Submit Seva Member Application'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* =========================================================================
            CONFIRMATION MODAL ON SUCCESSFUL REGISTRATION
           ========================================================================= */}
        {registeredMember && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border-2 border-emerald-500/40 space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="text-center space-y-1">
                <h3 className="font-display font-bold text-xl text-foundation-charcoal">
                  Seva Member ID Generated!
                </h3>
                <p className="text-xs text-stone-500">
                  Application registered for <strong>{registeredMember.fullName}</strong>
                </p>
              </div>

              <div className="p-4 bg-foundation-warmGray rounded-2xl border border-foundation-borderMuted space-y-2 text-center">
                <span className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">
                  Permanent Seva Member ID
                </span>
                <div className="flex items-center justify-center space-x-2">
                  <span className="font-mono font-bold text-xl text-foundation-forest">
                    {registeredMember.memberId}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(registeredMember.memberId)}
                    className="p-1.5 rounded-lg bg-white border hover:bg-stone-100 text-stone-600 transition-colors cursor-pointer"
                    title="Copy Member ID"
                  >
                    {hasCopiedId ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                {hasCopiedId && (
                  <p className="text-[10px] text-emerald-700 font-bold">Copied to clipboard!</p>
                )}
              </div>

              <div className="space-y-2 text-xs text-stone-600 bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200/60 leading-relaxed">
                <p>
                  <strong>Application Status:</strong> <span className="inline-block px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">PENDING APPROVAL</span>
                </p>
                <p>
                  Your profile has been forwarded to the Ashram administrator. Once approved, you can sign in using this <strong>Member ID</strong> and your initial password.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setLoginId(registeredMember.memberId);
                  setRegisteredMember(null);
                  setActiveTab('login');
                }}
                className="w-full py-2.5 bg-foundation-forest hover:bg-foundation-forestLight text-foundation-ivory text-xs font-bold rounded-full shadow transition-all cursor-pointer"
              >
                Proceed to Seva Member Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
