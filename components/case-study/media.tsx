"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { BeforeAfter, MediaItem, VideoItem } from "@/lib/case-studies";
import { cn } from "@/lib/utils";
import { EASE } from "@/lib/motion";

/* ------------------------------------------------------------------ *
 * Lightbox — opt-in, keyboard accessible, Escape to close
 * ------------------------------------------------------------------ */

function Lightbox({
  items,
  index,
  onClose,
  onNavigate,
}: {
  items: MediaItem[];
  index: number;
  onClose: () => void;
  onNavigate: (next: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const item = items[index];

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const node = ref.current;
    node?.focus();
    document.body.style.overflow = "hidden";

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowRight" && items.length > 1) {
        onNavigate((index + 1) % items.length);
      } else if (e.key === "ArrowLeft" && items.length > 1) {
        onNavigate((index - 1 + items.length) % items.length);
      } else if (e.key === "Tab") {
        // Focus stays within the dialog.
        const focusable = node?.querySelectorAll<HTMLElement>(
          'button, [href], [tabindex]:not([tabindex="-1"])',
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      previouslyFocused?.focus();
    };
  }, [index, items.length, onClose, onNavigate]);

  return (
    <motion.div
      ref={ref}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={`${item.alt}. Image ${index + 1} of ${items.length}.`}
      initial={reduce ? { opacity: 0 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: EASE }}
      className="fixed inset-0 z-[90] flex flex-col bg-background/95 p-4 backdrop-blur-xl sm:p-8"
    >
      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-xs text-faint">
          {index + 1} / {items.length}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-11 items-center rounded-full border border-border px-4 text-sm text-foreground transition-colors hover:bg-surface"
        >
          Close
        </button>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center py-6">
        <Image
          src={item.src}
          alt={item.alt}
          width={item.width}
          height={item.height}
          sizes="90vw"
          className="max-h-full w-auto max-w-full rounded-lg object-contain"
        />
      </div>

      {(item.caption || items.length > 1) && (
        <div className="flex flex-col items-center gap-4">
          {item.caption && (
            <p className="measure text-center text-sm text-muted">
              {item.caption}
            </p>
          )}
          {items.length > 1 && (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => onNavigate((index - 1 + items.length) % items.length)}
                className="inline-flex h-11 items-center rounded-full border border-border px-4 text-sm transition-colors hover:bg-surface"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => onNavigate((index + 1) % items.length)}
                className="inline-flex h-11 items-center rounded-full border border-border px-4 text-sm transition-colors hover:bg-surface"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ *
 * Figure
 * ------------------------------------------------------------------ */

export function Figure({
  item,
  priority = false,
  sizes = "(min-width: 1024px) 60vw, 100vw",
  onZoom,
  className,
}: {
  item: MediaItem;
  priority?: boolean;
  sizes?: string;
  onZoom?: () => void;
  className?: string;
}) {
  const image = (
    <Image
      src={item.src}
      alt={item.alt}
      width={item.width}
      height={item.height}
      sizes={sizes}
      priority={priority}
      loading={priority ? "eager" : "lazy"}
      className="h-auto w-full rounded-2xl border border-border object-cover"
    />
  );

  return (
    <figure className={cn("w-full", className)}>
      {onZoom ? (
        <button
          type="button"
          onClick={onZoom}
          aria-label={`Enlarge image: ${item.alt}`}
          className="block w-full cursor-zoom-in rounded-2xl transition-opacity hover:opacity-95"
        >
          {image}
        </button>
      ) : (
        image
      )}
      {item.caption && (
        <figcaption className="measure mt-3 text-sm leading-relaxed text-faint">
          {item.caption}
        </figcaption>
      )}
    </figure>
  );
}

/* ------------------------------------------------------------------ *
 * Gallery — zoomable set
 * ------------------------------------------------------------------ */

export function Gallery({
  items,
  className,
}: {
  items: MediaItem[];
  className?: string;
}) {
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);

  return (
    <>
      <div className={cn("grid grid-cols-1 gap-8 md:grid-cols-2", className)}>
        {items.map((item, i) => (
          <Figure
            key={item.src}
            item={item}
            onZoom={() => setOpen(i)}
            sizes="(min-width: 768px) 45vw, 100vw"
            className={item.layout === "full" ? "md:col-span-2" : undefined}
          />
        ))}
      </div>
      <AnimatePresence>
        {open !== null && (
          <Lightbox
            items={items}
            index={open}
            onClose={close}
            onNavigate={setOpen}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/* ------------------------------------------------------------------ *
 * Before / after
 * ------------------------------------------------------------------ */

export function BeforeAfterView({ data }: { data: BeforeAfter }) {
  return (
    <div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {(
          [
            ["Before", data.before],
            ["After", data.after],
          ] as const
        ).map(([label, item]) => (
          <div key={label}>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-faint">
              {label}
            </p>
            <Figure item={item} sizes="(min-width: 768px) 45vw, 100vw" />
          </div>
        ))}
      </div>
      <p className="measure mt-6 leading-relaxed text-muted">{data.summary}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Prototype video — never autoplays with sound
 * ------------------------------------------------------------------ */

export function PrototypePlayer({ video }: { video: VideoItem }) {
  return (
    <figure>
      <video
        controls
        preload="none"
        playsInline
        muted
        poster={video.poster}
        className="w-full rounded-2xl border border-border"
      >
        <source src={video.src} type="video/mp4" />
        {video.description}
      </video>
      <figcaption className="measure mt-3 text-sm leading-relaxed text-faint">
        {video.caption}
        <span className="sr-only"> {video.description}</span>
      </figcaption>
    </figure>
  );
}
