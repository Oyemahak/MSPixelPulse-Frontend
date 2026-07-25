import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion as Motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  LuArrowRight,
  LuBookOpen,
  LuChevronDown,
  LuCompass,
  LuLayers3,
  LuSearch,
  LuSparkles,
  LuTrendingUp,
} from "react-icons/lu";
import Meta from "@/components/Meta.jsx";
import BlogCard from "@/components/blog/BlogCard.jsx";
import Container from "@/components/layout/Container.jsx";
import { publishedBlogPosts } from "@/data/blogPosts.js";
import { seoPages } from "@/data/seoPages.js";

const INITIAL_LIBRARY_COUNT = 9;
const LOAD_INCREMENT = 9;

const normalizedSearch = (value) => value.trim().toLowerCase();

export default function Blog() {
  const prefersReducedMotion = useReducedMotion();
  const [activePillar, setActivePillar] = useState("All");
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(INITIAL_LIBRARY_COUNT);

  const pillars = useMemo(
    () => [
      "All",
      ...new Set(
        publishedBlogPosts
          .map((post) => post.pillar)
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b)),
      ),
    ],
    [],
  );

  const popularPosts = useMemo(
    () =>
      publishedBlogPosts
        .filter((post) => post.popularRank)
        .sort((a, b) => a.popularRank - b.popularRank),
    [],
  );

  const query = normalizedSearch(search);
  const isBrowsingAll = activePillar === "All" && !query;

  const filteredPosts = useMemo(() => {
    const source = isBrowsingAll
      ? publishedBlogPosts.filter((post) => !post.popularRank)
      : publishedBlogPosts;

    return source
      .filter((post) => activePillar === "All" || post.pillar === activePillar)
      .filter((post) => {
        if (!query) return true;
        const haystack = [
          post.title,
          post.excerpt,
          post.pillar,
          post.category,
          ...(post.tags || []),
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(query);
      })
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  }, [activePillar, isBrowsingAll, query]);

  useEffect(() => {
    setVisibleCount(INITIAL_LIBRARY_COUNT);
  }, [activePillar, query]);

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const remainingCount = Math.max(filteredPosts.length - visiblePosts.length, 0);

  return (
    <div className="blog-page">
      <Meta {...seoPages.blog} />

      <section className="blog-hero">
        <Container>
          <nav className="blog-section-nav" aria-label="Explore the blog">
            <span className="blog-section-nav-label">
              <LuCompass aria-hidden="true" />
              Explore
            </span>
            <div className="blog-section-nav-links">
              <a href="#popular-guides">Popular 10</a>
              <a href="#blog-categories">Categories</a>
              <a href="#article-library">All guides</a>
              <Link to="/contact?request=free-demo">
                Free website demo
                <LuArrowRight aria-hidden="true" />
              </Link>
            </div>
          </nav>

          <div className="blog-hero-grid">
            <Motion.div
              className="blog-hero-copy"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <p className="blog-eyebrow">
                <LuBookOpen aria-hidden="true" />
                MSPixelPulse insights
              </p>
              <h1>Simple ideas to grow your business online.</h1>
              <p className="blog-hero-intro">
                Explore practical, Canada-focused guidance on websites, local SEO,
                AI search, accessibility, content, and conversion.
              </p>
              <div className="blog-hero-actions">
                <a className="btn btn-primary" href="#article-library">
                  Browse all guides
                  <LuArrowRight aria-hidden="true" />
                </a>
                <Link
                  className="blog-secondary-action"
                  to={`/blog/${popularPosts[0].slug}`}
                >
                  <LuBookOpen aria-hidden="true" />
                  Start with our top guide
                </Link>
              </div>
              <ul className="blog-hero-meta" aria-label="Editorial library overview">
                <li>{publishedBlogPosts.length} practical guides</li>
                <li>{pillars.length - 1} clear categories</li>
                <li>Made for Canadian businesses</li>
              </ul>
            </Motion.div>

            <Motion.div
              className="blog-hero-visual"
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.06 }}
            >
              <img
                src={popularPosts[0].cover}
                alt={popularPosts[0].coverAlt}
                width="1200"
                height="675"
                fetchPriority="high"
              />
              <div className="blog-hero-story">
                <span>
                  <LuSparkles aria-hidden="true" />
                  Featured guide · {popularPosts[0].readingTime}
                </span>
                <strong>{popularPosts[0].title}</strong>
                <Link to={`/blog/${popularPosts[0].slug}`}>
                  Read the guide
                  <LuArrowRight aria-hidden="true" />
                </Link>
              </div>
            </Motion.div>
          </div>
        </Container>
      </section>

      <section
        id="popular-guides"
        className="blog-popular-section"
        aria-labelledby="popular-guides-heading"
      >
        <Container>
          <div className="blog-section-heading">
            <div>
              <p>
                <LuTrendingUp aria-hidden="true" />
                Popular now
              </p>
              <h2 id="popular-guides-heading">Ten useful places to begin</h2>
            </div>
            <span>Ranked editorially—not inflated view counts.</span>
          </div>

          <div className="blog-popular-grid">
            {popularPosts.map((post, index) => (
              <Motion.div
                key={post.slug}
                className={index === 0 ? "blog-popular-lead" : ""}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{ duration: 0.28, delay: prefersReducedMotion ? 0 : Math.min(index * 0.035, 0.2) }}
              >
                <BlogCard post={post} rank={post.popularRank} featured={index === 0} />
              </Motion.div>
            ))}
          </div>
        </Container>
      </section>

      <section id="article-library" className="blog-library-section" aria-labelledby="article-library-heading">
        <Container>
          <div className="blog-library-header">
            <div>
              <p className="blog-library-kicker">
                <LuLayers3 aria-hidden="true" />
                Article library
              </p>
              <h2 id="article-library-heading">
                {isBrowsingAll ? "More guides to explore" : "Find the guide you need"}
              </h2>
            </div>
            <p>
              Filter by topic or search across titles, summaries, locations, and tags.
            </p>
          </div>

          <div id="blog-categories" className="blog-discovery-panel">
            <div className="blog-search-field">
              <label htmlFor="blog-search">Search the blog</label>
              <div>
                <LuSearch aria-hidden="true" />
                <input
                  id="blog-search"
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Try “Toronto SEO” or “website speed”"
                />
              </div>
            </div>

            <div className="blog-category-control">
              <span id="blog-category-label">Browse by category</span>
              <div className="blog-category-switch" aria-labelledby="blog-category-label">
                {pillars.map((pillar) => {
                  const count =
                    pillar === "All"
                      ? publishedBlogPosts.length
                      : publishedBlogPosts.filter((post) => post.pillar === pillar).length;
                  const selected = activePillar === pillar;

                  return (
                    <button
                      key={pillar}
                      type="button"
                      aria-pressed={selected}
                      className={selected ? "is-active" : ""}
                      onClick={() => setActivePillar(pillar)}
                    >
                      {pillar}
                      <span>{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <p className="blog-results-summary" aria-live="polite">
            Showing {visiblePosts.length} of {filteredPosts.length}{" "}
            {filteredPosts.length === 1 ? "guide" : "guides"}
            {activePillar !== "All" ? ` in ${activePillar}` : ""}
            {query ? ` matching “${search.trim()}”` : ""}.
          </p>

          {visiblePosts.length > 0 ? (
            <Motion.div layout className="blog-library-grid">
              <AnimatePresence mode="popLayout" initial={false}>
                {visiblePosts.map((post) => (
                  <Motion.div
                    layout
                    key={post.slug}
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.24 }}
                  >
                    <BlogCard post={post} />
                  </Motion.div>
                ))}
              </AnimatePresence>
            </Motion.div>
          ) : (
            <div className="blog-empty-state">
              <LuSearch aria-hidden="true" />
              <h3>No exact guide found</h3>
              <p>Try a broader phrase or return to all categories.</p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setSearch("");
                  setActivePillar("All");
                }}
              >
                Clear filters
              </button>
            </div>
          )}

          {remainingCount > 0 ? (
            <div className="blog-load-more">
              <button
                type="button"
                className="blog-load-more-button"
                onClick={() => setVisibleCount((count) => count + LOAD_INCREMENT)}
              >
                View more guides
                <span>{remainingCount} remaining</span>
                <LuChevronDown aria-hidden="true" />
              </button>
            </div>
          ) : null}

          <div className="blog-editorial-note">
            <LuSparkles aria-hidden="true" />
            <div>
              <strong>Built for useful publishing, not content flooding.</strong>
              <p>
                Our 1,000-topic roadmap remains in editorial review. New guides are
                published in focused batches after source, accessibility, image, and
                quality checks.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
