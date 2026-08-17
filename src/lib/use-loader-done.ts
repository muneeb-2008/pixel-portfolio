"use client";

import { useEffect, useState } from "react";

/** True once the app loader has lifted (or immediately if it was skipped). */
export function useLoaderDone() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const w = window as unknown as { __loaderDone?: boolean };
    if (w.__loaderDone) {
      const raf = requestAnimationFrame(() => setDone(true));
      return () => cancelAnimationFrame(raf);
    }
    const on = () => setDone(true);
    window.addEventListener("loader:done", on);
    const t = setTimeout(on, 2400);
    return () => {
      window.removeEventListener("loader:done", on);
      clearTimeout(t);
    };
  }, []);
  return done;
}
