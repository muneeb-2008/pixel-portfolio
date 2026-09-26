"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { play } from "@/game/audio";

export type MenuItem = {
  label: ReactNode;
  onSelect: () => void;
  disabled?: boolean;
  hint?: ReactNode;
};

/**
 * JRPG-style vertical menu: ↑/↓ (or W/S) move a gold cursor, Enter selects,
 * hovering moves the cursor too. Real buttons underneath, so Tab still works.
 */
export function MenuList({ items, label, autoFocus = true }: { items: MenuItem[]; label: string; autoFocus?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!autoFocus) return;
    const first = ref.current?.querySelector<HTMLButtonElement>("button:not(:disabled)");
    first?.focus({ preventScroll: true });
  }, [autoFocus]);

  const buttons = () => [...(ref.current?.querySelectorAll<HTMLButtonElement>("button:not(:disabled)") ?? [])];

  const onKeyDown = (e: React.KeyboardEvent) => {
    const k = e.key.toLowerCase();
    const dir = k === "arrowdown" || k === "s" ? 1 : k === "arrowup" || k === "w" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const list = buttons();
    const i = list.indexOf(document.activeElement as HTMLButtonElement);
    const next = list[(i + dir + list.length) % list.length];
    next?.focus();
    play("select");
  };

  return (
    <div ref={ref} role="menu" aria-label={label} onKeyDown={onKeyDown} className="flex flex-col">
      {items.map((it, i) => (
        <button
          key={i}
          type="button"
          role="menuitem"
          className="menu-item"
          disabled={it.disabled}
          tabIndex={i === active ? 0 : -1}
          onFocus={() => setActive(i)}
          onMouseEnter={(e) => {
            if (document.activeElement !== e.currentTarget) {
              e.currentTarget.focus({ preventScroll: true });
              play("select");
            }
          }}
          onClick={() => {
            play("confirm");
            it.onSelect();
          }}
        >
          <span className="flex-1">{it.label}</span>
          {it.hint && (
            <span className="text-[0.75rem] text-[color:var(--text-3)]" aria-hidden>
              {it.hint}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
