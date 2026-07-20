import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Work } from "@/components/work";
import { Capabilities } from "@/components/capabilities";
import { Philosophy } from "@/components/philosophy";
import { Process } from "@/components/process";
import { Experience } from "@/components/experience";
import { Testimonials } from "@/components/testimonials";
import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <a
        href="#work"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-accent-contrast"
      >
        Skip to content
      </a>
      <Nav />
      <main id="top">
        <Hero />
        <Work />
        <Capabilities />
        <Philosophy />
        <Process />
        <Experience />
        <Testimonials />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
