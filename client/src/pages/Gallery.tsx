/** Quiet Patisserie Editorial: a relaxed, filterable work gallery with cake imagery in airy masonry-like rows. */
import { useState } from "react";
import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { galleryItems } from "@/lib/bakeryData";

const filters = ["All", "Weddings", "Birthdays", "Little Cakes", "Cookies"] as const;
type Filter = typeof filters[number];

export default function Gallery() {
  const [filter, setFilter] = useState<Filter>("All");
  const visible = filter === "All" ? galleryItems : galleryItems.filter((item) => item.category === filter);
  return <div className="min-h-screen bg-[#fbf9f4] text-[#342b29]"><SiteHeader /><main>
    <section className="container py-14 sm:py-20"><p className="eyebrow">A few favorite tables</p><h1 className="display-title mt-4 text-[68px] sm:text-[92px]">The cake<br /><em className="font-normal">collection.</em></h1><p className="mt-6 max-w-lg text-sm leading-6 text-[#62534e]">Every cake begins with a shared idea and ends somewhere softer, stranger, and more delicious.</p></section>
    <section className="container pb-20"><div className="flex flex-wrap gap-x-5 gap-y-3 border-y border-[#e6d9d2] py-4">{filters.map((item) => <button key={item} type="button" onClick={() => setFilter(item)} className={`text-[10px] font-bold uppercase tracking-[.14em] transition-colors ${filter === item ? "text-[#a8515a] underline decoration-[#a8515a] underline-offset-4" : "text-[#85716b] hover:text-[#403431]"}`}>{item}</button>)}</div><div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{visible.map((item, index) => <article key={item.id} className={`${index % 5 === 0 ? "sm:row-span-2" : ""} group relative overflow-hidden bg-[#f0ede8]`}><div className={`${index % 5 === 0 ? "aspect-[.75]" : "aspect-[1.08]"} visual-tile`}><img src={item.image} alt={item.alt} /></div><div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-between bg-[#fffdf9]/95 px-4 py-3 transition-transform duration-300 group-hover:translate-y-0"><p className="font-display text-xl">{item.title}</p><span className="text-[9px] font-bold uppercase tracking-[.13em] text-[#9d595e]">{item.category}</span></div></article>)}</div></section>
    <section className="bg-[#f1e0e1] px-5 py-16 text-center sm:px-8"><p className="eyebrow">Your celebration belongs here</p><h2 className="display-title mt-4 text-[52px] sm:text-[64px]">Dream it up.</h2><Link href="/custom-order" className="button-rose mt-7 px-5 py-4">Start your cake <ArrowUpRight size={14} /></Link></section>
  </main><SiteFooter /></div>;
}
