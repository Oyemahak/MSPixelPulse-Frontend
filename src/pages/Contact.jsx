// src/pages/Contact.jsx
import { useState } from "react";
import Container from "../components/layout/Container.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import { FORMS_BASE } from "@/lib/forms.js";
import { useTheme } from "@/lib/theme.js";
import Meta from "@/components/Meta.jsx";
import ContactActions from "@/components/ContactActions.jsx";
import { site } from "@/data/site.js";

/* Icons */
import { LuCalendar, LuSend } from "react-icons/lu";

export default function Contact() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [form, setForm] = useState({
    name: "",
    email: "",
    industry: "",
    service: "",
    websiteType: "",
    projectKind: "New website",
    budget: "",
    timeline: "",
    currentUrl: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [note, setNote] = useState("");

  async function submit(e) {
    e.preventDefault();
    setNote("");

    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();

    if (!name || !email || !message) {
      setNote("Please fill out your name, email, and project details.");
      return;
    }

    const enrichedMessage = [
      `Industry: ${form.industry || "Not specified"}`,
      `Service needed: ${form.service || "Not specified"}`,
      `Website type: ${form.websiteType || "Not specified"}`,
      `Project type: ${form.projectKind || "Not specified"}`,
      `Budget range: ${form.budget || "Not specified"}`,
      `Timeline: ${form.timeline || "Not specified"}`,
      `Current URL: ${form.currentUrl || "Not provided"}`,
      `Source: contact page`,
      `Source URL: ${typeof window !== "undefined" ? window.location.href : "/contact"}`,
      "",
      message,
    ].join("\n");

    try {
      setSubmitting(true);
      const res = await fetch(`${FORMS_BASE}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message: enrichedMessage,
          source: "contact-page",
          sourceUrl: typeof window !== "undefined" ? window.location.href : "/contact",
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || data?.message || "Failed to send");

      setNote("Thanks! Your message was sent. Please check your inbox.");
      setForm({
        name: "",
        email: "",
        industry: "",
        service: "",
        websiteType: "",
        projectKind: "New website",
        budget: "",
        timeline: "",
        currentUrl: "",
        message: "",
      });
    } catch (err) {
      setNote(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="section">
      <Container>
        <Meta
          title="Contact MSPixelPulse — Start a Website Project"
          description="Contact MSPixelPulse about website design, redesign, WordPress, React, e-commerce, maintenance, and small business website support."
          canonical="/contact"
        />
        <SectionTitle
          eyebrow="Contact"
          title={isDark ? "Tell us about your project" : "Tell us about your project"}
          align="left"
          as="h1"
        />

        <div className="grid md:grid-cols-2 gap-6">
          {/* Form */}
          <form className="space-y-3" onSubmit={submit}>
            <input
              type="text"
              autoComplete="name"
              className={
                isDark
                  ? "w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4"
                  : "w-full h-12 rounded-xl bg-white border border-slate-200 px-4 text-slate-900"
              }
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
              aria-label="Your name"
              required
            />
            <input
              type="email"
              autoComplete="email"
              className={
                isDark
                  ? "w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4"
                  : "w-full h-12 rounded-xl bg-white border border-slate-200 px-4 text-slate-900"
              }
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
              aria-label="Email"
              required
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="text"
                className={isDark ? "w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4" : "w-full h-12 rounded-xl bg-white border border-slate-200 px-4 text-slate-900"}
                placeholder="Industry"
                value={form.industry}
                onChange={(e) => setForm((s) => ({ ...s, industry: e.target.value }))}
                aria-label="Industry"
              />
              <select
                className={isDark ? "w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4" : "w-full h-12 rounded-xl bg-white border border-slate-200 px-4 text-slate-900"}
                value={form.service}
                onChange={(e) => setForm((s) => ({ ...s, service: e.target.value }))}
                aria-label="Service needed"
              >
                <option value="">Service needed</option>
                <option>New website design</option>
                <option>Website redesign</option>
                <option>E-commerce</option>
                <option>SEO and content</option>
                <option>Maintenance and care</option>
              </select>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <select
                className={isDark ? "w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4" : "w-full h-12 rounded-xl bg-white border border-slate-200 px-4 text-slate-900"}
                value={form.websiteType}
                onChange={(e) => setForm((s) => ({ ...s, websiteType: e.target.value }))}
                aria-label="Website type"
              >
                <option value="">Website type</option>
                <option>Business Website</option>
                <option>E-commerce</option>
                <option>Landing Page</option>
                <option>Portfolio</option>
                <option>Booking Website</option>
                <option>Web Application</option>
              </select>
              <select
                className={isDark ? "w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4" : "w-full h-12 rounded-xl bg-white border border-slate-200 px-4 text-slate-900"}
                value={form.projectKind}
                onChange={(e) => setForm((s) => ({ ...s, projectKind: e.target.value }))}
                aria-label="New website or redesign"
              >
                <option>New website</option>
                <option>Redesign existing website</option>
                <option>Improve existing website</option>
              </select>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <select
                className={isDark ? "w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4" : "w-full h-12 rounded-xl bg-white border border-slate-200 px-4 text-slate-900"}
                value={form.budget}
                onChange={(e) => setForm((s) => ({ ...s, budget: e.target.value }))}
                aria-label="Budget range"
              >
                <option value="">Budget range</option>
                <option>Under $2,000</option>
                <option>$2,000 - $4,000</option>
                <option>$4,000 - $8,000</option>
                <option>$8,000+</option>
              </select>
              <select
                className={isDark ? "w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4" : "w-full h-12 rounded-xl bg-white border border-slate-200 px-4 text-slate-900"}
                value={form.timeline}
                onChange={(e) => setForm((s) => ({ ...s, timeline: e.target.value }))}
                aria-label="Timeline"
              >
                <option value="">Timeline</option>
                <option>ASAP</option>
                <option>2-4 weeks</option>
                <option>1-2 months</option>
                <option>Flexible</option>
              </select>
            </div>
            <input
              type="url"
              className={isDark ? "w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4" : "w-full h-12 rounded-xl bg-white border border-slate-200 px-4 text-slate-900"}
              placeholder="Current website URL, if any"
              value={form.currentUrl}
              onChange={(e) => setForm((s) => ({ ...s, currentUrl: e.target.value }))}
              aria-label="Current website URL"
            />
            <textarea
              rows={6}
              className={
                isDark
                  ? "w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3"
                  : "w-full rounded-xl bg-white border border-slate-200 px-4 py-3 text-slate-900"
              }
              placeholder="Tell us what you want the website to do"
              value={form.message}
              onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))}
              aria-label="Your message"
              required
            />

            <div className="flex flex-wrap items-center gap-3">
              <button
                className={
                  isDark
                    ? "btn btn-primary"
                    : "inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-[#2563ff] hover:bg-[#2056da] text-white font-semibold"
                }
                disabled={submitting}
                type="submit"
              >
                <LuSend className="mr-1 h-5 w-5" aria-hidden="true" />
                {submitting ? "Sending…" : "Send message"}
              </button>

              {note && (
                <div
                  className={
                    isDark
                      ? "text-sm text-white/70 min-w-full"
                      : "text-sm text-slate-600 min-w-full"
                  }
                >
                  {note}
                </div>
              )}
            </div>
          </form>

          {/* Side card */}
          {isDark ? (
            <div className="card-surface p-5 rounded-2xl">
              <div className="font-black">How we’ll respond</div>
              <ul className="text-textSub mt-3 space-y-2 text-sm">
                <li>• You’ll get a reply within 1 business day.</li>
                <li>• We’ll invite you to the client portal if it’s a fit.</li>
                <li>• You can track progress, files, and discussions in one place.</li>
              </ul>
              <div className="mt-5 space-y-2 text-sm text-textSub">
                <a className="block hover:text-white" href={site.phoneHref}>{site.phoneDisplay}</a>
                <a className="block hover:text-white" href={`mailto:${site.email}`}>{site.email}</a>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
              <div className="font-semibold text-slate-900">How we’ll respond</div>
              <ul className="text-slate-600 mt-3 space-y-2 text-sm">
                <li>• You’ll get a reply within 1 business day.</li>
                <li>• We’ll invite you to the client portal if it’s a fit.</li>
                <li>• You can track progress, files, and discussions in one place.</li>
              </ul>
              <div className="mt-5 space-y-2 text-sm text-slate-600">
                <a className="block hover:text-slate-950" href={site.phoneHref}>{site.phoneDisplay}</a>
                <a className="block hover:text-slate-950" href={`mailto:${site.email}`}>{site.email}</a>
              </div>
            </div>
          )}
        </div>

        {/* Inline CTA */}
        {isDark ? (
          <div className="mt-12 card-surface p-6 md:p-8 rounded-2xl grid md:grid-cols-[1fr_auto_auto] gap-4 items-center glass-hover">
            <div>
              <h3 className="text-2xl font-black">Have a project in mind?</h3>
              <p className="text-textSub mt-1 text-[16px] md:text-[18px] leading-relaxed">
                Tell us your goals — we’ll propose the simplest path to launch.
              </p>
            </div>

            <ContactActions
              dark={isDark}
              whatsappLabel="Chat on WhatsApp"
              message="Hi MSPixelPulse, I would like to discuss a website project."
            />

            <a
              className="btn btn-outline"
              href="https://calendly.com/mspixelpulse/30min"
              target="_blank"
              rel="noreferrer"
            >
              <LuCalendar className="mr-2 h-5 w-5" aria-hidden="true" />
              Book appointment
            </a>
          </div>
        ) : (
          <div className="mt-12 rounded-2xl bg-white border border-slate-200 shadow-sm p-6 md:p-8 grid md:grid-cols-[1fr_auto_auto] gap-4 items-center">
            <div>
              <h3 className="text-2xl font-black text-slate-900">
                Have a project in mind?
              </h3>
              <p className="text-slate-500 mt-1">
                Tell us your goals — we’ll propose the simplest path to launch.
              </p>
            </div>

            <ContactActions
              dark={isDark}
              whatsappLabel="Chat on WhatsApp"
              message="Hi MSPixelPulse, I would like to discuss a website project."
            />

            <a
              className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold shadow-sm"
              href="https://calendly.com/mspixelpulse/30min"
              target="_blank"
              rel="noreferrer"
            >
              <LuCalendar className="h-5 w-5" aria-hidden="true" />
              Book appointment
            </a>
          </div>
        )}
      </Container>
    </section>
  );
}
