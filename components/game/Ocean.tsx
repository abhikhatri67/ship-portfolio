'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { live } from './gameStore';

const SIZE = 160;
const SEG = 120;
const CELL = SIZE / SEG;

/** CPU twin of the vertex-shader waves, so the ship can bob on them */
export function waveHeight(x: number, z: number, t: number) {
  return (
    Math.sin(x * 0.25 + t) * 0.25 +
    Math.sin(z * 0.2 + t * 1.3) * 0.2 +
    Math.sin((x + z) * 0.12 + t * 0.7) * 0.3
  );
}

export function Ocean() {
  const mesh = useRef<THREE.Mesh>(null!);
  const uTime = useRef({ value: 0 });
  const uOff = useRef({ value: new THREE.Vector2() });

  useFrame((state) => {
    const px = Math.round(live.shipPos.x / CELL) * CELL;
    const pz = Math.round(live.shipPos.z / CELL) * CELL;
    mesh.current.position.set(px, -0.1, pz);
    uOff.current.value.set(px, pz);
    uTime.current.value = state.clock.elapsedTime;
  });

  return (
    <mesh ref={mesh} rotation={[-Math.PI / 2, 0, 0]} frustumCulled={false}>
      <planeGeometry args={[SIZE, SIZE, SEG, SEG]} />
      <meshStandardMaterial
        color="#0c4560"
        flatShading
        metalness={0.35}
        roughness={0.3}
        onBeforeCompile={(shader) => {
          shader.uniforms.uTime = uTime.current;
          shader.uniforms.uOff = uOff.current;
          shader.vertexShader =
            'uniform float uTime;\nuniform vec2 uOff;\n' +
            shader.vertexShader.replace(
              '#include <begin_vertex>',
              `#include <begin_vertex>
               // plane is rotated -90deg on X, so local y is world -z
               float wx = position.x + uOff.x;
               float wz = -position.y + uOff.y;
               transformed.z += sin(wx*0.25+uTime)*0.25 + sin(wz*0.2+uTime*1.3)*0.2 + sin((wx+wz)*0.12+uTime*0.7)*0.3;`,
            );
        }}
      />
    </mesh>
  );
}
