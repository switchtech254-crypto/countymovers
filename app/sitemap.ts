import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Fixed dates on purpose: new Date() fails the build with Cache Components enabled,
// the same error you hit in legal-page.tsx. Update these when a page really changes.
const pages: { path: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly"; updated: string }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly", updated: "2026-10-24" },
  { path: "/quotation", priority: 0.9, changeFrequency: "monthly", updated: "2026-10-24" },
  { path: "/privacy-policy", priority: 0.3, changeFrequency: "yearly", updated: "2026-10-22" },
  { path: "/cookie-policy", priority: 0.3, changeFrequency: "yearly", updated: "2026-10-22" },
  { path: "/terms-of-service", priority: 0.3, changeFrequency: "yearly", updated: "2026-10-22" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((p) => ({
    url: `${SITE_URL}${p.path === "/" ? "" : p.path}`,
    lastModified: p.updated,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));
}