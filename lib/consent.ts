export const CONSENT_KEY = "cm-cookie-consent";
export const CONSENT_CHANGE = "cm-consent-change";
export const CONSENT_OPEN = "cm-open-cookie-settings";
const MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000; // ask again after 12 months

/** Raw stored value, or "" if nothing is saved, it has expired, or storage is blocked. */
export function readConsentRaw(): string {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return "";
    const { ts } = JSON.parse(raw) as { ts?: number };
    return typeof ts === "number" && Date.now() - ts < MAX_AGE_MS ? raw : "";
  } catch {
    return "";
  }
}

export function hasAnalyticsConsent(): boolean {
  try {
    return JSON.parse(readConsentRaw() || "{}").analytics === true;
  } catch {
    return false;
  }
}

export function saveConsent(analytics: boolean) {
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ analytics, ts: Date.now() }));
  } catch {
    /* storage blocked: the popup still closes for this visit */
  }
  window.dispatchEvent(new Event(CONSENT_CHANGE));
}