import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, ArrowRight, Check, MapPin, Phone,
  ChevronDown, ExternalLink, Quote, Landmark,
  Camera, X, Maximize2, HeartHandshake, Laptop,
  Baby, Briefcase, Activity, Sparkles
} from 'lucide-react';
import { InteractiveCard3D } from '../components/ui/InteractiveCard3D';
import { MagneticButton } from '../components/motion/MagneticButton';
import { AnimatedCounter } from '../components/motion/AnimatedCounter';
import { HeroParticles3D } from '../components/3d/HeroParticles3D';
import { FadeIn, StaggerContainer, StaggerItem } from '../components/motion/MotionWrapper';
import { SEO } from '../components/common/SEO';

export const Home: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [heroPhotoIdx, setHeroPhotoIdx] = useState<number>(0);
  const [activeStoryTab, setActiveStoryTab] = useState<'ashram' | 'education' | 'women' | 'goseva'>('ashram');
  const [selectedPillarCategory, setSelectedPillarCategory] = useState<string>('all');
  const [lightboxPhoto, setLightboxPhoto] = useState<{ src: string; title: string; category: string; description: string } | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  // Hero Photography Switcher
  const heroPhotos = [
    {
      src: '/assets/images/ashram/ashram_exterior_main.jpg',
      label: 'Sanctuary Campus',
      tag: 'Vyenkatesh Ashram • Mahuli',
      caption: 'Main residential complex providing safe lifelong shelter for destitute elderly parents.',
    },
    {
      src: '/assets/images/ashram/ashram_veranda_garden.jpg',
      label: 'Peaceful Veranda',
      tag: 'Anjikar Bagh Orchards',
      caption: 'Shaded verandas and green gardens where residents enjoy satsang and morning walks.',
    },
    {
      src: '/assets/images/healthcare/eye_surgery_health_camp.jpg',
      label: 'Healthcare Seva',
      tag: 'Free Medical Camps',
      caption: 'Regular diagnostic and eye surgery camps conducted for rural elders across Vidarbha.',
    },
  ];

  // Storytelling Showcase Tabs
  const storyTabs = {
    ashram: {
      title: 'Vyenkatesh Ashram — Lifelong Filial Care',
      subtitle: '“Apno Se Door... Ek Apna Ghar...”',
      image: '/assets/images/ashram/ashram_campus_life.jpg',
      badge: 'Initiative 5.1 • Flagship Sanctuary',
      description: 'Operating at 434 Anjikar Bagh, Mahuli (near Mansar), Vyenkatesh Ashram provides a safe, peaceful, and permanent residential haven for abandoned and solitary elderly mothers and fathers (Aai-Baba). Completely free of cost, residents receive dignified shelter, wholesome vegetarian Annadaan meals, daily medical supervision, and spiritual satsang.',
      points: [
        'Safe 24/7 residential quarters and dedicated attendants',
        'Three nutritious vegetarian meals served daily (Annadaan)',
        'Routine vital health checks and regular visiting physicians',
        'Spiritual bhajans, festivals, and morning garden walks',
      ],
      link: '/old-age-home',
      linkText: 'Explore Ashram Campus & Care',
    },
    education: {
      title: 'Rural Youth Education & Computer Literacy',
      subtitle: 'Bridging the Rural Digital Divide',
      image: '/assets/images/activities/central_railway_community_visit.jpg',
      badge: 'Initiative 5.3 • Digital Skilling',
      description: 'Equipping rural children and young job-seekers with hands-on computer fundamentals, MS Office productivity software, and bilingual typing certification (Marathi, Hindi, English). Through organized learning batches and textbook drives, we enable youth to secure employment and academic growth.',
      points: [
        'Hands-on computer workstation training batches',
        'Typing certifications recognized for government and private jobs',
        'Textbooks, notebooks, and student stationery distributions',
        'Mentorship for higher education and competitive entrance tests',
      ],
      link: '/services',
      linkText: 'Learn About Education Programs',
    },
    women: {
      title: 'Women’s Empowerment & Self-Help Groups (SHGs)',
      subtitle: 'Fostering Financial Independence & Dignity',
      image: '/assets/images/activities/independence_day_2022.jpg',
      badge: 'Initiative 5.5 • Self-Reliance',
      description: 'Mobilizing rural women into structured Self-Help Groups (Bachat Gat) to foster economic self-reliance. Programs include vocational tailoring and handicrafts training, banking and financial literacy, and facilitating micro-enterprise market linkage for rural women artisans.',
      points: [
        'Vocational stitching, tailoring, and handicraft workshops',
        'Self-Help Group (SHG) formation and bank credit facilitation',
        'Financial literacy and savings account empowerment',
        'Legal awareness workshops on women rights and domestic safety',
      ],
      link: '/services',
      linkText: 'View Women Empowerment Initiatives',
    },
    goseva: {
      title: 'Shri Go Seva & Aarogyam Naturopathy Kendra',
      subtitle: 'Ethical Shelter for Indigenous Cows & Holistic Wellness',
      image: '/assets/images/ashram/ashram_open_grounds.jpg',
      badge: 'Initiatives 5.7 & 5.8 • Sacred Seva',
      description: 'Nestled amidst the serene orchards of Anjikar Bagh, Shri Go Seva Kendra shelters and lovingly nurses indigenous cattle with wholesome green and dry fodder, clean water, and veterinary care. Adjacent to it, Aarogyam Prakritik Chikitsa Kendra provides free weekend naturopathy consultations, hydrotherapy, and dietary guidance.',
      points: [
        'Lifelong shelter and nutritious fodder for abandoned cattle',
        'Compassionate veterinary attention and cow protection',
        'Free weekend natural therapy and naturopathy consultations',
        'Holistic health guidance based on traditional wellness principles',
      ],
      link: '/services',
      linkText: 'Explore Go-Seva & Wellness',
    },
  };

  // Structured Secondary Initiatives (Initiatives 5.2 through 5.8)
  const secondaryInitiatives = [
    {
      num: '5.2',
      category: 'relief',
      title: 'Social Welfare & Relief Distribution',
      tagline: 'Grassroots Humanitarian Assistance',
      description: 'Doorstep distribution of dry ration kits, food grains, blankets for street dwellers, and emergency relief for vulnerable families across Nagpur District.',
      icon: HeartHandshake,
      route: '/services',
      color: '#DC2626',
    },
    {
      num: '5.3',
      category: 'education',
      title: 'Education & Computer Literacy Program',
      tagline: 'Digital Skilling for Rural Youth',
      description: 'Practical computer fundamentals, typing certification (Marathi, Hindi, English), MS Office applications, and student textbook libraries.',
      icon: Laptop,
      route: '/services',
      color: '#2563EB',
    },
    {
      num: '5.4',
      category: 'education',
      title: 'Child Welfare & Personality Growth',
      tagline: 'Character Building & Safety Awareness',
      description: 'Engaging summer camps, creative workshops (arts, drama, sports), value-based moral education, and child rights and safety drives.',
      icon: Baby,
      route: '/services',
      color: '#EA580C',
    },
    {
      num: '5.5',
      category: 'women',
      title: 'Women’s Empowerment & SHGs',
      tagline: 'Self-Reliance & Livelihood Training',
      description: 'Mobilizing rural women into Self-Help Groups (SHGs), vocational tailoring training, banking literacy, and micro-enterprise linkage.',
      icon: Briefcase,
      route: '/services',
      color: '#9333EA',
    },
    {
      num: '5.6',
      category: 'health',
      title: 'Healthcare & Public Health Camps',
      tagline: 'Preventive Medicine & Awareness',
      description: 'Free multi-specialty diagnostic camps, vision screening with free spectacles, and awareness sessions on substance de-addiction and hygiene.',
      icon: Activity,
      route: '/services',
      color: '#0891B2',
    },
    {
      num: '5.7',
      category: 'animal',
      title: 'Shri Go Seva & Sanvardhan Kendra',
      tagline: 'Ethical Shelter for Indigenous Cows',
      description: 'Nutritious green and dry fodder, clean freshwater, and compassionate lifetime veterinary care for cattle in the orchards of Anjikar Bagh.',
      icon: Sparkles,
      route: '/services',
      color: '#16A34A',
    },
    {
      num: '5.8',
      category: 'health',
      title: 'Aarogyam Prakritik Chikitsa Kendra',
      tagline: 'Free Weekend Natural Therapy',
      description: 'Inaugurated on 6 December 2018 at Mahuli, providing free weekend naturopathy consultations, hydrotherapy, mud packs, and holistic dietetics.',
      icon: Sparkles,
      route: '/services',
      color: '#059669',
    },
  ];

  const filteredInitiatives = secondaryInitiatives.filter(
    (item) => selectedPillarCategory === 'all' || item.category === selectedPillarCategory
  );

  const fieldMoments = [
    {
      src: '/assets/images/healthcare/eye_surgery_health_camp.jpg',
      title: 'Free Eye Checkup & Surgery Camp',
      category: 'Health Seva',
      description: 'Specialized vision screening, cataract evaluation, and free spectacles distribution for rural elders across Vidarbha.',
    },
    {
      src: '/assets/images/ashram/ashram_campus_life.jpg',
      title: 'Serene Ashram Campus Life',
      category: 'Elderly Sanctuary',
      description: 'Peaceful morning walks, fresh orchard air, and dignified lifelong shelter at Anjikar Bagh, Mahuli.',
    },
    {
      src: '/assets/images/activities/independence_day_2022.jpg',
      title: 'Independence Day Patriotic Seva',
      category: 'Community Celebration',
      description: 'Flag hoisting, devotional bhajans, and community feast shared together with resident elders.',
    },
    {
      src: '/assets/images/activities/central_railway_community_visit.jpg',
      title: 'Central Railway Outreach Visit',
      category: 'Institutional Solidarity',
      description: 'Central Railway personnel and institutional well-wishers spending affectionate time with residents.',
    },
  ];

  const faqs = [
    {
      q: 'What is the official registration status of SBBM Social Foundation?',
      a: 'SBBM Social Foundation commenced community activities in December 2014 and was formally registered in 2015. It is registered under the Societies Registration Act, 1860 (Reg No: MAH/332/15/NAG) and the Bombay Public Trusts Act, 1950 (Reg No: MAH/F-33193/NAG). The Foundation holds 12A and 80G tax-exempt certifications under the Income Tax Act, 1961, and is registered on NITI Aayog’s Darpan Portal (MH/2016/) with PAN AAQTS3445R.',
    },
    {
      q: 'What is the relationship between SBBM Social Foundation and Vyenkatesh Ashram?',
      a: 'SBBM Social Foundation is the registered parent non-profit society governing multiple social welfare programs. Vyenkatesh Ashram is the Foundation’s dedicated residential old-age home initiative located at Mahuli, Parseoni (Nagpur District), providing shelter, healthcare, and filial care for destitute senior citizens under the emotional motto "Apno Se Door... Ek Apna Ghar...".',
    },
    {
      q: 'How does the Foundation support rural education and computer literacy?',
      a: 'Through Initiative 5.3 (Education & Computer Literacy Program), the Foundation operates practical training centers teaching rural and urban youth basic computer handling, Marathi/Hindi/English typing, Microsoft Office applications, and digital navigation skills to bridge the digital divide.',
    },
    {
      q: 'Are financial contributions eligible for Section 80G income tax benefits?',
      a: 'Yes. Donations made to SBBM Social Foundation qualify for 50% tax deduction under Section 80G of the Income Tax Act, 1961. The Foundation issues formal stamped donation receipts and Form 10BE tax certificates. We also collaborate with corporate partners for CSR initiatives under Schedule VII of the Companies Act, 2013.',
    },
    {
      q: 'Where are the Foundation’s registered offices located?',
      a: 'The Administrative Head Office is at Anjikar House, Panchpaoli, Timki Chimabai Peth, Nagpur – 440018. The Field Project Campus (housing the Elderly Care Home, Shri Go Seva Kendra, and Aarogyam Prakritik Chikitsa Kendra) is situated at 434, Anjikar Bagh, Mansar Mahuli Road, Village Mahuli, Tehsil Parseoni, District Nagpur – 441105.',
    },
  ];

  const homeJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': 'https://sbbmsocialfoundation.org/#webpage',
        'url': 'https://sbbmsocialfoundation.org/',
        'name': 'SBBM Social Foundation | Dignified Senior Care, Education & Grassroots Seva',
        'isPartOf': { '@id': 'https://sbbmsocialfoundation.org/#website' },
        'about': { '@id': 'https://sbbmsocialfoundation.org/#organization' },
        'description': 'Official portal of SBBM Social Foundation — empowering social impact, elderly care at Vyenkatesh Ashram, and grassroots welfare in Nagpur District.',
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://sbbmsocialfoundation.org/#faq',
        'mainEntity': faqs.map((f) => ({
          '@type': 'Question',
          'name': f.q,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': f.a,
          },
        })),
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAF9] text-[#334155] font-sans antialiased selection:bg-[#8B1D24] selection:text-white">
      <SEO
        title="SBBM Social Foundation"
        canonicalPath="/"
        jsonLd={homeJsonLd}
      />

      {/* =========================================================================
          SECTION A: CINEMATIC HERO SECTION
          Clean, authoritative editorial canvas with floating 3D ambient particles
          and interactive authentic photography showcase.
         ========================================================================= */}
      <section className="relative overflow-hidden border-b border-[#E5E7EB] py-14 lg:py-20 bg-gradient-to-b from-[#FAF9F6] via-white to-[#FAF9F6]">
        {/* Subtle 3D Ambient Particles Canvas */}
        <HeroParticles3D />

        <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

          {/* Left Column: Authoritative Editorial Storytelling */}
          <div className="lg:col-span-7 space-y-6">
            <FadeIn direction="up" delay={0.05}>
              <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-[#FDF2F2] border border-[#FCDADA] text-[#8B1D24] text-xs font-bold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#8B1D24] animate-pulse" />
                <span>Estd. Dec 2014 • Registered Society MAH/332/15/NAG • Section 12A & 80G Certified Non-Profit</span>
              </div>
            </FadeIn>

            <FadeIn direction="up" delay={0.12}>
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#0F172A] leading-[1.12]">
                  Serving humanity with <span className="text-[#8B1D24] underline decoration-[#8B1D24]/20 underline-offset-8">dignity</span>, education, and lifelong care.
                </h1>
                <p className="text-sm sm:text-base text-[#8B1D24] font-serif italic pt-1">
                  “Service is Humanity • Education is Development • Self-Reliance is Empowerment”
                </p>
              </div>
            </FadeIn>

            <FadeIn direction="up" delay={0.18}>
              <p className="text-sm sm:text-base text-[#475569] leading-relaxed max-w-2xl">
                <strong>SBBM Social Foundation</strong> is an active grassroots non-profit dedicated to uplifting destitute senior citizens at Vyenkatesh Ashram, empowering rural youth with digital computer skills, fostering women’s self-reliance, and providing social relief across Nagpur District since December 2014.
              </p>
            </FadeIn>

            {/* Primary & Secondary Action Buttons */}
            <FadeIn direction="up" delay={0.24}>
              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <Link to="/support">
                  <MagneticButton className="px-6 py-3.5 bg-[#8B1D24] hover:bg-[#6E1419] text-white font-semibold text-xs rounded-xl transition-all shadow-md flex items-center space-x-2">
                    <Heart className="w-4 h-4 fill-white" />
                    <span>Support Our Work (80G Tax Deductible)</span>
                  </MagneticButton>
                </Link>

                <Link to="/services">
                  <MagneticButton className="px-5 py-3.5 bg-white hover:bg-stone-50 border border-stone-300 text-[#0F172A] font-semibold text-xs rounded-xl transition-all shadow-xs flex items-center space-x-2">
                    <span>Explore What We Do</span>
                    <ArrowRight className="w-4 h-4 text-[#8B1D24]" />
                  </MagneticButton>
                </Link>

                <a
                  href="https://vyenkateshashram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit Vyenkatesh Ashram official website (opens in a new tab)"
                  className="inline-block"
                >
                  <MagneticButton className="px-5 py-3.5 bg-white hover:bg-[#FDF8F3] border border-stone-300 hover:border-[#8B1D24]/40 text-[#0F172A] hover:text-[#8B1D24] font-semibold text-xs rounded-xl transition-all shadow-xs flex items-center space-x-2 group cursor-pointer">
                    <Landmark className="w-4 h-4 text-[#8B1D24] group-hover:scale-110 transition-transform duration-200" />
                    <span>Visit Vyenkatesh Ashram</span>
                    <ExternalLink className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#8B1D24] transition-colors" />
                  </MagneticButton>
                </a>
              </div>
            </FadeIn>

            {/* Verified Helpline & Headquarters Strip */}
            <FadeIn direction="up" delay={0.3}>
              <div className="pt-4 flex flex-wrap items-center gap-4 text-xs text-[#64748B] border-t border-stone-200/80">
                <span className="flex items-center space-x-1.5 font-medium">
                  <Phone className="w-3.5 h-3.5 text-[#8B1D24]" />
                  <span>24/7 Helplines: <a href="tel:+919890898081" className="font-bold text-[#0F172A] hover:text-[#8B1D24] transition-colors">+91 98908 98081</a> / <a href="tel:+919326172824" className="font-bold text-[#0F172A] hover:text-[#8B1D24] transition-colors">+91 93261 72824</a></span>
                </span>
                <span className="hidden sm:inline text-stone-300">•</span>
                <span className="flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#8B1D24]" />
                  <span>Nagpur City & Mahuli Campus</span>
                </span>
              </div>
            </FadeIn>
          </div>

          {/* Right Column: Interactive Authentic Photography Showcase */}
          <div className="lg:col-span-5">
            <FadeIn direction="left" delay={0.2}>
              <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-card space-y-4 relative">

                {/* Active Photo Container with Cross-Fade */}
                <div className="h-64 sm:h-76 rounded-2xl overflow-hidden relative border border-stone-200 bg-stone-900 group">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={heroPhotos[heroPhotoIdx].src}
                      src={heroPhotos[heroPhotoIdx].src}
                      alt={heroPhotos[heroPhotoIdx].label}
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="w-full h-full object-cover"
                    />
                  </AnimatePresence>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />

                  {/* Caption & Location Tag */}
                  <div className="absolute bottom-3 left-3 right-3 text-white space-y-1">
                    <span className="inline-block px-2.5 py-0.5 rounded bg-[#8B1D24]/90 text-[10.5px] font-bold tracking-wide">
                      {heroPhotos[heroPhotoIdx].tag}
                    </span>
                    <p className="text-xs text-stone-200 line-clamp-1">
                      {heroPhotos[heroPhotoIdx].caption}
                    </p>
                  </div>
                </div>

                {/* Interactive Thumbnail Switcher */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {heroPhotos.map((item, idx) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setHeroPhotoIdx(idx)}
                      className={`text-left p-2 rounded-xl border transition-all cursor-pointer ${heroPhotoIdx === idx
                          ? 'border-[#8B1D24] bg-[#FDF2F2] ring-2 ring-[#8B1D24]/20'
                          : 'border-stone-200 hover:border-stone-300 bg-stone-50'
                        }`}
                    >
                      <span className={`block text-[10px] uppercase font-bold tracking-wider ${heroPhotoIdx === idx ? 'text-[#8B1D24]' : 'text-stone-500'}`}>
                        View {idx + 1}
                      </span>
                      <strong className="block text-xs font-semibold text-[#0F172A] truncate">
                        {item.label}
                      </strong>
                    </button>
                  ))}
                </div>

                {/* Institutional Registry Badges */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <img
                      src="/assets/images/logo.jpg"
                      alt="SBBM Social Foundation Emblem"
                      className="w-7 h-7 rounded-full border border-stone-300 object-cover"
                    />
                    <div>
                      <span className="block font-bold text-[#0F172A] text-[11.5px] leading-none">
                        SBBM Social Foundation
                      </span>
                      <span className="text-[10px] text-stone-500">Regd. F-33193 • PAN: AAQTS3445R</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded border border-emerald-200">
                    Verified Society
                  </span>
                </div>

              </div>
            </FadeIn>
          </div>

        </div>
      </section>

      {/* =========================================================================
          METRICS STRIP: Verified Institutional Impact (Animated Counters)
         ========================================================================= */}
      <section className="bg-white border-b border-[#E5E7EB] py-8">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">

            <StaggerItem className="space-y-1 p-2">
              <p className="text-2xl md:text-4xl font-bold text-[#8B1D24] tracking-tight">
                Dec 2014
              </p>
              <p className="text-xs text-[#0F172A] font-bold">Commencement of Service</p>
              <p className="text-[11px] text-[#64748B]">Over a decade of continuous service</p>
            </StaggerItem>

            <StaggerItem className="space-y-1 p-2 border-l border-stone-200">
              <p className="text-2xl md:text-4xl font-bold text-[#0F172A] tracking-tight">
                <AnimatedCounter value={8} suffix=" Pillars" />
              </p>
              <p className="text-xs text-[#0F172A] font-bold">Core Welfare Programs</p>
              <p className="text-[11px] text-[#64748B]">Elderly care, youth, education, cow sanctuary</p>
            </StaggerItem>

            <StaggerItem className="space-y-1 p-2 border-l border-stone-200">
              <p className="text-2xl md:text-4xl font-bold text-[#8B1D24] tracking-tight">
                12A & 80G
              </p>
              <p className="text-xs text-[#0F172A] font-bold">Income Tax Certified</p>
              <p className="text-[11px] text-[#64748B]">50% tax deduction for contributors</p>
            </StaggerItem>

            <StaggerItem className="space-y-1 p-2 border-l border-stone-200">
              <p className="text-2xl md:text-4xl font-bold text-emerald-700 tracking-tight">
                100% Free
              </p>
              <p className="text-xs text-[#0F172A] font-bold">Destitute Senior Care</p>
              <p className="text-[11px] text-[#64748B]">Boarding, meals & healthcare provided gratis</p>
            </StaggerItem>

          </StaggerContainer>
        </div>
      </section>

      {/* =========================================================================
          SECTION B: INTERACTIVE INSTITUTIONAL NARRATIVE
          Interactive 4-pillar tabs with genuine photography & verified facts.
         ========================================================================= */}
      <section className="py-16 md:py-24 bg-[#FAFAF9] border-b border-stone-200">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 space-y-12">

          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold text-[#8B1D24] uppercase tracking-wider block">
              Core Institutional Story
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#0F172A] leading-tight">
              Restoring dignity to elders and building self-reliance for rural families.
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
              Founded under the leadership of <strong>Mr. Ashwin Vyenkatrao Anjikar</strong> (President) and <strong>Mrs. Tina Anjikar</strong> (Secretary), SBBM Social Foundation addresses the critical needs of destitute elders and rural communities across Vidarbha through four interconnected seva initiatives:
            </p>
          </div>

          {/* Interactive Story Tabs */}
          <div className="space-y-8">
            <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-3 text-xs font-bold">
              {[
                { id: 'ashram', label: '1. Elderly Sanctuary (Vyenkatesh Ashram)' },
                { id: 'education', label: '2. Rural Youth Computer Literacy' },
                { id: 'women', label: '3. Women’s Self-Help Groups (SHGs)' },
                { id: 'goseva', label: '4. Shri Go Seva & Naturopathy' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveStoryTab(tab.id as any)}
                  className={`px-4 py-2.5 rounded-full transition-all cursor-pointer ${activeStoryTab === tab.id
                      ? 'bg-[#8B1D24] text-white shadow-md'
                      : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Active Story Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStoryTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="bg-white rounded-3xl border border-stone-200 p-6 md:p-10 shadow-card grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-5 h-72 sm:h-84 rounded-2xl overflow-hidden border border-stone-200 bg-stone-900">
                  <img
                    src={storyTabs[activeStoryTab].image}
                    alt={storyTabs[activeStoryTab].title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="lg:col-span-7 space-y-5">
                  <div className="space-y-1">
                    <span className="text-xs font-mono font-bold text-[#8B1D24] uppercase tracking-wider block">
                      {storyTabs[activeStoryTab].badge}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A]">
                      {storyTabs[activeStoryTab].title}
                    </h3>
                    <p className="text-xs font-serif italic text-[#8B1D24]">
                      {storyTabs[activeStoryTab].subtitle}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                    {storyTabs[activeStoryTab].description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#334155] pt-1">
                    {storyTabs[activeStoryTab].points.map((pt, i) => (
                      <div key={i} className="flex items-start space-x-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex items-center space-x-4">
                    <Link
                      to={storyTabs[activeStoryTab].link}
                      className="px-5 py-2.5 rounded-xl bg-[#8B1D24] hover:bg-[#6E1419] text-white text-xs font-semibold transition-colors flex items-center space-x-2 shadow-xs"
                    >
                      <span>{storyTabs[activeStoryTab].linkText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Founder Ethos Strip */}
          <div className="p-6 md:p-8 bg-white rounded-3xl border border-stone-200 shadow-soft grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-2 flex items-center justify-center">
              <img
                src="/assets/images/leadership/ashwin_anjikar_president.jpg"
                alt="Mr. Ashwin V. Anjikar — President"
                className="w-24 h-28 object-cover rounded-2xl border-2 border-[#8B1D24]/20 shadow-xs"
              />
            </div>
            <div className="lg:col-span-10 space-y-2">
              <Quote className="w-6 h-6 text-[#8B1D24]/30" />
              <p className="text-xs sm:text-sm text-[#334155] italic leading-relaxed font-serif">
                “Our elders are not beneficiaries; they are our mothers and fathers (‘Aai-Baba’). At Vyenkatesh Ashram and across all our welfare initiatives, our sacred duty is to provide them with safety, peace, and loving companionship in their twilight years.”
              </p>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                <span className="font-bold text-[#0F172A]">
                  — Mr. Ashwin Vyenkatrao Anjikar (Founder & President)
                </span>
                <Link to="/about" className="text-[#8B1D24] hover:underline font-semibold">
                  Read Full Leadership Profile & Governance →
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION C: WHAT WE DO (THE 8 PILLARS)
          Comprehensive directory with interactive category filter pills.
         ========================================================================= */}
      <section className="py-16 md:py-24 bg-white border-y border-[#E5E7EB]">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 space-y-12">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="max-w-2xl space-y-2">
              <span className="text-xs font-bold text-[#8B1D24] uppercase tracking-wider block">
                Comprehensive Program Directory (2015–2026)
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#0F172A]">
                The 8 Pillars of Community Service
              </h2>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                Every initiative addresses an authentic grassroots need across Nagpur District, structured according to Section 5 of the Foundation's Official Charter.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 self-start md:self-auto text-xs font-semibold">
              {[
                { id: 'all', label: 'All 8 Pillars' },
                { id: 'health', label: 'Healthcare' },
                { id: 'education', label: 'Youth & Skilling' },
                { id: 'women', label: 'Women' },
                { id: 'animal', label: 'Go-Seva' },
                { id: 'relief', label: 'Relief' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedPillarCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${selectedPillarCategory === cat.id
                      ? 'bg-[#8B1D24] text-white shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                    }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* FLAGSHIP FEATURE CARD: Initiative 5.1 (Vyenkatesh Ashram) */}
          <InteractiveCard3D className="p-6 md:p-8 bg-[#FAF9F6] border border-stone-200">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-stone-200">
                <img
                  src="/assets/images/ashram/ashram_veranda_garden.jpg"
                  alt="Vyenkatesh Ashram Shaded Veranda and Grounds"
                  className="w-full h-64 sm:h-76 object-cover"
                />
              </div>

              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 bg-[#8B1D24] text-white font-mono font-bold text-[10px] rounded">
                    Initiative 5.1
                  </span>
                  <span className="text-xs font-bold text-[#8B1D24]">
                    Elderly Residential Sanctuary • Flagship Program
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A]">
                  Elderly Care – Vyenkatesh Ashram (Old Age Home)
                </h3>

                <p className="text-xs font-serif italic text-[#8B1D24]">
                  “Apno Se Door... Ek Apna Ghar...”
                </p>

                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                  Operating at Anjikar Bagh, Mahuli (near Mansar), Vyenkatesh Ashram provides a loving, secure, and permanent home for abandoned, widowed, or solitary senior citizens. Residents are cared for with filial reverence as "Aai-Baba", receiving nutritious vegetarian meals, clean living rooms, daily medical checkups, spiritual satsang, and dignified lifelong care.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#334155] pt-1">
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>24/7 safe residential accommodation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Three home-cooked vegetarian meals daily</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Routine vital checks & visiting doctor</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Daily morning garden walks in Anjikar Bagh</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Link
                    to="/old-age-home"
                    className="px-5 py-2.5 bg-[#8B1D24] hover:bg-[#6E1419] text-white font-semibold text-xs rounded-xl transition-colors flex items-center space-x-1.5 shadow-xs"
                  >
                    <span>Explore Senior Care Program</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    to="/admission"
                    className="px-4 py-2.5 bg-white hover:bg-stone-50 border border-stone-300 text-[#0F172A] font-semibold text-xs rounded-xl transition-colors"
                  >
                    Admission Guidelines & Enquiry
                  </Link>
                </div>
              </div>
            </div>
          </InteractiveCard3D>

          {/* SECONDARY INITIATIVES: Grid of Interactive 3D Cards */}
          <div className="space-y-4 pt-2">
            <h3 className="text-lg font-bold text-[#0F172A]">
              Community Development, Health & Animal Welfare Programs
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredInitiatives.map((item) => {
                const IconComp = item.icon;
                return (
                  <InteractiveCard3D
                    key={item.num}
                    className="p-5 flex flex-col justify-between space-y-4 border border-stone-200"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs"
                          style={{ backgroundColor: item.color }}
                        >
                          <IconComp className="w-4 h-4" />
                        </div>
                        <span className="font-mono text-[11px] font-bold text-[#8B1D24] bg-stone-100 px-2 py-0.5 rounded">
                          {item.num}
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-[#0F172A] leading-snug">
                        {item.title}
                      </h4>

                      <p className="text-[11px] font-medium text-[#8B1D24] italic">
                        {item.tagline}
                      </p>

                      <p className="text-xs text-[#475569] leading-relaxed line-clamp-3">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-stone-100">
                      <Link
                        to={item.route}
                        className="inline-flex items-center space-x-1 text-xs font-semibold text-[#8B1D24] hover:underline"
                      >
                        <span>Read Full Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </InteractiveCard3D>
                );
              })}
            </div>
          </div>

          <div className="text-center pt-2">
            <Link
              to="/services"
              className="inline-flex items-center space-x-1.5 px-6 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#0F172A] font-semibold text-xs border border-stone-300 transition-colors shadow-xs"
            >
              <span>View Full 8 Pillars Directory & CSR Alignment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION D: AUTHENTIC PHOTOGRAPHIC MOMENTS & LIGHTBOX
          Original photographs with interactive high-definition viewer.
         ========================================================================= */}
      <section className="py-16 md:py-24 bg-white border-b border-[#E5E7EB]">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs font-bold text-[#8B1D24] uppercase tracking-wider flex items-center space-x-1.5">
                <Camera className="w-3.5 h-3.5" />
                <span>Documented Field Evidence • Original Photographs</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">
                Real Faces, Real Service, Authentic Impact
              </h2>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                Click any photograph to view in high definition. Every image documents authentic humanitarian service at Vyenkatesh Ashram and across rural Vidarbha.
              </p>
            </div>

            <Link
              to="/gallery"
              className="inline-flex items-center space-x-2 text-xs font-semibold text-[#8B1D24] hover:text-[#6E1419] bg-[#FDF2F2] hover:bg-[#FCE8E8] border border-[#FCDADA] px-4 py-2.5 rounded-xl transition-all self-start md:self-auto shrink-0 shadow-2xs"
            >
              <span>Explore Complete Gallery</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 4-Card Photo Grid with Interactive Click-to-Zoom */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {fieldMoments.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setLightboxPhoto(item)}
                className="group bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-soft hover:shadow-card transition-all cursor-pointer"
              >
                <div className="h-52 overflow-hidden relative">
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="p-2 bg-white/90 text-stone-900 rounded-full shadow-lg">
                      <Maximize2 className="w-4 h-4" />
                    </span>
                  </div>
                  <span className="absolute bottom-2 left-2 bg-black/75 text-white text-[10px] font-semibold px-2.5 py-0.5 rounded backdrop-blur-xs">
                    {item.category}
                  </span>
                </div>
                <div className="p-4 space-y-1.5">
                  <h3 className="font-bold text-sm text-[#0F172A] group-hover:text-[#8B1D24] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal for Field Moments */}
      {lightboxPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setLightboxPhoto(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-stone-900 rounded-3xl overflow-hidden border border-stone-700 shadow-2xl text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxPhoto(null)}
              className="absolute top-4 right-4 z-10 bg-black/60 hover:bg-black text-white p-2 rounded-full transition-all cursor-pointer"
              aria-label="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={lightboxPhoto.src}
                alt={lightboxPhoto.title}
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>

            <div className="p-6 space-y-2 bg-stone-900">
              <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                {lightboxPhoto.category} • SBBM Social Foundation Field Evidence
              </span>
              <h2 className="text-xl font-bold text-white">
                {lightboxPhoto.title}
              </h2>
              <p className="text-xs text-stone-300 leading-relaxed">
                {lightboxPhoto.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION E: FINAL CALL TO ACTION (Visible Welcoming Campus Backdrop)
         ========================================================================= */}
      <section className="relative py-20 md:py-28 text-white overflow-hidden bg-stone-950 border-y border-stone-800">
        {/* Real Visible Background Photograph: Welcoming Entrance Gate */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/images/entrance_gate.jpg"
            alt="Vyenkatesh Ashram Welcoming Entrance Gate"
            className="w-full h-full object-cover object-center scale-105"
          />
          {/* Calibrated deep overlay: trees & gate clearly visible, text 100% readable */}
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/85 via-stone-950/70 to-stone-950/90" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold border border-white/20">
            <Heart className="w-3.5 h-3.5 fill-amber-300" />
            <span>Join Hands in Service</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white drop-shadow-sm">
            Have questions or wish to visit our campus?
          </h2>

          <p className="text-sm sm:text-base text-stone-200 max-w-xl mx-auto leading-relaxed">
            Whether you want to sponsor meals, volunteer your skills, explore CSR opportunities, or enroll an elderly resident, our doors and helplines are always open.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="px-6 py-3.5 rounded-xl bg-[#8B1D24] hover:bg-[#A82B33] text-white font-semibold text-xs transition-colors shadow-md flex items-center space-x-2"
            >
              <span>Contact Our Team</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              to="/support"
              className="px-6 py-3.5 rounded-xl bg-white/95 hover:bg-white text-[#0F172A] font-semibold text-xs transition-colors shadow-md flex items-center space-x-1.5"
            >
              <Heart className="w-3.5 h-3.5 text-[#8B1D24]" />
              <span>Donate via UPI & Bank (80G)</span>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION F: VERIFIED INSTITUTIONAL FAQ ACCORDION
         ========================================================================= */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-8 space-y-8">

          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-[#8B1D24] uppercase tracking-wider block">
              Institutional Information
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Authentic verified answers regarding governance, old-age home admissions, and statutory certifications.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-stone-50 rounded-2xl border border-stone-200 overflow-hidden shadow-subtle transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-[#0F172A] hover:bg-stone-100/60 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-stone-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-[#475569] leading-relaxed border-t border-stone-200/60">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <div className="text-center pt-2">
            <Link
              to="/faq"
              className="text-xs font-semibold text-[#8B1D24] hover:underline inline-flex items-center space-x-1"
            >
              <span>Have more questions? Read our full FAQ Knowledgebase</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
};
