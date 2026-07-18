import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuBadgeCheck,
  LuCircleCheck,
  LuClock3,
  LuCodeXml,
  LuHeadphones,
  LuLayoutTemplate,
  LuRocket,
  LuSearchCheck,
  LuShoppingBag,
  LuSparkles,
  LuStore,
} from "react-icons/lu";
import Container from "@/components/layout/Container.jsx";
import SectionTitle from "@/components/SectionTitle.jsx";
import Meta from "@/components/Meta.jsx";
import DemoOffer from "@/components/DemoOffer.jsx";
import Button from "@/components/ui/Button.jsx";
import { seoPages } from "@/data/seoPages.js";
import {
  pricingCategories,
  pricingIncluded,
  pricingPlans,
} from "@/data/plans.js";

const planIcons = {
  "one-page": LuLayoutTemplate,
  starter: LuStore,
  growth: LuRocket,
  ecommerce: LuShoppingBag,
  "custom-app": LuCodeXml,
  support: LuHeadphones,
};

const includedIcons = [LuSparkles, LuBadgeCheck, LuSearchCheck, LuClock3];

const CAD = (value) =>
  new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

export default function Pricing() {
  const nav = useNavigate();
  const [activeCategory, setActiveCategory] = useState(pricingCategories[0].key);
  const selectedCategory =
    pricingCategories.find((category) => category.key === activeCategory) ??
    pricingCategories[0];
  const visiblePlans = pricingPlans.filter(
    (plan) => plan.category === selectedCategory.key,
  );

  function startPlan(plan) {
    const params = new URLSearchParams({
      plan: plan.key,
      label: plan.name,
      inquiry: "plan",
    });
    nav(`/contact?${params.toString()}`);
  }

  return (
    <section className="section pricing-page">
      <Container>
        <Meta {...seoPages.pricing} />
        <SectionTitle
          eyebrow="Pricing"
          title="Clear starting points for your business website"
          align="center"
          as="h1"
        />
        <p className="pricing-intro">
          Choose the closest starting point. We will confirm the pages, content,
          features, timeline, and final price with you before any paid work begins.
        </p>

        <div className="pricing-include-strip">
          <span>Every website build includes:</span>
          {pricingIncluded.map((item, index) => {
            const Icon = includedIcons[index];
            return (
              <div key={item} className="pricing-include-item">
                <Icon className="h-4 w-4" aria-hidden="true" />
                {item}
              </div>
            );
          })}
        </div>

        <div className="pricing-category-control">
          <div className="pricing-category-switch" role="tablist" aria-label="Pricing categories">
            {pricingCategories.map((category) => (
              <button
                key={category.key}
                id={`pricing-tab-${category.key}`}
                type="button"
                role="tab"
                aria-selected={activeCategory === category.key}
                aria-controls="pricing-plan-panel"
                className={activeCategory === category.key ? "is-active" : ""}
                onClick={() => setActiveCategory(category.key)}
              >
                <span>{category.label}</span>
                <small>{category.description}</small>
              </button>
            ))}
          </div>
        </div>

        <div
          key={activeCategory}
          id="pricing-plan-panel"
          className="pricing-plans-grid"
          role="tabpanel"
          aria-labelledby={`pricing-tab-${activeCategory}`}
        >
          {visiblePlans.map((plan) => {
            const Icon = planIcons[plan.key];
            return (
              <article
                key={plan.key}
                className={[
                  "pricing-plan-card",
                  plan.featured ? "pricing-plan-card-featured" : "",
                ].filter(Boolean).join(" ")}
                data-accent={plan.accent}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="pricing-plan-icon" aria-hidden="true">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="pricing-plan-badge">{plan.badge}</span>
                </div>

                <h2>{plan.name}</h2>
                <p className="pricing-best-for">
                  <strong>Best for:</strong> {plan.bestFor}
                </p>

                <div className="pricing-price">
                  <span>{plan.key === "support" ? "Support price" : "Starting at"}</span>
                  <strong>{CAD(plan.price)}</strong>
                  <small>{plan.priceSuffix}</small>
                </div>

                {plan.pricingNote && (
                  <p className="pricing-note-inline">{plan.pricingNote}</p>
                )}

                <p className="pricing-summary">{plan.summary}</p>

                <ul className="pricing-feature-list">
                  {plan.features.map((feature) => (
                    <li key={feature}>
                      <LuCircleCheck className="h-4 w-4" aria-hidden="true" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.boundary && (
                  <p className="pricing-boundary">
                    <strong>Good to know:</strong> {plan.boundary}
                  </p>
                )}

                <div className="pricing-card-action">
                  <Button
                    onClick={() => startPlan(plan)}
                  >
                    {plan.cta}
                    <LuRocket className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </article>
            );
          })}
        </div>

        <DemoOffer compact className="pricing-demo-prompt" />

        <section className="pricing-scope-note" aria-labelledby="pricing-scope-title">
          <div>
            <p className="demo-eyebrow">Simple, transparent planning</p>
            <h2 id="pricing-scope-title">Your quote confirms the complete scope.</h2>
          </div>
          <p>
            Starting prices help you compare options. The final quote depends on
            page count, content, store products, custom features, third-party
            services, and launch support. Hosting, domain names, paid apps, and
            subscriptions are included only when they are written into the agreement.
          </p>
        </section>
      </Container>
    </section>
  );
}
