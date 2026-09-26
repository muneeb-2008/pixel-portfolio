"use client";

import { useState } from "react";
import { character } from "@/game/data/character";
import { MenuList } from "./MenuList";
import { PixelIcon } from "./PixelIcon";
import { useInputModeValue } from "./inputMode";

/**
 * Title screen — floats over the live town (the engine runs in attract mode
 * behind it), JRPG main menu on the left, credits along the bottom.
 */
export function TitleScreen({
  canContinue,
  sound,
  onContinue,
  onNewGame,
  onList,
  onHelp,
  onContact,
  onToggleSound,
}: {
  canContinue: boolean;
  sound: boolean;
  onContinue: () => void;
  onNewGame: () => void;
  onList: () => void;
  onHelp: () => void;
  onContact: () => void;
  onToggleSound: () => void;
}) {
  const touch = useInputModeValue() === "touch";
  const [confirmNew, setConfirmNew] = useState(false);

  const mainItems = [
    ...(canContinue ? [{ label: "Continue", onSelect: onContinue }] : []),
    { label: "New Game", onSelect: () => (canContinue ? setConfirmNew(true) : onNewGame()) },
    { label: "Project List", onSelect: onList, hint: "Quest Log" },
    { label: "Contact", onSelect: onContact, hint: "Email" },
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
  ];

  return (
    <div
      className="fixed inset-0 z-[60] overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="title-heading"
    >
      <div className="vignette pointer-events-none fixed inset-0" aria-hidden />
      {/* scrim: keeps the logo + menu legible over the busy town */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{ background: "linear-gradient(90deg, rgba(18,13,11,0.82) 0%, rgba(18,13,11,0.55) 38%, rgba(18,13,11,0) 70%)" }}
        aria-hidden
      />
      <div className="scanlines pointer-events-none fixed inset-0" aria-hidden />

      <div className="relative flex min-h-full flex-col justify-between gap-8 px-5 py-8 sm:px-12 sm:py-12 [@media(max-height:560px)]:gap-3 [@media(max-height:560px)]:py-4">
        {/* short landscape screens: logo and menu sit side by side so the menu is never below the fold */}
        <div className="flex flex-col items-start gap-8 [@media(max-height:560px)]:flex-row [@media(max-height:560px)]:items-center [@media(max-height:560px)]:gap-8">
          <div className="slide-down">
            <p className="t-ui text-[0.8125rem] tracking-[0.2em] text-[color:var(--gold-hi)]">A Portfolio Adventure</p>
            <h2 id="title-heading" className="t-logo mt-3 text-[80px] sm:text-[120px] [@media(max-height:560px)]:text-[60px]">
              Pixel
              <br />
              Portfolio
            </h2>
            <p className="t-body mt-5 max-w-md text-[1.125rem] text-[color:var(--text)] [text-wrap:balance] [@media(max-height:560px)]:mt-2">
              <span className="t-ui text-[0.875rem] text-[color:var(--gold)]">{character.name}</span>
              <span className="mx-2 text-[color:var(--text-3)]">·</span>
              {character.title}
            </p>
          </div>

          <div className="panel pop w-full max-w-sm px-2 py-3">
            {confirmNew ? (
              <div className="px-3 py-1">
                <p className="t-body mb-3 text-[1rem] text-[color:var(--text)]">Start over? Your saved progress will be erased.</p>
                <MenuList
                  label="Confirm new game"
                  items={[
                    { label: "Yes, start over", onSelect: onNewGame },
                    { label: "No, go back", onSelect: () => setConfirmNew(false) },
                  ]}
                />
              </div>
            ) : (
              <MenuList label="Main menu" items={mainItems} />
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <p className="t-ui text-[0.75rem] text-[color:var(--text-2)]">
            {touch ? "Tap an option to begin" : "Arrow keys choose · Enter selects"}
          </p>
          <p className="t-ui text-[0.75rem] text-[color:var(--text-3)]">© {character.name} · v1.0</p>
        </div>
      </div>
    </div>
  );
}
