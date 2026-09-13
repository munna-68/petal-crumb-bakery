/**
 * Quiet Patisserie Editorial: persistent navigation is bright, quiet, and
 * typographic so the photo-led content and order studio remain the focus.
 * Polished with hairline rules, expo easing, and accessible mobile drawer.
 */
import { Instagram, Menu, X, ArrowUpRight } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useEffect, useState, useRef } from "react";
import BakeryMark from "./BakeryMark";

const navItems = [
  { label: "Menu", href: "/menu" },
  { label: "Custom Order", href: "/custom-order" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close on route change
  useEffect(() => setOpen(false), [location]);

  // lock scroll when drawer open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      // focus first link for a11y
      setTimeout(() => panelRef.current?.querySelector<HTMLAnchorElement>("a")?.focus(), 60);
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  // esc to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); buttonRef.current?.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-[10px] transition-[box-shadow,background-color,border-color] duration-300 ${
        scrolled
          ? "border-[oklch(0.86_0.018_52/0.95)] bg-[oklch(0.982_0.008_75/0.92)] shadow-[0_8px_30px_oklch(0.25_0.018_35/0.06)]"
          : "border-[oklch(0.88_0.018_52/0.7)] bg-[oklch(0.982_0.008_75/0.84)]"
      }`}
    >
      {/* skip */}
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:text-xs focus:font-semibold focus:uppercase focus:tracking-wide focus:text-[var(--ink)] focus:shadow-lg">
        Skip to content
      </a>

      <div className="container flex h-[68px] items-center justify-between gap-5 sm:h-[76px]">
        <Link href="/" className="group flex items-center gap-3 rounded-[2px] focus-visible:outline-offset-4" aria-label="Petal and Crumb home">
          <BakeryMark size="sm" />
          <span className="leading-none">
            <strong className="block font-display text-[18.5px] font-semibold tracking-[-0.04em] text-[var(--ink)] sm:text-[19px]">
              Petal <em className="font-normal text-[1.05em]"> &amp;</em> Crumb
            </strong>
            <span className="mt-[5px] block text-[8px] font-bold uppercase tracking-[0.26em] text-[oklch(0.58_0.03_18)]">
              Cake Studio
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1.5 lg:flex" aria-label="Primary navigation">
          {navItems.map((item) => {
            const active = location === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative rounded-[2px] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.13em] transition-colors duration-200 ${
                  active ? "text-[var(--rosewood)]" : "text-[oklch(0.34_0.02_35)] hover:text-[var(--ink)]"
                }`}
              >
                {item.label}
                <span
                  className={`pointer-events-none absolute inset-x-3 bottom-0.5 h-px origin-left bg-[var(--rosewood)] transition-[transform,opacity] duration-300 ${active ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0 group-hover:scale-x-100"}`}
                  aria-hidden
                />
                {/* active dot */}
                {active && <span className="absolute -top-0.5 right-1 h-1 w-1 rounded-full bg-[var(--rosewood)]" aria-hidden />}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/custom-order"
            className="button-rose hidden px-4 py-[10px] text-[10px] sm:inline-flex"
          >
            Start an order <ArrowUpRight size={13} strokeWidth={2.25} />
          </Link>
          <button
            ref={buttonRef}
            className="grid h-10 w-10 place-items-center border border-[oklch(0.84_0.02_52)] bg-white/60 text-[oklch(0.34_0.02_35)] transition-colors hover:border-[oklch(0.72_0.03_18)] hover:text-[var(--ink)] hover:bg-white focus-visible:bg-white lg:hidden"
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close navigation" : "Open navigation"}
          >
            {open ? <X size={19} strokeWidth={1.9} /> : <Menu size={20} strokeWidth={1.9} />}
          </button>
        </div>
      </div>

      {/* mobile drawer — polished: expo slide + scrim */}
      <div
        className={`lg:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        <div
          onClick={() => setOpen(false)}
          className={`fixed inset-0 top-[68px] bg-[oklch(0.25_0.018_35/0.28)] backdrop-blur-[2px] transition-opacity duration-300 sm:top-[76px] ${open ? "opacity-100" : "opacity-0"}`}
        />
        <nav
          id="mobile-nav"
          ref={panelRef}
          aria-label="Mobile navigation"
          className={`fixed inset-x-0 top-[68px] max-h-[calc(100dvh-68px)] overflow-auto border-t border-[oklch(0.88_0.018_52)] bg-[oklch(0.982_0.008_75)] shadow-[0_24px_40px_oklch(0.25_0.018_35/0.10)] transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] sm:top-[76px] sm:max-h-[calc(100dvh-76px)] ${open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"}`}
        >
          <div className="mx-auto flex max-w-[560px] flex-col px-5 py-3 sm:px-6">
            <div className="flex items-center justify-between py-3">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[oklch(0.58_0.03_18)]">Navigate</p>
              <span className="text-[10px] tracking-wide text-[oklch(0.52_0.02_35)]">Portland · pickup + delivery</span>
            </div>
            {navItems.map((item) => {
              const active = location === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center justify-between border-b border-[oklch(0.91_0.015_52)] py-[18px] text-[13px] font-semibold uppercase tracking-[0.12em] transition-colors ${
                    active ? "text-[var(--rosewood)]" : "text-[oklch(0.28_0.02_35)] hover:text-[var(--rosewood)]"
                  }`}
                >
                  <span>{item.label}</span>
                  <span className={`h-px w-8 origin-right bg-current transition-[transform,opacity] duration-300 ${active ? "scale-x-100 opacity-100" : "scale-x-40 opacity-25"}`} aria-hidden />
                </Link>
              );
            })}
            <Link href="/custom-order" onClick={() => setOpen(false)} className="button-rose mt-6 w-full justify-center py-4 text-[11px]">
              Build your cake <ArrowUpRight size={15} />
            </Link>
            <p className="pb-6 pt-4 text-center text-[11px] leading-5 text-[oklch(0.52_0.02_35)]">
              <a href="mailto:hello@petalandcrumb.com" className="underline decoration-[var(--rosewood)]/30 underline-offset-4 hover:decoration-[var(--rosewood)]">hello@petalandcrumb.com</a>
              <span className="mx-2 opacity-40">·</span>
              Responses within a day
            </p>
          </div>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-[var(--ink)] text-[oklch(0.97_0.008_75)]">
      <div className="px-5 pb-8 pt-14 sm:px-8 lg:px-8">
        <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[1.45fr_.7fr_.7fr] lg:gap-12">
          <div className="max-w-[420px]">
            <div className="flex items-center gap-3.5">
              <BakeryMark size="md" inverse />
              <div>
                <p className="font-display text-[22px] font-medium leading-none tracking-[-0.02em]">Petal &amp; Crumb</p>
                <p className="mt-1.5 text-[9px] font-bold uppercase tracking-[0.24em] text-[oklch(0.78_0.05_18)]">Cake Studio</p>
              </div>
            </div>
            <p className="mt-7 font-display text-[30px] font-[450] leading-[1.02] tracking-[-0.03em] text-balance sm:text-[34px]">
              A cake worth gathering around.
            </p>
            <p className="mt-4 max-w-[34ch] text-[14px] leading-6 text-[oklch(0.84_0.02_52)]">
              Artful custom cakes and small-batch sweets for celebrations with a little more meaning. Baked slowly, decorated by hand.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[oklch(0.86_0.02_52)]">Small batch</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[oklch(0.86_0.02_52)]">Seasonal</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[oklch(0.86_0.02_52)]">By hand</span>
            </div>
          </div>

          <div className="lg:pl-6">
            <p className="footer-label">Studio</p>
            <div className="mt-5 flex flex-col gap-1 text-sm">
              {[
                { label: "The menu", href: "/menu", desc: "Seasonal favorites" },
                { label: "Cake collection", href: "/gallery", desc: "Past tables" },
                { label: "Meet Maya", href: "/about", desc: "The hands behind" },
                { label: "Contact", href: "/contact", desc: "Say hello" },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="group flex items-baseline justify-between gap-3 rounded-[2px] py-2 text-[oklch(0.92_0.012_75)] transition-colors hover:text-white">
                  <span className="underline decoration-white/15 underline-offset-4 group-hover:decoration-white/40">{l.label}</span>
                  <span className="text-[11px] font-medium tracking-wide text-[oklch(0.76_0.02_52)] group-hover:text-white/80">{l.desc}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="lg:pl-2">
            <p className="footer-label">Say hello</p>
            <a
              href="mailto:hello@petalandcrumb.com"
              className="mt-5 inline-block rounded-[2px] text-[14px] font-medium text-[oklch(0.97_0.008_75)] underline decoration-[oklch(0.62_0.07_18)] decoration-1 underline-offset-[6px] transition-colors hover:decoration-[oklch(0.78_0.05_18)] focus-visible:outline-offset-4"
            >
              hello@petalandcrumb.com
            </a>
            <p className="mt-4 text-[13px] leading-6 text-[oklch(0.84_0.02_52)]">
              Portland, Oregon
              <br />
              Studio pickup + local delivery
              <br />
              <span className="text-[11px] tracking-wide text-[oklch(0.72_0.02_52)]">Replies within a day · Tue–Sat</span>
            </p>
            <a
              href="#instagram"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[oklch(0.92_0.012_75)] transition-colors hover:bg-white/10 hover:text-white"
            >
              <Instagram size={14} strokeWidth={1.9} /> Instagram
              <span className="ml-1 h-1 w-1 rounded-full bg-[oklch(0.78_0.05_18)]" aria-hidden />
            </a>
          </div>
        </div>

        <div className="mx-auto mt-12 flex max-w-[1280px] flex-col gap-3 border-t border-white/[0.10] pt-6 text-[9px] font-semibold uppercase tracking-[0.14em] text-[oklch(0.72_0.02_52)] sm:flex-row sm:items-center sm:justify-between">
          <span className="order-2 sm:order-1">© 2026 Petal &amp; Crumb Bakery · Portland, Oregon</span>
          <span className="order-1 flex items-center gap-2 sm:order-2">
            <span className="hidden h-px w-6 bg-white/15 sm:block" aria-hidden />
            Made fresh, made thoughtfully
            <span className="inline-block h-1 w-1 rounded-full bg-[oklch(0.78_0.05_18)]" aria-hidden />
          </span>
        </div>
      </div>
    </footer>
  );
}
