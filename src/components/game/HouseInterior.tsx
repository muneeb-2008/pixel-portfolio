"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { spriteCanvas } from "@/game/render";
import { buildRoom, HOTSPOTS, isOnMat, ROOM_COLS, ROOM_LIGHTS, ROOM_ROWS, ROOM_SPAWN, roomSolid, RT, type Hotspot } from "@/game/interior";
import { play } from "@/game/audio";
import type { AnimFrame, Dir, Palette } from "@/game/types";
import { about } from "@/game/data/about";
import { character } from "@/game/data/character";
import { DialogueBox } from "./DialogueBox";
import { Modal } from "./Modal";
import { NearPrompt } from "./Hud";
import { TouchControls } from "./TouchControls";
import { PixelIcon } from "./PixelIcon";
import { useInputModeValue } from "./inputMode";

/** Where the player stood last time — so returning from a panel doesn't reset the room. */
const last = { x: ROOM_SPAWN.x, y: ROOM_SPAWN.y, dir: "up" as Dir };

const KEY: Record<string, "up" | "down" | "left" | "right"> = {
  arrowup: "up", w: "up", arrowdown: "down", s: "down", arrowleft: "left", a: "left", arrowright: "right", d: "right",
};

type Sub = null | { type: "text"; speaker: string; role?: string; lines: string[] } | { type: "pc" };

/**
 * The Traveler's Rest interior. A tiny self-contained game loop: walk around
 * the room, use the PC (About), read the bookshelf (loadout), look at the
 * trophy cabinet (achievements), rest, and step on the mat to leave.
 */
