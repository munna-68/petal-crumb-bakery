import React, { useState, useMemo } from "react";
import { useBakeryStore, getIsoDateOffset } from "@/lib/bakeryStore";
import { formatCurrency } from "./dashboardUtils";
import { Switch } from "@/components/ui/switch";
import {
  Calendar,
  Lock,
  Unlock,
  Sliders,
  Megaphone,
  Store,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Mail,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import BakeryMark from "@/components/BakeryMark";
import { toast } from "sonner";

export default function SettingsTab() {
  const { settings, orders, updateSettings, toggleBlackoutDate, resetToDefaults } = useBakeryStore();

  // Local state copies for inputs so user can edit cleanly
  const [maxOrders, setMaxOrders] = useState(settings.maxOrdersPerDay);
  const [stdLead, setStdLead] = useState(settings.standardLeadTimeDays);
  const [rushLead, setRushLead] = useState(settings.rushLeadTimeDays);
  const [rushFee, setRushFee] = useState(settings.rushFeePercentage);
  const [delFee, setDelFee] = useState(settings.deliveryFee);

  // Announcement state
  const [annActive, setAnnActive] = useState(settings.announcement.active);
  const [annBadge, setAnnBadge] = useState(settings.announcement.badge);
  const [annMessage, setAnnMessage] = useState(settings.announcement.message);
  const [annLinkText, setAnnLinkText] = useState(settings.announcement.linkText || "Hold Your Date");
  const [annLinkUrl, setAnnLinkUrl] = useState(settings.announcement.linkUrl || "/custom-order");

  // Studio info
  const [address, setAddress] = useState(settings.studioAddress);
  const [hours, setHours] = useState(settings.studioHours);
  const [phone, setPhone] = useState(settings.studioPhone);
  const [email, setEmail] = useState(settings.studioEmail);

  // 28-day Calendar Grid Generator
  const calendarDays = useMemo(() => {
    const days: {
      dateStr: string;
      dayNum: number;
      dayOfWeek: string;
      isToday: boolean;
      isBlackout: boolean;
      orderCount: number;
      isFull: boolean;
    }[] = [];

    for (let i = 0; i < 28; i++) {
      const dateStr = getIsoDateOffset(i);
      const [y, m, d] = dateStr.split("-").map(Number);
      const dateObj = new Date(y, m - 1, d);

      const isBlackout = settings.blackoutDates.includes(dateStr);
      const orderCount = orders.filter((o) => o.date === dateStr && o.stage !== "collected").length;
      const isFull = orderCount >= settings.maxOrdersPerDay;

      days.push({
        dateStr,
        dayNum: dateObj.getDate(),
        dayOfWeek: dateObj.toLocaleDateString("en-US", { weekday: "short" }),
        isToday: i === 0,
        isBlackout,
        orderCount,
        isFull,
      });
    }

    return days;
  }, [settings.blackoutDates, settings.maxOrdersPerDay, orders]);

  const handleSaveCapacitySettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      maxOrdersPerDay: Number(maxOrders),
      standardLeadTimeDays: Number(stdLead),
      rushLeadTimeDays: Number(rushLead),
      rushFeePercentage: Number(rushFee),
      deliveryFee: Number(delFee),
    });
    toast.success("Studio capacity and lead times saved");
  };

  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      announcement: {
        active: annActive,
        badge: annBadge,
        message: annMessage,
        linkText: annLinkText,
        linkUrl: annLinkUrl,
      },
    });
    toast.success("Storefront announcement banner updated");
  };

  const handleSaveStudioInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      studioAddress: address,
      studioHours: hours,
      studioPhone: phone,
      studioEmail: email,
    });
    toast.success("Studio contact information updated");
  };

  const handleResetToDefaults = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all store settings, sample orders, inquiries, and blackout dates to factory defaults?"
      )
    ) {
      resetToDefaults();
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--terra)]">
              Studio Configuration
            </span>
            <span className="text-xs text-[var(--ink-mute)]">·</span>
            <span className="text-xs font-semibold text-[var(--ink-mute)]">
              Capacity &amp; Storefront Controls
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--ink)] mt-0.5">
            Settings &amp; Calendar Availability
          </h2>
        </div>

        <button
          type="button"
          onClick={handleResetToDefaults}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-rose-300 text-rose-700 bg-rose-50/50 hover:bg-rose-100 text-xs font-bold transition-colors"
        >
          <RotateCcw size={13} />
          <span>Reset Store to Demo Defaults</span>
        </button>
      </div>

      {/* 1. Interactive 28-Day Capacity & Blackout Calendar */}
      <div className="rounded-2xl border border-[var(--hairline)] bg-[var(--paper)] p-5 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--hairline)] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-[var(--terra)]" />
              <h3 className="font-display text-lg font-bold text-[var(--ink)]">
                28-Day Kitchen Capacity &amp; Blackout Grid
              </h3>
            </div>
            <p className="text-xs text-[var(--ink-mute)] mt-0.5">
              Click any date to instantly lock / unlock kitchen booking slots on the storefront
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="size-3 rounded-full bg-emerald-500" />
              <span className="text-[var(--ink-soft)]">Open</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-3 rounded-full bg-[var(--terra)]" />
              <span className="text-[var(--ink-soft)]">Blackout / Closed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-3 rounded-full bg-amber-500" />
              <span className="text-[var(--ink-soft)]">Fully Booked</span>
            </div>
          </div>
        </div>

        {/* 7-Column Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {calendarDays.map((day) => {
            return (
              <button
                key={day.dateStr}
                type="button"
                onClick={() => toggleBlackoutDate(day.dateStr)}
                className={`relative p-3 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between min-h-[76px] hover:scale-102 ${
                  day.isBlackout
                    ? "bg-rose-50 border-rose-200 text-rose-950"
                    : day.isFull
                    ? "bg-amber-50 border-amber-200 text-amber-950"
                    : "bg-white border-[oklch(0.89_0.025_62)] text-[var(--ink)] hover:border-[var(--ink)]"
                }`}
                title={`Click to ${day.isBlackout ? "reopen" : "close"} ${day.dateStr}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--ink-mute)]">
                    {day.dayOfWeek}
                  </span>
                  {day.isToday && (
                    <span className="size-1.5 rounded-full bg-[var(--terra)]" title="Today" />
                  )}
                  {day.isBlackout && (
                    <Lock size={11} className="text-rose-700" />
                  )}
                </div>

                <div className="mt-1">
                  <span
                    className={`font-display text-lg font-bold block ${
                      day.isBlackout ? "line-through text-rose-600" : ""
                    }`}
                  >
                    {day.dayNum}
                  </span>
                </div>

                <div className="text-[10px] font-bold text-[var(--ink-mute)] mt-1">
                  {day.isBlackout ? (
                    <span className="text-rose-700 font-extrabold">CLOSED</span>
                  ) : day.isFull ? (
                    <span className="text-amber-800 font-extrabold">FULL ({day.orderCount})</span>
                  ) : (
                    <span>{day.orderCount}/{settings.maxOrdersPerDay} slots</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Kitchen Capacity & Lead Time Controls */}
      <div className="rounded-2xl border border-[var(--hairline)] bg-[var(--paper)] p-5 sm:p-7 shadow-xs space-y-5">
        <div className="border-b border-[var(--hairline)] pb-3">
          <div className="flex items-center gap-2">
            <Sliders size={18} className="text-[var(--terra)]" />
            <h3 className="font-display text-lg font-bold text-[var(--ink)]">
              Kitchen Capacity &amp; Lead Times
            </h3>
          </div>
          <p className="text-xs text-[var(--ink-mute)] mt-0.5">
            Set maximum daily orders, rush priority windows, and delivery rates
          </p>
        </div>

        <form onSubmit={handleSaveCapacitySettings} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
            <div>
              <label className="font-bold text-[var(--ink-soft)] block mb-1">
                Max Orders / Day
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={maxOrders}
                onChange={(e) => setMaxOrders(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-[oklch(0.88_0.03_60)] bg-white font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-[var(--ink-soft)] block mb-1">
                Standard Lead Time (Days)
              </label>
              <input
                type="number"
                min="1"
                value={stdLead}
                onChange={(e) => setStdLead(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-[oklch(0.88_0.03_60)] bg-white font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-[var(--ink-soft)] block mb-1">
                Rush Lead Time (Days)
              </label>
              <input
                type="number"
                min="1"
                value={rushLead}
                onChange={(e) => setRushLead(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-[oklch(0.88_0.03_60)] bg-white font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-[var(--ink-soft)] block mb-1">
                Rush Fee (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={rushFee}
                onChange={(e) => setRushFee(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-[oklch(0.88_0.03_60)] bg-white font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-[var(--ink-soft)] block mb-1">
                Courier Delivery Fee ($)
              </label>
              <input
                type="number"
                min="0"
                value={delFee}
                onChange={(e) => setDelFee(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-[oklch(0.88_0.03_60)] bg-white font-bold"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-[var(--terra)] hover:bg-[var(--terra-deep)] text-white text-xs font-bold shadow-xs transition-colors"
            >
              Save Capacity Rules
            </button>
          </div>
        </form>
      </div>

      {/* 3. Announcement Banner Controller with Live Preview */}
      <div className="rounded-2xl border border-[var(--hairline)] bg-[var(--paper)] p-5 sm:p-7 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Megaphone size={18} className="text-[var(--terra)]" />
              <h3 className="font-display text-lg font-bold text-[var(--ink)]">
                Storefront Announcement Banner
              </h3>
            </div>
            <p className="text-xs text-[var(--ink-mute)] mt-0.5">
              Control the top bar visible to all visitors browsing petalcrumbbakery.com
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[var(--ink)]">
              {annActive ? "Banner Active" : "Banner Hidden"}
            </span>
            <Switch checked={annActive} onCheckedChange={setAnnActive} />
          </div>
        </div>

        {/* Live Banner Preview */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--ink-mute)] block">
            Live Preview on Storefront
          </span>
          <div className="rounded-xl border border-[oklch(0.89_0.025_62)] bg-[var(--cream)] p-3 text-xs flex flex-wrap items-center justify-center gap-2.5 shadow-xs">
            {annActive ? (
              <>
                <span className="font-extrabold text-[var(--terra)]">{annBadge}</span>
                <span className="font-medium text-[var(--ink)]">{annMessage}</span>
                {annLinkText && (
                  <span className="font-bold underline text-[var(--terra)] hover:text-[var(--terra-deep)] inline-flex items-center gap-1 cursor-pointer">
                    <span>{annLinkText}</span>
                    <ArrowRight size={11} />
                  </span>
                )}
              </>
            ) : (
              <span className="text-[var(--ink-mute)] italic">
                (Announcement banner is currently disabled and will not show on the live storefront)
              </span>
            )}
          </div>
        </div>

        {/* Announcement Form */}
        <form onSubmit={handleSaveAnnouncement} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-[var(--ink-soft)] block mb-1">Badge Text</label>
              <input
                type="text"
                value={annBadge}
                onChange={(e) => setAnnBadge(e.target.value)}
                placeholder="🌸 Spring Celebration"
                className="w-full p-2.5 rounded-lg border border-[oklch(0.88_0.03_60)] bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-[var(--ink-soft)] block mb-1">Message Text</label>
              <input
                type="text"
                value={annMessage}
                onChange={(e) => setAnnMessage(e.target.value)}
                placeholder="Spring Celebration Calendar is now open · Custom cake dates filling quickly"
                className="w-full p-2.5 rounded-lg border border-[oklch(0.88_0.03_60)] bg-white"
              />
            </div>

            <div>
              <label className="font-bold text-[var(--ink-soft)] block mb-1">Link CTA Label</label>
              <input
                type="text"
                value={annLinkText}
                onChange={(e) => setAnnLinkText(e.target.value)}
                placeholder="Hold Your Date"
                className="w-full p-2.5 rounded-lg border border-[oklch(0.88_0.03_60)] bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-[var(--ink-soft)] block mb-1">Target Route URL</label>
              <input
                type="text"
                value={annLinkUrl}
                onChange={(e) => setAnnLinkUrl(e.target.value)}
                placeholder="/custom-order"
                className="w-full p-2.5 rounded-lg border border-[oklch(0.88_0.03_60)] bg-white"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-[var(--terra)] hover:bg-[var(--terra-deep)] text-white text-xs font-bold shadow-xs transition-colors"
            >
              Update Storefront Banner
            </button>
          </div>
        </form>
      </div>

      {/* 4. Studio Contact & Operating Hours */}
      <div className="rounded-2xl border border-[var(--hairline)] bg-[var(--paper)] p-5 sm:p-7 shadow-xs space-y-5">
        <div className="border-b border-[var(--hairline)] pb-3">
          <div className="flex items-center gap-2">
            <Store size={18} className="text-[var(--terra)]" />
            <h3 className="font-display text-lg font-bold text-[var(--ink)]">
              Studio Location &amp; Hours
            </h3>
          </div>
          <p className="text-xs text-[var(--ink-mute)] mt-0.5">
            Shown across studio receipts, footer, and confirmation correspondence
          </p>
        </div>

        <form onSubmit={handleSaveStudioInfo} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-[var(--ink-soft)] block mb-1">Physical Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[oklch(0.88_0.03_60)] bg-white"
              />
            </div>

            <div>
              <label className="font-bold text-[var(--ink-soft)] block mb-1">Operating Hours</label>
              <input
                type="text"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[oklch(0.88_0.03_60)] bg-white"
              />
            </div>

            <div>
              <label className="font-bold text-[var(--ink-soft)] block mb-1">Studio Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[oklch(0.88_0.03_60)] bg-white"
              />
            </div>

            <div>
              <label className="font-bold text-[var(--ink-soft)] block mb-1">Studio Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[oklch(0.88_0.03_60)] bg-white"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-[var(--ink)] hover:bg-[var(--chocolate)] text-white text-xs font-bold shadow-xs transition-colors"
            >
              Save Studio Information
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
