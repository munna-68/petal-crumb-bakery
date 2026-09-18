import { withBase } from "@/lib/withBase";
/**
 * Garden Bakery — warm, photo-first landing. Biscuit canvas, terracotta pills,
 * botanical decor, script annotations. All interactivity preserved
 * (wishlist, bag, quiz, comparison, availability, carousel).
 */
import { ArrowRight, ArrowUpRight, CalendarDays, Check, Clock3, Heart, ShoppingBag, Eye } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { galleryItems } from "@/lib/bakeryData";
import BakeryMark from "@/components/BakeryMark";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useCart } from "@/contexts/CartContext";
import { CakeFinderQuiz } from "@/components/CakeFinderQuiz";
import { FinishComparisonSlider } from "@/components/FinishComparisonSlider";
import { SliceJournalCarousel } from "@/components/SliceJournalCarousel";
import { LiveAvailabilityChecker } from "@/components/LiveAvailabilityChecker";
import { HeartDoodle, ButterBlob, LeafSprig, ScriptNote, SprigDivider } from "@/components/decor";
import { Flower2, CakeSlice } from "lucide-react";

const heroCake = withBase("/images/photo-1578985545062-69928b1d9587.jpg");

export default function Home() {
  const { toggle, isFavorite } = useFavorites();
  const { addItem } = useCart();

  return (
    <div className="min-h-screen overflow-clip bg-[var(--cream)] text-[var(--ink)]">
      <SiteHeader />
      <main id="main">
        {/* HERO — warm split, photo bleeds to the right edge, botanicals on the left */}
        <section className="relative" data-reveal="fade">
          {/* botanical cluster, left edge */}
          <div className="pointer-events-none absolute -left-14 top-6 hidden h-44 w-44 lg:block" aria-hidden>
            <ButterBlob className="drift-slow absolute inset-0 h-full w-full text-[var(--butter)]" />
          </div>
          <div className="pointer-events-none absolute -left-4 top-40 hidden h-24 w-24 lg:block" aria-hidden>
            <LeafSprig className="drift absolute h-full w-full text-[var(--sage-deep)] opacity-70" />
          </div>

          <div className="container !px-0 grid lg:grid-cols-2 lg:min-h-[640px]">
            {/* copy */}
            <div className="relative flex flex-col justify-center px-6 pb-12 pt-10 sm:px-10 sm:pb-16 sm:pt-14 lg:px-10 lg:pt-16">
              <div className="relative">
                <HeartDoodle className="absolute -top-9 right-2 hidden h-14 w-14 rotate-12 text-[var(--terra)] opacity-60 sm:block" />
                <p className="eyebrow">
                  Custom cakes <span className="mx-1 opacity-50">/</span> Portland, Oregon
                </p>
                <h1 className="display-title mt-5 max-w-[560px] text-[52px] leading-[0.94] sm:text-[72px] lg:text-[88px] xl:text-[96px]">
                  <span className="hero-line"><span className="hero-line-inner" style={{ "--line-delay": "60ms" } as React.CSSProperties}>A little more</span></span>
                  <br />
                  <span className="hero-line"><span className="hero-line-inner" style={{ "--line-delay": "180ms" } as React.CSSProperties}><em>meaning</em> on</span></span>
                  <br />
                  <span className="hero-line"><span className="hero-line-inner" style={{ "--line-delay": "300ms" } as React.CSSProperties}>the table.</span></span>
                </h1>
                <p className="prose-measure mt-6 max-w-[42ch] text-[15px] leading-7 text-[var(--ink-soft)]">
                  Celebration cakes, gathered from seasonal flavor, textured buttercream, and a little garden magic. Baked to order, decorated by hand.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link href="/custom-order" className="button-rose">Build Your Cake <ArrowRight size={16} strokeWidth={2.2} /></Link>
                  <Link href="/menu" className="button-ink">See the Menu</Link>
                </div>
                <p className="mt-7 flex items-center gap-2 text-[12.5px] font-semibold text-[var(--ink-mute)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--terra)]" aria-hidden />
                  Made to order
                  <span className="h-3 w-px bg-[var(--hairline)]" aria-hidden />
                  Five-day lead time
                  <span className="h-3 w-px bg-[var(--hairline)]" aria-hidden />
                  Pickup or delivery
                </p>
              </div>
            </div>

            {/* image — bleeds right, no frame */}
            <div className="relative min-h-[380px] overflow-hidden rounded-[2.5rem] sm:min-h-[460px] lg:min-h-full">
              <img
                src={heroCake}
                alt="Floral celebration cake with garden blooms on a linen-draped table"
                className="h-full w-full object-cover object-center"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
              {/* script annotation */}
              <div className="absolute right-6 top-8 hidden flex-col items-end gap-1 text-[oklch(0.99_0.008_80)] drop-shadow-[0_2px_10px_oklch(0.3_0.03_42/0.5)] md:flex" aria-hidden>
                <ScriptNote className="rotate-[-4deg]">Seasonal ingredients</ScriptNote>
              </div>
              {/* caption */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[oklch(0.3_0.03_42/0.5)] to-transparent p-6 pt-16">
                <p className="max-w-[30ch] font-display text-[15px] italic leading-snug text-white/95">
                  Garden cake — vanilla bean, raspberry preserve, textured buttercream
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURE STRIP — pastel icon chips + script sign-off */}
        <section className="border-b border-[oklch(0.9_0.022_65)] bg-[var(--cream)]">
          <div className="container flex flex-col gap-6 py-8 sm:py-10 lg:flex-row lg:items-center lg:gap-0">
            <div className="grid flex-1 gap-6 sm:grid-cols-3 lg:grid-cols-3 lg:divide-x lg:divide-[oklch(0.89_0.025_62)]">
              {[
                { icon: Flower2, chip: "bg-[var(--blush)] text-[var(--terra)]", label: "Seasonal ingredients", note: "Fresh, local, always." },
                { icon: CakeSlice, chip: "bg-[var(--sage-soft)] text-[var(--sage-deep)]", label: "Hand decorated", note: "Every cake is unique." },
                { icon: Heart, chip: "bg-[var(--butter-soft)] text-[var(--butter-deep)]", label: "Made to order", note: "Just for your celebration." },
              ].map((f) => (
                <div key={f.label} className="flex items-center gap-4 lg:justify-center lg:px-8">
                  <span className={`chip-icon h-12 w-12 ${f.chip}`}>
                    <f.icon size={20} strokeWidth={1.9} />
                  </span>
                  <span>
                    <span className="block text-[12px] font-extrabold uppercase tracking-[0.13em] text-[var(--ink)]">{f.label}</span>
                    <span className="mt-0.5 block text-[13px] text-[var(--ink-mute)]">{f.note}</span>
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 lg:pl-10" aria-hidden>
              <HeartDoodle className="h-8 w-8 -rotate-12 text-[var(--terra)] opacity-70" />
              <ScriptNote className="rotate-[-3deg] text-[var(--ink-soft)]">Life is sweeter with cake</ScriptNote>
            </div>
          </div>
        </section>

        {/* EDITORIAL: blush note + image */}
        <section className="container py-14 sm:py-20 lg:py-24">
          <div className="grid gap-6 lg:grid-cols-[1.08fr_.92fr]">
            <div className="paper-texture relative overflow-hidden rounded-[2rem] bg-[var(--blush)] px-7 py-11 sm:px-11 sm:py-14 lg:px-13 lg:py-16">
              <LeafSprig className="drift-slow pointer-events-none absolute -right-4 -top-4 h-28 w-28 rotate-[130deg] text-[oklch(0.78_0.07_20)] opacity-50" aria-hidden />
              <p className="eyebrow">Made in small, lovely batches</p>
              <h2 className="display-title mt-4 max-w-[14ch] text-[44px] sm:text-[56px] lg:text-[62px]">
                Cakes, handcrafted
                <br />
                with <em>feeling.</em>
              </h2>
              <p className="prose-measure mt-5 max-w-[42ch] text-[15px] leading-7 text-[oklch(0.4_0.035_35)]">
                From a citrusy birthday layer cake to a wedding centerpiece covered in garden blooms, every detail is shaped around the people at your table. Softly styled, naturally seasonal.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-[12.5px] font-bold text-[oklch(0.38_0.04_35)]"><span className="h-1.5 w-1.5 rounded-full bg-[var(--terra)]" /> Baked from scratch</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-[12.5px] font-bold text-[oklch(0.38_0.04_35)]"><span className="h-1.5 w-1.5 rounded-full bg-[var(--sage-deep)]" /> Seasonal flowers</span>
              </div>
              <Link href="/about" className="mt-9 inline-flex items-center gap-2 text-[14px] font-extrabold text-[oklch(0.45_0.08_20)] underline decoration-[oklch(0.45_0.08_20/0.35)] decoration-2 underline-offset-[6px] transition-colors hover:text-[var(--terra-deep)] hover:decoration-[var(--terra-deep)]">
                Meet the baker <ArrowRight size={15} strokeWidth={2.2} />
              </Link>
            </div>
            <div className="group relative">
              <div className="visual-tile aspect-[1.02] sm:aspect-[1.08]">
                <img src={withBase("/images/photo-1602351447937-745cb720612f.jpg")} alt="A simply frosted cake on a plate, styled with linen" loading="lazy" />
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 rounded-2xl bg-[var(--paper)]/95 px-4 py-3 shadow-[0_10px_30px_oklch(0.305_0.033_42/0.12)] sm:bottom-5 sm:left-5 sm:right-5">
                <span className="text-[12.5px] font-bold leading-4 text-[var(--ink)]">Petite vanilla <span className="font-medium text-[var(--ink-mute)]">· serves 6–8</span></span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => addItem({ id: "menu-petite", title: "Petite cake", detail: "Serves 6–8 · seasonal", price: 54, priceLabel: "from $54", image: withBase("/images/photo-1602351447937-745cb720612f.jpg"), quantity: 1 })}
                    className="grid h-9 w-9 place-items-center rounded-full bg-[var(--cream)] text-[var(--ink-soft)] transition-colors hover:bg-[var(--blush)] hover:text-[var(--terra)]"
                    aria-label="Add petite cake to bag"
                  >
                    <ShoppingBag size={15} />
                  </button>
                  <button
                    onClick={() => toggle("home-petite", "Petite vanilla")}
                    aria-label="Save"
                    className={`grid h-9 w-9 place-items-center rounded-full transition-colors ${isFavorite("home-petite") ? "bg-[var(--terra)] text-white" : "bg-[var(--cream)] text-[var(--ink-soft)] hover:bg-[var(--blush)] hover:text-[var(--terra)]"}`}
                  >
                    <Heart size={15} className={isFavorite("home-petite") ? "fill-white" : ""} />
                  </button>
                  <span className="hidden rounded-full bg-[var(--blush)] px-3 py-1.5 text-[12px] font-extrabold text-[oklch(0.45_0.08_20)] sm:block">From $54</span>
                </div>
              </div>
            </div>
          </div>

          {/* mosaic — staggered, warm, no kicker chips */}
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {[
              { href: "/menu", img: "/images/photo-1535254973040-607b474cb50d.jpg", alt: "Single tier celebration cake", title: "Shop the menu", note: "from $34", aspect: "aspect-[1.05]" },
              { href: "/about", img: "/images/photo-1556910103-1c02745aae4d.jpg", alt: "Baker preparing a cake, hands dusted with flour", title: "From the studio", note: "meet Maya", aspect: "aspect-[0.92] sm:aspect-[1.2]" },
              { href: "/custom-order", img: "/images/photo-1559620192-032c4bc4674e.jpg", alt: "Pink buttercream cake with soft swirls", title: "Custom order", note: "live quote", aspect: "aspect-[1.05]" },
            ].map((tile) => (
              <Link key={tile.href} href={tile.href} className="group relative overflow-hidden rounded-[1.4rem]">
                <div className={`visual-tile !rounded-[1.4rem] ${tile.aspect}`}>
                  <img className="h-full w-full object-cover" src={withBase(tile.img)} alt={tile.alt} loading="lazy" />
                </div>
                <div className="absolute inset-0 flex items-end justify-between gap-3 bg-gradient-to-t from-[oklch(0.3_0.03_42/0.55)] via-[oklch(0.3_0.03_42/0.12)] to-transparent p-5">
                  <div>
                    <p className="font-display text-[22px] font-semibold leading-none text-white">{tile.title}</p>
                    <p className="mt-1.5 text-[12.5px] font-semibold text-white/80">{tile.note}</p>
                  </div>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors group-hover:bg-[var(--terra)]">
                    <ArrowUpRight size={17} />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* FINISH COMPARISON SLIDER */}
          <div className="mt-12" data-reveal="up">
            <FinishComparisonSlider />
          </div>
        </section>

        {/* INTERACTIVE CAKE FINDER QUIZ */}
        <section className="container py-4 sm:py-8" data-reveal="up">
          <CakeFinderQuiz />
        </section>

        {/* ORDER STUDIO PREVIEW */}
        <section className="container py-14 sm:py-20" data-reveal="fade">
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start lg:gap-14">
            <div className="lg:sticky lg:top-[110px]">
              <p className="eyebrow">Less back-and-forth, more buttercream</p>
              <h2 className="display-title mt-4 text-[48px] sm:text-[60px] lg:text-[66px]">
                Meet the
                <br />
                <em>order studio.</em>
              </h2>
              <p className="prose-measure mt-5 max-w-[36ch] text-[15px] leading-7 text-[var(--ink-soft)]">
                Pick your cake, see the price change as you go, and choose a date that actually works. Clear from first crumb to final pickup. No mystery messages.
              </p>
              <Link href="/custom-order" className="button-rose mt-8">Try the live quote <ArrowUpRight size={16} strokeWidth={2.2} /></Link>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-[var(--paper)] px-4 py-2 text-[12.5px] font-bold text-[var(--ink-soft)]"><CalendarDays size={14} className="text-[var(--terra)]" /> Real availability</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-[var(--paper)] px-4 py-2 text-[12.5px] font-bold text-[var(--ink-soft)]"><Clock3 size={14} className="text-[var(--terra)]" /> Rush when possible</span>
              </div>
              <div className="mt-8">
                <LiveAvailabilityChecker />
              </div>
            </div>

            <div className="relative rounded-[1.75rem] bg-[var(--paper)] p-5 shadow-[0_24px_70px_oklch(0.305_0.033_42/0.08)] sm:p-8">
              <div className="flex items-start justify-between gap-4 pb-6">
                <div>
                  <p className="eyebrow">Custom cake · live estimate</p>
                  <p className="mt-2 font-display text-[26px] font-semibold leading-tight tracking-[-0.01em] sm:text-[28px]">Your celebration, taking shape</p>
                  <p className="mt-1.5 text-[13px] leading-5 text-[var(--ink-mute)]">Four considered steps, priced as you go.</p>
                </div>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[var(--butter-soft)] text-[var(--butter-deep)]" aria-hidden><CalendarDays size={19} strokeWidth={2} /></span>
              </div>

              <SprigDivider className="mx-auto mt-2 h-6 w-52 text-[var(--sage-deep)]" />

              <ol className="mt-6 space-y-0">
                {[
                  { n: "01", title: "Choose the details", desc: "Flavor, filling, finish, and servings — each choice updates the total.", meta: "From $84" },
                  { n: "02", title: "Find your date", desc: "Only open kitchen days appear. Up to 3 custom cakes per day.", meta: "5-day lead" },
                  { n: "03", title: "See the quote", desc: "A clear, live itemized total with deposit and balance.", meta: "No surprises" },
                  { n: "04", title: "Reserve your spot", desc: "Your 50% deposit holds the date; balance reminder handled.", meta: "Deposit 50%" },
                ].map((step, i) => (
                  <li key={step.n} className={`relative flex gap-4 py-4 ${i !== 3 ? "border-b border-[oklch(0.92_0.016_68)]" : ""}`}>
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--blush)] text-[12px] font-extrabold text-[oklch(0.45_0.08_20)] sm:mt-0.5">{step.n}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="text-[15px] font-bold leading-5 text-[var(--ink)]">{step.title}</p>
                        <span className="text-[11.5px] font-extrabold text-[var(--terra)]">{step.meta}</span>
                      </div>
                      <p className="mt-1 max-w-[48ch] text-[13.5px] leading-5 text-[var(--ink-mute)]">{step.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-2 text-[13px] font-semibold text-[var(--ink-soft)]">
                <span className="inline-flex items-center gap-2"><Check size={15} className="text-[var(--sage-deep)]" strokeWidth={2.4} /> Smart availability calendar</span>
                <span className="inline-flex items-center gap-2"><Check size={15} className="text-[var(--sage-deep)]" strokeWidth={2.4} /> Rush option if possible</span>
              </div>
            </div>
          </div>
        </section>

        {/* SLICE JOURNAL CAROUSEL */}
        <section className="container py-6 sm:py-10" data-reveal="up">
          <SliceJournalCarousel />
        </section>

        {/* COLLECTION */}
        <section className="container py-14 sm:py-20" data-reveal="up">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">A few from the cake table</p>
              <h2 className="display-title mt-3 text-[46px] sm:text-[58px]">The collection</h2>
              <p className="mt-2 max-w-[44ch] text-[14px] leading-6 text-[var(--ink-mute)]">Six recent tables — weddings, birthdays, little cakes and cookies. Save what you love, then see it in the gallery.</p>
            </div>
            <Link href="/gallery" className="button-ink self-start sm:self-auto">See every sweet thing <ArrowRight size={15} strokeWidth={2.1} /></Link>
          </div>

          <div className="mt-9 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6" data-stagger>
            {galleryItems.map((item, idx) => {
              const fav = isFavorite(`gallery-${item.id}`);
              return (
                <div
                  key={item.id}
                  className={`group relative overflow-hidden rounded-[1.3rem] ${idx === 0 ? "md:row-span-2" : ""}`}
                >
                  <Link href="/gallery" className={`visual-tile block !rounded-[1.3rem] ${idx === 0 ? "aspect-[0.78] md:aspect-[0.74]" : "aspect-[0.9]"}`}>
                    <img src={item.image} alt={item.alt} loading="lazy" decoding="async" />
                  </Link>
                  <div className="pointer-events-none absolute inset-0 top-auto translate-y-1 rounded-[1.3rem] bg-gradient-to-t from-[oklch(0.3_0.03_42/0.55)] to-transparent p-3 pt-8 opacity-0 transition-[transform,opacity] duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="truncate font-display text-[14px] font-semibold text-white">{item.title}</p>
                    <p className="mt-0.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-white/75">{item.category}</p>
                  </div>
                  <div className="absolute right-2 top-2 flex gap-1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <button
                      onClick={() => toggle(`gallery-${item.id}`, item.title)}
                      aria-label="Save"
                      className={`grid h-8 w-8 place-items-center rounded-full transition-colors ${fav ? "bg-[var(--terra)] text-white" : "bg-white/90 text-[var(--ink-soft)] hover:bg-white hover:text-[var(--terra)]"}`}
                    >
                      <Heart size={13} className={fav ? "fill-white" : ""} />
                    </button>
                    <Link href="/gallery" aria-label="View" className="hidden h-8 w-8 place-items-center rounded-full bg-white/90 text-[var(--ink-soft)] hover:bg-white hover:text-[var(--ink)] sm:grid">
                      <Eye size={13} />
                    </Link>
                  </div>
                  {fav && (
                    <span className="absolute left-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-[var(--terra)] text-white sm:hidden" aria-hidden>
                      <Heart size={12} className="fill-white" />
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* CLOSING — drenched blush, botanicals, script */}
        <section className="container pb-16 sm:pb-24" data-reveal="up">
          <div className="paper-texture relative overflow-hidden rounded-[2.5rem] bg-[var(--blush)] px-6 py-16 text-center sm:px-10 sm:py-24">
            <ButterBlob className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 text-[var(--butter)] opacity-80" aria-hidden />
            <LeafSprig className="drift pointer-events-none absolute -right-6 bottom-0 h-36 w-36 rotate-[150deg] text-[var(--sage-deep)] opacity-40" aria-hidden />
            <HeartDoodle className="pointer-events-none absolute right-[14%] top-10 hidden h-12 w-12 rotate-12 text-[var(--terra)] opacity-50 lg:block" aria-hidden />
            <div className="relative mx-auto max-w-3xl">
              <div className="mx-auto flex justify-center">
                <BakeryMark size="lg" />
              </div>
              <p className="eyebrow mt-6 justify-center">The next thing to celebrate</p>
              <h2 className="display-title mx-auto mt-4 max-w-[13ch] text-[50px] sm:text-[66px] lg:text-[76px]">
                Let’s make it <em>delicious.</em>
              </h2>
              <p className="prose-measure mx-auto mt-5 max-w-[42ch] text-[15px] leading-7 text-[oklch(0.4_0.035_35)]">
                Build a first quote in a few considered steps. We’ll take care of the beautiful details together — flavor, finish, and a date that actually works.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/custom-order" className="button-rose">Start a custom order <ArrowUpRight size={16} strokeWidth={2.2} /></Link>
                <Link href="/contact" className="button-ink border-[oklch(0.305_0.033_42/0.5)] bg-white/40">Ask a question</Link>
              </div>
              <p className="mt-7 inline-flex flex-wrap items-center justify-center gap-2 text-[12.5px] font-bold text-[oklch(0.42_0.05_30)]">
                <Check size={15} strokeWidth={2.4} className="text-[var(--terra)]" /> Free to explore · no payment yet
                <span className="mx-1 h-3 w-px bg-[oklch(0.45_0.08_20/0.3)]" aria-hidden />
                Portland pickup + delivery
              </p>
              <p className="mt-4"><ScriptNote className="rotate-[-2deg] text-[oklch(0.45_0.08_20)]">see you at the table</ScriptNote></p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
