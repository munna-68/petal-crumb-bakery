import { useState, useRef, useCallback } from "react";
import { Sparkles, ArrowRight, ArrowLeftRight, Check } from "lucide-react";
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

  return (
    <div
      data-reveal="up"
      className="border border-[oklch(0.88_0.018_52)] bg-white p-6 sm:p-8 lg:p-10 shadow-[0_16px_48px_oklch(0.25_0.018_35/0.06)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[oklch(0.91_0.015_52)] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--rosewood)]" />
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--rosewood)]">
              Craftsmanship &amp; Finishes
            </p>
          </div>
          <h3 className="mt-1 font-display text-[26px] sm:text-[32px] font-medium leading-none tracking-[-0.02em]">
            Compare Buttercream Finishes
          </h3>
          <p className="mt-2 text-[13px] text-[oklch(0.48_0.02_35)] max-w-[56ch]">
            Drag the divider to explore the texture difference between our minimal smooth finish and hand-textured garden buttercream.
          </p>
        </div>

        {/* Quick presets */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSliderPos(15)}
            className={`px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] rounded-full border transition-colors ${
              sliderPos < 30 ? "border-[var(--rosewood)] bg-[var(--rosewood)] text-white" : "border-[oklch(0.86_0.02_52)] bg-white text-[oklch(0.42_0.02_35)]"
            }`}
          >
            Smooth (+$0)
          </button>
          <button
            onClick={() => setSliderPos(50)}
            className={`px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] rounded-full border transition-colors ${
              sliderPos >= 30 && sliderPos <= 70 ? "border-[var(--rosewood)] bg-[var(--rosewood)] text-white" : "border-[oklch(0.86_0.02_52)] bg-white text-[oklch(0.42_0.02_35)]"
            }`}
          >
            50 / 50
          </button>
          <button
            onClick={() => setSliderPos(85)}
            className={`px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] rounded-full border transition-colors ${
              sliderPos > 70 ? "border-[var(--rosewood)] bg-[var(--rosewood)] text-white" : "border-[oklch(0.86_0.02_52)] bg-white text-[oklch(0.42_0.02_35)]"
            }`}
          >
            Textured (+$42)
          </button>
        </div>
      </div>

      {/* Comparison Slider Workspace */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_.7fr] items-start">
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
          className="relative aspect-[1.3] sm:aspect-[1.5] w-full overflow-hidden border border-[oklch(0.88_0.018_52)] bg-[oklch(0.96_0.008_72)] cursor-ew-resize select-none focus:outline-none focus:ring-2 focus:ring-[var(--rosewood)] focus:ring-offset-2"
        >
          {/* Base Layer: Textured Floral */}
          <img
            src={imgTextured}
            alt="Hand-textured buttercream cake with fresh garden flowers"
            className="absolute inset-0 h-full w-full object-cover pointer-events-none"
            loading="lazy"
          />

          {/* Top Layer: Smooth Minimal, clipped via sliderPos */}
          <div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{ width: `${sliderPos}%` }}
          >
            <img
              src={imgSmooth}
              alt="Smooth classic frosted cake on porcelain stand"
              className="absolute inset-0 h-full w-full object-cover max-w-none pointer-events-none"
              style={{
                width: containerRef.current ? `${containerRef.current.clientWidth}px` : "100%",
                height: "100%",
              }}
              loading="lazy"
            />
          </div>

          {/* Dividing Bar & Handle */}
          <div
            className="absolute top-0 bottom-0 z-20 w-[2px] bg-white pointer-events-none shadow-[0_0_12px_rgba(0,0,0,0.35)]"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full border border-[var(--rosewood)] bg-white text-[var(--rosewood)] shadow-[0_4px_16px_rgba(0,0,0,0.22)]">
              <ArrowLeftRight size={16} strokeWidth={2.4} />
            </div>
          </div>

          {/* Overlay Labels */}
          <div className="absolute top-3 left-3 pointer-events-none rounded-full border border-black/15 bg-white/90 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[var(--ink)] backdrop-blur-md">
            Look A · Minimal Smooth
          </div>
          <div className="absolute top-3 right-3 pointer-events-none rounded-full border border-black/15 bg-white/90 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[var(--ink)] backdrop-blur-md">
            Look B · Textured Garden
          </div>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none rounded-full bg-black/75 px-3 py-1 text-[10px] font-medium tracking-wide text-white backdrop-blur-sm">
            Drag divider or tap presets · {Math.round(sliderPos)}%
          </div>
        </div>

        {/* Informative Side Panel */}
        <div className="flex flex-col justify-between h-full space-y-4">
          <div className="space-y-3">
            <div className="border border-[oklch(0.86_0.02_52)] bg-[oklch(0.985_0.006_75)] p-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[oklch(0.52_0.02_35)]">
                  Option 01
                </span>
                <span className="text-[11px] font-semibold text-emerald-700">Included (+$0)</span>
              </div>
              <p className="mt-1 font-display text-[18px] font-medium leading-tight">
                Minimal Smooth Silk Finish
              </p>
              <p className="mt-1 text-[12px] leading-4 text-[oklch(0.48_0.02_35)]">
                Calm, satin-smooth finish scraped flush to the sponge. Modern and quiet.
              </p>
            </div>

            <div className="border border-[var(--rosewood)]/30 bg-[oklch(0.94_0.03_13)] p-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--rosewood)]">
                  Option 02
                </span>
                <span className="text-[11px] font-semibold text-[var(--rosewood)]">Floral Finish (+$42)</span>
              </div>
              <p className="mt-1 font-display text-[18px] font-medium leading-tight">
                Textured Buttercream &amp; Flora
              </p>
              <p className="mt-1 text-[12px] leading-4 text-[oklch(0.48_0.02_35)]">
                Hand-whipped stucco texture with organic edible petals, stems, and seasonal garden blooms.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-[oklch(0.91_0.015_52)]">
            <Link
              href="/custom-order"
              className="button-rose w-full justify-center min-h-[44px] text-[10px]"
            >
              Choose this finish in Studio <ArrowRight size={14} />
            </Link>
            <p className="mt-2 text-center text-[11px] text-[oklch(0.52_0.02_35)]">
              Pricing updates automatically in Step 02 of the custom quote.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
