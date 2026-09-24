import React, { useState, useMemo } from "react";
import {
  useBakeryStore,
  BakeryOrder,
  OrderStage,
  FulfillmentType,
  PaymentStatus,
} from "@/lib/bakeryStore";
import { formatCurrency, formatFullDate } from "./dashboardUtils";
import { DetailedOrderModal, NewManualOrderModal } from "./OrderDialogs";
import {
  Search,
  Plus,
  Filter,
  Package,
  ShoppingBag,
  Clock,
  MapPin,
  AlertTriangle,
  ChevronRight,
  MoreVertical,
  CheckCircle2,
  Trash2,
  Eye,
  Calendar,
  Sparkles,
  Flame,
  ChefHat,
  ArrowUpDown,
} from "lucide-react";

export default function OrdersTab() {
  const { orders, updateOrderStage, updateOrderPayment, deleteOrder } = useBakeryStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [fulfillmentFilter, setFulfillmentFilter] = useState<string>("all");
  const [dateRangeFilter, setDateRangeFilter] = useState<string>("all");

  const [selectedOrder, setSelectedOrder] = useState<BakeryOrder | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [newOrderOpen, setNewOrderOpen] = useState(false);

  // Stage pill counts
  const stageCounts = useMemo(() => {
    return {
      all: orders.length,
      "to-make": orders.filter((o) => o.stage === "to-make").length,
      "in-oven": orders.filter((o) => o.stage === "in-oven").length,
      ready: orders.filter((o) => o.stage === "ready").length,
      collected: orders.filter((o) => o.stage === "collected").length,
    };
  }, [orders]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Stage filter
      if (stageFilter !== "all" && order.stage !== stageFilter) {
        return false;
      }
      // Fulfillment filter
      if (fulfillmentFilter !== "all" && order.fulfillment !== fulfillmentFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchName = order.customer.name.toLowerCase().includes(query);
        const matchNum = order.orderNumber.toLowerCase().includes(query);
        const matchPhone = order.customer.phone.toLowerCase().includes(query);
        const matchFlavor = order.cakeConfig?.flavor.toLowerCase().includes(query);
        const matchItems = order.items.some((i) => i.title.toLowerCase().includes(query));
        const matchNotes = order.notes?.toLowerCase().includes(query);

        if (!matchName && !matchNum && !matchPhone && !matchFlavor && !matchItems && !matchNotes) {
          return false;
        }
      }

      return true;
    });
  }, [orders, stageFilter, fulfillmentFilter, searchQuery]);

  const handleOpenOrder = (order: BakeryOrder) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[var(--ink-mute)]" />
          <input
            type="text"
            placeholder="Search by client, order #, cake flavor, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[oklch(0.88_0.03_60)] bg-white text-xs text-[var(--ink)] placeholder:text-[var(--ink-mute)] focus:outline-none focus:border-[var(--terra)] shadow-xs transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--ink-mute)] hover:text-[var(--ink)]"
            >
              Clear
            </button>
          )}
        </div>

        {/* New Manual Order Button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setNewOrderOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[var(--terra)] hover:bg-[var(--terra-deep)] text-white text-xs font-bold shadow-sm transition-all"
          >
            <Plus size={15} />
            <span>Record New Manual Order</span>
          </button>
        </div>
      </div>

      {/* Filter Pills Container */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--hairline)] pb-4">
        {/* Stage Pills */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {[
            { id: "all", label: "All Orders", count: stageCounts.all },
            { id: "to-make", label: "To Make", count: stageCounts["to-make"] },
            { id: "in-oven", label: "In Oven", count: stageCounts["in-oven"] },
            { id: "ready", label: "Ready on Pass", count: stageCounts.ready },
            { id: "collected", label: "Handed Over", count: stageCounts.collected },
          ].map((pill) => {
            const active = stageFilter === pill.id;
            return (
              <button
                key={pill.id}
                type="button"
                onClick={() => setStageFilter(pill.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  active
                    ? "bg-[var(--ink)] text-white shadow-xs"
                    : "bg-[var(--paper)] text-[var(--ink-soft)] border border-[oklch(0.89_0.025_62)] hover:border-[var(--ink)]"
                }`}
              >
                <span>{pill.label}</span>
                <span
                  className={`size-4.5 rounded-full grid place-items-center text-[10px] font-extrabold ${
                    active ? "bg-white/20 text-white" : "bg-[var(--cream)] text-[var(--ink-mute)]"
                  }`}
                >
                  {pill.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Fulfillment Pills */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-[var(--ink-mute)] mr-1">Fulfillment:</span>
          {[
            { id: "all", label: "All" },
            { id: "pickup", label: "Studio Pickup" },
            { id: "delivery", label: "Delivery" },
          ].map((pill) => {
            const active = fulfillmentFilter === pill.id;
            return (
              <button
                key={pill.id}
                type="button"
                onClick={() => setFulfillmentFilter(pill.id)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  active
                    ? "bg-[var(--terra-soft)] text-[var(--terra-deep)] border border-[var(--terra)]"
                    : "bg-transparent text-[var(--ink-soft)] hover:text-[var(--ink)]"
                }`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Grid / Table */}
      {filteredOrders.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-dashed border-[var(--hairline)] bg-[var(--paper)]">
          <Package size={36} className="mx-auto text-[var(--ink-mute)] mb-3 opacity-60" />
          <h4 className="font-display text-lg font-bold text-[var(--ink)]">No orders found</h4>
          <p className="text-xs text-[var(--ink-mute)] mt-1">
            Try adjusting your search query or filters to find what you're looking for.
          </p>
          {(stageFilter !== "all" || fulfillmentFilter !== "all" || searchQuery) && (
            <button
              onClick={() => {
                setStageFilter("all");
                setFulfillmentFilter("all");
                setSearchQuery("");
              }}
              className="mt-4 px-4 py-1.5 rounded-full text-xs font-bold text-[var(--terra)] border border-[var(--terra)] hover:bg-[var(--terra-soft)]"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[var(--hairline)] bg-[var(--paper)] shadow-xs">
          <table className="w-full text-left text-xs text-[var(--ink)] border-collapse">
            <thead>
              <tr className="border-b border-[var(--hairline)] bg-[oklch(0.975_0.015_78/0.7)] text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--ink-mute)]">
                <th className="py-3.5 pl-5 pr-3">Order</th>
                <th className="py-3.5 px-3">Client</th>
                <th className="py-3.5 px-3">Items &amp; Specs</th>
                <th className="py-3.5 px-3">Fulfillment &amp; Time</th>
                <th className="py-3.5 px-3">Payment</th>
                <th className="py-3.5 px-3">Kitchen Stage</th>
                <th className="py-3.5 px-3 text-right">Total</th>
                <th className="py-3.5 pr-5 pl-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--hairline)] font-medium">
              {filteredOrders.map((order) => {
                return (
                  <tr
                    key={order.id}
                    onClick={() => handleOpenOrder(order)}
                    className="cursor-pointer hover:bg-[var(--cream)]/60 transition-colors"
                  >
                    {/* Order # */}
                    <td className="py-4 pl-5 pr-3">
                      <span className="font-bold text-[var(--ink)] block">
                        {order.orderNumber}
                      </span>
                      <span className="text-[10.5px] text-[var(--ink-mute)] block mt-0.5">
                        {formatFullDate(order.date)}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="size-8 rounded-full bg-[var(--terra-soft)] text-[var(--terra-deep)] grid place-items-center font-extrabold text-xs shrink-0">
                          {getInitials(order.customer.name)}
                        </div>
                        <div>
                          <span className="font-bold text-[var(--ink)] block line-clamp-1">
                            {order.customer.name}
                          </span>
                          <span className="text-[11px] text-[var(--ink-mute)] block mt-0.5">
                            {order.customer.phone}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Items & Specs */}
                    <td className="py-4 px-3 max-w-[220px]">
                      <div className="line-clamp-1 font-bold text-[var(--ink)]">
                        {order.items.map((i) => `${i.quantity}x ${i.title}`).join(", ")}
                      </div>
                      {order.cakeConfig ? (
                        <div className="text-[11px] text-[var(--ink-mute)] mt-0.5 line-clamp-1">
                          {order.cakeConfig.size} · {order.cakeConfig.flavor}
                        </div>
                      ) : null}
                      {order.allergies && order.allergies.length > 0 && (
                        <div className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded">
                          <AlertTriangle size={10} className="text-amber-600" />
                          <span className="truncate max-w-[150px]">
                            {order.allergies.join(", ")}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Fulfillment */}
                    <td className="py-4 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[9.5px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                            order.fulfillment === "delivery"
                              ? "bg-purple-100 text-purple-900"
                              : "bg-emerald-100 text-emerald-900"
                          }`}
                        >
                          {order.fulfillment}
                        </span>
                      </div>
                      <span className="text-[11px] text-[var(--ink-soft)] block mt-1">
                        {order.timeWindow}
                      </span>
                    </td>

                    {/* Payment Status */}
                    <td className="py-4 px-3 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border inline-block ${
                          order.payment === "paid"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                            : order.payment === "deposit-paid"
                            ? "bg-amber-50 text-amber-800 border-amber-300"
                            : "bg-rose-50 text-rose-800 border-rose-300"
                        }`}
                      >
                        {order.payment.replace("-", " ")}
                      </span>
                      {order.balance > 0 && (
                        <span className="block text-[10px] text-[var(--terra)] font-bold mt-0.5">
                          Bal: {formatCurrency(order.balance)}
                        </span>
                      )}
                    </td>

                    {/* Kitchen Stage Stepper */}
                    <td className="py-4 px-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={order.stage}
                        onChange={(e) => updateOrderStage(order.id, e.target.value as OrderStage)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg border focus:outline-none transition-colors ${
                          order.stage === "collected"
                            ? "bg-gray-100 text-gray-700 border-gray-300"
                            : order.stage === "ready"
                            ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                            : order.stage === "in-oven"
                            ? "bg-amber-100 text-amber-900 border-amber-300"
                            : "bg-white text-[var(--ink)] border-[oklch(0.88_0.03_60)]"
                        }`}
                      >
                        <option value="to-make">To Make</option>
                        <option value="in-oven">In Oven</option>
                        <option value="ready">Ready for Pass</option>
                        <option value="collected">Handed Over</option>
                      </select>
                    </td>

                    {/* Total */}
                    <td className="py-4 px-3 text-right font-display text-sm font-bold text-[var(--ink)]">
                      {formatCurrency(order.total)}
                    </td>

                    {/* Actions */}
                    <td className="py-4 pr-5 pl-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenOrder(order)}
                          className="size-7 rounded-full grid place-items-center text-[var(--ink-soft)] hover:bg-[var(--cream)] hover:text-[var(--ink)] transition-colors"
                          title="View Order Details"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete order ${order.orderNumber}?`)) {
                              deleteOrder(order.id);
                            }
                          }}
                          className="size-7 rounded-full grid place-items-center text-[var(--ink-mute)] hover:bg-rose-50 hover:text-rose-700 transition-colors"
                          title="Delete Order"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Dialogs */}
      <DetailedOrderModal
        order={selectedOrder}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />

      <NewManualOrderModal
        open={newOrderOpen}
        onOpenChange={setNewOrderOpen}
        onOrderCreated={(created) => {
          setSelectedOrder(created);
          setDetailsOpen(true);
        }}
      />
    </div>
  );
}
