import Container from "./Container.jsx";
import { Link } from "react-router-dom";
import SocialContactLinks from "@/components/SocialContactLinks.jsx";
import { site } from "@/data/site.js";

const navigation = [
  ["Home", "/"],
  ["Projects", "/projects"],
  ["About", "/about"],
  ["Services", "/services"],
  ["Pricing", "/pricing"],
  ["Blog", "/blog"],
  ["Contact", "/contact"],
];

const serviceLinks = [
  "Web design & UX/UI",
  "React development",
  "WordPress development",
  "Client portal solutions",
  "Website maintenance",
];

export default function AppFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <Container>
        <div className="agency-footer-main">
          <div className="agency-footer-brand">
            <div className="agency-footer-logo">
              <img src="/icon.svg" alt="" aria-hidden="true" />
              <span>MSPixelPulse</span>
            </div>
            <p>
              Thoughtful web design, development, and client portal solutions for
              small businesses in Toronto and across Canada.
            </p>
            <span className="agency-footer-location">{site.location}</span>
            <SocialContactLinks
              include={["linkedin", "github", "portfolio"]}
              variant="icons"
            />
          </div>

          <nav className="agency-footer-column" aria-label="Footer navigation">
            <h2>Explore</h2>
            {navigation.map(([label, href]) => (
              <Link key={href} to={href}>{label}</Link>
            ))}
          </nav>

          <div className="agency-footer-column">
            <h2>Services</h2>
            {serviceLinks.map((label) => (
              <Link key={label} to="/services">{label}</Link>
            ))}
          </div>

          <div className="agency-footer-column agency-footer-contact">
            <h2>Contact</h2>
            <p>Have a website, redesign, or portal project in mind?</p>
            <SocialContactLinks
              include={["email", "phone", "messages", "whatsapp"]}
              variant="list"
            />
          </div>
        </div>

        <div className="agency-footer-bottom">
          <span>© {year} MSPixelPulse. All rights reserved.</span>
          <nav aria-label="Legal links">
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/cookies">Cookies</Link>
            <Link to="/accessibility">Accessibility</Link>
            <Link to="/security">Security</Link>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
