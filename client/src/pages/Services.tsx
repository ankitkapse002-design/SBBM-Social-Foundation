import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Shield, CheckCircle2, Heart, ArrowRight,
  Sparkles, Phone, Compass, BookOpen, Users,
  Sun, Stethoscope, Sprout, Building2, MapPin,
  Calendar, Award, HandHeart, Info
} from 'lucide-react';
import { apiRequest } from '../api';
import { MinimalistBackdrop } from '../components/ui/MinimalistBackdrop';
import { SEO } from '../components/common/SEO';

export interface ServiceItem {
  id: string;
  slug: string;
  aliases?: string[];
  initiativeNumber?: string;
  category?: string;
  title: string;
  tagline?: string;
  shortDesc: string;
  fullDesc: string;
  benefits: string[];
  operationalStatus: string;
  location?: string;
  image: string;
}

const OFFICIAL_SERVICES: ServiceItem[] = [
  {
    id: 'srv_01',
    slug: 'elderly-care',
    aliases: ['old-age-home', 'senior-care'],
    initiativeNumber: '5.1',
    category: 'Elderly Residential Care',
    title: 'Elderly Care – Vyenkatesh Ashram (Old Age Home)',
    tagline: 'Apno Se Door... Ek Apna Ghar...',
    shortDesc: 'A dignified, loving residential sanctuary for destitute, homeless, or neglected elderly citizens (Aai-Baba) providing food, clothing, shelter, affection, security, and healthcare.',
    fullDesc: 'Initiative 5.1 of SBBM Social Foundation: Operating under the emotional motto "Apno Se Door... Ek Apna Ghar...", Vyenkatesh Ashram at Anjikar Bagh, Mahuli provides a loving, secure, and permanent residential sanctuary for elderly individuals who have been abandoned, widowed, or lack familial care. Residents are treated not as inmates, but with filial reverence as "Aai-Baba". The facility ensures nutritious vegetarian meals, clean living quarters, daily medical checkups, emotional companionship, spiritual satsang, and dignified final rites in accordance with traditional values.',
    benefits: [
      '24/7 safe, clean, and dignified residential accommodation with personal living space',
      'Three nutritious home-cooked vegetarian meals, morning tea, and evening milk daily',
      'Round-the-clock supportive attendants, routine vital checks, and visiting doctor consultations',
      'Spiritual satsang, daily morning garden walks in Anjikar Bagh, and library access',
      'Filial companionship, celebratory festivals, and dignified lifelong care'
    ],
    operationalStatus: 'active',
    location: '434, Anjikar Bagh, Mansar Mahuli Road, Mahuli, Parseoni, Nagpur',
    image: '/assets/images/ashram/ashram_exterior_main.jpg'
  },
  {
    id: 'srv_02',
    slug: 'social-welfare',
    aliases: ['relief-distribution', 'essential-commodities'],
    initiativeNumber: '5.2',
    category: 'Grassroots Social Welfare',
    title: 'Social Welfare & Essential Commodities Distribution',
    tagline: 'Direct Grassroots Relief for the Vulnerable',
    shortDesc: 'Direct distribution of dry rations, food grains, blankets, and essential relief kits to destitute families, widows, daily-wage laborers, and disaster-affected communities.',
    fullDesc: 'Initiative 5.2 of SBBM Social Foundation: Since December 2014, the foundation has prioritized direct grassroots relief for vulnerable families across Nagpur district and rural tehsils. Interventions include regular dry ration kit drives (containing wheat flour, rice, pulses, cooking oil, spices), winter blanket distributions for homeless citizens, festive cloth donations for children, and extensive emergency food and sanitization relief during disaster and pandemic emergencies.',
    benefits: [
      'Doorstep dry ration kit distribution (wheat flour, rice, dal, cooking oil, spices)',
      'Winter relief drives providing warm blankets to homeless and street dwellers',
      'Festive clothing and footwear distribution for underprivileged children',
      'Emergency disaster and pandemic relief mobilization for daily-wage earners',
      'Targeted support for destitute widows and physically challenged individuals'
    ],
    operationalStatus: 'active',
    location: 'Nagpur District, Suburban Settlements & Rural Tehsils',
    image: '/assets/images/activities/annadaan_grocery_relief.jpg'
  },
  {
    id: 'srv_03',
    slug: 'education-computer-literacy',
    aliases: ['education', 'computer-literacy'],
    initiativeNumber: '5.3',
    category: 'Education & Digital Skills',
    title: 'Education & Computer Literacy Program',
    tagline: 'Empowering Underprivileged Youth with 21st-Century Digital Skills',
    shortDesc: 'Practical computer education, typing certification, digital literacy, and educational study material distribution for rural and underprivileged students.',
    fullDesc: 'Initiative 5.3 of SBBM Social Foundation: Believing firmly that "Education is Development", SBBM Social Foundation conducts targeted education support and digital literacy programs. The foundation operates computer literacy centers teaching rural students basic computer handling, Marathi/Hindi/English typing, MS Office (Word, Excel, PowerPoint), and internet navigation. Additionally, annual notebook distribution drives, textbook libraries, and career guidance workshops equip rural youth for higher education and competitive employment.',
    benefits: [
      'Hands-on computer fundamentals and typing certification (Marathi, Hindi, English)',
      'Microsoft Office application training (Word, Excel, PowerPoint) for office readiness',
      'Free annual notebook, textbook, and stationery kit distribution drives',
      'Rural student library access and digital learning resources',
      'Educational mentorship and career guidance seminars for youth'
    ],
    operationalStatus: 'active',
    location: 'Nagpur & Surrounding Rural Learning Centers',
    image: '/assets/images/ashram/ashram_campus_life.jpg'
  },
  {
    id: 'srv_04',
    slug: 'child-welfare',
    aliases: ['summer-camps', 'personality-development'],
    initiativeNumber: '5.4',
    category: 'Child Development & Welfare',
    title: 'Child Welfare & Personality Development',
    tagline: 'Nurturing Moral Character, Creative Potential, and Child Rights',
    shortDesc: 'Holistic child development through annual summer camps, moral value education, talent workshops, child rights awareness, and nutritional support.',
    fullDesc: 'Initiative 5.4 of SBBM Social Foundation: Dedicated to the holistic flourishing of the next generation, this initiative organizes engaging summer camps, creative workshops (drawing, drama, elocution), and moral value education classes in rural and suburban Nagpur. The foundation actively conducts child safety and awareness workshops (including POCSO guidelines and child rights), provides nutritional support, and nurtures artistic and sports talents among economically backward children.',
    benefits: [
      'Annual summer camps featuring sports, yoga, arts, and creative expression',
      'Value-based moral education and cultural heritage appreciation classes',
      'Child safety, anti-bullying, and child rights awareness drives',
      'School bag, uniform, and nutrition supplement distributions',
      'Public speaking, elocution, and leadership grooming sessions'
    ],
    operationalStatus: 'active',
    location: 'Nagpur District Schools, Community Centers & Mahuli Campus',
    image: '/assets/images/activities/independence_day_2022.jpg'
  },
  {
    id: 'srv_05',
    slug: 'women-empowerment',
    aliases: ['shg-development', 'livelihood-training'],
    initiativeNumber: '5.5',
    category: 'Women Empowerment & Livelihoods',
    title: 'Women’s Empowerment & Livelihood Development',
    tagline: 'Promoting Self-Reliance, Dignity, and Financial Independence',
    shortDesc: 'Mobilization and mentoring of Self-Help Groups (SHGs), vocational training in tailoring and crafts, financial literacy, and micro-enterprise development.',
    fullDesc: 'Initiative 5.5 of SBBM Social Foundation: Under the core pillar "Self-Reliance is the Foundation of an Empowered Society", the foundation mobilizes rural and semi-urban women into active Self-Help Groups (SHGs). We provide vocational training in tailoring, garment stitching, handicraft making, and local food processing (pickles, papads, spices). Through banking literacy, micro-savings facilitation, and direct market linkage, women are empowered to generate independent family income and build community leadership.',
    benefits: [
      'Mobilization and structured guidance of Mahila Bachat Gats (Self-Help Groups)',
      'Professional tailoring, sewing, and handicraft training workshops',
      'Financial literacy, micro-credit access, and bank linkage facilitation',
      'Marketing support and exhibition stalls for home-made goods and handicrafts',
      'Legal awareness sessions on women\'s rights and domestic welfare'
    ],
    operationalStatus: 'active',
    location: 'Rural Vidarbha & Semi-Urban Clusters',
    image: '/assets/images/activities/central_railway_community_visit.jpg'
  },
  {
    id: 'srv_06',
    slug: 'healthcare-public-health',
    aliases: ['medical-care', 'health-camps'],
    initiativeNumber: '5.6',
    category: 'Public Health & Preventive Medicine',
    title: 'Healthcare & Public Health Awareness',
    tagline: 'Preventive Medicine, Health Camps, and Community Wellbeing',
    shortDesc: 'Free diagnostic health camps, eye checkups, preventive medicine, hygiene drives, substance de-addiction, and chronic illness awareness.',
    fullDesc: 'Initiative 5.6 of SBBM Social Foundation: Good health is an essential prerequisite for community empowerment. The foundation organizes periodic free medical checkup camps in rural villages and urban slums, offering general health screening, eye checkups with free spectacles, blood pressure and diabetes monitoring, and basic medicine distribution. Extensive public awareness campaigns address substance de-addiction (tobacco/alcohol), menstrual hygiene, tuberculosis (TB) detection, and cancer prevention.',
    benefits: [
      'Free multi-specialty health checkups with qualified visiting medical practitioners',
      'Free vision screening, eye examinations, and spectacles distribution',
      'Tobacco and alcohol de-addiction counseling and youth awareness sessions',
      'Community sanitation, clean water, and menstrual hygiene awareness drives',
      'Chronic disease awareness (Hypertension, Diabetes, TB, and Cancer screening)'
    ],
    operationalStatus: 'active',
    location: 'Village Camps & Slum Clusters across Nagpur District',
    image: '/assets/images/healthcare/eye_surgery_health_camp.jpg'
  },
  {
    id: 'srv_07',
    slug: 'cow-protection',
    aliases: ['goseva-kendra', 'gaushala'],
    initiativeNumber: '5.7',
    category: 'Animal Welfare & Ecology',
    title: 'Cow Protection & Animal Welfare – Shri Go Seva & Go Sanvardhan Kendra',
    tagline: 'Sanctuary for Indigenous Cattle & Sustainable Ecological Living',
    shortDesc: 'Compassionate sanctuary, veterinary care, nutritious fodder, and dignified lifetime shelter for abandoned, aging, and injured cows at Mahuli Centre.',
    fullDesc: 'Initiative 5.7 of SBBM Social Foundation: Located in the green environment of Anjikar Bagh, Mahuli, Shri Go Seva & Go Sanvardhan Kendra provides ethical shelter, green and dry fodder, freshwater, and veterinary care for indigenous cows. Beyond animal protection, the Kendra serves a vital therapeutic role: elderly ashram residents find companionship and peace interacting with the gentle cattle. Organic cow-dung and gomutra are utilized for natural composting, nourishing the surrounding fruit orchards without chemical pesticides.',
    benefits: [
      'Permanent humane shelter and daily care for indigenous abandoned or aged cows',
      'Nutritious green grass, dry fodder, cattle feed, and clean drinking water',
      'Periodic veterinary checkups, vaccination, and specialized medical treatments',
      'Organic composting and biogas utilizing cow dung for eco-friendly farming',
      'Therapeutic bovine interaction and spiritual Go-Pujan for ashram residents'
    ],
    operationalStatus: 'active',
    location: 'Anjikar Bagh, Mansar Mahuli Road, Mahuli, Parseoni, Nagpur',
    image: '/assets/images/ashram/ashram_veranda_garden.jpg'
  },
  {
    id: 'srv_08',
    slug: 'natural-therapy',
    aliases: ['naturopathy', 'aarogyam-kendra'],
    initiativeNumber: '5.8',
    category: 'Naturopathy & Holistic Wellness',
    title: 'Natural Therapy & Health Support – Aarogyam Prakritik Chikitsa Kendra',
    tagline: 'Drugless Healing, Naturopathy, and Holistic Rejuvenation (Inaugurated 6 Dec 2018)',
    shortDesc: 'Natural drugless therapy, dietetics, hydrotherapy, mud packs, yoga, and lifestyle disease management established on 6 December 2018.',
    fullDesc: 'Initiative 5.8 of SBBM Social Foundation: Formally inaugurated on 6 December 2018 at Anjikar Bagh, Mahuli, Aarogyam Prakritik Chikitsa Kendra is dedicated to promoting holistic healing without chemical drugs. Emphasizing the body\'s innate power to heal itself, the center offers free natural therapy consultations on weekends/Sundays. Therapies include hydrotherapy (hip baths, spinal baths), mud packs, sun therapy, diet counseling, acupressure, and therapeutic yoga/pranayama to manage joint pain, hypertension, digestive issues, and chronic fatigue.',
    benefits: [
      'Free Sunday naturopathy and holistic health consultation camps',
      'Hydrotherapy, mud packs, steam therapy, and natural detox treatments',
      'Personalized dietary guidelines based on natural wholesome foods',
      'Daily therapeutic yoga, pranayama, and guided relaxation routines',
      'Drugless management of lifestyle ailments (arthritis, diabetes, acidity, stress)'
    ],
    operationalStatus: 'active',
    location: 'Anjikar Bagh, Mansar Mahuli Road, Mahuli, Parseoni, Nagpur',
    image: '/assets/images/healthcare/naturopathy_vaidya_consultation.jpg'
  }
];