export function HouseInterior({
  palette,
  night,
  trophies,
  trophyTotal,
  onReadAbout,
  onProfile,
  onQuestLog,
  onContact,
  onExit,
}: {
  palette: Palette;
  night: boolean;
  trophies: number;
  trophyTotal: number;
  onReadAbout: () => void;
  onProfile: () => void;
  onQuestLog: () => void;
  onContact: () => void;
  onExit: () => void;
}) {
  const touch = useInputModeValue() === "touch";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [sub, setSub] = useState<Sub>(null);
  const subRef = useRef<Sub>(null);
  const [near, setNear] = useState<Hotspot | null>(null);
  const nearRef = useRef<Hotspot | null>(null);
  const input = useRef({ up: false, down: false, left: false, right: false, run: false });
  const exitRef = useRef(onExit);
  useEffect(() => {
    exitRef.current = onExit;
  }, [onExit]);
  useEffect(() => {
    subRef.current = sub;
    input.current = { up: false, down: false, left: false, right: false, run: false };
  }, [sub]);

  const activate = useCallback(
    (h: Hotspot) => {
      play("open");
      if (h.id === "pc") {
        onReadAbout();
        setSub({ type: "pc" });
      } else if (h.id === "books") {
        const loadout = character.profile.find((r) => r.label === "Loadout")?.value ?? "";
        setSub({
          type: "text",
          speaker: "Bookshelf",
          lines: ["Well-thumbed books line the shelves.", `On the spines: ${loadout}.`, "A sticky note on one reads: “Solve the right problem first.”"],
        });
      } else if (h.id === "trophies") {
        setSub({
          type: "text",
          speaker: "Trophy cabinet",
          lines: [`${trophies} of ${trophyTotal} trophies on display.`, trophies === trophyTotal ? "Every shelf is full. Legendary." : "Plenty of empty space left — explore the town to fill it."],
        });
      } else if (h.id === "bed") {
        setSub({ type: "text", speaker: "Bed", lines: ["A cosy bed. Even designers need sleep.", "…ZZZ… You feel refreshed!"] });
      } else {
        setSub({ type: "text", speaker: "Window", lines: [night ? "The town sleeps under a sky full of stars." : "Sunlight pours over the rooftops of the town."] });
      }
    },
    [night, onReadAbout, trophies, trophyTotal],
  );
  const activateRef = useRef(activate);
  useEffect(() => {
    activateRef.current = activate;
  }, [activate]);

  // ---- game loop
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d")!;
    const room = buildRoom(night);
    const solid = roomSolid();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const p = { x: last.x, y: last.y, dir: last.dir, phase: 0, t: 0, step: 0 as AnimFrame };
    let raf = 0;
    let prev = performance.now();
    let time = 0;
    let armed = false; // don't exit on the frame we arrive

    const blocked = (x: number, y: number) => {
      const pts = [
        [x + 4, y + 15], [x + 11, y + 15], [x + 4, y + 21], [x + 11, y + 21],
      ];
      return pts.some(([fx, fy]) => {
        const tx = Math.floor(fx / RT);
        const ty = Math.floor(fy / RT);
        if (tx < 0 || tx >= ROOM_COLS || ty < 0) return true;
        if (ty >= ROOM_ROWS) return !(fx > 4.5 * RT && fx < 7.5 * RT); // only the mat opening
        return solid[tx][ty];
      });
    };

    const fit = () => {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.floor(r.width * dpr);
      cv.height = Math.floor(r.height * dpr);
    };
    fit();
    window.addEventListener("resize", fit);

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      time += dt;
      const inp = input.current;
      const paused = subRef.current !== null;
      const ix = paused ? 0 : (inp.right ? 1 : 0) - (inp.left ? 1 : 0);
      const iy = paused ? 0 : (inp.down ? 1 : 0) - (inp.up ? 1 : 0);
      const moving = ix !== 0 || iy !== 0;
      if (moving) {
        p.dir = Math.abs(iy) >= Math.abs(ix) ? (iy > 0 ? "down" : "up") : ix > 0 ? "right" : "left";
        const sp = 90 * (inp.run ? 1.75 : 1) * dt * (ix && iy ? Math.SQRT1_2 : 1);
        if (!blocked(p.x + ix * sp, p.y)) p.x += ix * sp;
        if (!blocked(p.x, p.y + iy * sp)) p.y += iy * sp;
        p.t += dt;
        const beat = inp.run ? 0.075 : 0.11;
        if (p.t >= beat) {
          p.t -= beat;
          p.phase = (p.phase + 1) % 4;
        }
        p.step = ([1, 0, 3, 0] as AnimFrame[])[p.phase];
      } else p.step = 0;
      last.x = p.x;
      last.y = p.y;
      last.dir = p.dir;

      const fx = p.x + 7.5;
      const fy = p.y + 18;
      if (!isOnMat(fx, fy)) armed = true;
      if (armed && !paused && isOnMat(fx, fy)) {
        armed = false;
        last.x = ROOM_SPAWN.x;
        last.y = ROOM_SPAWN.y;
        last.dir = "up";
        exitRef.current();
        return;
      }
      let best: Hotspot | null = null;
      let bd = 22;
      for (const h of HOTSPOTS) {
        const d = Math.hypot(h.x - fx, h.y - fy);
        if (d < bd) {
          bd = d;
          best = h;
        }
      }
      if (best?.id !== nearRef.current?.id) {
        nearRef.current = best;
        setNear(best);
      }

      // ---- draw: room centred, integer scale
      const s = Math.max(1, Math.floor(Math.min(cv.width / (ROOM_COLS * RT + 16), cv.height / (ROOM_ROWS * RT + 40))));
      const ox = Math.floor((cv.width - ROOM_COLS * RT * s) / 2);
      const oy = Math.floor((cv.height - ROOM_ROWS * RT * s) / 2) + Math.floor(12 * s);
      ctx.imageSmoothingEnabled = false;
      ctx.fillStyle = "#120d0b";
      ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.drawImage(room, ox, oy, room.width * s, room.height * s);
      // monitor cursor blink
      if (reduce || Math.floor(time * 2) % 2 === 0) {
        ctx.fillStyle = "#f0b94a";
        ctx.fillRect(ox + (8 * RT + 24) * s, oy + (2 * RT - 11) * s, s, s);
      }
      // hotspot highlight
      if (best) {
        ctx.globalAlpha = 0.3 + (reduce ? 0.1 : 0.15 * Math.sin(time * 5));
        ctx.fillStyle = "#ffe29a";
        ctx.fillRect(ox + (best.x - 8) * s, oy + (best.y - 10) * s, 16 * s, 16 * s);
        ctx.globalAlpha = 1;
      }
      // player
      const spr = spriteCanvas(palette, p.dir, p.step, "none");
      ctx.fillStyle = "rgba(0,0,0,0.2)";
      ctx.fillRect(ox + (p.x + 4) * s, oy + (p.y + 19) * s, 8 * s, 3 * s);
      ctx.drawImage(spr, ox + Math.round(p.x * s), oy + Math.round(p.y * s), spr.width * s, spr.height * s);
      // night: dim the room, keep the lamps warm
      if (night) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(ox, oy, room.width * s, room.height * s);
        ctx.clip();
        ctx.fillStyle = "rgba(14,18,48,0.45)";
        ctx.fillRect(ox, oy, room.width * s, room.height * s);
        ctx.globalCompositeOperation = "lighter";
        for (const l of ROOM_LIGHTS) {
          const g = ctx.createRadialGradient(ox + l.x * s, oy + l.y * s, 0, ox + l.x * s, oy + l.y * s, l.r * s);
          g.addColorStop(0, "rgba(255,190,100,0.28)");
          g.addColorStop(1, "rgba(255,190,100,0)");
          ctx.fillStyle = g;
          ctx.fillRect(ox + (l.x - l.r) * s, oy + (l.y - l.r) * s, l.r * 2 * s, l.r * 2 * s);
        }
        ctx.restore();
      }
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", fit);
    };
  }, [night, palette]);

  // ---- keyboard
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (subRef.current) return; // dialogue / PC own their keys
      const k = e.key.toLowerCase();
      if (k === "shift") input.current.run = true;
      const dir = KEY[k];
      if (dir) {
        e.preventDefault();
        input.current[dir] = true;
        return;
      }
      if (e.repeat) return;
      if ((k === "enter" || k === " ") && nearRef.current && !(e.target as HTMLElement)?.closest?.("button")) {
        e.preventDefault();
        activateRef.current(nearRef.current);
      }
      if (k === "escape") {
        e.preventDefault();
        play("back");
        exitRef.current();
      }
    };
    const up = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "shift") input.current.run = false;
      const dir = KEY[k];
      if (dir) input.current[dir] = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[44]" role="region" aria-label="Inside the Traveler's Rest">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" role="img" aria-label="Muneeb's room: a desk with a computer, a bookshelf, a trophy cabinet and a bed." />

      <div className="pointer-events-none fixed left-3 top-3 sm:inset-x-0 sm:flex sm:justify-center">
        <p className="panel t-ui px-2 py-1 text-[0.8125rem] text-[color:var(--gold)]">{about.place}</p>
      </div>
      <div className="fixed right-3 top-3">
        <button
          type="button"
          className="btn btn-wood"
          onClick={() => {
            play("back");
            onExit();
          }}
        >
          <PixelIcon name="door" /> Leave
          <span className="kbd" aria-hidden>
            Esc
          </span>
        </button>
      </div>

      {!sub && near && <NearPrompt verb={near.verb} label={near.label} onActivate={() => activate(near)} />}
      {!sub && touch && (
        <TouchControls
          onDir={(k, on) => (input.current[k] = on)}
          onAction={() => nearRef.current && activate(nearRef.current)}
          onSprint={(on) => (input.current.run = on)}
        />
      )}

      {sub?.type === "text" && <DialogueBox key={sub.lines.join("|")} speaker={sub.speaker} role={sub.role} lines={sub.lines} onDone={() => setSub(null)} />}
      {sub?.type === "pc" && (
        <PcScreen
          onClose={() => setSub(null)}
          onProfile={onProfile}
          onQuestLog={onQuestLog}
          onContact={onContact}
        />
      )}
    </div>
  );
}

