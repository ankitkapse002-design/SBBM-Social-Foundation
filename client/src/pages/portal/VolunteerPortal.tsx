import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  HeartHandshake, Shield, Lock, Eye, EyeOff, AlertCircle, CheckCircle2,
  Copy, Check, ArrowRight, Heart, MapPin, Calendar, Clock, Star
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { apiRequest, setAuthToken } from '../../api';

export const VolunteerPortal: React.FC = () => {
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
    skills: '',
    preferredActivities: ['Elder Care Assistance & Companionship'],
    availability: 'Weekends (Saturday & Sunday)',
    experience: '',
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [registeredVolunteer, setRegisteredVolunteer] = useState<{
    volunteerId: string;
    fullName: string;
    message: string;
  } | null>(null);
  const [hasCopiedId, setHasCopiedId] = useState(false);

  const activityOptions = [
    'Elder Care Assistance & Companionship',
    'Go-Seva Kendra (Cattle Care)',
    'Naturopathy & Yoga Support',
    'Special Events & Health Camps',
    'Ashram Premises & Garden Maintenance',
    'Annadanam Meal Service',
  ];

  const handleToggleActivity = (act: string) => {
    setFormData(prev => {
      const exists = prev.preferredActivities.includes(act);
      return {
        ...prev,
        preferredActivities: exists
          ? prev.preferredActivities.filter(a => a !== act)
          : [...prev.preferredActivities, act],
      };
    });
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!loginId.trim() || !password) {
      setLoginError({ message: 'Please enter your Volunteer ID or email and password.' });
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
          expectedRole: 'volunteer',
        }),
      });

      if (res.success && res.token) {
        setAuthToken(res.token);
        if (res.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/volunteer/dashboard');
        }
      }
    } catch (err: any) {
      setLoginError({
        message: err.message || 'Invalid credentials. Please verify your Volunteer ID and password.',
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
        volunteerId: string;
        fullName: string;
        status: string;
        message: string;
      }>('/portal/register/volunteer', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
        }),
      });

      if (res.success) {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        setRegisteredVolunteer({
          volunteerId: res.volunteerId,
          fullName: res.fullName,
          message: res.message,
        });
      }
    } catch (err: any) {
      setRegisterError(err.message || 'Failed to submit registration.');
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
          <div className="w-16 h-16 rounded-3xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md border-2 border-emerald-300">
            <HeartHandshake className="w-8 h-8" />
          </div>
          <span className="text-[11px] uppercase tracking-widest text-emerald-800 font-bold bg-emerald-500/15 px-3 py-1 rounded-full inline-block">
            Volunteer Seva Portal
          </span>
          <h1 className="text-3xl font-display font-bold text-foundation-charcoal">
            Vyenkatesh Ashram Volunteer Portal
          </h1>
          <p className="text-xs text-stone-600 max-w-md mx-auto">
            Access your volunteer activities, assigned tasks, participation history, and ashram Seva records.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-stone-200/80 p-1.5 rounded-2xl max-w-md mx-auto">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'login'
                ? 'bg-white text-emerald-900 shadow-sm'
                : 'text-stone-600 hover:text-foundation-charcoal'
            }`}
          >
            Volunteer Login
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'register'
                ? 'bg-white text-emerald-900 shadow-sm'
                : 'text-stone-600 hover:text-foundation-charcoal'
            }`}
          >
            Register as Volunteer
          </button>
        </div>

        {/* =========================================================================
            TAB 1: LOGIN FORM
           ========================================================================= */}
        {activeTab === 'login' && (
          <div className="bg-white rounded-3xl p-6 md:p-10 border border-foundation-borderMuted shadow-soft space-y-6 max-w-md mx-auto">
            <div className="border-b pb-3">
              <h2 className="text-lg font-display font-bold text-foundation-charcoal">
                Sign In to Volunteer Portal
              </h2>
              <p className="text-xs text-stone-500">
                Enter your Volunteer ID (e.g. <span className="font-mono font-bold text-emerald-700">SSBM-VOL-2026-XXXX</span>) or registered email.
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
                  Volunteer ID or Mobile / Email *
                </label>
                <input
                  type="text"
                  required
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  placeholder="SSBM-VOL-2026-XXXX or email"
                  className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 text-xs text-foundation-charcoal focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-stone-700">
                    Password *
                  </label>
                  <span className="text-[10px] text-stone-400">
                    Initial format: Name (4 letters) + Birth Year
                  </span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 text-xs text-foundation-charcoal focus:ring-2 focus:ring-emerald-600 focus:outline-none pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-full shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isLoggingIn ? 'Authenticating...' : 'Sign In to Volunteer Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="text-center pt-2 border-t border-stone-100">
              <p className="text-xs text-stone-500">
                New to volunteering?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="font-bold text-emerald-700 hover:underline cursor-pointer"
                >
                  Register as Volunteer
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
                Volunteer Seva Registration
              </h2>
              <p className="text-xs text-stone-500">
                Join our dedicated circle of volunteers at Vyenkatesh Ashram. We coordinate meaningful seva activities in elder companion care, Gaushala, and healthcare camps.
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
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Pooja Kulkarni"
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
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
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Mobile Number (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="10-digit mobile number"
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
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
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Residential Address / City *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Locality and city"
                  className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Availability *
                  </label>
                  <select
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  >
                    <option value="Weekends (Saturday & Sunday)">Weekends (Saturday & Sunday)</option>
                    <option value="Weekdays Morning (08 AM - 12 PM)">Weekdays Morning (08 AM - 12 PM)</option>
                    <option value="Weekdays Evening (04 PM - 07 PM)">Weekdays Evening (04 PM - 07 PM)</option>
                    <option value="Monthly / Event Based">Monthly / Event Based</option>
                    <option value="Full-Time Resident Seva">Full-Time Resident Seva</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Skills / Professional Background
                  </label>
                  <input
                    type="text"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    placeholder="e.g. Teaching, Nursing, Music, Cooking, Yoga"
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-2">
                  Preferred Volunteer Activities
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activityOptions.map(activity => (
                    <label
                      key={activity}
                      className="flex items-center space-x-2 p-2 bg-foundation-warmGray rounded-xl text-xs text-stone-700 hover:bg-stone-200/60 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.preferredActivities.includes(activity)}
                        onChange={() => handleToggleActivity(activity)}
                        className="rounded text-emerald-700 focus:ring-emerald-700"
                      />
                      <span>{activity}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Prior Experience or Special Message
                </label>
                <textarea
                  rows={2}
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  placeholder="Share any past volunteer work or reason for joining..."
                  className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="p-3 bg-emerald-500/10 border border-emerald-200 rounded-2xl text-[11px] text-emerald-950 leading-relaxed">
                <strong>Initial Login Credentials:</strong> Format is <strong>First 4 uppercase letters of your name + birth year</strong> (e.g. <code className="font-bold font-mono">POOJ1998</code>). Upon review and approval by the ashram coordinator, you can log in to view assigned activities.
              </div>

              <button
                type="submit"
                disabled={isRegistering}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-full shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isRegistering ? 'Generating Volunteer ID & Submitting...' : 'Register as Volunteer'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* =========================================================================
            CONFIRMATION MODAL ON SUCCESSFUL REGISTRATION
           ========================================================================= */}
        {registeredVolunteer && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border-2 border-emerald-500/40 space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="text-center space-y-1">
                <h3 className="font-display font-bold text-xl text-foundation-charcoal">
                  Volunteer ID Generated!
                </h3>
                <p className="text-xs text-stone-500">
                  Registration recorded for <strong>{registeredVolunteer.fullName}</strong>
                </p>
              </div>

              <div className="p-4 bg-foundation-warmGray rounded-2xl border border-foundation-borderMuted space-y-2 text-center">
                <span className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">
                  Permanent Volunteer ID
                </span>
                <div className="flex items-center justify-center space-x-2">
                  <span className="font-mono font-bold text-xl text-emerald-800">
                    {registeredVolunteer.volunteerId}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(registeredVolunteer.volunteerId)}
                    className="p-1.5 rounded-lg bg-white border hover:bg-stone-100 text-stone-600 transition-colors cursor-pointer"
                    title="Copy Volunteer ID"
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
                  Our volunteer coordinator will review your preferences and assign you to upcoming seva sessions. You can log in using your <strong>Volunteer ID</strong> once approved.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setLoginId(registeredVolunteer.volunteerId);
                  setRegisteredVolunteer(null);
                  setActiveTab('login');
                }}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-full shadow transition-all cursor-pointer"
              >
                Proceed to Volunteer Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
