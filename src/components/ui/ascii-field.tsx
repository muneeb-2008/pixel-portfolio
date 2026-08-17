"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

const RAMP = " ·:+*o#".split("");
const COLS = 68;
const ROWS = 26;

/** Build one frame of a flowing interference pattern as ASCII. */
function frame(phase: number): string {
  const rows: string[] = [];
  for (let y = 0; y < ROWS; y++) {
    let line = "";
    for (let x = 0; x < COLS; x++) {
      const v =
        Math.sin(x * 0.28 + phase) +
        Math.sin(y * 0.42 - phase * 0.7) +
        Math.sin((x + y) * 0.18 + phase * 0.5);
      const t = (v + 3) / 6; // → 0..1
      line += RAMP[Math.min(RAMP.length - 1, Math.max(0, Math.round(t * (RAMP.length - 1))))];
    }
    rows.push(line);
  }
  return rows.join("\n");
}

/** A subtle, self-animating ASCII field. Static under reduced motion. */
export function AsciiField({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const [text, setText] = useState(() => frame(0));
  const ref = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    let phase = 0;
    let last = 0;
    let inView = true;
    const io = new IntersectionObserver(([e]) => (inView = e.isIntersecting));
    if (ref.current) io.observe(ref.current);

    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (!inView || t - last < 70) return; // ~14fps is plenty
      last = t;
      phase += 0.08;
      setText(frame(phase));
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [reduce]);

  return (
    <pre
      ref={ref}
      aria-hidden
      className={`pointer-events-none select-none font-mono leading-[1.05] ${className ?? ""}`}
      style={{
        fontSize: "clamp(9px, 1.15vw, 15px)",
        letterSpacing: "0.12em",
        color: "var(--ink)",
        margin: 0,
        whiteSpace: "pre",
      }}
    >
      {text}
    </pre>
  );
}
