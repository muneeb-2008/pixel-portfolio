"use client";

import { useEffect } from "react";
import { character } from "@/game/data/character";
import { SpritePortrait } from "./SpritePortrait";
import { PixelIcon, type IconName } from "./PixelIcon";
import { useInputModeValue } from "./inputMode";
import { play, type Sfx } from "@/game/audio";

/**
 * Top HUD.
 *   Left: player card (portrait, name, LV + XP bar, ★ projects, ◆ gems) → Quest Log,
 *         and the minimap on screens with room for it.
 *   Right: Quest / Stats / Mail / Menu icon buttons (labels from lg up).
 */
export function Hud({
  level,
  xpInto,
  xpNeed,
  found,
  total,
  gems,
  gemTotal,
  onLog,
  onSheet,
  onContact,
  onMenu,
  night,
  onToggleNight,
  minimapRef,
}: {
  level: number;
  xpInto: number;
  xpNeed: number;
  found: number;
  total: number;
  gems: number;
  gemTotal: number;
  onLog: () => void;
  onSheet: () => void;
  onContact: () => void;
  onMenu: () => void;
  night: boolean;
  onToggleNight: () => void;
  minimapRef: (el: HTMLCanvasElement | null) => void;
}) {
  const buttons: { icon: IconName; label: string; aria: string; key: string; onClick: () => void; optional?: boolean }[] = [
    { icon: "book", label: "Quests", aria: "Quest Log", key: "L", onClick: onLog, optional: true },
    { icon: "person", label: "Profile", aria: "Player Profile", key: "C", onClick: onSheet, optional: true },
    { icon: "mail", label: "Contact", aria: "Contact", key: "M", onClick: onContact },
    { icon: night ? "moon" : "sun", label: night ? "Night" : "Day", aria: `Time of day: ${night ? "night" : "day"}. Switch to ${night ? "day" : "night"}`, key: "N", onClick: onToggleNight, optional: true },
    { icon: "menu", label: "Menu", aria: "Menu", key: "Esc", onClick: onMenu },
  ];

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-30 flex items-start justify-between gap-2 p-2 sm:p-4"
      style={{ paddingTop: "max(0.5rem, env(safe-area-inset-top))" }}
    >
      <div className="pointer-events-auto flex flex-col gap-2">
        <button
          type="button"
          onClick={onLog}
          className="panel slide-down flex items-center gap-3 px-1.5 py-1 text-left"
          aria-label={`Your explorer level ${level}. ${found} of ${total} projects, ${gems} of ${gemTotal} gems. Open Quest Log.`}
        >
          <span className="well hidden p-0.5 sm:block">
            <SpritePortrait palette={character.palette} scale={2} />
          </span>
          <span className="flex min-w-0 flex-col gap-1">
            <span className="flex items-center gap-2">
              <span className="t-ui hidden text-[0.75rem] text-[color:var(--text-2)] sm:inline">Explorer</span>
              <span className="t-ui bg-[color:var(--gold)] px-1.5 py-px text-[0.75rem] font-bold text-[#2a1a0c]">
                LV {level}
              </span>
            </span>
            <span className="meter w-24 sm:w-32" aria-hidden>
              <span style={{ width: `${(xpInto / xpNeed) * 100}%` }} />
            </span>
            <span className="t-ui flex items-center gap-3 text-[0.75rem]">
              <span className="flex items-center gap-1 text-[color:var(--gold)]">
                <PixelIcon name="star" px={1.5} /> {found}/{total}
              </span>
              <span className="flex items-center gap-1 text-[color:var(--sky)]">
                <PixelIcon name="gem" px={1.5} /> {gems}/{gemTotal}
              </span>
            </span>
          </span>
        </button>

        <div className="panel hidden self-start p-0.5 md:block [@media(max-height:560px)]:hidden" aria-hidden>
          <canvas ref={minimapRef} className="block h-auto w-[162px]" />
        </div>
      </div>

      <nav className="pointer-events-auto flex gap-1.5 sm:gap-2" aria-label="Game menu">
        {buttons.map((b) => (
          <button
            key={b.label}
            type="button"
            onClick={b.onClick}
            className={`btn btn-wood btn-icon ${b.optional ? "hud-opt" : ""}`}
            aria-label={b.aria}
            title={`${b.aria} (${b.key})`}
          >
            <PixelIcon name={b.icon} />
            <span className="hidden lg:inline">{b.label}</span>
            <span className="kbd" aria-hidden>
              {b.key}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}

/** Contextual prompt for whatever is in reach; also a tap/click target itself. */
export function NearPrompt({ verb, label, onActivate }: { verb: string; label: string; onActivate: () => void }) {
  const touch = useInputModeValue() === "touch";
  return (
    <div className={`pointer-events-none fixed inset-x-0 z-30 flex justify-center px-3 ${touch ? "bottom-[13.5rem] [@media(max-height:560px)]:bottom-3" : "bottom-6"}`}>
      <button type="button" onClick={onActivate} className="panel pop pointer-events-auto flex max-w-full items-center gap-3 px-2 py-1 text-left">
        <span className="t-ui shrink-0 bg-[color:var(--gold)] px-2 py-1 text-[0.75rem] font-bold text-[#2a1a0c]">
          {touch ? "A" : "Enter"}
        </span>
        <span className="min-w-0">
          <span className="t-ui block text-[0.75rem] text-[color:var(--gold)]">{verb}</span>
          <span className="t-body block truncate text-[1rem] text-[color:var(--text)]">{label}</span>
        </span>
      </button>
    </div>
  );
}

export type ToastMsg = {
  id: number;
  icon: IconName;
  title: string;
  sub?: string;
  tone?: "gold" | "sky" | "moss";
  /** played the moment the toast actually appears */
  sound?: Sfx;
  /** onboarding-style hints: skip if not shown within a few seconds */
  ephemeral?: boolean;
  at?: number;
};

/**
 * One toast at a time, top-centre, auto-advancing. The parent passes null while a
 * panel is open, so toasts queue instead of covering what the player is reading.
 * The live region stays mounted so screen readers reliably announce new toasts.
 */
export function ToastView({ toast, onDone }: { toast: ToastMsg | null; onDone: () => void }) {
  useEffect(() => {
    if (!toast) return;
    // an onboarding hint that couldn't show in time is dropped, not shown late
    if (toast.ephemeral && Date.now() - (toast.at ?? 0) > 6000) {
      onDone();
      return;
    }
    if (toast.sound) play(toast.sound);
    const id = window.setTimeout(onDone, 3600);
    return () => window.clearTimeout(id);
  }, [toast, onDone]);
  const color = toast?.tone === "sky" ? "var(--sky)" : toast?.tone === "moss" ? "var(--moss)" : "var(--gold)";
  return (
    <div className="pointer-events-none fixed inset-x-0 top-[6.75rem] z-40 flex justify-center px-3 md:top-[5.5rem]" role="status" aria-live="polite">
      {toast && (
        <div key={toast.id} className="panel slide-down pointer-events-auto flex max-w-md items-center gap-3 px-2 py-1">
          <span className="well grid h-11 w-11 shrink-0 place-items-center" style={{ color }}>
            <PixelIcon name={toast.icon} px={3} />
          </span>
          <span className="min-w-0 pr-1">
            <span className="t-ui block text-[0.8125rem] font-bold" style={{ color }}>
              {toast.title}
            </span>
            {toast.sub && <span className="t-body block text-[1rem] text-[color:var(--text-2)]">{toast.sub}</span>}
          </span>
        </div>
      )}
    </div>
  );
}

/** Big centre-screen "LEVEL UP" moment, on its own plate. */
export function LevelBanner({ level, onDone }: { level: number | null; onDone: () => void }) {
  useEffect(() => {
    if (level === null) return;
    play("level");
    const id = window.setTimeout(onDone, 2600);
    return () => window.clearTimeout(id);
  }, [level, onDone]);
  return (
    <div className="pointer-events-none fixed inset-0 z-[46] grid place-items-center" role="status" aria-live="assertive">
      {level !== null && (
        <div key={level} className="banner panel px-8 py-5 text-center">
          <p className="t-logo text-[60px] sm:text-[80px]">Level up!</p>
          <p className="t-ui mt-3 text-[1rem] text-[color:var(--gold-hi)]">You are now LV {level}</p>
        </div>
      )}
    </div>
  );
}

/** Iris wipe centred on the player — closes, runs `onMid`, reopens. */
export function Iris({ x, y, onMid, onEnd }: { x: number; y: number; onMid: () => void; onEnd: () => void }) {
  return (
    <div
      className="iris-anim pointer-events-none fixed inset-0 z-[45]"
      style={{ ["--ix" as string]: `${x}px`, ["--iy" as string]: `${y}px` }}
      onAnimationIteration={onMid}
      onAnimationEnd={onEnd}
      aria-hidden
    />
  );
}
