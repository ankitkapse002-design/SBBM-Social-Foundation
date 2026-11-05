import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, CheckCircle2, Award, Landmark, Heart, Users, Sparkles } from 'lucide-react';

interface TimelineEvent {
  year: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  metrics: string[];
  icon: any;
}

const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    year: '2014',
    badge: 'Foundational Milestone',
    title: 'Inception of SBBM Social Foundation',
    subtitle: 'Dec 2014 • Nagpur, Maharashtra',
    description:
      'Conceptualized under the compassionate leadership of Mr. Ashwin Vyenkatrao Anjikar and Mrs. Tina Anjikar to address the systemic neglect of destitute senior citizens and rural economic distress in Vidarbha.',
    metrics: ['Initial seed corpus established', 'First volunteer core mobilized', 'Mahuli campus identified'],
    icon: Landmark,
  },
  {
    year: '2015',
    badge: 'Statutory Certification',
    title: 'Formal Government Registration',
    subtitle: 'Societies Act & Public Trusts Act',
    description:
      'Officially registered under the Societies Registration Act, 1860 (Registration No. MAH/332/15/NAG) and the Bombay Public Trusts Act, 1950 (Trust Reg. No. MAH/F-33193/NAG).',
    metrics: ['Constitution & bylaws ratified', 'Charity Commissioner seal granted', 'Section 12A registered'],
    icon: Award,
  },
  {
    year: '2016–17',
    badge: 'Flagship Sanctuary',
    title: 'Vyenkatesh Ashram Old Age Home',
    subtitle: 'Anjikar Bagh, Mahuli (near Mansar)',
    description:
      'Commenced full residential operations providing safe living quarters, daily vegetarian Annadaan meals, and compassionate lifelong care for abandoned elderly mothers and fathers (Aai-Baba).',
    metrics: ['Permanent residential sanctuary', 'Visiting physician network', 'Daily spiritual satsang'],
    icon: Heart,
  },
  {
    year: '2018',
    badge: 'Holistic Health & Go-Seva',
    title: 'Aarogyam Naturopathy & Goshala',
    subtitle: 'Inaugurated 6 December 2018',
    description:
      'Inauguration of Aarogyam Prakritik Chikitsa Kendra providing free weekend naturopathy therapies, mud packs, and hydrotherapy, alongside Shri Go-Seva Sanvardhan Kendra for indigenous cows.',
    metrics: ['Free weekend naturopathy clinic', 'Indigenous cattle shelter', 'Organic green fodder fields'],
    icon: Sparkles,
  },
  {
    year: '2020–21',
    badge: 'Humanitarian Relief',
    title: 'COVID-19 Relief & Emergency Rations',
    subtitle: 'Nagpur District Grassroots Support',
    description:
      'Continuous door-to-door distribution of grocery kits, winter blankets, hygiene essentials, and health support to daily-wage workers, migrants, and isolated elders throughout the pandemic lockdowns.',
    metrics: ['Thousands of food kits distributed', 'Zero resident infections at Ashram', 'Emergency volunteer response'],
    icon: Users,
  },
  {
    year: '2024–26',
    badge: 'Modern Digital Era',
    title: 'Digital Skilling & Unified Portals',
    subtitle: 'Education, Transparency & Community',
    description:
      'Launch of rural computer literacy programs for youth, Women Self-Help Groups (SHGs), and a unified digital platform featuring transparent admission tracking, role-based member portals, and verified 80G tax exemptions.',
    metrics: ['Unified member authentication', 'Digital admission tracking system', '100% transparent audit trails'],
    icon: CheckCircle2,
  },
];

export const InstitutionalTimeline: React.FC = () => {
  const [activeYear, setActiveYear] = useState<string>('2016–17');
  const activeEvent = TIMELINE_EVENTS.find((e) => e.year === activeYear) || TIMELINE_EVENTS[2];

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 md:p-10 shadow-card space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8B1D24]">
            Institutional Evolution (2014 – 2026)
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">
            Over a Decade of Verified Social Impact
          </h3>
          <p className="text-xs sm:text-sm text-[#475569] max-w-xl">
            From our founding vision in December 2014 to multi-sectoral community development across Nagpur District today.
          </p>
        </div>

        <span className="text-xs font-mono font-semibold text-stone-500 bg-stone-100 px-3 py-1.5 rounded-full shrink-0">
          Trust Reg: MAH/F-33193/NAG
        </span>
      </div>

      {/* Year Selector Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {TIMELINE_EVENTS.map((event) => {
          const isSelected = event.year === activeYear;
          return (
            <button
              key={event.year}
              type="button"
              onClick={() => setActiveYear(event.year)}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-[#8B1D24] text-white shadow-md'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {event.year}
            </button>
          );
        })}
      </div>

      {/* Active Milestone Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeEvent.year}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
          className="p-6 md:p-8 rounded-2xl bg-[#FAF9F6] border border-stone-200 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
        >
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider bg-stone-200 text-[#8B1D24]">
                {activeEvent.badge}
              </span>
              <span className="text-xs text-stone-500">
                {activeEvent.subtitle}
              </span>
            </div>

            <h4 className="text-xl sm:text-2xl font-bold text-[#0F172A]">
              {activeEvent.title}
            </h4>

            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
              {activeEvent.description}
            </p>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
              {activeEvent.metrics.map((metric, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-xs text-[#334155]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-medium text-[11.5px]">{metric}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 flex items-center justify-center p-6 bg-white rounded-xl border border-stone-200">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-stone-100 text-[#8B1D24] flex items-center justify-center shadow-inner">
                <activeEvent.icon className="w-7 h-7" />
              </div>
              <div className="text-xs font-mono font-bold text-[#0F172A]">
                SBBM Milestones
              </div>
              <div className="text-[11px] text-[#64748B]">
                Documented in Institutional Report
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

