import { useState } from "react";
import { Sparkles, ArrowRight, ArrowLeft, RotateCcw, ShoppingBag, Check, Heart, Cake } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { withBase } from "@/lib/withBase";

type Occasion = "wedding" | "birthday" | "dinner" | "just-because";
type Size = "intimate" | "classic" | "grand";
type Profile = "floral" | "chocolate" | "citrus" | "vanilla";

interface Recommendation {
  title: string;
  subtitle: string;
  tag: string;
  price: number;
  serves: string;
  flavor: string;
  filling: string;
  finish: string;
  image: string;
  story: string;
}

const recommendations: Record<string, Recommendation> = {
  "wedding-grand-floral": {
    title: "Wildflower Tiered Vows",
    subtitle: "Two tier custom celebration cake",
    tag: "Wedding Centerpiece",
    price: 240,
    serves: "Serves 35–45",
    flavor: "Vanilla bean with elderflower syrup",
    filling: "Raspberry preserve & lemon curd",
    finish: "Textured buttercream with fresh garden flora",
    image: withBase("/images/photo-1578985545062-69928b1d9587.jpg"),
    story: "A romantic, high-key centerpiece hand-decorated the morning of your ceremony with fresh botanical stems."
  },
  "birthday-classic-chocolate": {
    title: "Dark Cacao & Salted Caramel",
    subtitle: "8-inch single tier cake",
    tag: "Crowd Favorite",
    price: 118,
    serves: "Serves 16–20",
    flavor: "70% Valrhona dark chocolate sponge",
    filling: "House-cooked Fleur de Sel caramel",
    finish: "Textured mocha buttercream with chocolate pearls",
    image: withBase("/images/photo-1578985545062-69928b1d9587.jpg"),
    story: "Rich, deep, and not excessively sweet — crafted for birthday tables where everyone demands a second slice."
  },
  "dinner-intimate-citrus": {
    title: "Lemon Verbena & Olive Oil",
    subtitle: "6-inch petite celebration cake",
    tag: "Dinner Table Petite",
    price: 84,
    serves: "Serves 8–12",
    flavor: "Meyer lemon & extra-virgin olive oil",
    filling: "Tart lemon curd & whipped mascarpone",
    finish: "Semi-naked textured buttercream with citrus leaves",
    image: withBase("/images/photo-1535254973040-607b474cb50d.jpg"),
    story: "Bright, tender, and intensely aromatic — pairs exquisitely with late-evening wine and intimate conversation."
  },
  "default": {
    title: "Petal & Crumb Signature Garden Cake",
    subtitle: "8-inch layered celebration cake",
    tag: "Studio Classic",
    price: 118,
    serves: "Serves 16–20",
    flavor: "Bourbon vanilla bean crumb",
    filling: "Summer raspberry preserve",
    finish: "Textured cloud buttercream with seasonal petals",
    image: withBase("/images/photo-1559620192-032c4bc4674e.jpg"),
    story: "Our quintessential house cake: airy crumb, velvety buttercream, and delicate hand-placed garden blooms."
  }
};

