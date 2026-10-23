"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WHATSAPP } from "@/lib/site";
import { useService } from "@/components/home/service-context";
import { submitContact } from "@/app/actions/submit-contact";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "ok"; reference: string }
  | { kind: "error"; message: string };

/** Client component: form state and submission. Service titles come in as plain strings. */
export function ContactForm({ services }: { services: string[] }) {
  const { service, setService } = useService();
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const requestId = useRef("");

  useEffect(() => {
    requestId.current = crypto.randomUUID();
  }, []);

  return (
    <form
      className="quote-form"
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget; // capture before the await
        const f = new FormData(form);
        const get = (k: string) => String(f.get(k) ?? "");

        setStatus({ kind: "sending" });
        try {
          const result = await submitContact({
            requestId: requestId.current,
            website: get("website"),
            name: get("name"),
            phone: get("phone"),
            email: get("email"),
            service,
            from: get("from"),
            to: get("to"),
            date: get("date"),
            details: get("details"),
          });
          if (result.ok) {
            setStatus({ kind: "ok", reference: result.reference });
            form.reset();
            setService("");
            requestId.current = crypto.randomUUID();
          } else {
            setStatus({ kind: "error", message: result.error });
          }
        } catch {
          setStatus({
            kind: "error",
            message: "We couldn’t send your enquiry. Please try again, or reach us on WhatsApp or by phone.",
          });
        }
      }}
    >
      <h3>Let’s Plan Your Move</h3>
      <Button asChild variant="outline" className="mb-6 mt-4">
        <Link href="/quotation">
          Plan a detailed quotation <ArrowRight size={16} />
        </Link>
      </Button>

      {/* Honeypot: hidden from people, filled in by bots */}
      <input
        className="q-honeypot"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className="form-grid">
        <label>
          <span>Full name</span>
          <input name="name" placeholder="Your name" required maxLength={100} autoComplete="name" />
        </label>
        <label>
          <span>Phone number</span>
          <input name="phone" type="tel" placeholder="Phone number" required maxLength={30} autoComplete="tel" />
        </label>
        <label>
          <span>Email</span>
          <input name="email" type="email" placeholder="Email address" required maxLength={255} autoComplete="email" />
        </label>
        {/* <label>
          <span>Service type</span>
          <select
            name="service"
            value={service}
            onChange={(e) => setService(e.target.value)}
            required
          >
            <option value="">Select a service</option>
            {services.map((title) => (
              <option key={title}>{title}</option>
            ))}
          </select>
        </label> */}
        <label>
          <span>Moving from</span>
          <input name="from" placeholder="Current location" required maxLength={300} />
        </label>
        <label>
          <span>Moving to</span>
          <input name="to" placeholder="New location" required maxLength={300} />
        </label>
        <label className="form-wide">
          <span>Preferred moving date</span>
          <input name="date" type="date" />
        </label>
        <label className="form-wide">
          <span>Your message</span>
          <textarea name="details" placeholder="Tell us a little about your move…" rows={4} maxLength={2000} />
        </label>
      </div>

      <Button type="submit" className="quote-button" disabled={status.kind === "sending"}>
        {status.kind === "sending" ? (
          <>
            <LoaderCircle size={18} className="animate-spin" /> Sending…
          </>
        ) : (
          <>
            Request A Quote <ArrowUpRight size={18} />
          </>
        )}
      </Button>

      <p className="form-note">
        We use your details only to respond to this enquiry. See our{" "}
        <Link href="/privacy-policy">Privacy Policy</Link>.
      </p>

      {status.kind === "ok" && (
        <p className="form-status" role="status">
          Thank you, your enquiry is in (reference {status.reference}). We’ve emailed you a confirmation.
          Prefer a quicker reply?{" "}
          <a href={WHATSAPP} target="_blank" rel="noreferrer">
            Message us on WhatsApp
          </a>
          .
        </p>
      )}
      {status.kind === "error" && (
        <p className="form-status is-error" role="alert">
          {status.message}
        </p>
      )}
    </form>
  );
}