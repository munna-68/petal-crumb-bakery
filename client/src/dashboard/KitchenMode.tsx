import { useState, useMemo } from "react";
import {
  ChefHat,
  X,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Flame,
  Check,
  Volume2,
  VolumeX,
} from "lucide-react";
import BakeryMark from "@/components/BakeryMark";
import { useBakeryStore, type BakeryOrder, type OrderStage } from "@/lib/bakeryStore";

interface KitchenModeProps {
  open: boolean;
  onClose: () => void;
}

export function KitchenMode({ open, onClose }: KitchenModeProps) {
  const { orders, updateOrderStage, toast } = useBakeryStore();
  const [selectedWindow, setSelectedWindow] = useState<string>("all");
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Filter only active orders (to-make, in-oven, ready)
  const activeOrders = useMemo(() => {
    return orders.filter((o) => o.stage !== "collected");
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (selectedWindow === "all") return activeOrders;
    return activeOrders.filter((o) => {
      const windowStr = (o.timeWindow || "").toLowerCase();
      if (selectedWindow === "morning") return windowStr.includes("9") || windowStr.includes("10") || windowStr.includes("11");
      if (selectedWindow === "midday") return windowStr.includes("12") || windowStr.includes("1") || windowStr.includes("2");
      if (selectedWindow === "afternoon") return windowStr.includes("3") || windowStr.includes("4") || windowStr.includes("5") || windowStr.includes("6");
      return true;
    });
  }, [activeOrders, selectedWindow]);

  if (!open) return null;

  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // AudioContext unavailable or restricted
    }
  };

  const handleStageChange = (orderId: string, currentStage: OrderStage) => {
    let nextStage: OrderStage = "in-oven";
    if (currentStage === "to-make") nextStage = "in-oven";
    else if (currentStage === "in-oven") nextStage = "ready";
    else if (currentStage === "ready") nextStage = "collected";

    updateOrderStage(orderId, nextStage);
    playChime();
  };

  const currency = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col overflow-y-auto bg-[oklch(0.24_0.025_42)] text-[oklch(0.97_0.012_80)]"
      role="dialog"
      aria-modal="true"
      aria-label="Kitchen Bench Mode"
    >
      {/* High-visibility sticky header for tablet bench */}
      <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-[oklch(0.21_0.025_40)] px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-3.5">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--terra)] text-white shadow-md">
            <ChefHat size={22} strokeWidth={2.2} />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-[26px] sm:text-[30px] font-semibold leading-none tracking-[-0.01em] text-white">
                Kitchen Bench Mode
              </h1>
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--butter)]">
                Live Pass
              </span>
            </div>
            <p className="mt-1 text-[13px] text-white/70">
              {activeOrders.length} {activeOrders.length === 1 ? "order" : "orders"} remaining on the bench · Tap to advance stage
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSoundEnabled((v) => !v)}
            aria-label={soundEnabled ? "Disable sound" : "Enable sound"}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-colors hover:bg-white/15 hover:text-white"
            title={soundEnabled ? "Chime enabled" : "Muted"}
          >
            {soundEnabled ? <Volume2 size={17} /> : <VolumeX size={17} className="text-white/40" />}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-[13px] font-bold text-white transition-all hover:bg-white/20 active:scale-95"
          >
            <X size={16} strokeWidth={2.2} />
            <span>Exit Bench Mode</span>
          </button>
        </div>
      </header>

      {/* Time Window Tabs */}
      <div className="border-b border-white/10 bg-[oklch(0.22_0.025_40)] px-6 py-3">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: `All Bench (${activeOrders.length})` },
              { id: "morning", label: "Morning (9a–12p)" },
              { id: "midday", label: "Midday (12p–3p)" },
              { id: "afternoon", label: "Afternoon (3p–6p)" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedWindow(tab.id)}
                className={`rounded-full px-4 py-2 text-[12px] font-extrabold uppercase tracking-[0.1em] transition-all ${
                  selectedWindow === tab.id
                    ? "bg-[var(--terra)] text-white shadow-sm"
                    : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 text-[12px] text-white/60">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[var(--butter)]" /> To Make
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-orange-400" /> In Oven / Prep
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[var(--sage-deep)]" /> Ready for Pass
            </span>
          </div>
        </div>
      </div>

      {/* Order Grid */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
        {filteredOrders.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-16 text-center">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white/10 text-white/60">
              <CheckCircle2 size={32} />
            </span>
            <h2 className="mt-5 font-display text-[28px] font-semibold text-white">The bench is clear!</h2>
            <p className="mt-2 text-[14px] text-white/70">
              No orders pending in this window. Great job in the kitchen!
            </p>
            <button
              onClick={() => setSelectedWindow("all")}
              className="mt-6 inline-flex rounded-full bg-[var(--terra)] px-6 py-3 text-[13px] font-bold text-white"
            >
              View All Orders
            </button>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredOrders.map((order) => {
              const hasAllergies = order.allergies && order.allergies.length > 0;
              const isReady = order.stage === "ready";
              const isInOven = order.stage === "in-oven";

              return (
                <article
                  key={order.id}
                  className={`flex flex-col justify-between rounded-[1.75rem] border p-6 transition-all shadow-md ${
                    isReady
                      ? "border-emerald-500/40 bg-emerald-950/20"
                      : isInOven
                      ? "border-amber-500/40 bg-amber-950/20"
                      : "border-white/15 bg-white/[0.06]"
                  }`}
                >
                  <div>
                    {/* Header: Window + Order # */}
                    <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--butter)]">
                        <Clock size={13} /> {order.timeWindow || "Flexible Window"}
                      </span>
                      <span className="rounded-full bg-white/10 px-2.5 py-0.5 font-mono text-[11px] font-bold text-white/90">
                        {order.orderNumber}
                      </span>
                    </div>

                    {/* Customer & Fulfillment */}
                    <div className="mt-4 flex items-start justify-between gap-2">
                      <div>
                        <h2 className="font-display text-[26px] font-semibold leading-tight text-white">
                          {order.customer.name}
                        </h2>
                        <p className="text-[12.5px] text-white/60">
                          {order.customer.phone || order.customer.email}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-[10.5px] font-extrabold uppercase tracking-[0.12em] ${
                          order.fulfillment === "delivery"
                            ? "bg-purple-900/60 text-purple-200 border border-purple-400/30"
                            : "bg-white/10 text-white/90"
                        }`}
                      >
                        {order.fulfillment === "delivery" ? "Delivery" : "Studio Pickup"}
                      </span>
                    </div>

                    {/* Allergies Highlight */}
                    {hasAllergies && (
                      <div className="mt-3 flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-950/50 p-3 text-[12px] font-bold text-red-200">
                        <AlertTriangle size={16} className="shrink-0 text-red-400" />
                        <span>Allergies: {order.allergies.join(", ")}</span>
                      </div>
                    )}

                    {/* Items breakdown */}
                    <div className="mt-4 space-y-2 border-t border-white/10 pt-3">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between text-[13.5px]">
                          <span className="font-medium text-white/90">
                            {it.quantity}x {it.title}
                          </span>
                          <span className="text-[12px] text-white/50">{currency(it.price * it.quantity)}</span>
                        </div>
                      ))}

                      {/* Cake configuration details if present */}
                      {order.cakeConfig && (
                        <div className="mt-2 rounded-xl bg-white/5 p-3 text-[12px] leading-5 text-white/80">
                          <p>
                            <strong className="text-[var(--butter)]">Tier:</strong> {order.cakeConfig.size}
                          </p>
                          <p>
                            <strong className="text-[var(--butter)]">Sponge:</strong> {order.cakeConfig.flavor}
                          </p>
                          <p>
                            <strong className="text-[var(--butter)]">Filling:</strong> {order.cakeConfig.filling}
                          </p>
                          <p>
                            <strong className="text-[var(--butter)]">Finish:</strong> {order.cakeConfig.frosting}
                          </p>
                        </div>
                      )}

                      {order.notes && (
                        <p className="mt-2 text-[12px] italic text-amber-200/90">
                          Note: "{order.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="mt-6 border-t border-white/10 pt-4">
                    <div className="flex items-center justify-between text-[12px] mb-3">
                      <span className="text-white/60">
                        Payment:{" "}
                        <strong className={order.payment === "paid" ? "text-emerald-400" : "text-amber-300"}>
                          {order.payment === "paid" ? "Paid in full" : `Deposit paid · ${currency(order.balance)} due`}
                        </strong>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleStageChange(order.id, order.stage)}
                      className={`flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-[13px] font-extrabold uppercase tracking-[0.1em] transition-all active:scale-[0.98] ${
                        order.stage === "to-make"
                          ? "bg-amber-600 text-white hover:bg-amber-500 shadow-lg"
                          : order.stage === "in-oven"
                          ? "bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg"
                          : "bg-white text-[oklch(0.25_0.03_42)] hover:bg-white/90 shadow-lg"
                      }`}
                    >
                      {order.stage === "to-make" && (
                        <>
                          <Flame size={16} /> Mark in Oven / Assembly
                        </>
                      )}
                      {order.stage === "in-oven" && (
                        <>
                          <Check size={16} /> Mark Ready on Pass
                        </>
                      )}
                      {order.stage === "ready" && (
                        <>
                          <CheckCircle2 size={16} /> Hand Over to Client
                        </>
                      )}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
