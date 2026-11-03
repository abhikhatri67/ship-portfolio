'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Download, Mail, Trophy, Sparkles, Volume2, VolumeX, Play, RotateCcw } from 'lucide-react';
import { Hero } from '@/components/Hero';
import { chapters, chapterIndexAt, totalSkills } from './data';
import { live, useGame } from './gameStore';
import { audio } from './audio';
import { orbs } from './orbsData';

const Scene = dynamic(() => import('./Scene'), { ssr: false });

const SCROLL_HEIGHT_VH = 900;

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

function journeyTotal() {
  const el = document.getElementById('home');
  return el ? el.offsetHeight - window.innerHeight : 0;
}

/** scroll so the journey sits at progress p (0..1) */
function goTo(p: number) {
  const el = document.getElementById('home');
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top: top + Math.max(0, p) * journeyTotal(), behavior: 'smooth' });
}

/** forget all collected skills and sail back to the start */
function restart() {
  useGame.getState().reset();
  goTo(0);
}

function SoundButton() {
  const sound = useGame((s) => s.sound);
  const toggle = () => {
    const on = !useGame.getState().sound;
    useGame.setState({ sound: on });
    if (on) {
      audio.enable();
      audio.setChapter(useGame.getState().chapter);
    } else audio.disable();
  };
  return (
    <button
      onClick={toggle}
      aria-pressed={sound}
      aria-label={sound ? 'Mute sound' : 'Turn sound on'}
      className="pointer-events-auto absolute right-4 top-20 z-20 flex items-center gap-2 rounded-full border border-white/20 bg-black/50 px-3 py-2 text-xs font-semibold text-white backdrop-blur transition hover:bg-black/70 sm:right-6"
    >
      {sound ? <Volume2 size={16} /> : <VolumeX size={16} />}
      <span className="hidden sm:inline">{sound ? 'Sound on' : 'Sound off'}</span>
    </button>
  );
}

