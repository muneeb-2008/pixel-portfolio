export type ClassValue = string | number | false | null | undefined;

/** Minimal className joiner — avoids pulling in clsx for a tiny need. */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
