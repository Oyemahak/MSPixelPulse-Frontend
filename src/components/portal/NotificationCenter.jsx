import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuBell, LuCheck, LuExternalLink } from "react-icons/lu";
import { notifications as notificationApi } from "@/lib/api.js";
import { NOTIFICATION_REFRESH_EVENT, notifyNotificationChange, relativeNotificationTime } from "@/lib/notificationUi.js";

export default function NotificationCenter({ notificationsPath }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState("");
  const buttonRef = useRef(null);
  const panelRef = useRef(null);

  const load = useCallback(async () => {
    try {
      const data = await notificationApi.list({ limit: 8 });
      setItems(data.notifications || []);
      setUnreadCount(Number(data.unreadCount || 0));
      setError("");
    } catch {
      setError("Notifications are temporarily unavailable.");
    }
  }, []);

  useEffect(() => {
    void load();
    const onVisibility = () => { if (document.visibilityState === "visible") void load(); };
    const onChanged = () => void load();
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener(NOTIFICATION_REFRESH_EVENT, onChanged);
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") void load();
    }, 60_000);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener(NOTIFICATION_REFRESH_EVENT, onChanged);
      window.clearInterval(interval);
    };
  }, [load]);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      if (!panelRef.current?.contains(event.target) && !buttonRef.current?.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  async function openItem(item) {
    if (!item.readAt) {
      try {
        await notificationApi.markRead(item._id);
        setUnreadCount((count) => Math.max(0, count - 1));
        notifyNotificationChange();
      } catch {
        // Navigation remains useful; the unread record will be retried later.
      }
    }
    setOpen(false);
    navigate(item.actionUrl || notificationsPath);
  }

  return (
    <div className="portal-notification-center">
      <button
        ref={buttonRef}
        type="button"
        className="portal-icon-button portal-notification-button"
        onClick={() => setOpen((value) => !value)}
        aria-label={unreadCount ? `Notifications, ${unreadCount} unread` : "Notifications"}
        aria-expanded={open}
        aria-controls="portal-notification-panel"
        title="Notifications"
      >
        <LuBell className="h-5 w-5" aria-hidden="true" />
        {unreadCount ? <span className="portal-notification-count" aria-hidden="true">{unreadCount > 99 ? "99+" : unreadCount}</span> : null}
      </button>

      {open ? (
        <section ref={panelRef} id="portal-notification-panel" className="portal-notification-panel" aria-label="Recent notifications">
          <header>
            <div><strong>Notifications</strong><span>{unreadCount ? `${unreadCount} unread` : "You are up to date"}</span></div>
            <button type="button" className="portal-icon-button" onClick={() => { setOpen(false); navigate(notificationsPath); }} aria-label="View all notifications"><LuExternalLink aria-hidden="true" /></button>
          </header>
          {error ? <p className="portal-notification-panel-state" role="status">{error}</p> : null}
          {!error && items.length ? (
            <div className="portal-notification-preview-list">
              {items.map((item) => (
                <button type="button" key={item._id} className={item.readAt ? "notification-preview" : "notification-preview is-unread"} onClick={() => openItem(item)}>
                  <span className="notification-preview-dot" aria-label={item.readAt ? "Read" : "Unread"}>{item.readAt ? <LuCheck aria-hidden="true" /> : null}</span>
                  <span><strong>{item.title}</strong><small>{item.message}</small><time>{relativeNotificationTime(item.createdAt)}</time></span>
                </button>
              ))}
            </div>
          ) : null}
          {!error && !items.length ? <p className="portal-notification-panel-state">No notifications yet.</p> : null}
          <button type="button" className="notification-view-all" onClick={() => { setOpen(false); navigate(notificationsPath); }}>View all notifications</button>
        </section>
      ) : null}
    </div>
  );
}
