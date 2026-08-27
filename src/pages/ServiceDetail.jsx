import { Link, useParams } from "react-router-dom";
import {
  LuArrowRight,
  LuCheck,
  LuChevronDown,
  LuCircleHelp,
  LuCodeXml,
  LuMapPin,
  LuSparkles,
} from "react-icons/lu";
import Container from "@/components/layout/Container.jsx";
import ContactActions from "@/components/ContactActions.jsx";
import Meta from "@/components/Meta.jsx";
import { servicePageSeo } from "@/data/discoverabilitySeo.js";
import { publishedProjects } from "@/data/projects.js";
import {
  getServicePage,
  servicePages,
  servicePath,
} from "@/data/servicePages.js";
import { useTheme } from "@/lib/theme.js";

export default function ServiceDetail() {
  const { slug } = useParams();
  const service = getServicePage(slug);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (!service) {
    return (
      <section className="section">
        <Meta
          title="Service not found — MSPixelPulse"
          description="The requested MSPixelPulse service page could not be found."
          canonical="/services"
          robots="noindex, nofollow"
        />
        <Container>
          <div className={isDark ? "card-surface p-8 text-center" : "rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm"}>
            <h1 className={isDark ? "text-3xl font-black text-white" : "text-3xl font-black text-slate-950"}>Service not found</h1>
            <p className={isDark ? "mt-3 text-textSub" : "mt-3 text-slate-600"}>Browse the service directory to find the closest website or digital-platform option.</p>
            <Link className="btn btn-primary mt-6" to="/services">Browse services</Link>
          </div>
        </Container>
      </section>
    );
  }

  const meta = servicePageSeo(service);
  const surface = isDark
    ? "card-surface text-white"
    : "rounded-2xl border border-slate-200 bg-white text-slate-950 shadow-sm";
  const muted = isDark ? "text-textSub" : "text-slate-600";
  const relatedProjects = service.relatedProjects
    .map((projectSlug) => publishedProjects.find((project) => project.slug === projectSlug))
    .filter(Boolean)
    .slice(0, 3);
  const relatedServices = service.relatedServices
    .map((serviceSlug) => servicePages.find((item) => item.slug === serviceSlug))
    .filter(Boolean);

  return (
    <section className="section overflow-x-hidden">
      <Meta {...meta} />
      <Container>
        <nav aria-label="Breadcrumb" className={isDark ? "mb-6 flex flex-wrap items-center gap-2 text-sm text-white/65" : "mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-600"}>
          <Link to="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link to="/services">Services</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{service.name}</span>
        </nav>

        <header className="grid gap-7 lg:grid-cols-[1fr_.72fr] lg:items-center">
          <div>
            <p className="public-page-eyebrow"><LuSparkles aria-hidden="true" /><span>{service.eyebrow}</span></p>
            <h1 className="public-page-title">{service.name} for clear, dependable digital experiences.</h1>
            <p className="public-page-description">{service.summary}</p>
            <div className="public-page-actions">
              <Link className="btn btn-primary" to={`/contact?service=${encodeURIComponent(service.name)}`}>
                Discuss this service <LuArrowRight aria-hidden="true" />
              </Link>
              <Link className="btn btn-glass" to="/pricing">Review pricing</Link>
            </div>
          </div>

          <aside className={`${surface} p-6 md:p-7`} aria-label={`${service.name} overview`}>
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/15 text-primary">
                <LuMapPin className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <strong className="block">Service area</strong>
                <span className={`text-sm ${muted}`}>Toronto, Brampton, Mississauga, the GTA, Ontario, and remote clients across Canada</span>
              </div>
            </div>
            <p className={`mt-5 leading-7 ${muted}`}>{service.intro}</p>
          </aside>
        </header>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <ContentList title="Who this service is for" items={service.audience} isDark={isDark} />
          <ContentList title="Problems this work can address" items={service.problems} isDark={isDark} />
        </div>

        <section className="mt-14" aria-labelledby="service-deliverables-title">
          <div className="max-w-3xl">
            <p className="public-page-eyebrow"><LuCodeXml aria-hidden="true" /><span>Deliverables</span></p>
            <h2 id="service-deliverables-title" className={isDark ? "text-3xl font-black text-white" : "text-3xl font-black text-slate-950"}>What an agreed project can include</h2>
            <p className={`mt-3 leading-7 ${muted}`}>The final statement of work confirms which items apply. Third-party fees, content volume, custom integrations, and ongoing support are never assumed.</p>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {service.deliverables.map((item) => (
              <article key={item} className={`${surface} p-5`}>
                <LuCheck className="h-5 w-5 text-primary" aria-hidden="true" />
                <p className={`mt-3 text-sm leading-6 ${muted}`}>{item}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={`${surface} mt-14 p-6 md:p-8`} aria-labelledby="service-process-title">
          <h2 id="service-process-title" className="text-2xl font-black md:text-3xl">A practical project process</h2>
          <ol className="mt-7 grid gap-5 md:grid-cols-2">
            {service.process.map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-sm font-black text-white">{index + 1}</span>
                <div>
                  <h3 className="font-black">{step.title}</h3>
                  <p className={`mt-1 text-sm leading-6 ${muted}`}>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-7 flex flex-wrap gap-2" aria-label="Relevant technologies and practices">
            {service.technologies.map((technology) => (
              <span key={technology} className={isDark ? "badge" : "rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700"}>{technology}</span>
            ))}
          </div>
        </section>

        {relatedProjects.length > 0 ? (
          <section className="mt-14" aria-labelledby="service-projects-title">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="public-page-eyebrow"><span>Related work</span></p>
                <h2 id="service-projects-title" className={isDark ? "text-3xl font-black text-white" : "text-3xl font-black text-slate-950"}>Projects connected to this service</h2>
              </div>
              <Link className="font-bold text-primary hover:underline" to="/projects">Browse all case studies</Link>
            </div>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {relatedProjects.map((project) => (
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
        ) : null}

        <section className="mt-14 grid gap-6 lg:grid-cols-[1fr_.7fr]" aria-labelledby="service-faq-title">
          <div>
            <p className="public-page-eyebrow"><LuCircleHelp aria-hidden="true" /><span>Frequently asked questions</span></p>
            <h2 id="service-faq-title" className={isDark ? "text-3xl font-black text-white" : "text-3xl font-black text-slate-950"}>Common questions about {service.shortName.toLowerCase()}</h2>
            <div className="mt-6 space-y-3">
              {service.faq.map((item) => (
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
            <h2 className="text-xl font-black">Continue your research</h2>
            <div className="mt-4 grid gap-3">
              <Link className="inline-flex items-center justify-between gap-3 rounded-xl border border-current/10 px-4 py-3 font-bold" to={`/blog/${service.guideSlug}`}>
                Read the related guide <LuArrowRight aria-hidden="true" />
              </Link>
              <Link className="inline-flex items-center justify-between gap-3 rounded-xl border border-current/10 px-4 py-3 font-bold" to="/faq">
                Browse all FAQs <LuArrowRight aria-hidden="true" />
              </Link>
              {relatedServices.map((related) => (
                <Link key={related.slug} className="inline-flex items-center justify-between gap-3 rounded-xl border border-current/10 px-4 py-3 font-bold" to={servicePath(related.slug)}>
                  {related.shortName} <LuArrowRight aria-hidden="true" />
                </Link>
              ))}
            </div>
          </aside>
        </section>

        <section className={`${surface} mt-14 grid gap-5 p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8`}>
          <div>
            <h2 className="text-2xl font-black">Ready to discuss {service.shortName.toLowerCase()}?</h2>
            <p className={`mt-2 max-w-2xl leading-7 ${muted}`}>Share the current situation, the audience, and the most important action the website or platform needs to support.</p>
          </div>
          <ContactActions dark={isDark} showPhone={false} whatsappLabel="Discuss your project" message={`Hi MSPixelPulse, I would like to discuss ${service.shortName.toLowerCase()}.`} />
        </section>
      </Container>
    </section>
  );
}

function ContentList({ title, items, isDark }) {
  const muted = isDark ? "text-textSub" : "text-slate-600";
  return (
    <article className={isDark ? "card-surface p-6 md:p-7" : "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-7"}>
      <h2 className={isDark ? "text-2xl font-black text-white" : "text-2xl font-black text-slate-950"}>{title}</h2>
      <ul className={`mt-5 space-y-3 ${muted}`}>
        {items.map((item) => (
          <li key={item} className="flex gap-3 leading-7">
            <LuCheck className="mt-1.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
