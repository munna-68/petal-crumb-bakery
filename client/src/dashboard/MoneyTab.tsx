import React, { useState, useMemo } from "react";
import { useBakeryStore, BakeryOrder, PaymentStatus } from "@/lib/bakeryStore";
import { formatCurrency, formatFullDate } from "./dashboardUtils";
import {
  DollarSign,
  CreditCard,
  Banknote,
  Receipt,
  Download,
  Printer,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Search,
  Filter,
} from "lucide-react";
import { toast } from "sonner";

export default function MoneyTab() {
  const { orders, updateOrderPayment } = useBakeryStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");

  // Financial Calculations
  const stats = useMemo(() => {
    let settled = 0;
    let outstanding = 0;
    let depositsHeld = 0;

    const methods: Record<string, { count: number; total: number }> = {
      card: { count: 0, total: 0 },
      "deposit-link": { count: 0, total: 0 },
      cash: { count: 0, total: 0 },
      invoice: { count: 0, total: 0 },
    };

    orders.forEach((o) => {
      const deposit = o.payment === "paid" ? o.total : o.deposit;
      settled += deposit;
      outstanding += o.balance;

      if (o.stage !== "collected" && o.deposit > 0) {
        depositsHeld += o.deposit;
      }

      const m = o.paymentMethod || "card";
      if (methods[m]) {
        methods[m].count += 1;
        methods[m].total += o.total;
      }
    });

    return {
      settled,
      outstanding,
      depositsHeld,
      totalPipeline: settled + outstanding,
      methods,
    };
  }, [orders]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (paymentFilter !== "all" && o.payment !== paymentFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchNum = o.orderNumber.toLowerCase().includes(q);
        const matchName = o.customer.name.toLowerCase().includes(q);
        const matchMethod = o.paymentMethod.toLowerCase().includes(q);
        if (!matchNum && !matchName && !matchMethod) return false;
      }
      return true;
    });
  }, [orders, paymentFilter, searchQuery]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      "Order Number",
      "Date",
      "Customer Name",
      "Customer Email",
      "Total Amount ($)",
      "Deposit Paid ($)",
      "Balance Due ($)",
      "Payment Status",
      "Payment Method",
      "Fulfillment",
      "Kitchen Stage",
    ];

    const rows = orders.map((o) => [
      o.orderNumber,
      o.date,
      `"${o.customer.name}"`,
      o.customer.email,
      o.total,
      o.deposit,
      o.balance,
      o.payment,
      o.paymentMethod,
      o.fulfillment,
      o.stage,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `petal-crumb-financial-ledger-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Financial ledger exported as CSV");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-7">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--terra)]">
              Studio Accounting
            </span>
            <span className="text-xs text-[var(--ink-mute)]">·</span>
            <span className="text-xs font-semibold text-[var(--ink-mute)]">
              Financial Ledger &amp; Reconciliation
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--ink)] mt-0.5">
            Revenue &amp; Deposits Ledger
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[oklch(0.88_0.03_60)] bg-white text-xs font-bold text-[var(--ink-soft)] hover:text-[var(--ink)] hover:border-[var(--ink)] transition-colors shadow-xs"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--ink)] hover:bg-[var(--chocolate)] text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Printer size={13} />
            <span>Print Financial Summary</span>
          </button>
        </div>
      </div>

      {/* 3 Key Financial Stat Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Settled Revenue */}
        <div className="rounded-2xl border border-[var(--hairline)] bg-[var(--paper)] p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--ink-mute)]">
              Settled Revenue
            </span>
            <div className="size-8 rounded-full bg-emerald-50 grid place-items-center text-emerald-700">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="mt-2">
            <span className="font-display text-3xl font-bold text-[var(--ink)]">
              {formatCurrency(stats.settled)}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-emerald-800 font-bold">
            Collected via card deposits and cash settlements
          </p>
        </div>

        {/* Outstanding Balances */}
        <div className="rounded-2xl border border-[var(--hairline)] bg-[var(--paper)] p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--ink-mute)]">
              Outstanding on Pickup
            </span>
            <div className="size-8 rounded-full bg-amber-50 grid place-items-center text-amber-700">
              <Clock size={16} />
            </div>
          </div>
          <div className="mt-2">
            <span className="font-display text-3xl font-bold text-[var(--terra)]">
              {formatCurrency(stats.outstanding)}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-[var(--ink-mute)]">
            Pending final balance due when collected at counter
          </p>
        </div>

        {/* Deposits Held */}
        <div className="rounded-2xl border border-[var(--hairline)] bg-[var(--paper)] p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--ink-mute)]">
              Active Deposits Held
            </span>
            <div className="size-8 rounded-full bg-purple-50 grid place-items-center text-purple-700">
              <Receipt size={16} />
            </div>
          </div>
          <div className="mt-2">
            <span className="font-display text-3xl font-bold text-[var(--ink)]">
              {formatCurrency(stats.depositsHeld)}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-[var(--ink-mute)]">
            Secured for upcoming future cake commitments
          </p>
        </div>
      </div>

      {/* Payment Method Breakdown */}
      <div className="rounded-2xl border border-[var(--hairline)] bg-[var(--paper)] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="border-b border-[var(--hairline)] pb-3">
          <h3 className="font-display text-lg font-bold text-[var(--ink)]">
            Payment Method Channel Performance
          </h3>
          <p className="text-xs text-[var(--ink-mute)]">
            Distribution across studio payment rails
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { id: "card", label: "Credit Card (Square / Terminal)", icon: <CreditCard size={15} /> },
            { id: "deposit-link", label: "Deposit Link (Stripe Online)", icon: <DollarSign size={15} /> },
            { id: "cash", label: "Cash on Pickup", icon: <Banknote size={15} /> },
            { id: "invoice", label: "Commercial Invoice (Net 14)", icon: <Receipt size={15} /> },
          ].map((item) => {
            const data = stats.methods[item.id] || { count: 0, total: 0 };
            return (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-[var(--hairline)] bg-[var(--cream)]/40 flex flex-col justify-between space-y-2"
              >
                <div className="flex items-center justify-between text-xs text-[var(--ink-soft)] font-bold">
                  <div className="flex items-center gap-1.5 text-[var(--terra)]">
                    {item.icon}
                    <span>{item.label.split(" ")[0]}</span>
                  </div>
                  <span className="text-[10px] text-[var(--ink-mute)]">{data.count} txns</span>
                </div>
                <div>
                  <span className="font-display text-xl font-bold text-[var(--ink)] block">
                    {formatCurrency(data.total)}
                  </span>
                  <span className="text-[10.5px] text-[var(--ink-mute)] mt-0.5 block truncate">
                    {item.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Payment Table */}
      <div className="rounded-2xl border border-[var(--hairline)] bg-[var(--paper)] shadow-xs overflow-hidden">
        {/* Table Filters Header */}
        <div className="p-4 sm:p-5 border-b border-[var(--hairline)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[var(--ink-mute)]" />
            <input
              type="text"
              placeholder="Search by client or order #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-[oklch(0.88_0.03_60)] bg-white text-xs focus:outline-none focus:border-[var(--terra)]"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[var(--ink-mute)]">Filter:</span>
            {["all", "paid", "deposit-paid", "pending"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setPaymentFilter(st)}
                className={`px-3 py-1 rounded-full text-xs font-bold capitalize transition-all ${
                  paymentFilter === st
                    ? "bg-[var(--ink)] text-white"
                    : "bg-white border border-[oklch(0.88_0.03_60)] text-[var(--ink-soft)]"
                }`}
              >
                {st.replace("-", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--hairline)] bg-[var(--cream)]/60 text-[10px] font-extrabold uppercase tracking-wider text-[var(--ink-mute)]">
                <th className="py-3 pl-5 pr-3">Order &amp; Date</th>
                <th className="py-3 px-3">Client</th>
                <th className="py-3 px-3">Method</th>
                <th className="py-3 px-3 text-right">Quoted Total</th>
                <th className="py-3 px-3 text-right">Deposit Captured</th>
                <th className="py-3 px-3 text-right">Balance Due</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 pr-5 pl-3 text-right">Record Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--hairline)]">
              {filteredOrders.map((order) => {
                const isPaid = order.payment === "paid";

                return (
                  <tr key={order.id} className="hover:bg-[var(--cream)]/40 transition-colors">
                    <td className="py-3.5 pl-5 pr-3">
                      <span className="font-bold text-[var(--ink)] block">
                        {order.orderNumber}
                      </span>
                      <span className="text-[10.5px] text-[var(--ink-mute)] block">
                        {formatFullDate(order.date)}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 font-semibold text-[var(--ink)]">
                      {order.customer.name}
                    </td>

                    <td className="py-3.5 px-3 uppercase text-[10px] font-extrabold text-[var(--ink-soft)]">
                      {order.paymentMethod}
                    </td>

                    <td className="py-3.5 px-3 text-right font-display text-sm font-bold text-[var(--ink)]">
                      {formatCurrency(order.total)}
                    </td>

                    <td className="py-3.5 px-3 text-right font-bold text-emerald-800">
                      {formatCurrency(order.deposit)}
                    </td>

                    <td className="py-3.5 px-3 text-right font-bold">
                      <span className={order.balance > 0 ? "text-[var(--terra)] font-black" : "text-[var(--ink-mute)]"}>
                        {formatCurrency(order.balance)}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border inline-block ${
                          order.payment === "paid"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                            : order.payment === "deposit-paid"
                            ? "bg-amber-50 text-amber-800 border-amber-300"
                            : "bg-rose-50 text-rose-800 border-rose-300"
                        }`}
                      >
                        {order.payment.replace("-", " ")}
                      </span>
                    </td>

                    <td className="py-3.5 pr-5 pl-3 text-right">
                      {!isPaid ? (
                        <button
                          type="button"
                          onClick={() => updateOrderPayment(order.id, "paid")}
                          className="px-3 py-1 rounded-full bg-[var(--terra)] hover:bg-[var(--terra-deep)] text-white text-[11px] font-bold shadow-xs transition-colors"
                        >
                          Mark Settled ($0)
                        </button>
                      ) : (
                        <span className="text-[11px] font-bold text-emerald-700 inline-flex items-center gap-1">
                          <CheckCircle2 size={12} />
                          <span>Paid in Full</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
