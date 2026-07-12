// src/components/layout/AppFooter.jsx
import Container from "./Container.jsx";
import { useTheme } from "@/lib/theme.js";
import { Link } from "react-router-dom";
import { LuMail, LuPhone } from "react-icons/lu";
import { SiWhatsapp } from "react-icons/si";
import { site, whatsappUrl } from "@/data/site.js";

export default function AppFooter() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const year = new Date().getFullYear();

  return (
    <footer
      className={
        isDark
          ? "border-t border-white/10 bg-surface/40 backdrop-blur app-footer"
          : "border-t border-slate-200 bg-slate-100/90 backdrop-blur"
      }
    >
      <Container>
        <div className="py-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr_1fr]">
            <div>
              <div className="flex items-center gap-2">
                <img src="/icon.svg" alt="" className="h-9 w-9" aria-hidden="true" />
                <span className={isDark ? "text-lg font-black text-white" : "text-lg font-black text-slate-950"}>MSPixelPulse</span>
              </div>
              <p className={isDark ? "mt-4 max-w-sm text-sm leading-6 text-textSub" : "mt-4 max-w-sm text-sm leading-6 text-slate-600"}>
                Professional websites built to help small businesses present services clearly and grow online.
              </p>
            </div>

            <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-2 text-sm font-semibold">
              {[
                ["Home", "/"],
                ["Projects", "/projects"],
                ["Services", "/services"],
                ["Pricing", "/pricing"],
                ["Blog", "/blog"],
                ["Contact", "/contact"],
              ].map(([label, href]) => (
                <Link key={href} to={href} className={isDark ? "text-white/70 hover:text-white" : "text-slate-600 hover:text-slate-950"}>
                  {label}
                </Link>
              ))}
            </nav>

            <div className="space-y-3 text-sm">
              <a className={isDark ? "flex items-center gap-2 text-white/70 hover:text-white" : "flex items-center gap-2 text-slate-600 hover:text-slate-950"} href={`mailto:${site.email}`}>
                <LuMail className="h-4 w-4" aria-hidden="true" /> {site.email}
              </a>
              <a className={isDark ? "flex items-center gap-2 text-white/70 hover:text-white" : "flex items-center gap-2 text-slate-600 hover:text-slate-950"} href={site.phoneHref}>
                <LuPhone className="h-4 w-4" aria-hidden="true" /> {site.phoneDisplay}
              </a>
              <a
                className={isDark ? "flex items-center gap-2 text-white/70 hover:text-white" : "flex items-center gap-2 text-slate-600 hover:text-slate-950"}
                href={whatsappUrl("Hi MSPixelPulse, I would like to discuss a website project.")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <SiWhatsapp className="h-4 w-4" aria-hidden="true" /> Chat on WhatsApp
              </a>
            </div>
          </div>

          <div className={isDark ? "mt-8 border-t border-white/10 pt-5 text-xs text-textSub" : "mt-8 border-t border-slate-200 pt-5 text-xs text-slate-500"}>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span>© {year} MSPixelPulse. All rights reserved.</span>
              <span>{site.location}. Legal/privacy pages should be reviewed before custom-domain launch.</span>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
