import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Heart, Shield, Lock, AlertCircle, CheckCircle2,
  ArrowRight, FileCheck, HelpCircle, Phone, Info, RefreshCw
} from 'lucide-react';
import { apiRequest, setAuthToken } from '../../api';
import { PasswordField } from '../../components/ui/PasswordField';

export const AdmissionPortal: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Pre-fill registration ID if passed in query param
  const initialRegId = searchParams.get('regId') || '';

  const [registrationId, setRegistrationId] = useState(initialRegId);
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<{ message: string; code?: string } | null>(null);

  // Password reset modal state
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetId, setResetId] = useState(initialRegId);
  const [resetMobile, setResetMobile] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!registrationId.trim() || !password) {
      setLoginError({ message: 'Please enter your Admission Registration ID and password.' });
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
          loginId: registrationId.trim(),
          password,
          expectedRole: 'admission_applicant',
        }),
      });

      if (res.success && res.token) {
        setAuthToken(res.token);
        if (res.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/admission-dashboard');
        }
      }
    } catch (err: any) {
      setLoginError({
        message: err.message || 'Invalid Admission Registration ID or password.',
        code: err.code,
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetMessage(null);

    if (!resetId.trim() || !resetMobile.trim()) {
      setResetMessage({ type: 'error', text: 'Please enter your Registration ID and registered guardian mobile number.' });
      return;
    }

    setIsResetting(true);
    try {
      const res = await apiRequest<{ success: boolean; message: string }>('/portal/reset-password', {
        method: 'POST',
        body: JSON.stringify({
          loginId: resetId.trim(),
          mobile: resetMobile.trim(),
        }),
      });

      if (res.success) {
        setResetMessage({
          type: 'success',
          text: res.message || 'Password reset successfully to initial default credential format (Guardian Name + Birth Year).'
        });
      }
    } catch (err: any) {
      setResetMessage({ type: 'error', text: err.message || 'Password reset failed. Please verify your details or call the ashram office.' });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-foundation-ivory py-12 md:py-16">
      <div className="max-w-xl mx-auto px-4 md:px-6 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
            <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
            <span>Vyenkatesh Senior Sanctuary • Admission Tracking</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foundation-charcoal">
            Admission Status Login
          </h1>
          <p className="text-xs md:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
            Sign in with your system-generated Admission Registration ID to check review status, review administrative remarks, or update requested documents.
          </p>
        </div>

        {/* Credentials Format Guidance Card */}
        <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-4 text-xs text-emerald-950 space-y-2">
          <div className="flex items-center space-x-2 font-bold text-emerald-900">
            <Info className="w-4 h-4 text-emerald-700 flex-shrink-0" />
            <span>Initial Credential Format:</span>
          </div>
          <p className="text-stone-700 leading-relaxed">
            Your login credential was automatically created when you submitted your admission enquiry:
          </p>
          <div className="bg-white/80 rounded-xl p-3 border border-emerald-100 font-mono text-[11px] space-y-1">
            <p><strong>Login ID:</strong> Registration ID (e.g. <span className="text-emerald-800 font-bold">SSBM-ADM-2026-XXXX</span>)</p>
            <p><strong>Default Password:</strong> Guardian's First Name + Birth Year (e.g. <span className="text-emerald-800 font-bold">Rahul1985</span>)</p>
          </div>
          <p className="text-[11px] text-stone-500 italic">
            * You will be encouraged to customize your password upon initial login.
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-foundation-borderMuted shadow-soft space-y-6">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-foundation-forest" />
              <h2 className="text-base font-display font-bold text-foundation-charcoal">
                Applicant & Guardian Sign In
              </h2>
            </div>
            <Link
              to="/admission"
              className="text-xs font-bold text-foundation-forest hover:underline flex items-center space-x-1"
            >
              <span>Apply / New Form</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loginError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold">{loginError.message}</p>
                {loginError.code === 'ACCOUNT_SUSPENDED' && (
                  <p className="text-[11px]">Please reach out to the ashram office directly at +91 98908 98081 for assistance.</p>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Admission Registration ID *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  id="admission-registration-id-input"
                  value={registrationId}
                  onChange={(e) => setRegistrationId(e.target.value)}
                  placeholder="e.g. SSBM-ADM-2026-0042"
                  className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 text-xs text-foundation-charcoal font-medium tracking-wide uppercase focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                />
              </div>
              <p className="text-[10px] text-stone-500 mt-1">
                Provided on your enquiry submission confirmation screen.
              </p>
            </div>

            <PasswordField
              label="Password *"
              id="admission-password-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="e.g. Rahul1985 (Guardian Name + Birth Year)"
              required
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowResetModal(true);
                  setResetId(registrationId);
                  setResetMessage(null);
                }}
                className="text-stone-500 hover:text-foundation-forest underline font-medium"
              >
                Forgot Password or Reset to Default?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              id="admission-login-btn"
              className="w-full py-3 bg-foundation-forest hover:bg-foundation-forestLight disabled:opacity-50 text-foundation-ivory font-bold text-xs rounded-full shadow-lg transition-all flex items-center justify-center space-x-2"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Admission Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Help Footer */}
          <div className="pt-4 border-t border-foundation-borderMuted text-center space-y-2 text-xs text-stone-500">
            <p>
              Haven't submitted an admission enquiry yet?{' '}
              <Link to="/admission" className="font-bold text-foundation-forest hover:underline">
                Submit an Online Enquiry
              </Link>
            </p>
            <p className="text-[11px] text-stone-400">
              Direct Ashram Helpline: <a href="tel:+919890898081" className="text-stone-600 font-semibold underline">+91 98908 98081</a> (9:00 AM – 7:00 PM)
            </p>
          </div>
        </div>

        {/* Reset Password Modal */}
        {showResetModal && (
          <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 space-y-5 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center space-x-2">
                  <Lock className="w-5 h-5 text-foundation-forest" />
                  <h3 className="font-display font-bold text-base text-foundation-charcoal">
                    Reset Admission Password
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="text-stone-400 hover:text-stone-600 text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed">
                Enter your Admission Registration ID and registered guardian phone number. The system will reset your password to your initial credential formula (<strong>Guardian's First Name + Birth Year</strong>).
              </p>

              {resetMessage && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-start space-x-2 ${
                    resetMessage.type === 'success'
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                      : 'bg-rose-50 text-rose-900 border border-rose-200'
                  }`}
                >
                  {resetMessage.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  )}
                  <span>{resetMessage.text}</span>
                </div>
              )}

              <form onSubmit={handlePasswordReset} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Admission Registration ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={resetId}
                    onChange={(e) => setResetId(e.target.value)}
                    placeholder="e.g. SSBM-ADM-2026-0042"
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-3.5 py-2.5 text-xs text-foundation-charcoal font-mono uppercase focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Registered Guardian Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={resetMobile}
                    onChange={(e) => setResetMobile(e.target.value)}
                    placeholder="e.g. +91 98220 XXXXX"
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-3.5 py-2.5 text-xs text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowResetModal(false)}
                    className="px-4 py-2 border rounded-full text-stone-600 font-semibold hover:bg-stone-50"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={isResetting}
                    className="px-5 py-2 bg-foundation-forest text-foundation-ivory font-bold rounded-full shadow hover:bg-foundation-forestLight disabled:opacity-50 flex items-center space-x-1.5"
                  >
                    {isResetting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                    <span>Reset Password</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
