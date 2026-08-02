import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  ANALYTICS_CONSENT_EVENT,
  hasAnalyticsConsent,
  initializeAnalytics,
  isTrackablePublicPath,
  trackEvent,
} from "@/lib/analytics.js";

const scrollThresholds = [25, 50, 75, 90];
const protocolNavigationDelay = 200;

export default function AnalyticsManager() {
  const { pathname } = useLocation();
  const lastPageView = useRef("");

  useEffect(() => {
    if (!isTrackablePublicPath(pathname) || !hasAnalyticsConsent()) return;
    initializeAnalytics();
    if (lastPageView.current === pathname) return;
    lastPageView.current = pathname;
    trackEvent("page_view", { page_path: pathname });
  }, [pathname]);

  useEffect(() => {
    function handleConsent(event) {
      if (event.detail !== "granted" || !isTrackablePublicPath(pathname)) return;
      initializeAnalytics();
      lastPageView.current = pathname;
      trackEvent("page_view", { page_path: pathname });
    }
    window.addEventListener(ANALYTICS_CONSENT_EVENT, handleConsent);
    return () => window.removeEventListener(ANALYTICS_CONSENT_EVENT, handleConsent);
  }, [pathname]);

  useEffect(() => {
    if (!isTrackablePublicPath(pathname)) return undefined;
    const reached = new Set();
    let frame = 0;

    function measureScroll() {
      frame = 0;
      if (!hasAnalyticsConsent()) return;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const percent = Math.round((window.scrollY / scrollable) * 100);
      scrollThresholds.forEach((threshold) => {
        if (percent >= threshold && !reached.has(threshold)) {
          reached.add(threshold);
          trackEvent("scroll_depth", { page_path: pathname, scroll_percent: threshold });
        }
      });
    }

    function handleScroll() {
      if (!frame) frame = window.requestAnimationFrame(measureScroll);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  useEffect(() => {
    if (!isTrackablePublicPath(pathname)) return undefined;

    function handleClick(event) {
      const target = event.target.closest("a, button");
      if (!target) return;
      const ctaId = target.dataset.analyticsCta;
      const placement = target.dataset.analyticsPlacement || "public_site";
      const href = target instanceof HTMLAnchorElement ? target.getAttribute("href") || "" : "";

      if (href.startsWith("tel:")) {
        event.preventDefault();
        trackEvent("phone_click", { page_path: pathname, placement });
        window.setTimeout(() => window.location.assign(href), protocolNavigationDelay);
      } else if (href.includes("wa.me/")) {
        trackEvent("whatsapp_click", { page_path: pathname, placement });
      } else if (href.startsWith("mailto:")) {
        event.preventDefault();
        trackEvent("email_click", { page_path: pathname, placement });
        window.setTimeout(() => window.location.assign(href), protocolNavigationDelay);
      }
      if (ctaId) {
        trackEvent("cta_click", { page_path: pathname, cta_id: ctaId, placement });
      }
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [pathname]);

  return null;
}
