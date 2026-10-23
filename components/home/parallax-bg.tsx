"use client";

import { useEffect, useRef } from "react";

/**
 * Background photo that moves slower than the page, so it lags behind the text as you scroll.
 * Works in every browser, including iOS. Must sit inside a position:relative section.
 */
export function ParallaxBg({ src, speed = 0.35 }: { src: string; speed?: number }) {
  const wrap = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const w = wrap.current;
    const i = img.current;
    if (!w || !i) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const r = w.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < 0 || r.top > vh) return; // off screen, skip the work
      const s = window.innerWidth < 800 ? speed * 0.6 : speed; // gentler on phones
      const offset = r.top + r.height / 2 - vh / 2; // 0 when the section is centred
      const max = r.height * 0.3; // never move past the spare image height
      const y = Math.max(-max, Math.min(max, -offset * s));
      i.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [speed]);

  return (
    <div className="services-bg" aria-hidden="true" ref={wrap}>
      <img ref={img} src={src} alt="" width={1920} height={1088} loading="lazy" />
    </div>
  );
}