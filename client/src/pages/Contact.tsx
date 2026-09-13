/** Quiet Patisserie Editorial: contact + FAQ — clear, helpful, no fabricated social proof. */
import { useState } from "react";
import { Mail, MapPin, Send, Clock3, ShieldCheck, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { faqItems } from "@/lib/bakeryData";

export default function Contact() {
  const [open, setOpen] = useState<number | null>(0);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Your note is ready for the studio.", {
      description: "This demo form does not send an email yet — in production it would email and create a draft order.",
    });
    (e.currentTarget as HTMLFormElement).reset();
  };

  return (
    <div className="min-h-screen bg-[oklch(0.982_0.008_75)] text-[var(--ink)]">
      <SiteHeader />
      <main id="main">
        <section className="container py-10 sm:py-14 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:gap-12">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-7 bg-[var(--rosewood)]" aria-hidden />
                <p className="eyebrow">Questions, dates, sweet ideas</p>
              </div>
              <h1 className="display-title mt-4 text-[48px] leading-[0.92] sm:text-[64px] lg:text-[78px]">
                Let’s say
                <br />
                <em>hello.</em>
              </h1>
              <p className="prose-measure mt-5 max-w-[36ch] text-[14px] leading-6 text-[oklch(0.44_0.02_35)] sm:text-[15px] sm:leading-7">
                For a celebration that needs some extra thought, tell us a little about it. For custom cake pricing, the order studio is the quickest first step.
              </p>

              <div className="mt-8 space-y-3 border-t border-[oklch(0.88_0.018_52)] pt-6">
                <a
                  href="mailto:hello@petalandcrumb.com"
                  className="flex items-center gap-3 rounded-[2px] py-1 text-[14px] font-medium text-[oklch(0.28_0.02_35)] underline decoration-[var(--rosewood)]/30 underline-offset-4 hover:decoration-[var(--rosewood)] focus-visible:outline-offset-4"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-full border border-[oklch(0.86_0.02_52)] bg-white text-[var(--rosewood)]">
                    <Mail size={14} strokeWidth={1.9} />
                  </span>
                  hello@petalandcrumb.com
                </a>
                <p className="flex items-center gap-3 text-[14px] leading-6 text-[oklch(0.36_0.02_35)]">
                  <span className="grid h-8 w-8 place-items-center rounded-full border border-[oklch(0.86_0.02_52)] bg-white text-[var(--rosewood)]">
                    <MapPin size={14} strokeWidth={1.9} />
                  </span>
                  Portland, Oregon · pickup + local delivery
                </p>
                <p className="flex items-center gap-3 text-[13px] leading-5 text-[oklch(0.52_0.02_35)]">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-[oklch(0.94_0.03_13)] text-[var(--rosewood)]">
                    <Clock3 size={13} strokeWidth={1.9} />
                  </span>
                  Studio hours · Tue–Sat 10a–5p · replies within a day
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-2 text-[11px]">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[oklch(0.86_0.02_52)] bg-white px-3 py-1.5 font-medium">
                  <ShieldCheck size={12} className="text-[var(--rosewood)]" /> Cottage kitchen · allergies noted
                </span>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="border border-[oklch(0.86_0.02_52)] bg-white p-5 shadow-[0_18px_50px_oklch(0.25_0.018_35/0.06)] sm:p-7 lg:p-8"
              noValidate
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--rosewood)]">Studio inquiry</p>
              <p className="mt-1 text-[12px] leading-5 text-[oklch(0.52_0.02_35)]">Share a little detail — we’ll respond within a day. For the fastest quote, use the studio.</p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="block text-[11px] font-semibold uppercase tracking-[0.06em] text-[oklch(0.34_0.02_35)]">
                  Your name <span className="text-[var(--rosewood)]">*</span>
                  <input required name="name" autoComplete="name" className="field-base mt-2" placeholder="Your name" />
                </label>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.06em] text-[oklch(0.34_0.02_35)]">
                  Email <span className="text-[var(--rosewood)]">*</span>
                  <input required type="email" name="email" autoComplete="email" className="field-base mt-2" placeholder="you@example.com" />
                </label>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.06em] text-[oklch(0.34_0.02_35)] sm:col-span-2">
                  What are you celebrating?
                  <input name="occasion" className="field-base mt-2" placeholder="A birthday, a shower, a Tuesday…" />
                </label>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.06em] text-[oklch(0.34_0.02_35)] sm:col-span-2">
                  A little more detail <span className="text-[var(--rosewood)]">*</span>
                  <textarea required name="detail" className="field-base mt-2 min-h-[120px] resize-y" placeholder="Tell us about your idea — guest count, flavors you love, colors, date…" rows={4} />
                </label>
              </div>

              <button className="button-rose mt-6 w-full justify-center py-4 text-[11px] sm:w-auto sm:px-6" type="submit">
                Send a note <Send size={14} strokeWidth={2.1} />
              </button>
              <p className="mt-3 text-[11px] leading-5 text-[oklch(0.58_0.03_18)]">
                For the fastest price and availability check, please use{" "}
                <a href="/petal-crumb-bakery/custom-order" className="underline decoration-[var(--rosewood)]/30 underline-offset-4 hover:decoration-[var(--rosewood)]">
                  the custom order studio
                </a>
                .
              </p>
            </form>
          </div>
        </section>

        <section className="border-y border-[oklch(0.86_0.02_52)] bg-[oklch(0.93_0.04_13)] px-5 py-12 sm:px-8 sm:py-16 lg:py-20">
          <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-10">
            <div>
              <p className="eyebrow">Before you order</p>
              <h2 className="display-title mt-3 text-[40px] leading-[0.92] sm:text-[52px] lg:text-[58px]">
                Helpful
                <br />
                <em>answers.</em>
              </h2>
              <p className="prose-measure mt-4 max-w-[30ch] text-[14px] leading-6 text-[oklch(0.44_0.02_35)]">A few practical notes before we make something lovely together.</p>
              <div className="mt-6 hidden border border-[oklch(0.84_0.06_18/0.35)] bg-white/55 p-4 backdrop-blur-sm lg:block">
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[oklch(0.42_0.02_35)]">Quick links</p>
                <div className="mt-2 flex flex-col gap-1.5 text-[13px]">
                  <a href="/petal-crumb-bakery/menu" className="underline decoration-[var(--rosewood)]/20 underline-offset-4 hover:decoration-[var(--rosewood)]">See the menu</a>
                  <a href="/petal-crumb-bakery/custom-order" className="underline decoration-[var(--rosewood)]/20 underline-offset-4 hover:decoration-[var(--rosewood)]">Try the live quote</a>
                </div>
              </div>
            </div>

            <div className="divide-y divide-[oklch(0.84_0.06_18/0.35)] border-y border-[oklch(0.84_0.06_18/0.35)] bg-white/70 backdrop-blur-sm">
              {faqItems.map((item, index) => {
                const isOpen = open === index;
                return (
                  <div key={item.question} className="bg-white/0 transition-colors hover:bg-white/40">
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left sm:px-6"
                    >
                      <span className="font-display text-[18px] font-medium leading-6 tracking-[-0.01em] sm:text-[20px]">{item.question}</span>
                      <span
                        className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border text-[var(--rosewood)] transition-all duration-200 ${isOpen ? "rotate-180 border-[var(--rosewood)] bg-[var(--rosewood)] text-white" : "border-[oklch(0.86_0.02_52)] bg-white"}`}
                        aria-hidden
                      >
                        <ChevronDown size={14} strokeWidth={2.1} />
                      </span>
                    </button>
                    <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                      <div className="overflow-hidden">
                        <p className="max-w-[60ch] px-5 pb-5 text-[13.5px] leading-6 text-[oklch(0.42_0.02_35)] sm:px-6">{item.answer}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="container py-8 sm:py-10">
          <p className="mx-auto max-w-3xl text-center text-[11px] leading-5 text-[oklch(0.58_0.03_18)] text-balance">
            Petal &amp; Crumb is a home-based cottage food business. Products are made in a kitchen that also handles wheat, dairy, eggs, soy, and tree nuts. Please share all dietary needs before reserving your date — we’ll follow up if we need more detail.
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
