import { site } from "@/content/site";

/**
 * A visual pause between the interaction and the close.
 *
 * The statement sits on an asymmetric grid held together by blue rules that
 * carry over from the interface scenes — no cards, no bars, no logos.
 */
export function AboutBand() {
  const { about } = site;

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative overflow-hidden py-[var(--s-24)]"
    >
      {/* A few structural rules, echoing the interface grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span
          className="absolute left-[8%] top-0 h-full w-px"
          style={{ background: "var(--blue-line)", opacity: 0.5 }}
        />
        <span
          className="absolute left-[62%] top-[18%] h-[64%] w-px"
          style={{ background: "var(--blue-line)", opacity: 0.35 }}
        />
      </div>

      <div className="shell relative">
        <p className="label">
          <span style={{ color: "var(--blue-ink)" }}>03</span> — {about.label}
        </p>

        {/* The statement, offset off the left edge of the grid */}
        <h2
          id="about-heading"
          className="t-h1 mt-[var(--s-8)] lg:ml-[8%] lg:w-[74%]"
        >
          {about.statement}
        </h2>

        {/* Supporting copy on an uneven grid — deliberately not a five-up row */}
        <div className="grid-editorial mt-[var(--s-16)] gap-y-[var(--s-12)]">
          {about.supporting.map((item, i) => {
            /* 3 / 4 / 3 then 5 / 4 — widths and starts change per row */
            const placement = [
              "lg:col-span-3 lg:col-start-2",
              "lg:col-span-4 lg:col-start-6",
              "lg:col-span-3 lg:col-start-10",
              "lg:col-span-4 lg:col-start-2",
              "lg:col-span-4 lg:col-start-7",
            ][i];
            return (
              <div
                key={item.title}
                className={`col-span-full sm:col-span-6 ${placement}`}
              >
                <div
                  className="pt-[var(--s-3)]"
                  style={{ borderTop: "2px solid var(--blue)" }}
                >
                  <h3
                    className="font-display"
                    style={{ fontSize: "var(--t-h3)", letterSpacing: "-0.018em" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="mt-[var(--s-2)]"
                    style={{ color: "var(--ink-2)", fontSize: "var(--t-small)" }}
                  >
                    {item.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
