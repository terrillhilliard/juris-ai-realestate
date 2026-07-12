'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Html, Float, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { CITY_MARKETS, type CityMarket } from '@/lib/mock/cities';

const isCoarse =
  typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches;

const fmtPrice = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` : `$${Math.round(n / 1000)}k`;

function Row({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="flex justify-between py-0.5">
      <span className="text-white/50">{label}</span>
      <span style={{ color: accent ?? '#fff' }}>{value}</span>
    </div>
  );
}

function CityBuilding({
  city,
  position,
}: {
  city: CityMarket;
  position: [number, number, number];
}) {
  const mesh = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  const h = city.height * 2.1;

  useFrame((_, dt) => {
    const mat = mesh.current.material as THREE.MeshStandardMaterial;
    const target = hovered ? 1.5 : 0.32;
    mat.emissiveIntensity += (target - mat.emissiveIntensity) * Math.min(1, dt * 8);
    const sy = hovered ? 1.06 : 1;
    mesh.current.scale.y += (sy - mesh.current.scale.y) * Math.min(1, dt * 8);
  });

  return (
    <group position={position}>
      <mesh
        ref={mesh}
        position={[0, h / 2, 0]}
        castShadow
        onPointerOver={(e) => {
          if (isCoarse) return;
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          if (isCoarse) return;
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <boxGeometry args={[0.9, h, 0.9]} />
        <meshStandardMaterial
          color="#16121a"
          emissive={new THREE.Color(city.color)}
          emissiveIntensity={0.32}
          metalness={0.6}
          roughness={0.25}
          transparent
          opacity={0.92}
        />
      </mesh>

      {hovered && (
        <Html center position={[0, h + 0.9, 0]} distanceFactor={10} zIndexRange={[40, 0]}>
          <div className="w-56 rounded-xl border border-white/15 bg-[#141016]/90 p-3 text-xs text-white shadow-xl backdrop-blur-xl">
            <div className="mb-1 font-semibold" style={{ color: city.color }}>
              📍 {city.name}
            </div>
            <Row label="Median price" value={fmtPrice(city.medianPrice)} accent="#C8A26A" />
            <Row label="Days on market" value={`~${city.daysOnMarket}`} />
            <div className="mt-1.5 border-t border-white/10 pt-1.5 text-white/55">{city.vibe}</div>
            <div className="mt-1 text-[10px] text-white/35">
              Ask Ellie about {city.name} — she answers 24/7
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

const POSITIONS: [number, number, number][] = [
  [-5, 0, -1.5],
  [-3, 0, 1.4],
  [-1, 0, -1],
  [1, 0, 1.7],
  [3, 0, -1.4],
  [5, 0, 1],
];

/** Ambient photons drifting toward the AI presence — inquiries being answered. */
function InquiryWave() {
  const group = useRef<THREE.Group>(null!);
  const seeds = useMemo(
    () =>
      Array.from({ length: 34 }, () => ({
        lane: Math.floor(Math.random() * POSITIONS.length),
        t: Math.random(),
        speed: 0.2 + Math.random() * 0.3,
      })),
    [],
  );

  useFrame((_, dt) => {
    group.current.children.forEach((c, i) => {
      const s = seeds[i];
      s.t = (s.t + dt * s.speed) % 1;
      const [sx, , sz] = POSITIONS[s.lane];
      c.position.set(
        THREE.MathUtils.lerp(sx, 0, s.t),
        0.4 + Math.sin(s.t * Math.PI) * 1.5,
        THREE.MathUtils.lerp(sz, 0, s.t),
      );
      (c as THREE.Mesh).scale.setScalar(0.05 + (1 - Math.abs(0.5 - s.t) * 2) * 0.045);
    });
  });

  return (
    <group ref={group}>
      {seeds.map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color="#FF5A6E" toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

/** Ellie's presence above the skyline. */
function AIPresence() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((s) => {
    ref.current.rotation.y = s.clock.elapsedTime * 0.35;
    ref.current.rotation.x = Math.sin(s.clock.elapsedTime * 0.3) * 0.18;
  });
  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh ref={ref} position={[0, 1.7, 0]}>
        <icosahedronGeometry args={[0.75, 1]} />
        <meshStandardMaterial
          color="#FF3B52"
          emissive="#CE011F"
          emissiveIntensity={1.5}
          metalness={0.9}
          roughness={0.15}
          wireframe
        />
      </mesh>
    </Float>
  );
}

function Rig() {
  useFrame((s) => {
    if (!isCoarse) return;
    s.camera.position.x = Math.sin(s.clock.elapsedTime * 0.15) * 9.5;
    s.camera.position.z = Math.cos(s.clock.elapsedTime * 0.15) * 9.5;
    s.camera.lookAt(0, 1.2, 0);
  });
  return null;
}

export default function CityScene() {
  return (
    <Canvas
      shadows
      dpr={[1, isCoarse ? 1.5 : 2]}
      camera={{ position: [0, 4, 9.5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
    >
      <color attach="background" args={['#0B0A0C']} />
      <fog attach="fog" args={['#0B0A0C', 10, 23]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={1.4} castShadow />
      <pointLight position={[0, 3, 0]} intensity={2.2} color="#CE011F" distance={8} />

      <Rig />
      <AIPresence />
      <InquiryWave />
      {CITY_MARKETS.map((c, i) => (
        <CityBuilding key={c.id} city={c} position={POSITIONS[i]} />
      ))}

      <ContactShadows position={[0, 0, 0]} opacity={0.5} scale={22} blur={2.4} far={6} />
      {!isCoarse && (
        <EffectComposer>
          <Bloom intensity={0.85} luminanceThreshold={0.25} mipmapBlur />
        </EffectComposer>
      )}
    </Canvas>
  );
}
