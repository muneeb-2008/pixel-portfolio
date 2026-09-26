"use client";

import { Modal } from "./Modal";
import { MenuList } from "./MenuList";
import { PixelIcon } from "./PixelIcon";

export function PauseMenu({
  sound,
  onResume,
  onLog,
  onSheet,
  onHelp,
  onToggleSound,
  night,
  onToggleNight,
  onTitle,
}: {
  sound: boolean;
  onResume: () => void;
  onLog: () => void;
  onSheet: () => void;
  onHelp: () => void;
  onToggleSound: () => void;
  night: boolean;
  onToggleNight: () => void;
  onTitle: () => void;
}) {
  return (
    <Modal title="Paused" onClose={onResume} width="max-w-xs">
      <MenuList
        label="Pause menu"
        items={[
          { label: "Resume", onSelect: onResume },
          { label: "Quest Log", onSelect: onLog },
          { label: "Character", onSelect: onSheet },
          { label: "How to Play", onSelect: onHelp },
          {
            label: (
              <span className="flex items-center gap-3">
                Sound <PixelIcon name={sound ? "soundOn" : "soundOff"} />
              </span>
            ),
            onSelect: onToggleSound,
            hint: sound ? "On" : "Off",
          },
          {
            label: (
              <span className="flex items-center gap-3">
                Time of day <PixelIcon name={night ? "moon" : "sun"} />
              </span>
            ),
            onSelect: onToggleNight,
            hint: night ? "Night" : "Day",
          },
          { label: "Title Screen", onSelect: onTitle },
        ]}
      />
      <p className="t-body mt-3 px-2 text-[1rem] text-[color:var(--text-3)]">Progress saves automatically.</p>
    </Modal>
  );
}
