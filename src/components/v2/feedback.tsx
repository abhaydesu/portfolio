"use client";

import { useEffect } from "react";

/*
 * Click feedback for the whole page: a small burst of ink where you press,
 * and a soft tick when what you pressed does something.
 *
 *  sparks  thin rays burst out of the pointer and shrink away. they take the
 *          colour of what was pressed (a hobby's ink, a word's accent), go
 *          pale on the velvet, and stay grey everywhere else
 *  sound   no audio files: one tiny synthesized tick, a soft sine falling
 *          from 520 to 340Hz over ~50ms, the same for every control (the
 *          day/night switch alone clicks like a wall switch, see flick)
 *
 * Links and buttons tick, as does anything marked data-sound (e.g. a
 * clickable backdrop; the attribute's value also notes what the click
 * means: "open", "close"…). Clicks on plain page are silent.
 * The sound is always on; sparks are skipped under reduced motion.
 */

/* ---------- sound ---------- */

let ctx: AudioContext | null = null;
const audio = () => {
  const AC =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AC) return null;
  ctx ??= new AC();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
};

// a pitch sweep with a click-free envelope: up in ~4ms, then an exponential fall
function chirp(
  ac: AudioContext,
  {
    from,
    to,
    type,
    gain,
    duration,
  }: {
    from: number;
    to: number;
    type: OscillatorType;
    gain: number;
    duration: number;
  },
) {
  const t = ac.currentTime + 0.005;
  const osc = ac.createOscillator();
  const amp = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, t);
  osc.frequency.exponentialRampToValueAtTime(to, t + duration);
  amp.gain.setValueAtTime(0.0001, t);
  amp.gain.exponentialRampToValueAtTime(gain, t + 0.004);
  amp.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  osc.connect(amp).connect(ac.destination);
  osc.onended = () => osc.disconnect();
  osc.start(t);
  osc.stop(t + duration + 0.015);
}

// the one sound: a soft downward tick
function tick() {
  const ac = audio();
  if (ac)
    chirp(ac, { from: 520, to: 340, type: "sine", gain: 0.1, duration: 0.052 });
}

/*
 * A wall switch, for day and night: one hard contact snap, a few ms of noise
 * band-passed high. Flicked up it sits a little higher than flicked down, as
 * real ones do.
 */
