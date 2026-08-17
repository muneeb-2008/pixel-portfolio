import { site } from "@/content/site";
import { Reveal } from "@/components/ui/reveal";
import { Magnetic } from "@/components/ui/magnetic";
import { AsciiField } from "@/components/ui/ascii-field";
import { ArrowUpRight } from "@/components/ui/icons";

export function CTA() {
  const { cta } = site;
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative flex min-h-[92svh] items-center overflow-hidden"
      style={{ paddingBlock: "var(--scene-y)" }}
    >
      {/* ASCII-art field */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 grid place-items-center"
        style={{
          opacity: 0.2,
          maskImage: "radial-gradient(ellipse 72% 68% at 50% 45%, #000 24%, transparent 84%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 72% 68% at 50% 45%, #000 24%, transparent 84%)",
        }}
      >
        <AsciiField className="w-[150%] max-w-none md:w-[120%]" />
      </div>

      <div className="shell relative w-full text-center">
        <Reveal>
          <p className="label">{cta.label}</p>
          <h2 id="contact-heading" className="t-hero mx-auto mt-[var(--s-8)] max-w-[16ch]">
            {cta.lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-[var(--s-12)] flex justify-center">
            <a
              href={`mailto:${site.email}`}
              className="group inline-flex max-w-full items-center gap-4"
              data-cursor
            >
              <span
                className="link-sweep font-display font-medium"
                style={{ fontSize: "var(--t-h2)", overflowWrap: "anywhere" }}
              >
                {site.email}
              </span>
              <Magnetic>
                <span
                  className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-ink text-white"
                  aria-hidden
                >
                  <ArrowUpRight width={20} height={20} />
                </span>
              </Magnetic>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
