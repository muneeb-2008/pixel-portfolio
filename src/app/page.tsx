import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { FeaturedProject } from "@/components/featured-project";
import { DecisionLens } from "@/components/decision-lens";
import { AboutBand } from "@/components/about";
import { Contact } from "@/components/contact";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <FeaturedProject />
        <DecisionLens />
        <AboutBand />
        <Contact />
      </main>
    </>
  );
}
