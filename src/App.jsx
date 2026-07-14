// src/App.jsx
// src/App.jsx
import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import AppHeader from "./components/layout/AppHeader.jsx";
import AppFooter from "./components/layout/AppFooter.jsx";
import CookieBanner from "@/components/CookieBanner.jsx";
import { useAuth } from "@/context/AuthContext.jsx";
import { ThemeProvider } from "@/lib/theme.js";

/** Public pages */
const Home = lazy(() => import("./pages/Home.jsx"));
const Projects = lazy(() => import("./pages/Projects.jsx"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail.jsx"));
const Services = lazy(() => import("./pages/Services.jsx"));
const Pricing = lazy(() => import("./pages/Pricing.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));
const Blog = lazy(() => import("./pages/Blog.jsx"));
const BlogPost = lazy(() => import("./pages/BlogPost.jsx"));
const About = lazy(() => import("./pages/About.jsx"));
const LegalPage = lazy(() => import("./pages/LegalPage.jsx"));
const Login = lazy(() => import("./pages/auth/Login.jsx"));
const Register = lazy(() => import("./pages/auth/Register.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));

/** Portals */
const AdminPortal = lazy(() => import("@/portals/admin/index.jsx"));
const ClientPortal = lazy(() => import("@/portals/client/index.jsx"));
const DevPortal = lazy(() => import("@/portals/dev/index.jsx"));

/** Optional utilities */
const DebugConnection = import.meta.env.DEV
  ? lazy(() => import("./pages/DebugConnection.jsx"))
  : null;

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }, [pathname]);
  return null;
}

function RequireRole({ allow, children }) {
  const { isAuthed, role, checked } = useAuth();
  const location = useLocation();
  const allowed = Array.isArray(allow) ? allow : [allow];

  if (!checked) {
    return <PageFallback />;
  }

  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (!allowed.includes(role)) {
    if (role === "admin") return <Navigate to="/admin" replace />;
    if (role === "developer") return <Navigate to="/dev" replace />;
    return <Navigate to="/client" replace />;
  }
  return children;
}

function PageFallback() {
  return (
    <div className="px-4 md:px-6 lg:px-8 py-12">
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-1/3 rounded bg-white/10" />
        <div className="h-5 w-2/3 rounded bg-white/10" />
        <div className="h-64 w-full rounded-2xl bg-white/10" />
      </div>
    </div>
  );
}

function ProtectedLayout() {
  return <Outlet />;
}

export default function App() {
  const { pathname } = useLocation();
  const isPortalRoute =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/client") ||
    pathname.startsWith("/dev");
  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register");
  const hidePublicChrome = isPortalRoute || isAuthRoute;
  const ContentRoot = hidePublicChrome ? "div" : "main";

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-transparent text-textMain">
        <a className="skip-link" href="#main-content">Skip to main content</a>
        {!hidePublicChrome && <AppHeader />}

        <ContentRoot id="main-content" className={hidePublicChrome ? "flex-1" : "public-main flex-1 pt-20 md:pt-24"}>
          <ScrollToTop />
          <Suspense fallback={<PageFallback />}>
            <Routes>
              {/* Public */}
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route path="/services" element={<Services />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<LegalPage page="privacy" />} />
              <Route path="/terms" element={<LegalPage page="terms" />} />
              <Route path="/cookies" element={<LegalPage page="cookies" />} />
              <Route path="/accessibility" element={<LegalPage page="accessibility" />} />
              <Route path="/security" element={<LegalPage page="security" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              {import.meta.env.DEV && DebugConnection && (
                <Route path="/debug" element={<DebugConnection />} />
              )}

              {/* Admin */}
              <Route
                element={
                  <RequireRole allow="admin">
                    <ProtectedLayout />
                  </RequireRole>
                }
              >
                <Route path="/admin/*" element={<AdminPortal />} />
              </Route>

              {/* Developer */}
              <Route
                element={
                  <RequireRole allow="developer">
                    <ProtectedLayout />
                  </RequireRole>
                }
              >
                <Route path="/dev/*" element={<DevPortal />} />
              </Route>

              {/* Client */}
              <Route
                element={
                  <RequireRole allow="client">
                    <ProtectedLayout />
                  </RequireRole>
                }
              >
                <Route path="/client/*" element={<ClientPortal />} />
              </Route>

              {/* 404 fallback — must be LAST */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ContentRoot>

        {!hidePublicChrome && <AppFooter />}
        {!hidePublicChrome && <CookieBanner />}
      </div>
    </ThemeProvider>
  );
}
