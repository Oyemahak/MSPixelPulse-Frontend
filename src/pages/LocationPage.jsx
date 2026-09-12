import { Link, useParams } from "react-router-dom";
import {
  LuArrowRight,
  LuCheck,
  LuChevronDown,
  LuCircleHelp,
  LuMapPin,
  LuRoute,
  LuSparkles,
} from "react-icons/lu";
import Container from "@/components/layout/Container.jsx";
import ContactActions from "@/components/ContactActions.jsx";
import Meta from "@/components/Meta.jsx";
import { locationPageSeo } from "@/data/discoverabilitySeo.js";
import { getLocationPage } from "@/data/locationPages.js";
import { publishedProjects } from "@/data/projects.js";
import { servicePath } from "@/data/servicePages.js";
import { useTheme } from "@/lib/theme.js";

export default function LocationPage() {
  const { slug = "web-design-brampton" } = useParams();
  const location = getLocationPage(slug);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (!location) {
    return (
      <section className="section">
        <Meta
          title="Service area not found — MSPixelPulse"
          description="The requested MSPixelPulse service-area page could not be found."
          canonical="/services"
          robots="noindex, nofollow"
        />
        <Container>
          <div className={isDark ? "card-surface p-8 text-center" : "rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm"}>
            <h1 className="text-3xl font-black">Service area not found</h1>
            <Link className="btn btn-primary mt-6" to="/services">Explore services</Link>
          </div>
        </Container>
      </section>
    );
  }

  const meta = locationPageSeo(location);
  const surface = isDark
    ? "card-surface text-white"
    : "rounded-2xl border border-slate-200 bg-white text-slate-950 shadow-sm";
  const muted = isDark ? "text-textSub" : "text-slate-600";
  const projects = location.relatedProjects
    .map((projectSlug) => publishedProjects.find((project) => project.slug === projectSlug))
    .filter(Boolean);

  return (
    <section className="section overflow-x-hidden">
      <Meta {...meta} />
      <Container>
        <nav aria-label="Breadcrumb" className={isDark ? "mb-6 flex flex-wrap items-center gap-2 text-sm text-white/65" : "mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-600"}>
          <Link to="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Web design Brampton</span>
        </nav>

        <header className="grid gap-7 lg:grid-cols-[1fr_.72fr] lg:items-center">
          <div>
            <p className="public-page-eyebrow"><LuMapPin aria-hidden="true" /><span>{location.eyebrow}</span></p>
            <h1 className="public-page-title">{location.title}</h1>
            <p className="public-page-description">{location.summary}</p>
            <div className="public-page-actions">
              <Link
                className="btn btn-primary"
                to="/contact?service=Website%20design&location=Brampton"
                data-analytics-cta="discuss_brampton_website"
                data-analytics-placement="brampton_hero"
              >
                Discuss your website <LuArrowRight aria-hidden="true" />
              </Link>
              <Link className="btn btn-glass" to="/projects">Review project examples</Link>
            </div>
          </div>

          <aside className={`${surface} p-6 md:p-7`} aria-label="Brampton web design overview">
            <p className="public-page-eyebrow"><LuSparkles aria-hidden="true" /><span>Useful local foundations</span></p>
            <p className={`leading-7 ${muted}`}>{location.intro}</p>
            <p className={`mt-4 text-sm leading-6 ${muted}`}>
              MSPixelPulse serves Brampton businesses remotely and across the GTA. This page describes a service area; it does not represent a Brampton storefront.
            </p>
          </aside>
        </header>

        <section className="mt-14 grid gap-6 lg:grid-cols-[.72fr_1.28fr]" aria-labelledby="brampton-needs-title">
          <div>
            <p className="public-page-eyebrow"><LuRoute aria-hidden="true" /><span>Local customer journey</span></p>
            <h2 id="brampton-needs-title" className={isDark ? "text-3xl font-black text-white" : "text-3xl font-black text-slate-950"}>What a Brampton business website needs to do well</h2>
            <p className={`mt-3 leading-7 ${muted}`}>The goal is not to repeat a city name. It is to give local customers accurate information and a confident next step.</p>
          </div>
          <ul className={`${surface} grid gap-4 p-6 md:grid-cols-2 md:p-7`}>
            {location.needs.map((item) => (
              <li key={item} className={`flex gap-3 leading-7 ${muted}`}>
                <LuCheck className="mt-1.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14" aria-labelledby="brampton-services-title">
          <div className="max-w-3xl">
            <p className="public-page-eyebrow"><span>Focused services</span></p>
            <h2 id="brampton-services-title" className={isDark ? "text-3xl font-black text-white" : "text-3xl font-black text-slate-950"}>Website services for Brampton businesses</h2>
            <p className={`mt-3 leading-7 ${muted}`}>Each service has its own permanent page so this location hub can guide visitors without competing with the detailed service content.</p>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {location.services.map((service) => (
              <article key={service.slug} className={`${surface} p-6`}>
                <h3 className="text-xl font-black">{service.title}</h3>
                <p className={`mt-2 leading-7 ${muted}`}>{service.body}</p>
                <Link className="mt-4 inline-flex items-center gap-2 font-bold text-primary hover:underline" to={servicePath(service.slug)}>
                  Explore {service.title.toLowerCase()} <LuArrowRight aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className={`${surface} mt-14 p-6 md:p-8`} aria-labelledby="brampton-process-title">
          <h2 id="brampton-process-title" className="text-2xl font-black md:text-3xl">A practical website process</h2>
          <ol className="mt-7 grid gap-5 md:grid-cols-2">
            {location.process.map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-sm font-black text-white">{index + 1}</span>
                <div>
                  <h3 className="font-black">{step.title}</h3>
                  <p className={`mt-1 text-sm leading-6 ${muted}`}>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-14" aria-labelledby="brampton-projects-title">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="public-page-eyebrow"><span>Published proof</span></p>
              <h2 id="brampton-projects-title" className={isDark ? "text-3xl font-black text-white" : "text-3xl font-black text-slate-950"}>Relevant website work</h2>
            </div>
            <Link className="font-bold text-primary hover:underline" to="/projects">Browse all work</Link>
          </div>
          <p className={`mt-3 max-w-3xl leading-7 ${muted}`}>These are published projects selected for relevant website capabilities. They are not presented as Brampton client claims unless a project page states that independently.</p>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {projects.map((project) => (
              <article key={project.slug} className={`${surface} overflow-hidden`}>
                <img src={project.thumb} alt={project.imageAlt} width="1440" height="900" loading="lazy" className="aspect-[16/10] w-full object-cover" />
                <div className="p-5">
                  <span className={isDark ? "badge" : "rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700"}>{project.label}</span>
                  <h3 className="mt-4 font-black">{project.title}</h3>
                  <p className={`mt-2 text-sm leading-6 ${muted}`}>{project.shortDescription || project.summary}</p>
                  <Link className="mt-4 inline-flex items-center gap-2 font-bold text-primary hover:underline" to={`/projects/${project.slug}`}>
                    View case study <LuArrowRight aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14 grid gap-6 lg:grid-cols-[1fr_.7fr]" aria-labelledby="brampton-faq-title">
          <div>
            <p className="public-page-eyebrow"><LuCircleHelp aria-hidden="true" /><span>Frequently asked questions</span></p>
            <h2 id="brampton-faq-title" className={isDark ? "text-3xl font-black text-white" : "text-3xl font-black text-slate-950"}>Brampton website questions</h2>
            <div className="mt-6 space-y-3">
              {location.faq.map((item) => (
                <details key={item.question} className={`${surface} group p-5`}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-black">
                    {item.question}
                    <LuChevronDown className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <p className={`mt-3 leading-7 ${muted}`}>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
          <aside className={`${surface} h-fit p-6`}>
            <h2 className="text-xl font-black">Plan the next step</h2>
            <p className={`mt-3 leading-7 ${muted}`}>Share your business, current website, service area, and the action customers should take. MSPixelPulse will recommend a focused route forward.</p>
            <div className="mt-5">
              <ContactActions dark={isDark} showPhone={false} whatsappLabel="Discuss your project" message="Hi MSPixelPulse, I would like to discuss a website for a Brampton business." />
            </div>
            <Link className="mt-4 inline-flex items-center gap-2 font-bold text-primary hover:underline" to="/contact?request=free-demo&location=Brampton">
              Request a free Brampton website demo <LuArrowRight aria-hidden="true" />
            </Link>
          </aside>
        </section>
      </Container>
    </section>
  );
}
