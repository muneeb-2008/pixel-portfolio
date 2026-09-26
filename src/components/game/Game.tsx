"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Game as Engine, type InputKey, type Trigger } from "@/game/engine";
import { world } from "@/game/data/world";
import { character } from "@/game/data/character";
import { npcs } from "@/game/data/npcs";
import { getProject, projects } from "@/game/data/projects";
import { gems } from "@/game/data/collectibles";
import { villagers } from "@/game/data/villagers";
import {
  ACHIEVEMENTS,
  EMPTY_SAVE,
  hasProgress,
  levelOf,
  loadSave,
  unlockedIds,
  writeSave,
  xpOf,
  XP,
  type Save,
} from "@/game/progress";
import { initSound, play, setSound, unlockAudio } from "@/game/audio";
import { asset } from "@/lib/asset";
import type { HatKind, Palette } from "@/game/types";
import { BootScreen } from "./BootScreen";
import { TitleScreen } from "./TitleScreen";
import { DialogueBox } from "./DialogueBox";
import { ProjectPanel } from "./ProjectPanel";
import { CharacterSheet } from "./CharacterSheet";
import { ContactForm, type LetterDraft } from "./ContactForm";
import { HelpPanel } from "./HelpPanel";
import { QuestLog } from "./QuestLog";
import { PauseMenu } from "./PauseMenu";
import { HouseInterior } from "./HouseInterior";
import { Hud, Iris, LevelBanner, NearPrompt, ToastView, type ToastMsg } from "./Hud";
import { TouchControls } from "./TouchControls";
import { InputModeContext, useInputModeTracker } from "./inputMode";

type Portrait = { palette: Palette; hat: HatKind };
type Phase = "boot" | "title" | "play";

/** `back` = where Esc / Close returns to (e.g. a project opened from the Quest Log). */
type Overlay =
  | null
  | ((
      | {
          type: "dialogue";
          speaker: string;
          role?: string;
          lines: string[];
          portrait?: Portrait;
          after?: { type: "project"; projectId: string; fresh: boolean };
        }
      | { type: "project"; projectId: string; fresh: boolean }
      | { type: "sheet" }
      | { type: "contact" }
      | { type: "help" }
      | { type: "log"; focus?: string }
      | { type: "pause" }
      | { type: "house"; pc?: boolean }
    ) & { back?: Overlay });


const KEY_MAP: Record<string, InputKey> = {
  arrowup: "up",
  arrowdown: "down",
  arrowleft: "left",
  arrowright: "right",
  w: "up",
  s: "down",
  a: "left",
  d: "right",
};

const zoneName = (projectId: string) => {
  const p = getProject(projectId);
  return world.zones.find((z) => z.kind === p?.zone)?.name ?? "Project";
};

