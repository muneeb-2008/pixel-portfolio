/**
 * Tiny chiptune SFX synthesised with WebAudio — no audio files to load.
 * The context is created lazily on the first user gesture (autoplay rules).
 */
type Sfx = "blip" | "select" | "confirm" | "back" | "door" | "gem" | "level" | "achieve" | "step" | "open";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let enabled = true;

const PREF = "pixel-portfolio:sound";

export function initSound() {
  try {
    enabled = window.localStorage.getItem(PREF) !== "off";
  } catch {
    /* default on */
  }
  return enabled;
}

export function soundEnabled() {
  return enabled;
}

export function setSound(on: boolean) {
  enabled = on;
  try {
    window.localStorage.setItem(PREF, on ? "on" : "off");
  } catch {
    /* ignore */
  }
  if (on) play("confirm");
}

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.18;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

/** Unlock audio from inside a user gesture (first key / tap). */
export function unlockAudio() {
  ac();
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = "square", vol = 1, slideTo?: number) {
  const c = ac();
  if (!c || !master) return;
  const t = c.currentTime + start;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(master);
  o.start(t);
  o.stop(t + dur + 0.02);
}

function noise(start: number, dur: number, vol = 0.4) {
  const c = ac();
  if (!c || !master) return;
  const t = c.currentTime + start;
  const buf = c.createBuffer(1, Math.floor(c.sampleRate * dur), c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
  const src = c.createBufferSource();
  src.buffer = buf;
  const f = c.createBiquadFilter();
  f.type = "lowpass";
  f.frequency.value = 900;
  const g = c.createGain();
  g.gain.value = vol;
  src.connect(f).connect(g).connect(master);
  src.start(t);
}

export function play(s: Sfx) {
  if (!enabled) return;
  switch (s) {
    case "blip":
      tone(880 + Math.random() * 60, 0, 0.03, "square", 0.25);
      break;
    case "select":
      tone(660, 0, 0.05, "square", 0.5);
      break;
    case "confirm":
      tone(784, 0, 0.06, "square", 0.6);
      tone(1175, 0.06, 0.09, "square", 0.6);
      break;
    case "back":
      tone(523, 0, 0.06, "square", 0.5);
      tone(392, 0.06, 0.08, "square", 0.5);
      break;
    case "open":
      tone(392, 0, 0.05, "triangle", 0.8);
      tone(587, 0.05, 0.08, "triangle", 0.8);
      break;
    case "door":
      noise(0, 0.12, 0.35);
      tone(220, 0.02, 0.18, "triangle", 0.7, 440);
      break;
    case "gem":
      [1047, 1319, 1568, 2093].forEach((f, i) => tone(f, i * 0.055, 0.1, "square", 0.45));
      break;
    case "level":
      [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone(f, i * 0.09, 0.14, "square", 0.55));
      break;
    case "achieve":
      [784, 988, 1175, 1568].forEach((f, i) => tone(f, i * 0.08, 0.16, "triangle", 0.8));
      break;
    case "step":
      noise(0, 0.035, 0.08);
      break;
  }
}
