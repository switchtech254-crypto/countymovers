"use client";

import { useEffect, useState } from "react";
import { IMG } from "@/lib/site";
import Image from "next/image";

const slides = [
  { src: IMG.hero, alt: "Movers carefully carrying a box beside a van in Nairobi" },
  { src: IMG.team, alt: "Movers carefully loading a wrapped sofa" },
  { src: IMG.packing, alt: "Carefully packed boxes and protected furniture" },
  { src: IMG.about, alt: "A friendly mover carrying packed boxes" },
];

type HeroTransition = "fade" | "slide" | "zoom";

/** Client component: cycles the hero photos. It reuses .hero-photo, so the existing crop rules still apply. */
export function HeroSlides({
  transition = "fade",
  interval = 6000,
}: {
  transition?: HeroTransition;
  interval?: number;
}) {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      setCurrent((c) => {
        setPrev(c);
        return (c + 1) % slides.length;
      });
    }, interval);
    return () => clearInterval(id);
  }, [interval]);

  return (
    <div className={`hero-slides hero-slides-${transition}`}>
      {slides.map((s, i) => (
        <Image
          key={s.src}
          className={`hero-photo${i === current ? " is-active" : ""}${i === prev ? " is-prev" : ""}`}
          src={s.src}
          alt={i === current ? s.alt : ""}
          aria-hidden={i !== current}
          width={1920}
          height={1088}
          fetchPriority={i === 0 ? "high" : undefined}
          loading={i === 0 ? "eager" : "lazy"}

        />
      ))}
    </div>
  );
}