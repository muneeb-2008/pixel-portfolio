import { navLinks, profile } from "@/lib/content";
import { ArrowUpRight } from "@/components/ui/icons";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface/40">
      <div className="mx-auto w-full max-w-6xl px-6 py-14 md:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-2">
            <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
              <span className="h-2 w-2 rounded-full bg-accent" />
              {profile.name}
            </div>
            <p className="mt-4 max-w-xs text-pretty text-sm leading-relaxed text-muted">
              {profile.brandStatement}
            </p>
            <p className="mt-4 font-mono text-xs uppercase tracking-[0.14em] text-faint">
              {profile.location}
            </p>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-faint">
              Sitemap
            </p>
            <ul className="mt-4 space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#contact"
                  className="text-sm text-muted transition-colors hover:text-foreground"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-faint">
              Connect
            </p>
            <ul className="mt-4 space-y-2.5">
              {profile.socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    {...(social.href.startsWith("http")
                      ? { target: "_blank", rel: "noreferrer" }
                      : {})}
                    className="group inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
                  >
                    {social.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-border pt-6 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {profile.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <span>Designed &amp; built with Next.js</span>
            <a
              href="#top"
              className="transition-colors hover:text-foreground"
            >
              Back to top ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
