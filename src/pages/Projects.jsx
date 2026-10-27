import { openCleanExternal } from "../lib/cleanExternalLink";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Meta from "../components/Meta.jsx";
import SearchField from "../components/ui/SearchField.jsx";
import DemoOffer from "@/components/DemoOffer.jsx";
import Container from "@/components/layout/Container.jsx";
import { PageHero } from "@/components/public/PublicPageHeader.jsx";
import { ButtonAnchor, ButtonLink } from "@/components/ui/Button.jsx";
import { usePublicPortfolio } from "@/hooks/usePublicPortfolio.js";
import { useTheme } from "@/lib/theme.js";
import {
  LuArrowRight,
  LuExternalLink,
  LuSlidersHorizontal,
  LuSparkles,
} from "react-icons/lu";
import { seoPages } from "@/data/seoPages.js";
import { applyProjectImageFallback } from "@/lib/projectImageFallback.js";
import { projectCardSummary } from "@/lib/projectCardSummary.js";

const allOption = "All";

function unique(list, key) {
  return [allOption, ...Array.from(new Set(list.map((item) => item[key]).filter(Boolean))).sort()];
}

function normalize(value) {
  return String(value || "").toLowerCase();
}

function projectGroup(project) {
  return project.classification === "live" ? "live" : "demo";
}

const MAX_VISIBLE_TAGS = 3;

function ProjectCard({ project, isDark }) {
  const isLive = projectGroup(project) === "live";
  const caseStudyPath = `/projects/${project.slug}`;
  const summary = projectCardSummary(project);
  const stack = (Array.isArray(project.stack) ? project.stack : []).filter(Boolean);
  const visibleTags = stack.slice(0, MAX_VISIBLE_TAGS);
  const hiddenTags = stack.slice(MAX_VISIBLE_TAGS);
  const badgeClass =
    isLive
      ? isDark
        ? "bg-emerald-500/15 text-emerald-200 border-emerald-300/20"
        : "bg-emerald-50 text-emerald-700 border-emerald-200"
      : isDark
        ? "bg-primary/15 text-blue-100 border-primary/30"
        : "bg-blue-50 text-blue-700 border-blue-200";
  const neutralBadgeClass = isDark
    ? "border-white/10 bg-white/10 text-textSub"
    : "border-slate-200 bg-slate-100 text-slate-600";
  const tagClass = isDark ? "bg-white/10 text-textSub" : "bg-slate-100 text-slate-700";
  const siteKind = project.operationsUrl ? "restaurant demo website" : isLive ? "live website" : "demo website";

  return (
    <article
      className={`project-showcase-card project-catalog-card group ${
        isDark
          ? "overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045]"
          : "overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      }`}
    >
      <Link to={caseStudyPath} className="project-catalog-media focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
        <div className="browser-toolbar" aria-hidden="true">
          <span /><span /><span />
          <span className="browser-address">mspixelpulse.com / work</span>
        </div>
        <div className="project-catalog-thumb">
          <img
            src={project.thumb}
            alt={project.imageAlt || `${project.title} website preview`}
            className="project-catalog-image h-full w-full object-cover object-top"
            loading="lazy"
            decoding="async"
            sizes="(min-width: 1280px) 384px, (min-width: 768px) 50vw, 100vw"
            width="1200"
            height="750"
            onError={(event) => applyProjectImageFallback(event, project.title)}
          />
        </div>
      </Link>

      <div className="project-catalog-badges project-card-badges">
        <span className={`project-catalog-badge ${badgeClass}`}>
          {project.relationship === "founder-in-house" ? project.label : isLive ? "Live Website" : "Demo Project"}
        </span>
        {project.industry && (
          <span className={`project-catalog-badge ${neutralBadgeClass}`} title={project.industry}>
            {project.industry}
          </span>
        )}
        {project.previewStatus && (
          <span className={`project-catalog-badge ${neutralBadgeClass}`}>{project.previewStatus}</span>
        )}
      </div>

      <h3 className={`project-catalog-title ${isDark ? "text-white" : "text-slate-950"}`}>{project.title}</h3>

      <p className={`project-catalog-summary project-card-description ${isDark ? "text-textSub" : "text-slate-600"}`}>
        {summary}
      </p>

      <div className="project-catalog-tags">
        {stack.length > 0 && (
          <ul className="project-card-tags" aria-label={`${project.title} technologies`}>
            {visibleTags.map((item) => (
              <li key={item}>
                <span className={`project-catalog-tag ${tagClass}`}>{item}</span>
              </li>
            ))}
            {hiddenTags.length > 0 && (
              <li>
                <span className={`project-catalog-tag is-more ${tagClass}`} title={hiddenTags.join(", ")}>
                  <span aria-hidden="true">+{hiddenTags.length}</span>
                  <span className="sr-only">{hiddenTags.length} more: {hiddenTags.join(", ")}</span>
                </span>
              </li>
            )}
          </ul>
        )}
      </div>

      <div className={`project-card-actions project-catalog-actions${project.live ? " has-two" : ""}`}>
        <ButtonLink
          to={caseStudyPath}
          variant="card"
          size="compact"
          className="project-case-study"
          aria-label={`Case study: ${project.title}`}
          data-analytics-cta={`view_case_study_${project.slug}`}
          data-analytics-placement="projects_card"
        >
          Case Study <LuArrowRight className="h-4 w-4" aria-hidden="true" />
        </ButtonLink>
        {project.live && (
          <ButtonAnchor
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            onClick={openCleanExternal}
            variant="primary"
            size="compact"
            className="project-live-site"
            aria-label={`Visit site: ${project.title} ${siteKind} (opens in a new tab)`}
            data-analytics-cta={`visit_live_project_${project.slug}`}
            data-analytics-placement="projects_card"
          >
            Visit Site <LuExternalLink className="h-4 w-4" aria-hidden="true" />
          </ButtonAnchor>
        )}
      </div>
    </article>
  );
}

