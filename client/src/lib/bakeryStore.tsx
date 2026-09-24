import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { withBase } from "@/lib/withBase";

// ---------------------------------------------------------------------------
// 1. TypeScript Types
// ---------------------------------------------------------------------------

export type MenuItemCategory = "Cakes" | "Cupcakes" | "Cookies" | "Seasonal";

export interface MenuItem {
  id: string;
  title: string;
  detail: string;
  priceNum: number;
  priceLabel: string;
  category: MenuItemCategory;
  serves: string;
  allergens: string[];
  story: string;
  image: string;
  stock: number;
  isSoldOut: boolean;
}

export type OrderType = "cake" | "cupcakes" | "cookies" | "custom" | "menu-item";
export type FulfillmentType = "pickup" | "delivery";
export type OrderStage = "to-make" | "in-oven" | "ready" | "collected";
export type PaymentStatus = "pending" | "deposit-paid" | "paid";
export type PaymentMethod = "card" | "deposit-link" | "cash" | "invoice";
export type OrderSource = "Custom Studio" | "Online Bag" | "Phone / Counter";

export interface BakeryOrderCustomer {
  name: string;
  email: string;
  phone: string;
  address?: string;
}

export interface BakeryOrderItem {
  title: string;
  detail: string;
  quantity: number;
  price: number;
}

export interface CakeConfig {
  size: string;
  flavor: string;
  filling: string;
  frosting: string;
  complexity: string;
}

export interface BakeryOrder {
  id: string;
  orderNumber: string; // e.g. #PC-1048
  createdAt: string;
  customer: BakeryOrderCustomer;
  type: OrderType;
  items: BakeryOrderItem[];
  cakeConfig?: CakeConfig;
  fulfillment: FulfillmentType;
  date: string; // YYYY-MM-DD
  timeWindow: string;
  stage: OrderStage;
  payment: PaymentStatus;
  paymentMethod: PaymentMethod;
  total: number;
  deposit: number;
  balance: number;
  notes?: string;
  allergies: string[];
  inspirationPhoto?: string;
  source: OrderSource;
}

export type InquiryStatus = "new" | "replied" | "converted" | "archived";

export interface StudioInquiry {
  id: string;
  inquiryNumber: string; // e.g. #INQ-204
  createdAt: string;
  name: string;
  email: string;
  occasion: string;
  preferredDate?: string;
  detail: string;
  status: InquiryStatus;
  notes?: string;
}

export interface BakeryAnnouncement {
  active: boolean;
  badge: string;
  message: string;
  linkText?: string;
  linkUrl?: string;
}

export interface BakerySettings {
  blackoutDates: string[];
  maxOrdersPerDay: number;
  standardLeadTimeDays: number;
  rushLeadTimeDays: number;
  rushFeePercentage: number;
  deliveryFee: number;
  announcement: BakeryAnnouncement;
  studioAddress: string;
  studioHours: string;
  studioPhone: string;
  studioEmail: string;
}

export interface DateAvailability {
  available: boolean;
  reason?: string;
  rush?: boolean;
  remainingSpots?: number;
}

export interface BakeryStoreContextType {
  orders: BakeryOrder[];
  inquiries: StudioInquiry[];
  menuItems: MenuItem[];
  settings: BakerySettings;

  // Order Actions
  addOrder: (
    orderData: Omit<BakeryOrder, "id" | "orderNumber" | "createdAt"> &
      Partial<Pick<BakeryOrder, "id" | "orderNumber" | "createdAt">>
  ) => BakeryOrder;
  updateOrderStage: (id: string, stage: OrderStage) => void;
  updateOrderPayment: (id: string, payment: PaymentStatus) => void;
  updateOrderNotes: (id: string, notes: string) => void;
  deleteOrder: (id: string) => void;
  getOrder: (id: string) => BakeryOrder | undefined;
  getOrdersForDate: (dateStr: string) => BakeryOrder[];

  // Inquiry Actions
  addInquiry: (
    inquiryData: Omit<StudioInquiry, "id" | "inquiryNumber" | "createdAt"> &
      Partial<Pick<StudioInquiry, "id" | "inquiryNumber" | "createdAt">>
  ) => StudioInquiry;
  updateInquiryStatus: (id: string, status: InquiryStatus) => void;
  deleteInquiry: (id: string) => void;
  getInquiry: (id: string) => StudioInquiry | undefined;

  // Menu Actions
  updateMenuItem: (id: string, patch: Partial<MenuItem>) => void;
  addMenuItem: (item: Omit<MenuItem, "id"> & { id?: string }) => MenuItem;
  deleteMenuItem: (id: string) => void;
  updateStock: (id: string, stock: number) => void;
  toggleSoldOut: (id: string) => void;
  resetMenu: () => void;
  getMenuItem: (id: string) => MenuItem | undefined;

  // Settings & Date Actions
  updateSettings: (patch: Partial<BakerySettings>) => void;
  toggleBlackoutDate: (dateStr: string) => void;
  isDateAvailable: (dateStr: string) => DateAvailability;

  // Maintenance & Reset
  resetToDefaults: () => void;

