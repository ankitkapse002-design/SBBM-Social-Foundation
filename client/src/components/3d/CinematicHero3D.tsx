import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Procedural soft glowing circular particle texture
function createParticleTexture(): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 245, 210, 1.0)');
    gradient.addColorStop(0.3, 'rgba(245, 208, 97, 0.75)');
    gradient.addColorStop(0.65, 'rgba(212, 175, 55, 0.35)');
    gradient.addColorStop(1, 'rgba(27, 67, 50, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// ==========================================
// 1. SACRED GOLDEN MANDALA & SANCTUARY RELIC
// ==========================================
function SacredSanctuaryRelic({ mousePos }: { mousePos: React.MutableRefObject<[number, number]> }) {
  const outerRingRef = useRef<THREE.Group>(null);
  const innerRingRef = useRef<THREE.Group>(null);
  const centralPrismRef = useRef<THREE.Mesh>(null);
  const rootGroupRef = useRef<THREE.Group>(null);

  // Create decorative rays / tooth markers around the sacred circle
  const rayMarkers = useMemo(() => {
    const count = 16;
    const markers = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 3.65;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      markers.push({ x, y, angle });
    }
    return markers;
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // Subtle counter-rotations
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = time * 0.08;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z = -time * 0.14;
      innerRingRef.current.rotation.x = Math.sin(time * 0.35) * 0.15;
    }
    if (centralPrismRef.current) {
      centralPrismRef.current.rotation.y = time * 0.45;
      centralPrismRef.current.rotation.x = time * 0.3;
      // Gentle breathing scale
      const scale = 1.0 + Math.sin(time * 1.5) * 0.05;
      centralPrismRef.current.scale.set(scale, scale, scale);
    }

    // Inertial spring tilt based on mouse position
    if (rootGroupRef.current) {
      const targetRotX = mousePos.current[1] * 0.35;
      const targetRotY = mousePos.current[0] * 0.45;
      rootGroupRef.current.rotation.x += (targetRotX - rootGroupRef.current.rotation.x) * 0.05;
      rootGroupRef.current.rotation.y += (targetRotY - rootGroupRef.current.rotation.y) * 0.05;

      // Slight organic floating bob
      rootGroupRef.current.position.y = Math.sin(time * 0.8) * 0.18;
    }
  });

  return (
    <group ref={rootGroupRef} position={[0, 0, -2]}>
      {/* Outer Sacred Ring */}
      <group ref={outerRingRef}>
        <mesh>
          <torusGeometry args={[3.6, 0.07, 24, 96]} />
          <meshStandardMaterial
            color="#E8C86A"
            metalness={0.92}
            roughness={0.2}
            emissive="#B8860B"
            emissiveIntensity={0.25}
          />
        </mesh>

        {/* Delicate golden accent beads along the ring */}
        {rayMarkers.map((m, i) => (
          <mesh key={`marker-${i}`} position={[m.x, m.y, 0]} rotation={[0, 0, m.angle]}>
            <cylinderGeometry args={[0.04, 0.04, 0.3, 12]} />
            <meshStandardMaterial
              color="#FFF2B2"
              metalness={0.95}
              roughness={0.15}
              emissive="#FFD700"
              emissiveIntensity={0.4}
            />
          </mesh>
        ))}
      </group>

      {/* Inner Celestial Gyroscope Ring */}
      <group ref={innerRingRef}>
        <mesh>
          <torusGeometry args={[2.5, 0.05, 20, 80]} />
          <meshStandardMaterial
            color="#FFDF73"
            metalness={0.94}
            roughness={0.18}
            emissive="#D4AF37"
            emissiveIntensity={0.3}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.3, 0.04, 16, 72]} />
          <meshStandardMaterial
            color="#FFF4CE"
            metalness={0.9}
            roughness={0.2}
            emissive="#B8860B"
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>

      {/* Centerpiece: Sacred Luminous Prism (Icosahedron Crystal) */}
      <mesh ref={centralPrismRef}>
        <icosahedronGeometry args={[0.9, 0]} />
        <meshStandardMaterial
          color="#FFF8E0"
          metalness={0.85}
          roughness={0.12}
          emissive="#F59E0B"
          emissiveIntensity={0.55}
          wireframe={false}
        />
      </mesh>

      {/* Outer wireframe glow cage */}
      <mesh>
        <octahedronGeometry args={[1.3, 1]} />
        <meshBasicMaterial
          color="#FFE58F"
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Point Light positioned at relic core */}
      <pointLight color="#FFE394" intensity={2.4} distance={9} decay={2} />
    </group>
  );
}

