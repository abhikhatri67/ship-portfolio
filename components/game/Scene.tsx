'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerformanceMonitor, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { live, useGame } from './gameStore';
import { Ocean } from './Ocean';
import { Ship } from './Ship';
import { Orbs } from './Orbs';
import { Landmarks } from './Landmarks';

/** night → deep blue → dusk → dawn, driven by scroll */
const SKY: [number, THREE.Color][] = [
  [0, new THREE.Color('#050816')],
  [0.55, new THREE.Color('#0a1a3a')],
  [0.8, new THREE.Color('#2b2150')],
  [1, new THREE.Color('#e08a5b')],
];
const _c = new THREE.Color();
function skyColor(p: number, out: THREE.Color) {
  for (let i = 1; i < SKY.length; i++) {
    if (p <= SKY[i][0]) {
      const [a, ca] = SKY[i - 1];
      const [b, cb] = SKY[i];
      return out.copy(ca).lerp(cb, (p - a) / (b - a));
    }
  }
  return out.copy(SKY[SKY.length - 1][1]);
}

const _desired = new THREE.Vector3();
const _look = new THREE.Vector3();

function Rig() {
  const lite = useGame((st) => st.lite);
  const sky = useRef<THREE.Group>(null!);
  const moon = useRef<THREE.Mesh>(null!);
  const moonMat = useRef<THREE.MeshBasicMaterial>(null!);
  const lookAt = useRef(new THREE.Vector3(0, 1, -10));

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const { camera, scene, size } = state;
    const cam = camera as THREE.PerspectiveCamera;

    const portrait = size.width < size.height;
    const fov = portrait ? 78 : 55;
    if (cam.fov !== fov) {
      cam.fov = fov;
      cam.updateProjectionMatrix();
    }

    // camera chases the ship from behind, slightly above
    _desired
      .copy(live.shipPos)
      .addScaledVector(live.tan, -14)
      .addScaledVector(live.right, live.shipLateral * 0.45 + (portrait ? 0 : 1.5));
    _desired.y = live.shipPos.y + 6.2;
    cam.position.lerp(_desired, 1 - Math.exp(-dt * 4));
    _look.copy(live.shipPos).addScaledVector(live.tan, 14).addScaledVector(live.right, portrait ? 2 : 4.5);
    _look.y += portrait ? -5 : 1.2;
    lookAt.current.lerp(_look, 1 - Math.exp(-dt * 5));
    cam.lookAt(lookAt.current);

    // sky
    const p = live.smooth;
    skyColor(p, _c);
    (scene.background as THREE.Color).copy(_c);
    if (scene.fog) (scene.fog as THREE.Fog).color.copy(_c);
    sky.current.position.copy(live.shipPos);
    sky.current.visible = true;
    // moon becomes the sunrise
    const dawn = THREE.MathUtils.smoothstep(p, 0.8, 1);
    moon.current.position.set(-40 + dawn * 45, 46 - dawn * 34, -170);
    moon.current.scale.setScalar(1 + dawn * 1.6);
    moonMat.current.color.set('#dfe8ff').lerp(new THREE.Color('#ffc27a'), dawn);
  });

  return (
    <group ref={sky}>
      <Stars radius={180} depth={50} count={lite ? 900 : 3000} factor={5} fade speed={1} />
      <mesh ref={moon}>
        <sphereGeometry args={[6, 24, 24]} />
        <meshBasicMaterial ref={moonMat} fog={false} />
      </mesh>
    </group>
  );
}

export default function Scene() {
  const lite = useGame((st) => st.lite);
  const setLite = useGame((st) => st.setLite);
  return (
    <Canvas
      dpr={lite ? 1 : [1, 1.75]}
      camera={{ fov: 55, near: 0.1, far: 500, position: [0, 5, 30] }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={['#050816']} />
      <fog attach="fog" args={['#050816', 45, 180]} />
      <ambientLight intensity={0.6} color="#9fb4ff" />
      <directionalLight position={[-30, 40, -20]} intensity={1.2} color="#bcd0ff" />
      <hemisphereLight args={['#6f8cff', '#0b1020', 0.5]} />
      <PerformanceMonitor onDecline={setLite} flipflops={2} />
      <Ocean />
      <Ship />
      <Orbs />
      <Landmarks />
      <Rig />
    </Canvas>
  );
}
