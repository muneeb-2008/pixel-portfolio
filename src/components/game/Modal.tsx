"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { play } from "@/game/audio";
import { PixelIcon } from "./PixelIcon";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Shared RPG dialog shell: real dialog semantics, focus moved in / trapped /
 * returned, Esc to close, scrolls when taller than the viewport (200% zoom,
 * landscape phones). The panel itself takes focus on open — not a button — so
 * a stray Enter carried over from the previous screen can't close it.
 */
export function Modal({
  title,
  onClose,
  children,
  width = "max-w-2xl",
  extraKeys,
  variant = "panel",
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  width?: string;
  /** "paper" = parchment page for long-form content */
  variant?: "panel" | "paper";
  /** extra keys that also close it (e.g. "c" for the character sheet) */
  extraKeys?: string[];
}) {
  const id = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const keysRef = useRef(extraKeys);
  useEffect(() => {
    keysRef.current = extraKeys;
  }, [extraKeys]);

  // capture the opener during render — child effects (e.g. a menu) may move focus first
  const [openerInfo] = useState(() => {
    const el = typeof document !== "undefined" ? (document.activeElement as HTMLElement | null) : null;
    // only hand focus back if the user was actually navigating by keyboard
    return { el, restore: !!el && el !== document.body && el.matches(":focus-visible") };
  });

  useEffect(() => {
    const { el: opener, restore } = openerInfo;
    if (!panelRef.current?.contains(document.activeElement)) panelRef.current?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      const panel = panelRef.current;
      if (!panel) return;
      const inField = (e.target as HTMLElement)?.matches?.("input, textarea");
      if (e.key === "Escape" || (!inField && keysRef.current?.includes(e.key.toLowerCase()))) {
        if (e.repeat) return;
        e.preventDefault();
        e.stopPropagation();
        play("back");
        onCloseRef.current();
        return;
      }
      if (e.key === "Tab") {
        const items = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null);
        if (!items.length) {
          e.preventDefault();
          return;
        }
        const first = items[0];
        const last = items[items.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && (active === first || active === panel)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (active === last || !panel.contains(active))) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => {
      window.removeEventListener("keydown", onKey, true);
      if (restore && opener?.isConnected) opener.focus({ preventScroll: true });
      else (document.activeElement as HTMLElement | null)?.blur?.();
    };
  }, [openerInfo]);

  const backdrop = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-[rgba(18,12,9,0.62)]"
      style={{ padding: "env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)" }}
      onClick={backdrop}
    >
      <div className="flex min-h-full items-center justify-center p-3 sm:p-6" onClick={backdrop}>
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={id}
          tabIndex={-1}
          className={`${variant === "paper" ? "paper" : "panel"} pop w-full ${width} px-4 py-4 outline-none sm:px-7 sm:py-6`}
        >
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2
              id={id}
              className={`t-display text-[2rem] sm:text-[2.5rem] ${
                variant === "paper" ? "text-[color:var(--parchment-ink)]" : "text-[color:var(--gold)]"
              }`}
            >
              {title}
            </h2>
            <button
              type="button"
              onClick={() => {
                play("back");
                onClose();
              }}
              className="btn btn-wood btn-icon"
              aria-label={`Close ${title}`}
            >
              <PixelIcon name="close" />
              <span className="kbd" aria-hidden>
                Esc
              </span>
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
