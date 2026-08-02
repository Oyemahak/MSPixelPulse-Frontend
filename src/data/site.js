const runtimeEnv = import.meta.env || globalThis.process?.env || {};
const publicSiteUrl = (runtimeEnv.VITE_SITE_URL || "https://mspixelpulse.com")
  .trim()
  .replace(/\/+$/, "");
const streetAddress = String(runtimeEnv.VITE_BUSINESS_STREET_ADDRESS || "").trim();
const businessHours = String(runtimeEnv.VITE_BUSINESS_HOURS || "")
  .split("|")
  .map((value) => value.trim())
  .filter(Boolean);

export const site = {
  name: "MSPixelPulse",
  legalName: "MSPixelPulse",
  location: "Toronto, Ontario, Canada",
  phoneDisplay: "+1 (365) 883-0338",
  phoneHref: "tel:+13658830338",
  messagesHref: "sms:+13658830338",
  whatsappBase: "https://wa.me/13658830338",
  portfolio: "https://mahakpatel.com",
  linkedin: "https://www.linkedin.com/in/mahak-patel-167640150/",
  github: "https://github.com/MSPixelPulseAgency",
  email: runtimeEnv.VITE_SUPPORT_EMAIL || "info@mspixelpulse.com",
  emailHref: `mailto:${runtimeEnv.VITE_SUPPORT_EMAIL || "info@mspixelpulse.com"}`,
  url: publicSiteUrl,
  serviceAreas: [
    "Toronto, Ontario, Canada",
    "Brampton, Ontario, Canada",
    "Mississauga, Ontario, Canada",
    "Greater Toronto Area, Ontario, Canada",
    "Canada",
  ],
  publicAddress: streetAddress
    ? {
        streetAddress,
        addressLocality: String(runtimeEnv.VITE_BUSINESS_CITY || "Toronto").trim(),
        addressRegion: String(runtimeEnv.VITE_BUSINESS_REGION || "Ontario").trim(),
        postalCode: String(runtimeEnv.VITE_BUSINESS_POSTAL_CODE || "").trim(),
        addressCountry: String(runtimeEnv.VITE_BUSINESS_COUNTRY || "CA").trim(),
      }
    : null,
  businessHours,
  description:
    "Professional websites built to help small businesses build trust, present their services clearly, and grow online.",
};

export function supportsNativeMessages() {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent);
}

export function whatsappUrl(message) {
  const text =
    message ||
    "Hi MSPixelPulse, I would like to discuss a website project.";
  return `${site.whatsappBase}?text=${encodeURIComponent(text)}`;
}
