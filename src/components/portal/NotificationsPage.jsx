import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuBell, LuCheckCheck, LuCircleDollarSign, LuFolderKanban, LuInbox,
  LuMegaphone, LuMessageSquare, LuRefreshCw, LuSettings2, LuShieldCheck,
} from "react-icons/lu";
import { useAuth } from "@/context/AuthContext.jsx";
import { notifications as notificationApi } from "@/lib/api.js";
import { notifyNotificationChange, relativeNotificationTime } from "@/lib/notificationUi.js";

const categories = [
  ["", "All categories"], ["requirements", "Requirements"], ["projects", "Projects"],
  ["messages", "Messages"], ["announcements", "Announcements"], ["evidence", "Evidence"],
  ["billing", "Billing"], ["leads", "Leads"],
  ["support", "Support"], ["system", "System"],
];

const categoryIcons = {
  requirements: LuCheckCheck, projects: LuFolderKanban, messages: LuMessageSquare,
  announcements: LuMegaphone, evidence: LuCheckCheck, billing: LuCircleDollarSign,
  leads: LuInbox, support: LuShieldCheck, system: LuSettings2,
};

export default function NotificationsPage() {
  const { role } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState("all");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [settings, setSettings] = useState(null);

  const load = useCallback(async ({ nextPage = 1, append = false } = {}) => {
    setLoading(!append);
    setError("");
    try {
      const data = await notificationApi.list({
        page: nextPage, limit: 30,
        ...(filter === "unread" ? { filter: "unread" } : {}),
        ...(category ? { category } : {}),
      });
      setItems((current) => append ? [...current, ...(data.notifications || [])] : (data.notifications || []));
      setUnreadCount(Number(data.unreadCount || 0));
      setPage(nextPage);
      setHasMore(Boolean(data.hasMore));
    } catch (requestError) {
      setError(requestError?.message || "Notifications could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, [filter, category]);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    if (role !== "admin") return;
    notificationApi.settings().then((data) => setSettings(data.settings)).catch(() => undefined);
  }, [role]);

  async function openNotification(item) {
    if (!item.readAt) {
      try {
        await notificationApi.markRead(item._id);
        setItems((current) => current.map((value) => value._id === item._id ? { ...value, readAt: new Date().toISOString() } : value));
        setUnreadCount((count) => Math.max(0, count - 1));
        notifyNotificationChange();
      } catch (requestError) {
        setError(requestError?.message || "Read status could not be saved. The destination will still open.");
      }
    }
    navigate(item.actionUrl || `/${role === "developer" ? "dev" : role}/notifications`);
  }

  async function markAllRead() {
    setBusy(true);
    try {
      const result = await notificationApi.markAllRead();
      const readAt = result.readAt || new Date().toISOString();
      setItems((current) => current.map((item) => ({ ...item, readAt: item.readAt || readAt })));
      setUnreadCount(0);
      notifyNotificationChange();
    } catch (requestError) {
      setError(requestError?.message || "Notifications could not be marked as read.");
    } finally {
      setBusy(false);
    }
  }

  async function toggleEmailCategory(key) {
    if (!settings) return;
    const emailCategories = { ...settings.emailCategories, [key]: !settings.emailCategories[key] };
    setSettings((current) => ({ ...current, emailCategories }));
    try {
      const data = await notificationApi.updateSettings(emailCategories);
      setSettings(data.settings);
    } catch (requestError) {
      setError(requestError?.message || "Notification settings could not be saved.");
      setSettings((current) => ({ ...current, emailCategories: { ...current.emailCategories, [key]: !emailCategories[key] } }));
    }
  }

  const visibleLabel = useMemo(() => categories.find(([value]) => value === category)?.[1] || "All categories", [category]);

  return (
    <div className="page-shell space-stack notifications-page">
      <header className="page-header notifications-page-header">
        <div><div className="text-muted-xs">Role-aware activity</div><h1 className="page-title">Notifications</h1><p className="text-muted">Important project, message, billing, and support updates in one place.</p></div>
        <div className="notifications-header-actions">
          <button type="button" className="btn btn-outline" onClick={() => load()} disabled={loading}><LuRefreshCw className={loading ? "animate-spin" : ""} aria-hidden="true" /> Refresh</button>
          <button type="button" className="btn btn-primary" onClick={markAllRead} disabled={busy || unreadCount === 0}><LuCheckCheck aria-hidden="true" /> Mark all read</button>
        </div>
      </header>

      <div className="notification-filter-bar" aria-label="Notification filters">
        <div className="notification-segmented" role="group" aria-label="Read status">
          <button type="button" className={filter === "all" ? "is-active" : ""} onClick={() => setFilter("all")}>All</button>
          <button type="button" className={filter === "unread" ? "is-active" : ""} onClick={() => setFilter("unread")}>Unread <span>{unreadCount}</span></button>
        </div>
        <label><span className="sr-only">Category</span><select value={category} onChange={(event) => setCategory(event.target.value)} aria-label={`Category: ${visibleLabel}`}>{categories.map(([value, label]) => <option key={value || "all"} value={value}>{label}</option>)}</select></label>
      </div>

      {error ? <div className="portal-notice is-error" role="alert">{error}</div> : null}
      <section className="notification-list" aria-label="Notifications" aria-busy={loading}>
        {items.map((item) => {
          const Icon = categoryIcons[item.category] || LuBell;
          return (
            <button type="button" key={item._id} className={item.readAt ? "notification-row" : "notification-row is-unread"} onClick={() => openNotification(item)}>
              <span className="notification-category-icon"><Icon aria-hidden="true" /></span>
              <span className="notification-row-copy"><span className="notification-row-title">{item.title}</span><span>{item.message}</span><small>{item.category} · {relativeNotificationTime(item.createdAt)}{item.metadata?.reference ? ` · ${item.metadata.reference}` : ""}</small></span>
              <span className="notification-read-state">{item.readAt ? "Read" : "Unread"}</span>
            </button>
          );
        })}
        {!items.length ? <div className="notification-empty"><LuBell aria-hidden="true" /><strong>{loading ? "Loading notifications..." : "You’re all caught up"}</strong>{!loading ? <span>{filter === "unread" ? "There are no unread notifications." : "New portal updates will appear here."}</span> : null}</div> : null}
      </section>
      {hasMore ? <button type="button" className="btn btn-outline notification-load-more" onClick={() => load({ nextPage: page + 1, append: true })}>Load more</button> : null}

      {role === "admin" && settings ? (
        <details className="notification-settings card-surface">
          <summary><span><LuSettings2 aria-hidden="true" /> Operational email categories</span><small>{settings.operationalRecipient}</small></summary>
          <div><p>In-app notifications remain enabled. Choose which category copies are also sent to the operational Gmail account.</p><div className="notification-settings-grid">{categories.filter(([key]) => key).map(([key, label]) => <label key={key}><input type="checkbox" checked={settings.emailCategories?.[key] !== false} onChange={() => toggleEmailCategory(key)} /><span>{label}</span></label>)}</div></div>
        </details>
      ) : null}
    </div>
  );
}
