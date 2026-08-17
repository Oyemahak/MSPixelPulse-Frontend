// src/lib/presence.js

export const PRESENCE_ONLINE_WINDOW_MS = 2 * 60 * 1000;

export function normalizePresenceTime(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  let date;

  if (value instanceof Date) {
    date = value;
  } else if (typeof value === "number") {
    const timestamp =
      value > 0 && value < 10_000_000_000
        ? value * 1000
        : value;

    date = new Date(timestamp);
  } else {
    const raw = String(value).trim();

    if (!raw) return null;

    if (/^\d+$/.test(raw)) {
      const numeric = Number(raw);

      const timestamp =
        numeric > 0 && numeric < 10_000_000_000
          ? numeric * 1000
          : numeric;

      date = new Date(timestamp);
    } else {
      date = new Date(raw);
    }
  }

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

export function presenceLastSeen(userOrPresence) {
  if (!userOrPresence) return null;

  if (
    typeof userOrPresence === "object" &&
    !(userOrPresence instanceof Date)
  ) {
    return (
      userOrPresence.lastSeenAt ||
      userOrPresence.presence?.lastSeenAt ||
      null
    );
  }

  return userOrPresence;
}

export function isPresenceOnline(userOrPresence, now = Date.now()) {
  if (
    userOrPresence?.online === true ||
    userOrPresence?.presence?.online === true
  ) {
    return true;
  }

  const date = normalizePresenceTime(
    presenceLastSeen(userOrPresence),
  );

  if (!date) return false;

  const current =
    now instanceof Date
      ? now.getTime()
      : Number(now);

  if (!Number.isFinite(current)) {
    return false;
  }

  const elapsed = current - date.getTime();

  if (elapsed < -5 * 60 * 1000) {
    return false;
  }

  return elapsed <= PRESENCE_ONLINE_WINDOW_MS;
}

export function formatLastActive(value) {
  const date = normalizePresenceTime(
    presenceLastSeen(value),
  );

  if (!date) {
    return "Offline";
  }

  try {
    const formatted = new Intl.DateTimeFormat(
      undefined,
      {
        dateStyle: "medium",
        timeStyle: "short",
      },
    ).format(date);

    return `Last active ${formatted}`;
  } catch {
    return "Offline";
  }
}

export function presenceLabel(value) {
  return isPresenceOnline(value)
    ? "Online"
    : formatLastActive(value);
}