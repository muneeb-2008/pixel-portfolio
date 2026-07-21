"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, useReducedMotion } from "motion/react";
import { profile } from "@/lib/content";
import { ArrowRight, ArrowUpRight } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/** Top bar for pages outside the single-page homepage. */
export function SubpageNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "border-b transition-colors duration-500",
          scrolled
            ? "border-border bg-background/70 backdrop-blur-xl"
            : "border-transparent bg-transparent",
        )}
      >
        <nav
          aria-label="Main navigation"
          className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between px-6 sm:px-8 lg:px-16"
        >
          <Link
            href="/"
            className="group flex min-h-6 items-center gap-2.5 text-sm font-semibold tracking-tight"
          >
            <span className="h-2 w-2 rounded-full bg-accent transition-transform duration-500 group-hover:scale-125" />
            <span className="font-display">{profile.name}</span>
          </Link>

          <div className="flex items-center gap-1">
            <Link
              href="/work"
              className="rounded-full px-3.5 py-2 text-sm text-muted transition-colors hover:text-foreground"
            >
              Work
            </Link>
            <Link
              href="/#about"
              className="hidden rounded-full px-3.5 py-2 text-sm text-muted transition-colors hover:text-foreground sm:inline-flex"
            >
              About
            </Link>
            <Link
              href="/#contact"
              className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              Let&apos;s talk
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

/**
 * Reading progress + a persistent exit. Appears once the reader is past the
 * hero and steps aside near the end, where the next-project block takes over.
 */
export function CaseProgress({
  title,
  nextSlug,
  nextTitle,
}: {
  title: string;
  nextSlug?: string;
  nextTitle?: string;
}) {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    mass: 0.4,
  });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      setVisible(v > 0.06 && v < 0.9);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <>
      {/* Progress line, sitting on the nav's lower edge */}
      <div
        aria-hidden
        className="fixed inset-x-0 top-16 z-50 h-px bg-transparent"
      >
        <motion.div
          className="h-full origin-left bg-accent"
          style={{ scaleX: reduce ? scrollYProgress : scaleX }}
        />
      </div>

      {/* Persistent exit / continue */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))] transition-all duration-500",
          visible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0",
        )}
      >
        <nav
          aria-label="Case study navigation"
          className="flex max-w-full items-center gap-2 rounded-full border border-border bg-background/85 p-1.5 backdrop-blur-xl"
        >
          <Link
            href="/work"
            className="inline-flex h-9 shrink-0 items-center rounded-full px-4 text-sm text-muted transition-colors hover:bg-surface hover:text-foreground"
          >
            ← Work
          </Link>
          <span
            aria-hidden
            className="hidden max-w-[14rem] truncate px-2 text-sm text-faint sm:block"
          >
            {title}
          </span>
          {nextSlug && (
            <Link
              href={`/work/${nextSlug}`}
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-foreground px-4 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              <span className="max-w-[8rem] truncate">{nextTitle}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </nav>
      </div>
    </>
  );
}
