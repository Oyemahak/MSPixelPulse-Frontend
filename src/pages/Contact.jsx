import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { LuCalendar, LuChevronDown, LuSend, LuSparkles } from "react-icons/lu";
import Container from "@/components/layout/Container.jsx";
import SectionTitle from "@/components/SectionTitle.jsx";
import { FloatingField, StandardField } from "@/components/ui/FormField.jsx";
import Button from "@/components/ui/Button.jsx";
import { FORMS_BASE } from "@/lib/forms.js";
import Meta from "@/components/Meta.jsx";
import { seoPages } from "@/data/seoPages.js";
import ContactActions from "@/components/ContactActions.jsx";
import SocialContactLinks from "@/components/SocialContactLinks.jsx";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  businessName: "",
  industry: "",
  service: "",
  businessDescription: "",
  websiteGoal: "",
  offerings: "",
  currentUrl: "",
  styleReferences: "",
  budget: "",
  timeline: "",
  consent: false,
  _hp: "",
};

export default function Contact() {
  const [searchParams] = useSearchParams();
  const demoMode = searchParams.get("request") === "free-demo";
  const selectedPlan = searchParams.get("label") || "";
  const [form, setForm] = useState(() => ({
    ...emptyForm,
    service: demoMode ? "Free website demo" : selectedPlan,
  }));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const pageCopy = useMemo(
    () =>
      demoMode
        ? {
            eyebrow: "Free website demo",
            title: "Tell us about your website idea",
            intro:
              "Share what you know about your business. We will use it to plan a personalized visual demo that you can review before choosing a website plan.",
            button: "Request My Free Demo",
          }
        : {
            eyebrow: "Contact",
            title: "Tell us about your project",
            intro:
              "Share the essentials and we will recommend a clear next step. You can add optional details now or discuss them when we reply.",
            button: "Send My Project Details",
          },
    [demoMode],
  );

  function setField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
    if (errors[key]) {
      setErrors((current) => ({ ...current, [key]: "" }));
    }
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = "Please enter your name.";
    if (!form.email.trim()) {
      next.email = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = "Please enter a valid email address.";
    }
    if (!form.businessDescription.trim()) {
      next.businessDescription = demoMode
        ? "Please tell us briefly what your business does."
        : "Please tell us briefly about your project.";
    }
    if (!form.websiteGoal.trim()) {
      next.websiteGoal = "Please tell us what the website should help people do.";
    }
    if (!form.consent) next.consent = "Please confirm that we may contact you about this request.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function submit(event) {
    event.preventDefault();
    setStatus({ type: "", message: "" });
    if (!validate()) return;

    const inquiryType = demoMode ? "Free Demo Request" : "Website Project Inquiry";
    const message = [
      `Inquiry type: ${inquiryType}`,
      `Selected plan: ${selectedPlan || "Not selected"}`,
      `Business type: ${form.industry || "Not specified"}`,
      `Service or request: ${form.service || "Not specified"}`,
      `Business description: ${form.businessDescription.trim()}`,
      `Main website goal: ${form.websiteGoal.trim()}`,
      `Services or products: ${form.offerings || "Not provided"}`,
      `Estimated budget: ${form.budget || "Not specified"}`,
      `Preferred timeline: ${form.timeline || "Not specified"}`,
      `Existing website: ${form.currentUrl || "Not provided"}`,
      `Preferred style or examples: ${form.styleReferences || "Not provided"}`,
      `Consent to contact: Confirmed`,
    ].join("\n");

    try {
      setSubmitting(true);
      const response = await fetch(`${FORMS_BASE}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inquiryType,
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          businessName: form.businessName.trim(),
          service: form.service || selectedPlan,
          source: demoMode ? "free-demo-request" : "contact-page",
          sourceTitle: selectedPlan || inquiryType,
          sourceSlug: searchParams.get("article") || "",
          sourceUrl: typeof window !== "undefined" ? window.location.href : "/contact",
          message,
          _hp: form._hp,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error || data?.message || "We could not send your request.");
      }

      setStatus({
        type: "success",
        message: demoMode
          ? "Thank you. We received your business idea and will review the information you shared. We will contact you about the next steps for your personalized website demo."
          : "Thank you. We received your project details and will contact you about the next step.",
      });
      setForm({ ...emptyForm, service: demoMode ? "Free website demo" : selectedPlan });
      setErrors({});
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="section contact-page">
      <Container>
        <Meta
          {...seoPages.contact}
          title={demoMode ? "Request a Free Website Demo | MSPixelPulse" : seoPages.contact.title}
          description={
            demoMode
              ? "Tell MSPixelPulse about your business and request a free personalized website demo to review before choosing a plan."
              : seoPages.contact.description
          }
          canonical="/contact"
        />

        <SectionTitle eyebrow={pageCopy.eyebrow} title={pageCopy.title} align="left" as="h1" />
        <p className="contact-intro">{pageCopy.intro}</p>

        {demoMode && (
          <aside className="demo-form-note">
            <LuSparkles aria-hidden="true" />
            <p>
              The demo is free to review and helps with planning. It is not automatically
              the final production website; final development, revisions, hosting,
              integrations, and ownership terms are discussed separately.
            </p>
          </aside>
        )}

        <div className="contact-layout">
          <form className="contact-form-panel" onSubmit={submit} noValidate>
            <div className="form-grid-2">
              <FloatingField
                id="contact-name"
                label="Name"
                autoComplete="name"
                value={form.name}
                onChange={(event) => setField("name", event.target.value)}
                error={errors.name}
                required
              />
              <FloatingField
                id="contact-email"
                label="Email address"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={form.email}
                onChange={(event) => setField("email", event.target.value)}
                error={errors.email}
                required
              />
            </div>

            <div className="form-grid-2">
              <FloatingField
                id="contact-phone"
                label="Phone number"
                optional
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={(event) => setField("phone", event.target.value)}
              />
              <FloatingField
                id="contact-business"
                label="Business name"
                optional
                autoComplete="organization"
                value={form.businessName}
                onChange={(event) => setField("businessName", event.target.value)}
              />
            </div>

            <div className="form-grid-2">
              <FloatingField
                id="contact-industry"
                label="Type of business"
                optional
                value={form.industry}
                onChange={(event) => setField("industry", event.target.value)}
              />
              <StandardField id="contact-service" label="What do you need?" optional>
                {(id, aria) => (
                  <select
                    {...aria}
                    id={id}
                    className="form-control"
                    value={form.service}
                    onChange={(event) => setField("service", event.target.value)}
                  >
                    <option value="">Choose an option</option>
                    <option>Free website demo</option>
                    <option>One-page website</option>
                    <option>Business website</option>
                    <option>Website redesign</option>
                    <option>E-commerce website</option>
                    <option>Custom web application</option>
                    <option>Ongoing website support</option>
                  </select>
                )}
              </StandardField>
            </div>

            <FloatingField
              id="contact-description"
              as="textarea"
              label={demoMode ? "Short description of your business" : "Short project description"}
              rows={4}
              value={form.businessDescription}
              onChange={(event) => setField("businessDescription", event.target.value)}
              error={errors.businessDescription}
              required
            />

            <FloatingField
              id="contact-goal"
              as="textarea"
              label="Main website goal"
              rows={3}
              hint="For example: receive inquiries, explain services, take bookings, or sell products."
              value={form.websiteGoal}
              onChange={(event) => setField("websiteGoal", event.target.value)}
              error={errors.websiteGoal}
              required
            />

            <FloatingField
              id="contact-offerings"
              as="textarea"
              label="Services or products offered"
              optional
              rows={3}
              value={form.offerings}
              onChange={(event) => setField("offerings", event.target.value)}
            />

            <details className="form-details">
              <summary>
                <span>Add more details <small>(optional)</small></span>
                <LuChevronDown aria-hidden="true" />
              </summary>
              <div className="form-details-content">
                <FloatingField
                  id="contact-url"
                  label="Existing website URL"
                  optional
                  type="url"
                  inputMode="url"
                  autoComplete="url"
                  value={form.currentUrl}
                  onChange={(event) => setField("currentUrl", event.target.value)}
                />
                <FloatingField
                  id="contact-style"
                  as="textarea"
                  label="Preferred style or example websites"
                  optional
                  rows={3}
                  value={form.styleReferences}
                  onChange={(event) => setField("styleReferences", event.target.value)}
                />
                <div className="form-grid-2">
                  <StandardField id="contact-budget" label="Estimated budget" optional>
                    {(id, aria) => (
                      <select
                        {...aria}
                        id={id}
                        className="form-control"
                        value={form.budget}
                        onChange={(event) => setField("budget", event.target.value)}
                      >
                        <option value="">Choose a range</option>
                        <option>Under $2,000 CAD</option>
                        <option>$2,000–$4,000 CAD</option>
                        <option>$4,000–$8,000 CAD</option>
                        <option>$8,000+ CAD</option>
                        <option>Not sure yet</option>
                      </select>
                    )}
                  </StandardField>
                  <StandardField id="contact-timeline" label="Estimated timeline" optional>
                    {(id, aria) => (
                      <select
                        {...aria}
                        id={id}
                        className="form-control"
                        value={form.timeline}
                        onChange={(event) => setField("timeline", event.target.value)}
                      >
                        <option value="">Choose a timeline</option>
                        <option>As soon as practical</option>
                        <option>Within 1 month</option>
                        <option>Within 2–3 months</option>
                        <option>More than 3 months</option>
                        <option>Flexible</option>
                      </select>
                    )}
                  </StandardField>
                </div>
                <p className="form-upload-note">
                  Have a logo or reference file? You can share it securely when we reply.
                  Public file uploads are not enabled on this form.
                </p>
              </div>
            </details>

            <div className="sr-only" aria-hidden="true">
              <label htmlFor="contact-company-website">Company website</label>
              <input
                id="contact-company-website"
                tabIndex="-1"
                autoComplete="off"
                value={form._hp}
                onChange={(event) => setField("_hp", event.target.value)}
              />
            </div>

            <div className="consent-field">
              <input
                id="contact-consent"
                type="checkbox"
                checked={form.consent}
                onChange={(event) => setField("consent", event.target.checked)}
                aria-invalid={Boolean(errors.consent)}
                aria-describedby={errors.consent ? "contact-consent-error" : undefined}
              />
              <label htmlFor="contact-consent">
                MSPixelPulse may contact me about this request using the details I provided.
              </label>
            </div>
            {errors.consent && (
              <p id="contact-consent-error" className="form-error">{errors.consent}</p>
            )}

            <Button className="form-submit" size="lg" disabled={submitting} type="submit">
              <LuSend className="h-5 w-5" aria-hidden="true" />
              {submitting ? "Sending…" : pageCopy.button}
            </Button>

            {status.message && (
              <div
                role={status.type === "error" ? "alert" : "status"}
                aria-live={status.type === "error" ? "assertive" : "polite"}
                className={`form-status form-status-${status.type}`}
              >
                {status.message}
              </div>
            )}
          </form>

          <aside className="contact-side-card">
            <h2>{demoMode ? "What happens next" : "How we’ll respond"}</h2>
            <ul>
              {demoMode ? (
                <>
                  <li>We review your business idea and the details you shared.</li>
                  <li>We contact you if we need a little more information.</li>
                  <li>We prepare a visual direction for planning and review.</li>
                  <li>You decide whether you want to discuss a paid project.</li>
                </>
              ) : (
                <>
                  <li>We review your project details and reply by email.</li>
                  <li>We clarify the scope before recommending a plan.</li>
                  <li>If the project moves forward, we explain the next steps clearly.</li>
                </>
              )}
            </ul>
            <div className="contact-side-links">
              <SocialContactLinks variant="list" />
            </div>
          </aside>
        </div>

        <div className="contact-project-cta">
          <div className="contact-project-copy">
            <h2>Prefer a conversation?</h2>
            <p>Use the contact option that feels easiest for you.</p>
          </div>
          <div className="contact-project-actions">
            <ContactActions
              showMessage
              className="contact-project-link-grid"
              whatsappLabel="Chat on WhatsApp"
              message="Hi MSPixelPulse, I would like to discuss a website project."
            />
            <a
              className="btn btn-glass"
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
