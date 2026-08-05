import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  LuBellRing,
  LuBuilding2,
  LuCheck,
  LuDownload,
  LuExternalLink,
  LuFilter,
  LuLoaderCircle,
  LuMail,
  LuMessageSquare,
  LuPhone,
  LuRefreshCw,
  LuSearch,
  LuShare2,
  LuSlidersHorizontal,
  LuThumbsDown,
  LuThumbsUp,
  LuTrash2,
  LuUserRound,
  LuUsers,
  LuX,
} from "react-icons/lu";
import { adminEngagement } from "@/lib/api.js";

const tabs = ["overview", "comments", "subscribers", "leads", "notifications"];
const tabLabels = {
  overview: "Overview",
  comments: "Comments",
  subscribers: "Subscribers",
  leads: "Contacts",
  notifications: "Notifications",
};
const initialFilters = {
  comments: { q: "", status: "", sort: "newest", blogSlug: "", from: "", to: "" },
  subscribers: { q: "", status: "", sort: "newest", from: "", to: "" },
  leads: { q: "", status: "", sort: "newest", source: "", inquiryType: "", from: "", to: "" },
  notifications: { q: "", status: "", sort: "newest", type: "", audience: "", from: "", to: "" },
};

const searchPlaceholders = {
  comments: "Search commenter, email, article, or comment",
  subscribers: "Search email or source article",
  leads: "Search name, email, phone, business, or message",
  notifications: "Search type, recipient, entity, or error",
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

function filtersFromParams(tab, params) {
  const defaults = initialFilters[tab] || {};
  return Object.fromEntries(Object.entries(defaults).map(([key, fallback]) => [key, params.get(key) || fallback]));
}

function filterParams(tab, filters) {
  if (tab === "overview") return new URLSearchParams();
  const next = new URLSearchParams({ tab });
  const defaults = initialFilters[tab] || {};
  Object.entries(filters || {}).forEach(([key, value]) => {
    if (value && value !== defaults[key]) next.set(key, value);
  });
  return next;
}

function apiFilters(filters) {
  const query = { ...filters };
  if (filters?.from) query.from = new Date(`${filters.from}T00:00:00.000`).toISOString();
  if (filters?.to) query.to = new Date(`${filters.to}T23:59:59.999`).toISOString();
  return query;
}

function filterCount(filters, tab, keys = Object.keys(filters || {})) {
  const defaults = initialFilters[tab] || {};
  return keys.filter((key) => filters?.[key] && filters[key] !== defaults[key]).length;
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
  const activeTab = tabs.includes(requestedTab) ? requestedTab : "overview";
  const paramsKey = params.toString();
  const [summary, setSummary] = useState({ metrics: {}, byBlog: [] });
  const [records, setRecords] = useState({ comments: [], subscribers: [], leads: [], notifications: [] });
  const [pagination, setPagination] = useState({});
  const [draftFilters, setDraftFilters] = useState(() => ({
    ...initialFilters,
    ...(activeTab === "overview" ? {} : { [activeTab]: filtersFromParams(activeTab, params) }),
  }));
  const [appliedFilters, setAppliedFilters] = useState(() => ({
    ...initialFilters,
    ...(activeTab === "overview" ? {} : { [activeTab]: filtersFromParams(activeTab, params) }),
  }));
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
    const filters = apiFilters(appliedFilters[tab] || {});
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
    if (activeTab === "overview") return;
    const next = filtersFromParams(activeTab, new URLSearchParams(paramsKey));
    setDraftFilters((current) => ({ ...current, [activeTab]: next }));
    setAppliedFilters((current) => ({ ...current, [activeTab]: next }));
  }, [activeTab, paramsKey]);

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

  useEffect(() => {
    if (loading) return;
    const currentParams = new URLSearchParams(paramsKey);
    const selectedId = activeTab === "leads" ? currentParams.get("lead") : activeTab === "comments" ? currentParams.get("comment") : "";
    if (!selectedId) return;
    const target = document.getElementById(`${activeTab === "leads" ? "lead" : "comment"}-${selectedId}`);
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [activeTab, loading, paramsKey]);

  function chooseTab(tab) {
    setParams(filterParams(tab, appliedFilters[tab]));
  }

  function updateDraft(field, value) {
    setDraftFilters((current) => ({
      ...current,
      [activeTab]: { ...current[activeTab], [field]: value },
    }));
  }

  function applyFilters(event) {
    event.preventDefault();
    setParams(filterParams(activeTab, draftFilters[activeTab]));
  }

  function clearFilters() {
    setParams(filterParams(activeTab, initialFilters[activeTab]));
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
  const activeFilters = appliedFilters[activeTab] || {};
  const advancedFilterKeys = Object.keys(currentFilters).filter((key) => !["q", "status", "sort"].includes(key));
  const activeFilterTotal = filterCount(activeFilters, activeTab);
  const draftFilterTotal = filterCount(currentFilters, activeTab);
  const advancedFilterTotal = filterCount(currentFilters, activeTab, advancedFilterKeys);
  const recordCount = records[activeTab]?.length || 0;
  const totalRecords = pagination[activeTab]?.total ?? recordCount;
  const failedNotificationCount = records.notifications.filter((notification) => notification.status === "failed").length;

  return (
    <div className="engagement-admin-page">
      <section className="engagement-admin-hero">
        <div>
          <p>Content operations</p>
          <h2>Blog engagement</h2>
          <span>Moderate comments, manage subscribers and contacts, and review email delivery without exposing secure tokens.</span>
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
            {tabLabels[tab]}
          </button>
        ))}
      </div>

      {activeTab !== "overview" ? (
        <form className="engagement-admin-filters engagement-filter-shell" onSubmit={applyFilters}>
          <div className="engagement-filter-primary">
            <FilterField label="Search">
              <span className="engagement-filter-input"><LuSearch aria-hidden="true" /><input type="search" placeholder={searchPlaceholders[activeTab]} value={currentFilters.q} onChange={(event) => updateDraft("q", event.target.value)} /></span>
            </FilterField>
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
                ).map((status) => <option key={status} value={status}>{status[0].toUpperCase() + status.slice(1)}</option>)}
              </select>
            </FilterField>
            <FilterField label="Sort">
              <select value={currentFilters.sort} onChange={(event) => updateDraft("sort", event.target.value)}>
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </FilterField>
            <div className="engagement-filter-actions">
              <button type="submit" className="btn btn-secondary"><LuFilter aria-hidden="true" /> Apply</button>
              {draftFilterTotal ? <button type="button" className="btn btn-ghost" onClick={clearFilters}><LuX aria-hidden="true" /> Clear</button> : null}
              {activeTab === "subscribers" ? (
                <button type="button" className="btn btn-secondary" onClick={exportCsv} disabled={busyId === "export"}>
                  <LuDownload aria-hidden="true" /> Export CSV
                </button>
              ) : null}
            </div>
          </div>

          <details className="engagement-filter-more" open={advancedFilterTotal > 0 || undefined}>
            <summary><LuSlidersHorizontal aria-hidden="true" /> More filters {advancedFilterTotal ? <span>{advancedFilterTotal} active</span> : null}</summary>
            <div className="engagement-filter-advanced">
              {activeTab === "comments" ? (
                <FilterField label="Article"><input placeholder="Title or slug" value={currentFilters.blogSlug} onChange={(event) => updateDraft("blogSlug", event.target.value)} /></FilterField>
              ) : null}
              {activeTab === "leads" ? (
                <>
                  <FilterField label="Source"><input placeholder="e.g. public-contact" value={currentFilters.source} onChange={(event) => updateDraft("source", event.target.value)} /></FilterField>
                  <FilterField label="Inquiry type"><input placeholder="e.g. website project" value={currentFilters.inquiryType} onChange={(event) => updateDraft("inquiryType", event.target.value)} /></FilterField>
                </>
              ) : null}
              {activeTab === "notifications" ? (
                <>
                  <FilterField label="Notification type">
                    <select value={currentFilters.type} onChange={(event) => updateDraft("type", event.target.value)}>
                      <option value="">All notification types</option>
                      {notificationTypes.map((type) => <option key={type} value={type}>{formatNotificationType(type)}</option>)}
                    </select>
                  </FilterField>
                  <FilterField label="Audience">
                    <select value={currentFilters.audience} onChange={(event) => updateDraft("audience", event.target.value)}>
                      <option value="">All audiences</option>
                      <option value="internal">Internal alerts</option>
                      <option value="recipient">Visitor/subscriber emails</option>
                    </select>
                  </FilterField>
                </>
              ) : null}
              <FilterField label="From date"><input type="date" value={currentFilters.from} onChange={(event) => updateDraft("from", event.target.value)} /></FilterField>
              <FilterField label="To date"><input type="date" value={currentFilters.to} onChange={(event) => updateDraft("to", event.target.value)} /></FilterField>
            </div>
          </details>
        </form>
      ) : null}

      <div className={`engagement-admin-notice ${notice.type ? `is-${notice.type}` : ""}`} role={notice.type === "error" ? "alert" : "status"} aria-live="polite">
        {loading ? <><LuLoaderCircle className="is-spinning" aria-hidden="true" /> Loading engagement data…</> : notice.message}
      </div>

      {!loading && activeTab !== "overview" ? (
        <div className="engagement-results-bar" role="status" aria-live="polite">
          <div><LuFilter aria-hidden="true" /><strong>{tabLabels[activeTab]}</strong><span>Showing {recordCount} of {totalRecords}</span></div>
          {activeFilterTotal ? <span>{activeFilterTotal} active {activeFilterTotal === 1 ? "filter" : "filters"}</span> : <span>All records</span>}
        </div>
      ) : null}

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
            <article id={`comment-${comment._id}`} key={comment._id} className={`engagement-record-card${params.get("comment") === comment._id ? " is-highlighted" : ""}`}>
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
        <section className="engagement-record-list engagement-record-list--contacts" aria-label="Contact inquiries">
          {records.leads.length ? records.leads.map((lead) => (
            <article id={`lead-${lead._id}`} key={lead._id} className={`engagement-record-card engagement-contact-card${params.get("lead") === lead._id ? " is-highlighted" : ""}`}>
              <div className="engagement-record-head engagement-contact-head">
                <div className="engagement-contact-identity">
                  <span className="engagement-contact-avatar"><LuUserRound aria-hidden="true" /></span>
                  <div><strong>{lead.name}</strong><span><LuBuilding2 aria-hidden="true" /> {lead.businessName || "Business not provided"}</span></div>
                </div>
                <StatusPill>{lead.status}</StatusPill>
              </div>

              <div className="engagement-contact-actions" aria-label={`Contact ${lead.name}`}>
                <a className="btn btn-secondary" href={`mailto:${lead.email}`}><LuMail aria-hidden="true" /> Email</a>
                {lead.phone ? <a className="btn btn-secondary" href={`tel:${lead.phone.replace(/[^\d+]/g, "")}`}><LuPhone aria-hidden="true" /> Call</a> : null}
                {lead.sourceUrl ? <a className="btn btn-ghost" href={lead.sourceUrl} target="_blank" rel="noopener noreferrer">Source <LuExternalLink aria-hidden="true" /></a> : null}
              </div>

              <dl className="engagement-contact-meta">
                <div><dt>Email</dt><dd><a href={`mailto:${lead.email}`}>{lead.email}</a></dd></div>
                <div><dt>Phone</dt><dd>{lead.phone || "Not provided"}</dd></div>
                <div><dt>Inquiry</dt><dd>{lead.inquiryType || "Website inquiry"}</dd></div>
                <div><dt>Service</dt><dd>{lead.service || "Not specified"}</dd></div>
                <div><dt>Source</dt><dd>{lead.source || "Not recorded"}</dd></div>
                <div><dt>Received</dt><dd><time dateTime={lead.createdAt}>{formatDate(lead.createdAt)}</time></dd></div>
              </dl>

              <p className="engagement-record-message">{lead.message}</p>
              <div className="engagement-contact-footer">
                <div className="engagement-delivery-row"><LuMail aria-hidden="true" /> Internal alert: {lead.emailDeliveryStatus} · Visitor confirmation: {lead.confirmationEmailStatus}</div>
                <label className="engagement-inline-select">Contact status
                  <select value={lead.status} onChange={(event) => runAction(lead._id, () => adminEngagement.updateLead(lead._id, { status: event.target.value }), "Lead status updated.")} disabled={busyId === lead._id}>
                    {["new", "contacted", "qualified", "completed", "spam"].map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                </label>
              </div>
            </article>
          )) : <EmptyState>No contacts match these filters. Try clearing filters or searching by email.</EmptyState>}
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
        <div className="engagement-load-more-wrap">
          <span>{recordCount} of {totalRecords} records loaded</span>
          <button type="button" className="btn btn-secondary engagement-load-more" onClick={() => fetchRecords(activeTab, (pagination[activeTab].page || 1) + 1, true)}>
            Load more records
          </button>
        </div>
      ) : null}
    </div>
  );
}
