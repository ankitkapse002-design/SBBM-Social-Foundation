import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, MapPin, Sparkles, ChevronRight,
  Eye, Heart, Sun, Activity, Star
} from 'lucide-react';
import { Card3D } from './Card3D';

interface SanctuaryDimension {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  location: string;
  image: string;
  metric: string;
  metricLabel: string;
  icon: React.ElementType;
}

const DIMENSIONS: SanctuaryDimension[] = [
  {
    id: 'residence',
    tag: 'Care & Living',
    title: 'Vyenkatesh Ashram Residence',
    subtitle: 'Airy, hygienic suites, shaded verandas & peaceful courtyard living',
    location: 'Anjikar Bagh, Mansar Mahuli Rd, Nagpur',
    image: '/assets/images/ashram_building.jpg',
    metric: '24/7',
    metricLabel: 'Attendant & Medical Care',
    icon: ShieldCheck,
  },
  {
    id: 'gate',
    tag: 'Peaceful Estate',
    title: 'Grand Entrance & Nature Orchard',
    subtitle: 'Serene rural haven shielded from city chaos and industrial pollution',
    location: 'Tehsil Parseoni, Dist. Nagpur',
    image: '/assets/images/entrance_gate.jpg',
    metric: '12+',
    metricLabel: 'Acres of Lush Greenery',
    icon: MapPin,
  },
  {
    id: 'goseva',
    tag: 'Spiritual Bond',
    title: 'Sacred Go-Seva Sanctuary',
    subtitle: 'Daily cow companionship, therapeutic bonding & organic A2 dairy',
    location: 'Vyenkatesh Ashram Gaushala',
    image: '/assets/images/goseva.jpg',
    metric: '100%',
    metricLabel: 'Pure Desi Cow Shelter',
    icon: Heart,
  },
  {
    id: 'wellness',
    tag: 'Holistic Health',
    title: 'Naturopathy & Herbal Gardens',
    subtitle: 'Morning yogic therapy, fresh herbal air, and balanced vegetarian meals',
    location: 'Ayush Wellness Zone',
    image: '/assets/images/naturopathy.jpg',
    metric: 'Daily',
    metricLabel: 'Yoga & Naturopathy Care',
    icon: Activity,
  },
];

interface SanctuaryPortalMatrixProps {
  onExploreWalkthrough?: () => void;
}

export const SanctuaryPortalMatrix: React.FC<SanctuaryPortalMatrixProps> = ({ onExploreWalkthrough }) => {
  const [activeId, setActiveId] = useState<string>('residence');
  const activeItem = DIMENSIONS.find((d) => d.id === activeId) || DIMENSIONS[0];
  const IconComponent = activeItem.icon;

  return (
    <div className="relative w-full max-w-xl mx-auto lg:max-w-none">
      {/* Outer Holographic Glow Halo */}
      <div className="absolute -inset-1 bg-gradient-to-r from-foundation-gold/40 via-emerald-500/20 to-foundation-gold/30 rounded-[32px] blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 -z-10" />

      {/* Main 3D Perspective Visual Display */}
      <Card3D maxRotate={9} scaleOnHover={1.015}>
        <div className="relative rounded-[28px] overflow-hidden border border-foundation-gold/50 shadow-[0_25px_60px_rgba(0,0,0,0.55)] bg-[#07190F]/90 backdrop-blur-xl">
          {/* Active Visual with Smooth Crossfade */}
          <div className="relative h-72 sm:h-88 md:h-[420px] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeItem.id}
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <img
                  src={activeItem.image}
                  alt={activeItem.title}
                  className="w-full h-full object-cover"
                />
                {/* Cinematic Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#05140C] via-[#07190F]/45 to-black/20" />
                <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/60 pointer-events-none" />
              </motion.div>
            </AnimatePresence>

            {/* Top Floating Badges */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-foundation-gold/50 text-foundation-goldLight text-[11px] font-bold shadow-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="uppercase tracking-wider">{activeItem.tag}</span>
              </div>

              {onExploreWalkthrough && (
                <button
                  onClick={onExploreWalkthrough}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-foundation-gold/90 hover:bg-foundation-gold text-foundation-forestDark text-xs font-bold shadow-md hover:shadow-xl transition-all cursor-pointer backdrop-blur-sm"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>3D Walkthrough</span>
                </button>
              )}
            </div>

            {/* Bottom Content Card over Image */}
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7 z-10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] tracking-widest uppercase text-foundation-gold font-bold flex items-center space-x-1.5">
                  <Star className="w-3.5 h-3.5 fill-foundation-gold text-foundation-gold" />
                  <span>Verified Charitable Sansthan</span>
                </span>
                <div className="flex items-center space-x-2 bg-emerald-950/70 border border-emerald-500/40 px-2.5 py-1 rounded-full text-[11px] text-emerald-300 font-semibold backdrop-blur-sm">
                  <IconComponent className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{activeItem.metric}: {activeItem.metricLabel}</span>
                </div>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-white tracking-wide drop-shadow-md">
                  {activeItem.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 mt-1 line-clamp-2 leading-relaxed">
                  {activeItem.subtitle}
                </p>
                <p className="text-[11px] text-foundation-sandstone/80 flex items-center space-x-1 mt-1.5">
                  <MapPin className="w-3 h-3 text-foundation-gold flex-shrink-0" />
                  <span className="truncate">{activeItem.location}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Sanctuary Selector Matrix (4 interactive switches) */}
          <div className="p-3 sm:p-4 bg-[#07190F]/95 border-t border-foundation-gold/30 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {DIMENSIONS.map((item) => {
              const isSelected = item.id === activeId;
              const ItemIcon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveId(item.id)}
                  className={`p-2.5 rounded-2xl text-left transition-all duration-300 relative overflow-hidden cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-br from-foundation-gold/25 via-foundation-forest/60 to-foundation-forestDark border border-foundation-gold text-white shadow-lg'
                      : 'bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 hover:text-white'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activePortalIndicator"
                      className="absolute inset-0 bg-foundation-gold/10 pointer-events-none"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <div className="flex items-center justify-between mb-1">
                    <ItemIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-foundation-gold' : 'text-stone-400'}`} />
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-foundation-gold animate-pulse" />}
                  </div>
                  <p className="text-[11px] font-bold truncate leading-tight">{item.tag}</p>
                  <p className="text-[9.5px] text-stone-400 truncate mt-0.5">{item.metric}</p>
                </button>
              );
            })}
          </div>
        </div>
      </Card3D>
    </div>
  );
};
