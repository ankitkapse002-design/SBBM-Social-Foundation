import React, { useState } from 'react';
import {
  Heart, CheckCircle2, Sparkles,
  FileCheck, Briefcase, Copy, Check, QrCode, CreditCard
} from 'lucide-react';
import { SEO } from '../components/common/SEO';

export const Support: React.FC = () => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const donateJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DonateAction',
    'agent': {
      '@type': 'NGO',
      'name': 'SBBM Social Foundation',
      'url': 'https://sbbmsocialfoundation.org',
    },
    'recipient': {
      '@type': 'NGO',
      'name': 'SBBM Social Foundation',
      'taxID': 'AAQTS3445R',
    },
    'description': 'Direct philanthropic contributions eligible for 50% income tax exemption under Section 80G of the Income Tax Act 1961.',
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] py-10 sm:py-14 md:py-16 font-sans">
      <SEO
        title="Donate & Support | 80G Tax Exempt Contributions"
        description="Contribute to SBBM Social Foundation for elder care, free Annadaan meals, and Go-Seva. All donations qualify for 50% tax exemption under Section 80G. Verified Axis Bank & UPI details."
        canonicalPath="/support"
        jsonLd={donateJsonLd}
      />
      <div className="max-w-5xl mx-auto px-4 md:px-8 space-y-8 sm:space-y-12">
        {/* Full-Width Visual Photographic Header Banner */}
        <div className="relative rounded-3xl overflow-hidden border border-[#1E293B] shadow-card bg-[#0A111A] text-white p-6 sm:p-10 md:p-16 text-center">
          <div className="absolute inset-0 z-0">
            <img
              src="/assets/images/ashram/ashram_campus_life.jpg"
              alt="Vyenkatesh Ashram Mahuli Campus Seva"
              className="w-full h-full object-cover object-center scale-105"
            />
            {/* Calibrated dark overlay: residents & campus clearly visible while text is 100% readable */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A111A]/90 via-[#0A111A]/75 to-[#0A111A]/92" />
          </div>

          <div className="relative z-10 space-y-3 sm:space-y-5 max-w-3xl mx-auto">
            <div className="inline-flex flex-wrap items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0E1726]/80 backdrop-blur-md text-[#C5A059] text-xs sm:text-sm font-bold border border-[#C5A059]/30">
              <Heart className="w-4 h-4 text-[#C5A059] fill-[#C5A059] shrink-0" />
              <span>12A &amp; 80G Certified Non-Profit Charitable Organization</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white tracking-tight drop-shadow-sm leading-tight">
              Support SBBM Social Foundation
            </h1>

            <p className="text-sm sm:text-base md:text-[17px] text-slate-200 leading-relaxed max-w-2xl mx-auto">
              Your generous contribution directly sustains wholesome daily meals for elderly residents at Vyenkatesh Ashram, cattle care at Shri Go Seva Kendra, rural computer literacy, and grassroots relief for vulnerable families.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs sm:text-sm font-bold text-slate-200">
              <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/15">
                🏛️ Societies: MAH/332/15/NAG
              </span>
              <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/15">
                📜 Trust: F-33193
              </span>
              <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/15">
                🛡️ Section 80G Tax Exemption
              </span>
              <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/15">
                📋 PAN: AAQTS3445R
              </span>
            </div>
          </div>
        </div>

        {/* 80G & CSR Highlights Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8" id="csr">
          <div className="bg-gradient-to-br from-foundation-crimson to-foundation-crimsonDark text-white p-6 sm:p-8 md:p-10 rounded-3xl shadow-soft space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-foundation-gold text-xs font-bold">
              <FileCheck className="w-4 h-4" />
              <span>Section 80G Tax Exemption</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold">
              50% Income Tax Deduction for Donors
            </h2>
            <p className="text-sm sm:text-[15px] text-stone-200 leading-relaxed">
              Monetary donations made to SBBM Social Foundation qualify for tax deductions under Section 80G of the Income Tax Act, 1961. We issue official stamped donation receipts and Form 10BE tax certificates for all eligible contributions.
            </p>
            <div className="pt-2 text-sm text-foundation-gold font-semibold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Official 80G receipts issued promptly with digital copy</span>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 md:p-10 rounded-3xl border border-foundation-borderMuted shadow-soft space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-bold">
                <Briefcase className="w-4 h-4 text-blue-700" />
                <span>CSR Opportunities (Schedule VII)</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-foundation-charcoal">
                Corporate Social Responsibility
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                Corporate partners can collaborate with SBBM Social Foundation across approved Schedule VII domains of the Companies Act, 2013:
              </p>
              <ul className="text-sm text-stone-600 space-y-1.5 list-disc pl-5">
                <li>Eradicating hunger, poverty &amp; malnutrition (Item i)</li>
                <li>Promoting education &amp; digital literacy (Item ii)</li>
                <li>Women empowerment &amp; senior care homes (Item iii)</li>
                <li>Animal welfare &amp; environmental sustainability (Item iv)</li>
              </ul>
            </div>
            <div className="text-xs sm:text-sm font-bold text-foundation-crimson pt-1">
              Contact us for CSR proposals: <a href="mailto:sbbmsocialfoundation@gmail.com" className="underline">sbbmsocialfoundation@gmail.com</a>
            </div>
          </div>
        </div>

        {/* =========================================================================
            OFFICIAL DONATE NOW & BANK DETAILS SECTION
           ========================================================================= */}
        <section id="donate-now" className="space-y-8 scroll-mt-24">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs sm:text-sm font-bold border border-emerald-200">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Direct Philanthropic Support &amp; Tax-Deductible Contributions</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foundation-charcoal">
              Donate to Support SBBM Social Foundation &amp; Vyenkatesh Ashram
            </h2>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              Vyenkatesh Ashram is supported by the kind-hearted members of society and runs independently through charitable contributions to provide dignified shelter, wholesome vegetarian Annadaan meals, and lifelong healthcare for destitute and solitary elders totally free of cost.
            </p>
          </div>

          {/* Official Bank Account & UPI Payment Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
            {/* Column A: Genuine UPI QR Code Scanner (5 Cols) */}
            <div className="lg:col-span-5 bg-gradient-to-b from-[#9B1B22] to-[#7D131A] text-white p-6 sm:p-8 rounded-3xl shadow-soft flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold">
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Instant UPI Payment</span>
                  </div>
                  <span className="text-xs text-stone-200 font-semibold">Zero Fees</span>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-display font-bold">
                    Scan Genuine Donation QR Code
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-200 mt-1">
                    Scan with Google Pay, PhonePe, Paytm, BHIM, Axis Mobile, or any UPI app.
                  </p>
                </div>

                {/* Genuine QR Code Image */}
                <div className="bg-white p-3 sm:p-4 rounded-2xl shadow-lg max-w-[220px] sm:max-w-[260px] mx-auto border-2 border-amber-300/40">
                  <img
                    src="/assets/images/donation_qr_code.jpg"
                    alt="Official SBBM Social Foundation UPI Donation QR Code"
                    className="w-full h-auto object-contain rounded-lg"
                  />
                  <div className="text-center pt-2">
                    <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block">
                      SBBM Social Foundation
                    </span>
                  </div>
                </div>

                {/* Copyable UPI ID Box */}
                <div className="bg-white/10 backdrop-blur-sm p-3.5 rounded-2xl border border-white/15 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-bold tracking-wider text-amber-200">
                      Official UPI ID
                    </span>
                    {copiedField === 'upi' && (
                      <span className="text-xs text-emerald-300 font-bold flex items-center space-x-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied!</span>
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-black/25 p-3 rounded-xl gap-2">
                    <span className="font-mono text-sm sm:text-base text-white font-semibold select-all break-all">
                      sbbmsocialfoundation@okhdfcbank
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('sbbmsocialfoundation@okhdfcbank', 'upi')}
                      className="self-start sm:self-auto min-h-[44px] px-4 py-2 bg-white hover:bg-stone-100 text-[#9B1B22] rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center space-x-1.5 shrink-0 cursor-pointer shadow-xs"
                      title="Copy UPI ID"
                    >
                      {copiedField === 'upi' ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedField === 'upi' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-amber-200/90 leading-tight border-t border-white/10 pt-3 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-300" />
                <span>Eligible for 50% Tax Deduction under Section 80G.</span>
              </div>
            </div>

            {/* Column B: Bank Account Details Cards (7 Cols) */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 md:p-10 rounded-3xl border border-stone-200 shadow-soft flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 flex-wrap gap-2">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-bold">
                    <CreditCard className="w-4 h-4 text-blue-700" />
                    <span>Direct Bank Transfer (NEFT / RTGS / IMPS)</span>
                  </div>
                  <span className="text-sm font-bold text-foundation-crimson">Axis Bank</span>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-display font-bold text-foundation-charcoal">
                    Official Foundation Bank Account
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-500 mt-1">
                    Please use these authentic bank details for direct online banking, NEFT, RTGS, IMPS, or branch cheque deposits.
                  </p>
                </div>

                {/* Bank Account Details Cards */}
                <div className="space-y-3">
                  {/* Account Name */}
                  <div className="p-3.5 sm:p-4 rounded-xl border border-stone-200 bg-stone-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                    <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Account Name</span>
                    <div className="sm:text-right text-sm font-bold text-stone-900">
                      VYENKATESH ASHRAM
                      <span className="block text-xs font-normal text-stone-500">Operated by SBBM Social Foundation</span>
                    </div>
                  </div>

                  {/* Bank Name */}
                  <div className="p-3.5 sm:p-4 rounded-xl border border-stone-200 bg-stone-50/70 flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Bank Name</span>
                    <span className="text-sm font-bold text-stone-900">AXIS BANK</span>
                  </div>

                  {/* Account Number with Copy */}
                  <div className="p-3.5 sm:p-4 rounded-xl border border-stone-300 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
                    <div>
                      <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Account Number</span>
                      <span className="font-mono text-base sm:text-lg font-bold text-stone-900 tracking-wider">920020067215309</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('920020067215309', 'acc')}
                      className="self-start sm:self-auto min-h-[44px] px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center space-x-1.5 cursor-pointer shadow-2xs"
                      title="Copy Account Number"
                    >
                      {copiedField === 'acc' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedField === 'acc' ? 'Copied' : 'Copy Number'}</span>
                    </button>
                  </div>

                  {/* IFSC Code with Copy */}
                  <div className="p-3.5 sm:p-4 rounded-xl border border-stone-300 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
                    <div>
                      <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">IFSC Code</span>
                      <span className="font-mono text-base sm:text-lg font-bold text-stone-900 tracking-wider">UTIB0001674</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('UTIB0001674', 'ifsc')}
                      className="self-start sm:self-auto min-h-[44px] px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center space-x-1.5 cursor-pointer shadow-2xs"
                      title="Copy IFSC Code"
                    >
                      {copiedField === 'ifsc' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedField === 'ifsc' ? 'Copied' : 'Copy IFSC'}</span>
                    </button>
                  </div>

                  {/* Branch Address */}
                  <div className="p-3.5 sm:p-4 rounded-xl border border-stone-200 bg-stone-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                    <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Branch Address</span>
                    <span className="text-sm font-medium text-stone-800">GANDHIBAG, NAGPUR BRANCH</span>
                  </div>
                </div>

                {/* 80G Tax Receipt Instructions */}
                <div className="bg-stone-50 p-4 sm:p-5 rounded-2xl border border-stone-200 text-xs sm:text-sm text-stone-700 space-y-2.5">
                  <div className="font-bold text-stone-900 flex items-center space-x-2 text-sm">
                    <FileCheck className="w-4 h-4 text-foundation-crimson shrink-0" />
                    <span>How to Claim Your Official Section 80G Tax Receipt:</span>
                  </div>
                  <ol className="list-decimal pl-5 space-y-1.5 text-stone-600 leading-relaxed">
                    <li>Complete your transfer via UPI or Net Banking (Axis Bank A/C).</li>
                    <li>Share the transaction screenshot / UTR number along with your <strong>Full Name, PAN Card Number, and Postal Address</strong>.</li>
                    <li>Send details via WhatsApp / Call to <a href="tel:+919890898081" className="font-bold text-foundation-crimson underline">+91 98908 98081</a> / <a href="tel:+919326172824" className="font-bold text-foundation-crimson underline">+91 93261 72824</a>, or email to <a href="mailto:vyenkateshashram2017@gmail.com" className="font-bold text-foundation-crimson underline">vyenkateshashram2017@gmail.com</a>.</li>
                  </ol>
                  <p className="text-xs text-stone-500 italic pt-1 border-t border-stone-200">
                    Your official stamped 80G receipt and Form 10BE tax certificate will be generated and issued promptly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
