import { site } from "@/content/site";
import { Reveal } from "@/components/ui/reveal";

export function Playground() {
  const { playground } = site;
  const marquee = [...playground.marquee, ...playground.marquee];

  return (
    <section
      id="playground"
      aria-labelledby="playground-heading"
      className="scroll-mt-24"
      style={{ paddingBlock: "var(--scene-y)", background: "var(--bg-2)" }}
    >
      <div className="shell">
        <Reveal>
          <p className="label">{playground.label}</p>
          <h2
            id="playground-heading"
            className="t-h1 mt-[var(--s-6)] measure-wide"
          >
            {playground.title}
          </h2>
        </Reveal>
      </div>

      {/* Full-bleed marquee */}
      <div
        className="mt-[var(--s-16)] overflow-hidden border-y border-line py-5"
        aria-hidden
      >
        <div className="marquee-track">
          {marquee.map((word, i) => (
            <span
              key={i}
              className="t-h2 mx-6 inline-flex items-center gap-6 text-ink-3"
            >
              {word}
              <span style={{ color: "var(--ink)" }}>✳</span>
            </span>
          ))}
        </div>
      </div>

      {/* Experiment tiles */}
      <div className="shell mt-[var(--s-16)]">
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
          {playground.items.map((item, i) => {
            const h = item.hue;
            return (
              <Reveal key={item.title} delay={(i % 3) * 0.05}>
                <div
                  className="group relative flex aspect-square flex-col justify-between overflow-hidden p-5 transition-transform duration-500 ease-[var(--ease-out)] hover:-translate-y-1.5"
                  style={{
                    borderRadius: "var(--r-lg)",
                    background: `hsl(${h} 68% 95%)`,
                  }}
                  data-cursor
                >
                  {/* motif */}
                  <span
                    aria-hidden
                    className="absolute -right-6 -top-6 h-28 w-28 rounded-full transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-125"
                    style={{ background: `hsl(${h} 72% 62%)`, opacity: 0.9 }}
                  />
                  <span
                    className="label relative"
                    style={{ color: `hsl(${h} 45% 35%)` }}
                  >
                    {item.tag}
                  </span>
                  <span className="t-h3 relative text-ink">{item.title}</span>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
