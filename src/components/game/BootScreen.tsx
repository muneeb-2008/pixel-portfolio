"use client";

import { useEffect, useRef, useState } from "react";
import { character } from "@/game/data/character";
import { SpritePortrait } from "./SpritePortrait";
import { useInputModeValue } from "./inputMode";

const TIPS = [
  "Walk up into a glowing door to enter a building.",
  "Press L any time for the Quest Log — every project in one list.",
  "Eight gems are hidden around town. Villagers know a thing or two.",
  "Villagers with a ! have something to tell you.",
  "Hold Shift (or B on touch) to run.",
  "Press N to switch between day and night — the lamps come on after dark.",
  "Step inside the Traveler's Rest and use the computer to learn about Muneeb.",
  "Level up by discovering projects, gems and stories.",
];

const MIN_MS = 1600; // long enough to read, short enough to never feel slow
const SEGMENTS = 20;

/**
 * Boot / loading screen. Shows real asset progress (fonts, world, sprites),
 * eased so it never jumps, then waits for "press any key" — which is also the
 * user gesture that unlocks audio.
 */
export function BootScreen({ progress, onContinue }: { progress: number; onContinue: () => void }) {
  const touch = useInputModeValue() === "touch";
  const [t0] = useState(() => performance.now());
  const [shown, setShown] = useState(0);
  const [tip, setTip] = useState(0);
  const btnRef = useRef<HTMLButtonElement>(null);
  const ready = shown >= 1;

  // eased display progress: never ahead of reality, never faster than MIN_MS
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const timeCap = Math.min(1, (performance.now() - t0) / MIN_MS);
      setShown((cur) => {
        const target = Math.min(progress, timeCap);
        const next = cur + (target - cur) * 0.18;
        return target >= 1 && next > 0.99 ? 1 : next;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progress, t0]);

  useEffect(() => {
    const id = window.setInterval(() => setTip((i) => (i + 1) % TIPS.length), 2600);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!ready) return;
    btnRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Tab" || e.metaKey || e.ctrlKey || e.altKey) return;
      e.preventDefault();
      onContinue();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ready, onContinue]);

  const lit = Math.round(shown * SEGMENTS);

  return (
    // my-auto (not justify-center) so content stays scrollable on very short screens
    <div className="fixed inset-0 z-[70] flex flex-col items-center overflow-y-auto bg-[color:var(--bg)] px-6 py-10 [@media(max-height:560px)]:py-4">
      <div className="scanlines absolute inset-0" aria-hidden />

      <div className="relative my-auto flex w-full max-w-md flex-col items-center text-center">
        <div className="bob well p-2 [@media(max-height:560px)]:hidden">
          <SpritePortrait palette={character.palette} scale={4} />
        </div>
        <p className="t-ui mt-6 text-[0.8125rem] text-[color:var(--text-3)] [@media(max-height:560px)]:mt-0">{character.name} presents</p>
        <p className="t-logo mt-4 text-[60px] sm:text-[80px] [@media(max-height:560px)]:text-[50px]" aria-hidden>
          Pixel Portfolio
        </p>

        <div className="mt-10 w-full [@media(max-height:560px)]:mt-5" role="progressbar" aria-label="Loading world" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(shown * 100)}>
          <div className="mb-2 flex items-baseline justify-between">
            <span className="t-ui text-[0.75rem] text-[color:var(--text-2)]">{ready ? "World ready" : "Loading world"}</span>
            <span className="t-display text-[1.5rem] text-[color:var(--gold)]">{Math.round(shown * 100)}%</span>
          </div>
          <div className="well flex gap-[3px] p-[3px]">
            {Array.from({ length: SEGMENTS }, (_, i) => (
              <span
                key={i}
                className="h-4 flex-1"
                style={{
                  background: i < lit ? "var(--gold)" : "#140e0b",
                  boxShadow: i < lit ? "inset 0 3px 0 var(--gold-hi), inset 0 -3px 0 var(--gold-lo)" : "none",
                }}
              />
            ))}
          </div>
        </div>

        <div className="mt-8 flex min-h-[4.5rem] items-center [@media(max-height:560px)]:mt-4">
          {ready ? (
            <button ref={btnRef} type="button" onClick={onContinue} className="btn btn-lg blink">
              {touch ? "Tap to start" : "Press any key"}
            </button>
          ) : (
            <p className="t-body max-w-sm text-[1rem] text-[color:var(--text-2)]" aria-live="polite">
              <span className="t-ui mr-2 text-[0.75rem] text-[color:var(--gold)]">Tip</span>
              {TIPS[tip]}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
