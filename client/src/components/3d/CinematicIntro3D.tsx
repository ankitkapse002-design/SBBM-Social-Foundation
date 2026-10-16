import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Volume2, VolumeX, Eye, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface CinematicIntro3DProps {
  onComplete: () => void;
}

// 3D Scene Components
function AshramBuilding() {
  return (
    <group position={[0, 0, -45]}>
      {/* Foundation plinth */}
      <mesh position={[0, 0.4, 0]} receiveShadow>
        <boxGeometry args={[30, 0.8, 18]} />
        <meshStandardMaterial color="#8B7D6B" roughness={0.9} />
      </mesh>

      {/* Ground Floor Main Structure */}
      <mesh position={[0, 3.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[26, 4.8, 14]} />
        <meshStandardMaterial color="#F5EFE6" roughness={0.8} />
      </mesh>

      {/* Ground floor shaded veranda roof / balcony floor */}
      <mesh position={[0, 5.8, 2.5]} castShadow receiveShadow>
        <boxGeometry args={[28, 0.5, 9]} />
        <meshStandardMaterial color="#A47551" roughness={0.7} />
      </mesh>

      {/* Ground Floor Veranda Columns (Pillars) */}
      {[-12, -8, -4, 0, 4, 8, 12].map((x, i) => (
        <group key={`col-${i}`} position={[x, 2.8, 6.5]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.32, 0.38, 4.8, 16]} />
            <meshStandardMaterial color="#D7C4B7" roughness={0.6} />
          </mesh>
          {/* Base */}
          <mesh position={[0, -2.2, 0]}>
            <boxGeometry args={[0.9, 0.4, 0.9]} />
            <meshStandardMaterial color="#9C8979" />
          </mesh>
          {/* Capital */}
          <mesh position={[0, 2.2, 0]}>
            <boxGeometry args={[0.9, 0.3, 0.9]} />
            <meshStandardMaterial color="#9C8979" />
          </mesh>
        </group>
      ))}

      {/* Main Entrance Double Door */}
      <mesh position={[0, 2.5, 7.05]}>
        <boxGeometry args={[3.2, 4.2, 0.15]} />
        <meshStandardMaterial color="#4A2E18" roughness={0.5} />
      </mesh>

      {/* Ground Floor Windows with warm interior light */}
      {[-8, -4, 4, 8].map((x, i) => (
        <group key={`win-gf-${i}`} position={[x, 2.8, 7.05]}>
          <mesh>
            <boxGeometry args={[2.0, 2.2, 0.1]} />
            <meshStandardMaterial color="#2B3A42" roughness={0.3} />
          </mesh>
          <pointLight color="#FFE4B5" intensity={0.8} distance={3} position={[0, 0, 0.2]} />
        </group>
      ))}

      {/* First Floor Structure */}
      <mesh position={[0, 8.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[22, 4.6, 12]} />
        <meshStandardMaterial color="#FAF5EE" roughness={0.8} />
      </mesh>

      {/* First Floor Balcony Railing */}
      <mesh position={[0, 6.7, 6.8]}>
        <boxGeometry args={[24, 1.2, 0.1]} />
        <meshStandardMaterial color="#3D3A37" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* First Floor Windows */}
      {[-7, -2.5, 2.5, 7].map((x, i) => (
        <group key={`win-ff-${i}`} position={[x, 8.5, 6.05]}>
          <mesh>
            <boxGeometry args={[1.8, 2.2, 0.1]} />
            <meshStandardMaterial color="#2B3A42" roughness={0.3} />
          </mesh>
          <pointLight color="#FFE4B5" intensity={0.6} distance={2.5} position={[0, 0, 0.2]} />
        </group>
      ))}

      {/* Terracotta Pitched Sloping Roof */}
      <group position={[0, 11.8, 0]}>
        <mesh castShadow receiveShadow rotation={[0, 0, 0]}>
          <coneGeometry args={[17, 3.4, 4]} />
          <meshStandardMaterial color="#BC4749" roughness={0.7} />
        </mesh>
      </group>

      {/* Ashram Grand Signboard */}
      <group position={[0, 10.8, 6.1]}>
        <mesh castShadow>
          <boxGeometry args={[10, 1.4, 0.2]} />
          <meshStandardMaterial color="#1B4332" roughness={0.3} />
        </mesh>
        {/* Gold Border */}
        <mesh position={[0, 0, 0.11]}>
          <boxGeometry args={[9.8, 1.2, 0.05]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}

// Double Entrance Gate with Outward Swinging Leaves
function EntranceGate({ openProgress }: { openProgress: number }) {
  // openProgress ranges from 0 (closed) to 1 (fully open at 85 degrees)
  const openAngle = openProgress * (Math.PI / 2.2);

  return (
    <group position={[0, 0, 0]}>
      {/* Left Stone Pillar */}
      <group position={[-5.5, 0, 0]}>
        <mesh position={[0, 3, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.6, 6, 1.6]} />
          <meshStandardMaterial color="#5C554E" roughness={0.85} />
        </mesh>
        {/* Pillar Cap */}
        <mesh position={[0, 6.2, 0]} castShadow>
          <boxGeometry args={[2.0, 0.4, 2.0]} />
          <meshStandardMaterial color="#8B7D6B" roughness={0.7} />
        </mesh>
        {/* Warm Lantern */}
        <group position={[0, 7.2, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.3, 0.4, 0.9, 8]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.7} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.25, 12, 12]} />
            <meshBasicMaterial color="#FFD580" />
          </mesh>
          <pointLight color="#FFA500" intensity={1.5} distance={7} />
        </group>
        {/* Foundation Plaque Left */}
        <mesh position={[0.85, 3.2, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[1.0, 1.8, 0.08]} />
          <meshStandardMaterial color="#FDFBF7" roughness={0.4} />
        </mesh>
      </group>

      {/* Right Stone Pillar */}
      <group position={[5.5, 0, 0]}>
        <mesh position={[0, 3, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.6, 6, 1.6]} />
          <meshStandardMaterial color="#5C554E" roughness={0.85} />
        </mesh>
        {/* Pillar Cap */}
        <mesh position={[0, 6.2, 0]} castShadow>
          <boxGeometry args={[2.0, 0.4, 2.0]} />
          <meshStandardMaterial color="#8B7D6B" roughness={0.7} />
        </mesh>
        {/* Warm Lantern */}
        <group position={[0, 7.2, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.3, 0.4, 0.9, 8]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.7} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.25, 12, 12]} />
            <meshBasicMaterial color="#FFD580" />
          </mesh>
          <pointLight color="#FFA500" intensity={1.5} distance={7} />
        </group>
        {/* Foundation Plaque Right */}
        <mesh position={[-0.85, 3.2, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <boxGeometry args={[1.0, 1.8, 0.08]} />
          <meshStandardMaterial color="#FDFBF7" roughness={0.4} />
        </mesh>
      </group>

      {/* Left Gate Wing (Swings outward) */}
      <group position={[-4.7, 0, 0]} rotation={[0, -openAngle, 0]}>
        <group position={[2.2, 2.4, 0]}>
          {/* Gate Outer Frame */}
          <mesh castShadow>
            <boxGeometry args={[4.4, 4.6, 0.1]} />
            <meshStandardMaterial color="#1F2421" metalness={0.8} roughness={0.3} wireframe={false} />
          </mesh>
          {/* Vertical Bars and Traditional Arch */}
          {[-1.8, -1.2, -0.6, 0, 0.6, 1.2, 1.8].map((bx, bi) => (
            <mesh key={`lbar-${bi}`} position={[bx, 0, 0]} castShadow>
              <cylinderGeometry args={[0.04, 0.04, 4.4, 8]} />
              <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
            </mesh>
          ))}
          {/* Central Medallion */}
          <mesh position={[0, 0, 0.08]}>
            <cylinderGeometry args={[0.7, 0.7, 0.1, 24]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* Right Gate Wing (Swings outward) */}
      <group position={[4.7, 0, 0]} rotation={[0, openAngle, 0]}>
        <group position={[-2.2, 2.4, 0]}>
          {/* Gate Outer Frame */}
          <mesh castShadow>
            <boxGeometry args={[4.4, 4.6, 0.1]} />
            <meshStandardMaterial color="#1F2421" metalness={0.8} roughness={0.3} wireframe={false} />
          </mesh>
          {/* Vertical Bars and Traditional Arch */}
          {[-1.8, -1.2, -0.6, 0, 0.6, 1.2, 1.8].map((bx, bi) => (
            <mesh key={`rbar-${bi}`} position={[bx, 0, 0]} castShadow>
              <cylinderGeometry args={[0.04, 0.04, 4.4, 8]} />
              <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
            </mesh>
          ))}
          {/* Central Medallion */}
          <mesh position={[0, 0, 0.08]}>
            <cylinderGeometry args={[0.7, 0.7, 0.1, 24]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

// Surrounding Pathway, Trees, and Garden Elements
function PathwayAndLandscape() {
  return (
    <group>
      {/* Stone paved path leading from gate (z=15) into ashram (z=-45) */}
      <mesh position={[0, 0.02, -15]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[7.5, 65]} />
        <meshStandardMaterial color="#C5B5A1" roughness={0.9} />
      </mesh>

      {/* Cobblestone pathway borders */}
      <mesh position={[-3.9, 0.1, -15]} receiveShadow>
        <boxGeometry args={[0.4, 0.2, 65]} />
        <meshStandardMaterial color="#8B7D6B" roughness={0.8} />
      </mesh>
      <mesh position={[3.9, 0.1, -15]} receiveShadow>
        <boxGeometry args={[0.4, 0.2, 65]} />
        <meshStandardMaterial color="#8B7D6B" roughness={0.8} />
      </mesh>

      {/* Lush Green Lawn & Ground */}
      <mesh position={[0, -0.05, -15]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[120, 100]} />
        <meshStandardMaterial color="#3A5A40" roughness={0.95} />
      </mesh>

      {/* Orchard Trees flanking the pathway (Anjikar Bagh mango & neem grove) */}
      {[
        [-9, 0, 8], [-11, 0, -5], [-10, 0, -18], [-12, 0, -32],
        [9, 0, 8], [11, 0, -5], [10, 0, -18], [12, 0, -32]
      ].map(([x, y, z], i) => (
        <group key={`tree-${i}`} position={[x, y, z]}>
          {/* Trunk */}
          <mesh position={[0, 2.5, 0]} castShadow>
            <cylinderGeometry args={[0.45, 0.65, 5, 10]} />
            <meshStandardMaterial color="#4A3525" roughness={0.9} />
          </mesh>
          {/* Lush Green Canopy */}
          <mesh position={[0, 6.2, 0]} castShadow>
            <sphereGeometry args={[3.2, 14, 14]} />
            <meshStandardMaterial color={i % 2 === 0 ? "#2D6A4F" : "#1B4332"} roughness={0.85} />
          </mesh>
          <mesh position={[0.5, 7.5, 0.2]} castShadow>
            <sphereGeometry args={[2.2, 10, 10]} />
            <meshStandardMaterial color="#40916C" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Marigold and Flowering Flowerbeds alongside path */}
      {[-8, -16, -24, -32].map((z, i) => (
        <React.Fragment key={`flower-${i}`}>
          <mesh position={[-4.8, 0.25, z]}>
            <sphereGeometry args={[0.45, 8, 8]} />
            <meshStandardMaterial color="#F39C12" roughness={0.6} />
          </mesh>
          <mesh position={[4.8, 0.25, z]}>
            <sphereGeometry args={[0.45, 8, 8]} />
            <meshStandardMaterial color="#E67E22" roughness={0.6} />
          </mesh>
        </React.Fragment>
      ))}
    </group>
  );
}

// Atmospheric Mist and Clouds
function AtmosphericMist({ density }: { density: number }) {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 200;

  const [positions] = useState(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 1] = Math.random() * 8 + 0.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 60 - 10;
    }
    return pos;
  });

  useFrame((_, delta) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={3.5}
        color="#FDFBF7"
        transparent
        opacity={0.35 * density}
        depthWrite={false}
      />
    </points>
  );
}

// Camera Motion Controller coordinating the 5 Cinematic Scenes
function CameraSequenceController({
  onSceneUpdate,
  onComplete
}: {
  onSceneUpdate: (sceneIndex: number, progressPercent: number) => void;
  onComplete: () => void;
}) {
  const startTimeRef = useRef<number | null>(null);
  const DURATION = 9.5; // Target 9.5 seconds total sequence

  useFrame((state) => {
    if (startTimeRef.current === null) {
      startTimeRef.current = state.clock.getElapsedTime();
    }

    const elapsed = state.clock.getElapsedTime() - startTimeRef.current;
    const t = Math.min(elapsed / DURATION, 1.0);

    // 5 Stages
    let sceneIdx = 1;
    if (t < 0.25) sceneIdx = 1; // Scene 1: Mist & Atmospheric Reveal
    else if (t < 0.45) sceneIdx = 2; // Scene 2: Double Gate Opening
    else if (t < 0.70) sceneIdx = 3; // Scene 3: Pathway Glide
    else if (t < 0.92) sceneIdx = 4; // Scene 4: Ashram Architecture Reveal
    else sceneIdx = 5; // Scene 5: Entering & Transition

    onSceneUpdate(sceneIdx, Math.round(t * 100));

    // Dynamic Camera Keyframing
    if (t < 0.25) {
      // Scene 1: Outside gate in mist, looking at closed gates
      const subT = t / 0.25;
      state.camera.position.set(0, 3.2 - subT * 0.4, 18 - subT * 3);
      state.camera.lookAt(0, 3.0, 0);
    } else if (t < 0.45) {
      // Scene 2: Approaching gate as it swings open
      const subT = (t - 0.25) / 0.2;
      state.camera.position.set(0, 2.8, 15 - subT * 10);
      state.camera.lookAt(0, 3.0, -10);
    } else if (t < 0.70) {
      // Scene 3: Gliding through the open gateway into Anjikar Bagh path
      const subT = (t - 0.45) / 0.25;
      state.camera.position.set(Math.sin(subT * Math.PI) * 0.8, 2.7, 5 - subT * 22);
      state.camera.lookAt(0, 3.2, -45);
    } else {
      // Scene 4 & 5: Approaching building, tilting up gently to reveal facade and roof
      const subT = (t - 0.70) / 0.30;
      state.camera.position.set(0, 2.7 + subT * 1.5, -17 - subT * 14);
      state.camera.lookAt(0, 4.5 + subT * 2.0, -45);
    }

    if (t >= 1.0) {
      onComplete();
    }
  });

  return null;
}

export const CinematicIntro3D: React.FC<CinematicIntro3DProps> = ({ onComplete }) => {
  const [currentScene, setCurrentScene] = useState<number>(1);
  const [progress, setProgress] = useState<number>(0);
  const [gateOpen, setGateOpen] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [hasWebGLError, setHasWebGLError] = useState<boolean>(false);

  // Scene labels
  const sceneLabels = [
    'Atmospheric Dawn Reveal',
    'Grand Gates Opening',
    'Pathway through Anjikar Bagh',
    'Vyenkatesh Ashram Reveal',
    'Entering the World of Care'
  ];

  const handleSceneUpdate = (sceneIdx: number, pct: number) => {
    setCurrentScene(sceneIdx);
    setProgress(pct);

    // Gate opening calculation (opens during scene 2: 25% - 48%)
    if (pct < 25) {
      setGateOpen(0);
    } else if (pct >= 25 && pct <= 50) {
      setGateOpen((pct - 25) / 25);
    } else {
      setGateOpen(1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('ssbm_intro_viewed', 'true');
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0D2818] overflow-hidden flex flex-col justify-between select-none">
      {/* Fallback View if WebGL fails */}
      {hasWebGLError ? (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center text-white bg-gradient-to-b from-[#0D2818] to-[#1B4332]">
          <img
            src="/assets/images/logo.jpg"
            alt="SSBM Foundation Logo"
            className="w-28 h-28 rounded-full border-4 border-[#D4AF37] shadow-2xl mb-6"
          />
          <h1 className="text-3xl md:text-5xl font-display font-bold text-foundation-sandstone mb-3">
            VYENKATESH ASHRAM
          </h1>
          <p className="text-lg md:text-xl text-foundation-sageLight max-w-xl mb-6">
            A Place of Care, Dignity and Belonging. Operated by SBBM Social Foundation Society at Anjikar Bagh, Mahuli.
          </p>
          <button
            onClick={handleSkip}
            className="px-8 py-3.5 bg-foundation-gold hover:bg-yellow-500 text-foundation-forestDark font-bold rounded-full shadow-lg transition-all flex items-center space-x-2"
          >
            <span>Enter Website Directly</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <>
          {/* Top Control Bar */}
          <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 md:p-6 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
            {/* Branding Header */}
            <div className="flex items-center space-x-3">
              <img
                src="/assets/images/logo.jpg"
                alt="SSBM Foundation"
                className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-foundation-gold/60 shadow-md"
              />
              <div>
                <p className="text-xs tracking-widest uppercase text-foundation-gold font-medium">
                  SBBM Social Foundation
                </p>
                <h2 className="text-sm md:text-base font-display font-bold text-foundation-ivory">
                  Vyenkatesh Ashram
                </h2>
              </div>
            </div>

            {/* Actions: Skip Intro & Audio */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all border border-white/15"
                title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                aria-label="Toggle Sound"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <button
                onClick={handleSkip}
                className="group px-4 py-2 md:px-5 md:py-2.5 rounded-full bg-foundation-gold hover:bg-yellow-500 text-foundation-forestDark font-semibold text-xs md:text-sm shadow-xl transition-all flex items-center space-x-2"
                id="skip-3d-intro-btn"
              >
                <span>Skip Intro</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Three.js 3D WebGL Canvas */}
          <div className="absolute inset-0 z-0">
            <Canvas
              shadows
              camera={{ position: [0, 3.2, 18], fov: 50, near: 0.1, far: 200 }}
              onCreated={({ gl }) => {
                gl.toneMapping = THREE.ACESFilmicToneMapping;
                gl.toneMappingExposure = 1.1;
              }}
              onError={() => setHasWebGLError(true)}
            >
              {/* Sky and Morning Sunrise Lighting */}
              <color attach="background" args={['#F9E8D2']} />
              <fog attach="fog" args={['#EEDBC5', 15, 95]} />

              <ambientLight intensity={0.65} color="#FFF4E6" />
              <directionalLight
                castShadow
                position={[25, 30, 20]}
                intensity={1.4}
                color="#FFE3BA"
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
                shadow-camera-far={120}
                shadow-camera-left={-25}
                shadow-camera-right={25}
                shadow-camera-top={25}
                shadow-camera-bottom={-25}
              />

              {/* Soft sky light fill */}
              <hemisphereLight args={['#FFF0D4', '#2D6A4F', 0.5]} />

              {/* 3D Scene Geometry */}
              <PathwayAndLandscape />
              <EntranceGate openProgress={gateOpen} />
              <AshramBuilding />
              <AtmosphericMist density={currentScene === 1 ? 1.0 : Math.max(0, 1.0 - (progress - 20) / 40)} />

              {/* Sequence Driver */}
              <CameraSequenceController
                onSceneUpdate={handleSceneUpdate}
                onComplete={() => {
                  localStorage.setItem('ssbm_intro_viewed', 'true');
                  onComplete();
                }}
              />
            </Canvas>
          </div>

          {/* Cinematic Overlay Cards / Captions */}
          <div className="absolute bottom-8 left-0 right-0 z-20 px-4 md:px-8 max-w-4xl mx-auto pointer-events-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentScene}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.6 }}
                className="bg-foundation-forestDark/80 backdrop-blur-md border border-foundation-gold/30 rounded-2xl p-4 md:p-6 text-center shadow-2xl text-foundation-ivory pointer-events-auto"
              >
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-foundation-gold/20 text-foundation-goldLight text-xs font-semibold mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-foundation-gold" />
                  <span>Scene {currentScene} of 5 • {sceneLabels[currentScene - 1]}</span>
                </div>

                <h3 className="text-lg md:text-2xl font-display font-bold text-foundation-sandstone">
                  {currentScene === 1 && "Entering the Peaceful World of SBBM Foundation"}
                  {currentScene === 2 && "The Grand Double Gates Open into Anjikar Bagh"}
                  {currentScene === 3 && "Winding Path Flanked by Verdant Trees & Gardens"}
                  {currentScene === 4 && "Vyenkatesh Ashram: A Sanctuary of Peace & Care"}
                  {currentScene === 5 && "Welcome to a Place of Care, Dignity & Belonging"}
                </h3>

                <p className="text-xs md:text-sm text-foundation-ivory/80 mt-1 max-w-2xl mx-auto">
                  {currentScene === 1 && "Mahuli, Parseoni • Where compassionate service meets quiet dignity."}
                  {currentScene === 2 && "Charitable, non-granted old-age home established to nurture elder souls."}
                  {currentScene === 3 && "Lush greenery, clean air, Go-Seva Kendra and natural therapy."}
                  {currentScene === 4 && "Authentic architectural home designed with comfortable rooms, verandas and companionship."}
                  {currentScene === 5 && "Connecting you with verified services, admission information and community seva."}
                </p>

                {/* Progress bar */}
                <div className="w-full bg-white/20 h-1.5 rounded-full mt-4 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-foundation-gold to-yellow-300 transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
};
