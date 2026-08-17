"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

/**
 * A soft trailing ring that follows the pointer and swells over interactive
 * elements. It augments the native cursor rather than replacing it, so it can
 * never leave the page unusable. Fine-pointer + non-reduced-motion only.
 */
export function Cursor() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.6 });

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (reduce || !fine.matches) return;
    // Deferred so the effect body never sets state synchronously.
    const raf = requestAnimationFrame(() => setEnabled(true));

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = e.target as HTMLElement | null;
      setHover(Boolean(el?.closest("a, button, [data-cursor]")));
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
    };
  }, [reduce, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 rounded-full mix-blend-difference"
      style={{
        x: sx,
        y: sy,
        zIndex: "var(--z-cursor)",
        translateX: "-50%",
        translateY: "-50%",
        border: "1.5px solid #fff",
      }}
      animate={{
        width: hover ? 52 : 16,
        height: hover ? 52 : 16,
        opacity: hover ? 1 : 0.7,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    />
  );
}
