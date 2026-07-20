"use client";

import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/**
 * Renders both icons and lets the `.dark` class (set by next-themes before
 * paint) decide which shows via CSS — no mount gating, no hydration flash.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { setTheme } = useTheme();

  function toggle() {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "light" : "dark");
  }

  return (
    <button
      type="button"
      aria-label="Toggle color theme"
      onClick={toggle}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-border-strong hover:text-foreground",
        className,
      )}
    >
      <MoonIcon className="h-4 w-4 dark:hidden" />
      <SunIcon className="hidden h-4 w-4 dark:block" />
    </button>
  );
}
