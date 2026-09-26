"use client";

import { Modal } from "./Modal";
import { useInputModeValue } from "./inputMode";

export function HelpPanel({ onClose }: { onClose: () => void }) {
  const touch = useInputModeValue() === "touch";
  const rows: [string, string][] = touch
    ? [
        ["Move", "Hold the D-pad arrows."],
        ["Enter / talk", "Walk up into a glowing door, or tap A (or the prompt) when you're next to a door or villager."],
        ["Dialogue", "Tap the box or Next. Skip jumps ahead."],
        ["Quests", "Tap your player card for the Quest Log — every project, achievement and gem."],
        ["Level up", "Earn XP for projects, hidden gems, villagers and stories."],
      ]
    : [
        ["Move", "Arrow keys or WASD."],
        ["Enter / talk", "Walk up into a glowing door, or press Enter / Space next to a door or villager."],
        ["Dialogue", "Enter / Space / click for the next line. Esc skips."],
        ["Shortcuts", "L Quest Log · C Character · M Mailbox · Esc Pause menu"],
        ["Level up", "Earn XP for projects, hidden gems, villagers and stories."],
        ["Keyboard only?", "Tab reaches every button; the Quest Log opens any project without walking."],
      ];

  return (
    <Modal title="How to Play" onClose={onClose} width="max-w-lg">
      <dl className="flex flex-col gap-3">
        {rows.map(([k, v]) => (
          <div key={k} className="well grid gap-1 px-2 py-1 sm:grid-cols-[8.5rem_1fr] sm:gap-4">
            <dt className="t-ui text-[0.8125rem] text-[color:var(--gold)]">{k}</dt>
            <dd className="t-body text-[1rem] leading-snug text-[color:var(--text)]">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-6 flex justify-end">
        <button type="button" onClick={onClose} className="btn">
          Got it
        </button>
      </div>
    </Modal>
  );
}
