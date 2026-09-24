import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  useBakeryStore,
  BakeryOrder,
  OrderStage,
  PaymentStatus,
  PaymentMethod,
  StudioInquiry,
  getIsoDateOffset,
} from "@/lib/bakeryStore";
import { formatCurrency, formatFullDate } from "./dashboardUtils";
import {
  MapPin,
  Phone,
  Mail,
  Printer,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ChefHat,
  Flame,
  Package,
  ShoppingBag,
  ExternalLink,
  Plus,
  Sparkles,
  CreditCard,
  Banknote,
  DollarSign,
  X,
} from "lucide-react";
import BakeryMark from "@/components/BakeryMark";
import { toast } from "sonner";

// ---------------------------------------------------------------------------
// 1. Detailed Order View Modal
// ---------------------------------------------------------------------------

interface DetailedOrderModalProps {
  order: BakeryOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DetailedOrderModal({ order, open, onOpenChange }: DetailedOrderModalProps) {
  const { updateOrderStage, updateOrderPayment, updateOrderNotes } = useBakeryStore();
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesDraft, setNotesDraft] = useState("");

  useEffect(() => {
    if (order) {
      setNotesDraft(order.notes || "");
      setEditingNotes(false);
    }
  }, [order]);

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleSaveNotes = () => {
    updateOrderNotes(order.id, notesDraft);
    setEditingNotes(false);
  };

  const stages: { key: OrderStage; label: string; icon: React.ReactNode }[] = [
    { key: "to-make", label: "To Make", icon: <ChefHat size={14} /> },
    { key: "in-oven", label: "In Oven", icon: <Flame size={14} /> },
    { key: "ready", label: "Ready for Pass", icon: <Sparkles size={14} /> },
    { key: "collected", label: "Handed Over", icon: <Package size={14} /> },
  ];

