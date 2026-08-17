"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { site } from "@/content/site";
import { useAnchorScroll } from "@/lib/use-anchor-scroll";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Footer() {
  const year = new Date().getFullYear();
  const onAnchor = useAnchorScroll();
  const reduce = useReducedMotion();

  return (
    <footer className="border-t border-line" style={{ background: "var(--bg-2)" }}>
      <div className="shell pt-[var(--s-20)] pb-[var(--s-10)]">
        {/* Top row: prompt + email */}
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <p className="t-h3 max-w-[18ch] text-ink-2">
            Have a project in mind? Let&apos;s talk.
          </p>
          <a
            href={`mailto:${site.email}`}
            className="link-sweep t-h3 inline-flex font-display font-medium"
            data-cursor
          >
            {site.email}
          </a>
        </div>

        {/* Masked wordmark reveal */}
        <div className="mt-[var(--s-16)] overflow-hidden">
          <motion.p
            data-reveal
            className="font-display font-semibold tracking-[-0.045em] leading-[0.9]"
            style={{ fontSize: "clamp(3.5rem, 15vw, 15rem)" }}
            initial={reduce ? { opacity: 0 } : { y: "16%", opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            {site.name}
          </motion.p>
        </div>

        {/* Bottom bar */}
        <div className="mt-[var(--s-12)] flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t border-line pt-6">
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => onAnchor(e, item.href)}
                className="label link-sweep inline-flex min-h-[26px] items-center !text-ink"
              >
                {item.label}
              </Link>
            ))}
            {site.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="label link-sweep inline-flex min-h-[26px] items-center"
              >
                {s.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-6">
            <span className="label">
              © {year} {site.name}
            </span>
            <a
              href="#main"
              onClick={(e) => onAnchor(e, "#main")}
              className="label link-sweep inline-flex min-h-[26px] items-center !text-ink"
            >
              Back to top ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
