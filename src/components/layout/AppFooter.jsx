// src/components/layout/AppFooter.jsx
import Container from "./Container.jsx";
import { Link } from "react-router-dom";
import { LuPhone } from "react-icons/lu";
import { SiWhatsapp } from "react-icons/si";
import { site, whatsappUrl } from "@/data/site.js";
import { useTheme } from "@/lib/theme.js";

export default function AppFooter() {
  const year = new Date().getFullYear();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const brandText = isDark ? "text-white" : "text-slate-950";
  const bodyText = isDark ? "text-white/64" : "text-slate-600";
  const linkText = isDark ? "text-white/70 hover:text-white" : "text-slate-600 hover:text-slate-950";
  const legalText = isDark ? "text-white/58" : "text-slate-500";

  return (
    <footer className="app-footer border-t backdrop-blur">
      <Container>
        <div className="py-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr_1fr]">
            <div>
              <div className="flex items-center gap-2">
                <img src="/icon.svg" alt="" className="h-9 w-9" aria-hidden="true" />
                <span className={`text-lg font-black ${brandText}`}>MSPixelPulse</span>
              </div>
              <p className={`mt-4 max-w-sm text-sm leading-6 ${bodyText}`}>
                Professional websites built to help small businesses present services clearly and grow online.
              </p>
            </div>

            <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-2 text-sm font-semibold">
              {[
                ["Home", "/"],
                ["Projects", "/projects"],
                ["About", "/about"],
                ["Services", "/services"],
                ["Pricing", "/pricing"],
                ["Blog", "/blog"],
                ["Contact", "/contact"],
              ].map(([label, href]) => (
                <Link key={href} to={href} className={linkText}>
                  {label}
                </Link>
              ))}
            </nav>

            <div className="space-y-3 text-sm">
              <a className={`flex items-center gap-2 ${linkText}`} href={site.phoneHref}>
                <LuPhone className="h-4 w-4" aria-hidden="true" /> {site.phoneDisplay}
              </a>
              <a
                className={`flex items-center gap-2 ${linkText}`}
                href={whatsappUrl("Hi MSPixelPulse, I would like to discuss a website project.")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <SiWhatsapp className="h-4 w-4" aria-hidden="true" /> Chat on WhatsApp
              </a>
            </div>
          </div>

          <div className={`mt-8 border-t pt-5 text-xs ${isDark ? "border-white/10" : "border-slate-200/80"} ${legalText}`}>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span>© {year} MSPixelPulse. All rights reserved.</span>
              <nav className="flex flex-wrap gap-x-3 gap-y-1" aria-label="Legal links">
                <Link to="/privacy" className="hover:underline">Privacy</Link>
                <Link to="/terms" className="hover:underline">Terms</Link>
                <Link to="/cookies" className="hover:underline">Cookies</Link>
                <Link to="/accessibility" className="hover:underline">Accessibility</Link>
                <Link to="/security" className="hover:underline">Security</Link>
              </nav>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
