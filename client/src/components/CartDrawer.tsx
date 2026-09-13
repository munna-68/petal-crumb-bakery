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
      <SheetContent className="flex w-full max-w-[420px] flex-col bg-[oklch(0.982_0.008_75)] p-0 sm:max-w-[420px]">
        <SheetHeader className="border-b border-[oklch(0.88_0.018_52)] bg-white px-6 py-5 text-left">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full border border-[oklch(0.88_0.06_18/0.35)] bg-[oklch(0.94_0.03_13)] text-[var(--rosewood)]">
              <ShoppingBag size={16} strokeWidth={1.9} />
            </span>
            <div className="flex-1">
              <SheetTitle className="font-display text-[22px] font-medium tracking-[-0.02em]">Your bag</SheetTitle>
              <SheetDescription className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[oklch(0.52_0.02_35)]">
                {count === 0 ? "No items yet" : `${count} ${count === 1 ? "item" : "items"} · ${currency(subtotal)} subtotal`}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-full border border-[oklch(0.86_0.02_52)] bg-white text-[var(--rosewood)]">
              <ShoppingBag size={22} strokeWidth={1.7} />
            </span>
            <p className="mt-5 font-display text-[26px] font-medium leading-none tracking-[-0.02em]">Your bag is waiting</p>
            <p className="mt-2 max-w-[28ch] text-[13px] leading-5 text-[oklch(0.52_0.02_35)]">
              Add a petite cake or a dozen cupcakes — your selections live-update here.
            </p>
            <Link href="/menu" onClick={() => setIsOpen(false)} className="button-rose mt-6 px-6 py-3.5 text-[10px]">
              Browse the menu <ArrowRight size={14} />
            </Link>
            <Link href="/custom-order" onClick={() => setIsOpen(false)} className="mt-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--rosewood)] underline decoration-[var(--rosewood)]/25 underline-offset-4 hover:decoration-[var(--rosewood)]">
              Or build a custom cake
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto divide-y divide-[oklch(0.91_0.015_52)]">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 bg-white px-5 py-4">
                  <div className="h-[72px] w-[72px] shrink-0 overflow-hidden border border-[oklch(0.88_0.018_52)] bg-[oklch(0.96_0.008_72)] p-1">
                    <img src={item.image} alt={item.title} className="h-full w-full object-cover" loading="lazy" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate font-display text-[15px] font-medium leading-none">{item.title}</p>
                        <p className="mt-1 text-[11px] leading-4 text-[oklch(0.52_0.02_35)]">{item.variant ?? item.detail}</p>
                        <p className="mt-1 text-[11px] font-semibold text-[var(--rosewood)]">{item.priceLabel}</p>
                      </div>
                      <button
                        aria-label={`Remove ${item.title}`}
                        onClick={() => removeItem(item.id)}
                        className="grid h-7 w-7 place-items-center rounded-full border border-[oklch(0.86_0.02_52)] bg-white text-[oklch(0.52_0.02_35)] hover:border-[var(--rosewood)] hover:text-[var(--rosewood)]"
                      >
                        <Trash2 size={13} strokeWidth={1.9} />
                      </button>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center overflow-hidden rounded-full border border-[oklch(0.86_0.02_52)] bg-[oklch(0.97_0.008_72)]">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="grid h-7 w-7 place-items-center text-[oklch(0.42_0.02_35)] hover:bg-white"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="min-w-[36px] text-center text-[12px] font-semibold tabular-nums">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="grid h-7 w-7 place-items-center text-[oklch(0.42_0.02_35)] hover:bg-white"
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <span className="text-[13px] font-semibold tracking-[-0.01em]">{currency(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[oklch(0.88_0.018_52)] bg-white px-6 py-5">
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
