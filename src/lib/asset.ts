/**
 * Prefix a /public path with the deploy base path (GitHub Pages serves the
 * site under /<repo>/). next.config exposes it as NEXT_PUBLIC_BASE_PATH.
 */
export const asset = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
