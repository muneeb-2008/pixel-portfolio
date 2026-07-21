import { SubpageNav } from "@/components/case-study/case-nav";
import { SubpageFooter } from "@/components/case-study/subpage-footer";

export default function WorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-accent-contrast"
      >
        Skip to content
      </a>
      <SubpageNav />
      <main id="main">{children}</main>
      <SubpageFooter />
    </>
  );
}
