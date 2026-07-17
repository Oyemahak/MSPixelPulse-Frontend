// src/pages/Contact.jsx
import { useState } from "react";
import Container from "../components/layout/Container.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import { FORMS_BASE } from "@/lib/forms.js";
import { useTheme } from "@/lib/theme.js";
import Meta from "@/components/Meta.jsx";
import { seoPages } from "@/data/seoPages.js";
import ContactActions from "@/components/ContactActions.jsx";
import SocialContactLinks from "@/components/SocialContactLinks.jsx";

/* Icons */
import { LuCalendar, LuSend } from "react-icons/lu";

export default function Contact() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const fieldClass = isDark
    ? "w-full min-h-12 rounded-xl bg-white/5 border border-white/10 px-4 text-white"
    : "w-full min-h-12 rounded-xl bg-white/80 border border-slate-200 px-4 text-slate-900";

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
        <Meta {...seoPages.contact} />
        <SectionTitle
          eyebrow="Contact"
          title={isDark ? "Tell us about your project" : "Tell us about your project"}
          align="left"
          as="h1"
        />

        <div className="grid md:grid-cols-2 gap-6">
          {/* Form */}
          <form className="contact-form-panel" onSubmit={submit}>
            <label className="contact-field">
              <span>Your name</span>
              <input type="text" autoComplete="name" className={fieldClass} placeholder="How should we address you?" value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} required />
            </label>
            <label className="contact-field">
              <span>Email address</span>
              <input type="email" autoComplete="email" className={fieldClass} placeholder="you@business.ca" value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} required />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="contact-field">
                <span>Industry</span>
                <input type="text" className={fieldClass} placeholder="e.g. Home services" value={form.industry} onChange={(e) => setForm((s) => ({ ...s, industry: e.target.value }))} />
              </label>
              <label className="contact-field">
                <span>Service needed</span>
                <select className={fieldClass} value={form.service} onChange={(e) => setForm((s) => ({ ...s, service: e.target.value }))}>
                  <option value="">Choose a service</option>
                  <option>New website design</option><option>Website redesign</option><option>E-commerce</option><option>SEO and content</option><option>Maintenance and care</option>
                </select>
              </label>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="contact-field">
                <span>Website type</span>
                <select className={fieldClass} value={form.websiteType} onChange={(e) => setForm((s) => ({ ...s, websiteType: e.target.value }))}>
                  <option value="">Choose a website type</option><option>Business Website</option><option>E-commerce</option><option>Landing Page</option><option>Portfolio</option><option>Booking Website</option><option>Web Application</option>
                </select>
              </label>
              <label className="contact-field">
                <span>Project type</span>
                <select className={fieldClass} value={form.projectKind} onChange={(e) => setForm((s) => ({ ...s, projectKind: e.target.value }))}>
                  <option>New website</option><option>Redesign existing website</option><option>Improve existing website</option>
                </select>
              </label>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="contact-field">
                <span>Budget range</span>
                <select className={fieldClass} value={form.budget} onChange={(e) => setForm((s) => ({ ...s, budget: e.target.value }))}>
                  <option value="">Choose a range</option><option>Under $2,000</option><option>$2,000 - $4,000</option><option>$4,000 - $8,000</option><option>$8,000+</option>
                </select>
              </label>
              <label className="contact-field">
                <span>Preferred timeline</span>
                <select className={fieldClass} value={form.timeline} onChange={(e) => setForm((s) => ({ ...s, timeline: e.target.value }))}>
                  <option value="">Choose a timeline</option><option>ASAP</option><option>2-4 weeks</option><option>1-2 months</option><option>Flexible</option>
                </select>
              </label>
            </div>
            <label className="contact-field">
              <span>Current website URL <small>(optional)</small></span>
              <input type="url" className={fieldClass} placeholder="https://" value={form.currentUrl} onChange={(e) => setForm((s) => ({ ...s, currentUrl: e.target.value }))} />
            </label>
            <label className="contact-field">
              <span>Project details</span>
              <textarea rows={6} className={`${fieldClass} min-h-40 py-3`} placeholder="Tell us what the website should help your customers do." value={form.message} onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))} required />
            </label>

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
                  role="status"
                  aria-live="polite"
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
              <h2 className="font-bold">How we’ll respond</h2>
              <ul className="text-textSub mt-3 space-y-2 text-sm">
                <li>• We’ll review the details and reply using the email you provide.</li>
                <li>• We’ll invite you to the client portal if it’s a fit.</li>
                <li>• You can track progress, files, and discussions in one place.</li>
              </ul>
              <div className="mt-5 space-y-2 text-sm text-textSub">
                <SocialContactLinks variant="list" />
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
              <h2 className="font-semibold text-slate-900">How we’ll respond</h2>
              <ul className="text-slate-600 mt-3 space-y-2 text-sm">
                <li>• We’ll review the details and reply using the email you provide.</li>
                <li>• We’ll invite you to the client portal if it’s a fit.</li>
                <li>• You can track progress, files, and discussions in one place.</li>
              </ul>
              <div className="mt-5 space-y-2 text-sm text-slate-600">
                <SocialContactLinks variant="list" />
              </div>
            </div>
          )}
        </div>

        {/* Inline CTA */}
        <div
          className={`contact-project-cta mt-12 ${
            isDark ? "contact-project-cta-dark" : "contact-project-cta-light"
          }`}
        >
          <div className="contact-project-copy">
            <h2>Have a project in mind?</h2>
            <p>Tell us your goals — we’ll propose the simplest path to launch.</p>
          </div>

          <div className="contact-project-actions">
            <ContactActions
              dark={isDark}
              showMessage
              className="contact-project-link-grid"
              whatsappLabel="Chat on WhatsApp"
              message="Hi MSPixelPulse, I would like to discuss a website project."
            />

            <a
              className="contact-project-book"
              href="https://calendly.com/mspixelpulse/30min"
              target="_blank"
              rel="noreferrer"
            >
              <LuCalendar className="h-5 w-5" aria-hidden="true" />
              Book appointment
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
