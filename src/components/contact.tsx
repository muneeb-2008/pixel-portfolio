"use client";

import { useEffect, useRef } from "react";
import { site } from "@/content/site";

/**
 * The closing scene — white, with controlled blue structure.
 *
 * Refinement pass: the flat #87CEFA field became a white scene with a grid
 * panel and a single blue rule, which reads as more premium and keeps blue
 * restrained. The eight decision labels still resolve here, but quietly.
 *
 * Pointer response is enhancement only — the layout is complete before JS.
 */
export function Contact() {
  const { contact, fragments, availability } = site;
  const rootRef = useRef<HTMLElement>(null);
  const frame = useRef(0);

  useEffect(() => {
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (calm.matches || !fine.matches) return;

    let active = true;
    const io = new IntersectionObserver(([e]) => (active = e.isIntersecting));
    if (rootRef.current) io.observe(rootRef.current);

    const onMove = (e: PointerEvent) => {
      if (!active || frame.current) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = 0;
        const root = rootRef.current;
        if (!root) return;
        const r = root.getBoundingClientRect();
        const dx = (e.clientX - r.left) / r.width - 0.5;
        const dy = (e.clientY - r.top) / r.height - 0.5;
        root.style.setProperty("--shift-x", `${dx * 14}px`);
        root.style.setProperty("--shift-y", `${dy * 8}px`);
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, []);

  return (
    <section
      ref={rootRef}
      id="contact"
      aria-labelledby="contact-heading"
      className="relative overflow-hidden"
      style={{
        paddingBlock: "var(--scene-y)",
        ["--shift-x" as string]: "0px",
        ["--shift-y" as string]: "0px",
      }}
    >
      {/* Grid device + one blue rule that drifts under the pointer */}
      <div
        aria-hidden
        className="grid-panel pointer-events-none absolute inset-x-0 bottom-0 h-[78%]"
        style={{
          transform: "translate3d(var(--shift-x), var(--shift-y), 0)",
          transition: "transform 500ms var(--ease-out)",
        }}
      />

      <div className="shell relative">
        <p className="label">Contact</p>

        <h2 id="contact-heading" className="t-display mt-[var(--s-8)] lg:w-[86%]">
          {contact.headline.map((line, i) => (
            <span
              key={line}
              className="block"
              style={i === 1 ? { color: "var(--ink-2)" } : undefined}
            >
              {line}
            </span>
          ))}
        </h2>

        {/* The contact line — an underline that answers the pointer */}
        <div className="mt-[var(--s-24)]">
          <a
            href={`mailto:${contact.email}`}
            className="group inline-flex max-w-full items-baseline gap-4 no-underline"
            style={{ color: "var(--ink)" }}
          >
            <span
              className="relative font-display"
              style={{
                fontSize: "var(--t-h2)",
                fontWeight: 600,
                letterSpacing: "-0.03em",
                overflowWrap: "anywhere",
              }}
            >
              {contact.email}
              <span
                aria-hidden
                className="absolute -bottom-2 left-0 h-[2px] w-full origin-left transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out)]"
                style={{ background: "var(--line)" }}
              />
              <span
                aria-hidden
                className="absolute -bottom-2 left-0 h-[2px] w-full origin-left scale-x-0 transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out)] group-hover:scale-x-100"
                style={{ background: "var(--blue-strong)" }}
              />
            </span>
          </a>
        </div>

        {/* Quiet resolution */}
        <div className="mt-[var(--s-32)] flex flex-wrap items-baseline gap-x-[var(--s-16)] gap-y-[var(--s-4)]">
          <a
            href={contact.linkedin.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center gap-2 no-underline"
            style={{ color: "var(--ink)", fontSize: "var(--t-small)" }}
          >
            <span
              className="border-b pb-[3px]"
              style={{ borderColor: "var(--blue-strong)" }}
            >
              {contact.linkedin.label}
            </span>
            <span aria-hidden style={{ color: "var(--blue-ink)" }}>
              ↗
            </span>
          </a>
          <p style={{ color: "var(--ink-2)", fontSize: "var(--t-small)" }}>
            {contact.location}
          </p>
          {availability.visible && (
            <p
              className="inline-flex items-center gap-2"
              style={{ color: "var(--ink-2)", fontSize: "var(--t-small)" }}
            >
              <span
                aria-hidden
                className="h-[7px] w-[7px] rounded-full"
                style={{ background: "var(--blue-strong)" }}
              />
              {availability.label}
            </p>
          )}
        </div>

        {/* The eight decisions, finally aligned — the motif resolves */}
        <ul
          aria-hidden
          className="mt-[var(--s-40)] grid grid-cols-2 gap-x-[var(--s-8)] gap-y-[var(--s-3)] sm:grid-cols-4 lg:grid-cols-8"
          style={{
            transform: "translate3d(calc(var(--shift-x) * -0.3), 0, 0)",
            transition: "transform 500ms var(--ease-out)",
          }}
        >
          {fragments.map((f) => (
            <li key={f} className="label">
              {f}
            </li>
          ))}
        </ul>

        <p
          className="mt-[var(--s-16)]"
          style={{ color: "var(--ink-2)", fontSize: "var(--t-label)" }}
        >
          {site.name} — {new Date().getFullYear()}
        </p>
      </div>
    </section>
  );
}
