"use client";

import { useEffect } from "react";

type Dir = "up" | "left" | "right";

/** Which elements slide in, and from where. Matching siblings are staggered automatically. */
const targets: [selector: string, dir: Dir][] = [
  // About
  [".about-copy > *", "left"],
  [".about-photo-main", "right"],
  [".about-photo-sub", "up"],
  [".about-seal", "left"],
  // Services
  [".service-row", "left"],
  [".services-section .section-intro > *", "right"],
  // Why choose us
  [".why-photo-wrap", "left"],
  [".why-grid > div:last-child > :not(ul)", "right"],
  [".check-list li", "right"],
  // Process
  [".process-layout > div > :not(.process-steps)", "up"],
  [".process-step", "up"],
  [".process-layout > img", "right"],
  // Reviews
  [".reviews-layout > div:first-child > *", "left"],
  [".reviews-slider", "right"],
  // Care, gallery, areas
  [".center-heading", "up"],
  [".care-item", "up"],
  [".center-action", "up"],
  [".gallery-tile", "up"],
  [".service-areas .page-width > *", "up"],
  // FAQ
  [".faq-layout > div:first-child > *", "left"],
  [".faq-item", "right"],
  // Contact
  [".quote-form", "left"],
  [".contact-details > *", "right"],
  // Closing call to action and footer
  [".closing-banner .page-width > *", "up"],
  [".footer-grid > div", "up"],
];

/**
 * Renders nothing. After hydration it marks below-the-fold elements with data attributes
 * and reveals them as they scroll into view. Everything else on the page stays a server component.
 */
export function ScrollReveal() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const vh = window.innerHeight;
    const tagged: HTMLElement[] = [];

    for (const [selector, dir] of targets) {
      const perParent = new Map<Element, number>();
      document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
        if (el.hasAttribute("data-reveal")) return;
        // Already on screen (or scrolled past): leave it alone so nothing flashes.
        if (el.getBoundingClientRect().top < vh * 0.92) return;

        const parent = el.parentElement as Element;
        const index = perParent.get(parent) ?? 0;
        perParent.set(parent, index + 1);

        el.setAttribute("data-reveal", dir);
        el.style.setProperty("--reveal-delay", `${Math.min(index, 5) * 90}ms`);
        tagged.push(el);
      });
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.setAttribute("data-revealed", "");
          io.unobserve(e.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" },
    );
    tagged.forEach((el) => io.observe(el));

    return () => {
      io.disconnect();
      tagged.forEach((el) => {
        el.removeAttribute("data-reveal");
        el.removeAttribute("data-revealed");
        el.style.removeProperty("--reveal-delay");
      });
    };
  }, []);

  return null;
}