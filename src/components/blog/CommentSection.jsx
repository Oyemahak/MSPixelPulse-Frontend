import { useEffect, useState } from "react";
import { LuLoaderCircle, LuMessageSquare, LuSend } from "react-icons/lu";
import { blogEngagement } from "@/lib/blogEngagement.js";
import { trackEvent } from "@/lib/analytics.js";

const emptyForm = { name: "", email: "", comment: "", _hp: "" };

function dateLabel(value) {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export default function CommentSection({ article, initialComments, approvedCount, initialHasMore }) {
  const [comments, setComments] = useState(initialComments);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    setComments(initialComments);
    setPage(1);
    setHasMore(initialHasMore);
  }, [article.slug, initialComments, initialHasMore]);

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = "Enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = "Enter a valid email address.";
    if (form.comment.trim().length < 3) next.comment = "Write at least three characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function submit(event) {
    event.preventDefault();
    setStatus({ type: "", message: "" });
    if (!validate()) return;
    try {
      setSubmitting(true);
      await blogEngagement.comment(article, {
        name: form.name.trim(),
        email: form.email.trim(),
        comment: form.comment.trim(),
        _hp: form._hp,
      });
      setForm(emptyForm);
      setErrors({});
      setStatus({ type: "success", message: "Thanks — your comment is awaiting moderation." });
      trackEvent("blog_comment_submitted", { blog_slug: article.slug, blog_title: article.title });
    } catch (error) {
      setStatus({ type: "error", message: error.message || "We could not submit your comment." });
    } finally {
      setSubmitting(false);
    }
  }

  async function loadMore() {
    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const data = await blogEngagement.get(article, { page: nextPage, limit: 8 });
      setComments((current) => [...current, ...(data.comments || [])]);
      setPage(nextPage);
      setHasMore(Boolean(data.pagination?.hasMore));
    } catch (error) {
      setStatus({ type: "error", message: error.message || "More comments could not be loaded." });
    } finally {
      setLoadingMore(false);
    }
  }

  return (
    <section className="blog-comments" aria-labelledby="blog-comments-heading">
      <div className="blog-engagement-heading blog-comments-heading">
        <span className="blog-engagement-icon"><LuMessageSquare aria-hidden="true" /></span>
        <div>
          <p className="blog-engagement-kicker">Reader discussion</p>
          <h3 id="blog-comments-heading">Comments <span>{approvedCount}</span></h3>
        </div>
      </div>

      <form className="blog-comment-form" onSubmit={submit} noValidate aria-busy={submitting}>
        <div className="blog-comment-grid">
          <label>
            <span>Name</span>
            <input
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "blog-comment-name-error" : undefined}
              required
            />
            {errors.name ? <small id="blog-comment-name-error" className="blog-field-error">{errors.name}</small> : null}
          </label>
          <label>
            <span>Email <small>Not displayed publicly</small></span>
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "blog-comment-email-error" : undefined}
              required
            />
            {errors.email ? <small id="blog-comment-email-error" className="blog-field-error">{errors.email}</small> : null}
          </label>
        </div>
        <label>
          <span>Comment</span>
          <textarea
            rows="5"
            value={form.comment}
            onChange={(event) => setForm((current) => ({ ...current, comment: event.target.value }))}
            aria-invalid={Boolean(errors.comment)}
            aria-describedby={errors.comment ? "blog-comment-text-error" : "blog-comment-help"}
            required
          />
          <small id="blog-comment-help">Comments are reviewed before they appear publicly.</small>
          {errors.comment ? <small id="blog-comment-text-error" className="blog-field-error">{errors.comment}</small> : null}
        </label>
        <div className="sr-only" aria-hidden="true">
          <label htmlFor="blog-comment-company">Company website</label>
          <input
            id="blog-comment-company"
            tabIndex="-1"
            autoComplete="off"
            value={form._hp}
            onChange={(event) => setForm((current) => ({ ...current, _hp: event.target.value }))}
          />
        </div>
        <div className="blog-form-action-row">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? <LuLoaderCircle className="is-spinning" aria-hidden="true" /> : <LuSend aria-hidden="true" />}
            {submitting ? "Submitting comment" : "Submit comment"}
          </button>
          <div className={`blog-form-status ${status.type ? `is-${status.type}` : ""}`} role={status.type === "error" ? "alert" : "status"} aria-live="polite">
            {status.message}
          </div>
        </div>
      </form>

      <div className="blog-comment-list">
        {comments.length ? comments.map((comment) => (
          <article key={comment._id} className="blog-comment-card">
            <div>
              <strong>{comment.name}</strong>
              <time dateTime={comment.createdAt}>{dateLabel(comment.createdAt)}</time>
            </div>
            <p>{comment.comment}</p>
          </article>
        )) : (
          <div className="blog-comments-empty">
            <LuMessageSquare aria-hidden="true" />
            <p>No approved comments yet. Start a thoughtful conversation.</p>
          </div>
        )}
      </div>
      {hasMore ? (
        <button type="button" className="blog-load-more" onClick={loadMore} disabled={loadingMore}>
          {loadingMore ? "Loading comments" : "Load more comments"}
        </button>
      ) : null}
    </section>
  );
}
