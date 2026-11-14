import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck, Lock, User, Eye, EyeOff, AlertCircle,
  KeyRound, CheckCircle2, ArrowRight
} from 'lucide-react';
import { apiRequest, setAuthToken } from '../api';
import { PasswordField } from '../components/ui/PasswordField';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    document.title = 'Authorized Administrative Login | SBBM Social Foundation';
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.setAttribute('name', 'robots');
      document.head.appendChild(metaRobots);
    }
    metaRobots.setAttribute('content', 'noindex, nofollow');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username || !password) {
      setErrorMessage('Username and password are required.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await apiRequest<{
        success: boolean;
        token: string;
        user: {
          id: string;
          username: string;
          role: string;
          mustChangePassword?: boolean;
        };
      }>('/auth/admin/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });

      if (res.success && res.token) {
        setAuthToken(res.token);
        navigate('/admin/dashboard');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid administrator credentials or access restricted.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-foundation-forestDark py-10 sm:py-16 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-foundation-ivory rounded-3xl p-6 sm:p-8 md:p-10 border-2 border-foundation-gold/40 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <img
            src="/assets/images/logo.jpg"
            alt="Official SBBM Social Foundation Logo"
            className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-[#C5A059] shadow-lg bg-white"
          />
          <span className="text-[10px] uppercase tracking-widest text-[#9B1B22] font-bold bg-[#FDF2F2] border border-[#FCDADA] px-3 py-1 rounded-full inline-block">
            Protected Administration
          </span>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-foundation-charcoal">
            Management Portal
          </h1>
          <p className="text-xs text-stone-500">
            For authorized foundation officials and trustees only.
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
              Administrator Username / Email
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Admin username"
                className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 min-h-[44px] text-xs sm:text-sm text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
              />
            </div>
          </div>

          <PasswordField
            label="Admin Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 min-h-[44px] bg-[#9B1B22] hover:bg-[#7D131A] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
            id="admin-login-submit-btn"
          >
            {isLoading ? <span>Authenticating...</span> : <span>Authorize Access</span>}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-foundation-borderMuted text-xs text-stone-500">
          <Link to="/" className="text-stone-600 hover:text-[#9B1B22] min-h-[44px] inline-flex items-center">
            ← Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
};
