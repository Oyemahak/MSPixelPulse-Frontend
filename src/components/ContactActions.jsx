import { SiWhatsapp } from "react-icons/si";
import { LuMessageCircle, LuPhone } from "react-icons/lu";
import {
  site,
  supportsNativeMessages,
  whatsappUrl,
} from "@/data/site.js";

export default function ContactActions({
  message,
  whatsappLabel = "Chat on WhatsApp",
  showPhone = true,
  showMessage = false,
  className = "",
  dark = true,
}) {
  const secondaryClass = dark
    ? "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-5 font-bold text-white/90 transition hover:bg-white/[0.07] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    : "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 font-bold text-slate-900 shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500";
  const whatsappClass = dark
    ? "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-5 font-bold text-white/90 transition hover:bg-white/[0.07] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    : "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 font-bold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500";

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <a
        className={whatsappClass}
        href={whatsappUrl(message)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${whatsappLabel} with MSPixelPulse`}
      >
        <SiWhatsapp className="h-5 w-5" aria-hidden="true" />
        {whatsappLabel}
      </a>
      {showPhone && (
        <a
          className={secondaryClass}
          href={site.phoneHref}
          aria-label={`Call MSPixelPulse at ${site.phoneDisplay}`}
        >
          <LuPhone className="h-5 w-5" aria-hidden="true" />
          {site.phoneDisplay}
        </a>
      )}
      {showMessage && supportsNativeMessages() && (
        <a
          className={secondaryClass}
          href={site.messagesHref}
          aria-label="Send an iMessage or text message to MSPixelPulse"
        >
          <LuMessageCircle className="h-5 w-5" aria-hidden="true" />
          Text / iMessage
        </a>
      )}
    </div>
  );
}
