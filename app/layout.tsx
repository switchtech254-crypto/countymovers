import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { CookieConsent } from "@/components/cookie-consent";
import { SITE_NAME, SITE_URL } from "@/lib/site";

import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2d3139",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: "County Movers | Home & Office Movers across Kenya",
    template: "%s | County Movers",
  },
  description:
    "Professional home and office movers based in Donholm, Nairobi. Packing, loading, transport, furniture handling and installation across Kenya.",
  authors: [{ name: "Switch Technologies Africa", url: "https://switchtechnologies.africa" }],
  creator: "Switch Technologies Africa",
  publisher: SITE_NAME,
  formatDetection: { telephone: false, email: false, address: false },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_KE",
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  icons: { icon: "/favicon.png", apple: "/favicon.png" },
  verification: { google: "9SmjaSz5516hXUdoSJn6qP85ylq4PI2bsYZA1qkxuCg" },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}