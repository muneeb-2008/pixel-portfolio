"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { play } from "@/game/audio";
import { SpritePortrait } from "./SpritePortrait";
import { useInputModeValue } from "./inputMode";
import type { HatKind, Palette } from "@/game/types";

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Input arriving this soon after the box opens is a carry-over press — ignore it. */
const OPEN_GUARD_MS = 250;

type LineHandle = { skip: () => void; isComplete: () => boolean };

/** One line, keyed by index so it mounts fresh — no setState-in-effect resets. */
const TypeLine = forwardRef<LineHandle, { text: string }>(function TypeLine({ text }, ref) {
  const reduce = prefersReduced();
  const [shown, setShown] = useState(reduce ? text.length : 0);
  const complete = shown >= text.length;

  useImperativeHandle(
    ref,
    () => ({ skip: () => setShown(text.length), isComplete: () => shown >= text.length }),
    [shown, text.length],
  );

  useEffect(() => {
    if (reduce) return;
    let n = 0;
    const id = window.setInterval(() => {
      n++;
      if (n % 3 === 0 && text[n] && text[n] !== " ") play("blip");
      setShown((s) => {
        if (s + 1 >= text.length) {
          window.clearInterval(id);
          return text.length;
        }
        return s + 1;
      });
    }, 24);
    return () => window.clearInterval(id);
  }, [text, reduce]);

  return (
    <p aria-hidden className="t-body text-[1.125rem] leading-relaxed break-words text-[color:var(--text)] sm:text-[1.25rem]">
      {text.slice(0, shown)}
      <span className="text-transparent">{text.slice(shown)}</span>
      {complete && (
        <svg viewBox="0 0 5 3" width={15} height={9} className="blink ml-2 inline-block align-middle text-[color:var(--gold)]" fill="currentColor" shapeRendering="crispEdges">
          <rect x={0} y={0} width={5} height={1} />
          <rect x={1} y={1} width={3} height={1} />
          <rect x={2} y={2} width={1} height={1} />
        </svg>
      )}
    </p>
  );
});

export function DialogueBox({
  speaker,
  role,
  lines,
  portrait,
  onDone,
}: {
  speaker: string;
  role?: string;
  lines: string[];
  portrait?: { palette: Palette; hat: HatKind };
  onDone: () => void;
}) {
  const touch = useInputModeValue() === "touch";
  const [idx, setIdx] = useState(0);
  const lineRef = useRef<LineHandle>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const openedAt = useRef(0);

  useEffect(() => {
    openedAt.current = performance.now();
    boxRef.current?.focus({ preventScroll: true });
    play("open");
  }, []);

  const advance = useCallback(() => {
    if (performance.now() - openedAt.current < OPEN_GUARD_MS) return;
    const h = lineRef.current;
    if (h && !h.isComplete()) {
      h.skip();
      return;
    }
    play("select");
    if (idx < lines.length - 1) setIdx((i) => i + 1);
    else onDone();
  }, [idx, lines.length, onDone]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // keep keyboard focus inside the conversation (Skip ↔ Next)
      if (e.key === "Tab") {
        const btns = [...(boxRef.current?.querySelectorAll<HTMLButtonElement>("button") ?? [])];
        if (!btns.length) return;
        e.preventDefault();
        const i = btns.indexOf(document.activeElement as HTMLButtonElement);
        const next = e.shiftKey ? (i <= 0 ? btns.length - 1 : i - 1) : (i + 1) % btns.length;
        btns[next].focus();
        return;
      }
      if (e.key !== "Enter" && e.key !== " " && e.key !== "Escape") return;
      // a focused button (Next / Skip) handles Enter itself — don't double-advance
      if (e.key !== "Escape" && (e.target as HTMLElement)?.closest?.("button")) return;
      e.preventDefault();
      if (e.repeat) return; // a held key must not speed-run the conversation
      if (e.key === "Escape") {
        play("back");
        onDone();
      } else advance();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [advance, onDone]);

  const last = idx === lines.length - 1;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-3 sm:px-6 sm:pb-6"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <div className="pointer-events-auto relative w-full max-w-3xl pt-5">
        {/* nameplate tab */}
        <div className="absolute left-4 top-0 z-10 flex items-center gap-2 border-2 border-[color:var(--ink)] bg-[color:var(--panel-3)] px-3 py-1 shadow-[0_3px_0_rgba(0,0,0,0.45)]">
          <span className="t-ui text-[0.875rem] font-bold text-[color:var(--gold)]">{speaker}</span>
          {role && <span className="t-ui text-[0.75rem] text-[color:var(--text-2)]">{role}</span>}
        </div>

        <div
          ref={boxRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Conversation with ${speaker}`}
          tabIndex={-1}
          onClick={advance}
          className="panel pop flex cursor-pointer items-start gap-4 px-3 pb-3 pt-5 text-left outline-none sm:px-5"
        >
          {portrait && (
            <div className="well hidden shrink-0 p-1 min-[420px]:block">
              <SpritePortrait palette={portrait.palette} hat={portrait.hat} scale={4} />
            </div>
          )}
          <div className="min-w-0 flex-1">
            {/* screen readers get the whole line at once, not letter-by-letter */}
            <p className="sr-only" aria-live="polite">
              {speaker}: {lines[idx]}
            </p>
            <TypeLine key={idx} ref={lineRef} text={lines[idx] ?? ""} />
            <div className="mt-3 flex items-center justify-between gap-2">
              <span className="flex gap-1" aria-label={`Line ${idx + 1} of ${lines.length}`}>
                {lines.map((_, i) => (
                  <span key={i} className="h-2 w-2 border border-[color:var(--ink)]" style={{ background: i <= idx ? "var(--gold)" : "var(--panel-2)" }} />
                ))}
              </span>
              <span className="flex gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    play("back");
                    onDone();
                  }}
                  className="btn btn-wood"
                >
                  Skip
                  {!touch && (
                    <span className="kbd" aria-hidden>
                      Esc
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    advance();
                  }}
                  className="btn"
                >
                  {last ? "Continue" : "Next"}
                  {!touch && (
                    <span className="kbd" aria-hidden>
                      Enter
                    </span>
                  )}
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
