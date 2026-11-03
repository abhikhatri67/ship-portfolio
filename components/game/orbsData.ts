import * as THREE from 'three';
import { chapters } from './data';
import { pointAt } from './path';

export interface OrbData {
  name: string;
  color: string;
  t: number;
  lateral: number;
  pos: THREE.Vector3;
}

const LATERALS = [-2.6, 1.8, -0.8, 2.8, -2.2, 0.6, 2.4, -1.6, 1.2, -2.8];

export const orbs: OrbData[] = (() => {
  const out: OrbData[] = [];
  let k = 0;
  for (const c of chapters) {
    const lo = Math.max(0.03, c.at - 0.075);
    const hi = Math.min(0.985, c.at + 0.075);
    c.skills.forEach((s, i) => {
      const t = lo + ((i + 0.5) / c.skills.length) * (hi - lo);
      const lateral = LATERALS[k++ % LATERALS.length];
      out.push({ name: s.name, color: s.color, t, lateral, pos: pointAt(t, lateral, 1.4) });
    });
  }
  return out;
})();
