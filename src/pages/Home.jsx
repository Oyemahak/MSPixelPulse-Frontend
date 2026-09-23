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
  LuSearchCheck,
  LuShieldCheck,
  LuShoppingCart,
  LuSmartphone,
  LuSparkles,
} from "react-icons/lu";
import Container from "../components/layout/Container.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import Feedback from "@/components/Feedback.jsx";
import { useTheme } from "@/lib/theme.js";
import { usePublicPortfolio } from "@/hooks/usePublicPortfolio.js";
import Meta from "@/components/Meta.jsx";
import ContactActions from "@/components/ContactActions.jsx";
import AgencyInterfacePreview from "@/components/AgencyInterfacePreview.jsx";
import DemoOffer from "@/components/DemoOffer.jsx";
import { ButtonLink } from "@/components/ui/Button.jsx";
import { seoPages } from "@/data/seoPages.js";
import { applyProjectImageFallback } from "@/lib/projectImageFallback.js";

const services = [
  {
    icon: LuSparkles,
    title: "Website planning and design",
    body: "Clear pages and responsive layouts shaped around your customers’ questions.",
    action: "View design service",
    path: "/services/website-design",
  },
  {
    icon: LuMonitorSmartphone,
    title: "Custom websites and online tools",
    body: "Useful websites, forms, and online tools built around your workflow.",
    action: "See development",
    path: "/services/web-development",
  },
  {
    icon: LuBriefcaseBusiness,
    title: "WordPress development",
    body: "Flexible websites with content your team can keep up to date.",
    action: "View WordPress",
    path: "/services/wordpress-development",
  },
  {
    icon: LuShieldCheck,
    title: "Private client workspaces",
    body: "A secure place to keep project updates, files, and approvals together.",
    action: "See portal approach",
    path: "/services/web-development",
  },
  {
    icon: LuSmartphone,
    title: "Responsive redesigns",
    body: "Better mobile journeys for websites that feel hard to use.",
    action: "See redesigns",
    path: "/services/website-redesign",
  },
  {
    icon: LuLifeBuoy,
    title: "Website maintenance",
    body: "Content updates, launch fixes, and practical ongoing care.",
    action: "View support",
    path: "/services/website-maintenance",
  },
  {
    icon: LuShoppingCart,
    title: "E-commerce websites",
    body: "Online stores planned for product discovery and mobile shopping.",
    action: "Explore stores",
    path: "/services/ecommerce-development",
  },
  {
    icon: LuSearchCheck,
    title: "Website SEO and search readiness",
    body: "Search-ready structure, useful content, and local discovery basics.",
    action: "Explore SEO",
    path: "/services/website-seo",
  },
];

const process = [
  "Clarify audience, services, content, and contact path",
  "Design a responsive page system before adding polish",
  "Build with reusable components and SEO-ready structure",
  "Test forms, links, mobile layouts, and launch details",
];

const featuredGuides = [
  {
    slug: "free-website-demo-before-you-pay",
    title: "See Your Website Before You Pay: How Our Free Website Demo Works",
    excerpt: "See how a personalized website demo can make pages, content, features, and the next decision easier to understand.",
  },
  {
    slug: "small-business-website-cost-canada",
    title: "How Much Does a Small Business Website Cost in Canada?",
    excerpt: "Compare the scope, platform, content, integrations, third-party costs, and ongoing ownership behind a useful website quote.",
  },
];

