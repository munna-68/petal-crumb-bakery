/**
 * Centralized Motion & Scroll System for Petal & Crumb Bakery
 *
 * Rules:
 * - Single passive rAF-throttled scroll listener updating CSS custom properties on <html>.
 * - Zero React re-renders per frame. Driven entirely through custom properties and classes.
 * - Single IntersectionObserver that marks [data-reveal] elements with [data-revealed="true"].
 * - Single MutationObserver to re-register elements on route transitions and list re-renders.
 * - Full prefers-reduced-motion support: instant reveal, static marquee, no parallax.
 */

let isInitialized = false;
let scrollListenerActive = false;

export function initMotionSystem() {
  if (typeof window === "undefined" || isInitialized) return;
  isInitialized = true;

  const html = document.documentElement;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 1. Scroll listener (rAF throttled)
  let ticking = false;
  let lastScrollY = window.scrollY;

  const updateScrollProperties = () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollY / docHeight)) : 0;

    // Set CSS custom properties on <html>
    html.style.setProperty("--scroll-progress", progress.toFixed(4));
    html.style.setProperty("--scroll-y", `${Math.round(scrollY)}px`);

    if (!prefersReduced) {
      // Subtle parallax offset for hero / section imagery
      const parallax = Math.min(60, Math.max(-60, scrollY * 0.12));
      html.style.setProperty("--parallax-hero", `${parallax.toFixed(1)}px`);
    } else {
      html.style.setProperty("--parallax-hero", "0px");
    }

    // Toggle scroll classes on <html>
    if (scrollY > 20) {
      if (!html.classList.contains("has-scrolled")) html.classList.add("has-scrolled");
    } else {
      if (html.classList.contains("has-scrolled")) html.classList.remove("has-scrolled");
    }

    if (scrollY > 400) {
      if (!html.classList.contains("can-back-to-top")) html.classList.add("can-back-to-top");
    } else {
      if (html.classList.contains("can-back-to-top")) html.classList.remove("can-back-to-top");
    }

    // Scroll direction
    if (scrollY > lastScrollY && scrollY > 80) {
      html.classList.add("scrolled-down");
      html.classList.remove("scrolled-up");
    } else if (scrollY < lastScrollY) {
      html.classList.add("scrolled-up");
      html.classList.remove("scrolled-down");
    }

    lastScrollY = scrollY;
    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollProperties);
      ticking = true;
    }
  };

  if (!scrollListenerActive) {
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    scrollListenerActive = true;
    updateScrollProperties();
  }

  // 2. IntersectionObserver for elements with [data-reveal]
  const revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          target.setAttribute("data-revealed", "true");
          revealObserver.unobserve(target);
        }
      }
    },
    {
      root: null,
      rootMargin: "0px 0px -40px 0px",
      threshold: 0.08,
    }
  );

  // 3. Count-up statistics observer for elements with [data-count-target]
  const countObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          countObserver.unobserve(el);
          animateCountUp(el, prefersReduced);
        }
      }
    },
    { threshold: 0.2 }
  );

  function registerElements(root: Element | Document = document) {
    // If reduced motion is active, reveal immediately without animation
    if (prefersReduced) {
      const allReveal = root.querySelectorAll<HTMLElement>("[data-reveal]");
      allReveal.forEach((el) => el.setAttribute("data-revealed", "true"));

      const allCounts = root.querySelectorAll<HTMLElement>("[data-count-target]");
      allCounts.forEach((el) => {
        const target = el.getAttribute("data-count-target");
        const suffix = el.getAttribute("data-count-suffix") || "";
        const prefix = el.getAttribute("data-count-prefix") || "";
        if (target) el.textContent = `${prefix}${target}${suffix}`;
      });
      return;
    }

    // Otherwise observe with IntersectionObserver
    const revealEls = root.querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed='true'])");
    revealEls.forEach((el) => revealObserver.observe(el));

    const countEls = root.querySelectorAll<HTMLElement>("[data-count-target]:not([data-counted='true'])");
    countEls.forEach((el) => countObserver.observe(el));
  }

  registerElements(document);

  // 4. MutationObserver to handle SPA route changes & dynamic list additions
  const mutationObserver = new MutationObserver((mutations) => {
    let shouldScan = false;
    for (const mutation of mutations) {
      if (mutation.addedNodes.length > 0) {
        shouldScan = true;
        break;
      }
    }
    if (shouldScan) {
      registerElements(document);
      updateScrollProperties();
    }
  });

  mutationObserver.observe(document.body, { childList: true, subtree: true });

  // Listen for reduced motion changes dynamically
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener?.("change", () => {
    registerElements(document);
    updateScrollProperties();
  });
}

function animateCountUp(el: HTMLElement, prefersReduced: boolean) {
  const targetStr = el.getAttribute("data-count-target") || "0";
  const target = parseFloat(targetStr);
  const prefix = el.getAttribute("data-count-prefix") || "";
  const suffix = el.getAttribute("data-count-suffix") || "";
  const duration = parseInt(el.getAttribute("data-count-duration") || "1400", 10);
  el.setAttribute("data-counted", "true");

  if (prefersReduced || isNaN(target)) {
    el.textContent = `${prefix}${targetStr}${suffix}`;
    return;
  }

  const startTime = performance.now();
  const isFloat = targetStr.includes(".");

  const step = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(1, elapsed / duration);
    // Quintic ease out for soft organic patisserie feel
    const ease = 1 - Math.pow(1 - progress, 4);
    const currentVal = target * ease;

    el.textContent = isFloat
      ? `${prefix}${currentVal.toFixed(1)}${suffix}`
      : `${prefix}${Math.round(currentVal)}${suffix}`;

    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      el.textContent = `${prefix}${targetStr}${suffix}`;
    }
  };

  window.requestAnimationFrame(step);
}
