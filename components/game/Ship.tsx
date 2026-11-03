'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { live } from './gameStore';
import { curve, up } from './path';
import { waveHeight } from './Ocean';
import { orbs } from './orbsData';
import { useGame } from './gameStore';

const MAX_LAT = 3.6;
const _tan = new THREE.Vector3();
const _right = new THREE.Vector3();

export function Ship() {
  const group = useRef<THREE.Group>(null!);
  const keys = useRef({ l: false, r: false });
  const lat = useRef({ value: 0, target: 0 });

  const flag = useRef<THREE.Mesh>(null!);
  const hullGeo = useMemo(() => {
    const sh = new THREE.Shape();
    sh.moveTo(-0.7, -1.7);
    sh.lineTo(0.7, -1.7);
    sh.lineTo(0.78, 0.6);
    sh.lineTo(0, 2.3);
    sh.lineTo(-0.78, 0.6);
    sh.closePath();
    const g = new THREE.ExtrudeGeometry(sh, { depth: 0.8, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05, bevelSegments: 1 });
    g.rotateX(-Math.PI / 2); // shape-y -> forward (-z), extrusion -> up
    g.translate(0, 0, 0);
    return g;
  }, []);
  const flagGeo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.lineTo(0.9, 0.18);
    s.lineTo(0, 0.4);
    return new THREE.ShapeGeometry(s);
  }, []);
  const sailGeo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.lineTo(0, 2.6);
    s.lineTo(1.5, 0);
    return new THREE.ShapeGeometry(s);
  }, []);

  useEffect(() => {
    const set = (e: KeyboardEvent, v: boolean) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName))) return;
      const k = e.key.toLowerCase();
      if (k === 'a' || k === 'arrowleft') keys.current.l = v;
      if (k === 'd' || k === 'arrowright') keys.current.r = v;
      if (v && ['a', 'd', 'arrowleft', 'arrowright'].includes(k)) live.useKeys = true;
    };
    const down = (e: KeyboardEvent) => set(e, true);
    const upH = (e: KeyboardEvent) => set(e, false);
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', upH);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', upH);
    };
  }, []);

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const time = state.clock.elapsedTime;
    live.smooth += (live.progress - live.smooth) * (1 - Math.exp(-dt * 3));
    const t = THREE.MathUtils.clamp(live.smooth, 0, 0.999);

    // ---- steering ----
    const l = lat.current;
    if (live.touch) {
      // phones can't steer while scrolling: autopilot hunts the next orb
      const collected = useGame.getState().collected;
      let best: number | null = null;
      for (const o of orbs) {
        if (o.t > t && o.t < t + 0.05 && !collected.includes(o.name)) {
          best = o.lateral;
          break;
        }
      }
      l.target = best ?? 0;
    } else if (live.useKeys) {
      const k = keys.current;
      l.target = THREE.MathUtils.clamp(l.target + ((k.r ? 1 : 0) - (k.l ? 1 : 0)) * dt * 7, -MAX_LAT, MAX_LAT);
    } else {
      l.target = live.steer * MAX_LAT;
    }
    const prev = l.value;
    l.value += (l.target - l.value) * (1 - Math.exp(-dt * 5));
    const vel = (l.value - prev) / Math.max(dt, 0.001);

    // ---- placement ----
    const g = group.current;
    curve.getPointAt(t, g.position);
    curve.getTangentAt(t, _tan);
    _right.copy(_tan).cross(up).normalize();
    g.position.addScaledVector(_right, l.value);
    g.position.y = waveHeight(g.position.x, g.position.z, time) * 0.8 + 0.35;

    const yaw = Math.atan2(-_tan.x, -_tan.z) - vel * 0.015;
    g.rotation.order = 'YXZ';
    g.rotation.y = yaw;
    g.rotation.x = Math.sin(time * 1.1) * 0.03;
    g.rotation.z = THREE.MathUtils.clamp(-vel * 0.05, -0.4, 0.4) + Math.sin(time * 1.3) * 0.04;

    flag.current.rotation.y = Math.sin(time * 8) * 0.35;
    live.shipPos.copy(g.position);
    live.shipLateral = l.value;
    live.tan.copy(_tan);
    live.right.copy(_right);
  });

  return (
    <>
      <group ref={group}>
        <group scale={0.8}>
          {/* hull: pointed bow, red waterline stripe */}
          <mesh geometry={hullGeo} position={[0, -0.25, 0]}>
            <meshStandardMaterial color="#eef1f8" flatShading />
          </mesh>
          <mesh geometry={hullGeo} position={[0, -0.5, 0]} scale={[1.05, 1, 1.02]}>
            <meshStandardMaterial color="#d6453d" flatShading />
          </mesh>
          {/* deck + rails */}
          <mesh position={[0, 0.58, 0.1]}>
            <boxGeometry args={[1.2, 0.06, 3.4]} />
            <meshStandardMaterial color="#9a7b52" flatShading />
          </mesh>
          {[-0.62, 0.62].map((x) => (
            <mesh key={x} position={[x, 0.78, 0.1]}>
              <boxGeometry args={[0.04, 0.3, 3]} />
              <meshStandardMaterial color="#d8deea" />
            </mesh>
          ))}
          {/* cabin + bridge */}
          <mesh position={[0, 1.0, 1.0]}>
            <boxGeometry args={[0.95, 0.75, 1.1]} />
            <meshStandardMaterial color="#6b7da8" flatShading />
          </mesh>
          <mesh position={[0, 1.7, 1.1]}>
            <boxGeometry args={[0.7, 0.55, 0.7]} />
            <meshStandardMaterial color="#eef1f8" flatShading />
          </mesh>
          <mesh position={[0, 1.72, 0.74]}>
            <boxGeometry args={[0.6, 0.18, 0.04]} />
            <meshStandardMaterial color="#ffe3a3" emissive="#ffcf70" emissiveIntensity={2} />
          </mesh>
          <mesh position={[0, 1.05, 0.44]}>
            <boxGeometry args={[0.75, 0.16, 0.04]} />
            <meshStandardMaterial color="#ffe3a3" emissive="#ffcf70" emissiveIntensity={1.6} />
          </mesh>
          {/* mast, sail, flag */}
          <mesh position={[0, 2.2, -0.5]}>
            <cylinderGeometry args={[0.04, 0.05, 3.4, 6]} />
            <meshStandardMaterial color="#cfd6e6" />
          </mesh>
          <mesh geometry={sailGeo} position={[0, 1.0, -0.5]} rotation={[0, -Math.PI / 2 + 0.5, 0]} scale={1.2}>
            <meshStandardMaterial color="#fff1d6" emissive="#ffcf8a" emissiveIntensity={0.35} side={THREE.DoubleSide} />
          </mesh>
          <mesh ref={flag} geometry={flagGeo} position={[0, 3.75, -0.5]}>
            <meshBasicMaterial color="#ff6b4a" side={THREE.DoubleSide} />
          </mesh>
          {/* bow lantern */}
          <mesh position={[0, 0.85, -1.9]}>
            <sphereGeometry args={[0.13, 8, 8]} />
            <meshBasicMaterial color="#fff2c8" />
          </mesh>
        </group>
        <pointLight position={[0, 1.4, -1.4]} color="#ffdca8" intensity={9} distance={16} />
      </group>
      <Wake />
    </>
  );
}

