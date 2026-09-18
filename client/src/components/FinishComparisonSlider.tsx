import { useState, useRef, useCallback } from "react";
import { ArrowRight, ArrowLeftRight } from "lucide-react";
import { Link } from "wouter";
import { withBase } from "@/lib/withBase";

const imgSmooth = withBase("/images/photo-1602351447937-745cb720612f.jpg");
const imgTextured = withBase("/images/photo-1578985545062-69928b1d9587.jpg");

export function FinishComparisonSlider() {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percent);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) handleMove(e.clientX);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      setSliderPos((p) => Math.max(0, p - 5));
    } else if (e.key === "ArrowRight") {
      setSliderPos((p) => Math.min(100, p + 5));
    }
  };

  const preset = (pos: number, label: string, isActive: boolean) => (
    <button
      onClick={() => setSliderPos(pos)}
      className={`rounded-full px-4 py-2 text-[12.5px] font-extrabold transition-colors ${
        isActive ? "bg-[var(--terra)] text-white" : "bg-[var(--cream)] text-[var(--ink-soft)] hover:bg-[var(--blush)] hover:text-[var(--terra)]"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div
      data-reveal="up"
      className="rounded-[2rem] bg-[var(--paper)] p-6 shadow-[0_20px_60px_oklch(0.305_0.033_42/0.07)] sm:p-9 lg:p-11"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 pb-7">
        <div>
          <p className="eyebrow">Craftsmanship &amp; finishes</p>
          <h3 className="mt-2 font-display text-[27px] sm:text-[33px] font-semibold leading-none tracking-[-0.015em]">
            Compare buttercream finishes
          </h3>
          <p className="mt-2.5 max-w-[56ch] text-[13.5px] leading-5 text-[var(--ink-mute)]">
            Drag the divider to feel the difference between our satin-smooth finish and hand-textured garden buttercream.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {preset(15, "Smooth +$0", sliderPos < 30)}
          {preset(50, "50 / 50", sliderPos >= 30 && sliderPos <= 70)}
          {preset(85, "Textured +$42", sliderPos > 70)}
        </div>
      </div>

      <div className="grid items-start gap-7 lg:grid-cols-[1.3fr_.7fr]">
        <div
          ref={containerRef}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="slider"
          aria-valuenow={Math.round(sliderPos)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Comparison slider between smooth buttercream and textured floral finish. Use left and right arrow keys to adjust."
          className="relative aspect-[1.3] w-full cursor-ew-resize select-none overflow-hidden rounded-[1.4rem] bg-[oklch(0.94_0.014_75)] focus:outline-none focus:ring-2 focus:ring-[var(--terra)] focus:ring-offset-2 sm:aspect-[1.5]"
        >
          <img
            src={imgTextured}
            alt="Hand-textured buttercream cake with fresh garden flowers"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
          <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ width: `${sliderPos}%` }}>
            <img
              src={imgSmooth}
              alt="Smooth classic frosted cake on porcelain stand"
              className="pointer-events-none absolute inset-0 h-full w-full max-w-none object-cover"
              style={{
                width: containerRef.current ? `${containerRef.current.clientWidth}px` : "100%",
                height: "100%",
              }}
              loading="lazy"
            />
          </div>

          <div className="pointer-events-none absolute bottom-0 top-0 z-20 w-[3px] bg-white shadow-[0_0_14px_oklch(0.3_0.03_42/0.4)]" style={{ left: `${sliderPos}%` }}>
            <div className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-[var(--terra)] shadow-[0_6px_20px_oklch(0.3_0.03_42/0.3)]">
              <ArrowLeftRight size={17} strokeWidth={2.4} />
            </div>
          </div>

          <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-white/90 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.1em] text-[var(--ink)] backdrop-blur-sm">
            Smooth silk
          </div>
          <div className="pointer-events-none absolute right-4 top-4 rounded-full bg-white/90 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.1em] text-[var(--ink)] backdrop-blur-sm">
            Textured garden
          </div>
        </div>

        <div className="flex h-full flex-col justify-between gap-4">
          <div className="space-y-3">
            <div className="rounded-2xl bg-[var(--cream)] p-5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--ink-mute)]">Smooth silk</span>
                <span className="text-[12px] font-extrabold text-[var(--sage-deep)]">Included</span>
              </div>
              <p className="mt-1.5 font-display text-[18.5px] font-semibold leading-tight">Minimal Smooth Silk Finish</p>
              <p className="mt-1 text-[12.5px] leading-4 text-[var(--ink-mute)]">Calm, satin-smooth finish scraped flush to the sponge. Modern and quiet.</p>
            </div>

            <div className="rounded-2xl bg-[var(--blush)] p-5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[oklch(0.45_0.08_20)]">Textured garden</span>
                <span className="text-[12px] font-extrabold text-[var(--terra-deep)]">+$42</span>
              </div>
              <p className="mt-1.5 font-display text-[18.5px] font-semibold leading-tight">Textured Buttercream &amp; Flora</p>
              <p className="mt-1 text-[12.5px] leading-4 text-[oklch(0.42_0.045_30)]">Hand-whipped stucco texture with organic edible petals, stems, and seasonal garden blooms.</p>
            </div>
          </div>

          <div className="pt-1">
            <Link href="/custom-order" className="button-rose w-full justify-center min-h-[46px]">
              Choose this finish <ArrowRight size={15} />
            </Link>
            <p className="mt-2.5 text-center text-[12px] font-semibold text-[var(--ink-mute)]">
              Pricing updates automatically in the live quote.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
