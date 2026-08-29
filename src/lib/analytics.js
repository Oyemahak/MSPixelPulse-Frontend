export const ANALYTICS_CONSENT_KEY = "mspixelpulse-analytics-consent-v1";
export const ANALYTICS_CONSENT_EVENT = "mspixelpulse:analytics-consent";
export const ANALYTICS_PREFERENCES_EVENT = "mspixelpulse:open-analytics-preferences";

const runtimeEnv = import.meta.env || {};
const mode = String(runtimeEnv.VITE_ANALYTICS_MODE || "direct").toLowerCase();

export const ANALYTICS_MEASUREMENT_ID = String(
  runtimeEnv.VITE_GA_MEASUREMENT_ID || "G-02FD3CJQ9V",
).trim();

const campaignKeys = new Set([
  "utm_id",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_source_platform",
  "utm_creative_format",
  "utm_marketing_tactic",
]);
const clickIdKeys = new Set([
  "gclid",
  "dclid",
  "gclsrc",
  "gbraid",
  "wbraid",
  "msclkid",
]);
const privatePaths = ["/admin", "/client", "/dev"];
const excludedPublicPaths = new Set(["/login", "/register", "/debug"]);
const emailPattern = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
const phonePattern = /(?:\+?\d[\s().-]*){10,}/;

let initialized = false;

function currentLocation() {
  return typeof window === "undefined" ? "" : window.location.href;
}

function initialBrowserContext() {
  if (typeof window === "undefined") {
    return { landingUrl: "", referrer: "", siteOrigin: "" };
  }
  return {
    landingUrl: window.location.href,
    referrer: document.referrer,
    siteOrigin: window.location.origin,
  };
}

const initialContext = initialBrowserContext();

function parseUrl(value, base = "https://mspixelpulse.com") {
  if (!String(value || "").trim()) return null;
  try {
    return new URL(String(value || ""), base);
  } catch {
    return null;
  }
}

export function containsPotentialPii(value) {
  const text = String(value || "");
  return emailPattern.test(text) || phonePattern.test(text);
}

function sanitizeCampaignValue(value, maxLength = 120) {
  const text = String(value || "").trim().slice(0, maxLength);
  if (!text || containsPotentialPii(text)) return "";
  return /^[A-Za-z0-9._~:+/ -]+$/.test(text) ? text : "";
}

function sanitizeClickId(value) {
  const text = String(value || "").trim().slice(0, 220);
  if (!text || containsPotentialPii(text)) return "";
  return /^[A-Za-z0-9._~-]+$/.test(text) ? text : "";
}

export function sanitizePageLocation(value = currentLocation()) {
  const url = parseUrl(value);
  if (!url) return "";

  const safe = new URL(`${url.origin}${url.pathname}`);
  url.searchParams.forEach((rawValue, key) => {
    const normalizedKey = key.toLowerCase();
    const sanitized = campaignKeys.has(normalizedKey)
      ? sanitizeCampaignValue(rawValue)
      : clickIdKeys.has(normalizedKey)
        ? sanitizeClickId(rawValue)
        : "";
    if (sanitized) safe.searchParams.append(normalizedKey, sanitized);
  });

  return safe.toString();
}

export function sanitizePageReferrer(value, siteOrigin = "https://mspixelpulse.com") {
  const referrer = parseUrl(value);
  const site = parseUrl(siteOrigin);
  if (!referrer) return "";
  if (site && referrer.origin === site.origin) {
    return `${referrer.origin}${referrer.pathname}`;
  }
  return `${referrer.origin}/`;
}

function normalizedHostname(value) {
  const url = parseUrl(value);
  return url?.hostname?.toLowerCase().replace(/^www\./, "") || "";
}

function matchesGoogle(hostname) {
  return (
    hostname === "google" ||
    hostname.startsWith("google_") ||
    /(^|\.)google\.[a-z.]+$/i.test(hostname) ||
    hostname.endsWith("googleusercontent.com")
  );
}

function matchesBing(source) {
  return source === "bing" || source.startsWith("bing_") || /(^|\.)bing\.com$/i.test(source);
}

export function classifyTrafficSource({ landingUrl = "", referrer = "", siteOrigin = "" } = {}) {
  const landing = parseUrl(landingUrl);
  const site = parseUrl(siteOrigin || landing?.origin);
  const referrerHost = normalizedHostname(referrer);
  const referrerUrl = parseUrl(referrer);
  const utmSource = sanitizeCampaignValue(landing?.searchParams.get("utm_source") || "").toLowerCase();
  const source = utmSource || referrerHost;

  if (/chatgpt|chat\.openai|openai/.test(source)) return "chatgpt";
  if (/perplexity/.test(source)) return "perplexity";
  if (/gemini|bard\.google/.test(source)) return "gemini";
  if (
    /copilot/.test(source) ||
    (/(^|\.)bing\.com$/.test(referrerHost) && referrerUrl?.pathname.startsWith("/chat"))
  ) return "copilot";
  if (matchesGoogle(source)) return "google";
  if (matchesBing(source)) return "bing";
  if (utmSource) return "campaign";
  if (!referrerHost) return "direct";
  if (site && referrerUrl?.origin === site.origin) return "internal";
  return "other_referral";
}

