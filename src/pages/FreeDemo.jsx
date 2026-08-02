import { Link, useSearchParams } from "react-router-dom";
import {
  LuArrowRight,
  LuBadgeCheck,
  LuCheck,
  LuChevronDown,
  LuClock3,
  LuEye,
  LuExternalLink,
  LuLayoutTemplate,
  LuMessageSquareText,
  LuMonitorSmartphone,
  LuSearchCheck,
  LuShieldCheck,
  LuSparkles,
} from "react-icons/lu";
import Container from "@/components/layout/Container.jsx";
import Meta from "@/components/Meta.jsx";
import SectionTitle from "@/components/SectionTitle.jsx";
import AgencyInterfacePreview from "@/components/AgencyInterfacePreview.jsx";
import LeadForm from "@/components/LeadForm.jsx";
import ContactActions from "@/components/ContactActions.jsx";
import { seoPages } from "@/data/seoPages.js";
import { publishedProjects } from "@/data/projects.js";
import {
  freeDemoBenefits,
  freeDemoFaqs,
  freeDemoProcess,
  freeDemoReviewPrinciples,
} from "@/data/freeDemo.js";

const demoIcons = {
  badge: LuBadgeCheck,
  clock: LuClock3,
  eye: LuEye,
  layout: LuLayoutTemplate,
  message: LuMessageSquareText,
  responsive: LuMonitorSmartphone,
  search: LuSearchCheck,
  shield: LuShieldCheck,
  sparkles: LuSparkles,
};