function ProjectSection({ title, description, projects, isDark }) {
  if (!projects.length) return null;

  return (
    <section className="mt-12">
      <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className={isDark ? "text-2xl font-black" : "text-2xl font-black text-slate-950"}>{title}</h2>
          <p className={isDark ? "mt-1 text-textSub" : "mt-1 text-slate-600"}>{description}</p>
        </div>
        <div className={isDark ? "text-sm font-semibold text-white/55" : "text-sm font-semibold text-slate-500"}>
          {projects.length} project{projects.length === 1 ? "" : "s"}
        </div>
      </div>
      <div className="project-catalog-grid grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} isDark={isDark} />
        ))}
      </div>
    </section>
  );
}

export default function Projects() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [query, setQuery] = useState("");
  const [industry, setIndustry] = useState(allOption);
  const [type, setType] = useState(allOption);
  const [classification, setClassification] = useState(allOption);
  const { projects: publishedProjects, loading, source } = usePublicPortfolio();

  const industries = useMemo(() => unique(publishedProjects, "industry"), [publishedProjects]);
  const websiteTypes = useMemo(() => unique(publishedProjects, "websiteType"), [publishedProjects]);

  const filtered = useMemo(() => {
    const q = normalize(query);
    return publishedProjects.filter((project) => {
      const haystack = normalize([
        project.title,
        project.summary,
        project.shortDescription,
        project.cardSummary,
        project.industry,
        project.websiteType,
        project.platform,
        ...(project.stack || []),
        ...(project.services || []),
      ].join(" "));
      return (
        (!q || haystack.includes(q)) &&
        (industry === allOption || project.industry === industry) &&
        (type === allOption || project.websiteType === type) &&
        (classification === allOption || projectGroup(project) === classification)
      );
    });
  }, [classification, industry, publishedProjects, query, type]);

  const live = filtered.filter((project) => projectGroup(project) === "live");
  const demos = filtered.filter((project) => projectGroup(project) === "demo");
  const liveCount = live.length;

  function reset() {
    setQuery("");
    setIndustry(allOption);
    setType(allOption);
    setClassification(allOption);
  }

  return (
    <section className="projects-page section overflow-x-hidden">
      <Meta {...seoPages.projects} />

      <Container>
        <PageHero
          eyebrow="Portfolio"
          eyebrowIcon={LuSparkles}
          title="Web design work and demos for small businesses."
          description="Explore live websites and clearly labeled agency demos across service businesses, education, e-commerce, and custom React development."
        />

        <section className="project-filter-bar" aria-labelledby="project-filter-heading">
          <div className="project-filter-topline">
            <div className="project-filter-heading">
              <LuSlidersHorizontal aria-hidden="true" />
              <h2 id="project-filter-heading">Find the right example</h2>
            </div>
            <output className="project-filter-summary" aria-live="polite" aria-atomic="true">
              <strong>{filtered.length}</strong> project{filtered.length === 1 ? "" : "s"}
              <span>{liveCount} live · {demos.length} demo</span>
            </output>
          </div>

          <div className="project-filter-row">
            <SearchField
              className="project-search-field"
              label="Search website projects"
              placeholder="Search projects"
              value={query}
              onValueChange={setQuery}
            />

            <div className="project-type-switch" role="group" aria-label="Project type">
              {[
                [allOption, "All"],
                ["live", "Live"],
                ["demo", "Demo"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={classification === value ? "is-active" : ""}
                  onClick={() => setClassification(value)}
                  aria-pressed={classification === value}
                >
                  {label}
                </button>
              ))}
            </div>

            <label className="project-filter-control">
              <span className="sr-only">Industry</span>
              <select value={industry} onChange={(event) => setIndustry(event.target.value)}>
                {industries.map((item) => (
                  <option key={item} value={item}>{item === allOption ? "All industries" : item}</option>
                ))}
              </select>
            </label>

            <label className="project-filter-control">
              <span className="sr-only">Website type</span>
              <select value={type} onChange={(event) => setType(event.target.value)}>
                {websiteTypes.map((item) => (
                  <option key={item} value={item}>{item === allOption ? "All website types" : item}</option>
                ))}
              </select>
            </label>

          </div>
        </section>

        {loading && <div className="text-muted-xs mt-3" role="status">Refreshing published projects…</div>}
        {!loading && source === "fallback" && (
          <div className="text-muted-xs mt-3" role="status">Showing the last published portfolio snapshot while the project service reconnects.</div>
        )}

        <ProjectSection
          title="Live Websites"
          description="Published work and active website entries; live links are shown where currently available."
          projects={live}
          isDark={isDark}
        />

        <ProjectSection
          title="Demos"
          description="Agency demo work that demonstrates design and development capability."
          projects={demos}
          isDark={isDark}
        />

        {!filtered.length && (
          <div className={isDark ? "mt-12 rounded-2xl border border-white/10 bg-white/[0.045] p-8 text-center" : "mt-12 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm"}>
            <h2 className={isDark ? "text-2xl font-black" : "text-2xl font-black text-slate-950"}>No projects match those filters.</h2>
            <p className={isDark ? "mt-2 text-textSub" : "mt-2 text-slate-600"}>Try a broader industry, website type, or search term.</p>
            <button type="button" onClick={reset} className="btn btn-primary mt-5">
              Reset filters
            </button>
          </div>
        )}

        <DemoOffer compact className="mt-12" />
      </Container>
    </section>
  );
}
