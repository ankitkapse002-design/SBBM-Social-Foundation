import React from 'react';

interface MinimalistBackdropProps {
  /** Path to genuine authorized photograph */
  imageSrc?: string;
  /** Alt text for accessibility (marked aria-hidden if decorative) */
  alt?: string;
  /** Restrained opacity: defaults to 0.04 (4%) */
  opacity?: number;
  /** Masking style to gracefully fade edges into surrounding whitespace */
  mask?: 'radial' | 'top-bottom' | 'bottom' | 'none';
  /** Whether to blend a soft micro-grain institutional parchment texture */
  texture?: boolean;
  /** Focus position for the background photo */
  position?: string;
  /** Optional container class name */
  className?: string;
}

export const MinimalistBackdrop: React.FC<MinimalistBackdropProps> = ({
  imageSrc,
  alt = '',
  opacity = 0.04,
  mask = 'radial',
  texture = true,
  position = 'center',
  className = '',
}) => {
  // Determine mask style
  let maskStyle: React.CSSProperties = {};
  if (mask === 'radial') {
    maskStyle = {
      WebkitMaskImage: 'radial-gradient(ellipse 75% 70% at 50% 50%, black 25%, transparent 80%)',
      maskImage: 'radial-gradient(ellipse 75% 70% at 50% 50%, black 25%, transparent 80%)',
    };
  } else if (mask === 'top-bottom') {
    maskStyle = {
      WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
      maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
    };
  } else if (mask === 'bottom') {
    maskStyle = {
      WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
      maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
    };
  }

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 select-none overflow-hidden z-0 ${className}`}
    >
      {/* 1. Authentic Low-Opacity Photographic Backdrop */}
      {imageSrc && (
        <div
          className="absolute inset-0 transition-opacity duration-700 ease-out"
          style={{
            ...maskStyle,
            opacity: Math.min(Math.max(opacity, 0.01), 0.08), // Hard upper limit of 8% for guaranteed restraint
          }}
        >
          <img
            src={imageSrc}
            alt={alt}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover filter blur-[0.5px] scale-[1.02]"
            style={{ objectPosition: position }}
          />
        </div>
      )}

      {/* 2. Soft Micro-Linen / Woven Parchment Texture (1.5% Opacity SVG Pattern) */}
      {texture && (
        <div
          className="absolute inset-0 opacity-[0.018] mix-blend-multiply"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%230f172a' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
          }}
        />
      )}

      {/* 3. Subtle Warm Ambient Radial Glow for Organic Depth */}
      <div
        className="absolute inset-0 bg-radial-[circle_at_top_right] from-amber-500/[0.02] via-transparent to-transparent pointer-events-none"
      />
    </div>
  );
};

