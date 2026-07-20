"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";
import { navLinks, profile } from "@/lib/content";
import { ArrowUpRight } from "@/components/ui/icons";
import { useAnchorScroll } from "@/lib/use-anchor-scroll";
import { cn } from "@/lib/utils";
import { EASE, springs } from "@/lib/motion";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const lenis = useLenis();
  const onAnchor = useAnchorScroll();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = [...navLinks.map((l) => l.href.slice(1)), "contact"];
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function toTop(e: React.MouseEvent) {
    e.preventDefault();
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "border-b transition-colors duration-500",
          scrolled || open
            ? "border-border bg-background/70 backdrop-blur-xl"
            : "border-transparent bg-transparent",
        )}
      >
        <nav
          aria-label="Main navigation"
          className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between px-6 sm:px-8 lg:px-16"
        >
          <a
            href="#top"
            onClick={toTop}
            className="group flex items-center gap-2.5 text-sm font-semibold tracking-tight"
          >
            <span className="h-2 w-2 rounded-full bg-accent transition-transform duration-500 group-hover:scale-125" />
            <span className="font-display">{profile.name}</span>
          </a>

          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const isActive = active === link.href.slice(1);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => onAnchor(e, link.href)}
                  className={cn(
                    "relative rounded-full px-3.5 py-2 text-sm transition-colors",
                    isActive
                      ? "text-foreground"
                      : "text-muted hover:text-foreground",
                  )}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-3 -bottom-0.5 h-px bg-accent"
                      transition={springs.snappy}
                    />
                  )}
                </a>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#contact"
              onClick={(e) => onAnchor(e, "#contact")}
              className="hidden items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 md:inline-flex"
            >
              Let&apos;s talk
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground md:hidden"
            >
              <div className="relative h-3.5 w-4">
                <span
                  className={cn(
                    "absolute left-0 h-[1.5px] w-full bg-current transition-all duration-300",
                    open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0.5",
                  )}
                />
                <span
                  className={cn(
                    "absolute bottom-0.5 left-0 h-[1.5px] w-full bg-current transition-all duration-300",
                    open ? "bottom-1/2 translate-y-1/2 -rotate-45" : "",
                  )}
                />
              </div>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="fixed inset-0 top-16 z-40 bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex h-full flex-col justify-between px-6 py-10">
              <nav className="flex flex-col gap-2" aria-label="Mobile">
                {[...navLinks, { label: "Contact", href: "#contact" }].map(
                  (link, i) => (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => {
                        onAnchor(e, link.href);
                        setOpen(false);
                      }}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 + i * 0.06, ease: EASE }}
                      className="text-h2 border-b border-border py-4 font-display text-foreground"
                    >
                      {link.label}
                    </motion.a>
                  ),
                )}
              </nav>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {profile.socials
                  .filter((s) => s.label !== "Email")
                  .map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-muted"
                    >
                      {s.label}
                    </a>
                  ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
