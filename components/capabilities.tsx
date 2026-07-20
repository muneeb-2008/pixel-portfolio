import { capabilities } from "@/lib/content";
import { SectionShell } from "@/components/ui/section-shell";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";

export function Capabilities() {
  return (
    <SectionShell id="skills" className="border-y border-border bg-surface/40">
      <Reveal>
        <div className="max-w-3xl">
          <Eyebrow>{capabilities.eyebrow}</Eyebrow>
          <h2 className="mt-5 text-balance text-3xl font-medium leading-[1.1] tracking-[-0.02em] sm:text-4xl md:text-5xl">
            {capabilities.heading}
          </h2>
        </div>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
        {capabilities.groups.map((group, i) => (
          <Reveal key={group.group} delay={i * 0.08} className="bg-background">
            <div className="flex h-full flex-col p-6 md:p-8">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                  {group.group}
                </span>
                <span className="font-mono text-xs text-faint">
                  0{i + 1}
                </span>
              </div>
              <p className="mt-3 text-sm text-faint">{group.caption}</p>
              <ul className="mt-6">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="group/item flex items-center justify-between border-t border-border py-3.5 text-[15px] transition-colors"
                  >
                    <span className="text-foreground">{item}</span>
                    <span className="text-border-strong transition-colors group-hover/item:text-accent">
                      +
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