// ==========================================
// 2. 3D GOLDEN FIREFLIES & EMBERS (PARTICLES)
// ==========================================
function CosmicSacredEmbers({ count = 900 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const texture = useMemo(() => createParticleTexture(), []);

  const [positions, speeds, phases] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count * 3);
    const phs = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Cylindrical / spherical atmospheric spread around camera
      const radius = 2.0 + Math.random() * 16.0;
      const theta = Math.random() * Math.PI * 2;
      const zSpread = (Math.random() - 0.5) * 22;

      pos[i * 3 + 0] = Math.cos(theta) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = zSpread;

      // Velocities: drifting gently upwards and spiraling
      spd[i * 3 + 0] = (Math.random() - 0.5) * 0.08;
      spd[i * 3 + 1] = 0.08 + Math.random() * 0.18; // upward float
      spd[i * 3 + 2] = (Math.random() - 0.5) * 0.06;

      phs[i] = Math.random() * Math.PI * 2;
    }
    return [pos, spd, phs];
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const geom = pointsRef.current.geometry;
    const posAttr = geom.getAttribute('position') as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      // Upward motion with delicate sinusoidal breeze
      array[idx + 1] += speeds[idx + 1] * delta * 2.8;
      array[idx + 0] += Math.sin(time * 0.6 + phases[i]) * 0.012;
      array[idx + 2] += Math.cos(time * 0.5 + phases[i]) * 0.008;

      // Reset when floating out of bounds
      if (array[idx + 1] > 8.0) {
        array[idx + 1] = -8.0;
        array[idx + 0] = (Math.random() - 0.5) * 18;
      }
    }
    posAttr.needsUpdate = true;

    // Gentle global rotation of ember cloud
    pointsRef.current.rotation.y = time * 0.02;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.24}
        map={texture}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        color="#FDE68A"
        opacity={0.88}
      />
    </points>
  );
}

// ==========================================
// 3. DYNAMIC MOUSE-FOLLOWING LIGHT RIG
// ==========================================
function InteractiveLightRig({ mousePos }: { mousePos: React.MutableRefObject<[number, number]> }) {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(() => {
    if (lightRef.current) {
      // Lerp light position to track mouse coordinate in 3D world space
      const targetX = mousePos.current[0] * 8;
      const targetY = mousePos.current[1] * 6;
      lightRef.current.position.x += (targetX - lightRef.current.position.x) * 0.08;
      lightRef.current.position.y += (targetY - lightRef.current.position.y) * 0.08;
    }
  });

  return (
    <>
      <ambientLight color="#163728" intensity={1.2} />
      {/* Dynamic Golden Spotlight following cursor */}
      <pointLight ref={lightRef} position={[0, 0, 5]} color="#FFDF73" intensity={3.2} distance={22} decay={2} />
      {/* Background Emerald Rim Light */}
      <directionalLight position={[-8, 6, -6]} color="#2D6A4F" intensity={1.8} />
      {/* Warm Golden Key Light from above */}
      <directionalLight position={[6, 8, 4]} color="#FDE047" intensity={2.0} />
    </>
  );
}

// ==========================================
// 4. MAIN EXPORTABLE CINEMATIC HERO 3D CANVAS
// ==========================================
export const CinematicHero3D: React.FC = () => {
  const mousePos = useRef<[number, number]>([0, 0]);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    // Check WebGL availability safely
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }

    const handlePointerMove = (e: MouseEvent) => {
      // Normalize mouse to [-1, 1] range
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -((e.clientY / window.innerHeight) * 2 - 1);
      mousePos.current = [nx, ny];
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const t = e.touches[0];
        const nx = (t.clientX / window.innerWidth) * 2 - 1;
        const ny = -((t.clientY / window.innerHeight) * 2 - 1);
        mousePos.current = [nx * 0.7, ny * 0.7];
      }
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  if (!hasWebGL) {
    // Graceful CSS fallback if WebGL is disabled
    return (
      <div className="absolute inset-0 bg-gradient-to-b from-[#07190F] via-[#0D2818] to-[#1B4332] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-25 parchment-pattern" />
        <div className="absolute w-[600px] h-[600px] rounded-full bg-foundation-gold/20 blur-[140px] top-1/4 left-1/2 -translate-x-1/2" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Atmospheric Background Under-Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#05140C]/95 via-[#0A2215]/85 to-[#07190F] z-0" />

      {/* Cinematic Golden Radial Godray Backlight */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] md:w-[980px] h-[720px] md:h-[980px] rounded-full pointer-events-none opacity-40 z-0"
        style={{
          background: 'radial-gradient(circle, rgba(212,175,55,0.32) 0%, rgba(45,106,79,0.18) 45%, transparent 70%)',
          filter: 'blur(70px)',
        }}
      />

      {/* Rotating Sunbeam Rays (Ultra subtle optical elegance) */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] pointer-events-none opacity-15 animate-ray-rotate z-0"
        style={{
          background: 'conic-gradient(from 0deg, rgba(212,175,55,0.2) 0deg, transparent 25deg, rgba(212,175,55,0.15) 60deg, transparent 95deg, rgba(212,175,55,0.25) 150deg, transparent 190deg, rgba(212,175,55,0.18) 260deg, transparent 310deg, rgba(212,175,55,0.2) 360deg)',
          filter: 'blur(35px)',
        }}
      />

      {/* 3D WebGL Canvas */}
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 48, near: 0.1, far: 50 }}
        dpr={[1, 1.8]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: true,
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.12;
        }}
        className="w-full h-full"
      >
        <InteractiveLightRig mousePos={mousePos} />
        <SacredSanctuaryRelic mousePos={mousePos} />
        <CosmicSacredEmbers count={750} />
      </Canvas>

      {/* Bottom Vignette & Seamless Transition Mask to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-foundation-ivory via-foundation-forestDark/40 to-transparent pointer-events-none z-10" />
    </div>
  );
};
