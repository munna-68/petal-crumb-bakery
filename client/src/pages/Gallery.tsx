/** Garden Bakery: filterable gallery — rounded tiles, pill filters, warm lightbox. All interactions preserved. */
import { useState, useMemo } from "react";
import { Link } from "wouter";
import { ArrowUpRight, Image as ImageIcon, Heart, Share2, X, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { toast } from "sonner";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { galleryItems } from "@/lib/bakeryData";
import { useFavorites } from "@/contexts/FavoritesContext";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScriptNote, ButterBlob, LeafSprig } from "@/components/decor";

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
    <div className="min-h-screen bg-[var(--cream)] text-[var(--ink)]">
      <SiteHeader />
      <main id="main">
        <section className="container relative pb-8 pt-12 sm:pb-10 sm:pt-16" data-reveal="fade">
          <div className="pointer-events-none absolute -right-14 top-4 hidden h-40 w-40 lg:block" aria-hidden>
            <ButterBlob className="drift-slow h-full w-full text-[var(--butter)]" />
          </div>
          <div className="pointer-events-none absolute left-[38%] top-28 hidden lg:block" aria-hidden>
            <LeafSprig className="drift h-20 w-20 -rotate-[30deg] text-[var(--sage-deep)] opacity-45" />
          </div>
          <p className="eyebrow">A few favorite tables</p>
          <h1 className="display-title mt-4 max-w-[12ch] text-[50px] leading-[0.98] sm:text-[70px] lg:text-[86px]">
            The cake
            <br />
            <em>collection.</em>
          </h1>
          <p className="prose-measure mt-5 max-w-[46ch] text-[15px] leading-7 text-[var(--ink-soft)]">
            Every cake begins with a shared idea and ends somewhere softer, stranger, and more delicious. Six recent tables — tap any image to see the flavor, save it, or share it.
          </p>
        </section>

        <section className="container pb-16 sm:pb-22" data-reveal="up">
          <div className="flex flex-wrap items-center gap-2 pb-3" role="tablist" aria-label="Gallery filters">
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
                  className={`inline-flex min-h-[42px] items-center gap-2 rounded-full px-5 text-[13.5px] font-extrabold transition-all focus-visible:ring-2 focus-visible:ring-[var(--terra)] focus-visible:ring-offset-2 ${
                    activeTab
                      ? "bg-[var(--terra)] text-white shadow-[0_6px_16px_oklch(0.615_0.115_27/0.28)]"
                      : "bg-[var(--paper)] text-[var(--ink-soft)] hover:bg-[var(--blush)] hover:text-[var(--terra)]"
                  }`}
                >
                  {item}
                  <span className={`rounded-full px-1.5 py-0.5 text-[10.5px] font-extrabold leading-none tabular-nums ${activeTab ? "bg-white/25 text-white" : "bg-[var(--cream)] text-[var(--ink-mute)]"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
            <span className="ml-auto hidden items-center gap-1.5 text-[12px] font-semibold text-[var(--ink-mute)] sm:inline-flex">
              <ImageIcon size={14} className="text-[var(--terra)]" /> {visible.length} {visible.length === 1 ? "cake" : "cakes"}
            </span>
          </div>
          <div className="hairline" />

          <div className="mt-8 grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3" data-stagger>
            {visible.map((item, index) => {
              const fav = isFavorite(`gallery-${item.id}`);
              return (
                <article
                  key={`${item.id}-${item.title}`}
                  className="group relative overflow-hidden rounded-[1.4rem]"
                >
                  <button
                    onClick={() => setActive(item.id)}
                    className={`${index % 3 === 0 ? "aspect-[0.92]" : "aspect-[1.08]"} visual-tile block w-full text-left`}
                    aria-label={`Open ${item.title} lightbox`}
                  >
                    <img src={item.image} alt={item.alt} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                  </button>
                  <div className="absolute right-3 top-3 flex gap-1.5 sm:opacity-0 sm:transition-opacity sm:duration-300 sm:group-hover:opacity-100">
                    <button
                      onClick={() => toggle(`gallery-${item.id}`, item.title)}
                      aria-label={fav ? "Remove favorite" : "Save favorite"}
                      className={`grid h-9 w-9 place-items-center rounded-full transition-colors ${fav ? "bg-[var(--terra)] text-white" : "bg-white/90 text-[var(--ink-soft)] hover:bg-white hover:text-[var(--terra)]"}`}
                    >
                      <Heart size={14} strokeWidth={2} className={fav ? "fill-white" : ""} />
                    </button>
                    <button
                      onClick={() => handleShare(item)}
                      aria-label="Share"
                      className="hidden h-9 w-9 place-items-center rounded-full bg-white/90 text-[var(--ink-soft)] hover:bg-white hover:text-[var(--ink)] sm:grid"
                    >
                      <Share2 size={14} strokeWidth={2} />
                    </button>
                  </div>
                  <div className="pointer-events-none absolute inset-0 top-auto bg-gradient-to-t from-[oklch(0.3_0.03_42/0.55)] to-transparent p-4 pt-12 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <p className="truncate font-display text-[17px] font-semibold text-white">{item.title}</p>
                    <p className="mt-0.5 text-[10.5px] font-extrabold uppercase tracking-[0.12em] text-white/75">{item.category} · tap to enlarge</p>
                  </div>
                  <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[10.5px] font-extrabold uppercase tracking-[0.1em] text-[var(--ink)] transition-opacity group-hover:opacity-0">
                    0{index + 1} · {item.category}
                  </span>
                </article>
              );
            })}
          </div>

          {visible.length === 0 && (
            <div className="mt-8 rounded-[1.5rem] border-[1.5px] border-dashed border-[oklch(0.85_0.035_58)] bg-[var(--paper)] p-12 text-center">
              <p className="font-display text-2xl font-semibold">Nothing here yet.</p>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[var(--ink-mute)]">Try another filter — we add new tables each season.</p>
              <button onClick={() => setFilter("All")} className="button-ink mt-5 px-5 py-3 text-[13px]">
                Show all
              </button>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 text-[12px] font-semibold text-[var(--ink-mute)]">
            <span className="inline-flex items-center gap-2">
              <LeafSprig className="h-5 w-5 text-[var(--sage-deep)]" aria-hidden /> Photographed in natural light · tap any tile to enlarge
            </span>
            <span>Styled with seasonal blooms · Portland, Oregon</span>
          </div>
        </section>

        {/* Lightbox */}
        <Dialog open={!!activeItem} onOpenChange={(o) => !o && setActive(null)}>
          <DialogContent className="max-h-[92dvh] max-w-[1000px] overflow-hidden rounded-[1.75rem] border-[oklch(0.885_0.028_60)] bg-[var(--cream)] p-0">
            {activeItem && (
              <div className="grid max-h-[92dvh] overflow-auto lg:grid-cols-[1.35fr_.85fr]">
                <div className="relative bg-[var(--blush)]/50">
                  <div className="aspect-[0.98] sm:aspect-[1.05] lg:aspect-[0.92]">
                    <img src={activeItem.image} alt={activeItem.alt} className="h-full w-full object-cover" />
                  </div>
                  <div className="absolute inset-x-4 top-1/2 flex -translate-y-1/2 justify-between">
                    <button onClick={() => step(-1)} aria-label="Previous" className="grid h-10 w-10 place-items-center rounded-full bg-white/90 text-[var(--ink)] shadow-[0_6px_18px_oklch(0.3_0.03_42/0.2)] backdrop-blur-sm hover:bg-white">
                      <ChevronLeft size={19} />
                    </button>
                    <button onClick={() => step(1)} aria-label="Next" className="grid h-10 w-10 place-items-center rounded-full bg-white/90 text-[var(--ink)] shadow-[0_6px_18px_oklch(0.3_0.03_42/0.2)] backdrop-blur-sm hover:bg-white">
                      <ChevronRight size={19} />
                    </button>
                  </div>
                  <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3.5 py-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.1em] text-[var(--ink)] backdrop-blur-sm">
                    {activeItem.category} · {visible.findIndex((v) => v.id === activeItem.id) + 1} / {visible.length}
                  </span>
                </div>
                <div className="flex flex-col p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="eyebrow">{activeItem.category}</p>
                      <h2 className="mt-2 font-display text-[30px] font-semibold leading-none tracking-[-0.015em] sm:text-[36px]">{activeItem.title}</h2>
                      <p className="mt-2.5 text-[13.5px] leading-6 text-[var(--ink-soft)]">{details[activeItem.id]?.story}</p>
                    </div>
                    <button
                      onClick={() => setActive(null)}
                      aria-label="Close"
                      className="hidden h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--paper)] text-[var(--ink-soft)] hover:text-[var(--ink)] lg:grid"
                    >
                      <X size={15} />
                    </button>
                  </div>

                  <div className="mt-6 space-y-3 border-y border-[oklch(0.9_0.022_65)] py-4 text-[13.5px] leading-5">
                    <p className="flex gap-3">
                      <span className="shrink-0 text-[10.5px] font-extrabold uppercase tracking-[0.12em] leading-5 text-[var(--ink-mute)]">Flavor</span>
                      <span className="font-bold text-[var(--ink)]">{details[activeItem.id]?.flavor}</span>
                    </p>
                    <p className="flex gap-3">
                      <span className="shrink-0 text-[10.5px] font-extrabold uppercase tracking-[0.12em] leading-5 text-[var(--ink-mute)]">Palette</span>
                      <span className="font-bold text-[var(--ink)]">{details[activeItem.id]?.palette}</span>
                    </p>
                  </div>

                  <div className="mt-5 flex gap-2">
                    <button
                      onClick={() => toggle(`gallery-${activeItem.id}`, activeItem.title)}
                      className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-full border-[1.5px] px-3 py-3 text-[13px] font-bold transition-colors ${
                        isFavorite(`gallery-${activeItem.id}`)
                          ? "border-[var(--terra)] bg-[var(--terra)] text-white"
                          : "border-[oklch(0.305_0.033_42/0.4)] bg-transparent text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--paper)]"
                      }`}
                    >
                      <Heart size={15} className={isFavorite(`gallery-${activeItem.id}`) ? "fill-white" : ""} /> {isFavorite(`gallery-${activeItem.id}`) ? "Saved" : "Save to wishlist"}
                    </button>
                    <button onClick={() => handleShare(activeItem)} className="grid h-[46px] w-[46px] shrink-0 place-items-center rounded-full border-[1.5px] border-[oklch(0.88_0.03_60)] bg-[var(--paper)] text-[var(--ink-soft)] hover:border-[var(--ink)] hover:text-[var(--ink)]" aria-label="Share">
                      <Share2 size={16} />
                    </button>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <Link href="/custom-order" onClick={() => setActive(null)} className="button-rose justify-center py-3 text-[13px]">
                      Recreate this <ArrowUpRight size={14} />
                    </Link>
                    <Link href="/contact" onClick={() => setActive(null)} className="button-ink justify-center py-3 text-[13px]">
                      Ask about it
                    </Link>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-6 text-[12.5px] font-bold text-[var(--ink-mute)]">
                    <button onClick={() => step(-1)} className="inline-flex items-center gap-1.5 hover:text-[var(--terra)]"><ChevronLeft size={15} /> Previous</button>
                    <button onClick={() => step(1)} className="inline-flex items-center gap-1.5 hover:text-[var(--terra)]">Next <ChevronRight size={15} /></button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* closing */}
        <section className="container pb-18 sm:pb-24">
          <div className="paper-texture relative overflow-hidden rounded-[2.25rem] bg-[var(--blush)] px-6 py-14 text-center sm:py-18">
            <ButterBlob className="pointer-events-none absolute -left-12 -bottom-14 h-44 w-44 text-[var(--butter)] opacity-80" aria-hidden />
            <div className="relative mx-auto max-w-2xl">
              <p className="eyebrow justify-center">Your celebration belongs here</p>
              <h2 className="display-title mx-auto mt-3 max-w-[12ch] text-[44px] leading-[1] sm:text-[60px]">Dream it up.</h2>
              <p className="prose-measure mx-auto mt-3 max-w-[40ch] text-[15px] leading-7 text-[oklch(0.4_0.035_35)]">Tell us a little about the gathering — we’ll shape the rest around it.</p>
              <Link href="/custom-order" className="button-rose mt-7">
                Start your cake <ArrowUpRight size={15} strokeWidth={2.2} />
              </Link>
              <p className="mt-5"><ScriptNote className="text-[oklch(0.45_0.08_20)]">we’ll bring the flowers</ScriptNote></p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
