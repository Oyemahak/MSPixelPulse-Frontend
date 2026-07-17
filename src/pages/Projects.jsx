import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Meta from "../components/Meta.jsx";
import SearchField from "../components/ui/SearchField.jsx";
import { publishedProjects } from "../data/projects.js";
import { useTheme } from "@/lib/theme.js";
import {
  LuArrowRight,
  LuExternalLink,
  LuSlidersHorizontal,
  LuSparkles,
  LuX,
} from "react-icons/lu";

const allOption = "All";

function unique(list, key) {
  return [allOption, ...Array.from(new Set(list.map((item) => item[key]).filter(Boolean))).sort()];
}

function normalize(value) {
  return String(value || "").toLowerCase();
}

function ProjectCard({ project, isDark }) {
  const badgeClass =
    project.classification === "live"
      ? isDark
        ? "bg-emerald-500/15 text-emerald-200 border-emerald-300/20"
        : "bg-emerald-50 text-emerald-700 border-emerald-200"
      : isDark
        ? "bg-primary/15 text-blue-100 border-primary/30"
        : "bg-blue-50 text-blue-700 border-blue-200";

  return (
    <article
      className={`project-showcase-card ${
        isDark
          ? "group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045]"
          : "group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      }`}
    >
      <Link to={`/projects/${project.slug}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
        <div className="browser-toolbar" aria-hidden="true">
          <span /><span /><span />
          <span className="browser-address">mspixelpulse.com / work</span>
        </div>
        <div className="aspect-[16/10] overflow-hidden bg-black/20">
          <img
            src={project.thumb}
            alt={project.imageAlt || `${project.title} website preview`}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
            width="1440"
            height="900"
            onError={(event) => {
              if (!event.currentTarget.dataset.fallback) {
                event.currentTarget.dataset.fallback = "true";
                event.currentTarget.src = "/projects/project-fallback.svg";
              }
            }}
          />
        </div>
      </Link>

      <div className="project-showcase-copy p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${badgeClass}`}>
            {project.label}
          </span>
          <span className={isDark ? "badge" : "rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600"}>
            {project.industry}
          </span>
        </div>

        <h3 className={isDark ? "text-lg font-black" : "text-lg font-black text-slate-950"}>
          {project.title}
        </h3>
        <p className={isDark ? "mt-2 text-sm leading-6 text-textSub" : "mt-2 text-sm leading-6 text-slate-600"}>
          {project.shortDescription || project.summary}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.stack.slice(0, 3).map((item) => (
            <span
              key={item}
              className={isDark ? "badge" : "rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"}
            >
              {item}
            </span>
          ))}
        </div>

        <div className="project-card-actions mt-5 flex flex-wrap gap-3">
          <Link
            to={`/projects/${project.slug}`}
            className={isDark ? "btn btn-primary h-10 px-4" : "inline-flex h-10 items-center rounded-xl bg-[#2563ff] px-4 text-sm font-bold text-white"}
          >
            View case study <LuArrowRight className="ml-2 h-4 w-4" />
          </Link>
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              className={isDark ? "btn btn-outline h-10 px-4" : "inline-flex h-10 items-center rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-800"}
            >
              Live site <LuExternalLink className="ml-2 h-4 w-4" />
            </a>
          )}
        </div>
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
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
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

  const industries = useMemo(() => unique(publishedProjects, "industry"), []);
  const websiteTypes = useMemo(() => unique(publishedProjects, "websiteType"), []);

  const filtered = useMemo(() => {
    const q = normalize(query);
    return publishedProjects.filter((project) => {
      const haystack = normalize([
        project.title,
        project.summary,
        project.shortDescription,
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
        (classification === allOption ||
          (classification === "concept"
            ? project.classification !== "live"
            : project.classification === classification))
      );
    });
  }, [classification, industry, query, type]);

  const featured = filtered.filter((project) => project.featured).slice(0, 4);
  const live = filtered.filter((project) => project.classification === "live");
  const concepts = filtered.filter((project) => project.classification !== "live");
  const liveCount = live.length;
  const conceptCount = filtered.length - liveCount;
  const hasActiveFilters = Boolean(
    query || industry !== allOption || type !== allOption || classification !== allOption
  );

  function reset() {
    setQuery("");
    setIndustry(allOption);
    setType(allOption);
    setClassification(allOption);
  }

  return (
    <section className="section overflow-x-hidden">
      <Meta
        title="Website Projects — MSPixelPulse"
        description="Explore live MSPixelPulse website work and clearly labeled industry concept websites by industry, platform, and website type."
        canonical="/projects"
      />

      <div className="mx-auto w-[calc(100vw-2rem)] max-w-7xl sm:w-auto sm:px-6 lg:px-8">
        <div className="max-w-[20rem] min-w-0 sm:max-w-3xl">
          <div className={isDark ? "badge mb-4" : "mb-4 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700"}>
            <LuSparkles className="h-4 w-4" /> Portfolio
          </div>
          <h1 className={isDark ? "max-w-full break-words text-3xl font-black leading-tight sm:text-4xl md:text-5xl" : "max-w-full break-words text-3xl font-black leading-tight text-slate-950 sm:text-4xl md:text-5xl"}>
            Website work, organized by what is live and what is a concept.
          </h1>
          <p className={isDark ? "mt-4 max-w-full break-words text-base leading-7 text-textSub sm:text-lg sm:leading-8" : "mt-4 max-w-full break-words text-base leading-7 text-slate-600 sm:text-lg sm:leading-8"}>
            Live work is separated from concept examples, so every card is clear about what it represents.
          </p>
        </div>

        <section className="project-filter-bar" aria-labelledby="project-filter-heading">
          <div className="project-filter-topline">
            <div className="project-filter-heading">
              <LuSlidersHorizontal aria-hidden="true" />
              <h2 id="project-filter-heading">Find the right example</h2>
            </div>
            <output className="project-filter-summary" aria-live="polite" aria-atomic="true">
              <strong>{filtered.length}</strong> project{filtered.length === 1 ? "" : "s"}
              <span>{liveCount} live · {conceptCount} concept</span>
            </output>
          </div>

          <div className="project-filter-main">
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
                ["concept", "Concepts"],
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
          </div>

          <div className="project-filter-options">
            <label className="project-filter-control">
              <span>Industry</span>
              <select value={industry} onChange={(event) => setIndustry(event.target.value)}>
                {industries.map((item) => (
                  <option key={item} value={item}>{item === allOption ? "All industries" : item}</option>
                ))}
              </select>
            </label>

            <label className="project-filter-control">
              <span>Website type</span>
              <select value={type} onChange={(event) => setType(event.target.value)}>
                {websiteTypes.map((item) => (
                  <option key={item} value={item}>{item === allOption ? "All website types" : item}</option>
                ))}
              </select>
            </label>

            {hasActiveFilters && (
              <button type="button" onClick={reset} className="project-filter-clear">
                <LuX aria-hidden="true" /> Clear filters
              </button>
            )}
          </div>
        </section>

        {!!featured.length && (
          <ProjectSection
            title="Featured Work"
            description="A quick scan of representative live and concept website examples."
            projects={featured}
            isDark={isDark}
          />
        )}

        <ProjectSection
          title="Live Website Work"
          description="Published work and active website entries; live links are shown where currently available."
          projects={live}
          isDark={isDark}
        />

        <ProjectSection
          title="Website Concepts"
          description="Concept examples, clearly labeled so they are never presented as paid client work."
          projects={concepts}
          isDark={isDark}
        />

        {!filtered.length && (
          <div className={isDark ? "mt-12 rounded-2xl border border-white/10 bg-white/[0.045] p-8 text-center" : "mt-12 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm"}>
            <h2 className={isDark ? "text-2xl font-black" : "text-2xl font-black text-slate-950"}>No projects match those filters.</h2>
            <p className={isDark ? "mt-2 text-textSub" : "mt-2 text-slate-600"}>Try a broader industry, website type, or search term.</p>
            <button type="button" onClick={reset} className={isDark ? "btn btn-primary mt-5" : "mt-5 inline-flex h-11 items-center rounded-xl bg-[#2563ff] px-5 font-bold text-white"}>
              Reset filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
