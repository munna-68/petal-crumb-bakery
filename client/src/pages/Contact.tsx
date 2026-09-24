/** Garden Bakery: contact + FAQ — rounded form, pastel chips, blush FAQ. Connected to useBakeryStore inquiries. */
import { useState, useRef } from "react";
import {
  Mail,
  MapPin,
  Send,
  Clock3,
  ShieldCheck,
  ChevronDown,
  Phone,
  Navigation,
  Copy,
  ExternalLink,
  Check,
  Sparkles,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { faqItems } from "@/lib/bakeryData";
import { MapView, type MapHandle } from "@/components/Map";
import { ScriptNote, HeartDoodle, LeafSprig } from "@/components/decor";
import { useBakeryStore, type StudioInquiry } from "@/lib/bakeryStore";

export default function Contact() {
  const [open, setOpen] = useState<number | null>(0);
  const mapRef = useRef<MapHandle | null>(null);
  const { addInquiry } = useBakeryStore();
  const [submittedInquiry, setSubmittedInquiry] = useState<StudioInquiry | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const occasion = String(fd.get("occasion") || "").trim();
    const date = String(fd.get("date") || "").trim();
    const detail = String(fd.get("detail") || "").trim();

    if (!name || !email || !detail) {
      toast.error("Please fill the required fields", { description: "Name, email and details are needed." });
      return;
    }

    const inq = addInquiry({
      name,
      email,
      occasion: occasion || "Studio Celebration Inquiry",
      preferredDate: date || undefined,
      detail,
      status: "new",
    });

    setSubmittedInquiry(inq);
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText("417 SE 8th Ave, Portland, OR 97214");
      toast.success("Address copied", { description: "417 SE 8th Ave, Portland, OR 97214" });
    } catch {
      toast("Address", { description: "417 SE 8th Ave, Portland, OR 97214" });
    }
  };

  const chip = "grid h-10 w-10 shrink-0 place-items-center rounded-xl";

  return (
    <div className="min-h-screen bg-[var(--cream)] text-[var(--ink)]">
      <SiteHeader />
      <main id="main">
        <section className="container py-12 sm:py-16">
          <div className="grid gap-12 lg:grid-cols-[0.88fr_1.12fr]">
            <div>
              <div className="relative">
                <HeartDoodle className="absolute -top-8 right-4 hidden h-12 w-12 rotate-12 text-[var(--terra)] opacity-50 sm:block" aria-hidden />
                <p className="eyebrow">Questions, dates, sweet ideas</p>
                <h1 className="display-title mt-4 text-[50px] leading-[0.98] sm:text-[66px] lg:text-[78px]">
                  Let’s say
                  <br />
                  <em>hello.</em>
                </h1>
              </div>
              <p className="prose-measure mt-5 max-w-[36ch] text-[15px] leading-7 text-[var(--ink-soft)]">
                For a celebration that needs some extra thought, tell us a little about it. For custom cake pricing, the order studio is the quickest first step.
              </p>

              <div className="mt-9 space-y-4">
                <a
                  href="mailto:hello@petalandcrumb.com"
                  className="flex items-center gap-4 text-[14.5px] font-extrabold text-[var(--ink)] transition-colors hover:text-[var(--terra)]"
                >
                  <span className={`${chip} bg-[var(--blush)] text-[var(--terra)]`}>
                    <Mail size={16} strokeWidth={2} />
                  </span>
                  hello@petalandcrumb.com
                </a>
                <button
                  onClick={() => toast.success("Phone — demo", { description: "In a live bakery this would dial the studio. For the portfolio, please email — we reply within a day." })}
                  className="flex items-center gap-4 text-left text-[14.5px] font-extrabold text-[var(--ink)] transition-colors hover:text-[var(--terra)]"
                >
                  <span className={`${chip} bg-[var(--sage-soft)] text-[var(--sage-deep)]`}>
                    <Phone size={16} strokeWidth={2} />
                  </span>
                  (503) 555-0148 <span className="font-semibold text-[var(--ink-mute)]">· demo number</span>
                </button>
                <p className="flex items-center gap-4 text-[14.5px] font-extrabold text-[var(--ink)]">
                  <span className={`${chip} bg-[var(--butter-soft)] text-[var(--butter-deep)]`}>
                    <MapPin size={16} strokeWidth={2} />
                  </span>
                  417 SE 8th Ave, Portland, OR 97214
                </p>
                <p className="flex items-center gap-4 text-[13.5px] font-semibold text-[var(--ink-mute)]">
                  <span className={`${chip} bg-[var(--paper)] text-[var(--terra)]`}>
                    <Clock3 size={15} strokeWidth={2} />
                  </span>
                  Studio hours · Tue–Sat 10a–5p · replies within 24 hours
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button onClick={copyAddress} className="button-ink px-4 py-2.5 text-[12.5px]">
                    <Copy size={13} /> Copy address
                  </button>
                  <a
                    href="https://maps.google.com/?q=417+SE+8th+Ave+Portland+OR+97214"
                    target="_blank"
                    rel="noreferrer"
                    className="button-ink px-4 py-2.5 text-[12.5px]"
                  >
                    <Navigation size={13} /> Open in Maps <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              <div className="mt-7">
                <span className="inline-flex items-center gap-2 rounded-full bg-[var(--paper)] px-4 py-2 text-[12.5px] font-extrabold text-[var(--ink-soft)]">
                  <ShieldCheck size={14} className="text-[var(--sage-deep)]" /> Cottage kitchen · allergies noted
                </span>
              </div>
            </div>

            <div className="rounded-[2rem] bg-[var(--paper)] p-6 shadow-[0_24px_70px_oklch(0.305_0.033_42/0.07)] sm:p-9">
              {submittedInquiry ? (
                /* Inquiry Confirmation Card */
                <div className="py-4 text-center animate-[fadeUp_240ms_cubic-bezier(0.16,1,0.3,1)]">
                  <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[var(--blush)] text-[var(--terra)]">
                    <Check size={32} strokeWidth={2.4} />
                  </span>
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--blush)] px-4 py-1 text-[var(--terra)] font-mono text-[13px] font-bold">
                    <Sparkles size={14} />
                    <span>Inquiry Logged · {submittedInquiry.inquiryNumber}</span>
                  </div>
                  <h2 className="mt-3 font-display text-[32px] sm:text-[38px] font-semibold leading-tight">
                    Thank you, <em>{submittedInquiry.name}</em>!
                  </h2>
                  <p className="mx-auto mt-3 max-w-[44ch] text-[14px] leading-6 text-[var(--ink-soft)]">
                    Your inquiry has been placed into Maya’s studio inbox. We review all consultation inquiries personally and will respond to <strong>{submittedInquiry.email}</strong> within <strong>24 business hours</strong>.
                  </p>

                  <div className="mt-6 rounded-2xl bg-[var(--cream)] p-5 text-left border border-[oklch(0.9_0.022_65)] space-y-2.5 text-[13px]">
                    <div className="flex justify-between items-baseline">
                      <span className="font-extrabold uppercase text-[10.5px] tracking-wider text-[var(--terra)]">Inquiry details</span>
                      <span className="font-mono text-[12px] text-[var(--ink-mute)]">{submittedInquiry.inquiryNumber}</span>
                    </div>
                    <div>
                      <span className="font-bold text-[var(--ink)]">Occasion:</span> {submittedInquiry.occasion}
                    </div>
                    {submittedInquiry.preferredDate && (
                      <div>
                        <span className="font-bold text-[var(--ink)]">Preferred Date:</span> {submittedInquiry.preferredDate}
                      </div>
                    )}
                    <div>
                      <span className="font-bold text-[var(--ink)]">Note:</span> {submittedInquiry.detail}
                    </div>
                  </div>

                  <div className="mt-7 flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => setSubmittedInquiry(null)}
                      className="button-ink flex-1 justify-center py-3.5 text-[12.5px] gap-2"
                    >
                      <RotateCcw size={14} /> Send another note
                    </button>
                    <Link
                      href="/custom-order"
                      className="button-rose flex-1 justify-center py-3.5 text-[12.5px] gap-2"
                    >
                      Order studio <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ) : (
                /* Inquiry Form */
                <form
                  onSubmit={handleSubmit}
                  noValidate
                >
                  <p className="eyebrow">Studio inquiry</p>
                  <p className="mt-2 text-[13px] leading-5 text-[var(--ink-mute)]">Share a little detail — we’ll respond within a day. For the fastest quote, use the studio.</p>

                  <div className="mt-7 grid gap-5 sm:grid-cols-2">
                    <label className="block text-[12px] font-extrabold uppercase tracking-[0.08em] text-[var(--ink-soft)]">
                      Your name <span className="text-[var(--terra)]">*</span>
                      <input required name="name" autoComplete="name" className="field-base mt-2" placeholder="Your name" />
                    </label>
                    <label className="block text-[12px] font-extrabold uppercase tracking-[0.08em] text-[var(--ink-soft)]">
                      Email <span className="text-[var(--terra)]">*</span>
                      <input required type="email" name="email" autoComplete="email" className="field-base mt-2" placeholder="you@example.com" />
                    </label>
                    <label className="block text-[12px] font-extrabold uppercase tracking-[0.08em] text-[var(--ink-soft)]">
                      Occasion
                      <select name="occasion" className="field-base mt-2" defaultValue="">
                        <option value="" disabled>Select one</option>
                        <option>Birthday</option>
                        <option>Wedding</option>
                        <option>Shower</option>
                        <option>Corporate Gathering</option>
                        <option>Just because</option>
                      </select>
                    </label>
                    <label className="block text-[12px] font-extrabold uppercase tracking-[0.08em] text-[var(--ink-soft)]">
                      Preferred date
                      <input name="date" type="date" className="field-base mt-2" />
                    </label>
                    <label className="block text-[12px] font-extrabold uppercase tracking-[0.08em] text-[var(--ink-soft)] sm:col-span-2">
                      A little more detail <span className="text-[var(--terra)]">*</span>
                      <textarea required name="detail" className="field-base mt-2 min-h-[120px] resize-y" placeholder="Tell us about your idea — guest count, flavors you love, colors, date…" rows={4} />
                    </label>
                  </div>

                  <button className="button-rose mt-7 w-full justify-center sm:w-auto sm:px-8" type="submit">
                    Send a note <Send size={15} strokeWidth={2.1} />
                  </button>
                  <p className="mt-4 text-[12px] leading-5 text-[var(--ink-mute)]">
                    For the fastest price and availability check, please use{" "}
                    <Link href="/custom-order" className="link-underline font-extrabold text-[var(--terra)]">
                      the custom order studio
                    </Link>
                    .
                  </p>
                  <p className="mt-3 text-right"><ScriptNote className="text-[18px] text-[var(--ink-mute)]">we read every note</ScriptNote></p>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* Map — Portland studio */}
        <section className="container pb-12 sm:pb-16">
          <div className="rounded-[2rem] bg-[var(--paper)] p-3 shadow-[0_20px_60px_oklch(0.305_0.033_42/0.07)] sm:p-4">
            <div className="grid gap-3 lg:grid-cols-[380px_1fr]">
              <div className="rounded-[1.5rem] bg-[var(--cream)] p-6 sm:p-7">
                <p className="eyebrow">Find the studio</p>
                <h3 className="mt-2 font-display text-[23px] font-semibold leading-tight tracking-[-0.01em]">Pickup in SE Portland</h3>
                <p className="mt-2.5 text-[13.5px] leading-5 text-[var(--ink-mute)]">We’re a home studio near the Hawthorne District — pickup is smooth, parking is easy, and we’ll text you when the cake is boxed.</p>
                <div className="mt-5 space-y-2.5 text-[13px] leading-5 text-[var(--ink-soft)]">
                  <p className="flex gap-2.5"><MapPin size={15} className="mt-0.5 shrink-0 text-[var(--terra)]" /> 417 SE 8th Ave, Portland, OR 97214</p>
                  <p className="flex gap-2.5"><Clock3 size={15} className="mt-0.5 shrink-0 text-[var(--terra)]" /> Tue–Sat 10a–5p — pickup windows confirmed by email</p>
                  <p className="flex gap-2.5"><Mail size={15} className="mt-0.5 shrink-0 text-[var(--terra)]" /> hello@petalandcrumb.com</p>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      if (mapRef.current) {
                        mapRef.current.reset();
                      }
                    }}
                    className="button-rose px-5 py-3 text-[12.5px]"
                  >
                    <Navigation size={14} /> Center studio
                  </button>
                  <button onClick={copyAddress} className="button-ink px-4 py-3 text-[12.5px]">
                    <Copy size={14} /> Copy
                  </button>
                </div>
                <p className="mt-4 text-[12px] leading-4 text-[var(--ink-mute)]">Delivery within our Portland zone is $18 flat — calculated in the studio.</p>
              </div>
              <div className="relative min-h-[320px] overflow-hidden rounded-[1.5rem] bg-[var(--cream)]">
                <MapView
                  ref={mapRef}
                  className="h-[440px] min-h-[320px] w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ — blush */}
        <section className="container pb-16">
          <div className="rounded-[2.25rem] bg-[var(--blush)] px-5 py-12 sm:px-9 sm:py-16">
            <div className="mx-auto grid max-w-[1180px] gap-10 lg:grid-cols-[0.72fr_1.28fr]">
              <div>
                <p className="eyebrow">Before you order</p>
                <h2 className="display-title mt-3 text-[40px] leading-[1] sm:text-[52px]">
                  Helpful
                  <br />
                  <em>answers.</em>
                </h2>
                <p className="prose-measure mt-4 max-w-[30ch] text-[14.5px] leading-6 text-[oklch(0.4_0.035_35)]">A few practical notes before we make something lovely together.</p>
                <div className="mt-7 hidden rounded-2xl bg-white/60 p-5 lg:block">
                  <p className="text-[11.5px] font-extrabold uppercase tracking-[0.12em] text-[oklch(0.42_0.045_30)]">Quick links</p>
                  <div className="mt-3 flex flex-col gap-2 text-[13.5px] font-extrabold">
                    <Link href="/menu" className="link-underline w-fit text-[oklch(0.45_0.08_20)]">See the menu</Link>
                    <Link href="/custom-order" className="link-underline w-fit text-[oklch(0.45_0.08_20)]">Try the live quote</Link>
                  </div>
                  <LeafSprig className="mt-5 h-10 w-10 rotate-[160deg] text-[var(--sage-deep)] opacity-40" aria-hidden />
                </div>
              </div>

              <div className="space-y-3">
                {faqItems.map((item, index) => {
                  const isOpen = open === index;
                  return (
                    <div key={item.question} className="rounded-2xl bg-white/60 backdrop-blur-sm transition-colors hover:bg-white/80">
                      <button
                        type="button"
                        onClick={() => setOpen(isOpen ? null : index)}
                        aria-expanded={isOpen}
                        className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left sm:px-6"
                      >
                        <span className="font-display text-[19px] font-semibold leading-6 sm:text-[21px]">{item.question}</span>
                        <span
                          className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition-all duration-200 ${isOpen ? "rotate-180 bg-[var(--terra)] text-white" : "bg-white text-[var(--terra)]"}`}
                          aria-hidden
                        >
                          <ChevronDown size={15} strokeWidth={2.2} />
                        </span>
                      </button>
                      <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                        <div className="overflow-hidden">
                          <p className="max-w-[60ch] px-5 pb-5 text-[14px] leading-6 text-[oklch(0.4_0.035_35)] sm:px-6">{item.answer}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="container pb-10 sm:pb-14">
          <p className="mx-auto max-w-3xl text-center text-[12px] font-semibold leading-5 text-[var(--ink-mute)] text-balance">
            Petal &amp; Crumb is a home-based cottage food business. Products are made in a kitchen that also handles wheat, dairy, eggs, soy, and tree nuts. Please share all dietary needs before reserving your date — we’ll follow up if we need more detail.
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
