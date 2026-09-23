import {
  LuArrowRight,
  LuCheck,
  LuLayoutTemplate,
  LuLightbulb,
  LuMessagesSquare,
  LuMousePointerClick,
} from "react-icons/lu";
import Container from "@/components/layout/Container.jsx";
import { ButtonLink } from "@/components/ui/Button.jsx";

const steps = [
  {
    icon: LuMessagesSquare,
    title: "Tell us your idea",
    body: "Share your business and goals.",
  },
  {
    icon: LuLayoutTemplate,
    title: "See a visual demo",
    body: "We prepare a direction for you.",
  },
  {
    icon: LuMousePointerClick,
    title: "Review the idea",
    body: "Explore pages and key features.",
  },
  {
    icon: LuLightbulb,
    title: "Choose your next step",
    body: "Refine it or discuss a plan.",
  },
];

export const demoOfferShortCopy =
  "Not sure what your website needs? Tell us about your business and request a free personalized demo before choosing a plan.";

export default function DemoOffer({ compact = false, className = "" }) {
  if (compact) {
    return (
      <section className={`demo-prompt ${className}`.trim()} aria-labelledby="demo-prompt-title">
        <div>
          <p className="demo-eyebrow">Free planning demo</p>
          <h2 id="demo-prompt-title">See your website idea before choosing a plan.</h2>
          <p>{demoOfferShortCopy}</p>
        </div>
        <ButtonLink
          size="lg"
          to="/contact?request=free-demo"
          data-analytics-cta="request_free_demo"
          data-analytics-placement="demo_prompt"
        >
          Request My Free Demo
          <LuArrowRight aria-hidden="true" />
        </ButtonLink>
      </section>
    );
  }

  return (
    <section className={`section demo-offer-section ${className}`.trim()} aria-labelledby="demo-offer-title">
      <Container>
        <div className="demo-offer-shell">
          <div className="demo-offer-intro">
            <div>
              <p className="demo-eyebrow">A clearer way to start</p>
              <h2 id="demo-offer-title">See Your Website Idea Before You Pay</h2>
              <p className="demo-offer-lead">Share your idea. We’ll prepare a personalized website preview so you can see a direction before choosing a plan.</p>
              <div className="demo-offer-actions">
                <ButtonLink
                  size="lg"
                  to="/contact?request=free-demo"
                  data-analytics-cta="request_free_demo"
                  data-analytics-placement="demo_offer"
                >
                  Request Free Demo
                  <LuArrowRight aria-hidden="true" />
                </ButtonLink>
                <ButtonLink
                  variant="glass"
                  to="/blog/free-website-demo-before-you-pay"
                  data-analytics-cta="learn_free_demo"
                  data-analytics-placement="demo_offer"
                >
                  How It Works
                </ButtonLink>
              </div>
            </div>

            <div className="demo-browser-preview" aria-label="Illustrative personalized website demo preview">
              <div className="demo-browser-toolbar" aria-hidden="true">
                <span /><span /><span />
                <small>your-business-demo.ca</small>
              </div>
              <div className="demo-browser-content" aria-hidden="true">
                <div className="demo-browser-copy">
                  <i />
                  <strong />
                  <strong className="short" />
                  <span />
                  <span className="demo-browser-action">Your main action</span>
                </div>
                <div className="demo-browser-visual">
                  <LuLayoutTemplate />
                </div>
              </div>
              <div className="demo-browser-cards" aria-hidden="true">
                <span /><span /><span />
              </div>
              <p><LuCheck aria-hidden="true" /> Desktop and mobile direction included</p>
            </div>
          </div>

          <ol className="demo-steps">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <li key={step.title}>
                  <span className="demo-step-icon"><Icon aria-hidden="true" /></span>
                  <div>
                    <small>Step {index + 1}</small>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </div>
                </li>
              );
            })}
          </ol>

          <p className="demo-clarification">
            Planning preview only; not a finished website. Scope, revisions, hosting, timeline, and ownership are confirmed before production work.
          </p>
        </div>
      </Container>
    </section>
  );
}
