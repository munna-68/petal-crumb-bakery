/** Quiet Patisserie Editorial: filterable work gallery — airy masonry with editorial captions. */
import { useState, useMemo } from "react";
import { Link } from "wouter";
import { ArrowUpRight, Image as ImageIcon, Sparkles } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { galleryItems } from "@/lib/bakeryData";

const filters = ["All", "Weddings", "Birthdays", "Little Cakes", "Cookies"] as const;
type Filter = (typeof filters)[number];

export default function Gallery() {
  const [filter, setFilter] = useState<Filter>("All");
  const visible = useMemo(
    () => (filter === "All" ? galleryItems : galleryItems.filter((item) => item.category === filter)),
    [filter]
  );

  return (
    <div className="min-h-screen bg-[oklch(0.982_0.008_75)] text-[var(--ink)]">
      <SiteHeader />
      <main id="main">
        <section className="container pb-6 pt-10 sm:pb-8 sm:pt-14">
          <div className="flex items-center gap-3">
            <span className="h-px w-7 bg-[var(--rosewood)]" aria-hidden />
            <p className="eyebrow">A few favorite tables</p>
          </div>
          <h1 className="display-title mt-4 max-w-[12ch] text-[48px] leading-[0.92] sm:text-[68px] lg:text-[88px]">
            The cake
            <br />
            <em>collection.</em>
          </h1>
          <p className="prose-measure mt-5 max-w-[46ch] text-[14px] leading-6 text-[oklch(0.44_0.02_35)] sm:text-[15px] sm:leading-7">
            Every cake begins with a shared idea and ends somewhere softer, stranger, and more delicious. Six recent tables — styled with seasonal blooms and natural light.
          </p>
        </section>

        <section className="container pb-14 sm:pb-20">
          <div className="flex flex-wrap items-center gap-2 border-y border-[oklch(0.88_0.018_52)] bg-white/60 py-3 backdrop-blur-sm sm:gap-1.5 sm:py-3.5" role="tablist" aria-label="Gallery filters">
            {filters.map((item) => {
              const active = filter === item;
              const count = item === "All" ? galleryItems.length : galleryItems.filter((g) => g.category === item).length;
              return (
                <button
                  key={item}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(item)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[var(--rosewood)] focus-visible:ring-offset-2 ${
                    active
                      ? "border-[var(--rosewood)] bg-[var(--rosewood)] text-white shadow-[0_4px_14px_oklch(0.49_0.09_18/0.2)]"
                      : "border-[oklch(0.86_0.02_52)] bg-white text-[oklch(0.42_0.02_35)] hover:border-[oklch(0.72_0.03_18)] hover:bg-[oklch(0.94_0.03_13)] hover:text-[var(--ink)]"
                  }`}
                >
                  {item}
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none tabular-nums ${active ? "bg-white/20 text-white" : "bg-[oklch(0.96_0.008_72)] text-[oklch(0.52_0.02_35)]"}`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
            <span className="ml-auto hidden items-center gap-1.5 text-[11px] text-[oklch(0.58_0.03_18)] sm:inline-flex">
              <ImageIcon size={13} className="text-[var(--rosewood)]" /> {visible.length} {visible.length === 1 ? "cake" : "cakes"}
            </span>
          </div>

          <div className="stagger mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((item, index) => (
              <article
                key={`${item.id}-${item.title}`}
                className={`group relative overflow-hidden border border-[oklch(0.88_0.018_52)] bg-[oklch(0.96_0.008_72)] p-1.5 ${index % 5 === 0 ? "sm:row-span-2" : ""}`}
              >
                <div className={`${index % 5 === 0 ? "aspect-[0.78] sm:aspect-[0.74]" : "aspect-[1.08]"} visual-tile`}>
                  <img src={item.image} alt={item.alt} loading="lazy" decoding="async" />
                </div>
                {/* caption — slide up */}
                <div className="absolute inset-x-1.5 bottom-1.5 flex translate-y-[2px] items-center justify-between gap-3 bg-[oklch(0.995_0.004_80/0.94)] px-3 py-2.5 opacity-0 backdrop-blur-[8px] transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="min-w-0">
                    <p className="truncate font-display text-[15px] font-medium leading-none">{item.title}</p>
                    <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.11em] text-[oklch(0.58_0.03_18)]">{item.category}</p>
                  </div>
                  <span className="hidden h-7 w-7 shrink-0 place-items-center rounded-full border border-[oklch(0.86_0.02_52)] bg-white text-[oklch(0.42_0.02_35)] group-hover:text-[var(--rosewood)] sm:grid">
                    <ArrowUpRight size={13} strokeWidth={1.9} />
                  </span>
                </div>
                <span className="absolute left-3 top-3 border border-black/10 bg-white/85 px-2 py-1 text-[8px] font-bold uppercase tracking-[0.12em] text-[oklch(0.34_0.02_35)] backdrop-blur-md">
                  0{index + 1} · {item.category}
                </span>
              </article>
            ))}
          </div>

          {visible.length === 0 && (
            <div className="mt-8 border border-dashed border-[oklch(0.86_0.02_52)] bg-white p-10 text-center">
              <p className="font-display text-xl">Nothing here yet.</p>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[oklch(0.52_0.02_35)]">Try another filter — we add new tables each season.</p>
              <button onClick={() => setFilter("All")} className="button-ink mt-4 px-4 py-2.5 text-[10px]">
                Show all
              </button>
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[oklch(0.91_0.015_52)] pt-4 text-[11px] leading-5 text-[oklch(0.58_0.03_18)]">
            <span className="inline-flex items-center gap-1.5">
              <Sparkles size={12} className="text-[var(--rosewood)]" /> Photographed in natural light
            </span>
            <span>Styled with seasonal blooms · Portland, Oregon</span>
          </div>
        </section>

        <section className="relative overflow-hidden border-y border-[oklch(0.84_0.06_18/0.35)] bg-[oklch(0.93_0.04_13)] px-5 py-14 sm:px-8 sm:py-16">
          <div className="pointer-events-none absolute inset-0 paper-texture opacity-45" aria-hidden />
          <div className="relative mx-auto max-w-2xl text-center">
            <p className="eyebrow justify-center">Your celebration belongs here</p>
            <h2 className="display-title mx-auto mt-3 max-w-[12ch] text-[44px] sm:text-[60px]">Dream it up.</h2>
            <p className="prose-measure mx-auto mt-3 max-w-[40ch] text-[14px] leading-6 text-[oklch(0.42_0.02_35)]">Tell us a little about the gathering — we’ll shape the rest around it.</p>
            <Link href="/custom-order" className="button-rose mt-7 px-6 py-[14px]">
              Start your cake <ArrowUpRight size={14} strokeWidth={2.2} />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
