export const site = {
  name: "MSPixelPulse",
  legalName: "MSPixelPulse",
  location: "Toronto, Ontario, Canada",
  email: "hello@mspixelpulse.com",
  emailHref: "mailto:hello@mspixelpulse.com",
  phoneDisplay: "+1 (365) 883-0338",
  phoneHref: "tel:+13658830338",
  messagesHref: "sms:+13658830338",
  whatsappBase: "https://wa.me/13658830338",
  portfolio: "https://mahakpatel.com",
  linkedin: "https://www.linkedin.com/in/mahak-patel-167640150/",
  github: "https://github.com/MSPixelPulseAgency",
  url: "https://mspixelpulse.vercel.app",
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
