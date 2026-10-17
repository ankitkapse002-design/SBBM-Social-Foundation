import React from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface StatCard3DProps {
  value: string;
  label: string;
  subtext: string;
  icon?: LucideIcon;
  delay?: number;
}

export const StatCard3D: React.FC<StatCard3DProps> = ({
  value,
  label,
  subtext,
  icon: Icon,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const }}
      whileHover={{ y: -6, scale: 1.04 }}
      className="relative group p-5 bg-white/85 hover:bg-white rounded-3xl shadow-soft hover:shadow-2xl border border-foundation-borderMuted hover:border-foundation-gold/60 backdrop-blur-md transition-all duration-300 text-center overflow-hidden flex flex-col items-center justify-center"
    >
      {/* Ambient gradient flare on hover */}
      <div className="absolute -top-12 -right-12 w-28 h-28 bg-foundation-gold/15 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

      {Icon && (
        <div className="w-10 h-10 rounded-2xl bg-foundation-forest/10 group-hover:bg-foundation-forest group-hover:text-foundation-gold text-foundation-forest flex items-center justify-center mb-3 transition-colors duration-300">
          <Icon className="w-5 h-5" />
        </div>
      )}

      <motion.p
        className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-foundation-forest group-hover:text-foundation-forestDark transition-colors"
        whileHover={{ scale: 1.06 }}
      >
        {value}
      </motion.p>

      <p className="text-xs sm:text-sm font-bold text-foundation-charcoal mt-1 tracking-wide">
        {label}
      </p>

      <p className="text-[11px] text-stone-500 mt-0.5 font-medium">
        {subtext}
      </p>

      {/* Golden shimmer underline accent */}
      <div className="w-8 h-1 bg-foundation-gold/40 group-hover:w-16 group-hover:bg-foundation-gold rounded-full mt-3 transition-all duration-300" />
    </motion.div>
  );
};