/** The PC: a retro OS window with the About text and quick links. */
function PcScreen({
  onClose,
  onProfile,
  onQuestLog,
  onContact,
}: {
  onClose: () => void;
  onProfile: () => void;
  onQuestLog: () => void;
  onContact: () => void;
}) {
  const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const full = about.lines.length;
  const [shown, setShown] = useState(reduce ? full : 1);
  useEffect(() => {
    if (shown >= full) return;
    const id = window.setTimeout(() => {
      setShown((n) => n + 1);
      play("blip");
    }, 520);
    return () => window.clearTimeout(id);
  }, [shown, full]);

  return (
    <Modal title="MUNEEB.EXE" onClose={onClose} width="max-w-2xl">
      <div className="well">
        <div className="relative bg-[#0f1a24] px-4 py-4">
          <div className="scanlines pointer-events-none absolute inset-0" aria-hidden />
          <p className="t-ui text-[0.75rem] text-[#7cc8e0]">{"C:\\ABOUT> type me.txt"}</p>
          <div className="mt-3 flex flex-col gap-2" aria-live="polite">
            {about.lines.slice(0, shown).map((l) => (
              <p key={l} className="t-body pop text-[1.0625rem] leading-snug text-[#cfe8f5]">
                {l}
              </p>
            ))}
            {shown < full && <span className="blink t-ui text-[#f0b94a]">_</span>}
          </div>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap justify-end gap-2">
        <button type="button" onClick={onProfile} className="btn btn-wood">
          <PixelIcon name="person" /> Profile
        </button>
        <button type="button" onClick={onQuestLog} className="btn btn-wood">
          <PixelIcon name="book" /> Projects
        </button>
        <button type="button" onClick={onContact} className="btn">
          <PixelIcon name="mail" /> Contact
        </button>
      </div>
    </Modal>
  );
}
