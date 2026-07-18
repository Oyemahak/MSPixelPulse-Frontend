import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuEye,
  LuEyeOff,
  LuFolderLock,
  LuLogIn,
  LuLoaderCircle,
  LuLockKeyhole,
  LuMail,
  LuMessageCircle,
  LuPhone,
  LuShieldCheck,
  LuUsersRound,
} from "react-icons/lu";
import Container from "@/components/layout/Container.jsx";
import Meta from "@/components/Meta.jsx";
import { seoPages } from "@/data/seoPages.js";
import { useAuth } from "@/context/AuthContext.jsx";
import { API_BASE } from "@/lib/api.js";
import { site, whatsappUrl } from "@/data/site.js";

function portalPathForRole(role) {
  if (role === "admin") return "/admin";
  if (role === "developer") return "/dev";
  return "/client";
}

export default function Login() {
  const { isAuthed, role, login } = useAuth();
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [waking, setWaking] = useState(false);

  useEffect(() => {
    if (isAuthed) nav(portalPathForRole(role), { replace: true });
  }, [isAuthed, role, nav]);

  useEffect(() => {
    const url = `${API_BASE}/health`;
    setWaking(true);
    fetch(url, { method: "GET", credentials: "include" })
      .catch(() => {})
      .finally(() => setTimeout(() => setWaking(false), 900));
  }, []);

  function friendlyLoginError(error) {
    const status = error?.status;
    const message = String(error?.message || "").toLowerCase();
    if (
      !status ||
      (status >= 500 && status < 600) ||
      message.includes("fetch") ||
      message.includes("network") ||
      message.includes("timeout")
    ) {
      return "The secure workspace is starting up. Please wait a few seconds and try again.";
    }
    if (status === 401) return "The email or password did not match an active account.";
    if (status === 403) return "This account is not active yet. Please contact MSPixelPulse support.";
    return error?.message || "Login failed. Please try again.";
  }

  async function onSubmit(event) {
    event.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const user = await login(email, password);
      if (!user) throw new Error("Login failed");
      nav(portalPathForRole(user.role), { replace: true });
    } catch (error) {
      setErr(friendlyLoginError(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-page" aria-labelledby="login-heading">
      <Meta {...seoPages.login} />
      <div className="auth-ambient auth-ambient-one" aria-hidden="true" />
      <div className="auth-ambient auth-ambient-two" aria-hidden="true" />

      <Container className="auth-page-container">
        <div className="auth-layout">
          <div className="auth-intro">
            <div className="auth-eyebrow">
              <LuShieldCheck aria-hidden="true" />
              Secure workspace access
            </div>
            <h1 id="login-heading">Welcome back to your project workspace.</h1>
            <p>
              Sign in with the account assigned by MSPixelPulse. We will take you
              directly to the correct client, developer, or admin portal.
            </p>
          </div>

          <section className="auth-login-card liquid-glass-surface" aria-labelledby="portal-login-heading">
            <div className="auth-card-heading">
              <span className="auth-card-icon" aria-hidden="true">
                <LuLogIn />
              </span>
              <span>
                <h2 id="portal-login-heading">Continue to your portal</h2>
                <p>Enter your approved account credentials.</p>
              </span>
            </div>

            <form className="auth-form" onSubmit={onSubmit}>
              <div className="auth-form-field">
                <label htmlFor="email">Email address</label>
                <div className="auth-input-shell">
                  <LuMail className="auth-field-icon" aria-hidden="true" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    inputMode="email"
                    required
                    className="auth-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
              </div>

              <div className="auth-form-field">
                <label htmlFor="password">Password</label>
                <div className="auth-input-shell">
                  <LuLockKeyhole className="auth-field-icon" aria-hidden="true" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    className="auth-input auth-password-input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    onKeyDown={(event) => setCapsLock(Boolean(event.getModifierState?.("CapsLock")))}
                    onKeyUp={(event) => setCapsLock(Boolean(event.getModifierState?.("CapsLock")))}
                  />
                  <button
                    type="button"
                    className="auth-password-toggle liquid-glass-button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <LuEyeOff className="h-5 w-5" /> : <LuEye className="h-5 w-5" />}
                  </button>
                </div>
                {capsLock && (
                  <div className="auth-caps-warning" role="status">
                    Caps Lock is on.
                  </div>
                )}
              </div>

              {waking && (
                <div className="auth-status auth-status-waking" role="status" aria-live="polite">
                  <LuLoaderCircle className="animate-spin" aria-hidden="true" />
                  Preparing your secure workspace.
                </div>
              )}

              {err && (
                <div className="auth-status auth-status-error" role="alert">
                  {err}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="auth-submit-button btn btn-primary"
              >
                {loading ? (
                  <LuLoaderCircle className="animate-spin" aria-hidden="true" />
                ) : (
                  <LuLogIn aria-hidden="true" />
                )}
                {loading ? "Opening your portal…" : "Open secure portal"}
              </button>
            </form>

            <p className="auth-card-note">
              Access is available only to approved MSPixelPulse accounts.
            </p>
          </section>

          <div className="auth-support-panel">
            <div className="auth-proof-grid" aria-label="Portal access details">
              <div className="auth-proof-item liquid-glass-surface">
                <LuUsersRound aria-hidden="true" />
                <span>
                  <strong>Role-aware access</strong>
                  <small>Your verified role determines the destination.</small>
                </span>
              </div>
              <div className="auth-proof-item liquid-glass-surface">
                <LuFolderLock aria-hidden="true" />
                <span>
                  <strong>One project workspace</strong>
                  <small>Files, updates, approvals, and messages stay together.</small>
                </span>
              </div>
            </div>

            <div className="auth-support-actions" aria-label="Portal support options">
              <a className="liquid-glass-button" href={site.phoneHref}>
                <LuPhone aria-hidden="true" />
                <span>Call portal support</span>
              </a>
              <a
                className="liquid-glass-button"
                href={whatsappUrl("Hi MSPixelPulse, I need help accessing my portal.")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <LuMessageCircle aria-hidden="true" />
                <span>Message on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
