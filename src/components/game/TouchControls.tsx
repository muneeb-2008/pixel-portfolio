"use client";

import type { InputKey } from "@/game/engine";

/**
 * On-screen D-pad + action button. Shown for touch input at ANY width
 * (phones, landscape phones, tablets) — the parent decides visibility.
 */
export function TouchControls({
  onDir,
  onAction,
}: {
  onDir: (key: InputKey, on: boolean) => void;
  onAction: () => void;
}) {
  const hold = (key: InputKey) => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault();
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
      onDir(key, true);
    },
    onPointerUp: (e: React.PointerEvent) => {
      e.preventDefault();
      onDir(key, false);
    },
    onPointerLeave: () => onDir(key, false),
    onPointerCancel: () => onDir(key, false),
    onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
  });

  const arrow = (d: "up" | "down" | "left" | "right") => {
    const rot = { up: 0, right: 90, down: 180, left: 270 }[d];
    return (
      <svg viewBox="0 0 7 4" width={21} height={12} fill="currentColor" shapeRendering="crispEdges" style={{ transform: `rotate(${rot}deg)` }} aria-hidden>
        <rect x={3} y={0} width={1} height={1} />
        <rect x={2} y={1} width={3} height={1} />
        <rect x={1} y={2} width={5} height={1} />
        <rect x={0} y={3} width={7} height={1} />
      </svg>
    );
  };

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex items-end justify-between p-4"
      style={{
        paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
        paddingLeft: "max(1rem, env(safe-area-inset-left))",
        paddingRight: "max(1rem, env(safe-area-inset-right))",
      }}
    >
      <div className="pointer-events-auto grid grid-cols-3 grid-rows-3" style={{ touchAction: "none" }}>
        <span />
        <button type="button" aria-label="Up" className="dpad-btn" {...hold("up")}>
          {arrow("up")}
        </button>
        <span />
        <button type="button" aria-label="Left" className="dpad-btn" {...hold("left")}>
          {arrow("left")}
        </button>
        <span className="m-2 bg-[color:var(--ink)] opacity-60" />
        <button type="button" aria-label="Right" className="dpad-btn" {...hold("right")}>
          {arrow("right")}
        </button>
        <span />
        <button type="button" aria-label="Down" className="dpad-btn" {...hold("down")}>
          {arrow("down")}
        </button>
        <span />
      </div>

      <button
        type="button"
        aria-label="Action — interact with what's nearby"
        onPointerDown={(e) => {
          e.preventDefault();
          onAction();
        }}
        className="a-btn pointer-events-auto"
      >
        A
      </button>
    </div>
  );
}
