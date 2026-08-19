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
      ? status.detail
      : "Offline · No activity yet";

  return (
    <span
      className={`inline-flex min-w-0 items-center gap-1.5 ${className}`}
      aria-label={label}
      title={label}
    >
      {(online || compact) && (
        <span
          className={`inline-block h-2.5 w-2.5 shrink-0 rounded-full ${online ? "bg-emerald-500" : "bg-slate-400"}`}
          aria-hidden="true"
        />
      )}

      {!compact && (
        <span className={`min-w-0 text-xs font-semibold leading-tight ${online ? "text-emerald-500" : "text-slate-500"}`}>
          {label}
        </span>
      )}
    </span>
  );
}
