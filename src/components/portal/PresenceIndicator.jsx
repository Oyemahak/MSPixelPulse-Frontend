// src/components/portal/PresenceIndicator.jsx

import {
  isPresenceOnline,
  presenceLabel,
} from "@/lib/presence.js";

export default function PresenceIndicator({
  user,
  compact = false,
  className = "",
}) {
  const online = isPresenceOnline(user);
  const label = presenceLabel(user);

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
            : "bg-white/25",
        ].join(" ")}
        aria-hidden="true"
      />

      {!compact && (
        <span
          className={
            online
              ? "text-xs font-medium text-emerald-500"
              : "text-muted-xs truncate"
          }
        >
          {label}
        </span>
      )}
    </span>
  );
}