import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LuCookie, LuX } from "react-icons/lu";
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

  useEffect(() => {
    setVisible(getAnalyticsConsent() === "unset");

    function openPreferences() {
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
      className="cookie-banner"
      aria-label="Analytics preferences"
      data-theme-card={isDark ? "dark" : "light"}
    >
      <div className="cookie-icon" aria-hidden="true">
        <LuCookie className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <h2 className="cookie-title">Analytics preferences</h2>
        <p className="cookie-copy">
          Essential storage keeps core site preferences working. With your permission,
          privacy-limited analytics help us understand public-page performance and conversions.
        </p>
      </div>
      <div className="cookie-actions">
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
        className="cookie-close"
        onClick={() => choose("essential")}
        aria-label="Use essential storage only and close preferences"
      >
        <LuX className="h-4 w-4" aria-hidden="true" />
      </button>
    </section>
  );
}
