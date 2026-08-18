// src/components/portal/PresenceIndicator.jsx

import {
  isPresenceOnline,
  presenceStatus,
} from "@/lib/presence.js";

export default function PresenceIndicator({
  user,
  compact = false,
  className = "",
}) {
  const online = isPresenceOnline(user);
  const status = presenceStatus(user);
  const label = online
    ? "Online"
    : status.detail.startsWith("Last seen")
      ? `Offline, ${status.detail}`
      : "Offline, no recorded activity";

  return (
    <span
      className={`inline-flex min-w-0 items-center gap-1.5 ${className}`}
      aria-label={label}
      title={label}
    >
      <span
        className={[
          "inline-block h-2.5 w-2.5 shrink-0 rounded-full",
          online
            ? "bg-emerald-500"
            : "bg-slate-400",
        ].join(" ")}
        aria-hidden="true"
      />

      {!compact && (
        <span className="min-w-0 leading-tight">
          <span
            className={
              online
                ? "block text-xs font-semibold text-emerald-500"
                : "block text-xs font-semibold text-slate-500"
            }
          >
            {status.label}
          </span>
          {!online && (
            <span className="text-muted-xs block truncate">
              {status.detail}
            </span>
          )}
        </span>
      )}
    </span>
  );
}
