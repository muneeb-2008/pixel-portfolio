import { site } from "@/content/site";

/**
 * A visual pause between the interaction and the close.
 *
 * Refinement pass: the five blue-topped blocks became borderless columns
 * with real space around them, and the decorative vertical rules are gone.
 * The statement carries the section; the supporting ideas stay quiet.
 */
export function AboutBand() {
  const { about } = site;

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative"
      style={{ paddingBlock: "var(--scene-y)" }}
    >
      <div className="shell">
        <p className="label">{about.label}</p>

        {/* The statement is the section */}
        <h2
          id="about-heading"
          className="t-display mt-[var(--s-8)] lg:w-[82%]"
        >
          {about.statement}
        </h2>

        {/* Supporting ideas — no rules, generous gaps */}
        <div className="grid-editorial mt-[var(--s-40)] gap-y-[var(--s-16)]">
          {about.supporting.map((item, i) => {
            /* 3 / 3 / 3 then 3 / 3, offset so the rows don't align */
            const placement = [
              "lg:col-span-3 lg:col-start-1",
              "lg:col-span-3 lg:col-start-5",
              "lg:col-span-3 lg:col-start-9",
              "lg:col-span-3 lg:col-start-3",
              "lg:col-span-3 lg:col-start-7",
            ][i];
            return (
              <div
                key={item.title}
                className={`col-span-full sm:col-span-6 ${placement}`}
              >
                <h3 className="t-h3">{item.title}</h3>
                <p
                  className="mt-[var(--s-4)]"
                  style={{ color: "var(--ink-2)", fontSize: "var(--t-small)" }}
                >
                  {item.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
