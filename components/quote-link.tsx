import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QuoteLink({
  children = "Get A Free Quote",
  className = "",
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <Button asChild className={`quote-button ${className}`}>
      <Link href="/quotation">
        {children}
        <ArrowUpRight size={18} />
      </Link>
    </Button>
  );
}