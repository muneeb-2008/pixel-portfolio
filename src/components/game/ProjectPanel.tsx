"use client";

import { useEffect } from "react";
import type { Project } from "@/game/types";
import { play } from "@/game/audio";
import { Modal } from "./Modal";
import { PixelIcon } from "./PixelIcon";

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
      {/* art slot — 16:9, holds real imagery when `image` is set; capped so the page fits short screens */}
      <div className="well relative mb-5">
        <div className="checker flex aspect-[16/9] max-h-[38vh] w-full items-center justify-center overflow-hidden">
          {project.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={project.image} alt={project.title} width={1600} height={900} className="h-full w-full object-cover" />
          ) : (
            <span className="t-ui text-center text-[0.75rem] leading-relaxed text-[color:var(--text-3)]">
              Project art
              <br />
              16:9 · 1600×900
            </span>
          )}
        </div>
        {fresh && (
          <span className="t-ui absolute right-3 top-3 flex items-center gap-1.5 border-2 border-[color:var(--ink)] bg-[color:var(--moss)] px-2 py-1 text-[0.75rem] font-bold text-[#1d2a12] shadow-[0_3px_0_rgba(0,0,0,0.45)]">
            <PixelIcon name="star" px={1.5} /> Discovered · +60 XP
          </span>
        )}
      </div>

      <p className="t-ui text-[0.75rem] text-[color:var(--parchment-ink-2)]">
        {project.kind} · {project.year}
      </p>
      <h3 className="t-display mt-1 text-[2.25rem] text-[color:var(--parchment-ink)] [text-wrap:balance] sm:text-[2.75rem]">
        {project.title}
      </h3>
      <p className="t-body mt-3 text-[1.0625rem] leading-relaxed text-[color:var(--parchment-ink)] [text-wrap:pretty]">
        {project.blurb}
      </p>

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
        <button type="button" onClick={onClose} className="btn">
          <PixelIcon name={nav ? "book" : "door"} />
          {nav ? "Back to list" : "Back to town"}
        </button>
      </div>
    </Modal>
  );
}
