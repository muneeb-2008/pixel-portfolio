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
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

/**
 * A CTA link that leans toward the cursor, then springs back.
 * Disabled under prefers-reduced-motion.
 */
export function MagneticButton({
  href,
  children,
  variant = "primary",
  external = false,
  className,
  onClick,
}: MagneticButtonProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 22, mass: 0.8 });
  const springY = useSpring(y, { stiffness: 300, damping: 22, mass: 0.8 });

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
      ? "bg-accent text-accent-contrast hover:bg-accent-hover shadow-[0_16px_40px_-16px_var(--accent)]"
      : "border border-border-strong text-foreground hover:bg-surface";

  return (
    <motion.a
      ref={ref}
      href={href}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: springX, y: springY }}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className={cn(
        "group inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors duration-200",
        variantStyles,
        className,
      )}
    >
      {children}
    </motion.a>
  );
}
