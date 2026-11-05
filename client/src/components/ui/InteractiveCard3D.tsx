import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface InteractiveCard3DProps {
  children: React.ReactNode;
  className?: string;
  maxRotate?: number;
  scaleHover?: number;
  borderSheen?: boolean;
  onClick?: () => void;
}

export const InteractiveCard3D: React.FC<InteractiveCard3DProps> = ({
  children,
  className = '',
  maxRotate = 8,
  scaleHover = 1.02,
  borderSheen = true,
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { damping: 20, stiffness: 200, mass: 0.1 };
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [maxRotate, -maxRotate]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-maxRotate, maxRotate]), springConfig);

  const sheenBackground = useTransform([mouseX, mouseY], ([x, y]) => {
    const px = (x as number) * 100;
    const py = (y as number) * 100;
    return `radial-gradient(circle at ${px}% ${py}%, rgba(212, 175, 55, 0.15) 0%, rgba(139, 29, 36, 0.05) 40%, transparent 70%)`;
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <div style={{ perspective: 1200 }} className="w-full h-full">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{
          scale: scaleHover,
          boxShadow: '0 20px 35px -10px rgba(15, 23, 42, 0.12), 0 8px 16px -6px rgba(139, 29, 36, 0.08)',
        }}
        transition={{ duration: 0.2 }}
        className={`relative rounded-2xl bg-white border border-[#E5E7EB] transition-colors duration-200 ${className}`}
      >
        {/* Border Sheen / Reflection */}
        {borderSheen && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 rounded-2xl transition-opacity duration-300"
            style={{
              background: sheenBackground,
              opacity: isHovered ? 1 : 0,
            }}
          />
        )}

        {/* Card Content with 3D Depth */}
        <div style={{ transform: 'translateZ(10px)', transformStyle: 'preserve-3d' }}>
          {children}
        </div>
      </motion.div>
    </div>
  );
};

