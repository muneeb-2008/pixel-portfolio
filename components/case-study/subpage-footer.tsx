import Link from "next/link";
import { profile } from "@/lib/content";

/** Slim footer for pages outside the single-page homepage. */
export function SubpageFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-3 px-6 py-8 text-xs text-faint sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-16">
        <p>
          © {new Date().getFullYear()} {profile.name}. All rights reserved.
        </p>
        <div className="flex items-center gap-5">
          <Link
            href="/work"
            className="link-underline inline-flex min-h-6 items-center transition-colors hover:text-foreground"
          >
            Work
          </Link>
          <Link
            href="/"
            className="link-underline inline-flex min-h-6 items-center transition-colors hover:text-foreground"
          >
            Home
          </Link>
          <a
            href={`mailto:${profile.email}`}
            className="link-underline inline-flex min-h-6 items-center transition-colors hover:text-foreground"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
