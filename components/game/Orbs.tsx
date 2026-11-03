'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { live, useGame } from './gameStore';
import { orbs, OrbData } from './orbsData';

function Orb({ o }: { o: OrbData }) {
  const group = useRef<THREE.Group>(null!);
  const ring = useRef<THREE.Mesh>(null!);
  const core = useRef<THREE.MeshStandardMaterial>(null!);
  const glow = useRef<THREE.MeshBasicMaterial>(null!);
  const st = useRef({ done: false, k: 0, x: o.pos.x, z: o.pos.z });
  const [near, setNear] = useState(false);

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const s = st.current;
    const g = group.current;
    // "reset skills": bring a collected orb back
    if ((s.done || !g.visible) && !useGame.getState().collected.includes(o.name)) {
      s.done = false;
      s.k = 0;
      s.x = o.pos.x;
      s.z = o.pos.z;
      g.visible = true;
      g.scale.setScalar(1);
      core.current.opacity = 1;
      glow.current.opacity = 0.12;
    }
    if (!g.visible) return;

    if (s.done) {
      s.k += dt * 2.8;
      if (s.k >= 1) {
        g.visible = false;
        return;
      }
      g.scale.setScalar(1 + s.k * 0.8);
      core.current.opacity = 1 - s.k;
      glow.current.opacity = 0.12 * (1 - s.k);
      return;
    }

    const time = state.clock.elapsedTime;
    const dx = live.shipPos.x - s.x;
    const dz = live.shipPos.z - s.z;
    const d = Math.hypot(dx, dz);
    if (d < 3.8) {
      // gentle magnetism makes the game forgiving
      s.x += dx * dt * 2.2;
      s.z += dz * dt * 2.2;
    }
    g.position.set(s.x, o.pos.y + Math.sin(time * 2 + o.t * 40) * 0.25, s.z);
    ring.current.rotation.x = time * 1.2;
    ring.current.rotation.y = time * 0.7;

    if (d < 1.5) {
      s.done = true;
      useGame.getState().collect(o.name, o.color);
    }

    const isNear = Math.abs(o.t - live.smooth) < 0.06;
    if (isNear !== near) setNear(isNear);
  });

  return (
    <group ref={group} position={o.pos}>
      <mesh>
        <icosahedronGeometry args={[0.55, 1]} />
        <meshStandardMaterial ref={core} color={o.color} emissive={o.color} emissiveIntensity={1.6} flatShading transparent />
      </mesh>
      <mesh ref={ring}>
        <torusGeometry args={[0.9, 0.04, 8, 32]} />
        <meshBasicMaterial color={o.color} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.95, 16, 16]} />
        <meshBasicMaterial ref={glow} color={o.color} transparent opacity={0.12} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      {near && (
        <Html center position={[0, 1.6, 0]} distanceFactor={8} zIndexRange={[5, 0]} style={{ pointerEvents: 'none' }}>
          <div
            className="whitespace-nowrap rounded-full border bg-black/55 px-3 py-1 text-sm font-semibold text-white backdrop-blur"
            style={{ borderColor: o.color }}
          >
            {o.name}
          </div>
        </Html>
      )}
    </group>
  );
}

export function Orbs() {
  return (
    <>
      {orbs.map((o) => (
        <Orb key={o.name} o={o} />
      ))}
    </>
  );
}
