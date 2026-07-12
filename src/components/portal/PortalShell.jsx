// src/components/portal/PortalShell.jsx
import "@/portals/css/portal.css";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext.jsx";
import { useTheme } from "@/lib/theme.js";
import {
  LuBell,
  LuBriefcaseBusiness,
  LuCheckCheck,
  LuChevronRight,
  LuCreditCard,
  LuFolderKanban,
  LuHouse,
  LuLayoutDashboard,
  LuLogOut,
  LuMenu,
  LuMessageSquare,
  LuMoon,
  LuSettings,
  LuShieldCheck,
  LuSparkles,
  LuSun,
  LuUsers,
  LuUserRound,
  LuX,
} from "react-icons/lu";

const roleMeta = {
  admin: {
    label: "Admin Portal",
    home: "/admin",
    tone: "Operations",
    nav: [
      { to: "/admin/dashboard", label: "Dashboard", icon: LuLayoutDashboard, end: true },
      { to: "/admin/projects", label: "Projects", icon: LuFolderKanban },
      { to: "/admin/users", label: "Users", icon: LuUsers },
      { to: "/admin/approvals", label: "Approvals", icon: LuCheckCheck },
      { to: "/admin/billing", label: "Billing", icon: LuCreditCard },
      { to: "/admin/discussions", label: "Project rooms", icon: LuMessageSquare },
      { to: "/admin/messages", label: "Messages", icon: LuBell, aliases: ["/admin/direct"] },
      { to: "/admin/profile", label: "Profile", icon: LuUserRound, aliases: ["/admin/my-account"] },
      { to: "/admin/settings", label: "Settings", icon: LuSettings },
    ],
  },
  developer: {
    label: "Developer Portal",
    home: "/dev",
    tone: "Delivery",
    nav: [
      { to: "/dev/dashboard", label: "Dashboard", icon: LuLayoutDashboard, end: true },
      { to: "/dev/projects", label: "Projects", icon: LuFolderKanban },
      { to: "/dev/discussions", label: "Project rooms", icon: LuMessageSquare },
      { to: "/dev/messages", label: "Messages", icon: LuBell, aliases: ["/dev/direct"] },
      { to: "/dev/team", label: "Team", icon: LuUsers },
      { to: "/dev/profile", label: "Profile", icon: LuUserRound, aliases: ["/dev/my-account"] },
      { to: "/dev/settings", label: "Settings", icon: LuSettings },
    ],
  },
  client: {
    label: "Client Portal",
    home: "/client",
    tone: "Projects",
    nav: [
      { to: "/client/dashboard", label: "Dashboard", icon: LuLayoutDashboard, end: true },
      { to: "/client/projects", label: "Projects", icon: LuFolderKanban },
      { to: "/client/discussions", label: "Project rooms", icon: LuMessageSquare },
      { to: "/client/billing", label: "Billing", icon: LuCreditCard },
      { to: "/client/support", label: "Support", icon: LuShieldCheck },
      { to: "/client/profile", label: "Profile", icon: LuUserRound, aliases: ["/client/my-account"] },
      { to: "/client/settings", label: "Settings", icon: LuSettings },
    ],
  },
};

