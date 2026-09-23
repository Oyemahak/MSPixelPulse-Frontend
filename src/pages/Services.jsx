import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Container from "../components/layout/Container.jsx";
import { useTheme } from "@/lib/theme.js";
import Meta from "@/components/Meta.jsx";
import ContactActions from "@/components/ContactActions.jsx";
import DemoOffer from "@/components/DemoOffer.jsx";
import SearchField from "@/components/ui/SearchField.jsx";
import { seoPages } from "@/data/seoPages.js";
import { servicePages, servicePath } from "@/data/servicePages.js";
import { PageHero } from "@/components/public/PublicPageHeader.jsx";
import {
  LuArrowRight,
  LuBraces,
  LuCalendar,
  LuCodeXml,
  LuGraduationCap,
  LuLayoutTemplate,
  LuLifeBuoy,
  LuMousePointer2,
  LuPanelsTopLeft,
  LuRefreshCw,
  LuRotateCcw,
  LuSchool,
  LuSearchCheck,
  LuShoppingCart,
  LuSlidersHorizontal,
  LuStore,
} from "react-icons/lu";

const allOption = "All";

const serviceIcons = {
  business: LuStore,
  design: LuLayoutTemplate,
  development: LuCodeXml,
  ecommerce: LuShoppingCart,
  moodle: LuGraduationCap,
  react: LuBraces,
  redesign: LuRefreshCw,
  school: LuSchool,
  seo: LuSearchCheck,
  support: LuLifeBuoy,
  ux: LuMousePointer2,
  wordpress: LuPanelsTopLeft,
};

function normalize(value) {
  return String(value || "").toLowerCase();
}

function uniqueValues(items, key) {
  const values = items.flatMap((item) => {
    const value = item[key];
    return Array.isArray(value) ? value : [value];
  });
  return [allOption, ...Array.from(new Set(values.filter(Boolean))).sort()];
}

