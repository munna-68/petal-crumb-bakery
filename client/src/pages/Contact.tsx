/** Quiet Patisserie Editorial: contact + FAQ — now with working map, corrected routing, and richer demo interactions. */
import { useState, useRef } from "react";
import { Mail, MapPin, Send, Clock3, ShieldCheck, ChevronDown, Phone, Navigation, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { faqItems } from "@/lib/bakeryData";
import { MapView } from "@/components/Map";

export default function Contact() {
  const [open, setOpen] = useState<number | null>(0);
  const mapRef = useRef<google.maps.Map | null>(null);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const detail = String(fd.get("detail") || "").trim();
    if (!name || !email || !detail) {
      toast.error("Please fill the required fields", { description: "Name, email and details are needed." });
      return;
    }
    toast.success("Your note is ready for the studio.", {
      description: "This demo form does not send an email yet — in production it would email and create a draft order.",
    });
    (e.currentTarget as HTMLFormElement).reset();
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText("417 SE 8th Ave, Portland, OR 97214");
      toast.success("Address copied", { description: "417 SE 8th Ave, Portland, OR 97214" });
    } catch {
      toast("Address", { description: "417 SE 8th Ave, Portland, OR 97214" });
    }
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
                <button
                  onClick={() => toast.success("Phone — demo", { description: "In a live bakery this would dial the studio. For the portfolio, please email — we reply within a day." })}
                  className="flex items-center gap-3 rounded-[2px] py-1 text-left text-[14px] font-medium text-[oklch(0.28_0.02_35)] hover:text-[var(--rosewood)]"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-full border border-[oklch(0.86_0.02_52)] bg-white text-[var(--rosewood)]">
                    <Phone size={14} strokeWidth={1.9} />
                  </span>
                  (503) 555-0148 · demo number
                </button>
                <p className="flex items-center gap-3 text-[14px] leading-6 text-[oklch(0.36_0.02_35)]">
                  <span className="grid h-8 w-8 place-items-center rounded-full border border-[oklch(0.86_0.02_52)] bg-white text-[var(--rosewood)]">
                    <MapPin size={14} strokeWidth={1.9} />
                  </span>
                  417 SE 8th Ave, Portland, OR 97214
                </p>
                <p className="flex items-center gap-3 text-[13px] leading-5 text-[oklch(0.52_0.02_35)]">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-[oklch(0.94_0.03_13)] text-[var(--rosewood)]">
                    <Clock3 size={13} strokeWidth={1.9} />
                  </span>
                  Studio hours · Tue–Sat 10a–5p · replies within a day
                </p>
                <div className="flex gap-2 pt-2">
                  <button onClick={copyAddress} className="inline-flex items-center gap-1.5 border border-[oklch(0.86_0.02_52)] bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[oklch(0.34_0.02_35)] hover:border-[var(--ink)] hover:text-[var(--ink)]">
                    <Copy size={12} /> Copy address
                  </button>
                  <a
                    href="https://maps.google.com/?q=417+SE+8th+Ave+Portland+OR+97214"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 border border-[oklch(0.86_0.02_52)] bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[oklch(0.34_0.02_35)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
                  >
                    <Navigation size={12} /> Open in Maps <ExternalLink size={11} />
                  </a>
                </div>
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
                <label className="block text-[11px] font-semibold uppercase tracking-[0.06em] text-[oklch(0.34_0.02_35)]">
                  Occasion
                  <select name="occasion" className="field-base mt-2" defaultValue="">
                    <option value="" disabled>Select one</option>
                    <option>Birthday</option>
                    <option>Wedding</option>
                    <option>Shower</option>
                    <option>Just because</option>
                  </select>
                </label>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.06em] text-[oklch(0.34_0.02_35)]">
                  Preferred date
                  <input name="date" type="date" className="field-base mt-2" />
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
                <Link href="/custom-order" className="underline decoration-[var(--rosewood)]/30 underline-offset-4 hover:decoration-[var(--rosewood)]">
                  the custom order studio
                </Link>
                .
              </p>
            </form>
          </div>
        </section>

        {/* Map — Portland studio */}
        <section className="container pb-10 sm:pb-14">
          <div className="overflow-hidden border border-[oklch(0.88_0.018_52)] bg-white p-2 sm:p-2.5">
            <div className="grid gap-2 lg:grid-cols-[360px_1fr]">
              <div className="border border-[oklch(0.88_0.018_52)] bg-[oklch(0.97_0.008_72)] p-5 sm:p-6">
                <p className="eyebrow">Find the studio</p>
                <h3 className="mt-2 font-display text-[22px] font-medium leading-none tracking-[-0.02em]">Pickup in SE Portland</h3>
                <p className="mt-2 text-[13px] leading-5 text-[oklch(0.46_0.02_35)]">We’re a home studio near the Hawthorne District — pickup is smooth, parking is easy, and we’ll text you when the cake is boxed.</p>
                <div className="mt-4 space-y-2 text-[12.5px] leading-5 text-[oklch(0.46_0.02_35)]">
                  <p className="flex gap-2"><MapPin size={14} className="mt-0.5 shrink-0 text-[var(--rosewood)]" /> 417 SE 8th Ave, Portland, OR 97214</p>
                  <p className="flex gap-2"><Clock3 size={14} className="mt-0.5 shrink-0 text-[var(--rosewood)]" /> Tue–Sat 10a–5p — pickup windows confirmed by email</p>
                  <p className="flex gap-2"><Mail size={14} className="mt-0.5 shrink-0 text-[var(--rosewood)]" /> hello@petalandcrumb.com</p>
                </div>
                <div className="mt-5 flex gap-2">
                  <button
                    onClick={() => {
                      if (mapRef.current) {
                        mapRef.current.panTo({ lat: 45.5231, lng: -122.6765 });
                        mapRef.current.setZoom(15);
                      }
                      toast("Studio centered", { description: "Map centered on SE Portland · portfolio demo uses Google Maps when available." });
                    }}
                    className="inline-flex items-center gap-1.5 border border-[var(--ink)] bg-[var(--ink)] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.08em] text-white hover:bg-black"
                  >
                    <Navigation size={13} /> Center map
                  </button>
                  <button onClick={copyAddress} className="inline-flex items-center gap-1.5 border border-[oklch(0.86_0.02_52)] bg-white px-3 py-2 text-[11px] font-bold uppercase tracking-[0.08em] text-[oklch(0.34_0.02_35)] hover:border-[var(--ink)] hover:text-[var(--ink)]">
                    <Copy size={13} /> Copy
                  </button>
                </div>
                <p className="mt-3 text-[11px] leading-4 text-[oklch(0.58_0.03_18)]">Delivery within our Portland zone is $18 flat — calculated in the studio.</p>
              </div>
              <div className="relative min-h-[320px] overflow-hidden border border-[oklch(0.88_0.018_52)] bg-[oklch(0.96_0.008_72)]">
                <MapView
                  className="h-[420px] min-h-[320px] w-full"
                  initialCenter={{ lat: 45.5231, lng: -122.6765 }}
                  initialZoom={13}
                  onMapReady={(map) => {
                    mapRef.current = map;
                    // add a marker for the studio
                    // @ts-ignore - advanced marker may not be available in demo, fallback
                    try {
                      // @ts-ignore
                      if (window.google?.maps?.marker?.AdvancedMarkerElement) {
                        // @ts-ignore
                        new window.google.maps.marker.AdvancedMarkerElement({
                          map,
                          position: { lat: 45.5231, lng: -122.6765 },
                          title: "Petal & Crumb Studio",
                        });
                      } else if (window.google?.maps?.Marker) {
                        // @ts-ignore
                        new window.google.maps.Marker({ map, position: { lat: 45.5231, lng: -122.6765 }, title: "Petal & Crumb Studio" });
                      }
                    } catch {}
                  }}
                />
                <div className="pointer-events-none absolute left-3 top-3 border border-black/10 bg-white/85 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[oklch(0.34_0.02_35)] backdrop-blur-md">
                  Portland · SE · Studio pickup
                </div>
              </div>
            </div>
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
                  <Link href="/menu" className="underline decoration-[var(--rosewood)]/20 underline-offset-4 hover:decoration-[var(--rosewood)]">See the menu</Link>
                  <Link href="/custom-order" className="underline decoration-[var(--rosewood)]/20 underline-offset-4 hover:decoration-[var(--rosewood)]">Try the live quote</Link>
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
