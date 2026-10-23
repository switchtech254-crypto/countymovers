"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CONSENT_CHANGE,
  CONSENT_OPEN,
  hasAnalyticsConsent,
  readConsentRaw,
  saveConsent,
} from "@/lib/consent";

const subscribe = (cb: () => void) => {
  window.addEventListener(CONSENT_CHANGE, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(CONSENT_CHANGE, cb);
    window.removeEventListener("storage", cb);
  };
};

/** Client component. Renders nothing on the server, so there is no hydration mismatch. */
export function CookieConsent() {
  const raw = useSyncExternalStore(subscribe, readConsentRaw, () => "unknown");
  const [dismissed, setDismissed] = useState(false);
  const [customise, setCustomise] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  // The footer's "Cookie settings" button fires this event to reopen the popup.
  useEffect(() => {
    const open = () => {
      setAnalytics(hasAnalyticsConsent());
      setCustomise(true);
      setDismissed(false);
    };
    window.addEventListener(CONSENT_OPEN, open);
    return () => window.removeEventListener(CONSENT_OPEN, open);
  }, []);

  const visible = raw !== "unknown" && !dismissed && (raw === "" || customise);
  if (!visible) return null;

  const choose = (value: boolean) => {
    saveConsent(value);
    setDismissed(true);
    setCustomise(false);
  };

  return (
    <div className="cookie-banner" role="dialog" aria-labelledby="cookie-title" aria-describedby="cookie-text">
      {raw !== "" && (
        <button type="button" className="cookie-close" aria-label="Close cookie settings" onClick={() => { setDismissed(true); setCustomise(false); }}>
          <X size={18} />
        </button>
      )}
      <h2 id="cookie-title">Your cookie choices</h2>
      <p id="cookie-text">
        We use essential storage to make this site work and to remember this choice. With your
        permission we may also use analytics to see how the site is used. Read our{" "}
        <Link href="/cookie-policy">Cookie Policy</Link> and{" "}
        <Link href="/privacy-policy">Privacy Policy</Link>.
      </p>

      {customise && (
        <div className="cookie-options">
          <label className="cookie-option">
            <span>
              <strong>Essential</strong>
              <small>Needed for the site to work. Always on.</small>
            </span>
            <input type="checkbox" checked disabled />
          </label>
          <label className="cookie-option">
            <span>
              <strong>Analytics</strong>
              <small>Helps us understand which pages are useful.</small>
            </span>
            <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} />
          </label>
        </div>
      )}

      <div className="cookie-actions">
        {customise ? (
          <Button type="button" className="cookie-btn" onClick={() => choose(analytics)}>
            Save choices
          </Button>
        ) : (
          <>
            <Button type="button" className="cookie-btn" onClick={() => choose(true)}>
              Accept all
            </Button>
            <Button type="button" variant="outline" className="cookie-btn" onClick={() => choose(false)}>
              Reject non-essential
            </Button>
            <button type="button" className="cookie-link" onClick={() => setCustomise(true)}>
              Customise
            </button>
          </>
        )}
      </div>
    </div>
  );
}