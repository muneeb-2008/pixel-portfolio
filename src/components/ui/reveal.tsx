"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
  y?: number;
  once?: boolean;
};

/**
 * Fade-and-rise on scroll into view. Falls back to a plain fade under
 * reduced-motion; content is always present in the DOM.
 */
export function Reveal({
  children,
  delay = 0,
  y = 26,
  once = true,
  ...props
}: RevealProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      data-reveal
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.15 }}
      transition={{ duration: 0.72, delay, ease: EASE }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Masked line reveal — each line rises from behind a clip. Pass an array of
 * strings; used for hero and large statements.
 */
export function LineReveal({
  lines,
  className,
  lineClassName,
  delay = 0,
  stagger = 0.09,
  start = true,
}: {
  lines: readonly string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  start?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <span className={className}>
      {lines.map((line, i) => (
        <span key={line} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            data-reveal
            className={`block ${lineClassName ?? ""}`}
            initial={reduce ? { opacity: 0 } : { y: "110%" }}
            animate={
              start ? (reduce ? { opacity: 1 } : { y: 0 }) : undefined
            }
            transition={{
              duration: 0.9,
              delay: delay + i * stagger,
              ease: EASE,
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
