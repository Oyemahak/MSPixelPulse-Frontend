// src/components/layout/AppHeader.jsx
import { useEffect, useRef, useState, useCallback } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.jsx";
import { useTheme } from "@/lib/theme.js";

/* Icons */
import {
  LuLayoutGrid,
  LuFolderOpen,
  LuWrench,
  LuTags,
  LuMail,
  LuBookOpen,
  LuLogIn,
  LuLayoutDashboard,
  LuMenu,
  LuX,
  LuUser,
  LuLifeBuoy,
  LuLogOut,
  LuSun,
  LuMoon,
  LuHandshake,
} from "react-icons/lu";
import SocialContactLinks from "@/components/SocialContactLinks.jsx";

/* Helper: initials for avatar fallback */
function initials(name = "", email = "") {
  const base = (name || email || "").trim();
  if (!base) return "U";
  const parts = base.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return base.slice(0, 2).toUpperCase();
}

export default function AppHeader() {
  const { isAuthed, role, user, logout } = useAuth();
  const { theme, toggleTheme, setTheme } = useTheme();
  const actualIsDark = theme === "dark";
  const isDark = actualIsDark;
  const nav = useNavigate();

  const [open, setOpen] = useState(false); // mobile nav
  const [menuOpen, setMenuOpen] = useState(false); // profile dropdown
  const menuRef = useRef(null);
  const mobileButtonRef = useRef(null);
  const mobilePanelRef = useRef(null);

  const avatarUrl = user?.avatarUrl || "";

  // portal routes
  const portalPath =
    role === "admin" ? "/admin" : role === "developer" ? "/dev" : "/client";

  const myAccountPath =
    role === "admin"
      ? "/admin/my-account"
      : role === "developer"
        ? "/dev/my-account"
        : "/client/my-account";

  const supportPath = "/client/support";

  async function doLogout() {
    try {
      await logout();
    } finally {
      nav("/", { replace: true });
      setOpen(false);
      setMenuOpen(false);
    }
  }

  // Close profile menu on outside click / ESC
  useEffect(() => {
    function onDoc(e) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    function onEsc(e) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    const mobileTrigger = mobileButtonRef.current;
    document.body.style.overflow = "hidden";
    const panel = mobilePanelRef.current;
    const focusable = () => Array.from(panel?.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    ) || []);
    const focusTimer = window.setTimeout(() => focusable()[0]?.focus(), 80);

    function onMobileKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        mobileButtonRef.current?.focus();
        return;
      }

      if (event.key !== "Tab") return;
      const items = focusable();
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

    document.addEventListener("keydown", onMobileKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onMobileKeyDown);
      window.clearTimeout(focusTimer);
      mobileTrigger?.focus();
    };
  }, [open]);

  const closeMobile = useCallback(() => setOpen(false), []);

  // nav link style (desktop)
  const linkClass = ({ isActive }) => {
    const base =
      "h-10 whitespace-nowrap px-3 rounded-xl text-sm font-semibold transition-colors inline-flex items-center gap-2 [&>svg]:h-4 [&>svg]:w-4 [&>svg]:shrink-0";
    if (isDark) {
      return isActive
        ? `${base} bg-white/10 text-white`
        : `${base} text-white/75 hover:bg-white/5`;
    }
    // light
    return isActive
      ? `${base} bg-slate-100 text-slate-900`
      : `${base} text-slate-600 hover:bg-slate-100`;
  };

  // header bg
  const headerClass = "public-site-header fixed inset-x-0 top-3 z-50 px-3 sm:px-4 pointer-events-none";

  // desktop login btn
  const loginBtnClass =
    "public-header-cta h-10 min-w-max whitespace-nowrap px-4 rounded-xl font-bold inline-flex items-center gap-2";

  return (
    <header className={headerClass}>
      <div className="public-header-shell mx-auto flex h-16 items-center justify-between gap-3 px-4 sm:px-5 pointer-events-auto">
        {/* Brand */}
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2.5 whitespace-nowrap font-black tracking-tight"
          onClick={closeMobile}
        >
          <img
            src="/icon.svg"
            alt=""
            aria-hidden="true"
            className="h-8 w-8 object-contain"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <span className={isDark ? "text-white" : "text-slate-900"}>MSPixelPulse</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden xl:flex min-w-0 flex-1 items-center justify-center gap-1">
          <NavLink to="/" className={linkClass} end>
            <LuLayoutGrid className="h-4 w-4" /> Home
          </NavLink>
          <NavLink to="/projects" className={linkClass}>
            <LuFolderOpen className="h-4 w-4" /> Projects
          </NavLink>
          <NavLink to="/about" className={linkClass}>
            <LuHandshake className="h-4 w-4" /> About
          </NavLink>
          <NavLink to="/services" className={linkClass}>
            <LuWrench className="h-4 w-4" /> Services
          </NavLink>
          <NavLink to="/pricing" className={linkClass}>
            <LuTags className="h-4 w-4" /> Pricing
          </NavLink>
          <NavLink to="/blog" className={linkClass}>
            <LuBookOpen className="h-4 w-4" /> Blog
          </NavLink>
          <NavLink to="/contact" className={linkClass}>
            <LuMail className="h-4 w-4" /> Contact
          </NavLink>
        </nav>

        {/* Right actions (desktop) */}
        <div className="hidden xl:flex shrink-0 items-center gap-2">
          {/* 2-icon desktop switch */}
          <div
            className={
              isDark
                ? "flex h-10 items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1"
                : "flex h-10 items-center gap-1 rounded-full border border-slate-200 bg-slate-100 p-1"
            }
          >
            {/* Dark button */}
            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={
                actualIsDark
                  ? "h-8 w-8 rounded-full bg-slate-950 text-white inline-grid place-items-center shadow-sm"
                  : "h-8 w-8 rounded-full text-white/70 inline-grid place-items-center hover:bg-white/10"
              }
              aria-pressed={actualIsDark}
              aria-label="Dark mode"
              title="Use dark mode"
            >
              <LuMoon className="h-4 w-4" />
            </button>

            {/* Light button */}
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={
                !actualIsDark
                  ? "h-8 w-8 rounded-full bg-white text-slate-900 inline-grid place-items-center shadow-sm"
                  : "h-8 w-8 rounded-full text-white/70 inline-grid place-items-center hover:bg-white/10"
              }
              aria-pressed={!actualIsDark}
              aria-label="Light mode"
              title="Use light mode"
            >
              <LuSun className="h-4 w-4" />
            </button>
          </div>

          {!isAuthed ? (
            <NavLink to="/login" className={loginBtnClass}>
              <LuLogIn className="h-4 w-4" /> Portal login
            </NavLink>
          ) : (
            <>
              {/* Portal */}
              <Link
                to={portalPath}
                className={
                  isDark
                    ? "h-10 min-w-max whitespace-nowrap inline-flex items-center gap-2.5 rounded-xl border border-white/10 px-4 text-sm font-bold text-white/90 hover:bg-white/5"
                    : "h-10 min-w-max whitespace-nowrap inline-flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-800 hover:bg-slate-50"
                }
              >
                <LuLayoutDashboard className="h-4 w-4" /> Portal
              </Link>

              {/* Profile */}
              <div className="relative" ref={menuRef}>
                <button
                  className="profile-chip"
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  aria-label="Open profile and account menu"
                  onClick={() => setMenuOpen((v) => !v)}
                  title={user?.email ? `Open account menu for ${user.email}` : "Open account menu"}
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="profile"
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    <span className="avatar-fallback h-9 w-9 rounded-full">
                      {initials(user?.name, user?.email)}
                    </span>
                  )}
                </button>

                <div
                  className={[
                    "user-menu",
                    isDark ? "bg-[rgba(15,15,20,0.92)]" : "bg-white/95 border border-slate-200",
                    menuOpen
                      ? "scale-100 opacity-100 pointer-events-auto"
                      : "scale-95 opacity-0 pointer-events-none",
                  ].join(" ")}
                  role="menu"
                  aria-hidden={!menuOpen}
                  inert={!menuOpen}
                >
                  <div
                    className={`flex items-center gap-3 pb-2 border-b ${
                      isDark ? "border-white/10" : "border-slate-200"
                    }`}
                  >
                    <div className="shrink-0">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt=""
                          className="h-9 w-9 rounded-full object-cover"
                        />
                      ) : (
                        <span className="avatar-fallback h-9 w-9 rounded-full">
                          {initials(user?.name, user?.email)}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div
                        className={`text-sm font-semibold truncate ${
                          isDark ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {user?.name || "User"}
                      </div>
                      <div
                        className={`text-xs truncate ${
                          isDark ? "text-white/60" : "text-slate-500"
                        }`}
                      >
                        {user?.email}
                      </div>
                    </div>
                  </div>

                  <MenuLink
                    to={myAccountPath}
                    onClick={() => setMenuOpen(false)}
                    dark={isDark}
                  >
                    <LuUser className="h-4 w-4" /> <span>My account</span>
                  </MenuLink>

                  {role === "client" && (
                    <MenuLink
                      to={supportPath}
                      onClick={() => setMenuOpen(false)}
                      dark={isDark}
                    >
                      <LuLifeBuoy className="h-4 w-4" /> <span>Support</span>
                    </MenuLink>
                  )}

                  <button
                    className={
                      isDark
                        ? "menu-item danger"
                        : "w-full flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-xl mt-1"
                    }
                    onClick={doLogout}
                    role="menuitem"
                  >
                    <LuLogOut className="h-4 w-4" /> <span>Sign out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          ref={mobileButtonRef}
          className={
            isDark
              ? "xl:hidden inline-grid place-items-center h-11 w-11 rounded-xl hover:bg-white/10"
              : "xl:hidden inline-grid place-items-center h-11 w-11 rounded-xl hover:bg-slate-100 text-slate-800"
          }
          aria-label={open ? "Close menu" : "Open menu"}
          title={open ? "Close website menu" : "Open website menu"}
          aria-expanded={open}
          aria-controls="public-mobile-navigation"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <LuX className={isDark ? "h-5 w-5 text-white/90" : "h-5 w-5 text-slate-700"} />
          ) : (
            <LuMenu
              className={isDark ? "h-5 w-5 text-white/90" : "h-5 w-5 text-slate-700"}
            />
          )}
        </button>
      </div>

      {/* Mobile sheet */}
      <div
        id="public-mobile-navigation"
        aria-hidden={!open}
        inert={!open}
        className={[
          "xl:hidden pointer-events-auto overflow-hidden transition-[max-height,opacity] duration-300",
          open ? "max-h-[calc(100dvh-5.5rem)] opacity-100" : "max-h-0 opacity-0",
        ].join(" ")}
      >
        <div className="container-edge pt-2 pb-3">
          <div
            ref={mobilePanelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className={
              isDark
                ? "public-mobile-menu rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.35)]"
                : "public-mobile-menu rounded-2xl border border-slate-200 bg-white shadow-md"
            }
          >
            <nav className="p-2">
              <MobileLink to="/" onClick={closeMobile} end dark={isDark}>
                <LuLayoutGrid className="h-4 w-4 mr-2" /> Home
              </MobileLink>
              <MobileLink to="/projects" onClick={closeMobile} dark={isDark}>
                <LuFolderOpen className="h-4 w-4 mr-2" /> Projects
              </MobileLink>
              <MobileLink to="/about" onClick={closeMobile} dark={isDark}>
                <LuHandshake className="h-4 w-4 mr-2" /> About
              </MobileLink>
              <MobileLink to="/services" onClick={closeMobile} dark={isDark}>
                <LuWrench className="h-4 w-4 mr-2" /> Services
              </MobileLink>
              <MobileLink to="/pricing" onClick={closeMobile} dark={isDark}>
                <LuTags className="h-4 w-4 mr-2" /> Pricing
              </MobileLink>
              <MobileLink to="/blog" onClick={closeMobile} dark={isDark}>
                <LuBookOpen className="h-4 w-4 mr-2" /> Blog
              </MobileLink>
              <MobileLink to="/contact" onClick={closeMobile} dark={isDark}>
                <LuMail className="h-4 w-4 mr-2" /> Contact
              </MobileLink>

              {/* mobile theme toggle — KEEPING YOUR OLD ONE */}
              <button
                type="button"
                onClick={toggleTheme}
                className={
                  isDark
                    ? "w-full mt-1.5 h-11 rounded-xl font-semibold inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white/85"
                    : "liquid-glass-button w-full mt-1.5 h-11 rounded-xl font-semibold inline-flex items-center justify-center gap-2 text-slate-800"
                }
                aria-label={actualIsDark ? "Switch to light mode" : "Switch to dark mode"}
                title={actualIsDark ? "Switch to light mode" : "Switch to dark mode"}
              >
                {actualIsDark ? (
                  <>
                    <LuSun className="h-4 w-4" /> Light mode
                  </>
                ) : (
                  <>
                    <LuMoon className="h-4 w-4" /> Dark mode
                  </>
                )}
              </button>

              <div className={isDark ? "h-px my-1.5 bg-white/10" : "h-px my-1.5 bg-slate-200"} />

              {!isAuthed ? (
                <>
                  <MobileCTA
                    to="/login"
                    onClick={closeMobile}
                    variant="primary"
                    dark={isDark}
                  >
                    <LuLogIn className="h-4 w-4 mr-2" /> Portal login
                  </MobileCTA>
                  <SocialContactLinks
                    include={["email", "phone", "messages", "whatsapp"]}
                    variant="icons"
                    className="mobile-contact-links"
                  />
                </>
              ) : (
                <>
                  <MobileCTA
                    to={portalPath}
                    onClick={closeMobile}
                    variant="outline"
                    dark={isDark}
                  >
                    <LuLayoutDashboard className="h-4 w-4 mr-2" /> Portal
                  </MobileCTA>
                  <MobileCTA
                    to={myAccountPath}
                    onClick={closeMobile}
                    variant="outline"
                    dark={isDark}
                  >
                    <LuUser className="h-4 w-4 mr-2" /> My account
                  </MobileCTA>
                  {role === "client" && (
                    <MobileCTA
                      to={supportPath}
                      onClick={closeMobile}
                      variant="outline"
                      dark={isDark}
                    >
                      <LuLifeBuoy className="h-4 w-4 mr-2" /> Support
                    </MobileCTA>
                  )}
                  <button
                    type="button"
                    onClick={async () => {
                      await doLogout();
                      closeMobile();
                    }}
                    className={
                      isDark
                        ? "w-full mt-1.5 h-11 rounded-xl font-bold bg-primary hover:bg-primaryAccent text-white inline-flex items-center justify-center gap-2"
                        : "w-full mt-1.5 h-11 rounded-xl font-bold bg-blue-600 hover:bg-blue-500 text-white inline-flex items-center justify-center gap-2"
                    }
                  >
                    <LuLogOut className="h-4 w-4" /> Sign out
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

/* Re-usable dropdown item */
function MenuLink({ to, onClick, children, dark }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={
        dark
          ? "menu-item"
          : "flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
      }
      role="menuitem"
    >
      {children}
    </Link>
  );
}

/* Mobile helpers */
function MobileLink({ to, end, onClick, children, dark }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        [
          "block w-full px-3 py-2.5 rounded-xl font-semibold transition-colors inline-flex items-center",
          dark
            ? isActive
              ? "bg-white/10 text-white"
              : "hover:bg-white/5 text-white/85"
            : isActive
              ? "bg-slate-100 text-slate-900"
              : "hover:bg-slate-100 text-slate-700",
        ].join(" ")
      }
    >
      {children}
    </NavLink>
  );
}

function MobileCTA({ to, variant = "primary", onClick, children, dark }) {
  const base =
    "public-mobile-cta w-full mt-1.5 h-11 rounded-xl font-bold inline-flex items-center justify-center gap-2 transition-colors";
  let styles;
  if (variant === "primary") {
    styles = dark
      ? "bg-primary hover:bg-primaryAccent text-white"
      : "bg-blue-600 hover:bg-blue-500 text-white";
  } else {
    styles = dark
      ? "border border-white/10 bg-transparent text-white/90 hover:bg-white/5"
      : "liquid-glass-button text-slate-800";
  }
  return (
    <Link to={to} onClick={onClick} className={[base, styles].join(" ")}>
      {children}
    </Link>
  );
}
