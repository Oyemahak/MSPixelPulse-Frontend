import { Link } from "react-router-dom";
import {
  LuArrowRight,
  LuBadgeCheck,
  LuBookOpen,
  LuBriefcaseBusiness,
  LuCircleCheck,
  LuHandshake,
  LuLifeBuoy,
  LuMessagesSquare,
  LuMonitorSmartphone,
  LuRocket,
  LuSearch,
  LuShieldCheck,
  LuSmartphone,
  LuSparkles,
} from "react-icons/lu";
import Container from "../components/layout/Container.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import Feedback from "@/components/Feedback.jsx";
import { useTheme } from "@/lib/theme.js";
import { projects } from "../data/projects.js";
import { blogPosts } from "@/data/blogPosts.js";
import Meta from "@/components/Meta.jsx";
import ContactActions from "@/components/ContactActions.jsx";
import AgencyInterfacePreview from "@/components/AgencyInterfacePreview.jsx";

const services = [
  {
    icon: LuSparkles,
    title: "Web design & UX/UI",
    body: "Clear page systems, thoughtful interaction design, and strong visual hierarchy built around how customers decide.",
    deliverable: "Strategy, wireframes and polished UI",
  },
  {
    icon: LuMonitorSmartphone,
    title: "React development",
    body: "Fast, reusable interfaces for custom business websites, dashboards, forms, and application-style experiences.",
    deliverable: "Reusable components and integrations",
  },
  {
    icon: LuBriefcaseBusiness,
    title: "WordPress development",
    body: "Professional WordPress websites that keep service content, updates, and local search structure manageable.",
    deliverable: "Flexible content and launch support",
  },
  {
    icon: LuShieldCheck,
    title: "Client portal solutions",
    body: "Role-based workspaces for project updates, files, discussions, billing, approvals, and launch coordination.",
    deliverable: "Secure client and admin workflows",
  },
  {
    icon: LuSmartphone,
    title: "Responsive redesigns",
    body: "Cleaner mobile layouts, navigation, spacing, accessibility, speed, and forms for websites that feel hard to use.",
    deliverable: "Mobile-first interface improvements",
  },
  {
    icon: LuLifeBuoy,
    title: "Website maintenance",
    body: "Content updates, practical SEO checks, launch fixes, and ongoing digital agency support when needed.",
    deliverable: "Care, updates and release checks",
  },
];

const process = [
  "Clarify audience, services, content, and contact path",
  "Design a responsive page system before adding polish",
  "Build with reusable components and SEO-ready structure",
  "Test forms, links, mobile layouts, and launch details",
];

