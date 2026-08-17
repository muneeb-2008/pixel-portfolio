import { Hero } from "@/components/sections/hero";
import { Intro } from "@/components/sections/intro";
import { Projects } from "@/components/sections/projects";
import { Playground } from "@/components/sections/playground";
import { CTA } from "@/components/sections/cta";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <Projects />
      <Playground />
      <CTA />
      <Footer />
    </>
  );
}