  const currentStageIndex = stages.findIndex((s) => s.key === order.stage);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[var(--paper)] p-0 border border-[oklch(0.89_0.025_62)] text-[var(--ink)] shadow-2xl rounded-2xl">
        {/* Printable Kitchen Slip Wrapper */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--hairline)] pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--terra)]">
                  {order.source}
                </span>
                <span className="text-[11px] text-[var(--ink-mute)]">·</span>
                <span className="text-[12px] font-semibold text-[var(--ink-mute)]">
                  Created {formatFullDate(order.createdAt.split("T")[0])}
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--ink)] mt-1">
                Order {order.orderNumber}
              </h2>
            </div>

            <div className="flex items-center gap-2 no-print">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[oklch(0.88_0.03_60)] bg-[var(--cream)] text-xs font-bold text-[var(--ink-soft)] hover:text-[var(--ink)] hover:border-[var(--ink)] transition-colors"
                title="Print Kitchen Ticket"
              >
                <Printer size={13} />
                <span>Print Ticket</span>
              </button>
            </div>
          </div>

          {/* Allergy Alert Banner if present */}
          {order.allergies && order.allergies.length > 0 && (
            <div className="rounded-xl border border-amber-300 bg-amber-50/80 p-4 text-amber-900 flex items-start gap-3">
              <AlertTriangle className="size-5 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <strong className="block text-xs font-extrabold uppercase tracking-wider text-amber-800">
                  Kitchen Allergy &amp; Dietary Notice
                </strong>
                <p className="text-sm font-medium mt-0.5">
                  {order.allergies.join(" · ")}
                </p>
              </div>
            </div>
          )}

          {/* Customer & Fulfillment Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-[var(--hairline)] bg-[oklch(0.975_0.015_78/0.5)] p-4 sm:p-5">
            <div>
              <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--ink-mute)]">
                Client Information
              </span>
              <p className="font-display text-lg font-bold text-[var(--ink)] mt-1">
                {order.customer.name}
              </p>
              <div className="mt-2 space-y-1 text-xs text-[var(--ink-soft)] font-medium">
                <a
                  href={`tel:${order.customer.phone}`}
                  className="flex items-center gap-1.5 hover:text-[var(--terra)] transition-colors"
                >
                  <Phone size={12} className="text-[var(--terra)]" />
                  <span>{order.customer.phone}</span>
                </a>
                <a
                  href={`mailto:${order.customer.email}`}
                  className="flex items-center gap-1.5 hover:text-[var(--terra)] transition-colors"
                >
                  <Mail size={12} className="text-[var(--terra)]" />
                  <span>{order.customer.email}</span>
                </a>
              </div>
            </div>

            <div>
              <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--ink-mute)]">
                Fulfillment Schedule
              </span>
              <div className="mt-1 flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold tracking-wide uppercase ${
                    order.fulfillment === "delivery"
                      ? "bg-purple-100 text-purple-900 border border-purple-200"
                      : "bg-emerald-100 text-emerald-900 border border-emerald-200"
                  }`}
                >
                  {order.fulfillment === "delivery" ? "Courier Delivery" : "Studio Pickup"}
                </span>
              </div>
              <div className="mt-2 space-y-1 text-xs text-[var(--ink-soft)] font-medium">
                <div className="flex items-center gap-1.5">
                  <Calendar size={12} className="text-[var(--terra)]" />
                  <span>{formatFullDate(order.date)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={12} className="text-[var(--terra)]" />
                  <span>{order.timeWindow}</span>
                </div>
              </div>

              {order.customer.address && (
                <div className="mt-2 pt-2 border-t border-[var(--hairline)]">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      order.customer.address
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-start gap-1.5 text-xs text-[var(--ink)] hover:text-[var(--terra)] transition-colors"
                  >
                    <MapPin size={12} className="mt-0.5 shrink-0 text-[var(--terra)]" />
                    <span className="underline decoration-[var(--hairline)] group-hover:decoration-[var(--terra)]">
                      {order.customer.address}
                    </span>
                    <ExternalLink size={10} className="mt-0.5 shrink-0 opacity-60" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Cake Custom Configuration (If cake or custom) */}
          {order.cakeConfig && (
            <div className="space-y-3">
              <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--terra)]">
                Cake Studio Recipe &amp; Specification
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="rounded-lg border border-[var(--hairline)] bg-[var(--cream)] p-2.5">
                  <span className="text-[10px] uppercase font-bold text-[var(--ink-mute)] block">Tier / Size</span>
                  <span className="font-bold text-[var(--ink)] mt-0.5 block">{order.cakeConfig.size}</span>
                </div>
                <div className="rounded-lg border border-[var(--hairline)] bg-[var(--cream)] p-2.5">
                  <span className="text-[10px] uppercase font-bold text-[var(--ink-mute)] block">Sponge Flavor</span>
                  <span className="font-bold text-[var(--ink)] mt-0.5 block">{order.cakeConfig.flavor}</span>
                </div>
                <div className="rounded-lg border border-[var(--hairline)] bg-[var(--cream)] p-2.5">
                  <span className="text-[10px] uppercase font-bold text-[var(--ink-mute)] block">Filling Compote</span>
                  <span className="font-bold text-[var(--ink)] mt-0.5 block">{order.cakeConfig.filling}</span>
                </div>
                <div className="rounded-lg border border-[var(--hairline)] bg-[var(--cream)] p-2.5">
                  <span className="text-[10px] uppercase font-bold text-[var(--ink-mute)] block">Exterior Frosting</span>
                  <span className="font-bold text-[var(--ink)] mt-0.5 block">{order.cakeConfig.frosting}</span>
                </div>
                <div className="rounded-lg border border-[var(--hairline)] bg-[var(--cream)] p-2.5 sm:col-span-2">
                  <span className="text-[10px] uppercase font-bold text-[var(--ink-mute)] block">Design &amp; Florals</span>
                  <span className="font-bold text-[var(--ink)] mt-0.5 block">{order.cakeConfig.complexity}</span>
                </div>
              </div>
            </div>
          )}

          {/* Line Items List */}
          <div className="space-y-2">
            <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--ink-mute)]">
              Items to Prepare
            </span>
            <div className="divide-y divide-[var(--hairline)] rounded-xl border border-[var(--hairline)] bg-[var(--paper)]">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 sm:p-4 text-sm">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[var(--ink)]">{item.title}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--cream)] font-bold text-[var(--ink-soft)]">
                        qty: {item.quantity}
                      </span>
                    </div>
                    {item.detail && (
                      <p className="text-xs text-[var(--ink-soft)] mt-0.5">{item.detail}</p>
                    )}
                  </div>
                  <span className="font-bold text-[var(--ink)]">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="rounded-xl border border-[var(--hairline)] bg-[var(--cream)] p-4 space-y-2">
            <div className="flex justify-between text-xs text-[var(--ink-soft)]">
              <span>Total Quoted Amount</span>
              <span className="font-bold text-[var(--ink)]">{formatCurrency(order.total)}</span>
            </div>
            <div className="flex justify-between text-xs text-[var(--ink-soft)]">
              <span>Deposit Paid ({order.paymentMethod})</span>
              <span className="font-bold text-emerald-800">{formatCurrency(order.deposit)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-[var(--ink)] pt-2 border-t border-[var(--hairline)]">
              <span>Remaining Balance Due</span>
              <span className={order.balance > 0 ? "text-[var(--terra)] font-black" : "text-emerald-800 font-bold"}>
                {order.balance > 0 ? `${formatCurrency(order.balance)} (Due on Pickup)` : "Settled in Full"}
              </span>
            </div>
          </div>

          {/* Kitchen Notes */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--ink-mute)]">
                Baker &amp; Client Special Notes
              </span>
              {!editingNotes && (
                <button
                  type="button"
                  onClick={() => setEditingNotes(true)}
                  className="text-xs font-bold text-[var(--terra)] hover:underline no-print"
                >
                  Edit notes
                </button>
              )}
            </div>

            {editingNotes ? (
              <div className="space-y-2 no-print">
                <textarea
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  className="w-full text-xs font-sans p-3 rounded-lg border border-[oklch(0.88_0.03_60)] bg-white focus:outline-none focus:border-[var(--terra)] min-h-[80px]"
                  placeholder="Add special instructions or delivery details..."
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingNotes(false)}
                    className="px-3 py-1 text-xs rounded-full border border-[var(--hairline)]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveNotes}
                    className="px-3 py-1 text-xs rounded-full bg-[var(--terra)] text-white font-bold"
                  >
                    Save Notes
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs bg-[var(--cream)] rounded-lg p-3 text-[var(--ink-soft)] italic border border-[var(--hairline)]">
                {order.notes || "No special instructions recorded for this order."}
              </p>
            )}
          </div>

          {/* Interactive Stage Stepper Actions (No Print) */}
          <div className="no-print pt-4 border-t border-[var(--hairline)] space-y-3">
            <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--ink-mute)] block">
              Kitchen Workflow Stage
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {stages.map((stage, idx) => {
                const isActive = order.stage === stage.key;
                const isPast = idx < currentStageIndex;
                return (
                  <button
                    key={stage.key}
                    type="button"
                    onClick={() => updateOrderStage(order.id, stage.key)}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? "bg-[var(--terra)] text-white shadow-md ring-2 ring-[var(--terra)]/20"
                        : isPast
                        ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                        : "bg-[var(--cream)] text-[var(--ink-soft)] border border-[var(--hairline)] hover:border-[var(--ink)]"
                    }`}
                  >
                    {isPast && <CheckCircle2 size={13} className="text-emerald-700" />}
                    {!isPast && stage.icon}
                    <span>{stage.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Payment Status Actions (No Print) */}
          <div className="no-print pt-2 space-y-2">
            <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--ink-mute)] block">
              Update Payment Record
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => updateOrderPayment(order.id, "paid")}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                  order.payment === "paid"
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "border-emerald-300 text-emerald-800 hover:bg-emerald-50"
                }`}
              >
                Mark Paid in Full ($0 Balance)
              </button>
              <button
                type="button"
                onClick={() => updateOrderPayment(order.id, "deposit-paid")}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                  order.payment === "deposit-paid"
                    ? "bg-amber-600 text-white border-amber-600"
                    : "border-amber-300 text-amber-800 hover:bg-amber-50"
                }`}
              >
                Mark Deposit Paid (Balance on Pickup)
              </button>
              <button
                type="button"
                onClick={() => updateOrderPayment(order.id, "pending")}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                  order.payment === "pending"
                    ? "bg-rose-600 text-white border-rose-600"
                    : "border-rose-300 text-rose-800 hover:bg-rose-50"
                }`}
              >
                Mark Pending Payment
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// 2. New Manual Order Dialog (Walk-in, Phone, or Converted Inquiry)
// ---------------------------------------------------------------------------

