// Server-only: it carries icon components, so only import it from server components.
// The titles and copy live in lib/site.ts so the navbar dropdown and this list never drift apart.
import { Home, Truck, Wrench, Warehouse, Sofa, Package } from "lucide-react";
import { serviceItems } from "@/lib/site";

const icons = [Home, Truck, Wrench, Warehouse, Sofa, Package];

export const services = serviceItems.map((s, i) => ({
  icon: icons[i] ?? Package,
  title: s.title,
  text: s.text,
}));