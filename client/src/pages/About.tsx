import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, CheckCircle2, Heart, Award, FileText,
  Users, Sparkles, Building, Phone, Clock
} from 'lucide-react';

export const About: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'leadership' | 'board' | 'vision' | 'history' | 'certificates'>('overview');

  return (
    <div className="min-h-screen bg-foundation-ivory py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-foundation-forest/10 text-foundation-forest text-xs font-semibold">
            <Shield className="w-3.5 h-3.5" />
            <span>SBBM Social Foundation Society • Reg: 332-15-Nag</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-foundation-charcoal">
            About Our Foundation & Ashram
          </h1>
          <p className="text-sm md:text-base text-stone-600 leading-relaxed">
            Founded in 2015 with a sacred commitment to restore peace, dignity, and companionship to elderly citizens through charitable, non-granted care.
          </p>
        </div>

        {/* Sub-navigation tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 border-b border-foundation-borderMuted pb-4 text-xs font-bold">
          {[
            { id: 'overview', label: 'Who We Are' },
            { id: 'leadership', label: "President's Message" },
            { id: 'board', label: 'Committees & Governance' },
            { id: 'vision', label: 'Vision & Mission' },
            { id: 'history', label: 'Our History' },
            { id: 'certificates', label: 'Certificates & Transparency' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-full transition-all ${
                activeTab === tab.id
                  ? 'bg-foundation-forest text-foundation-ivory shadow-md'
                  : 'bg-white hover:bg-stone-100 text-stone-700 border border-foundation-borderMuted'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Who We Are (Overview) */}
        {activeTab === 'overview' && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <h2 className="text-2xl md:text-3xl font-display font-bold text-foundation-forest">
                  Dignity, Compassion and Care
                </h2>
                <p className="text-sm text-stone-700 leading-relaxed">
                  <strong>SBBM Social Foundation Society</strong> is an officially registered non-governmental charitable society based in Nagpur, Maharashtra (Registration No: <strong>332-15-Nag</strong>, established in 2015).
                </p>
                <p className="text-sm text-stone-700 leading-relaxed">
                  The primary initiative of our society is <strong>VYENKATESH ASHRAM</strong>, located in the peaceful rural setting of Anjikar Bagh on Mansar Mahuli Road in Mahuli (Parseoni Tehsil, Nagpur District).
                </p>
                <p className="text-sm text-stone-700 leading-relaxed">
                  We operate as a <strong>charitable, non-granted old-age home</strong>. Our objective is to ensure that senior citizens who are alone, neglected, or in need of supported residential living find a clean, secure, dignified, and loving sanctuary surrounded by nature.
                </p>

                <div className="p-4 bg-foundation-warmGray rounded-2xl border border-foundation-borderMuted space-y-2 text-xs">
                  <p className="font-bold text-foundation-charcoal">Official Registration Profile:</p>
                  <p>• <strong>Name:</strong> SBBM Social Foundation Society</p>
                  <p>• <strong>Registration Number:</strong> 332-15-Nag</p>
                  <p>• <strong>Year Established:</strong> 2015</p>
                  <p>• <strong>Head Office:</strong> Anjikar House, Panchpaoli, Timki Chimabai Peth, Nagpur – 440018</p>
                  <p>• <strong>Institution Facility:</strong> Vyenkatesh Ashram, 434, Anjikar Bagh, Mahuli, Parseoni – 441105</p>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="rounded-3xl overflow-hidden border-2 border-foundation-gold/40 shadow-xl">
                  <img
                    src="/assets/images/ashram_building.jpg"
                    alt="Vyenkatesh Ashram Building"
                    className="w-full h-80 object-cover"
                  />
                  <div className="p-4 bg-white border-t border-foundation-borderMuted text-xs text-stone-600">
                    <p className="font-bold text-foundation-charcoal">Vyenkatesh Ashram Facility at Mahuli</p>
                    <p>Designed with wide open verandas, comfortable accommodations, dining hall, and surrounding orchards.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Founder / President's Message */}
        {activeTab === 'leadership' && (
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-foundation-borderMuted shadow-soft space-y-8 max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center gap-6 border-b border-foundation-borderMuted pb-8">
              <img
                src="/assets/images/logo.jpg"
                alt="Founder & President"
                className="w-24 h-24 rounded-full border-4 border-foundation-gold shadow-md"
              />
              <div className="text-center sm:text-left">
                <span className="text-xs uppercase tracking-widest text-foundation-forest font-bold">
                  Leadership & Stewardship
                </span>
                <h2 className="text-2xl font-display font-bold text-foundation-charcoal">
                  Mr. Ashwin Vyenkatrao Anjikar
                </h2>
                <p className="text-xs text-stone-500">
                  Founder & President, SBBM Social Foundation Society
                </p>
                <p className="text-xs text-stone-500">
                  In Partnership with: <strong>Mrs. Tina Anjikar</strong>
                </p>
              </div>
            </div>

            <div className="space-y-4 text-stone-700 text-sm md:text-base leading-relaxed italic">
              <p>
                “In our traditional culture, senior citizens are the root and foundation of our homes. Yet, the realities of modern circumstances and economic hardship often leave vulnerable elders without the daily care, medical attention, and emotional warmth they so richly deserve.”
              </p>
              <p>
                “When we established SBBM Social Foundation and Vyenkatesh Ashram at Anjikar Bagh in Mahuli, our guiding prayer was to create not an institution of loneliness, but a true home filled with dignity, fresh air, wholesome vegetarian food, and gentle spiritual companionship. Here, our elders wake to the morning birds, walk through green trees, spend time with our Go-Seva cows, and feel loved and respected every day.”
              </p>
              <p>
                “We invite well-wishers, families, and compassionate citizens to visit our ashram, meet our elders, and join hands in this noble endeavor.”
              </p>
            </div>

            <div className="pt-4 border-t border-foundation-borderMuted flex items-center justify-between text-xs text-stone-500">
              <span>Mahuli, Parseoni • Nagpur, Maharashtra</span>
              <span className="font-bold text-foundation-forest">Direct Contact: +91 98908 98081</span>
            </div>
          </div>
        )}

        {/* Tab 3: Board & Committees */}
        {activeTab === 'board' && (
          <div className="space-y-8 max-w-5xl mx-auto">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-display font-bold text-foundation-charcoal">
                Organizational Committees & Helping Hands
              </h2>
              <p className="text-xs text-stone-600">
                Managed in accordance with the Societies Registration Act by dedicated trustees, volunteer coordinators, and community advisors.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-foundation-borderMuted shadow-soft-sm space-y-3">
                <Users className="w-8 h-8 text-foundation-forest" />
                <h3 className="font-display font-bold text-base text-foundation-charcoal">
                  Executive Management
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Led by President Mr. Ashwin V. Anjikar and Mrs. Tina Anjikar. Responsible for administrative stewardship, ashram facility upkeep, and admissions review.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-foundation-borderMuted shadow-soft-sm space-y-3">
                <Heart className="w-8 h-8 text-rose-600" />
                <h3 className="font-display font-bold text-base text-foundation-charcoal">
                  Helping Hands Committee
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  A network of dedicated community volunteers assisting with routine elder companionship, cultural gatherings, festival celebrations, and grocery support.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-foundation-borderMuted shadow-soft-sm space-y-3">
                <Shield className="w-8 h-8 text-amber-600" />
                <h3 className="font-display font-bold text-base text-foundation-charcoal">
                  Grievance & Welfare Committee
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Ensures resident well-being, dietary satisfaction, cleanliness standards, and addresses concerns raised by residents or their guardians with full fairness.
                </p>
              </div>
            </div>

            <div className="bg-foundation-warmGray p-6 rounded-2xl border border-foundation-borderMuted text-xs text-stone-600 space-y-2">
              <p className="font-bold text-foundation-charcoal">Governance Note:</p>
              <p>
                In compliance with administrative guidelines, specific committee member rosters and legal filings are verified with the charity commissioner's office. For formal documentation requests or grievance submissions, please email or call our head office.
              </p>
            </div>
          </div>
        )}

        {/* Tab 4: Vision & Mission */}
        {activeTab === 'vision' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-3xl border border-foundation-borderMuted shadow-soft space-y-4">
              <span className="text-xs uppercase tracking-widest text-foundation-forest font-bold">
                Our Vision
              </span>
              <h2 className="text-2xl font-display font-bold text-foundation-charcoal">
                A Society Where No Elder Is Abandoned
              </h2>
              <p className="text-xs md:text-sm text-stone-600 leading-relaxed">
                To build an inclusive, compassionate ecosystem where every elderly person, regardless of their family or economic situation, experiences security, medical dignity, loving care, and spiritual peace.
              </p>
              <ul className="text-xs text-stone-600 space-y-2 pt-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-foundation-forest flex-shrink-0" />
                  <span>Holistic integration of nature, cow therapy and elder wellness</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-foundation-forest flex-shrink-0" />
                  <span>Zero tolerance for elder neglect or indignity</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-foundation-borderMuted shadow-soft space-y-4">
              <span className="text-xs uppercase tracking-widest text-foundation-forest font-bold">
                Our Mission
              </span>
              <h2 className="text-2xl font-display font-bold text-foundation-charcoal">
                Practical, Clean & Dignified Elder Care
              </h2>
              <p className="text-xs md:text-sm text-stone-600 leading-relaxed">
                To operate Vyenkatesh Ashram as a high-standard, transparent charitable old-age home providing nutritious food, clean shelter, daily health monitoring, and mental rejuvenation for seniors in rural Vidarbha.
              </p>
              <ul className="text-xs text-stone-600 space-y-2 pt-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-foundation-forest flex-shrink-0" />
                  <span>Non-commercial, non-granted charitable care</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-foundation-forest flex-shrink-0" />
                  <span>Active Go-Seva and organic community gardening</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 5: History */}
        {activeTab === 'history' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-display font-bold text-foundation-charcoal">
                Our Journey of Service (2015 – Present)
              </h2>
            </div>

            <div className="space-y-6 border-l-2 border-foundation-forest/40 pl-6 ml-4">
              <div className="relative">
                <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-foundation-forest border-4 border-white" />
                <span className="text-xs font-bold text-foundation-forest">2015</span>
                <h3 className="text-base font-bold text-foundation-charcoal">Establishment & Registration</h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  SBBM Social Foundation Society was officially registered under the Societies Registration Act (Reg No: 332-15-Nag) in Nagpur under the leadership of Mr. Ashwin V. Anjikar.
                </p>
              </div>

              <div className="relative">
                <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-foundation-forest border-4 border-white" />
                <span className="text-xs font-bold text-foundation-forest">2016 – 2019</span>
                <h3 className="text-base font-bold text-foundation-charcoal">Community Outreach & Health Drives</h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  Conducted numerous rural health checkup camps, student notebook distribution drives, and women vocational awareness programs in Nagpur and surrounding villages.
                </p>
              </div>

              <div className="relative">
                <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-foundation-forest border-4 border-white" />
                <span className="text-xs font-bold text-foundation-forest">2020 – 2022</span>
                <h3 className="text-base font-bold text-foundation-charcoal">Pandemic Relief & Ashram Facility Inception</h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  Organized ration kits, food distribution, and elderly assistance during COVID-19 lockdowns. Commenced the dedicated residential elder shelter at Anjikar Bagh, Mahuli.
                </p>
              </div>

              <div className="relative">
                <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-foundation-forest border-4 border-white" />
                <span className="text-xs font-bold text-foundation-forest">Present</span>
                <h3 className="text-base font-bold text-foundation-charcoal">Vyenkatesh Ashram, Go-Seva & Naturopathy Expansion</h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  Consolidated comprehensive residential senior care, active Go-Seva Kendra gaushala, and daily naturopathy wellness routines in a green, peaceful sanctuary.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Certificates & Governance */}
        {activeTab === 'certificates' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-display font-bold text-foundation-charcoal">
                Certificates & Governance Documents
              </h2>
              <p className="text-xs text-stone-600">
                Official transparency record maintained for public inspection and accountability.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-foundation-borderMuted shadow-soft-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foundation-forest">Society Registration</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    Verified
                  </span>
                </div>
                <h3 className="font-bold text-sm text-foundation-charcoal">Societies Registration Certificate</h3>
                <p className="text-xs text-stone-500">Reg No: <strong>332-15-Nag</strong> • Registered in 2015, Nagpur</p>
                <p className="text-[11px] text-stone-400">Issued by Registrar of Societies, Maharashtra</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-foundation-borderMuted shadow-soft-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foundation-forest">Institutional Status</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>
                <h3 className="font-bold text-sm text-foundation-charcoal">Charitable Non-Granted Status</h3>
                <p className="text-xs text-stone-500">Non-governmental, independent elder welfare home</p>
                <p className="text-[11px] text-stone-400">Supported by community donations and trustee stewardship</p>
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1">
              <p className="font-bold">Honest Transparency Notice:</p>
              <p>
                We publish only verified organizational details. Certified copies of our constitution, audit reports, and registration certificates may be inspected by official authorities or prospective guardians during office hours at our Head Office in Panchpaoli, Nagpur.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
