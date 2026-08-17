"use client";

import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/** Inertia smooth scrolling. Disabled under reduced-motion (native scroll). */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <ReactLenis
      root
      options={{ lerp: 0.1, duration: 1.15, smoothWheel: true, touchMultiplier: 1.6 }}
    >
      {children}
    </ReactLenis>
  );
}
