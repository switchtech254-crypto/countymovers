"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Home,
  Building2,
  Package,
  MapPin,
  CalendarDays,
  Sofa,
  Sparkles,
  UserRound,
  ClipboardCheck,
  Minus,
  Plus,
  Truck,
  Download,
  LoaderCircle,
  Pencil,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  initialQuote,
  inventoryGroups,
  moveTypes,
  quotationSchema,
  quoteSummary,
  serviceOptions,
  stepErrors,
  type QuoteDraft,
} from "@/lib/quotation/schema";
import { submitQuotation } from "@/app/actions/submit-quotation";

// Images live in /public/images and are referenced by URL.
const LOGO = "/images/logo.jpeg";
const MOVING_PHOTO = "/images/county-packing.jpg";

// TODO: PLACEHOLDER. Nothing is stored or sent yet.
// Replace the body with your real submission (database, email, WhatsApp, API route, server action, etc.).
// It must return { reference: string } and throw on failure so the form shows its error message.
// async function submitQuotation(input: {
//   requestId: string;
//   quote: unknown;
//   website: string;
// }): Promise<{ reference: string }> {
//   return { reference: `CM-${input.requestId.toUpperCase()}` };
// }

const steps = [
  {
    label: "Your move",
    icon: CalendarDays,
    title: "What’s your next chapter?",
    subtitle:
      "A new home, a new workspace, or just a few things going somewhere new.",
  },
  {
    label: "The journey",
    icon: MapPin,
    title: "From here. To somewhere new.",
    subtitle:
      "A few details about both places help us plan the journey and the heavy lifting.",
  },
  {
    label: "Your belongings",
    icon: Sofa,
    title: "Let’s take a look around.",
    subtitle:
      "An estimate is absolutely fine. Include what’s moving and leave the rest.",
  },
  {
    label: "The extra care",
    icon: Sparkles,
    title: "How can we lighten the load?",
    subtitle:
      "Choose the help you’d like, from the first box to the last piece of furniture.",
  },
  {
    label: "About you",
    icon: UserRound,
    title: "Who are we moving with?",
    subtitle: "The best way to reach you and talk through your quotation.",
  },
  {
    label: "Review & send",
    icon: ClipboardCheck,
    title: "Your move, all together.",
    subtitle: "One last look before sending your request to County Movers.",
  },
];
const sizeOptions = {
  Home: [
    "Studio",
    "1 bedroom",
    "2 bedrooms",
    "3 bedrooms",
    "4+ bedrooms",
    "Not sure",
  ],
  Office: [
    "Small office (1–10 people)",
    "Medium office (11–30 people)",
    "Large office (31+ people)",
    "Not sure",
  ],
  "Selected items": ["A few items", "A full load", "Not sure"],
};

