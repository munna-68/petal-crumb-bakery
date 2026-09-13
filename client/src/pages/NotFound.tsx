import { ArrowLeft, ArrowUpRight, Search, Home, Compass } from "lucide-react";
import { Link } from "wouter";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import BakeryMark from "@/components/BakeryMark";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[oklch(0.982_0.008_75)] text-[var(--ink)]">
      <SiteHeader />
      <main id="main" className="container py-10 sm:py-16">
        <div className="mx-auto max-w-[880px] overflow-hidden border border-[oklch(0.88_0.018_52)] bg-white shadow-[0_24px_70px_oklch(0.25_0.018_35/0.08)]">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative hidden bg-[oklch(0.93_0.04_13)] p-8 lg:flex lg:flex-col lg:justify-between">
              <div className="paper-texture absolute inset-0 opacity-40" aria-hidden />
              <div className="relative">
                <BakeryMark size="md" />
                <p className="eyebrow mt-6">404 · Lost crumb</p>
                <p className="mt-4 font-display text-[44px] font-[450] leading-[0.9] tracking-[-0.04em]">
                  This page
                  <br />
                  <em>wandered.</em>
                </p>
                <p className="mt-4 max-w-[28ch] text-[13px] leading-5 text-[oklch(0.42_0.02_35)]">Even the best-laid cake plans go off-table sometimes. The page you’re looking for isn’t here.</p>
              </div>
              <div className="relative border-t border-[oklch(0.84_0.06_18/0.35)] pt-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[oklch(0.52_0.02_35)]">Try instead</p>
                <div className="mt-2 flex flex-col gap-1.5 text-[13px]">
                  <Link href="/menu" className="underline decoration-[var(--rosewood)]/20 underline-offset-4 hover:decoration-[var(--rosewood)]">See the menu →</Link>
                  <Link href="/gallery" className="underline decoration-[var(--rosewood)]/20 underline-offset-4 hover:decoration-[var(--rosewood)]">Browse the collection →</Link>
                  <Link href="/custom-order" className="underline decoration-[var(--rosewood)]/20 underline-offset-4 hover:decoration-[var(--rosewood)]">Build a custom cake →</Link>
                </div>
              </div>
            </div>
            <div className="p-7 sm:p-10 lg:p-12">
              <div className="lg:hidden">
                <div className="flex items-center gap-3">
                  <span className="h-px w-7 bg-[var(--rosewood)]" aria-hidden />
                  <p className="eyebrow">404 · Lost crumb</p>
                </div>
                <h1 className="display-title mt-4 text-[48px]">That page <em>wandered.</em></h1>
                <p className="mt-3 max-w-[36ch] text-[14px] leading-6 text-[oklch(0.44_0.02_35)]">The page you’re looking for isn’t here. Perhaps a different sweet thing?</p>
              </div>
              <div className="hidden lg:block">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--rosewood)]">Still hungry?</p>
                <h1 className="mt-2 font-display text-[30px] font-medium leading-none tracking-[-0.02em]">Let’s get you back to the studio.</h1>
              </div>

              <div className="mt-8 grid gap-3">
                <Link href="/" className="button-rose w-full justify-center py-4 text-[11px]">
                  <Home size={14} /> Back to home
                </Link>
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/menu" className="button-ink justify-center py-3.5">
                    Menu
                  </Link>
                  <Link href="/custom-order" className="button-ink justify-center py-3.5">
                    Custom order
                  </Link>
                </div>
                <Link href="/gallery" className="inline-flex items-center justify-center gap-2 border border-[oklch(0.86_0.02_52)] bg-[oklch(0.97_0.008_72)] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-[oklch(0.34_0.02_35)] hover:bg-white hover:text-[var(--ink)]">
                  <Compass size={14} className="text-[var(--rosewood)]" /> Explore gallery
                </Link>
              </div>

              <div className="mt-6 border border-dashed border-[oklch(0.86_0.02_52)] bg-[oklch(0.97_0.008_72)] p-4">
                <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-[oklch(0.42_0.02_35)]"><Search size={13} className="text-[var(--rosewood)]" /> Try search — press ⌘K</p>
                <p className="mt-1 text-[12.5px] leading-5 text-[oklch(0.46_0.02_35)]">Type “vanilla,” “wedding,” or “cookies” to jump anywhere. Portfolio demo — search is fully mocked.</p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-[oklch(0.91_0.015_52)] pt-4 text-[11px]">
                <Link href="/" className="inline-flex items-center gap-1.5 text-[oklch(0.52_0.02_35)] hover:text-[var(--rosewood)]"><ArrowLeft size={13} /> Home</Link>
                <span className="text-[oklch(0.58_0.03_18)]">Error 404 · Petal & Crumb</span>
              </div>
            </div>
          </div>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-[11px] leading-5 text-[oklch(0.58_0.03_18)]">
          If you followed a link from elsewhere, it may have moved. In a live shop this page would also log the miss for the studio — portfolio version just looks lovely.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
