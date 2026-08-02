import { Link } from "react-router-dom";
import { LuSparkles } from "react-icons/lu";
import { SiWhatsapp } from "react-icons/si";
import { whatsappUrl } from "@/data/site.js";

export default function LeadCaptureDock() {
  return (
    <>
      <div className="lead-capture-spacer" aria-hidden="true" />
      <aside className="lead-capture-tools" aria-label="Quick contact options">
        <a
          className="lead-capture-whatsapp"
          href={whatsappUrl("Hi MSPixelPulse, I would like to ask about a free personalized website demo.")}
          target="_blank"
          rel="noreferrer"
          aria-label="Ask MSPixelPulse about a free website demo on WhatsApp"
          data-analytics-placement="floating_conversion"
        >
          <SiWhatsapp aria-hidden="true" />
        </a>
        <div className="lead-capture-dock">
          <span aria-hidden="true"><LuSparkles /></span>
          <div>
            <strong>Free personalized demo</strong>
            <small>As little as 1 business day</small>
          </div>
          <Link
            to="/free-demo"
            data-analytics-cta="sticky_free_demo"
            data-analytics-placement="floating_conversion"
          >
            Get My Free Demo
          </Link>
        </div>
      </aside>
    </>
  );
}
