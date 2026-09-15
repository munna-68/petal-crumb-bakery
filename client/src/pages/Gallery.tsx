/** Quiet Patisserie Editorial: filterable work gallery — now with lightbox, favorites, and share for portfolio. */
import { useState, useMemo } from "react";
import { Link } from "wouter";
import { ArrowUpRight, Image as ImageIcon, Sparkles, Heart, Share2, X, ChevronLeft, ChevronRight, ShoppingBag, Eye } from "lucide-react";
import { toast } from "sonner";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { galleryItems } from "@/lib/bakeryData";
import { useFavorites } from "@/contexts/FavoritesContext";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const filters = ["All", "Weddings", "Birthdays", "Little Cakes", "Cookies"] as const;
type Filter = (typeof filters)[number];

const details: Record<number, { flavor: string; story: string; palette: string }> = {
  1: { flavor: "Vanilla bean, raspberry preserve, textured buttercream", story: "A summer wedding for 40, garden roses and late peonies — soft ivory with blush blooms.", palette: "Ivory · blush · garden green" },
  2: { flavor: "Pistachio, lemon olive oil, mascarpone cream", story: "A petit six-inch, baked for a very small, very loved birthday table.", palette: "Pistachio · cream · linen" },
  3: { flavor: "Strawberry milk, vanilla bean, cloud frosting", story: "Blush swirls, piped rosettes, and a lot of tiny pearls — joy on a tier.", palette: "Blush · pearl · vanilla" },
  4: { flavor: "Lemon, elderflower, honey buttercream", story: "Citrus layers with a whisper of elderflower, finished with fresh-picked lemon verbena.", palette: "Lemon · cream · sage" },
  5: { flavor: "Vanilla, almond, fresh wildflowers", story: "Two-tier vows, decorated the morning of — wildflowers from the market at 7am.", palette: "Wildflower · ivory · fern" },
  6: { flavor: "Brown butter shortbread, vanilla salt", story: "Crisp edges, tender centers, hand-stamped and iced to match the invitation suite.", palette: "Butter · vanilla · linen" },
};

