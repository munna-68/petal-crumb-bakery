import { useState, useMemo } from "react";
import {
  Users,
  Search,
  Mail,
  Phone,
  Calendar,
  Sparkles,
  MapPin,
  Heart,
  Award,
  AlertTriangle,
} from "lucide-react";
import { useBakeryStore } from "@/lib/bakeryStore";

export function CustomersTab() {
  const { orders } = useBakeryStore();
  const [search, setSearch] = useState("");

  const currency = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  // Aggregate unique customers from all orders
  const customerList = useMemo(() => {
    const map = new Map<
      string,
      {
        name: string;
        email: string;
        phone: string;
        address?: string;
        orderCount: number;
        totalSpent: number;
        allergies: Set<string>;
        orders: { id: string; number: string; date: string; title: string; total: number }[];
        lastDate: string;
      }
    >();

    orders.forEach((o) => {
      const key = o.customer.email.toLowerCase() || o.customer.name.toLowerCase();
      const existing = map.get(key);

      const title =
        o.items.map((i) => i.title).join(", ") ||
        (o.cakeConfig ? `${o.cakeConfig.size} ${o.cakeConfig.flavor}` : "Custom Cake");

      if (existing) {
        existing.orderCount += 1;
        existing.totalSpent += o.total;
        if (o.customer.address) existing.address = o.customer.address;
        if (o.customer.phone && !existing.phone) existing.phone = o.customer.phone;
        o.allergies.forEach((a) => existing.allergies.add(a));
        existing.orders.push({
          id: o.id,
          number: o.orderNumber,
          date: o.date,
          title,
          total: o.total,
        });
        if (o.date > existing.lastDate) existing.lastDate = o.date;
      } else {
        const allergiesSet = new Set<string>();
        o.allergies.forEach((a) => allergiesSet.add(a));
        map.set(key, {
          name: o.customer.name,
          email: o.customer.email,
          phone: o.customer.phone || "(503) 555-0142",
          address: o.customer.address,
          orderCount: 1,
          totalSpent: o.total,
          allergies: allergiesSet,
          orders: [
            {
              id: o.id,
              number: o.orderNumber,
              date: o.date,
              title,
              total: o.total,
            },
          ],
          lastDate: o.date,
        });
      }
    });

    return Array.from(map.values());
  }, [orders]);

  const filtered = useMemo(() => {
    return customerList.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search)
    );
  }, [customerList, search]);

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    return parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[oklch(0.89_0.025_62)] pb-5">
        <div>
          <span className="eyebrow">Client relationships</span>
          <h2 className="mt-1 font-display text-[28px] sm:text-[32px] font-semibold leading-none text-[var(--ink)]">
            Celebration Clients CRM
          </h2>
          <p className="mt-1.5 text-[13px] text-[var(--ink-mute)]">
            Directory of hosts and patrons who order custom cakes and seasonal sweets.
          </p>
        </div>

        {/* Search */}
        <div className="relative min-w-[260px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--ink-mute)]" />
          <input
            type="text"
            placeholder="Search by client or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="field-base pl-10 text-[13px]"
          />
        </div>
      </div>

      {/* Customer Count / Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[oklch(0.89_0.025_62)] bg-[var(--paper)] p-5 shadow-xs">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--terra)]">
            Total Active Clients
          </p>
          <p className="mt-2 font-display text-[32px] font-semibold text-[var(--ink)]">
            {customerList.length}
          </p>
          <p className="mt-1 text-[12px] text-[var(--ink-mute)]">Portland hosts &amp; patrons</p>
        </div>

        <div className="rounded-2xl border border-[oklch(0.89_0.025_62)] bg-[var(--paper)] p-5 shadow-xs">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--terra)]">
            VIP Celebration Hosts
          </p>
          <p className="mt-2 font-display text-[32px] font-semibold text-[var(--ink)]">
            {customerList.filter((c) => c.orderCount > 1 || c.totalSpent > 150).length}
          </p>
          <p className="mt-1 text-[12px] text-[var(--ink-mute)]">Multiple bookings or $150+ spend</p>
        </div>

        <div className="rounded-2xl border border-[oklch(0.89_0.025_62)] bg-[var(--paper)] p-5 shadow-xs">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--terra)]">
            Allergy Care Flagged
          </p>
          <p className="mt-2 font-display text-[32px] font-semibold text-[var(--ink)]">
            {customerList.filter((c) => c.allergies.size > 0).length}
          </p>
          <p className="mt-1 text-[12px] text-[var(--ink-mute)]">Gluten-free, dairy, or nut notes</p>
        </div>
      </div>

      {/* Customer Cards Grid */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((customer) => {
          const isVip = customer.orderCount > 1 || customer.totalSpent > 180;
          const hasAllergies = customer.allergies.size > 0;

          return (
            <article
              key={customer.email}
              className="flex flex-col justify-between rounded-[1.75rem] border border-[oklch(0.89_0.025_62)] bg-[var(--paper)] p-6 shadow-xs transition-all hover:border-[oklch(0.78_0.045_50)] hover:shadow-sm"
            >
              <div>
                {/* Header */}
                <div className="flex items-start gap-3.5">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[var(--blush)] font-display text-[16px] font-bold text-[oklch(0.45_0.08_20)]">
                    {getInitials(customer.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="truncate font-display text-[20px] font-semibold text-[var(--ink)]">
                        {customer.name}
                      </h3>
                      {isVip && (
                        <span
                          className="shrink-0 rounded-full bg-[var(--butter-soft)] px-2 py-0.5 text-[9.5px] font-extrabold uppercase tracking-[0.1em] text-[var(--butter-deep)]"
                          title="VIP Celebration Host"
                        >
                          VIP
                        </span>
                      )}
                    </div>
                    <p className="truncate text-[12.5px] text-[var(--ink-mute)]">{customer.email}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="mt-4 space-y-2 text-[12.5px] text-[var(--ink-soft)]">
                  <p className="flex items-center gap-2">
                    <Phone size={13} className="text-[var(--terra)]" /> {customer.phone}
                  </p>
                  {customer.address && (
                    <p className="flex items-center gap-2 truncate">
                      <MapPin size={13} className="text-[var(--terra)] shrink-0" /> {customer.address}
                    </p>
                  )}
                  <p className="flex items-center gap-2">
                    <Calendar size={13} className="text-[var(--terra)]" /> Last Celebration:{" "}
                    <strong className="text-[var(--ink)]">{customer.lastDate}</strong>
                  </p>
                </div>

                {/* Allergies Notice */}
                {hasAllergies && (
                  <div className="mt-3 flex items-center gap-1.5 rounded-xl bg-red-50 p-2.5 text-[11.5px] font-bold text-red-800">
                    <AlertTriangle size={14} className="shrink-0 text-red-600" />
                    <span>Noted: {Array.from(customer.allergies).join(", ")}</span>
                  </div>
                )}

                {/* Past Orders Pill List */}
                <div className="mt-4 border-t border-[oklch(0.92_0.016_68)] pt-3">
                  <p className="text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-[var(--ink-mute)]">
                    Order History ({customer.orderCount})
                  </p>
                  <div className="mt-2 space-y-1.5">
                    {customer.orders.slice(0, 3).map((ord) => (
                      <div key={ord.id} className="flex items-center justify-between text-[12px]">
                        <span className="font-mono text-[10.5px] text-[var(--terra)]">{ord.number}</span>
                        <span className="truncate max-w-[160px] text-[var(--ink-soft)]">{ord.title}</span>
                        <span className="font-semibold text-[var(--ink)]">{currency(ord.total)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Total Spend Footer */}
              <div className="mt-5 flex items-baseline justify-between border-t border-[oklch(0.92_0.016_68)] pt-3">
                <span className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-[var(--ink-mute)]">
                  Lifetime Value
                </span>
                <span className="font-display text-[22px] font-semibold text-[var(--ink)]">
                  {currency(customer.totalSpent)}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