function SkillToast() {
  const toast = useGame((s) => s.toast);
  return (
    <div className="pointer-events-none absolute left-1/2 top-40 z-20 sm:top-24 -translate-x-1/2">
      <AnimatePresence mode="wait">
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            onAnimationComplete={() => {
              setTimeout(() => {
                if (useGame.getState().toast?.id === toast.id) useGame.setState({ toast: null });
              }, 900);
            }}
            className="flex items-center gap-2 rounded-full border bg-black/60 px-4 py-2 text-sm font-bold text-white shadow-lg backdrop-blur"
            style={{ borderColor: toast.color, boxShadow: `0 0 24px ${toast.color}66` }}
          >
            <span style={{ color: toast.color }}>+1</span> {toast.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Hud() {
  const collected = useGame((s) => s.collected);
  const chapter = useGame((s) => s.chapter);
  const c = chapters[chapter];
  const pct = Math.round((collected.length / totalSkills) * 100);

  return (
    <>
      {/* XP panel */}
      <div className="pointer-events-none absolute left-4 top-20 z-10 w-56 rounded-xl border border-white/15 bg-black/45 p-3 backdrop-blur sm:left-6 sm:w-64">
        <div className="mb-1 flex items-center justify-between text-[11px] font-bold tracking-widest text-blue-300">
          <span>SKILL XP</span>
          <span>
            {collected.length}/{totalSkills}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"
            animate={{ width: `${pct}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          />
        </div>
        {(collected.length > 0 || chapter > 0) && (
        <button
          onClick={restart}
          className="pointer-events-auto mt-2 flex items-center gap-1.5 rounded-md border border-white/20 px-2 py-1 text-[11px] font-semibold text-gray-200 transition hover:bg-white/10"
        >
          <RotateCcw size={12} /> Reset skills &amp; restart
        </button>
        )}
        <div className="mt-2 hidden flex-wrap gap-1 sm:flex">
          {collected.slice(-8).map((n) => (
            <span key={n} className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-gray-200">
              {n}
            </span>
          ))}
        </div>
      </div>

      {/* level tracker (clickable) */}
      <nav
        aria-label="Quest levels"
        className="absolute right-3 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-end gap-1 sm:flex"
      >
        {chapters.map((ch, i) => (
          <button
            key={ch.id}
            onClick={() => goTo(i === 0 ? 0 : ch.from + 0.012)}
            aria-label={`Go to ${ch.level}: ${ch.title}`}
            aria-current={i === chapter ? 'step' : undefined}
            className="group flex items-center gap-3 py-1.5 pl-3"
          >
            <span
              className={`text-[11px] font-bold tracking-widest transition-opacity ${
                i === chapter ? 'text-white opacity-100' : 'text-gray-300 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'
              }`}
            >
              {ch.level}
            </span>
            <span
              className={`block rounded-full transition-all ${
                i === chapter ? 'h-3 w-3 bg-blue-400 shadow-[0_0_12px_#60a5fa]' : i < chapter ? 'h-2 w-2 bg-blue-400/70' : 'h-2 w-2 bg-white/30'
              }`}
            />
          </button>
        ))}
      </nav>

      <SoundButton />

      {/* achievement banner */}
      <div className="pointer-events-none absolute left-1/2 top-52 z-10 sm:top-36 -translate-x-1/2">
        <AnimatePresence mode="wait">
          {c.achievement && (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: [0, 1, 1, 0], y: [-12, 0, 0, -6] }}
              transition={{ duration: 3.4, times: [0, 0.1, 0.8, 1] }}
              className="flex items-center gap-2 whitespace-nowrap rounded-full border border-yellow-300/50 bg-black/60 px-4 py-1.5 text-xs font-bold tracking-wider text-yellow-200 backdrop-blur"
            >
              <Trophy size={14} /> <span className="hidden sm:inline">ACHIEVEMENT UNLOCKED ·</span> {c.achievement}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

function scrollTo(sel: string) {
  document.querySelector(sel)?.scrollIntoView({ behavior: 'smooth' });
}

function Card() {
  const chapter = useGame((s) => s.chapter);
  const collectedNames = useGame((s) => s.collected);
  const collected = collectedNames.length;
  const missed = orbs.filter((o) => !collectedNames.includes(o.name));
  const c = chapters[chapter];
  const first = chapter === 0;
  const last = chapter === chapters.length - 1;

  return (
    <div
      className={`pointer-events-none absolute z-10 px-4 sm:px-6 ${
        first
          ? 'inset-x-0 top-[30%] flex justify-center text-center sm:top-[24%]'
          : 'inset-x-0 bottom-6 sm:bottom-12 sm:max-w-[30rem]'
      }`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={c.id}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.45 }}
          className={
            first
              ? 'max-w-3xl'
              : 'pointer-events-auto rounded-2xl border border-white/15 bg-slate-950/70 p-5 shadow-2xl backdrop-blur-md sm:p-6'
          }
        >
          {first ? (
            <>
              <p className="mb-3 text-xs font-bold tracking-[0.3em] text-blue-300">AN INTERACTIVE CAREER QUEST</p>
              <h1 className="mb-3 bg-gradient-to-r from-blue-300 via-purple-400 to-pink-400 bg-clip-text text-5xl font-extrabold text-transparent sm:text-7xl">
                {c.title}
              </h1>
              <p className="mb-4 text-lg text-gray-200 sm:text-2xl">{c.period}</p>
              <p className="mx-auto max-w-xl text-sm text-gray-300 sm:text-base">{c.story}</p>
            </>
          ) : (
            <>
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="rounded bg-blue-500/20 px-2 py-0.5 text-[11px] font-bold tracking-widest text-blue-300">
                  {c.level}
                </span>
                <span className="text-xs text-gray-400">{c.period}</span>
              </div>
              <h2 className="text-xl font-bold text-white sm:text-3xl">{c.title}</h2>
              <p className="mb-3 text-sm font-medium text-purple-300">{c.place}</p>
              <p className="mb-3 line-clamp-4 text-xs leading-relaxed text-gray-300 sm:line-clamp-none sm:text-sm">{c.story}</p>
              <ul className="hidden space-y-1 sm:block">
                {c.bullets.map((b) => (
                  <li key={b} className="flex gap-2 text-sm text-gray-200">
                    <Sparkles size={14} className="mt-1 shrink-0 text-blue-400" />
                    {b}
                  </li>
                ))}
              </ul>
              {last && (
                <div className="mt-4 border-t border-white/10 pt-4">
                  <p className="mb-3 text-sm font-semibold text-white">
                    Quest complete · {collected}/{totalSkills} skills collected
                  </p>
                  {missed.length > 0 && (
                    <button
                      onClick={() => goTo(Math.max(0, missed[0].t - 0.04))}
                      className="mb-3 text-left text-xs text-yellow-200 underline underline-offset-4 hover:text-white"
                    >
                      ⚓ {missed.length} skill{missed.length > 1 ? 's' : ''} missed ({missed.slice(0, 3).map((m) => m.name).join(', ')}
                      {missed.length > 3 ? '…' : ''}). Sail back for {missed.length > 1 ? 'them' : 'it'}
                    </button>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <a
                      href="/Abhishek-Khatri-Resume.pdf"
                      download
                      className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white"
                    >
                      <Download size={16} /> Résumé
                    </a>
                    <button
                      onClick={restart}
                      className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                    >
                      <RotateCcw size={16} /> Play again
                    </button>
                    <button
                      onClick={() => scrollTo('#contact')}
                      className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                    >
                      <Mail size={16} /> Get in touch
                    </button>
                    <button
                      onClick={() => scrollTo('#about')}
                      className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                    >
                      Full details <ChevronDown size={16} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Hint() {
  const chapter = useGame((s) => s.chapter);
  const [touch, setTouch] = useState(false);
  useEffect(() => setTouch(window.matchMedia('(pointer: coarse)').matches), []);
  if (chapter !== 0) return null;
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-2 text-center text-xs text-gray-300 sm:text-sm">
      <span className="rounded-full border border-white/20 bg-black/40 px-4 py-1.5 backdrop-blur">
        {touch ? (
          <>
            <b className="text-white">Swipe up</b> to sail · the ship steers itself · 🔊 for sound
          </>
        ) : (
        <>
        <b className="text-white">Scroll</b> or <b className="text-white">↑ ↓</b> to sail · <b className="text-white">mouse</b> or <b className="text-white">← →</b> to steer · 🔊 for sound
        </>
        )}
      </span>
      <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>
        <ChevronDown size={26} />
      </motion.div>
      <button
        onClick={() => scrollTo('#about')}
        className="pointer-events-auto text-xs text-gray-400 underline-offset-4 hover:text-white hover:underline"
      >
        Skip the game, show me the résumé
      </button>
    </div>
  );
}

export const Journey = () => {
  const outer = useRef<HTMLDivElement>(null);
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [reduced, setReduced] = useState(false);
  const [optIn, setOptIn] = useState(false);
  const active = !!webgl && (!reduced || optIn);

  // game events -> sound
  useEffect(() => {
    let prev = useGame.getState();
    return useGame.subscribe((st) => {
      if (st.collected.length > prev.collected.length) audio.chime(st.collected.length);
      if (st.chapter !== prev.chapter) {
        audio.setChapter(st.chapter);
        if (st.chapter > prev.chapter) audio.level();
      }
      prev = st;
    });
  }, []);

  useEffect(() => {
    if (!active) audio.disable();
  }, [active]);

  useEffect(() => {
    setWebgl(hasWebGL());
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    live.touch = window.matchMedia('(pointer: coarse)').matches;
  }, []);

  // keyboard: ↑/W sail forward, ↓/S sail back (hold to glide). ←/→ / A/D steer (handled by the ship).
  useEffect(() => {
    if (!active) return;
    const held = { fwd: false, back: false };
    let raf = 0;
    let last = 0;
    const typing = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      return !!t && (t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName));
    };
    const inJourney = () => {
      const r = outer.current?.getBoundingClientRect();
      return !!r && r.top < window.innerHeight * 0.5 && r.bottom > window.innerHeight * 0.5;
    };
    const tick = (now: number) => {
      const dt = Math.min((now - (last || now)) / 1000, 0.05);
      last = now;
      const dir = (held.fwd ? 1 : 0) - (held.back ? 1 : 0);
      if (dir) window.scrollBy({ top: dir * dt * window.innerHeight * 1.1, behavior: 'instant' });
      raf = held.fwd || held.back ? requestAnimationFrame(tick) : 0;
      if (!raf) last = 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const down = (e: KeyboardEvent) => {
      if (typing(e) || e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k) && inJourney()) e.preventDefault();
      if (!inJourney()) return;
      if (k === 'arrowup' || k === 'w') held.fwd = true;
      else if (k === 'arrowdown' || k === 's') held.back = true;
      else return;
      kick();
    };
    const up = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === 'arrowup' || k === 'w') held.fwd = false;
      if (k === 'arrowdown' || k === 's') held.back = false;
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      cancelAnimationFrame(raf);
    };
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const onScroll = () => {
      const el = outer.current;
      if (!el) return;
      const total = el.offsetHeight - window.innerHeight;
      const p = Math.min(1, Math.max(0, -el.getBoundingClientRect().top / total));
      live.progress = p;
      const i = chapterIndexAt(p);
      if (useGame.getState().chapter !== i) useGame.getState().setChapter(i);
    };
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      live.useKeys = false;
      live.steer = (e.clientX / window.innerWidth) * 2 - 1;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('pointermove', onPointer);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('pointermove', onPointer);
    };
  }, [active]);

  if (webgl === false) return <Hero />;
  if (webgl && reduced && !optIn)
    return (
      <div className="relative">
        <Hero />
        <button
          onClick={() => setOptIn(true)}
          className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/30 bg-black/50 px-4 py-2 text-sm font-semibold text-white backdrop-blur hover:bg-black/70"
        >
          <Play size={14} /> Play the animated 3D quest
        </button>
      </div>
    );

  return (
    <section
      id="home"
      ref={outer}
      aria-label="Interactive career quest"
      style={{ height: `${SCROLL_HEIGHT_VH}vh` }}
      className="relative bg-[#050816]"
    >
      {/* text version of the whole story for screen readers and crawlers */}
      <div className="sr-only">
        <h1>Abhishek Khatri, Lead Software Engineer</h1>
        {chapters.slice(1).map((c) => (
          <article key={c.id}>
            <h2>
              {c.level}: {c.title} ({c.period})
            </h2>
            <p>{c.place}</p>
            <p>{c.story}</p>
            <ul>
              {c.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {active && <Scene />}
        {/* vignette for legibility */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.45)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />
        <Hud />
        <SkillToast />
        <Card />
        <Hint />
      </div>
    </section>
  );
};
