import { Link, useParams } from "react-router-dom";
import {
  LuArrowLeft,
  LuArrowRight,
  LuCalendarDays,
  LuCircleCheck,
  LuClock3,
  LuExternalLink,
  LuInfo,
  LuLink,
  LuList,
  LuSparkles,
} from "react-icons/lu";
import Meta from "@/components/Meta.jsx";
import Container from "@/components/layout/Container.jsx";
import { publishedBlogPosts } from "@/data/blogPosts.js";
import { blogPostSeo } from "@/data/seoPages.js";

function sectionId(heading) {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export default function BlogPost() {
  const { slug } = useParams();
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
          <div className="blog-article-not-found">
            <h1>Article not found</h1>
            <p>The guide may have moved or may still be in editorial review.</p>
            <Link to="/blog" className="btn btn-primary">
              Back to the blog
            </Link>
          </div>
        </Container>
      </section>
    );
  }

  const postMeta = blogPostSeo(post);
  const relatedPosts = publishedBlogPosts
    .filter((item) => item.slug !== post.slug && item.pillar === post.pillar)
    .sort((a, b) => (a.popularRank || 99) - (b.popularRank || 99))
    .slice(0, 3);

  return (
    <section className="blog-article-page">
      <Meta {...postMeta} />
      <Container>
        <Link to="/blog" className="blog-back-link">
          <LuArrowLeft aria-hidden="true" />
          Back to all guides
        </Link>

        <article className="blog-article">
          <div className="blog-article-header">
            <div className="blog-article-labels">
              <span>{post.pillar}</span>
              <span>{post.category}</span>
            </div>
            <h1>{post.title}</h1>
            <p className="blog-article-deck">{post.excerpt}</p>
            <div className="blog-article-byline">
              <span>
                <LuCalendarDays aria-hidden="true" />
                Published {formatDate(post.publishedAt)}
              </span>
              <span>
                <LuClock3 aria-hidden="true" />
                {post.readingTime}
              </span>
              <span>
                <LuCircleCheck aria-hidden="true" />
                MSPixelPulse editorial
              </span>
            </div>

            <figure className="blog-article-cover">
              <img
                src={post.cover}
                alt={post.coverAlt}
                width="1200"
                height="675"
                fetchPriority="high"
              />
              {post.coverCredit ? (
                <figcaption>
                  Photo by{" "}
                  <a
                    href={post.coverCredit.photographerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {post.coverCredit.photographer}
                  </a>{" "}
                  on{" "}
                  <a
                    href={post.coverCredit.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Unsplash
                  </a>
                </figcaption>
              ) : (
                <figcaption>MSPixelPulse cover photography</figcaption>
              )}
            </figure>
          </div>

          <div className="blog-article-layout">
            <aside className="blog-article-sidebar">
              <nav aria-labelledby="article-contents-heading">
                <h2 id="article-contents-heading">
                  <LuList aria-hidden="true" />
                  In this guide
                </h2>
                <ol>
                  {post.sections.map((section) => (
                    <li key={section.heading}>
                      <a href={`#${sectionId(section.heading)}`}>{section.heading}</a>
                    </li>
                  ))}
                  {post.resources?.length > 0 ? (
                    <li>
                      <a href="#trusted-resources">Trusted resources</a>
                    </li>
                  ) : null}
                </ol>
              </nav>

              {relatedPosts.length > 0 ? (
                <div className="blog-related-sidebar">
                  <h2>Related reading</h2>
                  <div>
                    {relatedPosts.map((related) => (
                      <Link key={related.slug} to={`/blog/${related.slug}`}>
                        <img
                          src={related.coverPreview || related.cover}
                          alt=""
                          loading="lazy"
                          width="96"
                          height="72"
                        />
                        <span>
                          <small>{related.pillar}</small>
                          <strong>{related.title}</strong>
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </aside>

            <div className="blog-article-main">
              {post.aiAssisted ? (
                <aside className="blog-ai-disclosure" aria-label="Editorial disclosure">
                  <LuInfo aria-hidden="true" />
                  <div>
                    <strong>How this guide was prepared</strong>
                    <p>
                      This article used AI-assisted drafting and official reference
                      links. It provides general website guidance, not legal,
                      financial, security, or accessibility certification.
                      Time-sensitive requirements should be verified at the source.
                    </p>
                  </div>
                </aside>
              ) : null}

              <div className="blog-article-prose">
                {post.sections.map((section) => (
                  <section id={sectionId(section.heading)} key={section.heading}>
                    <h2>{section.heading}</h2>
                    {section.body ? <p>{section.body}</p> : null}
                    {section.paragraphs?.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                    {section.bullets?.length > 0 ? (
                      <ul className="article-bullet-list">
                        {section.bullets.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    ) : null}
                    {section.steps?.length > 0 ? (
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
                    ) : null}
                    {section.links?.length > 0 ? (
                      <div className="article-internal-links">
                        {section.links.map((link) => (
                          <Link key={`${link.to}-${link.label}`} to={link.to}>
                            {link.label}
                            <LuArrowRight aria-hidden="true" />
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </section>
                ))}

                {!post.finalCta ? (
                  <section id="practical-next-step">
                    <h2>A practical next step</h2>
                    <p>
                      Review the most important customer journey on a phone. Note
                      where the service, proof, location, or contact path becomes
                      unclear, then improve the highest-impact gap before adding
                      another tool or campaign.
                    </p>
                  </section>
                ) : null}
              </div>

              {post.resources?.length > 0 ? (
                <aside
                  id="trusted-resources"
                  className="blog-resource-card"
                  aria-labelledby="article-resources-heading"
                >
                  <div className="blog-resource-heading">
                    <span>
                      <LuLink aria-hidden="true" />
                    </span>
                    <div>
                      <h2 id="article-resources-heading">Trusted reference links</h2>
                      <p>
                        Primary and official sources used to support further
                        planning and current verification.
                      </p>
                    </div>
                  </div>
                  <div className="blog-resource-links">
                    {post.resources.map((resource) => (
                      <a
                        key={resource.url}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span>
                          <strong>{resource.label}</strong>
                          <small>{resource.note}</small>
                        </span>
                        <LuExternalLink aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                </aside>
              ) : null}

              <div className="blog-article-tags" aria-label="Article topics">
                {post.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>

              <section className="blog-article-cta">
                <div>
                  <span>
                    <LuSparkles aria-hidden="true" />
                    Your next website step
                  </span>
                  <h2>{post.finalCta?.heading || "Want a clearer website direction?"}</h2>
                  <p>
                    {post.finalCta?.body ||
                      "Share your business, current website, and main goal. MSPixelPulse can prepare a personalized demo direction before you choose a paid website plan."}
                  </p>
                </div>
                <Link
                  to={
                    post.finalCta?.to ||
                    `/contact?request=free-demo&source=blog&article=${encodeURIComponent(post.slug)}`
                  }
                  className="btn btn-primary"
                >
                  {post.finalCta?.label || "Request my free demo"}
                  <LuArrowRight aria-hidden="true" />
                </Link>
              </section>
            </div>
          </div>
        </article>
      </Container>
    </section>
  );
}
