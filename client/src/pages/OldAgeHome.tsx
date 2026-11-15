import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, CheckCircle2, Heart, Phone, MapPin, Clock,
  Calendar, Coffee, Sun, Moon, Home as HomeIcon, AlertCircle, ArrowRight,
  Sparkles, Award, FileText, Check, HeartHandshake, Utensils, Stethoscope, Flower2, ShieldAlert
} from 'lucide-react';
import { SEO } from '../components/common/SEO';

export const OldAgeHome: React.FC = () => {
  const ashramJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    'name': 'Vyenkatesh Ashram (Old Age Home)',
    'description': 'Dedicated residential senior citizen sanctuary operated by SBBM Social Foundation at Mahuli, Parseoni, Nagpur.',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': '434, Anjikar Bagh, Mansar Mahuli Road, Village Mahuli',
      'addressLocality': 'Parseoni',
      'addressRegion': 'Maharashtra',
      'postalCode': '441105',
      'addressCountry': 'IN',
    },
    'telephone': '+91-98908-98081',
    'url': 'https://sbbmsocialfoundation.org/old-age-home',
    'sameAs': 'https://vyenkateshashram.com/',
  };

  const carePillars = [
    {
      icon: <Utensils className="w-6 h-6 text-foundation-crimson" />,
      title: 'Wholesome Vegetarian Nutrition',
      description: 'Three freshly cooked, hygienic, and balanced vegetarian meals daily, along with herbal tea, breakfast, and pure milk from our Gaushala.'
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-foundation-crimson" />,
      title: '24/7 Assisted Living & Filial Care',
      description: 'Dedicated attendants who lovingly treat residents as ‘Aai-Baba’, assisting with daily mobility, personal hygiene, and emotional comfort.'
    },
    {
      icon: <Stethoscope className="w-6 h-6 text-foundation-crimson" />,
      title: 'Geriatric Health & Naturopathy',
      description: 'Regular vital monitoring, visiting doctor consultations, first-aid care, and natural holistic wellness via Aarogyam Prakritik Chikitsa.'
    },
    {
      icon: <Flower2 className="w-6 h-6 text-foundation-crimson" />,
      title: 'Spiritual Satsang & Library',
      description: 'Morning prayers, peaceful garden walks in Anjikar Bagh orchards, evening bhajan sessions, and a spiritual library for mental tranquility.'
    },
    {
      icon: <HomeIcon className="w-6 h-6 text-foundation-crimson" />,
      title: 'Clean & Airy Accommodation',
      description: 'Comfortable living quarters, anti-skid shaded verandas, separate clean restrooms, and scenic orchard surroundings free from city pollution.'
    },
    {
      icon: <Shield className="w-6 h-6 text-foundation-crimson" />,
      title: 'Dignity & Lifelong Security',
      description: 'A permanent home for destitute, solitary, or abandoned senior citizens, upholding complete dignity, mutual respect, and lifelong security.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FBFBFA] py-10 sm:py-14 md:py-16 font-sans">
      <SEO
        title="Vyenkatesh Ashram | Lifelong Senior Citizen Care & Shelter"
        description="Vyenkatesh Ashram at Mahuli, Parseoni (Nagpur District) is SBBM Social Foundation's residential old-age home providing lifelong dignity, 24/7 care, nutritious meals, and medical support."
        canonicalPath="/old-age-home"
        ogImage="/assets/images/ashram/ashram_veranda_garden.jpg"
        jsonLd={ashramJsonLd}
      />
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8 sm:space-y-12">
        {/* Full-Width Visual Photographic Header Banner */}
        <div className="relative rounded-3xl overflow-hidden border border-[#1E293B] shadow-card bg-[#0A111A] text-white p-6 sm:p-10 md:p-16 text-center">
          <div className="absolute inset-0 z-0">
            <img
              src="/assets/images/ashram/ashram_veranda_garden.jpg"
              alt="Vyenkatesh Ashram Shaded Veranda and Grounds"
              className="w-full h-full object-cover object-[center_35%] scale-105"
            />
            {/* Calibrated dark overlay: veranda & palms clearly visible */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A111A]/90 via-[#0A111A]/75 to-[#0A111A]/92" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto space-y-3 sm:space-y-5">
            <div className="inline-flex flex-wrap items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0E1726]/80 backdrop-blur-md text-[#C5A059] text-xs sm:text-sm font-bold border border-[#C5A059]/30">
              <HomeIcon className="w-4 h-4 text-[#C5A059] shrink-0" />
              <span>Initiative 5.1 of SBBM Social Foundation • Mahuli Campus</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white tracking-tight drop-shadow-sm leading-tight">
              Elderly Care – Vyenkatesh Ashram
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-[#C5A059] font-serif italic">
              “Apno Se Door... Ek Apna Ghar...”
            </p>

            <p className="text-sm sm:text-base md:text-[17px] text-slate-200 leading-relaxed max-w-2xl mx-auto">
              A loving, non-granted residential sanctuary operated by SBBM Social Foundation at Anjikar Bagh, Mahuli to provide senior citizens (“Aai-Baba”) with dignified living, nutritious vegetarian meals, and filial affection.
            </p>
          </div>
        </div>

        {/* Feature Hero Card with Building Image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl p-6 sm:p-8 md:p-12 border border-stone-200 shadow-soft">
          <div className="lg:col-span-6 rounded-2xl overflow-hidden border border-stone-200 shadow-md">
            <img
              src="/assets/images/ashram/ashram_exterior_main.jpg"
              alt="Vyenkatesh Ashram Building Exterior at Mahuli"
              className="w-full h-64 sm:h-80 lg:h-96 object-cover"
            />
          </div>

          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-red-50 text-foundation-crimson rounded-full text-xs font-bold uppercase tracking-wider">
              <Heart className="w-4 h-4 fill-foundation-crimson shrink-0" />
              <span>Dignified Senior Living with Filial Care</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-stone-900 tracking-tight leading-snug">
              A Home Designed for Peace, Companionship &amp; Care
            </h2>

            <p className="text-sm sm:text-base md:text-[17px] text-stone-600 leading-relaxed">
              Located away from urban noise and pollution in the tranquil orchards of Anjikar Bagh, Mahuli (near Mansar), our facility features spacious rooms, wide shaded verandas, separate hygienic restrooms, a clean dining hall, and 24/7 attentive attendants who treat residents as their own family.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-sm sm:text-[15px] text-stone-700 font-medium">
              <div className="flex items-center space-x-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Clean, Comfortable Living Rooms</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Separate Restroom Facilities</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Nutritious Home-Cooked Meals</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>24/7 Supportive Attendants</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Daily Spiritual Satsang &amp; Library</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Visiting Doctor &amp; First-Aid Care</span>
              </div>
            </div>

            <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                to="/admission"
                className="w-full sm:w-auto px-6 py-3.5 min-h-[48px] bg-foundation-crimson hover:bg-foundation-crimsonDark text-white font-bold text-sm uppercase tracking-wider rounded-full shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Submit Admission Enquiry</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </Link>
              <a
                href="tel:+919890898081"
                className="w-full sm:w-auto px-5 py-3.5 min-h-[48px] bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-sm uppercase tracking-wider rounded-full border border-stone-300 transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Phone className="w-4 h-4 text-foundation-crimson shrink-0" />
                <span>Call +91 98908 98081</span>
              </a>
            </div>
          </div>
        </div>

        {/* Dignified Institutional Elderly Care Pillars (Redesigned Non-Photo Sanctuary Showcase) */}
        <div className="space-y-6 sm:space-y-8">
          <div className="text-center space-y-2 max-w-3xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-foundation-crimson font-bold">
              Our Sacred Commitment
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foundation-charcoal tracking-tight">
              Comprehensive Care &amp; Dignity for "Aai-Baba"
            </h2>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              Every resident at Vyenkatesh Ashram is embraced with filial affection, sincere devotion, and round-the-clock comfort in a peaceful, natural environment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {carePillars.map((pillar, idx) => (
              <div
                key={idx}
                className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200 shadow-soft hover:shadow-soft-lg transition-all space-y-3.5 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-foundation-crimson/10 flex items-center justify-center">
                    {pillar.icon}
                  </div>
                  <h3 className="font-display font-bold text-lg sm:text-xl text-stone-900">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
                <div className="pt-2 border-t border-stone-100 flex items-center space-x-1.5 text-xs font-semibold text-foundation-crimson">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Provided with complete institutional dedication</span>
                </div>
              </div>
            ))}
          </div>

          {/* Ashram Campus Facilities Strip (Visual Environmental Highlights) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-soft">
              <div className="h-52 overflow-hidden">
                <img
                  src="/assets/images/ashram/ashram_veranda_garden.jpg"
                  alt="Shaded Veranda & Green Garden"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5 space-y-1.5">
                <h4 className="font-bold text-base sm:text-lg text-stone-900">Shaded Verandas &amp; Peaceful Garden</h4>
                <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">Spacious green walkways and seating areas in the clean orchard atmosphere of Anjikar Bagh.</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-soft">
              <div className="h-52 overflow-hidden">
                <img
                  src="/assets/images/ashram/ashram_dining_hall.jpg"
                  alt="Clean Dining & Prayer Hall"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5 space-y-1.5">
                <h4 className="font-bold text-base sm:text-lg text-stone-900">Hygienic Dining &amp; Satsang Hall</h4>
                <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">Three wholesome home-cooked vegetarian meals served daily with dignity and hygiene.</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-soft">
              <div className="h-52 overflow-hidden">
                <img
                  src="/assets/images/ashram/ashram_campus_life.jpg"
                  alt="Morning Campus Life"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5 space-y-1.5">
                <h4 className="font-bold text-base sm:text-lg text-stone-900">Tranquil Campus Environment</h4>
                <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">Situated in Mahuli near Mansar away from noise and pollution, ensuring peace of mind.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Schedule Routine */}
        <div className="space-y-6 sm:space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase tracking-widest text-foundation-crimson font-bold">
              Purposeful Living
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foundation-charcoal tracking-tight">
              Daily Schedule &amp; Resident Life
            </h2>
            <p className="text-sm sm:text-base text-stone-600">
              A balanced daily rhythm designed for physical vitality, mental peace, and warm companionship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-soft space-y-2.5">
              <div className="flex items-center justify-between text-foundation-crimson">
                <Sun className="w-5 h-5 text-amber-500" />
                <span className="text-xs font-bold bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-full">06:00 – 08:30 AM</span>
              </div>
              <h3 className="font-bold text-base text-stone-900">Morning Pranayama &amp; Herbal Tea</h3>
              <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
                Waking up to birdsong in Anjikar Bagh, gentle breathing exercises, morning walk in the herbal garden, and freshly brewed herbal decoctions.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-soft space-y-2.5">
              <div className="flex items-center justify-between text-foundation-crimson">
                <Coffee className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full">08:30 – 12:30 PM</span>
              </div>
              <h3 className="font-bold text-base text-stone-900">Breakfast, Go-Seva &amp; Recreation</h3>
              <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
                Wholesome breakfast with pure cow milk, spending peaceful moments at the Go-Seva Kendra, newspaper reading, and light socializing.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-soft space-y-2.5">
              <div className="flex items-center justify-between text-foundation-crimson">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full">12:30 – 04:30 PM</span>
              </div>
              <h3 className="font-bold text-base text-stone-900">Lunch &amp; Afternoon Rest</h3>
              <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
                Freshly cooked balanced vegetarian lunch prepared with hygiene, followed by restful afternoon nap in airy, quiet rooms.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-soft space-y-2.5">
              <div className="flex items-center justify-between text-foundation-crimson">
                <Moon className="w-5 h-5 text-indigo-600" />
                <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full">05:00 – 09:00 PM</span>
              </div>
              <h3 className="font-bold text-base text-stone-900">Evening Bhajan, Dinner &amp; Rest</h3>
              <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
                Evening tea, devotional satsang, bhajan recitations in the veranda hall, light nutritious dinner, and restful night sleep under watchful care.
              </p>
            </div>
          </div>
        </div>

        {/* Admission Guidelines Alert Card */}
        <div className="bg-amber-50 rounded-3xl p-6 sm:p-8 md:p-10 border border-amber-200 space-y-5">
          <div className="flex items-center space-x-2 text-amber-900 font-bold text-base sm:text-lg">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>Important Admission &amp; Visiting Guidelines</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-amber-950 leading-relaxed">
            <div className="space-y-1">
              <p className="font-bold text-amber-900">1. Direct Confirmation Required:</p>
              <p>
                Because our facility is a non-granted charitable initiative of SBBM Social Foundation with limited capacity, admission availability, room suitability, and medical evaluations must be confirmed directly with the management. Submitting an enquiry form online initiates the review process but does not guarantee immediate admission.
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-bold text-amber-900">2. Prior Notification for Visits:</p>
              <p>
                Families and community visitors are encouraged to visit. To ensure that resident rest periods, medical appointments, and daily routines are not disrupted, we kindly ask that you telephone our office (+91 98908 98081) in advance.
              </p>
            </div>
          </div>

          <div className="pt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-amber-200 text-xs sm:text-sm">
            <span className="font-semibold text-amber-900">
              Campus Address: 434, Anjikar Bagh, Mansar Mahuli Road, Mahuli, Parseoni, Nagpur – 441105
            </span>
            <Link
              to="/admission"
              className="px-5 py-2.5 bg-amber-800 text-white font-bold rounded-full text-xs sm:text-sm hover:bg-amber-900 transition-colors flex items-center space-x-1.5"
            >
              <span>Submit Admission Form</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