export function getAttributionContext(context = initialContext) {
  const referrerHost = normalizedHostname(context.referrer);
  return {
    traffic_source_group: classifyTrafficSource(context),
    referring_domain: referrerHost || "direct",
  };
}

const initialAttribution = getAttributionContext(initialContext);
const initialReferrer = sanitizePageReferrer(initialContext.referrer, initialContext.siteOrigin);

export function getAnalyticsConsent() {
  if (typeof window === "undefined") return "unset";
  const choice = window.localStorage.getItem(ANALYTICS_CONSENT_KEY);
  return choice === "granted" || choice === "essential" ? choice : "unset";
}

export function hasAnalyticsConsent() {
  return getAnalyticsConsent() === "granted";
}

export function setAnalyticsConsent(choice) {
  if (typeof window === "undefined") return;
  const safeChoice = choice === "granted" ? "granted" : "essential";
  window.localStorage.setItem(ANALYTICS_CONSENT_KEY, safeChoice);

  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      analytics_storage: safeChoice === "granted" ? "granted" : "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  }

  window.dispatchEvent(
    new CustomEvent(ANALYTICS_CONSENT_EVENT, { detail: safeChoice }),
  );
}

export function openAnalyticsPreferences() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(ANALYTICS_PREFERENCES_EVENT));
}

export function isTrackablePublicPath(pathname) {
  const path = String(pathname || "/");
  return !(
    excludedPublicPaths.has(path) ||
    privatePaths.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))
  );
}

function isDebugMode() {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("ga_debug") === "1";
}

function ensureGtag() {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };
}

function appendAnalyticsScript() {
  if (document.getElementById("mspixelpulse-ga4")) return;
  const script = document.createElement("script");
  script.id = "mspixelpulse-ga4";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ANALYTICS_MEASUREMENT_ID)}`;
  document.head.appendChild(script);
}

export function initializeAnalytics() {
  if (
    typeof window === "undefined" ||
    initialized ||
    !hasAnalyticsConsent() ||
    mode !== "direct" ||
    !/^G-[A-Z0-9]+$/i.test(ANALYTICS_MEASUREMENT_ID)
  ) {
    return initialized;
  }

  ensureGtag();
  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  window.gtag("consent", "update", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  window.gtag("set", initialAttribution);
  window.gtag("js", new Date());
  window.gtag("config", ANALYTICS_MEASUREMENT_ID, {
    send_page_view: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    ads_data_redaction: true,
    ...initialAttribution,
    page_location: sanitizePageLocation(initialContext.landingUrl),
    ...(initialReferrer ? { page_referrer: initialReferrer } : {}),
    ...(isDebugMode() ? { debug_mode: true } : {}),
  });
  appendAnalyticsScript();
  initialized = true;
  return true;
}

export function sanitizeAnalyticsParameters(parameters = {}) {
  const safe = {};

  Object.entries(parameters).forEach(([rawKey, rawValue]) => {
    const key = String(rawKey || "").replace(/[^a-zA-Z0-9_]/g, "").slice(0, 40);
    if (!key || rawValue === null || rawValue === undefined) return;

    if (typeof rawValue === "boolean") {
      safe[key] = rawValue;
      return;
    }

    if (typeof rawValue === "number" && Number.isFinite(rawValue)) {
      safe[key] = rawValue;
      return;
    }

    if (typeof rawValue !== "string") return;
    const value = rawValue.trim().slice(0, key.startsWith("page_") ? 500 : 100);
    if (!value || containsPotentialPii(value)) return;
    safe[key] = value;
  });

  return safe;
}

export function trackEvent(name, parameters = {}, options = {}) {
  if (typeof window === "undefined" || !hasAnalyticsConsent()) return false;
  if (!initializeAnalytics()) return false;

  const safeName = String(name || "")
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, 40);
  if (!safeName) return false;

  const callback = typeof options.callback === "function" ? options.callback : null;
  const timeout = Number.isFinite(options.timeout)
    ? Math.max(0, Math.min(options.timeout, 5000))
    : 1000;
  const safeParameters = sanitizeAnalyticsParameters({
    ...initialAttribution,
    page_location: sanitizePageLocation(),
    ...parameters,
    ...(isDebugMode() ? { debug_mode: true } : {}),
  });

  window.gtag("event", safeName, {
    ...safeParameters,
    send_to: ANALYTICS_MEASUREMENT_ID,
    transport_type: "beacon",
    ...(callback ? { event_callback: callback, event_timeout: timeout } : {}),
  });
  return true;
}
