"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Client component for the open/close behaviour only.
 * Every answer is always present in the HTML (closed ones use `hidden`), so crawlers can read them.
 */
export function FaqList({ faqs }: { faqs: readonly { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="faq-list">
      {faqs.map((f, i) => (
        <div key={f.q} className={`faq-item ${open === i ? "is-open" : ""}`}>
          <Button
            variant="ghost"
            aria-expanded={open === i}
            aria-controls={`faq-answer-${i}`}
            onClick={() => setOpen(open === i ? null : i)}
          >
            {f.q}
            <span>
              <ChevronDown size={15} />
            </span>
          </Button>
          <p id={`faq-answer-${i}`} hidden={open !== i}>
            {f.a}
          </p>
        </div>
      ))}
    </div>
  );
}