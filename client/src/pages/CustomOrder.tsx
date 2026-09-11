/**
 * Quiet Patisserie Editorial: the order studio stays as calm as the brand but
 * is intentionally more structured—every choice reveals a clear, live quote.
 * BACKEND INTEGRATION: replace mock date capacity and confirmation state with
 * inventory, payment/deposit records, file storage, and balance-reminder jobs.
 */
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, Check, ChevronLeft, ChevronRight, CircleDollarSign, Clock3, ImagePlus, MapPin, Minus, Plus, Sparkles, Truck } from "lucide-react";
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

const toKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const addDays = (date: Date, days: number) => { const copy = new Date(date); copy.setDate(copy.getDate() + days); return copy; };
const currency = (amount: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
const formatLongDate = (key: string) => key ? new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" }).format(new Date(`${key}T12:00:00`)) : "Choose a date";

function ChoiceButton({ active, onClick, label, detail }: { active: boolean; onClick: () => void; label: string; detail?: string }) {
  return <button type="button" onClick={onClick} className={`min-h-[74px] border p-3 text-left transition-all duration-200 ${active ? "border-[#a8515a] bg-[#f8e8e8] shadow-[inset_0_0_0_1px_#a8515a]" : "border-[#dfd2cb] bg-[#fffdf9] hover:border-[#bb8b88]"}`}><span className="flex items-start justify-between gap-2"><span className="text-sm font-semibold text-[#443633]">{label}</span>{active && <Check size={16} className="mt-0.5 text-[#a8515a]" />}</span>{detail && <span className="mt-1 block text-xs leading-5 text-[#7a6660]">{detail}</span>}</button>;
}

function FieldLabel({ children }: { children: React.ReactNode }) { return <label className="block text-xs font-semibold text-[#4d3f3b]">{children}</label>; }

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

  const today = useMemo(() => { const date = new Date(); date.setHours(0, 0, 0, 0); return date; }, []);
  const days = useMemo(() => Array.from({ length: 28 }, (_, index) => addDays(today, index + 1)), [today]);
  const fullDates = useMemo(() => new Set([toKey(addDays(today, 10)), toKey(addDays(today, 17)), toKey(addDays(today, 24))]), [today]);
  const leadTime = rush ? 1 : 5;
  const firstAvailable = useMemo(() => days.find((day, index) => index + 1 >= leadTime && !fullDates.has(toKey(day))), [days, fullDates, leadTime]);

  useEffect(() => {
    const current = days.find((day) => toKey(day) === selectedDate);
    const invalid = !current || days.indexOf(current) + 1 < leadTime || fullDates.has(selectedDate);
    if (invalid && firstAvailable) setSelectedDate(toKey(firstAvailable));
  }, [firstAvailable, days, fullDates, leadTime, selectedDate]);

  const lineItems = useMemo(() => {
    const items: { label: string; price: number }[] = [];
    if (product === "cake") {
      items.push({ label: `${sizes[cakeSize].label} celebration cake`, price: sizes[cakeSize].price });
      const flavorPrice: Record<string, number> = { "Vanilla bean": 0, "Dark chocolate": 4, "Lemon olive oil": 5, "Strawberry milk": 6 };
      const fillingPrice: Record<string, number> = { "Vanilla buttercream": 0, "Raspberry preserve": 9, "Salted caramel": 8, "Lemon curd": 8 };
      const frostingPrice: Record<string, number> = { "Smooth finish": 0, "Textured buttercream": 18, "Floral finish": 42 };
      const complexityPrice: Record<string, number> = { Simple: 0, "Semi-custom": 35, "Full custom": 85 };
      if (flavorPrice[flavor]) items.push({ label: flavor, price: flavorPrice[flavor] });
      if (fillingPrice[filling]) items.push({ label: filling, price: fillingPrice[filling] });
      if (frostingPrice[frosting]) items.push({ label: frosting, price: frostingPrice[frosting] });
      if (complexityPrice[complexity]) items.push({ label: complexity, price: complexityPrice[complexity] });
    }
    if (product === "cupcakes") items.push({ label: `${quantity} signature cupcakes`, price: quantity === 12 ? 42 : quantity === 24 ? 78 : 112 });
    if (product === "cookies") { items.push({ label: `${quantity} hand-iced cookies`, price: quantity === 12 ? 34 : quantity === 24 ? 64 : 90 }); if (packaging === "Gift-ready ribbon") items.push({ label: "Gift-ready ribbon", price: 8 }); }
    if (product === "custom") items.push({ label: "Custom cake consultation", price: 150 });
    const preRush = items.reduce((sum, item) => sum + item.price, 0);
    if (rush) items.push({ label: "Rush kitchen priority", price: Math.ceil(preRush * 0.35) });
    if (fulfillment === "delivery") items.push({ label: "Local delivery", price: 18 });
    return items;
  }, [cakeSize, complexity, filling, flavor, frosting, fulfillment, packaging, product, quantity, rush]);

  const total = lineItems.reduce((sum, item) => sum + item.price, 0);
  const deposit = Math.ceil(total / 2);
  const balance = total - deposit;

  const toggleAllergy = (tag: string) => setAllergies((current) => current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]);
  const chooseProduct = (type: ProductType) => { setProduct(type); if (type === "cupcakes" || type === "cookies") setQuantity(12); };

  if (stage === "confirmed") {
    return <Confirmation total={total} deposit={deposit} balance={balance} selectedDate={selectedDate} fulfillment={fulfillment} product={product} onEdit={() => setStage("build")} />;
  }

  return <div className="min-h-screen bg-[#f7f4ef] text-[#342b29]"><SiteHeader /><main className="container py-8 sm:py-12">
    <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.15em] text-[#856763]"><ArrowLeft size={14} /> Back to the studio</Link>
    <div className="order-studio-grid mt-7">
      <form onSubmit={(event) => { event.preventDefault(); setStage("confirmed"); }} className="min-w-0">
        <div className="mb-8"><p className="eyebrow">Custom order studio</p><h1 className="display-title mt-4 text-[56px] sm:text-[72px]">Build your<br /><em className="font-normal">celebration.</em></h1><p className="mt-5 max-w-xl text-sm leading-6 text-[#655652]">Choose a few thoughtful details. Your quote updates as you go, so there are no mystery messages or spreadsheet surprises.</p></div>

        <section className="border-t border-[#d9cbc4] py-7"><StepTitle step="01" title="What are we making?" helper="We’ll tailor the questions to your sweet thing." /><div className="mt-5 grid gap-3 sm:grid-cols-2">{productOptions.map((item) => <ChoiceButton key={item.id} active={product === item.id} onClick={() => chooseProduct(item.id)} label={item.title} detail={item.detail} />)}</div></section>

        <section className="border-t border-[#d9cbc4] py-7"><StepTitle step="02" title="Make it yours" helper="Your selections update the estimate right away." />
          {product === "cake" && <div className="mt-5 space-y-6"><div><p className="mb-3 text-xs font-semibold">Size &amp; servings</p><div className="grid gap-3 sm:grid-cols-3">{(Object.keys(sizes) as CakeSize[]).map((key) => <ChoiceButton key={key} active={cakeSize === key} onClick={() => setCakeSize(key)} label={sizes[key].label} detail={`${sizes[key].detail} · ${currency(sizes[key].price)}`} />)}</div></div><div className="grid gap-5 sm:grid-cols-2"><SelectField label="Cake flavor" value={flavor} onChange={setFlavor} options={["Vanilla bean", "Dark chocolate", "Lemon olive oil", "Strawberry milk"]} /><SelectField label="Filling" value={filling} onChange={setFilling} options={["Vanilla buttercream", "Raspberry preserve", "Salted caramel", "Lemon curd"]} /><SelectField label="Frosting finish" value={frosting} onChange={setFrosting} options={["Smooth finish", "Textured buttercream", "Floral finish"]} /><SelectField label="Design complexity" value={complexity} onChange={setComplexity} options={["Simple", "Semi-custom", "Full custom"]} /></div></div>}
          {product === "cupcakes" && <div className="mt-5 grid gap-5 sm:grid-cols-2"><QuantityChooser label="How many cupcakes?" value={quantity} onChange={setQuantity} /><SelectField label="Flavor" value={flavor} onChange={setFlavor} options={["Vanilla bean", "Dark chocolate", "Lemon olive oil", "Strawberry milk"]} /></div>}
          {product === "cookies" && <div className="mt-5 grid gap-5 sm:grid-cols-2"><QuantityChooser label="How many cookies?" value={quantity} onChange={setQuantity} /><SelectField label="Packaging" value={packaging} onChange={setPackaging} options={["Classic box", "Gift-ready ribbon"]} /></div>}
          {product === "custom" && <div className="mt-5 border border-[#eadcd5] bg-[#f6eceb] p-5"><p className="font-display text-2xl">A considered consult, then a clear plan.</p><p className="mt-2 max-w-lg text-sm leading-6 text-[#6b5550]">For sculpted cakes, multiple desserts, or an idea that needs a little room to breathe, the studio consult covers concepting and a tailored proposal.</p></div>}
          <button type="button" onClick={() => setRush((current) => !current)} className={`mt-6 flex w-full items-start gap-4 border p-4 text-left transition-colors ${rush ? "border-[#a8515a] bg-[#f8e8e8]" : "border-[#dfd2cb] bg-[#fffdf9] hover:border-[#bb8b88]"}`}><span className={`mt-0.5 grid h-5 w-5 place-items-center rounded-full border ${rush ? "border-[#a8515a] bg-[#a8515a] text-white" : "border-[#c6b5ae]"}`}>{rush && <Check size={13} />}</span><span><span className="flex items-center gap-2 text-sm font-semibold"><Clock3 size={16} className="text-[#a8515a]" /> Need it sooner?</span><span className="mt-1 block text-xs leading-5 text-[#79635d]">Rush kitchen priority can open limited dates inside the usual five-day lead time. A clearly shown 35% rush fee applies.</span></span></button>
        </section>

        <section className="border-t border-[#d9cbc4] py-7"><StepTitle step="03" title="Choose an available date" helper={rush ? "Rush dates may be available from tomorrow." : "Custom cakes need five full days’ notice."} /><div className="mt-5 overflow-hidden border border-[#dfd2cb] bg-[#fffdf9]"><div className="flex items-center justify-between border-b border-[#eaded8] bg-[#f9f5f0] px-4 py-3"><span className="inline-flex items-center gap-2 text-xs font-semibold"><CalendarDays size={16} className="text-[#a8515a]" /> Kitchen availability</span><span className="text-[9px] font-bold uppercase tracking-[.13em] text-[#9b7771]">Max 3 custom cakes / day</span></div><div className="calendar-seven border-b border-[#eaded8] bg-[#fffdf9]">{["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((day) => <span key={day} className="py-2 text-center text-[9px] font-bold uppercase tracking-[.12em] text-[#947a73]">{day}</span>)}</div><div className="calendar-seven">{days.map((day, index) => { const key = toKey(day); const blockedByLead = index + 1 < leadTime; const isFull = fullDates.has(key); const disabled = blockedByLead || isFull; const active = selectedDate === key; return <button key={key} type="button" disabled={disabled} onClick={() => setSelectedDate(key)} className={`relative aspect-square border-b border-r border-[#f0e8e2] p-1 text-center text-xs transition-colors ${disabled ? "cursor-not-allowed bg-[#f4f0ec] text-[#baa8a0]" : active ? "bg-[#a8515a] text-white" : "hover:bg-[#f6e4e4]"}`}><span className="block font-semibold">{day.getDate()}</span><span className={`mt-1 block text-[7px] font-bold uppercase tracking-[.08em] ${active ? "text-[#ffecea]" : disabled ? "text-[#b29d95]" : "text-[#9b7771]"}`}>{isFull ? "Full" : blockedByLead ? "Lead time" : index % 4 === 0 ? "2 left" : "Open"}</span></button>; })}</div></div><p className="mt-3 inline-flex items-center gap-2 text-xs leading-5 text-[#79645e]"><span className="h-2 w-2 rounded-full bg-[#a8515a]" /> {formatLongDate(selectedDate)} is currently selected.</p></section>

        <section className="border-t border-[#d9cbc4] py-7"><StepTitle step="04" title="The finishing details" helper="A few helpful notes so your cake arrives just right." /><div className="mt-5 grid gap-5 sm:grid-cols-2"><FieldLabel>Your name<input required name="name" className="field-base mt-2" placeholder="Your name" /></FieldLabel><FieldLabel>Email for your order details<input required name="email" type="email" className="field-base mt-2" placeholder="you@example.com" /></FieldLabel><FieldLabel>Preferred pickup / delivery time<select className="field-base mt-2" defaultValue="12:00 PM"><option>10:00 AM</option><option>12:00 PM</option><option>2:00 PM</option><option>4:00 PM</option></select></FieldLabel><FieldLabel>Inspiration photo<span className="field-base mt-2 flex min-h-[45px] items-center gap-2 text-xs font-normal text-[#75625d]"><ImagePlus size={16} className="text-[#a8515a]" />{fileName || "Add a reference image"}<input onChange={(event) => setFileName(event.target.files?.[0]?.name || "")} type="file" accept="image/*" className="sr-only" /></span></FieldLabel></div><div className="mt-5"><p className="text-xs font-semibold">Pickup or delivery?</p><div className="mt-3 grid gap-3 sm:grid-cols-2"><ChoiceButton active={fulfillment === "pickup"} onClick={() => setFulfillment("pickup")} label="Studio pickup" detail="Portland, Oregon" /><ChoiceButton active={fulfillment === "delivery"} onClick={() => setFulfillment("delivery")} label="Local delivery" detail="$18 within our delivery zone" /></div>{fulfillment === "delivery" && <FieldLabel><span className="mt-4 block">Delivery address</span><input required className="field-base mt-2" placeholder="Street address, Portland, OR" /></FieldLabel>}</div><div className="mt-5"><p className="text-xs font-semibold">Allergy &amp; dietary notes</p><div className="mt-3 flex flex-wrap gap-2">{["Dairy", "Egg", "Gluten", "Tree nuts", "Peanuts", "Vegan"].map((tag) => <button key={tag} type="button" onClick={() => toggleAllergy(tag)} className={`border px-3 py-2 text-[10px] font-bold uppercase tracking-[.1em] ${allergies.includes(tag) ? "border-[#a8515a] bg-[#f6dfdf] text-[#8c4149]" : "border-[#ddcec7] bg-[#fffdf9] text-[#79645e]"}`}>{allergies.includes(tag) && <Check className="mr-1 inline-block" size={12} />}{tag}</button>)}</div><textarea className="field-base mt-3 min-h-24 resize-y" placeholder="Anything else we should know? We’ll always confirm dietary requests before baking." /></div></section>

        <div className="mt-1 border-t border-[#d9cbc4] pt-7 lg:hidden"><QuoteCard lineItems={lineItems} total={total} deposit={deposit} balance={balance} selectedDate={selectedDate} fulfillment={fulfillment} compact /><button type="submit" className="button-rose mt-4 w-full justify-center px-5 py-4">Review order &amp; reserve date <ArrowRight size={14} /></button></div>
      </form>
      <aside className="hidden lg:block"><div className="sticky top-[98px]"><QuoteCard lineItems={lineItems} total={total} deposit={deposit} balance={balance} selectedDate={selectedDate} fulfillment={fulfillment} /><button type="submit" form="" onClick={() => document.querySelector<HTMLFormElement>("form")?.requestSubmit()} className="button-rose mt-4 w-full justify-center px-5 py-4">Review order &amp; reserve date <ArrowRight size={14} /></button><p className="mt-4 text-center text-[10px] leading-5 text-[#8a746d]">No payment is collected in this demonstration.</p></div></aside>
    </div>
  </main><SiteFooter /></div>;
}

function StepTitle({ step, title, helper }: { step: string; title: string; helper: string }) {
  return <div className="flex gap-4"><span className="mt-1 text-[10px] font-bold tracking-[.12em] text-[#a8515a]">{step}</span><div><h2 className="font-display text-[33px] leading-none tracking-[-.035em]">{title}</h2><p className="mt-2 text-sm leading-5 text-[#7a6660]">{helper}</p></div></div>;
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return <FieldLabel>{label}<select className="field-base mt-2" value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select></FieldLabel>;
}

function QuantityChooser({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return <FieldLabel>{label}<div className="mt-2 flex border border-[#d8c9c3] bg-[#fffdf9]"><button type="button" onClick={() => onChange(Math.max(12, value - 12))} className="grid w-12 place-items-center border-r border-[#d8c9c3] text-[#a8515a]"><Minus size={16} /></button><span className="flex-1 py-3 text-center text-sm font-semibold">{value}</span><button type="button" onClick={() => onChange(Math.min(36, value + 12))} className="grid w-12 place-items-center border-l border-[#d8c9c3] text-[#a8515a]"><Plus size={16} /></button></div><span className="mt-2 block text-xs text-[#806a63]">Available in increments of 12.</span></FieldLabel>;
}

function QuoteCard({ lineItems, total, deposit, balance, selectedDate, fulfillment, compact = false }: { lineItems: { label: string; price: number }[]; total: number; deposit: number; balance: number; selectedDate: string; fulfillment: Fulfillment; compact?: boolean }) {
  return <div className={`border border-[#ddcec7] bg-[#fffdf9] ${compact ? "p-5" : "p-6 shadow-[0_18px_50px_rgba(84,56,48,.08)]"}`}><div className="flex items-start justify-between gap-4"><div><p className="eyebrow">Your live estimate</p><h2 className="mt-2 font-display text-[31px] leading-none">The cake table</h2></div><span className="grid h-9 w-9 place-items-center rounded-full bg-[#f4dfdf] text-[#9f4c54]"><Sparkles size={17} /></span></div><div className="mt-6 space-y-3 border-y border-[#eaded8] py-5">{lineItems.map((item) => <div key={`${item.label}-${item.price}`} className="flex items-start justify-between gap-4 text-sm"><span className="leading-5 text-[#675652]">{item.label}</span><span className="shrink-0 font-semibold text-[#423532]">{currency(item.price)}</span></div>)}</div><div className="flex items-end justify-between pt-5"><span className="text-[10px] font-bold uppercase tracking-[.14em] text-[#836760]">Estimated total</span><span className="font-display text-[38px] leading-none">{currency(total)}</span></div><div className="mt-5 border-t border-[#eaded8] pt-5"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#a8515a]">Reservation payment</p><div className="mt-3 grid grid-cols-2 gap-3"><div className="bg-[#f6e6e5] p-3"><p className="text-[9px] font-bold uppercase tracking-[.1em] text-[#9e595d]">Deposit due now</p><p className="mt-1 font-display text-2xl">{currency(deposit)}</p></div><div className="border border-[#eaded8] p-3"><p className="text-[9px] font-bold uppercase tracking-[.1em] text-[#866d65]">Balance due</p><p className="mt-1 font-display text-2xl">{currency(balance)}</p></div></div></div><div className="mt-5 space-y-2 border-t border-[#eaded8] pt-4 text-xs leading-5 text-[#6e5d57]"><p className="flex items-start gap-2"><CalendarDays size={15} className="mt-0.5 shrink-0 text-[#a8515a]" /> {formatLongDate(selectedDate)}</p><p className="flex items-start gap-2">{fulfillment === "delivery" ? <Truck size={15} className="mt-0.5 shrink-0 text-[#a8515a]" /> : <MapPin size={15} className="mt-0.5 shrink-0 text-[#a8515a]" />}{fulfillment === "delivery" ? "Local delivery selected" : "Studio pickup selected"}</p></div></div>;
}

function Confirmation({ total, deposit, balance, selectedDate, fulfillment, product, onEdit }: { total: number; deposit: number; balance: number; selectedDate: string; fulfillment: Fulfillment; product: ProductType; onEdit: () => void }) {
  const balanceDue = addDays(new Date(`${selectedDate}T12:00:00`), -3);
  const noun = product === "cupcakes" ? "cupcake order" : product === "cookies" ? "cookie order" : product === "custom" ? "custom consultation" : "celebration cake";
  return <div className="min-h-screen bg-[#f7f4ef] text-[#342b29]"><SiteHeader /><main className="container py-12 sm:py-20"><div className="mx-auto max-w-3xl border border-[#ddcec7] bg-[#fffdf9] p-7 shadow-[0_22px_70px_rgba(84,56,48,.09)] sm:p-12"><span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#f1d9d9] text-[#9f4c54]"><Check size={28} /></span><div className="mt-7 text-center"><p className="eyebrow">Order summary</p><h1 className="display-title mt-4 text-[58px] sm:text-[72px]">Your date is<br /><em className="font-normal">held.</em></h1><p className="mx-auto mt-5 max-w-lg text-sm leading-6 text-[#655652]">This demo confirmation shows exactly what the customer sees after the order is reviewed. In a live bakery system, the deposit action would connect here.</p></div><div className="mt-10 grid gap-3 border-y border-[#eaded8] py-6 sm:grid-cols-3"><SummaryBlock label="Order" value={noun} /><SummaryBlock label="Date" value={formatLongDate(selectedDate)} /><SummaryBlock label="Fulfillment" value={fulfillment === "delivery" ? "Local delivery" : "Studio pickup"} /></div><div className="mt-7 grid gap-3 sm:grid-cols-3"><div className="border border-[#e2d3cc] p-4"><p className="text-[9px] font-bold uppercase tracking-[.12em] text-[#a8515a]">Order total</p><p className="mt-2 font-display text-3xl">{currency(total)}</p></div><div className="border border-[#a8515a] bg-[#f6e5e5] p-4"><p className="text-[9px] font-bold uppercase tracking-[.12em] text-[#9a5056]">Deposit due now</p><p className="mt-2 font-display text-3xl">{currency(deposit)}</p></div><div className="border border-[#e2d3cc] p-4"><p className="text-[9px] font-bold uppercase tracking-[.12em] text-[#79635d]">Balance due</p><p className="mt-2 font-display text-3xl">{currency(balance)}</p><p className="mt-1 text-[10px] text-[#806963]">by {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(balanceDue)}</p></div></div><div className="mt-7 flex gap-3 border border-dashed border-[#d5bdb7] bg-[#fcf6f2] p-4"><CircleDollarSign size={21} className="shrink-0 text-[#a8515a]"/><div><p className="text-xs font-bold text-[#4d3d39]">The useful part happens here.</p><p className="mt-1 text-xs leading-5 text-[#735e58]">A real backend can now create the deposit payment, store the remaining balance, and schedule an automatic reminder three days before pickup. That logic is clearly separated for the next build phase.</p></div></div><div className="mt-8 flex flex-wrap justify-center gap-3"><button type="button" onClick={onEdit} className="button-ink px-5 py-4">Edit the order</button><Link href="/" className="button-rose px-5 py-4">Back to the studio <ArrowRight size={14} /></Link></div></div></main><SiteFooter /></div>;
}

function SummaryBlock({ label, value }: { label: string; value: string }) { return <div><p className="text-[9px] font-bold uppercase tracking-[.13em] text-[#9a746f]">{label}</p><p className="mt-1 text-sm font-medium leading-5 text-[#463734]">{value}</p></div>; }
