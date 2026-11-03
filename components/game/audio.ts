/** Tiny WebAudio engine. Everything is synthesised, so there are no audio files to ship. */

// A minor pentatonic
const SCALE = [220, 261.63, 293.66, 329.63, 392];
// pad chord per chapter (prologue, academy, grid, harbour, ai, finale)
const CHORDS: number[][] = [
  [110, 164.81, 220, 329.63],
  [110, 164.81, 220, 261.63],
  [98, 146.83, 196, 293.66],
  [87.31, 130.81, 174.61, 261.63],
  [110, 164.81, 207.65, 329.63],
  [130.81, 196, 261.63, 392],
];

let ctx: AudioContext | null = null;
let master: GainNode;
let pad: OscillatorNode[] = [];
let chapter = 0;

function build() {
  ctx = new AudioContext();
  master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  // sea: looping brown-ish noise → lowpass, slowly "breathing"
  const len = ctx.sampleRate * 3;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < len; i++) {
    const w = Math.random() * 2 - 1;
    last = (last + 0.02 * w) / 1.02;
    d[i] = last * 3.5;
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buf;
  noise.loop = true;
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 520;
  const sea = ctx.createGain();
  sea.gain.value = 0.35;
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.11;
  const lfoDepth = ctx.createGain();
  lfoDepth.gain.value = 0.18;
  lfo.connect(lfoDepth).connect(sea.gain);
  noise.connect(lp).connect(sea).connect(master);
  noise.start();
  lfo.start();

  // pad
  const padGain = ctx.createGain();
  padGain.gain.value = 0.05;
  const padLp = ctx.createBiquadFilter();
  padLp.type = 'lowpass';
  padLp.frequency.value = 900;
  padGain.connect(padLp).connect(master);
  pad = CHORDS[0].map((f, i) => {
    const o = ctx!.createOscillator();
    o.type = i % 2 ? 'triangle' : 'sine';
    o.frequency.value = f;
    o.detune.value = (i - 1.5) * 4;
    o.connect(padGain);
    o.start();
    return o;
  });
  document.addEventListener('visibilitychange', () => {
    if (!ctx) return;
    if (document.hidden) ctx.suspend();
    else if (audio.enabled) ctx.resume();
  });
}

function tone(freq: number, start: number, dur: number, type: OscillatorType, vol: number) {
  if (!ctx) return;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(vol, start + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  o.connect(g).connect(master);
  o.start(start);
  o.stop(start + dur + 0.05);
}

export const audio = {
  enabled: false,
  enable() {
    if (typeof window === 'undefined') return;
    if (!ctx) build();
    ctx!.resume();
    master.gain.setTargetAtTime(0.9, ctx!.currentTime, 0.4);
    this.enabled = true;
    this.setChapter(chapter);
  },
  disable() {
    if (!ctx) return;
    master.gain.setTargetAtTime(0, ctx.currentTime, 0.15);
    this.enabled = false;
  },
  setChapter(i: number) {
    chapter = i;
    if (!ctx || !this.enabled) return;
    const chord = CHORDS[Math.min(i, CHORDS.length - 1)];
    pad.forEach((o, k) => o.frequency.setTargetAtTime(chord[k], ctx!.currentTime, 1.4));
  },
  /** pickup sound: climbs the scale the more skills you have */
  chime(n: number) {
    if (!ctx || !this.enabled) return;
    const f = SCALE[n % SCALE.length] * 2 * (Math.floor(n / SCALE.length) % 2 ? 2 : 1);
    const t = ctx.currentTime;
    tone(f, t, 0.9, 'sine', 0.28);
    tone(f * 2, t, 0.5, 'sine', 0.08);
  },
  /** level-up arpeggio */
  level() {
    if (!ctx || !this.enabled) return;
    const t = ctx.currentTime;
    [0, 2, 4, 5].forEach((s, i) => tone((SCALE[s % 5] ?? 392) * 2 * (s === 5 ? 2 : 1), t + i * 0.11, 0.7, 'triangle', 0.18));
  },
};
