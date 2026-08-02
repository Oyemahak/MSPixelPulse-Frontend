import { useSearchParams } from "react-router-dom";
import { LuCalendar, LuSparkles } from "react-icons/lu";
import Container from "@/components/layout/Container.jsx";
import SectionTitle from "@/components/SectionTitle.jsx";
import LeadForm from "@/components/LeadForm.jsx";
import Meta from "@/components/Meta.jsx";
import ContactActions from "@/components/ContactActions.jsx";
import SocialContactLinks from "@/components/SocialContactLinks.jsx";
import { seoPages } from "@/data/seoPages.js";

export default function Contact() {
  const [searchParams] = useSearchParams();
  const demoMode = searchParams.get("request") === "free-demo";
  const selectedPlan = searchParams.get("label") || searchParams.get("service") || "";
  const pageCopy = demoMode
    ? {
        eyebrow: "Free website demo",
        title: "Let’s Build Your Free Website Demo",
        intro:
          "Tell us a few details and we’ll create a FREE personalized website demo for your business to review.",
      }
    : {
        eyebrow: "Contact",
        title: "Let’s Build Your Free Website Demo",
        intro:
          "Tell us a few details and we’ll create a FREE personalized website demo for your business. You can also use this form to discuss a paid website project.",
      };

  return (
    <section className="section contact-page">
      <Container>
        <Meta
          {...seoPages.contact}
          title={demoMode ? seoPages.freeDemo.title : seoPages.contact.title}
          description={demoMode ? seoPages.freeDemo.description : seoPages.contact.description}
          canonical="/contact"
        />

        <SectionTitle eyebrow={pageCopy.eyebrow} title={pageCopy.title} align="left" as="h1" />
        <p className="contact-intro">{pageCopy.intro}</p>

        {demoMode && (
          <aside className="demo-form-note">
            <LuSparkles aria-hidden="true" />
            <p>
              The demo is free to review and supports planning. Final development,
              revisions, integrations, hosting, and ownership terms are discussed separately.
            </p>
          </aside>
        )}

        <div className="contact-layout">
          <LeadForm
            demoMode={demoMode}
            selectedPlan={selectedPlan}
            source={demoMode ? "legacy-free-demo-contact" : "contact-page"}
            sourceSlug={searchParams.get("article") || ""}
          />

          <aside className="contact-side-card">
            <h2>{demoMode ? "What happens next" : "A clear first step"}</h2>
            <ul>
              <li>We review your business, audience, and primary website goal.</li>
              <li>We contact you if one important detail needs clarification.</li>
              <li>We prepare a personalized visual direction for planning and review.</li>
              <li>You decide whether you want to discuss a paid production project.</li>
            </ul>
            <p className="contact-side-note">
              No upfront commitment is required to review the planning demo.
            </p>
            <div className="contact-side-links">
              <SocialContactLinks variant="list" />
            </div>
          </aside>
        </div>

        <div className="contact-project-cta">
          <div className="contact-project-copy">
            <h2>Prefer a conversation?</h2>
            <p>Use the contact option that feels easiest for you.</p>
          </div>
          <div className="contact-project-actions">
            <ContactActions
              showMessage
              className="contact-project-link-grid"
              whatsappLabel="Chat on WhatsApp"
              message="Hi MSPixelPulse, I would like to discuss a website project."
            />
            <a
              className="btn btn-glass"
              href="https://calendly.com/mspixelpulse/30min"
              target="_blank"
              rel="noreferrer"
              data-analytics-cta="book_appointment"
            >
              <LuCalendar className="h-5 w-5" aria-hidden="true" />
              Book appointment
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
