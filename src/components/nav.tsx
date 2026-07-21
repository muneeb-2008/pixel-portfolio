"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";

/**
 * Light editorial navigation. Transparent over the hero, then a soft white
 * backdrop with a thin border once the page moves. No capsule, no CTA button.
 */
export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Blue indicator follows the section in view */
  useEffect(() => {
    const ids = site.nav.map((n) => n.href.slice(1));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  /* Escape closes the panel and returns focus to the control */
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className="fixed inset-x-0 top-0 transition-[background-color,border-color,backdrop-filter] duration-[var(--dur-slow)]"
      style={{
        zIndex: "var(--z-nav)",
        borderBottom: `1px solid ${scrolled && !open ? "var(--line)" : "transparent"}`,
        background:
          scrolled && !open ? "color-mix(in srgb, var(--bg) 82%, transparent)" : "transparent",
        backdropFilter: scrolled && !open ? "blur(14px)" : "none",
      }}
    >
      <nav
        aria-label="Primary"
        className="shell flex items-center justify-between gap-[var(--s-4)] py-[var(--s-3)]"
      >
        <a
          href="#main"
          className="inline-flex min-h-11 items-center font-display text-[1.0625rem] font-medium tracking-[-0.02em] no-underline"
          style={{ color: "var(--ink)" }}
        >
          {site.name}
        </a>

        <div className="hidden items-center gap-[var(--s-8)] md:flex">
          {site.availability.visible && <Availability />}
          <ul className="flex items-center gap-[var(--s-6)]">
            {site.nav.map((item) => {
              const isActive = active === item.href.slice(1);
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={isActive ? "true" : undefined}
                    className="relative inline-flex min-h-11 items-center text-[0.9375rem] no-underline transition-colors duration-[var(--dur)]"
                    style={{ color: isActive ? "var(--ink)" : "var(--ink-2)" }}
                  >
                    {item.label}
                    <span
                      aria-hidden
                      className="absolute inset-x-0 bottom-[10px] h-[2px] origin-left transition-transform duration-[var(--dur)] ease-[var(--ease-out)]"
                      style={{
                        background: "var(--blue-strong)",
                        transform: isActive ? "scaleX(1)" : "scaleX(0)",
                      }}
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Animated menu control — two rules that cross */}
        <button
          ref={toggleRef}
          type="button"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="relative inline-flex h-11 w-11 items-center justify-center md:hidden"
          style={{ zIndex: "var(--z-menu)" }}
        >
          <span
            aria-hidden
            className="absolute h-[2px] w-6 transition-transform duration-[var(--dur)] ease-[var(--ease-out)]"
            style={{
              background: "var(--ink)",
              transform: open ? "rotate(45deg)" : "translateY(-4px)",
            }}
          />
          <span
            aria-hidden
            className="absolute h-[2px] w-6 transition-transform duration-[var(--dur)] ease-[var(--ease-out)]"
            style={{
              background: open ? "var(--ink)" : "var(--blue-strong)",
              transform: open ? "rotate(-45deg)" : "translateY(4px)",
            }}
          />
        </button>
      </nav>

      {/* Full-screen white canvas */}
      <div
        id="mobile-nav"
        ref={panelRef}
        hidden={!open}
        className="fixed inset-0 md:hidden"
        style={{ zIndex: "var(--z-menu)", background: "var(--bg)" }}
      >
        <div className="shell flex h-full flex-col justify-between pb-[var(--s-12)] pt-[calc(var(--s-16)+var(--s-8))]">
          <ul className="flex flex-col">
            {site.nav.map((item, i) => (
              <li key={item.href} style={{ borderTop: "1px solid var(--line-soft)" }}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="group flex items-baseline justify-between py-[var(--s-6)] font-display no-underline"
                  style={{
                    color: "var(--ink)",
                    fontSize: "var(--t-h2)",
                    letterSpacing: "-0.03em",
                  }}
                >
                  {item.label}
                  <span
                    aria-hidden
                    className="font-mono"
                    style={{ fontSize: "var(--t-label)", color: "var(--blue-strong)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-[var(--s-3)]">
            {site.availability.visible && <Availability />}
            <a
              href={`mailto:${site.contact.email}`}
              className="text-[var(--t-small)] no-underline"
              style={{ color: "var(--blue-ink)" }}
            >
              {site.contact.email}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

/** DEMO content — see site.availability. */
function Availability() {
  return (
    <span className="inline-flex items-center gap-[var(--s-2)]">
      <span
        aria-hidden
        className="h-[7px] w-[7px] rounded-full"
        style={{ background: "var(--blue-strong)" }}
      />
      <span className="label">{site.availability.label}</span>
    </span>
  );
}
