"use client";

import { useEffect, useState } from "react";
import { Quote, Star } from "lucide-react";
import type { Review } from "@/lib/site";

/** Client component: auto-advances the reviews, pauses on hover/focus, and has dot controls. */
export function ReviewSlider({
  reviews,
  interval = 6500,
}: {
  reviews: readonly Review[];
  interval?: number;
}) {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);

  const go = (i: number) => {
    if (i === current) return;
    setPrev(current);
    setCurrent(i);
  };

  // Advance on a timer. It restarts after every change, so clicking a dot resets the clock.
  useEffect(() => {
    if (paused || reviews.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setTimeout(() => {
      setPrev(current);
      setCurrent((current + 1) % reviews.length);
    }, interval);
    return () => clearTimeout(id);
  }, [current, paused, interval, reviews.length]);

  // Once the exit animation is done, the old slide is parked on the right again.
  useEffect(() => {
    if (prev === null) return;
    const id = setTimeout(() => setPrev(null), 900);
    return () => clearTimeout(id);
  }, [prev]);

  return (
    <div
      className="reviews-slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      role="group"
      aria-roledescription="carousel"
      aria-label="Customer reviews"
    >
      <Quote className="review-quote-mark" size={44} strokeWidth={1.25} aria-hidden="true" />
      <div className="review-stage" aria-live={paused ? "polite" : "off"}>
        {reviews.map((r, i) => (
          <figure
            key={i}
            className={`review-slide${i === current ? " is-active" : ""}${i === prev ? " is-prev" : ""}`}
            aria-hidden={i !== current}
          >
            <div className="review-stars" role="img" aria-label={`${r.rating} out of 5 stars`}>
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  size={20}
                  className={n <= r.rating ? "is-filled" : ""}
                  aria-hidden="true"
                />
              ))}
            </div>
            <blockquote>{r.text}</blockquote>
            <figcaption>
              <strong>{r.name}</strong>
              <span>
                {r.service} · {r.area}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
      {reviews.length > 1 && (
        <div className="review-dots">
          {reviews.map((r, i) => (
            <button
              key={i}
              type="button"
              className={i === current ? "is-active" : ""}
              aria-label={`Show review ${i + 1} of ${reviews.length}`}
              aria-current={i === current}
              onClick={() => go(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}