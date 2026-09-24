import React, { useState, useMemo } from "react";
import { useBakeryStore, BakeryOrder } from "@/lib/bakeryStore";
import {
  compileCustomerDirectory,
  saveCustomerNote,
  CustomerDirectoryEntry,
  formatCurrency,
  formatFullDate,
} from "./dashboardUtils";
import { DetailedOrderModal } from "./OrderDialogs";
import {
  Search,
  Users,
  Phone,
  Mail,
  MapPin,
  Heart,
  AlertTriangle,
  Cake,
  Clock,
  ExternalLink,
  Edit2,
  Check,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

export default function CustomersTab() {
  const { orders, inquiries } = useBakeryStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [editingEmail, setEditingEmail] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<BakeryOrder | null>(null);
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);

  // Compile directory
  const directory = useMemo(() => {
    return compileCustomerDirectory(orders, inquiries);
  }, [orders, inquiries]);

  // Filtered directory
  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return directory;
    const q = searchQuery.toLowerCase().trim();
    return directory.filter((c) => {
      return (
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        (c.address && c.address.toLowerCase().includes(q)) ||
        c.preferredFlavors.some((f) => f.toLowerCase().includes(q))
      );
    });
  }, [directory, searchQuery]);

  const handleStartEditNote = (client: CustomerDirectoryEntry) => {
    setEditingEmail(client.email);
    setNotesDraft(client.notes || "");
  };

  const handleSaveNote = (email: string) => {
    saveCustomerNote(email, notesDraft);
    setEditingEmail(null);
    toast.success("Client preference note saved");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--terra)]">
              Client Directory
            </span>
            <span className="text-xs text-[var(--ink-mute)]">·</span>
            <span className="text-xs font-semibold text-[var(--ink-mute)]">
              Studio Patron Loyalty &amp; Preferences
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--ink)] mt-0.5">
            Clientele &amp; Celebrants
          </h2>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[var(--ink-mute)]" />
          <input
            type="text"
            placeholder="Search patron by name, flavor, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-[oklch(0.88_0.03_60)] bg-white text-xs focus:outline-none focus:border-[var(--terra)] shadow-xs"
          />
        </div>
      </div>

      {/* Customer Directory Cards */}
      {filteredCustomers.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-dashed border-[var(--hairline)] bg-[var(--paper)]">
          <Users size={36} className="mx-auto text-[var(--ink-mute)] mb-3 opacity-60" />
          <h4 className="font-display text-lg font-bold text-[var(--ink)]">No patrons found</h4>
          <p className="text-xs text-[var(--ink-mute)] mt-1">
            Try searching for a different name, email, or favorite cake flavor.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredCustomers.map((client) => {
            const isEditing = editingEmail === client.email;

            return (
              <div
                key={client.email}
                className="rounded-2xl border border-[var(--hairline)] bg-[var(--paper)] p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
              >
                <div>
                  {/* Top Bar with Initials Avatar & Spending Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="size-11 rounded-full bg-[var(--terra-soft)] text-[var(--terra-deep)] grid place-items-center font-display text-base font-bold shrink-0">
                        {getInitials(client.name)}
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-bold text-[var(--ink)]">
                          {client.name}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-[var(--ink-soft)] mt-0.5">
                          <a
                            href={`mailto:${client.email}`}
                            className="hover:text-[var(--terra)] transition-colors truncate max-w-[180px]"
                          >
                            {client.email}
                          </a>
                          <span>·</span>
                          <a
                            href={`tel:${client.phone}`}
                            className="hover:text-[var(--terra)] transition-colors"
                          >
                            {client.phone}
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-display text-base font-bold text-[var(--ink)] block">
                        {formatCurrency(client.totalSpend)}
                      </span>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--terra)] block">
                        {client.orderCount} Order{client.orderCount === 1 ? "" : "s"}
                      </span>
                    </div>
                  </div>

                  {/* Delivery Address if present */}
                  {client.address && (
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-[var(--ink-soft)]">
                      <MapPin size={12} className="text-[var(--terra)] shrink-0" />
                      <span className="truncate">{client.address}</span>
                    </div>
                  )}

                  {/* Preferred Flavors & Dietary Tags */}
                  <div className="mt-3.5 space-y-2">
                    {client.preferredFlavors.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--ink-mute)] mr-1">
                          Flavors:
                        </span>
                        {client.preferredFlavors.map((flavor, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-full bg-[var(--cream)] border border-[var(--hairline)] text-[10.5px] font-bold text-[var(--ink-soft)]"
                          >
                            {flavor}
                          </span>
                        ))}
                      </div>
                    )}

                    {client.allergies.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 mr-1 flex items-center gap-1">
                          <AlertTriangle size={10} />
                          <span>Allergies:</span>
                        </span>
                        {client.allergies.map((alg, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[10.5px] font-bold text-amber-900"
                          >
                            {alg}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Private Baker's Notes Field */}
                  <div className="mt-4 pt-3 border-t border-[var(--hairline)] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--ink-mute)] flex items-center gap-1">
                        <Sparkles size={11} className="text-[var(--terra)]" />
                        <span>Private Baker's Notes</span>
                      </span>

                      {!isEditing && (
                        <button
                          type="button"
                          onClick={() => handleStartEditNote(client)}
                          className="text-[11px] font-bold text-[var(--terra)] hover:underline flex items-center gap-1"
                        >
                          <Edit2 size={10} />
                          <span>Edit Note</span>
                        </button>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="space-y-2">
                        <textarea
                          value={notesDraft}
                          onChange={(e) => setNotesDraft(e.target.value)}
                          placeholder="e.g. Prefers organic garden blooms; always collects in person."
                          className="w-full text-xs p-2.5 rounded-lg border border-[oklch(0.88_0.03_60)] bg-white min-h-[60px] focus:outline-none focus:border-[var(--terra)]"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingEmail(null)}
                            className="px-3 py-1 rounded-full border text-[11px]"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveNote(client.email)}
                            className="px-3 py-1 rounded-full bg-[var(--terra)] text-white text-[11px] font-bold"
                          >
                            Save Note
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs bg-[var(--cream)]/60 rounded-lg p-2.5 text-[var(--ink-soft)] italic border border-[var(--hairline)]">
                        {client.notes || "No private notes recorded. Click 'Edit Note' to add custom preferences."}
                      </p>
                    )}
                  </div>
                </div>

                {/* Orders History Preview */}
                {client.orders.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--ink-mute)] block mb-1.5">
                      Recent Orders
                    </span>
                    <div className="space-y-1.5">
                      {client.orders.map((o) => (
                        <div
                          key={o.id}
                          onClick={() => {
                            setSelectedOrder(o);
                            setOrderDetailsOpen(true);
                          }}
                          className="flex items-center justify-between p-2 rounded-lg bg-white border border-[var(--hairline)] hover:border-[var(--terra)] cursor-pointer text-xs transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[var(--ink)]">{o.orderNumber}</span>
                            <span className="text-[11px] text-[var(--ink-mute)]">
                              {formatFullDate(o.date)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[var(--ink)]">
                              {formatCurrency(o.total)}
                            </span>
                            <ChevronRight size={13} className="text-[var(--ink-mute)]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Detailed Order Modal */}
      <DetailedOrderModal
        order={selectedOrder}
        open={orderDetailsOpen}
        onOpenChange={setOrderDetailsOpen}
      />
    </div>
  );
}
