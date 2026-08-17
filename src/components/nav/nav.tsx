"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useLenis } from "lenis/react";
import { site } from "@/content/site";
import { TextRoll } from "@/components/ui/text-roll";
import { useActiveSection } from "@/lib/use-active-section";
import { useAnchorScroll } from "@/lib/use-anchor-scroll";
import { useLoaderDone } from "@/lib/use-loader-done";
import { cn } from "@/lib/utils";

const SECTION_IDS = ["work", "playground", "info", "contact"];
const EASE = [0.22, 1, 0.36, 1] as const;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(SECTION_IDS);
  const onAnchor = useAnchorScroll();
  const started = useLoaderDone();
  const lenis = useLenis();
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock scroll while the mobile menu is open
  useEffect(() => {
    if (open) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.body.style.overflow = "";
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      lenis?.start();
    };
  }, [open, lenis]);

  const enter = (i: number) =>
    started
      ? { opacity: 1, y: 0, transition: { delay: 0.05 + i * 0.06, duration: 0.6, ease: EASE } }
      : {};

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 transition-[background-color,border-color,backdrop-filter] duration-500"
        style={{
          // numeric, above the menu overlay so the close button stays clickable
          zIndex: 70,
          borderBottom: `1px solid ${scrolled && !open ? "var(--line)" : "transparent"}`,
          background:
            scrolled && !open ? "color-mix(in srgb, var(--bg) 78%, transparent)" : "transparent",
          backdropFilter: scrolled && !open ? "blur(14px)" : "none",
        }}
      >
        <nav
          aria-label="Primary"
          className="shell flex items-center justify-between gap-8 py-5"
        >
          <motion.div initial={{ opacity: 0, y: -12 }} animate={enter(0)}>
            <Link
              href="/"
              className="group inline-flex font-display text-[1.0625rem] font-semibold tracking-[-0.02em]"
            >
              <TextRoll>{site.name}</TextRoll>
            </Link>
          </motion.div>

          {/* Desktop links */}
          <ul className="hidden items-center gap-8 md:flex">
            {site.nav.map((item, i) => {
              const id = item.href.split("#")[1];
              const isActive = active === id;
              return (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, y: -12 }}
                  animate={enter(i + 1)}
                >
                  <Link
                    href={item.href}
                    onClick={(e) => onAnchor(e, item.href)}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "group inline-flex items-center gap-2 text-[0.9375rem] transition-colors duration-300",
                      isActive ? "text-ink" : "text-ink-2 hover:text-ink",
                    )}
                  >
                    <span
                      aria-hidden
                      className="h-1 w-1 rounded-full transition-all duration-300"
                      style={{
                        background: "var(--ink)",
                        opacity: isActive ? 1 : 0,
                        transform: isActive ? "scale(1)" : "scale(0)",
                      }}
                    />
                    <TextRoll>{item.label}</TextRoll>
                  </Link>
                </motion.li>
              );
            })}
          </ul>

          {/* Mobile menu button */}
          <motion.button
            type="button"
            initial={{ opacity: 0, y: -12 }}
            animate={enter(1)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="relative h-11 w-11 md:hidden"
          >
            <span
              aria-hidden
              className="absolute left-1/2 top-1/2 h-[2px] w-6 -translate-x-1/2 bg-ink transition-transform duration-300 ease-[var(--ease-out)]"
              style={{ transform: open ? "translate(-50%,-50%) rotate(45deg)" : "translate(-50%,-6px)" }}
            />
            <span
              aria-hidden
              className="absolute left-1/2 top-1/2 h-[2px] w-6 -translate-x-1/2 bg-ink transition-transform duration-300 ease-[var(--ease-out)]"
              style={{ transform: open ? "translate(-50%,-50%) rotate(-45deg)" : "translate(-50%,4px)" }}
            />
          </motion.button>
        </nav>
      </header>

      {/* Full-screen mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 md:hidden"
            style={{ zIndex: 60, background: "var(--bg)" }}
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: reduce ? 0 : 0.55, ease: EASE }}
          >
            <div className="shell flex h-full flex-col justify-between pb-16 pt-28">
              <ul className="flex flex-col gap-1">
                {site.nav.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.14 + i * 0.07, duration: 0.5, ease: EASE }}
                  >
                    <Link
                      href={item.href}
                      onClick={(e) => {
                        setOpen(false);
                        onAnchor(e, item.href);
                      }}
                      className="block py-1 font-display text-[15vw] font-semibold leading-[1.02] tracking-[-0.04em]"
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex flex-col gap-4"
              >
                <a
                  href={`mailto:${site.email}`}
                  className="t-h3 link-sweep inline-flex w-fit"
                >
                  {site.email}
                </a>
                <div className="flex flex-wrap gap-x-6 gap-y-1">
                  {site.socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="label !text-ink"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
