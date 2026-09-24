import React, { useState, useMemo, useEffect } from "react";
import {
  useBakeryStore,
  BakeryOrder,
  getIsoDateOffset,
} from "@/lib/bakeryStore";
import { formatFullDate } from "./dashboardUtils";
import {
  Printer,
  ChefHat,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  Flame,
  CheckSquare,
  Square,
  AlertTriangle,
} from "lucide-react";
import BakeryMark from "@/components/BakeryMark";

const DEFAULT_CHECKLIST = [
  { id: "batters", label: "Sponge batters scaled & mixed to temperature" },
  { id: "baked", label: "Tiers baked, leveled, and cooled on racks" },
  { id: "buttercreams", label: "Buttercreams & ganaches whipped, flavored, and tinted" },
  { id: "fillings", label: "House fruit compotes and curds brought to room temperature" },
  { id: "assembly", label: "Cakes layered, soaked, and crumb-coated" },
  { id: "florals", label: "Final textured finish applied; organic garden florals placed" },
  { id: "packaging", label: "Boxed with satin ribbon, allergen tags, and care guide" },
];

export default function BakeSheetTab() {
  const { orders } = useBakeryStore();

  const [selectedDate, setSelectedDate] = useState<string>(getIsoDateOffset(0));
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});

  // Load checklist from localStorage for this date
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`petal_crumb_bake_checklist_${selectedDate}`);
      if (saved) {
        setChecklist(JSON.parse(saved));
      } else {
        setChecklist({});
      }
    } catch {
      setChecklist({});
    }
  }, [selectedDate]);

  const toggleChecklistItem = (id: string) => {
    const updated = { ...checklist, [id]: !checklist[id] };
    setChecklist(updated);
    try {
      localStorage.setItem(`petal_crumb_bake_checklist_${selectedDate}`, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Orders for selected date
  const dayOrders = useMemo(() => {
    const matched = orders.filter((o) => o.date === selectedDate);
    // If no orders on selected date, show active orders so sheet is populated
    return matched.length > 0 ? matched : orders.filter((o) => o.stage !== "collected").slice(0, 4);
  }, [orders, selectedDate]);

  // Aggregate Sponge Requirements
  const spongeTiers = useMemo(() => {
    const map = new Map<string, { size: string; flavor: string; count: number; orders: string[] }>();

    dayOrders.forEach((o) => {
      if (o.cakeConfig) {
        const key = `${o.cakeConfig.size} — ${o.cakeConfig.flavor}`;
        const existing = map.get(key) || {
          size: o.cakeConfig.size,
          flavor: o.cakeConfig.flavor,
          count: 0,
          orders: [],
        };
        existing.count += 1;
        existing.orders.push(o.orderNumber);
        map.set(key, existing);
      } else {
        // Check items for cakes
        o.items.forEach((item) => {
          if (item.title.toLowerCase().includes("cake")) {
            const key = item.title;
            const existing = map.get(key) || {
              size: "Standard",
              flavor: item.detail || item.title,
              count: 0,
              orders: [],
            };
            existing.count += item.quantity;
            existing.orders.push(o.orderNumber);
            map.set(key, existing);
          }
        });
      }
    });

    return Array.from(map.values());
  }, [dayOrders]);

  // Aggregate Fillings & Buttercreams
  const fillingsAndFrostings = useMemo(() => {
    const fillings = new Map<string, number>();
    const frostings = new Map<string, number>();

    dayOrders.forEach((o) => {
      if (o.cakeConfig) {
        if (o.cakeConfig.filling) {
          fillings.set(o.cakeConfig.filling, (fillings.get(o.cakeConfig.filling) || 0) + 1);
        }
        if (o.cakeConfig.frosting) {
          frostings.set(o.cakeConfig.frosting, (frostings.get(o.cakeConfig.frosting) || 0) + 1);
        }
      }
    });

    // Default essential preparations if list is short
    if (fillings.size === 0) {
      fillings.set("Raspberry Rose Jam Compote", 2);
      fillings.set("Fresh Meyer Lemon Curd", 1);
    }
    if (frostings.size === 0) {
      frostings.set("Signature Textured Buttercream", 3);
      frostings.set("Silk Dark Ganache", 1);
    }

    return {
      fillings: Array.from(fillings.entries()),
      frostings: Array.from(frostings.entries()),
    };
  }, [dayOrders]);

  // Aggregate Cupcakes & Cookies
  const bakedTreats = useMemo(() => {
    const treats: { title: string; quantity: number; notes: string }[] = [];

    dayOrders.forEach((o) => {
      o.items.forEach((item) => {
        if (!item.title.toLowerCase().includes("cake") || item.title.toLowerCase().includes("cupcake")) {
          treats.push({
            title: item.title,
            quantity: item.quantity,
            notes: item.detail,
          });
        }
      });
    });

    return treats;
  }, [dayOrders]);

  // Checklist completion calculation
  const completedCount = useMemo(() => {
    return DEFAULT_CHECKLIST.filter((item) => checklist[item.id]).length;
  }, [checklist]);

  const completionPct = Math.round((completedCount / DEFAULT_CHECKLIST.length) * 100);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-7 bake-sheet-container">
      {/* Top Header & Actions Bar (no-print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--hairline)] pb-5 no-print">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--terra)]">
              Kitchen Bench Operations
            </span>
            <span className="text-xs text-[var(--ink-mute)]">·</span>
            <span className="text-xs font-semibold text-[var(--ink-mute)]">
              Daily Production Planner
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--ink)] mt-0.5">
            Bake Sheet &amp; Prep Deck
          </h2>
        </div>

        {/* Date Selector & Print Button */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-white border border-[oklch(0.88_0.03_60)] rounded-full px-3 py-1.5 shadow-xs">
            <Calendar size={13} className="text-[var(--terra)]" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs font-bold text-[var(--ink)] bg-transparent focus:outline-none cursor-pointer"
            />
          </div>

          <button
            type="button"
            onClick={() => setSelectedDate(getIsoDateOffset(0))}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
              selectedDate === getIsoDateOffset(0)
                ? "bg-[var(--terra-soft)] text-[var(--terra-deep)] border-[var(--terra)]"
                : "bg-white border-[oklch(0.88_0.03_60)] text-[var(--ink-soft)] hover:text-[var(--ink)]"
            }`}
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => setSelectedDate(getIsoDateOffset(1))}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
              selectedDate === getIsoDateOffset(1)
                ? "bg-[var(--terra-soft)] text-[var(--terra-deep)] border-[var(--terra)]"
                : "bg-white border-[oklch(0.88_0.03_60)] text-[var(--ink-soft)] hover:text-[var(--ink)]"
            }`}
          >
            Tomorrow
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--ink)] hover:bg-[var(--chocolate)] text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Printer size={14} />
            <span>Print Kitchen Slip</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet Branding Header (Visible in print and screen) */}
      <div className="rounded-2xl border border-[var(--hairline)] bg-[var(--paper)] p-6 sm:p-8 shadow-xs space-y-6 print:border-none print:shadow-none print:p-0">
        <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-5">
          <div className="flex items-center gap-3">
            <BakeryMark size="md" />
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--ink)]">
                Petal &amp; Crumb Cake Studio
              </h1>
              <p className="text-xs text-[var(--ink-mute)] font-semibold uppercase tracking-wider">
                Daily Bench Production Sheet · {formatFullDate(selectedDate)}
              </p>
            </div>
          </div>
          <div className="text-right text-xs text-[var(--ink-soft)] font-medium">
            <span className="block font-bold text-base text-[var(--ink)]">
              {dayOrders.length} Orders
            </span>
            <span className="text-[11px] text-[var(--ink-mute)]">
              Division St Studio Pass
            </span>
          </div>
        </div>

        {/* 1. Morning Bake Checklist */}
        <div className="rounded-xl border border-[oklch(0.89_0.025_62)] bg-[var(--cream)]/60 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--hairline)] pb-3">
            <div>
              <h3 className="font-display text-base font-bold text-[var(--ink)]">
                Kitchen Bench Morning Checklist
              </h3>
              <p className="text-xs text-[var(--ink-mute)]">
                Standard operating sequence for sponge baking, cooling, and presentation
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-24 bg-white rounded-full h-2 overflow-hidden border border-[var(--hairline)]">
                <div
                  className="bg-[var(--terra)] h-full transition-all duration-300"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
              <span className="text-xs font-bold text-[var(--ink)]">
                {completedCount}/{DEFAULT_CHECKLIST.length} ({completionPct}%)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {DEFAULT_CHECKLIST.map((item) => {
              const isChecked = Boolean(checklist[item.id]);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleChecklistItem(item.id)}
                  className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                    isChecked
                      ? "bg-emerald-50/80 border-emerald-300 text-emerald-950 font-semibold"
                      : "bg-white border-[oklch(0.89_0.025_62)] text-[var(--ink-soft)] hover:border-[var(--ink)]"
                  }`}
                >
                  <div className="mt-0.5 shrink-0 text-[var(--terra)]">
                    {isChecked ? (
                      <CheckCircle2 size={16} className="text-emerald-700" />
                    ) : (
                      <Square size={16} className="text-[var(--ink-mute)]" />
                    )}
                  </div>
                  <span className={`text-xs ${isChecked ? "line-through opacity-80" : ""}`}>
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Sponge Tier Requirements Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Flame size={16} className="text-[var(--terra)]" />
            <h3 className="font-display text-lg font-bold text-[var(--ink)]">
              Sponge Tier Requirements
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {spongeTiers.length === 0 ? (
              <div className="col-span-full py-6 text-center text-xs text-[var(--ink-mute)] italic bg-white rounded-xl border border-[var(--hairline)]">
                No sponge tiers required for this date.
              </div>
            ) : (
              spongeTiers.map((tier, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-[var(--hairline)] bg-white p-4 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--terra-soft)] text-[var(--terra-deep)]">
                        {tier.size}
                      </span>
                      <span className="font-display text-xl font-black text-[var(--ink)]">
                        × {tier.count}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-[var(--ink)] mt-2">
                      {tier.flavor}
                    </h4>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[var(--hairline)] text-[10.5px] text-[var(--ink-mute)]">
                    For Orders: {tier.orders.join(", ")}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 3. Fillings, Buttercreams & Treats Prep */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Fillings & Buttercreams */}
          <div className="rounded-xl border border-[var(--hairline)] bg-white p-5 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 border-b border-[var(--hairline)] pb-3">
              <ChefHat size={16} className="text-[var(--terra)]" />
              <h4 className="font-display text-base font-bold text-[var(--ink)]">
                Fillings &amp; Buttercreams
              </h4>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--ink-mute)] block mb-1.5">
                  Compotes, Jams &amp; Curds
                </span>
                <ul className="space-y-1.5 text-xs text-[var(--ink-soft)]">
                  {fillingsAndFrostings.fillings.map(([filling, count], idx) => (
                    <li key={idx} className="flex justify-between items-center py-1 border-b border-dashed border-[var(--hairline)]">
                      <span className="font-medium">{filling}</span>
                      <span className="font-bold text-[var(--ink)]">{count} batch{count > 1 ? "es" : ""}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2">
                <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--ink-mute)] block mb-1.5">
                  Whipped Buttercreams &amp; Ganaches
                </span>
                <ul className="space-y-1.5 text-xs text-[var(--ink-soft)]">
                  {fillingsAndFrostings.frostings.map(([frosting, count], idx) => (
                    <li key={idx} className="flex justify-between items-center py-1 border-b border-dashed border-[var(--hairline)]">
                      <span className="font-medium">{frosting}</span>
                      <span className="font-bold text-[var(--ink)]">{count} cake{count > 1 ? "s" : ""}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Cupcakes & Cookies count */}
          <div className="rounded-xl border border-[var(--hairline)] bg-white p-5 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 border-b border-[var(--hairline)] pb-3">
              <Sparkles size={16} className="text-[var(--terra)]" />
              <h4 className="font-display text-base font-bold text-[var(--ink)]">
                Cupcakes &amp; Cookie Boxes
              </h4>
            </div>

            {bakedTreats.length === 0 ? (
              <p className="text-xs text-[var(--ink-mute)] italic py-4">
                No auxiliary cupcakes or cookies ordered for this date.
              </p>
            ) : (
              <div className="space-y-2.5">
                {bakedTreats.map((treat, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border border-[var(--hairline)] bg-[var(--cream)]/40 flex justify-between items-center"
                  >
                    <div>
                      <span className="font-bold text-xs text-[var(--ink)] block">
                        {treat.title}
                      </span>
                      {treat.notes && (
                        <span className="text-[11px] text-[var(--ink-mute)] block mt-0.5">
                          {treat.notes}
                        </span>
                      )}
                    </div>
                    <span className="font-display text-base font-black text-[var(--ink)]">
                      × {treat.quantity}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 4. Complete Orders Table on this Day */}
        <div className="space-y-3 pt-2">
          <h3 className="font-display text-base font-bold text-[var(--ink)]">
            Orders Service Manifest
          </h3>

          <div className="overflow-x-auto rounded-xl border border-[var(--hairline)] bg-white">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[var(--hairline)] bg-[var(--cream)]/70 text-[10px] font-extrabold uppercase tracking-wider text-[var(--ink-mute)]">
                  <th className="py-2.5 pl-4 pr-2">Order #</th>
                  <th className="py-2.5 px-2">Client</th>
                  <th className="py-2.5 px-2">Window</th>
                  <th className="py-2.5 px-2">Fulfillment</th>
                  <th className="py-2.5 px-2">Recipe Specification</th>
                  <th className="py-2.5 px-2">Allergies</th>
                  <th className="py-2.5 pr-4 pl-2 text-right">Pass Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--hairline)]">
                {dayOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-[var(--cream)]/30">
                    <td className="py-3 pl-4 pr-2 font-bold text-[var(--ink)]">{o.orderNumber}</td>
                    <td className="py-3 px-2 font-semibold text-[var(--ink)]">{o.customer.name}</td>
                    <td className="py-3 px-2 text-[var(--ink-soft)]">{o.timeWindow}</td>
                    <td className="py-3 px-2 uppercase font-extrabold text-[10px]">
                      {o.fulfillment}
                    </td>
                    <td className="py-3 px-2">
                      <div className="font-medium text-[var(--ink)]">
                        {o.items.map((i) => `${i.quantity}x ${i.title}`).join(", ")}
                      </div>
                      {o.cakeConfig && (
                        <div className="text-[10.5px] text-[var(--ink-mute)]">
                          {o.cakeConfig.size} · {o.cakeConfig.flavor} · {o.cakeConfig.filling}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-2">
                      {o.allergies && o.allergies.length > 0 ? (
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          {o.allergies.join(", ")}
                        </span>
                      ) : (
                        <span className="text-[10px] text-[var(--ink-mute)]">—</span>
                      )}
                    </td>
                    <td className="py-3 pr-4 pl-2 text-right">
                      <span className="font-bold capitalize text-[11px] text-[var(--ink)]">
                        {o.stage.replace("-", " ")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer print disclaimer */}
        <div className="text-center text-[10.5px] text-[var(--ink-mute)] pt-4 border-t border-[var(--hairline)]">
          Petal &amp; Crumb Cake Studio · 1428 SE Division St, Portland, OR · Printed on {new Date().toLocaleString()}
        </div>
      </div>
    </div>
  );
}