export default function Home() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const liveProjects = projects.filter((project) => project.classification === "live").slice(0, 3);
  const conceptProjects = projects.filter((project) => project.classification !== "live").slice(0, 3);
  const liveProjectCount = projects.filter((project) => project.classification === "live").length;
  const conceptProjectCount = projects.filter((project) => project.classification !== "live").length;
  const totalProjectCount = projects.length;
  const muted = isDark ? "text-textSub" : "text-slate-600";
  const surface = isDark
    ? "dark-neutral-surface border-white/10 text-white"
    : "liquid-glass-surface border-white/70 text-slate-950";
  const proofStats = [
    {
      value: `${totalProjectCount}`,
      label: "portfolio examples",
      note: "live work and concept builds listed for review",
    },
    {
      value: `${liveProjectCount}`,
      label: "live website entries",
      note: "published business website entries tracked in the portfolio",
    },
    {
      value: `${conceptProjectCount}`,
      label: "industry concepts",
      note: "demo-safe sales assets for local business categories",
    },
    {
      value: "1",
      label: "portal workflow",
      note: "project updates, files, messages, and handoff in one place",
    },
  ];
  const differenceCards = [
    {
      icon: LuHandshake,
      title: "Friendly, practical planning",
      body: "Let’s shake hands, understand your business, and make the website feel useful from the first screen.",
    },
    {
      icon: LuBadgeCheck,
      title: "Affordable scope first",
      body: "We start with the pages and contact paths your customers need most, then grow the site with clear priorities.",
    },
    {
      icon: LuMessagesSquare,
      title: "Portal-backed updates",
      body: "Clients can use a private workspace for files, notes, approvals, and website update conversations.",
    },
    {
      icon: LuMonitorSmartphone,
      title: "Built for real phones",
      body: "Navigation, spacing, buttons, forms, and content are reviewed on mobile because that is where trust often starts.",
    },
  ];

  return (
    <div className="relative">
      <Meta
        title="MSPixelPulse — Toronto Website Design for Small Businesses"
        description="MSPixelPulse builds professional websites, redesigns, portals, and maintenance workflows for small businesses in Toronto and across Canada."
        canonical="/"
      />

      <section className="relative pt-2 md:pt-4">
        <Container className="pb-10 md:pb-14">
          <div className="grid min-w-0 gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="min-w-0">
              <p className="mb-4 inline-flex rounded-full bg-blue-600/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-blue-500">
                Toronto web design & digital agency
              </p>
              <h1 className={isDark ? "max-w-3xl break-words text-4xl font-black leading-tight md:text-6xl" : "max-w-3xl break-words text-4xl font-black leading-tight text-slate-950 md:text-6xl"}>
                Premium websites that make small businesses easier to trust.
              </h1>
              <p className={`mt-5 max-w-2xl text-lg leading-8 ${muted}`}>
                MSPixelPulse combines web design, UX/UI, React and WordPress development, website maintenance, and client portal solutions into one practical agency workflow.
              </p>
              <div className="home-hero-actions mt-8 flex flex-wrap gap-3">
                <Link className="btn btn-primary" to="/contact">
                  <LuRocket className="h-5 w-5" aria-hidden="true" />
                  Start a project
                </Link>
                <Link
                  className={isDark ? "btn btn-outline" : "liquid-glass-button inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 font-bold text-slate-900"}
                  to="/projects"
                >
                  View work
                  <LuArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <AgencyInterfacePreview />
          </div>
        </Container>
      </section>

      <section className="section py-8 md:py-10">
        <Container>
          <div className={isDark ? "home-proof-panel home-proof-panel-dark" : "home-proof-panel"}>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {proofStats.map((stat) => (
                <article key={stat.label} className="home-proof-stat">
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                  <p>{stat.note}</p>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="section py-8">
        <Container>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <article key={service.title} className={`home-service-card rounded-2xl border p-5 ${surface}`}>
                  <span className="home-service-icon" aria-hidden="true">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h2 className="mt-4 text-lg font-black">{service.title}</h2>
                  <p className={`mt-2 text-sm leading-6 ${muted}`}>{service.body}</p>
                  <p className="home-service-deliverable">{service.deliverable}</p>
                  <Link className="home-service-link" to="/services">
                    Explore service <LuArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="section py-10 md:py-14">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
            <div>
              <p className="mb-4 inline-flex rounded-full bg-amber-400/15 px-3 py-1 text-xs font-black uppercase tracking-wide text-amber-500">
                Why we are different
              </p>
              <h2 className={isDark ? "text-3xl font-black leading-tight md:text-4xl" : "text-3xl font-black leading-tight text-slate-950 md:text-4xl"}>
                Affordable website help that stays close to your business.
              </h2>
              <p className={`mt-4 max-w-xl leading-7 ${muted}`}>
                You do not only get a few pages and a goodbye. We make MSPixelPulse a practical part of your business with clear planning, useful updates, mobile-first checks, and honest launch notes.
              </p>
              <Link className="mt-6 inline-flex items-center gap-2 font-black text-blue-500 hover:underline" to="/about">
                Meet the agency
                <LuArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {differenceCards.map((card) => {
                const Icon = card.icon;
                return (
                  <article key={card.title} className={isDark ? "difference-card difference-card-dark" : "difference-card"}>
                    <span className="difference-icon" aria-hidden="true">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3>{card.title}</h3>
                    <p>{card.body}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      <ProjectSection
        title="Live website work"
        eyebrow="Portfolio"
        projects={liveProjects}
        dark={isDark}
      />

      <ProjectSection
        title="Industry concept websites"
        eyebrow="Sales assets"
        projects={conceptProjects}
        dark={isDark}
      />

      <section className="section py-10 md:py-14">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <SectionTitle eyebrow="Process" title="A simple delivery flow" align="left" />
              <p className={`max-w-xl leading-7 ${muted}`}>
                The goal is not to make the biggest website possible. It is to make the most useful version of the website first, then improve it with evidence from real use.
              </p>
            </div>
            <div className="grid gap-3">
              {process.map((item, index) => (
                <div key={item} className={`flex gap-4 rounded-2xl border p-4 ${surface}`}>
                  <span className="inline-grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-600 text-sm font-black text-white">
                    {index + 1}
                  </span>
                  <div className="flex items-center gap-2 font-bold">
                    <LuCircleCheck className="h-5 w-5 text-blue-500" aria-hidden="true" />
                    {item}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="section py-10 md:py-14">
        <Container>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className={`rounded-2xl border p-6 ${surface}`}>
              <LuLifeBuoy className="h-7 w-7 text-blue-500" aria-hidden="true" />
              <h2 className="mt-4 text-2xl font-black">Maintenance after launch</h2>
              <p className={`mt-3 leading-7 ${muted}`}>
                Website work usually continues after the first launch. MSPixelPulse can help with page updates, practical SEO cleanup, form checks, mobile fixes, and content changes.
              </p>
              <Link className="mt-5 inline-flex items-center gap-2 font-black text-blue-500 hover:underline" to="/services">
                Review services
                <LuArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className={`rounded-2xl border p-6 ${surface}`}>
              <LuBookOpen className="h-7 w-7 text-blue-500" aria-hidden="true" />
              <h2 className="mt-4 text-2xl font-black">Recent website guides</h2>
              <div className="mt-4 grid gap-3">
                {blogPosts.slice(0, 2).map((post) => (
                  <Link key={post.slug} to={`/blog/${post.slug}`} className={isDark ? "rounded-xl border border-white/10 p-4 hover:bg-white/[0.045]" : "rounded-xl border border-slate-200 p-4 hover:bg-slate-50"}>
                    <div className="flex items-start gap-3">
                      <LuSearch className="mt-1 h-5 w-5 shrink-0 text-blue-500" aria-hidden="true" />
                      <div>
                        <h3 className="font-black">{post.title}</h3>
                        <p className={`mt-1 text-sm leading-6 ${muted}`}>{post.excerpt}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="section py-10 md:py-14">
        <Container>
          <div className={`rounded-2xl border p-6 md:p-8 ${surface}`}>
            <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <h2 className="text-2xl font-black md:text-3xl">Ready to plan a cleaner website?</h2>
                <p className={`mt-2 max-w-2xl leading-7 ${muted}`}>
                  Send the basics: what your business does, what your current site is missing, and what customers should do next.
                </p>
              </div>
              <ContactActions
                dark={isDark}
                whatsappLabel="Chat on WhatsApp"
                message="Hi MSPixelPulse, I would like to discuss a website project."
              />
            </div>
          </div>
        </Container>
      </section>

      <Feedback />
    </div>
  );
}

function ProjectSection({ eyebrow, title, projects: items, dark }) {
  const muted = dark ? "text-textSub" : "text-slate-600";
  return (
    <section className="section py-10 md:py-14">
      <Container>
        <SectionTitle eyebrow={eyebrow} title={title} centered />
        <div className="grid gap-5 md:grid-cols-3">
          {items.map((project) => (
            <article key={project.id} className="project-showcase-card">
              <Link to={`/projects/${project.id}`} className="project-browser-frame group">
                <span className="project-browser-toolbar" aria-hidden="true">
                  <i /><i /><i />
                  <small>{project.platform} preview</small>
                </span>
                <span className="project-preview-media">
                  <img
                    className="aspect-[16/10] w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    src={project.thumb}
                    alt={project.imageAlt || project.title}
                    loading="lazy"
                    width="1440"
                    height="900"
                  />
                </span>
              </Link>
                <div className="project-showcase-copy p-5">
                  <div className="mb-3 flex flex-wrap gap-2">
                    {project.stack.slice(0, 3).map((stack) => (
                      <span key={stack} className={dark ? "badge" : "rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700"}>
                        {stack}
                      </span>
                    ))}
                  </div>
                  <h3 className={dark ? "text-lg font-black text-white" : "text-lg font-black text-slate-950"}>
                    {project.title}
                  </h3>
                  <p className={`mt-2 text-sm leading-6 ${muted}`}>
                    {project.shortDescription || project.summary}
                  </p>
                  <Link className="project-showcase-link" to={`/projects/${project.id}`}>
                    View case study <LuArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