const NIGHT_KEY = "pixel-portfolio:night";

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function Game() {
  const inputMode = useInputModeTracker();
  const touch = inputMode === "touch";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);

  const [phase, setPhase] = useState<Phase>("boot");
  const [loadP, setLoadP] = useState(0);
  const [overlay, setOverlay] = useState<Overlay>(null);
  const overlayRef = useRef<Overlay>(null);
  const [save, setSave] = useState<Save>(loadSave);
  const saveRef = useRef(save);
  const [near, setNear] = useState<Trigger | null>(null);
  const [draft, setDraft] = useState<LetterDraft>({ name: "", email: "", msg: "" });
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const [levelBanner, setLevelBanner] = useState<number | null>(null);
  const [iris, setIris] = useState<{ x: number; y: number; action: () => void } | null>(null);
  const irisRef = useRef(false);
  const [sound, setSoundState] = useState(initSound);
  const [night, setNightState] = useState(() => {
    try {
      const saved = window.localStorage.getItem(NIGHT_KEY);
      if (saved) return saved === "on";
    } catch {
      /* ignore */
    }
    const h = new Date().getHours();
    return h >= 19 || h < 6;
  });
  const nightRef = useRef(night);

  const xp = xpOf(save);
  const lvl = levelOf(xp);
  const unlocked = useMemo(() => new Set(unlockedIds(save)), [save]);

  // mirror state into refs for event handlers — never during render
  useEffect(() => {
    overlayRef.current = overlay;
  }, [overlay]);
  useEffect(() => {
    irisRef.current = iris !== null;
  }, [iris]);
  useEffect(() => {
    saveRef.current = save;
    writeSave(save);
    engineRef.current?.setProgress(save);
  }, [save]);

  const toast = useCallback((t: Omit<ToastMsg, "id">) => {
    setToasts((q) => [...q, { ...t, id: Date.now() + Math.random(), at: Date.now() }]);
  }, []);

  /* ---------------- level-ups + achievements (diffed, never on load) ---------------- */
  const prevRef = useRef({ level: lvl.level, unlocked: new Set(unlocked) });
  useEffect(() => {
    const prev = prevRef.current;
    if (phase === "play") {
      if (lvl.level > prev.level) setLevelBanner(lvl.level);
      for (const a of ACHIEVEMENTS) {
        if (unlocked.has(a.id) && !prev.unlocked.has(a.id)) {
          toast({ icon: a.icon as ToastMsg["icon"], title: `Achievement · ${a.name}`, sub: a.desc, tone: "gold", sound: "achieve" });
        }
      }
    }
    prevRef.current = { level: lvl.level, unlocked: new Set(unlocked) };
  }, [lvl.level, unlocked, phase, toast]);

  /* ---------------- save mutations ---------------- */
  const markVisited = useCallback((id: string) => {
    setSave((s) => (s.visited.includes(id) ? s : { ...s, visited: [...s.visited, id] }));
  }, []);

  const openAbout = useCallback((pc = false) => {
    setOverlay({ type: "house", pc });
  }, []);

  const readAbout = useCallback(() => {
    setSave((s) => (s.about ? s : { ...s, about: true }));
  }, []);

  const openContact = useCallback((back?: Overlay) => {
    setSave((s) => (s.mail ? s : { ...s, mail: true }));
    setOverlay({ type: "contact", back: back ?? undefined });
  }, []);

  /** Open a project from the Quest Log — closing it returns to the list, row focused. */
  const openProject = useCallback((projectId: string) => {
    const fresh = !saveRef.current.visited.includes(projectId);
    play("open");
    setOverlay({ type: "project", projectId, fresh, back: { type: "log", focus: projectId } });
  }, []);

  /** Play the iris wipe (unless reduced motion), then run `action` behind it. */
  const withIris = useCallback((action: () => void) => {
    const eng = engineRef.current;
    if (!eng || reducedMotion()) {
      action();
      return;
    }
    const p = eng.playerScreen();
    play("door");
    setIris({ x: p.x, y: p.y, action });
  }, []);

  const handleTrigger = useCallback(
    (t: Trigger) => {
      if (t.type === "project" && t.payload) {
        const projectId = t.payload;
        play("door");
        setOverlay({ type: "project", projectId, fresh: !saveRef.current.visited.includes(projectId) });
      } else if (t.type === "about") {
        withIris(() => openAbout());
      } else if (t.type === "contact") {
        play("open");
        openContact();
      } else if (t.type === "villager" && t.payload) {
        const v = villagers.find((x) => x.id === t.payload);
        const npc = npcs.find((n) => n.id === v?.npc);
        if (!v || !npc) return;
        if (!saveRef.current.talked.includes(v.id)) {
          const next = { ...saveRef.current, talked: [...saveRef.current.talked, v.id] };
          saveRef.current = next;
          setSave(next);
          toast({ icon: "chat", title: `Met ${npc.name} · ${next.talked.length}/${villagers.length}`, sub: `+${XP.talk} XP`, tone: "moss" });
        }
        setOverlay({ type: "dialogue", speaker: npc.name, role: "Villager", lines: v.lines, portrait: { palette: npc.palette, hat: npc.hat } });
      }
    },
    [openAbout, openContact, withIris, toast],
  );

  const handlePickup = useCallback(
    (gemId: string) => {
      const cur = saveRef.current;
      if (cur.gems.includes(gemId)) return;
      const next = { ...cur, gems: [...cur.gems, gemId] };
      saveRef.current = next;
      setSave(next);
      play("gem");
      toast({ icon: "gem", title: `Gem found · ${next.gems.length}/${gems.length}`, sub: `+${XP.gem} XP`, tone: "sky" });
    },
    [toast],
  );

  /* ---------------- engine lifecycle ---------------- */
  // latest handlers for the engine's long-lived callbacks
  const handlersRef = useRef({ trigger: handleTrigger, pickup: handlePickup });
  useEffect(() => {
    handlersRef.current = { trigger: handleTrigger, pickup: handlePickup };
  }, [handleTrigger, handlePickup]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const engine = new Engine(
      canvas,
      {
        world,
        character,
        gems,
        villagers,
        npcs,
        banners: Object.fromEntries(projects.map((p) => [p.id, p.banner])),
        // billboards only need tiny thumbnails (96×54) — the full art loads when a project opens
        covers: Object.fromEntries(projects.filter((p) => p.gallery[0]).map((p) => [p.id, asset(p.gallery[0].replace("/work/", "/work/thumbs/"))])),
      },
      {
        onTrigger: (t) => handlersRef.current.trigger(t),
        onNear: setNear,
        onPickup: (id) => handlersRef.current.pickup(id),
        onStep: () => play("step"),
        onLoad: setLoadP,
      },
    );
    engine.setProgress(saveRef.current);
    engine.setAttract(true);
    engine.setNight(nightRef.current, true);
    engine.setSafeTop(84);
    engineRef.current = engine;
    void engine.start();
    const onResize = () => engine.resize();
    const onBlur = () => engine.clearInput(); // alt-tab while holding a key
    window.addEventListener("resize", onResize);
    window.addEventListener("blur", onBlur);
    return () => {
      engine.stop();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  // single source of truth for pausing the world
  useEffect(() => {
    engineRef.current?.setPaused(phase !== "play" || overlay !== null || iris !== null);
  }, [phase, overlay, iris]);

  /* ---------------- phase transitions ---------------- */
  const bootContinue = useCallback(() => {
    unlockAudio();
    play("confirm");
    setPhase("title");
  }, []);

  const enterPlay = useCallback(
    (then?: Overlay) => {
      engineRef.current?.setAttract(false);
      setPhase("play");
      setOverlay(then ?? null);
      if (!then && !hasProgress(saveRef.current)) {
        toast({
          icon: "play",
          title: "Welcome, traveler!",
          ephemeral: true,
          sub: touch ? "Use the D-pad. Walk into a glowing door." : "WASD or arrows to move. Walk into a glowing door.",
          tone: "moss",
        });
      }
    },
    [toast, touch],
  );

  const newGame = useCallback(() => {
    setSave(EMPTY_SAVE);
    prevRef.current = { level: 1, unlocked: new Set() };
    saveRef.current = EMPTY_SAVE;
    engineRef.current?.reset();
    enterPlay();
  }, [enterPlay]);

  const toTitle = useCallback(() => {
    setOverlay(null);
    setToasts([]);
    engineRef.current?.setAttract(true);
    setPhase("title");
  }, []);

  useEffect(() => {
    nightRef.current = night;
    engineRef.current?.setNight(night);
  }, [night]);

  const toggleNight = useCallback(() => {
    const next = !night;
    setNightState(next);
    play(next ? "open" : "select");
    try {
      window.localStorage.setItem(NIGHT_KEY, next ? "on" : "off");
    } catch {
      /* ignore */
    }
  }, [night]);

  const toggleSound = useCallback(() => {
    const next = !sound;
    setSound(next);
    setSoundState(next);
  }, [sound]);

  const toggleNightRef = useRef(toggleNight);
  useEffect(() => {
    toggleNightRef.current = toggleNight;
  }, [toggleNight]);

  /* ---------------- keyboard (world only — panels own their keys) ---------------- */
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (phase !== "play" || overlayRef.current !== null || irisRef.current) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest?.("input, textarea")) return;
      const k = e.key.toLowerCase();
      if (k === "shift") {
        engineRef.current?.setSprint(true);
        return;
      }
      const dir = KEY_MAP[k];
      if (dir) {
        e.preventDefault();
        engineRef.current?.setInput(dir, true);
        return;
      }
      if (e.repeat) return;
      // Enter/Space interact — unless a HUD button has keyboard focus (then it's that button's)
      if ((k === "enter" || k === " ") && !target?.closest?.("button, a")) {
        e.preventDefault();
        if (engineRef.current && !engineRef.current.interact()) play("select");
        return;
      }
      const shortcut: Record<string, () => void> = {
        c: () => setOverlay({ type: "sheet" }),
        l: () => setOverlay({ type: "log" }),
        m: () => openContact(),
        h: () => setOverlay({ type: "help" }),
        escape: () => setOverlay({ type: "pause" }),
        n: () => toggleNightRef.current(),
      };
      if (shortcut[k]) {
        e.preventDefault();
        play("open");
        shortcut[k]();
      }
    };
    const up = (e: KeyboardEvent) => {
      if (e.key === "Shift") engineRef.current?.setSprint(false);
      const dir = KEY_MAP[e.key.toLowerCase()];
      if (dir) engineRef.current?.setInput(dir, false);
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [phase, openContact]);

  const close = useCallback(() => setOverlay((cur) => cur?.back ?? null), []);
  const dialogueDone = useCallback(() => {
    setOverlay((cur) => (cur && cur.type === "dialogue" && cur.after ? cur.after : null));
  }, []);
  const onDir = useCallback((key: InputKey, on: boolean) => engineRef.current?.setInput(key, on), []);
  const interact = useCallback(() => {
    if (engineRef.current && !engineRef.current.interact()) play("select");
  }, []);
  const minimapRef = useCallback((el: HTMLCanvasElement | null) => engineRef.current?.attachMinimap(el), []);
  const nextToast = useCallback(() => setToasts((q) => q.slice(1)), []);
  const endBanner = useCallback(() => setLevelBanner(null), []);

  const nearInfo = (() => {
    if (!near) return null;
    if (near.type === "project") {
      const p = near.payload ? getProject(near.payload) : undefined;
      const seen = save.visited.includes(near.payload ?? "");
      return { verb: seen ? "Revisit" : "Visit", label: p?.title ?? "Project" };
    }
    if (near.type === "villager") {
      const v = villagers.find((x) => x.id === near.payload);
      return { verb: "Talk", label: npcs.find((n) => n.id === v?.npc)?.name ?? "Villager" };
    }
    return near.type === "about" ? { verb: "Visit", label: "Traveler's Rest · About" } : { verb: "Open", label: "Mailbox · Contact" };
  })();

  const worldInert = phase !== "play" || overlay !== null;
  const found = save.visited.length;

  return (
    <InputModeContext.Provider value={inputMode}>
      <main className="fixed inset-0 overflow-hidden bg-[color:var(--bg)]">
        <div inert={worldInert} className="absolute inset-0">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full"
            role="img"
            aria-label="Pixel-art town with Design, Development and Agency districts. Open the Quest Log for a text list of every project."
          />

          {phase === "play" && (
            <>
              <Hud
                level={lvl.level}
                xpInto={lvl.into}
                xpNeed={lvl.need}
                found={found}
                total={projects.length}
                gems={save.gems.length}
                gemTotal={gems.length}
                onLog={() => setOverlay({ type: "log" })}
                onSheet={() => setOverlay({ type: "sheet" })}
                onContact={() => openContact()}
                onMenu={() => setOverlay({ type: "pause" })}
                night={night}
                onToggleNight={toggleNight}
                minimapRef={minimapRef}
              />
              {overlay === null && touch && <TouchControls onDir={onDir} onAction={interact} onSprint={(on) => engineRef.current?.setSprint(on)} />}
              {overlay === null && nearInfo && <NearPrompt verb={nearInfo.verb} label={nearInfo.label} onActivate={interact} />}
            </>
          )}
        </div>

        {/* toasts + level-up wait until no panel/transition is covering the world, so they
            never obscure what the player is reading; live regions stay mounted for SRs */}
        <ToastView toast={phase === "play" && overlay === null && !iris ? (toasts[0] ?? null) : null} onDone={nextToast} />
        <LevelBanner level={overlay === null && !iris ? levelBanner : null} onDone={endBanner} />
        {iris && (
          <Iris
            x={iris.x}
            y={iris.y}
            onMid={() => iris.action()}
            onEnd={() => setIris(null)}
          />
        )}

        {/* overlays sit above the title screen too (e.g. How to Play from the menu) */}
        <div className={phase === "title" ? "relative z-[65]" : undefined}>
          {overlay?.type === "dialogue" && (
            <DialogueBox
              key={overlay.lines.join("|")}
              speaker={overlay.speaker}
              role={overlay.role}
              lines={overlay.lines}
              portrait={overlay.portrait}
              onDone={dialogueDone}
            />
          )}
          {overlay?.type === "project" &&
            (() => {
              const p = getProject(overlay.projectId);
              // browsing from the Quest Log: Prev / Next step through every project
              const i = projects.findIndex((x) => x.id === p?.id);
              const nav =
                overlay.back?.type === "log"
                  ? {
                      onPrev: () => openProject(projects[(i - 1 + projects.length) % projects.length].id),
                      onNext: () => openProject(projects[(i + 1) % projects.length].id),
                      position: `${i + 1} / ${projects.length}`,
                    }
                  : undefined;
              return p ? (
                <ProjectPanel key={p.id} project={p} district={zoneName(p.id)} fresh={overlay.fresh} nav={nav} onDiscover={() => markVisited(p.id)} onClose={close} />
              ) : null;
            })()}
          {overlay?.type === "sheet" && (
            <CharacterSheet character={character} level={lvl.level} xpInto={lvl.into} xpNeed={lvl.need} onClose={close} />
          )}
          {overlay?.type === "contact" && <ContactForm draft={draft} onDraft={setDraft} onClose={close} />}
          {overlay?.type === "help" && <HelpPanel onClose={close} />}
          {overlay?.type === "log" && (
            <QuestLog
              save={save}
              level={lvl.level}
              xpInto={lvl.into}
              xpNeed={lvl.need}
              unlocked={unlocked}
              focusId={overlay.focus}
              onOpenProject={openProject}
              onAbout={() => openAbout(true)}
              onContact={() => openContact()}
              onClose={close}
            />
          )}
          {overlay?.type === "house" && (
            <HouseInterior
              palette={character.palette}
              night={night}
              trophies={unlocked.size}
              trophyTotal={ACHIEVEMENTS.length}
              onReadAbout={readAbout}
              onProfile={() => setOverlay({ type: "sheet", back: { type: "house" } })}
              onQuestLog={() => setOverlay({ type: "log", back: { type: "house" } })}
              onContact={() => openContact({ type: "house" })}
              openPc={overlay.pc}
              onToggleNight={toggleNight}
              onExit={() =>
                withIris(() => {
                  engineRef.current?.stepOutOf("about");
                  setOverlay(null);
                })
              }
            />
          )}
          {overlay?.type === "pause" && (
            <PauseMenu
              sound={sound}
              onResume={close}
              onLog={() => setOverlay({ type: "log", back: { type: "pause" } })}
              onSheet={() => setOverlay({ type: "sheet", back: { type: "pause" } })}
              onHelp={() => setOverlay({ type: "help", back: { type: "pause" } })}
              night={night}
              onToggleNight={toggleNight}
              onToggleSound={toggleSound}
              onTitle={toTitle}
            />
          )}
        </div>

        {phase === "title" && (
          <TitleScreen
            canContinue={hasProgress(save)}
            sound={sound}
            onContinue={() => enterPlay()}
            onNewGame={newGame}
            onList={() => enterPlay({ type: "log" })}
            onHelp={() => setOverlay({ type: "help" })}
            onContact={() => openContact()}
            onToggleSound={toggleSound}
          />
        )}
        {phase === "boot" && <BootScreen progress={loadP} onContinue={bootContinue} />}
      </main>
    </InputModeContext.Provider>
  );
}
