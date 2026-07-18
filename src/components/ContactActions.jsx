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
}) {
  const secondaryClass = "btn btn-glass";
  const whatsappClass = "btn btn-secondary";

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
