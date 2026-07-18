// Vercel Serverless Function: /api/contact
/* global process */
import { Resend } from "resend";

// Simple 15s per-IP cooldown
const hits = new Map();
const MAX_LENGTHS = {
  inquiryType: 80,
  name: 120,
  email: 254,
  message: 12000,
  phone: 80,
  businessName: 180,
  service: 180,
  source: 120,
  sourceTitle: 200,
  sourceSlug: 200,
  sourceUrl: 1000,
};

function sendJson(res, status, headers, body) {
  res.writeHead(status, {
    ...headers,
    "Content-Type": "application/json; charset=utf-8",
  });
  return res.end(JSON.stringify(body));
}

function clean(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function rateLimited(ip) {
  const now = Date.now();
  const last = hits.get(ip) || 0;
  hits.set(ip, now);
  return now - last < 15000;
}

export default async function handler(req, res) {
  const headers = {
    "Access-Control-Allow-Origin": "*", // dev: allow localhost to hit prod function
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (req.method === "OPTIONS") {
    res.writeHead(204, headers);
    return res.end();
  }
  if (req.method !== "POST") {
    return sendJson(res, 405, headers, { error: "Method not allowed" });
  }

  try {
    const ip =
      (req.headers["x-forwarded-for"] || "").split(",")[0] ||
      req.socket?.remoteAddress ||
      "unknown";
    if (rateLimited(ip)) {
      return sendJson(res, 429, headers, { error: "Too many requests, please wait a moment." });
    }

    const body = req.body && typeof req.body === "object" ? req.body : {};
    const inquiryType = clean(body.inquiryType, MAX_LENGTHS.inquiryType) || "Website Inquiry";
    const name = clean(body.name, MAX_LENGTHS.name);
    const email = clean(body.email, MAX_LENGTHS.email);
    const message = clean(body.message, MAX_LENGTHS.message);
    const phone = clean(body.phone, MAX_LENGTHS.phone);
    const businessName = clean(body.businessName, MAX_LENGTHS.businessName);
    const service = clean(body.service, MAX_LENGTHS.service);
    const source = clean(body.source, MAX_LENGTHS.source);
    const sourceTitle = clean(body.sourceTitle, MAX_LENGTHS.sourceTitle);
    const sourceSlug = clean(body.sourceSlug, MAX_LENGTHS.sourceSlug);
    const sourceUrl = clean(body.sourceUrl, MAX_LENGTHS.sourceUrl);
    const _hp = clean(body._hp, 200);
    if (_hp) {
      return sendJson(res, 200, headers, { ok: true });
    }
    if (!name || !email || !message) {
      return sendJson(res, 400, headers, { error: "Please fill out all required fields." });
    }
    if (!validEmail(email)) {
      return sendJson(res, 400, headers, { error: "Please enter a valid email address." });
    }

    const to = process.env.FORMS_TO_EMAIL;
    const from = process.env.FORMS_FROM_EMAIL || "MSPixelPulse <no-reply@mspixelpulse.com>";
    if (!process.env.RESEND_API_KEY || !to) {
      console.error("[contact] missing required email configuration");
      return sendJson(res, 503, headers, {
        error: "The contact service is temporarily unavailable. Please try again later.",
      });
    }

    const pretty = `
${inquiryType}

Name: ${name}
Email: ${email}
Business: ${businessName || "Not provided"}
Phone: ${phone || "Not provided"}
Service: ${service || "Not specified"}
Source: ${source || "Not specified"}
Source title: ${sourceTitle || "Not specified"}
Source slug: ${sourceSlug || "Not specified"}
Source URL: ${sourceUrl || "Not specified"}

Message:
${message}
IP: ${ip}
    `.trim();

    const html = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#0f172a;line-height:1.6">
        <h2 style="margin:0 0 8px">${escapeHTML(inquiryType)}</h2>
        <p><strong>Name:</strong> ${escapeHTML(name)}</p>
        <p><strong>Email:</strong> <a href="mailto:${escapeAttr(email)}">${escapeHTML(email)}</a></p>
        <p><strong>Business:</strong> ${escapeHTML(businessName || "Not provided")}</p>
        <p><strong>Phone:</strong> ${escapeHTML(phone || "Not provided")}</p>
        <p><strong>Service:</strong> ${escapeHTML(service || "Not specified")}</p>
        <p><strong>Source:</strong> ${escapeHTML(source || "Not specified")}</p>
        <p><strong>Source title:</strong> ${escapeHTML(sourceTitle || "Not specified")}</p>
        <p><strong>Source slug:</strong> ${escapeHTML(sourceSlug || "Not specified")}</p>
        <p><strong>Source URL:</strong> ${sourceUrl ? `<a href="${escapeAttr(sourceUrl)}">${escapeHTML(sourceUrl)}</a>` : "Not specified"}</p>
        <p style="margin:12px 0 4px"><strong>Message:</strong></p>
        <div style="white-space:pre-wrap;border:1px solid #e5e7eb;background:#f9fafb;border-radius:8px;padding:12px">${escapeHTML(message)}</div>
        <p style="margin-top:12px;color:#64748b;font-size:12px">IP: ${escapeHTML(ip)}</p>
      </div>
    `;

    const resend = new Resend(process.env.RESEND_API_KEY);
    const result = await resend.emails.send({
      from,
      to,
      subject: `${inquiryType}: ${name}`,
      text: pretty,
      html,
      reply_to: email,
    });
    if (result?.error) {
      throw new Error(result.error.message || "Email provider rejected the request");
    }

    return sendJson(res, 201, headers, { ok: true, message: "Sent" });
  } catch (err) {
    console.error("[contact] send error:", err);
    return sendJson(res, 500, headers, {
      error: "Failed to send message. Please try again later.",
    });
  }
}

function escapeHTML(s = "") {
  return String(s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
}
function escapeAttr(s = "") {
  return escapeHTML(s).replace(/"/g, "&quot;");
}