export default function Gallery() {
  const [filter, setFilter] = useState<Filter>("All");
  const [active, setActive] = useState<number | null>(null);
  const { toggle, isFavorite } = useFavorites();

  const visible = useMemo(
    () => (filter === "All" ? galleryItems : galleryItems.filter((item) => item.category === filter)),
    [filter]
  );

  const activeItem = active !== null ? galleryItems.find((g) => g.id === active) ?? null : null;
  const activeIndex = active !== null ? visible.findIndex((v) => v.id === active) : -1;

  const handleShare = async (item: (typeof galleryItems)[number]) => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) await navigator.share({ title: item.title, text: item.alt, url });
      else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied", { description: item.title });
      }
    } catch {
      toast("Share cancelled");
    }
  };

  const step = (dir: 1 | -1) => {
    if (activeIndex === -1) return;
    const next = visible[(activeIndex + dir + visible.length) % visible.length];
    if (next) setActive(next.id);
  };

  return (
    <div className="min-h-screen bg-[oklch(0.982_0.008_75)] text-[var(--ink)]">
      <SiteHeader />
      <main id="main">
        <section className="container pb-6 pt-10 sm:pb-8 sm:pt-14" data-reveal="fade">
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
            Every cake begins with a shared idea and ends somewhere softer, stranger, and more delicious. Six recent tables — tap any image to see the flavor, save it, or share it.
          </p>
        </section>

        <section className="container pb-14 sm:pb-20" data-reveal="up">
          <div className="flex flex-wrap items-center gap-2 border-y border-[oklch(0.88_0.018_52)] bg-white/60 py-3 backdrop-blur-sm sm:gap-1.5 sm:py-3.5" role="tablist" aria-label="Gallery filters">
            {filters.map((item) => {
              const activeTab = filter === item;
              const count = item === "All" ? galleryItems.length : galleryItems.filter((g) => g.category === item).length;
              return (
                <button
                  key={item}
                  type="button"
                  role="tab"
                  aria-selected={activeTab}
                  onClick={() => setFilter(item)}
                  className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[var(--rosewood)] focus-visible:ring-offset-2 ${
                    activeTab
                      ? "border-[var(--rosewood)] bg-[var(--rosewood)] text-white shadow-[0_4px_14px_oklch(0.49_0.09_18/0.2)]"
                      : "border-[oklch(0.86_0.02_52)] bg-white text-[oklch(0.42_0.02_35)] hover:border-[oklch(0.72_0.03_18)] hover:bg-[oklch(0.94_0.03_13)] hover:text-[var(--ink)]"
                  }`}
                >
                  {item}
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none tabular-nums ${activeTab ? "bg-white/20 text-white" : "bg-[oklch(0.96_0.008_72)] text-[oklch(0.52_0.02_35)]"}`}
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

          <div className="stagger mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" data-stagger>
            {visible.map((item, index) => {
              const fav = isFavorite(`gallery-${item.id}`);
              return (
                <article
                  key={`${item.id}-${item.title}`}
                  className={`group relative overflow-hidden border border-[oklch(0.88_0.018_52)] bg-[oklch(0.96_0.008_72)] p-1.5 ${index % 5 === 0 ? "sm:row-span-2" : ""}`}
                >
                  <button
                    onClick={() => setActive(item.id)}
                    className={`${index % 5 === 0 ? "aspect-[0.78] sm:aspect-[0.74]" : "aspect-[1.08]"} visual-tile block w-full text-left`}
                    aria-label={`Open ${item.title} lightbox`}
                  >
                    <img src={item.image} alt={item.alt} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                  </button>
                  {/* quick actions */}
                  <div className="absolute right-2 top-2 flex gap-1.5">
                    <button
                      onClick={() => toggle(`gallery-${item.id}`, item.title)}
                      aria-label={fav ? "Remove favorite" : "Save favorite"}
                      className={`grid h-8 w-8 place-items-center rounded-full border backdrop-blur-md transition-colors ${fav ? "border-[var(--rosewood)] bg-[var(--rosewood)] text-white" : "border-white/60 bg-white/80 text-[oklch(0.34_0.02_35)] hover:bg-white hover:text-[var(--rosewood)]"}`}
                    >
                      <Heart size={13} strokeWidth={1.9} className={fav ? "fill-white" : ""} />
                    </button>
                    <button
                      onClick={() => handleShare(item)}
                      aria-label="Share"
                      className="hidden h-8 w-8 place-items-center rounded-full border border-white/60 bg-white/80 text-[oklch(0.34_0.02_35)] backdrop-blur-md hover:bg-white hover:text-[var(--ink)] sm:grid"
                    >
                      <Share2 size={13} strokeWidth={1.8} />
                    </button>
                  </div>
                  {/* caption — slide up */}
                  <button
                    onClick={() => setActive(item.id)}
                    className="absolute inset-x-1.5 bottom-1.5 flex translate-y-[2px] items-center justify-between gap-3 bg-[oklch(0.995_0.004_80/0.94)] px-3 py-2.5 text-left opacity-0 backdrop-blur-[8px] transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-display text-[15px] font-medium leading-none">{item.title}</p>
                      <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.11em] text-[oklch(0.58_0.03_18)]">{item.category} · tap to enlarge</p>
                    </div>
                    <span className="hidden h-7 w-7 shrink-0 place-items-center rounded-full border border-[oklch(0.86_0.02_52)] bg-white text-[oklch(0.42_0.02_35)] group-hover:text-[var(--rosewood)] sm:grid">
                      <Eye size={13} strokeWidth={1.9} />
                    </span>
                  </button>
                  <span className="pointer-events-none absolute left-3 top-3 border border-black/10 bg-white/85 px-2 py-1 text-[8px] font-bold uppercase tracking-[0.12em] text-[oklch(0.34_0.02_35)] backdrop-blur-md">
                    0{index + 1} · {item.category}
                  </span>
                </article>
              );
            })}
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
              <Sparkles size={12} className="text-[var(--rosewood)]" /> Photographed in natural light · tap any tile to enlarge
            </span>
            <span>Styled with seasonal blooms · Portland, Oregon</span>
          </div>
        </section>

        {/* Lightbox */}
        <Dialog open={!!activeItem} onOpenChange={(o) => !o && setActive(null)}>
          <DialogContent className="max-h-[92dvh] max-w-[980px] overflow-hidden border-[oklch(0.88_0.018_52)] bg-[oklch(0.982_0.008_75)] p-0 sm:rounded-none">
            {activeItem && (
              <div className="grid max-h-[92dvh] overflow-auto lg:grid-cols-[1.35fr_.85fr]">
                <div className="relative bg-[oklch(0.96_0.008_72)]">
                  <div className="aspect-[0.98] sm:aspect-[1.05] lg:aspect-[0.92]">
                    <img src={activeItem.image} alt={activeItem.alt} className="h-full w-full object-cover" />
                  </div>
                  {/* nav */}
                  <div className="absolute inset-x-3 top-1/2 flex -translate-y-1/2 justify-between">
                    <button onClick={() => step(-1)} aria-label="Previous" className="grid h-9 w-9 place-items-center rounded-full border border-white/60 bg-white/85 text-[oklch(0.28_0.02_35)] backdrop-blur-md hover:bg-white">
                      <ChevronLeft size={18} />
                    </button>
                    <button onClick={() => step(1)} aria-label="Next" className="grid h-9 w-9 place-items-center rounded-full border border-white/60 bg-white/85 text-[oklch(0.28_0.02_35)] backdrop-blur-md hover:bg-white">
                      <ChevronRight size={18} />
                    </button>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 flex items-center justify-between gap-3 bg-gradient-to-t from-[oklch(0.25_0.018_35/0.45)] to-transparent p-4 text-white">
                    <span className="border border-white/30 bg-white/12 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] backdrop-blur-md">
                      {activeItem.category} · {visible.findIndex((v) => v.id === activeItem.id) + 1} / {visible.length}
                    </span>
                    <span className="hidden text-[11px] tracking-wide text-white/85 sm:inline">Use arrows to browse</span>
                  </div>
                </div>
                <div className="flex flex-col p-6 sm:p-7">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="eyebrow">{activeItem.category}</p>
                      <h2 className="mt-2 font-display text-[30px] font-medium leading-none tracking-[-0.02em] sm:text-[36px]">{activeItem.title}</h2>
                      <p className="mt-2 text-[13px] leading-5 text-[oklch(0.46_0.02_35)]">{details[activeItem.id]?.story}</p>
                    </div>
                    <button
                      onClick={() => setActive(null)}
                      aria-label="Close"
                      className="hidden h-8 w-8 place-items-center rounded-full border border-[oklch(0.86_0.02_52)] bg-white text-[oklch(0.42_0.02_35)] hover:border-[var(--ink)] hover:text-[var(--ink)] lg:grid"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <div className="mt-6 space-y-3 border-y border-[oklch(0.91_0.015_52)] py-4 text-[13px] leading-5">
                    <p className="flex gap-2">
                      <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.1em] text-[oklch(0.52_0.02_35)]">Flavor</span>
                      <span className="text-[oklch(0.34_0.02_35)]">{details[activeItem.id]?.flavor}</span>
                    </p>
                    <p className="flex gap-2">
                      <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.1em] text-[oklch(0.52_0.02_35)]">Palette</span>
                      <span className="text-[oklch(0.34_0.02_35)]">{details[activeItem.id]?.palette}</span>
                    </p>
                  </div>

                  <div className="mt-5 flex gap-2">
                    <button
                      onClick={() => toggle(`gallery-${activeItem.id}`, activeItem.title)}
                      className={`flex-1 inline-flex items-center justify-center gap-1.5 border px-3 py-3 text-[10px] font-bold uppercase tracking-[0.12em] transition-colors ${isFavorite(`gallery-${activeItem.id}`) ? "border-[var(--rosewood)] bg-[var(--rosewood)] text-white" : "border-[oklch(0.86_0.02_52)] bg-white text-[oklch(0.34_0.02_35)] hover:border-[var(--ink)] hover:text-[var(--ink)]"}`}
                    >
                      <Heart size={14} className={isFavorite(`gallery-${activeItem.id}`) ? "fill-white" : ""} /> {isFavorite(`gallery-${activeItem.id}`) ? "Saved" : "Save to wishlist"}
                    </button>
                    <button onClick={() => handleShare(activeItem)} className="grid h-[42px] w-[42px] place-items-center border border-[oklch(0.86_0.02_52)] bg-white text-[oklch(0.42_0.02_35)] hover:border-[var(--ink)] hover:text-[var(--ink)]">
                      <Share2 size={16} />
                    </button>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <Link href="/custom-order" onClick={() => setActive(null)} className="button-rose justify-center py-3 text-[10px]">
                      Recreate this <ArrowUpRight size={13} />
                    </Link>
                    <Link href="/contact" onClick={() => setActive(null)} className="button-ink justify-center py-3">
                      Ask about it
                    </Link>
                  </div>

                  <p className="mt-4 text-center text-[11px] leading-4 text-[oklch(0.58_0.03_18)]">Portfolio lightbox · images are demo editorial photography</p>

                  <div className="mt-6 flex items-center justify-between border-t border-[oklch(0.91_0.015_52)] pt-4 text-[11px]">
                    <button onClick={() => step(-1)} className="inline-flex items-center gap-1.5 text-[oklch(0.52_0.02_35)] hover:text-[var(--ink)]"><ChevronLeft size={14} /> Previous</button>
                    <button onClick={() => step(1)} className="inline-flex items-center gap-1.5 text-[oklch(0.52_0.02_35)] hover:text-[var(--ink)]">Next <ChevronRight size={14} /></button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

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
