import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronDown, Mouse, Sparkles, Compass } from 'lucide-react';

interface CinematicIntro3DProps {
  onComplete: () => void;
}

// Math smoothstep helper for organic, natural transitions
function smoothstep(min: number, max: number, value: number): number {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

// ==========================================
// 1. REALISTIC VYENKATESH ASHRAM 3D MODEL
// Perfectly centered around x = 0:
// - Main wing centered on approach road
// - Symmetrical grand veranda columns and entrance steps
// - Wooden entrance double doors centered at x = 0
// - Balcony railings and hipped terracotta roof centered at x = 0
// - Signboard: "व्यंकटेश आश्रम / VYENKATESH ASHRAM" centered at x = 0
// - Authentic left perpendicular L-wing extending behind
// ==========================================
function AshramBuilding({
  doorsOpenProgress,
  ashramSignTexture
}: {
  doorsOpenProgress: number;
  ashramSignTexture: THREE.Texture | null;
}) {
  const doorAngle = doorsOpenProgress * (Math.PI / 2.2);

  return (
    <group position={[0, 0, -42]}>
      {/* Stone Foundation Plinth & Veranda Platform (Centered at x = 0) */}
      <mesh position={[0, 0.45, 0]} receiveShadow>
        <boxGeometry args={[30, 0.9, 20]} />
        <meshStandardMaterial color="#A39382" roughness={0.9} />
      </mesh>

      {/* Symmetrical Veranda Steps leading from road directly to entrance (Centered at x = 0) */}
      <mesh position={[0, 0.18, 9.2]} receiveShadow>
        <boxGeometry args={[7.2, 0.36, 2.2]} />
        <meshStandardMaterial color="#BDB2A6" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.38, 8.4]} receiveShadow>
        <boxGeometry args={[6.0, 0.36, 1.8]} />
        <meshStandardMaterial color="#BDB2A6" roughness={0.85} />
      </mesh>

      {/* Main Building Facade (Ground Floor - Centered at x = 0) */}
      <mesh position={[0, 3.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[26, 4.8, 14]} />
        <meshStandardMaterial color="#F7F1E5" roughness={0.8} />
      </mesh>

      {/* Left Perpendicular L-Wing (Extending naturally to the side as in reference photo) */}
      <mesh position={[-11, 3.3, 3.5]} castShadow receiveShadow>
        <boxGeometry args={[8, 4.8, 11]} />
        <meshStandardMaterial color="#F7F1E5" roughness={0.8} />
      </mesh>

      {/* Corner Sandstone Quoins (Masonry accent blocks) */}
      {[-13.1, 13.1].map((x, xi) => (
        <group key={`quoin-${xi}`} position={[x, 3.3, 7.0]}>
          {[0, 1.2, 2.4, 3.6].map((y, yi) => (
            <mesh key={`q-${yi}`} position={[0, y - 1.8, 0]}>
              <boxGeometry args={[0.55, 0.55, 0.55]} />
              <meshStandardMaterial color="#D7C4B7" roughness={0.85} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Ground Floor Shaded Veranda Roof / Balcony Floor (Centered at x = 0) */}
      <mesh position={[0, 5.8, 4.2]} castShadow receiveShadow>
        <boxGeometry args={[27.5, 0.45, 8.5]} />
        <meshStandardMaterial color="#BC9E82" roughness={0.7} />
      </mesh>

      {/* Symmetrical Veranda Columns (Pillars composed symmetrically about x = 0) */}
      {[-10, -6, -2.4, 2.4, 6, 10].map((x, i) => (
        <group key={`ashram-pillar-${i}`} position={[x, 3.0, 8.0]}>
          {/* Main Pillar Shaft */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.65, 4.9, 0.65]} />
            <meshStandardMaterial color="#E0D2C3" roughness={0.7} />
          </mesh>
          {/* Base Plinth */}
          <mesh position={[0, -2.3, 0]}>
            <boxGeometry args={[0.9, 0.45, 0.9]} />
            <meshStandardMaterial color="#8A7A6A" />
          </mesh>
          {/* Capital Header */}
          <mesh position={[0, 2.3, 0]}>
            <boxGeometry args={[0.9, 0.35, 0.9]} />
            <meshStandardMaterial color="#8A7A6A" />
          </mesh>
        </group>
      ))}

      {/* Main Ashram Entrance Double Door (Precisely Centered at x = 0) */}
      <group position={[0, 2.8, 7.02]}>
        {/* Frame Outer */}
        <mesh>
          <boxGeometry args={[3.2, 4.4, 0.15]} />
          <meshStandardMaterial color="#3D2B1F" roughness={0.7} />
        </mesh>
        {/* Recessed Interior Glow */}
        <mesh position={[0, 0, -0.1]}>
          <boxGeometry args={[2.8, 4.0, 0.1]} />
          <meshStandardMaterial color="#2B1D12" />
        </mesh>

        {/* Left Door Leaf (Hinged on left at x = -1.35) */}
        <group position={[-1.35, 0, 0]} rotation={[0, -doorAngle, 0]}>
          <mesh position={[0.67, 0, 0]} castShadow>
            <boxGeometry args={[1.35, 4.0, 0.08]} />
            <meshStandardMaterial color="#5C381E" roughness={0.5} />
          </mesh>
          {/* Brass Door Handle */}
          <mesh position={[1.15, 0, 0.06]}>
            <cylinderGeometry args={[0.03, 0.03, 0.35, 8]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.85} roughness={0.2} />
          </mesh>
        </group>

        {/* Right Door Leaf (Hinged on right at x = +1.35) */}
        <group position={[1.35, 0, 0]} rotation={[0, doorAngle, 0]}>
          <mesh position={[-0.67, 0, 0]} castShadow>
            <boxGeometry args={[1.35, 4.0, 0.08]} />
            <meshStandardMaterial color="#5C381E" roughness={0.5} />
          </mesh>
          {/* Brass Door Handle */}
          <mesh position={[-1.15, 0, 0.06]}>
            <cylinderGeometry args={[0.03, 0.03, 0.35, 8]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.85} roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* Symmetrical Windows on Ground Floor (Positioned symmetrically at x = ±6.0 and ±10.5) */}
      {[-10.5, -6.0, 6.0, 10.5].map((wx, wi) => (
        <group key={`ashram-gf-win-${wi}`} position={[wx, 3.2, 7.02]}>
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

      {/* First Floor Structure (Centered at x = 0) */}
      <mesh position={[0, 8.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[24, 4.6, 12]} />
        <meshStandardMaterial color="#FBF7EF" roughness={0.8} />
      </mesh>

      {/* Left Wing First Floor */}
      <mesh position={[-11, 8.5, 3.5]} castShadow receiveShadow>
        <boxGeometry args={[8, 4.6, 10]} />
        <meshStandardMaterial color="#FBF7EF" roughness={0.8} />
      </mesh>

      {/* Symmetrical Balcony Railings (Centered at x = 0) */}
      <group position={[0, 6.8, 8.1]}>
        {/* Top rail */}
        <mesh position={[0, 0.45, 0]}>
          <boxGeometry args={[25, 0.08, 0.08]} />
          <meshStandardMaterial color="#555" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Bottom rail */}
        <mesh position={[0, -0.45, 0]}>
          <boxGeometry args={[25, 0.08, 0.08]} />
          <meshStandardMaterial color="#555" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Vertical Balusters */}
        {Array.from({ length: 26 }).map((_, bi) => (
          <mesh key={`bal-${bi}`} position={[-12.0 + bi * 0.96, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.9, 6]} />
            <meshStandardMaterial color="#666" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}
      </group>

      {/* Symmetrical First Floor Windows (Centered around x = 0) */}
      {[-8.5, -3.5, 3.5, 8.5].map((wx, wi) => (
        <group key={`ashram-ff-win-${wi}`} position={[wx, 8.6, 6.02]}>
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

      {/* Terracotta Pitched Roof (Centered at x = 0) */}
      <group position={[0, 11.9, 0]}>
        <mesh castShadow receiveShadow>
          <coneGeometry args={[17.5, 3.8, 4]} />
          <meshStandardMaterial color="#B84435" roughness={0.65} />
        </mesh>
        <mesh position={[0, 1.9, 0]}>
          <boxGeometry args={[10, 0.25, 0.6]} />
          <meshStandardMaterial color="#8F3025" />
        </mesh>
      </group>

      {/* Left Wing Roof */}
      <group position={[-11, 11.8, 3.5]}>
        <mesh castShadow receiveShadow>
          <coneGeometry args={[7.5, 3.4, 4]} />
          <meshStandardMaterial color="#B84435" roughness={0.65} />
        </mesh>
      </group>

      {/* Ashram Official Facade Signboard (Centered directly at x = 0) */}
      <group position={[0, 11.0, 6.2]}>
        {/* Board base */}
        <mesh castShadow>
          <boxGeometry args={[11.5, 1.4, 0.2]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
        </mesh>
        {/* Signboard Graphic Plane */}
        {ashramSignTexture && (
          <mesh position={[0, 0, 0.11]}>
            <planeGeometry args={[11.2, 1.3]} />
            <meshBasicMaterial map={ashramSignTexture} />
          </mesh>
        )}
        {/* Gold Border Trim */}
        <mesh position={[0, 0, 0.12]}>
          <boxGeometry args={[11.4, 1.35, 0.02]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}

// ==========================================
// 2. SSBM FOUNDATION ENTRANCE GATE & WALL
// Perfectly symmetrical around x = 0:
// - Left pillar at x = -4.8, Right pillar at x = +4.8
// - Overhead arch sign centered at x = 0
// - Left gate leaf hinged at x = -4.15, swings outward smoothly
// - Right gate leaf hinged at x = +4.15, swings outward smoothly
// ==========================================
function FoundationEntranceGate({
  openProgress,
  logoTexture,
  gateSignTexture
}: {
  openProgress: number;
  logoTexture: THREE.Texture | null;
  gateSignTexture: THREE.Texture | null;
}) {
  const gateAngle = openProgress * (Math.PI / 2.15);

  return (
    <group position={[0, 0, 0]}>
      {/* Symmetrical Left Boundary Wall */}
      <mesh position={[-16, 1.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[22.4, 3.6, 0.6]} />
        <meshStandardMaterial color="#E2DDD5" roughness={0.85} />
      </mesh>
      <mesh position={[-16, 3.65, 0]}>
        <boxGeometry args={[22.8, 0.2, 0.8]} />
        <meshStandardMaterial color="#B09E8C" roughness={0.7} />
      </mesh>

      {/* Symmetrical Right Boundary Wall */}
      <mesh position={[16, 1.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[22.4, 3.6, 0.6]} />
        <meshStandardMaterial color="#E2DDD5" roughness={0.85} />
      </mesh>
      <mesh position={[16, 3.65, 0]}>
        <boxGeometry args={[22.8, 0.2, 0.8]} />
        <meshStandardMaterial color="#B09E8C" roughness={0.7} />
      </mesh>

      {/* Left Main Gate Pillar (At x = -4.8) */}
      <group position={[-4.8, 0, 0]}>
        <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.3, 5.0, 1.3]} />
          <meshStandardMaterial color="#6B6258" roughness={0.8} />
        </mesh>
        <mesh position={[0, 5.15, 0]} castShadow>
          <boxGeometry args={[1.6, 0.35, 1.6]} />
          <meshStandardMaterial color="#4A443D" roughness={0.6} />
        </mesh>
        <mesh position={[0, 5.8, 0]}>
          <cylinderGeometry args={[0.2, 0.28, 0.7, 8]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>

      {/* Right Main Gate Pillar (At x = +4.8) */}
      <group position={[4.8, 0, 0]}>
        <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.3, 5.0, 1.3]} />
          <meshStandardMaterial color="#6B6258" roughness={0.8} />
        </mesh>
        <mesh position={[0, 5.15, 0]} castShadow>
          <boxGeometry args={[1.6, 0.35, 1.6]} />
          <meshStandardMaterial color="#4A443D" roughness={0.6} />
        </mesh>
        <mesh position={[0, 5.8, 0]}>
          <cylinderGeometry args={[0.2, 0.28, 0.7, 8]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>

      {/* Elegant Overhead Arch Sign (Centered directly at x = 0) */}
      <group position={[0, 5.6, 0]}>
        {/* Arch Beam spanning exactly between pillars */}
        <mesh castShadow>
          <boxGeometry args={[10.6, 0.9, 0.45]} />
          <meshStandardMaterial color="#1B4332" roughness={0.4} />
        </mesh>
        {/* Gold Border Trim */}
        <mesh position={[0, 0, 0.24]}>
          <boxGeometry args={[10.4, 0.75, 0.05]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.85} roughness={0.25} />
        </mesh>
        {/* Signboard Graphic Surface */}
        {gateSignTexture && (
          <mesh position={[0, 0, 0.28]}>
            <planeGeometry args={[10.1, 0.65]} />
            <meshBasicMaterial map={gateSignTexture} />
          </mesh>
        )}

        {/* Central Official Logo Medallion (Centered at x = 0) */}
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

      {/* Left Gate Leaf (Hinged at x = -4.15, swings outward) */}
      <group position={[-4.15, 0, 0]} rotation={[0, -gateAngle, 0]}>
        <group position={[2.0, 2.1, 0]}>
          <mesh castShadow>
            <boxGeometry args={[4.0, 4.2, 0.08]} />
            <meshStandardMaterial color="#1F2421" metalness={0.8} roughness={0.3} />
          </mesh>
          {[-1.6, -1.1, -0.6, -0.1, 0.4, 0.9, 1.4].map((bx, bi) => (
            <mesh key={`left-grille-${bi}`} position={[bx, 0, 0.04]} castShadow>
              <cylinderGeometry args={[0.035, 0.035, 4.0, 8]} />
              <meshStandardMaterial color="#D4AF37" metalness={0.85} roughness={0.25} />
            </mesh>
          ))}
          <mesh position={[0, 0, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.55, 0.55, 0.08, 16]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* Right Gate Leaf (Hinged at x = +4.15, swings outward) */}
      <group position={[4.15, 0, 0]} rotation={[0, gateAngle, 0]}>
        <group position={[-2.0, 2.1, 0]}>
          <mesh castShadow>
            <boxGeometry args={[4.0, 4.2, 0.08]} />
            <meshStandardMaterial color="#1F2421" metalness={0.8} roughness={0.3} />
          </mesh>
          {[-1.4, -0.9, -0.4, 0.1, 0.6, 1.1, 1.6].map((bx, bi) => (
            <mesh key={`right-grille-${bi}`} position={[bx, 0, 0.04]} castShadow>
              <cylinderGeometry args={[0.035, 0.035, 4.0, 8]} />
              <meshStandardMaterial color="#D4AF37" metalness={0.85} roughness={0.25} />
            </mesh>
          ))}
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
// Perfectly aligned with the central approach road (x = 0):
// - Roadway width: 7.8m centered at x = 0
// - Roadside stone curbs symmetrical at x = ±4.0m
// - Solar garden streetlamps along curbs
// - Flanking orchard trees (mango & neem) at x = ±8.8m
// - Flowerbed shrubs at x = ±4.6m
// ==========================================
function RoadAndSurroundings({ roadTexture }: { roadTexture: THREE.Texture | null }) {
  return (
    <group>
      {/* Ground plane / lawn */}
      <mesh position={[0, -0.02, -15]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[140, 120]} />
        <meshStandardMaterial color="#355834" roughness={0.95} />
      </mesh>

      {/* Continuous Paved Approach Road (Extending from z = 22 to ashram steps at z = -38) */}
      <mesh position={[0, 0.015, -8]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[7.8, 62]} />
        <meshStandardMaterial
          map={roadTexture || undefined}
          color="#C0B4A2"
          roughness={0.85}
        />
      </mesh>

      {/* Symmetrical Roadside Stone Curbs */}
      <mesh position={[-4.0, 0.1, -8]} receiveShadow>
        <boxGeometry args={[0.3, 0.2, 62]} />
        <meshStandardMaterial color="#7A6F64" roughness={0.85} />
      </mesh>
      <mesh position={[4.0, 0.1, -8]} receiveShadow>
        <boxGeometry args={[0.3, 0.2, 62]} />
        <meshStandardMaterial color="#7A6F64" roughness={0.85} />
      </mesh>

      {/* Symmetrical Pathway Solar Street Lanterns along curbs */}
      {[-2, -10, -18, -26, -34].map((lz, li) => (
        <React.Fragment key={`solar-lamp-${li}`}>
          {[-4.35, 4.35].map((lx, lxi) => (
            <group key={`lamp-${li}-${lxi}`} position={[lx, 0, lz]}>
              {/* Slender Black Pole */}
              <mesh position={[0, 1.6, 0]} castShadow>
                <cylinderGeometry args={[0.05, 0.07, 3.2, 8]} />
                <meshStandardMaterial color="#2B2D2F" metalness={0.7} roughness={0.3} />
              </mesh>
              {/* Warm Glowing Lantern Top */}
              <mesh position={[0, 3.25, 0]}>
                <cylinderGeometry args={[0.16, 0.13, 0.32, 6]} />
                <meshStandardMaterial color="#FFF4D0" emissive="#FFE599" emissiveIntensity={0.6} />
              </mesh>
              {/* Solar Panel Cap */}
              <mesh position={[0, 3.42, 0]}>
                <boxGeometry args={[0.35, 0.03, 0.35]} />
                <meshStandardMaterial color="#1A2A3A" metalness={0.8} roughness={0.2} />
              </mesh>
            </group>
          ))}
        </React.Fragment>
      ))}

      {/* Symmetrical Orchard Trees (Anjikar Bagh mango & neem grove) */}
      {[
        [-8.8, 0, 8], [-9.2, 0, -4], [-8.8, 0, -15], [-9.2, 0, -26], [-8.8, 0, -35],
        [8.8, 0, 8], [9.2, 0, -4], [8.8, 0, -15], [9.2, 0, -26], [8.8, 0, -35]
      ].map(([tx, ty, tz], i) => (
        <group key={`orchard-tree-${i}`} position={[tx, ty, tz]}>
          <mesh position={[0, 2.5, 0]} castShadow>
            <cylinderGeometry args={[0.4, 0.6, 5, 8]} />
            <meshStandardMaterial color="#4A3423" roughness={0.9} />
          </mesh>
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

      {/* Symmetrical Flowering Marigold Shrubs along curbs */}
      {[-2, -10, -18, -26, -34].map((fz, fi) => (
        <React.Fragment key={`fl-border-${fi}`}>
          <mesh position={[-4.6, 0.28, fz]}>
            <sphereGeometry args={[0.42, 8, 8]} />
            <meshStandardMaterial color="#F39C12" roughness={0.7} />
          </mesh>
          <mesh position={[4.6, 0.28, fz]}>
            <sphereGeometry args={[0.42, 8, 8]} />
            <meshStandardMaterial color="#E67E22" roughness={0.7} />
          </mesh>
        </React.Fragment>
      ))}
    </group>
  );
}

// ==========================================
// 4. SYNCHRONIZED SCROLL CAMERA CONTROLLER
// - Controls camera along strict central axis (x = 0)
// - Continuous, smooth interpolation without sudden jumps
// - Scroll down = Advance forward toward ashram
// - Scroll up = Reverse backward through the journey
// ==========================================
function ScrollControlledCamera({
  scrollProgressRef,
  onProgressUpdate
}: {
  scrollProgressRef: React.MutableRefObject<number>;
  onProgressUpdate: (progress: number, gateProg: number, doorProg: number) => void;
}) {
  const currentPos = useRef<number>(0);

  useFrame(({ camera }) => {
    // Smooth lerp to target scroll position (damping for natural fluidity)
    currentPos.current = THREE.MathUtils.lerp(currentPos.current, scrollProgressRef.current, 0.08);
    const p = Math.max(0, Math.min(1, currentPos.current));

    // Calculate gate and ashram door states smoothly from progress p:
    // Gate opens between 0.04 and 0.28
    const gateProg = smoothstep(0.04, 0.28, p);

    // Ashram doors open between 0.70 and 0.92
    const doorProg = smoothstep(0.70, 0.92, p);

    // Camera movement along strict central axis (x = 0):
    // p = 0.0 -> Outside gate at z = 16.0
    // p = 0.30 -> Crossing open gate at z = 0.0
    // p = 0.70 -> Paved approach at z = -16.0
    // p = 1.0 -> Welcoming entrance framing the facade at z = -26.5
    const zCurve = p < 0.30
      ? (p / 0.30) * 0.30
      : 0.30 + Math.pow((p - 0.30) / 0.70, 0.92) * 0.70;
    const camZ = 16.0 - zCurve * 42.5;

    // Natural eye-level height with subtle walking stride bounce
    const stepBounce = Math.sin(p * Math.PI * 18) * (p > 0.04 && p < 0.94 ? 0.022 : 0.0);
    const camY = 1.80 + p * 0.20 + stepBounce;

    // Camera position strictly centered on x = 0
    camera.position.set(0, camY, camZ);

    // Camera focal lookAt point:
    // Always looks straight ahead down the central axis (x = 0) at the ashram entrance (z = -42)
    const targetY = 2.5 + p * 0.7;
    camera.lookAt(0, targetY, -42);

    onProgressUpdate(p, gateProg, doorProg);
  });

  return null;
}

// ==========================================
// 5. MAIN COMPONENT EXPORT
// ==========================================
export const CinematicIntro3D: React.FC<CinematicIntro3DProps> = ({ onComplete }) => {
  const targetProgress = useRef<number>(0);
  const [displayProgress, setDisplayProgress] = useState<number>(0);
  const [gateOpenProgress, setGateOpenProgress] = useState<number>(0);
  const [ashramDoorProgress, setAshramDoorProgress] = useState<number>(0);
  const [hasWebGLError, setHasWebGLError] = useState(false);
  const [logoTexture, setLogoTexture] = useState<THREE.Texture | null>(null);

  // High-Resolution Crisp Signboard & Paver Canvas Textures
  const gateSignTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 160;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.fillStyle = '#0D2818';
    ctx.fillRect(0, 0, 1024, 160);

    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 8;
    ctx.strokeRect(6, 6, 1012, 148);

    ctx.lineWidth = 2;
    ctx.strokeRect(14, 14, 996, 132);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillStyle = '#D4AF37';
    ctx.font = 'bold 22px system-ui, sans-serif';
    ctx.fillText('श्री संत बापूजी मौदाकर सामाजिक संस्था, नागपूर', 512, 40);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 50px serif, system-ui';
    ctx.fillText('SSBM SOCIAL FOUNDATION', 512, 88);

    ctx.fillStyle = '#F3D27C';
    ctx.font = '600 20px system-ui, sans-serif';
    ctx.fillText('ANJIKAR BAGH, MAHULI • ESTD. 2012', 512, 130);

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 8;
    return texture;
  }, []);

  const ashramSignTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.fillStyle = '#FFFDF7';
    ctx.fillRect(0, 0, 1200, 200);

    ctx.strokeStyle = '#C99726';
    ctx.lineWidth = 10;
    ctx.strokeRect(8, 8, 1184, 184);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillStyle = '#6E4E18';
    ctx.font = 'bold 26px system-ui, sans-serif';
    ctx.fillText('सच्चिदानंद स्वामी बापूजी मौदाकर सामाजिक संस्था द्वारा संचालित', 600, 44);

    ctx.fillStyle = '#8B2500';
    ctx.font = 'bold 54px serif, system-ui';
    ctx.fillText('व्यंकटेश आश्रम  •  VYENKATESH ASHRAM', 600, 106);

    ctx.fillStyle = '#1B4332';
    ctx.font = 'italic bold 24px system-ui, sans-serif';
    ctx.fillText('A Place of Care, Dignity and Belonging • Anjikar Bagh, Mahuli', 600, 160);

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 8;
    return texture;
  }, []);

  const roadTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.fillStyle = '#B4A898';
    ctx.fillRect(0, 0, 512, 512);

    ctx.strokeStyle = '#998C7C';
    ctx.lineWidth = 2;
    const blockW = 64;
    const blockH = 32;
    for (let y = 0; y < 512; y += blockH) {
      const offset = (Math.floor(y / blockH) % 2) * (blockW / 2);
      for (let x = -blockW; x < 512 + blockW; x += blockW) {
        ctx.strokeRect(x + offset, y, blockW, blockH);
      }
    }

    // Yellow Dashed Central Axis Guideline
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 6;
    ctx.setLineDash([24, 20]);
    ctx.beginPath();
    ctx.moveTo(256, 0);
    ctx.lineTo(256, 512);
    ctx.stroke();

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 20);
    texture.anisotropy = 8;
    return texture;
  }, []);

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

  // Mouse Scroll Wheel Event Listener
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    let delta = e.deltaY;
    if (e.deltaMode === 1) delta *= 33;
    else if (e.deltaMode === 2) delta *= 100;

    // Positive deltaY = scroll down = advance forward; Negative = scroll up = reverse
    const step = delta * 0.00065;
    targetProgress.current = Math.max(0, Math.min(1, targetProgress.current + step));
  }, []);

  // Touch Swipe Gesture Listener for Mobile
  const touchStartY = useRef<number>(0);
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length > 0) {
      touchStartY.current = e.touches[0].clientY;
    }
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length > 0) {
      if (e.cancelable) e.preventDefault();
      const currentY = e.touches[0].clientY;
      const delta = touchStartY.current - currentY;
      touchStartY.current = currentY;
      const step = delta * 0.0022;
      targetProgress.current = Math.max(0, Math.min(1, targetProgress.current + step));
    }
  }, []);

  // Keyboard navigation for accessibility
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault();
      targetProgress.current = Math.min(1, targetProgress.current + 0.06);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      targetProgress.current = Math.max(0, targetProgress.current - 0.06);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleWheel, handleTouchStart, handleTouchMove, handleKeyDown]);

  const handleProgressUpdate = (p: number, gateProg: number, doorProg: number) => {
    setDisplayProgress(p);
    setGateOpenProgress(gateProg);
    setAshramDoorProgress(doorProg);
  };

  const handleSkip = () => {
    localStorage.setItem('ssbm_intro_viewed', 'true');
    onComplete();
  };

  const handleEnterWebsite = () => {
    localStorage.setItem('ssbm_intro_viewed', 'true');
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#162118] overflow-hidden flex flex-col justify-between select-none">
      {hasWebGLError ? (
        // Non-WebGL Fallback View
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
          {/* Top Header: Foundation Identity & Controls */}
          <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 md:p-6 bg-gradient-to-b from-black/80 via-black/35 to-transparent">
            <div className="flex items-center space-x-3">
              <img
                src="/assets/images/logo.jpg"
                alt="SSBM Foundation Logo"
                className="w-11 h-11 rounded-full border-2 border-foundation-gold shadow"
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

            {/* Top Right: Skip to Website */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleSkip}
                className="group px-4 py-2 md:px-5 md:py-2.5 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/20 font-semibold text-xs md:text-sm backdrop-blur-md shadow-lg transition-all flex items-center space-x-2"
                id="skip-3d-intro-btn"
              >
                <span>Skip to Website</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Three.js 3D WebGL Canvas */}
          <div className="absolute inset-0 z-0">
            <Canvas
              shadows
              camera={{ position: [0, 1.80, 16.0], fov: 50, near: 0.1, far: 180 }}
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
              <FoundationEntranceGate
                openProgress={gateOpenProgress}
                logoTexture={logoTexture}
                gateSignTexture={gateSignTexture}
              />
              <RoadAndSurroundings roadTexture={roadTexture} />
              <AshramBuilding
                doorsOpenProgress={ashramDoorProgress}
                ashramSignTexture={ashramSignTexture}
              />

              {/* Synchronized Scroll Camera Controller */}
              <ScrollControlledCamera
                scrollProgressRef={targetProgress}
                onProgressUpdate={handleProgressUpdate}
              />
            </Canvas>
          </div>

          {/* Bottom Interactive Guidance & Narrative Cards */}
          <div className="absolute bottom-6 left-0 right-0 z-20 px-4 md:px-8 max-w-xl mx-auto text-center pointer-events-none">
            {/* Journey Progress Bar */}
            <div className="w-full bg-black/40 backdrop-blur-md border border-white/15 h-2 rounded-full mb-3 overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-foundation-gold to-yellow-400 rounded-full transition-all duration-75"
                style={{ width: `${Math.round(displayProgress * 100)}%` }}
              />
            </div>

            <AnimatePresence mode="wait">
              {/* Phase 1: Outside Entrance Gate (0% to 25%) */}
              {displayProgress < 0.25 && (
                <motion.div
                  key="phase-gate"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-black/75 backdrop-blur-md border border-white/20 rounded-2xl p-4 md:p-5 shadow-2xl text-white pointer-events-auto space-y-2"
                >
                  <div className="flex items-center justify-center space-x-2 text-foundation-gold text-xs font-bold uppercase tracking-widest">
                    <Mouse className="w-4 h-4 animate-bounce" />
                    <span>Scroll Down / Swipe Up to Enter</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-display font-bold text-foundation-sandstone">
                    SSBM SOCIAL FOUNDATION
                  </h3>
                  <p className="text-[11px] md:text-xs text-stone-300">
                    Anjikar Bagh, Mansar Mahuli Road • Mahuli, Parseoni (Nagpur)
                  </p>
                </motion.div>
              )}

              {/* Phase 2: Along the Road (25% to 75%) */}
              {displayProgress >= 0.25 && displayProgress < 0.75 && (
                <motion.div
                  key="phase-road"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-black/70 backdrop-blur-md border border-white/15 rounded-xl px-5 py-3 shadow-xl text-white inline-block pointer-events-auto"
                >
                  <p className="text-xs md:text-sm font-semibold text-foundation-sandstone flex items-center justify-center space-x-2">
                    <span>Approaching Vyenkatesh Ashram through Anjikar Bagh avenue...</span>
                  </p>
                  <p className="text-[10px] text-stone-300 mt-0.5">
                    Scroll down to advance • Scroll up to reverse
                  </p>
                </motion.div>
              )}

              {/* Phase 3: Ashram Welcoming Arrival (75% to 100%) */}
              {displayProgress >= 0.75 && (
                <motion.div
                  key="phase-welcome"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-foundation-forestDark/90 backdrop-blur-md border border-foundation-gold/40 rounded-2xl p-5 md:p-6 shadow-2xl text-white pointer-events-auto space-y-2"
                >
                  <span className="text-[10px] uppercase font-bold tracking-widest text-foundation-gold bg-foundation-gold/20 px-3 py-1 rounded-full inline-block">
                    Sanctuary of Dignified Elder Care
                  </span>
                  <h3 className="text-xl md:text-2xl font-display font-bold text-foundation-sandstone">
                    Welcome to Vyenkatesh Ashram
                  </h3>
                  <p className="text-xs md:text-sm text-foundation-goldLight font-medium">
                    “A Place of Care, Dignity and Belonging.”
                  </p>
                  <div className="pt-2 flex items-center justify-center space-x-3">
                    <button
                      onClick={handleEnterWebsite}
                      className="px-6 py-2.5 bg-foundation-gold hover:bg-yellow-500 text-foundation-forestDark font-bold text-xs rounded-full shadow-lg transition-all inline-flex items-center space-x-2"
                    >
                      <span>Enter Website</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
};
