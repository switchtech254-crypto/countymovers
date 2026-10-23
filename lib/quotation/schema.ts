import { z } from "zod";

const text = (max = 300) => z.string().trim().max(max);
export const moveTypes = ["Home", "Office", "Selected items"] as const;
export const serviceOptions = [
  "Packing",
  "Unpacking",
  "Furniture dismantling & reassembly",
  "Appliance installation",
  "Storage",
  "Packing materials",
] as const;
export const inventoryGroups = {
  "Living room": [
    "Sofa",
    "Armchair",
    "Coffee table",
    "TV",
    "TV stand",
    "Bookshelf",
  ],
  Bedroom: ["Bed", "Mattress", "Wardrobe", "Dresser", "Bedside table"],
  Kitchen: [
    "Fridge",
    "Cooker",
    "Microwave",
    "Dining table",
    "Dining chair",
    "Washing machine",
  ],
  Office: [
    "Desk",
    "Office chair",
    "Computer",
    "Printer",
    "Filing cabinet",
    "Meeting table",
  ],
  "Boxes & extras": [
    "Small box",
    "Medium box",
    "Large box",
    "Suitcase",
    "Outdoor furniture",
  ],
} as const;
export const inventoryNames = Object.values(inventoryGroups).flat();
const addressSchema = z.object({
  area: text().min(2, "Enter the neighbourhood or town."),
  address: text(500),
  property: z.enum([
    "Apartment",
    "House",
    "Office building",
    "Warehouse",
    "Other",
  ]),
  floor: z.number().int().min(0).max(100),
  lift: z.enum(["Not needed", "Available", "No lift", "Not sure"]),
  parking: z.enum([
    "At the entrance",
    "Short walk",
    "Long walk / restricted",
    "Not sure",
  ]),
  access: text(1000),
});
export const quotationSchema = z
  .object({
    moveType: z.enum(moveTypes),
    size: z.enum([
      "Studio",
      "1 bedroom",
      "2 bedrooms",
      "3 bedrooms",
      "4+ bedrooms",
      "Small office (1–10 people)",
      "Medium office (11–30 people)",
      "Large office (31+ people)",
      "A few items",
      "A full load",
      "Not sure",
    ]),
    date: text(10).refine(
      (v) =>
        !v || (/^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v))),
      "Choose a valid date.",
    ),
    flexible: z.boolean(),
    time: z.enum(["Morning", "Afternoon", "Any time"]),
    from: addressSchema,
    to: addressSchema,
    inventory: z.record(
      z.enum(inventoryNames as [string, ...string[]]),
      z.number().int().min(0).max(99),
    ),
    specialItems: text(2000),
    inventoryNotes: text(2000),
    services: z.array(z.enum(serviceOptions)).max(6),
    storageDuration: text(100),
    packingScope: z.enum([
      "Everything",
      "Fragile items only",
      "Selected rooms",
      "Not sure",
    ]),
    survey: z.enum([
      "Phone discussion",
      "Video walkthrough",
      "On-site survey",
      "No preference",
    ]),
    budget: text(100),
    notes: text(2000),
    name: text(100).min(2, "Enter your full name."),
    phone: text(30)
      .regex(/^\+?[\d\s()-]{7,30}$/, "Enter a valid phone number.")
      .refine(
        (v) => v.replace(/\D/g, "").length >= 7,
        "Enter a valid phone number.",
      ),
    email: text(255)
  .min(1, "Enter your email address.")
  .refine(
    (v) => z.string().email().safeParse(v).success,
    "Enter a valid email address.",
  ),
    company: text(150),
    contactMethod: z.enum(["Phone", "WhatsApp", "Email"]),
    contactTime: text(100),
    consent: z.literal(true, {
      errorMap: () => ({
        message: "Please agree to being contacted about this quote.",
      }),
    }),
  })
  .superRefine((v, ctx) => {
    if (!v.date && !v.flexible)
      ctx.addIssue({
        code: "custom",
        path: ["date"],
        message: "Choose a moving date or select flexible dates.",
      });
    if (v.contactMethod === "Email" && !v.email)
      ctx.addIssue({
        code: "custom",
        path: ["email"],
        message: "Add your email address for email contact.",
      });
  });
export type QuoteDraft = Omit<
  z.infer<typeof quotationSchema>,
  "moveType" | "size" | "consent"
> & {
  moveType: z.infer<typeof quotationSchema>["moveType"] | "";
  size: string;
  consent: boolean;
};
const address = {
  area: "",
  address: "",
  property: "Apartment" as const,
  floor: 0,
  lift: "Not sure" as const,
  parking: "Not sure" as const,
  access: "",
};
export const initialQuote: QuoteDraft = {
  moveType: "",
  size: "",
  date: "",
  flexible: false,
  time: "Any time",
  from: { ...address },
  to: { ...address },
  inventory: {},
  specialItems: "",
  inventoryNotes: "",
  services: [],
  storageDuration: "",
  packingScope: "Not sure",
  survey: "No preference",
  budget: "",
  notes: "",
  name: "",
  phone: "",
  email: "",
  company: "",
  contactMethod: "Phone",
  contactTime: "",
  consent: false,
};
export const stepFields = [
  ["moveType", "size", "date", "flexible", "time"],
  ["from", "to"],
  ["inventory", "specialItems", "inventoryNotes"],
  ["services", "storageDuration", "packingScope", "survey", "budget", "notes"],
  [
    "name",
    "phone",
    "email",
    "company",
    "contactMethod",
    "contactTime",
    "consent",
  ],
] as const;
export function stepErrors(draft: QuoteDraft, step: number) {
  const result = quotationSchema.safeParse(draft);
  if (result.success) return {};
  const fields: readonly string[] = stepFields[step] ?? [];
  return Object.fromEntries(
    result.error.issues
      .filter((i) => fields.includes(String(i.path[0])))
      .map((i) => [i.path.join("."), i.message]),
  );
}
export function quoteSummary(d: QuoteDraft) {
  const location = (a: QuoteDraft["from"]) =>
    `${a.area}, ${a.address || "Exact address to confirm"}\n${a.property}, floor ${a.floor}, lift: ${a.lift}, parking: ${a.parking}\nAccess: ${a.access || "None specified"}`;
  return `COUNTY MOVERS — QUOTATION REQUEST\n\n${d.moveType} · ${d.size}\nDate: ${d.date || "To be arranged"}${d.flexible ? " (flexible)" : ""} · ${d.time}\n\nFROM\n${location(d.from)}\n\nTO\n${location(d.to)}\n\nINVENTORY\n${
    Object.entries(d.inventory)
      .filter(([, n]) => n > 0)
      .map(([item, n]) => `${item}: ${n}`)
      .join("\n") || "To be confirmed"
  }\nOther items: ${d.inventoryNotes || "None specified"}\nSpecial handling: ${d.specialItems || "None specified"}\n\nSERVICES\n${d.services.join(", ") || "Loading & transportation only"}\nPacking scope: ${d.packingScope}\nStorage duration: ${d.storageDuration || "Not requested"}\nSurvey: ${d.survey}\nBudget (KES): ${d.budget || "Not specified"}\nNotes: ${d.notes || "None"}\n\nCONTACT\n${d.name}\n${d.company}\n${d.phone}\n${d.email}\nPreferred contact: ${d.contactMethod} · ${d.contactTime || "Any time"}\nConsent to quote-related contact: Yes\n\nThis is a quotation request, not a confirmed booking.`;
}
