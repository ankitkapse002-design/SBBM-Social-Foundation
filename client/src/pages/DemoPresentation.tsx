import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, RotateCcw, Volume2, VolumeX, Download,
  CheckCircle2, Sparkles, Shield, User, Globe, ArrowRight,
  ExternalLink, Layers, Award, Heart, Compass, Smartphone
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card3D } from '../components/ui/Card3D';

interface Scene {
  id: number;
  startTime: number;
  endTime: number;
  titleHi: string;
  titleEn: string;
  badge: string;
  image: string;
  descHi: string;
  descEn: string;
  highlightPointsHi: string[];
  highlightPointsEn: string[];
}

export const DemoPresentation: React.FC = () => {
  const [language, setLanguage] = useState<'hi' | 'en'>('hi');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(42); // Approx seconds
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const scenes: Scene[] = [
    {
      id: 1,
      startTime: 0,
      endTime: 9,
      badge: '3D Virtual Experience',
      titleHi: 'भव्य थ्री-डी आश्रम प्रवेश द्वार एवं स्वागत यात्रा',
      titleEn: 'Immersive 3D Entrance & Welcoming Ashram Journey',
      image: '/assets/images/entrance_gate.jpg',
      descHi: 'वेबसाइट खुलते ही आगंतुक सीधे एस.एस.बी.एम. सोशल फाउंडेशन के मुख्य प्रवेश द्वार को खुलते हुए देखते हैं और शांत आध्यात्मिक मार्ग से व्यंकटेश आश्रम में प्रवेश करते हैं।',
      descEn: 'Visitors immediately experience a realistic 3D journey through the grand foundation gates, moving along the tree-lined path toward Vyenkatesh Ashram with an emergent welcome greeting.',
      highlightPointsHi: [
        'माउस स्क्रोल और मोबाइल स्वाइप से नियंत्रित 3D यात्रा',
        'आश्रम के द्वार से निकलता हुआ स्वागत संदेश',
        'आकर्षक लैंडस्केप, बाउंड्री वॉल और शांत वातावरण',
      ],
      highlightPointsEn: [
        'Interactive mouse-scroll and touch-swipe camera motion',
        'Emergent welcoming greeting directly from inside the ashram',
        'Realistic boundary wall, road alignment, and tranquil setting',
      ],
    },
    {
      id: 2,
      startTime: 9,
      endTime: 18,
      badge: 'Modern Clean Navigation',
      titleHi: 'स्वच्छ नेविगेशन और एकीकृत लॉगिन व पोर्टल्स आइकन',
      titleEn: 'Single-Line Aligned Navigation & Unified Portals Icon',
      image: '/assets/images/ashram_building.jpg',
      descHi: 'सभी पृष्ठ एक सुव्यवस्थित एकल रेखा में संजोए गए हैं। प्रवेश पूछताछ के ठीक बगल में एक विशेष लॉगिन आइकन के तहत सेवेकरी, वॉलंटियर और एडमिन पोर्टल एकत्रित किए गए हैं।',
      descEn: 'All page links are strictly aligned on a single clean line without text wrapping. Loose portal links are consolidated under a dedicated Login Icon right next to Admission Enquiry.',
      highlightPointsHi: [
        'नो-रैपिंग सिंगल लाइन अलाइनमेंट (About Us, Old Age Home)',
        'एडमिशन इन्क्वायरी के दाईं ओर विशेष लॉगिन आइकन',
        'एक ही ड्रॉपडाउन में मेंबर लॉगिन, वॉलंटियर और एडमिन पोर्टल',
      ],
      highlightPointsEn: [
        'Strict single-line horizontal alignment with zero awkward wrapping',
        'Dedicated Login / Account icon positioned to the right of Admission Enquiry',
        'Seva Member Login, Volunteer Application, and Admin Governance unified in one dropdown',
      ],
    },
    {
      id: 3,
      startTime: 18,
      endTime: 27,
      badge: '3D AI Assistant',
      titleHi: 'थ्री-डी एनिमेटेड ए.आई. सहायक (SSBM_Bot) एवं नमस्ते ग्रीटिंग्स',
      titleEn: '3D Animated AI Bot (SSBM_Bot) with Greetings & Clean Transparency',
      image: '/assets/images/goseva.jpg',
      descHi: 'वेबसाइट के कोने में 3D एनिमेटेड बॉट हाथ हिलाकर और स्पीच बबल में नमस्ते कहकर आगंतुकों का स्वागत करता है। इसका बैकग्राउंड पूरी तरह पारदर्शी बनाया गया है।',
      descEn: 'The 3D animated assistant floats in the corner with hand-waving animations and rotating welcome bubbles. The white background is cleanly removed in real time.',
      highlightPointsHi: [
        '160px बड़ा और आकर्षक 3D एनिमेटेड कैरेक्टर',
        'सटीक बैकग्राउंड रिमूवल (पारदर्शी फ्लोटिंग बॉट)',
        'नमस्ते ग्रीटिंग बबल और चौबीसों घंटे आश्रम गाइड',
      ],
      highlightPointsEn: [
        'Prominent 160px size with real-time white background removal',
        'Natural floating physics with waving arm and glowing visor',
        'Synchronized multilingual greeting bubble guiding visitors 24/7',
      ],
    },
    {
      id: 4,
      startTime: 27,
      endTime: 36,
      badge: 'Interactive 3D Effects',
      titleHi: 'इंटरैक्टिव थ्री-डी टिल्ट कार्ड्स और समग्र सेवा प्रकल्प',
      titleEn: 'Interactive 3D Parallax Tilt Cards & Core Services Showcase',
      image: '/assets/images/naturopathy.jpg',
      descHi: 'माउस घुमाते ही कार्ड्स वास्तविक 3D स्पेस में झुकते हैं और उन पर सुनहरी रोशनी की चमक दौड़ती है। वृद्ध आश्रम, गो-सेवा केंद्र और प्राकृतिक चिकित्सा का सजीव प्रदर्शन।',
      descEn: 'Moving the cursor smoothly tilts cards in 3D with dynamic light sheen. Showcasing Vyenkatesh Ashram Elder Home, Go-Seva Gir Gaushala, and Naturopathy routines.',
      highlightPointsHi: [
        'फिजिक्स-आधारित 3D रोटेशन और डायनामिक लाइट ग्लेयर',
        'गो-सेवा केंद्र, गिर गाय संरक्षण और प्राकृतिक दूध',
        'नेचुरोपैथी, औषधीय वाटिका एवं योगासन पवेलियन',
      ],
      highlightPointsEn: [
        'Physics-driven spring 3D tilt with specular light reflection',
        'Go-Seva sanctuary with Gir cows for therapy and fresh milk',
        'Naturopathy morning routines, herbal medicine garden & yoga',
      ],
    },
    {
      id: 5,
      startTime: 36,
      endTime: 42,
      badge: 'Governance & Trust',
      titleHi: 'पारदर्शी प्रबंधन, सोसाइटी पंजीकरण एवं मोबाइल अनुकूलता',
      titleEn: 'Transparent Governance, Registered Society & Mobile Responsive',
      image: '/assets/images/logo.jpg',
      descHi: 'सोसाइटी रजिस्ट्रेशन 332-15-Nag (2015) के तहत पूर्ण पारदर्शी संस्था। सेवेकरी सदस्य विवरण, ऑनलाइन डोनेशन सपोर्ट और पूर्णतः मोबाइल-फ्रेंडली इंटरफेस।',
      descEn: 'Officially registered charitable society (332-15-Nag, Est. 2015). Featuring online member registration, secure admin management, and flawless mobile experience.',
      highlightPointsHi: [
        'संस्थापक अध्यक्ष श्री अश्विन व्यंकटराव अंजीकर जी का संदेश',
        'पारदर्शी ऑडिट लॉग्स एवं ऑनलाइन रसीद प्रबंधन',
        'मोबाइल, टैबलेट और डेस्कटॉप पर तीव्र और सुरक्षित अनुभव',
      ],
      highlightPointsEn: [
        'President Mr. Ashwin V. Anjikar leadership message',
        'Audit logging and transparent member receipt generation',
        'Blazing-fast mobile, tablet, and desktop responsiveness',
      ],
    },
  ];

  // Active scene based on audio progress
  const activeSceneIndex = scenes.findIndex(
    (s) => currentTime >= s.startTime && currentTime < s.endTime
  );
  const currentScene = scenes[activeSceneIndex !== -1 ? activeSceneIndex : 0];

  // Sync audio progress
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration) setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleLanguageChange = (lang: 'hi' | 'en') => {
    setLanguage(lang);
    if (audioRef.current) {
      const wasPlaying = isPlaying;
      audioRef.current.pause();
      audioRef.current.src =
        lang === 'hi'
          ? '/assets/audio/demo_voiceover_hindi.mp3'
          : '/assets/audio/demo_voiceover_english.mp3';
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      if (wasPlaying) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  const jumpToScene = (startTime: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = startTime;
      setCurrentTime(startTime);
      if (!isPlaying) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-screen bg-foundation-ivory text-foundation-charcoal py-10 px-4 md:px-8">
      {/* Hidden Audio Element for Neural Voiceover */}
      <audio
        ref={audioRef}
        src={
          language === 'hi'
            ? '/assets/audio/demo_voiceover_hindi.mp3'
            : '/assets/audio/demo_voiceover_english.mp3'
        }
        preload="auto"
      />

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Header & Breadcrumb */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-foundation-borderMuted pb-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-foundation-gold/20 border border-foundation-gold/50 rounded-full text-xs font-bold text-foundation-forest mb-2">
              <Sparkles className="w-3.5 h-3.5 text-foundation-gold" />
              <span>Trustee & Management Demonstration Video Showcase</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-display font-bold text-foundation-charcoal">
              Vyenkatesh Ashram Digital Platform Walkthrough
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Presented for President Mr. Ashwin V. Anjikar, Mrs. Tina Anjikar & SSBM Social Foundation Trustees
            </p>
          </div>

          {/* Voiceover Language Switcher */}
          <div className="flex items-center space-x-2 bg-stone-100 p-1.5 rounded-2xl border border-foundation-borderMuted self-start md:self-auto shadow-inner">
            <span className="text-xs font-bold text-foundation-forest px-2 flex items-center space-x-1">
              <Globe className="w-3.5 h-3.5 text-foundation-gold" />
              <span>Voice:</span>
            </span>
            <button
              onClick={() => handleLanguageChange('hi')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                language === 'hi'
                  ? 'bg-foundation-forest text-foundation-ivory shadow-md'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🇮🇳 हिंदी (Hindi)
            </button>
            <button
              onClick={() => handleLanguageChange('en')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                language === 'en'
                  ? 'bg-foundation-forest text-foundation-ivory shadow-md'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🌐 English
            </button>
          </div>
        </div>

        {/* Video Stage / Visual Presentation Theater */}
        <div className="bg-stone-950 rounded-3xl overflow-hidden shadow-2xl border-2 border-foundation-gold/50 relative">
          <div className="relative aspect-video w-full overflow-hidden bg-black flex items-center justify-center">
            {/* Background scene visual with subtle cinematic scale */}
            <AnimatePresence mode="wait">
              <motion.img
                key={currentScene.id}
                src={currentScene.image}
                alt={currentScene.titleEn}
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 0.85, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 w-full h-full object-cover filter brightness-90"
              />
            </AnimatePresence>

            {/* Cinematic Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/60 pointer-events-none" />

            {/* Top Bar inside Video: Foundation Watermark & Scene Badge */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white z-20">
              <div className="flex items-center space-x-2.5 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20">
                <img
                  src="/assets/images/logo.jpg"
                  alt="SSBM Foundation Logo"
                  className="w-6 h-6 rounded-full border border-foundation-gold"
                />
                <span className="text-xs font-bold uppercase tracking-wider text-foundation-gold">
                  SSBM Social Foundation
                </span>
              </div>

              <div className="bg-foundation-gold text-foundation-forestDark font-bold text-xs px-3 py-1 rounded-full shadow-lg flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-foundation-forestDark animate-pulse" />
                <span>Scene {currentScene.id} of 5: {currentScene.badge}</span>
              </div>
            </div>

            {/* Center Content: Dynamic Title & Highlights */}
            <div className="absolute bottom-16 left-6 right-6 md:left-10 md:right-10 text-white z-20 space-y-2.5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`content-${currentScene.id}-${language}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-2"
                >
                  <h2 className="text-xl sm:text-3xl md:text-4xl font-display font-bold text-foundation-sandstone leading-tight drop-shadow-lg">
                    {language === 'hi' ? currentScene.titleHi : currentScene.titleEn}
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-200 max-w-3xl leading-relaxed drop-shadow-md">
                    {language === 'hi' ? currentScene.descHi : currentScene.descEn}
                  </p>

                  <div className="hidden sm:flex flex-wrap items-center gap-2 pt-1">
                    {(language === 'hi'
                      ? currentScene.highlightPointsHi
                      : currentScene.highlightPointsEn
                    ).map((pt, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] text-white border border-white/10"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-foundation-gold" />
                        <span>{pt}</span>
                      </span>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Big Play Button Overlay when Paused */}
            {!isPlaying && (
              <button
                onClick={togglePlay}
                className="absolute inset-0 w-full h-full flex items-center justify-center bg-black/40 hover:bg-black/30 transition-colors z-30 group"
                aria-label="Play Video Demonstration"
              >
                <div className="w-20 h-20 rounded-full bg-foundation-gold text-foundation-forestDark flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                  <Play className="w-9 h-9 fill-foundation-forestDark ml-1" />
                </div>
              </button>
            )}

            {/* Bottom Controls Bar inside Video */}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/90 to-transparent flex flex-col space-y-2 z-40">
              {/* Timeline Progress Bar */}
              <div
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pos = (e.clientX - rect.left) / rect.width;
                  jumpToScene(pos * duration);
                }}
                className="w-full h-2 bg-white/20 hover:h-3 rounded-full overflow-hidden cursor-pointer transition-all relative"
              >
                <div
                  className="h-full bg-gradient-to-r from-foundation-gold to-yellow-400 rounded-full"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>

              {/* Controls Row */}
              <div className="flex items-center justify-between text-white text-xs">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={togglePlay}
                    className="p-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-colors"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                  </button>

                  <button
                    onClick={() => jumpToScene(0)}
                    className="p-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-colors"
                    title="Restart Demo"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <span className="text-stone-300 font-mono text-[11px]">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                {/* Chapter Scene Jump Buttons */}
                <div className="hidden md:flex items-center space-x-1.5">
                  {scenes.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => jumpToScene(s.startTime)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                        currentScene.id === s.id
                          ? 'bg-foundation-gold text-foundation-forestDark'
                          : 'bg-white/10 text-stone-300 hover:bg-white/20'
                      }`}
                    >
                      Scene {s.id}
                    </button>
                  ))}
                </div>

                <div className="flex items-center space-x-2 text-[11px] text-foundation-gold font-bold">
                  <span>🎙️ Voiceover: {language === 'hi' ? 'Madhur (Hindi)' : 'Prabhat (English)'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Downloadable Media & Assets Section for the Owner */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-foundation-borderMuted shadow-soft space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
            <div>
              <h3 className="text-xl font-display font-bold text-foundation-charcoal flex items-center space-x-2">
                <Download className="w-5 h-5 text-foundation-forest" />
                <span>Download Media Pack & Audio Voiceovers</span>
              </h3>
              <p className="text-xs text-stone-500">
                You can download the professional voiceovers and 3D bot clips to share with the owner or use in video editing software.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 1. Hindi Voiceover MP3 */}
            <a
              href="/assets/audio/demo_voiceover_hindi.mp3"
              download="Vyenkatesh_Ashram_Demo_Hindi.mp3"
              className="p-4 rounded-2xl border border-stone-200 hover:border-foundation-gold bg-stone-50 hover:bg-white shadow-sm transition-all flex items-start space-x-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-foundation-forest/10 text-foundation-forest flex items-center justify-center shrink-0 group-hover:bg-foundation-forest group-hover:text-foundation-gold transition-colors">
                <Volume2 className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-foundation-charcoal group-hover:text-foundation-forest truncate">
                  Hindi Voiceover (MP3)
                </p>
                <p className="text-[11px] text-stone-500 leading-tight">
                  High-fidelity neural Hindi narration (~42s)
                </p>
                <span className="inline-block mt-2 text-[10px] font-bold text-foundation-gold">
                  Download Audio ↓
                </span>
              </div>
            </a>

            {/* 2. English Voiceover MP3 */}
            <a
              href="/assets/audio/demo_voiceover_english.mp3"
              download="Vyenkatesh_Ashram_Demo_English.mp3"
              className="p-4 rounded-2xl border border-stone-200 hover:border-foundation-gold bg-stone-50 hover:bg-white shadow-sm transition-all flex items-start space-x-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Volume2 className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-foundation-charcoal group-hover:text-amber-700 truncate">
                  English Voiceover (MP3)
                </p>
                <p className="text-[11px] text-stone-500 leading-tight">
                  Professional Indian English narration (~38s)
                </p>
                <span className="inline-block mt-2 text-[10px] font-bold text-amber-600">
                  Download Audio ↓
                </span>
              </div>
            </a>

            {/* 3. 3D Animated Bot Video Asset */}
            <a
              href="/assets/video/SSBM_Bot.mp4"
              download="SSBM_Bot.mp4"
              className="p-4 rounded-2xl border border-stone-200 hover:border-foundation-gold bg-stone-50 hover:bg-white shadow-sm transition-all flex items-start space-x-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Play className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-foundation-charcoal group-hover:text-emerald-700 truncate">
                  SSBM_Bot Animation (MP4)
                </p>
                <p className="text-[11px] text-stone-500 leading-tight">
                  3D Robot character waving & greeting
                </p>
                <span className="inline-block mt-2 text-[10px] font-bold text-emerald-600">
                  Download Video ↓
                </span>
              </div>
            </a>
          </div>
        </div>

        {/* Complete Written Bilingual Pitch Script & Talking Points for the Owner */}
        <div className="bg-foundation-warmGray/80 rounded-3xl p-6 md:p-8 border border-foundation-borderMuted space-y-6">
          <div className="border-b border-stone-200 pb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-foundation-forest">
              Executive Presentation Script
            </span>
            <h3 className="text-xl font-display font-bold text-foundation-charcoal mt-1">
              Complete Script & Speaker Notes for Mr. Ashwin Anjikar & Trustees
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Hindi Script Column */}
            <div className="space-y-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
              <div className="flex items-center space-x-2 border-b border-stone-100 pb-2">
                <span className="text-lg">🇮🇳</span>
                <h4 className="font-bold text-sm text-foundation-forest">
                  हिंदी स्पीच स्क्रिप्ट (Hindi Presentation Script)
                </h4>
              </div>
              <div className="space-y-3 text-xs leading-relaxed text-stone-700">
                <p>
                  <strong>[00:00 - 00:09]</strong> सादर प्रणाम अश्विन जी और एस.एस.बी.एम. सोशल फाउंडेशन के सभी सम्मानीय ट्रस्टीगण। आज हमें आपके समक्ष व्यंकटेश आश्रम की आधुनिक, आध्यात्मिक और भव्य वेबसाइट प्रस्तुत करते हुए अपार हर्ष हो रहा है।
                </p>
                <p>
                  <strong>[00:09 - 00:18]</strong> वेबसाइट की शुरुआत होती है एक अत्यंत मनमोहक 3D अनुभव से। आगंतुक जैसे ही वेबसाइट पर आते हैं, वे सीधे फाउंडेशन के मुख्य प्रवेश द्वार को खुलते हुए देखते हैं और एक शांत आध्यात्मिक यात्रा के साथ व्यंकटेश आश्रम की ओर बढ़ते हैं। आश्रम के द्वार से निकलता हुआ स्वागत संदेश हर आगंतुक का आत्मीयता से अभिनंदन करता है।
                </p>
                <p>
                  <strong>[00:18 - 00:27]</strong> मुख्य होमपेज पर, एक अत्यंत स्वच्छ और सुव्यवस्थित नेविगेशन बार दिया गया है। प्रवेश पूछताछ और आवश्यक पोर्टल्स को सुगमता से खोजने के लिए, एक विशेष लॉगिन आइकन के तहत सेवेकरी सदस्य, वॉलंटियर और एडमिन पोर्टल को एक ही स्थान पर संजोया गया है।
                </p>
                <p>
                  <strong>[00:27 - 00:36]</strong> साथ ही, वेबसाइट के निचले हिस्से में मौजूद है हमारा विशेष 3D एनिमेटेड ए.आई. सहायक, जो हाथ हिलाकर और 'नमस्ते' कहकर हर आगंतुक का स्वागत करता है। यह आश्रम के नियमों, गो-सेवा, प्राकृतिक चिकित्सा और प्रवेश प्रक्रिया की 24 घंटे सही जानकारी देता है।
                </p>
                <p>
                  <strong>[00:36 - 00:42]</strong> वेबसाइट में आधुनिक 3D टिल्ट इफेक्ट्स, इंटरैक्टिव कार्ड्स, पारदर्शी रिपोर्टिंग और मोबाइल अनुकूलन का विशेष ध्यान रखा गया है। यह डिजिटल मंच व्यंकटेश आश्रम की पावन सेवा को पूरे समाज तक पहुंचाने में मील का पत्थर साबित होगा। धन्यवाद।
                </p>
              </div>
            </div>

            {/* English Script Column */}
            <div className="space-y-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
              <div className="flex items-center space-x-2 border-b border-stone-100 pb-2">
                <span className="text-lg">🌐</span>
                <h4 className="font-bold text-sm text-foundation-forest">
                  English Presentation Script
                </h4>
              </div>
              <div className="space-y-3 text-xs leading-relaxed text-stone-700">
                <p>
                  <strong>[00:00 - 00:09]</strong> Respected Shri Ashwin ji and esteemed trustees of SBBM Social Foundation. We are proud to present the official, state-of-the-art digital portal for Vyenkatesh Ashram and the foundation.
                </p>
                <p>
                  <strong>[00:09 - 00:18]</strong> The experience begins with an immersive 3D entrance journey. As visitors enter, the grand gates of SBBM Social Foundation open smoothly, taking them on a realistic path leading to the serene facade of Vyenkatesh Ashram, greeted by an emergent warm welcome from within the ashram.
                </p>
                <p>
                  <strong>[00:18 - 00:27]</strong> Arriving at the homepage, visitors discover a clean, beautifully aligned navigation system. Loose portal links have been consolidated under a dedicated Login Icon right beside Admission Enquiry — neatly organizing Seva Member Login, Volunteer Applications, and the Secure Admin Governance Portal in one elegant dropdown.
                </p>
                <p>
                  <strong>[00:27 - 00:36]</strong> At the bottom corner, your visitors are greeted by our 3D animated AI Bot, whose background has been seamlessly removed. The bot floats gracefully with waving animations and live greetings, guiding visitors 24/7 on admissions, gaushala activities, and senior care.
                </p>
                <p>
                  <strong>[00:36 - 00:42]</strong> The website also features interactive 3D parallax cards, dynamic lighting, holistic care showcases, and mobile-friendly access. This modern digital platform reflects the compassion, dignity, and transparency of Vyenkatesh Ashram to the world. Thank you.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Home CTA */}
        <div className="flex items-center justify-center space-x-4 pt-4">
          <Link
            to="/"
            className="px-6 py-3 bg-foundation-forest text-foundation-ivory font-bold text-xs rounded-full shadow-md hover:bg-foundation-forestLight transition-all"
          >
            ← Back to Main Website
          </Link>
          <Link
            to="/admission"
            className="px-6 py-3 bg-foundation-gold text-foundation-forestDark font-bold text-xs rounded-full shadow-md hover:bg-yellow-500 transition-all"
          >
            Go to Admission Enquiry →
          </Link>
        </div>
      </div>
    </div>
  );
};
