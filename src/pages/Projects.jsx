import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Container from "../components/layout/Container.jsx";
import Meta from "../components/Meta.jsx";
import { publishedProjects } from "../data/projects.js";
import { useTheme } from "@/lib/theme.js";
import {
  LuArrowRight,
  LuExternalLink,
  LuFilter,
  LuSearch,
  LuSparkles,
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
      ? "bg-emerald-500/15 text-emerald-200 border-emerald-300/20"
      : "bg-primary/15 text-white border-primary/30";

  return (
    <article
      className={
        isDark
          ? "group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045]"
          : "group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      }
    >
      <Link to={`/projects/${project.slug}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
        <div className="aspect-[16/10] overflow-hidden bg-black/20">
          <img
            src={project.thumb}
            alt={`${project.title} website preview`}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      </Link>

      <div className="p-5">
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

        <div className="mt-5 flex flex-wrap gap-3">
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
      <div className="grid gap-6 lg:grid-cols-3">
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
        (classification === allOption || project.classification === classification)
      );
    });
  }, [classification, industry, query, type]);

  const featured = filtered.filter((project) => project.featured).slice(0, 4);
  const live = filtered.filter((project) => project.classification === "live");
  const demos = filtered.filter((project) => project.classification !== "live");

  function reset() {
    setQuery("");
    setIndustry(allOption);
    setType(allOption);
    setClassification(allOption);
  }

  return (
    <section className="section">
      <Meta
        title="Portfolio Projects — MSPixelPulse"
        description="Explore live MSPixelPulse website work and clearly labeled agency demo websites by industry, platform, and website type."
      />

      <Container>
        <div className="max-w-3xl">
          <div className={isDark ? "badge mb-4" : "mb-4 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700"}>
            <LuSparkles className="h-4 w-4" /> Portfolio
          </div>
          <h1 className={isDark ? "text-4xl font-black md:text-5xl" : "text-4xl font-black text-slate-950 md:text-5xl"}>
            Website work, organized by what is live and what is a demo.
          </h1>
          <p className={isDark ? "mt-4 text-lg leading-8 text-textSub" : "mt-4 text-lg leading-8 text-slate-600"}>
            Live work is separated from MSPixelPulse demo and concept projects, so every card is clear about what it represents.
          </p>
        </div>

        <div className={isDark ? "mt-8 rounded-2xl border border-white/10 bg-white/[0.045] p-4" : "mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"}>
          <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
            <label className="relative">
              <span className="sr-only">Search projects</span>
              <LuSearch className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 opacity-60" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by industry, platform, service..."
                className="pl-10"
              />
            </label>
            <select value={industry} onChange={(event) => setIndustry(event.target.value)} aria-label="Filter by industry">
              {industries.map((item) => <option key={item}>{item}</option>)}
            </select>
            <select value={type} onChange={(event) => setType(event.target.value)} aria-label="Filter by website type">
              {websiteTypes.map((item) => <option key={item}>{item}</option>)}
            </select>
            <select value={classification} onChange={(event) => setClassification(event.target.value)} aria-label="Filter by classification">
              <option>{allOption}</option>
              <option value="live">Live</option>
              <option value="demo">Demo</option>
              <option value="concept">Concept</option>
            </select>
            <button type="button" onClick={reset} className={isDark ? "btn btn-outline" : "inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 px-4 font-bold"}>
              <LuFilter className="mr-2 h-4 w-4" /> Reset
            </button>
          </div>
          <div className={isDark ? "mt-3 text-sm text-white/55" : "mt-3 text-sm text-slate-500"}>
            Showing {filtered.length} of {publishedProjects.length} portfolio projects.
          </div>
        </div>

        {!!featured.length && (
          <ProjectSection
            title="Featured Work"
            description="A quick scan of the most representative live and demo portfolio pieces."
            projects={featured}
            isDark={isDark}
          />
        )}

        <ProjectSection
          title="Live Website Work"
          description="Verified public websites and current client-facing work."
          projects={live}
          isDark={isDark}
        />

        <ProjectSection
          title="Demo & Concept Websites"
          description="Agency demos and concepts, clearly labeled so they are never presented as paid client work."
          projects={demos}
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
      </Container>
    </section>
  );
}
