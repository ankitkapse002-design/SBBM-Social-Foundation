import React, { useRef, useEffect } from 'react';

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  pulseSpeed: number;
}

export const HeroParticles3D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let isVisible = true;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      targetMouseX = e.clientX - rect.left;
      targetMouseY = e.clientY - rect.top;
    };

    // Pause when out of screen for maximum performance
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible && !animId) {
        animId = requestAnimationFrame(render);
      }
    }, { threshold: 0.1 });
    observer.observe(canvas);

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const colors = [
      'rgba(212, 160, 23, ', // Gold
      'rgba(247, 218, 140, ', // Light Gold
      'rgba(139, 29, 36, ',   // Crimson
      'rgba(82, 121, 111, ',  // Sage green
      'rgba(255, 255, 255, ', // Starlight white
    ];

    const particles: Particle[] = Array.from({ length: 48 }, () => {
      const x = Math.random() * width;
      const y = Math.random() * height;
      return {
        x,
        y,
        baseX: x,
        baseY: y,
        size: Math.random() * 2.6 + 1.2,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -Math.random() * 0.5 - 0.15, // Upward gentle drift
        alpha: Math.random() * 0.55 + 0.25,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulseSpeed: Math.random() * 0.03 + 0.015,
      };
    });

    let t = 0;
    const render = () => {
      if (!isVisible) {
        animId = 0;
        return;
      }

      ctx.clearRect(0, 0, width, height);
      t += 0.018;

      // Smooth mouse damping
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      const mouseOffsetFactorX = (mouseX / width - 0.5) * 35;
      const mouseOffsetFactorY = (mouseY / height - 0.5) * 25;

      for (const p of particles) {
        p.baseX += p.vx + Math.sin(t + p.baseY * 0.01) * 0.25;
        p.baseY += p.vy;

        // Wrap around boundaries
        if (p.baseY < -15) {
          p.baseY = height + 15;
          p.baseX = Math.random() * width;
        }
        if (p.baseX < -15) p.baseX = width + 15;
        if (p.baseX > width + 15) p.baseX = -15;

        // Apply mouse-based 3D depth offset based on particle size (closer particles move more)
        const depth = p.size / 3.8;
        p.x = p.baseX + mouseOffsetFactorX * depth;
        p.y = p.baseY + mouseOffsetFactorY * depth;

        const currentAlpha = p.alpha * (0.65 + 0.35 * Math.sin(t * p.pulseSpeed * 80));

        // Draw particle with soft glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${currentAlpha})`;
        ctx.shadowBlur = p.size * 3.5;
        ctx.shadowColor = 'rgba(212, 160, 23, 0.45)';
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none z-0 opacity-80"
    />
  );
};
