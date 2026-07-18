import { Link, useParams } from "react-router-dom";
import Meta from "@/components/Meta.jsx";
import Container from "@/components/layout/Container.jsx";
import { publishedBlogPosts } from "@/data/blogPosts.js";
import { useTheme } from "@/lib/theme.js";
import { blogPostSeo } from "@/data/seoPages.js";
import {
  LuArrowLeft,
  LuArrowRight,
  LuCalendarDays,
  LuClock,
  LuExternalLink,
  LuLink,
} from "react-icons/lu";

export default function BlogPost() {
  const { slug } = useParams();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const post = publishedBlogPosts.find((item) => item.slug === slug);

  if (!post) {
    return (
      <section className="section">
        <Meta
          title="Article not found — MSPixelPulse"
          description="The requested MSPixelPulse website guide could not be found."
          robots="noindex, nofollow"
        />
        <Container>
          <div className={isDark ? "card-surface p-8 text-center" : "rounded-2xl bg-white p-8 text-center shadow-sm"}>
            <h1 className={isDark ? "text-3xl font-black" : "text-3xl font-black text-slate-950"}>Article not found</h1>
            <Link to="/blog" className="btn btn-primary mt-5">
              Back to blog
            </Link>
          </div>
        </Container>
      </section>
    );
  }

  const postMeta = blogPostSeo(post);

  return (
    <section className="section overflow-x-hidden py-10 md:py-14">
      <Meta {...postMeta} />
      <Container>
        <Link to="/blog" className={isDark ? "subtle-link inline-flex items-center" : "inline-flex items-center text-sm font-bold text-slate-600 hover:text-slate-950"}>
          <LuArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" /> Back to blog
        </Link>

        <article className="mx-auto mt-6 max-w-3xl">
          <div className="mb-5 flex flex-wrap items-center gap-2 text-xs font-bold">
            <span className={isDark ? "badge" : "rounded-full bg-blue-50 px-3 py-1 text-blue-700"}>{post.category}</span>
            <span className={isDark ? "inline-flex items-center gap-1 text-white/55" : "inline-flex items-center gap-1 text-slate-500"}>
              <LuCalendarDays className="h-4 w-4" aria-hidden="true" /> {post.publishedAt}
            </span>
            <span className={isDark ? "inline-flex items-center gap-1 text-white/55" : "inline-flex items-center gap-1 text-slate-500"}>
              <LuClock className="h-4 w-4" aria-hidden="true" /> {post.readingTime}
            </span>
          </div>
          <h1 className={isDark ? "text-2xl font-black leading-tight md:text-3xl" : "text-2xl font-black leading-tight text-slate-950 md:text-3xl"}>
            {post.title}
          </h1>
          <p className={isDark ? "mt-4 text-base leading-7 text-textSub md:text-lg" : "mt-4 text-base leading-7 text-slate-600 md:text-lg"}>
            {post.excerpt}
          </p>
          <img
            src={post.cover}
            alt={post.coverAlt}
            className="mt-8 aspect-[16/9] w-full rounded-2xl border border-white/10 object-cover shadow-card"
            width="1200"
            height="675"
            loading="eager"
          />

          <div className={isDark ? "prose-lite mt-9 space-y-7 text-textSub" : "prose-lite mt-9 space-y-7 text-slate-700"}>
            {post.sections.map((section) => (
              <section key={section.heading}>
                <h2 className={isDark ? "text-2xl font-black text-white" : "text-2xl font-black text-slate-950"}>
                  {section.heading}
                </h2>
                {section.body && <p className="mt-3 text-base leading-8">{section.body}</p>}
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph} className="mt-3 text-base leading-8">{paragraph}</p>
                ))}
                {section.bullets?.length > 0 && (
                  <ul className="article-bullet-list">
                    {section.bullets.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                )}
                {section.steps?.length > 0 && (
                  <ol className="article-step-list">
                    {section.steps.map((step, index) => (
                      <li key={step.title}>
                        <span>{index + 1}</span>
                        <div>
                          <h3>{step.title}</h3>
                          <p>{step.body}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
                {section.links?.length > 0 && (
                  <div className="article-internal-links">
                    {section.links.map((link) => (
                      <Link key={link.to} to={link.to}>
                        {link.label}
                        <LuArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            ))}
            {!post.finalCta && (
              <section>
                <h2 className={isDark ? "text-2xl font-black text-white" : "text-2xl font-black text-slate-950"}>
                  A practical next step
                </h2>
                <p className="mt-3 text-base leading-8">
                  Review your current website on a phone, check whether the main contact path is obvious, and list the top three questions a customer asks before hiring you. Those answers are usually the start of a stronger website plan.
                </p>
              </section>
            )}
          </div>

          {post.resources?.length > 0 && (
            <aside className="seo-resource-card mt-10" aria-labelledby="article-resources-heading">
              <div>
                <span className="seo-resource-icon">
                  <LuLink className="h-4 w-4" aria-hidden="true" />
                </span>
                <h2 id="article-resources-heading" className="text-xl font-black">
                  Useful reference links
                </h2>
                <p className="mt-2 text-sm leading-6">
                  Popular, trusted resources to bookmark when planning SEO, speed, accessibility, and platform decisions.
                </p>
              </div>
              <div className="mt-5 grid gap-3">
                {post.resources.map((resource) => (
                  <a
                    key={resource.url}
                    className="seo-resource-link"
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>
                      <strong>{resource.label}</strong>
                      <small>{resource.note}</small>
                    </span>
                    <LuExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </aside>
          )}

          <div className="mt-10 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className={isDark ? "badge" : "rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600"}>{tag}</span>
            ))}
          </div>

          <section className={isDark ? "mt-12 rounded-2xl border border-white/10 bg-white/[0.045] p-5" : "mt-12 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className={isDark ? "text-xl font-black text-white" : "text-xl font-black text-slate-950"}>
                  {post.finalCta?.heading || "Need help with your website?"}
                </h2>
                <p className={isDark ? "mt-1 text-sm text-textSub" : "mt-1 text-sm text-slate-600"}>
                  {post.finalCta?.body || "Send a short note and we will point you toward the right next step."}
                </p>
              </div>
              <Link
                to={post.finalCta?.to || `/contact?source=blog&article=${encodeURIComponent(post.slug)}`}
                className="btn btn-primary"
              >
                {post.finalCta?.label || "Contact Us"} <LuArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </section>
        </article>
      </Container>
    </section>
  );
}
