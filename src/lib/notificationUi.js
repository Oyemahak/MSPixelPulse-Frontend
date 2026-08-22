export const NOTIFICATION_REFRESH_EVENT = "mspixelpulse:notifications-changed";

export function relativeNotificationTime(value) {
  const timestamp = new Date(value).getTime();
  if (!Number.isFinite(timestamp)) return "Recently";
  const seconds = Math.max(0, Math.round((Date.now() - timestamp) / 1000));
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return days < 14 ? `${days}d ago` : new Intl.DateTimeFormat("en-CA", { month: "short", day: "numeric" }).format(new Date(timestamp));
}

export function notifyNotificationChange() {
  window.dispatchEvent(new CustomEvent(NOTIFICATION_REFRESH_EVENT));
}
