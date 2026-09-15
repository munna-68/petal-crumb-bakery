/**
 * Quiet Patisserie Editorial — order studio
 * Calm, structured, live-quoted. Every choice shows price instantly.
 * Polished: editorial steppers, aligned calendar grid, hairline quote,
 * accessible fields, expo motion, and a single bloom delight on confirmation.
 */
import { useEffect, useMemo, useState, useRef } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  ImagePlus,
  MapPin,
  Minus,
  Plus,
  Sparkles,
  Truck,
  Info,
  ShieldCheck,
} from "lucide-react";
import { Link } from "wouter";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

type ProductType = "cake" | "cupcakes" | "cookies" | "custom";
type Fulfillment = "pickup" | "delivery";
type CakeSize = "6-inch" | "8-inch" | "tiered";

const productOptions: { id: ProductType; title: string; detail: string }[] = [
  { id: "cake", title: "Celebration cake", detail: "Layers, filling, florals, the works." },
  { id: "cupcakes", title: "Cupcakes", detail: "A dozen (or a few) to pass around." },
  { id: "cookies", title: "Iced cookies", detail: "A sweet little favor or set." },
  { id: "custom", title: "Something custom", detail: "A thoughtful studio consultation." },
];

const sizes: Record<CakeSize, { label: string; detail: string; price: number }> = {
  "6-inch": { label: "6 inch", detail: "Serves 8–12", price: 84 },
  "8-inch": { label: "8 inch", detail: "Serves 16–20", price: 118 },
  tiered: { label: "Two tier", detail: "Serves 35–45", price: 240 },
};

const toKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const addDays = (date: Date, days: number) => {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
};
const currency = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
const formatLongDate = (key: string) =>
  key ? new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(new Date(`${key}T12:00:00`)) : "Choose a date";
const formatShortMonth = (date: Date) => new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(date);

