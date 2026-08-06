import { Link } from "react-router-dom";
import {
  LuArrowUpRight,
  LuCalendarDays,
  LuClock3,
  LuExternalLink,
} from "react-icons/lu";

function formatDate(value) {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export default function BlogCard({ post, eager = false }) {
  return (
    <article className="blog-card">
      <div className="blog-card-media">
        <Link
          to={`/blog/${post.slug}`}
          aria-label={`Read ${post.title}`}
          className="blog-card-image-link"
        >
          <img
            src={post.coverPreview || post.cover}
            alt={post.coverAlt}
            className="blog-card-image"
            loading={eager ? "eager" : "lazy"}
            fetchPriority={eager ? "high" : "auto"}
            decoding="async"
            width="640"
            height="360"
          />
        </Link>
      </div>

      <div className="blog-card-content">
        <div className="blog-card-meta">
          <span className="blog-card-category">{post.pillar}</span>
          <span>
            <LuCalendarDays aria-hidden="true" />
            {formatDate(post.publishedAt)}
          </span>
          <span>
            <LuClock3 aria-hidden="true" />
            {post.readingTime}
          </span>
        </div>

        <h2>
          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>
        <p>{post.excerpt}</p>

        <div className="blog-card-tags" aria-label="Article topics">
          {post.tags?.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}
        </div>

        <div className="blog-card-footer">
          <Link className="blog-card-read" to={`/blog/${post.slug}`}>
            Read post
            <LuArrowUpRight aria-hidden="true" />
          </Link>
          {post.coverCredit ? (
            <a
              className="blog-photo-credit"
              href={post.coverCredit.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Cover photo by ${post.coverCredit.photographer} on Unsplash`}
            >
              Photo: {post.coverCredit.photographer}
              <LuExternalLink aria-hidden="true" />
            </a>
          ) : (
            <span className="blog-photo-credit">MSPixelPulse visual</span>
          )}
        </div>
      </div>
    </article>
  );
}
