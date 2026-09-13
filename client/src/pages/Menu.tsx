/** Quiet Patisserie Editorial: seasonal menu — now fully interactive for portfolio. */
import { useMemo, useState } from "react";
import { ArrowUpRight, Check, Leaf, Sparkles, Heart, ShoppingBag, Eye, X, Minus, Plus, Share2, Info } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { menuItems } from "@/lib/bakeryData";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

/* enrich menu data for portfolio demo */
const enriched = menuItems.map((item, idx) => {
  const prices: Record<string, number> = { "Signature cake": 84, "Petite cake": 54, "Cupcake dozen": 42, "Decorated cookies": 34 };
  const price = prices[item.title] ?? 42;
  return {
    ...item,
    id: `menu-${idx}-${item.title.toLowerCase().replace(/\s+/g, "-")}`,
    priceNum: price,
    priceLabel: `from $${price}`,
    allergens: idx === 0 ? ["Wheat", "Dairy", "Eggs"] : idx === 1 ? ["Wheat", "Dairy"] : idx === 2 ? ["Wheat", "Dairy", "Eggs"] : ["Wheat", "Dairy", "Eggs", "Soy"],
    story:
      idx === 0
        ? "Our most-requested centerpiece. Vanilla bean or dark chocolate, raspberry or salted caramel, finished in textured buttercream with seasonal blooms."
        : idx === 1
          ? "A six-inch cake for the sweetest tables of 4–8. Ideal for weeknight celebrations and studio pickup."
          : idx === 2
            ? "Twelve cupcakes in two complementary seasonal flavors. Floral crowns, cloud-soft crumb."
            : "Buttery vanilla sablé, iced one by one. Perfect as favors or a giftable dozen.",
    serves: idx === 0 ? "Serves 12–16" : idx === 1 ? "Serves 6–8" : idx === 2 ? "12 per box" : "12 per box",
  };
});

const filterOptions = ["All", "Cakes", "Cupcakes", "Cookies"] as const;

