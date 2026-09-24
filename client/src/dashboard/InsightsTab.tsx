import { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  Award,
  Sparkles,
  PieChart as PieIcon,
  Calendar,
} from "lucide-react";
import { useBakeryStore, getIsoDateOffset } from "@/lib/bakeryStore";

export function InsightsTab() {
  const { orders } = useBakeryStore();

  const currency = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  // Compute 7-day revenue trend data
  const weeklyData = useMemo(() => {
    const days = [-6, -5, -4, -3, -2, -1, 0];
    return days.map((offset) => {
      const dateStr = getIsoDateOffset(offset);
      const d = new Date(`${dateStr}T12:00:00`);
      const dayLabel = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(d);

      // Sum revenue for this date or simulated realistic volume for portfolio demo
      const dayOrders = orders.filter((o) => o.date === dateStr);
      const rev = dayOrders.reduce((sum, o) => sum + o.total, 0);

      // Baseline demo volume if no orders seeded for that exact day
      const fallbackRev = [320, 480, 240, 560, 680, 920, 840][(offset + 6) % 7];
      return {
        day: dayLabel,
        date: dateStr,
        revenue: rev > 0 ? rev : fallbackRev,
        orders: dayOrders.length > 0 ? dayOrders.length : Math.round(fallbackRev / 85),
      };
    });
  }, [orders]);

  // Category breakdown
  const categoryData = useMemo(() => {
    return [
      { name: "Custom Tiers", value: 48, color: "var(--terra)" },
      { name: "Petite Cakes", value: 24, color: "oklch(0.52_0.07_138)" }, // sage
      { name: "Floral Cupcakes", value: 18, color: "oklch(0.72_0.1_85)" }, // butter
      { name: "Iced Cookies", value: 10, color: "oklch(0.42_0.03_42)" }, // ink
    ];
  }, []);

  // Top flavors
  const topFlavors = [
    { name: "Vanilla Bean & Summer Raspberry", share: "38%", orders: 19 },
    { name: "Valrhona Dark Chocolate & Salted Caramel", share: "28%", orders: 14 },
    { name: "Meyer Lemon Olive Oil & Verbena Curd", share: "21%", orders: 11 },
    { name: "Strawberry Milk & Vanilla Bean", share: "13%", orders: 7 },
  ];

  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + o.total, 0);
  }, [orders]);

  const avgOrderValue = useMemo(() => {
    if (orders.length === 0) return 118;
    return Math.round(totalRevenue / orders.length);
  }, [orders, totalRevenue]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="border-b border-[oklch(0.89_0.025_62)] pb-5">
        <span className="eyebrow">Studio analytics</span>
        <h2 className="mt-1 font-display text-[28px] sm:text-[32px] font-semibold leading-none text-[var(--ink)]">
          Bakery Insights &amp; Performance
        </h2>
        <p className="mt-1.5 text-[13px] text-[var(--ink-mute)]">
          Live sales volume, category product mix, and top-requested cake flavors.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-[oklch(0.89_0.025_62)] bg-[var(--paper)] p-5 shadow-xs">
          <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--terra)]">
            <span>Average Order Value</span>
            <DollarSign size={16} />
          </div>
          <p className="mt-3 font-display text-[34px] font-semibold leading-none text-[var(--ink)]">
            {currency(avgOrderValue)}
          </p>
          <p className="mt-2 text-[12px] text-emerald-700 font-semibold">
            ↑ 14% higher than last month
          </p>
        </div>

        <div className="rounded-2xl border border-[oklch(0.89_0.025_62)] bg-[var(--paper)] p-5 shadow-xs">
          <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--terra)]">
            <span>Deposit Hold Rate</span>
            <Award size={16} />
          </div>
          <p className="mt-3 font-display text-[34px] font-semibold leading-none text-[var(--ink)]">
            100%
          </p>
          <p className="mt-2 text-[12px] text-[var(--ink-mute)]">Zero unreserved calendar dates</p>
        </div>

        <div className="rounded-2xl border border-[oklch(0.89_0.025_62)] bg-[var(--paper)] p-5 shadow-xs">
          <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--terra)]">
            <span>Repeat Celebration Rate</span>
            <Users size={16} />
          </div>
          <p className="mt-3 font-display text-[34px] font-semibold leading-none text-[var(--ink)]">
            38.4%
          </p>
          <p className="mt-2 text-[12px] text-[var(--ink-mute)]">Clients booking 2nd+ celebration</p>
        </div>

        <div className="rounded-2xl border border-[oklch(0.89_0.025_62)] bg-[var(--paper)] p-5 shadow-xs">
          <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--terra)]">
            <span>Kitchen Capacity Util.</span>
            <TrendingUp size={16} />
          </div>
          <p className="mt-3 font-display text-[34px] font-semibold leading-none text-[var(--ink)]">
            86%
          </p>
          <p className="mt-2 text-[12px] text-[var(--ink-mute)]">Weekend slots fully booked</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
        {/* 7-Day Revenue Trend */}
        <div className="rounded-[1.75rem] border border-[oklch(0.89_0.025_62)] bg-[var(--paper)] p-6 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4">
            <div>
              <h3 className="font-display text-[22px] font-semibold text-[var(--ink)]">
                7-Day Revenue Trend
              </h3>
              <p className="mt-0.5 text-[12.5px] text-[var(--ink-mute)]">
                Daily celebration orders and custom cake deposits.
              </p>
            </div>
            <span className="rounded-full bg-[var(--blush)] px-3 py-1 text-[11px] font-extrabold text-[oklch(0.45_0.08_20)]">
              Trailing 7 Days
            </span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--terra)" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="var(--terra)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="oklch(0.52 0.028 42)" fontSize={12} tickLine={false} />
                <YAxis
                  stroke="oklch(0.52 0.028 42)"
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-xl border border-[oklch(0.89_0.025_62)] bg-white p-3 shadow-md text-[12.5px]">
                          <p className="font-bold text-[var(--ink)]">{data.day} ({data.date})</p>
                          <p className="text-[var(--terra)] font-semibold mt-1">Revenue: {currency(data.revenue)}</p>
                          <p className="text-[var(--ink-mute)]">{data.orders} orders scheduled</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--terra)"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Product Mix */}
        <div className="rounded-[1.75rem] border border-[oklch(0.89_0.025_62)] bg-[var(--paper)] p-6 shadow-xs">
          <div className="pb-4">
            <h3 className="font-display text-[22px] font-semibold text-[var(--ink)]">
              Category Sales Mix
            </h3>
            <p className="mt-0.5 text-[12.5px] text-[var(--ink-mute)]">
              Breakdown by dessert category.
            </p>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 text-[12px]">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="font-semibold text-[var(--ink)]">{cat.name}:</span>
                <span className="text-[var(--ink-mute)]">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Flavors Table */}
      <div className="rounded-[1.75rem] border border-[oklch(0.89_0.025_62)] bg-[var(--paper)] p-6 shadow-xs">
        <h3 className="font-display text-[22px] font-semibold text-[var(--ink)]">
          Most-Requested Cake Recipes &amp; Flavors
        </h3>
        <p className="mt-0.5 text-[12.5px] text-[var(--ink-mute)]">
          Client choices from the custom order studio and tastings.
        </p>

        <div className="mt-5 divide-y divide-[oklch(0.92_0.016_68)]">
          {topFlavors.map((flavor, index) => (
            <div key={flavor.name} className="flex items-center justify-between py-3 text-[13.5px]">
              <div className="flex items-center gap-3">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-[var(--cream)] font-mono text-[11px] font-bold text-[var(--terra)]">
                  0{index + 1}
                </span>
                <span className="font-semibold text-[var(--ink)]">{flavor.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-[var(--terra)]">{flavor.share}</span>
                <span className="text-[12px] text-[var(--ink-mute)]">({flavor.orders} celebration cakes)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
