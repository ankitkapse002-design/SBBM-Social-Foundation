import React, { useState } from 'react';
import {
  Heart, Shield, CheckCircle2, AlertCircle, Phone,
  Send, Package, Coffee, Sparkles, Building2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { apiRequest } from '../api';

export const Support: React.FC = () => {
  const [formData, setFormData] = useState({
    donorName: '',
    email: '',
    phone: '',
    donationType: 'groceries_provisions',
    amountOrItems: '',
    panNumber: '',
    address: '',
    message: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.donorName || !formData.phone || !formData.amountOrItems) {
      setErrorMessage('Donor name, phone number, and items/amount description are required.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await apiRequest<{ success: boolean; message: string; transparencyNotice: string }>(
        '/enquiries/donation',
        {
          method: 'POST',
          body: JSON.stringify(formData),
        }
      );

      if (res.success) {
        setSuccessMessage(res.message);
        confetti({ particleCount: 75, spread: 60 });
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit support enquiry.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-foundation-ivory py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 md:px-8 space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-foundation-forest/10 text-foundation-forest text-xs font-semibold">
            <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
            <span>Charitable Non-Granted Old Age Home Support</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-foundation-charcoal">
            Support Vyenkatesh Ashram
          </h1>
          <p className="text-xs md:text-sm text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Your generous contribution directly funds wholesome meals, shelter upkeep, healthcare essentials, and cattle care for senior citizens and cows.
          </p>
        </div>

        {/* In-Kind Seva Needs Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-display font-bold text-foundation-charcoal text-center">
            Most Needed Essential Contributions
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-foundation-borderMuted shadow-soft-sm space-y-2">
              <Package className="w-8 h-8 text-foundation-forest" />
              <h3 className="font-bold text-sm text-foundation-charcoal">Ration & Groceries</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Wheat flour (Atta), Rice, Toor/Moong dal, Cooking oil, Sugar, Tea leaves, and Spices for daily meals.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-foundation-borderMuted shadow-soft-sm space-y-2">
              <Sparkles className="w-8 h-8 text-amber-600" />
              <h3 className="font-bold text-sm text-foundation-charcoal">Go-Seva Cattle Feed</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Green grass, dry straw/fodder (Kadbi), cattle feed pellets, and mineral supplements for our Gir cows.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-foundation-borderMuted shadow-soft-sm space-y-2">
              <Heart className="w-8 h-8 text-rose-600" />
              <h3 className="font-bold text-sm text-foundation-charcoal">Medicines & Bedding</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Warm blankets, clean bedsheets, towels, first aid supplies, adult personal hygiene supplies.
              </p>
            </div>
          </div>
        </div>

        {/* Verified Transparency Notice */}
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 flex items-start space-x-3">
          <Shield className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Official Receipts & Direct Bank Verification:</p>
            <p>
              SBBM Social Foundation Society issues official printed receipts for every donation received. To protect well-wishers against fraudulent accounts, official society bank account details and UPI QR codes are verified directly through our authorized office phone: <a href="tel:+919890898081" className="underline font-bold">+91 98908 98081</a>.
            </p>
          </div>
        </div>

        {/* Donation Enquiry Form */}
        <div className="bg-white rounded-3xl p-6 md:p-10 border border-foundation-borderMuted shadow-soft space-y-6">
          <div className="border-b border-foundation-borderMuted pb-4 space-y-1">
            <h2 className="text-xl font-display font-bold text-foundation-charcoal">
              Submit Support / Donation Enquiry
            </h2>
            <p className="text-xs text-stone-500">
              Notify our administrative office of your intended contribution so we can assist with receipt issuance and logistics.
            </p>
          </div>

          {successMessage ? (
            <div className="p-8 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-emerald-900 text-lg">Thank You for Your Support!</h3>
              <p className="text-xs text-emerald-800 max-w-md mx-auto">{successMessage}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMessage && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Donor / Contributor Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.donorName}
                    onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
                    placeholder="e.g. Girish Deshmukh"
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 text-xs text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +91 97654 XXXXX"
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
                    placeholder="e.g. donor@example.com"
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 text-xs text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Type of Contribution *
                  </label>
                  <select
                    value={formData.donationType}
                    onChange={(e) => setFormData({ ...formData, donationType: e.target.value })}
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 text-xs text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                  >
                    <option value="groceries_provisions">Ration & Grocery Provisions</option>
                    <option value="gaushala_fodder">Go-Seva Cow Fodder / Grass</option>
                    <option value="cash_transfer">Direct Bank Contribution Enquiry</option>
                    <option value="medicines">Medicines & Senior Care Items</option>
                    <option value="bedding_clothing">Blankets, Bedsheets & Clothing</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Description of Items or Contribution Amount *
                </label>
                <input
                  type="text"
                  required
                  value={formData.amountOrItems}
                  onChange={(e) => setFormData({ ...formData, amountOrItems: e.target.value })}
                  placeholder="e.g. 50 kg Rice & 20 L Oil, or 500 kg green fodder for cows, or ₹5,000 for medicine fund"
                  className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 text-xs text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    PAN Number (Optional, for receipt records)
                  </label>
                  <input
                    type="text"
                    value={formData.panNumber}
                    onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
                    placeholder="e.g. ABCDE1234F"
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 text-xs text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    City / Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="e.g. Nagpur / Parseoni"
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 text-xs text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Special Notes or In-Memory Dedication (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="e.g. In loving memory of parents, or preferred delivery timing..."
                  className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 text-xs text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-foundation-borderMuted">
                <span className="text-[11px] text-stone-500">
                  Official receipts issued for all contributions.
                </span>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-3 bg-foundation-forest hover:bg-foundation-forestLight disabled:opacity-50 text-foundation-ivory font-bold text-xs rounded-full shadow-md transition-all flex items-center space-x-2"
                >
                  {isLoading ? <span>Recording Enquiry...</span> : <span>Submit Donation Enquiry</span>}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
