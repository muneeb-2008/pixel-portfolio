"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { site } from "@/content/site";

const KEY = "atlas-loaded";

function signalDone() {
  (window as unknown as { __loaderDone?: boolean }).__loaderDone = true;
  window.dispatchEvent(new Event("loader:done"));
}

/**
 * Custom app loader — a branded intro shown once per session. White,
 * minimal, matching the site. Skipped on reduced-motion and repeat visits,
 * where it hands off immediately so the hero still animates in.
 */
export function AppLoader() {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const seen =
      typeof sessionStorage !== "undefined" && sessionStorage.getItem(KEY);
    if (reduce || seen) {
      signalDone();
      const raf = requestAnimationFrame(() => setVisible(false));
      return () => cancelAnimationFrame(raf);
    }

    document.documentElement.style.overflow = "hidden";
    let raf = 0;
    const start = performance.now();
    const DURATION = 1150;
    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        sessionStorage.setItem(KEY, "1");
        setTimeout(() => {
          signalDone();
          setVisible(false);
        }, 260);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.style.overflow = "";
    };
  }, [reduce]);

  useEffect(() => {
    if (!visible) document.documentElement.style.overflow = "";
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          className="fixed inset-0 flex flex-col justify-between bg-bg"
          style={{ zIndex: "var(--z-loader)" }}
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="shell flex flex-1 items-center">
            <motion.div
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              className="w-full"
            >
              <p className="label">{site.role}</p>
              <p
                className="t-display mt-[var(--s-4)] font-display"
                style={{ fontWeight: 600 }}
              >
                {site.name}
              </p>
            </motion.div>
          </div>

          <div className="shell pb-[var(--s-10)]">
            <div className="flex items-end justify-between gap-6">
              <div className="h-px flex-1 overflow-hidden bg-line">
                <div
                  className="h-full bg-ink"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span
                className="font-mono tabular-nums"
                style={{ fontSize: "var(--t-small)", color: "var(--ink-2)" }}
              >
                {String(progress).padStart(3, "0")}
              </span>
            </div>
          </div>

          <span className="sr-only">Loading</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
