import { useState } from "react";
import { Link } from "react-router-dom";
import {
  LuArrowRight,
  LuBadgeCheck,
  LuCircleCheck,
  LuClock3,
  LuGraduationCap,
  LuPencilRuler,
  LuSearchCheck,
  LuShoppingBag,
  LuSparkles,
  LuWrench,
} from "react-icons/lu";
import Container from "@/components/layout/Container.jsx";
import Meta from "@/components/Meta.jsx";
import { ButtonLink } from "@/components/ui/Button.jsx";
import PlanBuilder from "@/components/pricing/PlanBuilder.jsx";
import { seoPages } from "@/data/seoPages.js";
import {
  mergePricingPlans,
  pricingFaqs,
  pricingIncluded,
  pricingPlans,
} from "@/data/plans.js";
import { usePublicContent } from "@/hooks/usePublicContent.js";
import { PageHero } from "@/components/public/PublicPageHeader.jsx";

const includedIcons = [LuSparkles, LuBadgeCheck, LuSearchCheck, LuClock3];
const specializedIcons = {
  redesign: LuPencilRuler,
  moodle: LuGraduationCap,
  maintenance: LuWrench,
  ecommerce: LuShoppingBag,
};

const presets = {
  "one-page": { serviceId: "new-website", pageSizeId: "single" },
  starter: { serviceId: "new-website", pageSizeId: "small" },
  growth: { serviceId: "new-website", pageSizeId: "medium" },
  redesign: { serviceId: "redesign", pageSizeId: "unsure" },
  moodle: { serviceId: "moodle", pageSizeId: "unsure" },
  maintenance: { serviceId: "maintenance", pageSizeId: "unsure" },
  ecommerce: { serviceId: "ecommerce" },
};

const CAD = (value) => new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
}).format(value);