export function CakeFinderQuiz() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [occasion, setOccasion] = useState<Occasion>("birthday");
  const [size, setSize] = useState<Size>("classic");
  const [profile, setProfile] = useState<Profile>("floral");
  const { addItem } = useCart();
  const { toggle, isFavorite } = useFavorites();

  const getRecommendation = (): Recommendation => {
    const key = `${occasion}-${size}-${profile}`;
    return recommendations[key] || recommendations["wedding-grand-floral"] || recommendations["default"];
  };

  const currentRec = getRecommendation();
  const favKey = `quiz-${currentRec.title.toLowerCase().replace(/\s+/g, "-")}`;
  const isFav = isFavorite(favKey);

  const handleAddMatched = () => {
    addItem({
      id: favKey,
      title: currentRec.title,
      detail: `${currentRec.serves} · ${currentRec.flavor}`,
      price: currentRec.price,
      priceLabel: `from $${currentRec.price}`,
      image: currentRec.image,
      variant: currentRec.finish,
      quantity: 1
    });
    toast.success(`${currentRec.title} added to your bag`, {
      description: `Matched to your ${occasion} celebration (${currentRec.serves}).`
    });
  };

  const handleReset = () => {
    setStep(1);
    toast("Cake finder reset", { description: "Select your celebration details afresh." });
  };

  return (
    <div
      data-reveal="up"
      className="border border-[oklch(0.88_0.018_52)] bg-white p-6 sm:p-8 lg:p-10 shadow-[0_16px_48px_oklch(0.25_0.018_35/0.06)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[oklch(0.91_0.015_52)] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--rosewood)]" />
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--rosewood)]">
              Interactive Flavor &amp; Cake Finder
            </p>
          </div>
          <h3 className="mt-1 font-display text-[26px] sm:text-[32px] font-medium leading-none tracking-[-0.02em]">
            Find the cake for your table
          </h3>
        </div>

        {/* Step progress pills */}
        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.1em]">
          {[1, 2, 3].map((num) => (
            <span
              key={num}
              className={`grid h-7 w-7 place-items-center rounded-full border transition-all ${
                step === num
                  ? "border-[var(--rosewood)] bg-[var(--rosewood)] text-white shadow-[0_2px_8px_oklch(0.49_0.09_18/0.25)]"
                  : step > num
                  ? "border-[var(--rosewood)]/30 bg-[oklch(0.94_0.03_13)] text-[var(--rosewood)]"
                  : "border-[oklch(0.86_0.02_52)] bg-[oklch(0.97_0.008_72)] text-[oklch(0.52_0.02_35)]"
              }`}
            >
              {step > num ? <Check size={12} strokeWidth={2.5} /> : num}
            </span>
          ))}
          <span className="ml-1 text-[11px] text-[oklch(0.52_0.02_35)] font-normal hidden sm:inline">
            {step === 1 ? "Occasion" : step === 2 ? "Guest count" : step === 3 ? "Flavor profile" : "Your match"}
          </span>
        </div>
      </div>

      {/* Step 1: Occasion */}
      {step === 1 && (
        <div className="py-6 animate-[fadeUp_300ms_cubic-bezier(0.16,1,0.3,1)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[oklch(0.52_0.02_35)]">
            Step 01 / 03 · What is the celebration?
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { id: "wedding", label: "Wedding & Vows", desc: "Ceremonial multi-tier centerpiece with botanical florals" },
              { id: "birthday", label: "Birthday Milestone", desc: "Joyful, candle-ready centerpiece with textured swirls" },
              { id: "dinner", label: "Intimate Gathering", desc: "Quiet Saturday dinner with dear friends and good wine" },
              { id: "just-because", label: "Just Because", desc: "A little ritual to make an ordinary week feel ceremonial" },
            ].map((item) => {
              const active = occasion === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setOccasion(item.id as Occasion)}
                  className={`border p-4 text-left transition-all min-h-[96px] flex flex-col justify-between ${
                    active
                      ? "border-[var(--rosewood)] bg-[oklch(0.94_0.03_13)] shadow-[inset_0_0_0_1px_var(--rosewood)]"
                      : "border-[oklch(0.86_0.02_52)] bg-[oklch(0.995_0.004_80)] hover:border-[oklch(0.72_0.03_18)] hover:bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-display text-[17px] font-medium leading-tight text-[var(--ink)]">
                      {item.label}
                    </span>
                    <span className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border ${active ? "border-[var(--rosewood)] bg-[var(--rosewood)] text-white" : "border-[oklch(0.80_0.02_52)]"}`}>
                      {active && <Check size={10} strokeWidth={3} />}
                    </span>
                  </div>
                  <p className="mt-2 text-[12px] leading-4 text-[oklch(0.5_0.02_35)]">{item.desc}</p>
                </button>
              );
            })}
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="button-rose min-h-[44px] px-6 text-[10px]"
            >
              Continue to Guest Count <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Guest Count / Size */}
      {step === 2 && (
        <div className="py-6 animate-[fadeUp_300ms_cubic-bezier(0.16,1,0.3,1)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[oklch(0.52_0.02_35)]">
            Step 02 / 03 · How many people will gather around the table?
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              { id: "intimate", label: "4 to 8 guests", title: "Petite 6-inch", desc: "Single tier centerpiece for intimate toasts & small dinner parties" },
              { id: "classic", label: "12 to 20 guests", title: "Signature 8-inch", desc: "Generous 3-layer cake — plenty for seconds all around" },
              { id: "grand", label: "30 to 45 guests", title: "Two-Tier Grand", desc: "Sculpted statement cake designed to anchor a major celebration" },
            ].map((item) => {
              const active = size === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSize(item.id as Size)}
                  className={`border p-4 text-left transition-all min-h-[104px] flex flex-col justify-between ${
                    active
                      ? "border-[var(--rosewood)] bg-[oklch(0.94_0.03_13)] shadow-[inset_0_0_0_1px_var(--rosewood)]"
                      : "border-[oklch(0.86_0.02_52)] bg-[oklch(0.995_0.004_80)] hover:border-[oklch(0.72_0.03_18)] hover:bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--rosewood)]">{item.label}</span>
                      <p className="mt-0.5 font-display text-[18px] font-medium leading-tight text-[var(--ink)]">{item.title}</p>
                    </div>
                    <span className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border ${active ? "border-[var(--rosewood)] bg-[var(--rosewood)] text-white" : "border-[oklch(0.80_0.02_52)]"}`}>
                      {active && <Check size={10} strokeWidth={3} />}
                    </span>
                  </div>
                  <p className="mt-2 text-[12px] leading-4 text-[oklch(0.5_0.02_35)]">{item.desc}</p>
                </button>
              );
            })}
          </div>
          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="button-ink min-h-[44px] px-5 text-[10px]"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="button-rose min-h-[44px] px-6 text-[10px]"
            >
              Continue to Flavor Profile <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Flavor Preference */}
      {step === 3 && (
        <div className="py-6 animate-[fadeUp_300ms_cubic-bezier(0.16,1,0.3,1)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[oklch(0.52_0.02_35)]">
            Step 03 / 03 · What flavor notes excite your palate?
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { id: "floral", label: "Floral & Herbaceous", desc: "Vanilla bean, elderflower preserve, lavender mist & garden petals" },
              { id: "chocolate", label: "Decadent Chocolate", desc: "70% Valrhona sponge, dark cacao ganache & salted butter caramel" },
              { id: "citrus", label: "Bright Citrus", desc: "Meyer lemon curd, olive oil crumb, elderflower & mascarpone" },
              { id: "vanilla", label: "Classic Velvet Vanilla", desc: "Madagascar bourbon vanilla crumb, raspberry preserve & sweet cream" },
            ].map((item) => {
              const active = profile === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setProfile(item.id as Profile)}
                  className={`border p-4 text-left transition-all min-h-[96px] flex flex-col justify-between ${
                    active
                      ? "border-[var(--rosewood)] bg-[oklch(0.94_0.03_13)] shadow-[inset_0_0_0_1px_var(--rosewood)]"
                      : "border-[oklch(0.86_0.02_52)] bg-[oklch(0.995_0.004_80)] hover:border-[oklch(0.72_0.03_18)] hover:bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-display text-[17px] font-medium leading-tight text-[var(--ink)]">
                      {item.label}
                    </span>
                    <span className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border ${active ? "border-[var(--rosewood)] bg-[var(--rosewood)] text-white" : "border-[oklch(0.80_0.02_52)]"}`}>
                      {active && <Check size={10} strokeWidth={3} />}
                    </span>
                  </div>
                  <p className="mt-2 text-[12px] leading-4 text-[oklch(0.5_0.02_35)]">{item.desc}</p>
                </button>
              );
            })}
          </div>
          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="button-ink min-h-[44px] px-5 text-[10px]"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <button
              onClick={() => {
                setStep(4);
                toast.success("Perfect match calculated!", { description: `Revealing your tailored cake design.` });
              }}
              className="button-rose min-h-[44px] px-6 text-[10px]"
            >
              Reveal My Matched Cake <Sparkles size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Result Match Display */}
      {step === 4 && (
        <div className="py-6 animate-[fadeUp_340ms_cubic-bezier(0.16,1,0.3,1)]">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr] items-center border border-[oklch(0.86_0.02_52)] bg-[oklch(0.985_0.006_75)] p-5 sm:p-7">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[var(--rosewood)] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-white">
                  98% Match
                </span>
                <span className="rounded-full border border-[oklch(0.86_0.02_52)] bg-white px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[oklch(0.48_0.02_35)]">
                  {currentRec.tag}
                </span>
                <span className="text-[11px] font-semibold text-[oklch(0.52_0.02_35)] ml-auto">
                  {currentRec.serves}
                </span>
              </div>

              <div>
                <h4 className="font-display text-[28px] sm:text-[34px] font-medium leading-none tracking-[-0.02em] text-[var(--ink)]">
                  {currentRec.title}
                </h4>
                <p className="mt-1 text-[13px] text-[var(--rosewood)] font-semibold uppercase tracking-[0.08em]">
                  {currentRec.subtitle}
                </p>
              </div>

              <p className="text-[13.5px] leading-6 text-[oklch(0.44_0.02_35)]">
                {currentRec.story}
              </p>

              <div className="space-y-2 border-y border-[oklch(0.91_0.015_52)] py-3 text-[12.5px]">
                <div className="flex justify-between gap-4">
                  <span className="font-medium text-[oklch(0.52_0.02_35)]">Flavor Notes:</span>
                  <span className="text-right text-[var(--ink)] font-semibold">{currentRec.flavor}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="font-medium text-[oklch(0.52_0.02_35)]">Preserve / Filling:</span>
                  <span className="text-right text-[var(--ink)] font-semibold">{currentRec.filling}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="font-medium text-[oklch(0.52_0.02_35)]">Exterior Finish:</span>
                  <span className="text-right text-[var(--ink)] font-semibold">{currentRec.finish}</span>
                </div>
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[oklch(0.52_0.02_35)]">
                  Starting Price
                </span>
                <span className="font-display text-[32px] font-medium leading-none tracking-[-0.02em] text-[var(--ink)]">
                  ${currentRec.price}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  onClick={handleAddMatched}
                  className="button-rose flex-1 justify-center min-h-[44px] text-[10px]"
                >
                  <ShoppingBag size={14} /> Add Matched Cake to Bag — ${currentRec.price}
                </button>
                <button
                  onClick={() => toggle(favKey, currentRec.title)}
                  className={`grid h-11 w-11 min-h-[44px] min-w-[44px] place-items-center rounded-full border transition-colors ${
                    isFav
                      ? "border-[var(--rosewood)] bg-[var(--rosewood)] text-white"
                      : "border-[oklch(0.86_0.02_52)] bg-white text-[oklch(0.34_0.02_35)] hover:border-[var(--rosewood)] hover:text-[var(--rosewood)]"
                  }`}
                  aria-label="Save to favorites"
                >
                  <Heart size={16} className={isFav ? "fill-white" : ""} />
                </button>
              </div>

              <div className="flex items-center justify-between pt-2">
                <Link
                  href="/custom-order"
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--rosewood)] underline decoration-[var(--rosewood)]/30 underline-offset-4 hover:decoration-[var(--rosewood)]"
                >
                  Open in Custom Order Studio →
                </Link>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-[oklch(0.52_0.02_35)] hover:text-[var(--ink)]"
                >
                  <RotateCcw size={12} /> Retake quiz
                </button>
              </div>
            </div>

            {/* Cake visual tile */}
            <div className="relative overflow-hidden border border-[oklch(0.88_0.018_52)] bg-[oklch(0.96_0.008_72)] p-2">
              <div className="aspect-[1.05] overflow-hidden">
                <img
                  src={currentRec.image}
                  alt={currentRec.title}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="absolute top-4 left-4 border border-black/10 bg-white/90 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.14em] backdrop-blur-md">
                Matched Look
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
