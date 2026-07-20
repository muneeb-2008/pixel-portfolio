"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";
import { EASE } from "@/lib/motion";

type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
  y?: number;
  once?: boolean;
};

/**
 * Fade-and-rise reveal when scrolled into view.
 * Respects prefers-reduced-motion (falls back to a plain fade).
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  once = true,
  ...props
}: RevealProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
