import type { Variants } from "motion/react";

/** Shared easing — soft, premium ease-out (expo). */
export const EASE = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT = [0.85, 0, 0.15, 1] as const;

/** Named spring presets (Framer): { type: "spring", ...preset }. */
export const springs = {
  snappy: { type: "spring", stiffness: 400, damping: 25, mass: 0.8 },
  standard: { type: "spring", stiffness: 300, damping: 30, mass: 1 },
  gentle: { type: "spring", stiffness: 200, damping: 28, mass: 1.2 },
  bounce: { type: "spring", stiffness: 350, damping: 18, mass: 0.9 },
} as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: EASE } },
};

/** Parent for staggered children reveals. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

/** Line-by-line clip reveal: parent clips, child rises. */
export const lineParent: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
export const lineChild: Variants = {
  hidden: { y: "110%" },
  visible: { y: 0, transition: { duration: 0.9, ease: EASE } },
};
