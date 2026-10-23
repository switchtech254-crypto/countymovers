"use client";

import { CONSENT_OPEN } from "@/lib/consent";

export function CookieSettingsButton() {
  return (
    <button type="button" className="footer-legal-btn" onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN))}>
      Cookie settings
    </button>
  );
}