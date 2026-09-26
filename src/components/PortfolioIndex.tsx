import { about } from "@/game/data/about";
import { character } from "@/game/data/character";
import { contact } from "@/game/data/contact";
import { projects } from "@/game/data/projects";
import { world } from "@/game/data/world";

/**
 * Plain-HTML portfolio, rendered on the server from the same data files the
 * game uses. Visually hidden while the game runs; shown in full without JS.
 */
export function PortfolioIndex() {
  const districts = world.zones.filter((z) => z.kind !== "hub");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: character.name,
    jobTitle: character.title,
    email: `mailto:${contact.email}`,
    knowsAbout: character.stats.map((s) => s.label),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <noscript>
        <style>{`#portfolio-index{position:static!important;width:auto!important;height:auto!important;clip:auto!important;margin:0!important;white-space:normal!important;overflow:auto!important;max-width:44rem;padding:2rem 1.25rem}body{overflow:auto!important}`}</style>
      </noscript>
      <article id="portfolio-index" className="sr-only">
        <h1>
          {character.name} — {character.title}
        </h1>
        <p>{character.tagline}</p>

        <h2>About</h2>
        {about.lines.map((l) => (
          <p key={l}>{l}</p>
        ))}

        <h2>Skills</h2>
        <ul>
          {character.stats.map((s) => (
            <li key={s.key}>
              {s.label} — level {s.level} of {s.max}. {s.blurb}
            </li>
          ))}
        </ul>

        <h2>Projects</h2>
        {districts.map((z) => (
          <section key={z.id}>
            <h3>{z.name}</h3>
            <ul>
              {projects
                .filter((p) => p.zone === z.kind)
                .map((p) => (
                  <li key={p.id}>
                    <h4>{p.title}</h4>
                    <p>
                      {p.kind} · {p.year}
                    </p>
                    <p>{p.blurb}</p>
                    <p>Tags: {p.tags.join(", ")}</p>
                  </li>
                ))}
            </ul>
          </section>
        ))}

        <h2>Contact</h2>
        <p>
          {/* out of the Tab order: sighted keyboard users would land on an invisible link.
              Screen readers still reach it by reading/browse mode. */}
          <a href={`mailto:${contact.email}`} tabIndex={-1}>
            {contact.email}
          </a>
        </p>
      </article>
    </>
  );
}
