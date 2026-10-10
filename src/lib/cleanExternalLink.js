// GA4 cross-domain linking (configured in GA Admin for mspixelpulse.com) decorates outbound anchors with
// `_gl`/`_ga` parameters at mousedown. Demo subdomains run no analytics, so the decoration only clutters the
// destination. Navigate with the clean URL the card was rendered with and leave modifier-key behaviour alone.
export function cleanExternalUrl(value) {
  try {
    const url = new URL(value);
    for (const key of [...url.searchParams.keys()]) if (key === "_gl" || key === "_ga" || key.startsWith("_ga_")) url.searchParams.delete(key);
    return url.toString();
  } catch {
    return value;
  }
}

export function openCleanExternal(event) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const anchor = event.currentTarget;
  const clean = cleanExternalUrl(anchor.href);
  anchor.setAttribute("href", clean);
  event.preventDefault();
  window.open(clean, "_blank", "noopener,noreferrer");
}
