"use client";

import { useState } from "react";
import { SpritePortrait } from "./SpritePortrait";
import { Modal } from "./Modal";
import { PixelIcon, type IconName } from "./PixelIcon";
import { play } from "@/game/audio";
import type { Character } from "@/game/types";

const EXTRA_KEYS = ["c"];

/** Each skill gets an animated pixel icon — the icon carries the meaning, text is on demand. */
const SKILL_ICON: Record<string, { icon: IconName; anim: string; color: string }> = {
  uiux: { icon: "cursor", anim: "anim-click", color: "var(--sky)" },
  product: { icon: "cube", anim: "anim-bob", color: "var(--gold)" },
  framer: { icon: "bolt", anim: "anim-flash", color: "#b98ae8" },
  brand: { icon: "pen", anim: "anim-wiggle", color: "var(--ember)" },
  ai: { icon: "sparkle", anim: "anim-spin", color: "var(--moss)" },
  motion: { icon: "wave", anim: "anim-slide", color: "#e88fc0" },
};

const PROFILE_ICON: Record<string, IconName> = {
  Role: "briefcase",
  "Current guild": "flagIcon",
  Loadout: "tools",
  "Current quest": "target",
  Specialization: "compass",
};

export function CharacterSheet({
  character,
  level,
  xpInto,
  xpNeed,
  onClose,
}: {
  character: Character;
  level: number;
  xpInto: number;
  xpNeed: number;
  onClose: () => void;
}) {
  const [open, setOpen] = useState(character.stats[0]?.key ?? "");
  const skill = character.stats.find((s) => s.key === open);
  const rows = character.profile.filter((r) => r.label !== "Name");

  return (
    <Modal title="Player Profile" onClose={onClose} extraKeys={EXTRA_KEYS} width="max-w-3xl">
      <div className="flex flex-col gap-6 sm:flex-row">
        {/* identity card */}
        <div className="flex shrink-0 flex-col items-center gap-3 sm:w-52">
          <div className="well p-3">
            <div className="bob">
              <SpritePortrait palette={character.palette} scale={6} />
            </div>
          </div>
          <p className="t-ui text-center text-[0.9375rem] font-bold text-[color:var(--text)]">{character.name}</p>
          <div className="w-full">
            <div className="mb-1 flex items-baseline justify-between">
              <span className="t-ui bg-[color:var(--gold)] px-1.5 text-[0.75rem] font-bold text-[#2a1a0c]">LV {level}</span>
              <span className="t-ui text-[0.75rem] text-[color:var(--text-3)]">
                {xpInto}/{xpNeed} XP
              </span>
            </div>
            <div className="meter" role="progressbar" aria-label="Experience to next level" aria-valuemin={0} aria-valuemax={xpNeed} aria-valuenow={xpInto}>
              <span style={{ width: `${(xpInto / xpNeed) * 100}%` }} />
            </div>
          </div>
          {/* profile as icon chips — one line each */}
          <ul className="flex w-full flex-col gap-2">
            {rows.map((r) => (
              <li key={r.label} className="well flex items-center gap-2.5 px-1.5 py-1" title={r.label}>
                <span className="anim-bob grid h-7 w-7 shrink-0 place-items-center text-[color:var(--gold)]" aria-hidden>
                  <PixelIcon name={PROFILE_ICON[r.label] ?? "star"} px={2} />
                </span>
                <span className="min-w-0">
                  <span className="sr-only">{r.label}: </span>
                  <span className="t-body block text-[0.9375rem] leading-tight text-[color:var(--text)]">{r.value}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* skill tree: icon tiles; details only for the selected skill */}
        <div className="min-w-0 flex-1">
          <h3 className="t-ui mb-3 text-[0.75rem] text-[color:var(--text-3)]">Skill tree · pick one</h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3" role="group" aria-label="Skills">
            {character.stats.map((s) => {
              const ic = SKILL_ICON[s.key] ?? { icon: "star" as IconName, anim: "anim-bob", color: "var(--gold)" };
              const on = s.key === open;
              return (
                <button
                  key={s.key}
                  type="button"
                  aria-pressed={on}
                  aria-label={`${s.label}, level ${s.level} of ${s.max}`}
                  onClick={() => {
                    play("select");
                    setOpen(s.key);
                  }}
                  className="row flex flex-col items-center gap-2 px-1 py-3 text-center"
                  data-selected={on}
                >
                  <span className={`${ic.anim} grid h-12 w-12 place-items-center`} style={{ color: ic.color }} aria-hidden>
                    <PixelIcon name={ic.icon} px={4} />
                  </span>
                  <span className="t-ui text-[0.75rem] leading-tight text-[color:var(--text)]">{s.label}</span>
                  {/* level pips */}
                  <span className="flex gap-[2px]" aria-hidden>
                    {Array.from({ length: s.max }, (_, i) => (
                      <span
                        key={i}
                        className="h-2 w-1.5 border border-[color:var(--ink)]"
                        style={{ background: i < s.level ? ic.color : "var(--panel-2)" }}
                      />
                    ))}
                  </span>
                </button>
              );
            })}
          </div>

          {skill && (
            <div key={skill.key} className="well pop mt-3 px-3 py-2" aria-live="polite">
              <p className="t-ui text-[0.75rem] text-[color:var(--sky)]">Class · {skill.klass}</p>
              <p className="t-display mt-1 text-[24px] leading-tight text-[color:var(--gold-hi)]">{skill.headline}</p>
              <p className="t-body mt-1 text-[1rem] leading-snug text-[color:var(--text-2)]">{skill.blurb}</p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
