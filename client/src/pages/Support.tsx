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
    <div className="min-h-screen bg-[#fafaf8] py-12 md:py-16 font-sans">
      <SEO
        title="Donate & Support | 80G Tax Exempt Contributions"
        description="Contribute to SBBM Social Foundation for elder care, free Annadaan meals, and Go-Seva. All donations qualify for 50% tax exemption under Section 80G. Verified Axis Bank & UPI details."
        canonicalPath="/support"
        jsonLd={donateJsonLd}
      />
      <div className="max-w-5xl mx-auto px-4 md:px-8 space-y-12">
        {/* Full-Width Visual Photographic Header Banner */}
        <div className="relative rounded-3xl overflow-hidden border-2 border-stone-700/60 shadow-elevated bg-stone-950 text-white p-10 md:p-14 text-center">
          <div className="absolute inset-0 z-0">
            <img
              src="/assets/images/ashram/ashram_campus_life.jpg"
              alt="Vyenkatesh Ashram Mahuli Campus Seva"
              className="w-full h-full object-cover object-center scale-105"
            />
            {/* Calibrated dark overlay: residents & campus clearly visible while text is 100% readable */}
            <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-stone-950/65 to-stone-950/85" />
          </div>

          <div className="relative z-10 space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold border border-white/20">
              <Heart className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>12A & 80G Certified Non-Profit Charitable Organization</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight drop-shadow-sm">
              Support SBBM Social Foundation
            </h1>

            <p className="text-xs md:text-sm text-stone-200 leading-relaxed max-w-2xl mx-auto">
              Your generous contribution directly sustains wholesome daily meals for elderly residents at Vyenkatesh Ashram, cattle care at Shri Go Seva Kendra, rural computer literacy, and grassroots relief for vulnerable families.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-[11px] font-bold text-stone-200">
              <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/15">
                🏛️ Societies Regd: MAH/332/15/NAG
              </span>
              <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/15">
                📜 Trust Regd: F-33193
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="csr">
          <div className="bg-gradient-to-br from-foundation-crimson to-foundation-crimsonDark text-white p-6 md:p-8 rounded-3xl shadow-soft space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-foundation-gold text-xs font-bold">
              <FileCheck className="w-4 h-4" />
              <span>Section 80G Tax Exemption</span>
            </div>
            <h2 className="text-xl md:text-2xl font-display font-bold">
              50% Income Tax Deduction for Donors
            </h2>
            <p className="text-xs text-stone-200 leading-relaxed">
              Monetary donations made to SBBM Social Foundation qualify for tax deductions under Section 80G of the Income Tax Act, 1961. We issue official stamped donation receipts and Form 10BE tax certificates for all eligible contributions.
            </p>
            <div className="pt-2 text-xs text-foundation-gold font-semibold flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Official 80G receipts issued promptly with digital copy</span>
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-3xl border border-foundation-borderMuted shadow-soft space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-bold">
                <Briefcase className="w-4 h-4 text-blue-700" />
                <span>CSR Opportunities (Schedule VII)</span>
              </div>
              <h2 className="text-xl md:text-2xl font-display font-bold text-foundation-charcoal">
                Corporate Social Responsibility
              </h2>
              <p className="text-xs text-stone-600 leading-relaxed">
                Corporate partners can collaborate with SBBM Social Foundation across approved Schedule VII domains of the Companies Act, 2013:
              </p>
              <ul className="text-xs text-stone-600 space-y-1.5 list-disc pl-4">
                <li>Eradicating hunger, poverty & malnutrition (Item i)</li>
                <li>Promoting education & digital literacy (Item ii)</li>
                <li>Women empowerment & senior care homes (Item iii)</li>
                <li>Animal welfare & environmental sustainability (Item iv)</li>
              </ul>
            </div>
            <div className="text-xs font-bold text-foundation-crimson">
              Contact us for CSR proposals: <a href="mailto:sbbmsocialfoundation@gmail.com" className="underline">sbbmsocialfoundation@gmail.com</a>
            </div>
          </div>
        </div>

        {/* =========================================================================
            OFFICIAL DONATE NOW & BANK DETAILS SECTION
            (Extracted from official Vyenkatesh Ashram reference)
           ========================================================================= */}
        <section id="donate-now" className="space-y-8 scroll-mt-24">
          <div className="text-center space-y-2 max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Direct Philanthropic Support & Tax-Deductible Contributions</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-display font-bold text-foundation-charcoal">
              Donate to Support SBBM Social Foundation & Vyenkatesh Ashram
            </h2>
            <p className="text-xs md:text-sm text-stone-600 leading-relaxed">
              Vyenkatesh Ashram is supported by the kind-hearted members of society and runs independently through charitable contributions to provide dignified shelter, wholesome vegetarian Annadaan meals, and lifelong healthcare for destitute and solitary elders totally free of cost.
            </p>
          </div>

          {/* Official Bank Account & UPI Payment Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Column A: Genuine UPI QR Code Scanner (5 Cols) */}
            <div className="lg:col-span-5 bg-gradient-to-b from-[#8B1D24] to-[#6E1419] text-white p-6 md:p-8 rounded-3xl shadow-soft flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold">
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Instant UPI Payment</span>
                  </div>
                  <span className="text-[11px] text-stone-200">Zero Transaction Fees</span>
                </div>

                <div>
                  <h3 className="text-xl font-display font-bold">
                    Scan Genuine Donation QR Code
                  </h3>
                  <p className="text-xs text-stone-200 mt-1">
                    Scan with Google Pay, PhonePe, Paytm, BHIM, Axis Mobile, or any UPI app.
                  </p>
                </div>

                {/* Genuine QR Code Image */}
                <div className="bg-white p-4 rounded-2xl shadow-lg max-w-[260px] mx-auto border-2 border-amber-300/40">
                  <img
                    src="/assets/images/donation_qr_code.jpg"
                    alt="Official SBBM Social Foundation UPI Donation QR Code"
                    className="w-full h-auto object-contain rounded-lg"
                  />
                  <div className="text-center pt-2">
                    <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                      SBBM Social Foundation
                    </span>
                  </div>
                </div>

                {/* Copyable UPI ID Box */}
                <div className="bg-white/10 backdrop-blur-sm p-3.5 rounded-2xl border border-white/15 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] uppercase font-bold tracking-wider text-amber-200">
                      Official UPI ID
                    </span>
                    {copiedField === 'upi' && (
                      <span className="text-[10.5px] text-emerald-300 font-bold flex items-center space-x-1">
                        <Check className="w-3 h-3" />
                        <span>Copied!</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between bg-black/20 px-3 py-2 rounded-xl">
                    <span className="font-mono text-xs text-white font-semibold select-all break-all">
                      sbbmsocialfoundation@okhdfcbank
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('sbbmsocialfoundation@okhdfcbank', 'upi')}
                      className="ml-2 px-2.5 py-1 bg-white hover:bg-stone-100 text-[#8B1D24] rounded-lg text-[11px] font-bold transition-colors flex items-center space-x-1 shrink-0 cursor-pointer shadow-xs"
                      title="Copy UPI ID"
                    >
                      {copiedField === 'upi' ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedField === 'upi' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-amber-200/90 leading-tight border-t border-white/10 pt-3 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-300" />
                <span>Eligible for 50% Tax Deduction under Section 80G.</span>
              </div>
            </div>

            {/* Column B: Bank Account Details Table (7 Cols) */}
            <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-3xl border border-stone-200 shadow-soft flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-bold">
                    <CreditCard className="w-3.5 h-3.5 text-blue-700" />
                    <span>Direct Bank Transfer (NEFT / RTGS / IMPS)</span>
                  </div>
                  <span className="text-xs font-bold text-foundation-crimson">Axis Bank</span>
                </div>

                <div>
                  <h3 className="text-xl font-display font-bold text-foundation-charcoal">
                    Official Foundation Bank Account
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Please use these authentic bank details for direct online banking, NEFT, RTGS, IMPS, or branch cheque deposits.
                  </p>
                </div>

                {/* Bank Account Details Table */}
                <div className="overflow-hidden rounded-2xl border border-stone-200 bg-stone-50/50">
                  <table className="w-full text-xs text-left">
                    <tbody className="divide-y divide-stone-200">
                      {/* Account Name */}
                      <tr className="hover:bg-stone-50 transition-colors">
                        <td className="py-3 px-4 font-bold text-stone-500 w-1/3 uppercase text-[10.5px]">
                          Account Name
                        </td>
                        <td className="py-3 px-4 font-bold text-stone-900 font-sans">
                          VYENKATESH ASHRAM
                          <span className="block text-[10.5px] font-normal text-stone-500 mt-0.5">
                            (Operated by SBBM Social Foundation)
                          </span>
                        </td>
                      </tr>

                      {/* Bank Name */}
                      <tr className="hover:bg-stone-50 transition-colors">
                        <td className="py-3 px-4 font-bold text-stone-500 uppercase text-[10.5px]">
                          Bank Name
                        </td>
                        <td className="py-3 px-4 font-bold text-stone-900">
                          AXIS BANK
                        </td>
                      </tr>

                      {/* Account Number with Copy */}
                      <tr className="hover:bg-stone-50 transition-colors bg-white">
                        <td className="py-3.5 px-4 font-bold text-stone-500 uppercase text-[10.5px]">
                          Bank Account No
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-sm font-bold text-stone-900 tracking-wider">
                              920020067215309
                            </span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard('920020067215309', 'acc')}
                              className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-[11px] font-bold transition-colors flex items-center space-x-1 cursor-pointer"
                              title="Copy Account Number"
                            >
                              {copiedField === 'acc' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedField === 'acc' ? 'Copied' : 'Copy'}</span>
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* IFSC Code with Copy */}
                      <tr className="hover:bg-stone-50 transition-colors bg-white">
                        <td className="py-3.5 px-4 font-bold text-stone-500 uppercase text-[10.5px]">
                          IFSC Code
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-sm font-bold text-stone-900 tracking-wider">
                              UTIB0001674
                            </span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard('UTIB0001674', 'ifsc')}
                              className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-[11px] font-bold transition-colors flex items-center space-x-1 cursor-pointer"
                              title="Copy IFSC Code"
                            >
                              {copiedField === 'ifsc' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedField === 'ifsc' ? 'Copied' : 'Copy'}</span>
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Branch Address */}
                      <tr className="hover:bg-stone-50 transition-colors">
                        <td className="py-3 px-4 font-bold text-stone-500 uppercase text-[10.5px]">
                          Branch Address
                        </td>
                        <td className="py-3 px-4 text-stone-800 font-medium">
                          GANDHIBAG, NAGPUR BRANCH
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* 80G Tax Receipt Instructions */}
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs text-stone-700 space-y-2">
                  <div className="font-bold text-stone-900 flex items-center space-x-1.5">
                    <FileCheck className="w-4 h-4 text-foundation-crimson" />
                    <span>How to Claim Your Official Section 80G Tax Receipt:</span>
                  </div>
                  <ol className="list-decimal pl-4 space-y-1 text-[11.5px] text-stone-600">
                    <li>Complete your transfer via UPI or Net Banking (Axis Bank A/C).</li>
                    <li>Share the transaction screenshot / UTR number along with your <strong>Full Name, PAN Card Number, and Postal Address</strong>.</li>
                    <li>Send details via WhatsApp / Call to <a href="tel:+919890898081" className="font-bold text-foundation-crimson underline">+91 98908 98081</a> / <a href="tel:+919326172824" className="font-bold text-foundation-crimson underline">+91 93261 72824</a>, or email to <a href="mailto:vyenkateshashram2017@gmail.com" className="font-bold text-foundation-crimson underline">vyenkateshashram2017@gmail.com</a>.</li>
                  </ol>
                  <p className="text-[10.5px] text-stone-500 italic pt-1 border-t border-stone-200">
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
