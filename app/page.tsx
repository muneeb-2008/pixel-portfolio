import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Work } from "@/components/work";
import { Capabilities } from "@/components/capabilities";
import { Philosophy } from "@/components/philosophy";
import { Process } from "@/components/process";
import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <a
        href="#work"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:text-background"
      >
        Skip to content
      </a>
      <Nav />
      <main id="top" className="flex-1">
        <Hero />
        <Work />
        <Capabilities />
        <Philosophy />
        <Process />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