export default function Services() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(allOption);
  const [platform, setPlatform] = useState(allOption);

  const categories = useMemo(() => uniqueValues(servicePages, "category"), []);
  const platforms = useMemo(() => uniqueValues(servicePages, "platforms"), []);

  const filteredServices = useMemo(() => {
    const normalizedQuery = normalize(query).trim();

    return servicePages.filter((service) => {
      const searchableContent = normalize([
        service.name,
        service.catalogueDescription,
        service.summary,
        service.category,
        ...(service.platforms || []),
        ...(service.technologies || []),
        ...(service.tags || []),
        ...(service.keywords || []),
      ].join(" "));

      return (
        (!normalizedQuery || searchableContent.includes(normalizedQuery)) &&
        (category === allOption || service.category === category) &&
        (platform === allOption || service.platforms.includes(platform))
      );
    });
  }, [category, platform, query]);

  const hasFilters = Boolean(query.trim()) || category !== allOption || platform !== allOption;

  function resetFilters() {
    setQuery("");
    setCategory(allOption);
    setPlatform(allOption);
  }

  return (
    <section className="section overflow-x-hidden">
      <Meta {...seoPages.services} />
      <Container>
        <PageHero
          align="center"
          eyebrow="Services"
          title="Web design and development that supports a real business."
          description="Explore focused services for Toronto, Brampton, and Canadian businesses, including new websites, e-commerce, SEO, redesigns, WordPress, React, UX/UI, education platforms, and ongoing support."
          contentClassName="max-w-5xl"
        />

        <p className={isDark ? "mx-auto -mt-3 mb-8 max-w-3xl text-center text-sm leading-6 text-textSub" : "mx-auto -mt-3 mb-8 max-w-3xl text-center text-sm leading-6 text-slate-600"}>
          Serving a local audience? <Link className="font-black text-primary hover:underline" to="/web-design-brampton">See our focused web design approach for Brampton businesses.</Link>
        </p>

        <section className="project-filter-bar service-filter-bar" aria-labelledby="service-filter-heading">
          <div className="project-filter-topline">
            <div className="project-filter-heading">
              <LuSlidersHorizontal aria-hidden="true" />
              <h2 id="service-filter-heading">Find the right service</h2>
            </div>

            <div className="service-filter-meta">
              <output className="project-filter-summary" aria-live="polite" aria-atomic="true">
                <strong>{filteredServices.length}</strong> service{filteredServices.length === 1 ? "" : "s"}
              </output>
              <button
                type="button"
                className="service-filter-reset"
                onClick={resetFilters}
                disabled={!hasFilters}
              >
                <LuRotateCcw aria-hidden="true" />
                Reset
              </button>
            </div>
          </div>

          <div className="project-filter-row service-filter-row">
            <SearchField
              className="project-search-field"
              label="Search website services"
              placeholder="Search services, platforms, or capabilities"
              value={query}
              onValueChange={setQuery}
            />

            <label className="project-filter-control">
              <span className="sr-only">Service category</span>
              <select value={category} onChange={(event) => setCategory(event.target.value)}>
                {categories.map((item) => (
                  <option key={item} value={item}>{item === allOption ? "All categories" : item}</option>
                ))}
              </select>
            </label>

            <label className="project-filter-control">
              <span className="sr-only">Technology or platform</span>
              <select value={platform} onChange={(event) => setPlatform(event.target.value)}>
                {platforms.map((item) => (
                  <option key={item} value={item}>{item === allOption ? "All platforms" : item}</option>
                ))}
              </select>
            </label>
          </div>
        </section>

        {filteredServices.length > 0 ? (
          <div className="service-catalogue-grid">
            {filteredServices.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        ) : (
          <div className="service-empty-state">
            <h2>No services match those filters.</h2>
            <p>Try a broader category, platform, or search term.</p>
            <button type="button" onClick={resetFilters} className="btn btn-primary">
              Reset filters
            </button>
          </div>
        )}

        <DemoOffer compact className="mt-12" />

        <div className={isDark ? "mt-12 card-surface grid gap-5 rounded-2xl p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8" : "mt-12 grid gap-5 rounded-2xl border border-blue-100 bg-white/90 p-6 shadow-[0_22px_70px_rgba(37,99,255,0.10)] md:grid-cols-[1fr_auto] md:items-center md:p-8"}>
          <div>
            <h2 className={isDark ? "text-2xl font-black text-white" : "text-2xl font-black text-slate-950"}>
              Need help choosing a service?
            </h2>
            <p className={isDark ? "mt-2 text-textSub" : "mt-2 text-slate-600"}>
              Share what you want to launch, improve, or maintain, and we will suggest a practical starting point.
            </p>
          </div>

          <ContactActions
            className="cta-panel-actions"
            dark={isDark}
            showPhone={false}
            analyticsPlacement="services_final_cta"
            whatsappLabel="Discuss your project"
            message="Hi MSPixelPulse, I would like help choosing the right website service for my business."
          >
            <a
              className="btn btn-glass"
              href="https://calendly.com/mspixelpulse/30min"
              target="_blank"
              rel="noreferrer"
              data-analytics-placement="services_final_cta"
            >
              <LuCalendar className="h-5 w-5" aria-hidden="true" />
              Book appointment
            </a>
          </ContactActions>
        </div>
      </Container>
    </section>
  );
}

function ServiceCard({ service }) {
  const Icon = serviceIcons[service.iconKey] || LuLayoutTemplate;

  return (
    <article className="service-catalogue-card">
      <Link
        to={servicePath(service.slug)}
        className="service-catalogue-card-link"
        aria-label={`${service.name}: explore service details`}
      >
        <div className="service-catalogue-media">
          <img
            src={service.image}
            alt={service.imageAlt}
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            width="900"
            height="620"
          />
          <span className="service-catalogue-category">
            <Icon aria-hidden="true" />
            {service.category}
          </span>
        </div>

        <div className="service-catalogue-copy">
          <div className="service-catalogue-heading">
            <h3>{service.name}</h3>
            <span>{service.platforms.join(" · ")}</span>
          </div>

          <p className="service-catalogue-description">{service.catalogueDescription}</p>

          <ul className="service-catalogue-tags" aria-label={`${service.name} capabilities`}>
            {service.tags.map((tag) => <li key={tag}>{tag}</li>)}
          </ul>

          <span className="card-action-control service-catalogue-cta">
            View service
            <LuArrowRight aria-hidden="true" />
          </span>
        </div>
      </Link>
    </article>
  );
}
