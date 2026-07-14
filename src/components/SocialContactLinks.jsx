import {
  LuGlobe,
  LuMessageCircle,
  LuPhone,
} from "react-icons/lu";
import { SiGithub, SiLinkedin, SiWhatsapp } from "react-icons/si";
import {
  site,
  supportsNativeMessages,
  whatsappUrl,
} from "@/data/site.js";

const allKeys = [
  "linkedin",
  "github",
  "portfolio",
  "phone",
  "messages",
  "whatsapp",
];

export default function SocialContactLinks({
  include = allKeys,
  variant = "icons",
  className = "",
}) {
  const messagingAvailable = supportsNativeMessages();
  const links = [
    {
      key: "linkedin",
      label: "LinkedIn",
      href: site.linkedin,
      ariaLabel: "Visit MSPixelPulse on LinkedIn",
      icon: SiLinkedin,
      external: true,
    },
    {
      key: "github",
      label: "GitHub",
      href: site.github,
      ariaLabel: "View MSPixelPulse GitHub projects",
      icon: SiGithub,
      external: true,
    },
    {
      key: "portfolio",
      label: "Founder portfolio",
      href: site.portfolio,
      ariaLabel: "View Mahak Patel's portfolio",
      icon: LuGlobe,
      external: true,
    },
    {
      key: "phone",
      label: site.phoneDisplay,
      href: site.phoneHref,
      ariaLabel: `Call MSPixelPulse at ${site.phoneDisplay}`,
      icon: LuPhone,
    },
    {
      key: "messages",
      label: "Text / iMessage",
      href: site.messagesHref,
      ariaLabel: "Send an iMessage or text message to MSPixelPulse",
      icon: LuMessageCircle,
      supported: messagingAvailable,
    },
    {
      key: "whatsapp",
      label: "WhatsApp",
      href: whatsappUrl("Hi MSPixelPulse, I would like to discuss a website project."),
      ariaLabel: "Chat with MSPixelPulse on WhatsApp",
      icon: SiWhatsapp,
      external: true,
    },
  ].filter((link) => include.includes(link.key) && link.supported !== false);

  return (
    <div
      className={`social-contact-links social-contact-links--${variant} ${className}`.trim()}
      aria-label="MSPixelPulse contact links"
    >
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <a
            key={link.key}
            className={`social-contact-link social-contact-link--${link.key}`}
            href={link.href}
            aria-label={link.ariaLabel}
            title={link.label}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
          >
            <Icon aria-hidden="true" />
            {variant !== "icons" && <span>{link.label}</span>}
          </a>
        );
      })}
    </div>
  );
}
