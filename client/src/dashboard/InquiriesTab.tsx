import { useState, useMemo } from "react";
import {
  Mail,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  Archive,
  Trash2,
  Sparkles,
  MessageSquare,
  Search,
} from "lucide-react";
import { useBakeryStore, type StudioInquiry, type InquiryStatus } from "@/lib/bakeryStore";

export function InquiriesTab() {
  const { inquiries, updateInquiryStatus, deleteInquiry, toast } = useBakeryStore();
  const [filter, setFilter] = useState<"all" | InquiryStatus>("all");
  const [search, setSearch] = useState("");

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      const matchFilter = filter === "all" || inq.status === filter;
      const matchSearch =
        inq.name.toLowerCase().includes(search.toLowerCase()) ||
        inq.email.toLowerCase().includes(search.toLowerCase()) ||
        inq.occasion.toLowerCase().includes(search.toLowerCase()) ||
        inq.inquiryNumber.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [inquiries, filter, search]);

  const handleStatusChange = (id: string, status: InquiryStatus) => {
    updateInquiryStatus(id, status);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[oklch(0.89_0.025_62)] pb-5">
        <div>
          <span className="eyebrow">Client consultations</span>
          <h2 className="mt-1 font-display text-[28px] sm:text-[32px] font-semibold leading-none text-[var(--ink)]">
            Studio Inquiries Inbox
          </h2>
          <p className="mt-1.5 text-[13px] text-[var(--ink-mute)]">
            Notes submitted through the website Contact form. Reply to clients or convert to custom orders.
          </p>
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--ink-mute)]" />
          <input
            type="text"
            placeholder="Search inquiries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="field-base pl-10 text-[13px]"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: "all", label: `All Inquiries (${inquiries.length})` },
          { id: "new", label: `New (${inquiries.filter((i) => i.status === "new").length})` },
          { id: "replied", label: `Replied (${inquiries.filter((i) => i.status === "replied").length})` },
          { id: "converted", label: `Converted (${inquiries.filter((i) => i.status === "converted").length})` },
          { id: "archived", label: `Archived (${inquiries.filter((i) => i.status === "archived").length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id as "all" | InquiryStatus)}
            className={`rounded-full px-4 py-2 text-[12px] font-extrabold uppercase tracking-[0.08em] transition-all ${
              filter === tab.id
                ? "bg-[var(--terra)] text-white shadow-xs"
                : "bg-[var(--paper)] text-[var(--ink-soft)] hover:bg-[var(--blush)] hover:text-[var(--terra)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Inquiries List */}
      <div className="space-y-4">
        {filteredInquiries.length === 0 ? (
          <div className="rounded-[1.75rem] border border-dashed border-[oklch(0.85_0.035_58)] bg-[var(--paper)] p-12 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--blush)] text-[var(--terra)]">
              <MessageSquare size={22} />
            </span>
            <p className="mt-4 font-display text-[22px] font-semibold text-[var(--ink)]">No inquiries found</p>
            <p className="mt-1 text-[13px] text-[var(--ink-mute)]">
              Try changing your search or filter tab. New notes from the contact form will appear here.
            </p>
          </div>
        ) : (
          filteredInquiries.map((inq) => {
            const isNew = inq.status === "new";

            return (
              <article
                key={inq.id}
                className={`rounded-[1.75rem] border bg-[var(--paper)] p-6 transition-all shadow-xs hover:border-[oklch(0.78_0.045_50)] ${
                  isNew ? "border-[var(--terra)]/40 ring-1 ring-[var(--terra)]/20" : "border-[oklch(0.89_0.025_62)]"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[oklch(0.92_0.016_68)] pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-extrabold text-[var(--terra)]">
                        {inq.inquiryNumber}
                      </span>
                      <span className="text-[12px] text-[var(--ink-mute)]">· {inq.createdAt}</span>
                    </div>

                    <h3 className="mt-1 font-display text-[24px] font-semibold text-[var(--ink)]">
                      {inq.name}
                    </h3>

                    <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[13px] text-[var(--ink-soft)]">
                      <a
                        href={`mailto:${inq.email}?subject=Petal%20%26%20Crumb%20Bakery%20-%20Re:%20${encodeURIComponent(inq.occasion)}`}
                        className="inline-flex items-center gap-1.5 text-[var(--terra)] hover:underline"
                      >
                        <Mail size={13} /> {inq.email}
                      </a>
                      {inq.preferredDate && (
                        <span className="inline-flex items-center gap-1.5 text-[var(--ink-mute)]">
                          <Calendar size={13} /> Target Date: <strong className="text-[var(--ink)]">{inq.preferredDate}</strong>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.1em] ${
                        inq.status === "new"
                          ? "bg-[var(--blush)] text-[oklch(0.45_0.08_20)] ring-1 ring-[var(--terra)]/30"
                          : inq.status === "replied"
                          ? "bg-blue-50 text-blue-800"
                          : inq.status === "converted"
                          ? "bg-emerald-50 text-emerald-800"
                          : "bg-stone-100 text-stone-700"
                      }`}
                    >
                      {inq.status}
                    </span>
                  </div>
                </div>

                {/* Inquiry Details */}
                <div className="mt-4">
                  <p className="text-[11.5px] font-extrabold uppercase tracking-[0.12em] text-[var(--terra)]">
                    Occasion: {inq.occasion}
                  </p>
                  <p className="mt-2 text-[14px] leading-relaxed text-[var(--ink-soft)] whitespace-pre-wrap">
                    "{inq.detail}"
                  </p>

                  {inq.notes && (
                    <div className="mt-3 rounded-xl bg-[var(--cream)] p-3 text-[12.5px] text-[var(--ink-mute)]">
                      <strong className="text-[var(--ink)]">Baker's Note:</strong> {inq.notes}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[oklch(0.92_0.016_68)] pt-4">
                  <div className="flex flex-wrap gap-2">
                    {inq.status === "new" && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(inq.id, "replied")}
                        className="button-rose px-4 py-2 text-[11.5px]"
                      >
                        <CheckCircle2 size={13} /> Mark as Replied
                      </button>
                    )}
                    {inq.status !== "converted" && (
                      <button
                        type="button"
                        onClick={() => {
                          handleStatusChange(inq.id, "converted");
                          toast.success("Inquiry converted to client order!", {
                            description: "Review details in the Orders tab.",
                          });
                        }}
                        className="button-ink px-4 py-2 text-[11.5px]"
                      >
                        <Sparkles size={13} /> Convert to Order
                      </button>
                    )}
                    {inq.status !== "archived" && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(inq.id, "archived")}
                        className="button-ink px-4 py-2 text-[11.5px]"
                      >
                        <Archive size={13} /> Archive
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Delete this inquiry record?")) {
                        deleteInquiry(inq.id);
                      }
                    }}
                    className="grid h-8 w-8 place-items-center rounded-full text-red-600 hover:bg-red-50"
                    aria-label="Delete inquiry"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
