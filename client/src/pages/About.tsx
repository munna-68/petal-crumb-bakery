import { withBase } from "@/lib/withBase";
/** Garden Bakery: maker story — warm panels, pastel chips, script accents. */
import { ArrowUpRight, Heart, Leaf, Sparkles, CalendarDays, Award, Users, Flower2, Quote } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import BakeryMark from "@/components/BakeryMark";
import { ScriptNote, ButterBlob, LeafSprig } from "@/components/decor";

export default function About() {
  return (
    <div className="min-h-screen bg-[var(--cream)] text-[var(--ink)]">
      <SiteHeader />
      <main id="main">
        {/* hero — warm rounded split */}
        <section className="container py-6 sm:py-10" data-reveal="fade">
          <div className="grid overflow-hidden rounded-[2rem] bg-[var(--paper)] shadow-[0_24px_70px_oklch(0.305_0.033_42/0.07)] lg:grid-cols-[0.92fr_1.08fr]">
            <div className="relative min-h-[420px] sm:min-h-[500px] lg:order-2">
              <div className="visual-tile !rounded-none h-full min-h-[420px] sm:min-h-[500px]">
                <img
                  className="parallax-hero h-full w-full object-cover object-[50%_30%]"
                  src={withBase("/images/photo-1556910103-1c02745aae4d.jpg")}
                  alt="Maya, the baker, at work in a sunlit kitchen with flour-dusted hands"
                  loading="eager"
                />
              </div>
              <p className="absolute bottom-4 left-4 rounded-full bg-[var(--paper)]/95 px-4 py-2 text-[12px] font-extrabold text-[var(--ink)] shadow-[0_8px_20px_oklch(0.305_0.033_42/0.12)]">
                Maya · founder &amp; baker
                <span className="ml-2 font-semibold text-[var(--ink-mute)]">Portland · since 2019</span>
              </p>
            </div>
            <div className="flex flex-col justify-between px-7 py-10 sm:px-11 sm:py-13 lg:px-14 lg:py-16">
              <div>
                <p className="eyebrow">A note from the studio</p>
                <h1 className="display-title mt-4 text-[52px] leading-[0.95] sm:text-[70px] lg:text-[78px]">
                  Meet
                  <br />
                  <em>Maya.</em>
                </h1>
                <p className="prose-measure mt-5 max-w-[36ch] text-[15px] leading-7 text-[var(--ink-soft)]">
                  I’m the hands behind Petal &amp; Crumb: baker, flower gatherer, determined advocate for the second slice. I bake for the moment the candles go down and everyone leans in.
                </p>
              </div>
              <figure className="mt-10">
                <Quote size={22} strokeWidth={2} className="rotate-180 text-[var(--terra)] opacity-70" aria-hidden />
                <blockquote className="mt-3 font-display text-[23px] italic leading-[1.25] text-[var(--ink)] sm:text-[26px]">
                  The sweetest details are the ones people remember.
                </blockquote>
                <figcaption className="mt-3">
                  <ScriptNote className="text-[18px] text-[var(--ink-mute)]">— Maya, on why she still pipes every rosette by hand</ScriptNote>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* way of working */}
        <section className="container grid gap-10 py-14 sm:py-18 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16 lg:py-22" data-reveal="up">
          <div className="lg:sticky lg:top-[110px] lg:self-start">
            <p className="eyebrow">The way I work</p>
            <h2 className="display-title mt-3 max-w-[14ch] text-[40px] leading-[1] sm:text-[50px] lg:text-[58px]">
              Good ingredients,
              <br />
              good questions,
              <br />
              <em>a little surprise.</em>
            </h2>
            <div className="mt-7 hidden items-center gap-3 lg:flex">
              <BakeryMark size="sm" />
              <span className="text-[12px] font-extrabold uppercase tracking-[0.13em] text-[var(--ink-mute)]">Est. 2019 · Portland</span>
            </div>
          </div>
          <div className="min-w-0 space-y-6 text-[15.5px] leading-7 text-[var(--ink-soft)]">
            <p className="max-w-[60ch] text-balance">
              Petal &amp; Crumb grew from a tiny home kitchen and a love of making ordinary occasions feel a little ceremonial. The work is personal by design: I want to know the flavor that reminds you of home, the colors you’re wearing, and the people you can’t wait to feed.
            </p>
            <p className="max-w-[60ch] text-balance">
              My cakes are softly styled, naturally seasonal, and made from scratch in small batches. No fondant sculptures, no airbrush gradients — just textured buttercream, garden flowers, and a lot of care with a bench scraper.
            </p>
            <p className="max-w-[60ch] text-balance">
              They’re meant to be eaten, admired, and remembered long after the candles come down. If that sounds like your kind of cake, we’ll get along beautifully.
            </p>

            <div className="grid gap-x-8 gap-y-7 pt-4 sm:grid-cols-2" data-stagger>
              {[
                { icon: Heart, chip: "bg-[var(--blush)] text-[var(--terra)]", title: "Baked from scratch", desc: "Butter, eggs, real vanilla — no mixes, no shortcuts." },
                { icon: Leaf, chip: "bg-[var(--sage-soft)] text-[var(--sage-deep)]", title: "Seasonal flowers", desc: "Often from the garden or the market that morning." },
                { icon: Sparkles, chip: "bg-[var(--butter-soft)] text-[var(--butter-deep)]", title: "Small batch", desc: "Three custom cakes per day, maximum — so each one gets attention." },
                { icon: Heart, chip: "bg-[var(--blush)] text-[var(--terra)]", title: "Made to be eaten", desc: "Beautiful, yes — but flavor comes first, always." },
              ].map((v) => (
                <div key={v.title} className="flex gap-4">
                  <span className={`chip-icon h-11 w-11 ${v.chip}`}>
                    <v.icon size={18} strokeWidth={2} />
                  </span>
                  <span>
                    <span className="block text-[14.5px] font-extrabold leading-5 text-[var(--ink)]">{v.title}</span>
                    <span className="mt-1 block text-[13.5px] leading-5 text-[var(--ink-mute)]">{v.desc}</span>
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 pt-4">
              <Link href="/menu" className="button-ink">
                See the menu <ArrowUpRight size={15} />
              </Link>
              <Link href="/gallery" className="link-underline inline-flex items-center gap-2 self-center text-[13.5px] font-extrabold text-[var(--terra)]">
                View the collection <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>
        </section>

        {/* process journal */}
        <section className="container py-14 sm:py-18 lg:py-22" data-reveal="up">
          <div className="rounded-[2.25rem] bg-[var(--paper)] p-7 shadow-[0_20px_60px_oklch(0.305_0.033_42/0.06)] sm:p-10 lg:p-12">
            <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-12">
              <div>
                <p className="eyebrow">From first note to final slice</p>
                <h2 className="display-title mt-3 text-[40px] leading-[1] sm:text-[50px] lg:text-[54px]">
                  How a cake
                  <br />
                  <em>comes together.</em>
                </h2>
                <p className="mt-4 max-w-[32ch] text-[14px] leading-6 text-[var(--ink-mute)]">A little ritual, repeated with care — so nothing feels rushed and every tier feels like you.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3" data-stagger>
                {[
                  { step: "01", title: "You share", desc: "Guest count, flavors you love, colors & date. Photos welcome.", icon: Users, chip: "bg-[var(--blush)] text-[var(--terra)]" },
                  { step: "02", title: "We sketch", desc: "A loose pencil sketch & flavor map, priced clearly in the studio.", icon: Flower2, chip: "bg-[var(--sage-soft)] text-[var(--sage-deep)]" },
                  { step: "03", title: "We bake", desc: "From-scratch layers, chilled overnight, decorated by hand the day before.", icon: Award, chip: "bg-[var(--butter-soft)] text-[var(--butter-deep)]" },
                ].map((s) => (
                  <div key={s.step} className="rounded-2xl bg-[var(--cream)] p-5">
                    <div className="flex items-center justify-between">
                      <span className={`chip-icon h-10 w-10 ${s.chip}`}>
                        <s.icon size={17} strokeWidth={2} />
                      </span>
                      <span className="font-display text-[15px] font-semibold italic text-[var(--ink-mute)]">{s.step}</span>
                    </div>
                    <p className="mt-4 font-display text-[19px] font-semibold leading-tight">{s.title}</p>
                    <p className="mt-2 text-[13px] leading-5 text-[var(--ink-mute)]">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* stats */}
            <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-stagger>
              {[
                { label: "Cakes per day", value: <><span data-count-target="3" data-count-prefix="0">03</span></>, unit: "max" },
                { label: "Lead time", value: <span data-count-target="5">5</span>, unit: "days" },
                { label: "Since", value: <span data-count-target="2019">2019</span>, unit: "" },
                { label: "Celebrations", value: <span data-count-target="480" data-count-suffix="+">480+</span>, unit: "" },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between rounded-2xl bg-[var(--cream)] px-5 py-4">
                  <span className="text-[11.5px] font-extrabold uppercase tracking-[0.11em] text-[var(--ink-mute)]">{s.label}</span>
                  <span className="font-display text-[28px] font-semibold leading-none tracking-[-0.01em] text-[var(--ink)]">
                    {s.value} {s.unit && <span className="ml-1 text-[11px] font-extrabold uppercase tracking-[0.1em] text-[var(--terra)]">{s.unit}</span>}
                  </span>
                </div>
              ))}
            </div>

            {/* press - editorial mentions, not fabricated testimonials */}
            <div className="mt-9 rounded-2xl border-[1.5px] border-dashed border-[oklch(0.85_0.035_58)] p-5 sm:p-7">
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.15em] text-[var(--terra)]">
                <Award size={14} /> Press &amp; stockists
              </div>
              <div className="mt-5 grid gap-7 sm:grid-cols-3">
                <blockquote>
                  <p className="font-display text-[16px] italic leading-relaxed">“The most thoughtful buttercream in the city.”</p>
                  <footer className="mt-2.5 text-[11px] font-extrabold uppercase tracking-[0.1em] text-[var(--ink-mute)]">Portland Monthly · Market Notes 2024</footer>
                </blockquote>
                <blockquote>
                  <p className="font-display text-[16px] italic leading-relaxed">“Small-batch, seasonal, and deeply considered.”</p>
                  <footer className="mt-2.5 text-[11px] font-extrabold uppercase tracking-[0.1em] text-[var(--ink-mute)]">The Oregonian · Food Day</footer>
                </blockquote>
                <div>
                  <p className="text-[13.5px] font-extrabold leading-5">Tastings</p>
                  <p className="mt-1.5 text-[13px] leading-5 text-[var(--ink-mute)]">Private tastings two Saturdays a month — two flavors, one filling, garden flowers for reference. Portfolio demo — scheduling is mocked.</p>
                  <button
                    onClick={() => toast.success("Tasting — demo", { description: "In production this would open a calendar to book a Saturday. For now, try the inquiry form." })}
                    className="mt-3 inline-flex items-center gap-2 rounded-full bg-[var(--blush)] px-4 py-2.5 text-[12.5px] font-extrabold text-[oklch(0.45_0.08_20)] transition-colors hover:bg-[var(--terra)] hover:text-white"
                  >
                    <CalendarDays size={14} /> Check tasting dates
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* closing — drenched blush */}
        <section className="container pb-16 sm:pb-22" data-reveal="up">
          <div className="paper-texture relative overflow-hidden rounded-[2.5rem] bg-[var(--blush)] px-6 py-16 text-center sm:px-10 sm:py-20">
            <ButterBlob className="pointer-events-none absolute -right-14 -top-14 h-48 w-48 text-[var(--butter)] opacity-80" aria-hidden />
            <LeafSprig className="drift pointer-events-none absolute -left-6 bottom-0 h-32 w-32 rotate-[210deg] text-[var(--sage-deep)] opacity-35" aria-hidden />
            <div className="relative mx-auto max-w-2xl">
              <div className="mx-auto flex justify-center">
                <BakeryMark size="lg" />
              </div>
              <p className="eyebrow mt-6 justify-center">For gatherings of any size</p>
              <h2 className="display-title mx-auto mt-4 max-w-[14ch] text-[44px] leading-[1] sm:text-[58px] lg:text-[66px]">
                Tell me what you’re <em>celebrating.</em>
              </h2>
              <p className="mx-auto mt-4 max-w-[40ch] text-[15px] leading-7 text-[oklch(0.4_0.035_35)]">
                A birthday, a shower, a Tuesday that deserves a little ceremony — we’ll make it delicious.
              </p>
              <Link href="/custom-order" className="button-rose mx-auto mt-8">
                Build a custom quote <ArrowUpRight size={16} strokeWidth={2.2} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