interface NewOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialInquiry?: StudioInquiry | null;
  onOrderCreated?: (order: BakeryOrder) => void;
}

export function NewManualOrderModal({
  open,
  onOpenChange,
  initialInquiry,
  onOrderCreated,
}: NewOrderModalProps) {
  const { addOrder, updateInquiryStatus } = useBakeryStore();

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [fulfillment, setFulfillment] = useState<"pickup" | "delivery">("pickup");
  const [date, setDate] = useState(getIsoDateOffset(1));
  const [timeWindow, setTimeWindow] = useState("11:30 AM – 12:30 PM");

  const [orderCategory, setOrderCategory] = useState<
    "cake" | "cupcakes" | "cookies" | "custom"
  >("cake");

  // Cake Config
  const [cakeSize, setCakeSize] = useState("8-inch");
  const [cakeFlavor, setCakeFlavor] = useState("Vanilla Bean");
  const [cakeFilling, setCakeFilling] = useState("Raspberry Rose Jam");
  const [cakeFrosting, setCakeFrosting] = useState("Textured Buttercream");
  const [cakeComplexity, setCakeComplexity] = useState("Signature Floral");

  // Line items
  const [itemTitle, setItemTitle] = useState("Celebration Cake (8-inch)");
  const [itemDetail, setItemDetail] = useState("Handmade botanical finish");
  const [itemQuantity, setItemQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(96);
  const [depositPaid, setDepositPaid] = useState(48);

  const [allergiesText, setAllergiesText] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("deposit-paid");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("deposit-link");

  // Prefill from initialInquiry if provided
  useEffect(() => {
    if (initialInquiry) {
      setCustomerName(initialInquiry.name || "");
      setCustomerEmail(initialInquiry.email || "");
      if (initialInquiry.preferredDate) {
        setDate(initialInquiry.preferredDate);
      }
      setNotes(`Occasion: ${initialInquiry.occasion} · Inquiry details: ${initialInquiry.detail}`);
      setItemTitle(`${initialInquiry.occasion} Cake`);
      setItemDetail(initialInquiry.detail.slice(0, 80));
    }
  }, [initialInquiry]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      toast.error("Please enter a client name");
      return;
    }

    const allergies = allergiesText
      ? allergiesText.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const isCake = orderCategory === "cake" || orderCategory === "custom";

    const newOrder = addOrder({
      customer: {
        name: customerName.trim(),
        email: customerEmail.trim() || "counter@petalandcrumb.com",
        phone: customerPhone.trim() || "(503) 555-COUNTER",
        address: fulfillment === "delivery" ? customerAddress.trim() : undefined,
      },
      type: orderCategory,
      fulfillment,
      date,
      timeWindow,
      stage: "to-make",
      payment: paymentStatus,
      paymentMethod,
      total: Number(totalPrice),
      deposit: Number(depositPaid),
      balance: Math.max(0, Number(totalPrice) - Number(depositPaid)),
      notes: notes.trim(),
      allergies,
      source: initialInquiry ? "Custom Studio" : "Phone / Counter",
      items: [
        {
          title: itemTitle || "Studio Bakery Item",
          detail: itemDetail || (isCake ? `${cakeFlavor} with ${cakeFilling}` : ""),
          quantity: Number(itemQuantity) || 1,
          price: Number(totalPrice),
        },
      ],
      cakeConfig: isCake
        ? {
            size: cakeSize,
            flavor: cakeFlavor,
            filling: cakeFilling,
            frosting: cakeFrosting,
            complexity: cakeComplexity,
          }
        : undefined,
    });

    if (initialInquiry) {
      updateInquiryStatus(initialInquiry.id, "converted");
    }

    if (onOrderCreated) {
      onOrderCreated(newOrder);
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto bg-[var(--paper)] p-6 sm:p-8 border border-[oklch(0.89_0.025_62)] text-[var(--ink)] shadow-2xl rounded-2xl">
        <DialogHeader className="border-b border-[var(--hairline)] pb-4">
          <div className="flex items-center gap-2">
            <BakeryMark size="sm" />
            <DialogTitle className="font-display text-2xl font-bold text-[var(--ink)]">
              {initialInquiry ? "Convert Inquiry to Order" : "Record New Studio Order"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-[var(--ink-mute)]">
            Create an active kitchen ticket for counter walk-ins, phone commissions, or custom consultations.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-5 space-y-6">
          {/* Customer Details */}
          <div className="space-y-3">
            <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--terra)]">
              1. Customer Information
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-[var(--ink-soft)] block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Clara Vance"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[oklch(0.88_0.03_60)] bg-white focus:outline-none focus:border-[var(--terra)]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--ink-soft)] block mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="(503) 555-0143"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[oklch(0.88_0.03_60)] bg-white focus:outline-none focus:border-[var(--terra)]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-[var(--ink-soft)] block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="clara.vance@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[oklch(0.88_0.03_60)] bg-white focus:outline-none focus:border-[var(--terra)]"
                />
              </div>
            </div>
          </div>

          {/* Fulfillment Schedule */}
          <div className="space-y-3">
            <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--terra)]">
              2. Fulfillment &amp; Date
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-[var(--ink-soft)] block mb-1">
                  Fulfillment Type
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFulfillment("pickup")}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                      fulfillment === "pickup"
                        ? "bg-[var(--terra)] text-white border-[var(--terra)]"
                        : "bg-[var(--cream)] text-[var(--ink-soft)] border-[var(--hairline)]"
                    }`}
                  >
                    Pickup
                  </button>
                  <button
                    type="button"
                    onClick={() => setFulfillment("delivery")}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                      fulfillment === "delivery"
                        ? "bg-[var(--terra)] text-white border-[var(--terra)]"
                        : "bg-[var(--cream)] text-[var(--ink-soft)] border-[var(--hairline)]"
                    }`}
                  >
                    Delivery
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--ink-soft)] block mb-1">
                  Target Date
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[oklch(0.88_0.03_60)] bg-white focus:outline-none focus:border-[var(--terra)]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--ink-soft)] block mb-1">
                  Time Window
                </label>
                <select
                  value={timeWindow}
                  onChange={(e) => setTimeWindow(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[oklch(0.88_0.03_60)] bg-white focus:outline-none focus:border-[var(--terra)]"
                >
                  <option value="9:30 AM – 10:30 AM">Morning: 9:30 AM – 10:30 AM</option>
                  <option value="11:30 AM – 12:30 PM">Morning: 11:30 AM – 12:30 PM</option>
                  <option value="1:00 PM – 2:00 PM">Midday: 1:00 PM – 2:00 PM</option>
                  <option value="2:00 PM – 3:30 PM">Midday: 2:00 PM – 3:30 PM</option>
                  <option value="3:30 PM – 4:30 PM">Afternoon: 3:30 PM – 4:30 PM</option>
                  <option value="5:00 PM – 6:00 PM">Evening: 5:00 PM – 6:00 PM</option>
                </select>
              </div>

              {fulfillment === "delivery" && (
                <div className="sm:col-span-3">
                  <label className="text-xs font-bold text-[var(--ink-soft)] block mb-1">
                    Delivery Address &amp; Access Notes
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1029 NW Couch St, Portland, OR 97209"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-[oklch(0.88_0.03_60)] bg-white focus:outline-none focus:border-[var(--terra)]"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Product & Cake Configuration */}
          <div className="space-y-3">
            <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--terra)]">
              3. Order Details &amp; Cake Crafting
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(["cake", "cupcakes", "cookies", "custom"] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setOrderCategory(cat);
                    if (cat === "cupcakes") {
                      setItemTitle("Wildflower Cupcake Dozen");
                      setTotalPrice(42);
                      setDepositPaid(42);
                    } else if (cat === "cookies") {
                      setItemTitle("Pressed Botanical Butter Shortbread");
                      setTotalPrice(34);
                      setDepositPaid(34);
                    } else if (cat === "cake") {
                      setItemTitle("Celebration Cake (8-inch)");
                      setTotalPrice(96);
                      setDepositPaid(48);
                    }
                  }}
                  className={`py-2 text-xs font-bold capitalize rounded-lg border transition-all ${
                    orderCategory === cat
                      ? "bg-[var(--terra)] text-white border-[var(--terra)]"
                      : "bg-[var(--cream)] text-[var(--ink-soft)] border-[var(--hairline)]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {(orderCategory === "cake" || orderCategory === "custom") && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl border border-[var(--hairline)] bg-[var(--cream)]/60">
                <div>
                  <label className="text-[11px] font-bold text-[var(--ink-mute)] block mb-1">
                    Size / Tier
                  </label>
                  <select
                    value={cakeSize}
                    onChange={(e) => setCakeSize(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-[oklch(0.88_0.03_60)] bg-white"
                  >
                    <option value="6-inch">6-inch (Serves 6–8)</option>
                    <option value="8-inch">8-inch (Serves 12–16)</option>
                    <option value="Two-tier">Two-tier (Serves 35–45)</option>
                    <option value="Three-tier">Three-tier (Serves 80–100)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[var(--ink-mute)] block mb-1">
                    Sponge Flavor
                  </label>
                  <select
                    value={cakeFlavor}
                    onChange={(e) => setCakeFlavor(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-[oklch(0.88_0.03_60)] bg-white"
                  >
                    <option value="Vanilla Bean">Vanilla Bean</option>
                    <option value="Dark Chocolate Truffle">Dark Chocolate Truffle</option>
                    <option value="Meyer Lemon Verbena">Meyer Lemon Verbena</option>
                    <option value="Pistachio Blossom">Pistachio Blossom</option>
                    <option value="Champagne Velvet">Champagne Velvet</option>
                    <option value="Earl Grey Lavender">Earl Grey Lavender</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[var(--ink-mute)] block mb-1">
                    Filling Compote
                  </label>
                  <select
                    value={cakeFilling}
                    onChange={(e) => setCakeFilling(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-[oklch(0.88_0.03_60)] bg-white"
                  >
                    <option value="Raspberry Rose Jam">Raspberry Rose Jam</option>
                    <option value="Fresh Lemon Curd">Fresh Lemon Curd</option>
                    <option value="Wild Blackberry Compote">Wild Blackberry Compote</option>
                    <option value="Salted Caramel">Salted Caramel</option>
                    <option value="Vanilla Pastry Cream">Vanilla Pastry Cream</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[var(--ink-mute)] block mb-1">
                    Exterior Frosting
                  </label>
                  <select
                    value={cakeFrosting}
                    onChange={(e) => setCakeFrosting(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-[oklch(0.88_0.03_60)] bg-white"
                  >
                    <option value="Textured Buttercream">Textured Buttercream</option>
                    <option value="Smooth Silk Buttercream">Smooth Silk Buttercream</option>
                    <option value="Silk Dark Chocolate Ganache">Silk Ganache</option>
                    <option value="Semi-Naked Crumb Coat">Semi-Naked</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold text-[var(--ink-mute)] block mb-1">
                    Florals &amp; Decor
                  </label>
                  <select
                    value={cakeComplexity}
                    onChange={(e) => setCakeComplexity(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-[oklch(0.88_0.03_60)] bg-white"
                  >
                    <option value="Signature Floral">Signature Organic Floral Crown</option>
                    <option value="Pressed Botanical Cascade">Pressed Botanical Cascade (Violas &amp; Borage)</option>
                    <option value="Subtle Petal Accent">Subtle Petal Accent &amp; Thyme Sprigs</option>
                    <option value="Gold Leaf & Garden Blooms">Gold Leaf &amp; Garden Blooms</option>
                  </select>
                </div>
              </div>
            )}

            {/* Title & Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-[var(--ink-soft)] block mb-1">
                  Item Title
                </label>
                <input
                  type="text"
                  value={itemTitle}
                  onChange={(e) => setItemTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[oklch(0.88_0.03_60)] bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--ink-soft)] block mb-1">
                  Allergies (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Nut-free, Dairy-free"
                  value={allergiesText}
                  onChange={(e) => setAllergiesText(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[oklch(0.88_0.03_60)] bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[var(--ink-soft)] block mb-1">
                Baker &amp; Client Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Inscriptions, color palette requests, celebration details..."
                className="w-full text-xs p-2.5 rounded-lg border border-[oklch(0.88_0.03_60)] bg-white min-h-[60px]"
              />
            </div>
          </div>

          {/* Pricing & Payment Status */}
          <div className="space-y-3 p-4 rounded-xl border border-[var(--hairline)] bg-[var(--cream)]">
            <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--terra)]">
              4. Pricing &amp; Payment Ledger
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-xs font-bold text-[var(--ink-soft)] block mb-1">
                  Total Price ($)
                </label>
                <input
                  type="number"
                  min="0"
                  value={totalPrice}
                  onChange={(e) => {
                    const t = Number(e.target.value);
                    setTotalPrice(t);
                    setDepositPaid(paymentStatus === "paid" ? t : Math.round(t * 0.5));
                  }}
                  className="w-full text-xs p-2.5 rounded-lg border border-[oklch(0.88_0.03_60)] bg-white font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--ink-soft)] block mb-1">
                  Deposit Captured ($)
                </label>
                <input
                  type="number"
                  min="0"
                  max={totalPrice}
                  value={depositPaid}
                  onChange={(e) => setDepositPaid(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-lg border border-[oklch(0.88_0.03_60)] bg-white font-bold text-emerald-800"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--ink-soft)] block mb-1">
                  Payment Status
                </label>
                <select
                  value={paymentStatus}
                  onChange={(e) => {
                    const st = e.target.value as PaymentStatus;
                    setPaymentStatus(st);
                    if (st === "paid") setDepositPaid(totalPrice);
                    else if (st === "pending") setDepositPaid(0);
                    else setDepositPaid(Math.round(totalPrice * 0.5));
                  }}
                  className="w-full text-xs p-2.5 rounded-lg border border-[oklch(0.88_0.03_60)] bg-white"
                >
                  <option value="deposit-paid">Deposit Paid</option>
                  <option value="paid">Paid in Full</option>
                  <option value="pending">Pending Payment</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--ink-soft)] block mb-1">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[oklch(0.88_0.03_60)] bg-white"
                >
                  <option value="card">Credit Card</option>
                  <option value="deposit-link">Deposit Link (Stripe)</option>
                  <option value="cash">Cash on Pickup</option>
                  <option value="invoice">Studio Invoice</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs pt-2 border-t border-[var(--hairline)]">
              <span className="font-semibold text-[var(--ink-soft)]">Remaining Balance on Pass:</span>
              <span className="font-bold text-[var(--terra)] text-sm">
                {formatCurrency(Math.max(0, totalPrice - depositPaid))}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-5 py-2.5 text-xs font-bold rounded-full border border-[oklch(0.88_0.03_60)] hover:bg-[var(--cream)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold rounded-full bg-[var(--terra)] hover:bg-[var(--terra-deep)] text-white shadow-md transition-all"
            >
              Create Kitchen Order
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