  // Quick stats
  stats: {
    totalOrders: number;
    activeOrdersCount: number;
    todayOrdersCount: number;
    pendingPaymentCount: number;
    newInquiriesCount: number;
    soldOutMenuItemsCount: number;
  };

  // Toast instance helper
  toast: typeof toast;
}

// ---------------------------------------------------------------------------
// 2. Helpers & Initial Realistic Data
// ---------------------------------------------------------------------------

export const STORAGE_KEY = "petal_crumb_store_v1";

/** Returns YYYY-MM-DD offset by `days` from today */
export const getIsoDateOffset = (days: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getDefaultMenuItems = (): MenuItem[] => [
  {
    id: "menu-cake-signature",
    title: "Signature Garden Cake",
    detail: "Two plush layers, hand-finished in our signature textured buttercream.",
    priceNum: 84,
    priceLabel: "from $84",
    category: "Cakes",
    serves: "Serves 12–16",
    allergens: ["Wheat", "Dairy", "Eggs"],
    story:
      "Our most-requested centerpiece. Two plush layers of vanilla bean or dark chocolate sponge, layered with berry compote and crowned with seasonal organic blossoms.",
    image: withBase("/images/photo-1578985545062-69928b1d9587.jpg"),
    stock: 8,
    isSoldOut: false,
  },
  {
    id: "menu-cake-petite",
    title: "Petite Pistachio Cloud",
    detail: "A sweet six-inch centerpiece for smaller, very special tables.",
    priceNum: 54,
    priceLabel: "from $54",
    category: "Cakes",
    serves: "Serves 6–8",
    allergens: ["Wheat", "Dairy", "Tree Nuts"],
    story:
      "A tender pistachio crumb scented with orange blossom and dressed in whipped vanilla bean frosting. Perfect for weeknight milestones and intimate studio pickups.",
    image: withBase("/images/photo-1602351447937-745cb720612f.jpg"),
    stock: 12,
    isSoldOut: false,
  },
  {
    id: "menu-cake-lemon",
    title: "Lemon Garden Celebration Cake",
    detail: "Zesty Meyer lemon curd with floral buttercream crown.",
    priceNum: 92,
    priceLabel: "from $92",
    category: "Cakes",
    serves: "Serves 14–18",
    allergens: ["Wheat", "Dairy", "Eggs"],
    story:
      "Bright Oregon Meyer lemon sponge layered with tart house-made lemon curd and frosted in smooth, silky vanilla bean buttercream with pressed calendula petals.",
    image: withBase("/images/photo-1535254973040-607b474cb50d.jpg"),
    stock: 5,
    isSoldOut: false,
  },
  {
    id: "menu-cake-blush",
    title: "Birthday Blush Velvet Cake",
    detail: "Delicate pink botanical finish with whipped strawberry coulis.",
    priceNum: 88,
    priceLabel: "from $88",
    category: "Cakes",
    serves: "Serves 12–16",
    allergens: ["Wheat", "Dairy", "Eggs"],
    story:
      "Silky vanilla rose velvet cake, raspberry ribbon filling, and delicate blush textured petals tailored for celebratory birthday dessert tables.",
    image: withBase("/images/photo-1559620192-032c4bc4674e.jpg"),
    stock: 6,
    isSoldOut: false,
  },
  {
    id: "menu-cupcake-wildflower",
    title: "Wildflower Cupcake Dozen",
    detail: "Twelve floral-topped cupcakes in two complementary seasonal flavors.",
    priceNum: 42,
    priceLabel: "from $42",
    category: "Cupcakes",
    serves: "12 per box",
    allergens: ["Wheat", "Dairy", "Eggs"],
    story:
      "Twelve floral crowns on cloud-soft cake. Half Earl Grey lavender and half rich dark cocoa blackberry, decorated with organic hand-picked blooms.",
    image: withBase("/images/photo-1551024506-0bccd828d307.jpg"),
    stock: 15,
    isSoldOut: false,
  },
  {
    id: "menu-cupcake-earl-grey",
    title: "Earl Grey & Honey Petite Cupcakes",
    detail: "Bergamot-scented crumb crowned with honeyed buttercream.",
    priceNum: 46,
    priceLabel: "from $46",
    category: "Cupcakes",
    serves: "12 per box",
    allergens: ["Wheat", "Dairy", "Eggs"],
    story:
      "Steeped with whole-leaf bergamot black tea and folded with raw Willamette Valley clover honey. Subtle, elegant, and deeply aromatic.",
    image: withBase("/images/photo-1551024506-0bccd828d307.jpg"),
    stock: 9,
    isSoldOut: false,
  },
  {
    id: "menu-cookie-shortbread",
    title: "Pressed Botanical Butter Shortbread",
    detail: "Buttery vanilla cookies, iced one by one to suit the occasion.",
    priceNum: 34,
    priceLabel: "from $34",
    category: "Cookies",
    serves: "12 per box",
    allergens: ["Wheat", "Dairy"],
    story:
      "Buttery European-style sablé dough pressed with edible violas, borage blossoms, and lavender sprigs, finished with an ultra-thin sugar glaze.",
    image: withBase("/images/photo-1499636136210-6f4ee915583e.jpg"),
    stock: 20,
    isSoldOut: false,
  },
  {
    id: "menu-cookie-lavender",
    title: "Lavender Honey Glazed Sablés",
    detail: "Crisp French sablés finished with lavender blossom glaze.",
    priceNum: 36,
    priceLabel: "from $36",
    category: "Cookies",
    serves: "12 per box",
    allergens: ["Wheat", "Dairy", "Eggs"],
    story:
      "Crisp, flaky French sablés rolled in sparkling turbinado sugar and drizzled with culinary lavender honey glaze. A tea-time essential.",
    image: withBase("/images/photo-1499636136210-6f4ee915583e.jpg"),
    stock: 14,
    isSoldOut: false,
  },
  {
    id: "menu-seasonal-raspberry",
    title: "Raspberry Meadow Silk Cake",
    detail: "Seasonal harvest raspberries with silk textured buttercream.",
    priceNum: 96,
    priceLabel: "from $96",
    category: "Seasonal",
    serves: "Serves 14–18",
    allergens: ["Wheat", "Dairy", "Eggs"],
    story:
      "Our seasonal chef showcase: Oregon raspberry compote paired with dark Dutch chocolate sponge, finished in textured garden buttercream with wild thyme sprigs.",
    image: withBase("/images/hero-raspberry-garden-cake.png"),
    stock: 4,
    isSoldOut: false,
  },
  {
    id: "menu-seasonal-autumn-pear",
    title: "Autumn Spiced Pear & Cardamom Cake",
    detail: "Caramelized pears and warm cardamom with brown butter.",
    priceNum: 88,
    priceLabel: "from $88",
    category: "Seasonal",
    serves: "Serves 10–14",
    allergens: ["Wheat", "Dairy", "Eggs"],
    story:
      "Hood River caramelized pears nestled between aromatic cardamom sponge layers, enrobed in nutty browned-butter frosting.",
    image: withBase("/images/finish-textured-garden.png"),
    stock: 0,
    isSoldOut: true,
  },
];

export const getDefaultOrders = (): BakeryOrder[] => [
  {
    id: "order-1041",
    orderNumber: "#PC-1041",
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    customer: {
      name: "Clara Vance",
      email: "clara.vance@example.com",
      phone: "(503) 555-0143",
      address: "2418 SE Clinton St, Portland, OR",
    },
    type: "cake",
    items: [
      {
        title: "Celebration Cake (6-inch)",
        detail: "Raspberry Rose & Vanilla Bean Buttercream",
        quantity: 1,
        price: 84,
      },
    ],
    cakeConfig: {
      size: "6-inch",
      flavor: "Vanilla Bean",
      filling: "Raspberry Rose Jam",
      frosting: "Textured Buttercream",
      complexity: "Signature Floral",
    },
    fulfillment: "pickup",
    date: getIsoDateOffset(0), // Today
    timeWindow: "11:30 AM – 12:30 PM",
    stage: "ready",
    payment: "paid",
    paymentMethod: "card",
    total: 84,
    deposit: 42,
    balance: 0,
    notes: "Customer requested pastel pink garden roses on top. Will pick up on lunch break.",
    allergies: ["Nut-free kitchen request"],
    inspirationPhoto: withBase("/images/photo-1578985545062-69928b1d9587.jpg"),
    source: "Custom Studio",
  },
  {
    id: "order-1042",
    orderNumber: "#PC-1042",
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    customer: {
      name: "Miles Chen",
      email: "mchen.pdx@example.com",
      phone: "(503) 555-0188",
      address: "1029 NW Couch St #4B, Portland, OR 97209",
    },
    type: "cupcakes",
    items: [
      {
        title: "Wildflower Cupcake Dozen",
        detail: "Earl Grey & Honey + Lemon Blackberry (6 each)",
        quantity: 2,
        price: 84,
      },
    ],
    fulfillment: "delivery",
    date: getIsoDateOffset(0), // Today
    timeWindow: "2:00 PM – 3:30 PM",
    stage: "in-oven",
    payment: "paid",
    paymentMethod: "card",
    total: 102,
    deposit: 102,
    balance: 0,
    notes: "Call when buzzing Pearl District condo gate. Leave with concierge if no answer.",
    allergies: [],
    source: "Online Bag",
  },
  {
    id: "order-1043",
    orderNumber: "#PC-1043",
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    customer: {
      name: "Aria Montgomery",
      email: "aria.mont@example.com",
      phone: "(503) 555-0211",
      address: "1822 SE 12th Ave, Portland, OR",
    },
    type: "menu-item",
    items: [
      { title: "Petite Pistachio Cloud", detail: "Serves 6–8", quantity: 1, price: 54 },
      { title: "Pressed Botanical Butter Shortbread", detail: "Box of 12", quantity: 1, price: 34 },
    ],
    fulfillment: "pickup",
    date: getIsoDateOffset(0), // Today
    timeWindow: "3:30 PM – 4:30 PM",
    stage: "ready",
    payment: "deposit-paid",
    paymentMethod: "deposit-link",
    total: 88,
    deposit: 44,
    balance: 44,
    notes: "Balance to be settled upon pickup at counter.",
    allergies: ["Contains Pistachio (nut notice confirmed)"],
    source: "Online Bag",
  },
  {
    id: "order-1044",
    orderNumber: "#PC-1044",
    createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    customer: {
      name: "Eleanor & James Sterling",
      email: "jsterling.pdx@example.com",
      phone: "(503) 555-0319",
      address: "3312 NE Alberta St, Portland, OR",
    },
    type: "cake",
    items: [
      {
        title: "Two-Tier Botanical Cake",
        detail: "Serves 35–45, Champagne & Wild Blackberry",
        quantity: 1,
        price: 240,
      },
    ],
    cakeConfig: {
      size: "tiered",
      flavor: "Champagne Velvet",
      filling: "Wild Oregon Blackberry Compote",
      frosting: "Smooth Silk Buttercream",
      complexity: "Pressed Botanical Cascade",
    },
    fulfillment: "pickup",
    date: getIsoDateOffset(1), // Tomorrow
    timeWindow: "10:00 AM – 11:00 AM",
    stage: "in-oven",
    payment: "deposit-paid",
    paymentMethod: "deposit-link",
    total: 240,
    deposit: 120,
    balance: 120,
    notes: "50th Anniversary party at family home. Include tiered transport box and cake care guide.",
    allergies: [],
    inspirationPhoto: withBase("/images/photo-1578985545062-69928b1d9587.jpg"),
    source: "Custom Studio",
  },
  {
    id: "order-1045",
    orderNumber: "#PC-1045",
    createdAt: new Date(Date.now() - 80 * 3600 * 1000).toISOString(),
    customer: {
      name: "Soren Lindqvist",
      email: "soren.lind@example.com",
      phone: "(503) 555-0455",
    },
    type: "cookies",
    items: [
      {
        title: "Decorated Botanical Cookies",
        detail: "Lavender Honey & Vanilla Glaze (3 boxes)",
        quantity: 3,
        price: 102,
      },
    ],
    fulfillment: "pickup",
    date: getIsoDateOffset(1), // Tomorrow
    timeWindow: "1:00 PM – 2:00 PM",
    stage: "to-make",
    payment: "paid",
    paymentMethod: "card",
    total: 102,
    deposit: 102,
    balance: 0,
    notes: "Individual parchment sleeve wrapping requested for bridal shower favors.",
    allergies: ["Egg", "Wheat", "Dairy"],
    source: "Phone / Counter",
  },
  {
    id: "order-1046",
    orderNumber: "#PC-1046",
    createdAt: new Date(Date.now() - 96 * 3600 * 1000).toISOString(),
    customer: {
      name: "Hazel Thorne",
      email: "hazel.thorne@example.com",
      phone: "(503) 555-0672",
      address: "1924 SE Hawthorne Blvd, Portland, OR 97214",
    },
    type: "cake",
    items: [
      {
        title: "8-Inch Celebration Cake",
        detail: "Meyer Lemon Verbena Curd & Toasted Almond Cream",
        quantity: 1,
        price: 118,
      },
    ],
    cakeConfig: {
      size: "8-inch",
      flavor: "Meyer Lemon Verbena",
      filling: "Fresh Lemon Curd",
      frosting: "Textured Garden Finish",
      complexity: "Subtle Petal Accent",
    },
    fulfillment: "delivery",
    date: getIsoDateOffset(2),
    timeWindow: "12:00 PM – 1:30 PM",
    stage: "to-make",
    payment: "deposit-paid",
    paymentMethod: "invoice",
    total: 136,
    deposit: 68,
    balance: 68,
    notes: "Baby shower at private garden patio. Delivery driver please text 15 minutes prior to arrival.",
    allergies: ["Almond in filling"],
    inspirationPhoto: withBase("/images/photo-1535254973040-607b474cb50d.jpg"),
    source: "Custom Studio",
  },
  {
    id: "order-1047",
    orderNumber: "#PC-1047",
    createdAt: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
    customer: {
      name: "Daphne Dubois",
      email: "daphne.d@example.com",
      phone: "(503) 555-0781",
      address: "4110 NE Fremont St, Portland, OR",
    },
    type: "custom",
    items: [
      {
        title: "Custom Tasting Box & Consultation Hold",
        detail: "4 tasting pairings + consultation deposit credit",
        quantity: 1,
        price: 95,
      },
    ],
    fulfillment: "pickup",
    date: getIsoDateOffset(3),
    timeWindow: "11:00 AM – 12:00 PM",
    stage: "to-make",
    payment: "pending",
    paymentMethod: "deposit-link",
    total: 95,
    deposit: 0,
    balance: 95,
    notes: "Wedding consultation for August celebration in Columbia River Gorge. Awaiting deposit link authorization.",
    allergies: ["Gluten-sensitive sample requested"],
    source: "Custom Studio",
  },
  {
    id: "order-1048",
    orderNumber: "#PC-1048",
    createdAt: new Date(Date.now() - 40 * 3600 * 1000).toISOString(),
    customer: {
      name: "Felix Moreau",
      email: "felix.m@example.com",
      phone: "(503) 555-0899",
      address: "742 N Mississippi Ave, Portland, OR 97227",
    },
    type: "cake",
    items: [
      {
        title: "Raspberry Meadow Silk Cake",
        detail: "Dark Chocolate Sponge & Silk Ganache",
        quantity: 1,
        price: 96,
      },
    ],
    cakeConfig: {
      size: "8-inch",
      flavor: "Dark Chocolate Truffle",
      filling: "Raspberry Coulis",
      frosting: "Smooth Silk Ganache",
      complexity: "Gold Leaf & Wild Thyme",
    },
    fulfillment: "delivery",
    date: getIsoDateOffset(4),
    timeWindow: "3:00 PM – 4:30 PM",
    stage: "to-make",
    payment: "paid",
    paymentMethod: "card",
    total: 114,
    deposit: 114,
    balance: 0,
    notes: "Birthday surprise for partner. Do not ring doorbell; text mobile upon porch bench delivery.",
    allergies: [],
    source: "Online Bag",
  },
  {
    id: "order-1039",
    orderNumber: "#PC-1039",
    createdAt: new Date(Date.now() - 120 * 3600 * 1000).toISOString(),
    customer: {
      name: "Willa Abernathy",
      email: "willa.ab@example.com",
      phone: "(503) 555-0914",
    },
    type: "cake",
    items: [
      {
        title: "Petite Pistachio Cloud",
        detail: "Pistachio chiffon & rosewater cream",
        quantity: 1,
        price: 54,
      },
    ],
    fulfillment: "pickup",
    date: getIsoDateOffset(-1), // Yesterday
    timeWindow: "2:00 PM – 3:00 PM",
    stage: "collected",
    payment: "paid",
    paymentMethod: "card",
    total: 54,
    deposit: 54,
    balance: 0,
    notes: "Picked up on time. Customer sent glowing review for dinner party dessert.",
    allergies: [],
    source: "Online Bag",
  },
  {
    id: "order-1040",
    orderNumber: "#PC-1040",
    createdAt: new Date(Date.now() - 144 * 3600 * 1000).toISOString(),
    customer: {
      name: "Julian Rossi",
      email: "jrossi@example.com",
      phone: "(503) 555-0965",
    },
    type: "cookies",
    items: [
      {
        title: "Decorated Botanical Cookies",
        detail: "Two dozen chamomile shortbread",
        quantity: 2,
        price: 68,
      },
    ],
    fulfillment: "pickup",
    date: getIsoDateOffset(-2), // 2 days ago
    timeWindow: "12:00 PM – 1:00 PM",
    stage: "collected",
    payment: "paid",
    paymentMethod: "cash",
    total: 68,
    deposit: 34,
    balance: 0,
    notes: "Paid remaining $34 balance at front counter with cash.",
    allergies: [],
    source: "Phone / Counter",
  },
];

export const getDefaultInquiries = (): StudioInquiry[] => [
  {
    id: "inq-201",
    inquiryNumber: "#INQ-201",
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    name: "Camilla Rodriguez",
    email: "camilla.rodriguez@example.com",
    occasion: "June Wedding Consultation",
    preferredDate: getIsoDateOffset(45),
    detail:
      "Looking for a 3-tier botanical wedding cake for ~90 guests at Mt. Tabor Caldera. We adore the textured buttercream look with pressed organic edible violas and chamomile.",
    status: "new",
    notes: "Requested tasting box in early spring. Budget estimate: $450–$600.",
  },
  {
    id: "inq-202",
    inquiryNumber: "#INQ-202",
    createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    name: "Tessa Lindholm",
    email: "tessa.l@example.com",
    occasion: "Baby Shower Lemon Cake",
    preferredDate: getIsoDateOffset(18),
    detail:
      "Hosting a baby shower on Hawthorne Blvd for 25 close friends. Interested in an 8-inch Meyer lemon lavender cake and 18 mini cupcakes with subtle gold dust.",
    status: "replied",
    notes: "Sent flavor guide and tier pricing menu. Client asked about dairy-free frosting option.",
  },
  {
    id: "inq-203",
    inquiryNumber: "#INQ-203",
    createdAt: new Date(Date.now() - 96 * 3600 * 1000).toISOString(),
    name: "Eleanor Sterling",
    email: "jsterling.pdx@example.com",
    occasion: "50th Golden Anniversary",
    preferredDate: getIsoDateOffset(1),
    detail:
      "Inquiry for two-tier champagne velvet cake with pressed botanical cascade for parents' anniversary celebration.",
    status: "converted",
    notes: "Converted to active order #PC-1044. 50% deposit paid.",
  },
  {
    id: "inq-204",
    inquiryNumber: "#INQ-204",
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    name: "Marcus Vance",
    email: "marcus.v@designstudio-pdx.com",
    occasion: "Corporate Studio Opening",
    preferredDate: getIsoDateOffset(12),
    detail:
      "Architecture studio opening on NW 23rd Ave. Needing dessert table display: 4 dozen botanical cookies and two 6-inch architectural cutting cakes.",
    status: "replied",
    notes: "Sent corporate catering rate sheet with onsite display setup options.",
  },
  {
    id: "inq-205",
    inquiryNumber: "#INQ-205",
    createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    name: "Chloe Bennett",
    email: "chloe.b@example.com",
    occasion: "First Birthday Meadow Theme",
    preferredDate: getIsoDateOffset(24),
    detail:
      "Wildflower meadow theme for daughter's 1st birthday in Alberta Arts. Looking for a gentle low-sugar smash cake plus 2 dozen cupcakes for adult guests.",
    status: "new",
    notes: "Client asked about recipe modification for banana oat smash cake.",
  },
];

export const getDefaultSettings = (): BakerySettings => ({
  blackoutDates: [getIsoDateOffset(14), getIsoDateOffset(15)], // Studio deep clean days in 2 weeks
  maxOrdersPerDay: 6,
  standardLeadTimeDays: 5,
  rushLeadTimeDays: 2,
  rushFeePercentage: 35,
  deliveryFee: 18,
  announcement: {
    active: true,
    badge: "🌸 Spring Celebration",
    message: "Spring Celebration Calendar is now open · Custom cake dates filling quickly",
    linkText: "Hold Your Date",
    linkUrl: "/custom-order",
  },
  studioAddress: "1428 SE Division St, Portland, OR 97202",
  studioHours: "Wed – Sun: 9:00 AM – 4:00 PM (Mon & Tue: Studio bake days)",
  studioPhone: "(503) 555-0192",
  studioEmail: "hello@petalandcrumb.com",
});

// ---------------------------------------------------------------------------
// 3. Storage Initializer
// ---------------------------------------------------------------------------

interface PersistedState {
  orders: BakeryOrder[];
  inquiries: StudioInquiry[];
  menuItems: MenuItem[];
  settings: BakerySettings;
}

const loadPersistedState = (): PersistedState => {
  if (typeof window === "undefined") {
    return {
      orders: getDefaultOrders(),
      inquiries: getDefaultInquiries(),
      menuItems: getDefaultMenuItems(),
      settings: getDefaultSettings(),
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        orders: getDefaultOrders(),
        inquiries: getDefaultInquiries(),
        menuItems: getDefaultMenuItems(),
        settings: getDefaultSettings(),
      };
    }

    const parsed = JSON.parse(raw);
    return {
      orders: Array.isArray(parsed.orders) && parsed.orders.length > 0 ? parsed.orders : getDefaultOrders(),
      inquiries:
        Array.isArray(parsed.inquiries) && parsed.inquiries.length > 0 ? parsed.inquiries : getDefaultInquiries(),
      menuItems:
        Array.isArray(parsed.menuItems) && parsed.menuItems.length > 0 ? parsed.menuItems : getDefaultMenuItems(),
      settings: parsed.settings
        ? {
            ...getDefaultSettings(),
            ...parsed.settings,
            announcement: {
              ...getDefaultSettings().announcement,
              ...(parsed.settings.announcement || {}),
            },
          }
        : getDefaultSettings(),
    };
  } catch (err) {
    console.warn("Failed to read from localStorage:", err);
    return {
      orders: getDefaultOrders(),
      inquiries: getDefaultInquiries(),
      menuItems: getDefaultMenuItems(),
      settings: getDefaultSettings(),
    };
  }
};

