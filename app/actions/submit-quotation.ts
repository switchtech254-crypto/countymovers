"use server";

import nodemailer, { type Transporter } from "nodemailer";
import { quotationSchema, quoteSummary } from "@/lib/quotation/schema";
import { PHONE } from "@/lib/site";

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  QUOTE_OWNER_EMAIL,
  TELEGRAM_BOT_TOKEN,
  TELEGRAM_CHAT_ID,
} = process.env;

let transporter: Transporter | null = null;

function getTransporter() {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) throw new Error("smtp not configured");
  const port = Number(SMTP_PORT) || 587;
  transporter ??= nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465, // 465 = implicit TLS
    requireTLS: port !== 465, // 587 = STARTTLS, and refuse to send unencrypted
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 15000,
  });
  return transporter;
}

const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();
const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");


type Quote = NonNullable<ReturnType<typeof quotationSchema.safeParse>["data"]>;
type Section = { title: string; rows: [label: string, value: string][] };

const val = (v: unknown) => {
  const s = v === undefined || v === null ? "" : String(v).trim();
  return s || "—";
};

/** Every field of the entry, grouped like the wizard's steps. Text, HTML and JSON all come from this. */
function buildSections(q: Quote, reference: string): Section[] {
  const place = (p: Quote["from"]): [string, string][] => [
    ["Area", val(p.area)],
    ["Address", val(p.address)],
    ["Property type", val(p.property)],
    ["Floor", val(p.floor)],
    ["Lift", val(p.lift)],
    ["Truck parking", val(p.parking)],
    ["Access notes", val(p.access)],
  ];

  const items = Object.entries(q.inventory ?? {}).filter(([, n]) => n > 0);
  const totalItems = items.reduce((sum, [, n]) => sum + n, 0);

  return [
    {
      title: "Contact",
      rows: [
        ["Reference", reference],
        ["Name", val(q.name)],
        ["Phone / WhatsApp", val(q.phone)],
        ["Email", val(q.email)],
        ["Company", val(q.company)],
        ["Preferred contact", val(q.contactMethod)],
        ["Best time to contact", val(q.contactTime)],
        ["Consent given", q.consent ? "Yes" : "No"],
      ],
    },
    {
      title: "The move",
      rows: [
        ["Move type", val(q.moveType)],
        ["Size", val(q.size)],
        ["Preferred date", val(q.date)],
        ["Dates flexible", q.flexible ? "Yes" : "No"],
        ["Time of day", val(q.time)],
      ],
    },
    { title: "Moving from", rows: place(q.from) },
    { title: "Moving to", rows: place(q.to) },
    {
      title: `Belongings (${totalItems} items)`,
      rows: [
        ...items.map(([item, n]): [string, string] => [item, String(n)]),
        ["Other belongings", val(q.inventoryNotes)],
        ["Special care items", val(q.specialItems)],
      ],
    },
    {
      title: "Extras and preferences",
      rows: [
        ["Services", q.services?.length ? q.services.join(", ") : "—"],
        ["Packing scope", val(q.packingScope)],
        ["Storage duration", val(q.storageDuration)],
        ["Move assessment", val(q.survey)],
        ["Budget (KES)", val(q.budget)],
        ["Other notes", val(q.notes)],
      ],
    },
  ];
}

function sectionsToText(sections: Section[]) {
  return sections
    .map((s) => `== ${s.title.toUpperCase()} ==\n${s.rows.map(([k, v]) => `${k}: ${v}`).join("\n")}`)
    .join("\n\n");
}

function sectionsToHtml(sections: Section[], reference: string, phone: string) {
  const body = sections
    .map(
      (s) => `<h2 style="margin:24px 0 8px;font-size:15px;color:#2d3139;border-bottom:2px solid #e0b84a;padding-bottom:4px">${escapeHtml(s.title)}</h2>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;line-height:1.5">
${s.rows
  .map(
    ([k, v]) =>
      `<tr><td style="padding:5px 12px 5px 0;width:38%;vertical-align:top;color:#777d88">${escapeHtml(k)}</td><td style="padding:5px 0;vertical-align:top;white-space:pre-line">${escapeHtml(v)}</td></tr>`,
  )
  .join("\n")}
</table>`,
    )
    .join("\n");

  const tel = phone.replace(/[^\d+]/g, "");
  return `<!doctype html><html><body style="margin:0;padding:24px;background:#f4f5f7;font-family:Arial,Helvetica,sans-serif;color:#23262d">
<div style="max-width:640px;margin:0 auto;background:#fff;border-radius:10px;padding:28px">
<h1 style="margin:0 0 6px;font-size:20px">New quote request ${escapeHtml(reference)}</h1>
<p style="margin:0 0 4px"><a href="tel:${escapeHtml(tel)}" style="font-size:18px;font-weight:700;color:#b8780a">${escapeHtml(phone)}</a> &nbsp;·&nbsp; tap to call</p>
${body}
</div></body></html>`;
}








