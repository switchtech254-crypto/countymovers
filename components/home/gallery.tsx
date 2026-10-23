"use client";

import { useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { gallery } from "@/lib/site";
import Image from "next/image";

/** Client component: it owns the lightbox state. */
export function Gallery() {
  const [selected, setSelected] = useState<number | null>(null);
  const image = selected !== null ? gallery[selected] : undefined;

  return (
    <>
      <div className="gallery-grid">
        {gallery.map((img, i) => (
          <Button
            key={i}
            variant="ghost"
            className={`gallery-tile gallery-tile-${i}`}
            onClick={() => setSelected(i)}
            aria-label={`View image: ${img.alt}`}
          >
            <img src={img.src} alt={img.alt} width={1216} height={832} loading="lazy" />
            <span>
              <ArrowUpRight size={22} />
            </span>
          </Button>
        ))}
      </div>
      {image && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Moving gallery"
          onClick={() => setSelected(null)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setSelected(null);
          }}
        >
          <Button
            autoFocus
            variant="secondary"
            size="icon"
            className="lightbox-close"
            aria-label="Close image"
            onClick={() => setSelected(null)}
          >
            <X />
          </Button>
          {/* <img src={image.src} alt={image.alt} /> */}
          <Image src={image.src} alt={image.alt} />
        </div>
      )}
    </>
  );
}