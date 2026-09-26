"use client";

import { useEffect, useRef, useState } from "react";
import { projects } from "@/game/data/projects";
import { gems } from "@/game/data/collectibles";
import { villagers } from "@/game/data/villagers";
import { npcs } from "@/game/data/npcs";
import { world } from "@/game/data/world";
import { ACHIEVEMENTS, type Save } from "@/game/progress";
import { play } from "@/game/audio";
import { Modal } from "./Modal";
import { PixelIcon, type IconName } from "./PixelIcon";

const EXTRA_KEYS = ["l"];
type Tab = "projects" | "achievements" | "treasures";

/**
 * Quest Log — the list view of the whole world (and the "skip the game" path).
 * Tabs: every project by district · achievements · gems + villagers met.
 */
export function QuestLog({
  save,
  level,
  xpInto,
  xpNeed,
  unlocked,
  focusId,
  onOpenProject,
  onAbout,
  onContact,
  onClose,
}: {
  save: Save;
  level: number;
  xpInto: number;
  xpNeed: number;
  unlocked: Set<string>;
  /** project row to focus on open (returning from that project); else the first row */
  focusId?: string;
  onOpenProject: (id: string) => void;
  onAbout: () => void;
  onContact: () => void;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<Tab>("projects");
  const bodyRef = useRef<HTMLDivElement>(null);

  // land on a project row so Enter works immediately (short delay: a Space keyup
  // from the menu that opened us must not activate the row)
  useEffect(() => {
    const id = window.setTimeout(() => {
      const row =
        (focusId && bodyRef.current?.querySelector<HTMLButtonElement>(`[data-project="${focusId}"]`)) ||
        bodyRef.current?.querySelector<HTMLButtonElement>("[data-project]");
      row?.focus({ preventScroll: false });
    }, 120);
    return () => window.clearTimeout(id);
  }, [focusId]);

  // WAI-ARIA tabs: ←/→ move between tabs, only the active tab is in the Tab order
  const onTabKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const ids: Tab[] = ["projects", "achievements", "treasures"];
    const next = ids[(ids.indexOf(tab) + (e.key === "ArrowRight" ? 1 : -1) + ids.length) % ids.length];
    setTab(next);
    play("select");
    document.getElementById(`tab-${next}`)?.focus();
  };
  const visited = new Set(save.visited);
  const found = projects.filter((p) => visited.has(p.id)).length;
  const districts = world.zones.filter((z) => z.kind !== "hub");

  const tabs: { id: Tab; label: string; short: string; count: string }[] = [
    { id: "projects", label: "Projects", short: "Projects", count: `${found}/${projects.length}` },
    { id: "achievements", label: "Achievements", short: "Badges", count: `${unlocked.size}/${ACHIEVEMENTS.length}` },
    { id: "treasures", label: "Treasures", short: "Gems", count: `${save.gems.length}/${gems.length}` },
  ];

  return (
    <Modal title="Quest Log" onClose={onClose} extraKeys={EXTRA_KEYS} width="max-w-3xl">
      {/* progress strip */}
      <div className="well mb-4 flex flex-wrap items-center gap-x-6 gap-y-2 px-2 py-1.5">
        <span className="t-ui bg-[color:var(--gold)] px-2 py-0.5 text-[0.8125rem] font-bold text-[#2a1a0c]">LV {level}</span>
        <div className="min-w-[8rem] flex-1">
          <div className="meter" role="progressbar" aria-label="Experience to next level" aria-valuemin={0} aria-valuemax={xpNeed} aria-valuenow={xpInto}>
            <span style={{ width: `${(xpInto / xpNeed) * 100}%` }} />
          </div>
        </div>
        <span className="t-ui text-[0.75rem] text-[color:var(--text-2)]">
          {xpInto}/{xpNeed} XP to LV {level + 1}
        </span>
      </div>

      <div
        role="tablist"
        aria-label="Quest Log sections"
        onKeyDown={onTabKey}
        className="mb-4 flex gap-1 overflow-x-auto border-b-2 border-[color:var(--ink)] [scrollbar-width:none] max-sm:[mask-image:linear-gradient(90deg,#000_88%,transparent)]"
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            id={`tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            tabIndex={tab === t.id ? 0 : -1}
            onClick={() => {
              play("select");
              setTab(t.id);
            }}
            className="tab shrink-0 whitespace-nowrap"
          >
            <span className="hidden sm:inline">{t.label}</span>
            <span className="sm:hidden">{t.short}</span> <span className="text-[color:var(--text-3)]">{t.count}</span>
          </button>
        ))}
      </div>

      {/* fixed min-height so the frame doesn't jump between tabs */}
      <div ref={bodyRef} role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="sm:min-h-[21rem]">
        {tab === "projects" && (
          <div className="grid gap-5 sm:grid-cols-3">
            {districts.map((z) => {
              const list = projects.filter((p) => p.zone === z.kind);
              const done = list.filter((p) => visited.has(p.id)).length;
              const stamped = done === list.length;
              return (
                <section key={z.id} aria-labelledby={`q-${z.id}`}>
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <h3 id={`q-${z.id}`} className="t-ui text-[0.75rem] font-bold text-[color:var(--gold)]">
                      {z.name}
                    </h3>
                    <span
                      className={`t-ui flex items-center gap-1 text-[0.75rem] ${stamped ? "text-[color:var(--moss)]" : "text-[color:var(--text-3)]"}`}
                      aria-label={`${done} of ${list.length} found${stamped ? ", district complete" : ""}`}
                    >
                      {stamped && <PixelIcon name="star" px={1.5} />}
                      {done}/{list.length}
                    </span>
                  </div>
                  <ul className="flex flex-col gap-2">
                    {list.map((p) => {
                      const seen = visited.has(p.id);
                      return (
                        <li key={p.id}>
                          <button type="button" data-project={p.id} onClick={() => onOpenProject(p.id)} className="row flex min-h-11 w-full items-start gap-2.5 px-1.5 py-1">
                            <span aria-hidden className={`mt-1 ${seen ? "text-[color:var(--moss)]" : "text-[color:var(--text-3)]"}`}>
                              <PixelIcon name={seen ? "check" : "door"} px={1.5} />
                            </span>
                            <span className="min-w-0">
                              <span className="t-body block text-[1rem] leading-snug text-[color:var(--text)]">{p.title}</span>
                              <span className="t-ui mt-0.5 block text-[0.75rem] text-[color:var(--text-3)]">
                                {p.kind}
                                <span className="sr-only">{seen ? " — discovered" : " — not yet discovered"}</span>
                              </span>
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              );
            })}
          </div>
        )}

        {tab === "achievements" && (
          <ul className="grid gap-2 sm:grid-cols-2">
            {ACHIEVEMENTS.map((a) => {
              const got = unlocked.has(a.id);
              return (
                <li key={a.id} className="well flex items-center gap-3 px-1.5 py-1">
                  <span
                    className="grid h-11 w-11 shrink-0 place-items-center border-2 border-[color:var(--ink)]"
                    style={{ background: got ? "var(--gold)" : "var(--panel-2)", color: got ? "#2a1a0c" : "var(--text-3)" }}
                  >
                    <PixelIcon name={(got ? a.icon : "lock") as IconName} px={3} />
                  </span>
                  <span className="min-w-0">
                    <span className={`t-ui block text-[0.8125rem] font-bold ${got ? "text-[color:var(--gold)]" : "text-[color:var(--text-2)]"}`}>
                      {a.name}
                      <span className="sr-only">{got ? " — unlocked" : " — locked"}</span>
                    </span>
                    <span className="t-body block text-[1rem] leading-snug text-[color:var(--text-3)]">{a.desc}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        )}

        {tab === "treasures" && (
          <div className="flex flex-col gap-5">
            <section aria-labelledby="gems-h">
              <h3 id="gems-h" className="t-ui mb-2 text-[0.75rem] font-bold text-[color:var(--gold)]">
                Hidden gems · {save.gems.length}/{gems.length}
              </h3>
              <ul className="grid grid-cols-4 gap-2 sm:grid-cols-8">
                {gems.map((g, i) => {
                  const got = save.gems.includes(g.id);
                  return (
                    <li key={g.id} className="well grid aspect-square place-items-center" style={{ color: got ? g.color : "#3a2c23" }}>
                      <PixelIcon name="gem" px={4} title={got ? `Gem ${i + 1} — found` : `Gem ${i + 1} — not found yet`} />
                    </li>
                  );
                })}
              </ul>
              <p className="t-body mt-2 text-[1rem] text-[color:var(--text-3)]">
                {save.gems.length === gems.length
                  ? "Every gem found. A true treasure hunter!"
                  : "Tucked in corners, behind trees and by the water. On larger screens the minimap shows a sparkle for each one left."}
              </p>
            </section>

            <section aria-labelledby="vil-h">
              <h3 id="vil-h" className="t-ui mb-2 text-[0.75rem] font-bold text-[color:var(--gold)]">
                Villagers met · {save.talked.length}/{villagers.length}
              </h3>
              <ul className="grid gap-2 sm:grid-cols-4">
                {villagers.map((v) => {
                  const n = npcs.find((x) => x.id === v.npc);
                  const met = save.talked.includes(v.id);
                  return (
                    <li key={v.id} className="well flex items-center gap-2 px-1.5 py-1">
                      <span className={met ? "text-[color:var(--moss)]" : "text-[color:var(--text-3)]"}>
                        <PixelIcon name={met ? "check" : "chat"} px={1.5} />
                      </span>
                      <span className="t-ui text-[0.75rem] text-[color:var(--text)]">{met ? n?.name : "???"}</span>
                    </li>
                  );
                })}
              </ul>
            </section>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-wrap justify-end gap-2">
        <button type="button" onClick={onAbout} className="btn btn-wood">
          <PixelIcon name="book" />
          About
        </button>
        <button type="button" onClick={onContact} className="btn">
          <PixelIcon name="mail" />
          Contact
        </button>
      </div>
    </Modal>
  );
}
