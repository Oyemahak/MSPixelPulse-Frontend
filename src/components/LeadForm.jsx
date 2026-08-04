import { useRef, useState } from "react";
import { LuCheck, LuChevronDown, LuCircleCheckBig, LuSend } from "react-icons/lu";
import Button from "@/components/ui/Button.jsx";
import { FloatingField, StandardField } from "@/components/ui/FormField.jsx";
import { API_BASE } from "@/lib/api.js";
import { trackEvent } from "@/lib/analytics.js";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  businessName: "",
  industry: "",
  websiteGoal: "",
  service: "",
  businessDescription: "",
  offerings: "",
  currentUrl: "",
  styleReferences: "",
  budget: "",
  timeline: "",
  consent: false,
  _hp: "",
};

function digitsOnly(value) {
  return String(value || "").replace(/\D/g, "");
}

function isValidPhone(value) {
  const cleaned = String(value || "").trim();
  const mainNumber = cleaned.split(/(?:ext\.?|x)/i)[0];
  const digits = digitsOnly(mainNumber);
  return /^\+?[\d\s().-]+$/.test(mainNumber) && digits.length >= 10 && digits.length <= 15;
}

function formatPhone(value) {
  const cleaned = String(value || "").trim();
  const digits = digitsOnly(cleaned);
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits.startsWith("1")) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return cleaned;
}

function fieldError(key, form) {
  if (key === "name" && !form.name.trim()) return "Please enter your name.";
  if (key === "email") {
    if (!form.email.trim()) return "Please enter your business email.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      return "Please enter a valid business email.";
    }
  }
  if (key === "phone") {
    if (!form.phone.trim()) return "Please enter your phone number.";
    if (!isValidPhone(form.phone)) {
      return "Enter a valid phone number with at least 10 digits.";
    }
  }
  if (key === "businessName" && !form.businessName.trim()) {
    return "Please enter your business name.";
  }
  if (key === "industry" && !form.industry.trim()) {
    return "Please enter your industry or type of business.";
  }
  if (key === "websiteGoal" && !form.websiteGoal.trim()) {
    return "Please tell us the primary goal for your website.";
  }
  if (key === "consent" && !form.consent) {
    return "Please confirm that we may contact you about this request.";
  }
  return "";
}

const requiredFields = ["name", "email", "phone", "businessName", "industry", "websiteGoal", "consent"];

