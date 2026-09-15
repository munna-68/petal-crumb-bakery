import { useState } from "react";
import { CalendarDays, Clock3, Check, AlertCircle, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "wouter";

const addDays = (d: Date, days: number) => {
  const c = new Date(d);
  c.setDate(c.getDate() + days);
  return c;
};

const formatDate = (d: Date) =>
  new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" }).format(d);

const toInputDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export function LiveAvailabilityChecker() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [dateStr, setDateStr] = useState(toInputDate(addDays(today, 7)));

  const selectedDate = new Date(`${dateStr}T12:00:00`);
  const diffDays = Math.ceil((selectedDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  let status: "open" | "rush" | "limited" | "invalid" = "open";
  let badgeColor = "bg-emerald-500 text-white";
  let statusTitle = "Kitchen Open · Standard Lead Time";
  let statusDesc = "Ample studio preparation time. Standard ingredients and flowers will be scheduled.";

  if (diffDays < 1) {
    status = "invalid";
    badgeColor = "bg-gray-500 text-white";
    statusTitle = "Date in the past";
    statusDesc = "Please pick an upcoming date for your celebration.";
  } else if (diffDays < 5) {
    status = "rush";
    badgeColor = "bg-[var(--rosewood)] text-white";
    statusTitle = "Rush Kitchen Hold · +35% Priority Fee";
    statusDesc = "Under our 5-day minimum lead time. Priority rush schedule required to secure early ingredients.";
  } else if (diffDays % 7 === 5 || diffDays % 7 === 6) {
    status = "limited";
    badgeColor = "bg-amber-500 text-white";
    statusTitle = "High Demand Weekend · 1 Spot Left";
    statusDesc = "Saturday & Sunday pickup windows fill quickly. We recommend submitting your quote promptly.";
  }

  const presets = [
    { label: "This Saturday", days: ((6 - today.getDay() + 7) % 7) || 7 },
    { label: "Next Weekend", days: (((6 - today.getDay() + 7) % 7) || 7) + 7 },
    { label: "In 2 Weeks", days: 14 },
    { label: "In 1 Month", days: 30 },
  ];

  return (
    <div
      data-reveal="up"
      className="border border-[oklch(0.88_0.018_52)] bg-[oklch(0.985_0.006_75)] p-5 sm:p-6 lg:p-7 shadow-[0_8px_24px_oklch(0.25_0.018_35/0.04)]"
    >
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--rosewood)]">
        <Clock3 size={13} />
        <span>Live Kitchen Availability &amp; Lead-Time Status</span>
      </div>

      <h4 className="mt-1 font-display text-[22px] sm:text-[26px] font-medium leading-tight">
        Will your date work? Check in seconds.
      </h4>

      {/* Date Picker & Quick Presets */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 border border-[oklch(0.86_0.02_52)] bg-white px-3 py-2">
          <CalendarDays size={16} className="text-[var(--rosewood)]" />
          <input
            type="date"
            value={dateStr}
            min={toInputDate(today)}
            onChange={(e) => setDateStr(e.target.value)}
            className="text-[13px] font-medium outline-none bg-transparent cursor-pointer text-[var(--ink)]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {presets.map((p) => {
            const pDate = addDays(today, p.days);
            const isSelected = toInputDate(pDate) === dateStr;
            return (
              <button
                key={p.label}
                onClick={() => setDateStr(toInputDate(pDate))}
                className={`px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] rounded-full border transition-colors ${
                  isSelected
                    ? "border-[var(--rosewood)] bg-[var(--rosewood)] text-white"
                    : "border-[oklch(0.86_0.02_52)] bg-white text-[oklch(0.42_0.02_35)] hover:border-[oklch(0.72_0.03_18)]"
                }`}
              >
                {p.label} ({formatDate(pDate)})
              </button>
            );
          })}
        </div>
      </div>

      {/* Status Output Indicator */}
      <div className="mt-4 border border-[oklch(0.86_0.02_52)] bg-white p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-[0.14em] ${badgeColor}`}>
              {status === "open" ? "Available" : status === "rush" ? "Rush Window" : status === "limited" ? "Limited Spots" : "Date Past"}
            </span>
            <span className="text-[13px] font-semibold text-[var(--ink)]">
              {statusTitle}
            </span>
          </div>
          <p className="text-[12px] leading-4 text-[oklch(0.52_0.02_35)] max-w-[50ch]">
            {statusDesc} · {diffDays > 0 ? `${diffDays} days advance notice.` : ""}
          </p>
        </div>

        <Link
          href="/custom-order"
          className="button-rose min-h-[44px] px-5 text-[10px] whitespace-nowrap self-stretch sm:self-auto justify-center"
        >
          Hold this Date in Studio <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}
