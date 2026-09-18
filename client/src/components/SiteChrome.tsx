/**
 * Garden Bakery: bright, warm chrome. Sentence-case nav, ghost icon buttons,
 * terracotta pill CTA, chocolate footer with script accents. All interactions
 * (search, favorites, bag, account, mobile drawer) preserved.
 */
import { Instagram, Menu, X, ArrowUpRight, Search, ShoppingBag, Heart, User, LogIn, Package, Mail } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import BakeryMark from "./BakeryMark";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { SearchCommand } from "@/components/SearchCommand";
import { CartDrawer } from "@/components/CartDrawer";
import { ScriptNote } from "@/components/decor";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [searchOpen, setSearchOpen] = useState(false);
  const [location] = useLocation();
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { count: bagCount, setIsOpen: setBagOpen } = useCart();
  const { count: favCount } = useFavorites();

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

  const iconBtn =
    "grid h-11 w-11 min-h-[44px] min-w-[44px] place-items-center rounded-full text-[var(--ink-soft)] transition-colors hover:bg-[var(--blush)]/70 hover:text-[var(--ink)]";

  return (
    <>
      <header
        className={`site-header sticky top-0 z-50 border-b backdrop-blur-[10px] transition-[box-shadow,background-color,border-color] duration-300 ${
          scrolled
            ? "border-[oklch(0.885_0.028_60/0.9)] bg-[oklch(0.971_0.017_78/0.92)] shadow-[0_10px_30px_oklch(0.305_0.033_42/0.05)]"
            : "border-transparent bg-[oklch(0.971_0.017_78/0.82)]"
        }`}
      >
        {/* skip */}
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-xs focus:font-semibold focus:text-[var(--ink)] focus:shadow-lg">
          Skip to content
        </a>

        <div className="container header-inner flex h-[72px] items-center justify-between gap-3 sm:h-[80px] sm:gap-5 transition-[height] duration-240 ease-[cubic-bezier(0.16,1,0.3,1)]">
          <Link href="/" className="group flex items-center gap-2.5 rounded-[2px] py-1 focus-visible:outline-offset-4" aria-label="Petal and Crumb home">
            <BakeryMark size="sm" />
            <span className="leading-none">
              <strong className="block font-display text-[20px] font-bold tracking-[-0.01em] text-[var(--ink)] sm:text-[21px]">
                Petal <em className="font-medium italic text-[var(--terra)]">&amp;</em> Crumb
              </strong>
              <span className="mt-[5px] block text-[8.5px] font-extrabold uppercase tracking-[0.3em] text-[var(--ink-mute)]">
                Cake Studio
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
            {navItems.map((item) => {
              const active = location === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative rounded-[2px] py-2 text-[14.5px] font-bold tracking-[-0.005em] transition-colors duration-200 ${
                    active ? "text-[var(--terra)]" : "text-[var(--ink-soft)] hover:text-[var(--ink)]"
                  }`}
                >
                  {item.label}
                  <span
                    className={`pointer-events-none absolute inset-x-1 bottom-0.5 h-[2px] origin-left rounded-full bg-[var(--terra)] transition-[transform,opacity] duration-300 ${active ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"}`}
                    aria-hidden
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-0.5 sm:gap-1">
            <button
              aria-label="Search cakes, flavors, and studio"
              onClick={() => setSearchOpen(true)}
              className={iconBtn}
              title="Search (⌘K)"
            >
              <Search size={18} strokeWidth={2} />
            </button>

            <Link
              href="/gallery"
              aria-label={`Favorites ${favCount ? `· ${favCount} saved` : ""}`}
              className={`relative hidden sm:grid ${iconBtn}`}
            >
              <Heart size={18} strokeWidth={2} className={favCount ? "fill-[var(--terra)] text-[var(--terra)]" : ""} />
              {favCount > 0 && (
                <span className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-[var(--terra)] px-1 text-[9px] font-extrabold leading-none text-white">
                  {favCount}
                </span>
              )}
            </Link>

            <button
              aria-label={`Shopping bag ${bagCount ? `· ${bagCount} items` : ""}`}
              onClick={() => setBagOpen(true)}
              className={`relative ${iconBtn}`}
            >
              <ShoppingBag size={18} strokeWidth={2} />
              {bagCount > 0 && (
                <span className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-[var(--terra)] px-1 text-[9px] font-extrabold leading-none text-white">
                  {bagCount}
                </span>
              )}
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button aria-label="Account" className={`hidden sm:grid ${iconBtn}`}>
                  <User size={18} strokeWidth={2} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 rounded-2xl border-[oklch(0.885_0.028_60)] bg-[var(--paper)] p-0 shadow-[0_24px_60px_oklch(0.305_0.033_42/0.14)]">
                <DropdownMenuLabel className="px-4 py-3.5">
                  <p className="font-display text-[16px] font-semibold leading-none">Hello, guest</p>
                  <p className="mt-1.5 text-[11.5px] font-normal leading-4 text-[var(--ink-mute)]">Portfolio demo — no sign-in required</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => toast.success("Signed in — demo", { description: "In production this would open authentication. For the portfolio, everything is mocked locally." })}
                  className="gap-2.5 rounded-none px-4 py-2.5 text-[13px]"
                >
                  <LogIn size={15} className="text-[var(--terra)]" /> Sign in (demo)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setBagOpen(true)} className="gap-2.5 rounded-none px-4 py-2.5 text-[13px]">
                  <ShoppingBag size={15} className="text-[var(--terra)]" /> Bag · {bagCount} items
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => toast("Wishlist — see Gallery hearts", { description: `You have ${favCount} favorites saved locally.` })}
                  className="gap-2.5 rounded-none px-4 py-2.5 text-[13px]"
                >
                  <Heart size={15} className="text-[var(--terra)]" /> Wishlist · {favCount}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => toast("Orders — demo", { description: "In production this would list past custom orders. Try the live studio for a full flow." })}
                  className="gap-2.5 rounded-none px-4 py-2.5 text-[13px]"
                >
                  <Package size={15} className="text-[var(--terra)]" /> Orders
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="px-4 py-3.5">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--ink-mute)]">Need help?</p>
                  <a href="mailto:hello@petalandcrumb.com" className="mt-1.5 inline-flex items-center gap-1.5 text-[13px] font-bold text-[var(--terra)] underline decoration-[var(--terra)]/25 underline-offset-4 hover:decoration-[var(--terra)]">
                    <Mail size={13} /> hello@petalandcrumb.com
                  </a>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="/custom-order"
              className="button-rose mx-1.5 hidden min-h-[44px] px-5 py-3 text-[13px] sm:inline-flex"
            >
              Order Now <ArrowUpRight size={15} strokeWidth={2.4} />
            </Link>

            <button
              ref={buttonRef}
              className={`grid h-11 w-11 min-h-[44px] min-w-[44px] place-items-center rounded-full text-[var(--ink-soft)] transition-colors hover:bg-[var(--blush)]/70 hover:text-[var(--ink)] lg:hidden`}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close navigation" : "Open navigation"}
            >
              {open ? <X size={21} strokeWidth={2} /> : <Menu size={22} strokeWidth={2} />}
            </button>
          </div>
        </div>

      {/* mobile drawer — soft sheet, expo slide, scrim */}
      <div
        className={`lg:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        <div
          onClick={() => setOpen(false)}
          className={`fixed inset-0 top-[72px] bg-[oklch(0.305_0.033_42/0.35)] backdrop-blur-[3px] transition-opacity duration-300 sm:top-[80px] ${open ? "opacity-100" : "opacity-0"}`}
        />
        <nav
          id="mobile-nav"
          ref={panelRef}
          aria-label="Mobile navigation"
          style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom, 1.5rem))" }}
          className={`fixed inset-x-0 top-[72px] max-h-[calc(100dvh-72px)] overflow-auto rounded-b-[1.75rem] border-t border-[oklch(0.9_0.02_65)] bg-[var(--cream)] shadow-[0_30px_60px_oklch(0.305_0.033_42/0.16)] transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] sm:top-[80px] sm:max-h-[calc(100dvh-80px)] ${open ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"}`}
        >
          <div className="mx-auto flex max-w-[560px] flex-col px-6 pt-4 sm:px-8">
            {navItems.map((item) => {
              const active = location === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-[52px] items-center justify-between border-b border-[oklch(0.9_0.02_65)] text-[17px] font-bold tracking-[-0.005em] transition-colors ${
                    active ? "text-[var(--terra)]" : "text-[var(--ink)] hover:text-[var(--terra)]"
                  }`}
                >
                  <span>{item.label}</span>
                  <ArrowUpRight size={17} className={active ? "opacity-100" : "opacity-25"} aria-hidden />
                </Link>
              );
            })}

            <Link
              href="/custom-order"
              onClick={() => setOpen(false)}
              className="button-rose mt-6 w-full justify-center min-h-[48px]"
            >
              Order Now <ArrowUpRight size={15} />
            </Link>

            <p className="pt-5 text-center">
              <ScriptNote>Life is sweeter with cake</ScriptNote>
            </p>
            <p className="pt-2 text-center text-[12.5px] leading-5 text-[var(--ink-mute)]">
              <a href="mailto:hello@petalandcrumb.com" className="font-bold underline decoration-[var(--terra)]/30 underline-offset-4 hover:decoration-[var(--terra)]">hello@petalandcrumb.com</a>
              <span className="mx-2 opacity-40">·</span>
              Portland, OR
            </p>
          </div>
        </nav>
      </div>
      </header>

      {/* Floating Back to Top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top of page"
        className="back-to-top fixed bottom-6 right-6 z-40 grid h-12 w-12 place-items-center rounded-full bg-[var(--paper)]/95 text-[var(--terra)] shadow-[0_12px_32px_oklch(0.305_0.033_42/0.18)] backdrop-blur-md transition-colors hover:bg-[var(--terra)] hover:text-white"
      >
        <ArrowUpRight size={19} className="-rotate-45" strokeWidth={2.4} />
      </button>

      <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
      <CartDrawer />
    </>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email", { duration: 2000 });
      return;
    }
    setStatus("loading");
    setTimeout(() => {
      setStatus("done");
      toast.success("You’re on the list — welcome", { description: "This is a portfolio demo. In production, you’d receive seasonal menu notes." });
    }, 650);
  };
  if (status === "done") {
    return (
      <div className="rounded-2xl border border-white/15 bg-white/[0.06] p-4">
        <p className="font-display text-[17px] font-semibold leading-tight">You’re in. Thank you.</p>
        <p className="mt-1.5 text-[12.5px] leading-5 text-[oklch(0.85_0.02_70)]">We’ll share seasonal flavors and studio dates — about once a month, never spam.</p>
      </div>
    );
  }
  return (
    <form onSubmit={submit} className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] p-1.5 pl-5">
      <label className="sr-only" htmlFor="footer-newsletter">Email</label>
      <input
        id="footer-newsletter"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        type="email"
        autoComplete="email"
        className="h-9 min-w-0 flex-1 bg-transparent text-[13.5px] text-white placeholder:text-white/40 outline-none"
      />
      <button disabled={status === "loading"} className="inline-flex h-9 shrink-0 items-center justify-center rounded-full bg-[var(--terra)] px-5 text-[13px] font-bold text-white transition-colors hover:bg-[var(--terra-deep)] disabled:opacity-60">
        {status === "loading" ? "Joining…" : "Join"}
      </button>
    </form>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-[var(--chocolate)] text-[oklch(0.95_0.012_78)]">
      {/* newsletter strip */}
      <div className="border-b border-white/[0.08] bg-white/[0.03]">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-5 px-6 py-8 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:py-9">
          <div className="max-w-[520px]">
            <p className="footer-label text-white/60">Seasonal notes</p>
            <p className="mt-2 font-display text-[23px] font-semibold leading-tight tracking-[-0.01em]">A little sweetness in your inbox.</p>
            <p className="mt-1.5 max-w-[44ch] text-[13px] leading-5 text-[oklch(0.84_0.02_65)]">New flavors, open kitchen dates, and garden notes — once or twice a month. Unsubscribe anytime.</p>
          </div>
          <div className="w-full max-w-[400px]">
            <NewsletterForm />
            <p className="mt-2.5 pl-2 text-[11px] leading-4 text-[oklch(0.72_0.02_60)]">No spam. Portfolio demo — no email is actually sent.</p>
          </div>
        </div>
      </div>
      <div className="px-6 pb-8 pt-14 sm:px-8">
        <div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-[1.5fr_.75fr_.75fr]">
          <div className="max-w-[440px]">
            <div className="flex items-center gap-3.5">
              <BakeryMark size="md" inverse />
              <div>
                <p className="font-display text-[23px] font-bold leading-none tracking-[-0.01em]">Petal <em className="font-medium italic text-[oklch(0.82_0.07_28)]">&amp;</em> Crumb</p>
                <p className="mt-1.5 text-[9px] font-extrabold uppercase tracking-[0.3em] text-[oklch(0.8_0.06_30)]">Cake Studio</p>
              </div>
            </div>
            <p className="mt-7 font-display text-[31px] font-semibold leading-[1.05] tracking-[-0.015em] text-balance sm:text-[35px]">
              A cake worth <em className="font-medium italic text-[oklch(0.82_0.07_28)]">gathering</em> around.
            </p>
            <p className="mt-4 max-w-[36ch] text-[14px] leading-6 text-[oklch(0.84_0.02_65)]">
              Artful custom cakes and small-batch sweets for celebrations with a little more meaning. Baked slowly, decorated by hand.
            </p>
            <p className="mt-6"><ScriptNote className="text-[oklch(0.88_0.06_85)]">made with butter, flowers &amp; patience</ScriptNote></p>
          </div>

          <div>
            <p className="footer-label">Studio</p>
            <div className="mt-5 flex flex-col gap-0.5 text-sm">
              {[
                { label: "The menu", href: "/menu", desc: "Seasonal favorites" },
                { label: "Cake collection", href: "/gallery", desc: "Past tables" },
                { label: "Meet Maya", href: "/about", desc: "The hands behind" },
                { label: "Contact", href: "/contact", desc: "Say hello" },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="group flex items-baseline justify-between gap-3 rounded-[2px] py-2 text-[oklch(0.93_0.012_78)] transition-colors hover:text-white">
                  <span className="underline decoration-white/15 underline-offset-4 group-hover:decoration-white/40">{l.label}</span>
                  <span className="text-[11.5px] font-medium text-[oklch(0.72_0.02_60)] group-hover:text-white/80">{l.desc}</span>
                </Link>
              ))}
              <Link href="/custom-order" className="group mt-4 inline-flex items-center gap-2 self-start rounded-full bg-[var(--terra)] px-4 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-[oklch(0.66_0.115_27)]">
                Build a custom cake <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>

          <div>
            <p className="footer-label">Say hello</p>
            <a
              href="mailto:hello@petalandcrumb.com"
              className="mt-5 inline-block rounded-[2px] text-[14.5px] font-bold text-[oklch(0.95_0.012_78)] underline decoration-[oklch(0.65_0.09_30)] decoration-[1.5px] underline-offset-[6px] transition-colors hover:decoration-[oklch(0.85_0.07_28)] focus-visible:outline-offset-4"
            >
              hello@petalandcrumb.com
            </a>
            <p className="mt-4 text-[13.5px] leading-6 text-[oklch(0.84_0.02_65)]">
              Portland, Oregon
              <br />
              Studio pickup + local delivery
              <br />
              <span className="text-[11.5px] text-[oklch(0.72_0.02_60)]">Replies within a day · Tue–Sat</span>
            </p>
            <button
              onClick={() => toast.success("Instagram — portfolio demo", { description: "In production this would open @petalandcrumb. For now, explore the Gallery." })}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2.5 text-[13px] font-bold text-[oklch(0.93_0.012_78)] transition-colors hover:bg-white/10 hover:text-white"
            >
              <Instagram size={15} strokeWidth={2} /> Instagram
            </button>
          </div>
        </div>

        <div className="mx-auto mt-12 flex max-w-[1280px] flex-col gap-3 border-t border-white/[0.1] pt-6 text-[11px] font-semibold text-[oklch(0.72_0.02_60)] sm:flex-row sm:items-center sm:justify-between">
          <span className="order-2 sm:order-1">© 2026 Petal &amp; Crumb Bakery · Portland, Oregon · Cottage food business</span>
          <span className="order-1 flex items-center gap-2 sm:order-2">
            <span className="hidden h-px w-6 bg-white/15 sm:block" aria-hidden />
            Made fresh, made thoughtfully
          </span>
        </div>
      </div>
    </footer>
  );
}
