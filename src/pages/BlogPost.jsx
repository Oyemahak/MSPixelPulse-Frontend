import { Link, useParams } from "react-router-dom";
import BlogLeadForm from "@/components/BlogLeadForm.jsx";
import Meta from "@/components/Meta.jsx";
import Container from "@/components/layout/Container.jsx";
import { publishedBlogPosts } from "@/data/blogPosts.js";
import { useTheme } from "@/lib/theme.js";
import { site } from "@/data/site.js";
import { LuArrowLeft, LuCalendarDays, LuClock } from "react-icons/lu";

export default function BlogPost() {
  const { slug } = useParams();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const post = publishedBlogPosts.find((item) => item.slug === slug);

  if (!post) {
    return (
      <section className="section">
        <Container>
          <div className={isDark ? "card-surface p-8 text-center" : "rounded-2xl bg-white p-8 text-center shadow-sm"}>
            <h1 className={isDark ? "text-3xl font-black" : "text-3xl font-black text-slate-950"}>Article not found</h1>
            <Link to="/blog" className={isDark ? "btn btn-primary mt-5" : "mt-5 inline-flex h-11 items-center rounded-xl bg-blue-600 px-5 font-bold text-white"}>
              Back to blog
            </Link>
          </div>
        </Container>
      </section>
    );
  }

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    image: `${site.url}${post.cover}`,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: { "@type": "Organization", name: site.name },
    publisher: { "@type": "Organization", name: site.name, logo: { "@type": "ImageObject", url: `${site.url}/logo.svg` } },
    mainEntityOfPage: `${site.url}/blog/${post.slug}`,
  };

  return (
    <section className="section overflow-x-hidden">
      <Meta
        title={post.seoTitle}
        description={post.metaDescription}
        canonical={`/blog/${post.slug}`}
        image={post.cover}
        type="article"
        jsonLd={articleJsonLd}
      />
      <Container>
        <Link to="/blog" className={isDark ? "subtle-link inline-flex items-center" : "inline-flex items-center text-sm font-bold text-slate-600 hover:text-slate-950"}>
          <LuArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" /> Back to blog
        </Link>

        <article className="mx-auto mt-6 max-w-4xl">
          <div className="mb-5 flex flex-wrap items-center gap-2 text-xs font-bold">
            <span className={isDark ? "badge" : "rounded-full bg-blue-50 px-3 py-1 text-blue-700"}>{post.category}</span>
            <span className={isDark ? "inline-flex items-center gap-1 text-white/55" : "inline-flex items-center gap-1 text-slate-500"}>
              <LuCalendarDays className="h-4 w-4" aria-hidden="true" /> {post.publishedAt}
            </span>
            <span className={isDark ? "inline-flex items-center gap-1 text-white/55" : "inline-flex items-center gap-1 text-slate-500"}>
              <LuClock className="h-4 w-4" aria-hidden="true" /> {post.readingTime}
            </span>
          </div>
          <h1 className={isDark ? "text-4xl font-black leading-tight md:text-6xl" : "text-4xl font-black leading-tight text-slate-950 md:text-6xl"}>
            {post.title}
          </h1>
          <p className={isDark ? "mt-5 text-lg leading-8 text-textSub" : "mt-5 text-lg leading-8 text-slate-600"}>
            {post.excerpt}
          </p>
          <img
            src={post.cover}
            alt={post.coverAlt}
            className="mt-8 aspect-[16/9] w-full rounded-2xl border border-white/10 object-cover shadow-card"
            width="1200"
            height="675"
          />

          <div className={isDark ? "prose-lite mt-10 space-y-8 text-textSub" : "prose-lite mt-10 space-y-8 text-slate-700"}>
            {post.sections.map((section) => (
              <section key={section.heading}>
                <h2 className={isDark ? "text-2xl font-black text-white" : "text-2xl font-black text-slate-950"}>
                  {section.heading}
                </h2>
                <p className="mt-3 text-base leading-8">{section.body}</p>
              </section>
            ))}
            <section>
              <h2 className={isDark ? "text-2xl font-black text-white" : "text-2xl font-black text-slate-950"}>
                A practical next step
              </h2>
              <p className="mt-3 text-base leading-8">
                Review your current website on a phone, check whether the main contact path is obvious, and list the top three questions a customer asks before hiring you. Those answers are usually the start of a stronger website plan.
              </p>
            </section>
          </div>

          <div className="mt-10 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className={isDark ? "badge" : "rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600"}>{tag}</span>
            ))}
          </div>

          <BlogLeadForm post={post} dark={isDark} />
        </article>
      </Container>
    </section>
  );
}
