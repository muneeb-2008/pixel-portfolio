"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const SESSION_KEY = "mq-loaded";

/** Let the hero (and anything else) know the intro is finished. */
function signalDone() {
  (window as unknown as { __loaderDone?: boolean }).__loaderDone = true;
  window.dispatchEvent(new Event("loader:done"));
}

export function Loader() {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Skip on reduced-motion or if already seen this session.
    const seen =
      typeof sessionStorage !== "undefined" &&
      sessionStorage.getItem(SESSION_KEY);
    if (reduce || seen) {
      signalDone();
      const raf = requestAnimationFrame(() => setVisible(false));
      return () => cancelAnimationFrame(raf);
    }

    document.documentElement.style.overflow = "hidden";
    let raf = 0;
    const start = performance.now();
    const DURATION = 1250;

    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      // ease-out
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        sessionStorage.setItem(SESSION_KEY, "1");
        setTimeout(() => {
          setVisible(false);
          signalDone();
        }, 380);
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
          className="fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-background"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.85, 0, 0.15, 1] }}
        >
          {/* soft accent glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle at center, var(--accent-soft), transparent 65%)",
            }}
          />

          <motion.div
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
            className="relative flex flex-col items-center"
          >
            {/* Monogram: faint base + accent fill rising with progress */}
            <div className="relative">
              <span className="text-display block select-none text-transparent [-webkit-text-stroke:1px_var(--border-strong)]">
                MQ
              </span>
              <span
                aria-hidden
                className="text-display absolute inset-0 block select-none text-accent"
                style={{ clipPath: `inset(${100 - progress}% 0 0 0)` }}
              >
                MQ
              </span>
            </div>

            <div className="mt-6 flex w-[min(72vw,20rem)] items-center gap-4">
              <div className="h-px flex-1 overflow-hidden bg-border">
                <div
                  className="h-full bg-accent"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="w-10 text-right font-mono text-sm tabular-nums text-muted">
                {progress}
              </span>
            </div>
          </motion.div>

          <span className="sr-only">Loading portfolio</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
