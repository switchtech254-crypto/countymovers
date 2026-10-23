import nodemailer, { type Transporter } from "nodemailer";

let transporter: Transporter | null = null;

function getTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) throw new Error("smtp not configured");
  const port = Number(SMTP_PORT) || 587;
  transporter ??= nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    requireTLS: port !== 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 15000,
  });
  return transporter;
}

export const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

export const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function owners() {
  return (process.env.QUOTE_OWNER_EMAIL ?? "").split(",").map((s) => s.trim()).filter(Boolean);
}

export async function sendMail(opts: {
  fromName: string;
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}) {
  await getTransporter().sendMail({
    from: `${opts.fromName} <${process.env.SMTP_USER}>`,
    to: opts.to,
    subject: oneLine(opts.subject),
    text: opts.text,
    ...(opts.html ? { html: opts.html } : {}),
    ...(opts.replyTo ? { replyTo: opts.replyTo } : {}),
  });
}

export async function sendTelegram(text: string) {
  const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env;
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) throw new Error("telegram not configured");
  const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: text.slice(0, 4000) }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`telegram ${res.status}: ${await res.text()}`);
}