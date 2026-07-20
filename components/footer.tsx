"use client";

import { navLinks, profile } from "@/lib/content";
import { ArrowUpRight } from "@/components/ui/icons";
import { useAnchorScroll } from "@/lib/use-anchor-scroll";
import { useLenis } from "lenis/react";

export function Footer() {
  const year = new Date().getFullYear();
  const onAnchor = useAnchorScroll();
  const lenis = useLenis();

  function toTop(e: React.MouseEvent) {
    e.preventDefault();
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const sitemap = [...navLinks, { label: "Contact", href: "#contact" }];

  return (
    <footer className="border-t border-border">
      <div className="mx-auto w-full max-w-[1440px] px-6 py-16 sm:px-8 lg:px-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.6fr_1fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight">
              <span className="h-2 w-2 rounded-full bg-accent" />
              {profile.name}
            </div>
            <p className="measure mt-5 leading-relaxed text-muted">
              {profile.brandStatement}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {profile.availabilityLabel}
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-faint">
                {profile.location}
              </span>
            </div>
          </div>

          {/* Links — two unequal groups */}
          <div className="flex justify-between gap-8 sm:justify-start sm:gap-16 lg:justify-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-faint">
                Sitemap
              </p>
              <ul className="mt-4 space-y-2.5">
                {sitemap.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={(e) => onAnchor(e, link.href)}
                      className="link-underline text-sm text-muted transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
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
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-border pt-6 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {profile.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <span>Designed &amp; built with Next.js</span>
            <a
              href="#top"
              onClick={toTop}
              className="link-underline transition-colors hover:text-foreground"
            >
              Back to top ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
