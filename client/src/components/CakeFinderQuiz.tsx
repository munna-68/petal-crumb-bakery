import { useState } from "react";
import { Sparkles, ArrowRight, ArrowLeft, RotateCcw, ShoppingBag, Check, Heart } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { withBase } from "@/lib/withBase";
import { ScriptNote } from "@/components/decor";

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

  const choiceBase =
    "group relative min-h-[96px] rounded-2xl border-[1.5px] p-4 text-left transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:ring-2 focus-visible:ring-[var(--terra)] focus-visible:ring-offset-2";

  return (
    <div
      data-reveal="up"
      className="rounded-[2rem] bg-[var(--paper)] p-6 shadow-[0_20px_60px_oklch(0.305_0.033_42/0.07)] sm:p-9 lg:p-11"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6">
        <div>
          <p className="eyebrow">Find your cake</p>
          <h3 className="mt-2 font-display text-[27px] sm:text-[33px] font-semibold leading-none tracking-[-0.015em]">
            Three little questions, one <em className="italic text-[var(--terra)]">lovely</em> match
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          {[1, 2, 3].map((num) => (
            <span
              key={num}
              className={`grid h-8 w-8 place-items-center rounded-full text-[12px] font-extrabold transition-all ${
                step === num
                  ? "bg-[var(--terra)] text-white shadow-[0_4px_12px_oklch(0.615_0.115_27/0.3)]"
                  : step > num
                  ? "bg-[var(--blush)] text-[var(--terra)]"
                  : "bg-[var(--cream)] text-[var(--ink-mute)]"
              }`}
            >
              {step > num ? <Check size={13} strokeWidth={2.6} /> : num}
            </span>
          ))}
          <span className="ml-2 hidden text-[12.5px] font-bold text-[var(--ink-mute)] sm:inline">
            {step === 1 ? "Occasion" : step === 2 ? "Guest count" : step === 3 ? "Flavor" : "Your match"}
          </span>
        </div>
      </div>

      {/* Step 1: Occasion */}
      {step === 1 && (
        <div className="py-4 animate-[fadeUp_300ms_cubic-bezier(0.16,1,0.3,1)]">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
                  aria-pressed={active}
                  className={`${choiceBase} flex flex-col justify-between ${
                    active
                      ? "border-[var(--terra)] bg-[var(--blush)]/60"
                      : "border-[oklch(0.89_0.025_62)] bg-[var(--cream)] hover:border-[oklch(0.78_0.045_50)] hover:bg-white"
                  }`}
                >
                  <span className="flex items-start justify-between gap-2">
                    <span className="font-display text-[17.5px] font-semibold leading-snug text-[var(--ink)]">{item.label}</span>
                    <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-[1.5px] ${active ? "border-[var(--terra)] bg-[var(--terra)] text-white" : "border-[oklch(0.8_0.035_55)]"}`}>
                      {active && <Check size={11} strokeWidth={3} />}
                    </span>
                  </span>
                  <span className="mt-2 block text-[12.5px] leading-4 text-[var(--ink-mute)]">{item.desc}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-6 flex justify-end">
            <button onClick={() => setStep(2)} className="button-rose min-h-[46px] px-6">
              Continue <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Guest Count / Size */}
      {step === 2 && (
        <div className="py-4 animate-[fadeUp_300ms_cubic-bezier(0.16,1,0.3,1)]">
          <div className="grid gap-3 sm:grid-cols-3">
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
                  aria-pressed={active}
                  className={`${choiceBase} flex min-h-[112px] flex-col justify-between ${
                    active
                      ? "border-[var(--terra)] bg-[var(--blush)]/60"
                      : "border-[oklch(0.89_0.025_62)] bg-[var(--cream)] hover:border-[oklch(0.78_0.045_50)] hover:bg-white"
                  }`}
                >
                  <span className="flex items-start justify-between gap-2">
                    <span>
                      <span className="block text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--terra)]">{item.label}</span>
                      <span className="mt-1 block font-display text-[18.5px] font-semibold leading-tight text-[var(--ink)]">{item.title}</span>
                    </span>
                    <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-[1.5px] ${active ? "border-[var(--terra)] bg-[var(--terra)] text-white" : "border-[oklch(0.8_0.035_55)]"}`}>
                      {active && <Check size={11} strokeWidth={3} />}
                    </span>
                  </span>
                  <span className="mt-2 block text-[12.5px] leading-4 text-[var(--ink-mute)]">{item.desc}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-6 flex justify-between">
            <button onClick={() => setStep(1)} className="button-ink min-h-[46px] px-5"><ArrowLeft size={15} /> Back</button>
            <button onClick={() => setStep(3)} className="button-rose min-h-[46px] px-6">Continue <ArrowRight size={15} /></button>
          </div>
        </div>
      )}

      {/* Step 3: Flavor Preference */}
      {step === 3 && (
        <div className="py-4 animate-[fadeUp_300ms_cubic-bezier(0.16,1,0.3,1)]">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
                  aria-pressed={active}
                  className={`${choiceBase} flex flex-col justify-between ${
                    active
                      ? "border-[var(--terra)] bg-[var(--blush)]/60"
                      : "border-[oklch(0.89_0.025_62)] bg-[var(--cream)] hover:border-[oklch(0.78_0.045_50)] hover:bg-white"
                  }`}
                >
                  <span className="flex items-start justify-between gap-2">
                    <span className="font-display text-[17.5px] font-semibold leading-snug text-[var(--ink)]">{item.label}</span>
                    <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-[1.5px] ${active ? "border-[var(--terra)] bg-[var(--terra)] text-white" : "border-[oklch(0.8_0.035_55)]"}`}>
                      {active && <Check size={11} strokeWidth={3} />}
                    </span>
                  </span>
                  <span className="mt-2 block text-[12.5px] leading-4 text-[var(--ink-mute)]">{item.desc}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-6 flex justify-between">
            <button onClick={() => setStep(2)} className="button-ink min-h-[46px] px-5"><ArrowLeft size={15} /> Back</button>
            <button
              onClick={() => {
                setStep(4);
                toast.success("Perfect match calculated!", { description: `Revealing your tailored cake design.` });
              }}
              className="button-rose min-h-[46px] px-6"
            >
              Reveal my cake <Sparkles size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Result */}
      {step === 4 && (
        <div className="py-4 animate-[fadeUp_340ms_cubic-bezier(0.16,1,0.3,1)]">
          <div className="grid items-center gap-7 rounded-[1.5rem] bg-[var(--cream)] p-5 sm:p-8 lg:grid-cols-[1.1fr_.9fr]">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[var(--terra)] px-3 py-1 text-[10.5px] font-extrabold uppercase tracking-[0.12em] text-white">
                  98% match
                </span>
                <span className="rounded-full bg-[var(--blush)] px-3 py-1 text-[10.5px] font-extrabold uppercase tracking-[0.12em] text-[oklch(0.45_0.08_20)]">
                  {currentRec.tag}
                </span>
                <span className="ml-auto text-[12px] font-bold text-[var(--ink-mute)]">{currentRec.serves}</span>
              </div>

              <div>
                <h4 className="font-display text-[29px] sm:text-[35px] font-semibold leading-none tracking-[-0.015em] text-[var(--ink)]">
                  {currentRec.title}
                </h4>
                <p className="mt-1.5 text-[12.5px] font-extrabold uppercase tracking-[0.1em] text-[var(--terra)]">{currentRec.subtitle}</p>
              </div>

              <p className="text-[14px] leading-6 text-[var(--ink-soft)]">{currentRec.story}</p>

              <div className="space-y-2 border-y border-[oklch(0.9_0.022_65)] py-3.5 text-[13px]">
                <div className="flex justify-between gap-4">
                  <span className="font-semibold text-[var(--ink-mute)]">Flavor notes</span>
                  <span className="text-right font-bold text-[var(--ink)]">{currentRec.flavor}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="font-semibold text-[var(--ink-mute)]">Filling</span>
                  <span className="text-right font-bold text-[var(--ink)]">{currentRec.filling}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="font-semibold text-[var(--ink-mute)]">Finish</span>
                  <span className="text-right font-bold text-[var(--ink)]">{currentRec.finish}</span>
                </div>
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <span className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-[var(--ink-mute)]">Starting at</span>
                <span className="font-display text-[33px] font-semibold leading-none tracking-[-0.015em] text-[var(--ink)]">${currentRec.price}</span>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <button onClick={handleAddMatched} className="button-rose min-h-[46px] flex-1">
                  <ShoppingBag size={15} /> Add to bag — ${currentRec.price}
                </button>
                <button
                  onClick={() => toggle(favKey, currentRec.title)}
                  className={`grid h-11 w-11 min-h-[44px] min-w-[44px] place-items-center rounded-full transition-colors ${
                    isFav ? "bg-[var(--terra)] text-white" : "border-[1.5px] border-[oklch(0.85_0.03_58)] bg-white text-[var(--ink-soft)] hover:border-[var(--terra)] hover:text-[var(--terra)]"
                  }`}
                  aria-label="Save to favorites"
                >
                  <Heart size={16} className={isFav ? "fill-white" : ""} />
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <Link href="/custom-order" className="link-underline text-[13px] font-extrabold text-[var(--terra)]">
                  Open in the order studio →
                </Link>
                <button onClick={handleReset} className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-[var(--ink-mute)] hover:text-[var(--ink)]">
                  <RotateCcw size={13} /> Retake
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="visual-tile aspect-[1.05]">
                <img src={currentRec.image} alt={currentRec.title} className="h-full w-full object-cover" />
              </div>
              <p className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[var(--paper)] px-4 py-1.5 shadow-[0_8px_20px_oklch(0.305_0.033_42/0.12)]">
                <ScriptNote className="text-[17px]">your matched look</ScriptNote>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
