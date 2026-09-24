import { useState, useMemo } from "react";
import {
  Printer,
  ChefHat,
  CheckSquare,
  Square,
  Clock,
  AlertCircle,
  Sparkles,
  Layers,
  Scale,
  RotateCcw,
} from "lucide-react";
import { useBakeryStore } from "@/lib/bakeryStore";

export function BakeSheetTab() {
  const { orders } = useBakeryStore();

  // Tasks checklist state
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    "scale-dry": true,
    "prep-ovens": true,
    "bake-sponges": false,
    "cool-levels": false,
    "whip-buttercreams": false,
    "prep-curds": true,
    "crumb-coat": false,
    "floral-finish": false,
    "box-ribbon": false,
  });

  const toggleCheck = (id: string) => {
    setChecklist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePrint = () => {
    window.print();
  };

  // Compute production requirements from today's / active orders
  const productionSummary = useMemo(() => {
    const spongeTally: Record<string, number> = {};
    const fillingTally: Record<string, number> = {};
    const frostingTally: Record<string, number> = {};
    let cupcakePieces = 0;
    let cookiePieces = 0;
    let customCakes = 0;

    orders
      .filter((o) => o.stage !== "collected")
      .forEach((order) => {
        if (order.type === "cake" || order.type === "custom") {
          customCakes++;
          const flavor = order.cakeConfig?.flavor || "Vanilla bean";
          const size = order.cakeConfig?.size || "8-inch";
          const filling = order.cakeConfig?.filling || "Vanilla buttercream";
          const frosting = order.cakeConfig?.frosting || "Textured buttercream";

          spongeTally[`${size} · ${flavor}`] = (spongeTally[`${size} · ${flavor}`] || 0) + 1;
          fillingTally[filling] = (fillingTally[filling] || 0) + 1;
          frostingTally[frosting] = (frostingTally[frosting] || 0) + 1;
        }

        order.items.forEach((it) => {
          if (it.title.toLowerCase().includes("cupcake")) {
            cupcakePieces += it.quantity * 12;
          } else if (it.title.toLowerCase().includes("cookie")) {
            cookiePieces += it.quantity * 12;
          }
        });
      });

    return {
      spongeTally,
      fillingTally,
      frostingTally,
      cupcakePieces,
      cookiePieces,
      customCakes,
    };
  }, [orders]);

  const allCompleted = Object.values(checklist).every(Boolean);

  return (
    <div className="space-y-6">
      {/* Top Header & Print Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[oklch(0.89_0.025_62)] pb-5">
        <div>
          <span className="eyebrow">Production schedule</span>
          <h2 className="mt-1 font-display text-[28px] sm:text-[32px] font-semibold leading-none text-[var(--ink)]">
            Morning Bake Sheet
          </h2>
          <p className="mt-1.5 text-[13px] text-[var(--ink-mute)]">
            Calculated from active orders in today's production queue.
          </p>
        </div>

        <div className="flex items-center gap-3 no-print">
          <button
            type="button"
            onClick={() => {
              const reset: Record<string, boolean> = {};
              Object.keys(checklist).forEach((k) => (reset[k] = false));
              setChecklist(reset);
            }}
            className="button-ink px-4 py-2.5 text-[12px]"
          >
            <RotateCcw size={14} /> Reset list
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="button-rose px-5 py-2.5 text-[12px]"
          >
            <Printer size={15} /> Print Kitchen Sheet
          </button>
        </div>
      </div>

      {/* Overview Metric Pills */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-[oklch(0.89_0.025_62)] bg-[var(--paper)] p-5 shadow-xs">
          <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--terra)]">
            <span>Celebration Tiers</span>
            <Layers size={16} />
          </div>
          <p className="mt-3 font-display text-[34px] font-semibold leading-none text-[var(--ink)]">
            {productionSummary.customCakes}
          </p>
          <p className="mt-2 text-[12px] text-[var(--ink-mute)]">Cakes scheduled on the bench</p>
        </div>

        <div className="rounded-2xl border border-[oklch(0.89_0.025_62)] bg-[var(--paper)] p-5 shadow-xs">
          <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--terra)]">
            <span>Cupcake Dozens</span>
            <ChefHat size={16} />
          </div>
          <p className="mt-3 font-display text-[34px] font-semibold leading-none text-[var(--ink)]">
            {Math.ceil(productionSummary.cupcakePieces / 12)}
          </p>
          <p className="mt-2 text-[12px] text-[var(--ink-mute)]">{productionSummary.cupcakePieces} individual cakes to crown</p>
        </div>

        <div className="rounded-2xl border border-[oklch(0.89_0.025_62)] bg-[var(--paper)] p-5 shadow-xs">
          <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--terra)]">
            <span>Iced Sablé Cookies</span>
            <Sparkles size={16} />
          </div>
          <p className="mt-3 font-display text-[34px] font-semibold leading-none text-[var(--ink)]">
            {productionSummary.cookiePieces}
          </p>
          <p className="mt-2 text-[12px] text-[var(--ink-mute)]">Hand-piped vanilla shortbread</p>
        </div>

        <div className="rounded-2xl border border-[oklch(0.89_0.025_62)] bg-[var(--paper)] p-5 shadow-xs">
          <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--terra)]">
            <span>Checklist Status</span>
            <CheckSquare size={16} />
          </div>
          <p className="mt-3 font-display text-[34px] font-semibold leading-none text-[var(--ink)]">
            {Object.values(checklist).filter(Boolean).length} / {Object.keys(checklist).length}
          </p>
          <p className="mt-2 text-[12px] text-[var(--ink-mute)]">
            {allCompleted ? "All kitchen tasks checked!" : "Production in progress"}
          </p>
        </div>
      </div>

      {/* Split Grid: Production Details & Morning Tasks */}
      <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
        {/* Left Column: Sponge Tiers & Fillings Needed */}
        <div className="space-y-6">
          <div className="rounded-[1.75rem] border border-[oklch(0.89_0.025_62)] bg-[var(--paper)] p-6 shadow-xs">
            <h3 className="flex items-center gap-2 font-display text-[22px] font-semibold text-[var(--ink)]">
              <Layers size={18} className="text-[var(--terra)]" /> Sponges to Scale &amp; Bake
            </h3>
            <p className="mt-1 text-[12.5px] text-[var(--ink-mute)]">
              Round pans to butter, line with parchment, and bake at 350°F.
            </p>

            <div className="mt-5 divide-y divide-[oklch(0.92_0.016_68)]">
              {Object.keys(productionSummary.spongeTally).length === 0 ? (
                <p className="py-4 text-[13px] text-[var(--ink-mute)]">No celebration sponges queued.</p>
              ) : (
                Object.entries(productionSummary.spongeTally).map(([sponge, count]) => (
                  <div key={sponge} className="flex items-center justify-between py-3">
                    <span className="text-[14px] font-semibold text-[var(--ink)]">{sponge}</span>
                    <span className="rounded-full bg-[var(--blush)] px-3 py-1 font-mono text-[12px] font-extrabold text-[oklch(0.45_0.08_20)]">
                      {count} {count === 1 ? "cake" : "cakes"} ({count * 2} layers)
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-[oklch(0.89_0.025_62)] bg-[var(--paper)] p-6 shadow-xs">
            <h3 className="flex items-center gap-2 font-display text-[22px] font-semibold text-[var(--ink)]">
              <Scale size={18} className="text-[var(--terra)]" /> Fillings &amp; Buttercreams
            </h3>
            <p className="mt-1 text-[12.5px] text-[var(--ink-mute)]">
              Batches needed to fill and coat today's celebration orders.
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-[var(--terra)]">
                  House Preserves &amp; Fillings
                </p>
                <div className="mt-2 divide-y divide-[oklch(0.92_0.016_68)]">
                  {Object.entries(productionSummary.fillingTally).map(([fill, count]) => (
                    <div key={fill} className="flex items-center justify-between py-2 text-[13.5px]">
                      <span className="text-[var(--ink)]">{fill}</span>
                      <span className="font-bold text-[var(--ink-soft)]">{count} orders</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-[oklch(0.92_0.016_68)] pt-4">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-[var(--terra)]">
                  Frosting Styles
                </p>
                <div className="mt-2 divide-y divide-[oklch(0.92_0.016_68)]">
                  {Object.entries(productionSummary.frostingTally).map(([frost, count]) => (
                    <div key={frost} className="flex items-center justify-between py-2 text-[13.5px]">
                      <span className="text-[var(--ink)]">{frost}</span>
                      <span className="font-bold text-[var(--ink-soft)]">{count} orders</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Kitchen Production Checklist */}
        <div className="rounded-[1.75rem] border border-[oklch(0.89_0.025_62)] bg-[var(--paper)] p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-[oklch(0.92_0.016_68)] pb-4">
            <div>
              <h3 className="font-display text-[22px] font-semibold text-[var(--ink)]">
                Morning Bench Checklist
              </h3>
              <p className="mt-1 text-[12.5px] text-[var(--ink-mute)]">
                Sequential workflow for the morning bake team.
              </p>
            </div>
            <span className="rounded-full bg-[var(--butter-soft)] px-3 py-1 text-[11px] font-extrabold text-[var(--butter-deep)]">
              Bench Routine
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {[
              { id: "scale-dry", label: "Scale dry ingredients & sift flour blends", step: "01" },
              { id: "prep-ovens", label: "Preheat commercial deck ovens & line springforms", step: "02" },
              { id: "bake-sponges", label: "Mix & bake sponge layers (Vanilla, Chocolate, Olive Oil)", step: "03" },
              { id: "cool-levels", label: "Cool on wire racks & precision level with serrated knife", step: "04" },
              { id: "prep-curds", label: "Cook Meyer lemon curd & reduce raspberry preserve", step: "05" },
              { id: "whip-buttercreams", label: "Whip Swiss meringue buttercream to cloud texture", step: "06" },
              { id: "crumb-coat", label: "Fill layers, apply crumb coat, and chill for 25 mins", step: "07" },
              { id: "floral-finish", label: "Apply textured palette-knife finish & stem organic garden florals", step: "08" },
              { id: "box-ribbon", label: "Transfer to bakery board, box securely, and tie silk ribbon", step: "09" },
            ].map((item) => {
              const checked = checklist[item.id];
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleCheck(item.id)}
                  className={`flex w-full items-center gap-3.5 rounded-2xl border p-3.5 text-left transition-all ${
                    checked
                      ? "border-emerald-500/30 bg-emerald-50/60 text-emerald-950"
                      : "border-[oklch(0.89_0.025_62)] bg-[var(--cream)]/60 text-[var(--ink)] hover:border-[var(--terra)]"
                  }`}
                >
                  <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg border ${checked ? "border-emerald-600 bg-emerald-600 text-white" : "border-[oklch(0.8_0.035_55)] bg-white"}`}>
                    {checked ? <CheckSquare size={14} /> : <Square size={14} className="opacity-0" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="font-mono text-[10.5px] font-bold text-[var(--terra)] mr-2">{item.step}</span>
                    <span className={`text-[13.5px] ${checked ? "line-through opacity-60" : "font-semibold"}`}>
                      {item.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6 rounded-2xl bg-[var(--blush)]/60 p-4 text-[12px] leading-5 text-[oklch(0.4_0.035_35)]">
            <p className="font-bold flex items-center gap-1.5 text-[var(--terra)]">
              <Clock size={14} /> Studio Note:
            </p>
            <p className="mt-1">
              All tiered cakes must be chilled at 38°F for at least 1 hour prior to pickup to ensure structural stability during transit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
