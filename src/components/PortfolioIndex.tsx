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
    worksFor: { "@type": "Organization", name: "Xtarc", url: "https://xtarc.agency/" },
    sameAs: contact.links.map((l) => l.url),
    knowsAbout: character.stats.map((s) => s.label),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <noscript>
        <style>{`#portfolio-index{position:static!important;width:auto!important;height:auto!important;clip:auto!important;margin:0!important;white-space:normal!important;overflow:auto!important;max-width:44rem;padding:2rem 1.25rem}body{overflow:auto!important}`}</style>
      </noscript>
      {/* links are out of the Tab order: sighted keyboard users would land on invisible
          targets. Screen readers still reach them in browse mode. */}
      <article id="portfolio-index" className="sr-only">
        <h1>
          {character.name} — {character.title}
        </h1>
        {character.intro.map((l) => (
          <p key={l}>{l}</p>
        ))}

        <h2>About</h2>
        {about.lines.map((l) => (
          <p key={l}>{l}</p>
        ))}

        <h2>Skills</h2>
        <ul>
          {character.stats.map((s) => (
            <li key={s.key}>
              {s.label} ({s.klass}): {s.headline} {s.blurb}
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
                    <p>{p.kind}</p>
                    {p.body.map((b) => (
                      <p key={b}>{b}</p>
                    ))}
                    <p>Tags: {p.tags.join(", ")}</p>
                    {p.link && (
                      <p>
                        <a href={p.link.url} tabIndex={-1}>
                          {p.link.label}
                        </a>
                      </p>
                    )}
                  </li>
                ))}
            </ul>
          </section>
        ))}

        <h2>Player profile</h2>
        <dl>
          {character.profile.map((r) => (
            <div key={r.label}>
              <dt>{r.label}</dt>
              <dd>{r.value}</dd>
            </div>
          ))}
        </dl>

        <h2>Contact</h2>
        {contact.lines.map((l) => (
          <p key={l}>{l}</p>
        ))}
        <p>{contact.heading}</p>
        <p>
          <a href={`mailto:${contact.email}`} tabIndex={-1}>
            {contact.email}
          </a>
          {contact.links.map((l) => (
            <span key={l.url}>
              {" · "}
              <a href={l.url} tabIndex={-1}>
                {l.label}
              </a>
            </span>
          ))}
        </p>
        <p>© 2026 {character.name}</p>
      </article>
    </>
  );
}
