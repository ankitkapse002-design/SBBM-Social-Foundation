import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, Lock, MapPin, Eye, EyeOff,
  CheckCircle2, AlertCircle, ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { apiRequest, setAuthToken } from '../api';
import { PasswordField } from '../components/ui/PasswordField';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    address: '',
    emergencyContact: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.fullName || !formData.email || !formData.mobile || !formData.password) {
      setErrorMessage('Please fill in all mandatory fields (*).');
      return;
    }

    if (formData.password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await apiRequest<{
        success: boolean;
        token: string;
        user: { id: string; fullName: string; role: string; memberId: string };
        message: string;
      }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          mobile: formData.mobile,
          password: formData.password,
          address: formData.address,
          emergencyContact: formData.emergencyContact,
        }),
      });

      if (res.success && res.token) {
        setAuthToken(res.token);
        confetti({ particleCount: 80, spread: 60 });
        navigate('/member/dashboard');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please check your details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-foundation-ivory py-16 flex items-center justify-center px-4">
      <div className="max-w-xl w-full bg-white rounded-3xl p-8 md:p-10 border border-foundation-borderMuted shadow-soft space-y-6">
        <div className="text-center space-y-2">
          <img
            src="/assets/images/logo.jpg"
            alt="SBBM Social Foundation"
            className="w-16 h-16 rounded-full mx-auto border-2 border-foundation-gold shadow-md"
          />
          <span className="text-[11px] uppercase tracking-widest text-foundation-forest font-bold">
            Create Website Account
          </span>
          <h1 className="text-2xl font-display font-bold text-foundation-charcoal">
            Register as a Community Member
          </h1>
          <p className="text-xs text-stone-500">
            Track admission enquiries, seva applications, and receive updates.
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
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="e.g. Ramesh Deshmukh"
              className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 text-xs text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                placeholder="+91 98220 XXXXX"
                className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 text-xs text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PasswordField
              label="Create Secure Password *"
              sublabel="Min 8 chars"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
            />

            <PasswordField
              label="Confirm Password *"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Residential Address (Optional)
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="City, Area, Pincode"
              className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 text-xs text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Emergency Contact Phone (Optional)
            </label>
            <input
              type="tel"
              value={formData.emergencyContact}
              onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
              placeholder="Contact number for urgent notifications"
              className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 text-xs text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-foundation-forest hover:bg-foundation-forestLight disabled:opacity-50 text-foundation-ivory font-bold text-xs rounded-full shadow-md transition-all flex items-center justify-center space-x-2"
            id="register-submit-btn"
          >
            {isLoading ? <span>Creating Account...</span> : <span>Create Account</span>}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-foundation-borderMuted text-xs text-stone-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-foundation-forest hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};
