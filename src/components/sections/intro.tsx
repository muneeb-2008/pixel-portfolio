"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { site } from "@/content/site";
import { Reveal } from "@/components/ui/reveal";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Intro() {
  const { intro } = site;
  const [i, setI] = useState(0);
  const groupName = useId();
  const reduce = useReducedMotion();
  const current = intro.roles[i];

  return (
    <section
      id="info"
      aria-labelledby="info-heading"
      className="shell scroll-mt-24"
      style={{ paddingBlock: "var(--scene-y)" }}
    >
      <Reveal>
        <p className="label">{intro.label}</p>
        <h2 id="info-heading" className="t-display mt-[var(--s-8)] measure-wide">
          {intro.statement}
        </h2>
        <p className="t-lead mt-[var(--s-6)] text-ink-2">{intro.lead}</p>
      </Reveal>

      <div className="grid-12 mt-[var(--s-16)] items-start gap-y-[var(--s-10)]">
        {/* Role selector */}
        <Reveal className="col-span-full lg:col-span-4">
          <fieldset className="border-0 p-0">
            <legend className="label mb-[var(--s-5)]">If you&apos;re…</legend>
            <div role="radiogroup" className="flex flex-col">
              {intro.roles.map((r, idx) => {
                const isActive = idx === i;
                return (
                  <label
                    key={r.role}
                    className="group flex cursor-pointer items-center gap-4 border-t border-line py-4 last:border-b"
                  >
                    <input
                      type="radio"
                      name={groupName}
                      checked={isActive}
                      onChange={() => setI(idx)}
                      className="absolute h-px w-px overflow-hidden opacity-0"
                    />
                    <span
                      aria-hidden
                      className="relative h-2 w-2 shrink-0 rounded-full transition-all duration-300"
                      style={{
                        background: isActive ? "var(--ink)" : "transparent",
                        boxShadow: isActive ? "none" : "inset 0 0 0 1.5px var(--line)",
                        transform: isActive ? "scale(1)" : "scale(0.85)",
                      }}
                    />
                    <span
                      className="t-h3 transition-colors duration-300"
                      style={{ color: isActive ? "var(--ink)" : "var(--ink-3)" }}
                    >
                      {r.role}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </Reveal>

        {/* Answer */}
        <div className="col-span-full lg:col-span-7 lg:col-start-6">
          <p className="label mb-[var(--s-5)]">…here&apos;s the honest answer</p>
          <div className="min-h-[9rem]" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.p
                key={current.role}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -14 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="font-display font-medium text-ink"
                style={{ fontSize: "var(--t-h2)", lineHeight: 1.18, letterSpacing: "-0.02em" }}
              >
                {current.answer}
              </motion.p>
            </AnimatePresence>
          </div>

          <Reveal delay={0.05}>
            <ul className="mt-[var(--s-12)] flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-[var(--s-6)]">
              {intro.services.map((s) => (
                <li key={s} className="text-ink-2" style={{ fontSize: "var(--t-small)" }}>
                  {s}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
