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
    title: "Tell Us About Your Business",
    body: "Share your services, audience, goals, colours, logo, or basic idea.",
  },
  {
    icon: LuLayoutTemplate,
    title: "We Prepare a Personalized Demo",
    body: "We create a visual website direction based on the information you provide.",
  },
  {
    icon: LuMousePointerClick,
    title: "You Review the Idea",
    body: "See how your content, pages, and features could work together.",
  },
  {
    icon: LuLightbulb,
    title: "Choose Your Next Step",
    body: "Request changes, select a website plan, or keep the ideas for later.",
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
        <ButtonLink size="lg" to="/contact?request=free-demo">
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
              <p className="demo-offer-lead">
                Tell us about your business, and we’ll create a personalized website demo for you to review. Seeing your idea on screen can help you understand what pages, content, and features you may need before choosing a website plan.
              </p>
              <p className="demo-offer-secondary">
                You do not need to know everything before contacting us. Share your business idea, services, colours, logo, or even a simple description. We will use that information to prepare a visual direction that makes the next steps easier to understand.
              </p>
              <div className="demo-offer-actions">
                <ButtonLink size="lg" to="/contact?request=free-demo">
                  Request My Free Demo
                  <LuArrowRight aria-hidden="true" />
                </ButtonLink>
                <ButtonLink variant="glass" to="/blog/free-website-demo-before-you-pay">
                  See How It Works
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
                  <button type="button" tabIndex="-1">Your main action</button>
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
            The free demo is a planning preview, not a finished production website. It may use temporary text or images. Final development, revisions, integrations, hosting, domain setup, timeline, and ownership are confirmed separately before production work begins.
          </p>
        </div>
      </Container>
    </section>
  );
}