export default function Pricing() {
  const [builderPreset, setBuilderPreset] = useState(null);
  const [builderStartSignal, setBuilderStartSignal] = useState(null);
  const { items: persistedPlans } = usePublicContent("pricing", pricingPlans);
  const displayPlans = mergePricingPlans(persistedPlans);
  const corePlans = displayPlans.filter((plan) => plan.group === "core");
  const specializedPlans = displayPlans.filter((plan) => plan.group === "specialized");

  function scrollToBuilder(source, requestId = Date.now()) {
    setBuilderStartSignal({ source, requestId });
    window.requestAnimationFrame(() => {
      const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      document.getElementById("plan-builder")?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
    });
  }

  function selectPlanPreset(plan) {
    const requestId = Date.now();
    setBuilderPreset({ ...presets[plan.key], requestId });
    scrollToBuilder("pricing_card", requestId);
  }

  return (
    <section className="section pricing-page">
      <Meta {...seoPages.pricing} />
      <Container>
        <PageHero
          eyebrow="Website pricing in Canadian dollars"
          title="Website Pricing Made Simple"
          description="Choose a starting package or build your own custom website plan. Every final scope is reviewed and confirmed in writing before work begins."
          align="center"
        />

        <div className="pricing-hero-actions">
          <button type="button" className="btn btn-primary" onClick={() => scrollToBuilder("pricing_hero")}>
            Build My Plan <LuArrowRight aria-hidden="true" />
          </button>
          <ButtonLink to="/contact" variant="outline">Talk to MSPixelPulse</ButtonLink>
        </div>

        <div className="pricing-include-strip" role="list" aria-label="Included with website builds">
          <span>Website build essentials:</span>
          {pricingIncluded.map((item, index) => {
            const Icon = includedIcons[index];
            return <div key={item} className="pricing-include-item" role="listitem"><Icon aria-hidden="true" />{item}</div>;
          })}
        </div>

        <section className="pricing-section-block" aria-labelledby="core-pricing-title">
          <div className="pricing-section-heading">
            <div><p className="demo-eyebrow">Popular starting points</p><h2 id="core-pricing-title">Core website plans</h2></div>
            <p>Start with the closest fit. The builder can adjust page size and optional work.</p>
          </div>
          <div className="pricing-core-grid">
            {corePlans.map((plan) => (
              <article key={plan.key} className={plan.featured ? "pricing-core-card is-featured" : "pricing-core-card"}>
                <div className="pricing-card-topline"><span>{plan.badge}</span>{plan.featured && <strong>Popular</strong>}</div>
                <h3>{plan.name}</h3>
                <p className="pricing-plan-audience">{plan.bestFor}</p>
                <p className="pricing-card-price"><small>{plan.pricePrefix}</small><strong>{CAD(plan.price)}</strong><span>{plan.priceSuffix}</span></p>
                <p>{plan.summary}</p>
                {plan.pricingNote && <p className="pricing-card-note">{plan.pricingNote}</p>}
                <ul>{plan.features.map((feature) => <li key={feature}><LuCircleCheck aria-hidden="true" />{feature}</li>)}</ul>
                <button type="button" className="pricing-plan-button" onClick={() => selectPlanPreset(plan)}>{plan.cta}<LuArrowRight aria-hidden="true" /></button>
              </article>
            ))}
          </div>
        </section>

        <section className="pricing-section-block" aria-labelledby="specialized-pricing-title">
          <div className="pricing-section-heading">
            <div><p className="demo-eyebrow">Focused and advanced work</p><h2 id="specialized-pricing-title">Specialized services</h2></div>
            <p>Clear minimums for common requests, with complexity scoped separately.</p>
          </div>
          <div className="pricing-specialized-grid">
            {specializedPlans.map((plan) => {
              const Icon = specializedIcons[plan.key];
              return (
                <article key={plan.key} className="pricing-specialized-card">
                  <div className="pricing-specialized-icon"><Icon aria-hidden="true" /></div>
                  <div className="pricing-specialized-copy">
                    <span>{plan.badge}</span>
                    <h3>{plan.name}</h3>
                    <p className="pricing-card-price"><small>{plan.pricePrefix}</small><strong>{CAD(plan.price)}</strong><span>{plan.priceSuffix}</span></p>
                    <p>{plan.summary}</p>
                    {plan.pricingNote && <p className="pricing-card-note">{plan.pricingNote}</p>}
                    {plan.boundary && <p className="pricing-card-boundary">{plan.boundary}</p>}
                    <button type="button" onClick={() => selectPlanPreset(plan)}>{plan.cta}<LuArrowRight aria-hidden="true" /></button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <PlanBuilder preset={builderPreset} startSignal={builderStartSignal} />

        <section className="pricing-factors" aria-labelledby="pricing-factors-title">
          <div className="pricing-section-heading">
            <div><p className="demo-eyebrow">Website cost factors</p><h2 id="pricing-factors-title">What affects website pricing?</h2></div>
            <p>A useful quote explains the work behind the number—not just the number itself.</p>
          </div>
          <div className="pricing-factors-grid">
            <article><h3>Size and content</h3><p>Page count, content readiness, migration, copy support, product entry, and multilingual content affect production time.</p></article>
            <article><h3>Design and platform</h3><p>A focused <Link to="/services/website-redesign">website redesign</Link>, a new <Link to="/services/wordpress-development">WordPress website</Link>, and a custom React workflow have different needs.</p></article>
            <article><h3>Features and connections</h3><p>Stores, bookings, payments, forms, roles, APIs, and a <Link to="/services/moodle-lms-development">Moodle LMS</Link> require specific technical scoping.</p></article>
            <article><h3>Launch and ongoing care</h3><p>Hosting, domains, paid tools, analytics, training, and <Link to="/services/website-maintenance">website maintenance</Link> are included only when written into the quote.</p></article>
          </div>
          <nav className="pricing-related-links" aria-label="Pricing resources">
            <Link to="/services">Explore all services</Link>
            <Link to="/projects">See website projects</Link>
            <Link to="/blog">Read website guides</Link>
            <Link to="/contact?request=free-demo">Request a free demo</Link>
          </nav>
        </section>

        <section className="pricing-faq" aria-labelledby="pricing-faq-title">
          <div className="pricing-section-heading"><div><p className="demo-eyebrow">Pricing FAQ</p><h2 id="pricing-faq-title">Questions before you choose</h2></div></div>
          <div className="pricing-faq-list">
            {pricingFaqs.map((item) => <details key={item.question}><summary>{item.question}<span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}
          </div>
        </section>

        <aside className="pricing-terms" aria-labelledby="pricing-terms-title">
          <div><p className="demo-eyebrow">Short pricing terms</p><h2 id="pricing-terms-title">Clear scope before paid work begins</h2></div>
          <p>All prices are in CAD and exclude applicable tax unless stated otherwise. A written quote confirms deliverables, revisions, timeline, payment schedule, ownership, launch support, and exclusions. Third-party fees are separate unless specifically included. Maintenance is billed only for approved time.</p>
        </aside>

        <section className="pricing-final-cta" aria-labelledby="pricing-final-title">
          <div><p className="demo-eyebrow">Ready for a clear next step?</p><h2 id="pricing-final-title">Bring your plan—or just bring your idea.</h2><p>We can confirm the right scope without forcing your project into the wrong package.</p></div>
          <div><button type="button" className="btn btn-primary" onClick={() => scrollToBuilder("pricing_final_cta")}>Build My Plan</button><ButtonLink to="/contact" variant="outline">Contact MSPixelPulse</ButtonLink></div>
        </section>
      </Container>
    </section>
  );
}
