import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LuLoaderCircle, LuLogIn, LuShieldCheck, LuUserPlus } from "react-icons/lu";
import Container from "@/components/layout/Container.jsx";
import Meta from "@/components/Meta.jsx";
import { seoPages } from "@/data/seoPages.js";
import { useAuth } from "@/context/AuthContext.jsx";

const TABS = [
  { key: "client", label: "Client" },
  { key: "developer", label: "Developer" },
  { key: "admin", label: "Admin" },
];

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();

  const [tab, setTab] = useState("client");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [loading, setLoading] = useState(false);

  const disabled = useMemo(
    () =>
      !form.name.trim() ||
      !form.email.trim() ||
      form.password.length < 4 ||
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
      await register({ ...form, role: tab });
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
            Choose the workspace role you were invited to use. An administrator
            reviews every request before access becomes active.
          </p>

          <div className="register-role-tabs" role="tablist" aria-label="Requested portal role">
            {TABS.map((item) => {
              const selected = item.key === tab;
              return (
                <button
                  key={item.key}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  className={selected ? "is-active" : ""}
                  onClick={() => setTab(item.key)}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

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
                placeholder="At least 4 characters"
                value={form.password}
                onChange={change("password")}
                autoComplete="new-password"
                minLength={4}
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
