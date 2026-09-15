import { Quote } from "lucide-react";

const pressMentions = [
  { outlet: "The Oregonian", quote: "“The most thoughtful buttercream in the city.”", note: "Food Day Feature" },
  { outlet: "Portland Monthly", quote: "“Small-batch, seasonal, and deeply considered.”", note: "Market Notes" },
  { outlet: "Bon Appétit", quote: "“Cakes that taste as memorable as they look.”", note: "Pacific Northwest Edit" },
  { outlet: "Eater PDX", quote: "“An artful counterpoint to sugary excess.”", note: "Essential Bakeries" },
  { outlet: "Sunset Magazine", quote: "“Textured buttercream and garden magic.”", note: "Best of the West" },
];

export function PressMarquee() {
  return (
    <div className="mt-4 overflow-hidden border border-[oklch(0.88_0.018_52)] bg-white py-3 shadow-[0_4px_16px_oklch(0.25_0.018_35/0.03)]">
      <div className="flex items-center">
        <div className="shrink-0 flex items-center gap-2 border-r border-[oklch(0.88_0.018_52)] px-4 bg-white z-10">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--rosewood)]" />
          <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[oklch(0.58_0.03_18)] whitespace-nowrap">
            Noted in
          </span>
        </div>

        <div className="marquee-wrapper flex-1 overflow-hidden" tabIndex={0} aria-label="Press mentions marquee. Scroll horizontally or pause with hover">
          <div className="marquee-track flex items-center gap-8 pl-4">
            {/* First sequence */}
            {pressMentions.map((item, idx) => (
              <div key={`p1-${idx}`} className="flex items-center gap-3 shrink-0">
                <span className="font-display text-[14px] font-medium tracking-[-0.01em] text-[var(--ink)]">
                  {item.outlet}
                </span>
                <span className="text-[11.5px] italic text-[oklch(0.48_0.02_35)] hidden sm:inline">
                  {item.quote}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-[var(--rosewood)] border border-[var(--rosewood)]/20 px-1.5 py-0.5 rounded-full">
                  {item.note}
                </span>
                <span className="h-3 w-px bg-[oklch(0.88_0.018_52)] ml-2" aria-hidden="true" />
              </div>
            ))}
            {/* Duplicated sequence for seamless continuous loop */}
            {pressMentions.map((item, idx) => (
              <div key={`p2-${idx}`} className="flex items-center gap-3 shrink-0" aria-hidden="true">
                <span className="font-display text-[14px] font-medium tracking-[-0.01em] text-[var(--ink)]">
                  {item.outlet}
                </span>
                <span className="text-[11.5px] italic text-[oklch(0.48_0.02_35)] hidden sm:inline">
                  {item.quote}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-[var(--rosewood)] border border-[var(--rosewood)]/20 px-1.5 py-0.5 rounded-full">
                  {item.note}
                </span>
                <span className="h-3 w-px bg-[oklch(0.88_0.018_52)] ml-2" aria-hidden="true" />
              </div>
            ))}
          </div>
        </div>

        <div className="hidden lg:flex shrink-0 items-center gap-1.5 border-l border-[oklch(0.88_0.018_52)] px-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--rosewood)] bg-white z-10 whitespace-nowrap">
          <Quote size={12} /> Editorial, not advertorial
        </div>
      </div>
    </div>
  );
}
