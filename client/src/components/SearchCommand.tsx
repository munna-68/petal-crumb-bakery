import { useEffect, useState } from "react";
import { Search, ArrowUpRight, Sparkles, Image as ImageIcon, ShoppingBag, UtensilsCrossed } from "lucide-react";
import { useLocation } from "wouter";
import { galleryItems, menuItems } from "@/lib/bakeryData";
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
      <CommandInput placeholder="Search cakes, flavors, pages…" />
      <CommandList>
        <CommandEmpty>No results. Try “custom” or “vanilla”.</CommandEmpty>
        <CommandGroup heading="Pages">
          <CommandItem onSelect={() => go("/menu")}><UtensilsCrossed size={14} className="text-[var(--rosewood)]" /> Menu — seasonal favorites</CommandItem>
          <CommandItem onSelect={() => go("/custom-order")}><Sparkles size={14} className="text-[var(--rosewood)]" /> Custom order studio</CommandItem>
          <CommandItem onSelect={() => go("/gallery")}><ImageIcon size={14} className="text-[var(--rosewood)]" /> Gallery · The collection</CommandItem>
          <CommandItem onSelect={() => go("/about")}><Search size={14} className="text-[var(--rosewood)]" /> About — Meet Maya</CommandItem>
          <CommandItem onSelect={() => go("/contact")}><ArrowUpRight size={14} className="text-[var(--rosewood)]" /> Contact & FAQ</CommandItem>
        </CommandGroup>
        <CommandGroup heading="Menu">
          {menuItems.map((m) => (
            <CommandItem key={m.title} onSelect={() => go("/menu")}>
              <ShoppingBag size={14} className="text-[var(--rosewood)]" /> {m.title} — {m.price}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Gallery">
          {galleryItems.map((g) => (
            <CommandItem key={g.id} onSelect={() => go("/gallery")}>
              <ImageIcon size={14} className="text-[var(--rosewood)]" /> {g.title} · {g.category}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
