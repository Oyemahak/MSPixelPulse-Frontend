import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LuLoaderCircle, LuLogIn, LuShieldCheck, LuUserPlus } from "react-icons/lu";
import Container from "@/components/layout/Container.jsx";
import Meta from "@/components/Meta.jsx";
import { seoPages } from "@/data/seoPages.js";
import { useAuth } from "@/context/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    businessName: "",
    businessWebsite: "",
    industry: "",
    projectContactPreference: "",
  });
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [loading, setLoading] = useState(false);

  const disabled = useMemo(
    () =>
      !form.name.trim() ||
      !form.email.trim() ||
      !form.businessName.trim() ||
      !form.industry.trim() ||
      !form.projectContactPreference.trim() ||
      form.password.length < 8 ||
      loading,
    [form, loading]
  );

  const change = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
  };

  async function onSubmit(event) {
    event.preventDefault();
    setErr("");
    setOk("");
    setLoading(true);
    try {
      await register(form);
      setOk("Your access request was sent for admin review.");
      setTimeout(() => nav("/login", { replace: true }), 900);
    } catch (error) {
      setErr(error?.message || "We could not send your access request. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-page register-page" aria-labelledby="register-heading">
      <Meta {...seoPages.register} />
      <div className="auth-ambient auth-ambient-one" aria-hidden="true" />
      <div className="auth-ambient auth-ambient-two" aria-hidden="true" />

      <Container className="auth-page-container">
        <div className="auth-register-card liquid-glass-surface">
          <div className="auth-eyebrow">
            <LuShieldCheck aria-hidden="true" />
            Approved workspace access
          </div>
          <h1 id="register-heading">Request access to an MSPixelPulse portal.</h1>
          <p>
            Request client workspace access. An administrator reviews every
            application before access becomes active.
          </p>

          <form onSubmit={onSubmit} className="auth-form register-form">
            <div className="auth-form-field">
              <label htmlFor="register-name">Full name</label>
              <input
                id="register-name"
                name="name"
                className="auth-input register-input"
                placeholder="First and last name"
                value={form.name}
                onChange={change("name")}
                autoComplete="name"
                required
              />
            </div>

            <div className="auth-form-field">
              <label htmlFor="register-email">Email address</label>
              <input
                id="register-email"
                name="email"
                type="email"
                className="auth-input register-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={change("email")}
                inputMode="email"
                autoComplete="email"
                required
              />
            </div>

            <div className="auth-form-field">
              <label htmlFor="register-password">Password</label>
              <input
                id="register-password"
                name="password"
                type="password"
                className="auth-input register-input"
                placeholder="At least 8 characters"
                value={form.password}
                onChange={change("password")}
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>

            <div className="auth-form-field">
              <label htmlFor="register-business">Business or organization name</label>
              <input
                id="register-business"
                name="businessName"
                className="auth-input register-input"
                placeholder="Your business name"
                value={form.businessName}
                onChange={change("businessName")}
                autoComplete="organization"
                required
              />
            </div>

            <div className="auth-form-field">
              <label htmlFor="register-industry">Industry</label>
              <input
                id="register-industry"
                name="industry"
                className="auth-input register-input"
                placeholder="For example, home services"
                value={form.industry}
                onChange={change("industry")}
                required
              />
            </div>

            <div className="auth-form-field">
              <label htmlFor="register-phone">Phone <span className="text-muted-xs">(optional)</span></label>
              <input
                id="register-phone"
                name="phone"
                type="tel"
                className="auth-input register-input"
                placeholder="Your preferred contact number"
                value={form.phone}
                onChange={change("phone")}
                autoComplete="tel"
              />
            </div>

            <div className="auth-form-field">
              <label htmlFor="register-website">Current website <span className="text-muted-xs">(optional)</span></label>
              <input
                id="register-website"
                name="businessWebsite"
                type="url"
                className="auth-input register-input"
                placeholder="https://example.com"
                value={form.businessWebsite}
                onChange={change("businessWebsite")}
                inputMode="url"
                autoComplete="url"
              />
            </div>

            <div className="auth-form-field">
              <label htmlFor="register-project">What do you need help with?</label>
              <textarea
                id="register-project"
                name="projectContactPreference"
                className="auth-input register-input"
                placeholder="Briefly describe the website, portal, or digital project you are planning."
                value={form.projectContactPreference}
                onChange={change("projectContactPreference")}
                rows={4}
                maxLength={2000}
                required
              />
            </div>

            {err && <div className="auth-status auth-status-error" role="alert">{err}</div>}
            {ok && <div className="auth-status auth-status-success" role="status">{ok}</div>}

            <button type="submit" disabled={disabled} className="auth-submit-button btn btn-primary">
              {loading ? (
                <LuLoaderCircle className="animate-spin" aria-hidden="true" />
              ) : (
                <LuUserPlus aria-hidden="true" />
              )}
              {loading ? "Sending access request…" : "Request workspace access"}
            </button>

            <Link to="/login" className="register-login-link liquid-glass-button">
              <LuLogIn aria-hidden="true" />
              Return to portal login
            </Link>
          </form>
        </div>
      </Container>
    </section>
  );
}
