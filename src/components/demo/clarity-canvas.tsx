import { lensScenario, type LensState } from "@/content/projects";

/**
 * The Clarity AI product surface, built in markup and CSS.
 *
 * One canvas that transforms between decision states — the generated answer
 * never changes, only how much of the system's reasoning is exposed.
 *
 * `annotated` renders the same structure with the product decisions marked:
 * blue active regions and numbered markers. Because it is the *same*
 * component, the annotated copy aligns pixel-for-pixel with the plain one,
 * which is what lets the Decision Lens clip between them.
 */

type Region = "answer" | "confidence" | "sources" | "controls";

/** Marker numbers keep the annotation column and the canvas in sync. */
const MARKER: Record<Region, string> = {
  answer: "01",
  confidence: "02",
  sources: "03",
  controls: "04",
};

function RegionBox({
  name,
  annotated,
  children,
}: {
  name: Region;
  annotated: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      data-region={name}
      className="relative transition-colors duration-[var(--dur)]"
      style={{
        borderRadius: "var(--r-md)",
        background: annotated ? "var(--blue-field)" : "transparent",
        boxShadow: annotated ? "inset 0 0 0 1px var(--blue-line)" : "none",
        padding: annotated ? "var(--s-3)" : "0",
        margin: annotated ? "calc(var(--s-3) * -1)" : "0",
      }}
    >
      {annotated && (
        <span
          aria-hidden
          className="absolute -top-2 right-2 inline-flex h-5 min-w-5 items-center justify-center px-1 font-mono text-[11px] font-medium"
          style={{
            background: "var(--blue-strong)",
            color: "#fff",
            borderRadius: "var(--r-sm)",
          }}
        >
          {MARKER[name]}
        </span>
      )}
      {children}
    </div>
  );
}

/** Smoothly reveals a region without a layout jump. */
function Reveal({ open, children }: { open: boolean; children: React.ReactNode }) {
  return (
    <div
      aria-hidden={!open}
      className="grid transition-[grid-template-rows,opacity] duration-[var(--dur-slow)] ease-[var(--ease-out)]"
      style={{ gridTemplateRows: open ? "1fr" : "0fr", opacity: open ? 1 : 0 }}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  );
}