// ---------------------------------------------------------------------------
// 4. Context & Provider
// ---------------------------------------------------------------------------

const BakeryContext = createContext<BakeryStoreContextType | null>(null);

export function BakeryProvider({ children }: { children: React.ReactNode }) {
  const [initial] = useState<PersistedState>(loadPersistedState);
  const [orders, setOrders] = useState<BakeryOrder[]>(initial.orders);
  const [inquiries, setInquiries] = useState<StudioInquiry[]>(initial.inquiries);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initial.menuItems);
  const [settings, setSettings] = useState<BakerySettings>(initial.settings);

  // Sync state to localStorage whenever changed
  useEffect(() => {
    try {
      const payload: PersistedState = { orders, inquiries, menuItems, settings };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (err) {
      console.error("Failed to write to localStorage:", err);
    }
  }, [orders, inquiries, menuItems, settings]);

  // Order Actions
  const addOrder: BakeryStoreContextType["addOrder"] = (orderData) => {
    // Generate order number #PC-XXXX
    let nextNum = 1049;
    const existingNums = orders
      .map((o) => {
        const m = o.orderNumber.match(/#PC-(\d+)/);
        return m ? parseInt(m[1], 10) : 0;
      })
      .filter((n) => !isNaN(n) && n > 0);

    if (existingNums.length > 0) {
      nextNum = Math.max(...existingNums) + 1;
    }

    const orderNumber = orderData.orderNumber || `#PC-${nextNum}`;
    const id = orderData.id || `order-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const createdAt = orderData.createdAt || new Date().toISOString();

    const deposit =
      typeof orderData.deposit === "number"
        ? orderData.deposit
        : orderData.payment === "paid"
          ? orderData.total
          : Math.round(orderData.total * 0.5);

    const balance =
      typeof orderData.balance === "number"
        ? orderData.balance
        : Math.max(0, orderData.total - deposit);

    const newOrder: BakeryOrder = {
      ...orderData,
      id,
      orderNumber,
      createdAt,
      deposit,
      balance,
      allergies: orderData.allergies || [],
    };

    setOrders((prev) => [newOrder, ...prev]);

    toast.success(`Order created: ${newOrder.orderNumber}`, {
      description: `${newOrder.customer.name} · ${newOrder.date} (${newOrder.fulfillment})`,
      duration: 3500,
    });

    return newOrder;
  };

  const updateOrderStage = (id: string, stage: OrderStage) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === id) {
          const updated = { ...o, stage };
          toast.success(`Order ${o.orderNumber} updated`, {
            description: `Kitchen stage changed to "${stage.replace("-", " ")}"`,
          });
          return updated;
        }
        return o;
      })
    );
  };

  const updateOrderPayment = (id: string, payment: PaymentStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === id) {
          const balance = payment === "paid" ? 0 : o.balance;
          const deposit = payment === "paid" ? o.total : o.deposit;
          const updated = { ...o, payment, balance, deposit };
          toast.success(`Payment updated: ${o.orderNumber}`, {
            description: `Status marked as "${payment}"`,
          });
          return updated;
        }
        return o;
      })
    );
  };

  const updateOrderNotes = (id: string, notes: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === id) {
          toast.success(`Notes saved: ${o.orderNumber}`);
          return { ...o, notes };
        }
        return o;
      })
    );
  };

  const deleteOrder = (id: string) => {
    const target = orders.find((o) => o.id === id);
    setOrders((prev) => prev.filter((o) => o.id !== id));
    toast.info(`Order removed`, {
      description: target ? `${target.orderNumber} for ${target.customer.name}` : id,
    });
  };

  const getOrder = (id: string) => orders.find((o) => o.id === id);

  const getOrdersForDate = (dateStr: string) => orders.filter((o) => o.date === dateStr);

  // Inquiry Actions
  const addInquiry: BakeryStoreContextType["addInquiry"] = (inquiryData) => {
    let nextNum = 206;
    const existingNums = inquiries
      .map((i) => {
        const m = i.inquiryNumber.match(/#INQ-(\d+)/);
        return m ? parseInt(m[1], 10) : 0;
      })
      .filter((n) => !isNaN(n) && n > 0);

    if (existingNums.length > 0) {
      nextNum = Math.max(...existingNums) + 1;
    }

    const inquiryNumber = inquiryData.inquiryNumber || `#INQ-${nextNum}`;
    const id = inquiryData.id || `inq-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const createdAt = inquiryData.createdAt || new Date().toISOString();
    const status: InquiryStatus = inquiryData.status || "new";

    const newInquiry: StudioInquiry = {
      ...inquiryData,
      id,
      inquiryNumber,
      createdAt,
      status,
    };

    setInquiries((prev) => [newInquiry, ...prev]);

    toast.success(`Consultation inquiry received`, {
      description: `${newInquiry.inquiryNumber} · ${newInquiry.name} (${newInquiry.occasion})`,
      duration: 3500,
    });

    return newInquiry;
  };

  const updateInquiryStatus = (id: string, status: InquiryStatus) => {
    setInquiries((prev) =>
      prev.map((i) => {
        if (i.id === id) {
          toast.success(`Inquiry ${i.inquiryNumber} updated`, {
            description: `Status changed to "${status}"`,
          });
          return { ...i, status };
        }
        return i;
      })
    );
  };

  const deleteInquiry = (id: string) => {
    const target = inquiries.find((i) => i.id === id);
    setInquiries((prev) => prev.filter((i) => i.id !== id));
    toast.info(`Inquiry deleted`, {
      description: target ? `${target.inquiryNumber} — ${target.name}` : id,
    });
  };

  const getInquiry = (id: string) => inquiries.find((i) => i.id === id);

  // Menu Actions
  const updateMenuItem = (id: string, patch: Partial<MenuItem>) => {
    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, ...patch };
          // keep isSoldOut in sync if stock is explicitly updated
          if (typeof patch.stock === "number") {
            updated.isSoldOut = patch.stock <= 0 ? true : (patch.isSoldOut ?? false);
          }
          toast.success(`Menu item updated: ${updated.title}`);
          return updated;
        }
        return item;
      })
    );
  };

  const addMenuItem = (item: Omit<MenuItem, "id"> & { id?: string }): MenuItem => {
    const id = item.id || `menu-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newItem: MenuItem = {
      ...item,
      id,
      isSoldOut: item.stock <= 0 ? true : (item.isSoldOut ?? false),
    };

    setMenuItems((prev) => [newItem, ...prev]);
    toast.success(`Added to menu: ${newItem.title}`);
    return newItem;
  };

  const deleteMenuItem = (id: string) => {
    const target = menuItems.find((m) => m.id === id);
    setMenuItems((prev) => prev.filter((m) => m.id !== id));
    toast.info(`Menu item removed`, {
      description: target ? target.title : id,
    });
  };

  const updateStock = (id: string, stock: number) => {
    setMenuItems((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const isSoldOut = stock <= 0;
          toast.success(`Stock updated: ${m.title}`, {
            description: `${stock} available · ${isSoldOut ? "Marked Sold Out" : "In Stock"}`,
          });
          return { ...m, stock, isSoldOut };
        }
        return m;
      })
    );
  };

  const toggleSoldOut = (id: string) => {
    setMenuItems((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const isSoldOut = !m.isSoldOut;
          toast.success(`${m.title}`, {
            description: isSoldOut ? "Marked as Sold Out" : "Marked as Available",
          });
          return { ...m, isSoldOut };
        }
        return m;
      })
    );
  };

  const resetMenu = () => {
    const defaults = getDefaultMenuItems();
    setMenuItems(defaults);
    toast.info(`Menu reset to studio defaults`);
  };

  const getMenuItem = (id: string) => menuItems.find((m) => m.id === id);

  // Settings Actions
  const updateSettings = (patch: Partial<BakerySettings>) => {
    setSettings((prev) => {
      const updated = {
        ...prev,
        ...patch,
        announcement: patch.announcement ? { ...prev.announcement, ...patch.announcement } : prev.announcement,
      };
      toast.success(`Studio settings updated`);
      return updated;
    });
  };

  const toggleBlackoutDate = (dateStr: string) => {
    setSettings((prev) => {
      const exists = prev.blackoutDates.includes(dateStr);
      const updatedDates = exists
        ? prev.blackoutDates.filter((d) => d !== dateStr)
        : [...prev.blackoutDates, dateStr].sort();

      toast.success(exists ? `Date reopened: ${dateStr}` : `Blackout date added: ${dateStr}`, {
        description: exists ? "Kitchen schedule available" : "Studio marked closed on this date",
      });

      return {
        ...prev,
        blackoutDates: updatedDates,
      };
    });
  };

  const isDateAvailable = (dateStr: string): DateAvailability => {
    if (!dateStr) {
      return { available: false, reason: "No date provided" };
    }

    // 1. Blackout dates
    if (settings.blackoutDates.includes(dateStr)) {
      return {
        available: false,
        reason: "Studio is closed on this date (Kitchen blackout)",
        remainingSpots: 0,
      };
    }

    // 2. Lead time calculation
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [y, m, d] = dateStr.split("-").map(Number);
    const target = new Date(y, m - 1, d);
    target.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { available: false, reason: "Date is in the past", remainingSpots: 0 };
    }

    if (diffDays < settings.rushLeadTimeDays) {
      return {
        available: false,
        reason: `Orders require minimum ${settings.rushLeadTimeDays} days advance notice`,
        remainingSpots: 0,
      };
    }

    // 3. Kitchen capacity
    const activeOrdersForDate = orders.filter((o) => o.date === dateStr && o.stage !== "collected");
    const remainingSpots = Math.max(0, settings.maxOrdersPerDay - activeOrdersForDate.length);

    if (remainingSpots <= 0) {
      return {
        available: false,
        reason: "Kitchen capacity reached for this date (All slots full)",
        remainingSpots: 0,
      };
    }

    // 4. Rush lead time check
    if (diffDays < settings.standardLeadTimeDays) {
      return {
        available: true,
        rush: true,
        reason: `Rush kitchen window (+${settings.rushFeePercentage}% priority fee applies)`,
        remainingSpots,
      };
    }

    // 5. Standard availability
    return {
      available: true,
      rush: false,
      reason: "Kitchen open · standard lead time",
      remainingSpots,
    };
  };

  const resetToDefaults = () => {
    const dOrders = getDefaultOrders();
    const dInq = getDefaultInquiries();
    const dMenu = getDefaultMenuItems();
    const dSettings = getDefaultSettings();

    setOrders(dOrders);
    setInquiries(dInq);
    setMenuItems(dMenu);
    setSettings(dSettings);

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn("Could not clear localStorage:", e);
    }

    toast.info("Store data reset to studio defaults", {
      description: "Default menu, realistic sample orders, and inquiries restored.",
    });
  };

  // Quick stats memo
  const stats = useMemo(() => {
    const todayStr = getIsoDateOffset(0);
    return {
      totalOrders: orders.length,
      activeOrdersCount: orders.filter((o) => o.stage !== "collected").length,
      todayOrdersCount: orders.filter((o) => o.date === todayStr).length,
      pendingPaymentCount: orders.filter((o) => o.payment === "pending").length,
      newInquiriesCount: inquiries.filter((i) => i.status === "new").length,
      soldOutMenuItemsCount: menuItems.filter((m) => m.isSoldOut).length,
    };
  }, [orders, inquiries, menuItems]);

  const value: BakeryStoreContextType = {
    orders,
    inquiries,
    menuItems,
    settings,
    addOrder,
    updateOrderStage,
    updateOrderPayment,
    updateOrderNotes,
    deleteOrder,
    getOrder,
    getOrdersForDate,
    addInquiry,
    updateInquiryStatus,
    deleteInquiry,
    getInquiry,
    updateMenuItem,
    addMenuItem,
    deleteMenuItem,
    updateStock,
    toggleSoldOut,
    resetMenu,
    getMenuItem,
    updateSettings,
    toggleBlackoutDate,
    isDateAvailable,
    resetToDefaults,
    stats,
    toast,
  };

  return <BakeryContext.Provider value={value}>{children}</BakeryContext.Provider>;
}

export function useBakeryStore(): BakeryStoreContextType {
  const context = useContext(BakeryContext);
  if (!context) {
    throw new Error("useBakeryStore must be used within a BakeryProvider");
  }
  return context;
}
