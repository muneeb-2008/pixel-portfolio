import type { CSSProperties } from "react";
import type { Project } from "@/content/projects";

/**
 * A project cover composed entirely in CSS — no stock images.
 *
 * Each project gets a deterministic abstract "poster" built from its accent:
 * a soft field, a geometric motif that varies by index, and the project's
 * number. Reused on cards and the detail hero so the identity carries through.
 */
export function Cover({
  project,
  className,
}: {
  project: Project;
  className?: string;
}) {
  const n = Number(project.index);
  const variant = n % 3; // three motif families
  const a = project.accent;

  const field: CSSProperties = {
    background: `radial-gradient(120% 120% at 15% 0%, ${a}22, transparent 55%),
                 radial-gradient(100% 100% at 100% 100%, ${a}18, transparent 60%),
                 var(--bg-2)`,
  };

  return (
    <div
      className={`relative h-full w-full overflow-hidden ${className ?? ""}`}
      style={field}
      role="img"
      aria-label={`${project.title} — composed placeholder cover`}
    >
      {/* fine grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage: `linear-gradient(${a}14 1px, transparent 1px), linear-gradient(90deg, ${a}14 1px, transparent 1px)`,
          backgroundSize: "clamp(38px, 6vw, 64px) clamp(38px, 6vw, 64px)",
          maskImage:
            "radial-gradient(ellipse 80% 80% at 50% 50%, #000 20%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 80% at 50% 50%, #000 20%, transparent 80%)",
        }}
      />

      {/* motif */}
      <div aria-hidden className="absolute inset-0">
        {variant === 0 && (
          <>
            <span
              className="absolute rounded-full"
              style={{
                left: "58%",
                top: "18%",
                width: "46%",
                aspectRatio: "1",
                background: a,
                opacity: 0.9,
              }}
            />
            <span
              className="absolute rounded-full"
              style={{
                left: "12%",
                bottom: "12%",
                width: "26%",
                aspectRatio: "1",
                border: `2px solid ${a}`,
              }}
            />
          </>
        )}
        {variant === 1 && (
          <>
            <span
              className="absolute"
              style={{
                left: "10%",
                top: "16%",
                width: "44%",
                height: "68%",
                borderRadius: "var(--r-lg)",
                background: a,
                opacity: 0.9,
              }}
            />
            <span
              className="absolute"
              style={{
                right: "12%",
                top: "30%",
                width: "26%",
                height: "40%",
                borderRadius: "var(--r-full)",
                border: `2px solid ${a}`,
              }}
            />
          </>
        )}
        {variant === 2 && (
          <>
            <span
              className="absolute"
              style={{
                left: "50%",
                top: "50%",
                width: "58%",
                aspectRatio: "1",
                transform: "translate(-50%,-50%) rotate(45deg)",
                borderRadius: "18%",
                background: a,
                opacity: 0.9,
              }}
            />
            <span
              className="absolute left-0 top-1/2 h-[2px] w-full"
              style={{ background: `${a}66` }}
            />
          </>
        )}
      </div>

      {/* project number */}
      <span
        aria-hidden
        className="absolute bottom-[6%] left-[7%] font-display font-semibold leading-none"
        style={{
          fontSize: "clamp(2.25rem, 6vw, 4.5rem)",
          color: variant === 2 ? "var(--bg)" : a,
          mixBlendMode: variant === 2 ? "difference" : "normal",
        }}
      >
        {project.index}
      </span>
    </div>
  );
}
