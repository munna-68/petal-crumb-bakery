import React, { useState, useMemo } from "react";
import {
  useBakeryStore,
  BakeryOrder,
  OrderStage,
  PaymentStatus,
  getIsoDateOffset,
} from "@/lib/bakeryStore";
import {
  formatCurrency,
  getTimeBucket,
  TIME_BUCKET_LABELS,
  TimeBucket,
} from "./dashboardUtils";
import { DetailedOrderModal } from "./OrderDialogs";
import {
  Flame,
  ChefHat,
  Package,
  Sparkles,
  Clock,
  MapPin,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Cake,
  Calendar,
  Layers,
  Check,
} from "lucide-react";
import BakeryMark from "@/components/BakeryMark";

interface TodayTabProps {
  onOpenNewOrder: () => void;
  onOpenKitchenMode: () => void;
}

export default function TodayTab({ onOpenNewOrder, onOpenKitchenMode }: TodayTabProps) {
  const { orders, updateOrderStage, updateOrderPayment } = useBakeryStore();
  const [selectedOrder, setSelectedOrder] = useState<BakeryOrder | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const todayStr = useMemo(() => getIsoDateOffset(0), []);

  // Filter orders for today
  const todayOrders = useMemo(() => {
    return orders.filter((o) => o.date === todayStr);
  }, [orders, todayStr]);

  // If there are no orders strictly for today, fallback to all active orders so the board is always populated
  const displayOrders = todayOrders.length > 0 ? todayOrders : orders.slice(0, 5);
  const isFallbackDate = todayOrders.length === 0;

  // KPI Calculations
  const todayRevenue = useMemo(() => {
    return displayOrders.reduce((sum, o) => sum + o.total, 0);
  }, [displayOrders]);

  const activeOrdersCount = useMemo(() => {
    return displayOrders.filter((o) => o.stage !== "collected").length;
  }, [displayOrders]);

  const itemsToBakeCount = useMemo(() => {
    return displayOrders
      .filter((o) => o.stage === "to-make" || o.stage === "in-oven")
      .reduce((sum, o) => sum + o.items.reduce((acc, item) => acc + item.quantity, 0), 0);
  }, [displayOrders]);

  const handedOverCount = useMemo(() => {
    return displayOrders.filter((o) => o.stage === "collected").length;
  }, [displayOrders]);

  // Next out the oven / Next on the pass banner
  const nextOrder = useMemo(() => {
    const uncollected = displayOrders.filter((o) => o.stage !== "collected");
    // Prioritize ready first (next to hand over), then in-oven, then to-make
    const ready = uncollected.find((o) => o.stage === "ready");
    if (ready) return ready;
    const inOven = uncollected.find((o) => o.stage === "in-oven");
    if (inOven) return inOven;
    return uncollected[0] || null;
  }, [displayOrders]);

  // Group orders into 3 time windows
  const groupedOrders = useMemo(() => {
    const groups: Record<TimeBucket, BakeryOrder[]> = {
      morning: [],
      midday: [],
      afternoon: [],
    };

    displayOrders.forEach((o) => {
      const bucket = getTimeBucket(o.timeWindow);
      groups[bucket].push(o);
    });

    return groups;
  }, [displayOrders]);

  const handleOpenDetails = (order: BakeryOrder) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const cyclePayment = (e: React.MouseEvent, order: BakeryOrder) => {
    e.stopPropagation();
    const next: Record<PaymentStatus, PaymentStatus> = {
      pending: "deposit-paid",
      "deposit-paid": "paid",
      paid: "pending",
    };
    updateOrderPayment(order.id, next[order.payment]);
  };

  return (
    <div className="space-y-7">
      {/* Fallback notification if date doesn't match */}
      {isFallbackDate && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-900 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-amber-700" />
            <span>Showing active upcoming studio orders while today's queue prepares.</span>
          </div>
          <button
            onClick={onOpenNewOrder}
            className="font-bold underline text-amber-950 hover:text-[var(--terra)]"
          >
            + Add Order for Today
          </button>
        </div>
      )}

      {/* 1. Next Out the Oven / Next on the Pass Banner */}
      {nextOrder && (
        <div className="relative overflow-hidden rounded-2xl border border-[oklch(0.88_0.03_60)] bg-gradient-to-r from-[oklch(0.985_0.015_82)] via-[var(--paper)] to-[oklch(0.96_0.03_30/0.15)] p-5 sm:p-7 shadow-[0_10px_30px_oklch(0.305_0.033_42/0.05)]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--terra-soft)] text-[var(--terra-deep)] text-[11px] font-extrabold uppercase tracking-wider">
                  <Flame size={12} className="text-[var(--terra)] animate-pulse" />
                  <span>
                    {nextOrder.stage === "ready"
                      ? "Next on the Pass (Ready for Handover)"
                      : nextOrder.stage === "in-oven"
                      ? "Next Out the Oven"
                      : "Priority Next to Scale & Bake"}
                  </span>
                </span>
                <span className="text-xs font-bold text-[var(--ink-mute)]">
                  {nextOrder.orderNumber}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider ${
                    nextOrder.fulfillment === "delivery"
                      ? "bg-purple-100 text-purple-900"
                      : "bg-emerald-100 text-emerald-900"
                  }`}
                >
                  {nextOrder.fulfillment === "delivery" ? "Courier Delivery" : "Studio Pickup"}
                </span>
              </div>

              <div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-[var(--ink)]">
                  {nextOrder.customer.name}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--ink-soft)] font-medium mt-0.5">
                  {nextOrder.items.map((i) => `${i.quantity}x ${i.title}`).join(", ")}
                  {nextOrder.cakeConfig && ` · ${nextOrder.cakeConfig.size} ${nextOrder.cakeConfig.flavor}`}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--ink-soft)] font-medium pt-1">
                <span className="flex items-center gap-1.5 font-bold text-[var(--ink)]">
                  <Clock size={13} className="text-[var(--terra)]" />
                  <span>Target: {nextOrder.timeWindow}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-[var(--ink-mute)]">Payment:</span>
                  <span
                    onClick={(e) => cyclePayment(e, nextOrder)}
                    className="cursor-pointer font-bold underline decoration-dotted capitalize hover:text-[var(--terra)]"
                  >
                    {nextOrder.payment.replace("-", " ")} ({formatCurrency(nextOrder.total)})
                  </span>
                </span>
                {nextOrder.allergies && nextOrder.allergies.length > 0 && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold text-[11px]">
                    <AlertTriangle size={11} className="text-amber-700" />
                    {nextOrder.allergies.join(", ")}
                  </span>
                )}
              </div>
            </div>

            {/* Quick Action Buttons for Banner */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0 pt-2 lg:pt-0">
              <button
                type="button"
                onClick={() => handleOpenDetails(nextOrder)}
                className="px-4 py-2.5 rounded-full border border-[oklch(0.88_0.03_60)] bg-white text-xs font-bold text-[var(--ink-soft)] hover:text-[var(--ink)] hover:border-[var(--ink)] transition-colors"
              >
                Inspect Ticket
              </button>

              {nextOrder.stage === "to-make" && (
                <button
                  type="button"
                  onClick={() => updateOrderStage(nextOrder.id, "in-oven")}
                  className="px-5 py-2.5 rounded-full bg-[var(--terra)] hover:bg-[var(--terra-deep)] text-white text-xs font-bold shadow-md inline-flex items-center gap-1.5 transition-all"
                >
                  <Flame size={13} />
                  <span>Move to Oven</span>
                </button>
              )}

              {nextOrder.stage === "in-oven" && (
                <button
                  type="button"
                  onClick={() => updateOrderStage(nextOrder.id, "ready")}
                  className="px-5 py-2.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md inline-flex items-center gap-1.5 transition-all"
                >
                  <Sparkles size={13} />
                  <span>Mark Ready on Pass</span>
                </button>
              )}

              {nextOrder.stage === "ready" && (
                <button
                  type="button"
                  onClick={() => updateOrderStage(nextOrder.id, "collected")}
                  className="px-5 py-2.5 rounded-full bg-[var(--ink)] hover:bg-[var(--chocolate)] text-white text-xs font-bold shadow-md inline-flex items-center gap-1.5 transition-all"
                >
                  <CheckCircle2 size={13} />
                  <span>Mark Handed Over</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. Four KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* KPI 1: Today's Revenue */}
        <div className="rounded-2xl border border-[var(--hairline)] bg-[var(--paper)] p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--ink-mute)]">
              Today's Revenue
            </span>
            <div className="size-8 rounded-full bg-[var(--terra-soft)] grid place-items-center text-[var(--terra)]">
              <DollarSign size={16} />
            </div>
          </div>
          <div className="mt-2">
            <span className="font-display text-2xl sm:text-3xl font-bold text-[var(--ink)]">
              {formatCurrency(todayRevenue)}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-[var(--ink-mute)]">
            Across {displayOrders.length} total orders scheduled
          </p>
        </div>

        {/* KPI 2: Active Orders */}
        <div className="rounded-2xl border border-[var(--hairline)] bg-[var(--paper)] p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--ink-mute)]">
              Active on Pass
            </span>
            <div className="size-8 rounded-full bg-amber-50 grid place-items-center text-amber-700">
              <ChefHat size={16} />
            </div>
          </div>
          <div className="mt-2">
            <span className="font-display text-2xl sm:text-3xl font-bold text-[var(--ink)]">
              {activeOrdersCount}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-[var(--ink-mute)]">
            Awaiting bake, finish, or collection
          </p>
        </div>

        {/* KPI 3: Items to Bake */}
        <div className="rounded-2xl border border-[var(--hairline)] bg-[var(--paper)] p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--ink-mute)]">
              Items to Bake
            </span>
            <div className="size-8 rounded-full bg-rose-50 grid place-items-center text-rose-700">
              <Flame size={16} />
            </div>
          </div>
          <div className="mt-2">
            <span className="font-display text-2xl sm:text-3xl font-bold text-[var(--ink)]">
              {itemsToBakeCount}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-[var(--ink-mute)]">
            Tiers &amp; dozens in today's oven queue
          </p>
        </div>

        {/* KPI 4: Handed Over */}
        <div className="rounded-2xl border border-[var(--hairline)] bg-[var(--paper)] p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--ink-mute)]">
              Handed Over
            </span>
            <div className="size-8 rounded-full bg-emerald-50 grid place-items-center text-emerald-700">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="mt-2">
            <span className="font-display text-2xl sm:text-3xl font-bold text-[var(--ink)]">
              {handedOverCount}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-[var(--ink-mute)]">
            Completed pickups &amp; couriers dispatched
          </p>
        </div>
      </div>

      {/* 3. Three Time Windows Columns */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-xl font-bold text-[var(--ink)]">
              Today's Production Schedule
            </h3>
            <p className="text-xs text-[var(--ink-mute)]">
              Organized into studio pickup and delivery service windows
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenKitchenMode}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[oklch(0.88_0.03_60)] bg-[var(--paper)] text-xs font-bold text-[var(--ink-soft)] hover:text-[var(--terra)] hover:border-[var(--terra)] transition-colors"
          >
            <ChefHat size={14} className="text-[var(--terra)]" />
            <span>Launch Tablet Bench Mode</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {(["morning", "midday", "afternoon"] as TimeBucket[]).map((bucket) => {
            const bucketInfo = TIME_BUCKET_LABELS[bucket];
            const bucketOrders = groupedOrders[bucket];

            return (
              <div
                key={bucket}
                className="rounded-2xl border border-[var(--hairline)] bg-[var(--paper)]/80 p-4 sm:p-5 flex flex-col space-y-4"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-3">
                  <div>
                    <h4 className="font-display text-base font-bold text-[var(--ink)]">
                      {bucketInfo.title}
                    </h4>
                    <span className="text-[11px] font-semibold text-[var(--ink-mute)]">
                      {bucketInfo.window}
                    </span>
                  </div>
                  <span className="size-6 rounded-full bg-[var(--cream)] grid place-items-center text-xs font-bold text-[var(--ink-soft)] border border-[var(--hairline)]">
                    {bucketOrders.length}
                  </span>
                </div>

                {/* Orders List */}
                <div className="space-y-3 flex-1">
                  {bucketOrders.length === 0 ? (
                    <div className="py-8 text-center text-xs text-[var(--ink-mute)] italic bg-[var(--cream)]/40 rounded-xl border border-dashed border-[var(--hairline)]">
                      No pickups scheduled for this window
                    </div>
                  ) : (
                    bucketOrders.map((order) => {
                      const isCollected = order.stage === "collected";

                      return (
                        <div
                          key={order.id}
                          onClick={() => handleOpenDetails(order)}
                          className={`group cursor-pointer rounded-xl border p-4 transition-all duration-200 hover:shadow-md hover:border-[var(--ink-mute)] ${
                            isCollected
                              ? "bg-[oklch(0.975_0.01_78/0.6)] border-[var(--hairline)] opacity-70"
                              : "bg-white border-[oklch(0.89_0.025_62)] shadow-xs"
                          }`}
                        >
                          {/* Order Card Top */}
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-xs text-[var(--ink-mute)]">
                                  {order.orderNumber}
                                </span>
                                <span
                                  className={`text-[9.5px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                                    order.fulfillment === "delivery"
                                      ? "bg-purple-100 text-purple-900"
                                      : "bg-emerald-100 text-emerald-900"
                                  }`}
                                >
                                  {order.fulfillment}
                                </span>
                              </div>
                              <h5 className="font-display text-sm font-bold text-[var(--ink)] mt-0.5 group-hover:text-[var(--terra)] transition-colors">
                                {order.customer.name}
                              </h5>
                            </div>

                            {/* Payment Chip (Interactive) */}
                            <button
                              type="button"
                              onClick={(e) => cyclePayment(e, order)}
                              title="Click to toggle payment state"
                              className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border transition-transform active:scale-95 ${
                                order.payment === "paid"
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                  : order.payment === "deposit-paid"
                                  ? "bg-amber-50 text-amber-800 border-amber-300"
                                  : "bg-rose-50 text-rose-800 border-rose-300"
                              }`}
                            >
                              {order.payment.replace("-", " ")}
                            </button>
                          </div>

                          {/* Items summary */}
                          <div className="mt-2 text-xs text-[var(--ink-soft)]">
                            {order.items.map((i, idx) => (
                              <div key={idx} className="font-medium line-clamp-1">
                                {i.quantity}x {i.title}
                              </div>
                            ))}
                            {order.cakeConfig && (
                              <div className="text-[11px] text-[var(--ink-mute)] mt-0.5 line-clamp-1">
                                {order.cakeConfig.size} · {order.cakeConfig.flavor}
                              </div>
                            )}
                          </div>

                          {/* Allergy notice */}
                          {order.allergies && order.allergies.length > 0 && (
                            <div className="mt-2.5 flex items-center gap-1 text-[10.5px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                              <AlertTriangle size={11} className="shrink-0 text-amber-600" />
                              <span className="truncate">{order.allergies.join(", ")}</span>
                            </div>
                          )}

                          {/* Card Bottom: Timing & Stage Actions */}
                          <div className="mt-3 pt-2.5 border-t border-[var(--hairline)] flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1 text-[var(--ink-mute)] font-medium text-[11px]">
                              <Clock size={11} className="text-[var(--terra)]" />
                              <span>{order.timeWindow.split("–")[0]}</span>
                            </span>

                            {/* Quick Stage Progression */}
                            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                              {order.stage === "to-make" && (
                                <button
                                  type="button"
                                  onClick={() => updateOrderStage(order.id, "in-oven")}
                                  className="px-2.5 py-1 rounded-full bg-[var(--cream)] border border-[oklch(0.88_0.03_60)] text-[10.5px] font-bold text-[var(--ink)] hover:bg-[var(--terra)] hover:text-white transition-colors flex items-center gap-1"
                                >
                                  <Flame size={10} className="text-[var(--terra)]" />
                                  <span>Bake</span>
                                </button>
                              )}

                              {order.stage === "in-oven" && (
                                <button
                                  type="button"
                                  onClick={() => updateOrderStage(order.id, "ready")}
                                  className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-[10.5px] font-bold text-emerald-800 hover:bg-emerald-600 hover:text-white transition-colors flex items-center gap-1"
                                >
                                  <Sparkles size={10} />
                                  <span>Ready</span>
                                </button>
                              )}

                              {order.stage === "ready" && (
                                <button
                                  type="button"
                                  onClick={() => updateOrderStage(order.id, "collected")}
                                  className="px-2.5 py-1 rounded-full bg-[var(--terra)] text-white text-[10.5px] font-bold shadow-xs hover:bg-[var(--terra-deep)] transition-colors flex items-center gap-1"
                                >
                                  <Package size={10} />
                                  <span>Collect</span>
                                </button>
                              )}

                              {order.stage === "collected" && (
                                <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-emerald-700">
                                  <Check size={11} strokeWidth={3} />
                                  <span>Handed Over</span>
                                </span>
                              )}
                            </div>
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

      {/* Modal for Order Details */}
      <DetailedOrderModal
        order={selectedOrder}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}
