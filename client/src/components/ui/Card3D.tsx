import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  maxRotate?: number; // Maximum rotation in degrees (default 12)
  glareEffect?: boolean;
  scaleOnHover?: number;
  onClick?: () => void;
}

export const Card3D: React.FC<Card3DProps> = ({
  children,
  className = '',
  maxRotate = 10,
  glareEffect = true,
  scaleOnHover = 1.03,
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Normalized cursor coordinates within the card (0.0 to 1.0, center is 0.5)
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // Smooth springs for 3D rotation
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [maxRotate, -maxRotate]), {
    damping: 25,
    stiffness: 220,
  });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-maxRotate, maxRotate]), {
    damping: 25,
    stiffness: 220,
  });

  // Glare position
  const glareBackground = useTransform([mouseX, mouseY], ([x, y]) => {
    const posX = (x as number) * 100;
    const posY = (y as number) * 100;
    return `radial-gradient(circle at ${posX}% ${posY}%, rgba(255, 230, 160, 0.22) 0%, rgba(255, 255, 255, 0.05) 45%, transparent 75%)`;
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <div
      style={{ perspective: 1000 }}
      className="w-full h-full"
    >
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
          scale: scaleOnHover,
          boxShadow: '0 25px 45px -12px rgba(10, 40, 25, 0.22), 0 12px 25px -8px rgba(212, 160, 23, 0.18)',
        }}
        transition={{ duration: 0.2 }}
        className={`relative overflow-hidden transition-shadow duration-300 ${className}`}
      >
        {/* Child content with 3D preservation */}
        <div style={{ transform: 'translateZ(0px)', transformStyle: 'preserve-3d' }}>
          {children}
        </div>

        {/* Dynamic Light Specular Glare */}
        {glareEffect && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300"
            style={{
              background: glareBackground,
              opacity: isHovered ? 1 : 0,
            }}
          />
        )}
      </motion.div>
    </div>
  );
};
