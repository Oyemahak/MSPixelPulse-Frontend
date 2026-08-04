import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LuChevronDown, LuChevronUp, LuCookie, LuX } from "react-icons/lu";
import { useTheme } from "@/lib/theme.js";
import {
  ANALYTICS_PREFERENCES_EVENT,
  getAnalyticsConsent,
  setAnalyticsConsent,
} from "@/lib/analytics.js";

export default function CookieBanner() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(() => (
    typeof window === "undefined" || !window.matchMedia("(max-width: 640px)").matches
  ));

  useEffect(() => {
    setVisible(getAnalyticsConsent() === "unset");

    function openPreferences() {
      setExpanded(true);
      setVisible(true);
    }
    window.addEventListener(ANALYTICS_PREFERENCES_EVENT, openPreferences);
    return () => window.removeEventListener(ANALYTICS_PREFERENCES_EVENT, openPreferences);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("cookie-banner-visible", visible);
    return () => document.documentElement.classList.remove("cookie-banner-visible");
  }, [visible]);

  function choose(choice) {
    const previous = getAnalyticsConsent();
    setAnalyticsConsent(choice);
    setVisible(false);
    if (previous === "granted" && choice !== "granted") window.location.reload();
  }

  if (!visible) return null;

  return (
    <section
      className={`cookie-banner ${expanded ? "is-expanded" : "is-collapsed"}`}
      aria-label="Analytics preferences"
      data-theme-card={isDark ? "dark" : "light"}
    >
      <div className="cookie-icon" aria-hidden="true">
        <LuCookie className="h-5 w-5" />
      </div>
      <p className="cookie-copy" id="analytics-preferences-copy">
        <strong className="cookie-title">Analytics preferences.</strong>{" "}
        <span className="cookie-details-copy">
          Essential storage keeps the site working. With your permission, privacy-limited
          analytics help us improve public pages and conversions.
        </span>
      </p>
      <div className="cookie-actions" id="analytics-preference-actions" hidden={!expanded}>
        <Link to="/cookies" className="cookie-link">Cookie details</Link>
        <button type="button" className="cookie-link" onClick={() => choose("essential")}>
          Essential only
        </button>
        <button type="button" className="cookie-accept" onClick={() => choose("granted")}>
          Accept analytics
        </button>
      </div>
      <button
        type="button"
        className="cookie-expand"
        onClick={() => setExpanded((current) => !current)}
        aria-expanded={expanded}
        aria-controls="analytics-preference-actions"
        aria-label={expanded ? "Collapse analytics preferences" : "Manage analytics preferences"}
      >
        <span>{expanded ? "Less" : "Manage"}</span>
        {expanded ? <LuChevronUp aria-hidden="true" /> : <LuChevronDown aria-hidden="true" />}
      </button>
      <button
        type="button"
        className="cookie-close"
        onClick={() => choose("essential")}
        aria-label="Use essential storage only and close preferences"
      >
        <LuX className="h-4 w-4" aria-hidden="true" />
      </button>
    </section>
  );
}
