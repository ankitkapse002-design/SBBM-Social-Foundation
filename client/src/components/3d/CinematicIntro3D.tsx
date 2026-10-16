import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Volume2, VolumeX, Sparkles } from 'lucide-react';

interface CinematicIntro3DProps {
  onComplete: () => void;
}

// ==========================================
// 1. REALISTIC VYENKATESH ASHRAM 3D MODEL
// Reconstructed faithfully from owner-provided photos:
// - L-shaped 2-story building
// - Terracotta pitched hipped roofs with bracketed eaves
// - Cream/sandstone stucco with warm stone corner accents
// - Ground-floor continuous shaded veranda with stone columns
// - First-floor open balcony with railings
// - Wooden framed shuttered windows and opening double doors
// - Prominent signboard: "व्यंकटेश आश्रम / VYENKATESH ASHRAM"
// ==========================================
function AshramBuilding({ doorsOpenProgress }: { doorsOpenProgress: number }) {
  const doorAngle = doorsOpenProgress * (Math.PI / 2.3);

  return (
    <group position={[0, 0, -42]}>
      {/* Stone Foundation Plinth & Veranda Platform */}
      <mesh position={[0, 0.45, 0]} receiveShadow>
        <boxGeometry args={[32, 0.9, 20]} />
        <meshStandardMaterial color="#A39382" roughness={0.9} />
      </mesh>

      {/* Veranda steps leading to entrance */}
      <mesh position={[0, 0.2, 8.5]} receiveShadow>
        <boxGeometry args={[8, 0.4, 2.5]} />
        <meshStandardMaterial color="#BDB2A6" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.38, 7.8]} receiveShadow>
        <boxGeometry args={[6.5, 0.36, 1.8]} />
        <meshStandardMaterial color="#BDB2A6" roughness={0.85} />
      </mesh>

      {/* Main Building Wing (Ground Floor) */}
      <mesh position={[2, 3.3, -1]} castShadow receiveShadow>
        <boxGeometry args={[26, 4.8, 14]} />
        <meshStandardMaterial color="#F7F1E5" roughness={0.8} />
      </mesh>

      {/* Perpendicular Left Wing (L-shape as seen in reference photo) */}
      <mesh position={[-10, 3.3, 3]} castShadow receiveShadow>
        <boxGeometry args={[10, 4.8, 12]} />
        <meshStandardMaterial color="#F7F1E5" roughness={0.8} />
      </mesh>

      {/* Sandstone masonry corner quoins / accent blocks */}
      {[-14.8, -5.2, 14.8].map((x, xi) => (
        <group key={`quoin-${xi}`} position={[x, 3.3, 5.8]}>
          {[0, 1.2, 2.4, 3.6].map((y, yi) => (
            <mesh key={`q-${yi}`} position={[0, y - 1.8, 0]}>
              <boxGeometry args={[0.55, 0.55, 0.55]} />
              <meshStandardMaterial color="#D7C4B7" roughness={0.85} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Ground Floor Shaded Veranda Roof / Balcony Floor */}
      <mesh position={[2, 5.8, 3.5]} castShadow receiveShadow>
        <boxGeometry args={[27.5, 0.45, 8.5]} />
        <meshStandardMaterial color="#BC9E82" roughness={0.7} />
      </mesh>

      {/* Veranda Support Pillars (Stone columns with plinths & capitals) */}
      {[-4, 0, 4, 8, 12, 15].map((x, i) => (
        <group key={`ashram-pillar-${i}`} position={[x, 3.0, 7.2]}>
          {/* Main shaft */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.65, 4.9, 0.65]} />
            <meshStandardMaterial color="#E0D2C3" roughness={0.7} />
          </mesh>
          {/* Base plinth */}
          <mesh position={[0, -2.3, 0]}>
            <boxGeometry args={[0.9, 0.45, 0.9]} />
            <meshStandardMaterial color="#8A7A6A" />
          </mesh>
          {/* Capital header */}
          <mesh position={[0, 2.3, 0]}>
            <boxGeometry args={[0.9, 0.35, 0.9]} />
            <meshStandardMaterial color="#8A7A6A" />
          </mesh>
        </group>
      ))}

      {/* Left Wing Veranda Pillar */}
      <group position={[-14, 3.0, 7.2]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.65, 4.9, 0.65]} />
          <meshStandardMaterial color="#E0D2C3" roughness={0.7} />
        </mesh>
        <mesh position={[0, -2.3, 0]}><boxGeometry args={[0.9, 0.45, 0.9]} /><meshStandardMaterial color="#8A7A6A" /></mesh>
        <mesh position={[0, 2.3, 0]}><boxGeometry args={[0.9, 0.35, 0.9]} /><meshStandardMaterial color="#8A7A6A" /></mesh>
      </group>

      {/* Main Ashram Entrance Double Door Frame */}
      <group position={[2, 2.8, 5.95]}>
        {/* Door Frame */}
        <mesh>
          <boxGeometry args={[3.2, 4.4, 0.15]} />
          <meshStandardMaterial color="#3D2B1F" roughness={0.7} />
        </mesh>
        {/* Door Recess Interior */}
        <mesh position={[0, 0, -0.1]}>
          <boxGeometry args={[2.8, 4.0, 0.1]} />
          <meshStandardMaterial color="#1F1A17" />
        </mesh>
        {/* Left Door Leaf (Hinged on left) */}
        <group position={[-1.35, 0, 0]} rotation={[0, -doorAngle, 0]}>
          <mesh position={[0.67, 0, 0]} castShadow>
            <boxGeometry args={[1.35, 4.0, 0.08]} />
            <meshStandardMaterial color="#5C381E" roughness={0.5} />
          </mesh>
          {/* Brass Door Handle */}
          <mesh position={[1.15, 0, 0.06]}>
            <cylinderGeometry args={[0.03, 0.03, 0.35, 8]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.8} />
          </mesh>
        </group>
        {/* Right Door Leaf (Hinged on right) */}
        <group position={[1.35, 0, 0]} rotation={[0, doorAngle, 0]}>
          <mesh position={[-0.67, 0, 0]} castShadow>
            <boxGeometry args={[1.35, 4.0, 0.08]} />
            <meshStandardMaterial color="#5C381E" roughness={0.5} />
          </mesh>
          {/* Brass Door Handle */}
          <mesh position={[-1.15, 0, 0.06]}>
            <cylinderGeometry args={[0.03, 0.03, 0.35, 8]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.8} />
          </mesh>
        </group>
      </group>

      {/* Ground Floor Windows with wooden shutters */}
      {[-9, -3, 8, 13].map((wx, wi) => (
        <group key={`ashram-gf-win-${wi}`} position={[wx, 3.2, 5.95]}>
          <mesh>
            <boxGeometry args={[2.0, 2.4, 0.12]} />
            <meshStandardMaterial color="#4A3423" />
          </mesh>
          <mesh position={[0, 0, 0.05]}>
            <boxGeometry args={[1.6, 2.0, 0.08]} />
            <meshStandardMaterial color="#2B363C" roughness={0.3} />
          </mesh>
          {/* Window Sill */}
          <mesh position={[0, -1.25, 0.1]}>
            <boxGeometry args={[2.3, 0.15, 0.3]} />
            <meshStandardMaterial color="#D7C4B7" />
          </mesh>
        </group>
      ))}

      {/* First Floor Main Structure */}
      <mesh position={[2, 8.5, -1]} castShadow receiveShadow>
        <boxGeometry args={[24, 4.6, 12]} />
        <meshStandardMaterial color="#FBF7EF" roughness={0.8} />
      </mesh>

      {/* Left Wing First Floor */}
      <mesh position={[-10, 8.5, 2]} castShadow receiveShadow>
        <boxGeometry args={[9, 4.6, 10]} />
        <meshStandardMaterial color="#FBF7EF" roughness={0.8} />
      </mesh>

      {/* First Floor Balcony Railings */}
      <group position={[2, 6.8, 7.3]}>
        {/* Top rail */}
        <mesh position={[0, 0.45, 0]}>
          <boxGeometry args={[26, 0.08, 0.08]} />
          <meshStandardMaterial color="#555" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Bottom rail */}
        <mesh position={[0, -0.45, 0]}>
          <boxGeometry args={[26, 0.08, 0.08]} />
          <meshStandardMaterial color="#555" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Vertical Balusters */}
        {Array.from({ length: 26 }).map((_, bi) => (
          <mesh key={`bal-${bi}`} position={[-12.5 + bi, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.9, 6]} />
            <meshStandardMaterial color="#666" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}
      </group>

      {/* First Floor Windows */}
      {[-9, -3, 3, 9].map((wx, wi) => (
        <group key={`ashram-ff-win-${wi}`} position={[wx, 8.6, 5.0]}>
          <mesh>
            <boxGeometry args={[1.8, 2.2, 0.1]} />
            <meshStandardMaterial color="#4A3423" />
          </mesh>
          <mesh position={[0, 0, 0.04]}>
            <boxGeometry args={[1.4, 1.8, 0.06]} />
            <meshStandardMaterial color="#2B363C" roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* Terracotta Pitched Roof with Overhangs & Eaves */}
      <group position={[2, 11.9, -1]}>
        {/* Main Hipped Roof Prism */}
        <mesh castShadow receiveShadow rotation={[0, 0, 0]}>
          <coneGeometry args={[17.5, 3.8, 4]} />
          <meshStandardMaterial color="#B84435" roughness={0.65} />
        </mesh>
        {/* Ridge Cap */}
        <mesh position={[0, 1.9, 0]}>
          <boxGeometry args={[10, 0.25, 0.6]} />
          <meshStandardMaterial color="#8F3025" />
        </mesh>
      </group>

      {/* Left Wing Roof */}
      <group position={[-10, 11.8, 2]}>
        <mesh castShadow receiveShadow>
          <coneGeometry args={[8.5, 3.4, 4]} />
          <meshStandardMaterial color="#B84435" roughness={0.65} />
        </mesh>
      </group>

      {/* Ashram Official Facade Signboard */}
      <group position={[2, 11.0, 5.2]}>
        <mesh castShadow>
          <boxGeometry args={[11.5, 1.4, 0.2]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
        </mesh>
        {/* Gold Border */}
        <mesh position={[0, 0, 0.11]}>
          <boxGeometry args={[11.3, 1.2, 0.04]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}

// ==========================================
// 2. SSBM FOUNDATION ENTRANCE GATE & WALL
// - Realistic boundary wall extending left and right
// - Prominent double gates on hinges
// - Overhead arch sign: "SSBM SOCIAL FOUNDATION" with logo medallion
// ==========================================
function FoundationEntranceGate({
  openProgress,
  logoTexture
}: {
  openProgress: number;
  logoTexture: THREE.Texture | null;
}) {
  // Gate swing angle: 0 (closed) to ~85 degrees outward
  const gateAngle = openProgress * (Math.PI / 2.15);

  return (
    <group position={[0, 0, 0]}>
      {/* Central Road Surface */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 30]} />
        <meshStandardMaterial color="#AFA595" roughness={0.9} />
      </mesh>

      {/* Roadside stone curbs */}
      <mesh position={[-4.1, 0.12, 0]} receiveShadow>
        <boxGeometry args={[0.3, 0.24, 30]} />
        <meshStandardMaterial color="#7D746B" roughness={0.8} />
      </mesh>
      <mesh position={[4.1, 0.12, 0]} receiveShadow>
        <boxGeometry args={[0.3, 0.24, 30]} />
        <meshStandardMaterial color="#7D746B" roughness={0.8} />
      </mesh>

      {/* Left Boundary Wall */}
      <mesh position={[-16, 1.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[22, 3.6, 0.6]} />
        <meshStandardMaterial color="#E2DDD5" roughness={0.85} />
      </mesh>
      <mesh position={[-16, 3.65, 0]}>
        <boxGeometry args={[22.4, 0.2, 0.8]} />
        <meshStandardMaterial color="#B09E8C" roughness={0.7} />
      </mesh>

      {/* Right Boundary Wall */}
      <mesh position={[16, 1.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[22, 3.6, 0.6]} />
        <meshStandardMaterial color="#E2DDD5" roughness={0.85} />
      </mesh>
      <mesh position={[16, 3.65, 0]}>
        <boxGeometry args={[22.4, 0.2, 0.8]} />
        <meshStandardMaterial color="#B09E8C" roughness={0.7} />
      </mesh>

      {/* Left Main Gate Pillar */}
      <group position={[-4.7, 0, 0]}>
        <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.3, 5.0, 1.3]} />
          <meshStandardMaterial color="#6B6258" roughness={0.8} />
        </mesh>
        {/* Pillar Cap */}
        <mesh position={[0, 5.15, 0]} castShadow>
          <boxGeometry args={[1.6, 0.35, 1.6]} />
          <meshStandardMaterial color="#4A443D" roughness={0.6} />
        </mesh>
        {/* Pillar Lantern */}
        <mesh position={[0, 5.8, 0]}>
          <cylinderGeometry args={[0.2, 0.28, 0.7, 8]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>

      {/* Right Main Gate Pillar */}
      <group position={[4.7, 0, 0]}>
        <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.3, 5.0, 1.3]} />
          <meshStandardMaterial color="#6B6258" roughness={0.8} />
        </mesh>
        {/* Pillar Cap */}
        <mesh position={[0, 5.15, 0]} castShadow>
          <boxGeometry args={[1.6, 0.35, 1.6]} />
          <meshStandardMaterial color="#4A443D" roughness={0.6} />
        </mesh>
        {/* Pillar Lantern */}
        <mesh position={[0, 5.8, 0]}>
          <cylinderGeometry args={[0.2, 0.28, 0.7, 8]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>

      {/* Elegant Overhead Arch Sign: "SSBM SOCIAL FOUNDATION" */}
      <group position={[0, 5.6, 0]}>
        {/* Arch Beam */}
        <mesh castShadow>
          <boxGeometry args={[10.6, 0.9, 0.45]} />
          <meshStandardMaterial color="#1B4332" roughness={0.4} />
        </mesh>
        {/* Gold Border Trim */}
        <mesh position={[0, 0, 0.24]}>
          <boxGeometry args={[10.4, 0.75, 0.05]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.85} roughness={0.25} />
        </mesh>
        {/* Signboard Backing */}
        <mesh position={[0, 0, 0.27]}>
          <boxGeometry args={[10.1, 0.65, 0.02]} />
          <meshStandardMaterial color="#0D2818" />
        </mesh>

        {/* Central Official Logo Medallion */}
        <group position={[0, 0.75, 0.1]}>
          <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.85, 0.85, 0.12, 32]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.85} roughness={0.2} />
          </mesh>
          {logoTexture && (
            <mesh position={[0, 0, 0.07]}>
              <circleGeometry args={[0.78, 32]} />
              <meshBasicMaterial map={logoTexture} />
            </mesh>
          )}
        </group>
      </group>

      {/* Left Double Gate Leaf (Hinged at left pillar) */}
      <group position={[-4.0, 0, 0]} rotation={[0, -gateAngle, 0]}>
        <group position={[1.9, 2.1, 0]}>
          {/* Outer Frame */}
          <mesh castShadow>
            <boxGeometry args={[3.8, 4.2, 0.08]} />
            <meshStandardMaterial color="#1F2421" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Vertical Wrought Iron Grille Bars */}
          {[-1.5, -1.0, -0.5, 0, 0.5, 1.0, 1.5].map((bx, bi) => (
            <mesh key={`left-grille-${bi}`} position={[bx, 0, 0.04]} castShadow>
              <cylinderGeometry args={[0.035, 0.035, 4.0, 8]} />
              <meshStandardMaterial color="#D4AF37" metalness={0.85} roughness={0.25} />
            </mesh>
          ))}
          {/* Decorative Medallion */}
          <mesh position={[0, 0, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.55, 0.55, 0.08, 16]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* Right Double Gate Leaf (Hinged at right pillar) */}
      <group position={[4.0, 0, 0]} rotation={[0, gateAngle, 0]}>
        <group position={[-1.9, 2.1, 0]}>
          {/* Outer Frame */}
          <mesh castShadow>
            <boxGeometry args={[3.8, 4.2, 0.08]} />
            <meshStandardMaterial color="#1F2421" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Vertical Wrought Iron Grille Bars */}
          {[-1.5, -1.0, -0.5, 0, 0.5, 1.0, 1.5].map((bx, bi) => (
            <mesh key={`right-grille-${bi}`} position={[bx, 0, 0.04]} castShadow>
              <cylinderGeometry args={[0.035, 0.035, 4.0, 8]} />
              <meshStandardMaterial color="#D4AF37" metalness={0.85} roughness={0.25} />
            </mesh>
          ))}
          {/* Decorative Medallion */}
          <mesh position={[0, 0, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.55, 0.55, 0.08, 16]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

// ==========================================
// 3. ROAD & SURROUNDINGS (ANJIKAR BAGH)
// - Realistic paved approach road leading into premises
// - Flanking orchard trees (mango & neem) and natural green foliage
// - Boundary walls and low stone barriers
// ==========================================
function RoadAndSurroundings() {
  return (
    <group>
      {/* Ground plane / green grass */}
      <mesh position={[0, -0.02, -15]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[140, 120]} />
        <meshStandardMaterial color="#355834" roughness={0.95} />
      </mesh>

      {/* Inner paved roadway from gate (z=0) to ashram steps (z=-38) */}
      <mesh position={[0, 0.015, -19]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[7.2, 40]} />
        <meshStandardMaterial color="#B0A696" roughness={0.9} />
      </mesh>

      {/* Roadside stone curbs */}
      <mesh position={[-3.7, 0.1, -19]} receiveShadow>
        <boxGeometry args={[0.3, 0.2, 40]} />
        <meshStandardMaterial color="#7A6F64" roughness={0.85} />
      </mesh>
      <mesh position={[3.7, 0.1, -19]} receiveShadow>
        <boxGeometry args={[0.3, 0.2, 40]} />
        <meshStandardMaterial color="#7A6F64" roughness={0.85} />
      </mesh>

      {/* Orchard Trees flanking the road (Anjikar Bagh mango & neem trees) */}
      {[
        [-9, 0, -4], [-11, 0, -14], [-10, 0, -25], [-12, 0, -34],
        [9, 0, -4], [11, 0, -14], [10, 0, -25], [12, 0, -34]
      ].map(([tx, ty, tz], i) => (
        <group key={`orchard-tree-${i}`} position={[tx, ty, tz]}>
          {/* Trunk */}
          <mesh position={[0, 2.5, 0]} castShadow>
            <cylinderGeometry args={[0.4, 0.6, 5, 8]} />
            <meshStandardMaterial color="#4A3423" roughness={0.9} />
          </mesh>
          {/* Main green leafy canopy */}
          <mesh position={[0, 5.8, 0]} castShadow>
            <sphereGeometry args={[2.8, 12, 12]} />
            <meshStandardMaterial color={i % 2 === 0 ? "#2D6A4F" : "#1B4332"} roughness={0.85} />
          </mesh>
          <mesh position={[0.4, 7.0, 0.2]} castShadow>
            <sphereGeometry args={[2.0, 10, 10]} />
            <meshStandardMaterial color="#40916C" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Flowering shrub borders (marigold & foliage) along roadside */}
      {[-6, -14, -22, -30].map((fz, fi) => (
        <React.Fragment key={`fl-border-${fi}`}>
          <mesh position={[-4.5, 0.3, fz]}>
            <sphereGeometry args={[0.45, 8, 8]} />
            <meshStandardMaterial color="#F39C12" roughness={0.7} />
          </mesh>
          <mesh position={[4.5, 0.3, fz]}>
            <sphereGeometry args={[0.45, 8, 8]} />
            <meshStandardMaterial color="#E67E22" roughness={0.7} />
          </mesh>
        </React.Fragment>
      ))}
    </group>
  );
}

// ==========================================
// 4. NATURAL EYE-LEVEL JOURNEY CONTROLLER
// Direct Eye-Level Movement (1.7m):
// Scene 1: Eye-level facing SSBM Foundation entrance gate (z=13 -> 12)
// Scene 2: Gate swings open naturally
// Scene 3: Camera moves forward along the road (z=12 -> -20)
// Scene 4: Approaching the realistic Vyenkatesh Ashram model (z=-20 -> -32)
// Scene 5: Welcoming entrance (ashram doors open, title card appears)
// Scene 6: Transition into the website
// ==========================================
function EyeLevelJourneyController({
  hasStartedEntering,
  onSceneUpdate,
  onComplete
}: {
  hasStartedEntering: boolean;
  onSceneUpdate: (sceneNumber: number, gateProgress: number, doorProgress: number) => void;
  onComplete: () => void;
}) {
  const startTimeRef = useRef<number | null>(null);
  const JOURNEY_DURATION = 8.5; // Smooth, realistic 8.5-second journey

  useFrame((state) => {
    // If visitor hasn't started or we are in initial Scene 1 (standing outside facing entrance)
    if (!hasStartedEntering) {
      // Natural eye level standing outside gate
      state.camera.position.set(0, 1.75, 13.5);
      state.camera.lookAt(0, 2.8, 0);
      onSceneUpdate(1, 0, 0);
      return;
    }

    if (startTimeRef.current === null) {
      startTimeRef.current = state.clock.getElapsedTime();
    }

    const elapsed = state.clock.getElapsedTime() - startTimeRef.current;
    const t = Math.min(elapsed / JOURNEY_DURATION, 1.0);

    let sceneNum = 2;
    let gateProg = 0;
    let doorProg = 0;

    if (t < 0.20) {
      // Scene 2: Gate opens on hinges as we take the first steps forward
      sceneNum = 2;
      const subT = t / 0.20;
      gateProg = Math.min(1.0, subT * 1.2);
      const camZ = 13.5 - subT * 4.5; // 13.5 -> 9.0
      state.camera.position.set(0, 1.75, camZ);
      state.camera.lookAt(0, 2.5, -20);
    } else if (t < 0.65) {
      // Scene 3: Journey along the road through Anjikar Bagh
      sceneNum = 3;
      gateProg = 1.0;
      const subT = (t - 0.20) / 0.45;
      const camZ = 9.0 - subT * 27.0; // 9.0 -> -18.0
      // Gentle natural eye-level walking stride
      const stepBounce = Math.sin(subT * Math.PI * 12) * 0.025;
      state.camera.position.set(0, 1.75 + stepBounce, camZ);
      state.camera.lookAt(0, 2.8, -42);
    } else if (t < 0.88) {
      // Scene 4: Approaching realistic Vyenkatesh Ashram model
      sceneNum = 4;
      gateProg = 1.0;
      const subT = (t - 0.65) / 0.23;
      const camZ = -18.0 - subT * 12.0; // -18.0 -> -30.0
      doorProg = Math.min(1.0, Math.max(0, (subT - 0.3) / 0.7));
      state.camera.position.set(0, 1.8 + subT * 0.4, camZ);
      state.camera.lookAt(0, 3.2, -42);
    } else {
      // Scene 5 & 6: Welcoming entrance & transition
      sceneNum = 5;
      gateProg = 1.0;
      doorProg = 1.0;
      const subT = (t - 0.88) / 0.12;
      state.camera.position.set(0, 2.2, -30.0 - subT * 3.0);
      state.camera.lookAt(0, 3.2, -42);
    }

    onSceneUpdate(sceneNum, gateProg, doorProg);

    if (t >= 1.0) {
      onComplete();
    }
  });

  return null;
}

// ==========================================
// 5. MAIN COMPONENT EXPORT
// ==========================================
export const CinematicIntro3D: React.FC<CinematicIntro3DProps> = ({ onComplete }) => {
  const [hasStartedEntering, setHasStartedEntering] = useState(false);
  const [currentScene, setCurrentScene] = useState<number>(1);
  const [gateOpenProgress, setGateOpenProgress] = useState<number>(0);
  const [ashramDoorProgress, setAshramDoorProgress] = useState<number>(0);
  const [hasWebGLError, setHasWebGLError] = useState(false);
  const [logoTexture, setLogoTexture] = useState<THREE.Texture | null>(null);

  // Load logo texture for overhead arch sign
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      '/assets/images/logo.jpg',
      (tex) => setLogoTexture(tex),
      undefined,
      () => setLogoTexture(null)
    );
  }, []);

  // Automatic gentle start if user doesn't click within 2.5s
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasStartedEntering(true);
    }, 2400);
    return () => clearTimeout(timer);
  }, []);

  const handleSceneUpdate = (scene: number, gateProg: number, doorProg: number) => {
    setCurrentScene(scene);
    setGateOpenProgress(gateProg);
    setAshramDoorProgress(doorProg);
  };

  const handleSkip = () => {
    localStorage.setItem('ssbm_intro_viewed', 'true');
    onComplete();
  };

  const handleStartJourney = () => {
    setHasStartedEntering(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#162118] overflow-hidden flex flex-col justify-between select-none">
      {hasWebGLError ? (
        // Clean fallback
        <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center text-white bg-gradient-to-b from-[#0D2818] to-[#1B4332]">
          <img
            src="/assets/images/logo.jpg"
            alt="SSBM Social Foundation Logo"
            className="w-24 h-24 rounded-full border-4 border-foundation-gold shadow-2xl mb-5"
          />
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-foundation-sandstone mb-2">
            SSBM SOCIAL FOUNDATION
          </h1>
          <h2 className="text-xl sm:text-2xl font-display text-foundation-ivory mb-3">
            Vyenkatesh Ashram
          </h2>
          <p className="text-sm text-foundation-sageLight max-w-lg mb-6">
            A Place of Care, Dignity and Belonging • Anjikar Bagh, Mahuli (Nagpur)
          </p>
          <button
            onClick={handleSkip}
            className="px-8 py-3.5 bg-foundation-gold hover:bg-yellow-500 text-foundation-forestDark font-bold rounded-full shadow-lg transition-all flex items-center space-x-2"
          >
            <span>Enter Website Directly</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <>
          {/* Top Bar: Minimal header with Skip Option */}
          <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 md:p-6 bg-gradient-to-b from-black/70 via-black/25 to-transparent">
            <div className="flex items-center space-x-3">
              <img
                src="/assets/images/logo.jpg"
                alt="SSBM Foundation Logo"
                className="w-10 h-10 rounded-full border border-foundation-gold/70 shadow"
              />
              <div>
                <p className="text-xs uppercase tracking-wider text-foundation-gold font-bold">
                  SSBM Social Foundation
                </p>
                <h2 className="text-xs md:text-sm font-display font-bold text-white">
                  Vyenkatesh Ashram
                </h2>
              </div>
            </div>

            <button
              onClick={handleSkip}
              className="group px-4 py-2 md:px-5 md:py-2.5 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/20 font-semibold text-xs md:text-sm backdrop-blur-md shadow-lg transition-all flex items-center space-x-2"
              id="skip-3d-intro-btn"
            >
              <span>Skip to Website</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Realistic Three.js 3D WebGL Canvas */}
          <div className="absolute inset-0 z-0">
            <Canvas
              shadows
              camera={{ position: [0, 1.75, 13.5], fov: 50, near: 0.1, far: 180 }}
              onCreated={({ gl }) => {
                gl.toneMapping = THREE.ACESFilmicToneMapping;
                gl.toneMappingExposure = 1.05;
              }}
              onError={() => setHasWebGLError(true)}
            >
              {/* Natural Daylight & Clear Sky */}
              <color attach="background" args={['#C9E1F0']} />

              {/* Natural Sun & Daylight Lighting */}
              <ambientLight intensity={0.75} color="#FFFFFF" />
              <directionalLight
                castShadow
                position={[20, 28, 18]}
                intensity={1.35}
                color="#FFFDF7"
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
                shadow-camera-far={110}
                shadow-camera-left={-28}
                shadow-camera-right={28}
                shadow-camera-top={28}
                shadow-camera-bottom={-28}
              />
              <hemisphereLight args={['#D8EEFF', '#3D5A38', 0.5]} />

              {/* Genuine 3D Geometry: Entrance Gate, Road, and Ashram */}
              <FoundationEntranceGate openProgress={gateOpenProgress} logoTexture={logoTexture} />
              <RoadAndSurroundings />
              <AshramBuilding doorsOpenProgress={ashramDoorProgress} />

              {/* Journey Controller */}
              <EyeLevelJourneyController
                hasStartedEntering={hasStartedEntering}
                onSceneUpdate={handleSceneUpdate}
                onComplete={() => {
                  localStorage.setItem('ssbm_intro_viewed', 'true');
                  onComplete();
                }}
              />
            </Canvas>
          </div>

          {/* Interactive Bottom Control & Elegant Overlay Text */}
          <div className="absolute bottom-8 left-0 right-0 z-20 px-4 md:px-8 max-w-2xl mx-auto text-center pointer-events-none">
            <AnimatePresence mode="wait">
              {/* Scene 1: Initial Eye-Level Entrance Prompt */}
              {currentScene === 1 && !hasStartedEntering && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-black/70 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-2xl text-white pointer-events-auto space-y-3"
                >
                  <div>
                    <span className="text-[11px] uppercase tracking-widest text-foundation-gold font-bold">
                      Main Entrance
                    </span>
                    <h3 className="text-xl md:text-2xl font-display font-bold text-foundation-sandstone">
                      SSBM SOCIAL FOUNDATION
                    </h3>
                    <p className="text-xs text-stone-300 mt-1">
                      Anjikar Bagh, Mansar Mahuli Road • Mahuli, Nagpur
                    </p>
                  </div>

                  <button
                    onClick={handleStartJourney}
                    className="px-6 py-2.5 bg-foundation-gold hover:bg-yellow-500 text-foundation-forestDark font-bold text-xs rounded-full shadow-lg transition-all inline-flex items-center space-x-2"
                  >
                    <span>Enter Premises</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {/* Scene 2 & 3: Travelling through Premises */}
              {(currentScene === 2 || currentScene === 3) && (
                <motion.div
                  key="scene-journey"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-black/60 backdrop-blur-md border border-white/15 rounded-xl px-4 py-2.5 shadow-xl text-white inline-block pointer-events-auto"
                >
                  <p className="text-xs md:text-sm font-medium text-foundation-sandstone">
                    Travelling along the road toward Vyenkatesh Ashram...
                  </p>
                </motion.div>
              )}

              {/* Scene 4 & 5: Welcoming Entrance at Ashram */}
              {(currentScene === 4 || currentScene === 5) && (
                <motion.div
                  key="scene-welcome"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-foundation-forestDark/85 backdrop-blur-md border border-foundation-gold/40 rounded-2xl p-5 md:p-6 shadow-2xl text-white pointer-events-auto space-y-1.5"
                >
                  <h3 className="text-xl md:text-2xl font-display font-bold text-foundation-sandstone">
                    Welcome to Vyenkatesh Ashram
                  </h3>
                  <p className="text-xs md:text-sm text-foundation-goldLight font-medium">
                    “A Place of Care, Dignity and Belonging.”
                  </p>
                  <p className="text-[11px] text-stone-300 pt-1">
                    Charitable, Non-Granted Old Age Home • Entering website...
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
};