function owners() {
  return (QUOTE_OWNER_EMAIL ?? "").split(",").map((s) => s.trim()).filter(Boolean);
}

async function sendOwnerEmail(opts: {
  subject: string;
  text: string;
  html: string;
  json: string;
  reference: string;
  replyTo?: string;
}) {
  const to = owners();
  if (to.length === 0) throw new Error("owner email not configured");
  await getTransporter().sendMail({
    from: `County Movers Quotes <${SMTP_USER}>`,
    to,
    subject: oneLine(opts.subject),
    text: opts.text,
    html: opts.html,
    attachments: [
      {
        filename: `quote-${opts.reference}.json`,
        content: opts.json,
        contentType: "application/json",
      },
    ],
    ...(opts.replyTo ? { replyTo: opts.replyTo } : {}),
  });
}

async function sendCustomerConfirmation(opts: {
  to: string;
  name: string;
  reference: string;
  moveType: string;
  size: string;
  date: string;
  fromArea: string;
  toArea: string;
  contactMethod: string;
}) {
  const first = oneLine(opts.name).split(" ")[0] || "there";
  const when = opts.date || "Date to be arranged";

  // Deliberately a short summary, not the full request: the address is typed by
  // whoever submitted the form, so we don't echo everything back to it.
  const lines = [
    `Reference: ${opts.reference}`,
    `Move: ${opts.moveType} (${opts.size})`,
    `Route: ${opts.fromArea} → ${opts.toArea}`,
    `Preferred date: ${when}`,
  ];

  const text =
    `Hello ${first},\n\n` +
    `Thank you for requesting a quotation from County Movers. We have received your request and will review it.\n\n` +
    `${lines.join("\n")}\n\n` +
    `We will contact you by ${opts.contactMethod.toLowerCase()} to talk through the details. ` +
    `This is a quotation request, not a confirmed booking. Pricing and availability are confirmed after we review your move.\n\n` +
    `Need to add something or change a detail? Reply to this email or call ${PHONE}. Please quote your reference.\n\n` +
    `County Movers\nDonholm, Nairobi, Kenya\n`;

  const html = `<!doctype html><html><body style="margin:0;padding:24px;background:#f4f5f7;font-family:Arial,Helvetica,sans-serif;color:#23262d">
<table role="presentation" width="100%" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:10px;overflow:hidden">
<tr><td style="background:#2d3139;padding:20px 28px;color:#ffffff;font-size:18px;font-weight:700">COUNTY MOVERS<span style="color:#e0b84a">.</span></td></tr>
<tr><td style="padding:28px">
<h1 style="margin:0 0 12px;font-size:22px">We have your request, ${escapeHtml(first)}.</h1>
<p style="margin:0 0 18px;line-height:1.6;color:#555b66">Thank you for requesting a quotation. We will review your move and contact you by <strong>${escapeHtml(opts.contactMethod.toLowerCase())}</strong> to talk through the details.</p>
<table role="presentation" width="100%" style="background:#f4f5f7;border-radius:8px;padding:14px 16px;font-size:14px;line-height:1.8">
<tr><td><strong>Reference:</strong> ${escapeHtml(opts.reference)}</td></tr>
<tr><td><strong>Move:</strong> ${escapeHtml(opts.moveType)} (${escapeHtml(opts.size)})</td></tr>
<tr><td><strong>Route:</strong> ${escapeHtml(opts.fromArea)} → ${escapeHtml(opts.toArea)}</td></tr>
<tr><td><strong>Preferred date:</strong> ${escapeHtml(when)}</td></tr>
</table>
<p style="margin:18px 0 0;font-size:13px;line-height:1.6;color:#555b66">This is a quotation request, not a confirmed booking. Pricing and availability are confirmed after we review your move.</p>
<p style="margin:14px 0 0;font-size:13px;line-height:1.6;color:#555b66">Need to add or change something? Reply to this email or call ${escapeHtml(PHONE)} and quote your reference.</p>
</td></tr>
<tr><td style="padding:16px 28px;background:#f4f5f7;font-size:12px;color:#777d88">County Movers · Donholm, Nairobi, Kenya</td></tr>
</table></body></html>`;

  await getTransporter().sendMail({
    from: `County Movers <${SMTP_USER}>`,
    to: opts.to,
    replyTo: owners()[0],
    subject: `We've received your quote request (${opts.reference})`,
    text,
    html,
  });
}

