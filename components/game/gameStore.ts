import { create } from 'zustand';
import * as THREE from 'three';

/** mutable, per-frame values (not React state, to avoid re-renders) */
export const live = {
  progress: 0, // raw scroll progress 0..1
  steer: 0, // pointer steering -1..1
  shipPos: new THREE.Vector3(),
  shipLateral: 0,
  smooth: 0, // damped scroll progress
  useKeys: false,
  tan: new THREE.Vector3(0, 0, -1),
  right: new THREE.Vector3(1, 0, 0),
  touch: false,
};

interface GameState {
  chapter: number;
  collected: string[];
  sound: boolean;
  lite: boolean;
  toast: { id: number; text: string; color: string } | null;
  setChapter: (i: number) => void;
  collect: (name: string, color: string) => void;
  setLite: () => void;
  reset: () => void;
}

export const useGame = create<GameState>((set, get) => ({
  chapter: 0,
  collected: [],
  sound: false,
  lite: false,
  toast: null,
  setLite: () => set({ lite: true }),
  reset: () => set({ collected: [], toast: null }),
  setChapter: (chapter) => set({ chapter }),
  collect: (name, color) => {
    if (get().collected.includes(name)) return;
    set((s) => ({
      collected: [...s.collected, name],
      toast: { id: Date.now(), text: name, color },
    }));
  },
}));
