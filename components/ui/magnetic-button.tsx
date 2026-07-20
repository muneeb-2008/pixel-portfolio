"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";
import { cn } from "@/lib/utils";

type MagneticButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  external?: boolean;
  className?: string;
};

/**
 * A CTA link that subtly leans toward the cursor, then springs back.
 * Disabled under prefers-reduced-motion.
 */
export function MagneticButton({
  href,
  children,
  variant = "primary",
  external = false,
  className,
}: MagneticButtonProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 18, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 260, damping: 18, mass: 0.5 });

  function handleMove(e: React.MouseEvent<HTMLAnchorElement>) {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.25);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.35);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  const variantStyles =
    variant === "primary"
      ? "bg-accent text-accent-contrast hover:bg-accent-hover shadow-[0_10px_30px_-12px_var(--accent)]"
      : "border border-border text-foreground hover:border-border-strong hover:bg-surface";

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: springX, y: springY }}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors duration-200",
        variantStyles,
        className,
      )}
    >
      {children}
    </motion.a>
  );
}
