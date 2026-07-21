import type { AiBehaviour } from "@/lib/case-studies";
import { Reveal } from "@/components/ui/reveal";

/**
 * How the AI behaves, documented as a designed system.
 * Grouped so the reader sees the shape of the thinking, not 13 flat fields.
 */
const GROUPS: {
  title: string;
  caption: string;
  fields: { key: keyof AiBehaviour; label: string }[];
}[] = [
  {
    title: "The exchange",
    caption: "What the user wants, what the model receives, what comes back.",
    fields: [
      { key: "userIntent", label: "User intent" },
      { key: "aiInput", label: "AI input" },
      { key: "aiOutput", label: "AI output" },
    ],
  },
  {
    title: "Communicating uncertainty",
    caption: "Making the system's confidence legible instead of implied.",
    fields: [
      { key: "confidence", label: "Confidence" },
      { key: "loading", label: "Loading behaviour" },
      { key: "explainability", label: "Explainability" },
    ],
  },
  {
    title: "Human control",
    caption: "Where the person stays the decision-maker.",
    fields: [
      { key: "humanControl", label: "Control" },
      { key: "editing", label: "Editing & approval" },
      { key: "feedback", label: "Feedback loop" },
    ],
  },
  {
    title: "When it fails",
    caption: "Designing for the wrong answer, not just the right one.",
    fields: [
      { key: "errors", label: "Error states" },
      { key: "failureRecovery", label: "Failure recovery" },
    ],
  },
  {
    title: "Responsibility",
    caption: "What the system is allowed to do on its own.",
    fields: [
      { key: "privacy", label: "Privacy" },
      { key: "automation", label: "Responsible automation" },
    ],
  },
];

export function AiBehaviourSpec({ data }: { data: AiBehaviour }) {
  return (
    <div className="mt-12 space-y-10">
      {GROUPS.map((group, i) => (
        <Reveal key={group.title} delay={i * 0.05}>
          <section className="grid grid-cols-1 gap-6 border-t border-border pt-8 lg:grid-cols-[18rem_1fr] lg:gap-12">
            <div>
              <h3 className="text-h3">{group.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-faint">
                {group.caption}
              </p>
            </div>
            <dl className="space-y-5">
              {group.fields.map((field) => (
                <div
                  key={field.key}
                  className="grid grid-cols-1 gap-1.5 sm:grid-cols-[11rem_1fr] sm:gap-6"
                >
                  <dt className="font-mono text-xs sm:text-[11px] uppercase tracking-[0.18em] text-accent">
                    {field.label}
                  </dt>
                  <dd className="text-pretty leading-relaxed text-muted">
                    {data[field.key]}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </Reveal>
      ))}
    </div>
  );
}
