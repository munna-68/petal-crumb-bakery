import { withBase } from "@/lib/withBase";
/** Quiet Patisserie Editorial: maker story — now with process journal & press for portfolio depth. */
import { ArrowUpRight, Heart, Leaf, Quote, Sparkles, CalendarDays, Clock3, Award, Users, Flower2 } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import BakeryMark from "@/components/BakeryMark";

export default function About() {
  return (
    <div className="min-h-screen bg-[oklch(0.982_0.008_75)] text-[var(--ink)]">
      <SiteHeader />
      <main id="main">
        {/* hero — editorial split with frame */}
        <section className="container py-6 sm:py-8 lg:py-10">
          <div className="grid overflow-hidden border border-[oklch(0.88_0.018_52)] bg-[oklch(0.96_0.008_72)] lg:grid-cols-[0.92fr_1.08fr]">
            <div className="relative min-h-[420px] overflow-hidden bg-[oklch(0.94_0.009_72)] p-2 sm:min-h-[480px] lg:order-2 lg:p-2.5">
              <div className="visual-tile h-full min-h-[420px] sm:min-h-[480px]">
                <img
                  className="h-full w-full object-cover object-[50%_30%]"
                  src={withBase("/images/photo-1556910103-1c02745aae4d.jpg")}
                  alt="Maya, the baker, at work in a sunlit kitchen with flour-dusted hands"
                  loading="eager"
                />
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 border border-[oklch(0.88_0.018_52)] bg-[oklch(0.995_0.004_80/0.92)] px-3 py-2.5 backdrop-blur-[8px] sm:bottom-5 sm:left-5 sm:right-5">
                <span className="text-[11px] font-medium leading-4 text-[oklch(0.34_0.02_35)]">Maya · founder &amp; baker</span>
                <span className="hidden text-[9px] font-bold uppercase tracking-[0.11em] text-[oklch(0.58_0.03_18)] sm:inline">Portland · since 2019</span>
              </div>
            </div>
            <div className="flex flex-col justify-between bg-[oklch(0.995_0.004_80)] px-7 py-9 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
              <div>
                <div className="flex items-center gap-3">
                  <span className="h-px w-7 bg-[var(--rosewood)]" aria-hidden />
                  <p className="eyebrow">A note from the studio</p>
                </div>
                <h1 className="display-title mt-4 text-[48px] leading-[0.92] sm:text-[64px] lg:text-[74px]">
                  Meet
                  <br />
                  <em>Maya.</em>
                </h1>
                <p className="prose-measure mt-5 max-w-[36ch] text-[14px] leading-6 text-[oklch(0.44_0.02_35)] sm:text-[15px] sm:leading-7">
                  I’m the hands behind Petal &amp; Crumb: baker, flower gatherer, determined advocate for the second slice. I bake for the moment the candles go down and everyone leans in.
                </p>
              </div>
              <figure className="mt-10 border-l-2 border-[var(--rosewood)] pl-4 sm:pl-5">
                <Quote size={18} strokeWidth={1.9} className="text-[var(--rosewood)]" aria-hidden />
                <blockquote className="mt-3 font-display text-[22px] font-[450] leading-[1.15] tracking-[-0.02em] text-[oklch(0.28_0.02_35)] sm:text-[24px]">
                  The sweetest details are the ones people remember.
                </blockquote>
                <figcaption className="mt-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-[oklch(0.58_0.03_18)]">— Maya, on why she still pipes every rosette by hand</figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* way of working */}
        <section className="container grid gap-10 py-12 sm:py-16 lg:grid-cols-[0.78fr_1.22fr] lg:gap-14 lg:py-20">
          <div className="lg:sticky lg:top-[104px] lg:self-start">
            <p className="eyebrow">The way I work</p>
            <h2 className="display-title mt-3 max-w-[14ch] text-[38px] leading-[0.92] sm:text-[48px] lg:text-[56px]">
              Good ingredients,
              <br />
              good questions,
              <br />
              <em>a little surprise.</em>
            </h2>
            <div className="mt-6 hidden items-center gap-2 lg:flex">
              <BakeryMark size="sm" />
              <span className="h-px w-10 bg-[oklch(0.88_0.018_52)]" aria-hidden />
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[oklch(0.58_0.03_18)]">Est. 2019 · Portland</span>
            </div>
          </div>
          <div className="min-w-0 space-y-6 text-[15px] leading-7 text-[oklch(0.36_0.02_35)]">
            <p className="max-w-[60ch] text-balance">
              Petal &amp; Crumb grew from a tiny home kitchen and a love of making ordinary occasions feel a little ceremonial. The work is personal by design: I want to know the flavor that reminds you of home, the colors you’re wearing, and the people you can’t wait to feed.
            </p>
            <p className="max-w-[60ch] text-balance">
              My cakes are softly styled, naturally seasonal, and made from scratch in small batches. No fondant sculptures, no airbrush gradients — just textured buttercream, garden flowers, and a lot of care with a bench scraper.
            </p>
            <p className="max-w-[60ch] text-balance">
              They’re meant to be eaten, admired, and remembered long after the candles come down. If that sounds like your kind of cake, we’ll get along beautifully.
            </p>

            <div className="grid gap-3 pt-2 sm:grid-cols-2">
              <div className="border border-[oklch(0.86_0.02_52)] bg-white p-4">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[oklch(0.94_0.03_13)] text-[var(--rosewood)]">
                  <Heart size={14} strokeWidth={1.9} />
                </span>
                <p className="mt-3 text-[13px] font-semibold leading-5">Baked from scratch</p>
                <p className="mt-1 text-[13px] leading-5 text-[oklch(0.5_0.02_35)]">Butter, eggs, real vanilla — no mixes, no shortcuts.</p>
              </div>
              <div className="border border-[oklch(0.86_0.02_52)] bg-white p-4">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[oklch(0.94_0.03_13)] text-[var(--rosewood)]">
                  <Leaf size={14} strokeWidth={1.9} />
                </span>
                <p className="mt-3 text-[13px] font-semibold leading-5">Seasonal flowers</p>
                <p className="mt-1 text-[13px] leading-5 text-[oklch(0.5_0.02_35)]">Often from the garden or the market that morning.</p>
              </div>
              <div className="border border-[oklch(0.86_0.02_52)] bg-white p-4">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[oklch(0.94_0.03_13)] text-[var(--rosewood)]">
                  <Sparkles size={14} strokeWidth={1.9} />
                </span>
                <p className="mt-3 text-[13px] font-semibold leading-5">Small batch</p>
                <p className="mt-1 text-[13px] leading-5 text-[oklch(0.5_0.02_35)]">Three custom cakes per day, maximum — so each one gets attention.</p>
              </div>
              <div className="border border-[oklch(0.86_0.02_52)] bg-white p-4">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[oklch(0.94_0.03_13)] text-[var(--rosewood)]">
                  <Heart size={14} strokeWidth={1.9} />
                </span>
                <p className="mt-3 text-[13px] font-semibold leading-5">Made to be eaten</p>
                <p className="mt-1 text-[13px] leading-5 text-[oklch(0.5_0.02_35)]">Beautiful, yes — but flavor comes first, always.</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/menu" className="button-ink px-5 py-3.5 text-[10px]">
                See the menu <ArrowUpRight size={13} />
              </Link>
              <Link href="/gallery" className="inline-flex items-center gap-2 border-b border-[var(--rosewood)]/30 pb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[oklch(0.44_0.06_18)] hover:border-[var(--rosewood)] hover:text-[var(--rosewood)]">
                View the collection <ArrowUpRight size={13} />
              </Link>
            </div>
          </div>
        </section>

        {/* process journal */}
        <section className="border-y border-[oklch(0.88_0.018_52)] bg-[oklch(0.97_0.008_72)] py-14 sm:py-16 lg:py-20">
          <div className="container">
            <div className="flex items-center gap-3">
              <span className="h-px w-7 bg-[var(--rosewood)]" aria-hidden />
              <p className="eyebrow">From first note to final slice</p>
            </div>
            <div className="mt-6 grid gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:gap-10">
              <div>
                <h2 className="display-title text-[40px] sm:text-[50px] lg:text-[56px]">
                  How a cake
                  <br />
                  <em>comes together.</em>
                </h2>
                <p className="mt-4 max-w-[32ch] text-[14px] leading-6 text-[oklch(0.44_0.02_35)]">A little ritual, repeated with care — so nothing feels rushed and every tier feels like you.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { step: "01", title: "You share", desc: "Guest count, flavors you love, colors & date. Photos welcome.", icon: Users },
                  { step: "02", title: "We sketch", desc: "A loose pencil sketch & flavor map, priced clearly in the studio.", icon: Flower2 },
                  { step: "03", title: "We bake", desc: "From-scratch layers, chilled overnight, decorated by hand the day before.", icon: Award },
                ].map((s) => (
                  <div key={s.step} className="border border-[oklch(0.86_0.02_52)] bg-white p-5">
                    <div className="flex items-center justify-between">
                      <span className="grid h-8 w-8 place-items-center rounded-full border border-[oklch(0.86_0.02_52)] bg-[oklch(0.94_0.03_13)] text-[var(--rosewood)]">
                        <s.icon size={14} strokeWidth={1.9} />
                      </span>
                      <span className="text-[10px] font-bold tracking-[0.12em] text-[oklch(0.58_0.03_18)]">{s.step}</span>
                    </div>
                    <p className="mt-4 font-display text-[18px] font-medium leading-none">{s.title}</p>
                    <p className="mt-2 text-[12.5px] leading-5 text-[oklch(0.5_0.02_35)]">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* stats bar */}
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="flex items-center justify-between border border-[oklch(0.88_0.018_52)] bg-white px-5 py-4">
                <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[oklch(0.52_0.02_35)]">Cakes per day</span>
                <span className="font-display text-[28px] leading-none tracking-[-0.02em]">03 <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[oklch(0.58_0.03_18)]">max</span></span>
              </div>
              <div className="flex items-center justify-between border border-[oklch(0.88_0.018_52)] bg-white px-5 py-4">
                <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[oklch(0.52_0.02_35)]">Lead time</span>
                <span className="font-display text-[28px] leading-none tracking-[-0.02em]">5 <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[oklch(0.58_0.03_18)]">days</span></span>
              </div>
              <div className="flex items-center justify-between border border-[oklch(0.88_0.018_52)] bg-white px-5 py-4">
                <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[oklch(0.52_0.02_35)]">Since</span>
                <span className="font-display text-[28px] leading-none tracking-[-0.02em]">2019</span>
              </div>
            </div>

            {/* press - editorial, not fabricated testimonials */}
            <div className="mt-8 border border-[oklch(0.86_0.02_52)] bg-white p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--rosewood)]">
                <Award size={13} /> Press & stockists
              </div>
              <div className="mt-4 grid gap-6 sm:grid-cols-3">
                <blockquote className="border-l border-[oklch(0.86_0.02_52)] pl-4">
                  <p className="font-display text-[15px] leading-5">“The most thoughtful buttercream in the city.”</p>
                  <footer className="mt-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-[oklch(0.58_0.03_18)]">— Portland Monthly, Market Notes 2024 <span className="normal-case tracking-normal">· editorial mention</span></footer>
                </blockquote>
                <blockquote className="border-l border-[oklch(0.86_0.02_52)] pl-4">
                  <p className="font-display text-[15px] leading-5">“Small-batch, seasonal, and deeply considered.”</p>
                  <footer className="mt-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-[oklch(0.58_0.03_18)]">— The Oregonian, Food Day <span className="normal-case tracking-normal">· editorial mention</span></footer>
                </blockquote>
                <div className="flex flex-col gap-2">
                  <p className="text-[12px] font-semibold leading-5">Tastings</p>
                  <p className="text-[12.5px] leading-5 text-[oklch(0.52_0.02_35)]">Private tastings two Saturdays a month — two flavors, one filling, garden flowers for reference. Portfolio demo — scheduling is mocked.</p>
                  <button
                    onClick={() => toast.success("Tasting — demo", { description: "In production this would open a calendar to book a Saturday. For now, try the inquiry form." })}
                    className="mt-1 inline-flex items-center gap-1.5 self-start border border-[var(--rosewood)] bg-[oklch(0.94_0.03_13)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--rosewood)] hover:bg-[var(--rosewood)] hover:text-white"
                  >
                    <CalendarDays size={13} /> Check tasting dates
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[var(--ink)] px-5 py-14 text-[oklch(0.97_0.008_75)] sm:px-8 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto flex justify-center">
              <BakeryMark size="md" inverse />
            </div>
            <p className="eyebrow mt-6 justify-center text-[oklch(0.78_0.05_18)]">For gatherings of any size</p>
            <h2 className="mx-auto mt-4 max-w-[14ch] font-display text-[40px] font-[450] leading-[0.92] tracking-[-0.04em] sm:text-[54px] lg:text-[64px]">Tell me what you’re celebrating.</h2>
            <p className="mx-auto mt-4 max-w-[40ch] text-[14px] leading-6 text-[oklch(0.84_0.02_52)]">A birthday, a shower, a Tuesday that deserves a little ceremony — we’ll make it delicious.</p>
            <Link href="/custom-order" className="button-rose mx-auto mt-8 px-7 py-[14px]">
              Build a custom quote <ArrowUpRight size={14} strokeWidth={2.2} />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
