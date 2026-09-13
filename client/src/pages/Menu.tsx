/** Quiet Patisserie Editorial: seasonal menu with editorial rhythm and tactile pricing. */
import { ArrowUpRight, Check, Leaf, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { menuItems } from "@/lib/bakeryData";

export default function Menu() {
  return (
    <div className="min-h-screen bg-[oklch(0.982_0.008_75)] text-[var(--ink)]">
      <SiteHeader />
      <main id="main">
        <section className="container pb-8 pt-10 sm:pb-10 sm:pt-14 lg:pt-16">
          <div className="flex items-center gap-3">
            <span className="h-px w-7 bg-[var(--rosewood)]" aria-hidden />
            <p className="eyebrow">A small, seasonal menu</p>
          </div>
          <div className="mt-4 grid gap-6 lg:grid-cols-[1.05fr_.95fr] lg:gap-10">
            <h1 className="display-title max-w-[12ch] text-[44px] leading-[0.92] sm:text-[64px] lg:text-[80px] xl:text-[88px]">
              Sweet things,
              <br />
              <em>made slowly.</em>
            </h1>
            <div className="self-end lg:pb-2">
              <p className="max-w-[36ch] text-[14px] leading-6 text-[oklch(0.44_0.02_35)] sm:text-[15px] sm:leading-7">
                A few generous favorites, each baked to order and decorated by hand. Seasonal flavors shift with what’s best; custom cake pricing begins in the order studio.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
                <span className="inline-flex items-center gap-1.5 border border-[oklch(0.86_0.02_52)] bg-white px-2.5 py-1 font-medium text-[oklch(0.42_0.02_35)]">
                  <Leaf size={12} className="text-[var(--rosewood)]" /> Baked to order
                </span>
                <span className="inline-flex items-center gap-1.5 border border-[oklch(0.86_0.02_52)] bg-white px-2.5 py-1 font-medium text-[oklch(0.42_0.02_35)]">
                  <Sparkles size={12} className="text-[var(--rosewood)]" /> Decorated by hand
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="container pb-14 sm:pb-20 lg:pb-24">
          <div className="grid gap-6 gap-y-10 sm:grid-cols-2 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-4">
            {menuItems.map((item) => (
              <article key={item.title} className="group flex flex-col">
                <div className="relative overflow-hidden border border-[oklch(0.88_0.018_52)] bg-[oklch(0.96_0.008_72)] p-1.5">
                  <div className="visual-tile aspect-[0.92] sm:aspect-[0.9]">
                    <img src={item.image} alt={item.title} loading="lazy" decoding="async" />
                  </div>
                  <span className="absolute left-3 top-3 border border-black/10 bg-white/85 px-2 py-1 text-[8px] font-bold uppercase tracking-[0.13em] text-[oklch(0.34_0.02_35)] backdrop-blur-md">
                    {item.tag}
                  </span>
                </div>
                <div className="mt-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="font-display text-[26px] font-[500] leading-none tracking-[-0.02em] sm:text-[28px]">{item.title}</h2>
                    <p className="mt-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-[var(--rosewood)]">{item.tag} · seasonal</p>
                  </div>
                  <p className="shrink-0 rounded-full border border-[oklch(0.86_0.02_52)] bg-white px-2.5 py-1 text-[11px] font-semibold tracking-[-0.01em] text-[oklch(0.38_0.02_35)]">
                    {item.price}
                  </p>
                </div>
                <p className="mt-2.5 max-w-[32ch] text-[13px] leading-6 text-[oklch(0.46_0.02_35)]">{item.detail}</p>
                <div className="mt-3 h-px w-full bg-[oklch(0.91_0.015_52)]" aria-hidden />
              </article>
            ))}
          </div>
          <p className="mt-6 text-center text-[11px] leading-5 text-[oklch(0.58_0.03_18)]">
            Prices are starting points · final quote reflects size, flavor, and finish. <Link href="/custom-order" className="underline decoration-[var(--rosewood)]/30 underline-offset-4 hover:decoration-[var(--rosewood)]">See live pricing in the studio</Link>
          </p>
        </section>

        <section className="bg-[var(--ink)] px-5 py-14 text-[oklch(0.97_0.008_75)] sm:px-8 sm:py-16 lg:py-20">
          <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-12">
            <div>
              <p className="footer-label">Planning something larger?</p>
              <h2 className="mt-4 max-w-[16ch] font-display text-[40px] font-[450] leading-[0.92] tracking-[-0.04em] sm:text-[48px] lg:text-[52px]">Start with the shape of the gathering.</h2>
              <p className="mt-4 max-w-[36ch] text-[14px] leading-6 text-[oklch(0.84_0.02_52)]">Worried about guest count or delivery? The studio keeps it simple: pick size, pick date, see the math.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-3">
              <div className="border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm transition-colors hover:bg-white/[0.06]">
                <span className="grid h-8 w-8 place-items-center rounded-full border border-white/15 bg-white/5 text-[oklch(0.78_0.05_18)]">
                  <Check size={16} strokeWidth={2.1} />
                </span>
                <p className="mt-4 text-[13px] font-semibold leading-5">Built around your guest count</p>
                <p className="mt-1.5 text-[13px] leading-6 text-[oklch(0.84_0.02_52)]">Pick a size and see a transparent starting price, then refine flavor and finish.</p>
              </div>
              <div className="border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm transition-colors hover:bg-white/[0.06]">
                <span className="grid h-8 w-8 place-items-center rounded-full border border-white/15 bg-white/5 text-[oklch(0.78_0.05_18)]">
                  <Check size={16} strokeWidth={2.1} />
                </span>
                <p className="mt-4 text-[13px] font-semibold leading-5">Designed for your date</p>
                <p className="mt-1.5 text-[13px] leading-6 text-[oklch(0.84_0.02_52)]">Only real available dates appear in the calendar — no back-and-forth.</p>
              </div>
            </div>
          </div>
          <div className="mx-auto mt-8 max-w-[1180px] flex flex-wrap items-center gap-3">
            <Link href="/custom-order" className="button-rose px-6 py-[14px]">
              Build a custom quote <ArrowUpRight size={14} strokeWidth={2.2} />
            </Link>
            <p className="text-[11px] leading-5 text-[oklch(0.72_0.02_52)]">
              Free to explore · <span className="text-[oklch(0.86_0.02_52)]">no payment until you confirm</span>
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
