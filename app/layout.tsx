import type { Metadata } from "next";
import type { ReactNode } from "react";
import { CookieConsent } from "@/components/cookie-consent";

import "./globals.css";

export const metadata: Metadata = {
  title: "County Movers | Movers in Donholm, Nairobi",
  description:
    "County Movers: house and office moving, packing, storage and furniture handling in Nairobi.",
  openGraph: {
    type: "website",
    title: "County Movers | Movers in Donholm, Nairobi",
    description:
      "County Movers: house and office moving, packing, storage and furniture handling in Nairobi.",
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}
        <CookieConsent />
      </body>
      
    </html>
  );
}