export const Services: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const [services, setServices] = useState<ServiceItem[]>(OFFICIAL_SERVICES);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiRequest<{ success: boolean; data: ServiceItem[] }>('/public/services')
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          // Merge API data with rich official metadata
          const merged = OFFICIAL_SERVICES.map(off => {
            const apiMatch = res.data.find(
              d => d.slug === off.slug || d.id === off.id || (off.aliases && off.aliases.includes(d.slug))
            );
            return apiMatch ? { ...off, ...apiMatch } : off;
          });
          setServices(merged);
        }
      })
      .catch(() => {
        setServices(OFFICIAL_SERVICES);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (slug) {
      const found = services.find(
        (s) => s.slug === slug || s.id === slug || (s.aliases && s.aliases.includes(slug))
      );
      if (found) {
        setSelectedService(found);
      } else {
        const fallback = OFFICIAL_SERVICES.find(
          (s) => s.slug === slug || s.id === slug || (s.aliases && s.aliases.includes(slug))
        );
        if (fallback) setSelectedService(fallback);
      }
    } else {
      setSelectedService(null);
    }
  }, [slug, services]);

  const filterOptions = [
    { id: 'all', label: 'All 8 Initiatives' },
    { id: 'elderly', label: 'Elderly & Naturopathy' },
    { id: 'education', label: 'Education & Youth' },
    { id: 'welfare', label: 'Social Relief & Women' },
    { id: 'animal', label: 'Animal Welfare & Cow Seva' },
  ];

  const filteredServices = services.filter((srv) => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'elderly') {
      return srv.slug.includes('elderly') || srv.slug.includes('old-age') || srv.slug.includes('natural') || srv.slug.includes('naturopathy');
    }
    if (filterCategory === 'education') {
      return srv.slug.includes('education') || srv.slug.includes('child');
    }
    if (filterCategory === 'welfare') {
      return srv.slug.includes('social') || srv.slug.includes('women') || srv.slug.includes('healthcare');
    }
    if (filterCategory === 'animal') {
      return srv.slug.includes('cow') || srv.slug.includes('goseva');
    }
    return true;
  });

  if (slug && selectedService) {
    return (
      <div className="min-h-screen bg-foundation-ivory py-12 md:py-16">
        <SEO
          title={`${selectedService.title} | Initiatives`}
          description={selectedService.shortDesc}
          canonicalPath={`/services/${selectedService.slug}`}
          ogImage={selectedService.image}
          jsonLd={{
            '@context': 'https://schema.org',
            '@type': 'Service',
            'name': selectedService.title,
            'description': selectedService.shortDesc,
            'provider': {
              '@type': 'NGO',
              'name': 'SBBM Social Foundation',
              'url': 'https://sbbmsocialfoundation.org',
            },
            'areaServed': 'Nagpur District, Maharashtra',
          }}
        />
        <div className="max-w-4xl mx-auto px-4 md:px-8 space-y-8">
          <Link
            to="/services"
            className="inline-flex items-center space-x-2 text-xs font-bold text-foundation-crimson hover:text-foundation-crimsonDark"
          >
            <span>← Back to All 8 Core Initiatives</span>
          </Link>

          <div className="bg-white rounded-3xl overflow-hidden border border-foundation-borderMuted shadow-soft">
            <div className="h-72 sm:h-96 relative">
              <img
                src={selectedService.image}
                alt={selectedService.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-foundation-gold text-foundation-charcoal text-[11px] font-bold">
                    Initiative {selectedService.initiativeNumber || '5.0'}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur text-white text-[11px] font-semibold">
                    {selectedService.category || 'SBBM Social Foundation'}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-display font-bold text-white">
                  {selectedService.title}
                </h1>
                {selectedService.tagline && (
                  <p className="text-xs sm:text-sm text-foundation-gold italic">
                    "{selectedService.tagline}"
                  </p>
                )}
              </div>
            </div>

            <div className="p-6 sm:p-10 space-y-8">
              {/* Location & Status Stripe */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-foundation-warmGray border border-foundation-borderMuted text-xs">
                <div className="flex items-center space-x-2 text-stone-700">
                  <MapPin className="w-4 h-4 text-foundation-crimson flex-shrink-0" />
                  <span><strong>Operational Location:</strong> {selectedService.location || 'Nagpur District / Mahuli Centre'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-bold text-emerald-800 uppercase tracking-wider text-[11px]">
                    {selectedService.operationalStatus === 'active' ? 'Fully Operational' : 'Active Program'}
                  </span>
                </div>
              </div>

              {/* Program Overview */}
              <div className="space-y-3">
                <h2 className="text-xl font-display font-bold text-foundation-charcoal flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-foundation-crimson" />
                  <span>Program Overview & Institutional Scope</span>
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed whitespace-pre-line">
                  {selectedService.fullDesc}
                </p>
              </div>

              {/* Key Features & Beneficiary Scope */}
              <div className="space-y-4 pt-2">
                <h3 className="text-base font-display font-bold text-foundation-forest flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-foundation-forest" />
                  <span>Key Features & Beneficiary Scope</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedService.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-start space-x-2 text-xs text-stone-700 bg-emerald-50/50 border border-emerald-100 p-3.5 rounded-xl">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transparent Institutional Notice */}
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 flex items-start space-x-3">
                <Info className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">Institutional Transparency & Tax Exemption Notice:</p>
                  <p>
                    All programs of SBBM Social Foundation operate under our registered non-profit charter (MAH/332/15/NAG & F-33193). Contributions to these initiatives are eligible for income tax benefits under Section 80G of the Income Tax Act, 1961.
                  </p>
                </div>
              </div>

              {/* CTA and Contact Information */}
              <div className="pt-6 border-t border-foundation-borderMuted flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs text-stone-500 space-y-1">
                  <p>Operational Helpline: <strong>+91 98908 98081 / +91 93261 72824</strong></p>
                  <p>Email: <strong>sbbmsocialfoundation@gmail.com</strong></p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    to="/support"
                    className="px-5 py-2.5 bg-foundation-crimson text-white text-xs font-bold rounded-full shadow hover:bg-foundation-crimsonDark flex items-center space-x-1.5"
                  >
                    <Heart className="w-3.5 h-3.5 fill-white" />
                    <span>Support this Program</span>
                  </Link>
                  <Link
                    to="/contact"
                    className="px-5 py-2.5 bg-foundation-forest text-foundation-ivory text-xs font-bold rounded-full shadow hover:bg-foundation-forestLight flex items-center space-x-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Enquire or Visit</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf8] py-12 md:py-16 font-sans">
      <SEO
        title="Core Social Initiatives & Grassroots Programs"
        description="Explore the 8 active grassroots welfare initiatives of SBBM Social Foundation — elder care at Vyenkatesh Ashram, free Annadaan, youth computer literacy, women self-reliance, and Go-Seva across Nagpur."
        canonicalPath="/services"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          'name': 'SBBM Social Foundation Welfare Initiatives',
          'itemListElement': OFFICIAL_SERVICES.map((s, idx) => ({
            '@type': 'ListItem',
            'position': idx + 1,
            'name': s.title,
            'description': s.shortDesc,
            'url': `https://sbbmsocialfoundation.org/services/${s.slug}`,
          })),
        }}
      />
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
        {/* Full-Width Visual Photographic Header Banner */}
        <div className="relative rounded-3xl overflow-hidden border-2 border-stone-700/60 shadow-elevated bg-stone-950 text-white p-5 sm:p-8 md:p-14 text-center">
          <div className="absolute inset-0 z-0">
            <img
              src="/assets/images/activities/community_seva_gathering_1.jpg"
              alt="SBBM Grassroots Community Seva Initiatives"
              className="w-full h-full object-cover object-center scale-105"
            />
            {/* Calibrated dark overlay: community seva clearly visible while text pops */}
            <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-stone-950/65 to-stone-950/85" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto space-y-3 sm:space-y-4">
            <div className="inline-flex flex-wrap items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl sm:rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-[11px] sm:text-xs font-bold border border-white/20">
              <Compass className="w-3.5 h-3.5 shrink-0" />
              <span>Comprehensive Institutional Programs (2015–2026)</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-5xl font-display font-bold text-white tracking-tight drop-shadow-sm leading-tight">
              Our 8 Core Initiatives &amp; Welfare Pillars
            </h1>

            <p className="text-xs md:text-sm text-stone-200 leading-relaxed max-w-2xl mx-auto">
              Founded in December 2014 and registered under the Societies Registration Act (MAH/332/15/NAG) and Bombay Public Trusts Act (F-33193). We serve grassroots communities through dignified elder care, social welfare distribution, digital education, women's self-reliance, and animal sanctuary.
            </p>

            <p className="text-xs font-semibold text-amber-200 font-serif italic">
              "Service is Humanity • Education is Development • Self-Reliance is the Foundation of an Empowered Society"
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex overflow-x-auto no-scrollbar touch-scroll-x sm:flex-wrap items-center sm:justify-center gap-2 pt-2 scroll-smooth pb-1">
          {filterOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setFilterCategory(opt.id)}
              className={`shrink-0 sm:shrink min-h-[40px] px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                filterCategory === opt.id
                  ? 'bg-foundation-crimson text-white shadow-md'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Initiatives Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((srv) => (
            <div
              key={srv.id}
              className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-soft hover:shadow-soft-lg transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="h-52 overflow-hidden relative">
                  <img
                    src={srv.image}
                    alt={srv.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-3 py-1 bg-foundation-crimson/95 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                      Initiative {srv.initiativeNumber}
                    </span>
                    <span className="px-2.5 py-1 bg-black/60 backdrop-blur text-white text-[10px] font-medium rounded-full">
                      {srv.category}
                    </span>
                  </div>
                  <span className="absolute bottom-3 right-3 px-2.5 py-0.5 bg-white/90 text-stone-700 text-[10px] font-bold rounded-full shadow-sm">
                    {srv.operationalStatus === 'active' ? 'Operational' : 'Active'}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="text-lg font-display font-bold text-foundation-charcoal group-hover:text-foundation-crimson transition-colors leading-snug">
                    {srv.title}
                  </h3>

                  {srv.tagline && (
                    <p className="text-[11px] text-foundation-crimson font-medium italic">
                      "{srv.tagline}"
                    </p>
                  )}

                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                    {srv.shortDesc}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-foundation-borderMuted/60">
                    {srv.benefits.slice(0, 2).map((b, bi) => (
                      <p key={bi} className="text-[11px] text-stone-500 flex items-start space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-foundation-forest flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{b}</span>
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 flex items-center justify-between border-t border-foundation-borderMuted/40">
                <div className="flex items-center space-x-1 text-[11px] text-stone-500">
                  <MapPin className="w-3 h-3 text-stone-400" />
                  <span className="truncate max-w-[140px]">{srv.location?.split(',')[0]}</span>
                </div>

                <Link
                  to={`/services/${srv.slug}`}
                  className="inline-flex items-center space-x-1 text-xs font-bold text-foundation-crimson hover:text-foundation-crimsonDark"
                >
                  <span>Read Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Assurance Banner with Visible Background Photograph */}
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-10 text-white shadow-elevated bg-stone-950 border border-stone-800">
          <div className="absolute inset-0 z-0">
            <img
              src="/assets/images/activities/independence_day_2022.jpg"
              alt="Community Seva & National Celebration"
              className="w-full h-full object-cover object-center scale-105"
            />
            {/* Calibrated rich dark overlay for high contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-stone-950/96 via-stone-950/88 to-stone-950/70" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left max-w-2xl">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold border border-white/20">
                <Shield className="w-3.5 h-3.5" />
                <span>Section 12A & 80G Certified Society</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-white">
                Partner With SBBM Social Foundation for CSR & Community Welfare
              </h2>
              <p className="text-xs text-stone-200 leading-relaxed">
                Explore corporate CSR partnerships under Schedule VII of the Companies Act, 2013 or sponsor meals, cow fodder, education kits, and medical checkups with 100% transparent reporting.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/support"
                className="px-6 py-3 bg-[#8B1D24] hover:bg-[#A82B33] text-white text-xs font-bold rounded-xl shadow-md transition-all"
              >
                Support Our Work
              </Link>
              <Link
                to="/contact"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold rounded-xl transition-all"
              >
                Contact Office
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
