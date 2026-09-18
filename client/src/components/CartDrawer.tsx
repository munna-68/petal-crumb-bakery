import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

const currency = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export function CartDrawer() {
  const { items, count, subtotal, updateQuantity, removeItem, isOpen, setIsOpen, clear } = useCart();
  const delivery = items.length ? 0 : 0; // free pickup mock; delivery added via custom-order - show note

  const handleCheckout = () => {
    toast.success("Order placed — demo checkout", {
      description: `This is a portfolio demo. In production this would charge ${currency(subtotal)} and email a confirmation.`,
      duration: 3500,
    });
    clear();
    setIsOpen(false);
  };

  return (
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
                  <span>Delivery / pickup</span>
                  <span className="text-[11px] uppercase tracking-wide text-[oklch(0.58_0.03_18)]">Calculated at checkout</span>
                </div>
                <Separator className="my-3" />
                <div className="flex items-baseline justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.13em] text-[oklch(0.52_0.02_35)]">Estimated total</span>
                  <span className="font-display text-[28px] leading-none tracking-[-0.02em]">{currency(subtotal)}</span>
                </div>
              </div>

              <button onClick={handleCheckout} className="button-rose mt-5 w-full justify-center py-4 text-[11px] shadow-[0_10px_24px_oklch(0.49_0.09_18/0.18)]">
                Checkout — demo <ArrowRight size={15} />
              </button>
              <p className="mt-2.5 flex items-center justify-center gap-1.5 text-center text-[11px] leading-4 text-[oklch(0.52_0.02_35)]">
                <ShieldCheck size={12} className="text-[var(--rosewood)]" /> No payment collected · portfolio demo
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
                  Custom cakes keep their live quote in the <Link href="/custom-order" onClick={() => setIsOpen(false)} className="font-semibold text-[var(--rosewood)] underline decoration-[var(--rosewood)]/20 underline-offset-4">order studio</Link> — this bag is for menu favorites.
                </span>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
