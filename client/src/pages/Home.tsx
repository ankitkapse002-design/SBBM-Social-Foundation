import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart, Shield, Sparkles, Phone, ArrowRight, CheckCircle2,
  Calendar, Eye, Compass, Users, Clock, MapPin, Play, HelpCircle
} from 'lucide-react';

interface HomeProps {
  onReplayIntro?: () => void;
}

export const Home: React.FC<HomeProps> = ({ onReplayIntro }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  return (
    <div className="flex flex-col min-h-screen bg-foundation-ivory text-foundation-charcoal">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-foundation-forestDark via-foundation-forest to-foundation-forestDark text-foundation-ivory py-16 md:py-24 border-b-4 border-foundation-gold">
        {/* Decorative background subtle glow */}
        <div className="absolute inset-0 opacity-15 pointer-events-none parchment-pattern" />
        <div className="absolute top-1/4 -right-24 w-96 h-96 bg-foundation-gold/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 -left-20 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading and CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-foundation-gold/20 border border-foundation-gold/40 text-foundation-goldLight text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-foundation-gold" />
              <span>Charitable Old Age Home • Society Reg: 332-15-Nag (Est. 2015)</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold text-foundation-sandstone leading-[1.15]">
              A Place of Care, Dignity & Belonging.
            </h1>

            <p className="text-base sm:text-lg text-foundation-sageLight leading-relaxed max-w-2xl font-light">
              SBBM Social Foundation operates <strong>VYENKATESH ASHRAM</strong> at Anjikar Bagh, Mahuli (Nagpur). A peaceful, non-granted old-age home providing senior citizens with a clean, supportive, and dignified living environment surrounded by nature.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/admission"
                className="px-6 py-3.5 rounded-full bg-foundation-gold hover:bg-yellow-500 text-foundation-forestDark font-bold text-sm shadow-xl hover:shadow-2xl transition-all flex items-center space-x-2"
                id="hero-admission-cta"
              >
                <span>Admission Enquiry</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {onReplayIntro && (
                <button
                  onClick={onReplayIntro}
                  className="px-5 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-foundation-ivory border border-white/20 font-semibold text-sm backdrop-blur-md transition-all flex items-center space-x-2"
                  id="hero-replay-3d-btn"
                >
                  <Play className="w-4 h-4 text-foundation-gold fill-foundation-gold" />
                  <span>Experience 3D Entrance</span>
                </button>
              )}

              <Link
                to="/support"
                className="px-5 py-3.5 rounded-full bg-transparent hover:bg-white/10 text-foundation-sandstone border border-foundation-gold/40 font-semibold text-sm transition-all flex items-center space-x-2"
              >
                <Heart className="w-4 h-4 text-red-400" />
                <span>Support the Ashram</span>
              </Link>
            </div>

            {/* Helpline quick strip */}
            <div className="pt-4 flex items-center space-x-3 text-xs text-foundation-sandstone/90 border-t border-white/15">
              <Phone className="w-4 h-4 text-foundation-gold" />
              <span>Official Management Helpline: <a href="tel:+919890898081" className="font-bold underline text-white">+91 98908 98081</a></span>
              <span className="text-stone-400">•</span>
              <span>Village Mahuli, Tehsil Parseoni, Nagpur</span>
            </div>
          </div>

          {/* Right Column: Authentic Building Card with Verified Badge */}
          <div className="lg:col-span-5">
            <div className="relative group rounded-3xl overflow-hidden border-2 border-foundation-gold/50 shadow-2xl bg-foundation-forestDark/60">
              <img
                src="/assets/images/ashram_building.jpg"
                alt="Vyenkatesh Ashram Architectural Building in Mahuli Nagpur"
                className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-5 text-foundation-ivory space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-widest text-foundation-gold font-bold">
                    Vyenkatesh Ashram Residence
                  </span>
                  <span className="bg-emerald-600/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                    <Shield className="w-3 h-3" />
                    <span>Verified Facility</span>
                  </span>
                </div>
                <h3 className="text-lg font-display font-bold text-foundation-sandstone">
                  Anjikar Bagh, Mansar Mahuli Road
                </h3>
                <p className="text-xs text-stone-300">
                  Two-story home with comfortable rooms, shaded verandas, separate clean restrooms, and peaceful gardens.
                </p>
                <div className="pt-2 flex items-center space-x-2 text-xs">
                  <Link
                    to="/old-age-home"
                    className="text-foundation-gold font-bold hover:underline flex items-center space-x-1"
                  >
                    <span>Explore Facilities & Daily Life</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Institutional Highlights Strip */}
      <section className="bg-foundation-sandstone/30 border-b border-foundation-borderMuted py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-4 bg-white/70 rounded-2xl shadow-soft-sm border border-foundation-borderMuted">
            <p className="text-2xl md:text-3xl font-display font-bold text-foundation-forest">2015</p>
            <p className="text-xs font-semibold text-foundation-charcoal mt-1">Established Year</p>
            <p className="text-[11px] text-stone-500">Reg No: 332-15-Nag</p>
          </div>

          <div className="p-4 bg-white/70 rounded-2xl shadow-soft-sm border border-foundation-borderMuted">
            <p className="text-2xl md:text-3xl font-display font-bold text-foundation-forest">100%</p>
            <p className="text-xs font-semibold text-foundation-charcoal mt-1">Non-Granted Charity</p>
            <p className="text-[11px] text-stone-500">Pure community elder care</p>
          </div>

          <div className="p-4 bg-white/70 rounded-2xl shadow-soft-sm border border-foundation-borderMuted">
            <p className="text-2xl md:text-3xl font-display font-bold text-foundation-forest">Go-Seva</p>
            <p className="text-xs font-semibold text-foundation-charcoal mt-1">Sacred Cow Sanctuary</p>
            <p className="text-[11px] text-stone-500">Therapeutic care & fresh milk</p>
          </div>

          <div className="p-4 bg-white/70 rounded-2xl shadow-soft-sm border border-foundation-borderMuted">
            <p className="text-2xl md:text-3xl font-display font-bold text-foundation-forest">Naturopathy</p>
            <p className="text-xs font-semibold text-foundation-charcoal mt-1">Holistic Wellness</p>
            <p className="text-[11px] text-stone-500">Morning yoga & herbal garden</p>
          </div>
        </div>
      </section>

      {/* Organization & Founders Introduction */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-4">
            <div className="relative rounded-3xl overflow-hidden border-2 border-foundation-borderMuted shadow-xl">
              <img
                src="/assets/images/entrance_gate.jpg"
                alt="Vyenkatesh Ashram Grand Gate"
                className="w-full h-80 object-cover"
              />
              <div className="p-4 bg-foundation-warmGray border-t border-foundation-borderMuted text-xs">
                <p className="font-bold text-foundation-forest">Vyenkatesh Ashram Grand Entrance Gates</p>
                <p className="text-stone-500 text-[11px]">Anjikar Bagh, Mansar Mahuli Road, Mahuli, Parseoni, Nagpur</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-5">
            <span className="text-xs uppercase tracking-widest font-bold text-foundation-forest">
              Compassionate Mission
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foundation-charcoal">
              Serving the Elderly with Reverence, Comfort & Peace
            </h2>
            <p className="text-sm md:text-base text-stone-600 leading-relaxed">
              <strong>SBBM Social Foundation Society</strong> was founded in 2015 by <strong>Mr. Ashwin Vyenkatrao Anjikar</strong> and <strong>Mrs. Tina Anjikar</strong> with the sacred conviction that senior citizens in the evening of their lives deserve uncompromised love, respect, hygienic shelter, and a serene environment free from neglect.
            </p>
            <p className="text-sm md:text-base text-stone-600 leading-relaxed">
              At <strong>Vyenkatesh Ashram</strong>, residents enjoy clean living quarters, separate well-maintained restroom facilities, nutritious freshly cooked vegetarian meals, morning yoga in Anjikar Bagh orchards, spiritual bhajans, and compassionate round-the-clock attendants.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-5 h-5 text-foundation-forest flex-shrink-0 mt-0.5" />
                <span className="text-xs md:text-sm font-medium text-stone-700">Non-commercial, charitable dedication</span>
              </div>
              <div className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-5 h-5 text-foundation-forest flex-shrink-0 mt-0.5" />
                <span className="text-xs md:text-sm font-medium text-stone-700">Rural greenery away from pollution</span>
              </div>
              <div className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-5 h-5 text-foundation-forest flex-shrink-0 mt-0.5" />
                <span className="text-xs md:text-sm font-medium text-stone-700">Active Go-Seva Kendra & cow therapy</span>
              </div>
              <div className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-5 h-5 text-foundation-forest flex-shrink-0 mt-0.5" />
                <span className="text-xs md:text-sm font-medium text-stone-700">Official Society Reg: 332-15-Nag</span>
              </div>
            </div>

            <div className="pt-4 flex items-center space-x-4">
              <Link
                to="/about"
                className="px-6 py-2.5 bg-foundation-forest hover:bg-foundation-forestLight text-foundation-ivory font-bold text-xs rounded-full shadow-md transition-all flex items-center space-x-1.5"
              >
                <span>Read Full Foundation Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/about/leadership"
                className="text-xs font-bold text-foundation-forest hover:underline"
              >
                Founder's Message →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Core Services Section */}
      <section className="bg-foundation-warmGray/70 py-16 md:py-24 border-y border-foundation-borderMuted">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-widest font-bold text-foundation-forest">
              What We Do
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foundation-charcoal">
              Holistic Care & Community Initiatives
            </h2>
            <p className="text-sm text-stone-600">
              From elder residential comfort to animal welfare, naturopathy and student empowerment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service 1: Old Age Home */}
            <div className="bg-white rounded-3xl overflow-hidden border border-foundation-borderMuted shadow-soft hover:shadow-soft-lg transition-all group flex flex-col justify-between">
              <div>
                <div className="h-48 overflow-hidden relative">
                  <img
                    src="/assets/images/ashram_building.jpg"
                    alt="Vyenkatesh Ashram Old Age Home"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 bg-foundation-forest text-foundation-ivory text-[10px] font-bold rounded-full uppercase tracking-wider">
                    Primary Mission
                  </span>
                </div>
                <div className="p-6 space-y-2.5">
                  <h3 className="text-xl font-display font-bold text-foundation-charcoal">
                    Vyenkatesh Ashram
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Dignified residential living for seniors in need with nutritious vegetarian food, separate restrooms, and a serene family atmosphere.
                  </p>
                  <ul className="text-xs text-stone-500 space-y-1 pt-1">
                    <li>• Safe, hygienic rooms & 24/7 care</li>
                    <li>• Rural tranquility at Anjikar Bagh</li>
                  </ul>
                </div>
              </div>
              <div className="p-6 pt-0">
                <Link
                  to="/old-age-home"
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-foundation-forest hover:text-foundation-forestLight"
                >
                  <span>Explore Facilities & Routine</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Service 2: Go-Seva Kendra */}
            <div className="bg-white rounded-3xl overflow-hidden border border-foundation-borderMuted shadow-soft hover:shadow-soft-lg transition-all group flex flex-col justify-between">
              <div>
                <div className="h-48 overflow-hidden relative">
                  <img
                    src="/assets/images/goseva.jpg"
                    alt="Go-Seva Kendra at Vyenkatesh Ashram"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 bg-amber-600 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                    Active Sanctuary
                  </span>
                </div>
                <div className="p-6 space-y-2.5">
                  <h3 className="text-xl font-display font-bold text-foundation-charcoal">
                    Go-Seva Kendra
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Shelter and compassionate care for indigenous Gir cows, providing elders with therapeutic companionship and fresh nutritious milk.
                  </p>
                  <ul className="text-xs text-stone-500 space-y-1 pt-1">
                    <li>• Clean, airy gaushala shelter</li>
                    <li>• Green fodder donation support</li>
                  </ul>
                </div>
              </div>
              <div className="p-6 pt-0">
                <Link
                  to="/services/goseva-kendra"
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-foundation-forest hover:text-foundation-forestLight"
                >
                  <span>Learn About Go-Seva</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Service 3: Naturopathy */}
            <div className="bg-white rounded-3xl overflow-hidden border border-foundation-borderMuted shadow-soft hover:shadow-soft-lg transition-all group flex flex-col justify-between">
              <div>
                <div className="h-48 overflow-hidden relative">
                  <img
                    src="/assets/images/naturopathy.jpg"
                    alt="Naturopathy and Yoga at Vyenkatesh Ashram"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 bg-emerald-700 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                    Holistic Routine
                  </span>
                </div>
                <div className="p-6 space-y-2.5">
                  <h3 className="text-xl font-display font-bold text-foundation-charcoal">
                    Naturopathy & Yoga
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Gentle morning pranayama, herbal remedies from our medicinal garden, sunlight therapy and joint mobility exercises for seniors.
                  </p>
                  <ul className="text-xs text-stone-500 space-y-1 pt-1">
                    <li>• Outdoor garden yoga pavilion</li>
                    <li>• Tulsi, Neem and natural herbs</li>
                  </ul>
                </div>
              </div>
              <div className="p-6 pt-0">
                <Link
                  to="/services/naturopathy"
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-foundation-forest hover:text-foundation-forestLight"
                >
                  <span>Naturopathy Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center pt-4">
            <Link
              to="/services"
              className="px-6 py-3 rounded-full bg-foundation-forest text-foundation-ivory font-bold text-xs shadow-md hover:bg-foundation-forestLight transition-all"
            >
              View All 6 Foundation Initiatives & Services →
            </Link>
          </div>
        </div>
      </section>

      {/* Admission Enquiry Fast-Track Callout */}
      <section className="bg-gradient-to-r from-foundation-forest to-foundation-forestDark text-foundation-ivory py-12 px-4 md:px-8 border-y border-foundation-gold/30">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs uppercase tracking-widest text-foundation-gold font-bold">
              Direct Inquiries Welcomed
            </span>
            <h3 className="text-2xl md:text-3xl font-display font-bold text-foundation-sandstone">
              Looking for a Dignified Home for an Elder?
            </h3>
            <p className="text-xs md:text-sm text-stone-300 max-w-2xl">
              Accommodation availability, admission suitability and formalities must be confirmed directly with management. Submit an online enquiry or call +91 98908 98081.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/admission"
              className="px-6 py-3 bg-foundation-gold hover:bg-yellow-500 text-foundation-forestDark font-bold rounded-full text-xs shadow-xl transition-all"
            >
              Submit Admission Enquiry
            </Link>
            <a
              href="tel:+919890898081"
              className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full text-xs border border-white/20 transition-all flex items-center space-x-2"
            >
              <Phone className="w-3.5 h-3.5 text-foundation-gold" />
              <span>Call +91 98908 98081</span>
            </a>
          </div>
        </div>
      </section>

      {/* Gallery Showcase Section */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 md:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-foundation-forest">
              Authentic Glimpses
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foundation-charcoal">
              Life at Vyenkatesh Ashram
            </h2>
          </div>
          <Link
            to="/gallery"
            className="text-xs font-bold text-foundation-forest hover:underline flex items-center space-x-1"
          >
            <span>View Full Photo & Video Gallery</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Ashram Residence & Veranda',
              category: 'Architecture',
              src: '/assets/images/ashram_building.jpg',
            },
            {
              title: 'Grand Entrance Double Gate',
              category: 'Premises',
              src: '/assets/images/entrance_gate.jpg',
            },
            {
              title: 'Go-Seva Kendra Gaushala',
              category: 'Go-Seva',
              src: '/assets/images/goseva.jpg',
            },
            {
              title: 'Morning Naturopathy & Yoga',
              category: 'Wellness',
              src: '/assets/images/naturopathy.jpg',
            },
          ].map((item, idx) => (
            <div
              key={`gal-home-${idx}`}
              onClick={() => setSelectedPhoto(item.src)}
              className="cursor-pointer group relative rounded-2xl overflow-hidden border border-foundation-borderMuted shadow-soft hover:shadow-soft-lg transition-all"
            >
              <img
                src={item.src}
                alt={item.title}
                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <span className="text-[10px] text-foundation-gold font-bold uppercase">
                  {item.category}
                </span>
                <p className="text-xs font-bold font-display">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox Modal for Photos */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl">
            <img
              src={selectedPhoto}
              alt="Enlarged view"
              className="w-full h-full object-contain"
            />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 bg-white/20 text-white p-2 rounded-full hover:bg-white/40"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Frequently Asked Questions Preview */}
      <section className="bg-foundation-warmGray py-16 md:py-24 border-t border-foundation-borderMuted">
        <div className="max-w-4xl mx-auto px-4 md:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase tracking-widest font-bold text-foundation-forest">
              Common Questions
            </span>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foundation-charcoal">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-foundation-borderMuted shadow-soft-sm">
              <h4 className="font-bold text-sm text-foundation-forest">
                What is the procedure for admission to Vyenkatesh Ashram?
              </h4>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                Admission requires submitting an initial enquiry form or visiting our office. Because we maintain high care standards and limited capacity, accommodation availability, medical suitability, and admission formalities must be confirmed directly with the management (+91 98908 98081).
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-foundation-borderMuted shadow-soft-sm">
              <h4 className="font-bold text-sm text-foundation-forest">
                Is SBBM Social Foundation a registered society?
              </h4>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                Yes, SBBM Social Foundation Society was established in 2015 and is officially registered under the Societies Registration Act (Reg No: 332-15-Nag). It operates Vyenkatesh Ashram as a charitable, non-granted old-age home.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-foundation-borderMuted shadow-soft-sm">
              <h4 className="font-bold text-sm text-foundation-forest">
                Can family members and visitors visit the ashram?
              </h4>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                Yes, family members and well-wishers are welcomed. Prior notification via telephone (+91 98908 98081) is requested to ensure resident rest hours and daily schedules are respected.
              </p>
            </div>
          </div>

          <div className="text-center pt-2">
            <Link
              to="/faq"
              className="text-xs font-bold text-foundation-forest hover:underline"
            >
              View All Categorized FAQs →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
