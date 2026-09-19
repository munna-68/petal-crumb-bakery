/**
 * Petal & Crumb — site preloader.
 * Exact GSAP timeline from the approved demo: bloom-mark build
 * (text → petals → center → stem/leaf), hold, pop, curtain lift.
 * Visuals use site tokens/fonts (cream/ink/terra/sage/butter, Vollkorn);
 * animation code is a 1:1 copy of the demo timeline. No hero changes.
 *
 * The curtain wears a deeper biscuit tint (not page cream) so the
 * slide-up reveal reads against the page behind it.
 */
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const html = document.documentElement;
    const body = document.body;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    html.classList.add("is-loading");
    const prevOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    if (prefersReduced) {
      const t = window.setTimeout(() => {
        html.classList.remove("is-loading");
        body.style.overflow = prevOverflow;
        setVisible(false);
      }, 150);
      return () => {
        window.clearTimeout(t);
        html.classList.remove("is-loading");
        body.style.overflow = prevOverflow;
      };
    }

    const ctx = gsap.context(() => {
      // Initial states — exact copy from demo
      gsap.set(".pl-petal", { scale: 0, svgOrigin: "24 24", opacity: 0 });
      gsap.set(".pl-center, .pl-center-inner", { scale: 0, svgOrigin: "24 24", opacity: 0 });
      gsap.set(".pl-stem", { strokeDasharray: 20, strokeDashoffset: 20, opacity: 0 });
      gsap.set(".pl-leaf", { scale: 0, svgOrigin: "10 40", opacity: 0 });
      gsap.set(".loader-text", { opacity: 0 });

      const tl = gsap.timeline({
        onComplete: () => {
          // Hold scroll + entrances locked until the curtain has fully lifted,
          // then release everything at once — no mid-curtain layout shift.
          html.classList.remove("is-loading");
          root.style.display = "none";
          body.style.overflow = prevOverflow;
          setVisible(false);
        },
      });

      // 1. Preloader animation sequence — exact copy from demo
      tl
        // Fade in text slightly from below
        .to(".loader-text", { opacity: 1, y: -10, duration: 0.8, ease: "power2.out" })
        // Bloom the petals outward in a staggered circle
        .to(
          ".pl-petal",
          {
            scale: 1,
            opacity: 0.92,
            duration: 0.6,
            stagger: 0.08,
            ease: "back.out(1.5)",
          },
          "-=0.4"
        )
        // Pop in the center dots
        .to(".pl-center", { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2)" }, "-=0.3")
        .to(".pl-center-inner", { scale: 1, opacity: 0.55, duration: 0.3, ease: "power2.out" }, "-=0.2")
        // Draw the stem and grow the leaf
        .to(".pl-stem", { strokeDashoffset: 0, opacity: 0.75, duration: 0.5, ease: "power2.out" }, "-=0.2")
        .to(".pl-leaf", { scale: 1, opacity: 0.9, duration: 0.4, ease: "back.out(1.2)" }, "-=0.3")
        // Hold for a moment so the user sees the complete logo
        .to({}, { duration: 0.4 })
        // The "Pop" effect (scale up quickly)
        .to("#preloader-logo, .loader-text", {
          scale: 1.15,
          duration: 0.3,
          ease: "power2.in",
        })
        // The "Pop" out (scale down to nothing)
        .to("#preloader-logo, .loader-text", {
          scale: 0,
          opacity: 0,
          duration: 0.4,
          ease: "back.in(1.5)",
        })
        // The "Curtain Reveal" (slide the entire preloader background UP).
        // NOTE: target the root element directly — "#preloader" *is* the
        // gsap.context scope root, and scoped selector text only matches
        // descendants, so ".to('#preloader')" silently hits nothing and the
        // backdrop would snap off instead of sliding.
        .to(
          root,
          {
            yPercent: -100,
            duration: 1.2,
            ease: "power4.inOut",
            force3D: true,
          },
          "-=0.1"
        )
        // Release the held hero/reveal entrances as the curtain starts
        // lifting (mirrors the demo's playEntranceAnimations overlap).
        // The page animates in *beneath* the curtain, which is what makes
        // the lifting edge visible against the same-cream backdrop.
        // Body scroll stays locked until onComplete — no layout shift.
        .add(() => {
          html.classList.remove("is-loading");
        }, "<");
    }, root);

    return () => {
      ctx.revert();
      html.classList.remove("is-loading");
      body.style.overflow = prevOverflow;
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={rootRef}
      id="preloader"
      role="status"
      aria-label="Loading Petal and Crumb bakery"
      className="fixed inset-0 top-0 left-0 z-[9999] flex w-full flex-col items-center justify-center bg-[oklch(0.905_0.05_62)] will-change-transform"
    >
      <svg
        id="preloader-logo"
        width="100"
        height="100"
        viewBox="0 0 48 48"
        fill="none"
        role="img"
        aria-label="Petal and Crumb bloom mark"
      >
        <path
          className="pl-leaf"
          d="M10.5 40.5c3.6-.4 6.2-2.2 7.6-5.4-3.4-.9-6.5.2-8.6 3.3-.3.5-.5 1.2-1 2.1Z"
          fill="oklch(0.62 0.08 140)"
        />
        <path
          className="pl-stem"
          d="M8.8 43.7c4.8-1 8.3-3.4 10.6-7.4"
          stroke="oklch(0.62 0.08 140)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <ellipse className="pl-petal" cx="24" cy="10.6" rx="6.1" ry="8.3" fill="oklch(0.615 0.115 27)" transform="rotate(0 24 24)" />
        <ellipse className="pl-petal" cx="24" cy="10.6" rx="6.1" ry="8.3" fill="oklch(0.615 0.115 27)" transform="rotate(60 24 24)" />
        <ellipse className="pl-petal" cx="24" cy="10.6" rx="6.1" ry="8.3" fill="oklch(0.7 0.095 25)" transform="rotate(120 24 24)" />
        <ellipse className="pl-petal" cx="24" cy="10.6" rx="6.1" ry="8.3" fill="oklch(0.615 0.115 27)" transform="rotate(180 24 24)" />
        <ellipse className="pl-petal" cx="24" cy="10.6" rx="6.1" ry="8.3" fill="oklch(0.7 0.095 25)" transform="rotate(240 24 24)" />
        <ellipse className="pl-petal" cx="24" cy="10.6" rx="6.1" ry="8.3" fill="oklch(0.615 0.115 27)" transform="rotate(300 24 24)" />
        <circle className="pl-center" cx="24" cy="24" r="5.4" fill="oklch(0.85 0.1 90)" />
        <circle className="pl-center-inner" cx="22.4" cy="22.4" r="1.5" fill="oklch(0.615 0.115 27)" />
      </svg>
      {/* Site font: Vollkorn display (demo used Playfair — replaced per site system) */}
      <div className="loader-text mt-6 text-center">
        <p className="font-display text-[22px] font-semibold uppercase leading-none tracking-[0.22em] text-[var(--ink)]">
          Petal &amp; Crumb
        </p>
        <p className="eyebrow eyebrow--muted mt-2.5 !text-[10px]">Cake Studio</p>
      </div>
    </div>
  );
}
