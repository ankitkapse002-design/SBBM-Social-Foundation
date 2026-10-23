import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Award, Shield, Lock, Eye, EyeOff, AlertCircle, CheckCircle2,
  Copy, Check, ArrowRight, Briefcase, MapPin, Calendar, Heart, FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { apiRequest, setAuthToken } from '../../api';

export const MembershipPortal: React.FC = () => {
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

  // Application State
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    mobile: '',
    email: '',
    address: '',
    qualifications: '',
    skills: '',
    areasOfInterest: ['Elder Welfare & Healthcare'],
    availability: 'Flexible (5-10 hrs/month)',
    occupation: '',
    membershipTier: 'Active Member' as 'Active Member' | 'Life Member' | 'Patron' | 'Executive Member',
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [registeredMember, setRegisteredMember] = useState<{
    membershipId: string;
    fullName: string;
    message: string;
  } | null>(null);
  const [hasCopiedId, setHasCopiedId] = useState(false);

  const interestOptions = [
    'Elder Welfare & Healthcare',
    'Go-Seva & Environmental Protection',
    'Naturopathy & Holistic Wellness',
    'Rural Child Education & Digital Literacy',
    'Foundation Governance & Project Leadership',
  ];

  const handleToggleInterest = (interest: string) => {
    setFormData(prev => {
      const exists = prev.areasOfInterest.includes(interest);
      return {
        ...prev,
        areasOfInterest: exists
          ? prev.areasOfInterest.filter(i => i !== interest)
          : [...prev.areasOfInterest, interest],
      };
    });
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!loginId.trim() || !password) {
      setLoginError({ message: 'Please enter your Membership ID or email and password.' });
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
          expectedRole: 'member',
        }),
      });

      if (res.success && res.token) {
        setAuthToken(res.token);
        if (res.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/membership/dashboard');
        }
      }
    } catch (err: any) {
      setLoginError({
        message: err.message || 'Invalid credentials. Please verify your Membership ID and password.',
        code: err.code,
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');

    if (!formData.fullName.trim() || !formData.dob || !formData.mobile.trim() || !formData.email.trim() || !formData.address.trim()) {
      setRegisterError('Full name, date of birth, mobile number, email, and address are required.');
      return;
    }

    setIsRegistering(true);
    try {
      const res = await apiRequest<{
        success: boolean;
        membershipId: string;
        fullName: string;
        status: string;
        message: string;
      }>('/portal/register/membership', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
        }),
      });

      if (res.success) {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        setRegisteredMember({
          membershipId: res.membershipId,
          fullName: res.fullName,
          message: res.message,
        });
      }
    } catch (err: any) {
      setRegisterError(err.message || 'Failed to submit application.');
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
          <div className="w-16 h-16 rounded-3xl bg-amber-600 text-white flex items-center justify-center mx-auto shadow-md border-2 border-foundation-gold">
            <Award className="w-8 h-8" />
          </div>
          <span className="text-[11px] uppercase tracking-widest text-amber-800 font-bold bg-amber-500/15 px-3 py-1 rounded-full inline-block">
            Foundation Membership Portal
          </span>
          <h1 className="text-3xl font-display font-bold text-foundation-charcoal">
            SBBM Foundation Society Membership
          </h1>
          <p className="text-xs text-stone-600 max-w-md mx-auto">
            Access your membership details, assigned projects, project team collaborations, and board announcements.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-stone-200/80 p-1.5 rounded-2xl max-w-md mx-auto">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'login'
                ? 'bg-white text-foundation-charcoal shadow-sm'
                : 'text-stone-600 hover:text-foundation-charcoal'
            }`}
          >
            Membership Login
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'register'
                ? 'bg-white text-foundation-charcoal shadow-sm'
                : 'text-stone-600 hover:text-foundation-charcoal'
            }`}
          >
            Apply for Membership
          </button>
        </div>

        {/* =========================================================================
            TAB 1: LOGIN FORM
           ========================================================================= */}
        {activeTab === 'login' && (
          <div className="bg-white rounded-3xl p-6 md:p-10 border border-foundation-borderMuted shadow-soft space-y-6 max-w-md mx-auto">
            <div className="border-b pb-3">
              <h2 className="text-lg font-display font-bold text-foundation-charcoal">
                Sign In to Membership Portal
              </h2>
              <p className="text-xs text-stone-500">
                Enter your Membership ID (e.g. <span className="font-mono font-bold text-amber-700">SSBM-MEM-2026-XXXX</span>) or email.
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
                  Membership ID or Registered Email *
                </label>
                <input
                  type="text"
                  required
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  placeholder="SSBM-MEM-2026-XXXX or email"
                  className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 text-xs text-foundation-charcoal focus:ring-2 focus:ring-amber-600 focus:outline-none"
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
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 text-xs text-foundation-charcoal focus:ring-2 focus:ring-amber-600 focus:outline-none pr-10"
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
                className="w-full py-3 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold rounded-full shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isLoggingIn ? 'Authenticating...' : 'Sign In to Membership Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="text-center pt-2 border-t border-stone-100">
              <p className="text-xs text-stone-500">
                Not a member yet?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="font-bold text-amber-700 hover:underline cursor-pointer"
                >
                  Apply for Membership
                </button>
              </p>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: APPLICATION FORM
           ========================================================================= */}
        {activeTab === 'register' && (
          <div className="bg-white rounded-3xl p-6 md:p-10 border border-foundation-borderMuted shadow-soft space-y-6">
            <div className="border-b pb-3">
              <h2 className="text-lg font-display font-bold text-foundation-charcoal">
                Society Membership Application
              </h2>
              <p className="text-xs text-stone-500">
                Apply for official membership in SBBM Social Foundation Society (Reg: 332-15-Nag). Your application will be issued a Membership ID and presented to the Executive Board.
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
                    placeholder="Full name as per Aadhaar/official ID"
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-amber-600 focus:outline-none"
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
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-amber-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="10-digit mobile number"
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-amber-600 focus:outline-none"
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
                    placeholder="name@example.com"
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-amber-600 focus:outline-none"
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
                  placeholder="Full residential address with city & pincode"
                  className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-amber-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Qualifications / Education
                  </label>
                  <input
                    type="text"
                    value={formData.qualifications}
                    onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                    placeholder="e.g. Graduate, MBA, MSW"
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-amber-600 focus:outline-none"
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
                    placeholder="e.g. Doctor, Engineer, Teacher"
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-amber-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Membership Category
                  </label>
                  <select
                    value={formData.membershipTier}
                    onChange={(e: any) => setFormData({ ...formData, membershipTier: e.target.value })}
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-amber-600 focus:outline-none"
                  >
                    <option value="Active Member">Active Member</option>
                    <option value="Life Member">Life Member</option>
                    <option value="Patron">Patron Member</option>
                    <option value="Executive Member">Executive Member</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Key Skills & Expertise (Comma Separated)
                </label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="e.g. Project Management, Healthcare, Legal, Accounting, Public Relations"
                  className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-amber-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-2">
                  Areas of Interest & Project Focus
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {interestOptions.map(interest => (
                    <label
                      key={interest}
                      className="flex items-center space-x-2 p-2 bg-foundation-warmGray rounded-xl text-xs text-stone-700 hover:bg-stone-200/60 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.areasOfInterest.includes(interest)}
                        onChange={() => handleToggleInterest(interest)}
                        className="rounded text-amber-700 focus:ring-amber-700"
                      />
                      <span>{interest}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-200 rounded-2xl text-[11px] text-amber-900 leading-relaxed">
                <strong>Initial Login Credentials:</strong> Initial credentials follow the format: <strong>First 4 uppercase letters of your name + birth year</strong> (e.g. <code className="font-bold font-mono">RAHU2003</code>). You will be required to change this upon first login after approval.
              </div>

              <button
                type="submit"
                disabled={isRegistering}
                className="w-full py-3 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold rounded-full shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isRegistering ? 'Generating Membership ID & Submitting...' : 'Submit Membership Application'}</span>
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
            <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border-2 border-amber-500/40 space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="text-center space-y-1">
                <h3 className="font-display font-bold text-xl text-foundation-charcoal">
                  Membership ID Generated!
                </h3>
                <p className="text-xs text-stone-500">
                  Application registered for <strong>{registeredMember.fullName}</strong>
                </p>
              </div>

              <div className="p-4 bg-foundation-warmGray rounded-2xl border border-foundation-borderMuted space-y-2 text-center">
                <span className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">
                  Permanent Membership ID
                </span>
                <div className="flex items-center justify-center space-x-2">
                  <span className="font-mono font-bold text-xl text-amber-800">
                    {registeredMember.membershipId}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(registeredMember.membershipId)}
                    className="p-1.5 rounded-lg bg-white border hover:bg-stone-100 text-stone-600 transition-colors cursor-pointer"
                    title="Copy Membership ID"
                  >
                    {hasCopiedId ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                {hasCopiedId && (
                  <p className="text-[10px] text-emerald-700 font-bold">Copied to clipboard!</p>
                )}
              </div>

              <div className="space-y-2 text-xs text-stone-600 bg-amber-50/70 p-3.5 rounded-xl border border-amber-200/60 leading-relaxed">
                <p>
                  <strong>Application Status:</strong> <span className="inline-block px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">PENDING APPROVAL</span>
                </p>
                <p>
                  Your application will be verified and assigned to specific projects by the administrator. Once approved, you can log in to view project milestones and assignments.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setLoginId(registeredMember.membershipId);
                  setRegisteredMember(null);
                  setActiveTab('login');
                }}
                className="w-full py-2.5 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold rounded-full shadow transition-all cursor-pointer"
              >
                Proceed to Membership Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
