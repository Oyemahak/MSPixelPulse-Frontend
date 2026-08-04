import { useState } from "react";
import { Link } from "react-router-dom";
import { LuArrowRight, LuCheck, LuLoaderCircle, LuMail } from "react-icons/lu";
import { blogEngagement } from "@/lib/blogEngagement.js";
import { trackEvent } from "@/lib/analytics.js";

export default function BlogSubscription({ article }) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  async function submit(event) {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setStatus({ type: "error", message: "Enter a valid email address." });
      return;
    }
    if (!consent) {
      setStatus({ type: "error", message: "Please confirm that you want to receive these emails." });
      return;
    }
    try {
      setSubmitting(true);
      const result = await blogEngagement.subscribe(article, { email: email.trim(), _hp: honeypot });
      if (result.alreadySubscribed) {
        setStatus({ type: "success", message: "This address is already subscribed." });
      } else if (result.confirmationEmailStatus === "failed") {
        setStatus({ type: "error", message: "Your request was saved, but the confirmation email is delayed. Please try again later." });
      } else {
        setStatus({ type: "success", message: "Check your inbox and confirm your subscription within 24 hours." });
      }
      setEmail("");
      setConsent(false);
      trackEvent("blog_subscription_started", { blog_slug: article.slug, blog_title: article.title });
    } catch (error) {
      setStatus({ type: "error", message: error.message || "We could not start your subscription." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="blog-subscription-card" aria-labelledby="blog-subscription-heading">
      <div className="blog-subscription-copy">
        <span className="blog-engagement-icon"><LuMail aria-hidden="true" /></span>
        <div>
          <p className="blog-engagement-kicker">Practical ideas, thoughtfully sent</p>
          <h3 id="blog-subscription-heading">Enjoyed this article?</h3>
          <p>Subscribe for website, UX, SEO, development, and small-business growth insights from MSPixelPulse.</p>
        </div>
      </div>
      <form onSubmit={submit} noValidate aria-busy={submitting}>
        <label htmlFor={`blog-subscription-${article.slug}`}>Email address</label>
        <div className="blog-subscription-fields">
          <input
            id={`blog-subscription-${article.slug}`}
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? <LuLoaderCircle className="is-spinning" aria-hidden="true" /> : <LuArrowRight aria-hidden="true" />}
            {submitting ? "Subscribing" : "Subscribe"}
          </button>
        </div>
        <label className="blog-subscription-consent">
          <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
          <span><LuCheck aria-hidden="true" /> I agree to receive these emails and understand I can unsubscribe at any time.</span>
        </label>
        <div className="sr-only" aria-hidden="true">
          <label htmlFor={`blog-subscription-company-${article.slug}`}>Company</label>
          <input
            id={`blog-subscription-company-${article.slug}`}
            tabIndex="-1"
            autoComplete="off"
            value={honeypot}
            onChange={(event) => setHoneypot(event.target.value)}
          />
        </div>
        <p className="blog-subscription-privacy">Double opt-in is used. Read the <Link to="/privacy">Privacy Policy</Link>.</p>
        <div className={`blog-form-status ${status.type ? `is-${status.type}` : ""}`} role={status.type === "error" ? "alert" : "status"} aria-live="polite">
          {status.message}
        </div>
      </form>
    </section>
  );
}
