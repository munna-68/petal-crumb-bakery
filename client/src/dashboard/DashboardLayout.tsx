import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useBakeryStore } from "@/lib/bakeryStore";
import { formatFriendlyTime } from "./dashboardUtils";
import BakeryMark from "@/components/BakeryMark";
import KitchenMode from "./KitchenMode";
import { NewManualOrderModal } from "./OrderDialogs";
import {
  Calendar,
  ShoppingBag,
  ChefHat,
  Layers,
  Mail,
  TrendingUp,
  Users,
  CircleDollarSign,
  Sliders,
  Printer,
  ExternalLink,
  Flame,
  Plus,
  Menu as MenuIcon,
  X,
  Sparkles,
  Store,
} from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
  badgeColor?: string;
  title: string;
  subtitle: string;
}

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location, setLocation] = useLocation();
  const { stats } = useBakeryStore();

  const [kitchenModeOpen, setKitchenModeOpen] = useState(false);
  const [newOrderOpen, setNewOrderOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    {
      id: "today",
      label: "Today's Pass",
      href: "/dashboard",
      icon: <Calendar size={18} />,
      badge: stats.todayOrdersCount > 0 ? stats.todayOrdersCount : undefined,
      badgeColor: "bg-[var(--terra)] text-white",
      title: "Today's Kitchen Pass",
      subtitle: "Daily service windows, order stages & fulfillment timeline",
    },
    {
      id: "orders",
      label: "Orders Queue",
      href: "/dashboard/orders",
      icon: <ShoppingBag size={18} />,
      badge: stats.activeOrdersCount > 0 ? stats.activeOrdersCount : undefined,
      badgeColor: "bg-[var(--ink)] text-white",
      title: "Active Orders Directory",
      subtitle: "Filter by production stage, fulfillment, and custom cake recipe",
    },
    {
      id: "bake",
      label: "Bake Sheet",
      href: "/dashboard/bake",
      icon: <ChefHat size={18} />,
      title: "Bench Production Planner",
      subtitle: "Sponge tier counts, fillings batching & morning checklist",
    },
    {
      id: "menu",
      label: "Menu & Stock",
      href: "/dashboard/menu",
      icon: <Layers size={18} />,
      badge: stats.soldOutMenuItemsCount > 0 ? stats.soldOutMenuItemsCount : undefined,
      badgeColor: "bg-rose-600 text-white",
      title: "Menu Items & Stock Steppers",
      subtitle: "Manage real-time catalog inventory and storefront availability",
    },
    {
      id: "inquiries",
      label: "Inquiries",
      href: "/dashboard/inquiries",
      icon: <Mail size={18} />,
      badge: stats.newInquiriesCount > 0 ? stats.newInquiriesCount : undefined,
      badgeColor: "bg-amber-600 text-white",
      title: "Wedding & Event Inquiries",
      subtitle: "Custom consultation requests, event dates & client messages",
    },
    {
      id: "insights",
      label: "Insights",
      href: "/dashboard/insights",
      icon: <TrendingUp size={18} />,
      title: "Velocity & Analytics",
      subtitle: "7-day revenue trend, category distribution & peak hours",
    },
    {
      id: "customers",
      label: "Customers",
      href: "/dashboard/customers",
      icon: <Users size={18} />,
      title: "Clientele & Celebrants",
      subtitle: "Patron directory, order histories, allergy notices & baker notes",
    },
    {
      id: "money",
      label: "Financials",
      href: "/dashboard/money",
      icon: <CircleDollarSign size={18} />,
      title: "Revenue & Deposits Ledger",
      subtitle: "Settled revenue, outstanding balances & payment channel records",
    },
    {
      id: "settings",
      label: "Settings",
      href: "/dashboard/settings",
      icon: <Sliders size={18} />,
      title: "Studio Settings & Capacity",
      subtitle: "28-day blackout calendar, lead times & announcement banner",
    },
  ];

  // Active item detection
  const normalizedPath = location.replace(/\/$/, "");
  const currentItem =
    navItems.find((item) => {
      if (item.href === "/dashboard") {
        return normalizedPath === "/dashboard" || normalizedPath === "";
      }
      return normalizedPath === item.href;
    }) || navItems[0];

  const handlePrintSheet = () => {
    if (normalizedPath !== "/dashboard/bake") {
      setLocation("/dashboard/bake");
      setTimeout(() => window.print(), 300);
    } else {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-[oklch(0.971_0.017_78)] text-[var(--ink)] flex flex-col lg:flex-row">
      {/* 1. Desktop Left Sidebar */}
      <aside className="hidden lg:flex w-64 xl:w-72 flex-col justify-between border-r border-[oklch(0.89_0.025_62)] bg-[var(--paper)] p-5 shrink-0 min-h-screen sticky top-0 h-screen select-none">
        <div className="space-y-6">
          {/* Bakery Studio Brand */}
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <BakeryMark size="md" />
            <div>
              <span className="block font-display text-xl font-bold tracking-tight text-[var(--ink)] group-hover:text-[var(--terra)] transition-colors">
                Petal <em className="italic font-normal text-[var(--terra)]">&amp;</em> Crumb
              </span>
              <span className="block text-[9px] font-extrabold uppercase tracking-[0.25em] text-[var(--ink-mute)]">
                Studio Back-Office
              </span>
            </div>
          </Link>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = currentItem.id === item.id;

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                    active
                      ? "bg-[var(--terra)] text-white shadow-xs font-extrabold"
                      : "text-[var(--ink-soft)] hover:bg-[var(--cream)] hover:text-[var(--ink)]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={active ? "text-white" : "text-[var(--terra)]"}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`size-5 rounded-full grid place-items-center text-[10px] font-extrabold ${
                        active ? "bg-white/20 text-white" : item.badgeColor || "bg-[var(--cream)] text-[var(--ink)]"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Bottom Quick Action Cards */}
        <div className="space-y-2.5 pt-4 border-t border-[var(--hairline)]">
          {/* Bench / Kitchen Mode Button */}
          <button
            type="button"
            onClick={() => setKitchenModeOpen(true)}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 text-amber-950 hover:border-amber-400 hover:shadow-xs transition-all text-left group"
          >
            <div className="flex items-center gap-2.5">
              <div className="size-7 rounded-lg bg-amber-500/20 grid place-items-center text-amber-800 group-hover:scale-105 transition-transform">
                <Flame size={15} />
              </div>
              <div>
                <span className="text-xs font-bold block leading-none">
                  Bench / Tablet Mode
                </span>
                <span className="text-[10px] text-amber-800 font-semibold block mt-0.5">
                  High-contrast kitchen pass
                </span>
              </div>
            </div>
            <Sparkles size={12} className="text-amber-600" />
          </button>

          {/* View Storefront Link */}
          <Link
            href="/"
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-[oklch(0.88_0.03_60)] bg-[var(--cream)]/60 text-xs font-bold text-[var(--ink-soft)] hover:text-[var(--ink)] hover:bg-[var(--cream)] transition-colors"
          >
            <div className="flex items-center gap-2">
              <Store size={14} className="text-[var(--terra)]" />
              <span>View Storefront</span>
            </div>
            <ExternalLink size={12} className="text-[var(--ink-mute)]" />
          </Link>

          {/* Studio status indicator */}
          <div className="flex items-center justify-center gap-1.5 text-[10px] font-semibold text-[var(--ink-mute)] pt-1">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            <span>Kitchen Live · Division St Studio</span>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Responsive Mobile Header */}
        <header className="lg:hidden border-b border-[var(--hairline)] bg-[var(--paper)] sticky top-0 z-40 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <Link href="/dashboard" className="flex items-center gap-2">
              <BakeryMark size="sm" />
              <div>
                <strong className="block font-display text-base font-bold text-[var(--ink)]">
                  Petal <em className="italic text-[var(--terra)] font-normal">&amp;</em> Crumb
                </strong>
                <span className="block text-[8px] font-extrabold uppercase tracking-widest text-[var(--ink-mute)]">
                  Studio Portal
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setKitchenModeOpen(true)}
                className="size-8 rounded-full bg-amber-50 border border-amber-300 grid place-items-center text-amber-800"
                title="Bench Mode"
              >
                <Flame size={15} />
              </button>
              <button
                type="button"
                onClick={() => setNewOrderOpen(true)}
                className="size-8 rounded-full bg-[var(--terra)] text-white grid place-items-center"
                title="New Order"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Horizontal Scrolling Tabs on Mobile */}
          <nav className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-3 mt-2 border-t border-[var(--hairline)]">
            {navItems.map((item) => {
              const active = currentItem.id === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                    active
                      ? "bg-[var(--terra)] text-white shadow-xs"
                      : "bg-[var(--cream)] text-[var(--ink-soft)]"
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`size-4 rounded-full grid place-items-center text-[9px] font-extrabold ${
                        active ? "bg-white/20 text-white" : "bg-[var(--paper)] text-[var(--ink)]"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </header>

        {/* Desktop Top Bar */}
        <header className="hidden lg:flex items-center justify-between border-b border-[oklch(0.89_0.025_62)] bg-[var(--paper)]/80 backdrop-blur-md px-8 py-4 sticky top-0 z-30">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--ink)]">
              {currentItem.title}
            </h1>
            <p className="text-xs text-[var(--ink-mute)] font-medium mt-0.5">
              {currentItem.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Formatted Today's Date */}
            <div className="hidden xl:flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--hairline)] bg-[var(--cream)]/60 text-xs font-bold text-[var(--ink)]">
              <Calendar size={13} className="text-[var(--terra)]" />
              <span>{formatFriendlyTime(new Date())}</span>
            </div>

            {/* Print Bake Sheet button */}
            <button
              type="button"
              onClick={handlePrintSheet}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[oklch(0.88_0.03_60)] bg-white hover:bg-[var(--cream)] text-xs font-bold text-[var(--ink)] shadow-xs transition-colors"
              title="Print today's bake sheet"
            >
              <Printer size={14} />
              <span>Print Bake Sheet</span>
            </button>

            {/* Kitchen Mode button */}
            <button
              type="button"
              onClick={() => setKitchenModeOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold shadow-xs transition-colors"
              title="Switch to tablet bench pass mode"
            >
              <Flame size={14} className="text-amber-700" />
              <span>Kitchen Mode</span>
            </button>

            {/* + New Order Button */}
            <button
              type="button"
              onClick={() => setNewOrderOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--terra)] hover:bg-[var(--terra-deep)] text-white text-xs font-bold shadow-xs transition-all active:scale-95"
            >
              <Plus size={15} />
              <span>New Order</span>
            </button>
          </div>
        </header>

        {/* Tab Page Main Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Bench / Kitchen Mode Fullscreen Overlay */}
      {kitchenModeOpen && (
        <KitchenMode onClose={() => setKitchenModeOpen(false)} />
      )}

      {/* Manual New Order Modal */}
      <NewManualOrderModal
        open={newOrderOpen}
        onOpenChange={setNewOrderOpen}
      />
    </div>
  );
}