/** foam trail: a ring buffer of fading discs dropped behind the ship */
const WAKE_N = 28;
function Wake() {
  const meshes = useRef<THREE.Mesh[]>([]);
  const ages = useRef<number[]>(Array(WAKE_N).fill(9));
  const head = useRef(0);
  const acc = useRef(0);
  const mats = useRef<THREE.MeshBasicMaterial[]>([]);

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    acc.current += dt;
    const time = state.clock.elapsedTime;
    if (acc.current > 0.07) {
      acc.current = 0;
      const i = head.current++ % WAKE_N;
      ages.current[i] = 0;
      const m = meshes.current[i];
      m.position.set(live.shipPos.x, waveHeight(live.shipPos.x, live.shipPos.z, time) * 0.8 + 0.05, live.shipPos.z);
      m.position.addScaledVector(live.tan, -1.8);
    }
    for (let i = 0; i < WAKE_N; i++) {
      ages.current[i] += dt;
      const a = ages.current[i];
      const m = meshes.current[i];
      if (!m) continue;
      const k = Math.min(a / 1.6, 1);
      m.visible = k < 1;
      m.scale.setScalar(0.5 + k * 2.2);
      mats.current[i].opacity = (1 - k) * 0.5;
    }
  });

  return (
    <>
      {Array.from({ length: WAKE_N }).map((_, i) => (
        <mesh key={i} ref={(m) => { if (m) meshes.current[i] = m; }} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
          <circleGeometry args={[0.6, 10]} />
          <meshBasicMaterial
            ref={(m) => { if (m) mats.current[i] = m; }}
            color="#dff6ff"
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
      ))}
    </>
  );
}
