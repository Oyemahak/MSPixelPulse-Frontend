import { useEffect, useState } from "react";
import { LuHeartHandshake } from "react-icons/lu";
import ReactionButtons from "./ReactionButtons.jsx";
import ShareMenu from "./ShareMenu.jsx";
import CommentSection from "./CommentSection.jsx";
import { blogEngagement } from "@/lib/blogEngagement.js";
import { trackEvent } from "@/lib/analytics.js";

const emptyData = {
  counts: { likes: 0, dislikes: 0, shares: 0, approvedComments: 0 },
  viewerReaction: null,
  comments: [],
  pagination: { hasMore: false },
};

export default function BlogEngagement({ article }) {
  const [data, setData] = useState(emptyData);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    let active = true;
    setLoading(true);
    setStatus({ type: "", message: "" });
    blogEngagement.get(article)
      .then((result) => {
        if (active) setData({ ...emptyData, ...result, counts: { ...emptyData.counts, ...result.counts } });
      })
      .catch(() => {
        if (active) setStatus({ type: "error", message: "Live engagement counts are temporarily unavailable. Sharing still works." });
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [article]);

  function showStatus(message, type = "success") {
    setStatus({ type, message });
  }

  async function react(reactionType) {
    if (pending) return;
    const previous = data;
    const removing = data.viewerReaction === reactionType;
    const nextCounts = { ...data.counts };
    if (data.viewerReaction) nextCounts[`${data.viewerReaction}s`] = Math.max(0, nextCounts[`${data.viewerReaction}s`] - 1);
    if (!removing) nextCounts[`${reactionType}s`] += 1;
    setData((current) => ({ ...current, viewerReaction: removing ? null : reactionType, counts: nextCounts }));
    setPending(true);
    setStatus({ type: "", message: "" });
    try {
      const result = removing
        ? await blogEngagement.removeReaction(article)
        : await blogEngagement.react(article, reactionType);
      setData((current) => ({ ...current, viewerReaction: result.reaction, counts: { ...current.counts, ...result.counts } }));
      const eventName = removing ? "blog_reaction_removed" : reactionType === "like" ? "blog_like" : "blog_dislike";
      trackEvent(eventName, { blog_slug: article.slug, blog_title: article.title });
      showStatus(removing ? "Your reaction was removed." : `Your ${reactionType} was recorded.`);
    } catch (error) {
      setData(previous);
      showStatus(error.message || "Your reaction could not be saved.", "error");
    } finally {
      setPending(false);
    }
  }

  async function recordShare(platform, eventType = "share_option_selected") {
    const result = await blogEngagement.share(article, platform, eventType);
    setData((current) => ({ ...current, counts: { ...current.counts, shares: result.shareCount } }));
    trackEvent(eventType === "native_share_completed" ? "blog_native_share_completed" : "blog_share_option_selected", {
      blog_slug: article.slug,
      blog_title: article.title,
      share_platform: platform,
    });
  }

  return (
    <section className="blog-engagement" aria-labelledby="blog-engagement-heading" aria-busy={loading}>
      <div className="blog-engagement-intro">
        <span className="blog-engagement-icon"><LuHeartHandshake aria-hidden="true" /></span>
        <div>
          <p className="blog-engagement-kicker">Continue the conversation</p>
          <h2 id="blog-engagement-heading">Was this guide useful?</h2>
          <p>React, share it with someone who needs it, or add a thoughtful comment.</p>
        </div>
      </div>
      <div className="blog-engagement-controls">
        <ReactionButtons counts={data.counts} viewerReaction={data.viewerReaction} pending={pending || loading} onReact={react} />
        <ShareMenu
          article={article}
          shareCount={data.counts.shares}
          pending={pending}
          onRecord={recordShare}
          onStatus={showStatus}
        />
      </div>
      <div className={`blog-engagement-status ${status.type ? `is-${status.type}` : ""}`} role={status.type === "error" ? "alert" : "status"} aria-live="polite">
        {loading ? "Loading article engagement…" : status.message}
      </div>
      <CommentSection
        article={article}
        initialComments={data.comments}
        approvedCount={data.counts.approvedComments}
        initialHasMore={Boolean(data.pagination?.hasMore)}
      />
    </section>
  );
}
