import { useState } from "react";
import { CalendarDays, ArrowRight, Clock3 } from "lucide-react";
import { Link } from "wouter";
import { useBakeryStore } from "@/lib/bakeryStore";

const addDays = (d: Date, days: number) => {
  const c = new Date(d);
  c.setDate(c.getDate() + days);
  return c;
};

const toInputDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export function LiveAvailabilityChecker() {
  const { isDateAvailable, settings } = useBakeryStore();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [dateStr, setDateStr] = useState(toInputDate(addDays(today, 7)));

  const selectedDate = new Date(`${dateStr}T12:00:00`);
  const diffDays = Math.ceil((selectedDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const avail = isDateAvailable(dateStr);
  const isBlackout = settings.blackoutDates.includes(dateStr);

  let status: "open" | "rush" | "limited" | "invalid" | "blackout" | "full" = "open";
  let badgeClass = "bg-[var(--sage-soft)] text-[var(--sage-deep)]";
  let badgeLabel = "Available";
  let statusTitle = "Kitchen open · standard lead time";
  let statusDesc = "Ample studio preparation time. Standard ingredients and flowers will be scheduled.";

  if (diffDays < 0) {
    status = "invalid";
    badgeClass = "bg-[oklch(0.92_0.012_70)] text-[var(--ink-mute)]";
    badgeLabel = "Date in past";
    statusTitle = "Date in the past";
    statusDesc = "Please pick an upcoming date for your celebration.";
  } else if (isBlackout) {
    status = "blackout";
    badgeClass = "bg-[oklch(0.92_0.012_70)] text-[var(--ink-mute)]";
    badgeLabel = "Studio Closed";
    statusTitle = "Studio closed (Blackout date)";
    statusDesc = avail.reason || "The kitchen is scheduled for deep clean or private studio baking on this date.";
  } else if (!avail.available) {
    if (avail.remainingSpots === 0) {
      status = "full";
      badgeClass = "bg-[oklch(0.92_0.012_70)] text-[var(--ink-mute)]";
      badgeLabel = "Slots Full";
      statusTitle = "Kitchen capacity reached";
      statusDesc = avail.reason || "All daily bake slots are spoken for. Please choose an adjacent date.";
    } else {
      status = "invalid";
      badgeClass = "bg-[oklch(0.92_0.012_70)] text-[var(--ink-mute)]";
      badgeLabel = "Lead Time";
      statusTitle = "Advance notice required";
      statusDesc = avail.reason || `Custom cakes require a minimum lead time.`;
    }
  } else if (avail.rush) {
    status = "rush";
    badgeClass = "bg-[var(--blush)] text-[var(--terra)]";
    badgeLabel = "Rush window";
    statusTitle = `Rush kitchen window · +${settings.rushFeePercentage}% fee`;
    statusDesc = avail.reason || `Within the priority rush window. Expedited studio preparation required.`;
  } else if (avail.remainingSpots !== undefined && avail.remainingSpots <= 2) {
    status = "limited";
    badgeClass = "bg-[var(--butter-soft)] text-[oklch(0.5_0.08_75)]";
    badgeLabel = `${avail.remainingSpots} spot${avail.remainingSpots === 1 ? "" : "s"} left`;
    statusTitle = `High demand date · ${avail.remainingSpots} slot${avail.remainingSpots === 1 ? "" : "s"} left`;
    statusDesc = "Weekend and holiday pickups fill quickly. We recommend locking in your hold.";
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
      className="rounded-[1.75rem] bg-[var(--paper)] p-6 shadow-[0_14px_40px_oklch(0.305_0.033_42/0.06)]"
    >
      <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.15em] text-[var(--terra)]">
        <Clock3 size={14} />
        <span>Live kitchen availability</span>
      </div>

      <h4 className="mt-2 font-display text-[23px] sm:text-[26px] font-semibold leading-tight">
        Will your date work? <em className="italic text-[var(--terra)]">Check in seconds.</em>
      </h4>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2 rounded-full border-[1.5px] border-[oklch(0.88_0.03_60)] bg-[var(--cream)] px-4 py-2.5">
          <CalendarDays size={16} className="text-[var(--terra)]" />
          <input
            type="date"
            value={dateStr}
            min={toInputDate(today)}
            onChange={(e) => setDateStr(e.target.value)}
            className="bg-transparent text-[13px] font-bold outline-none text-[var(--ink)]"
            aria-label="Choose a date"
          />
        </label>

        <div className="flex flex-wrap items-center gap-1.5">
          {presets.map((p) => {
            const pDate = addDays(today, p.days);
            const isSelected = toInputDate(pDate) === dateStr;
            return (
              <button
                key={p.label}
                onClick={() => setDateStr(toInputDate(pDate))}
                className={`rounded-full px-3.5 py-2 text-[12px] font-extrabold transition-colors ${
                  isSelected
                    ? "bg-[var(--terra)] text-white"
                    : "bg-[var(--cream)] text-[var(--ink-soft)] hover:bg-[var(--blush)] hover:text-[var(--terra)]"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex flex-col items-start justify-between gap-4 rounded-2xl bg-[var(--cream)] p-4 sm:flex-row sm:items-center">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2.5 py-1 text-[9.5px] font-extrabold uppercase tracking-[0.13em] ${badgeClass}`}>
              {badgeLabel}
            </span>
            <span className="text-[13.5px] font-extrabold text-[var(--ink)]">{statusTitle}</span>
          </div>
          <p className="max-w-[50ch] text-[12.5px] leading-4 text-[var(--ink-mute)]">
            {statusDesc} {diffDays > 0 ? `· ${diffDays} days advance notice.` : ""}
          </p>
        </div>

        <Link
          href={`/custom-order?date=${dateStr}`}
          className="button-rose min-h-[44px] justify-center whitespace-nowrap self-stretch px-5 py-3 sm:self-auto"
        >
          Hold this date <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
