"use client";

import { useLenis } from "lenis/react";
import { useCallback } from "react";

/**
 * Click handler for in-page hash links. Smooth-scrolls via Lenis when the
 * target exists on the current page; otherwise lets the <Link> navigate
 * (e.g. jumping from a project page back to a home-page section).
 */
export function useAnchorScroll() {
  const lenis = useLenis();
  return useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      const hash = href.includes("#") ? href.split("#")[1] : "";
      if (!hash) return;
      const el = document.getElementById(hash);
      if (!el) return; // different route → let Link navigate
      e.preventDefault();
      if (lenis) lenis.scrollTo(el, { offset: -72 });
      else el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${hash}`);
    },
    [lenis],
  );
}
