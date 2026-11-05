import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, CheckCircle2, Heart, Phone, MapPin, Clock,
  Calendar, Coffee, Sun, Moon, Home as HomeIcon, AlertCircle, ArrowRight,
  Sparkles, Award, FileText, Check
} from 'lucide-react';
import { MinimalistBackdrop } from '../components/ui/MinimalistBackdrop';
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

  return (
    <div className="min-h-screen bg-[#fafaf8] py-12 md:py-16 font-sans">
      <SEO
        title="Vyenkatesh Ashram | Lifelong Senior Citizen Care & Shelter"
        description="Vyenkatesh Ashram at Mahuli, Parseoni (Nagpur District) is SBBM Social Foundation's residential old-age home providing lifelong dignity, 24/7 care, nutritious meals, and medical support."
        canonicalPath="/old-age-home"
        ogImage="/assets/images/ashram/ashram_veranda_garden.jpg"
        jsonLd={ashramJsonLd}
      />
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
        {/* Full-Width Visual Photographic Header Banner */}
        <div className="relative rounded-3xl overflow-hidden border-2 border-stone-700/60 shadow-elevated bg-stone-950 text-white p-10 md:p-14 text-center">
          <div className="absolute inset-0 z-0">
            <img
              src="/assets/images/ashram/ashram_veranda_garden.jpg"
              alt="Vyenkatesh Ashram Shaded Veranda and Grounds"
              className="w-full h-full object-cover object-[center_35%] scale-105"
            />
            {/* Calibrated dark overlay: veranda & palms clearly visible */}
            <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-stone-950/65 to-stone-950/85" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold border border-white/20">
              <HomeIcon className="w-3.5 h-3.5 text-amber-300" />
              <span>Initiative 5.1 of SBBM Social Foundation • Mahuli Campus</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight drop-shadow-sm">
              Elderly Care – Vyenkatesh Ashram
            </h1>

            <p className="text-sm md:text-base text-amber-200 font-serif italic">
              “Apno Se Door... Ek Apna Ghar...”
            </p>

            <p className="text-xs md:text-sm text-stone-200 leading-relaxed max-w-2xl mx-auto">
              A loving, non-granted residential sanctuary operated by SBBM Social Foundation at Anjikar Bagh, Mahuli to provide senior citizens (“Aai-Baba”) with dignified living, nutritious vegetarian meals, and filial affection.
            </p>
          </div>
        </div>

        {/* Feature Hero Card with Building Image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl p-6 md:p-10 border border-stone-200 shadow-soft">
          <div className="lg:col-span-6 rounded-2xl overflow-hidden border border-stone-200 shadow-md">
            <img
              src="/assets/images/ashram/ashram_exterior_main.jpg"
              alt="Vyenkatesh Ashram Building Exterior at Mahuli"
              className="w-full h-80 object-cover"
            />
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-red-50 text-foundation-crimson rounded-full text-xs font-bold uppercase tracking-wider">
              <Heart className="w-3.5 h-3.5 fill-foundation-crimson" />
              <span>Dignified Senior Living with Filial Care</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-display font-bold text-stone-900 tracking-tight">
              A Home Designed for Peace, Companionship & Care
            </h2>

            <p className="text-xs md:text-sm text-stone-600 leading-relaxed">
              Located away from urban noise and pollution in the tranquil orchards of Anjikar Bagh, Mahuli (near Mansar), our facility features spacious rooms, wide shaded verandas, separate hygienic restrooms, a clean dining hall, and 24/7 attentive attendants who treat residents as their own family.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs text-stone-700">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Clean, Comfortable Living Rooms</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Separate Restroom Facilities</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Nutritious Home-Cooked Meals</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>24/7 Supportive Attendants</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Daily Spiritual Satsang & Library</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Visiting Doctor & First-Aid Care</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <Link
                to="/admission"
                className="px-6 py-3 bg-foundation-crimson hover:bg-foundation-crimsonDark text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-md transition-all flex items-center space-x-1.5"
              >
                <span>Submit Admission Enquiry</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <a
                href="tel:+919890898081"
                className="px-5 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs uppercase tracking-wider rounded-full border border-stone-300 transition-all flex items-center space-x-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-foundation-crimson" />
                <span>Call +91 98908 98081</span>
              </a>
            </div>
          </div>
        </div>

        {/* Resident Senior Citizens ("Aai-Baba") Photo Showcase */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase tracking-widest text-foundation-crimson font-bold">
              Our Beloved Family
            </span>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foundation-charcoal tracking-tight">
              Cherished Residents ("Aai-Baba") of Vyenkatesh Ashram
            </h2>
            <p className="text-xs text-stone-600 max-w-2xl mx-auto">
              Every elder at the ashram is treated with filial reverence, personal care, and emotional warmth. These original photographs reflect their peaceful golden years under our roof.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-soft-sm group">
              <div className="h-44 sm:h-52 overflow-hidden">
                <img
                  src="/assets/images/elders/resident_anandrao_umredkar.jpg"
                  alt="Resident Anandrao Umredkar"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3 text-center">
                <h4 className="font-bold text-xs text-stone-900 line-clamp-1">Shri Anandrao Umredkar</h4>
                <span className="text-[10px] text-foundation-crimson font-medium">Resident Elder</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-soft-sm group">
              <div className="h-44 sm:h-52 overflow-hidden">
                <img
                  src="/assets/images/elders/resident_kamala_dadmal.jpg"
                  alt="Resident Kamala Daulat Dadmal"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3 text-center">
                <h4 className="font-bold text-xs text-stone-900 line-clamp-1">Smt. Kamala Dadmal</h4>
                <span className="text-[10px] text-foundation-crimson font-medium">Resident Elder</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-soft-sm group">
              <div className="h-44 sm:h-52 overflow-hidden">
                <img
                  src="/assets/images/elders/resident_kalabai_khapekar.jpg"
                  alt="Resident Kalabai Khapekar"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3 text-center">
                <h4 className="font-bold text-xs text-stone-900 line-clamp-1">Smt. Kalabai Khapekar</h4>
                <span className="text-[10px] text-foundation-crimson font-medium">Resident Elder</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-soft-sm group">
              <div className="h-44 sm:h-52 overflow-hidden">
                <img
                  src="/assets/images/elders/resident_shirpurkar.jpg"
                  alt="Resident Shirpurkar"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3 text-center">
                <h4 className="font-bold text-xs text-stone-900 line-clamp-1">Shri Shirpurkar</h4>
                <span className="text-[10px] text-foundation-crimson font-medium">Resident Elder</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-soft-sm group">
              <div className="h-44 sm:h-52 overflow-hidden">
                <img
                  src="/assets/images/elders/resident_rukhna_giri.jpg"
                  alt="Resident Rukhna Sumegir Giri"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3 text-center">
                <h4 className="font-bold text-xs text-stone-900 line-clamp-1">Smt. Rukhna Giri</h4>
                <span className="text-[10px] text-foundation-crimson font-medium">Resident Elder</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-soft-sm group">
              <div className="h-44 sm:h-52 overflow-hidden">
                <img
                  src="/assets/images/elders/resident_sakhu_dadmal.jpg"
                  alt="Resident Sakhu Bhaiyya Dadmal"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3 text-center">
                <h4 className="font-bold text-xs text-stone-900 line-clamp-1">Smt. Sakhu Dadmal</h4>
                <span className="text-[10px] text-foundation-crimson font-medium">Resident Elder</span>
              </div>
            </div>
          </div>

          {/* Ashram Campus Facilities Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-soft-sm">
              <div className="h-48 overflow-hidden">
                <img
                  src="/assets/images/ashram/ashram_veranda_garden.jpg"
                  alt="Shaded Veranda & Green Garden"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 space-y-1">
                <h4 className="font-bold text-sm text-stone-900">Shaded Verandas & Peaceful Garden</h4>
                <p className="text-xs text-stone-500">Spacious green walkways and seating areas in the clean orchard atmosphere of Anjikar Bagh.</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-soft-sm">
              <div className="h-48 overflow-hidden">
                <img
                  src="/assets/images/ashram/ashram_dining_hall.jpg"
                  alt="Clean Dining & Prayer Hall"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 space-y-1">
                <h4 className="font-bold text-sm text-stone-900">Hygienic Dining & Satsang Hall</h4>
                <p className="text-xs text-stone-500">Three wholesome home-cooked vegetarian meals served daily with dignity and hygiene.</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-soft-sm">
              <div className="h-48 overflow-hidden">
                <img
                  src="/assets/images/ashram/ashram_campus_life.jpg"
                  alt="Morning Campus Life"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 space-y-1">
                <h4 className="font-bold text-sm text-stone-900">Tranquil Campus Environment</h4>
                <p className="text-xs text-stone-500">Situated in Mahuli near Mansar away from noise and pollution, ensuring peace of mind.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Schedule Routine */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase tracking-widest text-foundation-crimson font-bold">
              Purposeful Living
            </span>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foundation-charcoal tracking-tight">
              Daily Schedule & Resident Life
            </h2>
            <p className="text-xs text-stone-600">
              A balanced daily rhythm designed for physical vitality, mental peace, and warm companionship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-soft-sm space-y-2">
              <div className="flex items-center justify-between text-foundation-crimson">
                <Sun className="w-5 h-5 text-amber-500" />
                <span className="text-[11px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">06:00 – 08:30 AM</span>
              </div>
              <h3 className="font-bold text-sm text-stone-900">Morning Pranayama & Herbal Tea</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Waking up to birdsong in Anjikar Bagh, gentle breathing exercises, morning walk in the herbal garden, and freshly brewed herbal decoctions.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-soft-sm space-y-2">
              <div className="flex items-center justify-between text-foundation-crimson">
                <Coffee className="w-5 h-5 text-emerald-600" />
                <span className="text-[11px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">08:30 – 12:30 PM</span>
              </div>
              <h3 className="font-bold text-sm text-stone-900">Breakfast, Go-Seva & Recreation</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Wholesome breakfast with pure cow milk, spending peaceful moments at the Go-Seva Kendra, newspaper reading, and light socializing.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-soft-sm space-y-2">
              <div className="flex items-center justify-between text-foundation-crimson">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-[11px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">12:30 – 04:30 PM</span>
              </div>
              <h3 className="font-bold text-sm text-stone-900">Lunch & Afternoon Rest</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Freshly cooked balanced vegetarian lunch prepared with hygiene, followed by restful afternoon nap in airy, quiet rooms.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-soft-sm space-y-2">
              <div className="flex items-center justify-between text-foundation-crimson">
                <Moon className="w-5 h-5 text-indigo-600" />
                <span className="text-[11px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">05:00 – 09:00 PM</span>
              </div>
              <h3 className="font-bold text-sm text-stone-900">Evening Bhajan, Dinner & Rest</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Evening tea, devotional satsang, bhajan recitations in the veranda hall, light nutritious dinner, and restful night sleep under watchful care.
              </p>
            </div>
          </div>
        </div>

        {/* Admission Guidelines Alert Card */}
        <div className="bg-amber-50 rounded-3xl p-6 md:p-8 border border-amber-200 space-y-4">
          <div className="flex items-center space-x-2 text-amber-900 font-bold text-base">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>Important Admission & Visiting Guidelines</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-amber-950 leading-relaxed">
            <div>
              <p className="font-bold mb-1">1. Direct Confirmation Required:</p>
              <p>
                Because our facility is a non-granted charitable initiative of SBBM Social Foundation with limited capacity, admission availability, room suitability, and medical evaluations must be confirmed directly with the management. Submitting an enquiry form online initiates the review process but does not guarantee immediate admission.
              </p>
            </div>
            <div>
              <p className="font-bold mb-1">2. Prior Notification for Visits:</p>
              <p>
                Families and community visitors are encouraged to visit. To ensure that resident rest periods, medical appointments, and daily routines are not disrupted, we kindly ask that you telephone our office (+91 98908 98081) in advance.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-amber-200 text-xs">
            <span className="font-semibold text-amber-900">
              Campus Address: 434, Anjikar Bagh, Mansar Mahuli Road, Mahuli, Parseoni, Nagpur – 441105
            </span>
            <Link
              to="/admission"
              className="px-4 py-2 bg-amber-800 text-white font-bold rounded-full text-xs hover:bg-amber-900 transition-colors flex items-center space-x-1"
            >
              <span>Submit Admission Form</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
