/** Garden Bakery: 404 — warm, gentle, botanical. */
import { ArrowUpRight, Search, Home, Compass } from "lucide-react";
import { Link } from "wouter";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import BakeryMark from "@/components/BakeryMark";
import { ScriptNote, ButterBlob, LeafSprig, HeartDoodle } from "@/components/decor";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--cream)] text-[var(--ink)]">
      <SiteHeader />
      <main id="main" className="container py-12 sm:py-20">
        <div className="paper-texture relative mx-auto max-w-[820px] overflow-hidden rounded-[2.5rem] bg-[var(--paper)] px-6 py-16 text-center shadow-[0_24px_70px_oklch(0.305_0.033_42/0.07)] sm:px-12 sm:py-20">
          <ButterBlob className="pointer-events-none absolute -left-14 -top-14 h-48 w-48 text-[var(--butter)] opacity-80" aria-hidden />
          <LeafSprig className="drift pointer-events-none absolute -right-5 bottom-4 h-32 w-32 rotate-[140deg] text-[var(--sage-deep)] opacity-35" aria-hidden />
          <HeartDoodle className="pointer-events-none absolute right-[16%] top-10 hidden h-10 w-10 rotate-12 text-[var(--terra)] opacity-45 sm:block" aria-hidden />
          <div className="relative mx-auto max-w-md">
            <div className="flex justify-center">
              <BakeryMark size="lg" />
            </div>
            <p className="eyebrow mt-6 justify-center">404 · lost crumb</p>
            <h1 className="display-title mt-3 text-[52px] sm:text-[66px]">
              This page <em>wandered.</em>
            </h1>
            <p className="mx-auto mt-4 max-w-[36ch] text-[15px] leading-7 text-[var(--ink-soft)]">
              Even the best-laid cake plans go off-table sometimes. The page you’re looking for isn’t here.
            </p>
            <p className="mt-3"><ScriptNote className="text-[19px] text-[var(--ink-mute)]">let’s get you back to something sweet</ScriptNote></p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/" className="button-rose w-full justify-center sm:w-auto">
                <Home size={15} /> Back to home
              </Link>
              <Link href="/menu" className="button-ink w-full justify-center sm:w-auto">
                The menu
              </Link>
              <Link href="/custom-order" className="button-ink w-full justify-center sm:w-auto">
                Custom order
              </Link>
            </div>

            <div className="mt-8 flex flex-col items-center gap-4 border-t border-[oklch(0.9_0.022_65)] pt-6">
              <Link href="/gallery" className="inline-flex items-center gap-2 text-[13.5px] font-extrabold text-[var(--terra)] hover:text-[var(--terra-deep)]">
                <Compass size={15} /> Explore the gallery <ArrowUpRight size={13} />
              </Link>
              <p className="flex items-center gap-1.5 text-[12.5px] font-semibold text-[var(--ink-mute)]">
                <Search size={13} className="text-[var(--terra)]" /> Or try search — press ⌘K and type “vanilla”
              </p>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
