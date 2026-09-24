import React, { useState, useMemo } from "react";
import {
  useBakeryStore,
  StudioInquiry,
  InquiryStatus,
} from "@/lib/bakeryStore";
import { formatFullDate } from "./dashboardUtils";
import { NewManualOrderModal } from "./OrderDialogs";
import {
  Mail,
  Calendar,
  Sparkles,
  Search,
  CheckCircle2,
  Archive,
  ArrowRight,
  MessageSquare,
  Clock,
  Heart,
  Cake,
  Trash2,
  Send,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

export default function InquiriesTab() {
  const { inquiries, updateInquiryStatus, deleteInquiry } = useBakeryStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [convertingInquiry, setConvertingInquiry] = useState<StudioInquiry | null>(null);
  const [convertModalOpen, setConvertModalOpen] = useState(false);

  // Status counts
  const counts = useMemo(() => {
    return {
      all: inquiries.length,
      new: inquiries.filter((i) => i.status === "new").length,
      replied: inquiries.filter((i) => i.status === "replied").length,
      converted: inquiries.filter((i) => i.status === "converted").length,
      archived: inquiries.filter((i) => i.status === "archived").length,
    };
  }, [inquiries]);

  // Filtered inquiries
  const filteredInquiries = useMemo(() => {
    return inquiries.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = item.name.toLowerCase().includes(q);
        const matchEmail = item.email.toLowerCase().includes(q);
        const matchOccasion = item.occasion.toLowerCase().includes(q);
        const matchDetail = item.detail.toLowerCase().includes(q);
        const matchNum = item.inquiryNumber.toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchOccasion && !matchDetail && !matchNum) {
          return false;
        }
      }
      return true;
    });
  }, [inquiries, statusFilter, searchQuery]);

  const handleConvert = (inquiry: StudioInquiry) => {
    setConvertingInquiry(inquiry);
    setConvertModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--terra)]">
              Consultation Desk
            </span>
            <span className="text-xs text-[var(--ink-mute)]">·</span>
            <span className="text-xs font-semibold text-[var(--ink-mute)]">
              Client Celebration Inquiries
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--ink)] mt-0.5">
            Wedding &amp; Event Inquiries
          </h2>
        </div>

        {counts.new > 0 && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--terra-soft)] text-[var(--terra-deep)] text-xs font-bold border border-[var(--terra)]/30">
            <Sparkles size={14} className="text-[var(--terra)]" />
            <span>{counts.new} new inquiry awaiting response</span>
          </div>
        )}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-[var(--hairline)] pb-4">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[var(--ink-mute)]" />
          <input
            type="text"
            placeholder="Search by client, occasion, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-[oklch(0.88_0.03_60)] bg-white text-xs focus:outline-none focus:border-[var(--terra)]"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: "all", label: "All", count: counts.all },
            { id: "new", label: "New Leads", count: counts.new },
            { id: "replied", label: "Replied", count: counts.replied },
            { id: "converted", label: "Converted", count: counts.converted },
            { id: "archived", label: "Archived", count: counts.archived },
          ].map((pill) => {
            const active = statusFilter === pill.id;
            return (
              <button
                key={pill.id}
                type="button"
                onClick={() => setStatusFilter(pill.id)}
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
      </div>

      {/* Inquiries Cards Grid */}
      {filteredInquiries.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-dashed border-[var(--hairline)] bg-[var(--paper)]">
          <Mail size={36} className="mx-auto text-[var(--ink-mute)] mb-3 opacity-60" />
          <h4 className="font-display text-lg font-bold text-[var(--ink)]">No inquiries found</h4>
          <p className="text-xs text-[var(--ink-mute)] mt-1">
            New contact submissions from the studio storefront will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredInquiries.map((inq) => {
            return (
              <div
                key={inq.id}
                className="rounded-2xl border border-[var(--hairline)] bg-[var(--paper)] p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[var(--ink-mute)]">
                      {inq.inquiryNumber} · {formatFullDate(inq.createdAt.split("T")[0])}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                        inq.status === "new"
                          ? "bg-amber-100 text-amber-900 border-amber-300"
                          : inq.status === "replied"
                          ? "bg-blue-50 text-blue-900 border-blue-200"
                          : inq.status === "converted"
                          ? "bg-emerald-50 text-emerald-900 border-emerald-300"
                          : "bg-gray-100 text-gray-700 border-gray-200"
                      }`}
                    >
                      {inq.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-xl font-bold text-[var(--ink)]">
                      {inq.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--ink-soft)] mt-1 font-medium">
                      <a
                        href={`mailto:${inq.email}`}
                        className="flex items-center gap-1 hover:text-[var(--terra)]"
                      >
                        <Mail size={12} className="text-[var(--terra)]" />
                        <span>{inq.email}</span>
                      </a>
                      {inq.preferredDate && (
                        <div className="flex items-center gap-1 font-bold text-[var(--ink)]">
                          <Calendar size={12} className="text-[var(--terra)]" />
                          <span>Event Date: {formatFullDate(inq.preferredDate)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Occasion Banner */}
                  <div className="rounded-lg bg-[var(--cream)] px-3 py-1.5 border border-[var(--hairline)] flex items-center gap-2 text-xs font-bold text-[var(--ink)]">
                    <Cake size={13} className="text-[var(--terra)] shrink-0" />
                    <span>Occasion: {inq.occasion}</span>
                  </div>

                  {/* Message Detail */}
                  <div className="text-xs text-[var(--ink-soft)] leading-relaxed bg-white rounded-xl p-3.5 border border-[var(--hairline)]">
                    <p className="font-normal italic text-[var(--ink)]">
                      "{inq.detail}"
                    </p>
                  </div>

                  {/* Baker internal notes if present */}
                  {inq.notes && (
                    <div className="text-[11px] text-[var(--ink-mute)] font-medium bg-amber-50/50 p-2.5 rounded-lg border border-amber-200/60">
                      <strong>Baker's Note:</strong> {inq.notes}
                    </div>
                  )}
                </div>

                {/* Actions Bottom Bar */}
                <div className="pt-3 border-t border-[var(--hairline)] flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    {inq.status !== "replied" && inq.status !== "converted" && (
                      <button
                        type="button"
                        onClick={() => updateInquiryStatus(inq.id, "replied")}
                        className="px-3 py-1.5 rounded-full border border-[oklch(0.88_0.03_60)] bg-white text-[var(--ink-soft)] hover:text-[var(--ink)] font-bold transition-colors inline-flex items-center gap-1"
                      >
                        <Send size={11} />
                        <span>Mark Replied</span>
                      </button>
                    )}

                    {inq.status !== "archived" && (
                      <button
                        type="button"
                        onClick={() => updateInquiryStatus(inq.id, "archived")}
                        className="px-2.5 py-1.5 rounded-full text-[var(--ink-mute)] hover:text-[var(--ink)] transition-colors"
                        title="Archive Inquiry"
                      >
                        <Archive size={13} />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Delete inquiry ${inq.inquiryNumber}?`)) {
                          deleteInquiry(inq.id);
                        }
                      }}
                      className="px-2 py-1.5 rounded-full text-[var(--ink-mute)] hover:text-rose-600 transition-colors"
                      title="Delete Inquiry"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  {/* Convert to Order Action */}
                  {inq.status !== "converted" ? (
                    <button
                      type="button"
                      onClick={() => handleConvert(inq)}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[var(--terra)] hover:bg-[var(--terra-deep)] text-white font-bold shadow-xs transition-all"
                    >
                      <Sparkles size={12} />
                      <span>Convert to Order</span>
                      <ArrowRight size={12} />
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                      <CheckCircle2 size={12} />
                      <span>Converted to Order</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Convert to Order Modal */}
      <NewManualOrderModal
        open={convertModalOpen}
        onOpenChange={setConvertModalOpen}
        initialInquiry={convertingInquiry}
      />
    </div>
  );
}
