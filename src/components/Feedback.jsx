// src/components/Feedback.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import Container from "@/components/layout/Container.jsx";
import SectionTitle from "@/components/SectionTitle.jsx";
import { FORMS_BASE } from "@/lib/forms.js";
import { useTheme } from "@/lib/theme.js";

/** Public proof notes, not invented testimonials. */
const FALLBACK = [
  {
    name: "Live website work",
    business: "CanSTEM Education",
    message:
      "A public school website entry listed for review with program-focused structure, admissions CTAs, and mobile-friendly content.",
  },
  {
    name: "Live website work",
    business: "Aimze Studio Salon & Spa",
    message:
      "A public salon website entry structured around services, appointment interest, and a clearer contact path.",
  },
  {
    name: "Website concept",
    business: "Home Services",
    message:
      "A demo-safe local service concept built around quote CTAs, trust sections, and responsive customer flow.",
  },
  {
    name: "Website concept",
    business: "Flower Boutique",
    message:
      "A polished storefront concept with product discovery, occasion landing pages, and order inquiry paths.",
  },
  {
    name: "Website concept",
    business: "Real Estate",
    message:
      "A premium real estate concept with buyer and seller CTAs, listing-style sections, and local trust signals.",
  },
  {
    name: "Portal workflow",
    business: "Client workspace",
    message:
      "Project rooms, files, approvals, messages, billing, and handoff notes can stay organized in one private workspace.",
  },
];

