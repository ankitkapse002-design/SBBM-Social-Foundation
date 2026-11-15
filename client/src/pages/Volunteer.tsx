import React, { useState } from 'react';
import {
  Heart, CheckCircle2,
  Coffee, BookOpen, Sun
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { apiRequest } from '../api';
import { SEO } from '../components/common/SEO';

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
    <div className="min-h-screen bg-foundation-ivory py-10 sm:py-14 md:py-16 font-sans">
      <SEO
        title="Volunteer & Community Seva | Get Involved"
        description="Volunteer your time with SBBM Social Foundation in Nagpur and Mahuli. Participate in elderly companionship, daily Annadaan distribution, tree plantation, and Go-Seva."
        canonicalPath="/volunteer"
      />
      <div className="max-w-4xl mx-auto px-4 md:px-8 space-y-8 sm:space-y-12">
        <div className="text-center space-y-3 sm:space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-foundation-forest/10 text-foundation-forest text-xs sm:text-sm font-bold">
            <Heart className="w-4 h-4 text-rose-600" />
            <span>Helping Hands Seva Network</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foundation-charcoal">
            Volunteer with SBBM Social Foundation
          </h1>
          <p className="text-sm sm:text-base md:text-[17px] text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Spend meaningful time with our elderly residents, share stories, assist in our Gaushala, and bring warmth and joy to senior lives.
          </p>
        </div>

        {/* Volunteer Seva Impact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-foundation-borderMuted shadow-soft text-center space-y-2.5">
            <BookOpen className="w-9 h-9 text-foundation-forest mx-auto" />
            <h3 className="font-bold text-base sm:text-lg text-foundation-charcoal">Companionship</h3>
            <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
              Read Marathi/Hindi newspapers, listen to life stories, and play carrom with residents.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-foundation-borderMuted shadow-soft text-center space-y-2.5">
            <Sun className="w-9 h-9 text-amber-600 mx-auto" />
            <h3 className="font-bold text-base sm:text-lg text-foundation-charcoal">Go-Seva &amp; Nature</h3>
            <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
              Help care for our Gir cows, tend to the medicinal Tulsi garden, and assist tree care.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-foundation-borderMuted shadow-soft text-center space-y-2.5">
            <Coffee className="w-9 h-9 text-rose-600 mx-auto" />
            <h3 className="font-bold text-base sm:text-lg text-foundation-charcoal">Cultural Seva</h3>
            <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
              Sing bhajans, celebrate Diwali, Sankranti and birthdays with our residents and elders.
            </p>
          </div>
        </div>

        {/* Volunteer Application Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-12 border border-foundation-borderMuted shadow-soft space-y-6 sm:space-y-8">
          <div className="border-b border-foundation-borderMuted pb-4 space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foundation-charcoal">
              Volunteer Seva Registration
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Fill in your contact info and areas of interest. Our volunteer coordinator will connect with you.
            </p>
          </div>

          {successMessage ? (
            <div className="p-6 sm:p-8 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-emerald-900 text-lg sm:text-xl">Seva Application Received!</h3>
              <p className="text-sm sm:text-base text-emerald-800 max-w-md mx-auto">{successMessage}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm sm:text-[15px] font-bold text-stone-800 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Pooja Kulkarni"
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-3 min-h-[48px] text-[16px] text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm sm:text-[15px] font-bold text-stone-800 mb-2">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +91 98230 XXXXX"
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-3 min-h-[48px] text-[16px] text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm sm:text-[15px] font-bold text-stone-800 mb-2">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. pooja@example.com"
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-3 min-h-[48px] text-[16px] text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm sm:text-[15px] font-bold text-stone-800 mb-2">
                    Your Availability
                  </label>
                  <select
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-3 min-h-[48px] text-[16px] text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                  >
                    <option value="Weekends (Saturday & Sunday)">Weekends (Saturday &amp; Sunday)</option>
                    <option value="Weekday Mornings">Weekday Mornings</option>
                    <option value="Weekday Evenings">Weekday Evenings</option>
                    <option value="Monthly / Special Occasions">Monthly / Special Occasions</option>
                    <option value="Flexible / As Needed">Flexible / As Needed</option>
                  </select>
                </div>
              </div>

              {/* Areas of Interest */}
              <div>
                <label className="block text-sm sm:text-[15px] font-bold text-stone-800 mb-2.5">
                  Areas of Interest (Select all that apply):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {availableAreas.map((area, idx) => (
                    <label
                      key={idx}
                      className="flex items-center space-x-3 text-sm text-stone-700 p-3.5 min-h-[48px] rounded-xl border border-foundation-borderMuted bg-foundation-warmGray/40 hover:bg-foundation-warmGray cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={formData.areasOfInterest.includes(area)}
                        onChange={() => handleCheckboxChange(area)}
                        className="rounded text-foundation-forest focus:ring-foundation-forest w-5 h-5 shrink-0"
                      />
                      <span>{area}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm sm:text-[15px] font-bold text-stone-800 mb-2">
                  Message / Special Skills (Optional)
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us a little about yourself or how you would like to contribute..."
                  className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-3 text-[16px] text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                />
              </div>

              <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-foundation-borderMuted">
                <span className="text-xs sm:text-sm text-stone-500 text-center sm:text-left">
                  Volunteering is non-remunerated charitable seva.
                </span>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto px-8 py-3.5 min-h-[48px] bg-foundation-forest hover:bg-foundation-forestLight disabled:opacity-50 text-foundation-ivory font-bold text-sm sm:text-base rounded-full shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
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
