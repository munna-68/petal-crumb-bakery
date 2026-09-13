import { withBase } from "@/lib/withBase";
/**
 * Quiet Patisserie Editorial — photo-first, asymmetric landing with magazine rhythm.
 * Portfolio upgrade: press strip, interactive collection with wishlist, bag actions, and newsletter preview.
 */
import { ArrowRight, ArrowUpRight, CalendarDays, Check, Clock3, Sparkles, Dot, Heart, ShoppingBag, Eye, Instagram, Quote } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { galleryItems } from "@/lib/bakeryData";
import BakeryMark from "@/components/BakeryMark";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useCart } from "@/contexts/CartContext";

const heroCake = withBase("/images/photo-1578985545062-69928b1d9587.jpg");

export default function Home() {
  const { toggle, isFavorite } = useFavorites();
  const { addItem } = useCart();

  return (
    <div className="min-h-screen overflow-clip bg-[oklch(0.982_0.008_75)] text-[var(--ink)] selection:bg-[oklch(0.85_0.06_18/0.5)]">
      <SiteHeader />
      <main id="main">
        {/* HERO — generous, asymmetric, hairline-accented */}
        <section className="container pt-5 sm:pt-7">
          <div className="relative grid overflow-hidden border border-[oklch(0.88_0.018_52)] bg-[oklch(0.96_0.008_72)] lg:min-h-[620px] lg:grid-cols-[1.06fr_.94fr]">
            {/* copy */}
            <div className="relative flex flex-col justify-between px-6 py-9 sm:px-10 sm:py-12 lg:px-[56px] lg:py-[54px]">
              <div className="fade-up">
                <div className="flex items-center gap-3">
                  <span className="h-px w-7 bg-[var(--rosewood)]" aria-hidden />
                  <p className="eyebrow">Custom cakes · Portland, Oregon</p>
                </div>
                <h1 className="display-title mt-6 max-w-[560px] text-[46px] leading-[0.90] sm:text-[64px] lg:text-[86px] xl:text-[92px]">
                  A little more
                  <br />
                  <em>meaning</em> on
                  <br />
                  the table.
                </h1>
                <p className="prose-measure mt-6 max-w-[42ch] text-[14px] leading-6 text-[oklch(0.42_0.02_35)] sm:text-[15px] sm:leading-7">
                  Celebration cakes, gathered from seasonal flavor, textured buttercream, and a little garden magic. Baked to order, decorated by hand.
                </p>
                <div className="mt-3 flex items-center gap-2 text-[11px] leading-5 text-[oklch(0.52_0.02_35)]">
                  <span className="inline-flex items-center gap-1.5"><Dot size={14} className="text-[var(--rosewood)]" /> Made to order</span>
                  <span className="h-3 w-px bg-[oklch(0.88_0.018_52)]" aria-hidden />
                  <span>Five-day lead time</span>
                  <span className="h-3 w-px bg-[oklch(0.88_0.018_52)]" aria-hidden />
                  <span>Pickup or delivery</span>
                </div>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Link href="/custom-order" className="button-rose px-6 py-[14px] text-[10px]">Build your cake <ArrowUpRight size={14} strokeWidth={2.2} /></Link>
                <Link href="/menu" className="button-ink px-6 py-[14px]">See the menu <ArrowRight size={14} strokeWidth={2.1} /></Link>
              </div>

              <div className="absolute bottom-0 left-0 hidden h-[34%] w-[2px] bg-[var(--rosewood)] lg:block" aria-hidden />
              <div className="absolute bottom-6 right-6 hidden items-center gap-2 text-[9px] font-bold uppercase tracking-[0.14em] text-[oklch(0.52_0.02_35)] lg:flex" aria-hidden>
                <span className="h-px w-6 bg-[oklch(0.84_0.02_52)]" /> Est. 2019
              </div>
            </div>

            {/* image — editorial, not card */}
            <div className="relative min-h-[360px] overflow-hidden bg-[oklch(0.94_0.009_72)] lg:min-h-full">
              <img
                src={heroCake}
                alt="Floral celebration cake with garden blooms on a linen-draped table"
                className="h-full w-full object-cover object-[50%_38%] lg:object-center"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.25_0.018_35/0.08)] via-transparent to-transparent lg:bg-gradient-to-l lg:from-transparent lg:via-transparent" aria-hidden />
              {/* hairline caption — editorial, not pill */}
              <div className="absolute bottom-0 inset-x-0 flex items-end justify-between gap-4 bg-gradient-to-t from-[oklch(0.25_0.018_35/0.42)] to-transparent p-4 sm:p-5 lg:p-6">
                <p className="max-w-[22ch] font-display text-[13px] italic leading-5 text-white/95 text-balance">
                  Garden cake — vanilla bean, raspberry preserve, textured buttercream
                </p>
                <span className="hidden shrink-0 border border-white/35 bg-white/10 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.13em] text-white backdrop-blur-[6px] sm:inline-flex">
                  Look 01 · Summer
                </span>
              </div>
              {/* index */}
              <span className="absolute left-4 top-4 hidden border border-[oklch(1_0_0/0.55)] bg-white/75 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-[oklch(0.34_0.02_35)] backdrop-blur-md lg:inline-flex">
                Collection · 01 / 06
              </span>
            </div>
          </div>
          {/* sub-hero meta bar */}
          <div className="hidden grid-cols-3 divide-x divide-[oklch(0.88_0.018_52)] border-x border-b border-[oklch(0.88_0.018_52)] bg-white/70 text-[11px] leading-5 backdrop-blur-sm lg:grid">
            <div className="flex items-center justify-between px-6 py-3.5"><span className="font-semibold uppercase tracking-[0.12em] text-[oklch(0.45_0.02_35)]">Studio hours</span><span className="text-[oklch(0.52_0.02_35)]">Tue–Sat · 10a–5p</span></div>
            <div className="flex items-center justify-between px-6 py-3.5"><span className="font-semibold uppercase tracking-[0.12em] text-[oklch(0.45_0.02_35)]">Lead time</span><span className="text-[oklch(0.52_0.02_35)]">5 days · rush when possible</span></div>
            <div className="flex items-center justify-between px-6 py-3.5"><span className="font-semibold uppercase tracking-[0.12em] text-[oklch(0.45_0.02_35)]">Location</span><span className="text-[oklch(0.52_0.02_35)]">Portland, Oregon</span></div>
          </div>
          {/* press strip — portfolio social proof without fabricated reviews */}
          <div className="mt-3 hidden items-center justify-between gap-4 border border-[oklch(0.88_0.018_52)] bg-white px-5 py-3 sm:flex">
            <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-[oklch(0.58_0.03_18)]">Noted in</span>
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[oklch(0.42_0.02_35)]">
              <span className="font-display text-[13px] font-medium normal-case tracking-[-0.02em]">The Oregonian</span>
              <span className="h-3 w-px bg-[oklch(0.88_0.018_52)]" aria-hidden />
              <span className="font-display text-[13px] font-medium normal-case tracking-[-0.02em]">Portland Monthly</span>
              <span className="h-3 w-px bg-[oklch(0.88_0.018_52)]" aria-hidden />
              <span className="font-display text-[13px] font-medium normal-case tracking-[-0.02em]">Bon Appétit — Market Notes</span>
            </div>
            <span className="hidden items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--rosewood)] lg:inline-flex"><Quote size={12} /> Editorial, not advertorial</span>
          </div>
        </section>

        {/* EDITORIAL: blush note + image */}
        <section className="container py-12 sm:py-16 lg:py-20">
          <div className="grid gap-3 lg:grid-cols-[1.08fr_.92fr] lg:gap-3">
            <div className="paper-texture relative overflow-hidden border border-[oklch(0.87_0.03_18/0.55)] bg-[oklch(0.93_0.04_13)] px-7 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
              <div className="absolute right-6 top-6 hidden h-7 w-7 place-items-center rounded-full border border-[oklch(0.62_0.07_18/0.35)] text-[var(--rosewood)] sm:grid" aria-hidden><Sparkles size={14} strokeWidth={1.9} /></div>
              <p className="eyebrow">Made in small, lovely batches</p>
              <h2 className="display-title mt-4 max-w-[14ch] text-[42px] sm:text-[52px] lg:text-[58px]">
                Cakes, handcrafted
                <br />
                with <em>feeling.</em>
              </h2>
              <p className="prose-measure mt-5 max-w-[42ch] text-[14px] leading-6 text-[oklch(0.42_0.02_35)] sm:text-[15px] sm:leading-7">
                From a citrusy birthday layer cake to a wedding centerpiece covered in garden blooms, every detail is shaped around the people at your table. Softly styled, naturally seasonal.
              </p>
              <div className="mt-8 flex flex-wrap gap-2 text-[11px]">
                <span className="inline-flex items-center gap-1.5 border border-[oklch(0.62_0.07_18/0.35)] bg-white/55 px-3 py-1.5 font-semibold uppercase tracking-[0.11em] text-[oklch(0.38_0.02_35)]"><span className="h-1.5 w-1.5 rounded-full bg-[var(--rosewood)]" /> Baked from scratch</span>
                <span className="inline-flex items-center gap-1.5 border border-[oklch(0.62_0.07_18/0.35)] bg-white/55 px-3 py-1.5 font-semibold uppercase tracking-[0.11em] text-[oklch(0.38_0.02_35)]"><span className="h-1.5 w-1.5 rounded-full bg-[var(--rosewood)]" /> Seasonal flowers</span>
              </div>
              <Link href="/about" className="mt-9 inline-flex items-center gap-2 border-b border-[oklch(0.62_0.07_18/0.5)] pb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[oklch(0.44_0.06_18)] transition-colors hover:border-[var(--rosewood)] hover:text-[var(--rosewood)]">
                Meet the baker <ArrowRight size={14} strokeWidth={2.1} />
              </Link>
              {/* hairline footer */}
              <div className="absolute inset-x-0 bottom-0 h-px bg-[oklch(0.78_0.05_18/0.55)]" aria-hidden />
            </div>
            <div className="group relative overflow-hidden border border-[oklch(0.88_0.018_52)] bg-[oklch(0.96_0.008_72)] p-2 sm:p-2.5">
              <div className="visual-tile aspect-[1.02] sm:aspect-[1.08]">
                <img src={withBase("/images/photo-1602351447937-745cb720612f.jpg")} alt="A simply frosted cake on a plate, styled with linen" loading="lazy" />
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 border border-[oklch(0.88_0.018_52)] bg-[oklch(0.995_0.004_80/0.92)] px-3 py-2.5 backdrop-blur-[8px] sm:bottom-5 sm:left-5 sm:right-5">
                <span className="text-[11px] font-medium leading-4 text-[oklch(0.34_0.02_35)]">Petite vanilla · serves 6–8</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => toast.success("Petite vanilla — added inspiration", { description: "Find it in Gallery or add the petite cake from the Menu." })}
                    className="hidden h-7 place-items-center rounded-full border border-[oklch(0.86_0.02_52)] bg-white px-2.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[oklch(0.34_0.02_35)] hover:border-[var(--ink)] hover:text-[var(--ink)] sm:inline-flex"
                  >
                    View
                  </button>
                  <span className="shrink-0 rounded-full border border-[oklch(0.86_0.02_52)] bg-white px-2.5 py-1 text-[11px] font-semibold tracking-[-0.01em] text-[oklch(0.38_0.02_35)]">From $54</span>
                </div>
              </div>
              {/* top actions */}
              <div className="absolute right-3 top-3 flex gap-1.5 sm:right-4 sm:top-4">
                <button
                  onClick={() => addItem({ id: "menu-petite", title: "Petite cake", detail: "Serves 6–8 · seasonal", price: 54, priceLabel: "from $54", image: withBase("/images/photo-1602351447937-745cb720612f.jpg"), quantity: 1 })}
                  className="grid h-8 w-8 place-items-center rounded-full border border-white/60 bg-white/85 text-[oklch(0.34_0.02_35)] backdrop-blur-md hover:bg-white hover:text-[var(--rosewood)]"
                  aria-label="Add petite cake to bag"
                >
                  <ShoppingBag size={13} />
                </button>
                <button
                  onClick={() => toggle("home-petite", "Petite vanilla")}
                  aria-label="Save"
                  className={`grid h-8 w-8 place-items-center rounded-full border backdrop-blur-md ${isFavorite("home-petite") ? "border-[var(--rosewood)] bg-[var(--rosewood)] text-white" : "border-white/60 bg-white/85 text-[oklch(0.34_0.02_35)] hover:bg-white"}`}
                >
                  <Heart size={13} className={isFavorite("home-petite") ? "fill-white" : ""} />
                </button>
              </div>
            </div>
          </div>

          {/* mosaic — not identical, staggered with captions */}
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {[
              { href: "/menu", img: "/images/photo-1535254973040-607b474cb50d.jpg", alt: "Single tier celebration cake", kicker: "01 · Seasonal", title: "Shop the menu", note: "From $34" },
              { href: "/about", img: "/images/photo-1556910103-1c02745aae4d.jpg", alt: "Baker preparing a cake, hands dusted with flour", kicker: "02 · Studio", title: "From the studio", note: "Meet Maya" },
              { href: "/custom-order", img: "/images/photo-1559620192-032c4bc4674e.jpg", alt: "Pink buttercream cake with soft swirls", kicker: "03 · Custom", title: "Custom order", note: "Live quote" },
            ].map((tile) => (
              <Link key={tile.href} href={tile.href} className="group relative overflow-hidden border border-[oklch(0.88_0.018_52)] bg-[oklch(0.96_0.008_72)] p-2">
                <div className="visual-tile aspect-[1.15] sm:aspect-[1.08]">
                  <img className="h-full w-full object-cover" src={withBase(tile.img)} alt={tile.alt} loading="lazy" />
                </div>
                <div className="absolute inset-2 top-auto flex items-end justify-between gap-3 bg-gradient-to-t from-[oklch(0.25_0.018_35/0.55)] via-[oklch(0.25_0.018_35/0.18)] to-transparent p-3 sm:p-4">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/80">{tile.kicker}</p>
                    <p className="mt-1 font-display text-[20px] leading-none text-white">{tile.title}</p>
                  </div>
                  <span className="hidden shrink-0 border border-white/30 bg-white/12 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-md sm:inline-flex">
                    {tile.note} <ArrowUpRight size={11} className="ml-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ORDER STUDIO PREVIEW — editorial, not SaaS grid */}
        <section className="border-y border-[oklch(0.88_0.018_52)] bg-[oklch(0.97_0.008_72)] py-14 sm:py-20 lg:py-24">
          <div className="container grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start lg:gap-12">
            <div className="lg:sticky lg:top-[104px]">
              <p className="eyebrow">Less back-and-forth, more buttercream</p>
              <h2 className="display-title mt-4 text-[46px] sm:text-[58px] lg:text-[64px]">
                Meet the
                <br />
                <em>order studio.</em>
              </h2>
              <p className="prose-measure mt-5 max-w-[36ch] text-[14px] leading-6 text-[oklch(0.42_0.02_35)] sm:text-[15px] sm:leading-7">
                Pick your cake, see the price change as you go, and choose a date that actually works. Clear from first crumb to final pickup. No mystery messages.
              </p>
              <Link href="/custom-order" className="button-rose mt-8 px-6 py-[14px]">Try the live quote <ArrowUpRight size={14} strokeWidth={2.2} /></Link>
              <div className="mt-6 flex flex-wrap gap-2 text-[11px] text-[oklch(0.52_0.02_35)]">
                <span className="inline-flex items-center gap-1.5 border border-[oklch(0.88_0.018_52)] bg-white px-3 py-1.5"><CalendarDays size={13} className="text-[var(--rosewood)]" /> Real availability</span>
                <span className="inline-flex items-center gap-1.5 border border-[oklch(0.88_0.018_52)] bg-white px-3 py-1.5"><Clock3 size={13} className="text-[var(--rosewood)]" /> Rush when possible</span>
              </div>
            </div>

            <div className="relative border border-[oklch(0.86_0.02_52)] bg-[oklch(0.995_0.004_80)] p-4 shadow-[0_18px_50px_oklch(0.25_0.018_35/0.06)] sm:p-7">
              {/* card header */}
              <div className="flex items-start justify-between gap-4 border-b border-[oklch(0.91_0.015_52)] pb-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--rosewood)]">Custom cake · live estimate</p>
                  <p className="mt-1.5 font-display text-[24px] leading-none tracking-[-0.02em] sm:text-[26px]">Your celebration, taking shape</p>
                  <p className="mt-1.5 text-[12px] leading-5 text-[oklch(0.52_0.02_35)]">Four considered steps, priced as you go.</p>
                </div>
                <span className="hidden h-9 w-9 shrink-0 place-items-center rounded-full border border-[oklch(0.88_0.06_18/0.35)] bg-[oklch(0.94_0.03_13)] text-[var(--rosewood)] sm:grid" aria-hidden><Sparkles size={16} strokeWidth={1.9} /></span>
              </div>

              {/* editorial steps — vertical, not 2x2 grid */}
              <ol className="relative mt-6 space-y-0">
                <span className="absolute left-[11px] top-3 hidden h-[calc(100%-24px)] w-px bg-[oklch(0.91_0.015_52)] sm:block" aria-hidden />
                {[
                  { n: "01", title: "Choose the details", desc: "Flavor, filling, finish, and servings — each choice updates the total.", meta: "From $84" },
                  { n: "02", title: "Find your date", desc: "Only open kitchen days appear. Up to 3 custom cakes per day.", meta: "5-day lead" },
                  { n: "03", title: "See the quote", desc: "A clear, live itemized total with deposit and balance.", meta: "No surprises" },
                  { n: "04", title: "Reserve your spot", desc: "Your 50% deposit holds the date; balance reminder handled.", meta: "Deposit 50%" },
                ].map((step, i) => (
                  <li key={step.n} className={`relative flex gap-4 py-4 ${i !== 3 ? "border-b border-[oklch(0.93_0.01_52)]" : ""}`}>
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-[oklch(0.86_0.02_52)] bg-white text-[10px] font-bold tracking-wide text-[oklch(0.52_0.02_35)] sm:mt-0.5">{step.n}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="text-[14px] font-semibold leading-5 text-[oklch(0.28_0.02_35)]">{step.title}</p>
                        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[oklch(0.58_0.03_18)]">{step.meta}</span>
                      </div>
                      <p className="mt-1 max-w-[48ch] text-[13px] leading-5 text-[oklch(0.52_0.02_35)]">{step.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[oklch(0.91_0.015_52)] pt-4 text-xs">
                <span className="inline-flex items-center gap-2 text-[oklch(0.45_0.02_35)]"><CalendarDays size={15} className="text-[var(--rosewood)]" /> Smart availability calendar</span>
                <span className="inline-flex items-center gap-2 text-[oklch(0.45_0.02_35)]"><Clock3 size={15} className="text-[var(--rosewood)]" /> Rush option if possible</span>
              </div>
            </div>
          </div>
        </section>

        {/* COLLECTION — editorial strip */}
        <section className="container py-14 sm:py-20 lg:py-24">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-7 bg-[var(--rosewood)]" aria-hidden />
                <p className="eyebrow">A few from the cake table</p>
              </div>
              <h2 className="display-title mt-3 text-[44px] sm:text-[56px]">The collection</h2>
              <p className="mt-2 max-w-[44ch] text-[13px] leading-5 text-[oklch(0.52_0.02_35)]">Six recent tables — weddings, birthdays, little cakes and cookies. Save what you love, then see it in the gallery.</p>
            </div>
            <Link href="/gallery" className="inline-flex items-center gap-2 self-start border-b border-[oklch(0.62_0.07_18/0.35)] pb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[oklch(0.44_0.06_18)] transition-colors hover:border-[var(--rosewood)] hover:text-[var(--rosewood)] sm:self-auto">
              See every sweet thing <ArrowRight size={14} strokeWidth={2.1} />
            </Link>
          </div>

          <div className="stagger mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {galleryItems.map((item, idx) => {
              const fav = isFavorite(`gallery-${item.id}`);
              return (
                <div
                  key={item.id}
                  className={`group relative overflow-hidden border border-[oklch(0.88_0.018_52)] bg-[oklch(0.96_0.008_72)] p-1.5 ${idx === 0 ? "md:row-span-2" : ""}`}
                >
                  <Link href="/gallery" className={`visual-tile block ${idx === 0 ? "aspect-[0.78] md:aspect-[0.74]" : "aspect-[0.9]"}`}>
                    <img src={item.image} alt={item.alt} loading="lazy" decoding="async" />
                  </Link>
                  <div className="pointer-events-none absolute inset-1.5 top-auto translate-y-1 bg-[oklch(0.995_0.004_80/0.94)] p-2 opacity-0 backdrop-blur-[6px] transition-[transform,opacity] duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="truncate font-display text-[13px] leading-none">{item.title}</p>
                    <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.11em] text-[oklch(0.58_0.03_18)]">{item.category}</p>
                  </div>
                  <span className="absolute left-2 top-2 border border-black/10 bg-white/80 px-1.5 py-1 text-[8px] font-bold uppercase tracking-[0.12em] text-[oklch(0.34_0.02_35)] backdrop-blur-sm">0{idx + 1}</span>
                  <div className="absolute right-2 top-2 flex gap-1">
                    <button
                      onClick={() => toggle(`gallery-${item.id}`, item.title)}
                      aria-label="Save"
                      className={`grid h-7 w-7 place-items-center rounded-full border backdrop-blur-sm transition-colors ${fav ? "border-[var(--rosewood)] bg-[var(--rosewood)] text-white" : "border-white/60 bg-white/80 text-[oklch(0.34_0.02_35)] hover:bg-white hover:text-[var(--rosewood)]"}`}
                    >
                      <Heart size={12} className={fav ? "fill-white" : ""} />
                    </button>
                    <Link href="/gallery" aria-label="View" className="hidden h-7 w-7 place-items-center rounded-full border border-white/60 bg-white/80 text-[oklch(0.34_0.02_35)] backdrop-blur-sm hover:bg-white hover:text-[var(--ink)] sm:grid">
                      <Eye size={12} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-center text-[11px] tracking-wide text-[oklch(0.52_0.02_35)]">Photographed in natural light · styled with seasonal blooms · tap to save to wishlist</p>
        </section>

        {/* CLOSING — drenched blush, centered, mark */}
        <section className="relative overflow-hidden border-y border-[oklch(0.84_0.06_18/0.35)] bg-[oklch(0.93_0.04_13)] px-5 py-14 sm:px-8 sm:py-20 lg:py-[84px]">
          <div className="pointer-events-none absolute inset-0 paper-texture opacity-[0.55]" aria-hidden />
          <div className="pointer-events-none absolute -right-10 -top-10 hidden h-64 w-64 rounded-full border border-[oklch(0.62_0.07_18/0.18)] lg:block" aria-hidden />
          <div className="relative mx-auto max-w-3xl text-center">
            <div className="mx-auto flex justify-center">
              <BakeryMark size="md" />
            </div>
            <p className="eyebrow mt-6 justify-center">The next thing to celebrate</p>
            <h2 className="display-title mx-auto mt-4 max-w-[12ch] text-[48px] sm:text-[64px] lg:text-[72px]">
              Let’s make it <em>delicious.</em>
            </h2>
            <p className="prose-measure mx-auto mt-5 max-w-[42ch] text-[14px] leading-6 text-[oklch(0.42_0.02_35)] sm:text-[15px] sm:leading-7">
              Build a first quote in a few considered steps. We’ll take care of the beautiful details together — flavor, finish, and a date that actually works.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/custom-order" className="button-rose px-7 py-[15px] text-[10px]">Start a custom order <ArrowUpRight size={14} strokeWidth={2.2} /></Link>
              <Link href="/contact" className="button-ink bg-white/55 px-6 py-[14px] backdrop-blur-sm hover:bg-[var(--ink)]">Ask a question</Link>
            </div>
            <p className="mt-5 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.11em] text-[oklch(0.45_0.03_18)]">
              <Check size={14} strokeWidth={2.2} className="text-[var(--rosewood)]" /> Free to explore · no payment yet
              <span className="mx-1 h-3 w-px bg-[oklch(0.78_0.05_18)]" aria-hidden />
              Portland pickup + delivery
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