export default function Menu() {
  const [filter, setFilter] = useState<(typeof filterOptions)[number]>("All");
  const [quick, setQuick] = useState<(typeof enriched)[number] | null>(null);
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
  const { toggle, isFavorite } = useFavorites();

  const visible = useMemo(() => {
    if (filter === "All") return enriched;
    if (filter === "Cakes") return enriched.filter((m) => m.title.toLowerCase().includes("cake"));
    if (filter === "Cupcakes") return enriched.filter((m) => m.title.toLowerCase().includes("cupcake"));
    return enriched.filter((m) => m.title.toLowerCase().includes("cookie"));
  }, [filter]);

  const openQuick = (item: (typeof enriched)[number]) => {
    setQuick(item);
    setQty(1);
  };

  const handleAdd = (item: (typeof enriched)[number], quantity = 1) => {
    addItem({
      id: item.id,
      title: item.title,
      detail: item.tag,
      price: item.priceNum,
      priceLabel: item.priceLabel,
      image: item.image,
      variant: item.serves,
      quantity,
    });
  };

  const handleShare = async (item: (typeof enriched)[number]) => {
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
    <div className="min-h-screen bg-[oklch(0.982_0.008_75)] text-[var(--ink)]">
      <SiteHeader />
      <main id="main">
        <section className="container pb-6 pt-10 sm:pb-8 sm:pt-14 lg:pt-16">
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
                A few generous favorites, each baked to order and decorated by hand. Add to your bag for a quick checkout, or start in the studio for a fully custom cake.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
                <span className="inline-flex items-center gap-1.5 border border-[oklch(0.86_0.02_52)] bg-white px-2.5 py-1 font-medium text-[oklch(0.42_0.02_35)]">
                  <Leaf size={12} className="text-[var(--rosewood)]" /> Baked to order
                </span>
                <span className="inline-flex items-center gap-1.5 border border-[oklch(0.86_0.02_52)] bg-white px-2.5 py-1 font-medium text-[oklch(0.42_0.02_35)]">
                  <Sparkles size={12} className="text-[var(--rosewood)]" /> Decorated by hand
                </span>
                <span className="inline-flex items-center gap-1.5 border border-[oklch(0.86_0.02_52)] bg-white px-2.5 py-1 font-medium text-[oklch(0.42_0.02_35)]">
                  <ShoppingBag size={12} className="text-[var(--rosewood)]" /> Shop + studio live
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* filters */}
        <section className="container">
          <div className="flex flex-wrap items-center gap-2 border-y border-[oklch(0.88_0.018_52)] bg-white/60 py-3 backdrop-blur-sm">
            {filterOptions.map((f) => {
              const active = filter === f;
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  aria-pressed={active}
                  className={`rounded-full border px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] transition-all ${active ? "border-[var(--rosewood)] bg-[var(--rosewood)] text-white shadow-[0_4px_14px_oklch(0.49_0.09_18/0.2)]" : "border-[oklch(0.86_0.02_52)] bg-white text-[oklch(0.42_0.02_35)] hover:border-[oklch(0.72_0.03_18)] hover:bg-[oklch(0.94_0.03_13)]"}`}
                >
                  {f}
                </button>
              );
            })}
            <span className="ml-auto hidden items-center gap-1.5 text-[11px] text-[oklch(0.58_0.03_18)] sm:inline-flex">
              <Info size={12} className="text-[var(--rosewood)]" /> Tap a cake to see details, save, or add to bag
            </span>
          </div>
        </section>

        <section className="container pb-14 pt-6 sm:pb-20 lg:pb-24">
          <div className="grid gap-6 gap-y-10 sm:grid-cols-2 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-4">
            {visible.map((item) => {
              const fav = isFavorite(item.id);
              return (
                <article key={item.id} id={item.id} className="group flex flex-col">
                  <div className="relative overflow-hidden border border-[oklch(0.88_0.018_52)] bg-[oklch(0.96_0.008_72)] p-1.5">
                    <button onClick={() => openQuick(item)} className="visual-tile block aspect-[0.92] w-full sm:aspect-[0.9]" aria-label={`View ${item.title} details`}>
                      <img src={item.image} alt={item.title} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                    </button>
                    <span className="pointer-events-none absolute left-3 top-3 border border-black/10 bg-white/85 px-2 py-1 text-[8px] font-bold uppercase tracking-[0.13em] text-[oklch(0.34_0.02_35)] backdrop-blur-md">
                      {item.tag}
                    </span>
                    {/* hover actions */}
                    <div className="absolute inset-x-1.5 bottom-1.5 hidden translate-y-1 items-center gap-1.5 bg-[oklch(0.995_0.004_80/0.92)] p-1.5 opacity-0 backdrop-blur-[8px] transition-[transform,opacity] duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:flex">
                      <button
                        onClick={() => toggle(item.id, item.title)}
                        aria-label={fav ? "Remove from favorites" : "Save to favorites"}
                        className={`grid h-8 w-8 place-items-center rounded-full border transition-colors ${fav ? "border-[var(--rosewood)] bg-[var(--rosewood)] text-white" : "border-[oklch(0.86_0.02_52)] bg-white text-[oklch(0.42_0.02_35)] hover:border-[var(--rosewood)] hover:text-[var(--rosewood)]"}`}
                      >
                        <Heart size={14} strokeWidth={1.9} className={fav ? "fill-white" : ""} />
                      </button>
                      <button
                        onClick={() => handleShare(item)}
                        aria-label="Share"
                        className="grid h-8 w-8 place-items-center rounded-full border border-[oklch(0.86_0.02_52)] bg-white text-[oklch(0.42_0.02_35)] hover:border-[oklch(0.72_0.03_18)] hover:text-[var(--ink)]"
                      >
                        <Share2 size={14} strokeWidth={1.8} />
                      </button>
                      <button onClick={() => openQuick(item)} className="ml-auto inline-flex items-center gap-1.5 bg-[var(--ink)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-white hover:bg-black">
                        <Eye size={13} /> Quick view
                      </button>
                    </div>
                    {/* mobile fav */}
                    <button
                      onClick={() => toggle(item.id, item.title)}
                      className={`absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full border backdrop-blur-md transition-colors sm:hidden ${fav ? "border-[var(--rosewood)] bg-[var(--rosewood)] text-white" : "border-white/50 bg-white/80 text-[oklch(0.34_0.02_35)]"}`}
                      aria-label="Favorite"
                    >
                      <Heart size={14} className={fav ? "fill-white" : ""} />
                    </button>
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="font-display text-[26px] font-[500] leading-none tracking-[-0.02em] sm:text-[28px]">{item.title}</h2>
                      <p className="mt-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-[var(--rosewood)]">{item.serves} · {item.tag}</p>
                    </div>
                    <p className="shrink-0 rounded-full border border-[oklch(0.86_0.02_52)] bg-white px-2.5 py-1 text-[11px] font-semibold tracking-[-0.01em] text-[oklch(0.38_0.02_35)]">
                      {item.priceLabel}
                    </p>
                  </div>
                  <p className="mt-2.5 max-w-[32ch] text-[13px] leading-6 text-[oklch(0.46_0.02_35)]">{item.detail}</p>
                  <div className="mt-4 flex gap-2">
                    <button onClick={() => handleAdd(item)} className="flex-1 inline-flex items-center justify-center gap-1.5 border border-[var(--ink)] bg-[var(--ink)] px-3 py-2.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-black">
                      <ShoppingBag size={13} /> Add to bag
                    </button>
                    <button onClick={() => openQuick(item)} className="inline-flex items-center justify-center gap-1.5 border border-[oklch(0.86_0.02_52)] bg-white px-3 py-2.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[oklch(0.34_0.02_35)] hover:border-[var(--ink)] hover:text-[var(--ink)]">
                      Details
                    </button>
                  </div>
                  <div className="mt-3 h-px w-full bg-[oklch(0.91_0.015_52)]" aria-hidden />
                </article>
              );
            })}
          </div>
          <p className="mt-6 text-center text-[11px] leading-5 text-[oklch(0.58_0.03_18)]">
            Prices are starting points · final quote reflects size, flavor, and finish. <Link href="/custom-order" className="underline decoration-[var(--rosewood)]/30 underline-offset-4 hover:decoration-[var(--rosewood)]">See live pricing in the studio</Link>
          </p>
        </section>

        {/* quick view dialog */}
        <Dialog open={!!quick} onOpenChange={(o) => !o && setQuick(null)}>
          <DialogContent className="max-h-[90dvh] max-w-[860px] overflow-hidden border-[oklch(0.88_0.018_52)] bg-[oklch(0.982_0.008_75)] p-0 sm:rounded-none">
            {quick && (
              <div className="grid max-h-[90dvh] overflow-auto lg:grid-cols-[1.05fr_.95fr]">
                <div className="relative bg-[oklch(0.96_0.008_72)] p-2 sm:p-3">
                  <div className="aspect-[0.95] overflow-hidden border border-[oklch(0.88_0.018_52)] bg-white">
                    <img src={quick.image} alt={quick.title} className="h-full w-full object-cover" />
                  </div>
                  <span className="absolute left-4 top-4 border border-black/10 bg-white/85 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] backdrop-blur-md">{quick.tag}</span>
                </div>
                <div className="flex flex-col p-5 sm:p-7">
                  <DialogHeader className="space-y-1 text-left">
                    <p className="eyebrow">{quick.serves} · seasonal</p>
                    <DialogTitle className="font-display text-[30px] font-medium leading-none tracking-[-0.03em] sm:text-[34px]">{quick.title}</DialogTitle>
                    <DialogDescription className="text-[13px] leading-5 text-[oklch(0.46_0.02_35)]">{quick.story}</DialogDescription>
                  </DialogHeader>

                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {quick.allergens.map((a) => (
                      <span key={a} className="rounded-full border border-[oklch(0.86_0.02_52)] bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[oklch(0.46_0.02_35)]">{a}</span>
                    ))}
                    <span className="rounded-full border border-[var(--rosewood)]/20 bg-[oklch(0.94_0.03_13)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--rosewood)]">Made to order · 5-day lead</span>
                  </div>

                  <div className="mt-5 rounded-[2px] border border-[oklch(0.86_0.02_52)] bg-white p-4">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[oklch(0.52_0.02_35)]">Starting at</span>
                      <span className="font-display text-[28px] leading-none tracking-[-0.02em]">${quick.priceNum}</span>
                    </div>
                    <p className="mt-1 text-[11px] leading-4 text-[oklch(0.58_0.03_18)]">Final price varies by flavor, filling, and finish — see the studio for a live total.</p>
                  </div>

                  <div className="mt-5 flex items-center gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[oklch(0.34_0.02_35)]">Quantity</span>
                    <div className="ml-auto flex items-center overflow-hidden rounded-full border border-[oklch(0.86_0.02_52)] bg-white">
                      <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-9 w-9 place-items-center text-[var(--rosewood)] hover:bg-[oklch(0.94_0.03_13)]"><Minus size={14} /></button>
                      <span className="min-w-[48px] text-center text-[13px] font-semibold tabular-nums">{qty}</span>
                      <button onClick={() => setQty((q) => Math.min(6, q + 1))} className="grid h-9 w-9 place-items-center text-[var(--rosewood)] hover:bg-[oklch(0.94_0.03_13)]"><Plus size={14} /></button>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => { handleAdd(quick, qty); setQuick(null); }}
                      className="button-rose justify-center py-3.5 text-[10px]"
                    >
                      Add to bag — ${(quick.priceNum * qty)} <ShoppingBag size={14} />
                    </button>
                    <button
                      onClick={() => { const fav = isFavorite(quick.id); toggle(quick.id, quick.title); if (fav) toast("Removed from wishlist"); }}
                      className={`inline-flex items-center justify-center gap-1.5 border px-3 py-3.5 text-[10px] font-bold uppercase tracking-[0.12em] transition-colors ${isFavorite(quick.id) ? "border-[var(--rosewood)] bg-[var(--rosewood)] text-white" : "border-[oklch(0.86_0.02_52)] bg-white text-[oklch(0.34_0.02_35)] hover:border-[var(--ink)] hover:text-[var(--ink)]"}`}
                    >
                      <Heart size={14} className={isFavorite(quick.id) ? "fill-white" : ""} /> {isFavorite(quick.id) ? "Saved" : "Save"}
                    </button>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Link href="/custom-order" onClick={() => setQuick(null)} className="button-ink flex-1 justify-center py-3">
                      Customize in studio <ArrowUpRight size={13} />
                    </Link>
                    <button onClick={() => handleShare(quick)} className="grid h-[44px] w-[44px] place-items-center border border-[oklch(0.86_0.02_52)] bg-white text-[oklch(0.42_0.02_35)] hover:border-[var(--ink)] hover:text-[var(--ink)]">
                      <Share2 size={16} />
                    </button>
                  </div>

                  <p className="mt-4 flex items-center gap-1.5 text-center text-[11px] leading-4 text-[oklch(0.58_0.03_18)]"><Info size={12} className="text-[var(--rosewood)]" /> Portfolio demo — bag is saved locally, no payment collected.</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

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
