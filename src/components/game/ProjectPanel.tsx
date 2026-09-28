"use client";

import { useEffect, useState } from "react";
import type { Project } from "@/game/types";
import { play } from "@/game/audio";
import { asset } from "@/lib/asset";
import { Modal } from "./Modal";
import { PixelIcon } from "./PixelIcon";

/** Art for projects without screenshots: the Figma → Framer pipeline as a pixel diagram. */
function WorkflowArt() {
  const steps = ["Figma", "Systems", "Framer", "Ship"];
  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-2 px-4 sm:gap-3" aria-label="Workflow: Figma, Systems, Framer, Ship">
      {steps.map((s, i) => (
        <span key={s} className="flex items-center gap-2 sm:gap-3">
          <span
            className="t-ui border-2 border-[color:var(--ink)] px-3 py-2 text-[0.8125rem] font-bold shadow-[0_3px_0_rgba(0,0,0,0.45)] sm:text-[1rem]"
            style={{ background: i === steps.length - 1 ? "var(--gold)" : "var(--panel-3)", color: i === steps.length - 1 ? "#2a1a0c" : "var(--text)" }}
          >
            {s}
          </span>
          {i < steps.length - 1 && <PixelIcon name="play" className="text-[color:var(--gold)]" />}
        </span>
      ))}
    </div>
  );
}

