/** Garden Bakery: seasonal menu — connected to useBakeryStore dynamic items, live stock & sold-out badges. */
import { useMemo, useState } from "react";
import { ArrowUpRight, Leaf, Sparkles, Heart, ShoppingBag, Minus, Plus, Share2, Info, Ban } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { useBakeryStore, type MenuItem } from "@/lib/bakeryStore";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ButterBlob, LeafSprig, HeartDoodle, ScriptNote } from "@/components/decor";

const filterOptions = ["All", "Cakes", "Cupcakes", "Cookies", "Seasonal"] as const;

export default function Menu() {
  const { menuItems } = useBakeryStore();
  const [filter, setFilter] = useState<(typeof filterOptions)[number]>("All");
  const [quick, setQuick] = useState<MenuItem | null>(null);
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
  const { toggle, isFavorite } = useFavorites();

  const visible = useMemo(() => {
    if (filter === "All") return menuItems;
    return menuItems.filter((m) => m.category === filter);
  }, [filter, menuItems]);

  const openQuick = (item: MenuItem) => {
    setQuick(item);
    setQty(1);
  };

  const handleAdd = (item: MenuItem, quantity = 1) => {
    if (item.isSoldOut || item.stock === 0) {
      toast.error(`${item.title} is sold out for today`);
      return;
    }
    addItem({
      id: item.id,
      title: item.title,
      detail: item.category,
      price: item.priceNum,
      priceLabel: item.priceLabel,
      image: item.image,
      variant: item.serves,
      quantity,
    });
  };

  const handleShare = async (item: MenuItem) => {
    const url = typeof window !== "undefined" ? `${window.location.origin}${window.location.pathname}#${item.id}` : "";
    try {
      if (navigator.share) await navigator.share({ title: item.title, text: item.detail, url });
      else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url || item.title);
        toast.success("Link copied", { description: url || item.title });
      } else toast("Share — demo", { description: `${item.title} · ${item.priceLabel}` });
    } catch {
      toast("Share cancelled", { duration: 1500 });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--cream)] text-[var(--ink)]">
      <SiteHeader />
      <main id="main">
        <section className="container relative pb-8 pt-12 sm:pb-10 sm:pt-16" data-reveal="fade">
          <div className="pointer-events-none absolute -left-16 top-2 hidden h-40 w-40 lg:block" aria-hidden>
            <ButterBlob className="drift-slow h-full w-full text-[var(--butter)]" />
          </div>
          <div className="pointer-events-none absolute right-[8%] top-24 hidden lg:block" aria-hidden>
            <LeafSprig className="drift h-20 w-20 rotate-[40deg] text-[var(--sage-deep)] opacity-50" />
          </div>
          <div className="grid gap-6 lg:grid-cols-[1.05fr_.95fr] lg:gap-12">
            <h1 className="display-title relative max-w-[12ch] text-[48px] leading-[0.98] sm:text-[68px] lg:text-[82px] xl:text-[90px]">
              Sweet things,
              <br />
              <em>made slowly.</em>
              <HeartDoodle className="absolute -right-4 -top-8 hidden h-12 w-12 rotate-12 text-[var(--terra)] opacity-50 xl:block" />
            </h1>
            <div className="self-end lg:pb-3">
              <p className="max-w-[36ch] text-[15px] leading-7 text-[var(--ink-soft)]">
                A few generous favorites, each baked to order and decorated by hand. Add to your bag for a quick checkout, or start in the studio for a fully custom cake.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-[var(--paper)] px-4 py-2 text-[12.5px] font-extrabold text-[var(--ink-soft)]">
                  <Leaf size={13} className="text-[var(--sage-deep)]" /> Baked to order
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-[var(--paper)] px-4 py-2 text-[12.5px] font-extrabold text-[var(--ink-soft)]">
                  <Sparkles size={13} className="text-[var(--terra)]" /> Decorated by hand
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-[var(--paper)] px-4 py-2 text-[12.5px] font-extrabold text-[var(--ink-soft)]">
                  <ShoppingBag size={13} className="text-[var(--butter-deep)]" /> Studio live stock
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* filters */}
        <section className="container">
          <div className="flex flex-wrap items-center gap-2 pb-2">
            {filterOptions.map((f) => {
              const active = filter === f;
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  aria-pressed={active}
                  className={`min-h-[42px] rounded-full px-5 text-[13.5px] font-extrabold transition-all ${active ? "bg-[var(--terra)] text-white shadow-[0_6px_16px_oklch(0.615_0.115_27/0.28)]" : "bg-[var(--paper)] text-[var(--ink-soft)] hover:bg-[var(--blush)] hover:text-[var(--terra)]"}`}
                >
                  {f}
                </button>
              );
            })}
            <span className="ml-auto hidden items-center gap-1.5 text-[12px] font-semibold text-[var(--ink-mute)] sm:inline-flex">
              <Info size={13} className="text-[var(--terra)]" /> Tap a sweet item to see details or add to bag
            </span>
          </div>
          <div className="hairline mt-4" />
        </section>

        <section className="container pb-16 pt-8 sm:pb-22" data-reveal="up">
          <div className="grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-4" data-stagger>
            {visible.map((item) => {
              const fav = isFavorite(item.id);
              const isSoldOut = item.isSoldOut || item.stock === 0;

              return (
                <article key={item.id} id={item.id} className="group flex flex-col">
                  <div className="relative">
                    <button onClick={() => openQuick(item)} className="visual-tile block aspect-[0.92] w-full" aria-label={`View ${item.title} details`}>
                      <img src={item.image} alt={item.title} loading="lazy" decoding="async" className={`h-full w-full object-cover transition-transform duration-300 ${isSoldOut ? "grayscale-[0.4] opacity-80" : ""}`} />
                    </button>
                    {isSoldOut ? (
                      <span className="pointer-events-none absolute left-3.5 top-3.5 rounded-full bg-[oklch(0.35_0.03_30)] px-3 py-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.1em] text-white shadow-sm">
                        Sold out for today
                      </span>
                    ) : (
                      <span className="pointer-events-none absolute left-3.5 top-3.5 rounded-full bg-white/90 px-3 py-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.1em] text-[var(--ink)] backdrop-blur-sm">
                        {item.category}
                      </span>
                    )}
                    <button
                      onClick={() => toggle(item.id, item.title)}
                      aria-label={fav ? "Remove from favorites" : "Save to favorites"}
                      className={`absolute right-3.5 top-3.5 grid h-9 w-9 place-items-center rounded-full transition-colors ${
                        fav ? "bg-[var(--terra)] text-white" : "bg-white/90 text-[var(--ink-soft)] hover:bg-white hover:text-[var(--terra)]"
                      } sm:opacity-0 sm:group-hover:opacity-100 ${fav ? "sm:opacity-100" : ""}`}
                    >
                      <Heart size={15} strokeWidth={2} className={fav ? "fill-white" : ""} />
                    </button>
                  </div>
                  <div className="mt-5 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="font-display text-[24px] font-semibold leading-none tracking-[-0.01em]">{item.title}</h2>
                      <p className="mt-2 text-[11px] font-extrabold uppercase tracking-[0.13em] text-[var(--terra)]">{item.serves}</p>
                    </div>
                    <p className="shrink-0 rounded-full bg-[var(--paper)] px-3 py-1.5 text-[12.5px] font-extrabold text-[var(--ink)]">{item.priceLabel}</p>
                  </div>
                  <p className="mt-2.5 max-w-[32ch] text-[13.5px] leading-6 text-[var(--ink-mute)]">{item.detail}</p>
                  <div className="mt-4 flex gap-2">
                    {isSoldOut ? (
                      <button
                        disabled
                        aria-disabled="true"
                        className="min-h-[44px] flex-1 rounded-full border border-[oklch(0.88_0.02_60)] bg-[oklch(0.93_0.01_60)] px-3 py-3 text-[12px] font-bold text-[oklch(0.55_0.02_45)] cursor-not-allowed flex items-center justify-center gap-1.5"
                      >
                        <Ban size={14} /> Sold out today
                      </button>
                    ) : (
                      <button onClick={() => handleAdd(item)} className="button-rose min-h-[44px] flex-1 px-3 py-3 text-[12.5px]">
                        <ShoppingBag size={15} /> Add to bag
                      </button>
                    )}
                    <button onClick={() => openQuick(item)} className="button-ink min-h-[44px] px-4 py-3 text-[12.5px]">
                      Details
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
          <p className="mt-10 text-center text-[12.5px] font-semibold leading-5 text-[var(--ink-mute)]">
            Prices are starting points · final quote reflects size, flavor, and finish.{" "}
            <Link href="/custom-order" className="link-underline font-extrabold text-[var(--terra)]">See live pricing in the studio</Link>
          </p>
        </section>

        {/* quick view dialog */}
        <Dialog open={!!quick} onOpenChange={(o) => !o && setQuick(null)}>
          <DialogContent className="max-h-[90dvh] max-w-[880px] overflow-hidden rounded-[1.75rem] border-[oklch(0.885_0.028_60)] bg-[var(--cream)] p-0">
            {quick && (
              <div className="grid max-h-[90dvh] overflow-auto lg:grid-cols-[1.05fr_.95fr]">
                <div className="relative bg-[var(--blush)]/60 p-4 sm:p-5">
                  <div className="visual-tile aspect-[0.95]">
                    <img src={quick.image} alt={quick.title} className="h-full w-full object-cover" />
                  </div>
                  {(quick.isSoldOut || quick.stock === 0) && (
                    <span className="absolute top-8 left-8 rounded-full bg-[oklch(0.35_0.03_30)] px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-md">
                      Sold out for today
                    </span>
                  )}
                </div>
                <div className="flex flex-col p-6 sm:p-8">
                  <DialogHeader className="space-y-1.5 text-left">
                    <p className="eyebrow">{quick.serves} · {quick.category}</p>
                    <DialogTitle className="font-display text-[31px] font-semibold leading-none tracking-[-0.015em] sm:text-[35px]">{quick.title}</DialogTitle>
                    <DialogDescription className="text-[13.5px] leading-6 text-[var(--ink-soft)]">{quick.story}</DialogDescription>
                  </DialogHeader>

                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {quick.allergens.map((a) => (
                      <span key={a} className="rounded-full bg-[var(--paper)] px-3 py-1.5 text-[11px] font-extrabold text-[var(--ink-mute)]">{a}</span>
                    ))}
                    {quick.stock > 0 && !quick.isSoldOut ? (
                      <span className="rounded-full bg-[var(--sage-soft)] px-3 py-1.5 text-[11px] font-extrabold text-[var(--sage-deep)]">
                        {quick.stock} available today
                      </span>
                    ) : (
                      <span className="rounded-full bg-[var(--blush)] px-3 py-1.5 text-[11px] font-extrabold text-[var(--terra)]">
                        Sold out today
                      </span>
                    )}
                  </div>

                  <div className="mt-5 flex items-baseline justify-between rounded-2xl bg-[var(--paper)] p-4">
                    <span className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--ink-mute)]">Starting at</span>
                    <span className="font-display text-[30px] font-semibold leading-none tracking-[-0.015em]">${quick.priceNum}</span>
                  </div>
                  <p className="mt-2 text-[11.5px] leading-4 text-[var(--ink-mute)]">Final price varies by flavor, filling, and finish — see the studio for a live total.</p>

                  {!(quick.isSoldOut || quick.stock === 0) && (
                    <div className="mt-5 flex items-center gap-3">
                      <span className="text-[12.5px] font-extrabold text-[var(--ink)]">Quantity</span>
                      <div className="ml-auto flex items-center rounded-full border-[1.5px] border-[oklch(0.88_0.03_60)] bg-[var(--paper)]">
                        <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-10 w-10 place-items-center rounded-l-full text-[var(--terra)] hover:bg-[var(--blush)]" aria-label="Decrease quantity"><Minus size={15} /></button>
                        <span className="min-w-[44px] text-center text-[14px] font-extrabold tabular-nums">{qty}</span>
                        <button onClick={() => setQty((q) => Math.min(quick.stock, q + 1))} className="grid h-10 w-10 place-items-center rounded-r-full text-[var(--terra)] hover:bg-[var(--blush)]" aria-label="Increase quantity"><Plus size={15} /></button>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 grid grid-cols-2 gap-2">
                    {quick.isSoldOut || quick.stock === 0 ? (
                      <button
                        disabled
                        className="rounded-full bg-[oklch(0.93_0.01_60)] py-3.5 text-[12.5px] font-bold text-[oklch(0.55_0.02_45)] cursor-not-allowed"
                      >
                        Sold out for today
                      </button>
                    ) : (
                      <button
                        onClick={() => { handleAdd(quick, qty); setQuick(null); }}
                        className="button-rose justify-center py-3.5 text-[13px]"
                      >
                        Add to bag — ${(quick.priceNum * qty)}
                      </button>
                    )}
                    <button
                      onClick={() => { const fav = isFavorite(quick.id); toggle(quick.id, quick.title); if (fav) toast("Removed from wishlist"); }}
                      className={`inline-flex items-center justify-center gap-1.5 rounded-full border-[1.5px] px-3 py-3.5 text-[13px] font-bold transition-colors ${
                        isFavorite(quick.id)
                          ? "border-[var(--terra)] bg-[var(--terra)] text-white"
                          : "border-[oklch(0.305_0.033_42/0.4)] bg-transparent text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--paper)]"
                      }`}
                    >
                      <Heart size={15} className={isFavorite(quick.id) ? "fill-white" : ""} /> {isFavorite(quick.id) ? "Saved" : "Save"}
                    </button>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Link href="/custom-order" onClick={() => setQuick(null)} className="button-ink min-h-[46px] flex-1 justify-center py-3">
                      Customize in studio <ArrowUpRight size={14} />
                    </Link>
                    <button onClick={() => handleShare(quick)} className="grid h-[46px] w-[46px] shrink-0 place-items-center rounded-full border-[1.5px] border-[oklch(0.88_0.03_60)] bg-[var(--paper)] text-[var(--ink-soft)] hover:border-[var(--ink)] hover:text-[var(--ink)]" aria-label="Share">
                      <Share2 size={16} />
                    </button>
                  </div>

                  <p className="mt-5 text-center text-[11.5px] leading-4 text-[var(--ink-mute)]">Syncs with live bakery inventory · bag is saved locally.</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* closing — blush */}
        <section className="container pb-18 sm:pb-24">
          <div className="paper-texture relative overflow-hidden rounded-[2.25rem] bg-[var(--blush)] px-6 py-14 sm:px-12 sm:py-18">
            <LeafSprig className="pointer-events-none absolute -right-4 -top-4 h-28 w-28 rotate-[140deg] text-[var(--sage-deep)] opacity-30" aria-hidden />
            <div className="relative grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-12">
              <div>
                <p className="eyebrow">Planning something larger?</p>
                <h2 className="display-title mt-3 max-w-[16ch] text-[38px] leading-[1] sm:text-[48px] lg:text-[52px]">
                  Start with the shape of the <em>gathering.</em>
                </h2>
                <p className="mt-4 max-w-[36ch] text-[14.5px] leading-6 text-[oklch(0.4_0.035_35)]">Worried about guest count or delivery? The studio keeps it simple: pick size, pick date, see the math.</p>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Link href="/custom-order" className="button-rose">
                    Build a custom quote <ArrowUpRight size={15} strokeWidth={2.2} />
                  </Link>
                  <p className="text-[12px] font-semibold leading-5 text-[oklch(0.42_0.045_30)]">
                    Free to explore · <span className="font-extrabold">no payment until you confirm</span>
                  </p>
                </div>
              </div>
              <div className="grid content-center gap-4 sm:grid-cols-2">
                {[
                  { title: "Built around your guest count", desc: "Pick a size and see a transparent starting price, then refine flavor and finish." },
                  { title: "Designed for your date", desc: "Only real available dates appear in the calendar — no back-and-forth." },
                ].map((c) => (
                  <div key={c.title} className="rounded-2xl bg-white/60 p-5">
                    <p className="text-[14px] font-extrabold leading-5 text-[oklch(0.35_0.04_32)]">{c.title}</p>
                    <p className="mt-2 text-[13px] leading-5 text-[oklch(0.42_0.045_30)]">{c.desc}</p>
                  </div>
                ))}
                <p className="sm:col-span-2 text-center"><ScriptNote className="text-[oklch(0.45_0.08_20)]">every cake tells a little story</ScriptNote></p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