export default function Feedback() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [items] = useState(FALLBACK);
  const [idx, setIdx] = useState(0);

  // manual prev/next only (no autoplay)
  const prev = () => setIdx((i) => (i - 1 + items.length) % items.length);
  const next = () => setIdx((i) => (i + 1) % items.length);

  // 3-up window
  const trio = useMemo(() => {
    if (!items.length) return [];
    return [
      items[(idx + 0) % items.length],
      items[(idx + 1) % items.length],
      items[(idx + 2) % items.length],
    ];
  }, [items, idx]);

  // modal state
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    business: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [note, setNote] = useState("");
  const reviewButtonRef = useRef(null);
  const dialogRef = useRef(null);
  const inputClass = isDark
    ? "w-full min-h-12 rounded-xl bg-white/5 border border-white/10 px-4 text-white"
    : "w-full min-h-11 rounded-xl bg-white border border-slate-200 px-4 text-slate-900";

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    const reviewTrigger = reviewButtonRef.current;
    document.body.style.overflow = "hidden";
    const dialog = dialogRef.current;
    const getFocusable = () => Array.from(dialog?.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    ) || []);
    const focusTimer = window.setTimeout(() => getFocusable()[0]?.focus(), 50);

    function onKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const items = getFocusable();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(focusTimer);
      reviewTrigger?.focus();
    };
  }, [open]);

  async function submit(e) {
    e.preventDefault();
    setNote("");

    const { name, email, business, subject, message } = form;
    if (!name.trim() || !email.trim() || !business.trim() || !message.trim()) {
      setNote("Please fill out all fields.");
      return;
    }

    // Fold business + subject into message so API stays the same
    const payloadMessage =
      `New Feedback\n\n` +
      `From: ${name.trim()}\n` +
      `Email: ${email.trim()}\n` +
      `Business: ${business.trim()}\n` +
      (subject.trim() ? `Subject: ${subject.trim()}\n` : "") +
      `\nMessage:\n${message.trim()}`;

    try {
      setSending(true);
      const res = await fetch(`${FORMS_BASE}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: payloadMessage,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || data?.message || "Failed to send");
      setNote("Thanks! Your feedback was emailed to us.");
      setForm({ name: "", email: "", business: "", subject: "", message: "" });
      setTimeout(() => setOpen(false), 900);
    } catch (err) {
      setNote(err.message || "Could not send right now. Please email us directly.");
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="section pt-6">
      <Container>
        <SectionTitle
          eyebrow="Feedback"
          title="Project proof and review notes"
          centered
        />

        {/* FRAME */}
        <div className="relative mx-auto max-w-6xl px-6 sm:px-8 lg:px-10">
          {/* Arrows */}
          <button
            type="button"
            aria-label="Previous"
            onClick={prev}
            className={
              isDark
                ? "review-arrow review-arrow--left hidden md:grid"
                : "review-arrow review-arrow--left hidden md:grid bg-slate-900/70 border-slate-100/20 text-white"
            }
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={next}
            className={
              isDark
                ? "review-arrow review-arrow--right hidden md:grid"
                : "review-arrow review-arrow--right hidden md:grid bg-slate-900/70 border-slate-100/20 text-white"
            }
          >
            ›
          </button>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-5 sm:gap-6">
            {trio.map((t, i) => (
              <figure
                key={`${t.name}-${i}`}
                className={
                  isDark
                    ? "review-card glass-tint"
                    : "rounded-2xl bg-white border border-slate-200 shadow-sm p-5 flex flex-col min-h-[210px]"
                }
              >
                <div className="flex items-center gap-3 mb-3">
                  {isDark ? (
                    <div className="avatar-pill" aria-hidden>
                      {String(t.name || "C").trim().charAt(0).toUpperCase()}
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-slate-900/5 text-slate-900 font-bold grid place-items-center">
                      {String(t.name || "C").trim().charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="leading-tight">
                    <div
                      className={
                        isDark
                          ? "font-semibold flex items-center gap-1"
                          : "font-semibold flex items-center gap-1 text-slate-900"
                      }
                    >
                      {t.name}
                    </div>
                    <div
                      className={
                        isDark ? "text-white/60 text-xs" : "text-slate-500 text-xs"
                      }
                    >
                      {t.business}
                    </div>
                  </div>
                </div>

                {isDark ? (
                  <div className="inline-flex w-fit rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-bold text-white/70">
                    Portfolio note
                  </div>
                ) : (
                  <div className="inline-flex w-fit rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                    Portfolio note
                  </div>
                )}

                <p
                  className={
                    isDark
                      ? "review-quote mt-2"
                      : "mt-3 text-slate-600 text-sm leading-relaxed"
                  }
                >
                  {t.message}
                </p>
              </figure>
            ))}
          </div>

          {/* Dots */}
          <div className="mt-6 flex justify-center gap-2">
            {items.map((_, i) => {
              const isActive = i === idx;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIdx(i)}
                  className={
                    isDark
                      ? [
                          "grid h-11 w-11 place-items-center rounded-full transition",
                          isActive ? "text-white/90" : "text-white/30 hover:text-white/50",
                        ].join(" ")
                      : [
                          "grid h-11 w-11 place-items-center rounded-full transition",
                          isActive ? "text-slate-900" : "text-slate-300 hover:text-slate-400",
                        ].join(" ")
                  }
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={isActive ? "true" : undefined}
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-current" aria-hidden="true" />
                </button>
              );
            })}
          </div>

          {/* Leave a review */}
          <div className="mt-6 flex justify-center">
            <button
              ref={reviewButtonRef}
              onClick={() => {
                setNote("");
                setOpen(true);
              }}
              className={
                isDark
                  ? "btn btn-outline"
                  : "inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold shadow-sm hover:bg-slate-50"
              }
              type="button"
            >
              Leave a review
            </button>
          </div>
        </div>
      </Container>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm animate-fade-up"
          onClick={() => setOpen(false)}
          role="presentation"
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="feedback-dialog-title"
            aria-describedby="feedback-dialog-description"
            className={
              isDark
                ? "modal-panel"
                : "w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl p-6"
            }
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              id="feedback-dialog-title"
              className={
                isDark ? "font-black text-lg" : "font-bold text-lg text-slate-900"
              }
            >
              Share your feedback
            </h2>
            <p id="feedback-dialog-description" className={isDark ? "text-textSub text-sm mt-1" : "text-slate-500 text-sm mt-1"}>
              Your message will be emailed to us.
            </p>

            <form className="mt-4 space-y-3" onSubmit={submit}>
              <label className="contact-field">
                <span>Your full name</span>
                <input className={inputClass} autoComplete="name" value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} required />
              </label>
              <label className="contact-field">
                <span>Your email</span>
                <input className={inputClass} type="email" autoComplete="email" value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} required />
              </label>
              <label className="contact-field">
                <span>Business / organization</span>
                <input className={inputClass} autoComplete="organization" value={form.business} onChange={(e) => setForm((s) => ({ ...s, business: e.target.value }))} required />
              </label>
              <label className="contact-field">
                <span>Subject <small>(optional)</small></span>
                <input className={inputClass} value={form.subject} onChange={(e) => setForm((s) => ({ ...s, subject: e.target.value }))} />
              </label>
              <label className="contact-field">
                <span>Your feedback</span>
                <textarea rows={5} className={`${inputClass} min-h-32 py-3`} value={form.message} onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))} required />
              </label>
              {note && (
                <div role="status" aria-live="polite" className={isDark ? "text-sm text-white/80" : "text-sm text-slate-500"}>
                  {note}
                </div>
              )}

              <div className="form-actions justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className={
                    isDark
                      ? "btn btn-outline"
                      : "inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold hover:bg-slate-50"
                  }
                >
                  Cancel
                </button>
                <button
                  className={
                    isDark
                      ? "btn btn-primary"
                      : "inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-slate-900 text-white font-semibold"
                  }
                  disabled={sending}
                >
                  {sending ? "Sending…" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
