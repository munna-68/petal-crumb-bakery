import { withBase } from "@/lib/withBase";
/**
 * Quiet Patisserie Editorial: a photo-first, asymmetric landing page that
 * turns the reference image's magazine-like rhythm into a responsive web flow.
 */
import { ArrowRight, ArrowUpRight, CalendarDays, Check, Clock3, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { galleryItems } from "@/lib/bakeryData";

const heroCake = withBase("/images/photo-1578985545062-69928b1d9587.jpg");

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#fbf9f4] text-[#342b29]">
      <SiteHeader />
      <main>
        <section className="container pt-5 sm:pt-8">
          <div className="relative grid min-h-[510px] overflow-hidden bg-[#f1efec] lg:min-h-[610px] lg:grid-cols-[1.04fr_.96fr]">
            <div className="relative min-h-[330px] overflow-hidden lg:order-2 lg:min-h-full">
              <img src={heroCake} alt="Floral celebration cake" className="h-full w-full object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#f1efec]/20 via-transparent to-transparent lg:bg-gradient-to-l" />
              <p className="absolute bottom-4 right-4 border border-white/60 bg-white/70 px-3 py-2 text-[9px] font-semibold uppercase tracking-[.16em] text-[#594947] backdrop-blur-sm">Garden cake · vanilla bean</p>
            </div>
            <div className="relative flex flex-col justify-between px-7 py-10 sm:px-12 sm:py-14 lg:order-1 lg:px-16">
              <div className="fade-up">
                <p className="eyebrow">Custom cakes · Portland, Oregon</p>
                <h1 className="display-title mt-5 max-w-[560px] text-[64px] sm:text-[82px] lg:text-[94px]">A little more<br /><em className="font-normal">meaning</em> on<br />the table.</h1>
                <p className="mt-7 max-w-md text-sm leading-6 text-[#5f514d] sm:text-[15px]">Celebration cakes, gathered from seasonal flavor, textured buttercream, and a little garden magic.</p>
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Link href="/custom-order" className="button-rose px-5 py-4">Build your cake <ArrowUpRight size={14} /></Link>
                <Link href="/menu" className="button-ink px-5 py-4">See the menu <ArrowRight size={14} /></Link>
              </div>
              <div className="absolute bottom-0 left-0 hidden h-1/3 w-1.5 bg-[#a8515a] lg:block" />
            </div>
          </div>
        </section>

        <section className="container py-14 sm:py-20">
          <div className="grid gap-3 lg:grid-cols-[1.08fr_.92fr]">
            <div className="paper-texture bg-[#f3e2e3] px-7 py-11 sm:px-12 sm:py-16">
              <p className="eyebrow">Made in small, lovely batches</p>
              <h2 className="display-title mt-5 max-w-xl text-[47px] sm:text-[58px]">Cakes, handcrafted<br />with <em className="font-normal">feeling.</em></h2>
              <p className="mt-6 max-w-md text-sm leading-6 text-[#64504d]">From a citrusy birthday layer cake to a wedding centerpiece covered in garden blooms, every detail is shaped around the people at your table.</p>
              <Link href="/about" className="mt-8 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.16em] text-[#8f4149] underline underline-offset-4">Meet the baker <ArrowRight size={14} /></Link>
            </div>
            <div className="visual-tile min-h-[330px] sm:min-h-[410px]">
              <img src={withBase("/images/photo-1602351447937-745cb720612f.jpg")} alt="A simply frosted cake on a plate" />
            </div>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <Link href="/menu" className="group relative min-h-[250px] overflow-hidden bg-[#f0eeeb]">
              <img className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]" src={withBase("/images/photo-1535254973040-607b474cb50d.jpg")} alt="Single tier celebration cake" />
              <span className="absolute bottom-4 left-4 bg-[#fbf9f4] px-3 py-2 text-[9px] font-bold uppercase tracking-[.13em] text-[#443633]">Shop the menu</span>
            </Link>
            <Link href="/about" className="group relative min-h-[250px] overflow-hidden bg-[#f0eeeb]">
              <img className="h-full w-full object-cover object-[55%_center] transition duration-500 group-hover:scale-[1.035]" src={withBase("/images/photo-1556910103-1c02745aae4d.jpg")} alt="Baker preparing a cake" />
              <span className="absolute bottom-4 left-4 bg-[#fbf9f4] px-3 py-2 text-[9px] font-bold uppercase tracking-[.13em] text-[#443633]">From the studio</span>
            </Link>
            <Link href="/custom-order" className="group relative min-h-[250px] overflow-hidden bg-[#f0eeeb]">
              <img className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]" src={withBase("/images/photo-1559620192-032c4bc4674e.jpg")} alt="Pink buttercream cake" />
              <span className="absolute bottom-4 left-4 bg-[#fbf9f4] px-3 py-2 text-[9px] font-bold uppercase tracking-[.13em] text-[#443633]">Custom order</span>
            </Link>
          </div>
        </section>

        <section className="border-y border-[#e7dad3] bg-[#f8f5f0] py-16 sm:py-24">
          <div className="container grid gap-12 lg:grid-cols-[.78fr_1.22fr] lg:items-center">
            <div>
              <p className="eyebrow">Less back-and-forth, more buttercream</p>
              <h2 className="display-title mt-5 text-[52px] sm:text-[66px]">Meet the<br /><em className="font-normal">order studio.</em></h2>
              <p className="mt-6 max-w-sm text-sm leading-6 text-[#655653]">Pick your cake, see the price change as you go, and choose a date that actually works. Clear from first crumb to final pickup.</p>
              <Link href="/custom-order" className="button-rose mt-8 px-5 py-4">Try the live quote <ArrowUpRight size={14} /></Link>
            </div>
            <div className="relative border border-[#ddcec7] bg-[#fffdf9] p-5 shadow-[0_22px_60px_rgba(79,54,45,.08)] sm:p-7">
              <div className="flex items-center justify-between border-b border-[#eaded8] pb-4">
                <div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#a8515a]">Custom cake</p><p className="mt-1 font-display text-2xl">Your celebration, taking shape</p></div>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-[#f4dedf] text-[#9f4c54]"><Sparkles size={17} /></span>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="border border-[#ebded8] p-4"><p className="text-[9px] font-bold uppercase tracking-[.14em] text-[#8f7770]">1. Choose the details</p><p className="mt-3 text-sm font-medium">Flavor, finish, and servings</p></div>
                <div className="border border-[#ebded8] p-4"><p className="text-[9px] font-bold uppercase tracking-[.14em] text-[#8f7770]">2. Find your date</p><p className="mt-3 text-sm font-medium">Only open kitchen days appear</p></div>
                <div className="border border-[#ebded8] p-4"><p className="text-[9px] font-bold uppercase tracking-[.14em] text-[#8f7770]">3. See the quote</p><p className="mt-3 text-sm font-medium">A clear, live itemized total</p></div>
                <div className="border border-[#ebded8] p-4"><p className="text-[9px] font-bold uppercase tracking-[.14em] text-[#8f7770]">4. Reserve your spot</p><p className="mt-3 text-sm font-medium">Your 50% deposit, explained</p></div>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#eaded8] pt-4"><span className="inline-flex items-center gap-2 text-xs text-[#62534e]"><CalendarDays size={16} className="text-[#a8515a]" /> Smart availability calendar</span><span className="inline-flex items-center gap-2 text-xs text-[#62534e]"><Clock3 size={16} className="text-[#a8515a]" /> Rush option if possible</span></div>
            </div>
          </div>
        </section>

        <section className="container py-16 sm:py-24">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div><p className="eyebrow">A few from the cake table</p><h2 className="display-title mt-4 text-[50px] sm:text-[62px]">The collection</h2></div>
            <Link href="/gallery" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.16em] text-[#8f4149]">See every sweet thing <ArrowRight size={14} /></Link>
          </div>
          <div className="mt-9 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {galleryItems.map((item) => <div key={item.id} className="visual-tile aspect-[.85]"><img src={item.image} alt={item.alt} /></div>)}
          </div>
        </section>

        <section className="bg-[#f1e0e1] px-5 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">The next thing to celebrate</p>
            <h2 className="display-title mt-5 text-[55px] sm:text-[73px]">Let’s make it<br /><em className="font-normal">delicious.</em></h2>
            <p className="mx-auto mt-6 max-w-md text-sm leading-6 text-[#614c49]">Build a first quote in a few considered steps. We’ll take care of the beautiful details together.</p>
            <Link href="/custom-order" className="button-rose mt-8 px-6 py-4">Start a custom order <ArrowUpRight size={14} /></Link>
            <p className="mt-5 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.12em] text-[#795b58]"><Check size={14} /> Free to explore · no payment yet</p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
