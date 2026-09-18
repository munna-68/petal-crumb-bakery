import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Play, Pause, ArrowUpRight, Heart, Quote } from "lucide-react";
import { Link } from "wouter";
import { useFavorites } from "@/contexts/FavoritesContext";
import { withBase } from "@/lib/withBase";
import { ScriptNote } from "@/components/decor";

interface Slide {
  id: string;
  host: string;
  occasion: string;
  date: string;
  title: string;
  flavor: string;
  serves: string;
  quote: string;
  image: string;
}

const slides: Slide[] = [
  {
    id: "journal-01",
    host: "Elena & Marcus",
    occasion: "Mt. Tabor Intimate Wedding",
    date: "August 2025",
    title: "Wildflower Two-Tier",
    flavor: "Bourbon Vanilla Bean · Raspberry Preserve · Elderflower",
    serves: "40 guests",
    quote: "“The cake sat under a willow tree in late afternoon light. When we cut into it, the quiet hum of our friends eating second slices was everything we wanted.”",
    image: withBase("/images/photo-1578985545062-69928b1d9587.jpg"),
  },
  {
    id: "journal-02",
    host: "Clara's 30th",
    occasion: "Hawthorne Garden Party",
    date: "June 2025",
    title: "Citrus & Olive Oil Petite",
    flavor: "Meyer Lemon · Whipped Mascarpone · Lemon Curd",
    serves: "10 guests",
    quote: "“A cake that actually tasted like fresh-picked Meyer lemons rather than sugar. The textured finish looked like oil paint on linen.”",
    image: withBase("/images/photo-1535254973040-607b474cb50d.jpg"),
  },
  {
    id: "journal-03",
    host: "Liam & Julian",
    occasion: "Autumn Baby Shower",
    date: "October 2025",
    title: "Birthday Blush Centerpiece",
    flavor: "Strawberry Milk · Sweet Vanilla Buttercream",
    serves: "18 guests",
    quote: "“We didn’t want bubbly fondant characters — we wanted something artful and delicious. Maya delivered beyond our dreams.”",
    image: withBase("/images/photo-1559620192-032c4bc4674e.jpg"),
  },
  {
    id: "journal-04",
    host: "Sienna's Studio Gathering",
    occasion: "Gallery Opening Supper",
    date: "November 2025",
    title: "Hand-Iced Shortbread Favors",
    flavor: "Vanilla Sablé · Salted Vanilla Glaze",
    serves: "36 favors",
    quote: "“Every guest left with a tied box of cookies. The butter melted on the tongue. Pure elegance.”",
    image: withBase("/images/photo-1499636136210-6f4ee915583e.jpg"),
  },
];

export function SliceJournalCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const { toggle, isFavorite } = useFavorites();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const total = slides.length;
  const slide = slides[current];
  const favKey = `journal-${slide.id}`;
  const isFav = isFavorite(favKey);

  const next = () => setCurrent((c) => (c + 1) % total);
  const prev = () => setCurrent((c) => (c - 1 + total) % total);

  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(next, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, current]);

  const ctrl =
    "grid h-10 w-10 place-items-center rounded-full bg-[var(--cream)] text-[var(--ink-soft)] transition-colors hover:bg-[var(--blush)] hover:text-[var(--terra)]";

  return (
    <div
      data-reveal="up"
      className="rounded-[2rem] bg-[var(--paper)] p-6 shadow-[0_20px_60px_oklch(0.305_0.033_42/0.07)] sm:p-9 lg:p-11"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 pb-7">
        <div>
          <p className="eyebrow">Celebration journal</p>
          <h3 className="mt-2 font-display text-[27px] sm:text-[33px] font-semibold leading-none tracking-[-0.015em]">
            From the cake table
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="mr-1 text-[12.5px] font-extrabold tabular-nums text-[var(--ink-mute)]">
            {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <button onClick={() => setIsPlaying((p) => !p)} aria-label={isPlaying ? "Pause carousel" : "Play carousel autoplay"} className={ctrl}>
            {isPlaying ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
          </button>
          <button onClick={prev} aria-label="Previous celebration story" className={ctrl}>
            <ChevronLeft size={17} />
          </button>
          <button onClick={next} aria-label="Next celebration story" className={ctrl}>
            <ChevronRight size={17} />
          </button>
        </div>
      </div>

      <div className="grid items-center gap-7 lg:grid-cols-[1fr_1.15fr]">
        <div className="relative">
          <div className="visual-tile aspect-[1.1]">
            <img
              key={slide.id}
              src={slide.image}
              alt={slide.title}
              className="h-full w-full object-cover transition-opacity duration-500 animate-[fadeUp_300ms_cubic-bezier(0.16,1,0.3,1)]"
            />
          </div>
          <p className="absolute left-4 top-4 rounded-full bg-white/90 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.1em] text-[var(--ink)] backdrop-blur-sm">
            {slide.occasion}
          </p>
          <button
            onClick={() => toggle(favKey, slide.title)}
            aria-label="Save this look"
            className={`absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full transition-colors ${
              isFav ? "bg-[var(--terra)] text-white" : "bg-white/90 text-[var(--ink-soft)] hover:bg-white hover:text-[var(--terra)]"
            }`}
          >
            <Heart size={15} className={isFav ? "fill-white" : ""} />
          </button>
        </div>

        <div key={`content-${slide.id}`} className="space-y-4 animate-[fadeUp_300ms_cubic-bezier(0.16,1,0.3,1)]">
          <div className="flex flex-wrap items-center gap-2 text-[12px] font-extrabold uppercase tracking-[0.12em] text-[var(--terra)]">
            <span>{slide.host}</span>
            <span className="h-1 w-1 rounded-full bg-[var(--hairline)]" />
            <span className="text-[var(--ink-mute)]">{slide.date}</span>
          </div>

          <h4 className="font-display text-[31px] sm:text-[37px] font-semibold leading-none tracking-[-0.015em]">
            {slide.title}
          </h4>

          <div className="space-y-1.5 border-y border-[oklch(0.9_0.022_65)] py-3.5 text-[13px]">
            <p className="flex gap-2">
              <span className="shrink-0 text-[10.5px] font-extrabold uppercase tracking-[0.12em] leading-5 text-[var(--ink-mute)]">Flavor</span>
              <span className="font-bold leading-5 text-[var(--ink)]">{slide.flavor}</span>
            </p>
            <p className="flex gap-2">
              <span className="shrink-0 text-[10.5px] font-extrabold uppercase tracking-[0.12em] leading-5 text-[var(--ink-mute)]">Scale</span>
              <span className="font-bold leading-5 text-[var(--ink)]">{slide.serves}</span>
            </p>
          </div>

          <figure>
            <Quote size={20} strokeWidth={2} className="rotate-180 text-[var(--terra)] opacity-70" aria-hidden />
            <blockquote className="mt-2 font-display text-[18px] italic leading-relaxed text-[var(--ink-soft)]">
              {slide.quote}
            </blockquote>
          </figure>

          <div className="flex flex-wrap gap-3 pt-1">
            <Link href="/custom-order" className="button-rose min-h-[46px] px-5">
              Recreate this <ArrowUpRight size={14} strokeWidth={2.4} />
            </Link>
            <Link href="/gallery" className="button-ink min-h-[46px] px-5">
              See all in gallery
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-9 flex items-center justify-center gap-2">
        {slides.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to slide ${idx + 1}: ${s.title}`}
            className={`h-2 rounded-full transition-all ${
              current === idx ? "w-8 bg-[var(--terra)]" : "w-2 bg-[oklch(0.86_0.03_60)] hover:bg-[oklch(0.76_0.05_50)]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