function ChoiceButton({
  active,
  onClick,
  label,
  detail,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  detail?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`group relative min-h-[74px] border p-3.5 text-left transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:ring-2 focus-visible:ring-[var(--rosewood)] focus-visible:ring-offset-2 focus-visible:ring-offset-[oklch(0.982_0.008_75)] ${
        active
          ? "border-[var(--rosewood)] bg-[oklch(0.94_0.03_13)] shadow-[inset_0_0_0_1px_var(--rosewood)]"
          : "border-[oklch(0.86_0.018_52)] bg-[oklch(0.995_0.004_80)] hover:border-[oklch(0.72_0.03_18)] hover:bg-white hover:shadow-[0_6px_18px_oklch(0.25_0.018_35/0.06)] hover:-translate-y-[1px]"
      }`}
    >
      <span className="flex items-start justify-between gap-3">
        <span className="text-[14px] font-semibold leading-5 text-[oklch(0.28_0.02_35)]">{label}</span>
        <span
          className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border text-white transition-all duration-200 ${
            active ? "border-[var(--rosewood)] bg-[var(--rosewood)] scale-100" : "border-[oklch(0.84_0.02_52)] bg-white scale-90 opacity-60 group-hover:opacity-100 group-hover:scale-100"
          }`}
          aria-hidden
        >
          <Check size={11} strokeWidth={2.6} className={`${active ? "opacity-100" : "opacity-0 group-hover:opacity-40"} transition-opacity`} />
        </span>
      </span>
      {detail && <span className="mt-1.5 block text-[12.5px] leading-5 text-[oklch(0.5_0.02_35)]">{detail}</span>}
    </button>
  );
}

function FieldLabel({ children, htmlFor, required }: { children: React.ReactNode; htmlFor?: string; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[oklch(0.34_0.02_35)]">
      <span className="inline-flex flex-wrap items-baseline gap-1.5">
        {children} {required && <span className="text-[var(--rosewood)]" aria-hidden>*</span>}
      </span>
    </label>
  );
}

export default function CustomOrder() {
  const [product, setProduct] = useState<ProductType>("cake");
  const [cakeSize, setCakeSize] = useState<CakeSize>("8-inch");
  const [flavor, setFlavor] = useState("Vanilla bean");
  const [filling, setFilling] = useState("Vanilla buttercream");
  const [frosting, setFrosting] = useState("Textured buttercream");
  const [complexity, setComplexity] = useState("Semi-custom");
  const [quantity, setQuantity] = useState(12);
  const [packaging, setPackaging] = useState("Classic box");
  const [rush, setRush] = useState(false);
  const [fulfillment, setFulfillment] = useState<Fulfillment>("pickup");
  const [allergies, setAllergies] = useState<string[]>([]);
  const [fileName, setFileName] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [stage, setStage] = useState<"build" | "confirmed">("build");
  const fileRef = useRef<HTMLInputElement>(null);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const days = useMemo(() => Array.from({ length: 28 }, (_, i) => addDays(today, i + 1)), [today]);
  const fullDates = useMemo(
    () => new Set([toKey(addDays(today, 10)), toKey(addDays(today, 17)), toKey(addDays(today, 24))]),
    [today]
  );
  const leadTime = rush ? 1 : 5;
  const firstAvailable = useMemo(
    () => days.find((day, idx) => idx + 1 >= leadTime && !fullDates.has(toKey(day))),
    [days, fullDates, leadTime]
  );

  // align calendar to weekday grid — prepend blanks so first day lands correctly
  const firstWeekday = days[0]?.getDay() ?? 0; // 0 Sun
  const leadingBlanks = Array.from({ length: firstWeekday }, (_, i) => `blank-${i}`);

  useEffect(() => {
    const current = days.find((d) => toKey(d) === selectedDate);
    const invalid = !current || days.indexOf(current) + 1 < leadTime || fullDates.has(selectedDate);
    if (invalid && firstAvailable) setSelectedDate(toKey(firstAvailable));
  }, [firstAvailable, days, fullDates, leadTime, selectedDate]);

  const lineItems = useMemo(() => {
    const items: { label: string; price: number }[] = [];
    if (product === "cake") {
      items.push({ label: `${sizes[cakeSize].label} celebration cake`, price: sizes[cakeSize].price });
      const flavorPrice: Record<string, number> = { "Vanilla bean": 0, "Dark chocolate": 4, "Lemon olive oil": 5, "Strawberry milk": 6 };
      const fillingPrice: Record<string, number> = {
        "Vanilla buttercream": 0,
        "Raspberry preserve": 9,
        "Salted caramel": 8,
        "Lemon curd": 8,
      };
      const frostingPrice: Record<string, number> = { "Smooth finish": 0, "Textured buttercream": 18, "Floral finish": 42 };
      const complexityPrice: Record<string, number> = { Simple: 0, "Semi-custom": 35, "Full custom": 85 };
      if (flavorPrice[flavor]) items.push({ label: flavor, price: flavorPrice[flavor] });
      if (fillingPrice[filling]) items.push({ label: filling, price: fillingPrice[filling] });
      if (frostingPrice[frosting]) items.push({ label: frosting, price: frostingPrice[frosting] });
      if (complexityPrice[complexity]) items.push({ label: complexity, price: complexityPrice[complexity] });
    }
    if (product === "cupcakes")
      items.push({ label: `${quantity} signature cupcakes`, price: quantity === 12 ? 42 : quantity === 24 ? 78 : 112 });
    if (product === "cookies") {
      items.push({ label: `${quantity} hand-iced cookies`, price: quantity === 12 ? 34 : quantity === 24 ? 64 : 90 });
      if (packaging === "Gift-ready ribbon") items.push({ label: "Gift-ready ribbon", price: 8 });
    }
    if (product === "custom") items.push({ label: "Custom cake consultation", price: 150 });
    const preRush = items.reduce((s, it) => s + it.price, 0);
    if (rush) items.push({ label: "Rush kitchen priority", price: Math.ceil(preRush * 0.35) });
    if (fulfillment === "delivery") items.push({ label: "Local delivery", price: 18 });
    return items;
  }, [cakeSize, complexity, filling, flavor, frosting, fulfillment, packaging, product, quantity, rush]);

  const total = lineItems.reduce((s, it) => s + it.price, 0);
  const deposit = Math.ceil(total / 2);
  const balance = total - deposit;

  const toggleAllergy = (tag: string) => setAllergies((c) => (c.includes(tag) ? c.filter((i) => i !== tag) : [...c, tag]));
  const chooseProduct = (type: ProductType) => {
    setProduct(type);
    if (type === "cupcakes" || type === "cookies") setQuantity(12);
  };

  if (stage === "confirmed") {
    return <Confirmation total={total} deposit={deposit} balance={balance} selectedDate={selectedDate} fulfillment={fulfillment} product={product} onEdit={() => setStage("build")} />;
  }

  const monthLabel = formatShortMonth(days[0] ?? today);

  return (
    <div className="min-h-screen bg-[oklch(0.974_0.008_75)] text-[var(--ink)]">
      <SiteHeader />
      <main id="main" className="container pb-28 pt-6 sm:pb-32 lg:pb-16 sm:pt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-[2px] py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[oklch(0.52_0.02_35)] transition-colors hover:text-[var(--rosewood)] focus-visible:outline-offset-4"
        >
          <ArrowLeft size={14} strokeWidth={2.1} /> Back to the studio
        </Link>

        <div className="order-studio-grid mt-6 lg:mt-8">
          <form onSubmit={(e) => { e.preventDefault(); setStage("confirmed"); }} className="min-w-0" noValidate>
            {/* header */}
            <div className="border-b border-[oklch(0.88_0.018_52)] pb-8">
              <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--rosewood)]">
                <span className="h-px w-6 bg-[var(--rosewood)]" aria-hidden /> Custom order studio
                <span className="ml-2 hidden items-center gap-1.5 rounded-full border border-[oklch(0.88_0.018_52)] bg-white px-2.5 py-1 text-[9px] tracking-[0.12em] text-[oklch(0.52_0.02_35)] sm:inline-flex">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden /> Live estimate
                </span>
              </div>
              <h1 className="display-title mt-3 text-[44px] leading-[0.92] sm:text-[56px] lg:text-[68px]">
                Build your
                <br />
                <em>celebration.</em>
              </h1>
              <p className="prose-measure mt-4 max-w-[54ch] text-[14px] leading-6 text-[oklch(0.44_0.02_35)] sm:text-[15px] sm:leading-7">
                Choose a few thoughtful details. Your quote updates as you go, so there are no mystery messages or spreadsheet surprises.
              </p>
              {/* progress */}
              <div className="mt-6 flex items-center gap-2">
                {["Details", "Make it yours", "Date", "Finish"].map((label, i) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="hidden text-[10px] font-bold uppercase tracking-[0.1em] text-[oklch(0.52_0.02_35)] sm:inline">{String(i + 1).padStart(2, "0")} · {label}</span>
                    <span className="sm:hidden grid h-6 w-6 place-items-center rounded-full border text-[10px] font-bold border-[oklch(0.86_0.02_52)] text-[oklch(0.52_0.02_35)]">{i + 1}</span>
                    {i < 3 && <span className="h-px w-6 bg-[oklch(0.90_0.015_52)] sm:w-8" aria-hidden />}
                  </div>
                ))}
              </div>
            </div>

            {/* STEP 01 */}
            <section className="border-b border-[oklch(0.88_0.018_52)] py-7 sm:py-8">
              <StepTitle step="01" title="What are we making?" helper="We’ll tailor the questions to your sweet thing." />
              <fieldset className="mt-6 grid gap-3 sm:grid-cols-2">
                <legend className="sr-only">Product type</legend>
                {productOptions.map((item) => (
                  <ChoiceButton
                    key={item.id}
                    active={product === item.id}
                    onClick={() => chooseProduct(item.id as ProductType)}
                    label={item.title}
                    detail={item.detail}
                  />
                ))}
              </fieldset>
            </section>

            {/* STEP 02 */}
            <section className="border-b border-[oklch(0.88_0.018_52)] py-7 sm:py-8">
              <StepTitle step="02" title="Make it yours" helper="Your selections update the estimate right away." />
              {product === "cake" && (
                <div className="mt-6 space-y-7">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[oklch(0.34_0.02_35)]">Size &amp; servings</p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-3">
                      {(Object.keys(sizes) as CakeSize[]).map((key) => (
                        <ChoiceButton
                          key={key}
                          active={cakeSize === key}
                          onClick={() => setCakeSize(key)}
                          label={sizes[key].label}
                          detail={`${sizes[key].detail} · ${currency(sizes[key].price)}`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <SelectField label="Cake flavor" value={flavor} onChange={setFlavor} options={["Vanilla bean", "Dark chocolate", "Lemon olive oil", "Strawberry milk"]} />
                    <SelectField label="Filling" value={filling} onChange={setFilling} options={["Vanilla buttercream", "Raspberry preserve", "Salted caramel", "Lemon curd"]} />
                    <SelectField label="Frosting finish" value={frosting} onChange={setFrosting} options={["Smooth finish", "Textured buttercream", "Floral finish"]} />
                    <SelectField label="Design complexity" value={complexity} onChange={setComplexity} options={["Simple", "Semi-custom", "Full custom"]} />
                  </div>
                </div>
              )}
              {product === "cupcakes" && (
                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  <QuantityChooser label="How many cupcakes?" value={quantity} onChange={setQuantity} />
                  <SelectField label="Flavor" value={flavor} onChange={setFlavor} options={["Vanilla bean", "Dark chocolate", "Lemon olive oil", "Strawberry milk"]} />
                </div>
              )}
              {product === "cookies" && (
                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  <QuantityChooser label="How many cookies?" value={quantity} onChange={setQuantity} />
                  <SelectField label="Packaging" value={packaging} onChange={setPackaging} options={["Classic box", "Gift-ready ribbon"]} />
                </div>
              )}
              {product === "custom" && (
                <div className="mt-6 border border-[oklch(0.86_0.02_52)] bg-[oklch(0.94_0.03_13)] p-5 sm:p-6">
                  <p className="font-display text-[22px] leading-none tracking-[-0.02em] sm:text-2xl">A considered consult, then a clear plan.</p>
                  <p className="prose-measure mt-2.5 max-w-[52ch] text-[14px] leading-6 text-[oklch(0.46_0.02_35)]">
                    For sculpted cakes, multiple desserts, or an idea that needs a little room to breathe, the studio consult covers concepting and a tailored proposal. We’ll meet, sketch, and price transparently.
                  </p>
                  <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--rosewood)]">
                    <Info size={13} strokeWidth={1.9} /> 60 min · in studio or video
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={() => setRush((c) => !c)}
                aria-pressed={rush}
                className={`mt-7 flex w-full items-start gap-4 border p-4 text-left transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[var(--rosewood)] focus-visible:ring-offset-2 sm:p-4.5 ${
                  rush
                    ? "border-[var(--rosewood)] bg-[oklch(0.94_0.03_13)] shadow-[inset_0_0_0_1px_var(--rosewood)]"
                    : "border-[oklch(0.86_0.018_52)] bg-white hover:border-[oklch(0.72_0.03_18)] hover:bg-[oklch(0.995_0.004_80)]"
                }`}
              >
                <span
                  className={`mt-0.5 grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full border transition-colors ${rush ? "border-[var(--rosewood)] bg-[var(--rosewood)] text-white" : "border-[oklch(0.80_0.02_52)] bg-white text-transparent"}`}
                  aria-hidden
                >
                  <Check size={13} strokeWidth={2.7} />
                </span>
                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-2 text-[13px] font-semibold leading-5">
                    <Clock3 size={15} strokeWidth={1.9} className="text-[var(--rosewood)]" /> Need it sooner?
                    {rush && <span className="rounded-full bg-[var(--rosewood)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-white">Rush active · +35%</span>}
                  </span>
                  <span className="mt-1 block text-[12.5px] leading-5 text-[oklch(0.5_0.02_35)]">
                    Rush kitchen priority can open limited dates inside the usual five-day lead time. A clearly shown 35% rush fee applies and is itemized in your total.
                  </span>
                </span>
              </button>
            </section>

            {/* STEP 03 — calendar */}
            <section className="border-b border-[oklch(0.88_0.018_52)] py-7 sm:py-8">
              <StepTitle
                step="03"
                title="Choose an available date"
                helper={rush ? "Rush dates may be available from tomorrow." : "Custom cakes need five full days’ notice. Max 3 per day."}
              />
              <div className="mt-6 overflow-hidden border border-[oklch(0.86_0.02_52)] bg-white shadow-[0_10px_30px_oklch(0.25_0.018_35/0.04)]">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[oklch(0.91_0.015_52)] bg-[oklch(0.97_0.008_72)] px-3 py-3 sm:px-4 sm:py-3.5">
                  <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold tracking-[-0.01em]">
                    <CalendarDays size={15} strokeWidth={1.9} className="text-[var(--rosewood)]" /> Kitchen availability
                    <span className="hidden text-[11px] font-normal text-[oklch(0.52_0.02_35)] min-[360px]:inline">· {monthLabel}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[9.5px] sm:text-[10px] font-bold uppercase tracking-[0.11em] text-[oklch(0.52_0.02_35)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Max 3 per day
                  </span>
                </div>
                <div className="calendar-seven border-b border-[oklch(0.91_0.015_52)] bg-white">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                    <span key={d} className="py-2 text-center text-[9.5px] sm:text-[10px] font-bold uppercase tracking-[0.1em] text-[oklch(0.58_0.03_35)]">
                      {d}
                    </span>
                  ))}
                </div>
                <div className="calendar-seven bg-white">
                  {/* leading blanks */}
                  {leadingBlanks.map((k) => (
                    <span key={k} className="aspect-square border-b border-r border-[oklch(0.94_0.01_52)] bg-[oklch(0.98_0.005_75)]" aria-hidden />
                  ))}
                  {days.map((day, idx) => {
                    const key = toKey(day);
                    const blockedByLead = idx + 1 < leadTime;
                    const isFull = fullDates.has(key);
                    const disabled = blockedByLead || isFull;
                    const active = selectedDate === key;
                    const todayKey = toKey(today);
                    const isToday = key === todayKey;
                    const capacityLabel = isFull ? "Full" : blockedByLead ? "Lead" : idx % 4 === 0 ? "2 left" : "Open";
                    return (
                      <button
                        key={key}
                        type="button"
                        disabled={disabled}
                        onClick={() => setSelectedDate(key)}
                        aria-pressed={active}
                        aria-label={`${formatLongDate(key)} — ${capacityLabel}`}
                        className={`relative flex aspect-square flex-col items-center justify-center border-b border-r p-0.5 sm:p-1 text-center transition-all duration-150 focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-[var(--rosewood)] focus-visible:ring-inset
                          ${disabled ? "cursor-not-allowed bg-[oklch(0.97_0.008_72)] text-[oklch(0.72_0.015_52)]" : active ? "z-[1] bg-[var(--rosewood)] text-white shadow-[inset_0_0_0_1px_oklch(0.44_0.09_18)]" : "bg-white text-[oklch(0.28_0.02_35)] hover:bg-[oklch(0.94_0.03_13)] hover:text-[var(--ink)]"}`}
                      >
                        <span className={`text-[12px] sm:text-[13px] font-semibold leading-none ${isToday && !disabled && !active ? "rounded-full bg-[oklch(0.94_0.03_13)] px-1 sm:px-1.5 py-0.5 sm:py-1 ring-1 ring-[var(--rosewood)]/25" : ""}`}>
                          {day.getDate()}
                        </span>
                        <span
                          className={`mt-0.5 sm:mt-1 max-w-full truncate rounded-full px-1 sm:px-1.5 py-0.5 text-[7px] min-[360px]:text-[8px] font-bold uppercase tracking-[0.04em] sm:tracking-[0.07em] leading-none ${
                            active ? "bg-white/15 text-white" : disabled ? "bg-transparent text-[oklch(0.66_0.015_52)]" : capacityLabel === "2 left" ? "bg-amber-500/12 text-amber-900" : capacityLabel === "Open" ? "bg-emerald-500/10 text-emerald-900" : "bg-transparent"
                          }`}
                        >
                          <span className="hidden min-[380px]:inline">{isFull ? "Full" : blockedByLead ? "Lead" : capacityLabel}</span>
                          <span className="min-[380px]:hidden">{isFull ? "✕" : blockedByLead ? "—" : capacityLabel === "2 left" ? "2" : "•"}</span>
                        </span>
                        {isToday && !disabled && !active && <span className="absolute bottom-1 sm:bottom-1.5 h-1 w-1 rounded-full bg-[var(--rosewood)]" aria-hidden />}
                      </button>
                    );
                  })}
                </div>
                <div className="flex flex-wrap gap-3 border-t border-[oklch(0.91_0.015_52)] bg-[oklch(0.97_0.008_72)] px-4 py-3 text-[11px] leading-5">
                  <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Open</span>
                  <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500" /> 2 left</span>
                  <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[oklch(0.72_0.015_52)]" /> Full / Lead time</span>
                  <span className="ml-auto hidden items-center gap-1.5 font-medium text-[oklch(0.52_0.02_35)] sm:inline-flex"><Info size={12} /> Dates update live</span>
                </div>
              </div>
              <p className="mt-3 flex items-center gap-2 text-[12.5px] leading-5 text-[oklch(0.46_0.02_35)]">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-[oklch(0.94_0.03_13)] text-[var(--rosewood)]"><CalendarDays size={12} strokeWidth={2} /></span>
                <span className="font-medium">{formatLongDate(selectedDate)}</span>
                <span className="hidden text-[oklch(0.58_0.03_35)] sm:inline">· {selectedDate ? "Your kitchen hold" : "Pick a day to see pricing"}</span>
              </p>
            </section>

            {/* STEP 04 */}
            <section className="border-b border-[oklch(0.88_0.018_52)] py-7 sm:py-8">
              <StepTitle step="04" title="The finishing details" helper="A few helpful notes so your cake arrives just right." />
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="c-name" required>Your name</FieldLabel>
                  <input id="c-name" required name="name" autoComplete="name" className="field-base mt-2" placeholder="Your name" />
                </div>
                <div>
                  <FieldLabel htmlFor="c-email" required>Email for your order details</FieldLabel>
                  <input id="c-email" required name="email" type="email" autoComplete="email" className="field-base mt-2" placeholder="you@example.com" />
                </div>
                <div>
                  <FieldLabel htmlFor="c-time">Preferred pickup / delivery time</FieldLabel>
                  <select id="c-time" className="field-base mt-2" defaultValue="12:00 PM">
                    <option>10:00 AM</option>
                    <option>12:00 PM</option>
                    <option>2:00 PM</option>
                    <option>4:00 PM</option>
                  </select>
                  <p className="mt-1.5 text-[11px] leading-4 text-[oklch(0.58_0.03_18)]">We’ll confirm the window after review.</p>
                </div>
                <div>
                  <FieldLabel htmlFor="c-file">Inspiration photo</FieldLabel>
                  <div className="relative mt-2">
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="field-base flex min-h-[46px] items-center gap-2.5 pr-3 text-left text-[13px] font-normal text-[oklch(0.5_0.02_35)] hover:border-[oklch(0.72_0.03_18)] focus-visible:border-[var(--rosewood)]"
                    >
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-[oklch(0.94_0.03_13)] text-[var(--rosewood)]">
                        <ImagePlus size={14} strokeWidth={1.9} />
                      </span>
                      <span className="min-w-0 flex-1 truncate">{fileName || "Add a reference image (optional)"}</span>
                      <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.08em] text-[oklch(0.58_0.03_18)]">Browse</span>
                    </button>
                    <input
                      ref={fileRef}
                      onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      tabIndex={-1}
                      aria-hidden
                    />
                  </div>
                  <p className="mt-1.5 text-[11px] leading-4 text-[oklch(0.58_0.03_18)]">JPG or PNG, up to 10 MB. Helps us match your vision.</p>
                </div>
              </div>

              <div className="mt-7">
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[oklch(0.34_0.02_35)]">Pickup or delivery?</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2" role="group" aria-label="Fulfillment">
                  <ChoiceButton active={fulfillment === "pickup"} onClick={() => setFulfillment("pickup")} label="Studio pickup" detail="Portland, Oregon · 417 SE 8th" />
                  <ChoiceButton active={fulfillment === "delivery"} onClick={() => setFulfillment("delivery")} label="Local delivery" detail="$18 within our delivery zone" />
                </div>
                {fulfillment === "delivery" && (
                  <div className="mt-4 animate-[fadeUp_280ms_cubic-bezier(0.16,1,0.3,1)]">
                    <FieldLabel htmlFor="c-address" required>Delivery address</FieldLabel>
                    <input id="c-address" required className="field-base mt-2" placeholder="Street address, Portland, OR" autoComplete="street-address" />
                    <p className="mt-1.5 flex items-center gap-1.5 text-[11px] leading-4 text-[oklch(0.58_0.03_18)]"><MapPin size={12} className="text-[var(--rosewood)]" /> Flat $18 · we’ll confirm zone after submit</p>
                  </div>
                )}
                {fulfillment === "pickup" && (
                  <p className="mt-3 flex items-center gap-1.5 text-[11px] leading-4 text-[oklch(0.58_0.03_18)]"><MapPin size={12} className="text-[var(--rosewood)]" /> Pickup at the studio · we’ll send directions with your confirmation</p>
                )}
              </div>

              <div className="mt-7">
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[oklch(0.34_0.02_35)]">Allergy &amp; dietary notes</p>
                <p className="mt-1 text-[12px] leading-5 text-[oklch(0.52_0.02_35)]">Select any that apply. We’ll follow up if we need more detail.</p>
                <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Allergies">
                  {["Dairy", "Egg", "Gluten", "Tree nuts", "Peanuts", "Vegan"].map((tag) => {
                    const active = allergies.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        aria-pressed={active}
                        onClick={() => toggleAllergy(tag)}
                        className={`rounded-full border px-3.5 py-1.5 text-[12px] font-medium transition-all duration-150 focus-visible:ring-2 focus-visible:ring-[var(--rosewood)] focus-visible:ring-offset-2 ${
                          active
                            ? "border-[var(--rosewood)] bg-[var(--rosewood)] text-white shadow-[0_4px_12px_oklch(0.49_0.09_18/0.18)]"
                            : "border-[oklch(0.86_0.02_52)] bg-white text-[oklch(0.34_0.02_35)] hover:border-[oklch(0.72_0.03_18)] hover:bg-[oklch(0.94_0.03_13)]"
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
                <label className="mt-4 block">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[oklch(0.34_0.02_35)]">Anything else we should know?</span>
                  <textarea className="field-base mt-2 min-h-[92px]" placeholder="Allergies, message on the cake, serving details…" rows={3} />
                </label>
                <p className="mt-2 flex items-center gap-1.5 text-[11px] leading-4 text-[oklch(0.58_0.03_18)]"><ShieldCheck size={12} className="text-[var(--rosewood)]" /> We handle wheat, dairy, eggs, soy, and tree nuts in the same kitchen.</p>
              </div>
            </section>

            {/* mobile quote + submit */}
            <div className="mt-6 border-t border-[oklch(0.88_0.018_52)] pt-6 lg:hidden">
              <QuoteCard lineItems={lineItems} total={total} deposit={deposit} balance={balance} selectedDate={selectedDate} fulfillment={fulfillment} compact />
              <button type="submit" className="button-rose mt-4 w-full justify-center py-4 text-[11px]">
                Review order &amp; reserve date <ArrowRight size={14} strokeWidth={2.2} />
              </button>
              <p className="mt-3 text-center text-[11px] leading-4 text-[oklch(0.58_0.03_18)]">No payment collected in this demo · clear total before you confirm</p>
            </div>
          </form>

          {/* desktop sticky quote */}
          <aside className="hidden lg:block">
            <div className="sticky top-[88px]">
              <QuoteCard lineItems={lineItems} total={total} deposit={deposit} balance={balance} selectedDate={selectedDate} fulfillment={fulfillment} />
              <button
                type="button"
                onClick={() => (document.querySelector<HTMLFormElement>("form") as HTMLFormElement | null)?.requestSubmit()}
                className="button-rose mt-4 w-full justify-center py-4 text-[11px] shadow-[0_10px_24px_oklch(0.49_0.09_18/0.18)]"
              >
                Review order &amp; reserve date <ArrowRight size={15} strokeWidth={2.2} />
              </button>
              <div className="mt-3 flex items-center justify-center gap-2 text-[11px] leading-4 text-[oklch(0.52_0.02_35)]">
                <ShieldCheck size={12} className="text-[var(--rosewood)]" /> No payment collected in this demo
              </div>
              <div className="mt-4 border border-dashed border-[oklch(0.86_0.02_52)] bg-[oklch(0.97_0.008_72)] p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[oklch(0.52_0.02_35)]">What happens next?</p>
                <p className="mt-1 text-[12px] leading-5 text-[oklch(0.46_0.02_35)]">We’ll review your details and hold the date while we confirm. You’ll get a deposit link and balance reminder by email.</p>
              </div>
            </div>
          </aside>
        </div>

        {/* Mobile sticky bottom quote & reserve action bar with safe area */}
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[oklch(0.86_0.02_52)] bg-white/95 px-4 pt-2.5 backdrop-blur-md lg:hidden shadow-[0_-8px_24px_oklch(0.25_0.018_35/0.08)] [padding-bottom:max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.08em] text-[oklch(0.42_0.02_35)]">
                <span className="truncate">
                  {product === "cake" ? `${sizes[cakeSize].label} cake` : product === "cupcakes" ? `${quantity} cupcakes` : product === "cookies" ? `${quantity} cookies` : "Studio consult"}
                </span>
              </div>
              <div className="mt-0.5 flex items-baseline gap-1.5">
                <span className="font-display text-[20px] font-semibold leading-none tracking-[-0.02em] text-[var(--ink)]">
                  {currency(total)}
                </span>
                <span className="text-[10px] font-medium text-[var(--rosewood)]">
                  ({currency(deposit)} dep.)
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => (document.querySelector<HTMLFormElement>("form") as HTMLFormElement | null)?.requestSubmit()}
              className="button-rose shrink-0 px-4 py-2 text-[10.5px] min-h-[44px]"
            >
              Reserve date <ArrowRight size={13} strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function StepTitle({ step, title, helper }: { step: string; title: string; helper: string }) {
  return (
    <div className="flex gap-4">
      <span className="mt-1 hidden h-6 place-items-center rounded-full border border-[oklch(0.86_0.02_52)] bg-white px-2 text-[10px] font-bold tracking-[0.12em] text-[var(--rosewood)] sm:grid">
        {step}
      </span>
      <span className="mt-1 text-[10px] font-bold tracking-[0.12em] text-[var(--rosewood)] sm:hidden">{step}</span>
      <div className="min-w-0">
        <h2 className="font-display text-[26px] leading-none tracking-[-0.03em] sm:text-[30px]">{title}</h2>
        <p className="mt-1.5 max-w-[48ch] text-[13px] leading-5 text-[oklch(0.5_0.02_35)]">{helper}</p>
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  const id = `field-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <select id={id} className="field-base mt-2" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function QuantityChooser({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  const atMin = value <= 12;
  const atMax = value >= 36;
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="mt-2 flex overflow-hidden border border-[oklch(0.86_0.02_52)] bg-white">
        <button
          type="button"
          onClick={() => onChange(Math.max(12, value - 12))}
          disabled={atMin}
          aria-label="Decrease quantity"
          className="grid h-[46px] w-12 shrink-0 place-items-center border-r border-[oklch(0.86_0.02_52)] bg-[oklch(0.97_0.008_72)] text-[var(--rosewood)] transition-colors hover:bg-[oklch(0.94_0.03_13)] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Minus size={16} strokeWidth={1.9} />
        </button>
        <span className="flex flex-1 items-center justify-center gap-2 py-3 text-center text-[14px] font-semibold tracking-[-0.01em]">
          {value}
          <span className="text-[11px] font-normal tracking-wide text-[oklch(0.52_0.02_35)]">pieces</span>
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(36, value + 12))}
          disabled={atMax}
          aria-label="Increase quantity"
          className="grid h-[46px] w-12 shrink-0 place-items-center border-l border-[oklch(0.86_0.02_52)] bg-[oklch(0.97_0.008_72)] text-[var(--rosewood)] transition-colors hover:bg-[oklch(0.94_0.03_13)] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus size={16} strokeWidth={1.9} />
        </button>
      </div>
      <span className="mt-1.5 block text-[11px] leading-4 text-[oklch(0.58_0.03_18)]">Available in increments of 12 · {atMax ? "Maximum reached" : atMin ? "Minimum 12" : "Tap to adjust"}</span>
    </div>
  );
}

function QuoteCard({
  lineItems,
  total,
  deposit,
  balance,
  selectedDate,
  fulfillment,
  compact = false,
}: {
  lineItems: { label: string; price: number }[];
  total: number;
  deposit: number;
  balance: number;
  selectedDate: string;
  fulfillment: Fulfillment;
  compact?: boolean;
}) {
  return (
    <div
      className={`border bg-white ${compact ? "border-[oklch(0.86_0.02_52)] p-4 sm:p-5" : "border-[oklch(0.86_0.02_52)] p-5 sm:p-6 shadow-[0_18px_50px_oklch(0.25_0.018_35/0.07)]"}`}
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Your live estimate</p>
          <h2 className="mt-1.5 font-display text-[24px] sm:text-[26px] leading-none tracking-[-0.02em] sm:text-[28px]">The cake table</h2>
          <p className="mt-1 text-[11px] leading-4 text-[oklch(0.58_0.03_18)]">Updates instantly as you choose</p>
        </div>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[oklch(0.88_0.06_18/0.35)] bg-[oklch(0.94_0.03_13)] text-[var(--rosewood)]" aria-hidden>
          <Sparkles size={16} strokeWidth={1.9} />
        </span>
      </div>

      <div className="mt-5 space-y-2.5 border-y border-[oklch(0.91_0.015_52)] py-4">
        {lineItems.map((item) => (
          <div key={`${item.label}-${item.price}`} className="flex items-start justify-between gap-3 text-[12.5px] sm:text-[13px]">
            <span className="leading-5 text-[oklch(0.42_0.02_35)] truncate">{item.label}</span>
            <span className="shrink-0 font-semibold tracking-[-0.01em] text-[oklch(0.28_0.02_35)]">{currency(item.price)}</span>
          </div>
        ))}
      </div>

      <div className="flex items-end justify-between gap-4 pt-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.13em] text-[oklch(0.52_0.02_35)]">Estimated total</span>
        <span key={total} className="font-display text-[32px] sm:text-[34px] leading-none tracking-[-0.02em] sm:text-[38px] animate-[fadeUp_220ms_cubic-bezier(0.16,1,0.3,1)]">
          {currency(total)}
        </span>
      </div>
      <p className="mt-1 text-right text-[11px] leading-4 text-[oklch(0.58_0.03_18)]">50% deposit holds your date</p>

      <div className="mt-4 border-t border-[oklch(0.91_0.015_52)] pt-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[var(--rosewood)]">Reservation payment</p>
        <div className="mt-3 grid grid-cols-1 min-[340px]:grid-cols-2 gap-2.5 sm:gap-3">
          <div className="border border-[var(--rosewood)]/20 bg-[oklch(0.94_0.03_13)] p-3">
            <p className="text-[9px] font-bold uppercase tracking-[0.11em] text-[oklch(0.52_0.03_18)]">Deposit due now</p>
            <p className="mt-1 font-display text-[22px] leading-none tracking-[-0.02em]">{currency(deposit)}</p>
            <p className="mt-1 text-[10px] leading-3 text-[oklch(0.52_0.02_35)]">Holds ingredients &amp; time</p>
          </div>
          <div className="border border-[oklch(0.86_0.02_52)] bg-[oklch(0.97_0.008_72)] p-3">
            <p className="text-[9px] font-bold uppercase tracking-[0.11em] text-[oklch(0.52_0.02_35)]">Balance due</p>
            <p className="mt-1 font-display text-[22px] leading-none tracking-[-0.02em]">{currency(balance)}</p>
            <p className="mt-1 text-[10px] leading-3 text-[oklch(0.58_0.03_18)]">3 days before pickup</p>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2 border-t border-[oklch(0.91_0.015_52)] pt-4 text-[12.5px] leading-5 text-[oklch(0.46_0.02_35)]">
        <p className="flex items-start gap-2">
          <CalendarDays size={14} strokeWidth={1.9} className="mt-0.5 shrink-0 text-[var(--rosewood)]" /> {formatLongDate(selectedDate)}
        </p>
        <p className="flex items-start gap-2">
          {fulfillment === "delivery" ? (
            <Truck size={14} strokeWidth={1.9} className="mt-0.5 shrink-0 text-[var(--rosewood)]" />
          ) : (
            <MapPin size={14} strokeWidth={1.9} className="mt-0.5 shrink-0 text-[var(--rosewood)]" />
          )}
          {fulfillment === "delivery" ? "Local delivery · $18" : "Studio pickup · 417 SE 8th, Portland"}
        </p>
      </div>
    </div>
  );
}

function Confirmation({
  total,
  deposit,
  balance,
  selectedDate,
  fulfillment,
  product,
  onEdit,
}: {
  total: number;
  deposit: number;
  balance: number;
  selectedDate: string;
  fulfillment: Fulfillment;
  product: ProductType;
  onEdit: () => void;
}) {
  const balanceDue = addDays(new Date(`${selectedDate}T12:00:00`), -3);
  const noun =
    product === "cupcakes" ? "cupcake order" : product === "cookies" ? "cookie order" : product === "custom" ? "custom consultation" : "celebration cake";
  return (
    <div className="min-h-screen bg-[oklch(0.974_0.008_75)] text-[var(--ink)]">
      <SiteHeader />
      <main className="container py-10 sm:py-16">
        <div className="mx-auto max-w-[720px] border border-[oklch(0.86_0.02_52)] bg-white p-6 shadow-[0_24px_70px_oklch(0.25_0.018_35/0.08)] sm:p-10 lg:p-12">
          <span className="bloom mx-auto grid h-14 w-14 place-items-center rounded-full border border-[oklch(0.88_0.06_18/0.5)] bg-[oklch(0.94_0.03_13)] text-[var(--rosewood)] ring-1 ring-[var(--rosewood)]/15">
            <Check size={28} strokeWidth={2.2} />
          </span>
          <div className="mt-6 text-center">
            <p className="eyebrow justify-center">Order summary</p>
            <h1 className="display-title mx-auto mt-3 max-w-[12ch] text-[46px] sm:text-[60px] lg:text-[68px]">
              Your date is <em>held.</em>
            </h1>
            <p className="prose-measure mx-auto mt-4 max-w-[46ch] text-[14px] leading-6 text-[oklch(0.46_0.02_35)]">
              This demo confirmation shows exactly what the customer sees after review. In a live bakery system, the deposit action would connect here and the balance reminder would be scheduled.
            </p>
          </div>

          <div className="mt-8 grid gap-4 border-y border-[oklch(0.91_0.015_52)] py-6 sm:grid-cols-3 sm:gap-6">
            <SummaryBlock label="Order" value={noun} />
            <SummaryBlock label="Date" value={formatLongDate(selectedDate)} />
            <SummaryBlock label="Fulfillment" value={fulfillment === "delivery" ? "Local delivery · $18" : "Studio pickup · Portland"} />
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            <div className="border border-[oklch(0.86_0.02_52)] bg-[oklch(0.97_0.008_72)] p-4">
              <p className="text-[9px] font-bold uppercase tracking-[0.11em] text-[var(--rosewood)]">Order total</p>
              <p className="mt-1.5 font-display text-[28px] leading-none tracking-[-0.02em]">{currency(total)}</p>
            </div>
            <div className="border border-[var(--rosewood)] bg-[oklch(0.94_0.03_13)] p-4 shadow-[inset_0_0_0_1px_var(--rosewood)]">
              <p className="text-[9px] font-bold uppercase tracking-[0.11em] text-[oklch(0.48_0.06_18)]">Deposit due now</p>
              <p className="mt-1.5 font-display text-[28px] leading-none tracking-[-0.02em]">{currency(deposit)}</p>
              <p className="mt-1 text-[11px] leading-4 text-[oklch(0.52_0.02_35)]">Holds your date</p>
            </div>
            <div className="border border-[oklch(0.86_0.02_52)] bg-white p-4">
              <p className="text-[9px] font-bold uppercase tracking-[0.11em] text-[oklch(0.52_0.02_35)]">Balance due</p>
              <p className="mt-1.5 font-display text-[28px] leading-none tracking-[-0.02em]">{currency(balance)}</p>
              <p className="mt-1 text-[11px] leading-4 text-[oklch(0.58_0.03_18)]">by {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(balanceDue)}</p>
            </div>
          </div>

          <div className="mt-6 flex gap-3 border border-dashed border-[oklch(0.86_0.02_52)] bg-[oklch(0.97_0.008_72)] p-4">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[oklch(0.94_0.03_13)] text-[var(--rosewood)]" aria-hidden>
              <Clock3 size={14} strokeWidth={1.9} />
            </span>
            <div>
              <p className="text-[12px] font-semibold leading-5">Automated balance reminder</p>
              <p className="mt-1 max-w-[48ch] text-[12.5px] leading-5 text-[oklch(0.5_0.02_35)]">
                We’ll email a friendly reminder three days before your pickup with the remaining balance and pickup window. No surprises.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/" className="button-rose flex-1 justify-center py-4 text-[11px]">
              Back to the studio <ArrowRight size={14} />
            </Link>
            <button type="button" onClick={onEdit} className="button-ink flex-1 justify-center py-4">
              Edit order
            </button>
          </div>
          <p className="mt-4 text-center text-[11px] leading-4 text-[oklch(0.58_0.03_18)]">A confirmation email preview would appear here in the live system.</p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function SummaryBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 border-l-2 border-[oklch(0.91_0.015_52)] pl-3 sm:border-l-0 sm:border-t-2 sm:pl-0 sm:pt-3">
      <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-[oklch(0.58_0.03_35)]">{label}</p>
      <p className="mt-1 text-[13px] font-medium leading-5 text-[oklch(0.28_0.02_35)] text-balance">{value}</p>
    </div>
  );
}
