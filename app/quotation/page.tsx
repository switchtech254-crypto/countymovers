import type { Metadata } from "next";
import { QuotationWizard } from "@/components/quotation/quotation-wizard";

export const metadata: Metadata = {
  title: "Request a Moving Quotation | County Movers Nairobi",
  description:
    "Plan your home or office move with County Movers. Share your locations, belongings, access details and moving preferences for a personalised quotation.",
  openGraph: {
    type: "website",
    title: "Plan Your Move | County Movers Quotation",
    description:
      "A thoughtful, step-by-step quotation request for your next move in Nairobi and across Kenya.",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function QuotationPage() {
  return <QuotationWizard />;
}