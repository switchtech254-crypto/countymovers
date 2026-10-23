import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Brand } from "@/components/brand";
import { LegalLinks } from "@/components/legal/legal-links";

export const LEGAL_UPDATED = "22 October 2026";

export function LegalPage({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  return (
    <div className="legal-page">
      <header className="legal-header">
        <div className="page-width legal-header-inner">
          <Brand />
          <Link href="/" className="legal-back">
            <ArrowLeft size={16} /> Back to home
          </Link>
        </div>
      </header>
      <section className="legal-hero">
        <div className="page-width">
          <p className="eyebrow">Legal</p>
          <h1>{title}</h1>
          <p className="legal-meta">Last updated: {LEGAL_UPDATED}</p>
          <p className="legal-intro">{intro}</p>
        </div>
      </section>
      <main className="page-width legal-body">{children}</main>
      <footer className="legal-footer">
        <div className="page-width legal-footer-inner">
          <span>© {new Date().getFullYear()} County Movers. All rights reserved.</span>
          <LegalLinks />
        </div>
      </footer>
    </div>
  );
}