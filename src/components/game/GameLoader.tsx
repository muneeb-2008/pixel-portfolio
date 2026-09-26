"use client";

import dynamic from "next/dynamic";

// The game owns the whole viewport and needs canvas/window — client only.
const Game = dynamic(() => import("@/components/game/Game"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 flex items-center justify-center bg-[color:var(--frame)]" aria-hidden>
      <p className="pixel text-[0.625rem] text-[color:var(--accent-2)]">Loading world…</p>
    </div>
  ),
});

export function GameLoader() {
  return <Game />;
}
