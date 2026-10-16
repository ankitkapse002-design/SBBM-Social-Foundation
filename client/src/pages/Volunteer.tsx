import React, { useState } from 'react';
import {
  Heart, Users, CheckCircle2, Send,
  Sparkles, Coffee, BookOpen, Clock, Sun
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { apiRequest } from '../api';

export const Volunteer: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    availability: 'Weekends (Saturday & Sunday)',
    message: '',
    areasOfInterest: [] as string[],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const availableAreas = [
    'Elder Companionship & Conversation',
    'Reading Newspapers & Storytelling',
    'Go-Seva Kendra (Cow Care & Gaushala)',
    'Herbal Garden & Tree Plantation',
    'Bhajan, Music & Festival Organizing',
    'Health Camp & Naturopathy Support',
  ];

  const handleCheckboxChange = (area: string) => {
    setFormData((prev) => {
      const exists = prev.areasOfInterest.includes(area);
      if (exists) {
        return { ...prev, areasOfInterest: prev.areasOfInterest.filter((a) => a !== area) };
      } else {
        return { ...prev, areasOfInterest: [...prev.areasOfInterest, area] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.fullName || !formData.phone) {
      setErrorMessage('Full name and contact phone number are required.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await apiRequest<{ success: boolean; message: string }>('/enquiries/volunteer', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      if (res.success) {
        setSuccessMessage(res.message);
        confetti({ particleCount: 75, spread: 60 });
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit volunteer form.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-foundation-ivory py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 md:px-8 space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-foundation-forest/10 text-foundation-forest text-xs font-semibold">
            <Heart className="w-3.5 h-3.5 text-rose-600" />
            <span>Helping Hands Seva Network</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-foundation-charcoal">
            Volunteer with Vyenkatesh Ashram
          </h1>
          <p className="text-xs md:text-sm text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Spend meaningful time with our elderly residents, share stories, assist in our Gaushala, and bring warmth and joy to senior lives.
          </p>
        </div>

        {/* Volunteer Seva Impact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-foundation-borderMuted shadow-soft-sm text-center space-y-2">
            <BookOpen className="w-8 h-8 text-foundation-forest mx-auto" />
            <h3 className="font-bold text-sm text-foundation-charcoal">Companionship</h3>
            <p className="text-xs text-stone-500">
              Read Marathi/Hindi newspapers, listen to life stories, and play carrom with residents.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-foundation-borderMuted shadow-soft-sm text-center space-y-2">
            <Sun className="w-8 h-8 text-amber-600 mx-auto" />
            <h3 className="font-bold text-sm text-foundation-charcoal">Go-Seva & Nature</h3>
            <p className="text-xs text-stone-500">
              Help care for our Gir cows, tend to the medicinal Tulsi garden, and assist tree care.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-foundation-borderMuted shadow-soft-sm text-center space-y-2">
            <Coffee className="w-8 h-8 text-rose-600 mx-auto" />
            <h3 className="font-bold text-sm text-foundation-charcoal">Cultural Seva</h3>
            <p className="text-xs text-stone-500">
              Sing bhajans, celebrate Diwali, Sankranti and birthdays with our ashram family.
            </p>
          </div>
        </div>

        {/* Volunteer Application Form */}
        <div className="bg-white rounded-3xl p-6 md:p-10 border border-foundation-borderMuted shadow-soft space-y-6">
          <div className="border-b border-foundation-borderMuted pb-4 space-y-1">
            <h2 className="text-xl font-display font-bold text-foundation-charcoal">
              Volunteer Seva Registration
            </h2>
            <p className="text-xs text-stone-500">
              Fill in your contact info and areas of interest. Our volunteer coordinator will connect with you.
            </p>
          </div>

          {successMessage ? (
            <div className="p-8 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-emerald-900 text-lg">Seva Application Received!</h3>
              <p className="text-xs text-emerald-800 max-w-md mx-auto">{successMessage}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
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
                    placeholder="e.g. Pooja Kulkarni"
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 text-xs text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +91 98230 XXXXX"
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 text-xs text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
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
                    placeholder="e.g. pooja@example.com"
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 text-xs text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Your Availability
                  </label>
                  <select
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 text-xs text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                  >
                    <option value="Weekends (Saturday & Sunday)">Weekends (Saturday & Sunday)</option>
                    <option value="Weekday Mornings">Weekday Mornings</option>
                    <option value="Weekday Evenings">Weekday Evenings</option>
                    <option value="Monthly / Special Occasions">Monthly / Special Occasions</option>
                    <option value="Flexible / As Needed">Flexible / As Needed</option>
                  </select>
                </div>
              </div>

              {/* Areas of Interest */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-2">
                  Areas of Interest (Select all that apply):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {availableAreas.map((area, idx) => (
                    <label
                      key={idx}
                      className="flex items-center space-x-2 text-xs text-stone-700 p-2.5 rounded-xl border border-foundation-borderMuted bg-foundation-warmGray/40 hover:bg-foundation-warmGray cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.areasOfInterest.includes(area)}
                        onChange={() => handleCheckboxChange(area)}
                        className="rounded text-foundation-forest focus:ring-foundation-forest"
                      />
                      <span>{area}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Message / Special Skills (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us a little about yourself or how you would like to contribute..."
                  className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 text-xs text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-foundation-borderMuted">
                <span className="text-[11px] text-stone-500">
                  Volunteering is non-remunerated charitable seva.
                </span>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-3 bg-foundation-forest hover:bg-foundation-forestLight disabled:opacity-50 text-foundation-ivory font-bold text-xs rounded-full shadow-md transition-all flex items-center space-x-2"
                >
                  {isLoading ? <span>Submitting...</span> : <span>Join Volunteer Seva</span>}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
