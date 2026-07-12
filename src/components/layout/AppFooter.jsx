// src/components/layout/AppFooter.jsx
import Container from "./Container.jsx";
import { Link } from "react-router-dom";
import { LuPhone } from "react-icons/lu";
import { SiWhatsapp } from "react-icons/si";
import { site, whatsappUrl } from "@/data/site.js";

export default function AppFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="app-footer border-t border-white/10 backdrop-blur">
      <Container>
        <div className="py-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr_1fr]">
            <div>
              <div className="flex items-center gap-2">
                <img src="/icon.svg" alt="" className="h-9 w-9" aria-hidden="true" />
                <span className="text-lg font-black text-white">MSPixelPulse</span>
              </div>
              <p className="mt-4 max-w-sm text-sm leading-6 text-white/64">
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
                <Link key={href} to={href} className="text-white/70 hover:text-white">
                  {label}
                </Link>
              ))}
            </nav>

            <div className="space-y-3 text-sm">
              <a className="flex items-center gap-2 text-white/70 hover:text-white" href={site.phoneHref}>
                <LuPhone className="h-4 w-4" aria-hidden="true" /> {site.phoneDisplay}
              </a>
              <a
                className="flex items-center gap-2 text-white/70 hover:text-white"
                href={whatsappUrl("Hi MSPixelPulse, I would like to discuss a website project.")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <SiWhatsapp className="h-4 w-4" aria-hidden="true" /> Chat on WhatsApp
              </a>
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-5 text-xs text-white/58">
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
