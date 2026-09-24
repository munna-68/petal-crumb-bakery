import { useEffect } from "react";
import {
  Search,
  ArrowUpRight,
  Sparkles,
  Image as ImageIcon,
  ShoppingBag,
  UtensilsCrossed,
  ChefHat,
  Package,
  CalendarDays,
  Clock3,
  Mail,
  SlidersHorizontal,
} from "lucide-react";
import { useLocation } from "wouter";
import { galleryItems } from "@/lib/bakeryData";
import { useBakeryStore } from "@/lib/bakeryStore";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export function SearchCommand({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [, navigate] = useLocation();
  const { menuItems, stats } = useBakeryStore();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  const go = (href: string) => {
    onOpenChange(false);
    navigate(href);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search cakes, flavors, menu, dashboard tabs…" />
      <CommandList>
        <CommandEmpty>No results. Try “custom”, “vanilla”, or “orders”.</CommandEmpty>

        {/* Storefront Pages */}
        <CommandGroup heading="Storefront Pages">
          <CommandItem onSelect={() => go("/menu")}>
            <UtensilsCrossed size={14} className="text-[var(--rosewood)]" /> Menu — seasonal favorites
          </CommandItem>
          <CommandItem onSelect={() => go("/custom-order")}>
            <Sparkles size={14} className="text-[var(--rosewood)]" /> Custom order studio &amp; live estimate
          </CommandItem>
          <CommandItem onSelect={() => go("/gallery")}>
            <ImageIcon size={14} className="text-[var(--rosewood)]" /> Gallery · The collection
          </CommandItem>
          <CommandItem onSelect={() => go("/about")}>
            <Search size={14} className="text-[var(--rosewood)]" /> About — Meet Maya
          </CommandItem>
          <CommandItem onSelect={() => go("/contact")}>
            <ArrowUpRight size={14} className="text-[var(--rosewood)]" /> Contact &amp; Studio Inquiries
          </CommandItem>
        </CommandGroup>

        {/* Baker Dashboard Tabs Shortcuts */}
        <CommandGroup heading="Baker Studio Portal Shortcuts">
          <CommandItem onSelect={() => go("/dashboard")}>
            <ChefHat size={14} className="text-[var(--terra)]" />
            <span className="flex-1">Baker Dashboard — Studio Overview</span>
            {stats.activeOrdersCount > 0 && (
              <span className="rounded-full bg-[var(--terra)] px-1.5 py-0.5 text-[9.5px] font-bold text-white">
                {stats.activeOrdersCount} active
              </span>
            )}
          </CommandItem>
          <CommandItem onSelect={() => go("/dashboard/orders")}>
            <Package size={14} className="text-[var(--terra)]" />
            <span className="flex-1">Dashboard: Kitchen Orders &amp; Active Bakes</span>
            <span className="text-[11px] text-[var(--ink-mute)]">Stage pipeline</span>
          </CommandItem>
          <CommandItem onSelect={() => go("/dashboard/menu")}>
            <UtensilsCrossed size={14} className="text-[var(--terra)]" />
            <span className="flex-1">Dashboard: Menu Management &amp; Stock</span>
            {stats.soldOutMenuItemsCount > 0 && (
              <span className="rounded-full bg-[var(--butter-soft)] px-1.5 py-0.5 text-[9.5px] font-bold text-[oklch(0.48_0.08_70)]">
                {stats.soldOutMenuItemsCount} sold out
              </span>
            )}
          </CommandItem>
          <CommandItem onSelect={() => go("/dashboard/calendar")}>
            <CalendarDays size={14} className="text-[var(--terra)]" />
            <span>Dashboard: Kitchen Calendar &amp; Blackout Dates</span>
          </CommandItem>
          <CommandItem onSelect={() => go("/dashboard/inquiries")}>
            <Mail size={14} className="text-[var(--terra)]" />
            <span className="flex-1">Dashboard: Customer Inquiries</span>
            {stats.newInquiriesCount > 0 && (
              <span className="rounded-full bg-[var(--blush)] px-1.5 py-0.5 text-[9.5px] font-bold text-[var(--terra)]">
                {stats.newInquiriesCount} new
              </span>
            )}
          </CommandItem>
          <CommandItem onSelect={() => go("/dashboard/settings")}>
            <SlidersHorizontal size={14} className="text-[var(--terra)]" />
            <span>Dashboard: Lead Times &amp; Studio Settings</span>
          </CommandItem>
        </CommandGroup>

        {/* Dynamic Menu Items */}
        <CommandGroup heading="Menu & Bakes">
          {menuItems.map((m) => (
            <CommandItem key={m.id} onSelect={() => go("/menu")}>
              <ShoppingBag size={14} className="text-[var(--rosewood)]" />
              <span className="flex-1">{m.title} — {m.priceLabel}</span>
              {m.isSoldOut || m.stock === 0 ? (
                <span className="rounded-full bg-[oklch(0.92_0.01_60)] px-2 py-0.5 text-[10px] font-bold text-[oklch(0.55_0.02_45)]">
                  Sold out
                </span>
              ) : (
                <span className="text-[11px] text-[var(--ink-mute)]">{m.category}</span>
              )}
            </CommandItem>
          ))}
        </CommandGroup>

        {/* Gallery Items */}
        <CommandGroup heading="Gallery Collection">
          {galleryItems.map((g) => (
            <CommandItem key={g.id} onSelect={() => go("/gallery")}>
              <ImageIcon size={14} className="text-[var(--rosewood)]" />
              <span>{g.title} · {g.category}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
