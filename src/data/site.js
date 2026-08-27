const runtimeEnv = import.meta.env || {};
const publicSiteUrl = (runtimeEnv.VITE_SITE_URL || "https://mspixelpulse.com")
  .trim()
  .replace(/\/+$/, "");

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
  description:
    "Toronto web development and UX/UI agency providing WordPress, React, website design, redesign, Moodle LMS, school, small-business website, and maintenance services across Canada.",
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