export default function LeadForm({
  demoMode = false,
  selectedPlan = "",
  source = demoMode ? "free-demo-page" : "contact-page",
  sourceSlug = "",
  idPrefix = demoMode ? "free-demo" : "contact",
  className = "",
  onSuccess,
}) {
  const initialService = demoMode ? "Free website demo" : selectedPlan;
  const [form, setForm] = useState(() => ({ ...emptyForm, service: initialService }));
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [detailsOpen, setDetailsOpen] = useState(Boolean(selectedPlan));
  const statusRef = useRef(null);

  const copy = {
    button: demoMode ? "Request My Free Demo" : "Send My Project Details",
    success: demoMode
      ? "Your request is in. We’ll review the details and contact you about the next step for your personalized demo."
      : "Your project details are in. We’ll review them and contact you about the next step.",
  };

  function setField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
    if (touched[key] || errors[key]) {
      const nextForm = { ...form, [key]: value };
      setErrors((current) => ({ ...current, [key]: fieldError(key, nextForm) }));
    }
  }

  function handleBlur(key) {
    const nextForm = key === "phone"
      ? { ...form, phone: formatPhone(form.phone) }
      : form;
    if (key === "phone" && nextForm.phone !== form.phone) setForm(nextForm);
    setTouched((current) => ({ ...current, [key]: true }));
    setErrors((current) => ({ ...current, [key]: fieldError(key, nextForm) }));
  }

  function validate() {
    const next = Object.fromEntries(
      requiredFields.map((key) => [key, fieldError(key, form)]).filter(([, error]) => error),
    );
    setTouched(Object.fromEntries(requiredFields.map((key) => [key, true])));
    setErrors(next);
    const firstError = requiredFields.find((key) => next[key]);
    if (firstError) {
      window.requestAnimationFrame(() => {
        document.getElementById(`${idPrefix}-${firstError}`)?.focus();
      });
    }
    return !firstError;
  }

  async function submit(event) {
    event.preventDefault();
    setStatus({ type: "", message: "" });
    if (!validate()) return;

    const inquiryType = demoMode ? "Free Demo Request" : "Website Project Inquiry";
    const message = [
      `Inquiry type: ${inquiryType}`,
      `Selected plan: ${selectedPlan || "Not selected"}`,
      `Industry: ${form.industry.trim()}`,
      `Service or request: ${form.service || "Not specified"}`,
      `Business description: ${form.businessDescription.trim() || "Not provided"}`,
      `Primary website goal: ${form.websiteGoal.trim()}`,
      `Services or products: ${form.offerings.trim() || "Not provided"}`,
      `Estimated budget: ${form.budget || "Not specified"}`,
      `Preferred timeline: ${form.timeline || "Not specified"}`,
      `Existing website: ${form.currentUrl.trim() || "Not provided"}`,
      `Preferred style or examples: ${form.styleReferences.trim() || "Not provided"}`,
      "Consent to contact: Confirmed",
    ].join("\n");

    try {
      setSubmitting(true);
      const response = await fetch(`${API_BASE}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inquiryType,
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          businessName: form.businessName.trim(),
          service: form.service || selectedPlan || inquiryType,
          source,
          sourceTitle: selectedPlan || inquiryType,
          sourceSlug,
          sourceUrl: typeof window !== "undefined" ? window.location.href : "/contact",
          message,
          _hp: form._hp,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error || data?.message || "We could not send your request.");
      }

      setStatus({ type: "success", message: copy.success });
      setForm({ ...emptyForm, service: initialService });
      setTouched({});
      setErrors({});
      trackEvent("generate_lead", {
        form_type: demoMode ? "free_demo" : "project_inquiry",
        form_source: source,
      });
      trackEvent("contact_form_submitted", {
        form_source: source,
        page_path: typeof window !== "undefined" ? window.location.pathname : "/contact",
      });
      if (data?.confirmationEmailStatus === "sent") {
        trackEvent("contact_confirmation_sent", {
          form_source: source,
        });
      }
      onSuccess?.();
      window.requestAnimationFrame(() => statusRef.current?.focus());
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
    <form
      className={`contact-form-panel lead-form ${className}`.trim()}
      onSubmit={submit}
      noValidate
      aria-busy={submitting}
      data-clarity-mask="True"
    >
      <div className="lead-form-required-note">
        <LuCheck aria-hidden="true" />
        <span>Six quick details help us prepare a useful first direction.</span>
      </div>

      <div className="form-grid-2">
        <FloatingField
          id={`${idPrefix}-name`}
          label="Name"
          autoComplete="name"
          value={form.name}
          onChange={(event) => setField("name", event.target.value)}
          onBlur={() => handleBlur("name")}
          error={errors.name}
          required
        />
        <FloatingField
          id={`${idPrefix}-email`}
          label="Business email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={form.email}
          onChange={(event) => setField("email", event.target.value)}
          onBlur={() => handleBlur("email")}
          error={errors.email}
          required
        />
      </div>

      <div className="form-grid-2">
        <FloatingField
          id={`${idPrefix}-phone`}
          label="Phone number"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={form.phone}
          onChange={(event) => setField("phone", event.target.value)}
          onBlur={() => handleBlur("phone")}
          hint="Canadian, U.S., and international formats are accepted."
          error={errors.phone}
          required
        />
        <FloatingField
          id={`${idPrefix}-businessName`}
          label="Business name"
          autoComplete="organization"
          value={form.businessName}
          onChange={(event) => setField("businessName", event.target.value)}
          onBlur={() => handleBlur("businessName")}
          error={errors.businessName}
          required
        />
      </div>

      <FloatingField
        id={`${idPrefix}-industry`}
        label="Industry or type of business"
        value={form.industry}
        onChange={(event) => setField("industry", event.target.value)}
        onBlur={() => handleBlur("industry")}
        error={errors.industry}
        required
      />

      <FloatingField
        id={`${idPrefix}-websiteGoal`}
        as="textarea"
        label="Primary website goal"
        rows={3}
        hint="For example: receive inquiries, explain services, take bookings, or sell products."
        value={form.websiteGoal}
        onChange={(event) => setField("websiteGoal", event.target.value)}
        onBlur={() => handleBlur("websiteGoal")}
        error={errors.websiteGoal}
        required
      />

      <details
        className="form-details"
        open={detailsOpen}
        onToggle={(event) => setDetailsOpen(event.currentTarget.open)}
      >
        <summary>
          <span>Add More Details <small>(Optional)</small></span>
          <LuChevronDown aria-hidden="true" />
        </summary>
        <div className="form-details-content">
          <StandardField id={`${idPrefix}-service`} label="What do you need?" optional>
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
          <FloatingField
            id={`${idPrefix}-businessDescription`}
            as="textarea"
            label="Short description of your business"
            optional
            rows={3}
            value={form.businessDescription}
            onChange={(event) => setField("businessDescription", event.target.value)}
          />
          <FloatingField
            id={`${idPrefix}-offerings`}
            as="textarea"
            label="Services or products offered"
            optional
            rows={3}
            value={form.offerings}
            onChange={(event) => setField("offerings", event.target.value)}
          />
          <FloatingField
            id={`${idPrefix}-currentUrl`}
            label="Existing website URL"
            optional
            type="url"
            inputMode="url"
            autoComplete="url"
            value={form.currentUrl}
            onChange={(event) => setField("currentUrl", event.target.value)}
          />
          <FloatingField
            id={`${idPrefix}-styleReferences`}
            as="textarea"
            label="Preferred style or example websites"
            optional
            rows={3}
            value={form.styleReferences}
            onChange={(event) => setField("styleReferences", event.target.value)}
          />
          <div className="form-grid-2">
            <StandardField id={`${idPrefix}-budget`} label="Estimated budget" optional>
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
            <StandardField id={`${idPrefix}-timeline`} label="Estimated timeline" optional>
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
        <label htmlFor={`${idPrefix}-companyWebsite`}>Company website</label>
        <input
          id={`${idPrefix}-companyWebsite`}
          tabIndex="-1"
          autoComplete="off"
          value={form._hp}
          onChange={(event) => setField("_hp", event.target.value)}
        />
      </div>

      <div className="consent-field">
        <input
          id={`${idPrefix}-consent`}
          type="checkbox"
          checked={form.consent}
          onChange={(event) => setField("consent", event.target.checked)}
          onBlur={() => handleBlur("consent")}
          aria-invalid={Boolean(errors.consent)}
          aria-describedby={errors.consent ? `${idPrefix}-consent-error` : undefined}
          required
        />
        <label htmlFor={`${idPrefix}-consent`}>
          MSPixelPulse may contact me about this request using the details I provided.
        </label>
      </div>
      {errors.consent && (
        <p id={`${idPrefix}-consent-error`} className="form-error" role="alert">
          {errors.consent}
        </p>
      )}

      <Button
        className="form-submit"
        size="lg"
        disabled={submitting}
        type="submit"
        data-analytics-cta={demoMode ? "free_demo_form" : "contact_form"}
      >
        <LuSend className="h-5 w-5" aria-hidden="true" />
        {submitting ? "Sending…" : copy.button}
      </Button>

      {status.message && (
        <div
          role={status.type === "error" ? "alert" : "status"}
          aria-live={status.type === "error" ? "assertive" : "polite"}
          className={`form-status form-status-${status.type}`}
          ref={statusRef}
          tabIndex={status.type === "success" ? -1 : undefined}
        >
          {status.type === "success" && <LuCircleCheckBig aria-hidden="true" />}
          <span>{status.message}</span>
        </div>
      )}
    </form>
  );
}
