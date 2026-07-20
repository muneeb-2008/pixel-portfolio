import { contact, profile } from "@/lib/content";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { ArrowUpRight } from "@/components/ui/icons";

export function Contact() {
  return (
    <section id="contact" className="relative scroll-mt-24 overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute bottom-[-30%] left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,var(--accent-soft),transparent_62%)] blur-2xl" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-6 py-28 md:px-8 md:py-40">
        <Reveal>
          <div className="max-w-3xl">
            <Eyebrow>{contact.eyebrow}</Eyebrow>
            <h2 className="mt-6 text-balance text-4xl font-medium leading-[1.05] tracking-[-0.02em] sm:text-5xl md:text-6xl">
              {contact.heading.map((seg, i) =>
                seg.accent ? (
                  <span key={i} className="font-serif-italic">
                    {seg.text}
                  </span>
                ) : (
                  <span key={i}>{seg.text}</span>
                ),
              )}
            </h2>
            <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted md:text-lg">
              {contact.body}
            </p>

            <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <MagneticButton href={`mailto:${profile.email}`}>
                Start a project
                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </MagneticButton>
              <a
                href={`mailto:${profile.email}`}
                className="text-sm text-muted underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                {profile.email}
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-16 flex flex-wrap gap-x-8 gap-y-4 border-t border-border pt-8">
            {profile.socials
              .filter((s) => s.label !== "Email")
              .map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
                >
                  <span className="font-mono text-xs uppercase tracking-[0.14em] text-faint transition-colors group-hover:text-accent">
                    {social.label}
                  </span>
                  <span>{social.handle}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                </a>
              ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