function initials(user) {
  const source = user?.name || user?.email || "MS";
  return source
    .split(/[ @._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "MS";
}

function isActivePath(pathname, item) {
  const targets = [item.to, ...(item.aliases || [])];
  return targets.some((target) => {
    if (item.end) return pathname === target || pathname === target.replace(/\/dashboard$/, "");
    return pathname === target || pathname.startsWith(`${target}/`);
  });
}

function PortalNav({ links, pathname, onNavigate }) {
  return (
    <nav className="portal-nav" aria-label="Portal navigation">
      {links.map((item) => {
        const Icon = item.icon;
        const active = isActivePath(pathname, item);

        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={active ? "portal-nav-item is-active" : "portal-nav-item"}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}

export default function PortalShell({ children }) {
  const { role, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);

  const meta = roleMeta[role] || roleMeta.client;
  const links = meta.nav;
  const activeItem = useMemo(
    () => links.find((item) => isActivePath(pathname, item)) || links[0],
    [links, pathname]
  );

  useEffect(() => {
    setAvatarFailed(false);
  }, [user?.avatarUrl]);

  async function onLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="portal-frame">
      <aside className="portal-sidebar">
        <Link to={meta.home} className="portal-brand" aria-label="MSPixelPulse portal dashboard">
          <span className="portal-logo-mark">M</span>
          <span>
            <span className="portal-brand-name">MSPixelPulse</span>
            <span className="portal-brand-sub">{meta.label}</span>
          </span>
        </Link>

        <div className="portal-context-card">
          <LuBriefcaseBusiness className="h-4 w-4" aria-hidden="true" />
          <div>
            <div className="portal-context-kicker">{meta.tone}</div>
            <div className="portal-context-title">Agency workspace</div>
          </div>
        </div>

        <PortalNav links={links} pathname={pathname} />

        <div className="portal-sidebar-footer">
          <Link to="/" className="portal-ghost-link">
            <LuHouse className="h-4 w-4" aria-hidden="true" />
            Public website
          </Link>
        </div>
      </aside>

      {drawerOpen && (
        <div className="portal-drawer-backdrop" onClick={() => setDrawerOpen(false)}>
          <aside className="portal-drawer" onClick={(event) => event.stopPropagation()}>
            <div className="portal-drawer-head">
              <Link to={meta.home} className="portal-brand" onClick={() => setDrawerOpen(false)}>
                <span className="portal-logo-mark">M</span>
                <span>
                  <span className="portal-brand-name">MSPixelPulse</span>
                  <span className="portal-brand-sub">{meta.label}</span>
                </span>
              </Link>
              <button
                type="button"
                className="portal-icon-button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
              >
                <LuX className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <PortalNav links={links} pathname={pathname} onNavigate={() => setDrawerOpen(false)} />
          </aside>
        </div>
      )}

      <section className="portal-main">
        <header className="portal-topbar">
          <div className="portal-topbar-left">
            <button
              type="button"
              className="portal-icon-button portal-menu-button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open portal menu"
            >
              <LuMenu className="h-5 w-5" aria-hidden="true" />
            </button>
            <div>
              <div className="portal-breadcrumb">
                {meta.label}
                <LuChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                {activeItem?.label || "Workspace"}
              </div>
              <h1 className="portal-page-heading">{activeItem?.label || "Workspace"}</h1>
            </div>
          </div>

          <div className="portal-actions">
            <button
              type="button"
              className="portal-icon-button"
              onClick={toggleTheme}
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? (
                <LuSun className="h-5 w-5" aria-hidden="true" />
              ) : (
                <LuMoon className="h-5 w-5" aria-hidden="true" />
              )}
            </button>

            <Link to={`${meta.home}/profile`} className="portal-user-chip" aria-label="Open profile">
              <span className="portal-avatar">
                {user?.avatarUrl && !avatarFailed ? (
                  <img src={user.avatarUrl} alt="" onError={() => setAvatarFailed(true)} />
                ) : (
                  initials(user)
                )}
              </span>
              <span className="portal-user-copy">
                <span>{user?.name || "Profile"}</span>
                <small>{user?.email || "Signed in"}</small>
              </span>
            </Link>

            <button type="button" className="portal-icon-button" onClick={onLogout} aria-label="Log out">
              <LuLogOut className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </header>

        <main className="portal-content">{children}</main>

        <footer className="portal-footer">
          <span>MSPixelPulse secure workspace</span>
          <span className="portal-footer-dot" />
          <span>Toronto agency operations</span>
          <LuSparkles className="h-4 w-4" aria-hidden="true" />
        </footer>
      </section>
    </div>
  );
}
