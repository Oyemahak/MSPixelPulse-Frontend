export const site = {
  name: "MSPixelPulse",
  legalName: "MSPixelPulse",
  location: "Toronto, Ontario, Canada",
  email: "hello@mspixelpulse.com",
  phoneDisplay: "365-883-0338",
  phoneHref: "tel:+13658830338",
  whatsappBase: "https://wa.me/13658830338",
  url: "https://mspixelpulse.vercel.app",
  description:
    "Professional websites built to help small businesses build trust, present their services clearly, and grow online.",
};

export function whatsappUrl(message) {
  const text =
    message ||
    "Hi MSPixelPulse, I would like to discuss a website project.";
  return `${site.whatsappBase}?text=${encodeURIComponent(text)}`;
}
