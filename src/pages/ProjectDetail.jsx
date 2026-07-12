import { Link, useParams } from "react-router-dom";
import Container from "../components/layout/Container.jsx";
import Meta from "../components/Meta.jsx";
import { publishedProjects } from "../data/projects.js";
import { useTheme } from "@/lib/theme.js";
import { LuArrowLeft, LuExternalLink, LuGithub } from "react-icons/lu";
import ContactActions from "@/components/ContactActions.jsx";

export default function ProjectDetail() {
  const { id } = useParams();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const project = publishedProjects.find((item) => item.slug === id || item.id === id);

  if (!project) {
    return (
      <section className="section">
        <Container>
          <div className={isDark ? "card-surface p-8 text-center" : "rounded-2xl bg-white p-8 text-center shadow-sm"}>
            <h1 className={isDark ? "text-3xl font-black" : "text-3xl font-black text-slate-950"}>Project not found</h1>
            <Link to="/projects" className={isDark ? "btn btn-primary mt-5" : "mt-5 inline-flex h-11 items-center rounded-xl bg-[#2563ff] px-5 font-bold text-white"}>
              Back to projects
            </Link>
          </div>
        </Container>
      </section>
    );
  }

  const isLive = project.classification === "live";
  return (
    <section className="section">
      <Meta
        title={`${project.title} — MSPixelPulse Portfolio`}
        description={project.shortDescription || project.summary}
        canonical={`/projects/${project.slug}`}
        image={project.thumb}
      />

      <Container>
        <Link to="/projects" className={isDark ? "subtle-link inline-flex items-center" : "inline-flex items-center text-sm font-bold text-slate-600 hover:text-slate-950"}>
          <LuArrowLeft className="mr-2 h-4 w-4" /> Back to projects
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-start">
          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              <span className={isLive ? "rounded-full border border-emerald-300/20 bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-200" : "rounded-full border border-primary/30 bg-primary/15 px-3 py-1 text-xs font-bold text-white"}>
                {project.label}
              </span>
              <span className={isDark ? "badge" : "rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600"}>
                {project.industry}
              </span>
              <span className={isDark ? "badge" : "rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600"}>
                {project.websiteType}
              </span>
            </div>

            <h1 className={isDark ? "text-4xl font-black leading-tight md:text-5xl" : "text-4xl font-black leading-tight text-slate-950 md:text-5xl"}>
              {project.title}
            </h1>
            <p className={isDark ? "mt-5 text-lg leading-8 text-textSub" : "mt-5 text-lg leading-8 text-slate-600"}>
              {project.shortDescription || project.summary}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {project.live && (
                <a href={project.live} target="_blank" rel="noreferrer" className={isDark ? "btn btn-primary" : "inline-flex h-11 items-center rounded-xl bg-[#2563ff] px-5 font-bold text-white"}>
                  Visit live site <LuExternalLink className="ml-2 h-4 w-4" />
                </a>
              )}
              {project.repo && (
                <a href={project.repo} target="_blank" rel="noreferrer" className={isDark ? "btn btn-outline" : "inline-flex h-11 items-center rounded-xl border border-slate-200 px-5 font-bold text-slate-800"}>
                  Repository <LuGithub className="ml-2 h-4 w-4" />
                </a>
              )}
              <ContactActions
                dark={isDark}
                showPhone={false}
                whatsappLabel="Build similar"
                message={`Hi MSPixelPulse, I want to build a website like ${project.title}.`}
              />
            </div>
          </div>

          <div className={isDark ? "overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045]" : "overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"}>
            <img
              src={project.thumb}
              alt={project.imageAlt || `${project.title} website screenshot`}
              className="aspect-[16/10] w-full object-cover"
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
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {[
            ["Overview", project.overview],
            ["Result", project.result],
            ["Platform", `${project.platform} · ${project.stack.join(", ")}`],
          ].map(([title, value]) => (
            <div key={title} className={isDark ? "card-surface p-6" : "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"}>
              <h2 className={isDark ? "font-black" : "font-black text-slate-950"}>{title}</h2>
              <p className={isDark ? "mt-2 text-sm leading-6 text-textSub" : "mt-2 text-sm leading-6 text-slate-600"}>{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <ListPanel title="Key features" items={project.features} isDark={isDark} />
          <ListPanel title="Services provided" items={project.services} isDark={isDark} />
        </div>

        {!isLive && (
          <div className={isDark ? "mt-8 rounded-2xl border border-primary/20 bg-primary/10 p-6" : "mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-6"}>
            <h2 className={isDark ? "font-black" : "font-black text-slate-950"}>Concept transparency note</h2>
            <p className={isDark ? "mt-2 text-sm leading-6 text-textSub" : "mt-2 text-sm leading-6 text-slate-700"}>
              This is labeled as {project.label.toLowerCase()} and is not presented as paid client work. It exists to show design direction, user flow, and technical capability.
            </p>
          </div>
        )}
      </Container>
    </section>
  );
}

function ListPanel({ title, items = [], isDark }) {
  return (
    <div className={isDark ? "card-surface p-6" : "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"}>
      <h2 className={isDark ? "font-black" : "font-black text-slate-950"}>{title}</h2>
      <ul className={isDark ? "mt-4 space-y-3 text-sm text-textSub" : "mt-4 space-y-3 text-sm text-slate-600"}>
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
