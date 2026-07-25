import { Link } from "react-router-dom";
import {
  LuArrowUpRight,
  LuClock3,
  LuExternalLink,
  LuMapPin,
} from "react-icons/lu";

export default function BlogCard({ post, rank, featured = false }) {
  return (
    <article className={`blog-card ${featured ? "blog-card-featured" : ""}`}>
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
            loading={rank === 1 ? "eager" : "lazy"}
            fetchPriority={rank === 1 ? "high" : "auto"}
            width="640"
            height="360"
          />
        </Link>
        {rank ? (
          <span className="blog-popular-rank" aria-label={`Popular pick number ${rank}`}>
            <strong>{String(rank).padStart(2, "0")}</strong>
            Popular
          </span>
        ) : null}
        <span className="blog-card-pillar">{post.pillar}</span>
      </div>

      <div className="blog-card-content">
        <div className="blog-card-meta">
          <span>
            <LuClock3 aria-hidden="true" />
            {post.readingTime}
          </span>
          {post.tags?.some((tag) => ["Toronto", "Brampton", "Mississauga", "Canada"].includes(tag)) ? (
            <span>
              <LuMapPin aria-hidden="true" />
              Canada focused
            </span>
          ) : null}
        </div>

        <h3>
          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        <p>{post.excerpt}</p>

        <div className="blog-card-footer">
          <Link className="blog-card-read" to={`/blog/${post.slug}`}>
            Read guide
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
            <span className="blog-photo-credit">MSPixelPulse photo</span>
          )}
        </div>
      </div>
    </article>
  );
}
