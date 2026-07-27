import { lensScenario, type LensState } from "@/content/projects";

/**
 * The Clarity AI product surface, built in markup and CSS.
 *
 * Refined for restraint: grouping is carried by spacing rather than rules,
 * so the surface reads as a premium product instead of a wireframe. One
 * quiet mark in the header, no row dividers, one filled control.
 *
 * `annotated` renders the same structure with the product decisions marked.
 * Because it is the *same* component with a size-neutral highlight (padding
 * offset by an equal negative margin), the annotated copy aligns
 * pixel-for-pixel with the plain one — which is what lets the Decision Lens
 * clip between them.
 */

type Region = "answer" | "confidence" | "sources" | "controls";

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
        padding: annotated ? "var(--s-4)" : "0",
        margin: annotated ? "calc(var(--s-4) * -1)" : "0",
      }}
    >
      {children}
    </div>
  );
}

/** Reveals a region without a layout jump. */
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

  return (
    <div
      className="w-full overflow-hidden bg-bg"
      style={{
        borderRadius: "var(--r-lg)",
        border: "1px solid var(--line)",
        boxShadow: "var(--lift-2)",
      }}
    >
      {/* One quiet mark — no second label, no tinted strip */}
      <div
        className="flex items-center justify-between px-[var(--s-8)] pt-[var(--s-6)]"
      >
        <span
          className="font-display"
          style={{
            fontSize: "var(--t-small)",
            fontWeight: 600,
            letterSpacing: "-0.01em",
          }}
        >
          Clarity AI
        </span>
        <span className="label">Demo</span>
      </div>

      <div
        style={{
          padding: compact
            ? "var(--s-6) var(--s-8) var(--s-8)"
            : "var(--s-8)",
        }}
      >
        {/* Query — no label, the quotation carries it */}
        <p
          style={{
            color: "var(--ink-2)",
            fontSize: "var(--t-small)",
          }}
        >
          {s.query}
        </p>

        {/* The generated answer — the largest thing on the surface */}
        <div className="mt-[var(--s-6)]">
          <RegionBox name="answer" annotated={annotated}>
            <p
              className="font-display"
              style={{
                color: "var(--ink)",
                fontSize: compact ? "var(--t-lead)" : "var(--t-h3)",
                fontWeight: 500,
                lineHeight: 1.42,
                letterSpacing: "-0.02em",
              }}
            >
              {s.answer}
            </p>
          </RegionBox>
        </div>

        {/* Confidence */}
        <Reveal open={shows.confidence}>
          <div className="mt-[var(--s-8)]">
            <RegionBox name="confidence" annotated={annotated}>
              <div className="flex items-baseline justify-between gap-4">
                <span className="label">Confidence</span>
                <span
                  className="font-display"
                  style={{
                    fontSize: "var(--t-lead)",
                    fontWeight: 600,
                    color: "var(--blue-ink)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {s.confidence}%
                </span>
              </div>
              <div
                className="mt-[var(--s-3)] h-[4px] w-full overflow-hidden"
                style={{ background: "var(--blue-field)", borderRadius: "999px" }}
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
                  className="mt-[var(--s-4)]"
                  style={{ fontSize: "var(--t-small)", color: "var(--ink-2)" }}
                >
                  <span style={{ color: "var(--ink)" }}>
                    Isolated to one claim.{" "}
                  </span>
                  {s.reasoning}
                </p>
              </Reveal>
            </RegionBox>
          </div>
        </Reveal>

        {/* Evidence — spacing groups the rows, no dividers */}
        <Reveal open={shows.sources}>
          <div className="mt-[var(--s-8)]">
            <RegionBox name="sources" annotated={annotated}>
              <span className="label">Evidence</span>
              <ul className="mt-[var(--s-4)] flex flex-col gap-[var(--s-3)]">
                {s.sources.map((source) => (
                  <li
                    key={source.title}
                    className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1"
                  >
                    <span style={{ fontSize: "var(--t-small)", color: "var(--ink)" }}>
                      {source.title}
                    </span>
                    <span
                      className="font-mono"
                      style={{
                        fontSize: "var(--t-label)",
                        letterSpacing: "0.06em",
                        color:
                          source.strength === "Strong"
                            ? "var(--blue-ink)"
                            : "var(--ink-2)",
                      }}
                    >
                      {source.strength}
                    </span>
                  </li>
                ))}
              </ul>
            </RegionBox>
          </div>
        </Reveal>

        {/* Human controls — one filled action, the rest quiet */}
        <Reveal open={shows.editing || shows.approval || shows.recovery}>
          <div className="mt-[var(--s-8)]">
            <RegionBox name="controls" annotated={annotated}>
              <div className="flex flex-wrap items-center gap-x-[var(--s-6)] gap-y-[var(--s-3)]">
                {shows.approval && (
                  <span
                    className="inline-flex items-center px-[var(--s-4)] py-[var(--s-2)]"
                    style={{
                      fontSize: "var(--t-small)",
                      borderRadius: "var(--r-sm)",
                      background: "var(--blue-strong)",
                      color: "#fff",
                      fontWeight: 500,
                    }}
                  >
                    Approve
                  </span>
                )}
                {shows.editing && (
                  <span style={{ fontSize: "var(--t-small)", color: "var(--ink-2)" }}>
                    Edit answer
                  </span>
                )}
                {shows.recovery && (
                  <span style={{ fontSize: "var(--t-small)", color: "var(--ink-2)" }}>
                    Undo
                  </span>
                )}
              </div>
            </RegionBox>
          </div>
        </Reveal>
      </div>
    </div>
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
