export default function PortalRouteFallback() {
  return (
    <div className="portal-route-fallback" role="status" aria-live="polite">
      <span aria-hidden="true" />
      <strong>Loading workspace</strong>
    </div>
  );
}
