import { useState } from "react";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Check,
  PackageCheck,
  MapPin,
  CalendarDays,
  Clock3,
} from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useBakeryStore, getIsoDateOffset, type BakeryOrder, type BakeryOrderItem } from "@/lib/bakeryStore";

const currency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export function CartDrawer() {
  const { items, count, subtotal, updateQuantity, removeItem, isOpen, setIsOpen, clear } = useCart();
  const { addOrder, settings } = useBakeryStore();

  const deliveryFee = settings.deliveryFee || 18;

  // Checkout dialog states
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [fulfillment, setFulfillment] = useState<"pickup" | "delivery">("pickup");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState(() => getIsoDateOffset(settings.standardLeadTimeDays || 3));
  const [timeWindow, setTimeWindow] = useState("12:00 PM – 1:30 PM");
  const [notes, setNotes] = useState("");
  const [confirmedOrder, setConfirmedOrder] = useState<BakeryOrder | null>(null);

  const checkoutTotal = subtotal + (fulfillment === "delivery" ? deliveryFee : 0);

  const handleOpenCheckout = () => {
    if (items.length === 0) return;
    setConfirmedOrder(null);
    setCheckoutOpen(true);
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Please enter your name and email");
      return;
    }
    if (fulfillment === "delivery" && !address.trim()) {
      toast.error("Please enter your delivery street address");
      return;
    }
    if (!date) {
      toast.error("Please choose a pickup or delivery date");
      return;
    }

    const orderItems: BakeryOrderItem[] = items.map((it) => ({
      title: it.title,
      detail: it.variant ?? it.detail,
      quantity: it.quantity,
      price: it.price * it.quantity,
    }));

    const newOrder = addOrder({
      customer: {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || "(503) 555-0199",
        address: fulfillment === "delivery" ? address.trim() : undefined,
      },
      type: "menu-item",
      items: orderItems,
      fulfillment,
      date,
      timeWindow,
      stage: "to-make",
      payment: "paid",
      paymentMethod: "card",
      total: checkoutTotal,
      deposit: checkoutTotal,
      balance: 0,
      notes: notes.trim(),
      allergies: [],
      source: "Online Bag",
    });

    // Clear cart and show confirmation
    clear();
    setConfirmedOrder(newOrder);
  };

  const handleCloseAll = () => {
    setCheckoutOpen(false);
    setConfirmedOrder(null);
    setIsOpen(false);
  };

  const handleOpenMyOrders = () => {
    handleCloseAll();
    window.dispatchEvent(new CustomEvent("open-my-orders", { detail: { orderId: confirmedOrder?.id } }));
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="flex w-full max-w-[420px] flex-col bg-[var(--cream)] p-0 sm:max-w-[420px]">
          <SheetHeader className="border-b border-[oklch(0.9_0.022_65)] bg-[var(--paper)] px-6 py-5 text-left">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--blush)] text-[var(--terra)]">
                <ShoppingBag size={17} strokeWidth={2} />
              </span>
              <div className="flex-1">
                <SheetTitle className="font-display text-[22px] font-semibold tracking-[-0.01em]">Your bag</SheetTitle>
                <SheetDescription className="text-[11.5px] font-extrabold uppercase tracking-[0.1em] text-[var(--ink-mute)]">
                  {count === 0 ? "No items yet" : `${count} ${count === 1 ? "item" : "items"} · ${currency(subtotal)} subtotal`}
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-[var(--blush)] text-[var(--terra)]">
                <ShoppingBag size={24} strokeWidth={1.8} />
              </span>
              <p className="mt-5 font-display text-[26px] font-semibold leading-none tracking-[-0.01em]">Your bag is waiting</p>
              <p className="mt-2.5 max-w-[28ch] text-[13.5px] leading-5 text-[var(--ink-mute)]">
                Add a petite cake or a dozen cupcakes — your selections live-update here.
              </p>
              <Link href="/menu" onClick={() => setIsOpen(false)} className="button-rose mt-7 px-6 py-3.5 text-[13px]">
                Browse the menu <ArrowRight size={15} />
              </Link>
              <Link href="/custom-order" onClick={() => setIsOpen(false)} className="mt-4 text-[12.5px] font-extrabold text-[var(--terra)] underline decoration-[var(--terra)]/30 underline-offset-4 hover:decoration-[var(--terra)]">
                Or build a custom cake
              </Link>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-auto divide-y divide-[oklch(0.9_0.022_65)] bg-[var(--paper)]">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 bg-[var(--paper)] px-5 py-4">
                    <div className="h-[74px] w-[74px] shrink-0 overflow-hidden rounded-2xl bg-[var(--cream)]">
                      <img src={item.image} alt={item.title} className="h-full w-full object-cover" loading="lazy" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate font-display text-[15.5px] font-semibold leading-tight">{item.title}</p>
                          <p className="mt-1 text-[11.5px] leading-4 text-[var(--ink-mute)]">{item.variant ?? item.detail}</p>
                          <p className="mt-1 text-[11.5px] font-extrabold text-[var(--terra)]">{item.priceLabel}</p>
                        </div>
                        <button
                          aria-label={`Remove ${item.title}`}
                          onClick={() => removeItem(item.id)}
                          className="grid h-8 w-8 place-items-center rounded-full bg-[var(--cream)] text-[var(--ink-mute)] transition-colors hover:bg-[var(--blush)] hover:text-[var(--terra)]"
                        >
                          <Trash2 size={14} strokeWidth={2} />
                        </button>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center rounded-full border-[1.5px] border-[oklch(0.88_0.03_60)] bg-[var(--cream)]">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="grid h-8 w-8 place-items-center rounded-l-full text-[var(--ink-soft)] hover:bg-[var(--blush)]"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="min-w-[34px] text-center text-[12.5px] font-extrabold tabular-nums">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="grid h-8 w-8 place-items-center rounded-r-full text-[var(--ink-soft)] hover:bg-[var(--blush)]"
                            aria-label="Increase quantity"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                        <span className="text-[13.5px] font-extrabold tracking-[-0.01em]">{currency(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-[oklch(0.9_0.022_65)] bg-[var(--paper)] px-6 py-5">
                <div className="space-y-2 text-[13px]">
                  <div className="flex justify-between text-[oklch(0.46_0.02_35)]">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[var(--ink)]">{currency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[oklch(0.46_0.02_35)]">
                    <span>Fulfillment</span>
                    <span className="text-[11px] uppercase tracking-wide text-[oklch(0.58_0.03_18)]">Pickup (free) / Delivery (${deliveryFee})</span>
                  </div>
                  <Separator className="my-3" />
                  <div className="flex items-baseline justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-[0.13em] text-[oklch(0.52_0.02_35)]">Subtotal</span>
                    <span className="font-display text-[28px] leading-none tracking-[-0.02em]">{currency(subtotal)}</span>
                  </div>
                </div>

                <button
                  onClick={handleOpenCheckout}
                  className="button-rose mt-5 w-full justify-center py-4 text-[11px] shadow-[0_10px_24px_oklch(0.49_0.09_18/0.18)]"
                >
                  Proceed to checkout <ArrowRight size={15} />
                </button>
                <p className="mt-2.5 flex items-center justify-center gap-1.5 text-center text-[11px] leading-4 text-[oklch(0.52_0.02_35)]">
                  <ShieldCheck size={12} className="text-[var(--rosewood)]" /> Creates verified studio order &amp; kitchen reservation
                </p>
                <div className="mt-4 flex items-center justify-between text-[11px]">
                  <Link href="/menu" onClick={() => setIsOpen(false)} className="underline decoration-[var(--rosewood)]/20 underline-offset-4 hover:decoration-[var(--rosewood)]">
                    Continue shopping
                  </Link>
                  <button onClick={clear} className="text-[oklch(0.58_0.03_18)] underline decoration-[oklch(0.58_0.03_18)]/25 underline-offset-4 hover:text-[var(--ink)]">
                    Clear bag
                  </button>
                </div>

                <div className="mt-4 flex gap-2 border border-dashed border-[oklch(0.86_0.02_52)] bg-[oklch(0.97_0.008_72)] p-3 text-[11px] leading-4 text-[oklch(0.52_0.02_35)]">
                  <Sparkles size={14} className="mt-0.5 shrink-0 text-[var(--rosewood)]" />
                  <span>
                    Custom layered cakes with custom fillings can be created directly in the <Link href="/custom-order" onClick={() => setIsOpen(false)} className="font-semibold text-[var(--rosewood)] underline decoration-[var(--rosewood)]/20 underline-offset-4">order studio</Link>.
                  </span>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Real Checkout Dialog */}
      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="max-h-[92dvh] max-w-[560px] overflow-y-auto rounded-[2rem] border-[oklch(0.885_0.028_60)] bg-[var(--cream)] p-6 sm:p-8">
          {confirmedOrder ? (
            /* Order confirmation card */
            <div className="text-center py-2 animate-[fadeUp_260ms_cubic-bezier(0.16,1,0.3,1)]">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[var(--blush)] text-[var(--terra)]">
                <Check size={32} strokeWidth={2.5} />
              </span>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--terra)] px-4 py-1 text-white">
                <PackageCheck size={14} />
                <span className="font-mono text-[13px] font-bold">{confirmedOrder.orderNumber}</span>
              </div>
              <DialogTitle className="mt-3 font-display text-[32px] sm:text-[36px] font-semibold leading-tight">
                Order Placed!
              </DialogTitle>
              <DialogDescription className="mx-auto mt-2 max-w-[38ch] text-[13.5px] leading-6 text-[var(--ink-soft)]">
                Thank you, <strong>{confirmedOrder.customer.name}</strong>. Your menu order has been submitted to the kitchen.
              </DialogDescription>

              <div className="mt-6 rounded-2xl bg-[var(--paper)] p-5 text-left border border-[oklch(0.9_0.022_65)]">
                <div className="flex justify-between items-baseline border-b border-[oklch(0.92_0.015_60)] pb-3">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--terra)]">Order Items</span>
                  <span className="text-[13px] font-bold text-[var(--ink)]">{currency(confirmedOrder.total)}</span>
                </div>
                <div className="mt-3 divide-y divide-[oklch(0.94_0.01_60)]">
                  {confirmedOrder.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between py-2 text-[13px]">
                      <span>{it.quantity}x {it.title}</span>
                      <span className="font-semibold">{currency(it.price)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-[oklch(0.92_0.015_60)] text-[12px] text-[var(--ink-mute)] space-y-1">
                  <p className="flex items-center gap-2">
                    <CalendarDays size={13} className="text-[var(--terra)]" /> {confirmedOrder.date} · {confirmedOrder.timeWindow}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin size={13} className="text-[var(--terra)]" />
                    {confirmedOrder.fulfillment === "delivery" ? `Delivery to ${confirmedOrder.customer.address}` : `Pickup at 417 SE 8th Ave, Portland`}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleOpenMyOrders}
                  className="button-rose flex-1 justify-center py-3.5 text-[12.5px]"
                >
                  View in My Orders
                </button>
                <button
                  type="button"
                  onClick={handleCloseAll}
                  className="button-ink flex-1 justify-center py-3.5 text-[12.5px]"
                >
                  Close &amp; Back to Studio
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleCheckoutSubmit} noValidate>
              <DialogHeader className="text-left">
                <p className="eyebrow">Studio Checkout</p>
                <DialogTitle className="font-display text-[28px] font-semibold leading-tight">
                  Complete your order
                </DialogTitle>
                <DialogDescription className="text-[13px] text-[var(--ink-mute)]">
                  Provide your pickup or delivery details. Total to settle: <strong>{currency(checkoutTotal)}</strong>.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-6 space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[oklch(0.34_0.02_35)]">
                      Your Name <span className="text-[var(--rosewood)]">*</span>
                    </label>
                    <input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="field-base mt-1.5"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[oklch(0.34_0.02_35)]">
                      Email Address <span className="text-[var(--rosewood)]">*</span>
                    </label>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@example.com"
                      className="field-base mt-1.5"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[oklch(0.34_0.02_35)]">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(503) 555-0199"
                    className="field-base mt-1.5"
                  />
                </div>

                {/* Fulfillment */}
                <div>
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[oklch(0.34_0.02_35)]">
                    Fulfillment Method
                  </span>
                  <div className="mt-2 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFulfillment("pickup")}
                      className={`rounded-2xl border-[1.5px] p-3 text-left transition-all ${
                        fulfillment === "pickup"
                          ? "border-[var(--terra)] bg-[var(--blush)]/60"
                          : "border-[oklch(0.89_0.025_62)] bg-[var(--paper)]"
                      }`}
                    >
                      <p className="text-[13px] font-bold">Studio Pickup</p>
                      <p className="text-[11px] text-[var(--ink-mute)]">417 SE 8th Ave (Free)</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFulfillment("delivery")}
                      className={`rounded-2xl border-[1.5px] p-3 text-left transition-all ${
                        fulfillment === "delivery"
                          ? "border-[var(--terra)] bg-[var(--blush)]/60"
                          : "border-[oklch(0.89_0.025_62)] bg-[var(--paper)]"
                      }`}
                    >
                      <p className="text-[13px] font-bold">Local Delivery</p>
                      <p className="text-[11px] text-[var(--ink-mute)]">Portland Area (+${deliveryFee})</p>
                    </button>
                  </div>
                </div>

                {fulfillment === "delivery" && (
                  <div className="animate-[fadeUp_200ms_cubic-bezier(0.16,1,0.3,1)]">
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[oklch(0.34_0.02_35)]">
                      Delivery Street Address <span className="text-[var(--rosewood)]">*</span>
                    </label>
                    <input
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Street address, Apt/Suite, Portland, OR"
                      className="field-base mt-1.5"
                    />
                  </div>
                )}

                {/* Date and Time */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[oklch(0.34_0.02_35)]">
                      Desired Date <span className="text-[var(--rosewood)]">*</span>
                    </label>
                    <div className="relative mt-1.5">
                      <input
                        required
                        type="date"
                        min={getIsoDateOffset(1)}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="field-base"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[oklch(0.34_0.02_35)]">
                      Preferred Time Window
                    </label>
                    <select
                      value={timeWindow}
                      onChange={(e) => setTimeWindow(e.target.value)}
                      className="field-base mt-1.5"
                    >
                      <option>10:00 AM – 11:30 AM</option>
                      <option>12:00 PM – 1:30 PM</option>
                      <option>2:00 PM – 3:30 PM</option>
                      <option>3:30 PM – 5:00 PM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[oklch(0.34_0.02_35)]">
                    Special Notes or Dietary Warnings
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="E.g., Please text upon arrival, allergy notice..."
                    className="field-base mt-1.5 min-h-[64px]"
                    rows={2}
                  />
                </div>

                <div className="rounded-2xl bg-[var(--paper)] p-4 border border-[oklch(0.9_0.022_65)]">
                  <div className="flex justify-between text-[13px]">
                    <span className="text-[var(--ink-mute)]">Bag Items ({count})</span>
                    <span>{currency(subtotal)}</span>
                  </div>
                  {fulfillment === "delivery" && (
                    <div className="flex justify-between text-[13px] mt-1 text-[var(--ink-mute)]">
                      <span>Delivery Fee</span>
                      <span>{currency(deliveryFee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[15px] font-bold pt-2 mt-2 border-t border-[oklch(0.92_0.015_60)]">
                    <span>Total</span>
                    <span className="text-[var(--terra)]">{currency(checkoutTotal)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setCheckoutOpen(false)}
                  className="button-ink flex-1 justify-center py-3.5 text-[12.5px]"
                >
                  Back to Bag
                </button>
                <button
                  type="submit"
                  className="button-rose flex-1 justify-center py-3.5 text-[12.5px]"
                >
                  Place Order ({currency(checkoutTotal)})
                </button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