export default function Home() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { projects: portfolioProjects } = usePublicPortfolio();
  const liveProjects = portfolioProjects.filter((project) => project.classification === "live" && project.live).slice(0, 3);
  const conceptProjects = portfolioProjects.filter((project) => project.classification !== "live").slice(0, 3);
  const muted = isDark ? "text-textSub" : "text-slate-600";
  const surface = isDark
    ? "dark-neutral-surface border-white/10 text-white"
    : "liquid-glass-surface border-white/70 text-slate-950";
  const proofStats = [
    {
      value: "15+",
      label: "Website examples",
    },
    {
      value: "20+",
      label: "Live websites",
    },
    {
      value: "11+",
      label: "Industry concepts",
    },
    {
      value: "2+",
      label: "Private client portals",
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
      <Meta {...seoPages.home} />

      <section className="relative pt-2 md:pt-4">
        <Container className="pb-10 md:pb-14">
          <div className="grid min-w-0 gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="min-w-0">
              <p className="mb-4 inline-flex rounded-full bg-blue-600/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-blue-500">
                Toronto web design and development agency
              </p>
              <h1 className={isDark ? "max-w-3xl break-words text-[2.35rem] font-extrabold leading-[1.08] md:text-[3.5rem]" : "max-w-3xl break-words text-[2.35rem] font-extrabold leading-[1.08] text-slate-950 md:text-[3.5rem]"}>
                Web design and development for Toronto businesses and organizations.
              </h1>
              <p className={`mt-5 max-w-2xl text-lg leading-8 ${muted}`}>
                MSPixelPulse helps small businesses, organizations, and education teams plan, build, redesign, and maintain responsive websites across Toronto, the GTA, and Canada.
              </p>
              <p className={`mt-3 text-sm leading-6 ${muted}`}>
                Need a focused starting point? <Link className="font-black text-blue-500 hover:underline" to="/services/small-business-websites">Explore small-business web design</Link> or <Link className="font-black text-blue-500 hover:underline" to="/web-design-brampton">web design for Brampton businesses</Link>.
              </p>
              <div className="home-hero-actions mt-8 flex flex-wrap gap-3">
                <Link
                  className="btn btn-primary"
                  to="/contact"
                  data-analytics-cta="start_project"
                  data-analytics-placement="home_hero"
                >
                  <LuRocket className="h-5 w-5" aria-hidden="true" />
                  Start a project
                </Link>
                <Link
                  className={isDark ? "btn btn-outline" : "liquid-glass-button inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 font-bold text-slate-900"}
                  to="/projects"
                  data-analytics-cta="view_work"
                  data-analytics-placement="home_hero"
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

      <section className="section home-proof-section py-8 md:py-10" aria-label="MSPixelPulse work at a glance">
        <Container>
          <div className="home-proof-grid grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {proofStats.map((stat) => (
              <article key={stat.label} className="home-proof-stat">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="section py-8">
        <Container>
          <SectionTitle eyebrow="Services" title="A clearer way to build and improve your website." centered />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <article key={service.title} className={`home-service-card rounded-2xl border p-5 ${surface}`}>
                  <span className="home-service-icon" aria-hidden="true">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 text-lg font-black">{service.title}</h3>
                  <p className={`home-service-description mt-3 ${muted}`}>{service.body}</p>
                  <ButtonLink className="home-service-link" variant="card" size="compact" to={service.path} aria-label={`${service.action}: ${service.title}`}>
                    {service.action} <LuArrowRight className="h-4 w-4" aria-hidden="true" />
                  </ButtonLink>
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      <DemoOffer />

      <section className="section py-10 md:py-14">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
            <div>
              <p className="mb-4 inline-flex rounded-full bg-amber-400/15 px-3 py-1 text-xs font-black uppercase tracking-wide text-amber-500">
                Why we are different
              </p>
              <h2 className={isDark ? "text-3xl font-black leading-tight md:text-4xl" : "text-3xl font-black leading-tight text-slate-950 md:text-4xl"}>
                Practical website support built around your business.
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
              <ButtonLink className="mt-5" variant="card" size="compact" to="/services">
                Review services
                <LuArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
            </div>

            <div className={`rounded-2xl border p-6 ${surface}`}>
              <LuBookOpen className="h-7 w-7 text-blue-500" aria-hidden="true" />
              <h2 className="mt-4 text-2xl font-black">Recent website guides</h2>
              <div className="mt-4 grid gap-3">
                {featuredGuides.map((post) => (
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
                className="cta-panel-actions"
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
                    className="aspect-[16/10] w-full object-cover object-top transition duration-300 group-hover:scale-[1.03]"
                    src={project.thumb}
                    alt={project.imageAlt || project.title}
                    loading="lazy"
                    decoding="async"
                    sizes="(min-width: 768px) 33vw, 100vw"
                    width="1200"
                    height="750"
                    onError={(event) => applyProjectImageFallback(event, project.title)}
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
                  <ButtonLink className="project-showcase-link" variant="card" size="compact" to={`/projects/${project.id}`} aria-label={`View ${project.title} case study`}>
                    View case study <LuArrowRight className="h-4 w-4" aria-hidden="true" />
                  </ButtonLink>
                </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
