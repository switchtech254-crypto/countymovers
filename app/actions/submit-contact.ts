"use server";

import { z } from "zod";
import { PHONE } from "@/lib/site";
import { escapeHtml, oneLine, owners, sendMail, sendTelegram } from "@/lib/notify";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  phone: z.string().trim().min(7, "Please enter a valid phone number.").max(30),
  email: z.string().trim().email("Please enter a valid email address.").max(255),
  service: z.string().trim().min(1, "Please choose a service.").max(150),
  from: z.string().trim().min(2, "Please tell us where you are moving from.").max(300),
  to: z.string().trim().min(2, "Please tell us where you are moving to.").max(300),
  date: z.string().trim().max(20),
  details: z.string().trim().max(2000),
});

type Result = { ok: true; reference: string } | { ok: false; error: string };

export async function submitContact(input: {
  requestId: string;
  website: string; // honeypot
  [key: string]: unknown;
}): Promise<Result> {
  const reference = `CM-${String(input.requestId ?? "").replace(/[^a-z0-9]/gi, "").slice(0, 8).toUpperCase() || "WEB"}`;

  if (input.website) {
    console.warn("[contact] honeypot tripped, nothing sent", reference);
    return { ok: true, reference };
  }

  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check your details." };
  }
  const q = parsed.data;

  const submittedAt = new Intl.DateTimeFormat("en-KE", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Africa/Nairobi",
  }).format(new Date());

  const rows: [string, string][] = [
    ["Reference", reference],
    ["Name", q.name],
    ["Phone / WhatsApp", q.phone],
    ["Email", q.email],
    ["Service", q.service],
    ["Moving from", q.from],
    ["Moving to", q.to],
    ["Preferred date", q.date || "—"],
    ["Message", q.details || "—"],
  ];

  const ownerText =
    `Submitted: ${submittedAt} (Nairobi time)\nSource: website contact form\n\n` +
    rows.map(([k, v]) => `${k}: ${v}`).join("\n");

  const tel = q.phone.replace(/[^\d+]/g, "");
  const ownerHtml = `<!doctype html><html><body style="margin:0;padding:24px;background:#f4f5f7;font-family:Arial,Helvetica,sans-serif;color:#23262d">
<div style="max-width:640px;margin:0 auto;background:#fff;border-radius:10px;padding:28px">
<h1 style="margin:0 0 6px;font-size:20px">New website enquiry ${escapeHtml(reference)}</h1>
<p style="margin:0 0 16px"><a href="tel:${escapeHtml(tel)}" style="font-size:18px;font-weight:700;color:#b8780a">${escapeHtml(q.phone)}</a> &nbsp;·&nbsp; tap to call</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;line-height:1.5">
${rows
  .map(
    ([k, v]) =>
      `<tr><td style="padding:6px 12px 6px 0;width:34%;vertical-align:top;color:#777d88">${escapeHtml(k)}</td><td style="padding:6px 0;vertical-align:top;white-space:pre-line">${escapeHtml(v)}</td></tr>`,
  )
  .join("\n")}
</table>
<p style="margin:18px 0 0;font-size:12px;color:#777d88">Submitted ${escapeHtml(submittedAt)} (Nairobi time)</p>
</div></body></html>`;

  const alert =
    `📩 NEW ENQUIRY ${reference}\n` +
    `${q.name} · ${q.phone}\n` +
    `${q.service}\n` +
    `${q.from} → ${q.to}\n` +
    `${q.date || "date TBC"}\n` +
    `${q.email}`;

  const first = oneLine(q.name).split(" ")[0] || "there";
  const customerText =
    `Hello ${first},\n\n` +
    `Thank you for contacting County Movers. We have received your enquiry and will be in touch shortly.\n\n` +
    `Reference: ${reference}\nService: ${q.service}\nRoute: ${q.from} → ${q.to}\nPreferred date: ${q.date || "Date to be arranged"}\n\n` +
    `This is an enquiry, not a confirmed booking. Pricing and availability are confirmed after we review your move.\n\n` +
    `Need to add something? Reply to this email or call ${PHONE} and quote your reference.\n\n` +
    `County Movers\nDonholm, Nairobi, Kenya\n`;

  const customerHtml = `<!doctype html><html><body style="margin:0;padding:24px;background:#f4f5f7;font-family:Arial,Helvetica,sans-serif;color:#23262d">
<table role="presentation" width="100%" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:10px;overflow:hidden">
<tr><td style="background:#2d3139;padding:20px 28px;color:#ffffff;font-size:18px;font-weight:700">COUNTY MOVERS<span style="color:#e0b84a">.</span></td></tr>
<tr><td style="padding:28px">
<h1 style="margin:0 0 12px;font-size:22px">We have your enquiry, ${escapeHtml(first)}.</h1>
<p style="margin:0 0 18px;line-height:1.6;color:#555b66">Thank you for contacting County Movers. We will review your move and be in touch shortly.</p>
<table role="presentation" width="100%" style="background:#f4f5f7;border-radius:8px;padding:14px 16px;font-size:14px;line-height:1.8">
<tr><td><strong>Reference:</strong> ${escapeHtml(reference)}</td></tr>
<tr><td><strong>Service:</strong> ${escapeHtml(q.service)}</td></tr>
<tr><td><strong>Route:</strong> ${escapeHtml(q.from)} → ${escapeHtml(q.to)}</td></tr>
<tr><td><strong>Preferred date:</strong> ${escapeHtml(q.date || "Date to be arranged")}</td></tr>
</table>
<p style="margin:18px 0 0;font-size:13px;line-height:1.6;color:#555b66">This is an enquiry, not a confirmed booking. Pricing and availability are confirmed after we review your move.</p>
<p style="margin:14px 0 0;font-size:13px;line-height:1.6;color:#555b66">Need to add something? Reply to this email or call ${escapeHtml(PHONE)} and quote your reference.</p>
</td></tr>
<tr><td style="padding:16px 28px;background:#f4f5f7;font-size:12px;color:#777d88">County Movers · Donholm, Nairobi, Kenya</td></tr>
</table></body></html>`;

  const ownerList = owners();

  const [telegram, ownerEmail, confirmation] = await Promise.allSettled([
    sendTelegram(alert),
    (async () => {
      if (ownerList.length === 0) throw new Error("owner email not configured");
      await sendMail({
        fromName: "County Movers Website",
        to: ownerList,
        subject: `New enquiry ${reference}: ${q.name} · ${q.phone} · ${q.from} → ${q.to}`,
        text: ownerText,
        html: ownerHtml,
        replyTo: q.email,
      });
    })(),
    sendMail({
      fromName: "County Movers",
      to: q.email,
      subject: `We've received your enquiry (${reference})`,
      text: customerText,
      html: customerHtml,
      replyTo: ownerList[0],
    }),
  ]);

  console.log("[contact]", reference, {
    telegram: telegram.status,
    ownerEmail: ownerEmail.status,
    confirmation: confirmation.status,
  });
  if (telegram.status === "rejected") console.error("[contact] Telegram failed", reference, telegram.reason);
  if (ownerEmail.status === "rejected") console.error("[contact] Owner email failed", reference, ownerEmail.reason);
  if (confirmation.status === "rejected") console.error("[contact] Customer confirmation failed", reference, confirmation.reason);

  // Only an error if the owner received nothing
  if (telegram.status === "rejected" && ownerEmail.status === "rejected") {
    return {
      ok: false,
      error: "We couldn’t send your enquiry. Please try again, or reach us on WhatsApp or by phone.",
    };
  }
  return { ok: true, reference };
}