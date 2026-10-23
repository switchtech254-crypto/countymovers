import Link from "next/link";
import { CookieSettingsButton } from "@/components/cookie-settings-button";

export function LegalLinks() {
  return (
    <nav className="footer-legal" aria-label="Legal">
      <Link href="/privacy-policy">Privacy Policy</Link>
      <Link href="/cookie-policy">Cookie Policy</Link>
      <Link href="/terms-of-service">Terms of Service</Link>
      <CookieSettingsButton />
    </nav>
  );
}