/** A project, presented as a parchment page pinned inside the building. */
export function ProjectPanel({
  project,
  district,
  fresh,
  nav,
  onDiscover,
  onClose,
}: {
  project: Project;
  district: string;
  /** first visit — XP is granted once the page has actually been on screen */
  fresh?: boolean;
  /** browsing from the Quest Log: step through projects (also ← / →) */
  nav?: { onPrev: () => void; onNext: () => void; position: string };
  onDiscover?: () => void;
  onClose: () => void;
}) {
  const [shot, setShot] = useState(0);
  const [discovered, setDiscovered] = useState(false);

  // discovery counts after ~2s of actually looking — skimming with Next doesn't farm XP
  useEffect(() => {
    if (!fresh) return;
    const id = window.setTimeout(() => {
      setDiscovered(true);
      onDiscover?.();
    }, 2000);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fresh]);

  useEffect(() => {
    if (!nav) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat || (e.target as HTMLElement)?.closest?.("input, textarea")) return;
      if (e.key === "ArrowLeft") nav.onPrev();
      if (e.key === "ArrowRight") nav.onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nav]);

  return (
    <Modal title={project.title} onClose={onClose} variant="paper" width="max-w-3xl">
      <p className="t-ui -mt-3 mb-4 text-[0.75rem] text-[color:var(--parchment-ink-2)]">
        {district} · {project.kind}
      </p>
      {/* art — true 16:9 frame; on short screens it narrows (never crops) so the page still fits */}
      <div className="well relative mx-auto mb-3 w-full max-w-[calc(58vh*16/9)]">
        <div className="checker flex aspect-[16/9] w-full items-center justify-center overflow-hidden">
          {project.gallery.length ? (
            <a href={asset(project.gallery[shot])} target="_blank" rel="noopener noreferrer" className="block h-full w-full" title="Open full size">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={shot}
                src={asset(project.gallery[shot])}
                alt={`${project.title} — image ${shot + 1} of ${project.gallery.length} (opens full size)`}
                width={1600}
                height={900}
                className="pop h-full w-full object-contain"
              />
            </a>
          ) : (
            <WorkflowArt />
          )}
        </div>
      </div>
      {fresh && discovered && (
        <p className="t-ui pop mb-3 inline-flex items-center gap-1.5 border-2 border-[color:var(--ink)] bg-[#4f7a2f] px-2 py-1 text-[0.75rem] font-bold text-[#f1e2c2]" role="status">
          <PixelIcon name="star" px={1.5} /> Discovered · +60 XP
        </p>
      )}

      {/* gallery thumbnails */}
      {project.gallery.length > 1 && (
        <div className="mb-5 flex gap-2" role="group" aria-label="Project images">
          {project.gallery.map((g, i) => (
            <button
              key={g}
              type="button"
              onClick={() => {
                play("select");
                setShot(i);
              }}
              aria-label={`Show image ${i + 1}`}
              aria-pressed={shot === i}
              className="w-20 border-2 p-0.5 sm:w-24"
              style={{ borderColor: shot === i ? "var(--gold-lo)" : "var(--parchment-ink-2)", opacity: shot === i ? 1 : 0.7 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(g)} alt="" width={160} height={90} className="block aspect-[16/9] w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <h3 className="t-ui mt-1 text-[0.8125rem] font-bold text-[color:var(--parchment-ink)]">Overview</h3>
      <div className="mt-3 flex flex-col gap-3">
        {project.body.map((para) => (
          <p key={para} className="t-body text-[1.0625rem] leading-relaxed text-[color:var(--parchment-ink)] [text-wrap:pretty]">
            {para}
          </p>
        ))}
      </div>

      {/* case study — Role · Timeline · Challenge · Approach · Key decision · What shipped (each only if provided) */}
      {project.caseStudy && (
        <dl className="mt-5 grid gap-4 sm:grid-cols-2">
          {(
            [
              ["Role", project.caseStudy.role],
              ["Timeline", project.caseStudy.timeline],
              ["The challenge", project.caseStudy.problem],
              ["Key decision", project.caseStudy.decision],
            ] as const
          )
            .filter(([, v]) => v)
            .map(([k, v]) => (
              <div key={k} className="border-l-4 border-[color:var(--brass)] pl-3">
                <dt className="t-ui text-[0.75rem] font-bold text-[color:var(--parchment-ink-2)]">{k}</dt>
                <dd className="t-body mt-1 text-[1rem] leading-relaxed text-[color:var(--parchment-ink)]">{v}</dd>
              </div>
            ))}
          {project.caseStudy.process?.length ? (
            <div className="border-l-4 border-[color:var(--brass)] pl-3 sm:col-span-2">
              <dt className="t-ui text-[0.75rem] font-bold text-[color:var(--parchment-ink-2)]">Approach</dt>
              <dd>
                <ol className="t-body mt-1 flex list-decimal flex-col gap-1 pl-5 text-[1rem] leading-relaxed text-[color:var(--parchment-ink)]">
                  {project.caseStudy.process.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </dd>
            </div>
          ) : null}
          {project.caseStudy.outcome && (
            <div className="border-l-4 border-[color:var(--moss)] pl-3 sm:col-span-2">
              <dt className="t-ui text-[0.75rem] font-bold text-[color:var(--parchment-ink-2)]">What shipped</dt>
              <dd className="t-body mt-1 text-[1rem] leading-relaxed text-[color:var(--parchment-ink)]">
                {project.caseStudy.outcome}
                {project.caseStudy.live && (
                  <>
                    {" "}
                    <a href={project.caseStudy.live.url} target="_blank" rel="noopener noreferrer" className="whitespace-nowrap font-bold underline underline-offset-4">
                      {project.caseStudy.live.label} ↗<span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </>
                )}
              </dd>
            </div>
          )}
        </dl>
      )}

      <ul className="mt-5 flex flex-wrap gap-2" aria-label="Tags">
        {project.tags.map((t) => (
          <li
            key={t}
            className="t-ui border-2 border-[color:var(--parchment-ink-2)] px-2 py-0.5 text-[0.75rem] text-[color:var(--parchment-ink)]"
          >
            {t}
          </li>
        ))}
      </ul>

      <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
        {nav ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                play("select");
                nav.onPrev();
              }}
              className="btn btn-wood"
              aria-label="Previous project"
            >
              <PixelIcon name="play" className="rotate-180" />
              Prev
            </button>
            <span className="t-ui px-1 text-[0.75rem] text-[color:var(--parchment-ink-2)]">{nav.position}</span>
            <button
              type="button"
              onClick={() => {
                play("select");
                nav.onNext();
              }}
              className="btn btn-wood"
              aria-label="Next project"
            >
              Next
              <PixelIcon name="play" />
            </button>
          </div>
        ) : (
          <span />
        )}
        <div className="flex flex-wrap gap-2">
          {project.link && (
            <a href={project.link.url} target="_blank" rel="noopener noreferrer" className="btn btn-wood">
              {project.link.label}
              <PixelIcon name="play" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
        <button type="button" onClick={onClose} className="btn">
          <PixelIcon name={nav ? "book" : "door"} />
          {nav ? "Back to list" : "Back to town"}
        </button>
        </div>
      </div>
    </Modal>
  );
}
