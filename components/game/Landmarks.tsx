'use client';

import { ReactNode, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import { chapters } from './data';
import { landmarkTransform, mulberry32 } from './path';
import { live } from './gameStore';

const OFFSET = 17;
const at = (id: string) => chapters.find((c) => c.id === id)!.at;

const sstep = (x: number, a: number, b: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** Landmarks rise out of the sea as you approach and sink away behind you. */
function Reveal({ id, offset, children }: { id: string; offset: number; children: ReactNode }) {
  const c = at(id);
  const tr = useMemo(() => landmarkTransform(c, offset), [c, offset]);
  const g = useRef<THREE.Group>(null!);
  const [on, setOn] = useState(false);
  useFrame(() => {
    const d = c - live.smooth; // > 0 while the landmark is still ahead
    const s = Math.min(1 - sstep(d, 0.11, 0.25), 1 - sstep(-d, 0.16, 0.3));
    const visible = s > 0.02;
    if (visible !== on) setOn(visible);
    g.current.visible = visible;
    g.current.scale.setScalar(Math.max(s, 0.001));
    g.current.position.y = tr.position[1] - (1 - s) * 6;
  });
  return (
    <group ref={g} position={tr.position} rotation={[0, tr.rotationY, 0]}>
      {on && children}
    </group>
  );
}

function Label({ position, children }: { position: [number, number, number]; children: ReactNode }) {
  return (
    <Html center position={position} distanceFactor={45} zIndexRange={[5, 0]} style={{ pointerEvents: 'none' }}>
      <div className="whitespace-nowrap rounded-full border border-white/25 bg-black/55 px-4 py-1.5 text-base font-semibold text-white backdrop-blur">
        {children}
      </div>
    </Html>
  );
}

function Island({ radius = 8, color = '#2f4a3a' }: { radius?: number; color?: string }) {
  return (
    <group>
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[radius * 0.88, radius, 1.2, 9]} />
        <meshStandardMaterial color={color} flatShading />
      </mesh>
      <mesh position={[0, -2.2, 0]}>
        <cylinderGeometry args={[radius, radius * 0.45, 2.4, 9]} />
        <meshStandardMaterial color="#222a35" flatShading />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Level 1: the academy + floating graduation cap                      */
/* ------------------------------------------------------------------ */
function Academy() {
  const cap = useRef<THREE.Group>(null!);
  useFrame((s) => {
    cap.current.rotation.y = s.clock.elapsedTime * 0.6;
    cap.current.position.y = 9 + Math.sin(s.clock.elapsedTime * 1.4) * 0.5;
  });
  return (
    <group>
      <Island radius={8} color="#33503f" />
      <mesh position={[0, 1.4, 0]}>
        <boxGeometry args={[9, 2.8, 3.6]} />
        <meshStandardMaterial color="#d9c8a4" flatShading />
      </mesh>
      {[-3.4, -1.7, 0, 1.7, 3.4].map((x) => (
        <mesh key={x} position={[x, 1.6, 1.82]}>
          <boxGeometry args={[0.8, 1.0, 0.05]} />
          <meshStandardMaterial color="#ffe0a0" emissive="#ffc766" emissiveIntensity={1.4} />
        </mesh>
      ))}
      <mesh position={[0, 3.9, 0]}>
        <boxGeometry args={[2.2, 6, 2.2]} />
        <meshStandardMaterial color="#c9b794" flatShading />
      </mesh>
      <mesh position={[0, 7.8, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[2, 2.2, 4]} />
        <meshStandardMaterial color="#8a3b3b" flatShading />
      </mesh>
      <mesh position={[0, 5.6, 1.15]}>
        <circleGeometry args={[0.6, 20]} />
        <meshStandardMaterial color="#fff6d8" emissive="#ffe9a8" emissiveIntensity={1.4} />
      </mesh>
      <group ref={cap} position={[0, 9, 0]}>
        <mesh position={[0, -0.35, 0]}>
          <cylinderGeometry args={[0.9, 1.1, 0.7, 6]} />
          <meshStandardMaterial color="#14161f" flatShading />
        </mesh>
        <mesh rotation={[0, Math.PI / 4, 0]}>
          <boxGeometry args={[2.6, 0.12, 2.6]} />
          <meshStandardMaterial color="#1b1e2b" flatShading />
        </mesh>
        <mesh position={[1.1, -0.3, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.9, 5]} />
          <meshStandardMaterial color="#ffd84a" emissive="#ffd84a" emissiveIntensity={0.8} />
        </mesh>
      </group>
      <Label position={[0, 12, 0]}>🎓 DIT University · 2013</Label>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Level 2: energy grid, wind turbines, IoT nodes with data pulses      */
/* ------------------------------------------------------------------ */
function Turbine({ position, speed = 1 }: { position: [number, number, number]; speed?: number }) {
  const rotor = useRef<THREE.Group>(null!);
  useFrame((_, dt) => {
    rotor.current.rotation.z -= dt * speed * 1.4;
  });
  return (
    <group position={position}>
      <mesh position={[0, 4.5, 0]}>
        <cylinderGeometry args={[0.12, 0.28, 9, 8]} />
        <meshStandardMaterial color="#e9eef7" flatShading />
      </mesh>
      <group position={[0, 9, 0.3]}>
        <mesh>
          <sphereGeometry args={[0.32, 8, 8]} />
          <meshStandardMaterial color="#e9eef7" />
        </mesh>
        <group ref={rotor}>
          {[0, 1, 2].map((i) => (
            <mesh key={i} rotation={[0, 0, (i * Math.PI * 2) / 3]} position={[0, 0, 0]}>
              <boxGeometry args={[0.2, 4.4, 0.06]} />
              <meshStandardMaterial color="#f5f8ff" />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
}

function Grid() {
  const nodes = useMemo(
    () => [-6, -2, 2, 6].map((x) => new THREE.Vector3(x, 6.2, 0)),
    [],
  );
  const pulses = useRef<THREE.Mesh[]>([]);
  const nodeMats = useRef<THREE.MeshBasicMaterial[]>([]);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    pulses.current.forEach((m, i) => {
      if (!m) return;
      const seg = i % 3;
      const k = (t * 0.6 + i * 0.33) % 1;
      m.position.lerpVectors(nodes[seg], nodes[seg + 1], k);
    });
    nodeMats.current.forEach((m, i) => {
      if (m) m.color.setHSL(0.48, 1, 0.55 + Math.sin(t * 3 + i) * 0.15);
    });
  });
  return (
    <group>
      <Island radius={9} color="#2d4a45" />
      {nodes.map((n, i) => (
        <group key={i} position={[n.x, 0, 0]}>
          <mesh position={[0, 3, 0]}>
            <cylinderGeometry args={[0.1, 0.2, 6, 6]} />
            <meshStandardMaterial color="#8e9ab0" flatShading />
          </mesh>
          <mesh position={[0, 5.2, 0]}>
            <boxGeometry args={[2, 0.12, 0.12]} />
            <meshStandardMaterial color="#8e9ab0" />
          </mesh>
          <mesh position={[0, 6.2, 0]}>
            <sphereGeometry args={[0.38, 12, 12]} />
            <meshBasicMaterial ref={(m) => { if (m) nodeMats.current[i] = m; }} color="#4de8c2" />
          </mesh>
        </group>
      ))}
      <Line points={nodes} color="#4de8c2" lineWidth={1.5} transparent opacity={0.7} />
      {[0, 1, 2].map((i) => (
        <mesh key={i} ref={(m) => { if (m) pulses.current[i] = m; }}>
          <sphereGeometry args={[0.2, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}
      {[-5, -3, -1, 1, 3, 5].map((x) => (
        <mesh key={x} position={[x, 0.7, 3.4]} rotation={[-0.6, 0, 0]}>
          <boxGeometry args={[1.6, 0.08, 2.2]} />
          <meshStandardMaterial color="#12306b" emissive="#1b4fd1" emissiveIntensity={0.35} metalness={0.6} roughness={0.3} />
        </mesh>
      ))}
      <Turbine position={[-6, 0, -3.6]} speed={1} />
      <Turbine position={[5, 0, -4]} speed={0.8} />
      <Label position={[0, 12.5, 0]}>⚡ Smart Joules · JouleTrack IoT</Label>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Level 3: harbour, containers, crane, passing cargo ship              */
/* ------------------------------------------------------------------ */
const CONTAINER_COLORS = ['#e4572e', '#2e86ab', '#f6c445', '#3fa34d', '#8d5ad6', '#d9d9d9', '#17bebb'];

function Harbour() {
  const stacks = useMemo(() => {
    const r = mulberry32(7);
    const out: { x: number; z: number; h: number; c: string }[] = [];
    for (let ix = 0; ix < 6; ix++)
      for (let iz = 0; iz < 3; iz++)
        out.push({ x: -6 + ix * 2.5, z: -2.8 + iz * 1.6, h: 1 + Math.floor(r() * 3), c: CONTAINER_COLORS[Math.floor(r() * CONTAINER_COLORS.length)] });
    return out;
  }, []);
  const trolley = useRef<THREE.Group>(null!);
  const ship = useRef<THREE.Group>(null!);
  const beacon = useRef<THREE.MeshBasicMaterial>(null!);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    trolley.current.position.x = Math.sin(t * 0.5) * 3.5;
    ship.current.position.x = -1 + Math.sin(t * 0.12) * 12;
    beacon.current.color.setRGB(1, 0.15, 0.1).multiplyScalar(0.4 + 0.6 * (Math.sin(t * 4) > 0 ? 1 : 0.1));
  });
  return (
    <group>
      <mesh position={[0, -0.4, 0]}>
        <boxGeometry args={[18, 1.6, 11]} />
        <meshStandardMaterial color="#394152" flatShading />
      </mesh>
      <mesh position={[0, -2.2, 0]}>
        <boxGeometry args={[17, 2.4, 10]} />
        <meshStandardMaterial color="#1f252f" flatShading />
      </mesh>
      {stacks.map((s, i) =>
        Array.from({ length: s.h }).map((_, k) => (
          <mesh key={`${i}-${k}`} position={[s.x, 0.8 + k * 1.05, s.z - 1]}>
            <boxGeometry args={[2.2, 1, 1.3]} />
            <meshStandardMaterial color={s.c} flatShading />
          </mesh>
        )),
      )}
      {/* gantry crane */}
      {[-1, 1].flatMap((sx) => [-1, 1].map((sz) => [sx, sz])).map(([sx, sz]) => (
        <mesh key={`${sx}${sz}`} position={[sx * 5, 4.5, 3 + sz * 1.6]}>
          <boxGeometry args={[0.28, 9, 0.28]} />
          <meshStandardMaterial color="#f2b134" />
        </mesh>
      ))}
      <mesh position={[0, 9, 3]}>
        <boxGeometry args={[12, 0.5, 4]} />
        <meshStandardMaterial color="#f2b134" />
      </mesh>
      <mesh position={[0, 9.5, 3]}>
        <sphereGeometry args={[0.28, 8, 8]} />
        <meshBasicMaterial ref={beacon} color="#ff2a1a" />
      </mesh>
      <group ref={trolley} position={[0, 8.6, 3]}>
        <mesh position={[0, -2, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 4, 4]} />
          <meshStandardMaterial color="#222" />
        </mesh>
        <mesh position={[0, -4.3, 0]}>
          <boxGeometry args={[2.2, 1, 1.3]} />
          <meshStandardMaterial color="#e4572e" flatShading />
        </mesh>
      </group>
      {/* cargo ship at the quay */}
      <group ref={ship} position={[-1, 0, 7.5]}>
        <mesh position={[0, -0.4, 0]}>
          <boxGeometry args={[7, 1.4, 22]} />
          <meshStandardMaterial color="#2a3a52" flatShading />
        </mesh>
        <mesh position={[0, -0.9, 0]}>
          <boxGeometry args={[7.2, 0.5, 22.2]} />
          <meshStandardMaterial color="#9c2f2f" flatShading />
        </mesh>
        {[-7, -3.5, 0, 3.5].map((z, i) => (
          <mesh key={z} position={[0, 0.9, z]}>
            <boxGeometry args={[5.2, 1.4, 2.8]} />
            <meshStandardMaterial color={CONTAINER_COLORS[(i * 2) % CONTAINER_COLORS.length]} flatShading />
          </mesh>
        ))}
        <mesh position={[0, 2.2, 8]}>
          <boxGeometry args={[4.6, 3.4, 3]} />
          <meshStandardMaterial color="#e8ecf5" flatShading />
        </mesh>
      </group>
      <Label position={[0, 13, 2]}>🚢 heyport · 10,000+ port calls</Label>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Level 4: AI neural network + e-mails converging into structure       */
/* ------------------------------------------------------------------ */
function Envelope({ i }: { i: number }) {
  const mesh = useRef<THREE.Mesh>(null!);
  const mat = useRef<THREE.MeshStandardMaterial>(null!);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    const phase = (t * 0.18 + i / 9) % 1;
    const a = i * 0.9 + phase * 4;
    const r = 13 * (1 - phase) + 2;
    mesh.current.position.set(Math.cos(a) * r, Math.sin(i * 1.7) * 2 + (1 - phase) * 3, Math.sin(a) * r);
    mesh.current.lookAt(0, 0, 0);
    mesh.current.scale.setScalar(1 - phase * 0.55);
    mat.current.color.set('#ffffff').lerp(new THREE.Color('#5ff3ff'), phase);
    mat.current.emissive.copy(mat.current.color).multiplyScalar(0.5 * phase);
  });
  return (
    <mesh ref={mesh}>
      <boxGeometry args={[1.5, 1, 0.06]} />
      <meshStandardMaterial ref={mat} color="#fff" />
    </mesh>
  );
}

function Frontier() {
  const net = useRef<THREE.Group>(null!);
  const core = useRef<THREE.Mesh>(null!);
  const { nodes, edges } = useMemo(() => {
    const r = mulberry32(21);
    const nodes: THREE.Vector3[] = [];
    for (let i = 0; i < 30; i++) {
      const u = r() * 2 - 1;
      const th = r() * Math.PI * 2;
      const rad = 4.5 + r() * 2.5;
      const s = Math.sqrt(1 - u * u);
      nodes.push(new THREE.Vector3(Math.cos(th) * s * rad, u * rad, Math.sin(th) * s * rad));
    }
    const e: number[] = [];
    for (let i = 0; i < nodes.length; i++)
      for (let j = i + 1; j < nodes.length; j++)
        if (nodes[i].distanceTo(nodes[j]) < 4.8) e.push(...nodes[i].toArray(), ...nodes[j].toArray());
    return { nodes, edges: new Float32Array(e) };
  }, []);
  useFrame((s, dt) => {
    net.current.rotation.y += dt * 0.15;
    core.current.rotation.x += dt * 0.6;
    core.current.rotation.y += dt * 0.4;
    const k = 1 + Math.sin(s.clock.elapsedTime * 2) * 0.08;
    core.current.scale.setScalar(k);
  });
  return (
    <group position={[0, 8, 0]}>
      <group ref={net}>
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[edges, 3]} />
          </bufferGeometry>
          <lineBasicMaterial color="#9a7bff" transparent opacity={0.5} />
        </lineSegments>
        {nodes.map((n, i) => (
          <mesh key={i} position={n}>
            <sphereGeometry args={[0.28, 8, 8]} />
            <meshBasicMaterial color={i % 3 === 0 ? '#5ff3ff' : '#c084ff'} />
          </mesh>
        ))}
      </group>
      <mesh ref={core}>
        <icosahedronGeometry args={[1.8, 1]} />
        <meshStandardMaterial color="#c084ff" emissive="#9a5cff" emissiveIntensity={1.8} wireframe />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.9, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <pointLight color="#b48cff" intensity={60} distance={40} />
      {Array.from({ length: 9 }).map((_, i) => (
        <Envelope key={i} i={i} />
      ))}
      <Label position={[0, 9.5, 0]}>🤖 LLM email ingestion</Label>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Final level: lighthouse + award trophies                             */
/* ------------------------------------------------------------------ */
function Trophy({ position, label }: { position: [number, number, number]; label: string }) {
  const g = useRef<THREE.Group>(null!);
  useFrame((s) => {
    g.current.rotation.y = s.clock.elapsedTime * 0.8;
    g.current.position.y = position[1] + Math.sin(s.clock.elapsedTime * 1.5 + position[0]) * 0.2;
  });
  const gold = <meshStandardMaterial color="#ffd24a" metalness={0.95} roughness={0.22} emissive="#6a4a00" emissiveIntensity={0.6} />;
  return (
    <group position={[position[0], 0, position[2]]}>
      <group ref={g} position={[0, position[1], 0]}>
        <mesh position={[0, 0.7, 0]}>
          <cylinderGeometry args={[0.7, 0.3, 1, 12]} />
          {gold}
        </mesh>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.7, 8]} />
          {gold}
        </mesh>
        <mesh position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.5, 0.6, 0.2, 12]} />
          {gold}
        </mesh>
        <mesh position={[0.78, 0.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.3, 0.05, 6, 12, Math.PI]} />
          {gold}
        </mesh>
        <mesh position={[-0.78, 0.8, 0]} rotation={[Math.PI / 2, 0, Math.PI]}>
          <torusGeometry args={[0.3, 0.05, 6, 12, Math.PI]} />
          {gold}
        </mesh>
      </group>
      <pointLight position={[0, position[1] + 1, 1]} color="#ffd24a" intensity={6} distance={10} />
      <Label position={[0, position[1] + 2.6, 0]}>{label}</Label>
    </group>
  );
}

function Lighthouse() {
  const beam = useRef<THREE.Group>(null!);
  const beamGeo = useMemo(() => {
    const g = new THREE.ConeGeometry(4.5, 40, 20, 1, true);
    g.translate(0, -20, 0);
    g.rotateZ(Math.PI / 2);
    return g;
  }, []);
  useFrame((_, dt) => {
    beam.current.rotation.y += dt * 0.7;
  });
  return (
    <group>
      <Island radius={9} color="#46523f" />
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, 1.8 + i * 2.8, 0]}>
          <cylinderGeometry args={[1.2 - i * 0.2 - 0.2, 1.2 - i * 0.2 + 0.1, 2.8, 10]} />
          <meshStandardMaterial color={i % 2 === 0 ? '#f2f2f2' : '#d6453d'} flatShading />
        </mesh>
      ))}
      <mesh position={[0, 10.3, 0]}>
        <cylinderGeometry args={[1.3, 1.0, 0.4, 10]} />
        <meshStandardMaterial color="#2a3550" flatShading />
      </mesh>
      <mesh position={[0, 11.3, 0]}>
        <cylinderGeometry args={[0.65, 0.65, 1.6, 10]} />
        <meshBasicMaterial color="#fff2c0" />
      </mesh>
      <mesh position={[0, 12.7, 0]}>
        <coneGeometry args={[1, 1.2, 10]} />
        <meshStandardMaterial color="#d6453d" flatShading />
      </mesh>
      <pointLight position={[0, 11.3, 0]} color="#ffe2a0" intensity={90} distance={60} />
      <group ref={beam} position={[0, 11.3, 0]}>
        <mesh geometry={beamGeo}>
          <meshBasicMaterial color="#fff0b8" transparent opacity={0.16} depthWrite={false} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
        </mesh>
      </group>
      <Trophy position={[-5, 2.2, 3]} label="🏆 Founder Award · 2023" />
      <Trophy position={[-5, 2.2, -2.6]} label="🏆 Most Inspirational · 2022" />
    </group>
  );
}

export function Landmarks() {
  return (
    <>
      <Reveal id="dit" offset={OFFSET}><Academy /></Reveal>
      <Reveal id="joules" offset={OFFSET}><Grid /></Reveal>
      <Reveal id="gogroup" offset={OFFSET + 6}><Harbour /></Reveal>
      <Reveal id="ai" offset={OFFSET + 4}><Frontier /></Reveal>
      <Reveal id="finale" offset={OFFSET - 3}><Lighthouse /></Reveal>
    </>
  );
}
