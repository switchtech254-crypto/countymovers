"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type ServiceState = { service: string; setService: (service: string) => void };

const ServiceContext = createContext<ServiceState | null>(null);

/** Lets the "Enquire Now" links in the services grid pre-select a service in the contact form. */
export function ServiceProvider({ children }: { children: ReactNode }) {
  const [service, setService] = useState("");
  return <ServiceContext.Provider value={{ service, setService }}>{children}</ServiceContext.Provider>;
}

export function useService() {
  const ctx = useContext(ServiceContext);
  if (!ctx) throw new Error("useService must be used inside <ServiceProvider>");
  return ctx;
}

export function EnquireLink({ service }: { service: string }) {
  const { setService } = useService();
  return (
    <Button variant="link" className="service-enquiry" asChild>
      <a href="#contact" onClick={() => setService(service)}>
        Enquire Now <ArrowRight size={16} />
      </a>
    </Button>
  );
}