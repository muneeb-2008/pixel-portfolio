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
  onClose,
}: {
  project: Project;
  district: string;
  /** first discovery — show the XP reward ribbon */
  fresh?: boolean;
  /** browsing from the Quest Log: step through projects (also ← / →) */
  nav?: { onPrev: () => void; onNext: () => void; position: string };
  onClose: () => void;
}) {
  const [shot, setShot] = useState(0);

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
    <Modal title={district} onClose={onClose} variant="paper" width="max-w-3xl">
      {/* art — 16:9 main image, capped so the page fits short screens */}
      <div className="well relative mb-3">
        <div className="checker flex aspect-[16/9] max-h-[38vh] w-full items-center justify-center overflow-hidden">
          {project.gallery.length ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={shot}
              src={asset(project.gallery[shot])}
              alt={`${project.title} — image ${shot + 1} of ${project.gallery.length}`}
              width={1600}
              height={900}
              className="pop h-full w-full object-cover"
            />
          ) : (
            <WorkflowArt />
          )}
        </div>
        {fresh && (
          <span className="t-ui absolute right-3 top-3 flex items-center gap-1.5 border-2 border-[color:var(--ink)] bg-[color:var(--moss)] px-2 py-1 text-[0.75rem] font-bold text-[#1d2a12] shadow-[0_3px_0_rgba(0,0,0,0.45)]">
            <PixelIcon name="star" px={1.5} /> Discovered · +60 XP
          </span>
        )}
      </div>

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

      <p className="t-ui text-[0.75rem] text-[color:var(--parchment-ink-2)]">{project.kind}</p>
      <h3 className="t-display mt-1 text-[40px] text-[color:var(--parchment-ink)] [text-wrap:balance]">{project.title}</h3>
      <div className="mt-3 flex flex-col gap-3">
        {project.body.map((para) => (
          <p key={para} className="t-body text-[1.0625rem] leading-relaxed text-[color:var(--parchment-ink)] [text-wrap:pretty]">
            {para}
          </p>
        ))}
      </div>

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
