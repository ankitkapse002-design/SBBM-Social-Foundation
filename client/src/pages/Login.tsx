import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Lock, Mail, Eye, EyeOff, ArrowRight, ShieldCheck,
  AlertCircle, CheckCircle2, User
} from 'lucide-react';
import { apiRequest, setAuthToken } from '../api';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!loginId || !password) {
      setErrorMessage('Please enter your email/mobile and password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await apiRequest<{
        success: boolean;
        token: string;
        user: {
          id: string;
          fullName: string;
          role: string;
          mustChangePassword?: boolean;
        };
      }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ loginId, password }),
      });

      if (res.success && res.token) {
        setAuthToken(res.token);
        if (res.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/member/dashboard');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid login credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-foundation-ivory py-16 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 md:p-10 border border-foundation-borderMuted shadow-soft space-y-6">
        <div className="text-center space-y-2">
          <img
            src="/assets/images/logo.jpg"
            alt="SBBM Social Foundation"
            className="w-16 h-16 rounded-full mx-auto border-2 border-foundation-gold shadow-md"
          />
          <span className="text-[11px] uppercase tracking-widest text-foundation-forest font-bold">
            Member Portal
          </span>
          <h1 className="text-2xl font-display font-bold text-foundation-charcoal">
            Sign In to Your Account
          </h1>
          <p className="text-xs text-stone-500">
            Access your profile, submitted enquiries, and member services.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Email Address or Mobile Number
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder="name@example.com or +91 98..."
                className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 text-xs text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 text-xs text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-foundation-forest hover:bg-foundation-forestLight disabled:opacity-50 text-foundation-ivory font-bold text-xs rounded-full shadow-md transition-all flex items-center justify-center space-x-2"
            id="member-login-submit-btn"
          >
            {isLoading ? <span>Signing In...</span> : <span>Sign In</span>}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-foundation-borderMuted space-y-2 text-xs text-stone-500">
          <p>
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-foundation-forest hover:underline">
              Create an Account
            </Link>
          </p>
          <p>
            Are you a foundation official?{' '}
            <Link to="/admin-login" className="font-bold text-foundation-gold hover:underline">
              Administrator Login →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
