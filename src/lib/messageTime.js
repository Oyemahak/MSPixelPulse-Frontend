// src/lib/messageTime.js

export function normalizeMessageTime(value) {
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

export function messageDate(message = {}) {
  return (
    normalizeMessageTime(message.sentAt) ||
    normalizeMessageTime(message.createdAt) ||
    normalizeMessageTime(message.updatedAt) ||
    normalizeMessageTime(message.ts) ||
    null
  );
}

export function formatLocalDateTime(
  value,
  fallback = "Timestamp pending",
) {
  const date = normalizeMessageTime(value);

  if (!date) return fallback;

  try {
    return new Intl.DateTimeFormat(
      undefined,
      {
        dateStyle: "medium",
        timeStyle: "short",
      },
    ).format(date);
  } catch {
    return fallback;
  }
}

export function formatMessageTime(
  message,
  fallback = "Timestamp pending",
) {
  const date = messageDate(message);

  if (!date) return fallback;

  try {
    return new Intl.DateTimeFormat(
      undefined,
      {
        dateStyle: "medium",
        timeStyle: "short",
      },
    ).format(date);
  } catch {
    return fallback;
  }
}
