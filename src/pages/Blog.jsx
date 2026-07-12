import { Link } from "react-router-dom";
import Meta from "@/components/Meta.jsx";
import Container from "@/components/layout/Container.jsx";
import { publishedBlogPosts } from "@/data/blogPosts.js";
import { useTheme } from "@/lib/theme.js";
import { LuArrowRight, LuBookOpen, LuMessageCircle } from "react-icons/lu";

export default function Blog() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section className="section overflow-x-hidden py-10 md:py-14">
      <Meta
        title="Website Design Blog — MSPixelPulse"
        description="Practical website design, redesign, SEO, and maintenance guidance for Canadian small businesses."
        canonical="/blog"
        image="/logo.svg"
        type="website"
      />
      <Container>
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className={isDark ? "badge mb-4" : "mb-4 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700"}>
              <LuBookOpen className="h-4 w-4" aria-hidden="true" /> Website guidance
            </div>
            <h1 className={isDark ? "max-w-3xl text-3xl font-black leading-tight md:text-4xl" : "max-w-3xl text-3xl font-black leading-tight text-slate-950 md:text-4xl"}>
              Practical website advice for small businesses.
            </h1>
            <p className={isDark ? "mt-3 max-w-2xl text-base leading-7 text-textSub" : "mt-3 max-w-2xl text-base leading-7 text-slate-600"}>
              Clear, honest articles about website planning, redesigns, platform choices, SEO-ready structure, and maintenance.
            </p>
          </div>
          <Link
            to="/contact"
            className={isDark ? "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 font-bold text-white/90 hover:bg-white/[0.07]" : "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 font-bold text-slate-900 shadow-sm hover:bg-slate-50"}
          >
            <LuMessageCircle className="h-5 w-5" aria-hidden="true" />
            Contact Us
          </Link>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {publishedBlogPosts.map((post) => (
            <article
              key={post.slug}
              className={
                isDark
                  ? "group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045] transition hover:bg-white/[0.07]"
                  : "group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              }
            >
              <Link to={`/blog/${post.slug}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <img src={post.cover} alt={post.coverAlt} className="aspect-[16/9] w-full object-cover" loading="lazy" width="1200" height="675" />
              </Link>
              <div className="p-5">
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                  <span className={isDark ? "badge" : "rounded-full bg-slate-100 px-3 py-1 text-slate-600"}>{post.category}</span>
                  <span className={isDark ? "text-white/45" : "text-slate-500"}>{post.readingTime}</span>
                </div>
                <h2 className={isDark ? "mt-4 text-lg font-black leading-snug" : "mt-4 text-lg font-black leading-snug text-slate-950"}>
                  <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className={isDark ? "mt-3 text-sm leading-6 text-textSub" : "mt-3 text-sm leading-6 text-slate-600"}>
                  {post.excerpt}
                </p>
                <Link to={`/blog/${post.slug}`} className={isDark ? "mt-5 inline-flex items-center text-sm font-bold text-white" : "mt-5 inline-flex items-center text-sm font-bold text-blue-700"}>
                  Read article <LuArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
