import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  LuBellRing,
  LuCheck,
  LuDownload,
  LuExternalLink,
  LuLoaderCircle,
  LuMail,
  LuMessageSquare,
  LuRefreshCw,
  LuSearch,
  LuShare2,
  LuThumbsDown,
  LuThumbsUp,
  LuTrash2,
  LuUsers,
} from "react-icons/lu";
import { adminEngagement } from "@/lib/api.js";

const tabs = ["overview", "comments", "subscribers", "leads", "notifications"];
const initialFilters = {
  comments: { q: "", status: "", blogSlug: "" },
  subscribers: { q: "", status: "" },
  leads: { q: "", status: "", source: "" },
  notifications: { status: "", type: "" },
};

const notificationTypes = [
  "contact_notification",
  "contact_confirmation",
  "blog_like",
  "blog_dislike",
  "blog_reaction_removed",
  "blog_comment",
  "blog_share",
  "blog_subscription_started",
  "blog_subscription_confirmed",
  "blog_subscription_confirmation",
];

const internalNotificationRecipients = ["info@mspixelpulse.com", "mspixelpulse@gmail.com"];

function formatNotificationType(value) {
  return String(value || "Notification")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDeliveryResult(value) {
  if (!value) return "No error recorded";
  if (value === "ETIMEDOUT") return "Provider timeout";
  if (value === "ECONNREFUSED") return "Provider unavailable";
  return value;
}

function isInternalNotification(notification) {
  const recipients = notification.recipients || [];
  return internalNotificationRecipients.every((email) => recipients.includes(email));
}

function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-CA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function StatusPill({ children }) {
  const value = String(children || "unknown").toLowerCase();
  return <span className={`engagement-status-pill status-${value}`}>{children}</span>;
}

function EmptyState({ children }) {
  return <div className="engagement-admin-empty">{children}</div>;
}

function FilterField({ label, children }) {
  return <label className="engagement-filter-field"><span>{label}</span>{children}</label>;
}

export default function BlogEngagementAdmin() {
  const [params, setParams] = useSearchParams();
  const requestedTab = params.get("tab");
  const [activeTab, setActiveTab] = useState(tabs.includes(requestedTab) ? requestedTab : "overview");
  const [summary, setSummary] = useState({ metrics: {}, byBlog: [] });
  const [records, setRecords] = useState({ comments: [], subscribers: [], leads: [], notifications: [] });
  const [pagination, setPagination] = useState({});
  const [draftFilters, setDraftFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [notice, setNotice] = useState({ type: "", message: "" });
  const [editingId, setEditingId] = useState("");
  const [editValues, setEditValues] = useState({ name: "", comment: "" });

  const fetchSummary = useCallback(async () => {
    const result = await adminEngagement.summary();
    setSummary(result);
  }, []);

  const fetchRecords = useCallback(async (tab, page = 1, append = false) => {
    if (tab === "overview") return;
    const filters = appliedFilters[tab] || {};
    const query = { ...filters, page, limit: 50 };
    const loaders = {
      comments: adminEngagement.comments,
      subscribers: adminEngagement.subscribers,
      leads: adminEngagement.leads,
      notifications: adminEngagement.notifications,
    };
    const result = await loaders[tab](query);
    const key = tab;
    setRecords((current) => ({
      ...current,
      [key]: append ? [...current[key], ...(result[key] || [])] : (result[key] || []),
    }));
    setPagination((current) => ({ ...current, [tab]: result.pagination || {} }));
  }, [appliedFilters]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setNotice({ type: "", message: "" });
    Promise.all([fetchSummary(), fetchRecords(activeTab)])
      .catch((error) => {
        if (active) setNotice({ type: "error", message: error.message || "Admin engagement data could not be loaded." });
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [activeTab, fetchRecords, fetchSummary]);

  function chooseTab(tab) {
    setActiveTab(tab);
    setParams(tab === "overview" ? {} : { tab });
  }

  function updateDraft(field, value) {
    setDraftFilters((current) => ({
      ...current,
      [activeTab]: { ...current[activeTab], [field]: value },
    }));
  }

  function applyFilters(event) {
    event.preventDefault();
    setAppliedFilters((current) => ({ ...current, [activeTab]: { ...draftFilters[activeTab] } }));
  }

  async function runAction(id, task, successMessage) {
    try {
      setBusyId(id);
      setNotice({ type: "", message: "" });
      await task();
      await Promise.all([fetchSummary(), fetchRecords(activeTab)]);
      setNotice({ type: "success", message: successMessage });
      return true;
    } catch (error) {
      setNotice({ type: "error", message: error.message || "That admin action could not be completed." });
      return false;
    } finally {
      setBusyId("");
    }
  }

  async function exportCsv() {
    try {
      setBusyId("export");
      const blob = await adminEngagement.downloadSubscribers();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "mspixelpulse-blog-subscribers.csv";
      anchor.click();
      URL.revokeObjectURL(url);
      setNotice({ type: "success", message: "Subscriber CSV downloaded." });
    } catch (error) {
      setNotice({ type: "error", message: error.message || "The subscriber export failed." });
    } finally {
      setBusyId("");
    }
  }

  const metricCards = useMemo(() => [
    { label: "Likes", value: summary.metrics?.likes || 0, Icon: LuThumbsUp },
    { label: "Dislikes", value: summary.metrics?.dislikes || 0, Icon: LuThumbsDown },
    { label: "Comments", value: summary.metrics?.comments || 0, Icon: LuMessageSquare },
    { label: "Pending", value: summary.metrics?.pendingComments || 0, Icon: LuBellRing },
    { label: "Shares", value: summary.metrics?.shares || 0, Icon: LuShare2 },
    { label: "Active subscribers", value: summary.metrics?.activeSubscribers || 0, Icon: LuUsers },
  ], [summary]);

  const currentFilters = draftFilters[activeTab] || {};
  const failedNotificationCount = records.notifications.filter((notification) => notification.status === "failed").length;

  return (
    <div className="engagement-admin-page">
      <section className="engagement-admin-hero">
        <div>
          <p>Content operations</p>
          <h2>Blog engagement</h2>
          <span>Moderate comments, manage subscribers and leads, and review email delivery without exposing secure tokens.</span>
        </div>
        <button type="button" className="btn btn-secondary" onClick={() => Promise.all([fetchSummary(), fetchRecords(activeTab)])} disabled={loading}>
          <LuRefreshCw className={loading ? "is-spinning" : ""} aria-hidden="true" /> Refresh data
        </button>
      </section>

      <div className="engagement-metric-grid">
        {metricCards.map((metric) => (
          <div key={metric.label} className="engagement-metric-card">
            <span><metric.Icon aria-hidden="true" /></span>
            <div><small>{metric.label}</small><strong>{metric.value}</strong></div>
          </div>
        ))}
      </div>

      <div className="engagement-admin-tabs" role="tablist" aria-label="Blog engagement management">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            className={activeTab === tab ? "is-active" : ""}
            onClick={() => chooseTab(tab)}
          >
            {tab[0].toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab !== "overview" ? (
        <form className={`engagement-admin-filters${activeTab === "notifications" ? " engagement-admin-filters--notifications" : ""}`} onSubmit={applyFilters}>
          {Object.prototype.hasOwnProperty.call(currentFilters, "q") ? (
            <FilterField label="Search">
              <span className="engagement-filter-input"><LuSearch aria-hidden="true" /><input value={currentFilters.q} onChange={(event) => updateDraft("q", event.target.value)} /></span>
            </FilterField>
          ) : null}
          {activeTab === "comments" ? (
            <FilterField label="Article slug"><input value={currentFilters.blogSlug} onChange={(event) => updateDraft("blogSlug", event.target.value)} /></FilterField>
          ) : null}
          {activeTab === "leads" ? (
            <FilterField label="Source"><input value={currentFilters.source} onChange={(event) => updateDraft("source", event.target.value)} /></FilterField>
          ) : null}
          {activeTab === "notifications" ? (
            <FilterField label="Notification type">
              <select value={currentFilters.type} onChange={(event) => updateDraft("type", event.target.value)}>
                <option value="">All notification types</option>
                {notificationTypes.map((type) => <option key={type} value={type}>{formatNotificationType(type)}</option>)}
              </select>
            </FilterField>
          ) : null}
          <FilterField label="Status">
            <select value={currentFilters.status} onChange={(event) => updateDraft("status", event.target.value)}>
              <option value="">All statuses</option>
              {(activeTab === "comments"
                ? ["pending", "approved", "rejected", "spam"]
                : activeTab === "subscribers"
                  ? ["pending", "active", "unsubscribed"]
                  : activeTab === "leads"
                    ? ["new", "contacted", "qualified", "completed", "spam"]
                    : ["pending", "sent", "failed", "skipped"]
              ).map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </FilterField>
          <button type="submit" className="btn btn-secondary">Apply filters</button>
          {activeTab === "subscribers" ? (
            <button type="button" className="btn btn-secondary" onClick={exportCsv} disabled={busyId === "export"}>
              <LuDownload aria-hidden="true" /> Export CSV
            </button>
          ) : null}
        </form>
      ) : null}

      <div className={`engagement-admin-notice ${notice.type ? `is-${notice.type}` : ""}`} role={notice.type === "error" ? "alert" : "status"} aria-live="polite">
        {loading ? <><LuLoaderCircle className="is-spinning" aria-hidden="true" /> Loading engagement data…</> : notice.message}
      </div>

      {!loading && activeTab === "overview" ? (
        <section className="engagement-admin-panel">
          <div className="engagement-panel-heading"><div><p>Article performance</p><h3>Engagement grouped by guide</h3></div></div>
          {summary.byBlog?.length ? (
            <div className="engagement-blog-list">
              {summary.byBlog.map((blog) => (
                <article key={blog.blogSlug}>
                  <div>
                    <strong>{blog.blogTitle || blog.blogSlug}</strong>
                    <a href={`https://mspixelpulse.com/blog/${blog.blogSlug}`} target="_blank" rel="noopener noreferrer">
                      Open guide <LuExternalLink aria-hidden="true" />
                    </a>
                  </div>
                  <dl>
                    <div><dt>Likes</dt><dd>{blog.likes}</dd></div>
                    <div><dt>Dislikes</dt><dd>{blog.dislikes}</dd></div>
                    <div><dt>Comments</dt><dd>{blog.comments}</dd></div>
                    <div><dt>Shares</dt><dd>{blog.shares}</dd></div>
                  </dl>
                </article>
              ))}
            </div>
          ) : <EmptyState>No blog engagement has been recorded yet.</EmptyState>}
        </section>
      ) : null}

      {!loading && activeTab === "comments" ? (
        <section className="engagement-record-list" aria-label="Blog comments">
          {records.comments.length ? records.comments.map((comment) => (
            <article key={comment._id} className="engagement-record-card">
              <div className="engagement-record-head">
                <div><strong>{comment.name}</strong><span>{comment.email}</span></div>
                <StatusPill>{comment.status}</StatusPill>
              </div>
              <div className="engagement-record-meta">
                <a href={comment.blogUrl} target="_blank" rel="noopener noreferrer">{comment.blogTitle} <LuExternalLink aria-hidden="true" /></a>
                <time>{formatDate(comment.createdAt)}</time>
                <span>Email: {comment.emailDeliveryStatus}</span>
              </div>
              {editingId === comment._id ? (
                <div className="engagement-comment-editor">
                  <label>Name<input value={editValues.name} onChange={(event) => setEditValues((current) => ({ ...current, name: event.target.value }))} /></label>
                  <label>Comment<textarea rows="4" value={editValues.comment} onChange={(event) => setEditValues((current) => ({ ...current, comment: event.target.value }))} /></label>
                </div>
              ) : <p className="engagement-record-message">{comment.comment}</p>}
              <div className="engagement-record-actions">
                {editingId === comment._id ? (
                  <>
                    <button type="button" className="btn btn-primary" onClick={() => runAction(comment._id, () => adminEngagement.updateComment(comment._id, editValues), "Comment updated.").then((saved) => { if (saved) setEditingId(""); })} disabled={busyId === comment._id}>Save edit</button>
                    <button type="button" className="btn btn-secondary" onClick={() => setEditingId("")}>Cancel</button>
                  </>
                ) : (
                  <button type="button" className="btn btn-secondary" onClick={() => { setEditingId(comment._id); setEditValues({ name: comment.name, comment: comment.comment }); }}>Edit comment</button>
                )}
                {["approved", "rejected", "spam"].filter((status) => status !== comment.status).map((status) => (
                  <button key={status} type="button" className="btn btn-secondary" onClick={() => runAction(comment._id, () => adminEngagement.updateComment(comment._id, { status }), `Comment marked ${status}.`)} disabled={busyId === comment._id}>
                    {status === "approved" ? <LuCheck aria-hidden="true" /> : null}{status[0].toUpperCase() + status.slice(1)}
                  </button>
                ))}
                <button type="button" className="btn btn-danger" onClick={() => {
                  if (window.confirm("Delete this comment permanently?")) runAction(comment._id, () => adminEngagement.deleteComment(comment._id), "Comment deleted.");
                }} disabled={busyId === comment._id}><LuTrash2 aria-hidden="true" /> Delete</button>
              </div>
            </article>
          )) : <EmptyState>No comments match these filters.</EmptyState>}
        </section>
      ) : null}

      {!loading && activeTab === "subscribers" ? (
        <section className="engagement-record-list" aria-label="Blog subscribers">
          {records.subscribers.length ? records.subscribers.map((subscriber) => (
            <article key={subscriber._id} className="engagement-record-card">
              <div className="engagement-record-head"><div><strong>{subscriber.email}</strong><span>From {subscriber.sourceBlogTitle}</span></div><StatusPill>{subscriber.status}</StatusPill></div>
              <div className="engagement-record-meta">
                <span>Subscribed {formatDate(subscriber.createdAt)}</span>
                <span>Confirmed {formatDate(subscriber.confirmedAt)}</span>
                <span>Confirmation email: {subscriber.confirmationEmailStatus}</span>
              </div>
              {subscriber.status !== "unsubscribed" ? (
                <div className="engagement-record-actions"><button type="button" className="btn btn-secondary" onClick={() => runAction(subscriber._id, () => adminEngagement.unsubscribeSubscriber(subscriber._id), "Subscriber marked unsubscribed.")} disabled={busyId === subscriber._id}>Mark unsubscribed</button></div>
              ) : null}
            </article>
          )) : <EmptyState>No subscribers match these filters.</EmptyState>}
        </section>
      ) : null}

      {!loading && activeTab === "leads" ? (
        <section className="engagement-record-list" aria-label="Contact leads">
          {records.leads.length ? records.leads.map((lead) => (
            <article key={lead._id} className="engagement-record-card">
              <div className="engagement-record-head"><div><strong>{lead.name}</strong><span>{lead.email}{lead.phone ? ` · ${lead.phone}` : ""}</span></div><StatusPill>{lead.status}</StatusPill></div>
              <div className="engagement-record-meta"><span>{lead.inquiryType}</span><span>{lead.businessName || "Business not provided"}</span><span>{lead.source}</span><time>{formatDate(lead.createdAt)}</time></div>
              <p className="engagement-record-message">{lead.message}</p>
              <div className="engagement-delivery-row"><LuMail aria-hidden="true" /> Internal notification: {lead.emailDeliveryStatus} · Visitor confirmation: {lead.confirmationEmailStatus}</div>
              <div className="engagement-record-actions">
                <label className="engagement-inline-select">Lead status
                  <select value={lead.status} onChange={(event) => runAction(lead._id, () => adminEngagement.updateLead(lead._id, { status: event.target.value }), "Lead status updated.")} disabled={busyId === lead._id}>
                    {["new", "contacted", "qualified", "completed", "spam"].map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                </label>
              </div>
            </article>
          )) : <EmptyState>No leads match these filters.</EmptyState>}
        </section>
      ) : null}

      {!loading && activeTab === "notifications" ? (
        <section className="engagement-notification-workspace" aria-labelledby="notification-log-title">
          <div className="engagement-notification-summary">
            <div className="engagement-notification-summary-icon"><LuMail aria-hidden="true" /></div>
            <div>
              <p>Email delivery</p>
              <h3 id="notification-log-title">Notification history</h3>
              <span>Internal alerts are delivered to both MSPixelPulse inboxes. Visitor and subscriber confirmations remain private to their intended recipient.</span>
            </div>
            {failedNotificationCount ? <span className="engagement-notification-failure-count">{failedNotificationCount} failed on this page</span> : null}
          </div>

          <div className="engagement-record-list engagement-record-list--notifications">
            {records.notifications.length ? records.notifications.map((notification) => {
              const internalNotification = isInternalNotification(notification);
              const timestamp = notification.sentAt || notification.createdAt;
              const retrying = busyId === notification._id;

              return (
                <article key={notification._id} className={`engagement-record-card engagement-notification-card status-${notification.status}`}>
                  <div className="engagement-record-head engagement-notification-head">
                    <div className="engagement-notification-title">
                      <span className="engagement-notification-icon"><LuBellRing aria-hidden="true" /></span>
                      <div>
                        <strong>{formatNotificationType(notification.notificationType)}</strong>
                        <span>{internalNotification ? "Internal alert" : "Recipient email"} · {notification.relatedEntityType}</span>
                      </div>
                    </div>
                    <StatusPill>{notification.status}</StatusPill>
                  </div>

                  <dl className="engagement-notification-meta">
                    <div className="engagement-notification-recipients">
                      <dt>Recipients</dt>
                      <dd>{(notification.recipients || []).join(", ") || "No recipient recorded"}</dd>
                    </div>
                    <div>
                      <dt>Attempts</dt>
                      <dd>{notification.attemptCount || 0}</dd>
                    </div>
                    <div>
                      <dt>Last result</dt>
                      <dd title={notification.lastError || undefined}>{formatDeliveryResult(notification.lastError)}</dd>
                    </div>
                    <div>
                      <dt>{notification.sentAt ? "Delivered" : "Logged"}</dt>
                      <dd><time dateTime={timestamp || undefined}>{formatDate(timestamp)}</time></dd>
                    </div>
                  </dl>

                  {notification.status === "failed" ? (
                    <div className="engagement-notification-footer">
                      <span>Safe to retry after delivery service recovery.</span>
                      <button type="button" className="btn btn-secondary" onClick={() => runAction(notification._id, () => adminEngagement.retryNotification(notification._id), "Notification delivered successfully.")} disabled={retrying}>
                        <LuRefreshCw className={retrying ? "is-spinning" : ""} aria-hidden="true" /> {retrying ? "Retrying…" : "Retry safely"}
                      </button>
                    </div>
                  ) : null}
                </article>
              );
            }) : <EmptyState>No notification logs match these filters.</EmptyState>}
          </div>
        </section>
      ) : null}

      {pagination[activeTab]?.hasMore ? (
        <button type="button" className="btn btn-secondary engagement-load-more" onClick={() => fetchRecords(activeTab, (pagination[activeTab].page || 1) + 1, true)}>
          Load more records
        </button>
      ) : null}
    </div>
  );
}