function Field({
  label,
  children,
  error,
  wide = false,
}: {
  label: string;
  children: ReactNode;
  error?: string;
  wide?: boolean;
}) {
  return (
    <label className={`q-field${wide ? " q-wide" : ""}`}>
      <span>{label}</span>
      {children}
      {error && <small className="q-error">{error}</small>}
    </label>
  );
}
function Choices({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="q-choices" role="group" aria-label={label}>
      {options.map((v) => (
        <Button
          type="button"
          variant="outline"
          key={v}
          aria-pressed={value === v}
          className={value === v ? "q-choice selected" : "q-choice"}
          onClick={() => onChange(v)}
        >
          {v}
          {value === v && <Check size={14} />}
        </Button>
      ))}
    </div>
  );
}
function download(text: string) {
  const url = URL.createObjectURL(
    new Blob([text], { type: "text/plain;charset=utf-8" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = "county-movers-quotation-request.txt";
  a.click();
  URL.revokeObjectURL(url);
}
export function QuotationWizard() {
  const [draft, setDraft] = useState<QuoteDraft>(initialQuote);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [room, setRoom] = useState<keyof typeof inventoryGroups>("Living room");
  const [busy, setBusy] = useState(false);
  const [reference, setReference] = useState("");
  const [website, setWebsite] = useState("");
  const requestId = useRef("");
  const titleRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    requestId.current = crypto.randomUUID();
  }, []);
  function update<K extends keyof QuoteDraft>(key: K, value: QuoteDraft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
    setErrors({});
  }
  function go(next: number) {
    setStep(next);
    setErrors({});
    window.scrollTo({ top: 0, behavior: "instant" });
    requestAnimationFrame(() => titleRef.current?.focus());
  }
  function next() {
    const found = stepErrors(draft, step);
    setErrors(found);
    if (Object.keys(found).length === 0) go(step + 1);
  }
  async function send() {
    const validated = quotationSchema.safeParse(draft);
    if (!validated.success) {
      const first = validated.error.issues[0];
      const field = String(first?.path[0]);
      const target = ["moveType", "size", "date", "flexible", "time"].includes(
        field,
      )
        ? 0
        : ["from", "to"].includes(field)
          ? 1
          : ["name", "phone", "email", "consent"].includes(field)
            ? 4
            : 3;
      go(target);
      setErrors(stepErrors(draft, target));
      return;
    }
    setBusy(true);
    setErrors({});
    try {
      const result = await submitQuotation({
        requestId: requestId.current,
        quote: validated.data,
        website,
      });
      setReference(result.reference);
      window.scrollTo({ top: 0, behavior: "instant" });
    } catch {
      setErrors({
        submit:
          "We couldn’t send your request. Your details are still here — please try again.",
      });
    } finally {
      setBusy(false);
    }
  }
  const total = Object.values(draft.inventory).reduce((a, b) => a + b, 0);
  const current = steps[step];
  if (!current) return null;
  const addressFields = (side: "from" | "to") => {
    const a = draft[side];
    function change<K extends keyof typeof a>(key: K, value: (typeof a)[K]) {
      update(side, { ...a, [key]: value });
    }
    return (
      <section className="q-address" key={side}>
        <h3>
          <MapPin size={19} />
          {side === "from" ? "Moving from" : "Moving to"}
        </h3>
        <div className="q-fields">
          <Field
            label="Neighbourhood / town *"
            wide
            error={errors[`${side}.area`]}
          >
            <Input
              value={a.area}
              maxLength={300}
              aria-invalid={!!errors[`${side}.area`]}
              onChange={(e) => change("area", e.target.value)}
              placeholder={
                side === "from" ? "e.g. Donholm, Nairobi" : "e.g. Ruiru, Kiambu"
              }
            />
          </Field>
          <Field label="Estate, building & address" wide>
            <Input
              value={a.address}
              maxLength={500}
              onChange={(e) => change("address", e.target.value)}
              placeholder="Building name, street, house / unit number"
            />
          </Field>
          <Field label="Property type">
            <select
              value={a.property}
              onChange={(e) =>
                change("property", e.target.value as typeof a.property)
              }
            >
              {[
                "Apartment",
                "House",
                "Office building",
                "Warehouse",
                "Other",
              ].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </Field>
          <Field label="Floor (0 = ground)">
            <Input
              type="number"
              min={0}
              max={100}
              value={a.floor}
              onChange={(e) => change("floor", Number(e.target.value))}
            />
          </Field>
          <Field label="Lift access">
            <select
              value={a.lift}
              onChange={(e) => change("lift", e.target.value as typeof a.lift)}
            >
              {["Not needed", "Available", "No lift", "Not sure"].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </Field>
          <Field label="Truck parking">
            <select
              value={a.parking}
              onChange={(e) =>
                change("parking", e.target.value as typeof a.parking)
              }
            >
              {[
                "At the entrance",
                "Short walk",
                "Long walk / restricted",
                "Not sure",
              ].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </Field>
          <Field label="Anything about access?" wide>
            <Textarea
              value={a.access}
              maxLength={1000}
              onChange={(e) => change("access", e.target.value)}
              placeholder="Narrow stairs, gate restrictions, lift size, parking distance…"
              rows={2}
            />
          </Field>
        </div>
      </section>
    );
  };
  return (
    <div className="quotation-page">
      <header className="q-header">
        <div className="q-shell">
          <Link href="/" className="q-brand">
            <img src={LOGO} alt="County Movers" width={48} height={48} />
            <span>
              COUNTY{" "}
              <strong>
                MOVERS<span>.</span>
              </strong>
            </span>
          </Link>
          <Button asChild variant="ghost">
            <Link href="/">
              <ArrowLeft />
              Back to website
            </Link>
          </Button>
        </div>
      </header>
      {reference ? (
        <main className="q-success q-shell">
          <div className="q-success-icon">
            <Check size={34} />
          </div>
          <p className="eyebrow">A fresh start is on its way</p>
          <h1>Your request is in.</h1>
          <p>
            Thank you, {draft.name.split(" ")[0]}. Your move details have been
            saved for County Movers to review.
          </p>
          <div className="q-reference">
            <span>Quotation reference</span>
            <strong>{reference}</strong>
          </div>
          <p className="q-muted">
            This is a quotation request, not a confirmed booking. Pricing and
            availability still need confirmation.
          </p>
          <div className="q-success-actions">
            <Button
              onClick={() =>
                download(`${quoteSummary(draft)}\n\nReference: ${reference}`)
              }
            >
              <Download />
              Download my request
            </Button>
            <Button asChild variant="outline">
              <Link href="/">
                Back to County Movers
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </main>
      ) : (
        <main className="q-shell q-layout">
          <aside className="q-sidebar">
            <p className="eyebrow">Your next chapter</p>
            <h1>
              Let’s plan
              <br />
              your <em>move.</em>
            </h1>
            <p>
              A little about your move.
              <br />A lot less on your shoulders.
            </p>
            <ol className="q-step-list">
              {steps.map((s, i) => (
                <li
                  key={s.label}
                  className={i === step ? "active" : i < step ? "done" : ""}
                >
                  <Button
                    variant="ghost"
                    disabled={i > step}
                    onClick={() => go(i)}
                    aria-current={i === step ? "step" : undefined}
                  >
                    <span className="q-step-number">
                      {i < step ? (
                        <Check size={16} />
                      ) : (
                        String(i + 1).padStart(2, "0")
                      )}
                    </span>
                    <span>{s.label}</span>
                    {i === step && <ArrowRight size={16} />}
                  </Button>
                </li>
              ))}
            </ol>
            <div className="q-photo">
              <img
                src={MOVING_PHOTO}
                alt="Protected furniture and packed boxes ready for moving"
              />
              <span>
                <ShieldCheck size={17} />
                Care in every detail.
              </span>
            </div>
          </aside>
          <div className="q-workspace">
            <div className="q-progress-meta">
              <span>YOUR FREE QUOTATION</span>
              <span>Step {step + 1} of 6</span>
            </div>
            <div className="q-progress" aria-label={`Step ${step + 1} of 6`}>
              {steps.map((s, i) => (
                <span key={s.label} className={i <= step ? "filled" : ""} />
              ))}
            </div>
            <div className="q-step-content" key={step}>
              <div className="q-step-heading">
                <span className="q-heading-icon">
                  <current.icon size={23} />
                </span>
                <div>
                  <h2 ref={titleRef} tabIndex={-1}>
                    {current.title}
                  </h2>
                  <p>{current.subtitle}</p>
                </div>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (step < 5) next();
                  else void send();
                }}
                noValidate
              >
                <input
                  className="q-honeypot"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
                {step === 0 && (
                  <>
                    <h3 className="q-question">What are you moving? *</h3>
                    <div className="q-type-grid">
                      {moveTypes.map((v, i) => {
                        const Icon = [Home, Building2, Package][i] ?? Home;
                        return (
                          <Button
                            type="button"
                            variant="outline"
                            key={v}
                            className={`q-type ${draft.moveType === v ? "selected" : ""}`}
                            aria-pressed={draft.moveType === v}
                            onClick={() => {
                              setDraft((d) => ({
                                ...d,
                                moveType: v,
                                size: "",
                              }));
                              setErrors({});
                            }}
                          >
                            <Icon size={28} />
                            <strong>{v}</strong>
                            <span>
                              {
                                [
                                  "A fresh start at home",
                                  "Room for your next big idea",
                                  "Big care for smaller moves",
                                ][i]
                              }
                            </span>
                          </Button>
                        );
                      })}
                    </div>
                    {errors.moveType && (
                      <p className="q-error">Choose the type of move.</p>
                    )}
                    {draft.moveType && (
                      <>
                        <h3 className="q-question">How big is the move? *</h3>
                        <Choices
                          label="Move size"
                          value={draft.size}
                          options={sizeOptions[draft.moveType]}
                          onChange={(v) => update("size", v)}
                        />
                        {errors.size && (
                          <p className="q-error">
                            Choose a move size, or select “Not sure”.
                          </p>
                        )}
                      </>
                    )}
                    <h3 className="q-question">When would you like to move?</h3>
                    <div className="q-fields">
                      <Field label="Preferred moving date" error={errors.date}>
                        <Input
                          type="date"
                          value={draft.date}
                          onChange={(e) => update("date", e.target.value)}
                        />
                      </Field>
                      <Field label="Time of day">
                        <select
                          value={draft.time}
                          onChange={(e) =>
                            update("time", e.target.value as QuoteDraft["time"])
                          }
                        >
                          {["Any time", "Morning", "Afternoon"].map((v) => (
                            <option key={v}>{v}</option>
                          ))}
                        </select>
                      </Field>
                    </div>
                    <label className="q-check">
                      <Checkbox
                        checked={draft.flexible}
                        onCheckedChange={(v) => update("flexible", v === true)}
                      />
                      My dates are flexible / I’m still deciding
                    </label>
                  </>
                )}
                {step === 1 && (
                  <div className="q-address-grid">
                    {addressFields("from")}
                    {addressFields("to")}
                  </div>
                )}
                {step === 2 && (
                  <>
                    <div className="q-inventory-heading">
                      <h3>Your moving inventory</h3>
                      <span>
                        <Package size={16} />
                        {total} items
                      </span>
                    </div>
                    <div
                      className="q-room-tabs"
                      role="tablist"
                      aria-label="Inventory rooms"
                    >
                      {Object.keys(inventoryGroups).map((v) => (
                        <Button
                          type="button"
                          variant="ghost"
                          role="tab"
                          aria-selected={room === v}
                          key={v}
                          onClick={() =>
                            setRoom(v as keyof typeof inventoryGroups)
                          }
                          className={room === v ? "active" : ""}
                        >
                          {v}
                        </Button>
                      ))}
                    </div>
                    <div
                      className="q-inventory"
                      role="tabpanel"
                      aria-label={room}
                    >
                      {inventoryGroups[room].map((item) => (
                        <div className="q-inventory-row" key={item}>
                          <span>{item}</span>
                          <div className="q-counter">
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              aria-label={`Remove ${item}`}
                              disabled={!draft.inventory[item]}
                              onClick={() =>
                                update("inventory", {
                                  ...draft.inventory,
                                  [item]: Math.max(
                                    0,
                                    (draft.inventory[item] ?? 0) - 1,
                                  ),
                                })
                              }
                            >
                              <Minus />
                            </Button>
                            <Input
                              type="number"
                              min={0}
                              max={99}
                              aria-label={`${item} quantity`}
                              value={draft.inventory[item] ?? 0}
                              onChange={(e) =>
                                update("inventory", {
                                  ...draft.inventory,
                                  [item]: Math.min(
                                    99,
                                    Math.max(
                                      0,
                                      Math.floor(Number(e.target.value) || 0),
                                    ),
                                  ),
                                })
                              }
                            />
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              aria-label={`Add ${item}`}
                              disabled={(draft.inventory[item] ?? 0) >= 99}
                              onClick={() =>
                                update("inventory", {
                                  ...draft.inventory,
                                  [item]: (draft.inventory[item] ?? 0) + 1,
                                })
                              }
                            >
                              <Plus />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="q-fields q-after">
                      <Field
                        label="Other belongings & approximate quantities"
                        wide
                      >
                        <Textarea
                          value={draft.inventoryNotes}
                          maxLength={2000}
                          onChange={(e) =>
                            update("inventoryNotes", e.target.value)
                          }
                          placeholder="e.g. 2 bicycles, plants, 10 bags of clothes, rugs…"
                        />
                      </Field>
                      <Field label="Items needing special care" wide>
                        <Textarea
                          value={draft.specialItems}
                          maxLength={2000}
                          onChange={(e) =>
                            update("specialItems", e.target.value)
                          }
                          placeholder="Glass, artwork, piano, safe, oversized pieces — include sizes if you know them."
                        />
                      </Field>
                    </div>
                  </>
                )}
                {step === 3 && (
                  <>
                    <h3 className="q-question">Which extras would you like?</h3>
                    <div className="q-services">
                      {serviceOptions.map((v) => (
                        <label
                          className={`q-service ${draft.services.includes(v) ? "selected" : ""}`}
                          key={v}
                        >
                          <Checkbox
                            checked={draft.services.includes(v)}
                            onCheckedChange={(checked) =>
                              update(
                                "services",
                                checked
                                  ? [...draft.services, v]
                                  : draft.services.filter((s) => s !== v),
                              )
                            }
                          />
                          <span>{v}</span>
                        </label>
                      ))}
                    </div>
                    <div className="q-fields q-after">
                      {draft.services.includes("Packing") && (
                        <Field label="How much packing help?">
                          <select
                            value={draft.packingScope}
                            onChange={(e) =>
                              update(
                                "packingScope",
                                e.target.value as QuoteDraft["packingScope"],
                              )
                            }
                          >
                            {[
                              "Not sure",
                              "Everything",
                              "Fragile items only",
                              "Selected rooms",
                            ].map((v) => (
                              <option key={v}>{v}</option>
                            ))}
                          </select>
                        </Field>
                      )}
                      {draft.services.includes("Storage") && (
                        <Field label="Storage duration">
                          <Input
                            value={draft.storageDuration}
                            maxLength={100}
                            onChange={(e) =>
                              update("storageDuration", e.target.value)
                            }
                            placeholder="e.g. 2 weeks, 1 month, not sure"
                          />
                        </Field>
                      )}
                      <Field label="Preferred move assessment">
                        <select
                          value={draft.survey}
                          onChange={(e) =>
                            update(
                              "survey",
                              e.target.value as QuoteDraft["survey"],
                            )
                          }
                        >
                          {[
                            "No preference",
                            "Phone discussion",
                            "Video walkthrough",
                            "On-site survey",
                          ].map((v) => (
                            <option key={v}>{v}</option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Budget in KES (optional)">
                        <Input
                          value={draft.budget}
                          maxLength={100}
                          onChange={(e) => update("budget", e.target.value)}
                          placeholder="Amount or range, if you have one"
                        />
                      </Field>
                      <Field label="What else should we know?" wide>
                        <Textarea
                          rows={4}
                          value={draft.notes}
                          maxLength={2000}
                          onChange={(e) => update("notes", e.target.value)}
                          placeholder="Extra stops, deadlines, unpacking preferences, building approvals, pets, or anything that matters to you."
                        />
                      </Field>
                    </div>
                  </>
                )}
                {step === 4 && (
                  <>
                    <div className="q-fields">
                      <Field label="Full name *" error={errors.name}>
                        <Input
                          value={draft.name}
                          maxLength={100}
                          autoComplete="name"
                          onChange={(e) => update("name", e.target.value)}
                          placeholder="Your full name"
                        />
                      </Field>
                      <Field
                        label="Phone / WhatsApp number *"
                        error={errors.phone}
                      >
                        <Input
                          type="tel"
                          value={draft.phone}
                          maxLength={30}
                          autoComplete="tel"
                          onChange={(e) => update("phone", e.target.value)}
                          placeholder="e.g. +254 7…"
                        />
                      </Field>
                      {/* <Field label="Email address" error={errors.email}>
                        <Input
                          type="email"
                          value={draft.email}
                          maxLength={255}
                          autoComplete="email"
                          onChange={(e) => update("email", e.target.value)}
                          placeholder="you@example.com"
                        />
                      </Field> */}
                      <Field label="Email address *" error={errors.email}>
                        <Input
                          type="email"
                          value={draft.email}
                          maxLength={255}
                          autoComplete="email"
                          aria-invalid={!!errors.email}
                          onChange={(e) => update("email", e.target.value)}
                          placeholder="you@example.com"
                        />
                      </Field>
                      <Field label="Company name (if applicable)">
                        <Input
                          value={draft.company}
                          maxLength={150}
                          autoComplete="organization"
                          onChange={(e) => update("company", e.target.value)}
                          placeholder="Your company"
                        />
                      </Field>
                    </div>
                    <h3 className="q-question">
                      How would you like to hear from us?
                    </h3>
                    <Choices
                      label="Preferred contact method"
                      value={draft.contactMethod}
                      options={["Phone", "WhatsApp", "Email"]}
                      onChange={(v) =>
                        update(
                          "contactMethod",
                          v as QuoteDraft["contactMethod"],
                        )
                      }
                    />
                    <div className="q-after">
                      <Field label="Best time to contact you">
                        <Input
                          value={draft.contactTime}
                          maxLength={100}
                          onChange={(e) =>
                            update("contactTime", e.target.value)
                          }
                          placeholder="e.g. Weekdays after 5 pm"
                        />
                      </Field>
                    </div>
                    <label className="q-check q-consent">
                      <Checkbox
                        checked={draft.consent}
                        onCheckedChange={(v) => update("consent", v === true)}
                      />
                      <span>
                        I agree that County Movers may use these details to
                        prepare my quotation and contact me about this move.
                      </span>
                    </label>
                    {errors.consent && (
                      <p className="q-error">{errors.consent}</p>
                    )}
                    <p className="q-muted">
                      <ShieldCheck size={15} />
                      Your move details are not displayed publicly.
                    </p>
                  </>
                )}
                {step === 5 && (
                  <>
                    <div className="q-review">
                      {[
                        {
                          title: "The move",
                          edit: 0,
                          body: `${draft.moveType} · ${draft.size}\n${draft.date || "Date to be arranged"}${draft.flexible ? " · Flexible dates" : ""} · ${draft.time}`,
                        },
                        {
                          title: "The journey",
                          edit: 1,
                          body: `${draft.from.area} → ${draft.to.area}\nFrom: ${draft.from.address || "Exact address to confirm"} · ${draft.from.property}, floor ${draft.from.floor} · ${draft.from.lift} · Parking: ${draft.from.parking}\n${draft.from.access ? `Pickup access: ${draft.from.access}\n` : ""}To: ${draft.to.address || "Exact address to confirm"} · ${draft.to.property}, floor ${draft.to.floor} · ${draft.to.lift} · Parking: ${draft.to.parking}${draft.to.access ? `\nDelivery access: ${draft.to.access}` : ""}`,
                        },
                        {
                          title: `Your belongings · ${total} items`,
                          edit: 2,
                          body: `${
                            Object.entries(draft.inventory)
                              .filter(([, n]) => n > 0)
                              .map(([item, n]) => `${n} × ${item}`)
                              .join(", ") || "Inventory to be confirmed"
                          }${draft.inventoryNotes ? `\nOther items: ${draft.inventoryNotes}` : ""}${draft.specialItems ? `\nSpecial care: ${draft.specialItems}` : ""}`,
                        },
                        {
                          title: "The extra care",
                          edit: 3,
                          body: `${draft.services.join(", ") || "Loading & transportation only"}\nAssessment: ${draft.survey}${draft.services.includes("Packing") ? `\nPacking: ${draft.packingScope}` : ""}${draft.services.includes("Storage") ? `\nStorage: ${draft.storageDuration || "Duration to confirm"}` : ""}${draft.budget ? `\nBudget (KES): ${draft.budget}` : ""}${draft.notes ? `\nNotes: ${draft.notes}` : ""}`,
                        },
                        {
                          title: "Your contact details",
                          edit: 4,
                          body: `${draft.name}${draft.company ? ` · ${draft.company}` : ""}\n${draft.phone}${draft.email ? `\n${draft.email}` : ""}\nPreferred contact: ${draft.contactMethod} · ${draft.contactTime || "Any time"}\nConsent to quote-related contact: Yes`,
                        },
                      ].map((v) => (
                        <section key={v.title}>
                          <div>
                            <h3>{v.title}</h3>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => go(v.edit)}
                              aria-label={`Edit ${v.title}`}
                            >
                              <Pencil />
                              Edit
                            </Button>
                          </div>
                          <p>{v.body}</p>
                        </section>
                      ))}
                    </div>
                    <p className="q-disclaimer">
                      <ShieldCheck size={19} />
                      No payment required. Your quotation and moving date will
                      be confirmed after reviewing the details.
                    </p>
                  </>
                )}
                {Object.keys(errors).length > 0 && (
                  <p className="q-error q-validation" role="alert">
                    {errors.submit ||
                      "Please check the highlighted details before continuing."}
                  </p>
                )}
                <div className="q-form-footer">
                  <div>
                    {step > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        disabled={busy}
                        onClick={() => go(step - 1)}
                      >
                        <ArrowLeft />
                        Back
                      </Button>
                    )}
                  </div>
                  <Button type="submit" className="q-next" disabled={busy}>
                    {busy ? (
                      <>
                        <LoaderCircle className="animate-spin" />
                        Sending…
                      </>
                    ) : step === 5 ? (
                      <>
                        Send my quote request
                        <ArrowRight />
                      </>
                    ) : (
                      <>
                        Continue
                        <ArrowRight />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
            <div className="q-bottom-note">
              <Truck size={17} />
              <span>
                County Movers · Donholm, Nairobi
                <br />
                Home & office moves across Kenya, subject to availability.
              </span>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
