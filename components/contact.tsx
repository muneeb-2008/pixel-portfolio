import { contact, profile } from "@/lib/content";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { ArrowUpRight } from "@/components/ui/icons";

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative scroll-mt-24 overflow-hidden"
    >
      {/* Off-center accent glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute -left-40 bottom-[-30%] h-[38rem] w-[38rem] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle at center, var(--accent-soft), transparent 64%)",
          }}
        />
      </div>

      <div className="mx-auto w-full max-w-[1440px] px-6 py-28 sm:px-8 md:py-40 lg:px-16">
        <Reveal>
          <div className="max-w-4xl">
            <Eyebrow>{contact.eyebrow}</Eyebrow>
            <h2 id="contact-heading" className="text-display mt-6 text-balance">
              {contact.heading.map((seg, i) =>
                seg.accent ? (
                  <span key={i} className="text-accent">
                    {seg.text}
                  </span>
                ) : (
                  <span key={i}>{seg.text}</span>
                ),
              )}
            </h2>
            <p className="measure mt-8 text-lg leading-relaxed text-muted">
              {contact.body}
            </p>

            <div className="mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
              <MagneticButton href={`mailto:${profile.email}`}>
                Start a project
                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </MagneticButton>
              <a
                href={`mailto:${profile.email}`}
                className="link-underline text-base text-muted transition-colors hover:text-foreground"
              >
                {profile.email}
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-16 flex flex-wrap gap-x-10 gap-y-4 border-t border-border pt-8">
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