let noise: AudioBuffer | null = null;
function snap(
  ac: AudioContext,
  at: number,
  hz: number,
  gain: number,
  len: number,
) {
  if (!noise) {
    noise = ac.createBuffer(1, Math.ceil(ac.sampleRate * 0.05), ac.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  const src = ac.createBufferSource();
  const band = ac.createBiquadFilter();
  const amp = ac.createGain();
  src.buffer = noise;
  band.type = "bandpass";
  band.frequency.value = hz;
  band.Q.value = 1.4;
  amp.gain.setValueAtTime(gain, at);
  amp.gain.exponentialRampToValueAtTime(0.0001, at + len);
  src.connect(band).connect(amp).connect(ac.destination);
  src.onended = () => src.disconnect();
  src.start(at);
  src.stop(at + len + 0.01);
}

export function flick(up: boolean) {
  const ac = audio();
  if (!ac) return;
  const t = ac.currentTime + 0.005;
  snap(ac, t, 3200 * (up ? 1 : 0.84), 0.4, 0.016);
}

/*
 * Hinata's spike (see haikyu-spike.tsx): a deep thud as he stomps into the
 * jump, and a sharp slap with a low knock under it when he hits the ball
 */
export function boom() {
  const ac = audio();
  if (!ac) return;
  chirp(ac, { from: 120, to: 42, type: "sine", gain: 0.24, duration: 0.2 });
  snap(ac, ac.currentTime + 0.005, 320, 0.3, 0.08);
}

export function thwack() {
  const ac = audio();
  if (!ac) return;
  snap(ac, ac.currentTime + 0.005, 2400, 0.45, 0.035);
  chirp(ac, { from: 260, to: 90, type: "sine", gain: 0.16, duration: 0.09 });
}

// the switch makes its own sound (flick), so it's left out here
const ticks = (target: Element) =>
  !target.closest(
    "[disabled], [aria-disabled='true'], [data-sound='switch']",
  ) && !!target.closest("[data-sound], a[href], button, [role='button']");

/* ---------- sparks ---------- */

type Burst = { x: number; y: number; t: number; color: string; turn: number };

const RAYS = 7;
const REACH = 16; // px the rays travel
const LENGTH = 7; // px each ray starts at, shrinking to nothing
const LIFE = 340; // ms
const easeOut = (t: number) => t * (2 - t);

function sparkColor(target: Element) {
  if (target.closest("[data-velvet]")) return "rgba(255, 255, 255, 0.55)";
  const cs = getComputedStyle(target);
  const ink =
    cs.getPropertyValue("--ink").trim() ||
    cs.getPropertyValue("--accent").trim();
  return ink || "rgba(26, 26, 26, 0.32)";
}

/* ---------- the component ---------- */

export const ClickFeedback = () => {
  useEffect(() => {
    // sparks: one canvas over the page, drawn only while bursts are alive
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText =
      "position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:9999";
    document.body.append(canvas);
    const g = canvas.getContext("2d")!;
    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(innerWidth * dpr);
      canvas.height = Math.round(innerHeight * dpr);
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();

    const bursts: Burst[] = [];
    let raf = 0;
    const frame = (now: number) => {
      g.clearRect(0, 0, innerWidth, innerHeight);
      for (let i = bursts.length - 1; i >= 0; i--) {
        const b = bursts[i];
        const p = (now - b.t) / LIFE;
        if (p >= 1) {
          bursts.splice(i, 1);
          continue;
        }
        const e = easeOut(p);
        const r = 4 + e * REACH;
        const len = LENGTH * (1 - e);
        g.globalAlpha = 1 - e;
        g.strokeStyle = b.color;
        g.lineWidth = 1.35;
        g.lineCap = "round";
        g.beginPath();
        for (let k = 0; k < RAYS; k++) {
          const a = b.turn + (Math.PI * 2 * k) / RAYS;
          g.moveTo(b.x + r * Math.cos(a), b.y + r * Math.sin(a));
          g.lineTo(
            b.x + (r + len) * Math.cos(a),
            b.y + (r + len) * Math.sin(a),
          );
        }
        g.stroke();
      }
      raf = bursts.length ? requestAnimationFrame(frame) : 0;
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lastSound = 0;

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0 || !(e.target instanceof Element)) return;
      const target = e.target;

      if (
        !reduced.matches &&
        !target.closest("[disabled], [aria-disabled='true']")
      ) {
        // a random twist per burst, so no two look stamped
        bursts.push({
          x: e.clientX,
          y: e.clientY,
          t: performance.now(),
          color: sparkColor(target),
          turn: Math.random() * Math.PI,
        });
        raf ||= requestAnimationFrame(frame);
      }

      const now = performance.now();
      if (ticks(target) && now - lastSound > 25) {
        lastSound = now;
        tick();
      }
    };

    // keyboard presses on controls sound too (no sparks: there's no pointer)
    const onKey = (e: KeyboardEvent) => {
      if (
        (e.key !== "Enter" && e.key !== " ") ||
        e.repeat ||
        !(e.target instanceof Element)
      )
        return;
      if (!e.target.closest("button, a[href], [role='button']")) return;
      if (ticks(e.target)) tick();
    };

    window.addEventListener("pointerdown", onDown, {
      passive: true,
      capture: true,
    });
    window.addEventListener("keydown", onKey, true);
    window.addEventListener("resize", size);
    return () => {
      window.removeEventListener("pointerdown", onDown, true);
      window.removeEventListener("keydown", onKey, true);
      window.removeEventListener("resize", size);
      cancelAnimationFrame(raf);
      canvas.remove();
    };
  }, []);

  return null;
};
