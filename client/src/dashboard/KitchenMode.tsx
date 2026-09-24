import React, { useState, useEffect, useMemo } from "react";
import {
  useBakeryStore,
  BakeryOrder,
  OrderStage,
  getIsoDateOffset,
} from "@/lib/bakeryStore";
import {
  getTimeBucket,
  TIME_BUCKET_LABELS,
  TimeBucket,
  formatFullDate,
  formatCurrency,
} from "./dashboardUtils";
import { DetailedOrderModal } from "./OrderDialogs";
import {
  Flame,
  ChefHat,
  Sparkles,
  Package,
  Clock,
  AlertTriangle,
  X,
  CheckCircle2,
  Maximize2,
  Minimize2,
  Calendar,
  Check,
} from "lucide-react";
import BakeryMark from "@/components/BakeryMark";

interface KitchenModeProps {
  onClose: () => void;
}

export default function KitchenMode({ onClose }: KitchenModeProps) {
  const { orders, updateOrderStage } = useBakeryStore();

  const [currentTime, setCurrentTime] = useState("");
  const [filterStage, setFilterStage] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<BakeryOrder | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Live Clock (HH:MM:SS AM/PM)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Listen for ESC key to exit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const todayStr = useMemo(() => getIsoDateOffset(0), []);

  // Filter orders for today (or active uncollected if today has few)
  const todayOrders = useMemo(() => {
    const exact = orders.filter((o) => o.date === todayStr);
    return exact.length > 0 ? exact : orders.filter((o) => o.stage !== "collected");
  }, [orders, todayStr]);

  // Stage filtered
  const activeOrders = useMemo(() => {
    if (filterStage === "all") return todayOrders;
    return todayOrders.filter((o) => o.stage === filterStage);
  }, [todayOrders, filterStage]);

  // Group by Time Bucket
  const grouped = useMemo(() => {
    const groups: Record<TimeBucket, BakeryOrder[]> = {
      morning: [],
      midday: [],
      afternoon: [],
    };
    activeOrders.forEach((o) => {
      const b = getTimeBucket(o.timeWindow);
      groups[b].push(o);
    });
    return groups;
  }, [activeOrders]);

  const handleCardClick = (order: BakeryOrder) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-[80] overflow-y-auto bg-[oklch(0.971_0.017_78)] p-4 sm:p-8 flex flex-col justify-between">
      <div className="space-y-6">
        {/* Fullscreen Bench Top Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-[var(--hairline)] pb-5">
          <div className="flex items-center gap-4">
            <BakeryMark size="md" />
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-block size-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-extrabold uppercase tracking-widest text-[var(--terra)]">
                  Live Kitchen Bench Pass
                </span>
                <span className="text-xs text-[var(--ink-mute)]">·</span>
                <span className="text-xs font-bold text-[var(--ink-mute)]">
                  {formatFullDate(todayStr)}
                </span>
              </div>
              <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-[var(--ink)] mt-0.5">
                Kitchen Bench &amp; Oven Display
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {/* Live Clock Display */}
            <div className="rounded-xl border border-[oklch(0.88_0.03_60)] bg-white px-4 py-2 text-center shadow-xs">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--ink-mute)] block">
                Studio Time
              </span>
              <span className="font-display text-xl sm:text-2xl font-bold text-[var(--ink)] tracking-wider">
                {currentTime || "12:00:00 PM"}
              </span>
            </div>

            {/* Exit Bench Mode Button */}
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[var(--ink)] hover:bg-[var(--chocolate)] text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
            >
              <X size={16} />
              <span>Exit Bench Mode (Esc)</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", label: "All Active Today" },
              { id: "to-make", label: "To Make (Bake Queue)" },
              { id: "in-oven", label: "In Oven" },
              { id: "ready", label: "Ready on Pass" },
              { id: "collected", label: "Handed Over" },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setFilterStage(st.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  filterStage === st.id
                    ? "bg-[var(--terra)] text-white shadow-sm ring-2 ring-[var(--terra)]/20"
                    : "bg-white text-[var(--ink)] border border-[oklch(0.89_0.025_62)] hover:border-[var(--ink)]"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          <span className="text-xs font-bold text-[var(--ink-mute)]">
            Tap any cake ticket for full recipe specifications
          </span>
        </div>

        {/* 3 Columns by Service Window */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {(["morning", "midday", "afternoon"] as TimeBucket[]).map((bucket) => {
            const bucketInfo = TIME_BUCKET_LABELS[bucket];
            const bucketOrders = grouped[bucket];

            return (
              <div
                key={bucket}
                className="rounded-3xl border-2 border-[var(--hairline)] bg-[var(--paper)] p-5 sm:p-6 flex flex-col space-y-5 shadow-sm"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between border-b-2 border-[var(--hairline)] pb-3">
                  <div>
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-[var(--ink)]">
                      {bucketInfo.title}
                    </h2>
                    <span className="text-xs font-bold text-[var(--ink-mute)]">
                      {bucketInfo.window}
                    </span>
                  </div>
                  <span className="size-8 rounded-full bg-[var(--cream)] grid place-items-center font-display text-sm font-bold text-[var(--ink)] border border-[var(--hairline)]">
                    {bucketOrders.length}
                  </span>
                </div>

                {/* Orders in Window */}
                <div className="space-y-4 flex-1">
                  {bucketOrders.length === 0 ? (
                    <div className="py-12 text-center text-xs text-[var(--ink-mute)] italic bg-[var(--cream)]/40 rounded-2xl border-2 border-dashed border-[var(--hairline)]">
                      No tickets in this service window.
                    </div>
                  ) : (
                    bucketOrders.map((order) => {
                      const isCollected = order.stage === "collected";

                      return (
                        <div
                          key={order.id}
                          onClick={() => handleCardClick(order)}
                          className={`group cursor-pointer rounded-2xl border-2 p-5 transition-all duration-150 hover:shadow-lg ${
                            isCollected
                              ? "bg-[oklch(0.97_0.01_78/0.5)] border-[var(--hairline)] opacity-60"
                              : order.stage === "ready"
                              ? "bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-500/20"
                              : order.stage === "in-oven"
                              ? "bg-amber-50/70 border-amber-300 ring-2 ring-amber-500/20"
                              : "bg-white border-[oklch(0.88_0.03_60)]"
                          }`}
                        >
                          {/* Card Top: Order # & Fulfillment */}
                          <div className="flex items-center justify-between gap-2 border-b border-[var(--hairline)] pb-2.5">
                            <div className="flex items-center gap-2">
                              <span className="font-display text-lg font-bold text-[var(--ink)]">
                                {order.orderNumber}
                              </span>
                              <span
                                className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                                  order.fulfillment === "delivery"
                                    ? "bg-purple-100 text-purple-900 border border-purple-200"
                                    : "bg-emerald-100 text-emerald-900 border border-emerald-200"
                                }`}
                              >
                                {order.fulfillment}
                              </span>
                            </div>

                            <div className="flex items-center gap-1 text-xs font-bold text-[var(--ink-mute)]">
                              <Clock size={12} className="text-[var(--terra)]" />
                              <span>{order.timeWindow}</span>
                            </div>
                          </div>

                          {/* Client Name & High-Contrast Typography */}
                          <div className="mt-3">
                            <h3 className="font-display text-2xl sm:text-3xl font-bold text-[var(--ink)] leading-tight group-hover:text-[var(--terra)] transition-colors">
                              {order.customer.name}
                            </h3>
                          </div>

                          {/* Cake & Items Description */}
                          <div className="mt-2.5 space-y-1">
                            {order.items.map((i, idx) => (
                              <div key={idx} className="font-bold text-sm text-[var(--ink)]">
                                <span className="font-display text-lg text-[var(--terra)]">
                                  {i.quantity}×
                                </span>{" "}
                                <span>{i.title}</span>
                              </div>
                            ))}
                            {order.cakeConfig && (
                              <div className="text-xs font-semibold text-[var(--ink-soft)] bg-[var(--cream)] p-2.5 rounded-xl border border-[var(--hairline)] mt-2">
                                <div className="font-bold text-[var(--ink)]">
                                  {order.cakeConfig.size} · {order.cakeConfig.flavor}
                                </div>
                                <div className="text-[11px] text-[var(--ink-mute)] mt-0.5">
                                  Filling: {order.cakeConfig.filling} · Frosting: {order.cakeConfig.frosting}
                                </div>
                                <div className="text-[11px] text-[var(--terra)] font-bold mt-0.5">
                                  Finish: {order.cakeConfig.complexity}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* High-Contrast Bold Allergy Alert Pill */}
                          {order.allergies && order.allergies.length > 0 && (
                            <div className="mt-3.5 rounded-xl bg-amber-500 text-black px-3.5 py-2 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-xs">
                              <AlertTriangle size={16} className="text-black shrink-0" />
                              <span>⚠️ ALLERGY: {order.allergies.join(" · ")}</span>
                            </div>
                          )}

                          {/* Special notes */}
                          {order.notes && (
                            <p className="mt-3 text-xs italic text-[var(--ink-soft)] bg-white/70 p-2.5 rounded-lg border border-[var(--hairline)]">
                              "{order.notes}"
                            </p>
                          )}

                          {/* Huge Tap Actions on Bottom */}
                          <div
                            className="mt-4 pt-3 border-t border-[var(--hairline)] flex items-center gap-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {order.stage === "to-make" && (
                              <button
                                type="button"
                                onClick={() => updateOrderStage(order.id, "in-oven")}
                                className="w-full py-3 rounded-xl bg-[var(--terra)] hover:bg-[var(--terra-deep)] text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95"
                              >
                                <Flame size={15} />
                                <span>🔥 Move to Oven</span>
                              </button>
                            )}

                            {order.stage === "in-oven" && (
                              <button
                                type="button"
                                onClick={() => updateOrderStage(order.id, "ready")}
                                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95"
                              >
                                <Sparkles size={15} />
                                <span>✨ Mark Ready on Pass</span>
                              </button>
                            )}

                            {order.stage === "ready" && (
                              <button
                                type="button"
                                onClick={() => updateOrderStage(order.id, "collected")}
                                className="w-full py-3 rounded-xl bg-[var(--ink)] hover:bg-[var(--chocolate)] text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95"
                              >
                                <Package size={15} />
                                <span>📦 Hand Over / Dispatched</span>
                              </button>
                            )}

                            {order.stage === "collected" && (
                              <div className="w-full py-2.5 rounded-xl bg-gray-100 text-gray-700 font-bold text-xs flex items-center justify-center gap-1.5">
                                <Check size={14} strokeWidth={3} />
                                <span>Handed Over</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal for Order Inspection */}
      <DetailedOrderModal
        order={selectedOrder}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}
