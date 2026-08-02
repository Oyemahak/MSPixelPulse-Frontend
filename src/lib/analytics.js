export const ANALYTICS_CONSENT_KEY = "mspixelpulse-analytics-consent-v1";
export const ANALYTICS_CONSENT_EVENT = "mspixelpulse:analytics-consent";
export const ANALYTICS_PREFERENCES_EVENT = "mspixelpulse:open-analytics-preferences";

const mode = String(import.meta.env.VITE_ANALYTICS_MODE || "off").toLowerCase();
const gtmId = String(import.meta.env.VITE_GTM_CONTAINER_ID || "").trim();
const gaId = String(import.meta.env.VITE_GA_MEASUREMENT_ID || "").trim();

let initialized = false;

function isDebugMode() {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("ga_debug") === "1";
}

function getSanitizedPageLocation() {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}${window.location.pathname}`;
}

export function getAnalyticsConsent() {
  if (typeof window === "undefined") return "unset";
  return window.localStorage.getItem(ANALYTICS_CONSENT_KEY) || "unset";
}

export function setAnalyticsConsent(choice) {
  if (typeof window === "undefined") return;
  const safeChoice = choice === "granted" ? "granted" : "essential";
  window.localStorage.setItem(ANALYTICS_CONSENT_KEY, safeChoice);
  window.dispatchEvent(new CustomEvent(ANALYTICS_CONSENT_EVENT, { detail: safeChoice }));
}

export function openAnalyticsPreferences() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(ANALYTICS_PREFERENCES_EVENT));
}

export function hasAnalyticsConsent() {
  return getAnalyticsConsent() === "granted";
}

export function isTrackablePublicPath(pathname) {
  const path = String(pathname || "/");
  return !(
    path === "/login" ||
    path === "/register" ||
    path === "/debug" ||
    path.startsWith("/admin") ||
    path.startsWith("/client") ||
    path.startsWith("/dev")
  );
}

function appendScript(id, source) {
  if (document.getElementById(id)) return;
  const script = document.createElement("script");
  script.id = id;
  script.async = true;
  script.src = source;
  document.head.appendChild(script);
}

export function initializeAnalytics() {
  if (typeof window === "undefined" || initialized || !hasAnalyticsConsent()) return initialized;
  if (mode === "gtm" && /^GTM-[A-Z0-9]+$/i.test(gtmId)) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    appendScript("mspixelpulse-gtm", `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`);
    initialized = true;
    return true;
  }
  if (mode === "direct" && /^G-[A-Z0-9]+$/i.test(gaId)) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", gaId, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      page_location: getSanitizedPageLocation(),
      ...(isDebugMode() ? { debug_mode: true } : {}),
    });
    appendScript("mspixelpulse-ga4", `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`);
    initialized = true;
    return true;
  }
  return false;
}

function sanitizeParameters(parameters) {
  return Object.fromEntries(
    Object.entries(parameters)
      .filter(([, value]) => ["string", "number", "boolean"].includes(typeof value))
      .map(([key, value]) => [key, typeof value === "string" ? value.slice(0, 80) : value]),
  );
}

export function trackEvent(name, parameters = {}) {
  if (typeof window === "undefined" || !hasAnalyticsConsent()) return;
  if (!initializeAnalytics()) return;

  const safeName = String(name || "").replace(/[^a-zA-Z0-9_]/g, "").slice(0, 40);
  if (!safeName) return;
  const safeParameters = sanitizeParameters({
    ...parameters,
    page_location: getSanitizedPageLocation(),
    ...(isDebugMode() ? { debug_mode: true } : {}),
  });

  if (mode === "direct" && typeof window.gtag === "function") {
    window.gtag("event", safeName, safeParameters);
    return;
  }
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: safeName, ...safeParameters });
}
