import * as THREE from 'three';

export const up = new THREE.Vector3(0, 1, 0);

/** The sailing route: the whole story happens along this curve. */
export const curve = new THREE.CatmullRomCurve3(
  [
    [0, 0, 20],
    [0, 0, -30],
    [14, 0, -80],
    [-8, 0, -130],
    [-12, 0, -180],
    [6, 0, -230],
    [0, 0, -290],
  ].map(([x, y, z]) => new THREE.Vector3(x, y, z)),
  false,
  'catmullrom',
  0.5,
);

const _t = new THREE.Vector3();

export function rightAt(t: number, out = new THREE.Vector3()) {
  curve.getTangentAt(THREE.MathUtils.clamp(t, 0, 1), _t);
  return out.copy(_t).cross(up).normalize();
}

export function headingYaw(t: number) {
  curve.getTangentAt(THREE.MathUtils.clamp(t, 0, 1), _t);
  return Math.atan2(-_t.x, -_t.z);
}

/** world position at path parameter t, shifted sideways by `lateral` */
export function pointAt(t: number, lateral = 0, y = 0) {
  const p = curve.getPointAt(THREE.MathUtils.clamp(t, 0, 1));
  const r = rightAt(t);
  return p.addScaledVector(r, lateral).setY(y);
}

/** landmark placement: beside the path, facing it */
export function landmarkTransform(at: number, offset: number) {
  return {
    position: pointAt(at, offset, 0.8).toArray() as [number, number, number],
    rotationY: headingYaw(at) - Math.PI / 2,
  };
}

export function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