export function ClarityCanvas({
  state,
  annotated = false,
  compact = false,
}: {
  state: LensState;
  annotated?: boolean;
  compact?: boolean;
}) {
  const { shows } = state;
  const s = lensScenario;
  const pad = compact ? "var(--s-4)" : "var(--s-6)";

  return (
    <div
      className="w-full overflow-hidden bg-bg"
      style={{
        borderRadius: "var(--r-lg)",
        border: "1px solid var(--line)",
        boxShadow: "var(--lift-1)",
      }}
    >
      {/* Product chrome — a workspace strip, not a browser frame */}
      <div
        className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b px-[var(--s-4)] py-[var(--s-3)] sm:px-[var(--s-6)]"
        style={{ borderColor: "var(--line-soft)", background: "var(--surface)" }}
      >
        <span className="label" style={{ color: "var(--ink)" }}>
          Clarity AI
        </span>
        <span className="label">Research workspace · Demo</span>
      </div>

      <div style={{ padding: pad }}>
        {/* Query */}
        <p className="label">Query</p>
        <p
          className="mt-[var(--s-2)]"
          style={{ color: "var(--ink-2)", fontSize: "var(--t-small)" }}
        >
          {s.query}
        </p>

        {/* Generated answer — identical in every state */}
        <div className="mt-[var(--s-6)]">
          <RegionBox name="answer" annotated={annotated}>
            <p className="label">Generated answer</p>
            <p
              className="mt-[var(--s-2)] font-display"
              style={{
                color: "var(--ink)",
                fontSize: compact ? "var(--t-body)" : "var(--t-h3)",
                lineHeight: 1.4,
                letterSpacing: "-0.015em",
              }}
            >
              {s.answer}
            </p>
          </RegionBox>
        </div>

        {/* Confidence */}
        <Reveal open={shows.confidence}>
          <div className="mt-[var(--s-6)]">
            <RegionBox name="confidence" annotated={annotated}>
              <div className="flex items-baseline justify-between gap-4">
                <span className="label">Model confidence</span>
                <span
                  className="font-mono font-medium"
                  style={{ fontSize: "var(--t-label)", color: "var(--blue-ink)" }}
                >
                  {s.confidence}%
                </span>
              </div>
              <div
                className="mt-[var(--s-2)] h-[6px] w-full overflow-hidden"
                style={{ background: "var(--blue-field)", borderRadius: "var(--r-sm)" }}
                role="meter"
                aria-valuenow={s.confidence}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Model confidence"
              >
                <div
                  className="h-full transition-[width] duration-[var(--dur-slow)] ease-[var(--ease-out)]"
                  style={{ width: `${s.confidence}%`, background: "var(--blue-strong)" }}
                />
              </div>
              <Reveal open={shows.reasoning}>
                <p
                  className="mt-[var(--s-3)]"
                  style={{ fontSize: "var(--t-small)", color: "var(--ink-2)" }}
                >
                  <span style={{ color: "var(--ink)" }}>
                    Low confidence is isolated to one claim:{" "}
                  </span>
                  {s.reasoning}
                </p>
              </Reveal>
            </RegionBox>
          </div>
        </Reveal>

        {/* Evidence */}
        <Reveal open={shows.sources}>
          <div className="mt-[var(--s-6)]">
            <RegionBox name="sources" annotated={annotated}>
              <p className="label">Evidence</p>
              <ul className="mt-[var(--s-2)] flex flex-col">
                {s.sources.map((source) => (
                  <li
                    key={source.title}
                    className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b py-[var(--s-2)] last:border-0"
                    style={{ borderColor: "var(--line-soft)" }}
                  >
                    <span style={{ fontSize: "var(--t-small)", color: "var(--ink)" }}>
                      {source.title}
                    </span>
                    <span className="flex items-baseline gap-3">
                      <span className="label">{source.meta}</span>
                      <span
                        className="px-2 py-[2px] font-mono uppercase"
                        style={{
                          fontSize: "11px",
                          letterSpacing: "0.1em",
                          borderRadius: "var(--r-sm)",
                          background:
                            source.strength === "Strong"
                              ? "var(--blue-selected)"
                              : "transparent",
                          border:
                            source.strength === "Strong"
                              ? "none"
                              : "1px solid var(--line)",
                          color:
                            source.strength === "Strong"
                              ? "var(--blue-ink)"
                              : "var(--ink-2)",
                        }}
                      >
                        {source.strength}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </RegionBox>
          </div>
        </Reveal>

        {/* Human controls */}
        <Reveal open={shows.editing || shows.approval || shows.recovery}>
          <div className="mt-[var(--s-6)]">
            <RegionBox name="controls" annotated={annotated}>
              <div className="flex flex-wrap items-center gap-[var(--s-2)]">
                {shows.editing && <DemoControl>Edit answer</DemoControl>}
                {shows.approval && (
                  <DemoControl emphasis>Approve before sending</DemoControl>
                )}
                {shows.recovery && <DemoControl>Undo</DemoControl>}
              </div>
            </RegionBox>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

/**
 * Non-interactive demo affordance. A span, not a button — it illustrates an
 * interface decision and must not enter the tab order or be announced as an
 * operable control.
 */
function DemoControl({
  children,
  emphasis = false,
}: {
  children: React.ReactNode;
  emphasis?: boolean;
}) {
  return (
    <span
      className="inline-flex items-center px-[var(--s-3)] py-[var(--s-2)] font-mono"
      style={{
        fontSize: "var(--t-label)",
        borderRadius: "var(--r-sm)",
        border: emphasis ? "1px solid var(--blue-strong)" : "1px solid var(--line)",
        color: emphasis ? "#fff" : "var(--ink-2)",
        background: emphasis ? "var(--blue-strong)" : "transparent",
      }}
    >
      {children}
    </span>
  );
}

/** Screen-reader description of the interface for a given state. */
export function canvasDescription(state: LensState) {
  const parts = ["A demo AI research workspace showing a generated answer"];
  if (state.shows.confidence) parts.push(`a ${lensScenario.confidence}% confidence meter`);
  if (state.shows.sources) parts.push("three evidence sources with strength ratings");
  if (state.shows.editing || state.shows.approval || state.shows.recovery)
    parts.push("and edit, approval and undo controls");
  return parts.join(", ") + ".";
}
