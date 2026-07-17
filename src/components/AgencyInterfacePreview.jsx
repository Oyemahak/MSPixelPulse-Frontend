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
    <figure className="agency-interface-preview">
      <div className="agency-collaboration-frame">
        <img
          src="/hero/mspixelpulse-web-design-collaboration.webp"
          alt="A small-business owner and web designer reviewing a responsive website together on a laptop and phone"
          width="1448"
          height="1086"
          loading="eager"
          fetchPriority="high"
        />
        <span className="agency-collaboration-sheen" aria-hidden="true" />

        <div className="agency-collaboration-status">
          <span aria-hidden="true" />
          Toronto web strategy + design
        </div>

        <div className="agency-collaboration-story">
          <small>BUILT AROUND YOUR BUSINESS</small>
          <strong>Strategy, design and launch—together.</strong>
          <span>
            <LuCircleCheck aria-hidden="true" />
            Responsive from the start
          </span>
        </div>

        <div className="agency-collaboration-device" aria-label="Designed for desktop and mobile">
          <LuMonitorSmartphone aria-hidden="true" />
          <span>
            <small>DESKTOP + MOBILE</small>
            <strong>One clear experience</strong>
          </span>
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
