import { capabilities } from "@/lib/content";
import { SectionShell } from "@/components/ui/section-shell";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";

export function Capabilities() {
  return (
    <SectionShell
      id="skills"
      aria-labelledby="skills-heading"
      className="border-y border-border bg-surface/30"
    >
      <Reveal>
        <div className="max-w-3xl">
          <Eyebrow>{capabilities.eyebrow}</Eyebrow>
          <h2 id="skills-heading" className="text-h2 mt-5 text-balance">
            {capabilities.heading}
          </h2>
        </div>
      </Reveal>

      <div className="mt-16 lg:mt-20">
        {capabilities.groups.map((group, i) => (
          <Reveal key={group.group} delay={i * 0.05}>
            <div className="grid grid-cols-1 gap-6 border-t border-border py-10 lg:grid-cols-12 lg:gap-8">
              <div className="lg:col-span-4">
                <span className="font-mono text-sm text-accent">
                  0{i + 1}
                </span>
                <h3 className="text-h3 mt-3">{group.group}</h3>
                <p className="mt-2 text-sm text-faint">{group.caption}</p>
              </div>
              <div className="lg:col-span-8">
                <ul className="flex flex-wrap gap-3">
                  {group.items.map((item) => (
                    <li key={item}>
                      <span className="fill-hover inline-flex cursor-default rounded-full border border-border-strong px-5 py-2.5 text-sm font-medium text-foreground md:text-base">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
