import { BakeryOrder, StudioInquiry } from "@/lib/bakeryStore";

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatFullDate = (dateStr: string): string => {
  try {
    const [y, m, d] = dateStr.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

export const formatFriendlyTime = (date: Date = new Date()): string => {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

/** Categorizes timeWindow into "morning" | "midday" | "afternoon" */
export type TimeBucket = "morning" | "midday" | "afternoon";

export const getTimeBucket = (timeWindow: string): TimeBucket => {
  const tw = timeWindow.toLowerCase();
  if (tw.includes("9:") || tw.includes("10:") || tw.includes("11:") || tw.includes("am")) {
    if (!tw.includes("pm") || tw.includes("11:30")) return "morning";
  }
  if (tw.includes("12:") || tw.includes("1:") || tw.includes("2:")) {
    return "midday";
  }
  return "afternoon";
};

export const TIME_BUCKET_LABELS: Record<TimeBucket, { title: string; window: string; iconTime: string }> = {
  morning: {
    title: "Morning Window",
    window: "9:00 AM – 12:00 PM",
    iconTime: "09:00",
  },
  midday: {
    title: "Midday Window",
    window: "12:00 PM – 3:00 PM",
    iconTime: "12:00",
  },
  afternoon: {
    title: "Afternoon Window",
    window: "3:00 PM – 6:00 PM",
    iconTime: "15:00",
  },
};

export interface CustomerDirectoryEntry {
  email: string;
  name: string;
  phone: string;
  address?: string;
  orderCount: number;
  totalSpend: number;
  lastOrderDate: string;
  orders: BakeryOrder[];
  preferredFlavors: string[];
  allergies: string[];
  notes: string;
}

const CUSTOMER_NOTES_KEY = "petal_crumb_customer_notes_v1";

export const loadCustomerNotes = (): Record<string, string> => {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(CUSTOMER_NOTES_KEY);
    return raw ? JSON.parse(raw) : {
      "clara.vance@example.com": "Prefers subtle blush roses, organic only. Loves early pickup.",
      "mchen.pdx@example.com": "Pearl District condo. Ring gate or text cell on arrival.",
      "aria.mont@example.com": "Host of monthly literary salon; always pairs shortbread with Earl Grey.",
      "jsterling.pdx@example.com": "VIP anniversary family. Prefers two-tier cakes with transport dowels.",
      "soren.lind@example.com": "Brutal perfectionist with floral arrangement; loves violas.",
      "hazel.thorne@example.com": "Baby shower planner. Prefers text notifications.",
    };
  } catch {
    return {};
  }
};

export const saveCustomerNote = (email: string, note: string): void => {
  if (typeof window === "undefined") return;
  try {
    const notes = loadCustomerNotes();
    notes[email.toLowerCase()] = note;
    localStorage.setItem(CUSTOMER_NOTES_KEY, JSON.stringify(notes));
  } catch (err) {
    console.error("Failed to save customer note:", err);
  }
};

export const compileCustomerDirectory = (
  orders: BakeryOrder[],
  inquiries: StudioInquiry[]
): CustomerDirectoryEntry[] => {
  const map = new Map<string, CustomerDirectoryEntry>();
  const savedNotes = loadCustomerNotes();

  orders.forEach((o) => {
    const emailKey = o.customer.email.toLowerCase().trim();
    if (!emailKey) return;

    const existing = map.get(emailKey) || {
      email: emailKey,
      name: o.customer.name,
      phone: o.customer.phone,
      address: o.customer.address,
      orderCount: 0,
      totalSpend: 0,
      lastOrderDate: o.date,
      orders: [],
      preferredFlavors: [],
      allergies: [],
      notes: savedNotes[emailKey] || "",
    };

    existing.orderCount += 1;
    existing.totalSpend += o.total;
    existing.orders.push(o);

    if (o.date > existing.lastOrderDate) {
      existing.lastOrderDate = o.date;
    }
    if (o.customer.address && !existing.address) {
      existing.address = o.customer.address;
    }

    if (o.cakeConfig?.flavor && !existing.preferredFlavors.includes(o.cakeConfig.flavor)) {
      existing.preferredFlavors.push(o.cakeConfig.flavor);
    }
    o.items.forEach((item) => {
      if (item.title && !existing.preferredFlavors.includes(item.title) && existing.preferredFlavors.length < 3) {
        existing.preferredFlavors.push(item.title);
      }
    });

    if (o.allergies) {
      o.allergies.forEach((alg) => {
        if (alg && !existing.allergies.includes(alg)) {
          existing.allergies.push(alg);
        }
      });
    }

    map.set(emailKey, existing);
  });

  // Also include inquiry leads if not already an order customer
  inquiries.forEach((inq) => {
    const emailKey = inq.email.toLowerCase().trim();
    if (!emailKey) return;

    if (!map.has(emailKey)) {
      map.set(emailKey, {
        email: emailKey,
        name: inq.name,
        phone: "(Inquiry lead)",
        orderCount: 0,
        totalSpend: 0,
        lastOrderDate: inq.createdAt.split("T")[0],
        orders: [],
        preferredFlavors: [inq.occasion],
        allergies: [],
        notes: savedNotes[emailKey] || inq.notes || "Inquiry lead via consultation form",
      });
    }
  });

  return Array.from(map.values()).sort((a, b) => b.totalSpend - a.totalSpend);
};
