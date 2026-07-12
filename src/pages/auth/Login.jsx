import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LuArrowLeft,
  LuEye,
  LuEyeOff,
  LuLoaderCircle,
  LuLockKeyhole,
  LuMail,
  LuShieldCheck,
} from "react-icons/lu";
import { useAuth } from "@/context/AuthContext.jsx";
import { API_BASE } from "@/lib/api.js";
import { useTheme } from "@/lib/theme.js";
import { site, whatsappUrl } from "@/data/site.js";

function portalPathForRole(role) {
  if (role === "admin") return "/admin";
  if (role === "developer") return "/dev";
  return "/client";
}

export default function Login() {
  const { isAuthed, role, login } = useAuth();
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
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

  const pageClass = isDark
    ? "min-h-screen bg-[#07080d] text-white"
    : "min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#eef3f9_100%)] text-slate-950";
  const panelClass = isDark
    ? "border-white/10 bg-white/[0.055] shadow-black/30"
    : "border-slate-200 bg-white/95 shadow-slate-200/80";
  const inputClass = isDark
    ? "border-white/15 bg-black/30 text-white placeholder:text-white/35 focus:border-blue-400"
    : "border-slate-300 bg-white text-slate-950 placeholder:text-slate-400 focus:border-blue-500";
  const labelClass = isDark ? "text-white/75" : "text-slate-700";

  return (
    <div className={pageClass}>
      <header className="border-b border-white/10 bg-[#090a0f] text-white">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="inline-flex items-center gap-2.5 font-black tracking-tight">
            <img src="/icon.svg" alt="" className="h-8 w-8" aria-hidden="true" />
            <span>MSPixelPulse</span>
          </Link>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="inline-flex h-9 items-center justify-center rounded-xl border border-white/10 px-3 text-sm font-semibold text-white/80 hover:bg-white/10"
            >
              {isDark ? "Light" : "Dark"}
            </button>
            <Link
              to="/"
              className="hidden h-9 items-center gap-2 rounded-xl border border-white/10 px-3 text-sm font-semibold text-white/80 hover:bg-white/10 sm:inline-flex"
            >
              <LuArrowLeft className="h-4 w-4" aria-hidden="true" />
              Website
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto grid min-h-[calc(100vh-8rem)] w-full max-w-6xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-400">
            <LuShieldCheck className="h-4 w-4" aria-hidden="true" />
            Secure portal access
          </div>
          <h1 className={isDark ? "mt-5 text-4xl font-black leading-tight md:text-5xl" : "mt-5 text-4xl font-black leading-tight text-slate-950 md:text-5xl"}>
            Sign in to your MSPixelPulse workspace
          </h1>
          <p className={isDark ? "mt-4 max-w-lg text-base leading-7 text-white/65" : "mt-4 max-w-lg text-base leading-7 text-slate-600"}>
            Use the email and password assigned to your admin, client, or developer account. Your destination is chosen from your verified role on the server.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <a
              className={isDark ? "font-semibold text-white/80 hover:text-white" : "font-semibold text-slate-700 hover:text-slate-950"}
              href={site.phoneHref}
            >
              {site.phoneDisplay}
            </a>
            <span className={isDark ? "text-white/25" : "text-slate-300"}>|</span>
            <a
              className={isDark ? "font-semibold text-white/80 hover:text-white" : "font-semibold text-slate-700 hover:text-slate-950"}
              href={whatsappUrl("Hi MSPixelPulse, I need help accessing my portal.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp support
            </a>
          </div>
        </section>

        <section className={`rounded-2xl border p-5 shadow-2xl sm:p-7 ${panelClass}`}>
          <div className="mb-6">
            <h2 className={isDark ? "text-2xl font-black text-white" : "text-2xl font-black text-slate-950"}>
              Portal login
            </h2>
            <p className={isDark ? "mt-1 text-sm text-white/55" : "mt-1 text-sm text-slate-500"}>
              Enter your account credentials to continue.
            </p>
          </div>

          <form className="space-y-4" onSubmit={onSubmit}>
            <div>
              <label htmlFor="email" className={`mb-1.5 block text-sm font-semibold ${labelClass}`}>
                Email address
              </label>
              <div className="relative">
                <LuMail className={isDark ? "pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/35" : "pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  inputMode="email"
                  required
                  className={`h-12 w-full rounded-xl border py-2 pl-10 pr-3 text-base outline-none transition focus:ring-4 focus:ring-blue-500/15 ${inputClass}`}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className={`mb-1.5 block text-sm font-semibold ${labelClass}`}>
                Password
              </label>
              <div className="relative">
                <LuLockKeyhole className={isDark ? "pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/35" : "pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"} />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className={`h-12 w-full rounded-xl border py-2 pl-10 pr-12 text-base outline-none transition focus:ring-4 focus:ring-blue-500/15 ${inputClass}`}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  onKeyDown={(event) => setCapsLock(Boolean(event.getModifierState?.("CapsLock")))}
                  onKeyUp={(event) => setCapsLock(Boolean(event.getModifierState?.("CapsLock")))}
                />
                <button
                  type="button"
                  className={isDark ? "absolute right-2 top-1/2 inline-grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-white/65 hover:bg-white/10 hover:text-white" : "absolute right-2 top-1/2 inline-grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"}
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <LuEyeOff className="h-5 w-5" /> : <LuEye className="h-5 w-5" />}
                </button>
              </div>
              {capsLock && (
                <div className="mt-2 text-sm font-semibold text-amber-500">
                  Caps Lock is on.
                </div>
              )}
            </div>

            {waking && (
              <div className={isDark ? "rounded-xl border border-amber-400/20 bg-amber-400/10 px-3 py-2 text-sm text-amber-200" : "rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800"}>
                Preparing the secure workspace.
              </div>
            )}

            {err && (
              <div className={isDark ? "rounded-xl border border-rose-400/20 bg-rose-400/10 px-3 py-2 text-sm text-rose-200" : "rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"}>
                {err}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 font-black text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/25 disabled:cursor-not-allowed disabled:opacity-65"
            >
              {loading && <LuLoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" />}
              {loading ? "Signing in" : "Sign in"}
            </button>
          </form>

          <div className={isDark ? "mt-5 border-t border-white/10 pt-4 text-xs leading-6 text-white/45" : "mt-5 border-t border-slate-200 pt-4 text-xs leading-6 text-slate-500"}>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              <Link to="/privacy" className="hover:underline">Privacy</Link>
              <Link to="/terms" className="hover:underline">Terms</Link>
              <Link to="/security" className="hover:underline">Security</Link>
              <Link to="/accessibility" className="hover:underline">Accessibility</Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
