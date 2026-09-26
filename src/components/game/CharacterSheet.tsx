"use client";

import { SpritePortrait } from "./SpritePortrait";
import { Modal } from "./Modal";
import type { Character } from "@/game/types";

const EXTRA_KEYS = ["c"];

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
  return (
    <Modal title="Player Profile" onClose={onClose} extraKeys={EXTRA_KEYS} width="max-w-3xl">
      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="flex shrink-0 flex-col items-center gap-3 sm:w-56">
          <div className="well p-3">
            <SpritePortrait palette={character.palette} scale={6} />
          </div>
          <div className="text-center">
            <p className="t-ui text-[0.9375rem] font-bold text-[color:var(--text)]">{character.name}</p>
            <p className="t-body mt-1 text-[1rem] text-[color:var(--gold)] [text-wrap:balance]">{character.title}</p>
          </div>
          <div className="w-full">
            <div className="mb-1 flex items-baseline justify-between">
              <span className="t-ui text-[0.75rem] text-[color:var(--text-2)]">LV {level}</span>
              <span className="t-ui text-[0.75rem] text-[color:var(--text-3)]">
                {xpInto}/{xpNeed} XP
              </span>
            </div>
            <div className="meter" role="progressbar" aria-label="Experience to next level" aria-valuemin={0} aria-valuemax={xpNeed} aria-valuenow={xpInto}>
              <span style={{ width: `${(xpInto / xpNeed) * 100}%` }} />
            </div>
          </div>
          <dl className="well mt-1 flex w-full flex-col gap-2 px-2 py-2">
            {character.profile.slice(1).map((r) => (
              <div key={r.label}>
                <dt className="t-ui text-[0.75rem] text-[color:var(--text-3)]">{r.label}</dt>
                <dd className="t-body text-[1rem] leading-snug text-[color:var(--text)]">{r.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="t-ui mb-3 text-[0.75rem] text-[color:var(--text-3)]">Skill tree</h3>
          <ul className="flex flex-col gap-4">
            {character.stats.map((s) => (
              <li key={s.key}>
                <div className="mb-1.5 flex items-baseline justify-between gap-3">
                  <span className="flex flex-wrap items-baseline gap-x-2">
                    <span className="t-ui text-[0.8125rem] text-[color:var(--text)]">{s.label}</span>
                    <span className="t-ui text-[0.75rem] text-[color:var(--sky)]">Class · {s.klass}</span>
                  </span>
                  <span className="t-display text-[20px] leading-none text-[color:var(--gold)]">
                    <span className="sr-only">Level </span>
                    {s.level}
                    <span className="text-[color:var(--text-3)]">/{s.max}</span>
                  </span>
                </div>
                <div className="meter gold" role="meter" aria-label={s.label} aria-valuemin={0} aria-valuemax={s.max} aria-valuenow={s.level}>
                  <span style={{ width: `${(s.level / s.max) * 100}%` }} />
                </div>
                <p className="t-body mt-1.5 text-[1rem] leading-snug text-[color:var(--gold-hi)]">{s.headline}</p>
                <p className="t-body mt-0.5 text-[1rem] leading-snug text-[color:var(--text-3)]">{s.blurb}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Modal>
  );
}
