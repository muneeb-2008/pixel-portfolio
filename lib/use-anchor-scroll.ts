"use client";

import { useLenis } from "lenis/react";
import { useCallback } from "react";

/**
 * Returns a click handler for in-page anchor links that scrolls via Lenis
 * when available, and falls back to native smooth scroll (e.g. under
 * reduced-motion, where Lenis is disabled).
 */
export function useAnchorScroll() {
  const lenis = useLenis();

  return useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (!href.startsWith("#")) return;
      const el = document.getElementById(href.slice(1));
      if (!el) return;
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(el, { offset: -72 });
      } else {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      history.replaceState(null, "", href);
    },
    [lenis],
  );
}
