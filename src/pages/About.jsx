import {
  LuArrowRight,
  LuArrowUpRight,
  LuBadgeCheck,
  LuCircleCheck,
  LuHeartHandshake,
  LuMessagesSquare,
  LuShieldCheck,
  LuSparkles,
} from "react-icons/lu";
import { Link } from "react-router-dom";
import Container from "@/components/layout/Container.jsx";
import Meta from "@/components/Meta.jsx";
import ContactActions from "@/components/ContactActions.jsx";
import SocialContactLinks from "@/components/SocialContactLinks.jsx";
import { site } from "@/data/site.js";
import { useTheme } from "@/lib/theme.js";
import { seoPages } from "@/data/seoPages.js";
import { PageHero } from "@/components/public/PublicPageHeader.jsx";
import { ButtonAnchor, ButtonLink } from "@/components/ui/Button.jsx";

const principles = [
  "Plan structure before decoration",
  "Test layouts on real phones",
  "Choose technology that fits",
  "Make forms and navigation accessible",
  "Communicate clearly through launch",
];

const helps = [
  "Small businesses building a first professional site",
  "Owners improving a confusing or mobile-unfriendly site",
  "Service teams needing clear work, pricing, and contact paths",
  "Clients needing a private workspace for project updates",
];

export default function About() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const surface = isDark
    ? "border-white/10 bg-white/[0.045] text-white"
    : "border-slate-200 bg-white text-slate-950 shadow-sm";
  const muted = isDark ? "text-white/65" : "text-slate-600";

  return (
    <section className="section">
      <Meta {...seoPages.about} />
      <Container>
        <PageHero
          eyebrow="About MSPixelPulse"
          eyebrowIcon={LuHeartHandshake}
          title="A Toronto web studio built around clear, useful customer journeys."
          description="MSPixelPulse helps small businesses turn scattered service details into responsive websites that explain what they offer, build trust, and make the next step easy."
          actions={
            <>
              <Link
                className="btn btn-primary"
                to="/contact"
                data-analytics-cta="start_project"
                data-analytics-placement="about_hero"
              >
                Start a project
              </Link>
              <ButtonAnchor
                variant="outline"
                href={site.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                data-analytics-cta="view_founder_portfolio"
                data-analytics-placement="about_hero"
              >
                Founder portfolio
                <LuArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </ButtonAnchor>
            </>
          }
          visual={
            <div className={`about-founder-card border ${surface}`}>
            <div className="about-founder-card-intro">
              <div className="about-founder-photo-wrap">
                <img
                  className="about-founder-photo"
                  src="/about/mahak-patel.webp"
                  alt="Mahak Patel, founder of MSPixelPulse"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  width="1100"
                  height="1100"
                />
              </div>
              <div className="min-w-0">
                <p className="about-founder-kicker">Founder &amp; design lead</p>
                <h2 className="about-founder-name">Mahak Patel</h2>
                <p className={`about-founder-role ${muted}`}>MSPixelPulse · Toronto</p>
              </div>
            </div>
            <p className={`about-founder-summary ${muted}`}>
              Focused on honest project scoping, clean UX, accessible interfaces, and websites owners can understand after launch.
            </p>
            <SocialContactLinks
              className="about-founder-socials"
              include={["linkedin", "github", "portfolio"]}
            />
            </div>
          }
        />

        <section className="about-approach mt-14" aria-labelledby="about-approach-heading">
          <div className="about-approach-intro">
            <p className="public-page-eyebrow"><LuHeartHandshake aria-hidden="true" /><span>Friendly strategy</span></p>
            <h2 id="about-approach-heading">A useful website starts with the people using it.</h2>
            <p>We start with the audience, the offer, and the next action. The design follows that structure.</p>
          </div>
          <div className="about-approach-grid">
            <div className="about-audience">
              <h3>Who we help</h3>
              <ul>
                {helps.map((item) => <li key={item}><LuCircleCheck aria-hidden="true" />{item}</li>)}
              </ul>
            </div>
            <div className="about-process">
              <h3>How we work</h3>
              <ol>
                {principles.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span>{item}</li>)}
              </ol>
            </div>
          </div>
          <div className="about-handoff">
            <LuMessagesSquare aria-hidden="true" />
            <div>
              <h3>Portal-backed handoff, when the project needs it</h3>
              <p>Files, notes, messages, and approvals can stay together in a private client workspace. Page planning, search readiness, and ongoing updates remain part of the agreed scope.</p>
            </div>
            <ButtonLink to="/services/web-development" variant="card" size="compact">See the approach <LuArrowRight aria-hidden="true" /></ButtonLink>
          </div>
        </section>

        <section className="about-work-spotlight mt-14" aria-labelledby="about-work-heading">
          <Link to="/projects/canstem-education" className="about-work-image" aria-label="View the CanSTEM Education case study">
            <img src="/projects/mockups/canstem-education.webp" alt="CanSTEM Education website shown in desktop and mobile mockup frames" loading="lazy" decoding="async" width="1440" height="900" />
          </Link>
          <div className="about-work-copy">
            <p className="public-page-eyebrow"><LuSparkles aria-hidden="true" /><span>What the work looks like</span></p>
            <h2 id="about-work-heading">Clear structure made visible.</h2>
            <p>See a published education website example with program-focused pages, admissions paths, and responsive layouts. The case study shows the work without promising outcomes that were not measured.</p>
            <ButtonLink to="/projects/canstem-education" variant="card" size="compact">View case study <LuArrowRight aria-hidden="true" /></ButtonLink>
          </div>
        </section>

        <section className="about-values mt-14" aria-label="Our design principles">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                icon: LuBadgeCheck,
                title: "Affordable first step",
                body: "We keep the first version focused on useful pages, clear CTAs, and launch readiness.",
              },
              {
                icon: LuSparkles,
                title: "Clean but not plain",
                body: "The design should feel premium, modern, and easy to scan without overwhelming your customers.",
              },
              {
                icon: LuShieldCheck,
                title: "Trusted by clarity",
                body: "Trust comes from accurate copy, visible contact paths, working forms, and honest project labels.",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="about-value-card">
                  <Icon className="h-6 w-6 text-blue-500" aria-hidden="true" />
                  <h2>{item.title}</h2>
                  <p>{item.body}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className={`mt-12 rounded-2xl border p-6 md:p-8 ${surface}`}>
          <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-2xl font-black">Need a cleaner business website?</h2>
              <p className={`mt-2 max-w-2xl leading-7 ${muted}`}>
                Tell us what your website needs to explain or do better. We’ll suggest a focused next step.
              </p>
            </div>
            <ContactActions
              className="cta-panel-actions"
              dark={isDark}
              whatsappLabel="Chat on WhatsApp"
              message="Hi MSPixelPulse, I would like to discuss a website project."
            />
          </div>
        </section>
      </Container>
    </section>
  );
}
