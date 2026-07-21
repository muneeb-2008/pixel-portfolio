import type { FlowStep, IaNode, ProjectTheme } from "@/lib/case-studies";
import { Reveal } from "@/components/ui/reveal";
import { RevealLi } from "@/components/ui/reveal-item";
import { cn } from "@/lib/utils";

/**
 * User flow as an ordered sequence. Renders as real text in a list, so it
 * stays readable on mobile and to screen readers; the connectors are
 * decorative only.
 */
export function FlowDiagram({
  flows,
  style,
}: {
  flows: { name: string; steps: FlowStep[] }[];
  style: ProjectTheme["diagram"];
}) {
  return (
    <div className="mt-12 space-y-14">
      {flows.map((flow) => (
        <div key={flow.name}>
          <h3 className="text-h3">{flow.name}</h3>
          <ol
            className={cn(
              "mt-6 grid gap-4",
              style === "layered"
                ? "md:grid-cols-2"
                : "md:grid-cols-3 lg:grid-cols-4",
            )}
          >
            {flow.steps.map((step, i) => (
              <RevealLi
                key={step.label}
                delay={i * 0.05}
                className="relative rounded-xl border border-border bg-surface/40 p-5"
              >
                <span aria-hidden className="font-mono text-xs text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-2 font-medium text-foreground">{step.label}</p>
                {step.detail && (
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {step.detail}
                  </p>
                )}
                {step.branch && (
                  <p className="mt-3 border-t border-border pt-3 text-sm text-faint">
                    <span className="font-mono text-xs sm:text-[11px] uppercase tracking-[0.16em] text-accent">
                      Branch
                    </span>{" "}
                    {step.branch}
                  </p>
                )}
              </RevealLi>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}

/** Information architecture as a labelled tree. */
export function IaDiagram({ nodes }: { nodes: IaNode[] }) {
  return (
    <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {nodes.map((node, i) => (
        <Reveal key={node.label} delay={i * 0.05}>
          <section className="h-full rounded-2xl border border-border bg-surface/40 p-6">
            <h3 className="text-h3">{node.label}</h3>
            {node.children && node.children.length > 0 && (
              <ul className="mt-4 space-y-2">
                {node.children.map((child) => (
                  <li
                    key={child}
                    className="flex items-start gap-2.5 text-sm text-muted"
                  >
                    <span
                      aria-hidden
                      className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent"
                    />
                    {child}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </Reveal>
      ))}
    </div>
  );
}