export default function FreeDemo() {
  const [searchParams] = useSearchParams();
  const featuredProjects = publishedProjects.slice(0, 3);

  return (
    <div className="free-demo-page">
      <Meta {...seoPages.freeDemo} />

      <section className="free-demo-hero">
        <Container>
          <div className="free-demo-hero-grid">
            <div>
              <p className="free-demo-badge">FREE WEBSITE DEMO • AS LITTLE AS 1 BUSINESS DAY</p>
              <h1>See a personalized website direction before you commit.</h1>
              <p className="free-demo-hero-copy">
                Tell MSPixelPulse about your business and we’ll prepare a free website demo
                direction designed to make your next step easier to understand.
              </p>
              <div className="free-demo-hero-actions">
                <a
                  className="btn btn-primary btn-lg"
                  href="#free-demo-form"
                  data-analytics-cta="free_demo_hero"
                >
                  Request My Free Demo
                  <LuArrowRight aria-hidden="true" />
                </a>
                <Link className="btn btn-glass btn-lg" to="/projects">
                  Review Our Work
                </Link>
              </div>
              <ul className="free-demo-benefits" aria-label="Free demo benefits">
                {freeDemoBenefits.map((item) => {
                  const Icon = demoIcons[item.icon];
                  return (
                    <li key={item.label}>
                      <Icon aria-hidden="true" />
                      <span>{item.label}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
            <AgencyInterfacePreview />
          </div>
        </Container>
      </section>

      <section className="section free-demo-section">
        <Container>
          <SectionTitle eyebrow="Simple process" title="From a few details to a clear visual direction" centered />
          <div className="free-demo-process-grid">
            {freeDemoProcess.map((item, index) => {
              const Icon = demoIcons[item.icon];
              return (
                <article key={item.title} className="free-demo-process-card">
                  <span className="free-demo-step-number">0{index + 1}</span>
                  <span className="free-demo-card-icon" aria-hidden="true"><Icon /></span>
                  <h2>{item.title}</h2>
                  <p>{item.body}</p>
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="section free-demo-section free-demo-portfolio-section">
        <Container>
          <SectionTitle
            eyebrow="Portfolio preview"
            title="See the range before you share your idea"
            subtitle="Live website work and clearly labeled industry concepts show different visual directions, technologies, and business categories."
            centered
          />
          <div className="free-demo-project-grid">
            {featuredProjects.map((project) => (
              <article key={project.slug} className="free-demo-project-card">
                <Link to={`/projects/${project.slug}`} className="free-demo-project-visual">
                  <img
                    src={project.thumb}
                    alt={project.imageAlt || `${project.title} website preview`}
                    loading="lazy"
                    width="1440"
                    height="900"
                  />
                  <span className="free-demo-mobile-preview" aria-hidden="true">
                    <img src={project.thumb} alt="" loading="lazy" width="390" height="844" />
                  </span>
                </Link>
                <div className="free-demo-project-copy">
                  <div>
                    <span>{project.industry}</span>
                    <span>{project.label}</span>
                  </div>
                  <h2>{project.title}</h2>
                  <p>{project.shortDescription || project.summary}</p>
                  <ul aria-label={`${project.title} technologies`}>
                    {project.stack.slice(0, 3).map((item) => <li key={item}>{item}</li>)}
                  </ul>
                  <Link to={`/projects/${project.slug}`}>
                    View case study <LuArrowRight aria-hidden="true" />
                  </Link>
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noreferrer"
                      data-analytics-cta={project.classification === "live" ? "visit_live_project" : "preview_concept_project"}
                      data-analytics-placement="free_demo_portfolio"
                    >
                      {project.classification === "live" ? "Visit live website" : "Preview concept website"}
                      <LuExternalLink aria-hidden="true" />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
          <div className="free-demo-section-action">
            <Link className="btn btn-glass" to="/projects">Browse all website projects</Link>
          </div>
        </Container>
      </section>

      <section className="section free-demo-section">
        <Container>
          <SectionTitle
            eyebrow="Proof, not promises"
            title="A review experience built around transparency"
            subtitle="We do not publish invented testimonials. Instead, we show work you can inspect and explain exactly what the free demo does and does not include."
            centered
          />
          <div className="free-demo-principles-grid">
            {freeDemoReviewPrinciples.map((item) => {
              const Icon = demoIcons[item.icon];
              return (
                <article key={item.title} className="free-demo-principle-card">
                  <span aria-hidden="true"><Icon /></span>
                  <h2>{item.title}</h2>
                  <p>{item.body}</p>
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="section free-demo-section free-demo-faq-section">
        <Container>
          <div className="free-demo-faq-layout">
            <div>
              <p className="free-demo-kicker">Questions, answered</p>
              <h2>Know what to expect before you request a demo.</h2>
              <p>
                The goal is a useful first direction without hidden pressure or confusing production terms.
              </p>
            </div>
            <div className="free-demo-faq-list">
              {freeDemoFaqs.map(({ question, answer }) => (
                <details key={question}>
                  <summary>
                    <span>{question}</span>
                    <LuChevronDown aria-hidden="true" />
                  </summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section id="free-demo-form" className="section contact-page free-demo-form-section" tabIndex="-1">
        <Container>
          <div className="free-demo-form-heading">
            <p className="free-demo-kicker">Start here</p>
            <h2>Let’s Build Your Free Website Demo</h2>
            <p>
              Tell us a few details and we’ll create a FREE personalized website demo for your business.
            </p>
          </div>
          <div className="free-demo-form-layout">
            <LeadForm
              demoMode
              source={searchParams.get("source") === "blog" ? "free-demo-blog" : "free-demo-page"}
              sourceSlug={searchParams.get("article") || ""}
              idPrefix="free-demo"
            />
            <aside className="free-demo-form-aside">
              <LuSparkles aria-hidden="true" />
              <h2>What you can expect</h2>
              <ul>
                <li><LuCheck aria-hidden="true" /> A personalized visual direction</li>
                <li><LuCheck aria-hidden="true" /> Mobile-first layout thinking</li>
                <li><LuCheck aria-hidden="true" /> Clear demo and placeholder labels</li>
                <li><LuCheck aria-hidden="true" /> No obligation to purchase development</li>
              </ul>
              <p>
                Final production work, revisions, integrations, hosting, domain setup,
                timeline, and ownership are confirmed separately.
              </p>
            </aside>
          </div>
        </Container>
      </section>

      <section className="section free-demo-final-section">
        <Container>
          <div className="free-demo-final-cta">
            <div>
              <p className="free-demo-kicker">Prefer to talk first?</p>
              <h2>Choose the easiest way to start.</h2>
              <p>Send a message or call MSPixelPulse before completing the form.</p>
            </div>
            <ContactActions
              whatsappLabel="Ask About a Free Demo"
              message="Hi MSPixelPulse, I would like to ask about a free personalized website demo."
            />
          </div>
        </Container>
      </section>
    </div>
  );
}
