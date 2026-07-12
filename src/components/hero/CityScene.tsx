'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Html, Float, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { LEAD_STREAMS, LIFETIME_MIDPOINT } from '@/lib/mock/streams';
import type { LeadStream } from '@/lib/types';

const isCoarse =
  typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches;

const fmt = (n: number) =>
  `$${Math.round(n).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;

function Row({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="flex justify-between py-0.5">
      <span className="text-white/50">{label}</span>
      <span style={{ color: accent ?? '#fff' }}>{value}</span>
    </div>
  );
}

function LeadBuilding({
  stream,
  position,
}: {
  stream: LeadStream;
  position: [number, number, number];
}) {
  const mesh = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  const h = stream.height * 2.2;

  useFrame((_, dt) => {
    // Smoothly lift + brighten on hover.
    const mat = mesh.current.material as THREE.MeshStandardMaterial;
    const target = hovered ? 1.6 : 0.35;
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
        <boxGeometry args={[1, h, 1]} />
        <meshStandardMaterial
          color="#0e1524"
          emissive={new THREE.Color(stream.color)}
          emissiveIntensity={0.35}
          metalness={0.6}
          roughness={0.25}
          transparent
          opacity={0.92}
        />
      </mesh>

      {hovered && (
        <Html center position={[0, h + 0.9, 0]} distanceFactor={10} zIndexRange={[40, 0]}>
          <div className="w-52 rounded-xl border border-white/15 bg-slate-900/80 p-3 text-xs text-white shadow-xl backdrop-blur-xl">
            <div className="mb-1 font-semibold" style={{ color: stream.color }}>
              {stream.label}
            </div>
            <Row label="Monthly leads" value={String(stream.monthlyLeads)} />
            <Row
              label="Missed (pre-AI)"
              value={`${Math.round(stream.monthlyLeads * stream.missedPct)}/mo`}
              accent="#ff6b6b"
            />
            <Row label="Captured by AI" value="~100%" accent="#4ade80" />
            <Row
              label="Recovered LTV/yr"
              value={fmt(stream.monthlyLeads * stream.missedPct * 12 * (LIFETIME_MIDPOINT * 0.06))}
              accent="#c8a26a"
            />
          </div>
        </Html>
      )}
    </group>
  );
}

const LANES: [number, number][] = [
  [-4.5, -2],
  [-1.5, 1.5],
  [1.5, -1],
  [4.5, 2],
];

/** Photons flowing from buildings into the AI core = the "wave of leads". */
function LeadWave() {
  const group = useRef<THREE.Group>(null!);
  const seeds = useMemo(
    () =>
      Array.from({ length: 42 }, () => ({
        lane: Math.floor(Math.random() * 4),
        t: Math.random(),
        speed: 0.25 + Math.random() * 0.35,
      })),
    [],
  );

  useFrame((_, dt) => {
    group.current.children.forEach((c, i) => {
      const s = seeds[i];
      s.t = (s.t + dt * s.speed) % 1;
      const [sx, sz] = LANES[s.lane];
      c.position.set(
        THREE.MathUtils.lerp(sx, 0, s.t),
        0.4 + Math.sin(s.t * Math.PI) * 1.4,
        THREE.MathUtils.lerp(sz, 0, s.t),
      );
      (c as THREE.Mesh).scale.setScalar(0.06 + (1 - Math.abs(0.5 - s.t) * 2) * 0.05);
    });
  });

  return (
    <group ref={group}>
      {seeds.map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color="#6ee7ff" toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

/** Central "Agentic AI" core. */
function AgentCore() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((s) => {
    ref.current.rotation.y = s.clock.elapsedTime * 0.4;
    ref.current.rotation.x = Math.sin(s.clock.elapsedTime * 0.3) * 0.2;
  });
  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh ref={ref} position={[0, 1.6, 0]}>
        <icosahedronGeometry args={[0.9, 1]} />
        <meshStandardMaterial
          color="#6ee7ff"
          emissive="#6ee7ff"
          emissiveIntensity={1.4}
          metalness={0.9}
          roughness={0.15}
          wireframe
        />
      </mesh>
    </Float>
  );
}

/** Slow auto-orbit on touch devices where hover doesn't exist. */
function Rig() {
  useFrame((s) => {
    if (!isCoarse) return;
    s.camera.position.x = Math.sin(s.clock.elapsedTime * 0.15) * 9;
    s.camera.position.z = Math.cos(s.clock.elapsedTime * 0.15) * 9;
    s.camera.lookAt(0, 1.2, 0);
  });
  return null;
}

export default function CityScene() {
  const positions: [number, number, number][] = [
    [-4.5, 0, -2],
    [-1.5, 0, 1.5],
    [1.5, 0, -1],
    [4.5, 0, 2],
  ];

  return (
    <Canvas
      shadows
      dpr={[1, isCoarse ? 1.5 : 2]}
      camera={{ position: [0, 4, 9], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
    >
      <color attach="background" args={['#060912']} />
      <fog attach="fog" args={['#060912', 10, 22]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={1.4} castShadow />
      <pointLight position={[0, 3, 0]} intensity={2} color="#6ee7ff" distance={8} />

      <Rig />
      <AgentCore />
      <LeadWave />
      {LEAD_STREAMS.map((s, i) => (
        <LeadBuilding key={s.id} stream={s} position={positions[i]} />
      ))}

      <ContactShadows position={[0, 0, 0]} opacity={0.5} scale={20} blur={2.4} far={6} />
      {!isCoarse && (
        <EffectComposer>
          <Bloom intensity={0.9} luminanceThreshold={0.25} mipmapBlur />
        </EffectComposer>
      )}
    </Canvas>
  );
}
