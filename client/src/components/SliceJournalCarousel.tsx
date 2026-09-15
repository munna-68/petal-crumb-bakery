import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Play, Pause, ArrowUpRight, Sparkles, Heart } from "lucide-react";
import { Link } from "wouter";
import { useFavorites } from "@/contexts/FavoritesContext";
import { withBase } from "@/lib/withBase";

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
              Celebration Journal &amp; Stories
            </p>
          </div>
          <h3 className="mt-1 font-display text-[26px] sm:text-[32px] font-medium leading-none tracking-[-0.02em]">
            From the Cake Table
          </h3>
        </div>

        {/* Carousel controls */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-[12px] font-semibold tracking-wider text-[oklch(0.48_0.02_35)] mr-2">
            0{current + 1} / 0{total}
          </span>
          <button
            onClick={() => setIsPlaying((p) => !p)}
            aria-label={isPlaying ? "Pause carousel" : "Play carousel autoplay"}
            className="grid h-9 w-9 place-items-center rounded-full border border-[oklch(0.86_0.02_52)] bg-white text-[oklch(0.42_0.02_35)] hover:border-[var(--rosewood)] hover:text-[var(--rosewood)]"
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
          </button>
          <button
            onClick={prev}
            aria-label="Previous celebration story"
            className="grid h-9 w-9 place-items-center rounded-full border border-[oklch(0.86_0.02_52)] bg-white text-[oklch(0.42_0.02_35)] hover:border-[var(--rosewood)] hover:text-[var(--rosewood)]"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={next}
            aria-label="Next celebration story"
            className="grid h-9 w-9 place-items-center rounded-full border border-[oklch(0.86_0.02_52)] bg-white text-[oklch(0.42_0.02_35)] hover:border-[var(--rosewood)] hover:text-[var(--rosewood)]"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Slide Presentation */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.15fr] items-center">
        {/* Slide Photo Tile */}
        <div className="relative overflow-hidden border border-[oklch(0.88_0.018_52)] bg-[oklch(0.96_0.008_72)] p-2">
          <div className="aspect-[1.1] overflow-hidden">
            <img
              key={slide.id}
              src={slide.image}
              alt={slide.title}
              className="h-full w-full object-cover transition-opacity duration-500 animate-[fadeUp_300ms_cubic-bezier(0.16,1,0.3,1)]"
            />
          </div>
          <div className="absolute top-4 left-4 border border-black/15 bg-white/90 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] backdrop-blur-md">
            {slide.occasion}
          </div>
          <button
            onClick={() => toggle(favKey, slide.title)}
            aria-label="Save this look"
            className={`absolute top-4 right-4 grid h-8 w-8 place-items-center rounded-full border backdrop-blur-md transition-colors ${
              isFav ? "border-[var(--rosewood)] bg-[var(--rosewood)] text-white" : "border-white/60 bg-white/80 text-[oklch(0.34_0.02_35)] hover:bg-white hover:text-[var(--rosewood)]"
            }`}
          >
            <Heart size={14} className={isFav ? "fill-white" : ""} />
          </button>
        </div>

        {/* Slide Content */}
        <div key={`content-${slide.id}`} className="space-y-4 animate-[fadeUp_300ms_cubic-bezier(0.16,1,0.3,1)]">
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--rosewood)]">
            <span>{slide.host}</span>
            <span className="h-1 w-1 rounded-full bg-[oklch(0.88_0.018_52)]" />
            <span className="text-[oklch(0.52_0.02_35)]">{slide.date}</span>
          </div>

          <h4 className="font-display text-[30px] sm:text-[36px] font-medium leading-none tracking-[-0.02em]">
            {slide.title}
          </h4>

          <div className="space-y-1.5 border-y border-[oklch(0.91_0.015_52)] py-3 text-[12.5px]">
            <p className="flex gap-2">
              <span className="font-semibold text-[oklch(0.48_0.02_35)] uppercase tracking-wider text-[10px] shrink-0">Flavor:</span>
              <span className="text-[var(--ink)] font-medium">{slide.flavor}</span>
            </p>
            <p className="flex gap-2">
              <span className="font-semibold text-[oklch(0.48_0.02_35)] uppercase tracking-wider text-[10px] shrink-0">Scale:</span>
              <span className="text-[var(--ink)] font-medium">{slide.serves}</span>
            </p>
          </div>

          <blockquote className="font-display italic text-[17px] sm:text-[19px] leading-6 text-[oklch(0.34_0.02_35)] border-l-2 border-[var(--rosewood)] pl-4">
            {slide.quote}
          </blockquote>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/custom-order"
              className="button-rose min-h-[44px] px-5 text-[10px]"
            >
              Recreate This Celebration in Studio <ArrowUpRight size={13} strokeWidth={2.4} />
            </Link>
            <Link
              href="/gallery"
              className="button-ink min-h-[44px] px-5 text-[10px]"
            >
              See All in Gallery
            </Link>
          </div>
        </div>
      </div>

      {/* Dots navigation */}
      <div className="mt-8 flex justify-center items-center gap-2">
        {slides.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to slide ${idx + 1}: ${s.title}`}
            className={`h-2 transition-all rounded-full ${
              current === idx ? "w-8 bg-[var(--rosewood)]" : "w-2 bg-[oklch(0.86_0.02_52)] hover:bg-[oklch(0.72_0.03_18)]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