async function sendTelegram(text: string) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) throw new Error("telegram not configured");
  const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: text.slice(0, 4000) }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`telegram ${res.status}: ${await res.text()}`);
}

console.log("[env]", {
  SMTP_HOST: !!SMTP_HOST,
  SMTP_PORT: SMTP_PORT ?? "default 587",
  SMTP_USER: !!SMTP_USER,
  SMTP_PASS: !!SMTP_PASS,
  QUOTE_OWNER_EMAIL: !!QUOTE_OWNER_EMAIL,
  TELEGRAM_BOT_TOKEN: !!TELEGRAM_BOT_TOKEN,
  TELEGRAM_CHAT_ID: !!TELEGRAM_CHAT_ID,
});


export async function submitQuotation(input: {
  requestId: string;
  quote: unknown;
  website: string;
}): Promise<{ reference: string }> {
  const reference = `CM-${input.requestId.replace(/-/g, "").slice(0, 8).toUpperCase()}`;

  if (input.website) {
    console.warn("[quote] honeypot tripped, nothing sent", reference, JSON.stringify(input.website).slice(0, 80));
    return { reference };
  }

  const parsed = quotationSchema.safeParse(input.quote);
  if (!parsed.success) {
    console.error("[quote] schema rejected the entry", reference, parsed.error.issues);
    throw new Error("invalid quote");
  }
  const q = parsed.data;

  // The alert is plain strings, so it can never be blocked by the email builder
  const alert =
    `🚚 NEW QUOTE ${reference}\n` +
    `${q.name} · ${q.phone}\n` +
    `${q.moveType} (${q.size}) · ${q.date || "date TBC"}\n` +
    `${q.from.area} → ${q.to.area}\n` +
    `Prefers: ${q.contactMethod}`;

  // Building the full email must never be able to stop delivery
  let submittedAt = new Date().toISOString();
  let fullText: string;
  let fullHtml: string;
  let fullJson: string;
  try {
    submittedAt = new Intl.DateTimeFormat("en-KE", {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: "Africa/Nairobi",
    }).format(new Date());
    const sections = buildSections(q, reference);
    fullText = `Submitted: ${submittedAt} (Nairobi time)\n\n${sectionsToText(sections)}`;
    fullHtml = sectionsToHtml(sections, reference, q.phone);
    fullJson = JSON.stringify({ reference, submittedAt, ...q }, null, 2);
  } catch (err) {
    console.error("[quote] email builder failed, sending raw entry instead", reference, err);
    fullJson = JSON.stringify({ reference, submittedAt, ...q }, null, 2);
    fullText = `Submitted: ${submittedAt}\n\n${fullJson}`;
    fullHtml = `<pre style="font:13px/1.5 monospace;white-space:pre-wrap">${escapeHtml(fullText)}</pre>`;
  }

  const [telegram, ownerEmail, confirmation] = await Promise.allSettled([
    sendTelegram(alert),
    sendOwnerEmail({
      subject: `New quote ${reference}: ${q.name} · ${q.phone} · ${q.from.area} → ${q.to.area}`,
      text: fullText,
      html: fullHtml,
      json: fullJson,
      reference,
      replyTo: q.email || undefined,
    }),
    q.email
      ? sendCustomerConfirmation({
          to: q.email,
          name: q.name,
          reference,
          moveType: q.moveType,
          size: q.size,
          date: q.date,
          fromArea: q.from.area,
          toArea: q.to.area,
          contactMethod: q.contactMethod,
        })
      : Promise.resolve(),
  ]);

  console.log("[quote]", reference, {
    telegram: telegram.status,
    ownerEmail: ownerEmail.status,
    confirmation: q.email ? confirmation.status : "skipped (no email given)",
  });

  if (telegram.status === "rejected") console.error("[quote] Telegram failed", reference, telegram.reason);
  if (ownerEmail.status === "rejected") console.error("[quote] Owner email failed", reference, ownerEmail.reason);
  if (confirmation.status === "rejected") console.error("[quote] Customer confirmation failed", reference, confirmation.reason);

  if (telegram.status === "rejected" && ownerEmail.status === "rejected") {
    throw new Error("delivery failed");
  }
  return { reference };
}