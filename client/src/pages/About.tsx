import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award, Compass, Star, AlertCircle, ShieldCheck, UserCheck, Users, Building, FileText
} from 'lucide-react';
import { Card3D } from '../components/ui/Card3D';
import { InstitutionalTimeline } from '../components/ui/InstitutionalTimeline';
import { SEO } from '../components/common/SEO';

export const About: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'vision' | 'leadership' | 'board' | 'history' | 'certificates'>('overview');

  const objectives = [
    'To provide educational assistance and computer literacy opportunities to underprivileged students.',
    'To promote women’s empowerment, self-help groups, employment opportunities, and economic independence.',
    'To support child welfare, child protection, and awareness regarding children’s rights.',
    'To provide shelter, food, healthcare support, and dignified living conditions for senior citizens.',
    'To organise health camps and awareness programmes on addiction prevention, HIV/AIDS, cancer, tuberculosis, and sanitation.',
    'To promote skill development and livelihood opportunities among rural youth, women, and farmers.',
    'To encourage cow protection, animal welfare, tree plantation, and environmental conservation.',
    'To promote social equality, constitutional values, and awareness through programmes commemorating national leaders and important national days.',
    'To provide food grains, essential commodities, and emergency assistance to vulnerable families.',
    'To encourage voluntary participation and partnerships for sustainable community development.'
  ];

  const committeeMembers = [
    { name: 'Shri. Ashvin Vyenkatrao Anjikar', role: 'President', term: 'Governing Body' },
    { name: 'Shri. Devish Narendra', role: 'Vice President', term: 'Governing Body' },
    { name: 'Ku. Nirmala Ashok Khapekar', role: 'Committee Member', term: 'Governing Body' },
    { name: 'Shri. Vijay Udaramji Bhanarkar', role: 'Committee Member', term: 'Governing Body' },
    { name: 'Mrs. Kamini Pramod Parate', role: 'Committee Member', term: 'Governing Body' },
    { name: 'Mrs. Rekha Omprakash Pounikar', role: 'Committee Member', term: 'Governing Body' },
    { name: 'Shri. Kishor Devaji Moundekar', role: 'Committee Member', term: 'Governing Body' },
  ];

  const aboutJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    'url': 'https://sbbmsocialfoundation.org/about',
    'name': 'About SBBM Social Foundation | Ethos, Governance & History',
    'description': 'History, legal certifications, governing board, and organizational objectives of SBBM Social Foundation Society.',
    'mainEntity': {
      '@type': 'NGO',
      'name': 'SBBM Social Foundation',
      'foundingDate': '2014-12',
      'taxID': 'AAQTS3445R',
      'sameAs': ['https://vyenkateshashram.com/'],
    },
  };

  return (
    <div className="min-h-screen bg-foundation-ivory py-10 sm:py-14 md:py-16 font-sans">
      <SEO
        title="About Us | Ethos, History & Statutory Governance"
        description="Learn about SBBM Social Foundation — founded in Dec 2014, operating Vyenkatesh Ashram in Mahuli, registered under Societies Act MAH/332/15/NAG with Section 12A & 80G tax exemptions."
        canonicalPath="/about"
        jsonLd={aboutJsonLd}
      />
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8 sm:space-y-12">
        
        {/* Page Hero Header with Real Visible Background Photograph */}
        <div className="relative rounded-3xl overflow-hidden border border-[#1E293B] shadow-card bg-[#0A111A] text-white p-6 sm:p-10 md:p-16 text-center">
          <div className="absolute inset-0 z-0">
            <img
              src="/assets/images/ashram/ashram_exterior_main.jpg"
              alt="SBBM Social Foundation Mahuli Campus"
              className="w-full h-full object-cover object-center scale-105"
            />
            {/* Calibrated dark scrim: full building, arches & trees clearly visible */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A111A]/90 via-[#0A111A]/75 to-[#0A111A]/92" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto space-y-3 sm:space-y-5">
            <div className="inline-flex flex-wrap items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0E1726]/80 backdrop-blur-md text-[#C5A059] text-xs sm:text-sm font-bold border border-[#C5A059]/30">
              <Award className="w-4 h-4 shrink-0" />
              <span>Official Institutional Profile • Estd. Dec 2014 / Regd. 2015</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white tracking-tight drop-shadow-sm leading-tight">
              About SBBM Social Foundation
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-[#C5A059] leading-relaxed font-serif italic max-w-2xl mx-auto">
              “Service is Humanity • Education is Development • Self-Reliance is the Foundation of an Empowered Society”
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs sm:text-sm font-mono text-slate-200">
              <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/15">Soc: MAH/332/15/NAG</span>
              <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/15">Trust: F-33193</span>
              <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/15">12A &amp; 80G Certified</span>
            </div>
          </div>
        </div>

        {/* Sub-navigation tabs (Uditi-style clean, touch-friendly tab bar) */}
        <div className="flex overflow-x-auto no-scrollbar touch-scroll-x sm:flex-wrap items-center sm:justify-center gap-2 border-b border-[#E8E6E1] pb-3 text-sm font-semibold scroll-smooth">
          {[
            { id: 'overview', label: 'Who We Are' },
            { id: 'vision', label: 'Vision, Mission & Objectives' },
            { id: 'leadership', label: "Founder's Message" },
            { id: 'board', label: 'Committee Members' },
            { id: 'history', label: 'History & Priorities' },
            { id: 'certificates', label: 'Registrations & 12A/80G' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`shrink-0 sm:shrink min-h-[46px] px-4 sm:px-5 py-2.5 rounded-full transition-all cursor-pointer whitespace-nowrap text-sm sm:text-[15px] font-semibold ${
                activeTab === tab.id
                  ? 'bg-[#9B1B22] text-white shadow-md font-bold'
                  : 'bg-white hover:bg-[#F4F3EE] text-[#334155] border border-[#E8E6E1]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
            >

              {/* TAB 1: WHO WE ARE (OVERVIEW) */}
              {activeTab === 'overview' && (
                <div className="space-y-10">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                    <div className="lg:col-span-7 space-y-5">
                      <span className="text-xs uppercase tracking-widest text-foundation-crimson font-bold">
                        Institutional Background
                      </span>
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foundation-charcoal leading-snug">
                        Dedicated to Serving Humanity with Compassion, Transparency & Accountability
                      </h2>
                      <p className="text-[16px] md:text-[17px] text-stone-700 leading-relaxed">
                        <strong>SBBM Social Foundation</strong> is a social welfare organisation dedicated to uplifting underprivileged and vulnerable communities through education, healthcare, women’s empowerment, child development, elderly care, livelihood generation, environmental conservation, and animal welfare.
                      </p>
                      <p className="text-[16px] md:text-[17px] text-stone-700 leading-relaxed">
                        The Foundation commenced its activities in <strong>December 2014</strong> and was formally registered in <strong>2015</strong> under the Societies Registration Act, 1860 (Reg No: MAH/332/15/NAG) and Bombay Public Trusts Act, 1950 (Reg No: MAH/F-33193/NAG). Since then, it has been actively working across Nagpur District, Maharashtra, to promote education, healthcare, self-reliance, and dignified living.
                      </p>
                      <p className="text-[16px] md:text-[17px] text-stone-700 leading-relaxed">
                        Its key institutional initiatives include <strong>Vyenkatesh Ashram</strong> for senior citizens, <strong>Basic Computer Education</strong> for youth, <strong>Aarogyam Prakritik Chikitsa Kendra</strong> (natural therapy), <strong>Shri Go Seva & Go Sanvardhan Kendra</strong> (cow protection), humanitarian relief distribution, and community development programmes.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
                        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-1.5">
                          <span className="font-bold text-foundation-forest text-sm sm:text-[15px] block">Administrative Head Office:</span>
                          <p className="text-sm text-stone-600 leading-relaxed">Anjikar House, Panchpaoli, Timki Chimabai Peth, Nagpur – 440018</p>
                        </div>
                        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-1.5">
                          <span className="font-bold text-foundation-forest text-sm sm:text-[15px] block">Mahuli Project Centre:</span>
                          <p className="text-sm text-stone-600 leading-relaxed">434 Anjikar Bagh, Mansar Mahuli Rd, Mahuli, Parseoni, Nagpur – 441105</p>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-5 space-y-5">
                      <Card3D maxRotate={6} scaleOnHover={1.02}>
                        <div className="rounded-3xl overflow-hidden border-2 border-foundation-gold/40 shadow-xl bg-white p-6 sm:p-8 space-y-4 text-center">
                          <img
                            src="/assets/images/logo.png"
                            alt="SBBM Social Foundation Official Emblem"
                            className="w-32 h-32 sm:w-36 sm:h-36 mx-auto object-contain drop-shadow-md"
                          />
                          <div>
                            <h3 className="font-display font-bold text-xl sm:text-2xl text-foundation-charcoal">
                              SBBM SOCIAL FOUNDATION
                            </h3>
                            <p className="text-sm text-foundation-crimson font-bold mt-1">
                              Estd 2015 • Regd. F-33193
                            </p>
                          </div>
                          <p className="text-sm sm:text-base text-stone-600 italic leading-relaxed">
                            “We believe every child deserves a chance to dream, every woman deserves the power to grow, and every elderly person deserves love and respect.”
                          </p>
                        </div>
                      </Card3D>

                      <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-md bg-white">
                        <div className="h-48 overflow-hidden relative">
                          <img
                            src="/assets/images/ashram/ashram_exterior_main.jpg"
                            alt="Vyenkatesh Ashram Field Campus at Mahuli"
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-3 left-3 bg-stone-900/85 text-white text-xs px-3 py-1 rounded-full backdrop-blur-xs font-semibold">
                            Field Project Campus • Mahuli
                          </span>
                        </div>
                        <div className="p-3.5 text-xs sm:text-sm text-stone-600 text-center leading-relaxed">
                          Chartered facilities housing Elderly Care, Shri Go Seva, & Aarogyam Prakritik Chikitsa Kendra.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: VISION, MISSION & 10 OBJECTIVES */}
              {activeTab === 'vision' && (
                <div className="space-y-10">
                  {/* Vision & Mission Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                    <div className="bg-white p-6 sm:p-8 md:p-10 rounded-3xl border border-stone-200 shadow-soft space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-foundation-crimson/10 text-foundation-crimson flex items-center justify-center font-bold">
                        <Star className="w-6 h-6" />
                      </div>
                      <h3 className="text-2xl md:text-3xl font-display font-bold text-foundation-charcoal">
                        Our Vision
                      </h3>
                      <p className="text-[16px] text-stone-700 leading-relaxed">
                        SBBM Social Foundation envisions a caring, compassionate, and self-reliant society where everyone lives with dignity, respect, and equal opportunities. We are committed to providing love, care, and security to senior citizens, empowering women through education, skills, and economic independence, and building a brighter future for children through education, sports, culture, moral values, and spiritual growth.
                      </p>
                      <p className="text-[16px] text-stone-700 leading-relaxed">
                        Guided by humanity and the spirit of service, we aim to build a society where no one is left behind and everyone has the opportunity to live a better, happier, and more dignified life.
                      </p>
                    </div>

                    <div className="bg-white p-6 sm:p-8 md:p-10 rounded-3xl border border-stone-200 shadow-soft space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-foundation-forest/10 text-foundation-forest flex items-center justify-center font-bold">
                        <Compass className="w-6 h-6" />
                      </div>
                      <h3 className="text-2xl md:text-3xl font-display font-bold text-foundation-charcoal">
                        Our Mission
                      </h3>
                      <p className="text-[16px] text-stone-700 leading-relaxed">
                        To serve senior citizens with love, care, and dignity; empower women through education, skill development, and economic independence; and nurture children through quality education, sports, moral values, and spiritual growth.
                      </p>
                      <p className="text-[16px] text-stone-700 leading-relaxed">
                        SBBM Social Foundation is committed to uplifting underprivileged rural and urban communities through healthcare, livelihood opportunities, and community development. Our mission is to create equal opportunities, strengthen self-reliance, and build a society where every elderly person feels cared for, every woman feels empowered, and every child gets the opportunity to learn, grow, and shine.
                      </p>
                    </div>
                  </div>

                  {/* 10 Core Objectives from Institutional Report */}
                  <div className="bg-white p-6 sm:p-8 md:p-10 rounded-3xl border border-stone-200 shadow-soft space-y-6">
                    <div className="border-b border-stone-100 pb-4">
                      <span className="text-xs uppercase tracking-widest text-foundation-forest font-bold">
                        Charter of Goals
                      </span>
                      <h3 className="text-2xl md:text-3xl font-display font-bold text-foundation-charcoal mt-1">
                        The 10 Key Objectives of SBBM Social Foundation
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {objectives.map((obj, i) => (
                        <div key={i} className="flex items-start space-x-3.5 p-4 rounded-2xl bg-foundation-warmGray/60 border border-stone-200/80">
                          <span className="w-7 h-7 rounded-full bg-foundation-forest text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                            {i + 1}
                          </span>
                          <p className="text-sm sm:text-[15px] text-stone-700 leading-relaxed">
                            {obj}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: FOUNDER'S MESSAGE (RETAIN FOUNDER PHOTO, REMOVE OTHER PHOTOS) */}
              {activeTab === 'leadership' && (
                <div className="bg-white p-6 sm:p-8 md:p-12 rounded-3xl border border-stone-200 shadow-soft space-y-8 max-w-4xl mx-auto">
                  <div className="border-b border-stone-100 pb-5">
                    <span className="text-xs uppercase tracking-widest text-foundation-crimson font-bold">
                      Message from the Leadership
                    </span>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foundation-charcoal mt-1">
                      “Service is Humanity, Love is the Cure”
                    </h2>
                    <p className="text-sm text-stone-500 mt-1">
                      Mr. Ashwin Vyenkatrao Anjikar (Founder &amp; President) &amp; Mrs. Tina Anjikar (Secretary &amp; Director)
                    </p>
                  </div>

                  {/* Leadership Cards: Retain Founder's Photo; Secretary with Dignified Institutional Badge */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                    {/* Founder Card with Authentic Portrait (RETAINED AS REQUESTED) */}
                    <div className="flex items-center space-x-4 p-4 sm:p-5 rounded-2xl bg-[#faf9f6] border border-stone-200 shadow-2xs">
                      <img
                        src="/assets/images/leadership/ashwin_anjikar_portrait.jpg"
                        alt="Mr. Ashwin Vyenkatrao Anjikar - Founder & President"
                        className="w-20 h-26 sm:w-24 sm:h-30 object-cover rounded-xl border-2 border-foundation-gold/70 shadow-sm shrink-0"
                      />
                      <div className="space-y-1.5 min-w-0">
                        <h4 className="font-bold text-base sm:text-lg text-stone-900 truncate">Mr. Ashwin V. Anjikar</h4>
                        <p className="text-xs sm:text-sm font-semibold text-foundation-crimson">Founder &amp; President</p>
                        <p className="text-xs text-stone-500 leading-relaxed">Leading grassroots seva &amp; resident elderly care since Dec 2014.</p>
                      </div>
                    </div>

                    {/* Secretary Card with Dignified Institutional Emblem (NO PHOTO AS REQUESTED) */}
                    <div className="flex items-center space-x-4 p-4 sm:p-5 rounded-2xl bg-[#faf9f6] border border-stone-200 shadow-2xs">
                      <div className="w-20 h-26 sm:w-24 sm:h-30 rounded-xl bg-foundation-crimson/10 border-2 border-foundation-crimson/20 flex flex-col items-center justify-center text-foundation-crimson shrink-0">
                        <ShieldCheck className="w-8 h-8 sm:w-9 sm:h-9" />
                        <span className="text-[10px] font-bold uppercase tracking-wider mt-1">Trustee</span>
                      </div>
                      <div className="space-y-1.5 min-w-0">
                        <h4 className="font-bold text-base sm:text-lg text-stone-900 truncate">Mrs. Tina Ashwin Anjikar</h4>
                        <p className="text-xs sm:text-sm font-semibold text-foundation-crimson">Secretary &amp; Director</p>
                        <p className="text-xs text-stone-500 leading-relaxed">Directing administration, women empowerment &amp; welfare projects.</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 text-stone-700 text-[16px] sm:text-[17px] leading-relaxed italic border-l-4 border-foundation-crimson pl-5 py-1">
                    <p>
                      “When we began our journey in December 2014, our primary goal was simple: to stand beside those in our community who have no one else to lean on. In our traditional Indian culture, senior citizens are the root and foundation of every family. Yet, modern hardship often leaves vulnerable elders neglected and lonely.”
                    </p>
                    <p>
                      “At SBBM Social Foundation, whether through Vyenkatesh Ashram where elders are lovingly called ‘Aai-Baba’, our free Aarogyam Prakritik Chikitsa Kendra, our digital computer training for rural students, or our Go-Seva gaushala, our prayer is to build a true sanctuary filled with dignity, clean air, and compassionate companionship.”
                    </p>
                    <p>
                      “We invite well-wishers, social workers, doctors, teachers, volunteers, and CSR partners to walk together with us in building a self-reliant and compassionate tomorrow.”
                    </p>
                  </div>

                  <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between text-xs sm:text-sm text-stone-500 gap-3">
                    <span>Nagpur, Maharashtra</span>
                    <span className="font-bold text-foundation-forest">Official Helpline: +91 98908 98081 / +91 93261 72824</span>
                  </div>
                </div>
              )}

              {/* TAB 4: COMMITTEE MEMBERS (REDESIGNED INSTITUTIONAL DIRECTORY - NO MEMBER PHOTOS) */}
              {activeTab === 'board' && (
                <div className="space-y-8 max-w-5xl mx-auto">
                  <div className="bg-white p-6 sm:p-8 md:p-10 rounded-3xl border border-stone-200 shadow-soft space-y-6">
                    <div className="border-b border-stone-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold mb-1">
                          <Users className="w-3.5 h-3.5" />
                          <span>Statutory Governing Body</span>
                        </div>
                        <h3 className="font-display font-bold text-2xl md:text-3xl text-foundation-charcoal">
                          Committee Members &amp; Governing Council
                        </h3>
                        <p className="text-sm text-stone-500 mt-1">
                          Dedicated leadership council guiding institutional compliance, grassroots projects, and community welfare.
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200 self-start sm:self-auto">
                        Official Registry
                      </span>
                    </div>

                    {/* Clean, authoritative 3-column directory without individual photos */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {committeeMembers.map((member, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200 hover:border-foundation-gold/60 hover:bg-white transition-all space-y-2 flex flex-col justify-between"
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-mono font-bold text-stone-400">#{String(idx + 1).padStart(2, '0')}</span>
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white text-foundation-crimson border border-stone-200">
                                {member.role}
                              </span>
                            </div>
                            <h4 className="font-bold text-base text-stone-900 pt-1">
                              {member.name}
                            </h4>
                          </div>
                          <div className="pt-2 border-t border-stone-200/70 flex items-center justify-between text-xs text-stone-500">
                            <span>Governance Role:</span>
                            <span className="font-medium text-stone-700">{member.term}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 bg-foundation-warmGray rounded-2xl border border-stone-200 text-xs sm:text-sm text-stone-600 flex items-start space-x-3">
                      <UserCheck className="w-5 h-5 text-foundation-forest shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-stone-800">Statutory Governance &amp; Meetings:</p>
                        <p className="mt-0.5 leading-relaxed text-stone-600">
                          The governing body meets periodically in accordance with the Societies Registration Act, 1860 and the Bombay Public Trusts Act, 1950 to oversee social projects, audit reviews, and compliance records.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: HISTORY & DEVELOPMENT PRIORITIES */}
              {activeTab === 'history' && (
                <div className="max-w-5xl mx-auto space-y-10">
                  {/* Interactive Timeline */}
                  <InstitutionalTimeline />

                  {/* Future Priorities from Section 9 of Report */}
                  <div className="bg-white p-6 sm:p-8 md:p-10 rounded-3xl border border-stone-200 shadow-soft space-y-5">
                    <h3 className="text-2xl md:text-3xl font-display font-bold text-foundation-charcoal">
                      Future Development Priorities
                    </h3>
                    <p className="text-sm sm:text-base text-stone-600">
                      The Foundation focuses on the following strategic priorities in the coming years:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-[15px] text-stone-700 pt-1">
                      <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                        • Strengthening healthcare, accommodation, and geriatric facilities
                      </div>
                      <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                        • Expanding computer education and employment-oriented skill training
                      </div>
                      <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                        • Supporting women’s self-help groups and micro-entrepreneurship
                      </div>
                      <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                        • Conducting rural tuberculosis (TB) awareness and sanitation drives
                      </div>
                      <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                        • Strengthening cow protection, tree plantation, and environmental conservation
                      </div>
                      <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                        • Developing sustainable social welfare projects in partnership with CSR donors
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: REGISTRATIONS, 12A/80G & TRANSPARENCY */}
              {activeTab === 'certificates' && (
                <div className="max-w-4xl mx-auto space-y-6">
                  <div className="bg-white p-6 sm:p-8 md:p-10 rounded-3xl border border-stone-200 shadow-soft space-y-6">
                    <div className="border-b border-stone-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="text-2xl md:text-3xl font-display font-bold text-foundation-charcoal">
                          Verified Legal &amp; Tax Registration Profile
                        </h3>
                        <p className="text-sm text-stone-500 mt-0.5">
                          Primary institutional documentation verifying non-profit transparency
                        </p>
                      </div>
                      <span className="px-3.5 py-1.5 bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-bold rounded-full self-start sm:self-auto">
                        100% Verified
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                      <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                        <span className="text-[11px] uppercase font-bold text-stone-500">Organisation Name</span>
                        <p className="font-bold text-stone-900 text-base">SBBM Social Foundation</p>
                        <p className="text-stone-500">Founded Dec 2014 • Registered 2015</p>
                      </div>

                      <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                        <span className="text-[11px] uppercase font-bold text-stone-500">Societies Registration Act, 1860</span>
                        <p className="font-bold font-mono text-stone-900 text-base">MAH/332/15/NAG</p>
                        <p className="text-stone-500">Registered at Nagpur, Maharashtra</p>
                      </div>

                      <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                        <span className="text-[11px] uppercase font-bold text-stone-500">Bombay Public Trusts Act, 1950</span>
                        <p className="font-bold font-mono text-stone-900 text-base">MAH/F-33193/NAG</p>
                        <p className="text-stone-500">Public Charitable Trust Status</p>
                      </div>

                      <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                        <span className="text-[11px] uppercase font-bold text-stone-500">Income Tax Act, 1961</span>
                        <p className="font-bold font-mono text-emerald-800 text-base">12A &amp; 80G Certified</p>
                        <p className="text-stone-500">Donations eligible for tax exemption</p>
                      </div>

                      <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                        <span className="text-[11px] uppercase font-bold text-stone-500">NITI Aayog Darpan ID</span>
                        <p className="font-bold font-mono text-stone-900 text-base">MH/2016/</p>
                        <p className="text-stone-500">Registered on Government NGO portal</p>
                      </div>

                      <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                        <span className="text-[11px] uppercase font-bold text-stone-500">Permanent Account Number (PAN)</span>
                        <p className="font-bold font-mono text-stone-900 text-base">AAQTS3445R</p>
                        <p className="text-stone-500">Official Society PAN Card</p>
                      </div>
                    </div>

                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs sm:text-sm text-amber-950 flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-sm">Institutional Transparency Commitment:</p>
                        <p className="mt-0.5 leading-relaxed text-xs sm:text-sm">
                          SBBM Social Foundation strictly maintains audited accounts, formal receipt registers, and annual filing in compliance with statutory requirements. For CSR due diligence or registration certificates, contact our head office directly at <a href="mailto:sbbmsocialfoundation@gmail.com" className="font-bold underline">sbbmsocialfoundation@gmail.com</a>.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};
