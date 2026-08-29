import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  ANALYTICS_CONSENT_EVENT,
  hasAnalyticsConsent,
  initializeAnalytics,
  isTrackablePublicPath,
  trackEvent,
} from "@/lib/analytics.js";

export default function AnalyticsManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (isTrackablePublicPath(pathname) && hasAnalyticsConsent()) {
      initializeAnalytics();
    }

    function handleConsent(event) {
      if (event.detail === "granted" && isTrackablePublicPath(pathname)) {
        initializeAnalytics();
      }
    }

    window.addEventListener(ANALYTICS_CONSENT_EVENT, handleConsent);
    return () => window.removeEventListener(ANALYTICS_CONSENT_EVENT, handleConsent);
  }, [pathname]);

  useEffect(() => {
    if (!isTrackablePublicPath(pathname)) return undefined;

    function handleClick(event) {
      const origin = event.target instanceof Element ? event.target : event.target?.parentElement;
      const target = origin?.closest?.("a, button");
      if (!target || target.closest("[data-analytics-ignore]")) return;

      const href = target instanceof HTMLAnchorElement
        ? target.getAttribute("href") || ""
        : "";
      const normalizedHref = href.toLowerCase();
      const placement = target.dataset.analyticsPlacement || "public_site";
      const ctaId = target.dataset.analyticsCta || "";
      let eventName = "";

      if (normalizedHref.startsWith("tel:")) eventName = "phone_click";
      else if (normalizedHref.startsWith("mailto:")) eventName = "email_click";
      else if (normalizedHref.startsWith("sms:")) eventName = "sms_click";
      else if (normalizedHref.includes("wa.me/")) eventName = "whatsapp_click";
      else if (normalizedHref.includes("calendly.com/")) eventName = "booking_click";
      else if (ctaId) eventName = "cta_click";

      if (!eventName) return;
      trackEvent(eventName, {
        page_path: pathname,
        cta_placement: placement,
        ...(ctaId ? { cta_id: ctaId } : {}),
      });
    }

    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, [pathname]);

  return null;
}
