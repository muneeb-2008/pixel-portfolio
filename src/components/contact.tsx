"use client";

import { useEffect, useRef } from "react";
import { site } from "@/content/site";

/**
 * The closing scene — a full-bleed blue field, not a footer.
 *
 * The eight decision fragments arrive here aligned around the call to action,
 * and structural lines shift slightly under the pointer. All of that is
 * enhancement: the layout is complete and readable before any JS runs.
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
        root.style.setProperty("--shift-x", `${dx * 16}px`);
        root.style.setProperty("--shift-y", `${dy * 10}px`);
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
      className="relative overflow-hidden py-[var(--s-24)]"
      style={{
        background: "var(--blue)",
        color: "var(--ink)",
        ["--shift-x" as string]: "0px",
        ["--shift-y" as string]: "0px",
      }}
    >
      {/* Structural lines that drift under the pointer */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          transform: "translate3d(var(--shift-x), var(--shift-y), 0)",
          transition: "transform 400ms var(--ease-out)",
        }}
      >
        <span
          className="absolute left-[12%] top-0 h-full w-px"
          style={{ background: "rgba(16,24,32,0.16)" }}
        />
        <span
          className="absolute left-[70%] top-0 h-full w-px"
          style={{ background: "rgba(16,24,32,0.10)" }}
        />
        <span
          className="absolute left-0 top-[28%] h-px w-full"
          style={{ background: "rgba(16,24,32,0.10)" }}
        />
      </div>

      <div className="shell relative">
        {/* Fragments, finally aligned */}
        <ul
          aria-hidden
          className="grid grid-cols-2 gap-x-[var(--s-6)] gap-y-[var(--s-2)] sm:grid-cols-4 lg:grid-cols-8"
          style={{
            transform: "translate3d(calc(var(--shift-x) * -0.4), 0, 0)",
            transition: "transform 400ms var(--ease-out)",
          }}
        >
          {fragments.map((f) => (
            <li
              key={f}
              className="font-mono uppercase"
              style={{
                fontSize: "var(--t-label)",
                letterSpacing: "var(--tr-label)",
                color: "rgba(16,24,32,0.78)",
              }}
            >
              {f}
            </li>
          ))}
        </ul>

        <h2
          id="contact-heading"
          className="t-display mt-[var(--s-12)] lg:w-[80%]"
        >
          {contact.headline.map((line, i) => (
            <span
              key={line}
              className="block"
              style={i === 1 ? { color: "rgba(16,24,32,0.66)" } : undefined}
            >
              {line}
            </span>
          ))}
        </h2>

        {/* Interactive contact line — an underline that grows, not a button */}
        <div className="mt-[var(--s-12)] flex flex-wrap items-end justify-between gap-x-[var(--s-12)] gap-y-[var(--s-8)]">
          <a
            href={`mailto:${contact.email}`}
            className="group inline-flex max-w-full min-h-11 flex-wrap items-center gap-3 no-underline"
            style={{ color: "var(--ink)", fontSize: "var(--t-h3)" }}
          >
            <span className="relative" style={{ overflowWrap: "anywhere" }}>
              {contact.email}
              <span
                aria-hidden
                className="absolute -bottom-1 left-0 h-[2px] w-full origin-left scale-x-100 transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out)] group-hover:scale-x-0"
                style={{ background: "rgba(16,24,32,0.3)" }}
              />
              <span
                aria-hidden
                className="absolute -bottom-1 left-0 h-[2px] w-full origin-left scale-x-0 transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out)] group-hover:scale-x-100"
                style={{ background: "var(--ink)" }}
              />
            </span>
            <span
              aria-hidden
              className="transition-transform duration-[var(--dur)] ease-[var(--ease-out)] group-hover:translate-x-1"
            >
              →
            </span>
          </a>

          <a
            href={contact.linkedin.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center gap-2 no-underline"
            style={{ color: "var(--ink)", fontSize: "var(--t-small)" }}
          >
            <span
              className="border-b pb-[2px]"
              style={{ borderColor: "rgba(16,24,32,0.4)" }}
            >
              {contact.linkedin.label}
            </span>
            <span aria-hidden>↗</span>
          </a>
        </div>

        {/* Quiet resolution */}
        <div
          className="mt-[var(--s-24)] flex flex-wrap items-center justify-between gap-x-[var(--s-8)] gap-y-[var(--s-2)] pt-[var(--s-4)]"
          style={{ borderTop: "1px solid rgba(16,24,32,0.18)" }}
        >
          <p
            className="font-mono uppercase"
            style={{
              fontSize: "var(--t-label)",
              letterSpacing: "var(--tr-label)",
              color: "rgba(16,24,32,0.82)",
            }}
          >
            {contact.location}
          </p>
          {availability.visible && (
            <p
              className="inline-flex items-center gap-2 font-mono uppercase"
              style={{
                fontSize: "var(--t-label)",
                letterSpacing: "var(--tr-label)",
                color: "rgba(16,24,32,0.82)",
              }}
            >
              <span
                aria-hidden
                className="h-[7px] w-[7px] rounded-full"
                style={{ background: "var(--ink)" }}
              />
              {availability.label}
            </p>
          )}
          <p
            className="font-mono uppercase"
            style={{
              fontSize: "var(--t-label)",
              letterSpacing: "var(--tr-label)",
              color: "rgba(16,24,32,0.82)",
            }}
          >
            {site.name} — {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </section>
  );
}
