import { useMemo, useRef, useState } from "react";
import { LuSend } from "react-icons/lu";
import ContactActions from "@/components/ContactActions.jsx";
import { FORMS_BASE } from "@/lib/forms.js";

const initialForm = {
  name: "",
  businessName: "",
  email: "",
  phone: "",
  service: "",
  message: "",
  _hp: "",
};

export default function BlogLeadForm({ post, dark = true }) {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const lastPayload = useRef("");

  const source = useMemo(
    () => ({
      source: "blog",
      sourceTitle: post.title,
      sourceSlug: post.slug,
      sourceUrl:
        typeof window !== "undefined"
          ? window.location.href
          : `/blog/${post.slug}`,
    }),
    [post.slug, post.title]
  );

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setStatus({ type: "idle", message: "" });

    const payload = {
      ...form,
      ...source,
      subject: `Blog inquiry: ${post.title}`,
    };
    const fingerprint = JSON.stringify(payload);

    if (lastPayload.current === fingerprint) {
      setStatus({
        type: "error",
        message: "This request was already sent. Please change a detail before trying again.",
      });
      return;
    }

    if (!form.name.trim() || !form.email.trim() || !form.service.trim() || !form.message.trim()) {
      setStatus({
        type: "error",
        message: "Please add your name, email, service needed, and message.",
      });
      return;
    }

    const message = [
      `Business name: ${form.businessName || "Not provided"}`,
      `Phone: ${form.phone || "Not provided"}`,
      `Service needed: ${form.service}`,
      `Source title: ${source.sourceTitle}`,
      `Source slug: ${source.sourceSlug}`,
      `Source URL: ${source.sourceUrl}`,
      "",
      form.message,
    ].join("\n");

    try {
      setSubmitting(true);
      const response = await fetch(`${FORMS_BASE}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          message,
          phone: form.phone.trim(),
          businessName: form.businessName.trim(),
          service: form.service,
          _hp: form._hp,
          ...source,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || data?.message || "Failed to send");
      lastPayload.current = fingerprint;
      setForm(initialForm);
      setStatus({
        type: "success",
        message: "Thanks. Your request was sent and includes this article as the source.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass = dark
    ? "w-full h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-white placeholder:text-white/40"
    : "w-full h-11 rounded-xl border border-slate-200 bg-white px-4 text-slate-950 placeholder:text-slate-400";

  return (
    <section
      className={
        dark
          ? "mt-12 rounded-2xl border border-white/10 bg-white/[0.055] p-5 shadow-card backdrop-blur md:p-6"
          : "mt-12 rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm md:p-6"
      }
      aria-labelledby="blog-contact-heading"
    >
      <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr] lg:items-start">
        <div>
          <h2 id="blog-contact-heading" className={dark ? "text-2xl font-black" : "text-2xl font-black text-slate-950"}>
            Need help with your website?
          </h2>
          <p className={dark ? "mt-2 text-sm leading-6 text-textSub" : "mt-2 text-sm leading-6 text-slate-600"}>
            Tell us about your business and what you would like to improve. MSPixelPulse will review your request and get back to you.
          </p>
          <ContactActions
            dark={dark}
            className="mt-5"
            whatsappLabel="Discuss this article"
            message={`Hi MSPixelPulse, I read "${post.title}" and would like help with my website.`}
          />
        </div>

        <form className="grid gap-3" onSubmit={submit}>
          <input
            className="hidden"
            tabIndex="-1"
            autoComplete="off"
            value={form._hp}
            onChange={(event) => update("_hp", event.target.value)}
            aria-hidden="true"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <label>
              <span className="sr-only">Name</span>
              <input className={inputClass} placeholder="Name" value={form.name} onChange={(event) => update("name", event.target.value)} required />
            </label>
            <label>
              <span className="sr-only">Business name optional</span>
              <input className={inputClass} placeholder="Business name (optional)" value={form.businessName} onChange={(event) => update("businessName", event.target.value)} />
            </label>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label>
              <span className="sr-only">Email</span>
              <input className={inputClass} type="email" placeholder="Email" value={form.email} onChange={(event) => update("email", event.target.value)} required />
            </label>
            <label>
              <span className="sr-only">Phone optional</span>
              <input className={inputClass} type="tel" placeholder="Phone (optional)" value={form.phone} onChange={(event) => update("phone", event.target.value)} />
            </label>
          </div>
          <label>
            <span className="sr-only">Service needed</span>
            <select className={inputClass} value={form.service} onChange={(event) => update("service", event.target.value)} required>
              <option value="">Service needed</option>
              <option>New website design</option>
              <option>Website redesign</option>
              <option>WordPress website</option>
              <option>React website</option>
              <option>E-commerce website</option>
              <option>Website maintenance</option>
            </select>
          </label>
          <label>
            <span className="sr-only">Message</span>
            <textarea
              className={`${inputClass} min-h-32 py-3`}
              placeholder="What would you like to improve?"
              value={form.message}
              onChange={(event) => update("message", event.target.value)}
              required
            />
          </label>
          <input type="hidden" name="sourceTitle" value={source.sourceTitle} readOnly />
          <input type="hidden" name="sourceSlug" value={source.sourceSlug} readOnly />
          <input type="hidden" name="sourceUrl" value={source.sourceUrl} readOnly />
          <button
            type="submit"
            disabled={submitting}
            className={
              dark
                ? "btn btn-primary w-full sm:w-fit"
                : "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 font-bold text-white shadow-sm transition hover:bg-blue-500 disabled:opacity-70 sm:w-fit"
            }
          >
            <LuSend className="h-5 w-5" aria-hidden="true" />
            {submitting ? "Sending..." : "Send request"}
          </button>
          {status.message && (
            <p
              role="status"
              className={
                status.type === "success"
                  ? "text-sm font-semibold text-emerald-500"
                  : "text-sm font-semibold text-rose-500"
              }
            >
              {status.message}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
