import {
  LuCircleCheck,
  LuLayoutDashboard,
  LuMonitorSmartphone,
  LuPanelsTopLeft,
} from "react-icons/lu";

const capabilities = [
  { icon: LuPanelsTopLeft, label: "Website systems" },
  { icon: LuMonitorSmartphone, label: "Mobile ready" },
  { icon: LuLayoutDashboard, label: "Client portal" },
];

export default function AgencyInterfacePreview() {
  return (
    <figure
      className="agency-interface-preview"
      role="img"
      aria-label="Layered preview of an MSPixelPulse business website, mobile layout, and client portal dashboard"
    >
      <div className="agency-preview-stage" aria-hidden="true">
        <div className="agency-preview-browser">
          <div className="agency-preview-toolbar">
            <span />
            <span />
            <span />
            <div>mspixelpulse.com / preview</div>
          </div>
          <div className="agency-preview-site">
            <div className="agency-preview-site-nav">
              <strong>MSPixelPulse</strong>
              <span />
              <span />
              <span />
            </div>
            <div className="agency-preview-site-hero">
              <div>
                <small>TORONTO DIGITAL AGENCY</small>
                <span className="agency-preview-heading agency-preview-heading-wide" />
                <span className="agency-preview-heading" />
                <span className="agency-preview-copy" />
                <span className="agency-preview-copy agency-preview-copy-short" />
                <span className="agency-preview-cta">Start your project</span>
              </div>
              <div className="agency-preview-visual">
                <span className="agency-preview-orb" />
                <span className="agency-preview-mini-card agency-preview-mini-card-a" />
                <span className="agency-preview-mini-card agency-preview-mini-card-b" />
              </div>
            </div>
            <div className="agency-preview-site-grid">
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>

        <div className="agency-preview-phone">
          <span className="agency-preview-phone-notch" />
          <span className="agency-preview-phone-brand">MS</span>
          <span className="agency-preview-phone-line agency-preview-phone-line-wide" />
          <span className="agency-preview-phone-line" />
          <span className="agency-preview-phone-button" />
          <span className="agency-preview-phone-card" />
        </div>

        <div className="agency-preview-portal-card">
          <div className="agency-preview-portal-icon">
            <LuLayoutDashboard />
          </div>
          <div>
            <small>CLIENT PORTAL</small>
            <strong>Project ready</strong>
            <span><LuCircleCheck /> Files, notes and progress</span>
          </div>
        </div>

        <div className="agency-preview-status">
          <span />
          Responsive QA passed
        </div>
      </div>

      <figcaption className="agency-preview-caption">
        {capabilities.map((capability) => {
          const CapabilityIcon = capability.icon;
          return (
            <span key={capability.label}>
              <CapabilityIcon aria-hidden="true" />
              {capability.label}
            </span>
          );
        })}
      </figcaption>
    </figure>
  );
}
