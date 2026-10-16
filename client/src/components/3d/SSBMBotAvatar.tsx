import React, { useRef, useEffect, useState, useCallback } from 'react';

interface SSBMBotAvatarProps {
  className?: string;
  size?: number; // Display size in px
  showGreetingBadge?: boolean;
  interactiveHover?: boolean;
}

export const SSBMBotAvatar: React.FC<SSBMBotAvatarProps> = ({
  className = '',
  size = 110,
  showGreetingBadge = true,
  interactiveHover = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [greetingIndex, setGreetingIndex] = useState(0);

  const greetings = [
    'Namaste! 🙏 I am Vyenky AI',
    'Ask me about Ashram & Seva 🌿',
    'Admission • Go-Seva • Wellness ✨',
    'Click me to chat anytime! 💬',
  ];

  // Rotate greetings periodically
  useEffect(() => {
    if (!showGreetingBadge) return;
    const interval = setInterval(() => {
      setGreetingIndex((prev) => (prev + 1) % greetings.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [showGreetingBadge, greetings.length]);

  // Video processing & Real-time background removal
  useEffect(() => {
    const video = document.createElement('video');
    videoRef.current = video;
    video.src = '/assets/video/SSBM_Bot.mp4';
    video.crossOrigin = 'anonymous';
    video.muted = true;
    video.playsInline = true;
    video.loop = true;
    video.autoplay = true;

    // Offscreen canvas for frame extraction
    const W = 160;
    const H = 160;
    const offscreen = document.createElement('canvas');
    offscreen.width = W;
    offscreen.height = H;
    const offCtx = offscreen.getContext('2d', { willReadFrequently: true });

    let isRunning = true;

    // Preallocated buffers for high-speed flood-fill
    const totalPixels = W * H;
    const isBg = new Uint8Array(totalPixels);
    const queue = new Int32Array(totalPixels);

    const processFrame = () => {
      if (!isRunning) return;

      const canvas = canvasRef.current;
      if (!canvas) {
        animFrameRef.current = requestAnimationFrame(processFrame);
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx || !offCtx) {
        animFrameRef.current = requestAnimationFrame(processFrame);
        return;
      }

      if (video.readyState >= 2 && video.videoWidth > 0) {
        // Draw video frame to offscreen canvas
        offCtx.drawImage(video, 0, 0, W, H);
        const imgData = offCtx.getImageData(0, 0, W, H);
        const data = imgData.data;

        // Reset flood fill tracking
        isBg.fill(0);
        let qHead = 0;
        let qTail = 0;

        // White color detector for background (near pure white, low saturation)
        const isWhiteBgPixel = (idx: number) => {
          const p = idx * 4;
          const r = data[p];
          const g = data[p + 1];
          const b = data[p + 2];
          // Detect white/off-white background with tolerance for MP4 compression noise
          const isBright = r >= 238 && g >= 238 && b >= 238;
          const isNeutral = Math.abs(r - g) <= 16 && Math.abs(r - b) <= 16;
          return isBright && isNeutral;
        };

        // Seed flood fill along all four canvas boundaries
        for (let x = 0; x < W; x++) {
          const top = x;
          const bot = (H - 1) * W + x;
          if (!isBg[top] && isWhiteBgPixel(top)) {
            isBg[top] = 1;
            queue[qTail++] = top;
          }
          if (!isBg[bot] && isWhiteBgPixel(bot)) {
            isBg[bot] = 1;
            queue[qTail++] = bot;
          }
        }

        for (let y = 0; y < H; y++) {
          const left = y * W;
          const right = y * W + (W - 1);
          if (!isBg[left] && isWhiteBgPixel(left)) {
            isBg[left] = 1;
            queue[qTail++] = left;
          }
          if (!isBg[right] && isWhiteBgPixel(right)) {
            isBg[right] = 1;
            queue[qTail++] = right;
          }
        }

        // 4-directional breadth-first search to cleanly trace the entire outer background
        while (qHead < qTail) {
          const curr = queue[qHead++];
          const cx = curr % W;
          const cy = (curr / W) | 0;

          // Up
          if (cy > 0) {
            const n = curr - W;
            if (!isBg[n] && isWhiteBgPixel(n)) {
              isBg[n] = 1;
              queue[qTail++] = n;
            }
          }
          // Down
          if (cy < H - 1) {
            const n = curr + W;
            if (!isBg[n] && isWhiteBgPixel(n)) {
              isBg[n] = 1;
              queue[qTail++] = n;
            }
          }
          // Left
          if (cx > 0) {
            const n = curr - 1;
            if (!isBg[n] && isWhiteBgPixel(n)) {
              isBg[n] = 1;
              queue[qTail++] = n;
            }
          }
          // Right
          if (cx < W - 1) {
            const n = curr + 1;
            if (!isBg[n] && isWhiteBgPixel(n)) {
              isBg[n] = 1;
              queue[qTail++] = n;
            }
          }
        }

        // Apply transparency to background and smooth anti-aliased edge feathering
        for (let i = 0; i < totalPixels; i++) {
          const p = i * 4;
          if (isBg[i] === 1) {
            // Absolute transparent for outer background
            data[p + 3] = 0;
          } else {
            // Check if this pixel borders a background pixel for soft anti-aliasing
            const cx = i % W;
            const cy = (i / W) | 0;
            const hasBgNeighbor =
              (cy > 0 && isBg[i - W]) ||
              (cy < H - 1 && isBg[i + W]) ||
              (cx > 0 && isBg[i - 1]) ||
              (cx < W - 1 && isBg[i + 1]);

            if (hasBgNeighbor) {
              const r = data[p];
              const g = data[p + 1];
              const b = data[p + 2];
              const brightness = (r + g + b) / 3;
              // Smoothly blend edges bordering the white background
              if (brightness > 225) {
                const alphaFactor = Math.max(0, Math.min(1, (255 - brightness) / 30));
                data[p + 3] = Math.round(255 * alphaFactor);
              }
            } else {
              // Soft translucent treatment for ground shadow (blue-gray oval at bottom)
              const r = data[p];
              const g = data[p + 1];
              const b = data[p + 2];
              if (cy > H * 0.75 && b > r + 8 && r > 180 && g > 190) {
                // Ground shadow: semi-transparent so it grounds naturally on any background
                data[p + 3] = Math.min(data[p + 3], 150);
              }
            }
          }
        }

        // Render transparent result onto visible canvas with smooth scaling
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        offCtx.putImageData(imgData, 0, 0);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(offscreen, 0, 0, canvas.width, canvas.height);

        if (!videoLoaded) setVideoLoaded(true);
      }

      animFrameRef.current = requestAnimationFrame(processFrame);
    };

    const handleCanPlay = () => {
      video.play().catch(() => {
        // Autoplay policy fallback: muted play on first user interaction
        const resumePlay = () => {
          video.play().catch(() => {});
          window.removeEventListener('click', resumePlay);
          window.removeEventListener('touchstart', resumePlay);
        };
        window.addEventListener('click', resumePlay);
        window.addEventListener('touchstart', resumePlay);
      });
    };

    video.addEventListener('canplay', handleCanPlay);
    video.play().catch(() => {});
    animFrameRef.current = requestAnimationFrame(processFrame);

    return () => {
      isRunning = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      video.removeEventListener('canplay', handleCanPlay);
      video.pause();
      video.src = '';
    };
  }, []);

  return (
    <div
      className={`relative select-none flex flex-col items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Floating Greeting Speech Bubble (Synchronized with 3D Bot) */}
      {showGreetingBadge && (
        <div
          className="absolute -top-12 right-0 md:-right-4 whitespace-nowrap z-50 pointer-events-none transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
          id="ssbm-bot-greeting-bubble"
        >
          <div className="bg-foundation-forestDark/95 text-foundation-ivory text-[11px] font-bold px-3 py-1.5 rounded-2xl shadow-xl border border-foundation-gold/60 backdrop-blur-md flex items-center space-x-1.5 relative">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span className="text-foundation-sandstone tracking-wide">
              {greetings[greetingIndex]}
            </span>
            {/* Speech bubble pointer */}
            <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-foundation-forestDark/95 border-r border-b border-foundation-gold/60 transform rotate-45" />
          </div>
        </div>
      )}

      {/* 3D Animated Bot Canvas with Transparent Background */}
      <canvas
        ref={canvasRef}
        width={size * 2} // 2x for sharp Retina display rendering
        height={size * 2}
        className={`w-full h-full object-contain pointer-events-none transition-transform duration-300 ${
          interactiveHover ? 'hover:scale-105' : ''
        }`}
        style={{
          filter: 'drop-shadow(0 10px 18px rgba(10, 40, 25, 0.28)) drop-shadow(0 2px 6px rgba(212, 160, 23, 0.22))',
        }}
      />

      {/* Subtle Ambient Glow Aura */}
      <div
        className="absolute inset-0 rounded-full bg-foundation-gold/10 blur-xl pointer-events-none -z-10 animate-pulse"
        style={{ transform: 'scale(0.8)' }}
      />
    </div>
  );
};
