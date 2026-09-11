/**
 * Quiet Patisserie Editorial: persistent navigation is bright, quiet, and
 * typographic so the photo-led content and order studio remain the focus.
 */
import { Instagram, Menu, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";
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
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-[#ddcfc8]/80 bg-[#fbf9f4]/95 backdrop-blur-md">
      <div className="container flex h-[76px] items-center justify-between gap-5">
        <Link href="/" className="flex items-center gap-3" aria-label="Petal and Crumb home">
          <BakeryMark size="sm" />
          <span className="leading-none">
            <strong className="block font-display text-[19px] font-semibold tracking-[-0.04em] text-[#342b29]">
              Petal <em className="font-normal">&amp;</em> Crumb
            </strong>
            <span className="mt-1 block text-[8px] font-semibold uppercase tracking-[0.24em] text-[#9a716d]">
              Cake Studio
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-[11px] font-semibold uppercase tracking-[0.13em] transition-colors hover:text-[#a8515a] ${
                location === item.href ? "text-[#a8515a]" : "text-[#564946]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link href="/custom-order" className="button-rose hidden px-4 py-2.5 text-[10px] sm:inline-flex">
          Start an order
        </Link>
        <button
          className="grid h-10 w-10 place-items-center border border-[#d8c7c1] text-[#5a4743] lg:hidden"
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label={open ? "Close navigation" : "Open navigation"}
        >
          {open ? <X size={19} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-[#e6ddd7] bg-[#fbf9f4] px-5 py-5 lg:hidden" aria-label="Mobile navigation">
          <div className="mx-auto flex max-w-[520px] flex-col">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`border-b border-[#e9dfdb] py-4 text-sm font-semibold uppercase tracking-[0.14em] ${
                  location === item.href ? "text-[#a8515a]" : "text-[#403431]"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/custom-order" onClick={() => setOpen(false)} className="button-rose mt-5 justify-center px-5 py-3">
              Build your cake
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-[#342b29] px-5 pb-7 pt-16 text-[#f7f2eb] sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[1.35fr_.65fr_.65fr]">
        <div>
          <div className="flex items-center gap-3">
            <BakeryMark size="md" inverse />
            <div>
              <p className="font-display text-2xl leading-none">Petal &amp; Crumb</p>
              <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.24em] text-[#d9aca9]">Cake Studio</p>
            </div>
          </div>
          <p className="mt-6 max-w-sm font-display text-[28px] leading-[1.05] text-[#f7f2eb] sm:text-[34px]">
            A cake worth gathering around.
          </p>
          <p className="mt-4 max-w-sm text-sm leading-6 text-[#dacdc5]">
            Artful custom cakes and small-batch sweets for celebrations with a little more meaning.
          </p>
        </div>
        <div>
          <p className="footer-label">Studio</p>
          <div className="mt-5 flex flex-col gap-3 text-sm text-[#e8ded7]">
            <Link href="/menu">The menu</Link>
            <Link href="/gallery">Cake collection</Link>
            <Link href="/about">Meet Maya</Link>
          </div>
        </div>
        <div>
          <p className="footer-label">Say hello</p>
          <a href="mailto:hello@petalandcrumb.com" className="mt-5 block text-sm text-[#e8ded7] underline decoration-[#a8515a] underline-offset-4">
            hello@petalandcrumb.com
          </a>
          <p className="mt-3 text-sm leading-6 text-[#dacdc5]">Portland, Oregon<br />Pickup + local delivery</p>
          <a href="#instagram" className="mt-5 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#f1dfd8] hover:text-[#d9aca9]">
            <Instagram size={15} /> Instagram
          </a>
        </div>
      </div>
      <div className="mx-auto mt-14 flex max-w-[1240px] flex-col justify-between gap-3 border-t border-white/15 pt-5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#bcaea7] sm:flex-row">
        <span>© 2026 Petal &amp; Crumb Bakery</span>
        <span>Made fresh, made thoughtfully</span>
      </div>
    </footer>
  );
}
