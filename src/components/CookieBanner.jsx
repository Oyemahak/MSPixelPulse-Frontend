import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LuCookie, LuX } from "react-icons/lu";
import { useTheme } from "@/lib/theme.js";

const CONSENT_KEY = "mspixelpulse-cookie-consent";

export default function CookieBanner() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setVisible(window.localStorage.getItem(CONSENT_KEY) !== "accepted");
  }, []);

  const accept = () => {
    window.localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <section
      className="cookie-banner"
      aria-label="Cookie notice"
      data-theme-card={isDark ? "dark" : "light"}
    >
      <div className="cookie-icon" aria-hidden="true">
        <LuCookie className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <h2 className="cookie-title">Cookie notice</h2>
        <p className="cookie-copy">
          MSPixelPulse uses essential cookies and local preferences to keep the site theme, navigation, and forms working smoothly.
        </p>
      </div>
      <div className="cookie-actions">
        <Link to="/cookies" className="cookie-link">
          Cookie details
        </Link>
        <button type="button" className="cookie-accept" onClick={accept}>
          Got it
        </button>
      </div>
      <button type="button" className="cookie-close" onClick={accept} aria-label="Close cookie notice">
        <LuX className="h-4 w-4" />
      </button>
    </section>
  );
}
