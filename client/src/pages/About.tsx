import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award, Compass, Star, AlertCircle
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
    <div className="min-h-screen bg-foundation-ivory py-12 md:py-16">
      <SEO
        title="About Us | Ethos, History & Statutory Governance"
        description="Learn about SBBM Social Foundation — founded in Dec 2014, operating Vyenkatesh Ashram in Mahuli, registered under Societies Act MAH/332/15/NAG with Section 12A & 80G tax exemptions."
        canonicalPath="/about"
        jsonLd={aboutJsonLd}
      />
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-10">
        
        {/* Page Hero Header with Real Visible Background Photograph */}
        <div className="relative rounded-3xl overflow-hidden border-2 border-stone-700/60 shadow-elevated bg-stone-950 text-white p-10 md:p-16 text-center">
          <div className="absolute inset-0 z-0">
            <img
              src="/assets/images/ashram/ashram_exterior_main.jpg"
              alt="SBBM Social Foundation Mahuli Campus"
              className="w-full h-full object-cover object-center scale-105"
            />
            {/* Calibrated dark scrim: full building, arches & trees clearly visible */}
            <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-stone-950/65 to-stone-950/85" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold border border-white/20">
              <Award className="w-3.5 h-3.5" />
              <span>Official Institutional Profile • Estd. Dec 2014 / Regd. 2015</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight drop-shadow-sm">
              About SBBM Social Foundation
            </h1>
            <p className="text-sm md:text-base text-amber-200 leading-relaxed font-serif italic">
              “Service is Humanity • Education is Development • Self-Reliance is the Foundation of an Empowered Society”
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-[11px] font-mono text-stone-200">
              <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/15">Soc Reg: MAH/332/15/NAG</span>
              <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/15">Trust Reg: F-33193</span>
              <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/15">12A & 80G Approved</span>
            </div>
          </div>
        </div>

        {/* Sub-navigation tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 border-b border-stone-200 pb-4 text-xs font-bold">
          {[
            { id: 'overview', label: 'Who We Are' },
            { id: 'vision', label: 'Vision, Mission & 10 Objectives' },
            { id: 'leadership', label: "Founder's Message" },
            { id: 'board', label: 'Committee Members' },
            { id: 'history', label: 'History & Priorities' },
            { id: 'certificates', label: 'Registrations & 12A/80G' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-full transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-foundation-crimson text-white shadow-md font-bold'
                  : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
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
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >

        {/* TAB 1: WHO WE ARE (OVERVIEW) */}
        {activeTab === 'overview' && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-5">
                <span className="text-xs uppercase tracking-widest text-foundation-crimson font-bold">
                  Institutional Background
                </span>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-foundation-charcoal">
                  Dedicated to Serving Humanity with Compassion, Transparency & Accountability
                </h2>
                <p className="text-sm text-stone-700 leading-relaxed">
                  <strong>SBBM Social Foundation</strong> is a social welfare organisation dedicated to uplifting underprivileged and vulnerable communities through education, healthcare, women’s empowerment, child development, elderly care, livelihood generation, environmental conservation, and animal welfare.
                </p>
                <p className="text-sm text-stone-700 leading-relaxed">
                  The Foundation commenced its activities in <strong>December 2014</strong> and was formally registered in <strong>2015</strong> under the Societies Registration Act, 1860 (Reg No: MAH/332/15/NAG) and Bombay Public Trusts Act, 1950 (Reg No: MAH/F-33193/NAG). Since then, it has been actively working across Nagpur District, Maharashtra, to promote education, healthcare, self-reliance, and dignified living.
                </p>
                <p className="text-sm text-stone-700 leading-relaxed">
                  Its key institutional initiatives include <strong>Vyenkatesh Ashram</strong> for senior citizens, <strong>Basic Computer Education</strong> for youth, <strong>Aarogyam Prakritik Chikitsa Kendra</strong> (natural therapy), <strong>Shri Go Seva & Go Sanvardhan Kendra</strong> (cow protection), humanitarian relief distribution, and community development programmes.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3.5 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-1">
                    <span className="font-bold text-foundation-forest block">Head Office:</span>
                    <p className="text-stone-600">Anjikar House, Panchpaoli, Timki Chimabai Peth, Nagpur – 440018</p>
                  </div>
                  <div className="p-3.5 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-1">
                    <span className="font-bold text-foundation-forest block">Field Project Office:</span>
                    <p className="text-stone-600">434 Anjikar Bagh, Mansar Mahuli Rd, Mahuli, Parseoni, Nagpur – 441105</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-4">
                <Card3D maxRotate={8} scaleOnHover={1.02}>
                  <div className="rounded-3xl overflow-hidden border-2 border-foundation-gold/40 shadow-xl bg-white p-6 space-y-4 text-center">
                    <img
                      src="/assets/images/logo.jpg"
                      alt="SBBM Social Foundation Official Emblem"
                      className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-foundation-gold shadow-md"
                    />
                    <div>
                      <h3 className="font-display font-bold text-lg text-foundation-charcoal">
                        SBBM SOCIAL FOUNDATION
                      </h3>
                      <p className="text-xs text-foundation-crimson font-bold mt-0.5">
                        Estd 2015 • Regd. F-33193
                      </p>
                    </div>
                    <p className="text-xs text-stone-600 italic">
                      “We believe every child deserves a chance to dream, every woman deserves the power to grow, and every elderly person deserves love and respect.”
                    </p>
                  </div>
                </Card3D>

                <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-md bg-white">
                  <div className="h-44 overflow-hidden relative">
                    <img
                      src="/assets/images/ashram/ashram_exterior_main.jpg"
                      alt="Vyenkatesh Ashram Field Campus at Mahuli"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 bg-stone-900/80 text-white text-[10px] px-2.5 py-0.5 rounded backdrop-blur-xs font-semibold">
                      Field Project Campus • Mahuli
                    </span>
                  </div>
                  <div className="p-3 text-[11px] text-stone-600 text-center">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200 shadow-soft space-y-3">
                <div className="w-10 h-10 rounded-xl bg-foundation-crimson/10 text-foundation-crimson flex items-center justify-center font-bold">
                  <Star className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-display font-bold text-foundation-charcoal">
                  Our Vision
                </h3>
                <p className="text-xs md:text-sm text-stone-700 leading-relaxed">
                  SBBM Social Foundation envisions a caring, compassionate, and self-reliant society where everyone lives with dignity, respect, and equal opportunities. We are committed to providing love, care, and security to senior citizens, empowering women through education, skills, and economic independence, and building a brighter future for children through education, sports, culture, moral values, and spiritual growth.
                </p>
                <p className="text-xs md:text-sm text-stone-700 leading-relaxed">
                  Guided by humanity and the spirit of service, we aim to build a society where no one is left behind and everyone has the opportunity to live a better, happier, and more dignified life.
                </p>
              </div>

              <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200 shadow-soft space-y-3">
                <div className="w-10 h-10 rounded-xl bg-foundation-forest/10 text-foundation-forest flex items-center justify-center font-bold">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-display font-bold text-foundation-charcoal">
                  Our Mission
                </h3>
                <p className="text-xs md:text-sm text-stone-700 leading-relaxed">
                  To serve senior citizens with love, care, and dignity; empower women through education, skill development, and economic independence; and nurture children through quality education, sports, moral values, and spiritual growth.
                </p>
                <p className="text-xs md:text-sm text-stone-700 leading-relaxed">
                  SBBM Social Foundation is committed to uplifting underprivileged rural and urban communities through healthcare, livelihood opportunities, and community development. Our mission is to create equal opportunities, strengthen self-reliance, and build a society where every elderly person feels cared for, every woman feels empowered, and every child gets the opportunity to learn, grow, and shine.
                </p>
              </div>
            </div>

            {/* 10 Core Objectives from Institutional Report */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200 shadow-soft space-y-6">
              <div className="border-b border-stone-100 pb-3">
                <span className="text-xs uppercase tracking-widest text-foundation-forest font-bold">
                  Charter of Goals
                </span>
                <h3 className="text-xl font-display font-bold text-foundation-charcoal mt-1">
                  The 10 Key Objectives of SBBM Social Foundation
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {objectives.map((obj, i) => (
                  <div key={i} className="flex items-start space-x-3 p-3.5 rounded-2xl bg-foundation-warmGray/50 border border-stone-100">
                    <span className="w-6 h-6 rounded-full bg-foundation-forest text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-xs text-stone-700 leading-relaxed">
                      {obj}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FOUNDER'S MESSAGE */}
        {activeTab === 'leadership' && (
          <div className="bg-white p-6 md:p-10 rounded-3xl border border-stone-200 shadow-soft space-y-8 max-w-4xl mx-auto">
            <div className="border-b border-stone-100 pb-4">
              <span className="text-xs uppercase tracking-widest text-foundation-crimson font-bold">
                Message from the Founders
              </span>
              <h2 className="text-2xl font-display font-bold text-foundation-charcoal mt-1">
                “Service is Humanity, Love is the Cure”
              </h2>
              <p className="text-xs text-stone-500">
                Mr. Ashwin Vyenkatrao Anjikar (Founder & President) & Mrs. Tina Anjikar (Secretary & Director)
              </p>
            </div>

            {/* Founders Authentic Portraits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-center space-x-4 p-4 rounded-2xl bg-[#faf9f6] border border-stone-200">
                <img
                  src="/assets/images/leadership/ashwin_anjikar_portrait.jpg"
                  alt="Mr. Ashwin Vyenkatrao Anjikar"
                  className="w-20 h-24 object-cover rounded-xl border-2 border-foundation-gold/60 shadow-sm shrink-0"
                />
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-stone-900">Mr. Ashwin V. Anjikar</h4>
                  <p className="text-xs font-semibold text-foundation-crimson">Founder & President</p>
                  <p className="text-[11px] text-stone-500">Leading grassroots seva & resident elderly care since 2014.</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 rounded-2xl bg-[#faf9f6] border border-stone-200">
                <img
                  src="/assets/images/leadership/tina_anjikar_secretary.jpg"
                  alt="Mrs. Tina Ashwin Anjikar"
                  className="w-20 h-24 object-cover rounded-xl border-2 border-foundation-gold/60 shadow-sm shrink-0"
                />
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-stone-900">Mrs. Tina Ashwin Anjikar</h4>
                  <p className="text-xs font-semibold text-foundation-crimson">Secretary & Director</p>
                  <p className="text-[11px] text-stone-500">Directing administration, women empowerment & welfare projects.</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-stone-700 text-sm md:text-base leading-relaxed italic border-l-4 border-foundation-crimson pl-4">
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

            <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between text-xs text-stone-500 gap-2">
              <span>Nagpur, Maharashtra</span>
              <span className="font-bold text-foundation-forest">Official Helpline: +91 98908 98081 / +91 93261 72824</span>
            </div>
          </div>
        )}

        {/* TAB 4: COMMITTEE MEMBERS */}
        {activeTab === 'board' && (
          <div className="space-y-8 max-w-5xl mx-auto">
            {/* Committee Members Authentic Portraits */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200 shadow-soft space-y-5">
              <div className="border-b border-stone-100 pb-3">
                <h3 className="font-display font-bold text-xl text-foundation-charcoal">
                  Committee Members
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Dedicated leadership guiding institutional compliance and community welfare.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 text-center">
                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <img
                    src="/assets/images/governance/devkumar_moundekar.jpg"
                    alt="Devkumar Moundekar"
                    className="w-16 h-20 object-cover rounded-xl mx-auto border border-stone-300 shadow-2xs"
                  />
                  <div>
                    <h5 className="font-bold text-xs text-stone-900">Devkumar Moundekar</h5>
                    <span className="text-[10px] text-stone-500">Vice President</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <img
                    src="/assets/images/governance/kamini_parate.jpg"
                    alt="Kamini Parate"
                    className="w-16 h-20 object-cover rounded-xl mx-auto border border-stone-300 shadow-2xs"
                  />
                  <div>
                    <h5 className="font-bold text-xs text-stone-900">Kamini Parate</h5>
                    <span className="text-[10px] text-stone-500">Committee Member</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <img
                    src="/assets/images/governance/asha_umarkar.jpg"
                    alt="Asha Umarkar"
                    className="w-16 h-20 object-cover rounded-xl mx-auto border border-stone-300 shadow-2xs"
                  />
                  <div>
                    <h5 className="font-bold text-xs text-stone-900">Asha Umarkar</h5>
                    <span className="text-[10px] text-stone-500">Committee Member</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <img
                    src="/assets/images/governance/naresh_sahare.jpg"
                    alt="Naresh Sahare"
                    className="w-16 h-20 object-cover rounded-xl mx-auto border border-stone-300 shadow-2xs"
                  />
                  <div>
                    <h5 className="font-bold text-xs text-stone-900">Naresh Sahare</h5>
                    <span className="text-[10px] text-stone-500">Committee Member</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <img
                    src="/assets/images/governance/gangaram_bokde.jpg"
                    alt="Gangaram Bokde"
                    className="w-16 h-20 object-cover rounded-xl mx-auto border border-stone-300 shadow-2xs"
                  />
                  <div>
                    <h5 className="font-bold text-xs text-stone-900">Gangaram Bokde</h5>
                    <span className="text-[10px] text-stone-500">Committee Member</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <img
                    src="/assets/images/governance/narendra_mathurkar.jpg"
                    alt="Narendra Mathurkar"
                    className="w-16 h-20 object-cover rounded-xl mx-auto border border-stone-300 shadow-2xs"
                  />
                  <div>
                    <h5 className="font-bold text-xs text-stone-900">Narendra Mathurkar</h5>
                    <span className="text-[10px] text-stone-500">Committee Member</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <img
                    src="/assets/images/governance/sham_alone.jpg"
                    alt="Sham Alone"
                    className="w-16 h-20 object-cover rounded-xl mx-auto border border-stone-300 shadow-2xs"
                  />
                  <div>
                    <h5 className="font-bold text-xs text-stone-900">Sham Alone</h5>
                    <span className="text-[10px] text-stone-500">Committee Member</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <img
                    src="/assets/images/governance/pravin_hawelikar.jpg"
                    alt="Pravin Hawelikar"
                    className="w-16 h-20 object-cover rounded-xl mx-auto border border-stone-300 shadow-2xs"
                  />
                  <div>
                    <h5 className="font-bold text-xs text-stone-900">Pravin Hawelikar</h5>
                    <span className="text-[10px] text-stone-500">Committee Member</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <img
                    src="/assets/images/governance/sagar_jugade.jpg"
                    alt="Sagar Jugade"
                    className="w-16 h-20 object-cover rounded-xl mx-auto border border-stone-300 shadow-2xs"
                  />
                  <div>
                    <h5 className="font-bold text-xs text-stone-900">Sagar Jugade</h5>
                    <span className="text-[10px] text-stone-500">Committee Member</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <img
                    src="/assets/images/governance/vasant_kumbhare.jpg"
                    alt="Vasantrao Kumbhare"
                    className="w-16 h-20 object-cover rounded-xl mx-auto border border-stone-300 shadow-2xs"
                  />
                  <div>
                    <h5 className="font-bold text-xs text-stone-900">Vasantrao Kumbhare</h5>
                    <span className="text-[10px] text-stone-500">Committee Member</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <img
                    src="/assets/images/governance/surendra_meshram.jpg"
                    alt="Surendra Meshram"
                    className="w-16 h-20 object-cover rounded-xl mx-auto border border-stone-300 shadow-2xs"
                  />
                  <div>
                    <h5 className="font-bold text-xs text-stone-900">Surendra Meshram</h5>
                    <span className="text-[10px] text-stone-500">Committee Member</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <img
                    src="/assets/images/governance/anil_nandanwar.jpg"
                    alt="Anil Nandanwar"
                    className="w-16 h-20 object-cover rounded-xl mx-auto border border-stone-300 shadow-2xs"
                  />
                  <div>
                    <h5 className="font-bold text-xs text-stone-900">Anil Nandanwar</h5>
                    <span className="text-[10px] text-stone-500">Committee Member</span>
                  </div>
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
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200 shadow-soft space-y-4">
              <h3 className="text-xl font-display font-bold text-foundation-charcoal">
                Future Development Priorities
              </h3>
              <p className="text-xs text-stone-600">
                The Foundation focuses on the following strategic priorities in the coming years:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-700 pt-1">
                <p>• Strengthening healthcare, accommodation, and geriatric facilities</p>
                <p>• Expanding computer education and employment-oriented skill training</p>
                <p>• Supporting women’s self-help groups and micro-entrepreneurship</p>
                <p>• Conducting rural tuberculosis (TB) awareness and sanitation drives</p>
                <p>• Strengthening cow protection, tree plantation, and environmental conservation</p>
                <p>• Developing sustainable social welfare projects in partnership with CSR donors</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: REGISTRATIONS, 12A/80G & TRANSPARENCY */}
        {activeTab === 'certificates' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200 shadow-soft space-y-6">
              <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-display font-bold text-foundation-charcoal">
                    Verified Legal & Tax Registration Profile
                  </h3>
                  <p className="text-xs text-stone-500">
                    Primary institutional documentation verifying non-profit transparency
                  </p>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                  100% Verified
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-stone-500">Organisation Name</span>
                  <p className="font-bold text-stone-900 text-sm">SBBM Social Foundation</p>
                  <p className="text-stone-500">Founded Dec 2014 • Registered 2015</p>
                </div>

                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-stone-500">Societies Registration Act, 1860</span>
                  <p className="font-bold font-mono text-stone-900 text-sm">MAH/332/15/NAG</p>
                  <p className="text-stone-500">Registered at Nagpur, Maharashtra</p>
                </div>

                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-stone-500">Bombay Public Trusts Act, 1950</span>
                  <p className="font-bold font-mono text-stone-900 text-sm">MAH/F-33193/NAG</p>
                  <p className="text-stone-500">Public Charitable Trust Status</p>
                </div>

                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-stone-500">Income Tax Act, 1961</span>
                  <p className="font-bold font-mono text-emerald-800 text-sm">12A & 80G Certified</p>
                  <p className="text-stone-500">Donations eligible for tax exemption</p>
                </div>

                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-stone-500">NITI Aayog Darpan ID</span>
                  <p className="font-bold font-mono text-stone-900 text-sm">MH/2016/</p>
                  <p className="text-stone-500">Registered on Government NGO portal</p>
                </div>

                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-stone-500">Permanent Account Number (PAN)</span>
                  <p className="font-bold font-mono text-stone-900 text-sm">AAQTS3445R</p>
                  <p className="text-stone-500">Official Society PAN Card</p>
                </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Institutional Transparency Commitment:</p>
                  <p className="mt-0.5 leading-relaxed">
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
