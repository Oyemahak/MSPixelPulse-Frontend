// src/lib/presence.js

export const PRESENCE_ONLINE_WINDOW_MS =
  2 * 60 * 1000;

export function normalizePresenceTime(
  value,
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const raw =
    typeof value ===
    "object" &&
    !(value instanceof Date)
      ? (
          value.lastActivityAt ||
          value.lastSeenAt ||
          value.presence
            ?.lastActivityAt ||
          value.presence
            ?.lastSeenAt ||
          null
        )
      : value;

  if (!raw) {
    return null;
  }

  let date;

  if (
    raw instanceof Date
  ) {
    date = raw;
  } else if (
    typeof raw ===
    "number"
  ) {
    date =
      new Date(
        raw <
          10_000_000_000
          ? raw * 1000
          : raw,
      );
  } else {
    const text =
      String(raw).trim();

    if (
      /^\d+$/.test(text)
    ) {
      const number =
        Number(text);

      date =
        new Date(
          number <
            10_000_000_000
            ? number * 1000
            : number,
        );
    } else {
      date =
        new Date(text);
    }
  }

  return Number.isNaN(
    date.getTime(),
  )
    ? null
    : date;
}

export function isPresenceOnline(
  value,
  now = Date.now(),
) {
  if (
    value &&
    typeof value === "object" &&
    String(
      value.presenceState ||
        value.presence?.state ||
        "",
    ).toLowerCase() === "offline"
  ) {
    return false;
  }

  const date =
    normalizePresenceTime(
      value,
    );

  if (!date) {
    return false;
  }

  const current =
    now instanceof Date
      ? now.getTime()
      : Number(now);

  if (
    !Number.isFinite(
      current,
    )
  ) {
    return false;
  }

  const elapsed =
    current -
    date.getTime();

  if (
    elapsed <
    -5 * 60 * 1000
  ) {
    return false;
  }

  return (
    elapsed <=
    PRESENCE_ONLINE_WINDOW_MS
  );
}

export function formatLastSeen(
  value,
) {
  const date =
    normalizePresenceTime(
      value,
    );

  if (!date) {
    return "No activity yet";
  }

  const elapsed =
    Math.max(
      0,
      Date.now() -
        date.getTime(),
    );

  const minutes =
    Math.floor(
      elapsed / 60_000,
    );

  if (minutes < 1) {
    return "Last seen just now";
  }

  if (minutes < 60) {
    return `Last seen ${minutes}m ago`;
  }

  const hours =
    Math.floor(
      minutes / 60,
    );

  if (hours < 24) {
    return `Last seen ${hours}h ago`;
  }

  const days =
    Math.floor(
      hours / 24,
    );

  if (days < 7) {
    return `Last seen ${days}d ago`;
  }

  try {
    return `Last seen ${new Intl.DateTimeFormat(
      undefined,
      {
        dateStyle:
          "medium",

        timeStyle:
          "short",
      },
    ).format(date)}`;
  } catch {
    return "Offline";
  }
}

export function presenceStatus(
  value,
) {
  const online =
    isPresenceOnline(
      value,
    );

  return {
    online,

    label:
      online
        ? "Online"
        : "Offline",

    detail:
      online
        ? "Online"
        : formatLastSeen(
            value,
          ),
  };
}

export function presenceLabel(
  value,
) {
  return presenceStatus(
    value,
  ).label;
}
