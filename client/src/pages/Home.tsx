import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Shield, Sparkles, Phone, ArrowRight, CheckCircle2,
  Calendar, Eye, Compass, Users, Clock, MapPin, Play,
  ChevronDown, HelpCircle, Award, Star, Volume2, VolumeX
} from 'lucide-react';
import { Card3D } from '../components/ui/Card3D';
import { StatCard3D } from '../components/ui/StatCard3D';
import { CinematicHero3D } from '../components/3d/CinematicHero3D';
import { SanctuaryPortalMatrix } from '../components/ui/SanctuaryPortalMatrix';
import { sacredAmbience } from '../utils/audioAmbience';

interface HomeProps {
  onReplayIntro?: () => void;
}

export const Home: React.FC<HomeProps> = ({ onReplayIntro }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);

  const toggleAtmosphereAudio = () => {
    const playing = sacredAmbience.toggle();
    setIsAudioPlaying(playing);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.14,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const faqs = [
    {
      q: 'What is the procedure for admission to Vyenkatesh Ashram?',
      a: 'Admission requires submitting an initial enquiry form or visiting our office. Because we maintain high care standards and limited capacity, accommodation availability, medical suitability, and admission formalities must be confirmed directly with the management (+91 98908 98081).',
    },
    {
      q: 'Is SBBM Social Foundation a registered society?',
      a: 'Yes, SBBM Social Foundation Society was established in 2015 and is officially registered under the Societies Registration Act (Reg No: 332-15-Nag). It operates Vyenkatesh Ashram as a charitable, non-granted old-age home.',
    },
    {
      q: 'Can family members and visitors visit the ashram?',
      a: 'Yes, family members and well-wishers are welcomed. Prior notification via telephone (+91 98908 98081) is requested to ensure resident rest hours and daily schedules are respected.',
    },
    {
      q: 'What facilities and daily routines are provided for residents?',
      a: 'Residents receive nutritious freshly prepared vegetarian meals, private and semi-private rooms, round-the-clock attendants, morning yoga/naturopathy sessions, Go-Seva interaction, and regular healthcare monitoring.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-foundation-ivory text-foundation-charcoal overflow-hidden">
      {/* 1. CINEMATIC IMMERSIVE HERO EXPERIENCE */}
      <section className="relative overflow-hidden bg-[#07190F] text-foundation-ivory min-h-[92vh] lg:min-h-screen flex flex-col justify-between pt-10 pb-16 md:pt-16 md:pb-24 border-b-2 border-foundation-gold/40">
        {/* Interactive 3D WebGL Canvas: Golden Sacred Mandala & Cosmic Embers */}
        <CinematicHero3D />

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-20 w-full my-auto py-6">
          {/* Top Atmospheric Control Strip: Sanskrit Invocation & Sacred Ambience Soundscape */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center space-x-2.5 px-4 py-2 rounded-full glass-specular-gold text-foundation-goldLight text-xs font-semibold tracking-wider shadow-lg"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span className="font-serif tracking-widest text-amber-200 uppercase font-bold text-[11px] sm:text-xs">
                ॥ सेवा परमो धर्मः ॥ • Reg. No: 332-15-Nag (Est. 2015)
              </span>
            </motion.div>

            {/* Atmosphere Audio Synthesizer Toggle */}
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              onClick={toggleAtmosphereAudio}
              className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-md cursor-pointer border ${
                isAudioPlaying
                  ? 'bg-foundation-gold text-foundation-forestDark border-yellow-300 shadow-[0_0_20px_rgba(212,175,55,0.45)]'
                  : 'bg-white/10 hover:bg-white/15 text-stone-200 border-white/20 backdrop-blur-md'
              }`}
              title="Toggle Serene Tibetan Bell Harmonics"
            >
              {isAudioPlaying ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-foundation-forestDark animate-pulse" />
                  <span>♫ Sacred Ambience Active</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-stone-400" />
                  <span>♫ Soundscape: Muted</span>
                </>
              )}
            </motion.button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Monumental Kinetic Headline, Narrative & CTAs */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="lg:col-span-7 space-y-7"
            >
              {/* Monumental Kinetic Headline */}
              <motion.div variants={itemVariants} className="space-y-1">
                <p className="text-xs sm:text-sm font-semibold tracking-[0.28em] text-emerald-400 uppercase">
                  CHARITABLE ELDERCARE SANCTUARY
                </p>
                <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-display font-black tracking-tight leading-[1.04] text-white">
                  Where Aging Becomes <br />
                  <span className="font-cinzel-decorative gold-foil-text text-glow inline-block">
                    Sacred & Dignified.
                  </span>
                </h1>
              </motion.div>

              {/* Editorial Narrative */}
              <motion.p
                variants={itemVariants}
                className="text-base sm:text-lg lg:text-xl text-foundation-sandstone/90 font-light leading-relaxed max-w-2xl"
              >
                Nestled within the peaceful groves of Mahuli, Nagpur — <strong>VYENKATESH ASHRAM</strong> is an architectural haven founded by SBBM Social Foundation Society. Dedicated to 24/7 medical vigilance, fresh organic nutrition, daily Go-Seva, and reverent elder care surrounded by pristine nature.
              </motion.p>

              {/* Telemetry Capsules (Real Foundation Highlights) */}
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1"
              >
                {[
                  { value: '10+ Yrs', label: 'Unbroken Seva', icon: Sparkles },
                  { value: '100%', label: 'Non-Granted', icon: Heart },
                  { value: '24/7', label: 'Attendant Care', icon: Shield },
                  { value: 'Gaushala', label: 'A2 Cow Milk', icon: Star },
                ].map((cap, i) => {
                  const CapIcon = cap.icon;
                  return (
                    <div
                      key={i}
                      className="p-3 rounded-2xl glass-specular border border-foundation-gold/30 text-center space-y-0.5 shadow-sm"
                    >
                      <CapIcon className="w-3.5 h-3.5 text-foundation-gold mx-auto" />
                      <p className="font-display font-bold text-sm text-white">{cap.value}</p>
                      <p className="text-[10px] text-foundation-sageLight/90 truncate">{cap.label}</p>
                    </div>
                  );
                })}
              </motion.div>

              {/* Action Buttons: Admission, 3D Tour, & Support */}
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap items-center gap-3.5 pt-2"
              >
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  <Link
                    to="/admission"
                    className="px-7 py-4 rounded-full bg-gradient-to-r from-foundation-gold via-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-foundation-gold text-foundation-forestDark font-bold text-sm sm:text-base shadow-[0_10px_35px_rgba(212,175,55,0.45)] hover:shadow-[0_15px_45px_rgba(212,175,55,0.65)] transition-all flex items-center space-x-2.5 border border-yellow-200"
                    id="hero-admission-cta"
                  >
                    <span>Admission Enquiry</span>
                    <ArrowRight className="w-4 h-4 text-foundation-forestDark" />
                  </Link>
                </motion.div>

                {onReplayIntro && (
                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                    <button
                      onClick={onReplayIntro}
                      className="px-6 py-4 rounded-full glass-specular hover:bg-white/15 text-white border border-foundation-gold/50 font-semibold text-sm backdrop-blur-xl transition-all flex items-center space-x-2.5 cursor-pointer shadow-lg"
                      id="hero-replay-3d-btn"
                    >
                      <Play className="w-4 h-4 text-foundation-gold fill-foundation-gold" />
                      <span>3D Virtual Entrance</span>
                    </button>
                  </motion.div>
                )}

                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  <Link
                    to="/support"
                    className="px-5 py-4 rounded-full bg-transparent hover:bg-white/10 text-foundation-sandstone border border-foundation-gold/40 font-semibold text-sm transition-all flex items-center space-x-2 backdrop-blur-sm"
                  >
                    <Heart className="w-4 h-4 text-red-400 fill-red-400" />
                    <span>Support / Seva</span>
                  </Link>
                </motion.div>
              </motion.div>

              {/* Verified Helpline Quick Strip */}
              <motion.div
                variants={itemVariants}
                className="pt-3 flex flex-wrap items-center gap-3 text-xs text-foundation-sandstone/90 border-t border-white/15"
              >
                <div className="flex items-center space-x-2 bg-black/40 px-3 py-1.5 rounded-full border border-foundation-gold/30">
                  <Phone className="w-3.5 h-3.5 text-foundation-gold" />
                  <span>Direct Hotline: <a href="tel:+919890898081" className="font-bold underline text-white hover:text-foundation-gold">+91 98908 98081</a></span>
                </div>
                <span className="hidden sm:inline text-stone-500">•</span>
                <span className="text-stone-300">Anjikar Bagh, Mansar Mahuli Rd, Nagpur</span>
              </motion.div>
            </motion.div>

            {/* Right Column: Interactive 3D Sanctuary Portal Matrix */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5"
            >
              <SanctuaryPortalMatrix onExploreWalkthrough={onReplayIntro} />
            </motion.div>
          </div>

          {/* Floating "Scroll to Discover" Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="pt-8 flex flex-col items-center justify-center text-center space-y-2 pointer-events-none"
          >
            <span className="text-[10px] uppercase tracking-[0.28em] text-foundation-gold font-bold">
              Scroll To Discover Sanctuary
            </span>
            <div className="w-5 h-9 rounded-full border-2 border-foundation-gold/60 p-1 flex justify-center">
              <motion.div
                animate={{ y: [0, 14, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-1.5 h-1.5 rounded-full bg-foundation-gold shadow-[0_0_6px_#D4AF37]"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. 3D Institutional Highlights Strip - Floating Dimensional Overlap Bridge */}
      <section className="relative z-30 -mt-10 md:-mt-14 max-w-7xl mx-auto px-4 md:px-8 mb-8 sm:mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <StatCard3D
            value="2015"
            label="Established Year"
            subtext="Society Reg: 332-15-Nag"
            icon={Calendar}
            delay={0.05}
          />
          <StatCard3D
            value="100%"
            label="Non-Granted Charity"
            subtext="Pure community elder care"
            icon={Heart}
            delay={0.15}
          />
          <StatCard3D
            value="Go-Seva"
            label="Sacred Cow Sanctuary"
            subtext="Therapeutic care & fresh milk"
            icon={Sparkles}
            delay={0.25}
          />
          <StatCard3D
            value="Ayush"
            label="Naturopathy & Yoga"
            subtext="Morning yoga & herbal garden"
            icon={Compass}
            delay={0.35}
          />
        </div>
      </section>

      {/* 3. Organization & Founders Introduction with 3D Gate Parallax */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-4">
            <Card3D maxRotate={10} scaleOnHover={1.025}>
              <div className="relative rounded-3xl overflow-hidden border-2 border-foundation-gold/40 shadow-xl bg-white">
                <img
                  src="/assets/images/entrance_gate.jpg"
                  alt="Vyenkatesh Ashram Grand Gate"
                  className="w-full h-84 object-cover"
                />
                <div className="p-4 bg-foundation-warmGray/90 border-t border-foundation-borderMuted text-xs">
                  <p className="font-bold text-foundation-forest flex items-center space-x-1.5">
                    <Shield className="w-3.5 h-3.5 text-foundation-gold" />
                    <span>Vyenkatesh Ashram Grand Entrance Gates</span>
                  </p>
                  <p className="text-stone-500 text-[11px] mt-0.5">Anjikar Bagh, Mansar Mahuli Road, Mahuli, Parseoni, Nagpur</p>
                </div>
              </div>
            </Card3D>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
            className="lg:col-span-7 space-y-5"
          >
            <span className="text-xs uppercase tracking-widest font-bold text-foundation-forest inline-block px-3 py-1 bg-foundation-forest/10 rounded-full">
              Compassionate Mission
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foundation-charcoal leading-tight">
              Serving the Elderly with Reverence, Comfort & Peace
            </h2>
            <p className="text-sm md:text-base text-stone-600 leading-relaxed">
              <strong>SBBM Social Foundation Society</strong> was founded in 2015 by <strong>Mr. Ashwin Vyenkatrao Anjikar</strong> and <strong>Mrs. Tina Anjikar</strong> with the sacred conviction that senior citizens in the evening of their lives deserve uncompromised love, respect, hygienic shelter, and a serene environment free from neglect.
            </p>
            <p className="text-sm md:text-base text-stone-600 leading-relaxed">
              At <strong>Vyenkatesh Ashram</strong>, residents enjoy clean living quarters, separate well-maintained restroom facilities, nutritious freshly cooked vegetarian meals, morning yoga in Anjikar Bagh orchards, spiritual bhajans, and compassionate round-the-clock attendants.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {[
                'Non-commercial, charitable dedication',
                'Rural greenery away from pollution',
                'Active Go-Seva Kendra & cow therapy',
                'Official Society Reg: 332-15-Nag',
              ].map((point, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.4 }}
                  className="flex items-start space-x-2.5 p-2 rounded-xl bg-white/60 border border-foundation-borderMuted/60 shadow-sm"
                >
                  <CheckCircle2 className="w-5 h-5 text-foundation-forest flex-shrink-0 mt-0.5" />
                  <span className="text-xs md:text-sm font-semibold text-stone-700">{point}</span>
                </motion.div>
              ))}
            </div>

            <div className="pt-4 flex items-center space-x-4">
              <Link
                to="/about"
                className="px-6 py-3 bg-foundation-forest hover:bg-foundation-forestLight text-foundation-ivory font-bold text-xs rounded-full shadow-md hover:shadow-lg transition-all flex items-center space-x-1.5"
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
          </motion.div>
        </div>
      </section>

      {/* 4. Core Services Section with 3D Tilt Cards */}
      <section className="bg-gradient-to-b from-foundation-warmGray/60 to-white py-16 md:py-24 border-y border-foundation-borderMuted relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto space-y-3"
          >
            <span className="text-xs uppercase tracking-widest font-bold text-foundation-forest inline-block px-3 py-1 bg-foundation-forest/10 rounded-full">
              What We Do
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foundation-charcoal">
              Holistic Care & Community Initiatives
            </h2>
            <p className="text-sm text-stone-600">
              From elder residential comfort to animal welfare, naturopathy and student empowerment.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service 1: Old Age Home in 3D Card */}
            <Card3D maxRotate={9} scaleOnHover={1.03}>
              <div className="bg-white rounded-3xl overflow-hidden border border-foundation-borderMuted shadow-soft hover:shadow-2xl transition-all h-full flex flex-col justify-between">
                <div>
                  <div className="h-52 overflow-hidden relative">
                    <img
                      src="/assets/images/ashram_building.jpg"
                      alt="Vyenkatesh Ashram Old Age Home"
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                    />
                    <span className="absolute top-3 left-3 px-3 py-1 bg-foundation-forest text-foundation-ivory text-[10px] font-bold rounded-full uppercase tracking-wider shadow-md">
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
                    <ul className="text-xs text-stone-500 space-y-1 pt-1 font-medium">
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
            </Card3D>

            {/* Service 2: Go-Seva Kendra in 3D Card */}
            <Card3D maxRotate={9} scaleOnHover={1.03}>
              <div className="bg-white rounded-3xl overflow-hidden border border-foundation-borderMuted shadow-soft hover:shadow-2xl transition-all h-full flex flex-col justify-between">
                <div>
                  <div className="h-52 overflow-hidden relative">
                    <img
                      src="/assets/images/goseva.jpg"
                      alt="Go-Seva Kendra at Vyenkatesh Ashram"
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                    />
                    <span className="absolute top-3 left-3 px-3 py-1 bg-amber-600 text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-md">
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
                    <ul className="text-xs text-stone-500 space-y-1 pt-1 font-medium">
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
            </Card3D>

            {/* Service 3: Naturopathy in 3D Card */}
            <Card3D maxRotate={9} scaleOnHover={1.03}>
              <div className="bg-white rounded-3xl overflow-hidden border border-foundation-borderMuted shadow-soft hover:shadow-2xl transition-all h-full flex flex-col justify-between">
                <div>
                  <div className="h-52 overflow-hidden relative">
                    <img
                      src="/assets/images/naturopathy.jpg"
                      alt="Naturopathy and Yoga at Vyenkatesh Ashram"
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                    />
                    <span className="absolute top-3 left-3 px-3 py-1 bg-emerald-700 text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-md">
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
                    <ul className="text-xs text-stone-500 space-y-1 pt-1 font-medium">
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
            </Card3D>
          </div>

          <div className="text-center pt-4">
            <Link
              to="/services"
              className="px-7 py-3.5 rounded-full bg-foundation-forest hover:bg-foundation-forestLight text-foundation-ivory font-bold text-xs shadow-md hover:shadow-xl transition-all inline-flex items-center space-x-2"
            >
              <span>View All 6 Foundation Initiatives & Services</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Admission Enquiry Fast-Track Callout with 3D Float */}
      <section className="bg-gradient-to-r from-foundation-forest to-foundation-forestDark text-foundation-ivory py-14 px-4 md:px-8 border-y border-foundation-gold/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-foundation-gold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs uppercase tracking-widest text-foundation-gold font-bold flex items-center justify-center md:justify-start space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-foundation-gold" />
              <span>Direct Inquiries Welcomed</span>
            </span>
            <h3 className="text-2xl md:text-3xl font-display font-bold text-foundation-sandstone">
              Looking for a Dignified Home for an Elder?
            </h3>
            <p className="text-xs md:text-sm text-stone-300 max-w-2xl leading-relaxed">
              Accommodation availability, admission suitability and formalities must be confirmed directly with management. Submit an online enquiry or call +91 98908 98081.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/admission"
                className="px-6 py-3.5 bg-gradient-to-r from-foundation-gold to-yellow-500 hover:from-yellow-400 hover:to-yellow-500 text-foundation-forestDark font-bold rounded-full text-xs shadow-xl transition-all block"
              >
                Submit Admission Enquiry
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <a
                href="tel:+919890898081"
                className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full text-xs border border-white/20 transition-all flex items-center space-x-2 backdrop-blur-md"
              >
                <Phone className="w-3.5 h-3.5 text-foundation-gold" />
                <span>Call +91 98908 98081</span>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. Gallery Showcase Section with Staggered 3D Lift */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 md:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-foundation-forest inline-block px-3 py-1 bg-foundation-forest/10 rounded-full mb-2">
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
            <motion.div
              key={`gal-home-${idx}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ y: -8, scale: 1.03 }}
              onClick={() => setSelectedPhoto(item.src)}
              className="cursor-pointer group relative rounded-3xl overflow-hidden border border-foundation-borderMuted shadow-soft hover:shadow-2xl transition-all duration-300"
            >
              <img
                src={item.src}
                alt={item.title}
                className="w-full h-60 object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <span className="text-[10px] text-foundation-gold font-bold uppercase tracking-wider">
                  {item.category}
                </span>
                <p className="text-xs font-bold font-display mt-0.5">{item.title}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Lightbox Modal with Framer Motion AnimatePresence */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl border-2 border-foundation-gold/40 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedPhoto}
                alt="Enlarged view"
                className="w-full h-full object-contain"
              />
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 bg-black/60 hover:bg-black/90 text-white p-2.5 rounded-full border border-white/20 transition-colors"
                aria-label="Close photo"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 7. Interactive Framer Motion Animated FAQ Accordion */}
      <section className="bg-gradient-to-b from-foundation-warmGray to-white py-16 md:py-24 border-t border-foundation-borderMuted">
        <div className="max-w-4xl mx-auto px-4 md:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase tracking-widest font-bold text-foundation-forest inline-block px-3 py-1 bg-foundation-forest/10 rounded-full">
              Common Questions
            </span>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foundation-charcoal">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3.5">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <motion.div
                  key={`faq-acc-${index}`}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="bg-white rounded-2xl border border-foundation-borderMuted shadow-sm overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between space-x-4 cursor-pointer hover:bg-stone-50 transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span className="font-bold text-sm text-foundation-forest">
                      {faq.q}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="shrink-0 text-stone-400"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 text-xs text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
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
