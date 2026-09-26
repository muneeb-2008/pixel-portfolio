"use client";

import { useEffect, useRef } from "react";
import { paintSprite } from "@/game/render";
import type { AnimFrame, Dir, HatKind, Palette } from "@/game/types";

/** A crisp, upscaled pixel sprite rendered to a canvas. */
export function SpritePortrait({
  palette,
  hat = "none",
  dir = "down",
  step = 0,
  scale = 6,
  className,
}: {
  palette: Palette;
  hat?: HatKind;
  dir?: Dir;
  step?: AnimFrame;
  scale?: number;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (ref.current) paintSprite(ref.current, palette, dir, step, hat, scale);
  }, [palette, hat, dir, step, scale]);
  return <canvas ref={ref} className={className} aria-hidden />;
}
