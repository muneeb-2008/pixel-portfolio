"use client";

import { motion, useReducedMotion } from "motion/react";
import { site } from "@/content/site";
import { LineReveal } from "@/components/ui/reveal";
import { ArrowRight } from "@/components/ui/icons";
import { useLoaderDone } from "@/lib/use-loader-done";
import { useAnchorScroll } from "@/lib/use-anchor-scroll";

export function Hero() {
  const start = useLoaderDone();
  const reduce = useReducedMotion();
  const onAnchor = useAnchorScroll();

  return (
    <section
      aria-label="Introduction"
      className="relative flex min-h-[92svh] flex-col justify-between pt-[var(--s-32)] pb-[var(--s-12)]"
    >
      <div className="shell w-full">
        <motion.p
          data-reveal
          className="label"
          initial={{ opacity: 0 }}
          animate={start ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          {site.role} · {site.location}
        </motion.p>

        <h1 className="t-hero mt-[var(--s-8)]">
          <LineReveal lines={site.hero.lines} start={start} />
        </h1>
      </div>

      <div className="shell w-full">
        <div className="grid-12 items-end gap-y-[var(--s-8)]">
          <motion.p
            data-reveal
            className="measure col-span-full text-ink-2 md:col-span-5"
            style={{ fontSize: "var(--t-lead)" }}
            initial={{ opacity: 0, y: 16 }}
            animate={start ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {site.hero.intro}
          </motion.p>

          <motion.a
            data-reveal
            href="#work"
            onClick={(e) => onAnchor(e, "#work")}
            className="group col-span-full flex items-center gap-3 md:col-span-3 md:col-start-10 md:justify-end"
            initial={{ opacity: 0 }}
            animate={start ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.62 }}
          >
            <span className="label !text-ink">{site.hero.scrollCue}</span>
            <span
              className="grid h-11 w-11 place-items-center rounded-full border border-line transition-colors duration-300 group-hover:border-ink"
              aria-hidden
            >
              {reduce ? (
                <ArrowRight className="rotate-90" />
              ) : (
                <motion.span
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowRight className="rotate-90" />
                </motion.span>
              )}
            </span>
          </motion.a>
        </div>
      </div>
    </section>
  );
}
